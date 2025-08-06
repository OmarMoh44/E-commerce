import { requireAuth } from "@middlewares/auth.middleware";
import { requireBuyer, requireSeller } from "@middlewares/permissions.middleware";
import { checkPassword } from "@services/auth/login.service";
import { GraphQLError } from "graphql";
import { findAddressByUser } from "@services/prisma/address.service";
import { findCartByUser } from "@services/prisma/cart.service";
import { findOrdersByUser } from "@services/prisma/order.service";
import { findPaymentByUser } from "@services/prisma/payment.service";
import { findProductsByUser } from "@services/prisma/product.service";
import { findReviewsByUser } from "@services/prisma/review.service";
import { deleteUser, findUserById, updateUser } from "@services/prisma/user.service";
import { validateName, validateEmail, validatePhoneNumber } from "@validators/user";
import bcrypt from 'bcrypt';


export const userUpdateResolver = {
    name: async function name(parent: any, args: any, context: any) {
        const { id } = requireAuth(context);
        const name: string = args.name;
        validateName(name);
        return await updateUser({ name }, id);
    },
    email: async function (parent: any, args: any, context: any) {
        const { id } = requireAuth(context);
        const email: string = args.email;
        validateEmail(email);
        return await updateUser({ email }, id);
    },
    phone: async function (parent: any, args: any, context: any) {
        const { id } = requireAuth(context);
        const phone: string = args.phone;
        validatePhoneNumber(phone);
        return await updateUser({ phone }, id);
    },
    password: async function (parent: any, args: any, context: any) {
        const { id } = requireAuth(context);
        const { currentPassword, newPassword } = args
        let user = await findUserById(id);
        checkPassword(currentPassword, user.password_hash);
        user = await updateUser({ password_hash: bcrypt.hashSync(newPassword, 10) }, id);
        return user;
    }
}

export async function deleteUserResolver(parent: any, args: any, context: any) {
    const { id } = requireAuth(context);
    return await deleteUser(id);
}

export async function userAddressResovler(parent: any, args: any, context: any) {
    const { id } = parent;
    return await findAddressByUser(id);
}

export async function userOrdersResovler(parent: any, args: any, context: any) {
    const { id } = parent;
    const { role } = requireAuth(context);
    if (role !== 'Buyer') {
        throw new GraphQLError('Authorization required', {
            extensions: { code: 'FORBIDDEN' }
        });
    }
    return await findOrdersByUser(id);
}

export async function userReviewsResolver(parent: any, args: any, context: any) {
    const { id } = parent;
    const { role } = requireAuth(context);
    if (role !== 'Buyer') {
        throw new GraphQLError('Authorization required', {
            extensions: { code: 'FORBIDDEN' }
        });
    }
    return await findReviewsByUser(id);
}

export async function userProductsResolver(parent: any, args: any, context: any) {
    const { id } = parent;
    const { role } = requireAuth(context);
    if (role !== 'Seller') {
        throw new GraphQLError('Authorization required', {
            extensions: { code: 'FORBIDDEN' }
        });
    }
    return await findProductsByUser(id);
}

export async function userCartResovler(parent: any, args: any, context: any) {
    const { id } = parent;
    const { role } = requireAuth(context);
    if (role !== 'Buyer') {
        throw new GraphQLError('Authorization required', {
            extensions: { code: 'FORBIDDEN' }
        });
    }
    return await findCartByUser(id);
}

export async function userPaymentsResovler(parent: any, args: any, context: any) {
    const { id } = parent;
    const { role } = requireAuth(context);
    if (role !== 'Buyer') {
        throw new GraphQLError('Authorization required', {
            extensions: { code: 'FORBIDDEN' }
        });
    }
    return await findPaymentByUser(id);
}