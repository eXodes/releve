import { env } from "$env/dynamic/public";
import { PUBLIC_APP_ENV } from "$env/static/public";

import * as Sentry from "@sentry/sveltekit";
import { handleErrorWithSentry, Replay } from "@sentry/sveltekit";
import type { HandleClientError } from "@sveltejs/kit";

Sentry.init({
    environment: PUBLIC_APP_ENV,
    dsn: env.PUBLIC_SENTRY_DSN,
    tracesSampleRate: Number(env.PUBLIC_SENTRY_SAMPLE_RATE) / 3,
    profilesSampleRate: Number(env.PUBLIC_SENTRY_SAMPLE_RATE) / 2,
    replaysSessionSampleRate: Number(env.PUBLIC_SENTRY_SAMPLE_RATE) / 10,
    replaysOnErrorSampleRate: Number(env.PUBLIC_SENTRY_SAMPLE_RATE) / 5,
    integrations: [new Replay()],
});

export const handleError = handleErrorWithSentry() satisfies HandleClientError;
