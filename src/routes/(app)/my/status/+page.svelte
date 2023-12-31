<script lang="ts">
    import ShopTable from "$features/shops/components/shop-table.svelte";
    import Container from "$client/components/shared/container.svelte";

    import type { PageData } from "./$types";

    export let data: PageData;
</script>

<svelte:head>
    <title>Shops Status</title>
</svelte:head>

<Container>
    <div class="sm:flex sm:items-center">
        <div class="sm:flex-auto">
            <h1 class="text-xl font-semibold text-gray-900">Shops Status</h1>
            <p class="mt-2 text-sm text-gray-700">
                List of all shops status that has been added for the public.
            </p>
        </div>
    </div>

    <div class="mt-8">
        <ShopTable shops={data.shops} meta={data.meta} />
    </div>
</Container>
