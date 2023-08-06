<script lang="ts">
    import { invalidate } from "$app/navigation";
    import { page } from "$app/stores";

    import { classNames } from "$client/utils/style";

    import Container from "$client/components/shared/container.svelte";
    import PasswordForm from "$features/users/components/password-form.svelte";
    import UserForm from "$features/users/components/user-form.svelte";

    import { Tab, TabGroup, TabList, TabPanel, TabPanels } from "@rgossiaux/svelte-headlessui";
    import { Icon, Key, UserCircle } from "svelte-hero-icons";

    import type { PageData } from "./$types";

    export let data: PageData;

    let hash = $page.url.hash;

    const sideNavigation = [
        { name: "Account", href: "#account", icon: UserCircle },
        { name: "Password", href: "#password", icon: Key },
    ];

    let defaultTabIndex = sideNavigation.findIndex((item) => item.href === hash);
</script>

<svelte:head>
    <title>User settings</title>
</svelte:head>

<Container>
    <TabGroup vertical defaultIndex={defaultTabIndex} class="lg:grid lg:grid-cols-12 lg:gap-x-5">
        <TabList
            as="aside"
            class="px-2 py-6 sm:px-6 lg:col-span-3 lg:px-0 lg:py-0"
            let:selectedIndex
        >
            <nav class="space-y-1">
                {#each sideNavigation as item, itemIdx (item.name)}
                    <Tab
                        as="a"
                        href={item.href}
                        class={classNames(
                            selectedIndex === itemIdx
                                ? "bg-rose-50 text-rose-700 hover:bg-rose-50/50 hover:text-rose-700"
                                : "text-gray-900 hover:bg-gray-50 hover:text-gray-900",
                            "group flex items-center rounded-md px-3 py-2 text-sm font-medium"
                        )}
                        aria-current={selectedIndex === itemIdx ? "page" : undefined}
                    >
                        <Icon
                            src={item.icon}
                            class={classNames(
                                selectedIndex === itemIdx
                                    ? "text-rose-500 group-hover:text-rose-500"
                                    : "text-gray-400 group-hover:text-gray-500",
                                "-ml-1 mr-3 h-6 w-6 flex-shrink-0"
                            )}
                            aria-hidden="true"
                        />
                        <span class="truncate">{item.name}</span>
                    </Tab>
                {/each}
            </nav>
        </TabList>

        <TabPanels class="mb-12 sm:px-6 lg:col-span-9 lg:px-0">
            <TabPanel>
                <UserForm
                    actionType="settings"
                    userData={data.user}
                    on:submit={() => invalidate("settings")}
                />
            </TabPanel>

            <TabPanel>
                <PasswordForm on:submit={() => invalidate("settings")} />
            </TabPanel>
        </TabPanels>
    </TabGroup>
</Container>
