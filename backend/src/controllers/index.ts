import { findUserById } from "@services/prisma/user.service";
import { requireAuth } from "@middlewares/auth.middleware";
import { loginResolver } from "./user/login.controller";
import { logoutResolver } from "./user/logout.controller";
import { signupResolver } from "./user/signup.controller";
import { deleteUserResolver, userAddressResovler, userCartResovler, userOrdersResovler, userPaymentsResovler, userProductsResolver, userReviewsResolver, userUpdateResolver } from "./user/user.controller";
import { addProductResolver, deleteProductResovler, productUpdateResolver } from "./seller/product.controller";
import { addCategoryResolver, deleteCategoryResovler, updateCategroyResolver } from "./admin/categroy.controller";
import { orderAddressResolver, orderHistoryResovler, orderItemsResolver, orderPaymentResolver, orderUserResolver } from "./buyer/order.controller";
import { categoriesResolver } from "./user/category.controller";
import { addToCartResolver, cartResolver } from "./buyer/cart.controller";

async function userResolver(parent: any, args: any, context: any) {
    const { id, role } = requireAuth(context);
    console.log(id)
    const user = await findUserById(id);
    return user;
}

export const resolvers = {
    Query: {
        user: userResolver,
        orderHistory: orderHistoryResovler,
        categories: categoriesResolver,
        cart: cartResolver,
    },
    Mutation: {
        login: loginResolver,
        logout: logoutResolver,
        signup: signupResolver,
        updateName: userUpdateResolver.name,
        updateEmail: userUpdateResolver.email,
        updatePassword: userUpdateResolver.password,
        updatePhone: userUpdateResolver.phone,
        deleteUser: deleteUserResolver,

        addProduct: addProductResolver,
        deleteProduct: deleteProductResovler,
        updateTitle: productUpdateResolver.title,
        updateDesc: productUpdateResolver.description,
        updatePrice: productUpdateResolver.price,
        updateDiscount: productUpdateResolver.discount,
        updateStock: productUpdateResolver.stock,
        updateBranc: productUpdateResolver.brand,

        addCategory: addCategoryResolver,
        updateCategoryName: updateCategroyResolver,
        deleteCategory: deleteCategoryResovler,

        addToCart: addToCartResolver
    },
    Order: {
        user: orderUserResolver,
        address: orderAddressResolver,
        payment: orderPaymentResolver,
        items: orderItemsResolver,
    },
    User: {
        addresses: userAddressResovler,
        orders: userOrdersResovler,
        reviews: userReviewsResolver,
        products: userProductsResolver,
        cart: userCartResovler,
        payments: userPaymentsResovler,
    }
};