export const cartTypeDefs = `#graphql
    type Cart{
        id: Int!
        
        user: User!
        items: [CartItem!]!
    }
`;