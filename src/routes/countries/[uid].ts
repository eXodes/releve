import type { RequestHandler } from "./__types/[uid]";
import type { ListData } from "$types/collection";
import type { ErrorResponse } from "$types/response";

import { CountryCollection } from "$_collection/countries";
import { handleError } from "$routes/_errors";

export interface GetOutput {
    states: ListData[];
}

export const get: RequestHandler<GetOutput | ErrorResponse> = async ({ locals, params }) => {
    const user = locals.user;

    if (!user) {
        return handleError(new Error("Not authenticated."));
    }

    try {
        const countryCollection = new CountryCollection();

        const states = await countryCollection.getSortedStates(params.uid);

        return {
            status: 200,
            body: {
                states,
            },
        };
    } catch (error) {
        return handleError(error);
    }
};
