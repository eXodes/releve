<script lang="ts">
    import { enhance } from "$app/forms";
    import { invalidate } from "$app/navigation";
    import { page } from "$app/stores";
    import { createForm, type EnhanceHandlerOptions } from "$client/stores/form";

    import { ShopStatus } from "$features/shops/enum";
    import type { ShopData } from "$features/shops/types";
    import shopSuite, { type ShopPayload } from "$features/shops/validations/shop";
    import { categories } from "$features/categories/store";
    import { Role } from "$features/users/enum";
    import { countries, states } from "$features/countries/store";
    import { deliveryServices } from "$features/delivery-providers/store";
    import { Color } from "$client/enums/theme";
    import { notification } from "$client/stores/notification";

    import ActionableCard from "$client/components/shared/actionable-card.svelte";
    import Button from "$client/components/shared/button.svelte";
    import CheckboxInput from "$client/components/shared/checkbox-input.svelte";
    import SelectInput from "$client/components/shared/select-input.svelte";
    import TextInput from "$client/components/shared/text-input.svelte";
    import UrlInput from "$client/components/shared/url-input.svelte";
    import Tooltip from "$client/components/shared/tooltip.svelte";

    import { createEventDispatcher, onMount } from "svelte";
    import { startCase } from "lodash-es";
    import { Icon, QuestionMarkCircle } from "svelte-hero-icons";

    const ActionType = {
        CREATE: "create",
        UPDATE_PUBLIC: "update-public",
        UPDATE_PRIVATE: "update-private",
    } as const;

    export let shopData: ShopData | undefined = undefined;
    export let actionType: (typeof ActionType)[keyof typeof ActionType];
    export let isPrivate: ShopPayload["private"] =
        actionType === "update-private" ? "true" : "false";

    let actionUrl = {
        [ActionType.CREATE]: "/shops?/create",
        [ActionType.UPDATE_PUBLIC]: `/shops/${shopData?.uid}?/update`,
        [ActionType.UPDATE_PRIVATE]: `/my/shops/${shopData?.uid}?/update`,
    };

    const { form, change, errors, setValue, reset, enhanceHandler } = createForm<ShopPayload>({
        initialValues: {
            name: shopData?.name ?? "",
            link: shopData?.link ?? "",
            categories: shopData?.categories ?? [],
            deliveryProviders: shopData?.deliveryProviders ?? [],
            streetAddress: shopData?.address.street ?? "",
            city: shopData?.address.city ?? "",
            state: shopData?.address.state ?? "",
            postalCode: shopData?.address.postalCode ?? "",
            country: shopData?.address.country ?? "Malaysia",
            status: shopData?.status,
            private: isPrivate ?? "false",
            role: $page.data.session.user?.customClaims.isAdmin ? Role.ADMIN : Role.USER,
        },
        validationSuite: shopSuite,
    });

    const dispatch = createEventDispatcher<{
        success: void;
        cancel: void;
    }>();

    const handleChangeCountry = async (
        event: CustomEvent<{ name: string; value: string | string[] | boolean }>
    ) => {
        setValue("state", "");

        await states.loadStates(event.detail.value as string);

        change(event);
    };

    const handlerOptions: EnhanceHandlerOptions = {
        onError: ({ message }) => {
            notification.send({
                type: "error",
                message: message,
            });
        },
        onSuccess: async ({ message }) => {
            if (message)
                notification.send({
                    type: "success",
                    message: message,
                });

            await invalidate("shops");

            if (isPrivate) {
                await invalidate("shops:my");
            }

            if ($form.data.status === ShopStatus.APPROVED) {
                await invalidate("shops:approved");
            }

            dispatch("success");
        },
    };

    $: showStatusInput =
        $page.data?.session.user?.customClaims.isAdmin && $form.data.private !== "true";

    $: disabled = !$form.isValid || $form.isSuccess;

    onMount(() => {
        reset();

        states.loadStates($form.data.country);
    });
</script>

<form
    action={actionUrl[actionType]}
    method="POST"
    use:enhance={enhanceHandler(handlerOptions)}
    on:submit
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
                    value={$form.data.name}
                    autocomplete="shop-name"
                    required
                    errors={$errors["name"]}
                    on:input={change}
                />
            </div>

            <div class="col-span-6 sm:col-span-3">
                {#if showStatusInput}
                    <SelectInput
                        id="status"
                        label="Status"
                        name="status"
                        value={$form.data.status}
                        autocomplete="status"
                        required
                        errors={$errors["status"]}
                        on:input={change}
                    >
                        {#each Object.values(ShopStatus) as status}
                            <option value={status}>{startCase(status)}</option>
                        {/each}
                    </SelectInput>
                {/if}
            </div>

            <div class="col-span-6 sm:col-span-4">
                <UrlInput
                    id="shop-link"
                    label="Link"
                    name="link"
                    value={$form.data.link}
                    autocomplete="shop-link"
                    required
                    errors={$errors["link"]}
                    hint="URL doesn't require a protocol https:// or http://"
                    on:input={change}
                />
            </div>

            <div class="col-span-6 sm:col-span-3">
                <SelectInput
                    id="categories"
                    label="Categories"
                    name="categories[]"
                    values={$form.data.categories}
                    autocomplete="categories"
                    required
                    multiple
                    errors={$errors["categories"]}
                    on:input={change}
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
                    values={$form.data.deliveryProviders}
                    autocomplete="delivery-providers"
                    required
                    multiple
                    errors={$errors["delivery-providers"]}
                    on:input={change}
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
                    value={$form.data.country}
                    autocomplete="country-name"
                    required
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
                    required
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
                    required
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
                    required
                    errors={$errors["state"]}
                    on:input={change}
                    disabled={$states.length === 0}
                >
                    {#if $states}
                        {#each $states as state}
                            <option value={state.name} selected={$form.data.state === state.name}>
                                {state.name}
                            </option>
                        {/each}
                    {/if}
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
                    required
                    errors={$errors["postal-code"]}
                    on:input={change}
                />
            </div>

            {#if actionType === "create"}
                <div class="col-span-6 flex gap-2">
                    <CheckboxInput
                        label="Make it private"
                        id="private"
                        name="private"
                        value="true"
                        checked={$form.data.private === "true"}
                        on:input={change}
                    />

                    <Tooltip>
                        <svelte:fragment slot="button">
                            <Icon
                                src={QuestionMarkCircle}
                                solid
                                class="h-5 w-5 text-gray-500 hover:text-gray-600"
                            />

                            <span class="sr-only">Private shop information tooltip</span>
                        </svelte:fragment>

                        <svelte:fragment slot="content">
                            If checked, this shop will be saved as your private collection that can
                            only be viewed in
                            <span class="font-semibold">My Shops</span>.
                        </svelte:fragment>
                    </Tooltip>
                </div>
            {/if}
        </div>

        <svelte:fragment slot="action">
            <div class="flex gap-4">
                {#if actionType !== "create"}
                    <Button on:click={() => dispatch("cancel")}>Cancel</Button>
                {/if}

                <Button
                    type="submit"
                    color={Color.PRIMARY}
                    disabled={disabled}
                    isLoading={$form.isLoading}
                >
                    Save
                </Button>
            </div>
        </svelte:fragment>
    </ActionableCard>
</form>
