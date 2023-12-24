import "dotenv/config";
import { dev } from "$app/environment";
import { firebaseEmulator } from "$client/config/firebase";

import { env } from "$env/dynamic/public";
import { PUBLIC_APP_ENV } from "$env/static/public";

import "$server/services/firebase-admin";
import { getCookieValue, SESSION_COOKIE } from "$server/utils/cookie";
import { AuthService } from "$module/auth/auth.service";

import type { HandleServerError, RequestEvent } from "@sveltejs/kit";
import { sequence } from "@sveltejs/kit/hooks";
import * as Sentry from "@sentry/sveltekit";
import { ProfilingIntegration } from "@sentry/profiling-node";
import { getAppCheck } from "firebase-admin/app-check";

Sentry.init({
    environment: PUBLIC_APP_ENV,
    dsn: env.PUBLIC_SENTRY_DSN,
    tracesSampleRate: Number(env.PUBLIC_SENTRY_SAMPLE_RATE),
    profilesSampleRate: Number(env.PUBLIC_SENTRY_SAMPLE_RATE),
    integrations: [new ProfilingIntegration()],
});

const handleAppCheck = async (event: RequestEvent) => {
    const appCheckToken = event.request.headers.get("X-Firebase-AppCheck");

    if (!appCheckToken) {
        return new Response(
            JSON.stringify({
                message: "App Check token not found.",
            }),
            {
                status: 403,
                statusText: "Forbidden",
            }
        );
    }

    try {
        await getAppCheck().verifyToken(appCheckToken);
    } catch (err) {
        return new Response(JSON.stringify(err), {
            status: 403,
            statusText: "Forbidden",
        });
    }
};

export const handle = sequence(Sentry.sentryHandle(), async ({ event, resolve }) => {
    if (!(dev || firebaseEmulator)) await handleAppCheck(event);

    try {
        event.locals.session = await AuthService.verifySession(
            getCookieValue(event.request.headers, SESSION_COOKIE)
        );
    } catch {
        event.locals.session = undefined;
    }

    return resolve(event);
});

export const handleError = Sentry.handleErrorWithSentry<HandleServerError>(() => {
    return {
        status: 500,
        code: "InternalServerError",
        message: "An internal error has occurred.",
    };
});
