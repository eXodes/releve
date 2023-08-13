<script lang="ts">
    import { enhance } from "$app/forms";

    import forgotPasswordSuite, {
        type ForgotPasswordPayload,
    } from "$features/authentication/validations/forgot-password";
    import { form } from "$client/stores/form";
    import type { ValidationError } from "$client/types/error";
    import type { MessageResponse } from "$client/types/response";
    import { Color } from "$client/enums/theme";

    import Alert from "$client/components/shared/alert.svelte";
    import Button from "$client/components/shared/button.svelte";
    import TextInput from "$client/components/shared/text-input.svelte";

    import type { SubmitFunction } from "@sveltejs/kit";
    import { createEventDispatcher, onMount } from "svelte";
    import { camelCase } from "lodash-es";
    import type { SuiteRunResult } from "vest";

    let result: SuiteRunResult;
    let user: ForgotPasswordPayload = {
        email: "",
    };

    const dispatch = createEventDispatcher<{
        success: void;
    }>();

    const handleChange = ({ detail }: CustomEvent<{ name: string; value: string }>) => {
        user = {
            ...user,
            [camelCase(detail.name)]: detail.value,
        };

        result = forgotPasswordSuite(user, detail.name);
        form.validatedErrors(result.getErrors());
    };

    const handleSubmit: SubmitFunction<MessageResponse, ValidationError> = () => {
        form.submit();

        return async ({ result, update }) => {
            if (result.type === "failure") {
                if (result.data?.code === "ValidationError" && result.data?.errors) {
                    form.validatedErrors(result.data.errors);
                }
            }

            if (result.type === "error") {
                form.submitError({ message: result.error.message });
            }

            if (result.type === "success") {
                form.submitSuccess({ message: result.data?.message });

                await update();

                dispatch("success");
            }
        };
    };

    onMount(() => {
        form.reset();
    });

    $: disabled = result?.hasErrors() || !result?.isValid();
</script>

<form action="/forgot-password" method="post" use:enhance={handleSubmit} class="space-y-6">
    <div>
        <TextInput
            label="Email address"
            type="email"
            id="email"
            name="email"
            autocomplete="email"
            inputmode="email"
            required
            errors={$form.errors["email"]}
            on:input={handleChange}
        />
    </div>

    <Alert show={$form.isSuccess} color={Color.SUCCESS}>
        {$form.message} Please check your email.
    </Alert>

    <Alert show={$form.isError} color={Color.DANGER}>
        {$form.message}
    </Alert>

    <div>
        <Button
            type="submit"
            block={true}
            color={Color.PRIMARY}
            disabled={disabled}
            isLoading={$form.isLoading}
        >
            Send link
        </Button>
    </div>
</form>
