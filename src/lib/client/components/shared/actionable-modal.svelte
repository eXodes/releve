<script lang="ts">
    import { enhance } from "$app/forms";

    import { Color } from "$client/enums/theme";
    import { createForm } from "$client/stores/form";
    import { notification } from "$client/stores/notification";

    import Button from "$client/components/shared/button.svelte";

    import { createEventDispatcher, onMount } from "svelte";
    import transition from "svelte-transition-classes";
    import { createDialog } from "svelte-headlessui";
    import { ExclamationTriangle, Icon } from "svelte-hero-icons";

    export let open = false;
    export let title: string;
    export let action: string;
    export let name: string | undefined = undefined;
    export let value: string | undefined = undefined;
    export let confirmLabel = "Confirm";
    export let cancelLabel = "Cancel";

    const dispatch = createEventDispatcher<{
        success: void;
        cancel: void;
    }>();

    const dialog = createDialog();

    const { form, reset, enhanceHandler } = createForm();

    const handleCancel = () => {
        dialog.close();

        dispatch("cancel");
    };

    $: open && dialog.open();

    onMount(() => {
        reset();
    });
</script>

{#if $dialog.expanded}
    <div class="fixed inset-0 z-10 overflow-y-auto">
        <div
            class="flex min-h-screen items-end justify-center px-4 pb-20 pt-4 text-center sm:block sm:p-0"
        >
            <div
                in:transition={{
                    duration: 300,
                    base: "ease-out duration-300",
                    from: "opacity-0",
                    to: "opacity-100",
                }}
                out:transition={{
                    duration: 200,
                    base: "ease-in duration-200",
                    from: "opacity-100",
                    to: "opacity-0",
                }}
            >
                <button
                    class="fixed inset-0 cursor-default bg-gray-500 bg-opacity-75 transition-opacity"
                    on:click={handleCancel}
                />
            </div>

            <!--{/* This element is to trick the browser into centering the modal contents. */}-->
            <span class="hidden sm:inline-block sm:h-screen sm:align-middle" aria-hidden="true">
                &#8203;
            </span>

            <div
                class="relative inline-block transform rounded-lg bg-white px-4 pb-4 pt-5 text-left align-bottom shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6 sm:align-middle"
                in:transition={{
                    duration: 300,
                    base: "ease-out duration-300",
                    from: "opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95",
                    to: "opacity-100 translate-y-0 sm:scale-100",
                }}
                out:transition={{
                    duration: 200,
                    base: "ease-in duration-200",
                    from: "opacity-100 translate-y-0 sm:scale-100",
                    to: "opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95",
                }}
                use:dialog.modal
            >
                <form
                    action={action}
                    method="POST"
                    use:enhance={enhanceHandler({
                        onError: ({ message }) => {
                            notification.send({
                                type: "error",
                                message: message,
                            });
                        },
                        onSuccess: ({ message }) => {
                            open = false;

                            if (message)
                                notification.send({
                                    type: "success",
                                    message: message,
                                });

                            dispatch("success");
                        },
                    })}
                >
                    <div class="sm:flex sm:items-start">
                        <div
                            class="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10"
                        >
                            <Icon
                                src={ExclamationTriangle}
                                class="h-6 w-6 text-red-600"
                                aria-hidden="true"
                            />
                        </div>
                        <div class="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
                            <h3 class="text-lg font-medium leading-6 text-gray-900">
                                {title}
                            </h3>
                            <div class="mt-2">
                                <slot />
                            </div>
                        </div>
                    </div>

                    <div class="mt-5 sm:ml-10 sm:mt-4 sm:pl-4">
                        <div class="flex flex-col gap-3 sm:flex-row">
                            <Button
                                type="submit"
                                color={Color.DANGER}
                                class="w-full sm:w-auto"
                                name={name}
                                value={value}
                                isLoading={$form.isLoading}
                            >
                                {confirmLabel}
                            </Button>

                            <Button class="w-full sm:w-auto" on:click={handleCancel}>
                                {cancelLabel}
                            </Button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    </div>
{/if}
