import type { ValidationError as ValidationErrorInterface } from "$client/types/error";

export class ValidationError extends Error {
    public name: "ValidationError";
    public status: number;
    public errors: Record<string, string[]> | undefined;

    constructor(message: string, errors?: Record<string, string[]>) {
        super(message);
        this.name = "ValidationError";
        this.status = 400;
        this.errors = errors;
    }

    toJSON(): ValidationErrorInterface {
        return {
            name: this.name,
            message: this.message,
            status: this.status,
            errors: this.errors,
        };
    }
}
