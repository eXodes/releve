<script lang="ts">
    import { invalidate } from "$app/navigation";

    import BaseLayout from "$client/components/layouts/base-layout.svelte";
    import Banner, { type Content } from "$client/components/shared/banner.svelte";
    import Modal from "$client/components/shared/modal.svelte";
    import Toast from "$client/components/shared/toast.svelte";
    import ShopForm from "$features/shops/components/shop-form.svelte";

    import { ExclamationTriangle } from "svelte-hero-icons";
    import type { LayoutData } from "./$types";

    export let data: LayoutData;

    const content: Content = {
        desktop: "This is a pre-release application. Use at your own risk.",
        mobile: "This is a pre-release application.",
    };

    let showShopForm = false;

    const handleShopSubmit = async () => {
        showShopForm = false;

        await invalidate("shops");
    };
</script>

<Modal open={showShopForm} padding={false} on:close={() => (showShopForm = false)} static>
    <ShopForm actionType="create" on:success={handleShopSubmit} />
</Modal>

<BaseLayout on:click={() => (showShopForm = true)}>
    <slot />

    {#if !data.session.authenticated}
        <Banner icon={ExclamationTriangle} content={content} />
    {/if}
</BaseLayout>

<Toast />
