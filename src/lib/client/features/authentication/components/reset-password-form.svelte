<script lang="ts">
    import { goto } from "$app/navigation";
    import { page } from "$app/stores";

    import { handleAuthCatch } from "$features/authentication/errors";
    import { AuthService } from "$features/authentication/services";
    import resetPasswordSuite, {
        type ResetPasswordPayload,
    } from "$features/authentication/validations/reset-password";
    import { form } from "$client/stores/form";
    import { Color } from "$client/enums/theme";

    import Alert from "$client/components/shared/alert.svelte";
    import Button from "$client/components/shared/button.svelte";
    import PasswordInput from "$client/components/shared/password-input.svelte";

    import { camelCase } from "lodash-es";
    import { onMount } from "svelte";
    import type { SuiteRunResult } from "vest";

    let formElement: HTMLFormElement;
    let result: SuiteRunResult;

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
        result = resetPasswordSuite(user, detail.name);
        form.validatedErrors(result.getErrors());
    };

    const handleReset = async () => {
        let timeout: ReturnType<typeof setTimeout>;

        form.submit();

        if (!actionCode) {
            return form.submitError({
                message:
                    "The action code is invalid. Please check the link in the email and try again.",
            });
        }

        try {
            const { message } = await AuthService.resetPassword(user.password, actionCode);

            form.submitSuccess({ message });
            resetForm();

            timeout = setTimeout(() => {
                goto("/sign-in");
            }, 5000);
        } catch (error) {
            const data = handleAuthCatch(error);

            form.submitError({ message: data.message });
        }

        return () => clearTimeout(timeout);
    };

    onMount(() => {
        if (!actionCode) {
            form.submitError({
                message:
                    "The action code is invalid. Please check the link in the email and try again.",
            });
            return;
        }

        AuthService.checkActionCode(actionCode).catch((error) => {
            const data = handleAuthCatch(error);
            form.submitError({ message: data.message });
        });
    });

    $: disabled = result?.hasErrors() || !result?.isValid() || $form.isSuccess;
</script>

<form on:submit|preventDefault={handleReset} class="space-y-6" bind:this={formElement}>
    <div>
        <PasswordInput
            label="Password"
            type="password"
            id="password"
            name="password"
            autocomplete="new-password"
            minlength={8}
            required
            errors={$form.errors["password"]}
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
            minlength={8}
            required
            errors={$form.errors["confirm-password"]}
            on:input={handleChange}
        />
    </div>

    <Alert show={$form.isSuccess} color={Color.SUCCESS}>
        {$form.message} Please <a class="underline" href="/sign-in">sign in</a> to continue.
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
            Update password
        </Button>
    </div>
</form>
