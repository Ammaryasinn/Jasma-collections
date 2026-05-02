import { Router, Request, Response, NextFunction } from "express";
import { z } from "zod";
import { prisma } from "@jazma/db";
import { sendSuccess, sendError } from "../utils/response";
import axios from "axios";

export const mpesaRouter = Router();

// Environment variables
const CONSUMER_KEY = process.env.MPESA_CONSUMER_KEY || "sandbox_key";
const CONSUMER_SECRET = process.env.MPESA_CONSUMER_SECRET || "sandbox_secret";
const PASSKEY = process.env.MPESA_PASSKEY || "sandbox_passkey";
const SHORTCODE = process.env.MPESA_SHORTCODE || "174379";
const CALLBACK_URL = process.env.MPESA_CALLBACK_URL || "https://your-ngrok-url.com/api/mpesa/callback";
const BASE_URL = "https://sandbox.safaricom.co.ke";

// Helper: Get Daraja Access Token
async function getAccessToken() {
  // If sandbox default credentials, skip actual request
  if (CONSUMER_KEY === "sandbox_key") return "mock_token";

  const auth = Buffer.from(`${CONSUMER_KEY}:${CONSUMER_SECRET}`).toString("base64");
  try {
    const response = await axios.get(`${BASE_URL}/oauth/v1/generate?grant_type=client_credentials`, {
      headers: { Authorization: `Basic ${auth}` },
    });
    return response.data.access_token;
  } catch (err: any) {
    console.error("Daraja Auth Error:", err.response?.data || err.message);
    throw new Error("Failed to authenticate with M-Pesa");
  }
}

// Helper: Format phone number to 254...
function formatPhoneNumber(phone: string) {
  let cleaned = phone.replace(/\D/g, "");
  if (cleaned.startsWith("0")) cleaned = "254" + cleaned.substring(1);
  if (cleaned.startsWith("254")) return cleaned;
  return "254" + cleaned; // Assume local without 0
}

// ─── POST /api/mpesa/checkout ───────────────────────────────────────────────
const checkoutSchema = z.object({
  customerName: z.string().min(2),
  customerPhone: z.string().min(9),
  customerEmail: z.string().email().optional(),
  shippingAddress: z.string().min(5),
  items: z.array(
    z.object({
      variantId: z.string(),
      quantity: z.number().positive(),
    })
  ).min(1),
});

mpesaRouter.post(
  "/checkout",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const parsed = checkoutSchema.safeParse(req.body);
      if (!parsed.success) {
        return sendError(res, "Validation failed", 422, parsed.error.flatten());
      }

      const { customerName, customerPhone, customerEmail, shippingAddress, items } = parsed.data;

      // 1. Calculate total and verify stock
      let totalAmount = 0;
      const variantIds = items.map((i) => i.variantId);
      const variants = await prisma.productVariant.findMany({
        where: { id: { in: variantIds } },
        include: { inventory: { where: { shopId: null } } }, // Online stock
      });

      if (variants.length !== items.length) {
        return sendError(res, "One or more items not found", 404);
      }

      for (const item of items) {
        const variant = variants.find((v) => v.id === item.variantId)!;
        const onlineStock = variant.inventory[0];
        
        if (!onlineStock || onlineStock.quantity < item.quantity) {
          return sendError(res, `Insufficient online stock for variant ${variant.barcode}`, 400);
        }
        totalAmount += Number(variant.price) * item.quantity;
      }

      // 2. Create the PENDING Order
      const order = await prisma.order.create({
        data: {
          customerName,
          customerPhone,
          customerEmail,
          shippingAddress,
          totalAmount,
          status: "PENDING",
          items: {
            create: items.map(item => {
              const variant = variants.find((v) => v.id === item.variantId)!;
              return {
                variantId: item.variantId,
                quantity: item.quantity,
                unitPrice: variant.price,
              };
            })
          }
        }
      });

      // 3. Trigger STK Push
      const phone = formatPhoneNumber(customerPhone);
      const timestamp = new Date().toISOString().replace(/[^0-9]/g, "").slice(0, 14);
      const password = Buffer.from(`${SHORTCODE}${PASSKEY}${timestamp}`).toString("base64");

      if (CONSUMER_KEY !== "sandbox_key") {
        const token = await getAccessToken();
        await axios.post(
          `${BASE_URL}/mpesa/stkpush/v1/processrequest`,
          {
            BusinessShortCode: SHORTCODE,
            Password: password,
            Timestamp: timestamp,
            TransactionType: "CustomerPayBillOnline",
            Amount: Math.ceil(totalAmount),
            PartyA: phone,
            PartyB: SHORTCODE,
            PhoneNumber: phone,
            CallBackURL: CALLBACK_URL,
            AccountReference: `JASMA-${order.id.slice(-5)}`,
            TransactionDesc: "Jasma Collections Order",
          },
          { headers: { Authorization: `Bearer ${token}` } }
        );
      } else {
        console.log(`[MOCK] STK Push sent to ${phone} for KES ${totalAmount}`);
        // In mock mode, we'll auto-trigger the callback after 10 seconds for testing
        setTimeout(async () => {
          try {
            await axios.post("http://localhost:4000/api/mpesa/callback", {
              Body: {
                stkCallback: {
                  ResultCode: 0,
                  ResultDesc: "The service request is processed successfully.",
                  CallbackMetadata: {
                    Item: [
                      { Name: "Amount", Value: totalAmount },
                      { Name: "MpesaReceiptNumber", Value: "MOCK" + Math.floor(Math.random() * 10000000) },
                      { Name: "PhoneNumber", Value: phone }
                    ]
                  }
                }
              },
              orderId: order.id // Custom payload addition for mock tracking
            });
          } catch (e) {
            // Ignore mock callback errors
          }
        }, 10000);
      }

      return sendSuccess(res, { 
        message: "STK Push initiated successfully",
        orderId: order.id 
      });

    } catch (err) {
      next(err);
    }
  }
);

// ─── POST /api/mpesa/callback ───────────────────────────────────────────────
mpesaRouter.post(
  "/callback",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const callbackData = req.body.Body?.stkCallback;
      if (!callbackData) return res.status(400).send("Invalid callback payload");

      const { ResultCode, ResultDesc, CallbackMetadata } = callbackData;
      
      // In production, you'd match the MerchantRequestID to the order.
      // For this mock/sandbox, we appended `orderId` to the mock request payload.
      const orderId = req.body.orderId; // Mock only

      if (ResultCode === 0) {
        // Success
        const metadata = CallbackMetadata.Item;
        const mpesaRef = metadata.find((i: any) => i.Name === "MpesaReceiptNumber")?.Value;

        if (orderId) {
          // Process fulfillment
          await prisma.$transaction(async (tx) => {
            const order = await tx.order.update({
              where: { id: orderId },
              data: { status: "PAID", mpesaReference: String(mpesaRef) },
              include: { items: true }
            });

            // Decrement online stock
            for (const item of order.items) {
              const inv = await tx.inventory.findFirst({
                where: { variantId: item.variantId, shopId: null }
              });
              if (inv) {
                await tx.inventory.update({
                  where: { id: inv.id },
                  data: { quantity: { decrement: item.quantity } }
                });
                // Log movement
                await tx.stockMovement.create({
                  data: {
                    variantId: item.variantId,
                    shopId: null,
                    movementType: "OUT",
                    quantity: -item.quantity,
                    reference: order.id,
                    note: `Online Order PAID (${mpesaRef})`
                  }
                });
              }
            }
          });
          console.log(`[CALLBACK] Order ${orderId} successfully PAID.`);
        }
      } else {
        // Failed / Cancelled by user
        console.log(`[CALLBACK] Payment failed: ${ResultDesc}`);
        if (orderId) {
          await prisma.order.update({
            where: { id: orderId },
            data: { status: "CANCELLED" }
          });
        }
      }

      // Always return 200 to Safaricom
      res.status(200).json({ ResultCode: 0, ResultDesc: "Success" });
    } catch (err) {
      console.error("[CALLBACK ERROR]", err);
      res.status(500).send("Internal Server Error");
    }
  }
);
