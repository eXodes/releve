export class AuthError extends Error {
    public code: "AuthError";
    public status: number;

    constructor(message: string, status: number) {
        super(message);
        this.code = "AuthError";
        this.status = status;
    }
}
