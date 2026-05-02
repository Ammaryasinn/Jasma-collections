import { Router, Request, Response, NextFunction } from "express";
import { z } from "zod";
import { prisma, Role, PaymentMethod, MovementType } from "@jazma/db";
import { sendSuccess, sendError } from "../utils/response";
import { authenticate } from "../middleware/authenticate";
import { authorize } from "../middleware/authorize";

export const salesRouter = Router();

// ─── POST /api/sales/checkout ────────────────────────────────────────────────
const checkoutSchema = z.object({
  items: z.array(
    z.object({
      variantId: z.string().min(1),
      quantity: z.number().int().positive(),
    })
  ).min(1),
  paymentMethod: z.enum(["CASH", "CARD", "MPESA"]),
  mpesaRef: z.string().optional(),
});

salesRouter.post(
  "/checkout",
  authenticate,
  authorize(Role.SUPER_ADMIN, Role.MANAGER, Role.STAFF),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const parsed = checkoutSchema.safeParse(req.body);
      if (!parsed.success) {
        return sendError(res, "Validation failed", 422, parsed.error.flatten());
      }

      const { items, paymentMethod, mpesaRef } = parsed.data;
      const user = req.user!;
      
      // Staff MUST belong to a shop to make a POS sale
      if (!user.shopId) {
        return sendError(res, "User is not assigned to a shop. Cannot process POS sale.", 403);
      }

      // We need to fetch the variants to get their prices and check inventory
      const variantIds = items.map(item => item.variantId);
      const variants = await prisma.productVariant.findMany({
        where: { id: { in: variantIds } },
        include: {
          inventory: {
            where: { shopId: user.shopId }
          }
        }
      });

      if (variants.length !== items.length) {
        return sendError(res, "One or more variants not found", 404);
      }

      // Transaction to process everything atomically
      const result = await prisma.$transaction(async (tx) => {
        const createdSales = [];
        
        for (const item of items) {
          const variant = variants.find(v => v.id === item.variantId)!;
          const shopInventory = variant.inventory[0];

          // 1. Verify stock
          if (!shopInventory || shopInventory.quantity < item.quantity) {
            throw new Error(`Insufficient stock for variant ${variant.barcode}`);
          }

          // 2. Decrement stock
          await tx.inventory.update({
            where: { id: shopInventory.id },
            data: { quantity: { decrement: item.quantity } }
          });

          // 3. Create Sale record
          const sale = await tx.sale.create({
            data: {
              variantId: variant.id,
              shopId: user.shopId!,
              staffId: user.id,
              quantity: item.quantity,
              unitPrice: variant.price,
              paymentMethod: paymentMethod as PaymentMethod,
              mpesaRef,
            }
          });
          createdSales.push(sale);

          // 4. Create StockMovement (OUT) log
          await tx.stockMovement.create({
            data: {
              variantId: variant.id,
              shopId: user.shopId!,
              movementType: MovementType.OUT,
              quantity: -item.quantity,
              reference: sale.id,
              note: `POS Sale (${paymentMethod})`,
            }
          });
        }

        return createdSales;
      });

      return sendSuccess(res, { sales: result }, 201);
    } catch (err: any) {
      if (err.message.startsWith("Insufficient stock")) {
        return sendError(res, err.message, 400);
      }
      next(err);
    }
  }
);
