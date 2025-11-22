import prisma from "../config/prisma.js";

export const getDashboardSummary = async (req, res) => {
  try {
    // Total products in stock
    const totalStock = await prisma.stock.aggregate({
      _sum: { quantity: true },
    });

    // Low stock (<= 5) and out of stock
    const lowStock = await prisma.stock.count({ where: { quantity: { lte: 5, gt: 0 } } });
    const outOfStock = await prisma.stock.count({ where: { quantity: 0 } });

    // Pending receipts (if you have a "status" field in receipts)
    const pendingReceipts = await prisma.receipt.count({ where: { status: "WAITING" } });

    // Pending deliveries
    const pendingDeliveries = await prisma.delivery.count({ where: { status: "WAITING" } });

    // Internal transfers (if you implement them)
    const internalTransfers = await prisma.internalTransfer.count({ where: { status: "SCHEDULED" } });

    // Stock adjustments today
    const adjustmentsToday = await prisma.adjustment.count({
      where: {
        createdAt: {
          gte: new Date(new Date().setHours(0, 0, 0, 0)),
          lte: new Date(),
        },
      },
    });

    // Damaged today (assume oldQty - newQty > 0 indicates damage)
    const damagedToday = await prisma.adjustment.findMany({
      where: {
        createdAt: {
          gte: new Date(new Date().setHours(0, 0, 0, 0)),
          lte: new Date(),
        },
        oldQty: { gt: 0 },
      },
      select: { productId: true, oldQty: true, newQty: true },
    });

    res.json({
      totalStock: totalStock._sum.quantity || 0,
      lowStock,
      outOfStock,
      pendingReceipts,
      pendingDeliveries,
      internalTransfers,
      adjustmentsToday,
      damagedToday,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
