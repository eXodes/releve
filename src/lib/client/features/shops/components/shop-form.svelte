<script lang="ts">
    import { enhance } from "$app/forms";
    import { invalidate } from "$app/navigation";
    import { page } from "$app/stores";
    import { createForm, type EnhanceHandlerOptions } from "$client/stores/form";

    import { ShopStatus } from "$features/shops/enum";
    import type { ShopData } from "$features/shops/types";
    import { shopSuite, type ShopPayload } from "$features/shops/validations/shop";
    import { categories } from "$features/categories/store";
    import { Role } from "$features/users/enum";
    import { countries, states } from "$features/countries/store";
    import { deliveryServices } from "$features/delivery-providers/store";
    import { Color } from "$client/enums/theme";
    import { notification } from "$client/stores/notification";

    import ActionableCard from "$client/components/shared/actionable-card.svelte";
    import Button from "$client/components/shared/button.svelte";
    import CheckboxInput from "$client/components/shared/checkbox-input.svelte";
    import TextInput from "$client/components/shared/text-input.svelte";
    import ListboxInput from "$client/components/shared/listbox-input.svelte";
    import UrlInput from "$client/components/shared/url-input.svelte";
    import Tooltip from "$client/components/shared/tooltip.svelte";

    import { createEventDispatcher, onDestroy, onMount } from "svelte";
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

    const { form, change, errors, setValue, validate, reset, enhanceHandler } =
        createForm<ShopPayload>({
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

            if ($form.data.status === ShopStatus.PENDING) {
                await invalidate("shops:pending");
            }

            dispatch("success");
        },
    };

    onMount(() => {
        reset();

        if (shopData) {
            const formData = {
                name: shopData?.name,
                link: shopData?.link,
                categories: shopData?.categories,
                deliveryProviders: shopData?.deliveryProviders,
                streetAddress: shopData?.address.street,
                city: shopData?.address.city,
                state: shopData?.address.state,
                postalCode: shopData?.address.postalCode,
                country: shopData?.address.country,
                status: shopData?.status,
                private: isPrivate,
                role: $page.data.session.user?.customClaims.isAdmin ? Role.ADMIN : Role.USER,
            };

            validate({
                formData,
            });
        }

        states.loadStates($form.data.country);
    });

    onDestroy(() => {
        states.clearStates();
    });

    $: showStatusInput =
        $page.data?.session.user?.customClaims.isAdmin && $form.data.private !== "true";

    $: disabled = !$form.isValid || $form.isSuccess;
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
                    <ListboxInput
                        id="status"
                        label="Status"
                        name="status"
                        options={Object.values(ShopStatus).map((status) => ({
                            label: startCase(status),
                            value: status,
                        }))}
                        value={$form.data.status}
                        required
                        errors={$errors["status"]}
                        on:input={change}
                    />
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
                <ListboxInput
                    id="categories"
                    label="Categories"
                    name="categories[]"
                    options={$categories.map((category) => ({
                        label: category.name,
                        value: category.name,
                    }))}
                    value={$form.data.categories?.join(",")}
                    required
                    multiple
                    errors={$errors["categories"]}
                    on:input={change}
                />
            </div>

            <div class="col-span-6 sm:col-span-3">
                <ListboxInput
                    id="delivery-providers"
                    label="Delivery services"
                    name="delivery-providers[]"
                    options={$deliveryServices.map((deliveryService) => ({
                        label: deliveryService.name,
                        value: deliveryService.name,
                    }))}
                    value={$form.data.deliveryProviders?.join(",")}
                    required
                    multiple
                    errors={$errors["delivery-providers"]}
                    on:input={change}
                />
            </div>

            <div class="col-span-6 sm:col-span-3">
                <ListboxInput
                    id="country"
                    label="Country"
                    name="country"
                    options={$countries.map((country) => ({
                        label: country.name,
                        value: country.name,
                    }))}
                    value={$form.data.country}
                    required
                    errors={$errors["country"]}
                    on:input={handleChangeCountry}
                />
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
                <ListboxInput
                    id="state"
                    label="State / Province"
                    name="state"
                    options={$states.map((state) => ({
                        label: state.name,
                        value: state.name,
                    }))}
                    value={$form.data.state}
                    required
                    errors={$errors["state"]}
                    on:input={change}
                    disabled={$states.length === 0}
                />
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
