<script lang="ts">
    import { enhance } from "$app/forms";
    import { createForm } from "$client/stores/form";

    import signUpSuite, { type SignUpPayload } from "$features/authentication/validations/sign-up";
    import { Color } from "$client/enums/theme";

    import Alert from "$client/components/shared/alert.svelte";
    import Button from "$client/components/shared/button.svelte";
    import PasswordInput from "$client/components/shared/password-input.svelte";
    import TextInput from "$client/components/shared/text-input.svelte";

    import { createEventDispatcher } from "svelte";

    const { form, change, errors, enhanceHandler } = createForm<SignUpPayload>({
        initialValues: {
            displayName: "",
            email: "",
            password: "",
            confirmPassword: "",
        },
        validationSuite: signUpSuite,
    });

    const dispatch = createEventDispatcher<{
        success: void;
    }>();

    $: disabled = !$form.isValid || $form.isSuccess;
</script>

<form
    action="/sign-up"
    method="post"
    use:enhance={enhanceHandler({
        onSuccess: () => {
            dispatch("success");
        },
    })}
    class="space-y-6"
>
    <div>
        <TextInput
            label="Display name"
            id="name"
            name="display-name"
            autocomplete="name"
            required
            errors={$errors["display-name"]}
            on:input={change}
        />
    </div>

    <div>
        <TextInput
            label="Email address"
            type="email"
            id="email"
            name="email"
            autocomplete="email"
            inputmode="email"
            required
            errors={$errors["email"]}
            on:input={change}
        />
    </div>

    <div>
        <PasswordInput
            label="Password"
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
        {$form.message} Please check your email for a verification link.
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
            Sign up
        </Button>
    </div>
</form>
