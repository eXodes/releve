<script lang="ts">
    import { enhance } from "$app/forms";
    import { invalidate } from "$app/navigation";
    import { page } from "$app/stores";

    import { handleAuthCatch } from "$features/authentication/errors";
    import { AuthService } from "$features/authentication/services";
    import signInSuite, { type SignInPayload } from "$features/authentication/validations/sign-in";
    import { createForm } from "$client/stores/form";
    import { analytics } from "$client/utils/firebase";
    import { Color } from "$client/enums/theme";
    import type { MessageResponse } from "$client/types/response";

    import Alert from "$client/components/shared/alert.svelte";
    import Button from "$client/components/shared/button.svelte";
    import CheckboxInput from "$client/components/shared/checkbox-input.svelte";
    import PasswordInput from "$client/components/shared/password-input.svelte";
    import TextInput from "$client/components/shared/text-input.svelte";
    import Tooltip from "$client/components/shared/tooltip.svelte";
    import * as Sentry from "@sentry/sveltekit";

    import type { SubmitFunction } from "@sveltejs/kit";
    import { FirebaseError } from "firebase/app";
    import { AuthErrorCodes } from "firebase/auth";
    import { setUserProperties } from "firebase/analytics";

    import { createEventDispatcher, onMount } from "svelte";
    import { Icon, QuestionMarkCircle } from "svelte-hero-icons";

    const dispatch = createEventDispatcher<{
        success: void;
    }>();

    let disabledResendValidation = false;

    let failedUid: string | undefined = undefined;

    const { form, errors, change, submit, submitSuccess, submitError, reset } =
        createForm<SignInPayload>({
            initialValues: {
                email: "",
                password: "",
                rememberMe: false,
            },
            validationSuite: signInSuite,
        });

    const invalidateSession = () => {
        const timeout = setTimeout(() => invalidate("session"), 1000);

        return () => clearTimeout(timeout);
    };

    const handleSignIn = async () => {
        submit(async (form) => {
            try {
                const data = await AuthService.signIn(form.email, form.password, form.rememberMe);

                submitSuccess({ message: data.message });

                invalidateSession();
                Sentry.setUser({ id: data.user.uid });
                setUserProperties(analytics, {
                    uid: data.user.uid,
                });

                dispatch("success");
            } catch (error) {
                const data = handleAuthCatch(error);

                submitError({ message: data.message });

                if (
                    "code" in data &&
                    data.code === AuthErrorCodes.UNVERIFIED_EMAIL &&
                    typeof data.uid === "string"
                ) {
                    failedUid = data.uid;
                }
            }
        });
    };

    const validateEmail = async ({ actionCode, uid }: { actionCode: string; uid: string }) => {
        let timeout: ReturnType<typeof setTimeout>;

        submit();

        try {
            await AuthService.verifyEmail(uid, actionCode);

            submitSuccess({ message: "Email verified successfully. Please sign in." });

            timeout = setTimeout(() => {
                reset();
            }, 3000);
        } catch (error) {
            const data = handleAuthCatch(error);

            submitError({ message: data?.message });

            if (error instanceof FirebaseError) {
                if (
                    error.code === AuthErrorCodes.INVALID_OOB_CODE ||
                    error.code === AuthErrorCodes.EXPIRED_OOB_CODE
                ) {
                    failedUid = uid;
                }
            }
        }

        return () => {
            clearTimeout(timeout);
        };
    };

    const handleResendValidation: SubmitFunction<MessageResponse> = () => {
        disabledResendValidation = true;

        return ({ result }) => {
            if (result.type === "success") {
                submitSuccess({ message: result.data?.message });
            }
        };
    };

    onMount(() => {
        reset();
        const actionCode = $page.url.searchParams.get("actionCode");
        const uid = $page.url.searchParams.get("uid");

        if (actionCode && uid) {
            validateEmail({ actionCode, uid });
        }
    });

    $: disabled = !$form.isValid || $form.isSuccess;
</script>

<form on:submit|preventDefault={handleSignIn} class="space-y-6">
    <div>
        <TextInput
            label="Email address"
            id="email"
            name="email"
            type="email"
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
            type="password"
            autocomplete="current-password"
            minlength={8}
            required
            errors={$errors["password"]}
            on:input={change}
        />
    </div>

    <div class="flex items-center gap-2">
        <CheckboxInput
            label="Remember me"
            id="remember-me"
            name="remember-me"
            bind:checked={$form.data.rememberMe}
        />

        <Tooltip>
            <svelte:fragment slot="button">
                <Icon
                    src={QuestionMarkCircle}
                    solid
                    class="h-5 w-5 text-gray-500 hover:text-gray-600"
                />

                <span class="sr-only">Remember me information tooltip</span>
            </svelte:fragment>

            <svelte:fragment slot="content">
                <span>
                    If checked, your session will be remembered for 7 days. Otherwise, it will be
                    remembered for 1 day.
                </span>
            </svelte:fragment>
        </Tooltip>
    </div>

    <div>
        <Alert show={$form.isSuccess} color={Color.SUCCESS}>
            {$form.message}
        </Alert>

        <Alert show={$form.isError} color={Color.DANGER}>
            {$form.message}

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
                        class="inline-flex items-center gap-0.5 font-medium text-rose-600 hover:text-rose-500 hover:underline hover:decoration-rose-500 hover:decoration-2 disabled:cursor-not-allowed disabled:text-rose-400 disabled:no-underline"
                        disabled={disabledResendValidation}
                    >
                        Resend verification email
                    </button>
                </form>
            {/if}
        </Alert>
    </div>

    <div>
        <Button
            type="submit"
            block={true}
            color={Color.PRIMARY}
            disabled={disabled}
            isLoading={$form.isLoading}
        >
            Sign in
        </Button>
    </div>
</form>
