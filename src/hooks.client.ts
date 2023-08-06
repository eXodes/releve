import {
    PUBLIC_APP_ENV,
    PUBLIC_SENTRY_DSN,
    PUBLIC_SENTRY_ERROR_RATE,
    PUBLIC_SENTRY_SESSION_RATE,
    PUBLIC_SENTRY_TRACE_RATE,
} from "$env/static/public";
import * as Sentry from "@sentry/sveltekit";
import { handleErrorWithSentry, Replay } from "@sentry/sveltekit";

Sentry.init({
    environment: PUBLIC_APP_ENV,
    dsn: PUBLIC_SENTRY_DSN,
    tracesSampleRate: Number(PUBLIC_SENTRY_TRACE_RATE),
    replaysSessionSampleRate: Number(PUBLIC_SENTRY_SESSION_RATE),
    replaysOnErrorSampleRate: Number(PUBLIC_SENTRY_ERROR_RATE),
    integrations: [new Replay()],
});

export const handleError = handleErrorWithSentry();
