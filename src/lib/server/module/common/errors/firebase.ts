export class FirebaseError extends Error {
    public name: "FirebaseError";
    public code: string;
    public status: number;

    constructor(code: string, message: string) {
        super(message);
        this.name = "FirebaseError";
        this.code = code;
        this.status = 400;
    }
}
