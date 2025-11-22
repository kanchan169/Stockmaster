import express from "express";
import prisma from "../config/prisma.js";

const router = express.Router();

router.get("/summary", async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Midnight

    // ----------------------
    // TOTAL STOCK
    // ----------------------
    const totalStockAgg = await prisma.stock.aggregate({
      _sum: { quantity: true },
    });
    const totalStock = totalStockAgg._sum.quantity || 0;

    // ----------------------
    // LOW / OUT OF STOCK
    // ----------------------
    const lowStockCount = await prisma.stock.count({
      where: { quantity: { lt: 10 } },
    });

    // ----------------------
    // PENDING RECEIPTS & DELIVERIES
    // (Assuming status field is not implemented, so count all)
    // ----------------------
    const pendingReceipts = await prisma.receipt.count();
    const pendingDeliveries = await prisma.delivery.count();

    // ----------------------
    // FILL RATE
    // ----------------------
    const totalOrderedAgg = await prisma.delivery.aggregate({
      _sum: { quantity: true },
    });
    const totalShippedAgg = await prisma.delivery.aggregate({
      _sum: { quantity: true }, // Assuming all deliveries are shipped
    });
    const fillRate =
      totalOrderedAgg._sum.quantity > 0
        ? (totalShippedAgg._sum.quantity / totalOrderedAgg._sum.quantity) * 100
        : 0;

    // ----------------------
    // STOCK ACCURACY
    // ----------------------
    const adjustmentsTodayAgg = await prisma.adjustment.aggregate({
      _sum: { oldQty: true },
      where: { createdAt: { gte: today } },
    });
    const stockAccuracy =
      totalStock > 0
        ? ((totalStock - (adjustmentsTodayAgg._sum.oldQty || 0)) / totalStock) * 100
        : 0;

    // ----------------------
    // DAMAGED TODAY (oldQty > newQty)
    // ----------------------
    const damagedTodayAgg = await prisma.adjustment.aggregate({
      _sum: { oldQty: true },
      where: { createdAt: { gte: today }, oldQty: { gt: prisma.adjustment.fields.newQty } },
    });
    const damagedToday = damagedTodayAgg._sum.oldQty || 0;

    // ----------------------
    // ADJUSTMENTS TODAY
    // ----------------------
    const adjustmentsToday = adjustmentsTodayAgg._sum.oldQty || 0;

    // ----------------------
    // RECENT OPERATIONS (last 5)
    // ----------------------
    const recentReceipts = await prisma.receipt.findMany({
      take: 5,
      orderBy: { createdAt: "desc" },
      include: { product: true },
    });

    const recentDeliveries = await prisma.delivery.findMany({
      take: 5,
      orderBy: { createdAt: "desc" },
      include: { product: true },
    });

    const recentAdjustments = await prisma.adjustment.findMany({
      take: 5,
      orderBy: { createdAt: "desc" },
      include: { product: true },
    });

    res.json({
      totalStock,
      lowStockCount,
      pendingReceipts,
      pendingDeliveries,
      fillRate: Number(fillRate.toFixed(2)),
      stockAccuracy: Number(stockAccuracy.toFixed(2)),
      damagedToday,
      adjustmentsToday,
      recentOperations: {
        receipts: recentReceipts,
        deliveries: recentDeliveries,
        adjustments: recentAdjustments,
      },
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
