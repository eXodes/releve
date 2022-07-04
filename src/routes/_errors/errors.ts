export class ValidationError extends Error {
    name: "VerificationError";
    public status: number;

    constructor(message: string) {
        super(message);
        this.name = "VerificationError";
        this.status = 400;
    }
}
