export const validate = (
    input: HTMLInputElement | HTMLTextAreaElement,
    {
        errors,
        error,
    }: {
        errors: string[] | undefined;
        error?: (errors: string[] | undefined) => void;
    }
) => {
    const handleInput = (e: Event) => {
        const input = e.target as HTMLInputElement;

        const valid = input.reportValidity();

        if (valid && error) {
            error(errors ? errors : undefined);
        }
    };

    const handleInvalid = (e: Event) => {
        e.preventDefault();

        const input = e.target as HTMLInputElement;

        if (error)
            errors ? error([input.validationMessage, ...errors]) : error([input.validationMessage]);
    };

    input.addEventListener("input", handleInput);
    input.addEventListener("invalid", handleInvalid);

    return {
        destroy: () => {
            input.removeEventListener("input", handleInput);
            input.removeEventListener("invalid", handleInvalid);
        },
    };
};
