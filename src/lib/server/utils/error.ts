import { FirebaseError } from "$module/common/errors/firebase";
import { ValidationError } from "$module/common/errors/validation";

import { error } from "@sveltejs/kit";
import * as Sentry from "@sentry/sveltekit";

export const handleApiError = (err: unknown, status?: number) => {
    if (err instanceof ValidationError) {
        return error(400, {
            status: 400,
            code: "ValidationError",
            message: err.message,
        });
    }

    if (err instanceof FirebaseError) {
        return error(400, {
            status: 400,
            code: err.code,
            message: err.message,
        });
    }

    if (err instanceof Error) {
        return error(status ?? 400, {
            status: status ?? 400,
            code: "RequestError",
            message: err.message,
            stack: err.stack,
        });
    }

    Sentry.captureException(err);

    return error(500, {
        status: 500,
        code: "InternalError",
        message: "An internal error has occurred.",
    });
};
