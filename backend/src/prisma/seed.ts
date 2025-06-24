import prisma from './PrismaClient';
import { faker } from '@faker-js/faker';

async function main() {
    // Create categories
    const categories = await Promise.all(
        Array.from({ length: 3 }).map(() =>
            prisma.proCategory.create({
                data: {
                    name: faker.commerce.department(),
                },
            })
        )
    );

    // Create users
    const users = await Promise.all(
        Array.from({ length: 5 }).map(() =>
            prisma.user.create({
                data: {
                    name: faker.person.fullName(),
                    email: faker.internet.email(),
                },
            })
        )
    );

    // Create addresses and payments for each user
    for (const user of users) {
        await prisma.address.create({
            data: {
                country: faker.location.country(),
                city: faker.location.city(),
                user_id: user.id,
            },
        });
        await prisma.payment.create({
            data: {
                method: 'Visa', // or random from enum
                amount: faker.number.int({ min: 10, max: 1000 }),
                user_id: user.id,
            },
        });
    }

    // Create orders for users
    const orders = [];
    for (const user of users) {
        const order = await prisma.order.create({
            data: {
                amount: faker.number.int({ min: 20, max: 1000 }),
                date: faker.date.recent(),
                status: 'Delivered',
                user_id: user.id,
            },
        });
        orders.push(order);
    }

    // Create products and assign to categories and orders
    const products = [];
    for (let i = 0; i < 10; i++) {
        const category = faker.helpers.arrayElement(categories);
        const order = faker.helpers.arrayElement(orders);
        const product = await prisma.product.create({
            data: {
                name: faker.commerce.productName(),
                price: faker.number.int({ min: 10, max: 500 }),
                desc: faker.commerce.productDescription(),
                category_id: category.id,
                order_id: order.id,
            },
        });
        products.push(product);
    }

    // Create carts for users and assign products
    for (const user of users) {
        const cart = await prisma.cart.create({
            data: {
                user_id: user.id,
            },
        });
        // Assign some products to this cart
        const cartProducts = faker.helpers.arrayElements(products, 2);
        for (const product of cartProducts) {
            await prisma.cart.update({
                where: { id: cart.id },
                data: {
                    products: {
                        connect: { id: product.id },
                    },
                },
            });
        }
    }

    console.log('Database seeded with fake data!');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
