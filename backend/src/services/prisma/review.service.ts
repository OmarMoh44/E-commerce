import prisma from "@DB";

export async function findReviewsByUser(user_id: number) {
    return await prisma.review.findMany({
        where: { user_id }
    })
}