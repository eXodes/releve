<script context="module" lang="ts">
    interface ButtonProps {
        label: string;
        href?: undefined;
        onClick: () => void;
        disabled?: boolean;
    }

    interface LinkProps {
        label: string;
        href: string;
        onClick?: undefined;
    }

    export type DropdownButtonsProps = (ButtonProps | LinkProps)[];
</script>

<script lang="ts">
    import {
        Menu,
        MenuButton,
        MenuItem,
        MenuItems,
        Transition,
    } from "@rgossiaux/svelte-headlessui";
    import { ChevronDown, Icon } from "svelte-hero-icons";

    import { classNames } from "$utils/style";

    export let buttons: DropdownButtonsProps;
</script>

<span class="relative inline-flex rounded-md shadow-sm">
    {#if buttons[0].href}
        <a
            href={buttons[0].href}
            class="relative inline-flex items-center rounded-l-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:z-10 focus:border-rose-500 focus:outline-none focus:ring-1 focus:ring-rose-500"
        >
            {buttons[0].label}
        </a>
    {/if}
    {#if buttons[0].onClick}
        <button
            type="button"
            class="relative inline-flex items-center rounded-l-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:z-10 focus:border-rose-500 focus:outline-none focus:ring-1 focus:ring-rose-500"
            on:click={buttons[0].onClick}
            disabled={buttons[0].disabled}
        >
            {buttons[0].label}
        </button>
    {/if}
    <Menu as="span" class="relative -ml-px block">
        <MenuButton
            class="relative inline-flex items-center rounded-r-md border border-gray-300 bg-white px-2 py-2 text-sm font-medium text-gray-500 hover:bg-gray-50 focus:z-10 focus:border-rose-500 focus:outline-none focus:ring-1 focus:ring-rose-500"
        >
            <span class="sr-only">Open options</span>
            <Icon src={ChevronDown} class="h-5 w-5" aria-hidden="true" />
        </MenuButton>
        <Transition
            class="relative z-10"
            enter="transition ease-out duration-100"
            enterFrom="transform opacity-0 scale-95"
            enterTo="transform opacity-100 scale-100"
            leave="transition ease-in duration-75"
            leaveFrom="transform opacity-100 scale-100"
            leaveTo="transform opacity-0 scale-95"
        >
            <MenuItems
                class="absolute right-0 mt-2 -mr-1 w-32 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none"
            >
                <div class="py-1">
                    {#each buttons as item, itemIdx (item.label)}
                        {#if itemIdx > 0}
                            <MenuItem let:active>
                                {#if item.href}
                                    <a
                                        href={item.href}
                                        class={classNames(
                                            active ? "bg-gray-100 text-gray-900" : "text-gray-700",
                                            "block px-4 py-2 text-sm text-left"
                                        )}
                                    >
                                        {item.label}
                                    </a>
                                {/if}
                                {#if item.onClick}
                                    <button
                                        class={classNames(
                                            active
                                                ? "enabled:bg-gray-100 enabled:text-gray-900"
                                                : "enabled:text-gray-700",
                                            "w-full block px-4 py-2 text-sm text-left",
                                            item.disabled && "cursor-not-allowed"
                                        )}
                                        on:click={item.onClick}
                                        disabled={item.disabled}
                                    >
                                        {item.label}
                                    </button>
                                {/if}
                            </MenuItem>
                        {/if}
                    {/each}
                </div>
            </MenuItems>
        </Transition>
    </Menu>
</span>
