import {
    PUBLIC_APP_ENV,
    PUBLIC_SENTRY_DSN,
    PUBLIC_SENTRY_RELEASE,
    PUBLIC_SENTRY_SAMPLE_RATE,
} from "$env/static/public";

import * as Sentry from "@sentry/sveltekit";
import { handleErrorWithSentry, Replay } from "@sentry/sveltekit";
import type { HandleClientError } from "@sveltejs/kit";

Sentry.init({
    environment: PUBLIC_APP_ENV,
    dsn: PUBLIC_SENTRY_DSN,
    tracesSampleRate: Number(PUBLIC_SENTRY_SAMPLE_RATE) / 3,
    profilesSampleRate: Number(PUBLIC_SENTRY_SAMPLE_RATE) / 2,
    replaysSessionSampleRate: Number(PUBLIC_SENTRY_SAMPLE_RATE) / 10,
    replaysOnErrorSampleRate: Number(PUBLIC_SENTRY_SAMPLE_RATE) / 5,
    integrations: [new Replay()],
    release: PUBLIC_SENTRY_RELEASE,
});

export const handleError = handleErrorWithSentry() satisfies HandleClientError;
