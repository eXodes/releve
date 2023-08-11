export type ValidationError = {
    code: "ValidationError";
    message: string;
    errors: Record<string, string[]> | undefined;
};
