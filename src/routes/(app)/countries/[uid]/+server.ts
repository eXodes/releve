import { handleApiError } from "$server/utils/error";
import type { StateData } from "$features/countries/types";
import { StateCollection } from "$module/country/state.collection";

import { json } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";

export interface StateGetOutput {
    states: StateData[];
}

export const GET: RequestHandler = async ({ locals, params }) => {
    const user = locals.session;

    if (!user) {
        throw handleApiError(new Error("Not authenticated."));
    }

    try {
        const states = await StateCollection.getStateByCountry(params.uid);

        return json({
            states: states?.map((state) => state.data) ?? [],
        } satisfies StateGetOutput);
    } catch (error) {
        throw handleApiError(error);
    }
};
