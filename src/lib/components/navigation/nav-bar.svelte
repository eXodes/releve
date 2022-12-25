<script lang="ts">
    import { goto } from "$app/navigation";
    import { AuthService } from "$features/authentication/services";
    import { notification } from "$stores/notification";
    import { Popover, PopoverButton, PopoverPanel, Transition } from "@rgossiaux/svelte-headlessui";
    import { Icon, Menu, X } from "svelte-hero-icons";

    import { session } from "$app/stores";

    import UserMenu from "$features/users/components/user-menu.svelte";

    const appName = import.meta.env.SVELTE_APP_NAME;

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

    $: navigation = [
        {
            name: "My Shops",
            href: `/my/shops`,
            show: $session.user?.uid,
        },
        { name: "Shops", href: "/shops", show: $session.user?.claims?.isAdmin },
        { name: "Users", href: "/users", show: $session.user?.claims?.isAdmin },
    ];
</script>

<Popover as="header" class="my-6">
    <div class="mx-auto max-w-7xl px-4 sm:px-8">
        <nav class="relative flex items-center justify-between sm:h-10" aria-label="Global">
            <div class="flex flex-1 items-center md:absolute md:inset-y-0 md:left-0">
                <div class="flex w-full items-center justify-between md:w-auto">
                    <a href="/" class="flex items-center gap-2">
                        <div>
                            <span class="sr-only">{appName}</span>
                            <img
                                class="h-8 w-auto sm:h-10"
                                src="/workflow-mark.svg"
                                alt="{appName} logo"
                            />
                        </div>

                        <h1 class="text-xl font-medium text-rose-900">
                            {appName}
                        </h1>
                    </a>
                    <div class="-mr-2 flex items-center gap-4 md:hidden">
                        {#if $session.user}
                            <slot name="action-mobile" />
                        {/if}

                        <PopoverButton
                            class="inline-flex items-center justify-center rounded-md bg-gray-50 p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-rose-500"
                        >
                            <span class="sr-only">Open main menu</span>
                            <Icon src={Menu} class="h-6 w-6" aria-hidden="true" />
                        </PopoverButton>
                    </div>
                </div>
            </div>
            <div class="hidden md:ml-64 md:flex md:space-x-10">
                {#each navigation as item (item.name)}
                    {#if item.show}
                        <a href={item.href} class="font-medium text-rose-500 hover:text-rose-900">
                            {item.name}
                        </a>
                    {/if}
                {/each}
            </div>
            <div
                class="hidden md:absolute md:inset-y-0 md:right-0 md:flex md:items-center md:justify-end md:gap-4"
            >
                {#if $session.user}
                    <slot name="action-desktop" />

                    <UserMenu />
                {:else}
                    <span class="inline-flex rounded-md shadow-md">
                        <a
                            href="/sign-in"
                            class="inline-flex items-center rounded-md border border-transparent bg-white px-4 py-2 text-base font-medium text-rose-600 hover:text-rose-500"
                        >
                            Sign in
                        </a>
                    </span>
                {/if}
            </div>
        </nav>
    </div>

    <Transition
        enter="duration-150 ease-out"
        enterFrom="opacity-0 scale-95"
        enterTo="opacity-100 scale-100"
        leave="duration-100 ease-in"
        leaveFrom="opacity-100 scale-100"
        leaveTo="opacity-0 scale-95"
    >
        <PopoverPanel
            class="absolute inset-x-0 top-0 z-10 origin-top-right transform p-2 transition md:hidden"
            focus
        >
            <div
                class="overflow-hidden rounded-lg bg-white shadow-md ring-1 ring-black ring-opacity-5"
            >
                <div class="flex items-center justify-between px-5 pt-4">
                    <div>
                        <img
                            class="h-8 w-auto"
                            src="https://tailwindui.com/img/logos/workflow-mark-rose-600.svg"
                            alt=""
                        />
                    </div>
                    <div class="-mr-2">
                        <PopoverButton
                            class="inline-flex items-center justify-center rounded-md bg-white p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-rose-500"
                        >
                            <span class="sr-only">Close main menu</span>
                            <Icon src={X} class="h-6 w-6" aria-hidden="true" />
                        </PopoverButton>
                    </div>
                </div>
                <div class="space-y-1 px-2 pt-2 pb-3">
                    {#each navigation as item (item.name)}
                        {#if item.show}
                            <a
                                href={item.href}
                                class="block rounded-md px-3 py-2 text-base font-medium text-rose-700 hover:bg-rose-50 hover:text-rose-900"
                            >
                                {item.name}
                            </a>
                        {/if}
                    {/each}

                    <a
                        href="/settings"
                        class="block rounded-md px-3 py-2 text-base font-medium text-rose-700 hover:bg-rose-50 hover:text-rose-900"
                    >
                        Settings
                    </a>
                </div>
                {#if $session.user}
                    <button
                        on:click={handleSignOut}
                        class="block w-full bg-gray-50 px-5 py-3 text-center font-medium text-rose-600 hover:bg-gray-100 hover:text-rose-700"
                    >
                        Sign Out
                    </button>
                {:else}
                    <a
                        href="/sign-in"
                        class="block w-full bg-gray-50 px-5 py-3 text-center font-medium text-rose-600 hover:bg-gray-100 hover:text-rose-700"
                    >
                        Sign in
                    </a>
                {/if}
            </div>
        </PopoverPanel>
    </Transition>
</Popover>
