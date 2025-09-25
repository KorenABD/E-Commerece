import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  const electronics = await prisma.category.upsert({
    where: { name: 'Electronics' },
    update: {},
    create: { name: 'Electronics' }
  });
  const apparel = await prisma.category.upsert({
    where: { name: 'Apparel' },
    update: {},
    create: { name: 'Apparel' }
  });

  await prisma.product.createMany({
    data: [
      { name: 'Wireless Headphones', description: 'ANC over-ear', price: 199.99, imageUrl: null, inStock: 25, categoryId: electronics.id },
      { name: 'Mechanical Keyboard', description: 'Hot-swap, RGB', price: 129.90, imageUrl: null, inStock: 40, categoryId: electronics.id },
      { name: 'Basic T-Shirt', description: '100% cotton', price: 14.99, imageUrl: null, inStock: 100, categoryId: apparel.id },
    ],
    skipDuplicates: true,
  });
}

main()
  .then(async () => { await prisma.$disconnect(); })
  .catch(async (e) => { console.error(e); await prisma.$disconnect(); process.exit(1); });
