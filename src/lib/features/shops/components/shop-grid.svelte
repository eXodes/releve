<script lang="ts">
    import type { Shop } from "$features/shops/types";
    import type { PaginationMeta } from "$types/meta";

    import Pagination from "$components/shared/pagination.svelte";
    import ShopCard from "$features/shops/components/shop-card.svelte";

    export let shops: Shop[];
    export let meta: PaginationMeta;
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
