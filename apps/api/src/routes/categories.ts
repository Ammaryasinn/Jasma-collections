// apps/api/src/routes/categories.ts

import { Router, Request, Response, NextFunction } from "express";
import { prisma } from "@jazma/db";
import { sendSuccess } from "../utils/response";

export const categoriesRouter = Router();

categoriesRouter.get("/", async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const categories = await prisma.category.findMany({
      orderBy: { name: "asc" },
    });
    return sendSuccess(res, { categories });
  } catch (err) {
    next(err);
  }
});
