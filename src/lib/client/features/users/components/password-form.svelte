<script lang="ts">
    import { enhance } from "$app/forms";
    import { goto } from "$app/navigation";

    import updatePasswordSuite, {
        type UpdatePasswordPayload,
    } from "$features/users/validations/update-password";
    import { Color } from "$client/enums/theme";
    import { createForm, type EnhanceHandlerOptions } from "$client/stores/form";
    import { notification } from "$client/stores/notification";

    import ActionableCard from "$client/components/shared/actionable-card.svelte";
    import Button from "$client/components/shared/button.svelte";
    import PasswordInput from "$client/components/shared/password-input.svelte";

    import { createEventDispatcher } from "svelte";

    const dispatch = createEventDispatcher<{
        success: void;
    }>();

    const { form, change, errors, enhanceHandler } = createForm<UpdatePasswordPayload>({
        initialValues: {
            password: "",
            confirmPassword: "",
        },
        validationSuite: updatePasswordSuite,
    });

    const handlerOptions: EnhanceHandlerOptions = {
        onError: ({ message }) => {
            notification.send({
                type: "error",
                message: message,
            });
        },
        onSuccess: () => {
            let timeout: ReturnType<typeof setTimeout>;

            notification.send({
                type: "success",
                message: "Password updated successfully. Please sign in again.",
            });

            dispatch("success");

            timeout = setTimeout(() => {
                goto("/sign-in");
            }, 2000);

            return () => clearTimeout(timeout);
        },
    };

    $: disabled = !$form.isValid || $form.isSuccess;
</script>

<form action="/settings?/password" method="POST" use:enhance={enhanceHandler(handlerOptions)}>
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
                    errors={$errors["password"]}
                    on:input={change}
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
                    errors={$errors["confirm-password"]}
                    on:input={change}
                />
            </div>
        </div>

        <svelte:fragment slot="action">
            <Button
                type="submit"
                color={Color.PRIMARY}
                disabled={disabled}
                isLoading={$form.isLoading}
            >
                Save
            </Button>
        </svelte:fragment>
    </ActionableCard>
</form>
