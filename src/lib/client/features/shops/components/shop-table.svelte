<script lang="ts">
    import { goto, invalidate } from "$app/navigation";

    import { ShopStatus } from "$features/shops/enum";
    import type { ShopData } from "$features/shops/types";
    import { Color, Size } from "$client/enums/theme";
    import type { PaginationMeta } from "$client/types/meta";
    import { getLocaleDatetime } from "$client/utils/datetime";
    import { classNames } from "$client/utils/style";

    import ActionableModal from "$client/components/shared/actionable-modal.svelte";
    import Badge from "$client/components/shared/badge.svelte";
    import Button from "$client/components/shared/button.svelte";
    import DropdownButton from "$client/components/shared/dropdown-button.svelte";
    import Modal from "$client/components/shared/modal.svelte";
    import Pagination from "$client/components/shared/pagination.svelte";
    import SearchInput from "$client/components/shared/search-input.svelte";
    import ShopForm from "$features/shops/components/shop-form.svelte";

    import { debounce, startCase } from "lodash-es";

    export let shops: ShopData[];
    export let meta: PaginationMeta | undefined;

    let checkbox: HTMLInputElement | undefined;
    let checked = false;
    let indeterminate = false;
    let selectedShops: ShopData[] = [];
    let selectedShop: ShopData | undefined;

    let showDeleteShops = false;
    let showDeleteShop = false;
    let showUpdateShop = false;

    const handleSearch = debounce(async ({ detail }: CustomEvent<{ value: string }>) => {
        if (detail.value) {
            await goto(`/shops?search=${detail.value}`, {
                noScroll: true,
                keepFocus: true,
            });
        } else {
            await goto("/shops", {
                noScroll: true,
                keepFocus: true,
            });
        }
    }, 500);

    const handleToggleAll = () => {
        selectedShops = checked || indeterminate ? [] : shops;
        checked = !checked && !indeterminate;
        indeterminate = false;
    };

    const handleToggle = (e: Event, shop: ShopData) => {
        const target = e.target as HTMLInputElement;
        selectedShops = target.checked
            ? [...selectedShops, shop]
            : selectedShops.filter((p) => p !== shop);
    };

    const handleUpdate = async () => {
        showUpdateShop = false;
    };

    const handleDelete = async () => {
        showDeleteShop = false;

        await invalidate("shops");
    };

    const handleConfirmBulkDelete = () => {
        showDeleteShops = true;
    };

    const handleBulkDelete = async () => {
        showDeleteShops = false;
        selectedShops = [];

        await invalidate("shops");
    };

    const getButtonsProps = (shop: ShopData) => {
        return [
            {
                label: "Edit",
                onClick: () => {
                    selectedShop = shop;
                    showUpdateShop = true;
                },
            },
            {
                label: "Delete",
                onClick: () => {
                    selectedShop = shop;
                    showDeleteShop = true;
                },
            },
        ];
    };

    $: {
        indeterminate = selectedShops.length > 0 && selectedShops.length < shops.length;
        checked = selectedShops.length === shops.length;
        checkbox && (checkbox.indeterminate = indeterminate);
    }
</script>

<ActionableModal
    open={showDeleteShop}
    title="Delete {selectedShop?.name}?"
    action="/shops/{selectedShop?.uid}?/delete"
    confirmLabel="Delete"
    on:success={handleDelete}
    on:cancel={() => (showDeleteShop = false)}
>
    <p class="text-sm text-gray-500">
        Are you sure you want to delete this shop? All of the data will be permanently removed
        forever. This action cannot be undone.
    </p>
</ActionableModal>

<ActionableModal
    open={showDeleteShops}
    title="Delete selected shops?"
    action="/shops?/delete"
    name="uids"
    value={selectedShops.map((u) => u.uid).join(",")}
    confirmLabel="Delete All"
    on:success={handleBulkDelete}
    on:cancel={() => (showDeleteShops = false)}
>
    <p class="text-sm text-gray-500">
        Are you sure you want to delete these shops? All of the data will be permanently removed
        forever. This action cannot be undone.
    </p>
</ActionableModal>

<Modal open={showUpdateShop} padding={false} on:close={() => (showUpdateShop = false)}>
    <ShopForm
        shopData={selectedShop}
        actionType="update-public"
        on:success={handleUpdate}
        on:cancel={() => (showUpdateShop = false)}
    />
</Modal>

<div class="flex flex-col">
    <div class="-mx-3 -my-3 sm:-mx-6 lg:-mx-8">
        <div class="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
            <div class="relative bg-white shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
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
                                {#if selectedShops.length > 0}
                                    <div
                                        class="absolute inset-y-0 -left-2 flex h-auto items-center space-x-3 bg-gray-50"
                                    >
                                        <Button
                                            size={Size.SMALLER}
                                            color={Color.DANGER}
                                            on:click={handleConfirmBulkDelete}
                                        >
                                            Delete all
                                        </Button>
                                    </div>
                                {/if}
                                Name
                            </th>
                            <th
                                scope="col"
                                class="hidden px-3 py-3.5 text-left text-sm font-semibold text-gray-500 sm:table-cell"
                            >
                                Created by
                            </th>
                            <th
                                scope="col"
                                class="hidden px-3 py-3.5 text-left text-sm font-semibold text-gray-500 md:table-cell"
                            >
                                Created at
                            </th>
                            <th
                                scope="col"
                                class="hidden px-3 py-3.5 text-left text-sm font-semibold text-gray-500 lg:table-cell"
                            >
                                Status
                            </th>
                            <th scope="col" class="relative py-3.5 pl-3 pr-4 sm:pr-6">
                                <span class="sr-only">Edit</span>
                                <SearchInput
                                    label="Search shop by name"
                                    placeholder="Search shop name"
                                    on:input={(e) => handleSearch(e)}
                                />
                            </th>
                        </tr>
                    </thead>
                    <tbody class="divide-y divide-gray-200">
                        {#each shops as shop (shop.uid)}
                            <tr class={selectedShops.includes(shop) ? "bg-gray-50" : undefined}>
                                <td class="relative hidden w-12 px-6 sm:w-16 sm:px-8 md:table-cell">
                                    {#if selectedShops.includes(shop)}
                                        <div class="absolute inset-y-0 left-0 w-0.5 bg-rose-600" />
                                    {/if}
                                    <input
                                        type="checkbox"
                                        class="absolute left-4 top-1/2 -mt-2 h-4 w-4 rounded border-gray-300 text-rose-600 focus:ring-rose-500 disabled:bg-gray-100 sm:left-6"
                                        name="uids"
                                        value={shop.uid}
                                        checked={selectedShops.includes(shop)}
                                        on:input={(e) => handleToggle(e, shop)}
                                    />
                                </td>
                                <td
                                    class={classNames(
                                        "whitespace-nowrap py-4 pl-3 pr-3 text-sm font-medium md:pl-0",
                                        selectedShops.includes(shop)
                                            ? "text-rose-600"
                                            : "text-gray-900"
                                    )}
                                >
                                    <span>{shop.name}</span>
                                    <span class="block text-xs font-normal text-gray-400 sm:hidden">
                                        {startCase(shop.status)}
                                    </span>
                                </td>
                                <td
                                    class="hidden whitespace-nowrap px-3 py-4 text-sm text-gray-500 sm:table-cell"
                                >
                                    {shop.createdBy.name}
                                </td>
                                <td
                                    class="hidden whitespace-nowrap px-3 py-4 text-sm text-gray-500 md:table-cell"
                                >
                                    {getLocaleDatetime(shop.createdAt)}
                                </td>
                                <td
                                    class="hidden whitespace-nowrap px-3 py-4 text-sm text-gray-500 lg:table-cell"
                                >
                                    {#if shop.status === ShopStatus.PENDING}
                                        <Badge size={Size.SMALL} color={Color.WARNING}>
                                            {startCase(shop.status)}
                                        </Badge>
                                    {/if}
                                    {#if shop.status === ShopStatus.APPROVED}
                                        <Badge size={Size.SMALL} color={Color.SUCCESS}>
                                            {startCase(shop.status)}
                                        </Badge>
                                    {/if}
                                    {#if shop.status === ShopStatus.REJECTED}
                                        <Badge size={Size.SMALL} color={Color.DANGER}>
                                            {startCase(shop.status)}
                                        </Badge>
                                    {/if}
                                </td>
                                <td
                                    class="whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6"
                                >
                                    <DropdownButton buttons={getButtonsProps(shop)} />
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
