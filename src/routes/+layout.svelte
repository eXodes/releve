<script lang="ts">
    import "../app.css";
    import { pwaInfo } from "virtual:pwa-info";

    $: webManifestLink = pwaInfo ? pwaInfo.webManifest.linkTag : "";
</script>

<svelte:head>
    {@html webManifestLink}
</svelte:head>

<slot />
