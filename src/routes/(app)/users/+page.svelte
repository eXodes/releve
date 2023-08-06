<script lang="ts">
    import UserTable from "$features/users/components/user-table.svelte";
    import Container from "$client/components/shared/container.svelte";

    import type { PageData } from "./$types";

    export let data: PageData;
</script>

<svelte:head>
    <title>User Management</title>
</svelte:head>

<Container>
    <div class="sm:flex sm:items-center">
        <div class="sm:flex-auto">
            <h1 class="text-xl font-semibold text-gray-900">Users</h1>
            <p class="mt-2 text-sm text-gray-700">A list of all the users registered.</p>
        </div>
    </div>

    <div class="mt-8">
        <UserTable users={data.users} meta={data.meta} />
    </div>
</Container>
