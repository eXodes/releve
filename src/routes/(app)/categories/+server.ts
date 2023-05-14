import type { CategoryData } from "$features/categories/types";
import { CategoryCollection } from "$module/category/category.collection";
import { handleApiError } from "$server/utils/error";

import { json } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";

export interface CategoriesGetOutput {
    categories: CategoryData[];
}

export const GET: RequestHandler = async ({ locals }) => {
    const user = locals.session;

    if (!user) {
        throw handleApiError(new Error("Not authenticated."));
    }

    try {
        const categories = await CategoryCollection.getCategories();

        return json({
            categories: categories.map((category) => category.data),
        } satisfies CategoriesGetOutput);
    } catch (error) {
        throw handleApiError(error);
    }
};
