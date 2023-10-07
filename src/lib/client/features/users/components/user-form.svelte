<script lang="ts">
    import { enhance } from "$app/forms";
    import { page } from "$app/stores";
    import { createForm, type EnhanceHandlerOptions } from "$client/stores/form";

    import { Role } from "$features/users/enum";
    import type { UserData } from "$features/users/types";
    import {
        updateUserSuite,
        type UpdateUserPayload,
    } from "$features/users/validations/update-user";
    import { countries, states } from "$features/countries/store";
    import { Color } from "$client/enums/theme";
    import { notification } from "$client/stores/notification";

    import ActionableCard from "$client/components/shared/actionable-card.svelte";
    import Button from "$client/components/shared/button.svelte";
    import Image from "$client/components/shared/image.svelte";
    import SelectInput from "$client/components/shared/select-input.svelte";
    import TextInput from "$client/components/shared/text-input.svelte";
    import TextareaInput from "$client/components/shared/textarea-input.svelte";

    import { startCase } from "lodash-es";
    import { onMount } from "svelte";
    import { CheckCircle, Icon } from "svelte-hero-icons";
    import { fade } from "svelte/transition";

    export let userData: UserData;
    export let actionType: "users" | "settings";

    let actionUrl = {
        users: `/users/${$page.params.uid}?/update`,
        settings: "/settings?/account",
    };

    let success: "profile" | "information" | null = null;

    const { form, change, errors, setValue, enhanceHandler } = createForm<UpdateUserPayload>({
        initialValues: {
            displayName: userData.displayName,
            role: userData.customClaims?.isAdmin ? Role.ADMIN : Role.USER,
            about: userData.about ?? "",
            firstName: userData.information?.firstName ?? "",
            lastName: userData.information?.lastName ?? "",
            email: userData.email ?? "",
            streetAddress: userData.information?.address?.street ?? "",
            city: userData.information?.address?.city ?? "",
            state: userData.information?.address?.state ?? "",
            postalCode: userData.information?.address?.postalCode ?? "",
            country: userData.information?.address?.country ?? "Malaysia",
        },
        validationSuite: updateUserSuite,
    });

    const handleChangeCountry = async (
        event: CustomEvent<{ name: string; value: string | string[] | boolean }>
    ) => {
        setValue("state", "");

        await states.loadStates(event.detail.value as string);

        change(event);
    };

    const handleFileChange = async (event: Event) => {
        let input = event.target as HTMLInputElement;

        const [file] = input.files ?? [];

        if (file)
            change({
                ...event,
                detail: {
                    name: input.name,
                    value: file,
                },
            });
    };

    const handlerOptions: EnhanceHandlerOptions = {
        onError: ({ message }) => {
            notification.send({
                type: "error",
                message: message,
            });
        },
    };

    onMount(() => {
        states.loadStates($form.data.country);
    });

    $: showRoleInput = actionType === "users" && $page.data.session.user?.customClaims?.isAdmin;

    $: userPhoto = (() => {
        if ($form.data.userPhoto instanceof File) {
            return URL.createObjectURL($form.data.userPhoto);
        }

        return $form.data.userPhoto;
    })();

    $: (() => {
        let timeout: ReturnType<typeof setTimeout>;

        if (success) {
            timeout = setTimeout(() => {
                success = null;
            }, 1000);
        }

        return () => clearTimeout(timeout);
    })();
</script>

<div class="space-y-6">
    <form
        action={actionUrl[actionType]}
        method="POST"
        use:enhance={enhanceHandler({
            ...handlerOptions,
            onSuccess: async () => {
                success = "profile";
            },
        })}
        on:submit
        enctype="multipart/form-data"
    >
        <ActionableCard>
            <div>
                <h3 class="text-lg font-medium leading-6 text-gray-900">Profile</h3>
                <p class="mt-1 text-sm text-gray-500">
                    This information will be displayed publicly so be careful what you share.
                </p>
            </div>

            <div class="mt-6 flex flex-col lg:flex-row">
                <div class="flex-grow space-y-6">
                    <div class="flex gap-6">
                        <div class="w-full lg:w-1/2">
                            <TextInput
                                id="display-name"
                                label="Display name"
                                name="display-name"
                                value={$form.data.displayName}
                                autocomplete="nickname"
                                required
                                errors={$errors["display-name"]}
                                on:input={change}
                            />
                        </div>

                        {#if showRoleInput}
                            <div class="w-2/3 lg:w-1/3">
                                <SelectInput
                                    id="role"
                                    label="Role"
                                    name="role"
                                    value={$form.data.role}
                                    autocomplete="role"
                                    required
                                    errors={$errors["role"]}
                                    on:input={change}
                                >
                                    <svelte:fragment>
                                        {#each Object.values(Role) as role}
                                            <option value={role}>{startCase(role)}</option>
                                        {/each}
                                    </svelte:fragment>
                                </SelectInput>
                            </div>
                        {/if}
                    </div>

                    <div>
                        <TextareaInput
                            id="about"
                            label="About"
                            name="about"
                            value={$form.data.about}
                            placeholder="Tell us about yourself"
                            maxlength={250}
                            hint="Brief description for your profile."
                            errors={$errors["about"]}
                            on:input={change}
                        />
                    </div>
                </div>

                <div class="mt-6 flex-grow lg:ml-6 lg:mt-0 lg:flex-shrink-0 lg:flex-grow-0">
                    <p class="text-sm font-medium text-gray-700" aria-hidden="true">Photo</p>
                    <div class="mt-1">
                        <div class="relative flex items-center">
                            <div
                                class="inline-block h-12 w-12 flex-shrink-0 overflow-hidden rounded-full lg:h-40 lg:w-40"
                                aria-hidden="true"
                            >
                                <Image
                                    src={userPhoto}
                                    alt="{$form.data.displayName} avatar"
                                    fallback="/images/avatar.png"
                                />
                            </div>
                            <div class="ml-5 rounded-md shadow-sm lg:absolute lg:inset-0 lg:m-0">
                                <div
                                    class="group relative flex items-center justify-center rounded-md border border-gray-300 px-3 py-2 focus-within:ring-2 focus-within:ring-rose-500 focus-within:ring-offset-2 hover:bg-gray-50 lg:h-full lg:rounded-full lg:bg-opacity-75 lg:text-sm lg:font-medium lg:text-white lg:opacity-0 lg:focus-within:bg-rose-700 lg:focus-within:bg-opacity-75 lg:focus-within:opacity-100 lg:hover:bg-rose-700 lg:hover:bg-opacity-75 lg:hover:opacity-100"
                                >
                                    <label
                                        for="user-photo"
                                        class="pointer-events-none relative text-sm font-medium leading-4 text-gray-700 lg:text-white"
                                    >
                                        <span>Change</span>
                                        <span class="sr-only"> user photo</span>
                                    </label>
                                    <input
                                        type="file"
                                        id="user-photo"
                                        name="user-photo"
                                        class="absolute inset-0 h-full w-full cursor-pointer rounded-md border-gray-300 opacity-0"
                                        on:input={handleFileChange}
                                        accept="image/*"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <svelte:fragment slot="action">
                {#if success === "profile"}
                    <span
                        class="flex items-center gap-0.5 text-xs text-green-600"
                        transition:fade={{ duration: 100 }}
                    >
                        <Icon src={CheckCircle} class="h-5 w-5" aria-hidden="true" />
                        Saved
                    </span>
                {/if}

                <Button type="submit" color={Color.PRIMARY} isLoading={$form.isLoading}>
                    Save
                </Button>
            </svelte:fragment>
        </ActionableCard>
    </form>

    <form
        action={actionUrl[actionType]}
        method="POST"
        use:enhance={enhanceHandler({
            ...handlerOptions,
            onSuccess: async () => {
                success = "information";
            },
        })}
        enctype="multipart/form-data"
    >
        <ActionableCard>
            <div>
                <h3 class="text-lg font-medium leading-6 text-gray-900">Personal Information</h3>
                <p class="mt-1 text-sm text-gray-500">
                    Use a permanent address where you can recieve mail.
                </p>
            </div>

            <div class="grid grid-cols-6 gap-6">
                <div class="col-span-6 sm:col-span-3">
                    <TextInput
                        id="first-name"
                        label="First name"
                        name="first-name"
                        value={$form.data.firstName}
                        autocomplete="given-name"
                        errors={$errors["first-name"]}
                        on:input={change}
                    />
                </div>

                <div class="col-span-6 sm:col-span-3">
                    <TextInput
                        id="last-name"
                        label="Last name"
                        name="last-name"
                        value={$form.data.lastName}
                        autocomplete="family-name"
                        errors={$errors["last-name"]}
                        on:input={change}
                    />
                </div>

                <div class="col-span-6 sm:col-span-4">
                    <TextInput
                        type="email"
                        id="email"
                        label="Email address"
                        name="email"
                        value={$form.data.email}
                        autocomplete="email"
                        required
                        readonly
                    />
                </div>

                <div class="col-span-6 sm:col-span-3">
                    <SelectInput
                        id="country"
                        label="Country"
                        name="country"
                        value={$form.data.country}
                        autocomplete="country-name"
                        errors={$errors["country"]}
                        on:input={handleChangeCountry}
                    >
                        {#each $countries as country}
                            <option value={country.name}>{country.name}</option>
                        {/each}
                    </SelectInput>
                </div>

                <div class="col-span-6">
                    <TextInput
                        id="street-address"
                        label="Street address"
                        name="street-address"
                        value={$form.data.streetAddress}
                        autocomplete="street-address"
                        errors={$errors["street-address"]}
                        on:input={change}
                    />
                </div>

                <div class="col-span-6 sm:col-span-6 lg:col-span-2">
                    <TextInput
                        id="city"
                        label="City"
                        name="city"
                        value={$form.data.city}
                        autocomplete="address-level2"
                        errors={$errors["city"]}
                        on:input={change}
                    />
                </div>

                <div class="col-span-6 sm:col-span-3 lg:col-span-2">
                    <SelectInput
                        id="state"
                        label="State / Province"
                        name="state"
                        value={$form.data.state}
                        autocomplete="address-level1"
                        errors={$errors["state"]}
                        on:input={change}
                        disabled={$states.length === 0}
                    >
                        {#each $states as state}
                            <option value={state.name} selected={$form.data.state === state.name}>
                                {state.name}
                            </option>
                        {/each}
                    </SelectInput>
                </div>

                <div class="col-span-6 sm:col-span-3 lg:col-span-2">
                    <TextInput
                        id="postal-code"
                        label="ZIP / Postal code"
                        name="postal-code"
                        value={$form.data.postalCode}
                        autocomplete="postal-code"
                        inputmode="numeric"
                        errors={$errors["postal-code"]}
                        on:input={change}
                    />
                </div>
            </div>

            <svelte:fragment slot="action">
                {#if success === "information"}
                    <span
                        class="flex items-center gap-0.5 text-xs text-green-600"
                        transition:fade={{ duration: 100 }}
                    >
                        <Icon src={CheckCircle} class="h-5 w-5" aria-hidden="true" />
                        Saved
                    </span>
                {/if}

                <Button type="submit" color={Color.PRIMARY} isLoading={$form.isLoading}>
                    Save
                </Button>
            </svelte:fragment>
        </ActionableCard>
    </form>
</div>
