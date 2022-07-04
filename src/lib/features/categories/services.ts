import type { GetOutput } from "$routes/categories";
import type { ListData } from "$types/collection";
import type { FetchQuery } from "$types/meta";

import { endpoint } from "$utils/endpoint";

export const CategoryService = {
    get: async (option?: FetchQuery): Promise<ListData[]> => {
        const { categories } = await endpoint<GetOutput>("/categories", {
            method: "GET",
            fetch: option?.fetch,
        });

        return categories;
    },
};
