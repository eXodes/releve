<script lang="ts">
    import { goto, invalidate } from "$app/navigation";
    import { page } from "$app/stores";

    import type { UserData } from "$features/users/types";
    import { Color, Size } from "$client/enums/theme";
    import type { PaginationMeta } from "$client/types/meta";
    import { getLocaleDatetime } from "$client/utils/datetime";
    import { classNames } from "$client/utils/style";

    import ActionableModal from "$client/components/shared/actionable-modal.svelte";
    import Badge from "$client/components/shared/badge.svelte";
    import Button from "$client/components/shared/button.svelte";
    import DropdownButton, {
        type DropdownButtonsProps,
    } from "$client/components/shared/dropdown-button.svelte";
    import Image from "$client/components/shared/image.svelte";
    import Pagination from "$client/components/shared/pagination.svelte";
    import SearchInput from "$client/components/shared/search-input.svelte";

    import { debounce } from "lodash-es";

    export let users: UserData[];
    export let meta: PaginationMeta | undefined;

    let checkbox: HTMLInputElement | undefined;
    let checked = false;
    let indeterminate = false;
    let selectedUsers: UserData[] = [];
    let selectedUser: UserData | undefined;

    let showDeleteUsers = false;
    let showDeleteUser = false;

    const handleSearch = debounce(async ({ detail }: CustomEvent<{ value: string }>) => {
        if (detail.value) {
            await goto(`/users?search=${detail.value}`, {
                noScroll: true,
                keepFocus: true,
            });
        } else {
            await goto("/users", {
                noScroll: true,
                keepFocus: true,
            });
        }
    }, 500);

    const handleToggle = (e: Event, user: UserData) => {
        const target = e.target as HTMLInputElement;
        selectedUsers = target.checked
            ? [...selectedUsers, user]
            : selectedUsers.filter((p) => p !== user);
    };

    const handleToggleAll = () => {
        selectedUsers =
            checked || indeterminate
                ? []
                : users.filter((u) => u.uid !== $page.data.session.user?.uid);
        checked = !checked && !indeterminate;
        indeterminate = false;
    };

    const handleDelete = async () => {
        // await UserService.delete(selectedUser?.uid as string);
        //
        // $page.url.searchParams.get("offset")
        //     ? await invalidate(`users?${$page.url.searchParams.toString()}`)
        //     : await invalidate("users");
        showDeleteUser = false;

        await invalidate("users");
    };

    const handleBulkConfirm = () => {
        showDeleteUsers = true;
    };

    const handleBulkDelete = async () => {
        // await UserService.deleteAll(selectedUsers.map((u) => u.uid));
        selectedUsers = [];
        showDeleteUsers = false;

        await invalidate("users");
        // $page.url.searchParams.get("offset")
        //     ? await invalidate(`users?${$page.url.searchParams.toString()}`)
        //     : await invalidate("users");
    };

    const getButtonsProps = (user: UserData): DropdownButtonsProps => {
        return [
            {
                label: "Edit",
                href: `/users/${user.uid}`,
            },
            {
                label: "Delete",
                onClick: () => {
                    selectedUser = user;
                    showDeleteUser = true;
                },
                disabled: $page.data.session.user?.uid === user.uid,
            },
        ];
    };

    $: {
        indeterminate = selectedUsers.length > 0 && selectedUsers.length < users.length;
        checked = selectedUsers.length === users.length;
        checkbox && (checkbox.indeterminate = indeterminate);
    }
</script>

<ActionableModal
    open={showDeleteUser}
    title="Delete {selectedUser?.displayName}?"
    action="/users/{selectedUser?.uid}?/delete"
    confirmLabel="Delete"
    on:success={handleDelete}
    on:cancel={() => (showDeleteUser = false)}
>
    <p class="text-sm text-gray-500">
        Are you sure you want to delete this user? All of the data will be permanently removed
        forever. This action cannot be undone.
    </p>
</ActionableModal>

<ActionableModal
    open={showDeleteUsers}
    title="Delete selected users?"
    action="/users?/deleteAll"
    name="uids"
    value={selectedUsers.map((u) => u.uid).join(",")}
    confirmLabel="Delete All"
    on:success={handleBulkDelete}
    on:cancel={() => (showDeleteUsers = false)}
>
    <p class="text-sm text-gray-500">
        Are you sure you want to delete these users? All of the data will be permanently removed
        forever. This action cannot be undone.
    </p>
</ActionableModal>

<div class="flex flex-col">
    <div class="-mx-2 -my-2 sm:-mx-6 lg:-mx-8">
        <div class="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
            <div class="relative shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
                <table class="min-w-full table-fixed divide-y divide-gray-300">
                    <thead class="bg-gray-50">
                        <tr>
                            <th
                                scope="col"
                                class="relative hidden w-12 px-6 sm:w-16 sm:px-8 md:table-cell"
                            >
                                <input
                                    type="checkbox"
                                    class="absolute left-4 top-1/2 -mt-2 h-4 w-4 rounded border-gray-300 text-rose-600 focus:ring-rose-500 sm:left-6"
                                    bind:this={checkbox}
                                    bind:checked={checked}
                                    on:input={handleToggleAll}
                                />
                            </th>
                            <th
                                scope="col"
                                class="relative min-w-[12rem] py-3.5 pl-3 pr-3 text-left text-sm font-semibold text-gray-500 md:pl-0"
                            >
                                {#if selectedUsers.length > 0}
                                    <div
                                        class="absolute inset-y-0 -left-2 flex h-auto items-center space-x-3 bg-gray-50"
                                    >
                                        <Button
                                            size={Size.SMALLER}
                                            color={Color.DANGER}
                                            on:click={handleBulkConfirm}
                                        >
                                            Delete all
                                        </Button>
                                    </div>
                                {/if}
                                Name
                            </th>
                            <th
                                scope="col"
                                class="hidden px-3 py-3.5 text-left text-sm font-semibold text-gray-500 lg:table-cell"
                            >
                                Email
                            </th>
                            <th
                                scope="col"
                                class="hidden px-3 py-3.5 text-left text-sm font-semibold text-gray-500 sm:table-cell"
                            >
                                Role
                            </th>
                            <th
                                scope="col"
                                class="hidden px-3 py-3.5 text-left text-sm font-semibold text-gray-500 md:table-cell"
                            >
                                Created at
                            </th>
                            <th scope="col" class="relative py-3.5 pl-3 pr-4 sm:pr-6">
                                <span class="sr-only">Edit</span>
                                <SearchInput
                                    label="Search user by email"
                                    placeholder="Search user email"
                                    on:input={(e) => handleSearch(e)}
                                />
                            </th>
                        </tr>
                    </thead>
                    <tbody class="divide-y divide-gray-200 bg-white">
                        {#each users as user (user.email)}
                            <tr class={selectedUsers.includes(user) ? "bg-gray-50" : undefined}>
                                <td class="relative hidden w-12 px-6 sm:w-16 sm:px-8 md:table-cell">
                                    {#if selectedUsers.includes(user)}
                                        <div class="absolute inset-y-0 left-0 w-0.5 bg-rose-600" />
                                    {/if}
                                    <input
                                        type="checkbox"
                                        class="absolute left-4 top-1/2 -mt-2 h-4 w-4 rounded border-gray-300 text-rose-600 focus:ring-rose-500 disabled:bg-gray-100 sm:left-6"
                                        name="uids"
                                        value={user.uid}
                                        checked={selectedUsers.includes(user)}
                                        disabled={$page.data.session.user?.uid === user.uid}
                                        on:input={(e) => handleToggle(e, user)}
                                    />
                                </td>
                                <td
                                    class={classNames(
                                        "whitespace-nowrap py-4 pl-3 pr-3 text-sm font-medium md:pl-0",
                                        selectedUsers.includes(user)
                                            ? "text-rose-600"
                                            : "text-gray-900"
                                    )}
                                >
                                    <div class="flex items-center">
                                        <div class="h-10 w-10 flex-shrink-0">
                                            <Image
                                                ratioClass="h-10 w-10 rounded-full overflow-hidden"
                                                src={user.avatar?.small.url}
                                                alt={user.displayName}
                                            />
                                        </div>
                                        <span class="ml-4 flex flex-col">
                                            <span>{user.displayName}</span>
                                            <span
                                                class="block text-xs font-normal text-gray-400 sm:hidden"
                                            >
                                                {user.customClaims?.isAdmin ? "Admin" : "User"}
                                            </span>
                                        </span>
                                    </div>
                                </td>
                                <td
                                    class="hidden whitespace-nowrap px-3 py-4 text-sm text-gray-500 lg:table-cell"
                                >
                                    {user.email}
                                </td>
                                <td
                                    class="hidden whitespace-nowrap px-3 py-4 text-sm text-gray-500 sm:table-cell"
                                >
                                    {#if user.customClaims?.isAdmin}
                                        <Badge color={Color.SUCCESS}>Admin</Badge>
                                    {:else}
                                        <Badge>User</Badge>
                                    {/if}
                                </td>
                                <td
                                    class="hidden whitespace-nowrap px-3 py-4 text-sm text-gray-500 md:table-cell"
                                >
                                    {getLocaleDatetime(user.createdAt)}
                                </td>
                                <td
                                    class="whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6"
                                >
                                    <DropdownButton buttons={getButtonsProps(user)} />
                                </td>
                            </tr>
                        {/each}
                    </tbody>
                </table>
            </div>
        </div>
    </div>
</div>

<Pagination meta={meta} />
