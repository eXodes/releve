<script lang="ts">
    import { enhance, type SubmitFunction } from "$app/forms";
    import { goto, invalidate } from "$app/navigation";
    import { notification } from "$client/stores/notification";
    import { createEventDispatcher } from "svelte";

    export { classes as class };

    let classes = "";

    const dispatch = createEventDispatcher<{
        success: void;
    }>();

    const handleSubmit: SubmitFunction<{ message: string }> = () => {
        return async ({ result, update }) => {
            if (result.type === "error") {
                notification.send({
                    type: "error",
                    title: "Unable to sign out",
                    message: result.error.message,
                });
            }

            if (result.type === "success") {
                if (result.data)
                    notification.send({
                        title: "Sign out",
                        message: result.data.message,
                    });

                await update();

                await invalidate("session");
                await goto("/");

                dispatch("success");
            }
        };
    };
</script>

<form action="/sign-out" method="post" use:enhance={handleSubmit}>
    <button type="submit" class={classes}>Sign Out</button>
</form>
