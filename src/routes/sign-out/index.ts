import type { RequestHandler } from "./__types";

import { handleError } from "$routes/_errors";

export const get: RequestHandler = async ({ locals }) => {
    try {
        await locals.user?.revokeToken();

        return {
            status: 200,
            headers: {
                "Set-Cookie": await locals.user?.createCookie(),
            },
            body: {
                message: "Successfully logged out.",
            },
        };
    } catch (error) {
        return handleError(error);
    }
};
