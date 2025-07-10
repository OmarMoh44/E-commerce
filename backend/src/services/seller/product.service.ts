import { GraphQLError } from "graphql";


export function checkCategoryExist(category: string, categoriesList: string[], categoriesIndices: number[]) {
    if (categoriesList.includes(category))
        return categoriesIndices[categoriesList.indexOf(category)];
    throw new GraphQLError('This category is not found');
}