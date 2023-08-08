export class AuthError extends Error {
    public name: "AuthError";
    public status: number;

    constructor(message: string, status: number) {
        super(message);
        this.name = "AuthError";
        this.status = status;
    }
}
