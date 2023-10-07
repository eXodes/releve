<script lang="ts">
    import { goto } from "$app/navigation";
    import { page } from "$app/stores";
    import { createForm } from "$client/stores/form";

    import { handleAuthCatch } from "$features/authentication/errors";
    import { AuthService } from "$features/authentication/services";
    import resetPasswordSuite, {
        type ResetPasswordPayload,
    } from "$features/authentication/validations/reset-password";
    import { Color } from "$client/enums/theme";

    import Alert from "$client/components/shared/alert.svelte";
    import Button from "$client/components/shared/button.svelte";
    import PasswordInput from "$client/components/shared/password-input.svelte";

    import { onMount } from "svelte";

    let formElement: HTMLFormElement;

    const actionCode = $page.url.searchParams.get("actionCode");

    const { form, errors, change, submit, submitError, submitSuccess } =
        createForm<ResetPasswordPayload>({
            initialValues: {
                password: "",
                confirmPassword: "",
            },
            validationSuite: resetPasswordSuite,
        });

    const handleReset = async () => {
        let timeout: ReturnType<typeof setTimeout>;

        if (!actionCode) {
            return submitError({
                message:
                    "The action code is invalid. Please check the link in the email and try again.",
            });
        }

        submit(async (form) => {
            try {
                const { message } = await AuthService.resetPassword(form.password, actionCode);

                submitSuccess({ message });
                formElement.reset();

                timeout = setTimeout(() => {
                    goto("/sign-in");
                }, 5000);
            } catch (error) {
                const data = handleAuthCatch(error);

                submitError({ message: data.message });
            }
        });

        return () => clearTimeout(timeout);
    };

    onMount(() => {
        if (!actionCode) {
            submitError({
                message:
                    "The action code is invalid. Please check the link in the email and try again.",
            });
            return;
        }

        AuthService.checkActionCode(actionCode).catch((error) => {
            const data = handleAuthCatch(error);
            submitError({ message: data.message });
        });
    });

    $: disabled = !$form.isValid || $form.isSuccess;
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
            errors={$errors["password"]}
            on:input={change}
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
            errors={$errors["confirm-password"]}
            on:input={change}
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
