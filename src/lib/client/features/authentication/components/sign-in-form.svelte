<script lang="ts">
    import { enhance } from "$app/forms";
    import { invalidate } from "$app/navigation";
    import { page } from "$app/stores";
    import { Color } from "$client/enums/theme";
    import type { MessageResponse } from "$client/types/response";
    import { handleAuthCatch } from "$features/authentication/errors";
    import { AuthService } from "$features/authentication/services";
    import { signInSuite, type SignInPayload } from "$features/authentication/validations/sign-in";

    import Alert from "$client/components/shared/alert.svelte";
    import Button from "$client/components/shared/button.svelte";
    import CheckboxInput from "$client/components/shared/checkbox-input.svelte";
    import PasswordInput from "$client/components/shared/password-input.svelte";
    import TextInput from "$client/components/shared/text-input.svelte";
    import Tooltip from "$client/components/shared/tooltip.svelte";

    import type { SubmitFunction } from "@sveltejs/kit";
    import { FirebaseError } from "firebase/app";
    import { AuthErrorCodes } from "firebase/auth";
    import { camelCase } from "lodash-es";

    import { createEventDispatcher, onMount } from "svelte";
    import { Icon, QuestionMarkCircle } from "svelte-hero-icons";
    import type { SuiteRunResult } from "vest";

    const dispatch = createEventDispatcher<{
        success: void;
    }>();

    let result: SuiteRunResult;
    let errors: { [key: string]: string[] } = {};
    let successMessage: string | undefined = undefined;
    let errorMessage: string | undefined = undefined;

    let failedUid: string | undefined = undefined;

    let user: SignInPayload = {
        email: "",
        password: "",
        rememberMe: false,
    };

    const handleChange = ({ detail }: CustomEvent<{ name: string; value: string }>) => {
        user = {
            ...user,
            [camelCase(detail.name)]: detail.value,
        };
        result = signInSuite(user, detail.name);
        errors = result.getErrors();
    };

    const invalidateSession = () => {
        const timeout = setTimeout(() => invalidate("session"), 1000);

        return () => clearTimeout(timeout);
    };

    const handleSignIn = async () => {
        successMessage = errorMessage = undefined;

        try {
            const data = await AuthService.signIn(user.email, user.password, user.rememberMe);

            successMessage = data.message;

            invalidateSession();
            dispatch("success");
        } catch (error) {
            const data = handleAuthCatch(error);

            errorMessage = data.message;

            if (
                "code" in data &&
                data.code === AuthErrorCodes.UNVERIFIED_EMAIL &&
                typeof data.uid === "string"
            ) {
                failedUid = data.uid;
            }
        }
    };

    const validateEmail = async ({ actionCode, uid }: { actionCode: string; uid: string }) => {
        let timeout: ReturnType<typeof setTimeout>;

        try {
            await AuthService.verifyEmail(uid, actionCode);

            successMessage = "Email verified successfully. Please sign in.";

            timeout = setTimeout(() => {
                successMessage = undefined;
            }, 3000);
        } catch (error) {
            const data = handleAuthCatch(error);

            if (error instanceof FirebaseError) {
                errorMessage = data?.message;

                if (
                    error.code === AuthErrorCodes.INVALID_OOB_CODE ||
                    error.code === AuthErrorCodes.EXPIRED_OOB_CODE
                ) {
                    failedUid = uid;
                }
            }
        }

        return () => {
            if (timeout) {
                clearTimeout(timeout);
            }
        };
    };

    const handleResendValidation: SubmitFunction<MessageResponse> =
        () =>
        ({ result }) => {
            if (result.type === "success") {
                errorMessage = undefined;
                successMessage = result.data?.message;
            }
        };

    onMount(() => {
        const actionCode = $page.url.searchParams.get("actionCode");
        const uid = $page.url.searchParams.get("uid");

        if (actionCode && uid) {
            validateEmail({ actionCode, uid });
        }
    });

    $: disabled = result?.hasErrors() || !result?.isValid();
</script>

<form on:submit|preventDefault={handleSignIn} class="space-y-6">
    <div>
        <TextInput
            label="Email address"
            id="email"
            name="email"
            type="email"
            autocomplete="email"
            required
            errors={errors["email"]}
            on:input={handleChange}
        />
    </div>

    <div class="space-y-1">
        <PasswordInput
            label="Password"
            id="password"
            name="password"
            type="password"
            autocomplete="current-password"
            minLength={8}
            required
            errors={errors["password"]}
            on:input={handleChange}
        />
    </div>

    <div class="flex items-center gap-2">
        <CheckboxInput
            label="Remember me"
            id="remember-me"
            name="remember-me"
            bind:checked={user.rememberMe}
        />

        <Tooltip
            content="If checked, your session will be remembered for 7 days. Otherwise, it will be remembered for 1 day."
        >
            <Icon
                src={QuestionMarkCircle}
                solid
                class="h-5 w-5 text-gray-500 hover:text-gray-600"
            />
            <span class="sr-only">Remember me information tooltip</span>
        </Tooltip>
    </div>

    <Alert show={!!successMessage} color={Color.SUCCESS}>
        {successMessage}
    </Alert>

    <Alert show={!!errorMessage} color={Color.DANGER}>
        {errorMessage}

        {#if failedUid}
            <form
                action="?/resend-verification"
                method="POST"
                use:enhance={handleResendValidation}
                class="mt-2"
            >
                <button
                    type="submit"
                    name="uid"
                    value={failedUid}
                    class="inline-flex items-center gap-0.5 font-medium text-rose-600 hover:text-rose-500 hover:underline hover:decoration-rose-500 hover:decoration-2"
                >
                    Resend verification email
                </button>
            </form>
        {/if}
    </Alert>

    <div>
        <Button type="submit" block={true} color={Color.PRIMARY} disabled={disabled}>
            Sign in
        </Button>
    </div>
</form>
