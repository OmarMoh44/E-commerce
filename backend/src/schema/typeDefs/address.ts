export const addressTypeDefs = `#graphql
    type Address{
        id: Int!
        full_name: String!
        city: String!
        country: String!
        phone: String!
        is_default: Boolean!

        user: User!
        orders: [Order!]!
    }
`;