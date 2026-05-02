import { Router, Request, Response, NextFunction } from "express";
import { prisma } from "@jazma/db";
import { sendSuccess } from "../utils/response";

export const publicRouter = Router();

// ─── GET /api/public/categories ─────────────────────────────────────────────
publicRouter.get(
  "/categories",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const categories = await prisma.category.findMany({
        orderBy: { name: "asc" }
      });
      return sendSuccess(res, { categories });
    } catch (err) {
      next(err);
    }
  }
);

// ─── GET /api/public/products ────────────────────────────────────────────────
publicRouter.get(
  "/products",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { category, gender } = req.query;

      const whereClause: any = { isActive: true };

      if (category) {
        whereClause.category = { name: { equals: String(category), mode: "insensitive" } };
      }

      if (gender) {
        whereClause.gender = gender;
      }

      const products = await prisma.product.findMany({
        where: whereClause,
        include: {
          category: true,
          variants: {
            include: {
              inventory: {
                where: { shopId: null }
              }
            }
          }
        },
        orderBy: { createdAt: "desc" }
      });

      return sendSuccess(res, { products });
    } catch (err) {
      next(err);
    }
  }
);

// ─── GET /api/public/products/:id ───────────────────────────────────────────
publicRouter.get(
  "/products/:id",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const product = await prisma.product.findUnique({
        where: { id: req.params.id },
        include: {
          category: true,
          variants: {
            include: {
              inventory: {
                where: { shopId: null }
              }
            }
          }
        }
      });

      if (!product) {
        return res.status(404).json({ success: false, message: "Product not found" });
      }

      return sendSuccess(res, { product });
    } catch (err) {
      next(err);
    }
  }
);
