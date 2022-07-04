import type { RequestHandler } from "./__types";
import type { ListData } from "$types/collection";
import type { ErrorResponse } from "$types/response";

import { CountryCollection } from "$_collection/countries";
import { handleError } from "$routes/_errors";

export interface GetOutput {
    countries: ListData[];
}

export const get: RequestHandler<GetOutput | ErrorResponse> = async ({ locals }) => {
    const user = locals.user;

    if (!user) {
        return handleError(new Error("Not authenticated."));
    }

    try {
        const countryCollection = new CountryCollection();

        const countries = await countryCollection.getSortedCountries();

        return {
            status: 200,
            body: {
                countries,
            },
        };
    } catch (error) {
        return handleError(error);
    }
};
