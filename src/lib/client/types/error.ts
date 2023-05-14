export type ValidationError = {
    name: "ValidationError";
    message: string;
    status: number;
    errors: Record<string, string[]> | undefined;
};
