<script lang="ts">
    import { goto } from "$app/navigation";
    import { page } from "$app/stores";

    import { classNames } from "$client/utils/style";

    import SignOutButton from "$features/authentication/components/sign-out-button.svelte";
    import Image from "$client/components/shared/image.svelte";

    import transition from "svelte-transition-classes";
    import { createMenu } from "svelte-headlessui";

    const menu = createMenu({ label: "Open user menu" });

    const userNavigation = [{ name: "Settings", href: "/settings" }, { name: "Sign Out" }];

    const handleSelect = (e: Event) => {
        const detail = (e as CustomEvent<{ selected: string }>).detail;

        const href = userNavigation.find((item) => item.name === detail.selected)?.href;

        if (href) {
            goto(href);
        }
    };
</script>

<div class="relative">
    <button
        class="group relative flex max-w-xs items-center rounded-full bg-white text-sm shadow-md focus:outline-none focus:ring-2 focus:ring-rose-500 focus:ring-offset-2"
        on:select={handleSelect}
        use:menu.button
    >
        <Image
            src={$page.data.session.user?.photoURL}
            alt="Avatar for {$page.data.session.user?.displayName}"
            ratioClass="h-8 w-8 rounded-full overflow-hidden"
            fallback="/images/avatar.png"
        />
        <span
            class="invisible absolute inset-0 overflow-hidden rounded-full bg-rose-50 bg-opacity-25 group-hover:visible"
        />
    </button>

    {#if $menu.expanded}
        <ul
            class="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white p-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none"
            in:transition={{
                duration: 200,
                base: "transition ease-out duration-200",
                from: "transform opacity-0 scale-95",
                to: "transform opacity-100 scale-100",
            }}
            out:transition={{
                duration: 75,
                base: "transition ease-in duration-75",
                from: "transform opacity-100 scale-100",
                to: "transform opacity-0 scale-95",
            }}
            use:menu.items
        >
            {#each userNavigation as item (item.name)}
                {@const active = $menu.active === item.name}
                <li>
                    {#if item.name === "Sign Out"}
                        <SignOutButton
                            class={classNames(
                                active ? "bg-rose-100 text-rose-700" : "text-gray-700",
                                "block w-full rounded px-4 py-2 text-left text-sm "
                            )}
                            action={menu.item}
                        />
                    {:else}
                        <button
                            class={classNames(
                                active ? "bg-rose-100 text-rose-700" : "text-gray-700",
                                "block w-full rounded px-4 py-2 text-left text-sm "
                            )}
                            use:menu.item
                        >
                            {item.name}
                        </button>
                    {/if}
                </li>
            {/each}
        </ul>
    {/if}
</div>
