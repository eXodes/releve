<script lang="ts">
    import type { Shop } from "$features/shops/types";
    import type { PaginationMeta } from "$types/meta";

    import { GlobeAlt, InformationCircle, Icon, LocationMarker } from "svelte-hero-icons";

    import { Color } from "$enums/theme";

    import Badge from "$components/shared/badge.svelte";
    import Pagination from "$components/shared/pagination.svelte";
    import Modal from "$components/shared/modal.svelte";
    import ShopDetail from "$features/shops/components/shop-detail.svelte";

    export let shops: Shop[];
    export let meta: PaginationMeta | undefined = undefined;

    let showDetail = false;
    let shopDetail: Shop | undefined;

    const handleShowDetail = (shop: Shop) => {
        shopDetail = shop;
        showDetail = true;
    };

    const handleCloseDetail = () => {
        showDetail = false;

        setTimeout(() => {
            shopDetail = undefined;
        }, 300);
    };
</script>

<Modal open={showDetail} on:close={handleCloseDetail}>
    <ShopDetail shop={shopDetail} />
</Modal>

<ul class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
    {#each shops as shop (shop.uid)}
        <li class="col-span-1 flex flex-col divide-y divide-gray-200 rounded-lg bg-white shadow">
            <div class="flex w-full items-center justify-between space-x-6 p-6">
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

                    <!-- TODO: Add reviews -->
                </div>
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
                            on:click={() => handleShowDetail(shop)}
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
        </li>
    {/each}
</ul>

{#if meta}
    <Pagination meta={meta} />
{/if}
