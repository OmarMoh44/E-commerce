import prisma from "@DB"

export const addToWishlist = async (userId: number, productId: number) => {
    const wishlistItem = await prisma.wishlist.create({
        data: {
            user_id: userId,
            product_id: productId
        },
        include: { 
            user: true, 
            product: {
                include: {
                    seller: true,
                    category: true,
                    reviews: {
                        include: {
                            user: true
                        }
                    }
                }
            }
        }
    });
    return wishlistItem;
};

export const removeFromWishlist = async (userId: number, productId: number) => {
    const result = await prisma.wishlist.deleteMany({
        where: {
            user_id: userId,
            product_id: productId
        }
    });
    return { success: result.count > 0 };
};

export const getUserWishlist = async (userId: number) => {
    const wishlist = await prisma.wishlist.findMany({
        where: {
            user_id: userId
        },
        orderBy: {
            created_at: 'desc'
        },
        include: {
            user: true,
            product: {
                include: {
                    seller: true,
                    category: true,
                    reviews: {
                        include: {
                            user: true
                        }
                    }
                }
            }
        }
    });
    return wishlist;
};

export const isInWishlist = async (userId: number, productId: number) => {
    const wishlistItem = await prisma.wishlist.findUnique({
        where: {
            user_id_product_id: {
                user_id: userId,
                product_id: productId
            }
        }
    });
    return !!wishlistItem;
}; 