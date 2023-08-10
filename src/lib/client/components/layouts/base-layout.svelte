<script lang="ts">
    import { invalidate } from "$app/navigation";

    import Header from "$client/components/layouts/header.svelte";
    import Background from "$client/components/layouts/background.svelte";
    import Modal from "$client/components/shared/modal.svelte";
    import ShopForm from "$features/shops/components/shop-form.svelte";

    let showShopForm = false;

    const handleShopSubmit = async () => {
        showShopForm = false;

        await invalidate("shops");
    };
</script>

<Modal open={showShopForm} padding={false} on:close={() => (showShopForm = false)} static>
    <ShopForm actionType="create" on:success={handleShopSubmit} />
</Modal>

<div class="relative min-h-screen overflow-hidden bg-white">
    <Background />

    <div class="relative">
        <Header on:addShop={() => (showShopForm = true)} />

        <main class="mt-4 lg:mt-8">
            <slot />
        </main>
    </div>
</div>
