export const paymentTypeDefs = `#graphql
    enum PaymentMethod {
        CARD
        PAYPAL
        CASH_ON_DELIVERY
        BANK_TRANSFER
        WALLET
    }

    enum PaymentStatus {
        PENDING
        SUCCESS
        FAILED
        CANCELLED
        REFUNDED
    }

    type Payment {
        id: Int!
        payment_method: PaymentMethod!
        payment_status: PaymentStatus!
        transaction_id: String!
        paid_at: DateTime!

        user: User!
        order: Order!
  }
`;