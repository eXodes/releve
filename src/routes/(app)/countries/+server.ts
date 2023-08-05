import { handleApiError } from "$server/utils/error";
import type { CountryData } from "$features/countries/types";
import { CountryCollection } from "$module/country/country.collection";

import { json } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";

export interface CountriesGetOutput {
    countries: CountryData[];
}

export const GET: RequestHandler = async ({ locals }) => {
    const user = locals.session;

    if (!user) {
        throw handleApiError(new Error("Not authenticated."));
    }

    try {
        const countries = await CountryCollection.getCountries();

        return json({
            countries: countries.map((country) => country.data),
        } satisfies CountriesGetOutput);
    } catch (error) {
        throw handleApiError(error);
    }
};
