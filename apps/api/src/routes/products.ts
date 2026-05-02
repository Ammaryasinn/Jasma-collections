// apps/api/src/routes/products.ts
// Products CRUD operations

import { Router, Request, Response, NextFunction } from "express";
import { z } from "zod";
import { prisma, Role, Gender } from "@jazma/db";
import { sendSuccess, sendError } from "../utils/response";
import { authenticate } from "../middleware/authenticate";
import { authorize } from "../middleware/authorize";

export const productsRouter = Router();

// ─── GET /api/products ────────────────────────────────────────────────────────

productsRouter.get("/", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const search = req.query.search as string | undefined;
    const categoryId = req.query.category as string | undefined;

    const products = await prisma.product.findMany({
      where: {
        isActive: true,
        ...(search ? { name: { contains: search, mode: "insensitive" } } : {}),
        ...(categoryId ? { categoryId } : {}),
      },
      include: {
        category: true,
        variants: {
          include: {
            inventory: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return sendSuccess(res, { products });
  } catch (err) {
    next(err);
  }
});

// ─── GET /api/products/:id ────────────────────────────────────────────────────

productsRouter.get("/:id", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const product = await prisma.product.findUnique({
      where: { id: req.params.id },
      include: {
        category: true,
        variants: {
          include: {
            inventory: { include: { shop: true } },
          },
          orderBy: { size: "asc" },
        },
      },
    });

    if (!product) return sendError(res, "Product not found", 404);

    return sendSuccess(res, { product });
  } catch (err) {
    next(err);
  }
});

// ─── POST /api/products ───────────────────────────────────────────────────────

const productSchema = z.object({
  name: z.string().min(2, "Name required"),
  description: z.string().optional(),
  categoryId: z.string().min(1, "Category required"),
  gender: z.nativeEnum(Gender),
  images: z.array(z.string().url()).optional().default([]),
});

productsRouter.post(
  "/",
  authenticate,
  authorize(Role.SUPER_ADMIN, Role.MANAGER),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const parsed = productSchema.safeParse(req.body);
      if (!parsed.success) {
        return sendError(res, "Validation failed", 422, parsed.error.flatten());
      }

      // Generate a simple slug
      const slug = parsed.data.name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "");

      // Ensure slug uniqueness (simple implementation)
      const existing = await prisma.product.findUnique({ where: { slug } });
      const finalSlug = existing ? `${slug}-${Date.now()}` : slug;

      const product = await prisma.product.create({
        data: {
          ...parsed.data,
          slug: finalSlug,
        },
        include: { category: true },
      });

      return sendSuccess(res, { product }, 201);
    } catch (err) {
      next(err);
    }
  }
);

// ─── PUT /api/products/:id ────────────────────────────────────────────────────

productsRouter.put(
  "/:id",
  authenticate,
  authorize(Role.SUPER_ADMIN, Role.MANAGER),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const parsed = productSchema.safeParse(req.body);
      if (!parsed.success) {
        return sendError(res, "Validation failed", 422, parsed.error.flatten());
      }

      const product = await prisma.product.update({
        where: { id: req.params.id },
        data: parsed.data,
        include: { category: true },
      });

      return sendSuccess(res, { product });
    } catch (err) {
      next(err);
    }
  }
);

// ─── DELETE /api/products/:id ─────────────────────────────────────────────────

productsRouter.delete(
  "/:id",
  authenticate,
  authorize(Role.SUPER_ADMIN),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      await prisma.product.update({
        where: { id: req.params.id },
        data: { isActive: false },
      });

      return sendSuccess(res, { message: "Product deactivated successfully" });
    } catch (err) {
      next(err);
    }
  }
);
