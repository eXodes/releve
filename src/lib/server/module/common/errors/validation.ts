import type { ValidationError as ValidationErrorInterface } from "$client/types/error";

export class ValidationError extends Error {
    public code: "ValidationError";
    public status: number;
    public errors: Record<string, string[]> | undefined;

    constructor(message: string, errors?: Record<string, string[]>) {
        super(message);
        this.code = "ValidationError";
        this.status = 400;
        this.errors = errors;
    }

    toJSON(): ValidationErrorInterface {
        return {
            code: this.code,
            message: this.message,
            errors: this.errors,
        };
    }
}
