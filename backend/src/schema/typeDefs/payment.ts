export const paymentTypeDefs = `#graphql
    enum PaymentMethod {
        CARD
        PAYPAL
        CASH_ON_DELIVERY
        BANK_TRANSFER
        WALLET
    }

    type Payment {
        id: Int!
        payment_method: PaymentMethod!
        transaction_id: String!
        paid_at: DateTime!

        user: User!
        order: Order!
  }
`;