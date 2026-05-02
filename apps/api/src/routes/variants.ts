// apps/api/src/routes/variants.ts
// Product Variants CRUD

import { Router, Request, Response, NextFunction } from "express";
import { z } from "zod";
import { prisma, Role } from "@jazma/db";
import { sendSuccess, sendError } from "../utils/response";
import { authenticate } from "../middleware/authenticate";
import { authorize } from "../middleware/authorize";

export const variantsRouter = Router();

// Helper to generate Jasma barcode
function generateBarcode(categoryCode: string, variantId: string): string {
  const random4 = Math.floor(1000 + Math.random() * 9000).toString();
  const shortId = variantId.slice(-5).toUpperCase();
  return `JSM-${categoryCode}-${shortId}-${random4}`;
}

// ─── GET /api/variants/barcode/:barcode ─────────────────────────────────────
variantsRouter.get(
  "/barcode/:barcode",
  authenticate,
  authorize(Role.SUPER_ADMIN, Role.MANAGER, Role.STAFF),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { barcode } = req.params;
      const variant = await prisma.productVariant.findUnique({
        where: { barcode },
        include: {
          product: true,
          inventory: {
            include: { shop: true },
          },
        },
      });

      if (!variant) {
        return sendError(res, "Variant not found", 404);
      }

      return sendSuccess(res, { variant });
    } catch (err) {
      next(err);
    }
  }
);

// ─── POST /api/variants ───────────────────────────────────────────────────────
const variantSchema = z.object({
  productId: z.string().min(1),
  size: z.string().min(1),
  color: z.string().min(1),
  price: z.number().positive(),
});

variantsRouter.post(
  "/",
  authenticate,
  authorize(Role.SUPER_ADMIN, Role.MANAGER),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const parsed = variantSchema.safeParse(req.body);
      if (!parsed.success) {
        return sendError(res, "Validation failed", 422, parsed.error.flatten());
      }

      const { productId, size, color, price } = parsed.data;

      // Check if product exists and get its category
      const product = await prisma.product.findUnique({
        where: { id: productId },
        include: { category: true },
      });

      if (!product) {
        return sendError(res, "Product not found", 404);
      }

      // Check for duplicate variant
      const existingVariant = await prisma.productVariant.findFirst({
        where: { productId, size, color },
      });

      if (existingVariant) {
        return sendError(res, "This size and color combination already exists", 409);
      }

      // Create variant with temp barcode
      const variant = await prisma.productVariant.create({
        data: {
          productId,
          size,
          color,
          price,
          barcode: "TEMP",
        },
      });

      // Generate actual barcode
      const barcode = generateBarcode(product.category.code, variant.id);

      // Update variant with real barcode
      const updatedVariant = await prisma.productVariant.update({
        where: { id: variant.id },
        data: { barcode },
      });

      return sendSuccess(res, { variant: updatedVariant }, 201);
    } catch (err) {
      next(err);
    }
  }
);

// ─── PUT /api/variants/:id ────────────────────────────────────────────────────
const updateVariantSchema = z.object({
  size: z.string().min(1).optional(),
  color: z.string().min(1).optional(),
  price: z.number().positive().optional(),
});

variantsRouter.put(
  "/:id",
  authenticate,
  authorize(Role.SUPER_ADMIN, Role.MANAGER),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const parsed = updateVariantSchema.safeParse(req.body);
      if (!parsed.success) {
        return sendError(res, "Validation failed", 422, parsed.error.flatten());
      }

      const variant = await prisma.productVariant.update({
        where: { id: req.params.id },
        data: parsed.data,
      });

      return sendSuccess(res, { variant });
    } catch (err) {
      next(err);
    }
  }
);

// ─── DELETE /api/variants/:id ─────────────────────────────────────────────────
variantsRouter.delete(
  "/:id",
  authenticate,
  authorize(Role.SUPER_ADMIN, Role.MANAGER),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      // Must check if there is inventory. We should only allow delete if inventory is 0
      const inventory = await prisma.inventory.findMany({
        where: { variantId: req.params.id },
      });

      const totalStock = inventory.reduce((sum, inv) => sum + inv.quantity, 0);

      if (totalStock > 0) {
        return sendError(res, "Cannot delete variant with existing stock. Please adjust inventory to 0 first.", 400);
      }

      await prisma.productVariant.delete({
        where: { id: req.params.id },
      });

      return sendSuccess(res, { message: "Variant deleted successfully" });
    } catch (err) {
      next(err);
    }
  }
);
