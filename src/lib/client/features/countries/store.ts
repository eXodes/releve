import { CountryService } from "$features/countries/services";
import type { CountryData, StateData } from "$features/countries/types";
import type { FetcherQuery } from "$client/utils/endpoint";

import { derived, writable, type Readable, type Writable } from "svelte/store";

const createCountryStore = () => {
    const _countries = writable<CountryData[]>([]);

    const load = async (option?: FetcherQuery) => {
        const countries = await CountryService.getAll(option);

        _countries.set(countries);
    };

    const countries: Readable<CountryData[]> = derived(_countries, ($_countries, set) => {
        set($_countries);
    });

    const { subscribe } = countries;

    return {
        subscribe,
        load,
    };
};

export const countries = createCountryStore();

const createStateStore = () => {
    const _states = writable<StateData[]>([]);

    const loadStates = async (countryName: string) => {
        const states = await CountryService.getStates(countryName);

        _states.set(states);
    };

    const clearStates = () => {
        _states.set([]);
    };

    const states: Readable<StateData[]> = derived<Writable<StateData[]>, StateData[]>(
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
        clearStates,
    };
};

export const states = createStateStore();
