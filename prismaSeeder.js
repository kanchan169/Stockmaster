import prisma from "./src/config/prisma.js";

async function main() {
  console.log("Seeding mock data...");

  // -----------------------------
  // USERS
  // -----------------------------
  const users = await prisma.user.createMany({
    data: [
      { name: "Alice", email: "alice@example.com", password: "password" },
      { name: "Bob", email: "bob@example.com", password: "password" },
      { name: "Charlie", email: "charlie@example.com", password: "password" },
    ],
    skipDuplicates: true,
  });

  // -----------------------------
  // PRODUCTS
  // -----------------------------
  const products = await prisma.product.createMany({
    data: [
      { name: "Apple", sku: "APL001", category: "Fruits", unit: "kg" },
      { name: "Banana", sku: "BAN001", category: "Fruits", unit: "kg" },
      { name: "Milk", sku: "MLK001", category: "Dairy", unit: "ltr" },
      { name: "Bread", sku: "BRD001", category: "Bakery", unit: "pcs" },
    ],
    skipDuplicates: true,
  });

  const allProducts = await prisma.product.findMany();

  // -----------------------------
  // STOCKS
  // -----------------------------
  for (const product of allProducts) {
    await prisma.stock.create({
      data: {
        productId: product.id,
        quantity: Math.floor(Math.random() * 100),
      },
    });
  }

  // -----------------------------
  // RECEIPTS
  // -----------------------------
  for (const product of allProducts) {
    await prisma.receipt.create({
      data: {
        productId: product.id,
        quantity: Math.floor(Math.random() * 50) + 10,
        supplier: "Supplier " + product.name,
      },
    });
  }

  // -----------------------------
  // DELIVERIES
  // -----------------------------
  for (const product of allProducts) {
    await prisma.delivery.create({
      data: {
        productId: product.id,
        quantity: Math.floor(Math.random() * 30),
        customer: "Customer " + product.name,
      },
    });
  }

  // -----------------------------
  // ADJUSTMENTS
  // -----------------------------
  for (const product of allProducts) {
    await prisma.adjustment.create({
      data: {
        productId: product.id,
        oldQty: Math.floor(Math.random() * 50),
        newQty: Math.floor(Math.random() * 50),
        note: "Random adjustment",
      },
    });
  }

  // -----------------------------
  // INTERNAL TRANSFERS
  // -----------------------------
  if (prisma.transfer) {
    for (const product of allProducts) {
      await prisma.transfer.create({
        data: {
          productId: product.id,
          quantity: Math.floor(Math.random() * 20),
          status: "SCHEDULED",
        },
      });
    }
  }

  console.log("✅ Mock data inserted!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
