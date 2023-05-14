<script lang="ts">
    import { applyAction, enhance, type SubmitFunction } from "$app/forms";
    import { page } from "$app/stores";
    import { countries, states } from "$features/countries/store";
    import { Role } from "$features/users/enum";
    import type { UserData } from "$features/users/types";
    import type {
        UpdateUserPayload,
        UpdateUserResponse,
    } from "$features/users/validations/update-user";
    import { updateUserSuite } from "$features/users/validations/update-user";
    import { Color } from "$client/enums/theme";
    import { notification } from "$client/stores/notification";
    import type { ValidationError } from "$client/types/error";
    import { getFileData } from "$client/utils/data";

    import ActionableCard from "$client/components/shared/actionable-card.svelte";
    import Button from "$client/components/shared/button.svelte";
    import Image from "$client/components/shared/image.svelte";
    import SelectInput from "$client/components/shared/select-input.svelte";
    import TextInput from "$client/components/shared/text-input.svelte";
    import TextareaInput from "$client/components/shared/textarea-input.svelte";

    import { camelCase, startCase } from "lodash-es";
    import { onMount } from "svelte";
    import { CheckCircle, Icon } from "svelte-hero-icons";
    import { fade } from "svelte/transition";
    import { media } from "svelte-match-media";
    import type { SuiteRunResult } from "vest";

    export let userData: UserData;
    export let actionType: "users" | "settings";

    let actionUrl = {
        users: `/users/${$page.params.uid}?/update`,
        settings: "/settings?/account",
    };

    let user: UpdateUserPayload = {
        displayName: "",
        role: undefined,
        about: "",
        userPhoto: undefined,
        firstName: "",
        lastName: "",
        email: "",
        phoneNumber: "",
        streetAddress: "",
        city: "",
        state: "",
        postalCode: "",
        country: "",
    };

    let userPhoto: string | undefined = userData.avatar.small.url;
    let result: SuiteRunResult;
    let errors: { [key: string]: string[] } = {};
    let errorMessage: string | undefined = undefined;
    let profileSuccess = false;
    let informationSuccess = false;

    const handleChange = ({ detail }: CustomEvent<{ name: string; value: string | string[] }>) => {
        user = {
            ...user,
            [camelCase(detail.name)]: detail.value,
        };

        if (detail.name === "country") {
            user.state = "";
            states.loadStates(detail.value as string);
        }

        result = updateUserSuite(user, detail.name);
        errors = result.getErrors();
    };

    const handleFileChange = async (event: Event) => {
        let input = event.target as HTMLInputElement;

        user.userPhoto = input.files?.[0] ?? undefined;

        user = {
            ...user,
            [camelCase(input.name)]: user.userPhoto,
        };

        result = updateUserSuite(user, input.name);
        errors = result.getErrors();

        if (user.userPhoto) {
            userPhoto = (await getFileData(user.userPhoto)) as string;
        }
    };

    const handleProfileSubmit: SubmitFunction<UpdateUserResponse, ValidationError> =
        () =>
        async ({ result }) => {
            if (result.type === "failure") {
                if (result.data?.name === "ValidationError" && result.data?.errors) {
                    errors = result.data?.errors;
                }
            }

            if (result.type === "error") {
                errorMessage = result.error.message;
            }

            if (result.type === "success") {
                profileSuccess = true;

                setTimeout(() => {
                    profileSuccess = false;
                }, 2000);

                await applyAction(result);
            }
        };

    const handleInformationSubmit: SubmitFunction<UpdateUserResponse, ValidationError> =
        () =>
        async ({ result }) => {
            if (result.type === "failure") {
                if (result.data?.name === "ValidationError" && result.data?.errors) {
                    errors = result.data?.errors;
                }
            }

            if (result.type === "error") {
                errorMessage = result.error.message;
            }

            if (result.type === "success") {
                informationSuccess = true;

                setTimeout(() => {
                    informationSuccess = false;
                }, 2000);

                await applyAction(result);
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

    $: showRoleInput =
        $page.data.session.user?.customClaims?.isAdmin &&
        actionType === "users" &&
        userData.uid !== $page.data.session.user?.uid;

    $: errorMessage &&
        notification.send({
            type: "error",
            message: errorMessage,
        });
</script>

<div class="space-y-6">
    <form action={actionUrl[actionType]} method="POST" use:enhance={handleProfileSubmit} on:submit>
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
                                value={user.displayName}
                                autocomplete="nickname"
                                required
                                errors={errors["display-name"]}
                                on:input={handleChange}
                            />
                        </div>

                        {#if showRoleInput}
                            <div class="w-1/3">
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
                            </div>
                        {/if}
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

                <div class="mt-6 flex-grow lg:ml-6 lg:mt-0 lg:flex-shrink-0 lg:flex-grow-0">
                    <p class="text-sm font-medium text-gray-700" aria-hidden="true">Photo</p>
                    {#if $media?.mobile}
                        <div class="mt-1">
                            <div class="flex items-center">
                                <div
                                    class="inline-block h-12 w-12 flex-shrink-0 overflow-hidden rounded-full"
                                    aria-hidden="true"
                                >
                                    <Image
                                        src={userPhoto}
                                        alt="{user.displayName} avatar"
                                        fallback="/images/avatar.png"
                                    />
                                </div>
                                <div class="ml-5 rounded-md shadow-sm">
                                    <div
                                        class="group relative flex items-center justify-center rounded-md border border-gray-300 px-3 py-2 focus-within:ring-2 focus-within:ring-rose-500 focus-within:ring-offset-2 hover:bg-gray-50"
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
                                            accept="image/*"
                                            capture="user"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    {/if}
                    {#if $media?.desktop}
                        <div class="relative overflow-hidden rounded-full">
                            <div class="relative h-40 w-40 rounded-full">
                                <Image
                                    src={userPhoto}
                                    alt="{user.displayName} avatar"
                                    fallback="/images/avatar.png"
                                />
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
                                    accept="image/*"
                                    capture="user"
                                />
                            </label>
                        </div>
                    {/if}
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

    <form action={actionUrl[actionType]} method="POST" use:enhance={handleInformationSubmit}>
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
                            <option value={country.name}>{country.name}</option>
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
                            <option value={state.name}>{state.name}</option>
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
                    class="inline-flex justify-center rounded-md border border-transparent bg-rose-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-rose-700 focus:outline-none focus:ring-2 focus:ring-rose-500 focus:ring-offset-2"
                >
                    Save
                </button>
            </svelte:fragment>
        </ActionableCard>
    </form>
</div>