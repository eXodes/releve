<script lang="ts">
    import { enhance } from "$app/forms";
    import { Color } from "$client/enums/theme";
    import { signUpSuite, type SignUpPayload } from "$features/authentication/validations/sign-up";
    import type { ValidationError } from "$client/types/error";

    import Alert from "$client/components/shared/alert.svelte";
    import Button from "$client/components/shared/button.svelte";
    import PasswordInput from "$client/components/shared/password-input.svelte";
    import TextInput from "$client/components/shared/text-input.svelte";

	import type { SubmitFunction } from "@sveltejs/kit";
    import { createEventDispatcher } from "svelte";
    import { camelCase } from "lodash-es";
    import type { SuiteRunResult } from "vest";

    let result: SuiteRunResult;
    let errors: { [key: string]: string[] } = {};
    let errorMessage: string | undefined = undefined;
    let successMessage: string | undefined = undefined;

    let user: SignUpPayload = {
        displayName: "",
        email: "",
        password: "",
        confirmPassword: "",
    };

    const dispatch = createEventDispatcher<{
        success: void;
    }>();

    const handleChange = ({ detail }: CustomEvent<{ name: string; value: string }>) => {
        user = {
            ...user,
            [camelCase(detail.name)]: detail.value,
        };
        result = signUpSuite(user, detail.name);

        result.done((res) => {
            result = res as SuiteRunResult;
            errors = result.getErrors();
        });
    };

    const handleSubmit: SubmitFunction<{ message: string }, ValidationError> =
        () =>
        async ({ result, update }) => {
            if (result.type === "failure") {
                if (result.data?.name === "ValidationError" && result.data?.errors) {
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

<form action="/sign-up" method="post" use:enhance={handleSubmit} class="space-y-6">
    <div>
        <TextInput
            label="Display name"
            id="name"
            name="display-name"
            autocomplete="name"
            required
            errors={errors["display-name"]}
            on:input={handleChange}
        />
    </div>

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

    <div>
        <PasswordInput
            label="Password"
            id="password"
            name="password"
            autocomplete="new-password"
            minLength={8}
            required
            errors={errors["password"]}
            on:input={handleChange}
        />
    </div>

    <div>
        <PasswordInput
            label="Confirm password"
            id="confirm-password"
            name="confirm-password"
            autocomplete="confirm-new-password"
            minLength={8}
            required
            errors={errors["confirm-password"]}
            on:input={handleChange}
        />
    </div>

    <Alert show={!!successMessage} color={Color.SUCCESS}>
        {successMessage} Please check your email for a verification link.
    </Alert>

    <Alert show={!!errorMessage} color={Color.DANGER}>
        {errorMessage}
    </Alert>

    <div>
        <Button type="submit" block={true} color={Color.PRIMARY} disabled={disabled}>
            Sign up
        </Button>
    </div>
</form>
