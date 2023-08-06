<script lang="ts">
    import { applyAction, enhance } from "$app/forms";
    import { goto } from "$app/navigation";

    import updatePasswordSuite, {
        type UpdatePasswordPayload,
        type UpdatePasswordResponse,
    } from "$features/users/validations/update-password";
    import { Color } from "$client/enums/theme";
    import { notification } from "$client/stores/notification";
    import type { ValidationError } from "$client/types/error";

    import ActionableCard from "$client/components/shared/actionable-card.svelte";
    import Button from "$client/components/shared/button.svelte";
    import PasswordInput from "$client/components/shared/password-input.svelte";

    import type { SubmitFunction } from "@sveltejs/kit";
    import { createEventDispatcher } from "svelte";
    import { camelCase } from "lodash-es";
    import type { SuiteRunResult } from "vest";

    let result: SuiteRunResult;
    let errors: { [key: string]: string[] } = {};
    let errorMessage: string | undefined = undefined;

    let user: UpdatePasswordPayload = {
        password: "",
        confirmPassword: "",
    };

    const dispatch = createEventDispatcher<{
        success: void;
    }>();

    const handleChange = ({ detail }: CustomEvent<{ name: string; value: string }>) => {
        user = {
            ...user,
            [camelCase(detail.name)]: detail.value,
        };
        result = updatePasswordSuite(user, detail.name);
        errors = result.getErrors();
    };

    const handleSubmit: SubmitFunction<UpdatePasswordResponse, ValidationError> =
        () =>
        async ({ result }) => {
            let timeout: ReturnType<typeof setTimeout>;

            if (result.type === "failure") {
                if (result.data?.name === "ValidationError" && result.data?.errors) {
                    errors = result.data?.errors;
                }
            }

            if (result.type === "error") {
                errorMessage = result.error.message;
            }

            if (result.type === "success") {
                await applyAction(result);

                notification.send({
                    type: "success",
                    message: "Password updated successfully. Please sign in again.",
                });

                dispatch("success");

                timeout = setTimeout(() => {
                    goto("/sign-in");
                }, 5000);
            }

            return () => clearTimeout(timeout);
        };

    $: errorMessage &&
        notification.send({
            type: "error",
            message: errorMessage,
        });
    $: disabled = result?.hasErrors() || !result?.isValid();
</script>

<form action="/settings?/password" method="POST" use:enhance={handleSubmit}>
    <ActionableCard>
        <div>
            <h3 class="text-lg font-medium leading-6 text-gray-900">Update Password</h3>
            <p class="mt-1 text-sm text-gray-500">
                Update your password to keep your account secure.
            </p>
        </div>

        <div class="grid grid-cols-4 gap-6">
            <div class="col-span-3 sm:col-span-2">
                <PasswordInput
                    type="password"
                    id="new-password"
                    label="New password"
                    name="password"
                    autocomplete="new-password"
                    required
                    errors={errors["password"]}
                    on:input={handleChange}
                />
            </div>

            <div class="col-span-3 sm:col-span-2">
                <PasswordInput
                    type="password"
                    id="confirm-password"
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
            <Button type="submit" color={Color.PRIMARY} disabled={disabled}>Save</Button>
        </svelte:fragment>
    </ActionableCard>
</form>
