import type { RequestHandler } from "./__types";
import type { ListData } from "$types/collection";
import type { ErrorResponse } from "$types/response";

import { CategoryCollection } from "$_collection/categories";
import { handleError } from "$routes/_errors";

export interface GetOutput {
    categories: ListData[];
}

export const get: RequestHandler<GetOutput | ErrorResponse> = async ({ locals }) => {
    const user = locals.user;

    if (!user) {
        return handleError(new Error("Not authenticated."));
    }

    try {
        const categoryCollection = new CategoryCollection();

        const categories = await categoryCollection.getSortedCategories();

        return {
            status: 200,
            body: {
                categories,
            },
        };
    } catch (error) {
        return handleError(error);
    }
};
