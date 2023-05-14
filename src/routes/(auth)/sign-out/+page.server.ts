import { SESSION_COOKIE } from "$server/utils/cookie";

import type { Actions } from "./$types";

export const actions: Actions = {
    default: async ({ cookies, locals }) => {
        await locals.session?.revokeToken();

        await cookies.delete(SESSION_COOKIE);

        return {
            message: "Successfully logged out.",
        };
    },
};
