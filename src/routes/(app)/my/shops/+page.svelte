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
    <div class="sm:flex sm:items-center">
        <div class="sm:flex-auto">
            <h1 class="sr-only">My Shops</h1>
            <p class="mt-2 text-sm text-gray-700">
                List of all the shops you have created as your private collection.
            </p>
        </div>
    </div>

    <div class="mt-8">
        <ShopGrid isPrivate={true} shops={data.shops} meta={data.meta} />
    </div>
</Container>
