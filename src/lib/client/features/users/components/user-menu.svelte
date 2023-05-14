<script lang="ts">
    import { page } from "$app/stores";
    import { classNames } from "$client/utils/style";

    import SignOutButton from "$features/authentication/components/sign-out-button.svelte";
    import Image from "$client/components/shared/image.svelte";

    import {
        Menu,
        MenuButton,
        MenuItem,
        MenuItems,
        Transition,
    } from "@rgossiaux/svelte-headlessui";

    const userNavigation = [{ name: "Settings", href: "/settings" }];
</script>

<Menu class="relative ml-3">
    <MenuButton
        class="group relative flex max-w-xs items-center rounded-full bg-white text-sm shadow-md focus:outline-none focus:ring-2 focus:ring-rose-500 focus:ring-offset-2"
    >
        <span class="sr-only">Open user menu</span>
        <Image
            src={$page.data.session.user?.photoURL}
            alt="Avatar for {$page.data.session.user?.displayName}"
            ratioClass="h-10 w-10 rounded-full overflow-hidden"
            fallback="/images/avatar.png"
        />
        <span
            class="invisible absolute inset-0 overflow-hidden rounded-full bg-rose-50 bg-opacity-25 group-hover:visible"
        />
    </MenuButton>
    <Transition
        class="absolute right-0 z-10"
        enter="transition ease-out duration-200"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
    >
        <MenuItems
            class="mt-2 w-48 origin-top-right rounded-md bg-white p-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none"
            unmount={false}
        >
            {#each userNavigation as item (item.name)}
                <MenuItem as="span" let:active>
                    <a
                        href={item.href}
                        class={classNames(
                            active ? "bg-rose-100 text-rose-700" : "text-gray-700",
                            "block rounded px-4 py-2 text-left text-sm "
                        )}
                    >
                        {item.name}
                    </a>
                </MenuItem>
            {/each}

            <MenuItem as="span" let:active>
                <SignOutButton
                    class={classNames(
                        active ? "bg-rose-100 text-rose-700" : "text-gray-700",
                        "block w-full rounded px-4 py-2 text-left text-sm "
                    )}
                />
            </MenuItem>
        </MenuItems>
    </Transition>
</Menu>
