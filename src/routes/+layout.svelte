<script lang="ts">
    import "../app.css";

    import { onMount } from "svelte";
    import { pwaInfo } from "virtual:pwa-info";

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
