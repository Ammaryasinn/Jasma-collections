// apps/api/src/utils/response.ts
// Standard API response helpers

import { Response } from "express";

export function sendSuccess<T>(res: Response, data: T, statusCode = 200) {
  return res.status(statusCode).json({
    success: true,
    data,
    error: null,
  });
}

export function sendError(
  res: Response,
  error: string,
  statusCode = 400,
  details?: unknown
) {
  return res.status(statusCode).json({
    success: false,
    data: null,
    error,
    ...(details ? { details } : {}),
  });
}
