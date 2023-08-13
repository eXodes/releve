import { derived, writable } from "svelte/store";

type FormStatus = "idle" | "submitting" | "submitted" | "error";

interface FormState<T = undefined> {
    status: FormStatus;
    data?: T;
    errors: Record<string, string[]>;
    message?: string;
}

const createFormStore = <T = undefined>() => {
    const _state = writable<FormState<T>>({
        status: "idle",
        data: undefined,
        errors: {},
        message: undefined,
    });

    const validatedErrors = (errors: Record<string, string[]>) => {
        _state.update((state) => {
            return {
                ...state,
                status: Object.keys(errors).length > 0 ? "error" : state.status,
                errors,
            };
        });
    };

    const submit = () => {
        _state.update((state) => {
            return {
                ...state,
                status: "submitting",
                message: undefined,
                errors: {},
            };
        });
    };

    const submitSuccess = (data?: { message?: string }) => {
        _state.update((state) => {
            return {
                ...state,
                status: "submitted",
                message: data?.message,
            };
        });
    };

    const submitError = (data?: { message?: string }) => {
        _state.update((state) => {
            return {
                ...state,
                status: "error",
                message: data?.message,
            };
        });
    };

    const reset = () => {
        _state.update((state) => {
            return {
                ...state,
                status: "idle",
                message: undefined,
                errors: {},
            };
        });
    };

    const formState = derived(_state, ($_state) => {
        return {
            data: $_state.data,
            message: $_state.message,
            errors: $_state.errors,
            isLoading: $_state.status === "submitting",
            isError: $_state.status === "error" && $_state.message !== undefined,
            isSuccess: $_state.status === "submitted",
        };
    });

    const subscribe = formState.subscribe;

    return {
        subscribe,
        validatedErrors,
        submit,
        submitSuccess,
        submitError,
        reset,
    };
};

export const form = createFormStore();
