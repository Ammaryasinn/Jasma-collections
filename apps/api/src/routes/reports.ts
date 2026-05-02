import { Router, Request, Response, NextFunction } from "express";
import { prisma, Role } from "@jazma/db";
import { sendSuccess, sendError } from "../utils/response";
import { authenticate } from "../middleware/authenticate";
import { authorize } from "../middleware/authorize";

export const reportsRouter = Router();

// ─── GET /api/reports/dashboard ──────────────────────────────────────────────
reportsRouter.get(
  "/dashboard",
  authenticate,
  authorize(Role.SUPER_ADMIN, Role.MANAGER),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      // 1. Today's Sales (POS Sales today)
      const todaysSales = await prisma.sale.aggregate({
        where: { soldAt: { gte: today } },
        _sum: { quantity: true, unitPrice: true },
      });
      // Prisma aggregate sum on multiple fields doesn't do (qty * price). 
      // We must fetch and calculate, or we assume a simple sum if we want, but let's fetch to be accurate.
      const rawTodaysSales = await prisma.sale.findMany({
        where: { soldAt: { gte: today } },
        select: { quantity: true, unitPrice: true }
      });
      const todaysRevenue = rawTodaysSales.reduce((acc, sale) => acc + (sale.quantity * Number(sale.unitPrice)), 0);

      // 2. Total Revenue (All time POS Sales + Completed Orders)
      // For now, just POS sales
      const rawAllSales = await prisma.sale.findMany({
        select: { quantity: true, unitPrice: true }
      });
      const totalRevenue = rawAllSales.reduce((acc, sale) => acc + (sale.quantity * Number(sale.unitPrice)), 0);

      // 3. Low Stock Count
      // We can't do a direct count where quantity <= lowStockThreshold in Prisma easily without a raw query
      // Let's just fetch them and filter
      const inventory = await prisma.inventory.findMany({
        select: { quantity: true, lowStockThreshold: true }
      });
      const lowStockCount = inventory.filter(i => i.quantity <= i.lowStockThreshold).length;

      // 4. Pending Orders
      const pendingOrders = await prisma.order.count({
        where: { status: "PENDING" }
      });

      return sendSuccess(res, {
        kpis: {
          todaysRevenue,
          totalRevenue,
          lowStockCount,
          pendingOrders
        }
      });
    } catch (err) {
      next(err);
    }
  }
);

// ─── GET /api/reports/top-sellers ────────────────────────────────────────────
reportsRouter.get(
  "/top-sellers",
  authenticate,
  authorize(Role.SUPER_ADMIN, Role.MANAGER),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      // Group sales by variantId
      const topSales = await prisma.sale.groupBy({
        by: ['variantId'],
        _sum: {
          quantity: true,
        },
        orderBy: {
          _sum: {
            quantity: 'desc'
          }
        },
        take: 10
      });

      // Fetch variant details for these top sellers
      const variantIds = topSales.map(s => s.variantId);
      const variants = await prisma.productVariant.findMany({
        where: { id: { in: variantIds } },
        include: { product: true }
      });

      const formatted = topSales.map(s => {
        const variant = variants.find(v => v.id === s.variantId);
        return {
          variantId: s.variantId,
          productName: variant?.product.name,
          variantDetails: `${variant?.size} - ${variant?.color}`,
          totalSold: s._sum.quantity,
          price: variant?.price
        };
      });

      return sendSuccess(res, { topSellers: formatted });
    } catch (err) {
      next(err);
    }
  }
);
