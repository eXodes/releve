<script lang="ts">
    import { enhance } from "$app/forms";

    import forgotPasswordSuite, {
        type ForgotPasswordPayload,
    } from "$features/authentication/validations/forgot-password";
    import type { ValidationError } from "$client/types/error";
    import type { MessageResponse } from "$client/types/response";
    import { Color } from "$client/enums/theme";

    import Alert from "$client/components/shared/alert.svelte";
    import Button from "$client/components/shared/button.svelte";
    import TextInput from "$client/components/shared/text-input.svelte";

    import type { SubmitFunction } from "@sveltejs/kit";
    import { createEventDispatcher } from "svelte";
    import { camelCase } from "lodash-es";
    import type { SuiteRunResult } from "vest";

    let result: SuiteRunResult;
    let errors: { [key: string]: string[] } = {};
    let errorMessage: string | undefined = undefined;
    let successMessage: string | undefined = undefined;

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
        errors = result.getErrors();
    };

    const handleSubmit: SubmitFunction<MessageResponse, ValidationError> =
        () =>
        async ({ result, update }) => {
            if (result.type === "failure") {
                if (result.data?.code === "ValidationError" && result.data?.errors) {
                    errors = result.data?.errors;
                }
            }

            if (result.type === "error") {
                errorMessage = result.error.message;
            }

            if (result.type === "success") {
                successMessage = result.data?.message;

                await update();

                dispatch("success");
            }
        };

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
            required
            errors={errors["email"]}
            on:input={handleChange}
        />
    </div>

    <Alert show={!!successMessage} color={Color.SUCCESS}>
        {successMessage} Please check your email.
    </Alert>

    <Alert show={!!errorMessage} color={Color.DANGER}>
        {errorMessage}
    </Alert>

    <div>
        <Button type="submit" block={true} color={Color.PRIMARY} disabled={disabled}>
            Send link
        </Button>
    </div>
</form>
