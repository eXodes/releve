<script lang="ts">
    import "../app.css";

    import { navigating } from "$app/stores";

    import { onMount } from "svelte";
    import NProgress from "nprogress";
    import { pwaInfo } from "virtual:pwa-info";

    NProgress.configure({
        showSpinner: false,
    });

    $: {
        if ($navigating) NProgress.start();
        else NProgress.done();
    }

    $: webManifestLink = pwaInfo ? pwaInfo.webManifest.linkTag : "";

    onMount(async () => {
        if (pwaInfo) {
            const { registerSW } = await import("virtual:pwa-register");
            registerSW({
                immediate: true,
            });
        }
    });
</script>

<svelte:head>
    {@html webManifestLink}
</svelte:head>

<slot />
