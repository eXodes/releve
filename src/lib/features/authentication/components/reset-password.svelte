<script lang="ts">
    import type { SuiteRunResult } from "vest";
    import type { ResetPasswordDto } from "$features/authentication/validations/reset-password";

    import { onMount } from "svelte";
    import { camelCase } from "lodash-es";

    import suite from "$features/authentication/validations/reset-password";
    import { AuthService } from "$features/authentication/services";
    import { handleAuthCatch } from "$features/authentication/errors";
    import { page } from "$app/stores";
    import { Color } from "$enums/theme";

    import Alert from "$components/shared/alert.svelte";
    import TextInput from "$components/shared/text-input.svelte";
    import Button from "$components/shared/button.svelte";

    let result: SuiteRunResult;
    let errors: { [key: string]: string[] } = {};
    let errorMessage: string | undefined = undefined;
    let successMessage: string | undefined = undefined;

    let user: ResetPasswordDto = {
        password: "",
        confirmPassword: "",
    };

    const actionCode = $page.url.searchParams.get("actionCode");

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
        } catch (error) {
            errorMessage = handleAuthCatch(error);
        }
    };

    onMount(() => {
        if (!actionCode) {
            errorMessage =
                "The action code is invalid. Please check the link in the email and try again.";

            return;
        }

        AuthService.checkActionCode(actionCode).catch((error) => {
            errorMessage = handleAuthCatch(error);
        });
    });

    $: disabled = result?.hasErrors() || !result?.isValid();
</script>

<form on:submit|preventDefault={handleReset} class="space-y-6">
    <div>
        <TextInput
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
        <TextInput
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
