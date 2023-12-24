import "dotenv/config";
import { firebaseEmulator } from "$client/config/firebase";

import { env } from "$env/dynamic/public";
import { PUBLIC_APP_ENV } from "$env/static/public";

import "$server/services/firebase-admin";
import { getCookieValue, SESSION_COOKIE } from "$server/utils/cookie";
import { AuthService } from "$module/auth/auth.service";

import type { Handle, HandleServerError, RequestEvent } from "@sveltejs/kit";
import { sequence } from "@sveltejs/kit/hooks";
import * as Sentry from "@sentry/sveltekit";
import { getAppCheck } from "firebase-admin/app-check";
import { ProfilingIntegration } from "@sentry/profiling-node";

Sentry.init({
    environment: PUBLIC_APP_ENV,
    dsn: env.PUBLIC_SENTRY_DSN,
    tracesSampleRate: Number(env.PUBLIC_SENTRY_SAMPLE_RATE),
    profilesSampleRate: Number(env.PUBLIC_SENTRY_SAMPLE_RATE),
    integrations: [new ProfilingIntegration()],
});

const verifyAppCheck = async (event: RequestEvent) => {
    const appCheckToken = event.request.headers.get("X-Firebase-AppCheck");

    if (!appCheckToken) {
        return null;
    }

    try {
        const response = await getAppCheck().verifyToken(appCheckToken);

        return response.token;
    } catch (err) {
        return null;
    }
};

export const handle = sequence(Sentry.sentryHandle(), async ({ event, resolve }) => {
    const isJSON = event.request.headers.get("Content-Type")?.includes("application/json");

    if (isJSON) {
        const token = await verifyAppCheck(event);

        if (!firebaseEmulator && !token) {
            return new Response(
                JSON.stringify({
                    message: "App Check token is not valid.",
                }),
                {
                    status: 403,
                    statusText: "Forbidden",
                }
            );
        }
    }

    try {
        event.locals.session = await AuthService.verifySession(
            getCookieValue(event.request.headers, SESSION_COOKIE)
        );
    } catch {
        event.locals.session = undefined;
    }

    return resolve(event);
}) satisfies Handle;

export const handleError = Sentry.handleErrorWithSentry<HandleServerError>(() => {
    return {
        status: 500,
        code: "InternalServerError",
        message: "An internal error has occurred.",
    };
}) satisfies HandleServerError;
