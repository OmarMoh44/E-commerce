export const orderItemTypeDefs = `#graphql
    type OrderItem{
        id: Int!
        quantity: Int!
        price_at_purchase: Float!

        order: Order!
        product: Product!
    }
`;