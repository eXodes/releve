import type { NumericRange } from "@sveltejs/kit";

export class AuthError extends Error {
    public code: "AuthError";
    public status: NumericRange<400, 599>;

    constructor(message: string, status: NumericRange<400, 599>) {
        super(message);
        this.code = "AuthError";
        this.status = status;
    }
}
