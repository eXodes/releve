import type { Readable, Writable } from "svelte/store";
import type { ListData } from "$types/collection";

import { derived, writable } from "svelte/store";

import { CountryService } from "$features/countries/services";

const createStateStore = () => {
    const _states = writable<ListData[]>([]);

    const loadStates = async (countryName: string) => {
        const states = await CountryService.getStates(countryName).then((states) => states);

        _states.set(states);
    };

    const states: Readable<ListData[]> = derived<Writable<ListData[]>, ListData[]>(
        _states,
        ($_states, set) => {
            set($_states);
        },
        []
    );

    const { subscribe } = states;

    return {
        subscribe,
        loadStates,
    };
};

export const states = createStateStore();
