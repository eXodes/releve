<script lang="ts">
    import type { ShopData } from "$features/shops/types";
    import type { PaginationMeta } from "$client/types/meta";

    import Pagination from "$client/components/shared/pagination.svelte";
    import ShopCard from "$features/shops/components/shop-card.svelte";

    export let shops: ShopData[];
    export let meta: PaginationMeta | undefined;
    export let isPrivate = false;
</script>

<ul class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
    {#each shops as shop (shop.uid)}
        <li class="col-span-1">
            <ShopCard shop={shop} isPrivate={isPrivate} />
        </li>
    {/each}
</ul>

<Pagination meta={meta} />
