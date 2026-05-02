// apps/api/src/middleware/errorHandler.ts
// Global Express error handler

import { Request, Response, NextFunction } from "express";

export interface AppError extends Error {
  statusCode?: number;
  isOperational?: boolean;
}

export function errorHandler(
  err: AppError,
  _req: Request,
  res: Response,
  _next: NextFunction
) {
  const statusCode = err.statusCode ?? 500;
  const message =
    process.env.NODE_ENV === "production" && statusCode === 500
      ? "Internal server error"
      : err.message ?? "Something went wrong";

  if (statusCode === 500) {
    console.error("💥 Unhandled error:", err);
  }

  res.status(statusCode).json({
    success: false,
    data: null,
    error: message,
    ...(process.env.NODE_ENV === "development" ? { stack: err.stack } : {}),
  });
}

// Helper to create operational errors
export class ApiError extends Error implements AppError {
  statusCode: number;
  isOperational = true;

  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
    Object.setPrototypeOf(this, ApiError.prototype);
  }
}
