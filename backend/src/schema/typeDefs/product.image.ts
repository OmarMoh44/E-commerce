export const productImageTypeDefs = `#graphql
    type ProductImage{
        id: Int!
        url: String!
        alt_text: String!
        
        product: Product!
    }
`;