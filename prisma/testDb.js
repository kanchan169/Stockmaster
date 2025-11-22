import prisma from '../src/config/prisma.js';

async function main() {
  console.log('Fetching all data from the database...\n');

  // Users
  const users = await prisma.user.findMany();
  console.log('--- Users ---');
  console.table(users);

  // Products with relations
  const products = await prisma.product.findMany({
    include: { stocks: true, receipts: true, deliveries: true, adjustments: true },
  });
  console.log('\n--- Products ---');
  products.forEach((product) => {
    console.log(`Product: ${product.name} (SKU: ${product.sku})`);
    console.log('  Stock:', product.stocks);
    console.log('  Receipts:', product.receipts);
    console.log('  Deliveries:', product.deliveries);
    console.log('  Adjustments:', product.adjustments);
    console.log('---------------------');
  });

  console.log('\nDatabase fetch completed!');
}

main()
  .catch((e) => {
    console.error(e);
  })
  .finally(async () => {
    await prisma.$disconnect();
    process.exit(); // Exit Node automatically
  });
