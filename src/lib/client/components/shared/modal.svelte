<script lang="ts">
    import { classNames } from "$client/utils/style";

    import { createEventDispatcher } from "svelte";
    import transition from "svelte-transition-classes";
    import { createDialog } from "svelte-headlessui";
    import { Icon, XMark } from "svelte-hero-icons";

    interface $$Props {
        open?: boolean;
        padding?: boolean;
        static?: boolean;
    }

    export let open = false;
    export let padding = false;

    let sticky = $$restProps.static ?? false;

    const dispatch = createEventDispatcher<{
        close: false;
    }>();

    const dialog = createDialog();

    const handleClose = () => {
        dialog.close();

        dispatch("close", (open = false));
    };

    $: open ? dialog.open() : dialog.close();
</script>

{#if $dialog.expanded}
    <div class="fixed inset-0 z-10 overflow-y-auto">
        <div class="flex min-h-screen items-end justify-center p-0 text-center md:block md:p-0">
            <div
                in:transition={{
                    duration: 400,
                    base: "ease-out duration-400",
                    from: "opacity-0",
                    to: "opacity-100",
                }}
                out:transition={{
                    duration: 300,
                    base: "ease-in duration-300",
                    from: "opacity-100",
                    to: "opacity-0",
                }}
            >
                <button
                    class="fixed inset-0 cursor-default bg-gray-500 bg-opacity-75 transition-opacity"
                    on:click={handleClose}
                    disabled={sticky}
                />
            </div>

            <!-- {/* This element is to trick the browser into centering the modal contents. */} -->
            <span class="hidden align-middle md:inline-block md:h-screen" aria-hidden="true">
                &#8203;
            </span>

            <div
                class={classNames(
                    "relative mt-20 inline-block w-full transform overflow-y-auto rounded-t-lg bg-white text-left align-middle shadow-xl transition-all sm:max-h-[80vh] sm:w-full sm:max-w-3xl md:mt-auto md:rounded-lg xl:max-w-5xl",
                    padding && "px-4 pb-4 pt-5 sm:p-6"
                )}
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
                <div class="absolute right-0 top-0 block pr-4 pt-4">
                    <button
                        type="button"
                        class="rounded-md text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-rose-500 focus:ring-offset-2"
                        on:click={handleClose}
                    >
                        <span class="sr-only">Close</span>
                        <Icon src={XMark} class="h-6 w-6" aria-hidden="true" />
                    </button>
                </div>

                <slot />
            </div>
        </div>
    </div>
{/if}
