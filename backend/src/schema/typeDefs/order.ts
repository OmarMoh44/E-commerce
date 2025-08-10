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

    type Tracking{
        status: String!
        message: String!
        timestamp: DateTime!
        location: String
    }

    type OrderTracking{
        order: Order!
        tracking: [Tracking!]!
    }
`;