<script lang="ts">
    import type { Shop } from "$features/shops/types";
    import type { PaginationMeta } from "$types/meta";

    import Container from "$components/shared/container.svelte";
    import ShopTable from "$features/shops/components/shop-table.svelte";

    export let shops: Shop[];
    export let meta: PaginationMeta;
</script>

<svelte:head>
    <title>Shops</title>
</svelte:head>

<Container>
    <ShopTable shops={shops} meta={meta} />
</Container>
