import type { CategoryData } from "$features/categories/types";
import type { FetcherQuery } from "$client/utils/endpoint";
import { endpoint } from "$client/utils/endpoint";

export const CategoryService = {
    getAll: async (option?: FetcherQuery): Promise<CategoryData[]> => {
        const { categories } = await endpoint<{ categories: CategoryData[] }>("/categories", {
            method: "GET",
            fetch: option?.fetch,
        });

        return categories;
    },
};
