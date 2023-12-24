<script lang="ts">
    import { invalidate } from "$app/navigation";
    import { page } from "$app/stores";

    import { classNames } from "$client/utils/style";

    import Container from "$client/components/shared/container.svelte";
    import PasswordForm from "$features/users/components/password-form.svelte";
    import UserForm from "$features/users/components/user-form.svelte";

    import { createTabs } from "svelte-headlessui";
    import { Icon, Key, UserCircle } from "svelte-hero-icons";

    import type { PageData } from "./$types";

    export let data: PageData;

    let hash = $page.url.hash;

    const sideNavigation = [
        { name: "Account", href: "#account", icon: UserCircle },
        { name: "Password", href: "#password", icon: Key },
    ];

    const defaultSelectedTab = sideNavigation.find((item) => item.href === hash)?.name ?? "Account";

    const tabs = createTabs({ selected: defaultSelectedTab, orientation: "vertical" });
    const keys = sideNavigation.map((item) => item.name);
</script>

<svelte:head>
    <title>User settings</title>
</svelte:head>

<Container>
    <div class="lg:grid lg:grid-cols-12 lg:gap-x-5">
        <aside class="px-2 py-6 sm:px-6 lg:col-span-3 lg:px-0 lg:py-0">
            <nav class="space-y-1" use:tabs.list>
                {#each sideNavigation as item (item.name)}
                    {@const selected = $tabs.selected === item.name}

                    <a
                        href={item.href}
                        class={classNames(
                            selected
                                ? "bg-rose-50 text-rose-700 hover:bg-rose-50/50 hover:text-rose-700"
                                : "text-gray-900 hover:bg-gray-50 hover:text-gray-900",
                            "group flex items-center rounded-md px-3 py-2 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-rose-500 focus:ring-offset-2"
                        )}
                        use:tabs.tab={{ value: item.name }}
                    >
                        <Icon
                            src={item.icon}
                            class={classNames(
                                selected
                                    ? "text-rose-500 group-hover:text-rose-500"
                                    : "text-gray-400 group-hover:text-gray-500",
                                "-ml-1 mr-3 h-6 w-6 flex-shrink-0"
                            )}
                            aria-hidden="true"
                        />
                        <span class="truncate">{item.name}</span>
                    </a>
                {/each}
            </nav>
        </aside>

        <div class="mb-12 sm:px-6 lg:col-span-9 lg:px-0">
            {#each keys as key}
                {@const selected = $tabs.selected === key}

                <div
                    class={classNames("rounded outline-none", !selected && "hidden")}
                    use:tabs.panel
                >
                    {#if $tabs.selected === "Account"}
                        <UserForm
                            actionType="settings"
                            userData={data.user}
                            on:submit={() => invalidate("settings")}
                        />
                    {/if}

                    {#if $tabs.selected === "Password"}
                        <PasswordForm on:submit={() => invalidate("settings")} />
                    {/if}
                </div>
            {/each}
        </div>
    </div>
</Container>
