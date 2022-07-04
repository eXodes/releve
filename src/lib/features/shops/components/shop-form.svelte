<script lang="ts">
    import type { SuiteRunResult } from "vest";
    import type { Shop } from "$features/shops/types";
    import type { UpdateShopDto } from "$features/shops/validations/shop";

    import { createEventDispatcher, onMount } from "svelte";
    import { camelCase, startCase } from "lodash-es";

    import suite from "$features/shops/validations/shop";
    import { session } from "$app/stores";
    import { enhance } from "$actions/form";
    import { ShopStatus } from "$features/shops/enum";
    import { Color } from "$enums/theme";
    import { categories } from "$features/categories/store";
    import { countries } from "$features/countries/store";
    import { deliveryServices } from "$features/delivery-services/store";
    import { notification } from "$stores/notification";
    import { states } from "$stores/states";

    import Button from "$components/shared/button.svelte";
    import SelectInput from "$components/shared/select-input.svelte";
    import TextInput from "$components/shared/text-input.svelte";
    import ActionableCard from "$components/shared/actionable-card.svelte";

    export let shopData: Shop | undefined = undefined;
    export let formAction: string;

    let shop: UpdateShopDto = {
        name: "",
        link: "",
        categories: "",
        deliveryServices: "",
        streetAddress: "",
        city: "",
        state: "",
        postalCode: "",
        country: "Malaysia",
        status: undefined,
    };

    let result: SuiteRunResult;
    let errors: { [key: string]: string[] } = {};
    let errorMessage: string | undefined = undefined;

    const dispatch = createEventDispatcher<{
        submit: void;
    }>();

    const handleChange = async ({
        detail,
    }: CustomEvent<{ name: string; value: string | string[] }>) => {
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

    onMount(() => {
        if (shopData) {
            states.loadStates(shopData.address.country);

            shop = {
                name: shopData.name,
                link: shopData.link,
                categories: shopData.categories.join(","),
                deliveryServices: shopData.deliveryServices.join(","),
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

    $: disabled = result?.hasErrors() || !result?.isValid();
</script>

<form
    action={formAction}
    method="POST"
    use:enhance={{
        pending: () => {
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

            if (errorMessage)
                notification.send({
                    type: "error",
                    message: errorMessage,
                });
        },
        result: async ({ response }) => {
            const data = await response.json();

            dispatch("submit");

            notification.send({
                type: "success",
                message: data.message,
            });
        },
    }}
>
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
                {#if $session.user?.claims?.isAdmin}
                    <SelectInput
                        id="status"
                        label="Status"
                        name="status"
                        value={shop.status}
                        autocomplete="status"
                        required
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
                <TextInput
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
                    value={shop.categories}
                    autocomplete="categories"
                    required
                    multiple
                    errors={errors["categories"]}
                    on:input={handleChange}
                >
                    {#each $categories as category}
                        <option value={category.label}>{category.label}</option>
                    {/each}
                </SelectInput>
            </div>

            <div class="col-span-6 sm:col-span-3">
                <SelectInput
                    id="delivery-services"
                    label="Delivery Services"
                    name="delivery-services[]"
                    value={shop.deliveryServices}
                    autocomplete="delivery-services"
                    required
                    multiple
                    errors={errors["delivery-services"]}
                    on:input={handleChange}
                >
                    {#each $deliveryServices as deliveryService}
                        <option value={deliveryService.label}>{deliveryService.label}</option>
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
                        <option value={country.label}>{country.label}</option>
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
                            <option value={state.label}>{state.label}</option>
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
        </div>

        <svelte:fragment slot="action">
            <Button type="submit" color={Color.PRIMARY} disabled={disabled}>Save</Button>
        </svelte:fragment>
    </ActionableCard>
</form>
