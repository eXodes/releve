import "dotenv/config";
import { firebaseEmulator } from "$client/config/firebase";

import {
    PUBLIC_APP_ENV,
    PUBLIC_SENTRY_DSN,
    PUBLIC_SENTRY_RELEASE,
    PUBLIC_SENTRY_SAMPLE_RATE,
} from "$env/static/public";

import app from "$server/services/firebase-admin";
import { getCookieValue, SESSION_COOKIE } from "$server/utils/cookie";
import { AuthService } from "$module/auth/auth.service";

import type { Handle, HandleServerError, RequestEvent } from "@sveltejs/kit";
import { sequence } from "@sveltejs/kit/hooks";
import * as Sentry from "@sentry/sveltekit";
import { getAppCheck } from "firebase-admin/app-check";
import { ProfilingIntegration } from "@sentry/profiling-node";

Sentry.init({
    environment: PUBLIC_APP_ENV,
    dsn: PUBLIC_SENTRY_DSN,
    tracesSampleRate: Number(PUBLIC_SENTRY_SAMPLE_RATE) / 3,
    profilesSampleRate: Number(PUBLIC_SENTRY_SAMPLE_RATE) / 2,
    replaysSessionSampleRate: Number(PUBLIC_SENTRY_SAMPLE_RATE) / 10,
    replaysOnErrorSampleRate: Number(PUBLIC_SENTRY_SAMPLE_RATE) / 5,
    integrations: [new ProfilingIntegration()],
    release: PUBLIC_SENTRY_RELEASE,
});

const verifyAppCheck = async (event: RequestEvent) => {
    const appCheckToken = event.request.headers.get("X-Firebase-AppCheck");

    if (!appCheckToken) {
        return null;
    }

    try {
        const response = await getAppCheck(app).verifyToken(appCheckToken);

        return response.token;
    } catch (err) {
        console.error(err);
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
                    error: "App Check token is not valid.",
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
