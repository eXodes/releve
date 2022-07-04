<script context="module" lang="ts">
    import type { Load } from "./__types";
    import type { GetOutput } from "$routes/settings/account";

    import { endpoint } from "$utils/endpoint";

    export const load: Load = async ({ session, fetch }) => {
        if (!session.authenticated) {
            return {
                status: 303,
                redirect: "/",
            };
        }

        const { user } = await endpoint<GetOutput, null>("/settings/account", {
            method: "GET",
            fetch,
        });

        if (!user) {
            return {
                status: 303,
                redirect: "/",
            };
        }

        return {
            props: {
                user,
            },
        };
    };
</script>

<script lang="ts">
    import type { User } from "$features/users/types";

    import { Tab, TabGroup, TabList, TabPanel, TabPanels } from "@rgossiaux/svelte-headlessui";
    import { Icon, Key, UserCircle } from "svelte-hero-icons";

    import { invalidate } from "$app/navigation";
    import { page } from "$app/stores";

    import { classNames } from "$utils/style";

    import Container from "$components/shared/container.svelte";
    import UserForm from "$features/users/components/user-form.svelte";
    import PasswordForm from "$features/settings/components/password-form.svelte";

    export let user: User;
    let hash = $page.url.hash;

    const navigation = [
        { name: "Account", href: "#account", icon: UserCircle },
        { name: "Password", href: "#password", icon: Key },
    ];

    let loadIndex = navigation.findIndex((item) => item.href === hash);
</script>

<svelte:head>
    <title>User settings</title>
</svelte:head>

<Container>
    <TabGroup vertical defaultIndex={loadIndex} class="lg:grid lg:grid-cols-12 lg:gap-x-5">
        <TabList
            as="aside"
            class="py-6 px-2 sm:px-6 lg:col-span-3 lg:py-0 lg:px-0"
            let:selectedIndex
        >
            <nav class="space-y-1">
                {#each navigation as item, itemIdx (item.name)}
                    <Tab
                        as="a"
                        href={item.href}
                        class={classNames(
                            selectedIndex === itemIdx
                                ? "bg-rose-50 text-rose-700 hover:text-rose-700 hover:bg-rose-50/50"
                                : "text-gray-900 hover:text-gray-900 hover:bg-gray-50",
                            "group rounded-md px-3 py-2 flex items-center text-sm font-medium"
                        )}
                        aria-current={selectedIndex === itemIdx ? "page" : undefined}
                    >
                        <Icon
                            src={item.icon}
                            class={classNames(
                                selectedIndex === itemIdx
                                    ? "text-rose-500 group-hover:text-rose-500"
                                    : "text-gray-400 group-hover:text-gray-500",
                                "flex-shrink-0 -ml-1 mr-3 h-6 w-6"
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
                    formAction="/settings/account?_method=PATCH"
                    userData={user}
                    on:submit={async () => await invalidate("/settings")}
                />
            </TabPanel>

            <TabPanel>
                <PasswordForm />
            </TabPanel>
        </TabPanels>
    </TabGroup>
</Container>
