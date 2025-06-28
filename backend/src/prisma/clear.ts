import prisma from './PrismaClient';

async function clearDatabase() {
  try {
    // Order matters: delete child tables before parent tables

    await prisma.review.deleteMany();
    await prisma.orderItem.deleteMany();
    await prisma.cartItem.deleteMany();
    await prisma.productImage.deleteMany();

    await prisma.cart.deleteMany();
    await prisma.payment.deleteMany();
    await prisma.order.deleteMany();
    await prisma.address.deleteMany();
    await prisma.product.deleteMany();
    await prisma.category.deleteMany();
    await prisma.user.deleteMany();

    console.log('✅ All tables cleared successfully.');
  } catch (error) {
    console.error('❌ Error clearing tables:', error);
  } finally {
    await prisma.$disconnect();
  }
}

clearDatabase();
