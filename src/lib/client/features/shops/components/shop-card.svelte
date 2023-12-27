<script lang="ts">
    import { invalidate } from "$app/navigation";

    import type { ShopData } from "$features/shops/types";
    import { Color } from "$client/enums/theme";

    import ActionableModal from "$client/components/shared/actionable-modal.svelte";
    import Badge from "$client/components/shared/badge.svelte";
    import Modal from "$client/components/shared/modal.svelte";
    import ShopDetail from "$features/shops/components/shop-detail.svelte";
    import ShopForm from "$features/shops/components/shop-form.svelte";

    import {
        GlobeAlt,
        Icon,
        InformationCircle,
        MapPin,
        PencilSquare,
        Trash,
    } from "svelte-hero-icons";

    export let shop: ShopData;
    export let isPrivate = false;

    let showDetail = false;
    let showPrivateShopForm = false;
    let showPrivateShopDeleteConfirmation = false;

    const handleUpdatePrivateShop = async () => {
        showPrivateShopForm = false;
    };

    const handleDeletePrivateShop = async () => {
        showPrivateShopDeleteConfirmation = false;

        await invalidate("shops:my");
    };
</script>

<Modal title="Shop Details Modal" open={showDetail} on:close={() => (showDetail = false)}>
    <ShopDetail shop={shop} />
</Modal>

{#if isPrivate}
    <Modal
        title="Update Shop Form Modal"
        open={showPrivateShopForm}
        on:close={() => (showPrivateShopForm = false)}
    >
        <ShopForm
            shopData={shop}
            actionType="update-private"
            on:success={handleUpdatePrivateShop}
            on:cancel={() => (showPrivateShopForm = false)}
        />
    </Modal>

    <ActionableModal
        open={showPrivateShopDeleteConfirmation}
        title="Delete {shop.name}?"
        action="/my/shops/{shop.uid}?/delete"
        confirmLabel="Delete"
        on:success={handleDeletePrivateShop}
        on:cancel={() => (showPrivateShopDeleteConfirmation = false)}
    >
        <p class="text-sm text-gray-500">
            Are you sure you want to delete this shop? All of the data will be permanently removed
            forever. This action cannot be undone.
        </p>
    </ActionableModal>
{/if}

<div class="flex h-full flex-col divide-y divide-gray-200 rounded-lg bg-white shadow">
    <div class="relative px-8 py-6">
        {#if isPrivate}
            <div class="absolute right-3 top-3 flex flex-col gap-3">
                <button
                    on:click={() => (showPrivateShopForm = true)}
                    class="text-gray-400 hover:text-gray-500"
                >
                    <Icon src={PencilSquare} class="h-6 w-6 lg:h-5 lg:w-5" />
                </button>

                <button
                    on:click={() => (showPrivateShopDeleteConfirmation = true)}
                    class="text-red-400 hover:text-red-500"
                >
                    <Icon src={Trash} class="h-6 w-6 lg:h-5 lg:w-5" />
                </button>
            </div>
        {/if}

        <div class="flex w-full flex-col space-y-3">
            <div class="flex-1">
                <div class="flex flex-col items-center space-x-3 space-y-3">
                    <h3 class="truncate text-base font-medium text-gray-900">
                        {shop.name}
                    </h3>

                    <div class="inline-flex gap-2 text-center">
                        {#each shop.categories as category (category)}
                            <Badge color={Color.WARNING} class="self-center">
                                {category}
                            </Badge>
                        {/each}
                    </div>
                </div>

                {#if shop.address.city || shop.address.state || shop.address.country}
                    <div class="mt-4 flex items-center justify-center gap-1">
                        <Icon src={MapPin} class="h-5 w-5 text-gray-400" aria-hidden="true" />

                        <p class="max-w-[300px] text-center text-sm text-gray-500">
                            {#if shop.address.city}
                                <span>
                                    {shop.address.city},
                                </span>
                            {/if}

                            {#if shop.address.country}
                                <span>
                                    {shop.address.country}
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
                    rel="noreferrer"
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
