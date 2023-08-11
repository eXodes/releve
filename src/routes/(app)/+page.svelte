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
    <div class="sm:flex sm:items-center">
        <div class="sm:flex-auto">
            <h1 class="sr-only">Shops</h1>
            <p class="mt-2 text-sm text-gray-700">
                Curated list of shops that offers fast or same-day delivery.
            </p>
        </div>
    </div>

    <div class="mt-8">
        <ShopGrid shops={data.shops} meta={data.meta} />
    </div>
</Container>
