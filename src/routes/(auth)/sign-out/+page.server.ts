import { dev } from "$app/environment";

import { SESSION_COOKIE } from "$server/utils/cookie";

import type { MessageResponse } from "$client/types/response";

import type { Actions } from "./$types";

export const config = {
    cors: !dev,
};

export const actions: Actions = {
    default: async ({ cookies, locals }) => {
        await locals.session?.revokeToken();

        cookies.delete(SESSION_COOKIE);

        return {
            message: "Successfully logged out.",
        } satisfies MessageResponse;
    },
};
