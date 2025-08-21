import { Role } from "@prisma/client"
import { GraphQLError } from "graphql";

const requireAdmin = (context: any) => {
    if (context.user.role !== Role.Admin)
        throw new GraphQLError('Authorization required', {
            extensions: { code: 'FORBIDDEN' }
        });
}

const requireBuyer = (context: any) => {
    if (context.user.role !== Role.Buyer)
        throw new GraphQLError('Authorization required', {
            extensions: { code: 'FORBIDDEN' }
        });
}

const requireSeller = (context: any) => {
    if (context.user.role !== Role.Seller)
        throw new GraphQLError('Authorization required', {
            extensions: { code: 'FORBIDDEN' }
        });
}

export { requireAdmin, requireBuyer, requireSeller };