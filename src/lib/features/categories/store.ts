import type { Readable, Writable } from "svelte/store";
import type { ListData } from "$types/collection";
import type { FetchQuery } from "$types/meta";

import { derived, writable } from "svelte/store";

import { CategoryService } from "$features/categories/services";

const createCategoryStore = () => {
    const _categories = writable<ListData[]>([]);

    const load = async (option?: FetchQuery) => {
        CategoryService.get(option).then((categories) => {
            _categories.set(categories);
        });
    };

    const categories: Readable<ListData[]> = derived<Writable<ListData[]>, ListData[]>(
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
