import type { ValidationError } from "$client/types/error";
import type { MessageResponse } from "$client/types/response";

import type { MaybePromise, SubmitFunction } from "@sveltejs/kit";
import { derived, type Readable, type Writable, writable } from "svelte/store";
import type { Suite, SuiteResult } from "vest";
import { camelCase } from "lodash-es";

interface FormStoreOptions<ValueType extends Record<string, unknown>> {
    initialValues?: Partial<ValueType>;
    validationSuite?: Suite<string, string, (data: ValueType, field?: string) => void>;
}

interface FormInternalState {
    status: "idle" | "submitting" | "submitted" | "error";
    message?: string;
}

interface FormState<T extends Record<string, unknown> = Record<string, unknown>> {
    data: T;
    message?: string;
    isValid: boolean;
    isLoading: boolean;
    isSuccess: boolean;
    isError: boolean;
}

type Cleanup = () => void;

export type PendingHandler = (result: { formData: FormData }) => MaybePromise<void> | Cleanup;

export type SuccessHandler = (result: {
    formData: FormData;
    message?: string;
    update: (options?: { reset: boolean } | undefined) => Promise<void>;
}) => MaybePromise<void> | Cleanup;

export type ErrorHandler = (result: {
    formData: FormData;
    message: string;
    errors?: Record<string, string[]>;
}) => MaybePromise<void> | Cleanup;

export interface EnhanceHandlerOptions {
    onPending?: PendingHandler;
    onSuccess?: SuccessHandler;
    onError?: ErrorHandler;
}

interface FormStore<DataType extends Record<string, unknown>> {
    form: Readable<FormState<DataType>>;
    validate: (data: { formData: DataType; field?: string }) => void;
    change: (
        event: CustomEvent<{ name: string; value: string | string[] | boolean | File }>
    ) => void;
    setValue: (name: string, value: string | string[] | boolean | File) => void;
    setValues: (values: DataType) => void;
    setValidationErrors: (errors: Record<string, string[]>) => void;
    submit: (submitFn?: (data: DataType) => void) => void;
    submitSuccess: (result?: { message?: string }) => void;
    submitError: (result?: { message?: string }) => void;
    reset: () => void;
    errors: Readable<Record<string, string[]>>;
    enhanceHandler: (
        options?: EnhanceHandlerOptions
    ) => SubmitFunction<MessageResponse, ValidationError>;
}

export const createForm = <DataType extends Record<string, unknown>>(
    options?: FormStoreOptions<DataType>
): FormStore<DataType> => {
    const { initialValues = {}, validationSuite } = options ?? {};

    const _state = writable<FormInternalState>({
        status: "idle",
        message: undefined,
    });

    const _data = writable<DataType>(initialValues as DataType);

    const _result = writable<SuiteResult<string, string> | undefined>();

    const resetFormStateHandler = () => {
        _state.update((state) => {
            return {
                ...state,
                status: "idle",
                message: undefined,
            };
        });
    };

    const validateHandler = ({ formData, field }: { formData: DataType; field?: string }) => {
        if (validationSuite) {
            const validationResult = validationSuite(formData, field);

            validationResult.done((result) => {
                _result.set(result);
            });
        }
    };

    const changeHandler = ({
        detail,
    }: CustomEvent<{ name: string; value: string | string[] | boolean | File }>) => {
        _data.update((data) => {
            const newFormData = {
                ...data,
                [camelCase(detail.name)]: detail.value,
            };

            validateHandler({
                formData: newFormData,
                field: detail.name,
            });

            return newFormData;
        });
    };

    const setValueHandler = (name: string, value: string | string[] | boolean | File) => {
        _data.update((data) => {
            const newFormData = {
                ...data,
                [camelCase(name)]: value,
            };

            validateHandler({
                formData: newFormData,
                field: name,
            });

            return newFormData;
        });
    };

    const setValuesHandler = (formData: DataType) => {
        _data.set(formData);

        validateHandler({
            formData,
        });
    };

    const submitHandler = (submitFn?: (data: DataType) => MaybePromise<void>) => {
        _state.update((state) => {
            return {
                ...state,
                status: "submitting",
                message: undefined,
            };
        });

        let isValid = false;

        formState.subscribe((state) => {
            isValid = state.isValid;
        });

        if (!isValid) return;

        if (!submitFn) return;

        const unsubscribe = _data.subscribe(async (data) => {
            await submitFn(data);
        });

        unsubscribe();
    };

    const setValidationErrorsHandler = (errors: Record<string, string[]>) => {
        _state.update((state) => {
            return {
                ...state,
                status: Object.keys(errors).length > 0 ? "error" : state.status,
                errors,
            };
        });
    };

    const submitSuccessHandler = (result?: { message?: string }) => {
        _state.update((state) => {
            return {
                ...state,
                status: "submitted",
                message: result?.message,
            };
        });
    };

    const submitErrorHandler = (result?: { message?: string }) => {
        _state.update((state) => {
            return {
                ...state,
                status: "error",
                message: result?.message,
            };
        });
    };

    const errors = derived<
        Writable<SuiteResult<string, string> | undefined>,
        Record<string, string[]>
    >(_result, ($_result, set) => {
        if (!$_result) {
            set({});
            return;
        }

        set($_result.getErrors() ?? {});
    });

    const formState = derived([_data, _state, _result], ([$_data, $_state, $_result]) => {
        return {
            data: $_data,
            message: $_state.message,
            isValid: $_result?.isValid() ?? false,
            isLoading: $_state.status === "submitting",
            isSuccess: $_state.status === "submitted",
            isError: $_state.status === "error" && $_state.message !== undefined,
        } satisfies FormState<DataType>;
    });

    const enhanceHandler: FormStore<DataType>["enhanceHandler"] = (options) => {
        return async ({ formData }) => {
            submitHandler();
            options?.onPending?.({ formData });

            return async ({ result, update }) => {
                if (result.type === "failure") {
                    if (result.data?.code === "ValidationError" && result.data?.errors) {
                        setValidationErrorsHandler(result.data.errors);

                        options?.onError?.({
                            formData,
                            message: result.data.message,
                            errors: result.data.errors,
                        });
                    }
                }

                if (result.type === "error") {
                    submitErrorHandler({ message: result.error.message });

                    options?.onError?.({
                        formData,
                        message: result.error.message,
                    });
                }

                if (result.type === "success") {
                    submitSuccessHandler({ message: result.data?.message });

                    options?.onSuccess?.({
                        formData,
                        message: result.data?.message,
                        update,
                    });
                }
            };
        };
    };

    return {
        form: { subscribe: formState.subscribe },
        errors,
        validate: validateHandler,
        change: changeHandler,
        setValue: setValueHandler,
        setValues: setValuesHandler,
        submit: submitHandler,
        setValidationErrors: setValidationErrorsHandler,
        submitSuccess: submitSuccessHandler,
        submitError: submitErrorHandler,
        reset: resetFormStateHandler,
        enhanceHandler,
    };
};
