<script lang="ts">
    import type { SignInDto } from "$features/authentication/validations/sign-in";
    import type { SuiteRunResult } from "vest";

    import { onMount } from "svelte";
    import { camelCase } from "lodash-es";

    import suite from "$features/authentication/validations/sign-in";
    import { AuthService } from "$features/authentication/services";
    import { handleAuthCatch } from "$features/authentication/errors";
    import { page, session } from "$app/stores";
    import { goto } from "$app/navigation";
    import { Color } from "$enums/theme";

    import Alert from "$components/shared/alert.svelte";
    import TextInput from "$components/shared/text-input.svelte";
    import Button from "$components/shared/button.svelte";

    let result: SuiteRunResult;
    let errors: { [key: string]: string[] } = {};
    let successMessage: string | undefined = undefined;
    let errorMessage: string | undefined = undefined;

    let user: SignInDto = {
        email: "",
        password: "",
        rememberMe: false,
    };

    const handleChange = ({ detail }: CustomEvent<{ name: string; value: string }>) => {
        user = {
            ...user,
            [camelCase(detail.name)]: detail.value,
        };
        result = suite(user, detail.name);
        errors = result.getErrors();
    };

    const handleSignIn = async () => {
        successMessage = errorMessage = undefined;

        try {
            const data = await AuthService.signIn(user.email, user.password, user.rememberMe);

            successMessage = data.message;

            $session = {
                authenticated: true,
                user: data.user,
            };
        } catch (error) {
            errorMessage = handleAuthCatch(error);
        }
    };

    onMount(() => {
        const actionCode = $page.url.searchParams.get("actionCode");
        const uid = $page.url.searchParams.get("uid");

        if (actionCode && uid)
            AuthService.verifyEmail(uid, actionCode)
                .then(async () => {
                    await goto("/sign-in");

                    successMessage = "Email verified successfully. Please sign in.";
                })
                .catch((error) => {
                    errorMessage = handleAuthCatch(error);
                });
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
        <TextInput
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

    <div class="flex items-center justify-between">
        <div class="flex items-center">
            <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                class="h-4 w-4 rounded border-gray-300 text-rose-600 accent-rose-500 hover:bg-gray-50 focus:outline-none focus:ring-rose-500"
                bind:checked={user.rememberMe}
            />
            <label for="remember-me" class="ml-2 block text-sm text-gray-900"> Remember me </label>
        </div>
    </div>

    <Alert show={!!successMessage} color={Color.SUCCESS}>
        {successMessage}
    </Alert>

    <Alert show={!!errorMessage} color={Color.DANGER}>
        {errorMessage}
    </Alert>

    <div>
        <Button type="submit" block={true} color={Color.PRIMARY} disabled={disabled}>
            Sign in
        </Button>
    </div>
</form>
