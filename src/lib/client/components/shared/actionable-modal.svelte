<script lang="ts">
    import { applyAction, enhance, type SubmitFunction } from "$app/forms";
    import { Color } from "$client/enums/theme";

    import Button from "$client/components/shared/button.svelte";
    import { notification } from "$client/stores/notification";

    import {
        Dialog,
        DialogOverlay,
        DialogTitle,
        Transition,
        TransitionChild,
    } from "@rgossiaux/svelte-headlessui";
    import { createEventDispatcher } from "svelte";
    import { ExclamationTriangle, Icon } from "svelte-hero-icons";

    export let open = false;
    export let title: string;
    export let action: string;
    export let name: string | undefined = undefined;
    export let value: string | undefined = undefined;
    export let confirmLabel = "Confirm";
    export let cancelLabel = "Cancel";

    let cancelButtonRef: HTMLButtonElement | undefined = undefined;

    const dispatch = createEventDispatcher<{
        success: void;
        cancel: void;
    }>();

    const handleSubmit: SubmitFunction =
        () =>
        async ({ result }) => {
            if (result.type === "error") {
                notification.send({
                    type: "error",
                    message: result.error.message,
                });
            }

            if (result.type === "success") {
                if (result.data)
                    notification.send({
                        type: "success",
                        message: result.data.message,
                    });

                await applyAction(result);

                dispatch("success");

                open = false;
            }
        };

    const handleCancel = () => {
        dispatch("cancel");

        open = false;
    };
</script>

<Transition show={open}>
    <Dialog
        as="div"
        class="fixed inset-0 z-10 overflow-y-auto"
        initialFocus={cancelButtonRef}
        on:close={handleCancel}
    >
        <div
            class="flex min-h-screen items-end justify-center px-4 pb-20 pt-4 text-center sm:block sm:p-0"
        >
            <TransitionChild
                enter="ease-out duration-300"
                enterFrom="opacity-0"
                enterTo="opacity-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100"
                leaveTo="opacity-0"
            >
                <DialogOverlay class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
            </TransitionChild>

            <!--{/* This element is to trick the browser into centering the modal contents. */}-->
            <span class="hidden sm:inline-block sm:h-screen sm:align-middle" aria-hidden="true">
                &#8203;
            </span>
            <TransitionChild
                class="relative inline-block transform rounded-lg bg-white px-4 pb-4 pt-5 text-left align-bottom shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6 sm:align-middle"
                enter="ease-out duration-300"
                enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                enterTo="opacity-100 translate-y-0 sm:scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
                <form action={action} method="POST" use:enhance={handleSubmit}>
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
                            <DialogTitle
                                as="h3"
                                class="text-lg font-medium leading-6 text-gray-900"
                            >
                                {title}
                            </DialogTitle>
                            <div class="mt-2">
                                <slot />
                            </div>
                        </div>
                    </div>

                    <div class="mt-5 pl-4 sm:ml-10 sm:mt-4 sm:pl-4">
                        <div class="flex flex-col gap-3 sm:flex-row">
                            <Button
                                type="submit"
                                color={Color.DANGER}
                                class="w-full sm:w-auto"
                                name={name}
                                value={value}
                            >
                                {confirmLabel}
                            </Button>

                            <Button
                                class="w-full sm:w-auto"
                                on:click={handleCancel}
                                bind:ref={cancelButtonRef}
                            >
                                {cancelLabel}
                            </Button>
                        </div>
                    </div>
                </form>
            </TransitionChild>
        </div>
    </Dialog>
</Transition>
