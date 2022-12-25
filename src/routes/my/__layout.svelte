<script lang="ts">
    import type { Load } from "./__types/__layout";

    export const load: Load = async ({ props, session }) => {
        if (!session.authenticated) {
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
