import { queryTypeDefs } from "./typeDefs/query";
import { mutationTypeDefs } from "./typeDefs/mutation";
import { userTypeDefs } from "./typeDefs/user";
import { reviewTypeDefs } from "./typeDefs/review";
import { productImageTypeDefs } from "./typeDefs/product.image";
import { productTypeDefs } from "./typeDefs/product";
import { paymentTypeDefs } from "./typeDefs/payment";
import { orderTypeDefs } from "./typeDefs/order";
import { orderItemTypeDefs } from "./typeDefs/order.item";
import { categoryTypeDefs } from "./typeDefs/category";
import { cartTypeDefs } from "./typeDefs/cart";
import { cartItemTypeDefs } from "./typeDefs/cart.item";
import { addressTypeDefs } from "./typeDefs/address";

export const typeDefs = `
  ${userTypeDefs}
  ${reviewTypeDefs}
  ${productImageTypeDefs}
  ${productTypeDefs}
  ${paymentTypeDefs}
  ${orderTypeDefs}
  ${orderItemTypeDefs}
  ${categoryTypeDefs}
  ${cartTypeDefs}
  ${cartItemTypeDefs}
  ${addressTypeDefs}
  ${queryTypeDefs}
  ${mutationTypeDefs}
`;