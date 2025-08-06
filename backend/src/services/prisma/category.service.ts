import prisma from "@DB";
import { GraphQLError } from "graphql";

export async function findCategories() {
    const categories = await prisma.category.findMany({});
    return categories;
}

export async function createCategory(categroy_name: string, parent_id: number | null) {
    try {
        return await prisma.category.create({
            data: { name: categroy_name, parent_id }
        });
    } catch (error) {
        console.log("Error in creating new category");
        throw new GraphQLError("Error in creating new category", {
            extensions: { code: 'INTERNAL_SERVER_ERROR' }
        });

    }
}

export async function updateCategory(category_id: number, data: any) {
    try {
        return await prisma.category.update({
            where: { id: category_id },
            data
        })
    } catch (error) {
        console.log("Error in updating category");
        throw new GraphQLError("Error in updating category", {
            extensions: { code: 'INTERNAL_SERVER_ERROR' }
        });

    }
}

export async function deleteCategory(category_id: number) {
    try {
        return await prisma.category.delete({
            where: { id: category_id },
        })
    } catch (error) {
        console.log("Error in deleting category");
        throw new GraphQLError("Error in deleting category", {
            extensions: { code: 'INTERNAL_SERVER_ERROR' }
        });
    }
}

export async function findParentByChildId(category_id: number) {
    try {
        const category = await prisma.category.findUnique({
            where: { id: category_id },
            include: { parent: true }
        });
        return category?.parent || null;
    } catch (error) {
        console.log("Error in finding parent category by child ID");
        throw new GraphQLError("Error in finding parent category", {
            extensions: { code: 'INTERNAL_SERVER_ERROR' }
        });
    }

}

export async function findChildrenByParentId(parent_id: number) {
    try {
        const categories = await prisma.category.findMany({
            where: { parent_id }
        });
        return categories;
    } catch (error) {
        console.log("Error in finding children categories by parent ID");
        throw new GraphQLError("Error in finding children categories", {
            extensions: { code: 'INTERNAL_SERVER_ERROR' }
        });
    }
}