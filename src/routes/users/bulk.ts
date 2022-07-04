import type { RequestHandler } from "./__types";
import type { ErrorResponse } from "$types/response";

import { UserCollection } from "$_collection/users";
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

        const userCollection = new UserCollection();
        await userCollection.deleteAll(uids);

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
