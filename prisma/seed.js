import prisma from '../src/config/prisma.js';
import bcrypt from 'bcryptjs';

async function main() {
  console.log('Seeding started...');

  // ------------------
  // Users
  // ------------------
  const usersData = [
    { name: 'Admin', email: 'admin@stockmaster.com', password: 'admin123' },
    { name: 'John Doe', email: 'john@example.com', password: 'password' },
  ];

  for (const user of usersData) {
    const hashedPassword = await bcrypt.hash(user.password, 10);
    await prisma.user.upsert({
      where: { email: user.email },
      update: {},
      create: { ...user, password: hashedPassword },
    });
  }

  // ------------------
  // Products
  // ------------------
  const productsData = [
    { name: 'Laptop', sku: 'LP1001', category: 'Electronics', unit: 'pcs' },
    { name: 'Mouse', sku: 'MS2001', category: 'Electronics', unit: 'pcs' },
    { name: 'Keyboard', sku: 'KB3001', category: 'Electronics', unit: 'pcs' },
  ];

  for (const product of productsData) {
    const createdProduct = await prisma.product.upsert({
      where: { sku: product.sku },
      update: {},
      create: product,
    });

    // ------------------
    // Stocks
    // ------------------
    await prisma.stock.create({
      data: { productId: createdProduct.id, quantity: 100 },
    });

    // ------------------
    // Receipts
    // ------------------
    await prisma.receipt.create({
      data: { productId: createdProduct.id, quantity: 50, supplier: 'Supplier A' },
    });

    // ------------------
    // Deliveries
    // ------------------
    await prisma.delivery.create({
      data: { productId: createdProduct.id, quantity: 20, customer: 'Customer X' },
    });

    // ------------------
    // Adjustments
    // ------------------
    await prisma.adjustment.create({
      data: {
        productId: createdProduct.id,
        oldQty: 100,
        newQty: 95,
        note: 'Initial stock correction',
      },
    });
  }

  console.log('Seeding completed!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
