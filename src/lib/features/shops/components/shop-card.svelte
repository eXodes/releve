<script lang="ts">
    import { invalidate } from "$app/navigation";
    import { page } from "$app/stores";
    import { ShopService } from "$features/shops/services";
    import type { Shop } from "$features/shops/types";

    import {
        GlobeAlt,
        InformationCircle,
        Icon,
        LocationMarker,
        PencilAlt,
        Trash,
    } from "svelte-hero-icons";

    import { Color } from "$enums/theme";

    import Badge from "$components/shared/badge.svelte";
    import Modal from "$components/shared/modal.svelte";
    import ActionableModal from "$components/shared/actionable-modal.svelte";
    import ShopDetail from "$features/shops/components/shop-detail.svelte";
    import ShopForm from "$features/shops/components/shop-form.svelte";

    export let shop: Shop;
    export let isPrivate = false;

    let showForm = false;
    let showDetail = false;
    let showDelete = false;

    const handleShopUpdate = async () => {
        showForm = false;

        await invalidate($page.url.toString());
    };

    const handleShopDelete = async () => {
        await ShopService.delete(shop.uid as string, true);

        showDelete = false;

        await invalidate($page.url.toString());
    };

    const handleCloseDetail = () => {
        showDetail = false;
        showForm = false;
        showDelete = false;
    };
</script>

<Modal open={showDetail} on:close={handleCloseDetail}>
    <ShopDetail shop={shop} />
</Modal>

{#if isPrivate}
    <Modal open={showForm} on:close={handleCloseDetail}>
        <ShopForm
            shopData={shop}
            isPrivate={isPrivate}
            formAction="/my/shops/{shop.uid}?_method=PATCH"
            on:submit={handleShopUpdate}
        />
    </Modal>

    <ActionableModal
        open={showDelete}
        title="Delete {shop.name}?"
        on:confirm={handleShopDelete}
        on:cancel={handleCloseDetail}
    >
        <p class="text-sm text-gray-500">
            Are you sure you want to delete this shop? All of the data will be permanently removed
            forever. This action cannot be undone.
        </p>
    </ActionableModal>
{/if}

<div class="flex flex-col divide-y divide-gray-200 rounded-lg bg-white shadow">
    <div class="relative py-6 px-8">
        {#if isPrivate}
            <div class="absolute top-3 right-3 flex flex-col gap-3">
                <button
                    on:click={() => (showForm = true)}
                    class="text-gray-400 hover:text-gray-500"
                >
                    <Icon src={PencilAlt} class="h-6 w-6 lg:h-5 lg:w-5" />
                </button>

                <button
                    on:click={() => (showDelete = true)}
                    class="text-red-400 hover:text-red-500"
                >
                    <Icon src={Trash} class="h-6 w-6 lg:h-5 lg:w-5" />
                </button>
            </div>
        {/if}

        <div class="flex w-full flex-col space-y-3">
            <div class="flex-1 truncate">
                <div class="flex flex-col items-center space-x-3 space-y-3">
                    <h3 class="truncate text-base font-medium text-gray-900">
                        {shop.name}
                    </h3>

                    <div class="inline-flex gap-2">
                        {#each shop.categories as category (category)}
                            <Badge color={Color.WARNING}>
                                {category}
                            </Badge>
                        {/each}
                    </div>
                </div>

                {#if shop.address.city || shop.address.state}
                    <div class="mt-4 flex items-center justify-center gap-1">
                        <Icon
                            src={LocationMarker}
                            class="h-5 w-5 text-gray-400"
                            aria-hidden="true"
                        />

                        <p class="text-sm text-gray-500">
                            {#if shop.address.city}
                                <span>
                                    {shop.address.city},
                                </span>
                            {/if}

                            {#if shop.address.state}
                                <span>
                                    {shop.address.state}
                                </span>
                            {/if}
                        </p>
                    </div>
                {/if}
            </div>
        </div>

        <!-- TODO: Add reviews -->
    </div>

    <div class="mt-auto">
        <div class="-mt-px flex divide-x divide-gray-200">
            <div class="flex w-0 flex-1">
                <a
                    href="http://{shop.link}"
                    target="_blank"
                    class="relative -mr-px inline-flex w-0 flex-1 items-center justify-center rounded-bl-lg border border-transparent py-4 text-sm font-medium text-gray-700 hover:text-gray-500"
                >
                    <Icon src={GlobeAlt} class="h-5 w-5 text-gray-400" aria-hidden="true" />
                    <span class="ml-3">Website</span>
                </a>
            </div>

            <div class="-ml-px flex w-0 flex-1">
                <button
                    on:click={() => (showDetail = true)}
                    class="relative inline-flex w-0 flex-1 items-center justify-center rounded-br-lg border border-transparent py-4 text-sm font-medium text-gray-700 hover:text-gray-500"
                >
                    <Icon
                        src={InformationCircle}
                        class="h-5 w-5 text-gray-400"
                        aria-hidden="true"
                    />
                    <span class="ml-3">Details</span>
                </button>
            </div>
        </div>
    </div>
</div>
