import { debounce } from "lodash-es";

import { invalidate } from "$app/navigation";

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

    const handleInvalid = debounce((e: Event) => {
        e.preventDefault();
        const input = e.target as HTMLInputElement;

        if (error)
            errors ? error([input.validationMessage, ...errors]) : error([input.validationMessage]);
    }, 100);

    input.addEventListener("input", handleInput);
    input.addEventListener("invalid", handleInvalid);

    return {
        destroy: () => {
            input.removeEventListener("input", handleInput);
            input.removeEventListener("invalid", handleInvalid);
        },
    };
};

export const enhance = (
    form: HTMLFormElement,
    {
        pending,
        error,
        result,
    }: {
        pending?: ({ data, form }: { data: FormData; form: HTMLFormElement }) => void;
        error?: ({
            data,
            form,
            response,
            error,
        }: {
            data: FormData;
            form: HTMLFormElement;
            response: Response | null;
            error: Error | null;
        }) => void;
        result?: ({
            data,
            form,
            response,
        }: {
            data: FormData;
            response: Response;
            form: HTMLFormElement;
        }) => void;
    } = {}
) => {
    const handleSubmit = async (e: SubmitEvent) => {
        e.preventDefault();

        const data = new FormData(form);

        if (pending) pending({ data, form });

        try {
            const response = await fetch(form.action, {
                method: form.method,
                headers: {
                    accept: "application/json",
                },
                body: data,
            });

            if (response.ok) {
                if (result) result({ data, form, response });

                const url = new URL(form.action);
                url.search = url.hash = "";

                await invalidate(url.href);
            } else if (error) {
                error({ data, form, error: null, response });
            } else {
                console.error(await response.text());
            }
        } catch (e) {
            if (error && e instanceof Error) {
                error({ data, form, error: e, response: null });
            } else {
                throw e;
            }
        }
    };

    form.addEventListener("submit", handleSubmit);

    return {
        destroy() {
            form.removeEventListener("submit", handleSubmit);
        },
    };
};
