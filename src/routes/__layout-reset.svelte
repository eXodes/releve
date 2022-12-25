<script context="module" lang="ts">
    import type { Load } from "./__types/__layout-reset";

    export const load: Load = ({ session }) => {
        if (session.authenticated) {
            return {
                status: 303,
                redirect: "/",
            };
        }

        return {};
    };
</script>

<script lang="ts">
    import "../app.css";
</script>

<slot />
