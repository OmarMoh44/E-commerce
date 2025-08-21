import prisma from "@DB";
import { GraphQLError } from "graphql";

export async function findAddressByOrder(order_id: number) {
    const address = await prisma.address.findFirst({
        where: {
            orders: {
                some: {
                    id: order_id
                } 
            }
        }
    });
    
    if (!address) {
        throw new GraphQLError("Address not found for order", {
            extensions: { code: 'NOT_FOUND' }
        });
    }
    
    return address;
}

export async function findAddressByUser(user_id: number) {
    return await prisma.address.findMany({
        where: { user_id },
        include: {
            user: true,
            orders: true
        }
    });
}

export async function findAddressById(address_id: number, user_id: number) {
    const address = await prisma.address.findUnique({
        where: { id: address_id },
        include: {
            user: true,
            orders: true
        }
    });
    
    if (!address) {
        throw new GraphQLError("Address not found", {
            extensions: { code: 'NOT_FOUND' }
        });
    }
    
    // Ensure the address belongs to the requesting user
    if (address.user_id !== user_id) {
        throw new GraphQLError("Unauthorized to access this address", {
            extensions: { code: 'UNAUTHORIZED' }
        });
    }
    
    return address;
}

export async function createAddress(user_id: number, addressData: {
    full_name: string;
    city: string;
    country: string;
    phone: string;
    is_default?: boolean;
}) {
    try {
        // If this is set as default, make all other addresses non-default
        if (addressData.is_default) {
            await prisma.address.updateMany({
                where: { user_id },
                data: { is_default: false }
            });
        }
        
        return await prisma.address.create({
            data: {
                user: {
                    connect: { id: user_id }
                },
                full_name: addressData.full_name,
                city: addressData.city,
                country: addressData.country,
                phone: addressData.phone,
                is_default: addressData.is_default || false
            },
            include: {
                user: true,
                orders: true
            }
        });
    } catch (error) {
        console.error("Error creating address:", error);
        throw new GraphQLError("Error creating address", {
            extensions: { code: 'INTERNAL_SERVER_ERROR' }
        });
    }
}

export async function updateAddress(address_id: number, user_id: number, addressData: {
    full_name?: string;
    city?: string;
    country?: string;
    phone?: string;
    is_default?: boolean;
}) {
    try {
        // First check if address exists and belongs to user
        const existingAddress = await findAddressById(address_id, user_id);
        
        // If this is being set as default, make all other addresses non-default
        if (addressData.is_default) {
            await prisma.address.updateMany({
                where: { 
                    user_id,
                    id: { not: address_id }
                },
                data: { is_default: false }
            });
        }
        
        return await prisma.address.update({
            where: { id: address_id },
            data: addressData,
            include: {
                user: true,
                orders: true
            }
        });
    } catch (error) {
        if (error instanceof GraphQLError) {
            throw error;
        }
        console.error("Error updating address:", error);
        throw new GraphQLError("Error updating address", {
            extensions: { code: 'INTERNAL_SERVER_ERROR' }
        });
    }
}

export async function deleteAddress(address_id: number, user_id: number) {
    try {
        // First check if address exists and belongs to user
        await findAddressById(address_id, user_id);
        
        // Check if there are any orders using this address
        const ordersWithAddress = await prisma.order.findMany({
            where: { address_id }
        });
        
        if (ordersWithAddress.length > 0) {
            throw new GraphQLError("Cannot delete address that has been used in orders", {
                extensions: { code: 'BAD_REQUEST' }
            });
        }
        
        return await prisma.address.delete({
            where: { id: address_id },
            include: {
                user: true
            }
        });
    } catch (error) {
        if (error instanceof GraphQLError) {
            throw error;
        }
        console.error("Error deleting address:", error);
        throw new GraphQLError("Error deleting address", {
            extensions: { code: 'INTERNAL_SERVER_ERROR' }
        });
    }
}