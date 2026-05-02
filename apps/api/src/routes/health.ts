// apps/api/src/routes/health.ts

import { Router } from "express";
import { sendSuccess } from "../utils/response";

export const healthRouter = Router();

healthRouter.get("/", (_req, res) => {
  sendSuccess(res, {
    status: "healthy",
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV ?? "development",
    version: "0.0.1",
  });
});
