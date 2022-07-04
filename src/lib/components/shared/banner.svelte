<script context="module" lang="ts">
    export interface Content {
        desktop: string;
        mobile: string;
    }

    export interface Link {
        label: string;
        href: string;
    }
</script>

<script lang="ts">
    import { Transition } from "@rgossiaux/svelte-headlessui";
    import { Icon, Speakerphone, X, type IconSource } from "svelte-hero-icons";

    interface $$Props {
        icon?: IconSource;
        content: Content;
        link?: Link;
    }

    export let icon: $$Props["icon"] = Speakerphone;
    export let content: $$Props["content"];
    export let link: $$Props["link"] = undefined;

    let open = true;
</script>

<Transition show={open}>
    <div class="fixed inset-x-0 bottom-0 z-50 pb-2 sm:pb-5">
        <div class="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
            <div class="rounded-lg bg-rose-600 p-2 shadow-lg sm:p-3">
                <div class="flex flex-wrap items-center justify-between">
                    <div class="flex w-0 flex-1 items-center">
                        {#if icon}
                            <span class="flex rounded-lg bg-rose-800 p-2">
                                <Icon src={icon} class="h-6 w-6 text-white" aria-hidden="true" />
                            </span>
                        {/if}
                        <p class="ml-3 truncate font-medium text-white">
                            <span class="md:hidden">
                                {content.mobile}
                            </span>
                            <span class="hidden md:inline">
                                {content.desktop}
                            </span>
                        </p>
                    </div>
                    {#if link}
                        <div class="order-3 mt-2 w-full flex-shrink-0 sm:order-2 sm:mt-0 sm:w-auto">
                            <a
                                href={link.href}
                                class="flex items-center justify-center rounded-md border border-transparent bg-white px-4 py-2 text-sm font-medium text-rose-600 shadow-sm hover:bg-rose-50"
                            >
                                {link.label}
                            </a>
                        </div>
                    {/if}
                    <div class="order-2 flex-shrink-0 sm:order-3 sm:ml-2">
                        <button
                            type="button"
                            class="-mr-1 flex rounded-md p-2 hover:bg-rose-500 focus:outline-none focus:ring-2 focus:ring-white"
                            on:click={() => (open = !open)}
                        >
                            <span class="sr-only">Dismiss</span>
                            <Icon src={X} class="h-6 w-6 text-white" aria-hidden="true" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</Transition>
