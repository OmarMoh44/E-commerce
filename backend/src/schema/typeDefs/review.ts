export const reviewTypeDefs = `#graphql
    type Review{
        id: Int!
        rating: Int!
        comment: String!
        review_date: DateTime!
        
        user: User!
        product: Product!
    }
`;