export const orderTypeDefs = `#graphql
    enum OrderStatus {
        PENDING
        CONFIRMED
        PROCESSING
        SHIPPED
        DELIVERED
        CANCELLED
        RETURNED
    }

    type Order{
        id: Int!
        status: OrderStatus!
        order_date: DateTime!
        total_amount: Float!

        user: User!
        address: Address!
        payment: Payment
        items: [OrderItem!]!
    }
`;