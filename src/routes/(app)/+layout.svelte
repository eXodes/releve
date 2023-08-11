<script lang="ts">
    import { categories } from "$features/categories/store";
    import { countries } from "$features/countries/store";
    import { deliveryServices } from "$features/delivery-providers/store";

    import { onMount } from "svelte";
    import { ExclamationTriangle } from "svelte-hero-icons";

    import type { LayoutData } from "./$types";

    import BaseLayout from "$client/components/layouts/base-layout.svelte";
    import Banner, { type Content } from "$client/components/shared/banner.svelte";
    import Toast from "$client/components/shared/toast.svelte";

    export let data: LayoutData;

    const content: Content = {
        desktop: "This is a pre-release application. Use at your own risk.",
        mobile: "This is a pre-release application.",
    };

    onMount(async () => {
        if (data.session.authenticated) {
            await Promise.all([countries.load(), categories.load(), deliveryServices.load()]);
        }
    });
</script>

<BaseLayout>
    <slot />

    {#if !data.session.authenticated}
        <Banner icon={ExclamationTriangle} content={content} />
    {/if}
</BaseLayout>

<Toast />
