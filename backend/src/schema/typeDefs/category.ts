export const categoryTypeDefs = `#graphql
    type Category{
        id: Int!
        name: String!

        parent: Category
        children: [Category!]!
        products: [Product!]!
    }
`;