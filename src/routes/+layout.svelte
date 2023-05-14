<script lang="ts">
    import { browser } from "$app/environment";
    import { setup } from "svelte-match-media";
    import "../app.css";

    if (browser) {
        setup({
            mobile: "screen and (max-width: 1023px)",
            desktop: "screen and (min-width: 1024px)",
        });
    }
</script>

<slot />
