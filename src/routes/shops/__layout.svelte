<script context="module" lang="ts">
    import type { Load } from "./__types";

    export const load: Load = ({ session, props }) => {
        if (!session.user?.claims?.isAdmin) {
            return {
                status: 303,
                redirect: "/",
            };
        }

        return {
            props,
        };
    };
</script>

<slot />
