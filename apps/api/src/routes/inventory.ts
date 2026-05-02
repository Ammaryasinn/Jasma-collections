// apps/api/src/routes/inventory.ts
import { Router, Request, Response, NextFunction } from "express";
import { z } from "zod";
import { prisma, Role, MovementType } from "@jazma/db";
import { sendSuccess, sendError } from "../utils/response";
import { authenticate } from "../middleware/authenticate";
import { authorize } from "../middleware/authorize";

export const inventoryRouter = Router();

// ─── GET /api/inventory ──────────────────────────────────────────────────────
inventoryRouter.get(
  "/",
  authenticate,
  authorize(Role.SUPER_ADMIN, Role.MANAGER),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const inventory = await prisma.inventory.findMany({
        include: {
          variant: {
            include: {
              product: {
                select: { name: true, gender: true, category: true },
              },
            },
          },
          shop: true,
        },
        orderBy: {
          variant: {
            product: { name: "asc" },
          },
        },
      });

      return sendSuccess(res, { inventory });
    } catch (err) {
      next(err);
    }
  }
);

// ─── POST /api/inventory/stock-in ───────────────────────────────────────────
const stockInSchema = z.object({
  variantId: z.string().min(1),
  shopId: z.string().min(1), // Allow null for online? Prisma accepts null if we handle it
  quantity: z.number().int().positive(),
  reference: z.string().optional(), // Make reference optional as requested
  note: z.string().optional(),
});

inventoryRouter.post(
  "/stock-in",
  authenticate,
  authorize(Role.SUPER_ADMIN, Role.MANAGER),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const parsed = stockInSchema.safeParse(req.body);
      if (!parsed.success) {
        return sendError(res, "Validation failed", 422, parsed.error.flatten());
      }

      const { variantId, shopId, quantity, reference, note } = parsed.data;

      // Use a transaction to update inventory and create movement log
      const result = await prisma.$transaction(async (tx) => {
        // 1. Upsert inventory record
        const inventory = await tx.inventory.upsert({
          where: {
            variantId_shopId: {
              variantId,
              shopId,
            },
          },
          update: {
            quantity: { increment: quantity },
          },
          create: {
            variantId,
            shopId,
            quantity,
          },
        });

        // 2. Create stock movement log
        const movement = await tx.stockMovement.create({
          data: {
            variantId,
            shopId,
            movementType: MovementType.IN,
            quantity, // Positive for IN
            reference,
            note: note || "Stock-in (Manual)",
          },
        });

        return { inventory, movement };
      });

      return sendSuccess(res, result, 201);
    } catch (err) {
      next(err);
    }
  }
);

// ─── POST /api/inventory/transfer ───────────────────────────────────────────
const transferSchema = z.object({
  variantId: z.string().min(1),
  fromShopId: z.string().min(1),
  toShopId: z.string().min(1),
  quantity: z.number().int().positive(),
  note: z.string().optional(),
});

inventoryRouter.post(
  "/transfer",
  authenticate,
  authorize(Role.SUPER_ADMIN, Role.MANAGER),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const parsed = transferSchema.safeParse(req.body);
      if (!parsed.success) {
        return sendError(res, "Validation failed", 422, parsed.error.flatten());
      }

      const { variantId, fromShopId, toShopId, quantity, note } = parsed.data;

      if (fromShopId === toShopId) {
        return sendError(res, "Source and destination shops must be different", 400);
      }

      const result = await prisma.$transaction(async (tx) => {
        // 1. Check source inventory
        const sourceInventory = await tx.inventory.findUnique({
          where: { variantId_shopId: { variantId, shopId: fromShopId } },
        });

        if (!sourceInventory || sourceInventory.quantity < quantity) {
          throw new Error("Insufficient stock in source shop for transfer");
        }

        // 2. Decrement source
        await tx.inventory.update({
          where: { variantId_shopId: { variantId, shopId: fromShopId } },
          data: { quantity: { decrement: quantity } },
        });

        // 3. Upsert destination
        await tx.inventory.upsert({
          where: { variantId_shopId: { variantId, shopId: toShopId } },
          update: { quantity: { increment: quantity } },
          create: { variantId, shopId: toShopId, quantity },
        });

        // 4. Create OUT movement for source
        await tx.stockMovement.create({
          data: {
            variantId,
            shopId: fromShopId,
            movementType: MovementType.TRANSFER,
            quantity: -quantity,
            note: note || `Transferred to ${toShopId}`,
          },
        });

        // 5. Create IN movement for destination
        await tx.stockMovement.create({
          data: {
            variantId,
            shopId: toShopId,
            movementType: MovementType.TRANSFER,
            quantity: quantity,
            note: note || `Transferred from ${fromShopId}`,
          },
        });

        return { success: true };
      });

      return sendSuccess(res, { message: "Transfer successful" });
    } catch (err: any) {
      if (err.message === "Insufficient stock in source shop for transfer") {
        return sendError(res, err.message, 400);
      }
      next(err);
    }
  }
);

// ─── POST /api/inventory/adjust ─────────────────────────────────────────────
const adjustSchema = z.object({
  variantId: z.string().min(1),
  shopId: z.string().min(1),
  adjustment: z.number().int(), // can be negative or positive
  note: z.string().min(1, "A reason must be provided for adjustments"),
});

inventoryRouter.post(
  "/adjust",
  authenticate,
  authorize(Role.SUPER_ADMIN, Role.MANAGER),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const parsed = adjustSchema.safeParse(req.body);
      if (!parsed.success) {
        return sendError(res, "Validation failed", 422, parsed.error.flatten());
      }

      const { variantId, shopId, adjustment, note } = parsed.data;

      if (adjustment === 0) {
        return sendError(res, "Adjustment quantity cannot be zero", 400);
      }

      const result = await prisma.$transaction(async (tx) => {
        const currentInventory = await tx.inventory.findUnique({
          where: { variantId_shopId: { variantId, shopId } },
        });

        if (!currentInventory && adjustment < 0) {
          throw new Error("Cannot negatively adjust stock that does not exist");
        }

        if (currentInventory && currentInventory.quantity + adjustment < 0) {
          throw new Error("Adjustment would result in negative stock");
        }

        const inventory = await tx.inventory.upsert({
          where: { variantId_shopId: { variantId, shopId } },
          update: { quantity: { increment: adjustment } },
          create: { variantId, shopId, quantity: adjustment },
        });

        const movement = await tx.stockMovement.create({
          data: {
            variantId,
            shopId,
            movementType: MovementType.ADJUSTMENT,
            quantity: adjustment,
            note: `Adjustment: ${note}`,
          },
        });

        return { inventory, movement };
      });

      return sendSuccess(res, result);
    } catch (err: any) {
      if (err.message.includes("negative stock") || err.message.includes("does not exist")) {
        return sendError(res, err.message, 400);
      }
      next(err);
    }
  }
);
