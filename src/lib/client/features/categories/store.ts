import { CategoryService } from "$features/categories/services";
import type { CategoryData } from "$features/categories/types";
import type { FetcherQuery } from "$client/utils/endpoint";

import { derived, writable, type Readable, type Writable } from "svelte/store";

const createCategoryStore = () => {
    const _categories = writable<CategoryData[]>([]);

    const load = async (option?: FetcherQuery) => {
        CategoryService.getAll(option).then((categories) => {
            _categories.set(categories);
        });
    };

    const categories: Readable<CategoryData[]> = derived<Writable<CategoryData[]>, CategoryData[]>(
        _categories,
        ($_categories, set) => {
            set($_categories);
        }
    );

    const { subscribe } = categories;

    return {
        subscribe,
        load,
    };
};

export const categories = createCategoryStore();
