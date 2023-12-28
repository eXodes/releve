<script lang="ts">
    import { enhance } from "$app/forms";
    import { goto, invalidate } from "$app/navigation";

    import { AuthService } from "$features/authentication/services";
    import { notification } from "$client/stores/notification";
    import { analytics } from "$client/utils/firebase";

    import { createEventDispatcher } from "svelte";
    import type { Action } from "svelte/action";
    import { setUserProperties } from "firebase/analytics";
    import * as Sentry from "@sentry/sveltekit";

    export { classes as class };
    export let action: Action = () => void {};

    let classes = "";

    const dispatch = createEventDispatcher<{
        success: void;
    }>();

    const handleSignOut = AuthService.signOutForm({
        onSuccess: async (data) => {
            if (data)
                notification.send({
                    title: "Sign out",
                    message: data.message,
                });

            await invalidate("session");
            Sentry.setUser(null);
            if (analytics) {
                setUserProperties(analytics, {
                    uid: null,
                });
            }

            await goto("/");

            dispatch("success");
        },
        onError: (error) => {
            notification.send({
                type: "error",
                title: "Unable to sign out",
                message: error.message,
            });
        },
    });
</script>

<form action="/sign-out" method="post" use:enhance={handleSignOut}>
    <button type="submit" class={classes} use:action>Sign Out</button>
</form>
