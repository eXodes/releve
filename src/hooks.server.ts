import "dotenv/config";

import { dev } from "$app/environment";
import { SESSION_COOKIE } from "$server/utils/cookie";
import { AuthService } from "$module/auth/auth.service";
import { getCookie } from "$client/utils/endpoint";
import "$server/services/firebase-admin";

import type { Handle, HandleServerError } from "@sveltejs/kit";

export const handle: Handle = async ({ event, resolve }) => {
    try {
        event.locals.session = await AuthService.verifySession(
            getCookie(event.request.headers, SESSION_COOKIE)
        );

        return resolve(event);
    } catch {
        return resolve(event);
    }
};

export const handleError: HandleServerError = ({ error, event }) => {
    if (dev) console.error("handleError", { error, event });
    // TODO: integration with https://sentry.io/
    // Sentry.captureException(error, { event });

    return {
        status: 500,
        code: "InternalServerError",
        message: "An internal error has occurred.",
    };
};
