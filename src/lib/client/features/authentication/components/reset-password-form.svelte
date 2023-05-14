<script lang="ts">
    import { goto } from "$app/navigation";
    import { page } from "$app/stores";
    import { Color } from "$client/enums/theme";
    import { handleAuthCatch } from "$features/authentication/errors";
    import { AuthService } from "$features/authentication/services";
    import suite, {
        type ResetPasswordPayload,
    } from "$features/authentication/validations/reset-password";

    import Alert from "$client/components/shared/alert.svelte";
    import Button from "$client/components/shared/button.svelte";
    import PasswordInput from "$client/components/shared/password-input.svelte";

    import { camelCase } from "lodash-es";
    import { onMount } from "svelte";
    import type { SuiteRunResult } from "vest";

    let formElement: HTMLFormElement;
    let result: SuiteRunResult;
    let errors: { [key: string]: string[] } = {};
    let errorMessage: string | undefined = undefined;
    let successMessage: string | undefined = undefined;

    let user: ResetPasswordPayload = {
        password: "",
        confirmPassword: "",
    };

    const actionCode = $page.url.searchParams.get("actionCode");

    const resetForm = () => {
        formElement.reset();
        user = {
            password: "",
            confirmPassword: "",
        };
    };

    const handleChange = ({ detail }: CustomEvent<{ name: string; value: string }>) => {
        user = {
            ...user,
            [camelCase(detail.name)]: detail.value,
        };
        result = suite(user, detail.name);
        errors = result.getErrors();
    };

    const handleReset = async () => {
        successMessage = errorMessage = undefined;

        if (!actionCode) {
            errorMessage =
                "The action code is invalid. Please check the link in the email and try again.";
            return;
        }

        try {
            const { message } = await AuthService.resetPassword(user.password, actionCode);

            successMessage = message;
            resetForm();

            const timeout = setTimeout(() => {
                goto("/sign-in");
            }, 5000);

            return () => clearTimeout(timeout);
        } catch (error) {
            const data = handleAuthCatch(error);
            errorMessage = data.message;
        }
    };

    onMount(() => {
        if (!actionCode) {
            errorMessage =
                "The action code is invalid. Please check the link in the email and try again.";

            return;
        }

        AuthService.checkActionCode(actionCode).catch((error) => {
            const data = handleAuthCatch(error);
            errorMessage = data.message;
        });
    });

    $: disabled = result?.hasErrors() || !result?.isValid() || !!errorMessage || !!successMessage;
</script>

<form on:submit|preventDefault={handleReset} class="space-y-6" bind:this={formElement}>
    <div>
        <PasswordInput
            label="Password"
            type="password"
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
            type="password"
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
        {successMessage} Please <a class="underline" href="/sign-in">sign in</a> to continue.
    </Alert>

    <Alert show={!!errorMessage} color={Color.DANGER}>
        {errorMessage}
    </Alert>

    <div>
        <Button type="submit" block={true} color={Color.PRIMARY} disabled={disabled}>
            Update password
        </Button>
    </div>
</form>
