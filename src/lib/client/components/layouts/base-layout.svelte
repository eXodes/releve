<script lang="ts">
    import NavBar from "$client/components/navigation/nav-bar.svelte";

    import { Icon, PlusSmall } from "svelte-hero-icons";
</script>

<div class="relative min-h-screen overflow-hidden bg-white">
    <!-- Background Start -->
    <div class="absolute lg:inset-0 lg:block lg:h-screen" aria-hidden="true">
        <svg
            class="absolute left-1/2 top-0 -translate-y-8 translate-x-64 transform"
            width={640}
            height={784}
            fill="none"
            viewBox="0 0 640 784"
        >
            <defs>
                <pattern
                    id="dotted-pattern"
                    x={118}
                    y={0}
                    width={20}
                    height={20}
                    patternUnits="userSpaceOnUse"
                >
                    <rect
                        x={0}
                        y={0}
                        width={4}
                        height={4}
                        class="text-rose-200"
                        fill="currentColor"
                    />
                </pattern>
            </defs>
            <rect y={72} width={640} height={640} class="text-rose-50" fill="currentColor" />
            <rect x={118} width={404} height={784} fill="url(#dotted-pattern)" />
        </svg>
    </div>
    <!-- Background End -->

    <div class="relative">
        <NavBar>
            <svelte:fragment slot="action-desktop">
                <span class="inline-flex rounded-md shadow-md">
                    <button
                        class="inline-flex items-center rounded-md border border-transparent bg-white px-4 py-2 text-base font-medium text-rose-600 hover:text-rose-500"
                        on:click
                    >
                        <Icon src={PlusSmall} class="mr-2 h-5 w-5" aria-hidden="true" />
                        Add shop
                    </button>
                </span>
            </svelte:fragment>

            <svelte:fragment slot="action-mobile">
                <span class="inline-flex rounded-md shadow">
                    <button
                        class="inline-flex items-center rounded-md border border-transparent bg-white p-2 text-base font-medium text-rose-600 hover:text-rose-500"
                        on:click
                    >
                        <Icon src={PlusSmall} class="h-5 w-5" aria-hidden="true" />
                        <span class="sr-only">Add shop</span>
                    </button>
                </span>
            </svelte:fragment>
        </NavBar>

        <main class="mt-12">
            <slot />
        </main>
    </div>
</div>
