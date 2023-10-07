<script lang="ts">
    import { enhance } from "$app/forms";
    import { createForm } from "$client/stores/form";

    import forgotPasswordSuite, {
        type ForgotPasswordPayload,
    } from "$features/authentication/validations/forgot-password";
    import { Color } from "$client/enums/theme";

    import Alert from "$client/components/shared/alert.svelte";
    import Button from "$client/components/shared/button.svelte";
    import TextInput from "$client/components/shared/text-input.svelte";

    import { createEventDispatcher, onMount } from "svelte";

    const { form, errors, change, reset, enhanceHandler } = createForm<ForgotPasswordPayload>({
        initialValues: {
            email: "",
        },
        validationSuite: forgotPasswordSuite,
    });

    const dispatch = createEventDispatcher<{
        success: void;
    }>();

    onMount(() => {
        reset();
    });

    $: disabled = !$form.isValid;
</script>

<form
    action="/forgot-password"
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
