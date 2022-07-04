<script lang="ts">
    import type { User } from "$features/users/types";

    import { ChevronLeft, Icon } from "svelte-hero-icons";

    import { page } from "$app/stores";
    import { goto } from "$app/navigation";
    import { Size } from "$enums/theme";

    import Container from "$components/shared/container.svelte";
    import Button from "$components/shared/button.svelte";
    import UserForm from "$features/users/components/user-form.svelte";

    export let user: User;
</script>

<svelte:head>
    <title>User Details</title>
</svelte:head>

<Container class="mb-16">
    <Button class="mb-4 gap-2" size={Size.LARGE} on:click={async () => await goto("/users")}>
        <Icon src={ChevronLeft} solid class="h-5 w-5" />
        <span class="mr-4">Users</span>
    </Button>

    <UserForm formAction="/users/{$page.params.uid}?_method=PATCH" userData={user} />
</Container>
