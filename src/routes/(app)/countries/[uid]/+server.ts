import { handleApiError } from "$server/utils/error";
import { AuthError } from "$module/common/errors/auth";
import { StateCollection } from "$module/country/state.collection";

import type { StateData } from "$features/countries/types";

import { json } from "@sveltejs/kit";

import type { RequestHandler } from "./$types";

export interface StateGetOutput {
    states: StateData[];
}

export const GET: RequestHandler = async ({ locals, params }) => {
    const user = locals.session;

    if (!user) {
        throw handleApiError(new AuthError("Not authenticated."), 401);
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
