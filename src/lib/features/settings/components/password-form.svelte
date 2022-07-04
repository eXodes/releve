<script lang="ts">
    import type { SuiteRunResult } from "vest";
    import type { UpdatePasswordDto } from "$features/settings/validations/update-password";

    import { camelCase } from "lodash-es";
    import { fade } from "svelte/transition";
    import { CheckCircle, Icon } from "svelte-hero-icons";

    import suite from "$features/settings/validations/update-password";
    import { enhance } from "$actions/form";
    import { Color } from "$enums/theme";
    import { notification } from "$stores/notification";

    import TextInput from "$components/shared/text-input.svelte";
    import Button from "$components/shared/button.svelte";
    import ActionableCard from "$components/shared/actionable-card.svelte";

    let result: SuiteRunResult;
    let errors: { [key: string]: string[] } = {};
    let errorMessage: string | undefined = undefined;
    let passwordSuccess = false;

    let user: UpdatePasswordDto = {
        password: "",
        confirmPassword: "",
    };

    const handleChange = ({ detail }: CustomEvent<{ name: string; value: string }>) => {
        user = {
            ...user,
            [camelCase(detail.name)]: detail.value,
        };
        result = suite(user, detail.name);
        errors = result.getErrors();
    };

    $: errorMessage &&
        notification.send({
            type: "error",
            message: errorMessage,
        });
    $: disabled = result?.hasErrors() || !result?.isValid();
</script>

<form
    action="/settings/password"
    method="POST"
    use:enhance={{
        pending: () => {
            passwordSuccess = false;
            errorMessage = undefined;
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
        result: () => {
            passwordSuccess = true;

            setTimeout(() => {
                passwordSuccess = false;
            }, 2000);
        },
    }}
>
    <ActionableCard>
        <div>
            <h3 class="text-lg font-medium leading-6 text-gray-900">Update Password</h3>
            <p class="mt-1 text-sm text-gray-500">
                Update your password to keep your account secure.
            </p>
        </div>

        <div class="grid grid-cols-4 gap-6">
            <div class="col-span-3 sm:col-span-2">
                <TextInput
                    type="password"
                    id="new-password"
                    label="New password"
                    name="password"
                    autocomplete="new-password"
                    required
                    errors={errors["aboupasswordt"]}
                    on:input={handleChange}
                />
            </div>

            <div class="col-span-3 sm:col-span-2">
                <TextInput
                    type="password"
                    id="new-password"
                    label="Confirm password"
                    name="confirm-password"
                    autocomplete="new-password"
                    required
                    errors={errors["confirm-password"]}
                    on:input={handleChange}
                />
            </div>
        </div>

        <svelte:fragment slot="action">
            {#if passwordSuccess}
                <span
                    class="flex items-center gap-0.5 text-xs text-green-600"
                    transition:fade={{ duration: 100 }}
                >
                    <Icon src={CheckCircle} class="h-5 w-5" aria-hidden="true" />
                    Updated
                </span>
            {/if}

            <Button type="submit" color={Color.PRIMARY} disabled={disabled}>Save</Button>
        </svelte:fragment>
    </ActionableCard>
</form>
