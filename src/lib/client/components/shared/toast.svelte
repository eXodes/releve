<script lang="ts">
    import { notification } from "$client/stores/notification";
    import { classNames } from "$client/utils/style";

    import { Transition } from "@rgossiaux/svelte-headlessui";
    import { CheckCircle, Icon, XMark, XCircle } from "svelte-hero-icons";

    const icon = {
        success: CheckCircle,
        error: XCircle,
    };

    const iconColor = {
        success: "text-green-400",
        error: "text-red-400",
    };
</script>

<div
    aria-live="assertive"
    class="pointer-events-none fixed inset-0 z-50 flex items-end px-4 py-6 sm:items-start sm:p-6"
>
    <div class="flex w-full flex-col items-center space-y-4 sm:items-end">
        <!-- {/* Notification panel, dynamically insert this into the live region when it needs to be displayed */} -->
        {#each $notification as item (item.id)}
            <Transition
                show={!!item.id}
                class="flex w-full justify-end"
                enter="transform ease-out duration-300 transition"
                enterFrom="translate-y-2 opacity-0 sm:translate-y-0 sm:translate-x-2"
                enterTo="translate-y-0 opacity-100 sm:translate-x-0"
                leave="transition ease-in duration-500"
                leaveFrom="opacity-100"
                leaveTo="opacity-0"
            >
                <div
                    class="pointer-events-auto w-full overflow-hidden rounded-lg bg-white shadow-lg ring-1 ring-black ring-opacity-5 sm:max-w-sm"
                >
                    <div class="p-4">
                        <div class="flex items-start">
                            {#if item.type}
                                <div class="flex-shrink-0">
                                    <Icon
                                        src={icon[item.type]}
                                        class={classNames("h-6 w-6", iconColor[item.type])}
                                        aria-hidden="true"
                                    />
                                </div>
                            {/if}
                            <div class="ml-3 w-0 flex-1 pt-0.5">
                                {#if item.title}
                                    <p class="text-sm font-medium text-gray-900">{item.title}</p>
                                {/if}

                                <p
                                    class={classNames(
                                        "text-sm text-gray-500",
                                        item.title && "mt-1"
                                    )}
                                >
                                    {item.message}
                                </p>
                            </div>
                            <div class="ml-4 flex flex-shrink-0">
                                <button
                                    class="inline-flex rounded-md bg-white text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-rose-500 focus:ring-offset-2"
                                    on:click={() => notification.remove(item.id)}
                                >
                                    <span class="sr-only">Close</span>
                                    <Icon src={XMark} class="h-5 w-5" aria-hidden="true" />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </Transition>
        {/each}
    </div>
</div>
