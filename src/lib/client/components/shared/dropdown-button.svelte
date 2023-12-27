<script context="module" lang="ts">
    interface BaseProps {
        label: string;
        href?: string;
        onClick?: () => void;
        disabled?: boolean;
    }

    interface ButtonProps extends BaseProps {
        label: string;
        onClick: () => void;
    }

    interface LinkProps extends BaseProps {
        label: string;
        href: string;
    }

    export type DropdownButtonsProps = (ButtonProps | LinkProps)[];
</script>

<script lang="ts">
    import { goto } from "$app/navigation";

    import { classNames } from "$client/utils/style";

    import transition from "svelte-transition-classes";
    import { createMenu } from "svelte-headlessui";
    import { ChevronDown, Icon } from "svelte-hero-icons";

    export let buttons: DropdownButtonsProps;

    const [firstButton, ...otherButtons] = buttons;

    const menu = createMenu({ label: "Open options" });

    const handleSelect = (e: Event) => {
        const detail = (e as CustomEvent<{ selected: string }>).detail;

        const selected = otherButtons.find((item) => item.label === detail.selected);

        if (selected)
            if (selected.href) {
                goto(selected.href);
            } else if (selected.onClick && !selected.disabled) {
                selected.onClick();
            }
    };
</script>

<div class="relative inline-flex rounded-md shadow-sm">
    {#if firstButton.href}
        <a
            href={firstButton.href}
            class="relative inline-flex items-center rounded-l-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:z-10 focus:border-rose-500 focus:outline-none focus:ring-1 focus:ring-rose-500"
        >
            {firstButton.label}
        </a>
    {/if}
    {#if firstButton.onClick}
        <button
            type="button"
            class="relative inline-flex items-center rounded-l-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:z-10 focus:border-rose-500 focus:outline-none focus:ring-1 focus:ring-rose-500"
            on:click={firstButton.onClick}
            disabled={firstButton.disabled}
        >
            {firstButton.label}
        </button>
    {/if}
    <div class="relative -ml-px block">
        <button
            class="relative inline-flex items-center rounded-r-md border border-gray-300 bg-white px-2 py-2 text-sm font-medium text-gray-500 hover:bg-gray-50 focus:z-10 focus:border-rose-500 focus:outline-none focus:ring-1 focus:ring-rose-500"
            use:menu.button
            on:select={handleSelect}
        >
            <Icon src={ChevronDown} class="h-5 w-5" aria-hidden="true" />
        </button>

        {#if $menu.expanded}
            <div
                class="relative z-10"
                in:transition={{
                    duration: 100,
                    base: "transition ease-out duration-100",
                    from: "transform opacity-0 scale-95",
                    to: "transform opacity-100 scale-100",
                }}
                out:transition={{
                    duration: 75,
                    base: "transition ease-in duration-75",
                    from: "transform opacity-100 scale-100",
                    to: "transform opacity-0 scale-95",
                }}
            >
                <ul
                    class="absolute right-0 -mr-1 mt-2 w-32 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none"
                    use:menu.items
                >
                    {#each otherButtons as item (item.label)}
                        {@const active = $menu.active === item.label}
                        <li use:menu.item>
                            {#if item.href}
                                <a
                                    href={item.href}
                                    class={classNames(
                                        active ? "bg-gray-100 text-gray-900" : "text-gray-700",
                                        "block px-4 py-2 text-left text-sm"
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
                                        "block w-full px-4 py-2 text-left text-sm text-gray-400",
                                        item.disabled && "cursor-not-allowed"
                                    )}
                                    disabled={item.disabled}
                                >
                                    {item.label}
                                </button>
                            {/if}
                        </li>
                    {/each}
                </ul>
            </div>
        {/if}
    </div>
</div>
