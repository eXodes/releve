import { countries } from "$features/countries/store";
import type { CountryData, StateData } from "$features/countries/types";
import type { FetcherQuery } from "$client/utils/endpoint";
import { endpoint } from "$client/utils/endpoint";

export const CountryService = {
    getAll: async (option?: FetcherQuery): Promise<CountryData[]> => {
        const { countries } = await endpoint<{ countries: CountryData[] }>("/countries", {
            method: "GET",
            fetch: option?.fetch,
        });

        return countries;
    },
    getStates: async (countryName: string): Promise<StateData[]> => {
        const country = await new Promise<CountryData>((resolve) => {
            countries.subscribe((countries) => {
                const country = countries.find((country) => country.name === countryName);

                if (country) {
                    resolve(country);
                }
            });
        });

        const { states } = await endpoint<{ states: StateData[] }>("/countries/" + country.uid);

        return states;
    },
};
