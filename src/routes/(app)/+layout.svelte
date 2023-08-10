<script lang="ts">
    import BaseLayout from "$client/components/layouts/base-layout.svelte";
    import Banner, { type Content } from "$client/components/shared/banner.svelte";
    import Toast from "$client/components/shared/toast.svelte";

    import { ExclamationTriangle } from "svelte-hero-icons";

    import type { LayoutData } from "./$types";

    export let data: LayoutData;

    const content: Content = {
        desktop: "This is a pre-release application. Use at your own risk.",
        mobile: "This is a pre-release application.",
    };
</script>

<BaseLayout>
    <slot />

    {#if !data.session.authenticated}
        <Banner icon={ExclamationTriangle} content={content} />
    {/if}
</BaseLayout>

<Toast />
