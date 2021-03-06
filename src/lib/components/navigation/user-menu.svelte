<script lang="ts">
    import {
        Transition,
        Menu,
        MenuButton,
        MenuItems,
        MenuItem,
    } from "@rgossiaux/svelte-headlessui";

    import { AuthService } from "$features/authentication/services";
    import { goto } from "$app/navigation";
    import { session } from "$app/stores";
    import { notification } from "$stores/notification";
    import { classNames } from "$utils/style";

    import Image from "$components/shared/image.svelte";

    const handleSignOut = async () => {
        try {
            const { message } = await AuthService.signOut();

            notification.send({
                title: "Sign out",
                message,
            });

            $session = {
                authenticated: false,
                user: undefined,
            };

            await goto("/");
        } catch (error) {
            console.error(error);
        }
    };

    const userNavigation = [
        { name: "Settings", href: "/settings" },
        { name: "Sign out", onClick: handleSignOut },
    ];
</script>

<Menu as="div" class="relative ml-3">
    <div>
        <MenuButton
            class="group relative flex max-w-xs items-center rounded-full bg-white text-sm shadow-md focus:outline-none focus:ring-2 focus:ring-rose-500 focus:ring-offset-2"
        >
            <span class="sr-only">Open user menu</span>
            <Image
                src={$session.user?.avatar}
                alt={$session.user?.name}
                ratioClass="h-10 w-10 rounded-full overflow-hidden"
            />
            <span
                class="invisible absolute inset-0 overflow-hidden rounded-full bg-rose-50 bg-opacity-25 group-hover:visible"
            />
        </MenuButton>
    </div>
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
        >
            {#each userNavigation as item (item.name)}
                <MenuItem let:active>
                    {#if item.href}
                        <a
                            href={item.href}
                            class={classNames(
                                active ? "bg-rose-100 text-rose-700" : "text-gray-700",
                                "block px-4 py-2 rounded text-left text-sm "
                            )}
                        >
                            {item.name}
                        </a>
                    {/if}

                    {#if item.onClick}
                        <button
                            on:click={item.onClick}
                            class={classNames(
                                active ? "bg-rose-100 text-rose-700" : "text-gray-700",
                                "w-full block px-4 py-2 rounded text-left text-sm "
                            )}
                        >
                            {item.name}
                        </button>
                    {/if}
                </MenuItem>
            {/each}
        </MenuItems>
    </Transition>
</Menu>
