import { env } from "$env/dynamic/public";
import { PUBLIC_APP_ENV } from "$env/static/public";

import * as Sentry from "@sentry/sveltekit";
import { handleErrorWithSentry, Replay } from "@sentry/sveltekit";

Sentry.init({
    environment: PUBLIC_APP_ENV,
    dsn: env.PUBLIC_SENTRY_DSN,
    tracesSampleRate: Number(env.PUBLIC_SENTRY_SAMPLE_RATE),
    replaysSessionSampleRate: Number(env.PUBLIC_SENTRY_SAMPLE_RATE),
    replaysOnErrorSampleRate: Number(env.PUBLIC_SENTRY_SAMPLE_RATE),
    integrations: [new Replay()],
});

export const handleError = handleErrorWithSentry();
