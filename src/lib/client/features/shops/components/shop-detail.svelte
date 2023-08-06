<script lang="ts">
    import type { ShopData } from "$features/shops/types";
    import { Color } from "$client/enums/theme";
    import { getPlainDate, getRelativeDatetime } from "$client/utils/datetime";
    import { classNames } from "$client/utils/style";

    import Badge from "$client/components/shared/badge.svelte";

    import { Clock, Icon, MapPin, User } from "svelte-hero-icons";

    export let shop: ShopData | undefined;
</script>

{#if shop}
    <main class="w-full flex-1">
        <div class="w-full p-5 md:p-8 lg:grid-cols-3 xl:grid">
            <div
                class="no-scrollbar touch-pan-y overflow-y-auto overscroll-contain xl:col-span-2 xl:max-h-[70vh] xl:border-r xl:border-gray-200 xl:pr-8"
            >
                <div>
                    <div class="md:flex md:items-center md:justify-between md:space-x-4">
                        <div>
                            <h1 class="text-2xl font-bold text-gray-900">
                                {shop.name}
                            </h1>
                            {#if shop.address.city || shop.address.state}
                                <div class="mt-2 inline-flex gap-1">
                                    <Icon
                                        src={MapPin}
                                        solid
                                        class="h-5 w-5 text-gray-500"
                                        aria-hidden="true"
                                    />

                                    <p class="text-sm text-gray-500">
                                        {#if shop.address.city}
                                            <span>
                                                {shop.address.city},
                                            </span>
                                        {/if}

                                        {#if shop.address.state}
                                            <span>
                                                {shop.address.state}
                                            </span>
                                        {/if}
                                    </p>
                                </div>
                            {/if}
                        </div>
                    </div>
                    <div class="mt-6 divide-y divide-gray-200 xl:mt-10">
                        <div class="pb-4">
                            <h2 id="detail-title" class="text-lg font-medium text-gray-900">
                                Shop Details
                            </h2>
                        </div>
                        <div class={classNames(!!shop.address && "pt-6")}>
                            {#if shop.address}
                                <h3 class="text-sm font-medium text-gray-500">Address</h3>
                                <p class="mt-2 text-sm text-gray-900">
                                    <span class="block">
                                        {shop.address.street}
                                    </span>
                                    <span class="block">
                                        {shop.address.city}
                                    </span>
                                    <span class="block">
                                        {shop.address.postalCode}
                                        {shop.address.state}
                                    </span>
                                    <span class="block">
                                        {shop.address.country}
                                    </span>
                                </p>
                            {/if}
                        </div>
                    </div>
                    <aside class="mt-6 xl:hidden">
                        <h2 class="sr-only">Details</h2>

                        <div class="mt-6 space-y-8">
                            <div>
                                <h3 class="text-sm font-medium text-gray-500">Categories</h3>

                                <ul class="mt-2 leading-8">
                                    {#each shop.categories as category (category)}
                                        <li class="inline">
                                            <Badge color={Color.WARNING}>
                                                {category}
                                            </Badge>
                                        </li>
                                    {/each}
                                </ul>
                            </div>
                        </div>

                        <div class="mt-6 space-y-8">
                            <div>
                                <h3 class="text-sm font-medium text-gray-500">Deliveries</h3>
                                <ul class="mt-2 leading-8">
                                    {#each shop.deliveryProviders as deliveryService (deliveryService)}
                                        <li class="inline">
                                            <div
                                                class="relative inline-flex items-center rounded-full border border-gray-300 px-3 py-0.5"
                                            >
                                                <div
                                                    class="absolute flex flex-shrink-0 items-center justify-center"
                                                >
                                                    <span
                                                        class="h-1.5 w-1.5 rounded-full bg-purple-500"
                                                        aria-hidden="true"
                                                    />
                                                </div>
                                                <div
                                                    class="ml-3.5 text-sm font-medium text-gray-900"
                                                >
                                                    {deliveryService}
                                                </div>
                                            </div>
                                        </li>
                                    {/each}
                                </ul>
                            </div>
                        </div>

                        <div class="mt-6 space-y-5">
                            <div class="flex space-x-2">
                                <Icon
                                    src={User}
                                    solid
                                    class="h-5 w-5 text-gray-400"
                                    aria-hidden="true"
                                />
                                <span class="text-sm font-medium text-gray-500">
                                    Created by {shop.createdBy.name}
                                </span>
                            </div>
                            <div class="flex space-x-2">
                                <Icon
                                    src={Clock}
                                    solid
                                    class="h-5 w-5 text-gray-400"
                                    aria-hidden="true"
                                />
                                <span class="text-sm font-medium text-gray-500">
                                    Created at <time dateTime={getPlainDate(shop.createdAt)}>
                                        {getRelativeDatetime(shop.createdAt)}
                                    </time>
                                </span>
                            </div>
                        </div>
                    </aside>
                </div>
            </div>
            <aside class="hidden gap-6 xl:mt-4 xl:flex xl:flex-col xl:pl-8">
                <h2 class="sr-only">Details</h2>

                <div class="space-y-5">
                    <div class="flex items-center space-x-2">
                        <Icon src={User} solid class="h-5 w-5 text-gray-400" aria-hidden="true" />
                        <span class="text-sm font-medium text-gray-900">
                            Created by {shop.createdBy.name}
                        </span>
                    </div>
                    <div class="flex items-start space-x-2">
                        <Icon src={Clock} solid class="h-5 w-5 text-gray-400" aria-hidden="true" />
                        <span class="text-sm font-medium text-gray-900">
                            Created at <time dateTime={getPlainDate(shop.createdAt)}>
                                {getRelativeDatetime(shop.createdAt)}
                            </time>
                        </span>
                    </div>
                </div>

                <div class="space-y-8 border-t border-gray-200 pt-6">
                    <div>
                        <h2 class="text-sm font-medium text-gray-700">Categories</h2>
                        <ul class="mt-2 leading-8">
                            {#each shop.categories as category (category)}
                                <li class="inline">
                                    <Badge color={Color.WARNING}>
                                        {category}
                                    </Badge>
                                </li>
                            {/each}
                        </ul>
                    </div>
                </div>

                <div class="space-y-8 border-t border-gray-200 pt-6">
                    <div>
                        <h2 class="text-sm font-medium text-gray-700">Deliveries</h2>
                        <ul class="mt-2 leading-8">
                            {#each shop.deliveryProviders as deliveryService (deliveryService)}
                                <li class="inline">
                                    <div
                                        class="relative inline-flex items-center rounded-full border border-gray-300 px-3 py-0.5"
                                    >
                                        <div
                                            class="absolute flex flex-shrink-0 items-center justify-center"
                                        >
                                            <span
                                                class="h-1.5 w-1.5 rounded-full bg-purple-500"
                                                aria-hidden="true"
                                            />
                                        </div>
                                        <div class="ml-3.5 text-sm font-medium text-gray-900">
                                            {deliveryService}
                                        </div>
                                    </div>
                                </li>
                            {/each}
                        </ul>
                    </div>
                </div>
            </aside>
        </div>
    </main>
{/if}
