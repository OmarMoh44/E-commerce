export const cartItemTypeDefs = `#graphql
    type CartItem{
        id: Int!
        quantity: Int!
        
        cart: Cart!
        product: Product!
    }
`;