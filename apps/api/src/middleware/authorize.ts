// apps/api/src/middleware/authorize.ts
// Role-based access control middleware factory

import { Request, Response, NextFunction } from "express";
import { Role } from "@jasma/db";
import { sendError } from "../utils/response";

/**
 * Usage: router.get('/admin', authenticate, authorize('SUPER_ADMIN', 'MANAGER'), handler)
 */
export function authorize(...allowedRoles: Role[]) {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return sendError(res, "Authentication required", 401);
    }

    if (!allowedRoles.includes(req.user.role)) {
      return sendError(
        res,
        `Access denied. Required role: ${allowedRoles.join(" or ")}`,
        403
      );
    }

    next();
  };
}
