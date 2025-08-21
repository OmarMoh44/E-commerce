import { requireAuth } from "@middlewares/auth.middleware";
import { requireBuyer, requireSeller } from "@middlewares/permissions.middleware";
import { checkPassword } from "@services/auth/login.service";
import { findAddressByUser } from "@services/prisma/address.service";
import { findCartByUser } from "@services/prisma/cart.service";
import { findOrdersByUser } from "@services/prisma/order.service";
import { findPaymentByUser } from "@services/prisma/payment.service";
import { findProductsByUser } from "@services/prisma/product.service";
import { findReviewsByUser } from "@services/prisma/review.service";
import { deleteUser, findUserById, updateUser } from "@services/prisma/user.service";
import { validateName, validateEmail, validatePhoneNumber } from "@validators/user";
import { Role } from "@prisma/client";
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

export async function userAddressResolver(parent: any, args: any, context: any) {
    const { id } = parent;
    return await findAddressByUser(id);
}

export async function userOrdersResolver(parent: any, args: any, context: any) {
    const { id } = parent;
    const user = requireAuth(context);
    // Only return orders if the user is a buyer, otherwise return empty array
    if (user.role !== Role.Buyer) {
        return [];
    }
    return await findOrdersByUser(id);
}

export async function userReviewsResolver(parent: any, args: any, context: any) {
    const { id } = parent;
    const user = requireAuth(context);
    // Only return reviews if the user is a buyer, otherwise return empty array
    if (user.role !== Role.Buyer) {
        return [];
    }
    return await findReviewsByUser(id);
}

export async function userProductsResolver(parent: any, args: any, context: any) {
    const { id } = parent;
    const user = requireAuth(context);
    // Only return products if the user is a seller, otherwise return empty array
    if (user.role !== Role.Seller) {
        return [];
    }
    return await findProductsByUser(id);
}

export async function userCartResolver(parent: any, args: any, context: any) {
    const { id } = parent;
    const user = requireAuth(context);
    // Only return cart if the user is a buyer, otherwise return null
    if (user.role !== Role.Buyer) {
        return null;
    }
    return await findCartByUser(id);
}

export async function userPaymentsResolver(parent: any, args: any, context: any) {
    const { id } = parent;
    const user = requireAuth(context);
    // Only return payments if the user is a buyer, otherwise return empty array
    if (user.role !== Role.Buyer) {
        return [];
    }
    return await findPaymentByUser(id);
}