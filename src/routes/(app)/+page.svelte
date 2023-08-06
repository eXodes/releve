<script lang="ts">
    import ShopGrid from "$features/shops/components/shop-grid.svelte";
    import Container from "$client/components/shared/container.svelte";

    import type { PageData } from "./$types";

    export let data: PageData;
</script>

<svelte:head>
    <title>Releve</title>
</svelte:head>

<Container>
    <ShopGrid shops={data.shops} meta={data.meta} />
</Container>
