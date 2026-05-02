// apps/api/src/utils/jwt.ts

import jwt from "jsonwebtoken";
import { Role } from "@jasma/db";

export interface JwtPayload {
  userId: string;
  email: string;
  role: Role;
  shopId: string | null;
}

const SECRET = process.env.JWT_SECRET ?? "change-me-in-production";
const EXPIRES_IN = process.env.JWT_EXPIRES_IN ?? "7d";

export function signToken(payload: JwtPayload): string {
  return jwt.sign(payload, SECRET, { expiresIn: EXPIRES_IN } as jwt.SignOptions);
}

export function verifyToken(token: string): JwtPayload {
  return jwt.verify(token, SECRET) as JwtPayload;
}
