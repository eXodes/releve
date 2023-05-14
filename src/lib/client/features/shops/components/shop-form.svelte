<script lang="ts">
    import { applyAction, enhance, type SubmitFunction } from "$app/forms";
    import { page } from "$app/stores";
    import { Color } from "$client/enums/theme";
    import { categories } from "$features/categories/store";
    import { countries, states } from "$features/countries/store";
    import { deliveryServices } from "$features/delivery-providers/store";
    import { ShopStatus } from "$features/shops/enum";
    import type { ShopData } from "$features/shops/types";
    import type { ShopPayload, ShopResponse } from "$features/shops/validations/shop";
    import suite from "$features/shops/validations/shop";
    import { notification } from "$client/stores/notification";
    import type { ValidationError } from "$client/types/error";

    import ActionableCard from "$client/components/shared/actionable-card.svelte";
    import Button from "$client/components/shared/button.svelte";
    import CheckboxInput from "$client/components/shared/checkbox-input.svelte";
    import SelectInput from "$client/components/shared/select-input.svelte";
    import TextInput from "$client/components/shared/text-input.svelte";
    import UrlInput from "$client/components/shared/url-input.svelte";

    import { camelCase, startCase } from "lodash-es";
    import { createEventDispatcher, onMount } from "svelte";
    import type { SuiteRunResult } from "vest";

    const ActionType = {
        CREATE: "create",
        UPDATE_PUBLIC: "update-public",
        UPDATE_PRIVATE: "update-private",
    } as const;

    export let shopData: ShopData | undefined = undefined;
    export let actionType: (typeof ActionType)[keyof typeof ActionType];
    export let isPrivate = actionType === "update-private";

    let actionUrl = {
        [ActionType.CREATE]: "/shops?/create",
        [ActionType.UPDATE_PUBLIC]: `/shops/${shopData?.uid}?/update`,
        [ActionType.UPDATE_PRIVATE]: `/my/shops/${shopData?.uid}?/update`,
    };

    let shop: ShopPayload = {
        name: "",
        link: "",
        categories: [],
        deliveryProviders: [],
        streetAddress: "",
        city: "",
        state: "",
        postalCode: "",
        country: "Malaysia",
        status: ShopStatus.PENDING,
    };

    let result: SuiteRunResult;
    let errors: { [key: string]: string[] } = {};

    const dispatch = createEventDispatcher<{
        success: void;
        cancel: void;
    }>();

    const handleChange = async ({
        detail,
    }: CustomEvent<{ name: string; value: string | string[] | boolean }>) => {
        shop = {
            ...shop,
            [camelCase(detail.name)]: detail.value,
        };

        if (detail.name === "country") {
            shop.state = "";
            await states.loadStates(detail.value as string);
        }

        result = suite(shop, detail.name);
        errors = result.getErrors();
    };

    const handleSubmit: SubmitFunction<ShopResponse, ValidationError> =
        () =>
        async ({ result }) => {
            if (result.type === "failure") {
                if (result.data?.name === "ValidationError" && result.data?.errors) {
                    errors = result.data?.errors;
                }
            }

            if (result.type === "error") {
                notification.send({
                    type: "error",
                    message: result.error.message,
                });
            }

            if (result.type === "success") {
                if (result.data)
                    notification.send({
                        type: "success",
                        message: result.data.message,
                    });

                await applyAction(result);

                dispatch("success");
            }
        };

    onMount(() => {
        if (shopData) {
            states.loadStates(shopData.address.country);

            shop = {
                name: shopData.name,
                link: shopData.link,
                categories: shopData.categories,
                deliveryProviders: shopData.deliveryProviders,
                streetAddress: shopData.address.street,
                city: shopData.address.city,
                state: shopData.address.state,
                postalCode: shopData.address.postalCode,
                country: shopData.address.country,
                status: shopData.status,
            };

            result = suite(shop);
            errors = result.getErrors();
            return;
        }

        states.loadStates(shop.country);
    });

    $: showStatusInput = $page.data?.session.user?.customClaims.isAdmin && !isPrivate;

    $: disabled = result?.hasErrors() || !result?.isValid();
</script>

<form action={actionUrl[actionType]} method="POST" use:enhance={handleSubmit} on:submit>
    <ActionableCard>
        <div>
            <h3 class="text-lg font-medium leading-6 text-gray-900">Shop Details</h3>
            <p class="mt-1 text-sm text-gray-500">Shop details are used to identify your shop.</p>
        </div>

        <div class="grid grid-cols-6 gap-6">
            <div class="col-span-6 sm:col-span-3">
                <TextInput
                    id="shop-name"
                    label="Name"
                    name="name"
                    value={shop.name}
                    autocomplete="shop-name"
                    required
                    errors={errors["name"]}
                    on:input={handleChange}
                />
            </div>

            <div class="col-span-6 sm:col-span-3">
                {#if showStatusInput}
                    <SelectInput
                        id="status"
                        label="Status"
                        name="status"
                        value={shop.status}
                        autocomplete="status"
                        required
                        disabled={isPrivate}
                        errors={errors["status"]}
                        on:input={handleChange}
                    >
                        <svelte:fragment>
                            <option value={ShopStatus.PENDING}>
                                {startCase(ShopStatus.PENDING)}
                            </option>
                            <option value={ShopStatus.APPROVED}>
                                {startCase(ShopStatus.APPROVED)}
                            </option>
                            <option value={ShopStatus.REJECTED}>
                                {startCase(ShopStatus.REJECTED)}
                            </option>
                        </svelte:fragment>
                    </SelectInput>
                {/if}
            </div>

            <div class="col-span-6 sm:col-span-4">
                <UrlInput
                    id="shop-link"
                    label="Link"
                    name="link"
                    value={shop.link}
                    autocomplete="shop-link"
                    required
                    errors={errors["link"]}
                    hint="URL doesn't require a protocol https:// or http://"
                    on:input={handleChange}
                />
            </div>

            <div class="col-span-6 sm:col-span-3">
                <SelectInput
                    id="categories"
                    label="Categories"
                    name="categories[]"
                    values={shop.categories}
                    autocomplete="categories"
                    required
                    multiple
                    errors={errors["categories"]}
                    on:input={handleChange}
                >
                    {#each $categories as category}
                        <option value={category.name}>{category.name}</option>
                    {/each}
                </SelectInput>
            </div>

            <div class="col-span-6 sm:col-span-3">
                <SelectInput
                    id="delivery-providers"
                    label="Delivery Services"
                    name="delivery-providers[]"
                    values={shop.deliveryProviders}
                    autocomplete="delivery-providers"
                    required
                    multiple
                    errors={errors["delivery-providers"]}
                    on:input={handleChange}
                >
                    {#each $deliveryServices as deliveryService}
                        <option value={deliveryService.name}>{deliveryService.name}</option>
                    {/each}
                </SelectInput>
            </div>

            <div class="col-span-6 sm:col-span-3">
                <SelectInput
                    id="country"
                    label="Country"
                    name="country"
                    bind:value={shop.country}
                    autocomplete="country-name"
                    required
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
                    value={shop.streetAddress}
                    autocomplete="street-address"
                    required
                    errors={errors["street-address"]}
                    on:input={handleChange}
                />
            </div>

            <div class="col-span-6 sm:col-span-6 lg:col-span-2">
                <TextInput
                    id="city"
                    label="City"
                    name="city"
                    value={shop.city}
                    autocomplete="address-level2"
                    required
                    errors={errors["city"]}
                    on:input={handleChange}
                />
            </div>

            <div class="col-span-6 sm:col-span-3 lg:col-span-2">
                <SelectInput
                    id="state"
                    label="State / Province"
                    name="state"
                    value={shop.state}
                    autocomplete="address-level1"
                    required
                    errors={errors["state"]}
                    on:input={handleChange}
                    disabled={$states.length === 0}
                >
                    {#if $states}
                        {#each $states as state}
                            <option value={state.name}>{state.name}</option>
                        {/each}
                    {/if}
                </SelectInput>
            </div>

            <div class="col-span-6 sm:col-span-3 lg:col-span-2">
                <TextInput
                    id="postal-code"
                    label="ZIP / Postal code"
                    name="postal-code"
                    value={shop.postalCode}
                    autocomplete="postal-code"
                    required
                    errors={errors["postal-code"]}
                    on:input={handleChange}
                />
            </div>

            {#if actionType === "create"}
                <div class="col-span-6">
                    <CheckboxInput
                        label="Make this shop private"
                        id="private"
                        name="private"
                        value="true"
                        checked={isPrivate}
                        on:input={handleChange}
                    />
                </div>
            {/if}
        </div>

        <svelte:fragment slot="action">
            <div class="flex gap-4">
                {#if actionType !== "create"}
                    <Button on:click={() => dispatch("cancel")}>Cancel</Button>
                {/if}

                <Button type="submit" color={Color.PRIMARY} disabled={disabled}>Save</Button>
            </div>
        </svelte:fragment>
    </ActionableCard>
</form>