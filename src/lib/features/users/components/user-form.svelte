<script lang="ts">
    import type { SuiteRunResult } from "vest";
    import type { User } from "$features/users/types";
    import type { UpdateUserDto } from "$features/users/validations/user";

    import { onMount } from "svelte";
    import { fade } from "svelte/transition";
    import { CheckCircle, Icon } from "svelte-hero-icons";
    import { camelCase, startCase } from "lodash-es";

    import suite from "$features/users/validations/user";
    import { Role } from "$features/users/enum";
    import { invalidate } from "$app/navigation";
    import { session } from "$app/stores";
    import { enhance } from "$actions/form";
    import { Color } from "$enums/theme";
    import { countries } from "$features/countries/store";
    import { notification } from "$stores/notification";
    import { states } from "$stores/states";
    import { getFileData } from "$utils/data";

    import TextInput from "$components/shared/text-input.svelte";
    import TextareaInput from "$components/shared/textarea-input.svelte";
    import SelectInput from "$components/shared/select-input.svelte";
    import Image from "$components/shared/image.svelte";
    import Button from "$components/shared/button.svelte";
    import ActionableCard from "$components/shared/actionable-card.svelte";

    export let userData: User;
    export let formAction: string;

    let user: UpdateUserDto = {
        displayName: "",
        role: undefined,
        about: "",
        userPhoto: undefined,
        firstName: "",
        lastName: "",
        email: "",
        streetAddress: "",
        city: "",
        state: "",
        postalCode: "",
        country: "",
    };

    let userPhoto: string | undefined = userData.avatar?.small.url;
    let result: SuiteRunResult;
    let errors: { [key: string]: string[] } = {};
    let errorMessage: string | undefined = undefined;
    let profileSuccess = false;
    let informationSuccess = false;

    const handleChange = async ({
        detail,
    }: CustomEvent<{ name: string; value: string | File }>) => {
        user = {
            ...user,
            [camelCase(detail.name)]: detail.value,
        };

        if (detail.name === "country") {
            user.state = "";
            await states.loadStates(detail.value as string);
        }

        result = suite(user, detail.name);
        errors = result.getErrors();
    };

    const handleFileChange = async (event: Event) => {
        let input = event.target as HTMLInputElement;

        user.userPhoto = input.files?.[0] ?? undefined;

        user = {
            ...user,
            [camelCase(input.name)]: user.userPhoto,
        };

        result = suite(user, input.name);
        errors = result.getErrors();

        if (user.userPhoto) {
            userPhoto = (await getFileData(user.userPhoto)) as string;
        }
    };

    onMount(() => {
        user = {
            ...user,
            displayName: userData.displayName ?? "",
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
        };

        states.loadStates(user.country);
    });

    $: errorMessage &&
        notification.send({
            type: "error",
            message: errorMessage,
        });
</script>

<div class="space-y-6">
    <form
        action={formAction}
        method="POST"
        use:enhance={{
            pending: () => {
                profileSuccess = false;
                errorMessage = undefined;
                errors = {};
            },
            error: async ({ error, response }) => {
                if (response) {
                    const data = await response.json();

                    if (typeof data.error === "string") {
                        errorMessage = data.error;
                    } else {
                        errors = data.error;
                    }
                } else {
                    errorMessage = error?.message;
                }
            },
            result: async ({ response }) => {
                const data = await response.json();
                user = {
                    ...user,
                    ...data.user,
                };

                profileSuccess = true;

                setTimeout(() => {
                    profileSuccess = false;
                }, 2000);
            },
        }}
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
                        <div class="w-1/2">
                            <TextInput
                                id="display-name"
                                label="Display name"
                                name="display-name"
                                value={user.displayName}
                                autocomplete="nickname"
                                required
                                errors={errors["display-name"]}
                                on:input={handleChange}
                            />
                        </div>

                        <div class="w-1/3">
                            {#if $session.user?.claims?.isAdmin}
                                <SelectInput
                                    id="role"
                                    label="Role"
                                    name="role"
                                    value={user.role}
                                    autocomplete="role"
                                    required
                                    errors={errors["role"]}
                                    on:input={handleChange}
                                >
                                    <svelte:fragment>
                                        <option value={Role.ADMIN}>
                                            {startCase(Role.ADMIN)}
                                        </option>
                                        <option value={Role.USER}>
                                            {startCase(Role.USER)}
                                        </option>
                                    </svelte:fragment>
                                </SelectInput>
                            {/if}
                        </div>
                    </div>

                    <div>
                        <TextareaInput
                            id="about"
                            label="About"
                            name="about"
                            value={user.about}
                            placeholder="Tell us about yourself"
                            maxLength={250}
                            hint="Brief description for your profile."
                            errors={errors["about"]}
                            on:input={handleChange}
                        />
                    </div>
                </div>

                <div class="mt-6 flex-grow lg:mt-0 lg:ml-6 lg:flex-shrink-0 lg:flex-grow-0">
                    <p class="text-sm font-medium text-gray-700" aria-hidden="true">Photo</p>
                    <div class="mt-1 lg:hidden">
                        <div class="flex items-center">
                            <div
                                class="inline-block h-12 w-12 flex-shrink-0 overflow-hidden rounded-full"
                                aria-hidden="true"
                            >
                                <Image src={userPhoto} alt={user.displayName} />
                            </div>
                            <div class="ml-5 rounded-md shadow-sm">
                                <div
                                    class="group relative flex items-center justify-center rounded-md border border-gray-300 py-2 px-3 focus-within:ring-2 focus-within:ring-rose-500 focus-within:ring-offset-2 hover:bg-gray-50"
                                >
                                    <label
                                        for="mobile-user-photo"
                                        class="pointer-events-none relative text-sm font-medium leading-4 text-gray-700"
                                    >
                                        <span>Change</span>
                                        <span class="sr-only"> user photo</span>
                                    </label>
                                    <input
                                        type="file"
                                        id="mobile-user-photo"
                                        name="user-photo"
                                        class="absolute h-full w-full cursor-pointer rounded-md border-gray-300 opacity-0"
                                        on:input={handleFileChange}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="relative hidden overflow-hidden rounded-full lg:block">
                        <div class="relative h-40 w-40 rounded-full">
                            <Image src={userPhoto} alt={user.displayName} />
                        </div>
                        <label
                            for="desktop-user-photo"
                            class="absolute inset-0 flex h-full w-full items-center justify-center bg-rose-700 bg-opacity-75 text-sm font-medium text-white opacity-0 focus-within:opacity-100 hover:opacity-100"
                        >
                            <span>Change</span>
                            <span class="sr-only"> user photo</span>
                            <input
                                type="file"
                                id="desktop-user-photo"
                                name="user-photo"
                                class="absolute inset-0 h-full w-full cursor-pointer rounded-md border-gray-300 opacity-0"
                                on:input={handleFileChange}
                            />
                        </label>
                    </div>
                </div>
            </div>

            <svelte:fragment slot="action">
                {#if profileSuccess}
                    <span
                        class="flex items-center gap-0.5 text-xs text-green-600"
                        transition:fade={{ duration: 100 }}
                    >
                        <Icon src={CheckCircle} class="h-5 w-5" aria-hidden="true" />
                        Saved
                    </span>
                {/if}

                <Button type="submit" color={Color.PRIMARY}>Save</Button>
            </svelte:fragment>
        </ActionableCard>
    </form>

    <form
        action={formAction}
        method="POST"
        use:enhance={{
            pending: () => {
                informationSuccess = false;
                errorMessage = undefined;
                errors = {};
            },
            error: async ({ error, response }) => {
                if (response) {
                    const data = await response.json();

                    if (typeof data.error === "string") {
                        errorMessage = data.error;
                    } else {
                        errors = data.error;
                    }
                } else {
                    errorMessage = error?.message;
                }
            },
            result: async ({ response }) => {
                const data = await response.json();
                user = {
                    ...user,
                    ...data.user,
                };

                informationSuccess = true;
                await invalidate("/settings");

                setTimeout(() => {
                    informationSuccess = false;
                }, 2000);
            },
        }}
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
                        value={user.firstName}
                        autocomplete="given-name"
                        errors={errors["first-name"]}
                        on:input={handleChange}
                    />
                </div>

                <div class="col-span-6 sm:col-span-3">
                    <TextInput
                        id="last-name"
                        label="Last name"
                        name="last-name"
                        value={user.lastName}
                        autocomplete="family-name"
                        errors={errors["last-name"]}
                        on:input={handleChange}
                    />
                </div>

                <div class="col-span-6 sm:col-span-4">
                    <TextInput
                        type="email"
                        id="email-address"
                        label="Email address"
                        name="email-address"
                        value={user.email}
                        autocomplete="email"
                        required
                        disabled
                    />
                </div>

                <div class="col-span-6 sm:col-span-3">
                    <SelectInput
                        id="country"
                        label="Country"
                        name="country"
                        value={user.country}
                        autocomplete="country-name"
                        errors={errors["country"]}
                        on:input={handleChange}
                    >
                        {#each $countries as country}
                            <option value={country.label}>{country.label}</option>
                        {/each}
                    </SelectInput>
                </div>

                <div class="col-span-6">
                    <TextInput
                        id="street-address"
                        label="Street address"
                        name="street-address"
                        value={user.streetAddress}
                        autocomplete="street-address"
                        errors={errors["street-address"]}
                        on:input={handleChange}
                    />
                </div>

                <div class="col-span-6 sm:col-span-6 lg:col-span-2">
                    <TextInput
                        id="city"
                        label="City"
                        name="city"
                        value={user.city}
                        autocomplete="address-level2"
                        errors={errors["city"]}
                        on:input={handleChange}
                    />
                </div>

                <div class="col-span-6 sm:col-span-3 lg:col-span-2">
                    <SelectInput
                        id="state"
                        label="State / Province"
                        name="state"
                        value={user.state}
                        autocomplete="address-level1"
                        errors={errors["state"]}
                        on:input={handleChange}
                        disabled={$states.length === 0}
                    >
                        {#each $states as state}
                            <option value={state.label}>{state.label}</option>
                        {/each}
                    </SelectInput>
                </div>

                <div class="col-span-6 sm:col-span-3 lg:col-span-2">
                    <TextInput
                        id="postal-code"
                        label="ZIP / Postal code"
                        name="postal-code"
                        value={user.postalCode}
                        autocomplete="postal-code"
                        errors={errors["postal-code"]}
                        on:input={handleChange}
                    />
                </div>
            </div>

            <svelte:fragment slot="action">
                {#if informationSuccess}
                    <span
                        class="flex items-center gap-0.5 text-xs text-green-600"
                        transition:fade={{ duration: 100 }}
                    >
                        <Icon src={CheckCircle} class="h-5 w-5" aria-hidden="true" />
                        Saved
                    </span>
                {/if}

                <button
                    type="submit"
                    class="inline-flex justify-center rounded-md border border-transparent bg-rose-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-rose-700 focus:outline-none focus:ring-2 focus:ring-rose-500 focus:ring-offset-2"
                >
                    Save
                </button>
            </svelte:fragment>
        </ActionableCard>
    </form>
</div>
