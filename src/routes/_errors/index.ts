import { ValidationError } from "$routes/_errors/errors";

export const handleError = (error: unknown, status?: number) => {
    if (error instanceof ValidationError) {
        return {
            status: error.status,
            body: {
                error: JSON.parse(error.message),
            },
        };
    }

    if (error instanceof Error) {
        return {
            status: status ?? 400,
            body: { error: error.message },
        };
    }

    return {
        status: 500,
        body: { error: "An internal error has occurred." },
    };
};
