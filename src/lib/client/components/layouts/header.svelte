<script lang="ts">
    import { goto } from "$app/navigation";
    import { page } from "$app/stores";
    import { PUBLIC_APP_NAME } from "$env/static/public";

    import { Color, Size } from "$client/enums/theme";
    import { classNames } from "$client/utils/style";

    import Button from "$client/components/shared/button.svelte";
    import UserMenu from "$features/users/components/user-menu.svelte";

    import { createEventDispatcher } from "svelte";
    import transition from "svelte-transition-classes";
    import { createDialog } from "svelte-headlessui";
    import { Bars3, Icon, PlusSmall, XMark } from "svelte-hero-icons";

    const appName = PUBLIC_APP_NAME;

    interface NavigationItem {
        href: string;
        label: string;
        show: boolean;
        active: boolean;
    }

    const dispatch = createEventDispatcher<{
        addShop: void;
    }>();

    const dialog = createDialog({ label: "Navigation menu" });

    const handleNavigate = (href: string) => {
        dialog.close();

        goto(href, { replaceState: true });
    };

    $: navigation = [
        {
            href: "/",
            label: "Home",
            show: true,
            active: $page.url.pathname === "/",
        },
        {
            href: "/my/shops",
            label: "My Shops",
            show: $page.data.session.authenticated,
            active: $page.url.pathname === "/my/shops",
        },
        {
            href: "/shops",
            label: "Shop Management",
            show: $page.data.session.user?.customClaims?.isAdmin,
            active: $page.url.pathname === "/shops",
        },
        {
            href: "/users",
            label: "User Management",
            show: $page.data.session.user?.customClaims?.isAdmin,
            active: $page.url.pathname === "/users",
        },
    ] satisfies NavigationItem[];
</script>

<header class="relative">
    <nav aria-label="Top">
        <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:my-4 lg:px-8">
            <div class="flex h-16 items-center justify-between gap-6">
                <!-- Logo (lg+) -->
                <div class="hidden lg:flex lg:items-center">
                    <a href="/" class="inline-flex items-center gap-1 outline-none">
                        <img class="h-10 w-auto" src="/workflow-mark.svg" alt="{appName} logo" />
                        <span class="sr-only font-semibold text-rose-700 md:not-sr-only">
                            {appName}
                        </span>
                    </a>
                </div>

                <!-- Navbar (lg+) -->
                <div class="ml-12 hidden h-full lg:flex">
                    <!-- Menus -->
                    <div class="inset-x-0 bottom-0 px-4">
                        <div class="flex h-full justify-center gap-8">
                            {#each navigation as item (item.label)}
                                {#if item.show}
                                    <a
                                        href={item.href}
                                        class={classNames(
                                            "flex items-center self-center border-b-2 py-2 font-medium text-gray-700 outline-none hover:text-gray-800 focus:border-rose-300",
                                            item.active
                                                ? "border-rose-600 focus:border-rose-600"
                                                : "border-transparent"
                                        )}
                                    >
                                        {item.label}
                                    </a>
                                {/if}
                            {/each}
                        </div>
                    </div>

                    <!-- Add shop (lg+) -->
                    {#if $page.data.session.authenticated}
                        <div class="mx-4 my-auto">
                            <Button
                                color={Color.PRIMARY}
                                size={Size.SMALL}
                                on:click={() => dispatch("addShop")}
                            >
                                <Icon
                                    src={PlusSmall}
                                    class="h-6 w-6 lg:mr-2 lg:h-5 lg:w-5"
                                    aria-hidden="true"
                                />
                                Add shop
                            </Button>
                        </div>
                    {/if}
                </div>

                <!-- Mobile menu (lg-) -->
                <div class="flex flex-1 gap-2">
                    <div class="flex items-center lg:hidden">
                        <!-- Mobile menu toggle, controls the 'mobileMenuOpen' state. -->
                        <button
                            type="button"
                            class="-ml-2 rounded-md bg-white p-2 text-gray-400"
                            on:click={dialog.open}
                        >
                            <Icon src={Bars3} class="h-6 w-6" aria-hidden="true" />
                            <span class="sr-only">Open menu</span>
                        </button>
                    </div>
                </div>

                <!-- Logo (lg-) -->
                <a href="/" class="lg:hidden">
                    <img class="h-8 w-auto" src="/workflow-mark.svg" alt="{appName} logo" />
                    <span class="sr-only">{appName}</span>
                </a>

                <!-- Quick menu -->
                <div class="flex flex-1 items-center justify-end">
                    {#if $page.data.session.authenticated}
                        <div class="flex items-center gap-2 lg:gap-8">
                            <!-- Help -->
                            <!--
                            <a
                                href="/help"
                                class="p-2 text-gray-400 hover:text-gray-500 lg:block lg:text-gray-700 lg:hover:text-gray-800"
                            >
                                <span class="sr-only text-sm font-medium lg:not-sr-only lg:block">
                                    Help
                                </span>
                                <Icon
                                    src={QuestionMarkCircle}
                                    class="block h-6 w-6 lg:hidden"
                                    aria-hidden="true"
                                />
                            </a>
                            -->

                            <!-- User menu -->
                            <UserMenu />
                        </div>
                    {:else}
                        <!-- Sign up (lg+) -->
                        <div class="mx-4 my-auto hidden lg:block">
                            <a class="inline-flex rounded-md shadow-md" href="/sign-in">
                                <Button
                                    class="whitespace-nowrap"
                                    color={Color.LIGHT}
                                    size={Size.LARGE}
                                >
                                    Sign in
                                </Button>
                            </a>
                        </div>
                    {/if}
                </div>

                <!-- Add shop (lg-) -->
                {#if $page.data.session.authenticated}
                    <div class="fixed bottom-4 right-4 z-10 lg:hidden">
                        <Button
                            color={Color.PRIMARY}
                            size={Size.SMALL}
                            class="h-12 w-12 !rounded-full"
                            on:click={() => dispatch("addShop")}
                        >
                            <Icon
                                src={PlusSmall}
                                class="h-6 w-6 lg:h-5 lg:w-5"
                                aria-hidden="true"
                            />
                            <span class="sr-only">Add shop</span>
                        </Button>
                    </div>
                {/if}
            </div>
        </div>
    </nav>
</header>

<!-- Mobile nav (lg-) -->
{#if $dialog.expanded}
    <div class="fixed inset-0 z-40 flex lg:hidden">
        <div
            in:transition={{
                duration: 300,
                base: "transition-opacity ease-linear duration-300",
                from: "opacity-0",
                to: "opacity-100",
            }}
            out:transition={{
                duration: 300,
                base: "transition-opacity ease-linear duration-300",
                from: "opacity-100",
                to: "opacity-0",
            }}
        >
            <div class="fixed inset-0 bg-black bg-opacity-25" />
        </div>

        <div
            in:transition={{
                duration: 300,
                base: "transition ease-in-out duration-300 transform",
                from: "-translate-x-full",
                to: "translate-x-0",
            }}
            out:transition={{
                duration: 300,
                base: "transition-opacity ease-linear duration-300",
                from: "translate-x-0",
                to: "-translate-x-full",
            }}
        >
            <div
                class="relative flex h-full w-full max-w-xs flex-col overflow-y-auto bg-white pb-12 shadow-xl"
                use:dialog.modal
            >
                <div class="flex px-4 pb-2 pt-5">
                    <button
                        type="button"
                        class="-m-2 inline-flex items-center justify-center rounded-md p-2 text-gray-400 focus:outline-none focus:ring-2 focus:ring-rose-500"
                        on:click={dialog.close}
                    >
                        <span class="sr-only">Close menu</span>
                        <Icon src={XMark} class="h-6 w-6" aria-hidden="true" />
                    </button>
                </div>

                <!-- Navbar (lg-) -->
                <div class="space-y-6 px-4 py-6">
                    {#each navigation as item (item.label)}
                        {#if item.show}
                            <div class="flow-root">
                                <button
                                    on:click={() => handleNavigate(item.href)}
                                    class={classNames(
                                        "-m-2 block w-full rounded-md p-2 text-left font-medium focus:outline-none focus:ring-2 focus:ring-rose-500",
                                        item.active ? "text-rose-600" : "text-gray-900"
                                    )}
                                >
                                    {item.label}
                                </button>
                            </div>
                        {/if}
                    {/each}
                </div>

                {#if !$page.data.session.authenticated}
                    <div class="space-y-6 border-t border-gray-200 px-4 py-6">
                        <div class="flow-root">
                            <a href="/sign-up" class="-m-2 block p-2 font-medium text-gray-900">
                                Create an account
                            </a>
                        </div>
                    </div>
                {/if}
            </div>
        </div>
    </div>
{/if}
