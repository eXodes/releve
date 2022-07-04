<script lang="ts">
    import { createEventDispatcher } from "svelte";
    import {
        Dialog,
        DialogOverlay,
        Transition,
        TransitionChild,
    } from "@rgossiaux/svelte-headlessui";
    import { Icon, X } from "svelte-hero-icons";

    import { classNames } from "$utils/style";

    export let open = false;
    export let padding = false;
    export let sticky = false;

    let closeButtonRef: HTMLElement | undefined;

    const dispatch = createEventDispatcher<{
        close: false;
    }>();

    const handleClose = () => {
        dispatch("close", (open = false));
    };
</script>

<Transition show={open}>
    <Dialog
        as="div"
        class="fixed inset-0 z-10 overflow-y-auto"
        initialFocus={closeButtonRef}
        on:close={() => !sticky && handleClose()}
    >
        <div class="block min-h-screen items-end justify-center px-4 pt-4 pb-20 text-center sm:p-0">
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

            <!-- {/* This element is to trick the browser into centering the modal contents. */} -->
            <span class="inline-block align-middle lg:h-screen" aria-hidden="true"> &#8203; </span>
            <TransitionChild
                class={classNames(
                    "relative inline-block w-full transform overflow-hidden rounded-lg bg-white text-left align-middle shadow-xl transition-all sm:my-8 sm:max-h-[80vh] sm:w-full sm:max-w-4xl",
                    padding && "px-4 pt-5 pb-4 sm:p-6"
                )}
                enter="ease-out duration-300"
                enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                enterTo="opacity-100 translate-y-0 sm:scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
                <div class="absolute top-0 right-0 block pt-4 pr-4">
                    <button
                        type="button"
                        class="rounded-md text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-rose-500 focus:ring-offset-2"
                        on:click={handleClose}
                        bind:this={closeButtonRef}
                    >
                        <span class="sr-only">Close</span>
                        <Icon src={X} class="h-6 w-6" aria-hidden="true" />
                    </button>
                </div>

                <slot />
            </TransitionChild>
        </div>
    </Dialog>
</Transition>
