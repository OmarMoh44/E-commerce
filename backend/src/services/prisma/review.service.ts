import prisma from "@DB";

export async function findReviewsByUser(user_id: number) {
    return await prisma.review.findMany({
        where: { user_id }, include: { product: true }
    })
}

export async function findReviewsByProduct(product_id: number) {
    return await prisma.review.findMany({
        where: { product_id }, include: { user: true }
    });
}

export async function createReview(data: any) {
    try {
        return await prisma.review.create({
            data,
            include: { user: true, product: true }
        });
    } catch (error) {
        console.log("Error in creating new review");
        throw new Error("Error in creating new review");
    }
}

export async function updateReview(data: any, review_id: number, user_id: number) {
    try {
        return await prisma.review.update({
            where: { id: review_id, user_id },
            data,
            include: { user: true, product: true }
        });
    } catch (error) {
        console.log("Error in updating review");
        throw new Error("Error in updating review");
    }
}

export async function deleteReview(review_id: number, user_id: number) {
    try {
        return await prisma.review.delete({
            where: { id: review_id, user_id }
        });
    } catch (error) {
        console.log("Error in deleting review");
        throw new Error("Error in deleting review");
    }
}