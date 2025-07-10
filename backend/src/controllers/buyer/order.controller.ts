import { requireAuth } from "@middlewares/auth.middleware";
import { requireBuyer } from "@middlewares/permissions.middleware";
import { findAddressByOrder } from "@services/prisma/address.service";
import { findOrdersByUser } from "@services/prisma/order.service";
import { findItemsByOrder } from "@services/prisma/orderItem.service";
import { findPaymentByOrder } from "@services/prisma/payment.service";
import { findUserByOrder } from "@services/prisma/user.service";

export async function orderHistoryResovler(parent: any, args: any, context: any) {
    const { id } = requireAuth(context);
    requireBuyer(context);
    return await findOrdersByUser(id);
}

export async function orderUserResolver(parent: any, args: any, context: any) {
    const { id } = parent;
    return await findUserByOrder(id);
}

export async function orderAddressResolver(parent: any, args: any, context: any) {
    const { id } = parent;
    return await findAddressByOrder(id);
}

export async function orderPaymentResolver(parent: any, args: any, context: any) {
    const { id } = parent;
    return await findPaymentByOrder(id);
}

export async function orderItemsResolver(parent: any, args: any, context: any) {
    const { id } = parent;
    return await findItemsByOrder(id);
}

