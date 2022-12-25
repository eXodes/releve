<script lang="ts">
    import type { Shop } from "$features/shops/types";
    import type { PaginationMeta } from "$types/meta";

    import Container from "$components/shared/container.svelte";
    import ShopGrid from "$features/shops/components/shop-grid.svelte";

    export let shops: Shop[];
    export let meta: PaginationMeta;
</script>

<svelte:head>
    <title>My Shops</title>
</svelte:head>

<Container>
    <ShopGrid isPrivate={true} shops={shops} meta={meta} />
</Container>
