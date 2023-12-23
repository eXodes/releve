<script lang="ts">
    import { classNames } from "$client/utils/style";

    import Hint from "$client/components/shared/hint-text.svelte";
    import Tooltip from "$client/components/shared/tooltip.svelte";

    import { createEventDispatcher } from "svelte";
    import type { HTMLSelectAttributes } from "svelte/elements";
    import { ExclamationCircle, Icon, QuestionMarkCircle } from "svelte-hero-icons";
    import { lowerCase } from "lodash-es";

    interface $$Props extends HTMLSelectAttributes {
        id: string;
        label: string;
        name: string;
        values?: string[];
        errors?: string[];
        hint?: string;
    }

    export let id: $$Props["id"];
    export let label: $$Props["label"];
    export let name: $$Props["name"];
    export let value: $$Props["value"] = "";
    export let values: $$Props["values"] = [];
    export let errors: $$Props["errors"] = undefined;
    export let hint: $$Props["hint"] = undefined;
    export { classes as class };

    let classes = "";
    let multiple = $$props["multiple"] ?? false;

    const dispatch = createEventDispatcher<{
        input: {
            name: string;
            value: string | string[];
        };
    }>();

    const handleInput = (event: Event) => {
        const target = event.target as HTMLSelectElement;
        values = target.value.split(",");

        dispatch("input", {
            name: target.name,
            value: multiple ? values : target.value,
        });
    };

    $: value = multiple ? values?.join(",") : value;
    $: inputName = lowerCase(name.slice(0, name.length - 2).toLowerCase());
</script>

<label for={id} class="flex gap-2 text-sm font-medium text-gray-700">
    {label}

    {#if multiple}
        <Tooltip>
            <svelte:fragment slot="button">
                <Icon
                    src={QuestionMarkCircle}
                    solid
                    class="hidden h-5 w-5 text-gray-500 hover:text-gray-600 md:block"
                />

                <span class="sr-only">Select {name} tooltip</span>
            </svelte:fragment>

            <svelte:fragment slot="content">
                Press <kbd>CTRL</kbd> / <kbd>CMD</kbd> to select multiple {inputName}.
            </svelte:fragment>
        </Tooltip>
    {/if}
</label>
<div class={classNames("relative mt-1", classes)}>
    <select
        {...$$restProps}
        id={id}
        name={name}
        value={value}
        on:input={handleInput}
        class={classNames(
            "peer block w-full appearance-none rounded-md border px-3 py-2 placeholder-gray-400 shadow-sm focus:enabled:outline-none focus:enabled:ring-1 disabled:bg-gray-100 sm:text-sm",
            errors?.length
                ? "border-red-300 pr-10 text-red-900 focus:enabled:border-red-500 focus:enabled:ring-red-500"
                : "border-gray-300 focus:enabled:border-rose-500 focus:enabled:ring-rose-500"
        )}
    >
        <slot />
    </select>

    <span class="absolute -top-6 right-0 hidden text-sm text-gray-400 peer-optional:block">
        Optional
    </span>

    {#if errors?.length}
        <div class="absolute inset-y-0 right-0 z-10 flex items-center pr-3">
            <Tooltip variant="error">
                <svelte:fragment slot="button">
                    <span class="sr-only">Show validation error</span>
                    <Icon
                        src={ExclamationCircle}
                        solid
                        class="h-5 w-5 text-red-500 hover:text-red-600"
                    />
                </svelte:fragment>

                <svelte:fragment slot="content">
                    {errors[0]}
                </svelte:fragment>
            </Tooltip>
        </div>
    {/if}
</div>
{#if hint}
    <Hint>{hint}</Hint>
{/if}
