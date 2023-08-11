import { dev } from "$app/environment";
import { AuthError } from "$module/common/errors/auth";
import { FirebaseError } from "$module/common/errors/firebase";
import { ValidationError } from "$module/common/errors/validation";

import { error, fail } from "@sveltejs/kit";

export const handleApiError = (err: unknown, status?: number) => {
    if (err instanceof ValidationError) {
        return fail(400, err.toJSON());
    }

    if (err instanceof AuthError) {
        return error(err.status, {
            status: err.status,
            code: err.code,
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
        if (dev) {
            return error(status ?? 400, {
                status: status ?? 400,
                code: "RequestError",
                message: err.message,
                stack: err.stack,
            });
        } else {
            return error(status ?? 400, {
                status: status ?? 400,
                code: "RequestError",
                message: err.message,
            });
        }
    }

    return error(500, {
        status: 500,
        code: "InternalError",
        message: "An internal error has occurred.",
    });
};
