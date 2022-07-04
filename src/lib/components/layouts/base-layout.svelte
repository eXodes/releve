<script lang="ts">
    import { Icon, PlusSm } from "svelte-hero-icons";

    import { invalidate } from "$app/navigation";
    import { page } from "$app/stores";

    import Modal from "$components/shared/modal.svelte";
    import NavBar from "$components/navigation/nav-bar.svelte";
    import ShopForm from "$features/shops/components/shop-form.svelte";

    let open = false;

    const handleShopSubmit = async () => {
        open = false;

        await invalidate($page.url.pathname);
    };
</script>

<Modal open={open} padding={false} on:close={() => (open = false)}>
    <ShopForm formAction="/shops" on:submit={handleShopSubmit} />
</Modal>

<div class="relative min-h-screen overflow-hidden bg-white">
    <div class="absolute lg:inset-0 lg:block lg:h-screen" aria-hidden="true">
        <svg
            class="absolute top-0 left-1/2 translate-x-64 -translate-y-8 transform"
            width={640}
            height={784}
            fill="none"
            viewBox="0 0 640 784"
        >
            <defs>
                <pattern
                    id="9ebea6f4-a1f5-4d96-8c4e-4c2abf658047"
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
            <rect
                x={118}
                width={404}
                height={784}
                fill="url(#9ebea6f4-a1f5-4d96-8c4e-4c2abf658047)"
            />
        </svg>
    </div>

    <div class="relative">
        <NavBar>
            <svelte:fragment slot="action-desktop">
                <span class="inline-flex rounded-md shadow-md">
                    <button
                        class="inline-flex items-center rounded-md border border-transparent bg-white px-4 py-2 text-base font-medium text-rose-600 hover:text-rose-500"
                        on:click={() => (open = true)}
                    >
                        <Icon src={PlusSm} class="mr-2 h-5 w-5" aria-hidden="true" />
                        Add shop
                    </button>
                </span>
            </svelte:fragment>

            <svelte:fragment slot="action-mobile">
                <span class="inline-flex rounded-md shadow">
                    <button
                        class="inline-flex items-center rounded-md border border-transparent bg-white p-2 text-base font-medium text-rose-600 hover:text-rose-500"
                        on:click={() => (open = true)}
                    >
                        <Icon src={PlusSm} class="h-5 w-5" aria-hidden="true" />
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
