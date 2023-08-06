<script lang="ts">
    import { goto } from "$app/navigation";

    import { Size } from "$client/enums/theme";

    import Button from "$client/components/shared/button.svelte";
    import Container from "$client/components/shared/container.svelte";
    import UserForm from "$features/users/components/user-form.svelte";

    import { ChevronLeft, Icon } from "svelte-hero-icons";

    import type { PageData } from "./$types";

    export let data: PageData;
</script>

<svelte:head>
    <title>User Details</title>
</svelte:head>

<Container class="mb-16">
    <Button class="mb-4 gap-2" size={Size.LARGE} on:click={async () => await goto("/users")}>
        <Icon src={ChevronLeft} solid class="h-5 w-5" />
        <span class="mr-4">Users</span>
    </Button>

    <UserForm actionType="users" userData={data.user} />
</Container>
