<script lang="ts">
    import "../app.css";
    import { onMount } from "svelte";

    onMount(async () => {
        const { setup } = await import("svelte-match-media");

        setup({
            mobile: "screen and (max-width: 1023px)",
            desktop: "screen and (min-width: 1024px)",
        });
    });
</script>

<slot />
