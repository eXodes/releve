import type { Readable } from "svelte/store";
import type { ListData } from "$types/collection";
import type { FetchQuery } from "$types/meta";

import { derived, writable } from "svelte/store";

import { CountryService } from "$features/countries/services";

const createCountryStore = () => {
    const _countries = writable<ListData[]>([]);

    const load = async (option?: FetchQuery) => {
        const countries = await CountryService.get(option).then((countries) => countries);

        _countries.set(countries);
    };

    const countries: Readable<ListData[]> = derived(_countries, ($_countries, set) => {
        set($_countries);
    });

    const { subscribe } = countries;

    return {
        subscribe,
        load,
    };
};

export const countries = createCountryStore();
