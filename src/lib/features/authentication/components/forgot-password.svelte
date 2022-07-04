<script lang="ts">
    import type { SuiteRunResult } from "vest";
    import type { ForgotPasswordDto } from "$features/authentication/validations/forgot-password";

    import { camelCase } from "lodash-es";

    import suite from "$features/authentication/validations/forgot-password";
    import { enhance } from "$actions/form";
    import { Color } from "$enums/theme";

    import Alert from "$components/shared/alert.svelte";
    import TextInput from "$components/shared/text-input.svelte";
    import Button from "$components/shared/button.svelte";

    let result: SuiteRunResult;
    let errors: { [key: string]: string[] } = {};
    let errorMessage: string | undefined = undefined;
    let successMessage: string | undefined = undefined;

    let user: ForgotPasswordDto = {
        email: "",
    };

    const handleChange = ({ detail }: CustomEvent<{ name: string; value: string }>) => {
        user = {
            ...user,
            [camelCase(detail.name)]: detail.value,
        };
        result = suite(user, detail.name);
        errors = result.getErrors();
    };

    $: disabled = result?.hasErrors() || !result?.isValid();
</script>

<form
    action="/forgot-password"
    method="post"
    use:enhance={{
        pending: () => {
            successMessage = errorMessage = undefined;
        },
        error: async ({ error, response }) => {
            if (response) {
                const data = await response.json();

                if (typeof data.error === "string") {
                    errorMessage = data.error;
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

    <Alert show={!!successMessage} color={Color.SUCCESS}>
        {successMessage} Please check your email.
    </Alert>

    <Alert show={!!errorMessage} color={Color.DANGER}>
        {errorMessage}
    </Alert>

    <div>
        <Button type="submit" block={true} color={Color.PRIMARY} disabled={disabled}>
            Send link
        </Button>
    </div>
</form>
