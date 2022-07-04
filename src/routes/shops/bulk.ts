import type { RequestHandler } from "./__types";
import type { ErrorResponse } from "$types/response";

import { ShopCollection } from "$_collection/shops";
import { handleError } from "$routes/_errors";

export type Payload = {
    uids: string[];
};

export type DeleteOutput = {
    message: string;
};

export const del: RequestHandler<DeleteOutput | ErrorResponse> = async ({ request, locals }) => {
    const user = locals.user;

    if (!user) {
        return handleError(new Error("Not authenticated."));
    }

    const userData = user.data();

    if (!userData.customClaims.isAdmin) {
        return handleError(new Error("Not authorized."));
    }

    try {
        const { uids } = (await request.json()) as Payload;

        const shopCollection = new ShopCollection();
        await shopCollection.deleteAll(uids);

        return {
            status: 200,
            body: {
                message: "Users deleted.",
            },
        };
    } catch (error) {
        return handleError(error);
    }
};
