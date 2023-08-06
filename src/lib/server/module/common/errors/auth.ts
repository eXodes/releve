export class AuthError extends Error {
    public name: "AuthError";
    public status: number;

    constructor(message: string) {
        super(message);
        this.name = "AuthError";
        this.status = 401;
    }
}
