import { env } from "$env/dynamic/public";
import { PUBLIC_APP_ENV } from "$env/static/public";
import { sequence } from "@sveltejs/kit/hooks";
import * as Sentry from "@sentry/sveltekit";
import "dotenv/config";

import { SESSION_COOKIE } from "$server/utils/cookie";
import { AuthService } from "$module/auth/auth.service";
import { getCookieValue } from "$client/utils/endpoint";
import "$server/services/firebase-admin";

import type { Handle, HandleServerError } from "@sveltejs/kit";

Sentry.init({
    environment: PUBLIC_APP_ENV,
    dsn: env.PUBLIC_SENTRY_DSN,
    tracesSampleRate: Number(env.PUBLIC_SENTRY_TRACE_RATE),
});

export const handle: Handle = sequence(Sentry.sentryHandle(), async ({ event, resolve }) => {
    try {
        event.locals.session = await AuthService.verifySession(
            getCookieValue(event.request.headers, SESSION_COOKIE)
        );

        return resolve(event);
    } catch {
        return resolve(event);
    }
});

export const handleError = Sentry.handleErrorWithSentry<HandleServerError>(() => {
    return {
        status: 500,
        code: "InternalServerError",
        message: "An internal error has occurred.",
    };
});
