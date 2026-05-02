// apps/api/src/index.ts â€” Express app entry point

import "dotenv/config";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";

import { healthRouter } from "./routes/health";
import { authRouter } from "./routes/auth";
import { errorHandler } from "./middleware/errorHandler";

import { uploadRouter } from "./routes/upload";
import { categoriesRouter } from "./routes/categories";
import { productsRouter } from "./routes/products";
import { variantsRouter } from "./routes/variants";
import { inventoryRouter } from "./routes/inventory";
import { reportsRouter } from "./routes/reports";
import { salesRouter } from "./routes/sales";
import { publicRouter } from "./routes/public";
import { mpesaRouter } from "./routes/mpesa";

const app = express();
const PORT = process.env.PORT ?? 4000;

// ─────────────────────────────────────────────────────────────────────────────
app.use(helmet());
app.use(
  cors({
    origin: process.env.ALLOWED_ORIGINS?.split(",") ?? ["http://localhost:3000"],
    credentials: true,
  })
);
app.use(morgan(process.env.NODE_ENV === "production" ? "combined" : "dev"));
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));

// ─────────────────────────────────────────────────────────────────────────────
app.use("/api/health", healthRouter);
app.use("/api/auth", authRouter);
app.use("/api/upload", uploadRouter);
app.use("/api/categories", categoriesRouter);
app.use("/api/products", productsRouter);
app.use("/api/variants", variantsRouter);
app.use("/api/inventory", inventoryRouter);
app.use("/api/reports", reportsRouter);
app.use("/api/sales", salesRouter);
app.use("/api/public", publicRouter);
app.use("/api/mpesa", mpesaRouter);

// 404 handler
app.use((_req, res) => {
  res.status(404).json({
    success: false,
    error: "Route not found",
    data: null,
  });
});

// Global error handler (must be last)
app.use(errorHandler);

// â”€â”€â”€ Start â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
app.listen(PORT, () => {
  console.log(`\nðŸš€ Jasma API running at http://localhost:${PORT}`);
  console.log(`   Environment: ${process.env.NODE_ENV ?? "development"}`);
  console.log(`   Health:      http://localhost:${PORT}/api/health\n`);
});

export default app;
