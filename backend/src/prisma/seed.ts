import prisma from './PrismaClient';
import { faker } from '@faker-js/faker';
import bcrypt from 'bcrypt';
import { Role } from '@prisma/client';

async function main() {
    console.log('Seeding database...');

    // Create users
    const users = await Promise.all(
        Array.from({ length: 10 }).map(async () => {
            const hashedPassword = await bcrypt.hash('123456', 10);
            return prisma.user.create({
                data: {
                    name: faker.person.fullName(),
                    email: faker.internet.email(),
                    password_hash: hashedPassword,
                    phone: faker.phone.number(),
                    role: Role.Buyer,
                    cart: {}
                },
            });
        })
    );

    // Create sellers
    const sellers = await Promise.all(
        Array.from({ length: 3 }).map(async () => {
            const hashedPassword = await bcrypt.hash('123456', 10);
            return prisma.user.create({
                data: {
                    name: faker.person.fullName(),
                    email: faker.internet.email(),
                    password_hash: hashedPassword,
                    phone: faker.phone.number(),
                    role: Role.Seller,
                },
            });
        })
    );

    // Create categories
    const categoryNames = ['Electronics', 'Fashion', 'Books', 'Home', 'Toys'];
    const categories = await Promise.all(
        categoryNames.map((name) =>
            prisma.category.create({ data: { name } })
        )
    );

    // Create products
    await Promise.all(
        Array.from({ length: 20 }).map(() => {
            const seller = faker.helpers.arrayElement(sellers);
            const category = faker.helpers.arrayElement(categories);
            return prisma.product.create({
                data: {
                    seller_id: seller.id,
                    title: faker.commerce.productName(),
                    description: faker.commerce.productDescription(),
                    price: parseFloat(faker.commerce.price({ min: 10, max: 500 })),
                    discount: faker.number.float({ min: 0, max: 0.3 }),
                    stock: faker.number.int({ min: 10, max: 100 }),
                    category_id: category.id,
                    brand: faker.company.name(),
                    is_active: true,
                },
            });
        })
    );

    console.log('✅ Database seeded!');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(() => {
        prisma.$disconnect();
    });