// apps/api/src/routes/auth.ts
// POST /api/auth/login
// POST /api/auth/register  (SUPER_ADMIN only)
// GET  /api/auth/me

import { Router, Request, Response, NextFunction } from "express";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { prisma, Role } from "@jasma/db";
import { signToken } from "../utils/jwt";
import { sendSuccess, sendError } from "../utils/response";
import { authenticate } from "../middleware/authenticate";
import { authorize } from "../middleware/authorize";
import { ApiError } from "../middleware/errorHandler";

export const authRouter = Router();

// â”€â”€â”€ Validation schemas â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

const registerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  role: z.nativeEnum(Role).default(Role.STAFF),
  shopId: z.string().optional().nullable(),
});

// â”€â”€â”€ POST /api/auth/login â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

authRouter.post("/login", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const parsed = loginSchema.safeParse(req.body);
    if (!parsed.success) {
      return sendError(res, "Validation failed", 422, parsed.error.flatten());
    }

    const { email, password } = parsed.data;

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return sendError(res, "Invalid email or password", 401);
    }

    const isValidPassword = await bcrypt.compare(password, user.passwordHash);
    if (!isValidPassword) {
      return sendError(res, "Invalid email or password", 401);
    }

    const token = signToken({
      userId: user.id,
      email: user.email,
      role: user.role,
      shopId: user.shopId,
    });

    return sendSuccess(res, {
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        shopId: user.shopId,
      },
    });
  } catch (err) {
    next(err);
  }
});

// â”€â”€â”€ POST /api/auth/register (SUPER_ADMIN only) â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

authRouter.post(
  "/register",
  authenticate,
  authorize(Role.SUPER_ADMIN),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const parsed = registerSchema.safeParse(req.body);
      if (!parsed.success) {
        return sendError(res, "Validation failed", 422, parsed.error.flatten());
      }

      const { name, email, password, role, shopId } = parsed.data;

      const existing = await prisma.user.findUnique({ where: { email } });
      if (existing) {
        return sendError(res, "A user with this email already exists", 409);
      }

      // Validate shopId if provided
      if (shopId) {
        const shop = await prisma.shop.findUnique({ where: { id: shopId } });
        if (!shop) {
          throw new ApiError("Shop not found", 404);
        }
      }

      const passwordHash = await bcrypt.hash(password, 12);

      const user = await prisma.user.create({
        data: { name, email, passwordHash, role, shopId: shopId ?? null },
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          shopId: true,
          createdAt: true,
        },
      });

      return sendSuccess(res, { user }, 201);
    } catch (err) {
      next(err);
    }
  }
);

// â”€â”€â”€ GET /api/auth/me â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

authRouter.get("/me", authenticate, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user!.userId },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        shopId: true,
        createdAt: true,
        shop: {
          select: { id: true, name: true, location: true },
        },
      },
    });

    if (!user) {
      return sendError(res, "User not found", 404);
    }

    return sendSuccess(res, { user });
  } catch (err) {
    next(err);
  }
});
