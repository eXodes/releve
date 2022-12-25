<script lang="ts">
    import type { SuiteRunResult } from "vest";
    import type { SignUpDto } from "$features/authentication/validations/sign-up";

    import { camelCase } from "lodash-es";

    import suite from "$features/authentication/validations/sign-up";
    import { enhance } from "$actions/form";
    import { Color } from "$enums/theme";

    import Alert from "$components/shared/alert.svelte";
    import TextInput from "$components/shared/text-input.svelte";
    import PasswordInput from "$components/shared/password-input.svelte";
    import Button from "$components/shared/button.svelte";

    let result: SuiteRunResult;
    let errors: { [key: string]: string[] } = {};
    let errorMessage: string | undefined = undefined;
    let successMessage: string | undefined = undefined;

    let user: SignUpDto = {
        displayName: "",
        email: "",
        password: "",
        confirmPassword: "",
    };
    const handleChange = ({ detail }: CustomEvent<{ name: string; value: string }>) => {
        user = {
            ...user,
            [camelCase(detail.name)]: detail.value,
        };
        result = suite(user, detail.name);

        result.done((res) => {
            result = res as SuiteRunResult;
            errors = result.getErrors();
        });
    };

    $: disabled = result?.hasErrors() || !result?.isValid();
</script>

<form
    action="/sign-up"
    method="post"
    use:enhance={{
        pending: () => {
            successMessage = errorMessage = undefined;
            errors = {};
        },
        error: async ({ error, response }) => {
            if (response) {
                const data = await response.json();

                if (typeof data.error === "string") {
                    errorMessage = data.error;
                } else {
                    errors = data.error;
                }
            } else {
                errorMessage = error?.message;
            }
        },
        result: async ({ form, response }) => {
            const data = await response.json();

            successMessage = data.message;

            form.reset();
        },
    }}
    class="space-y-6"
>
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
