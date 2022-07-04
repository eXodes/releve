<script context="module" lang="ts">
    import type { Load } from "./__types";

    import { countries } from "$features/countries/store";
    import { categories } from "$features/categories/store";
    import { deliveryServices } from "$features/delivery-services/store";

    export const load: Load = ({ props, fetch, session }) => {
        if (session.authenticated) {
            countries.load({ fetch });
            categories.load({ fetch });
            deliveryServices.load({ fetch });
        }

        return {
            props,
        };
    };
</script>

<script lang="ts">
    import "../app.css";

    import { Exclamation } from "svelte-hero-icons";

    import Layout from "$components/layouts/base-layout.svelte";
    import Banner, { type Content } from "$components/shared/banner.svelte";
    import Toast from "$components/shared/toast.svelte";

    const content: Content = {
        desktop: "This is a pre-release application. Use at your own risk.",
        mobile: "This is a pre-release application.",
    };
</script>

<Layout>
    <slot />

    <Banner icon={Exclamation} content={content} />
</Layout>

<Toast />
