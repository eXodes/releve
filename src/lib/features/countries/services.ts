import type { GetOutput as CountriesGetOutput } from "$routes/countries";
import type { GetOutput as StatesGetOutput } from "$routes/countries/[uid]";
import type { ListData } from "$types/collection";
import type { FetchQuery } from "$types/meta";

import { endpoint } from "$utils/endpoint";
import { countries } from "$features/countries/store";

export const CountryService = {
    get: async (option?: FetchQuery): Promise<ListData[]> => {
        const { countries } = await endpoint<CountriesGetOutput>("/countries", {
            method: "GET",
            fetch: option?.fetch,
        });

        return countries;
    },
    getStates: async (countryName: string): Promise<ListData[]> => {
        const uid = await new Promise<string>((resolve) => {
            countries.subscribe((countries) => {
                const country = countries.find((country) => country.label === countryName);

                if (country) {
                    resolve(country.value);
                }
            });
        });

        const { states } = await endpoint<StatesGetOutput>("/countries/" + uid);

        return states;
    },
};
