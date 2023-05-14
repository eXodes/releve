<script lang="ts">
    import Container from "$client/components/shared/container.svelte";
    import ShopGrid from "$features/shops/components/shop-grid.svelte";

    import type { PageData } from "./$types";

    export let data: PageData;
</script>

<svelte:head>
    <title>My Shops</title>
</svelte:head>

<Container>
    <ShopGrid isPrivate={true} shops={data.shops} meta={data.meta} />
</Container>
