import prisma from "@DB"
import bcrypt from 'bcrypt';
import { UserInfo } from "@src/types/user";
import { GraphQLError } from "graphql";


export async function findUserByEmail(email: string) {
    const user = await prisma.user.findUnique({
        where: {
            email
        }
    });
    if (!user)
        throw new GraphQLError("Email is not correct", {
            extensions: { code: 'BAD_USER_INPUT' }
        });
    return user;
}

export async function findUserById(id: number) {
    const user = await prisma.user.findUnique({
        where: {
            id
        }
    });
    if (!user)
        throw new GraphQLError("User is not found", {
            extensions: { code: 'BAD_USER_INPUT' }
        });
    return user;
}

export async function findUserByOrder(order_id: number) {
    const order = await prisma.order.findUnique({
        where: { id: order_id },
        include: { user: true },
    });
    if (!order?.user) {
        throw new GraphQLError("Order not found or user missing", {
            extensions: { code: 'NOT_FOUND' }
        });
    }
    return order.user;
}

export async function createUser(userDate: UserInfo) {
    try {
        const password_hash = bcrypt.hashSync(userDate.password, 10);
        const user = await prisma.user.create({
            data: {
                name: userDate.name, email: userDate.email,
                password_hash, phone: userDate.phone,
                role: userDate.role
            }
        })
        return user;
    } catch (err) {
        console.log('Error in creating user account');
        throw new GraphQLError("Error in creating user account", {
            extensions: { code: 'INTERNAL_SERVER_ERROR' }
        });
    }
}

export async function deleteUser(user_id: number) {
    try {
        return await prisma.user.delete({
            where: {
                id: user_id
            }
        });
    } catch (error) {
        console.log('Error in deleting user account');
        throw new GraphQLError("Error in deleting user account", {
            extensions: { code: 'INTERNAL_SERVER_ERROR' }
        });
    }
}

export async function updateUser(data: any, user_id: number) {
    try {
        return await prisma.user.update({
            where: { id: user_id },
            data
        })
    } catch (error) {
        console.log('Error in updating user account');
        throw new GraphQLError("Error in updating user account", {
            extensions: { code: 'INTERNAL_SERVER_ERROR' }
        });
    }
}