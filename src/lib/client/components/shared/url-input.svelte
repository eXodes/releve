<script lang="ts">
    import { validate } from "$client/actions/form";
    import { classNames } from "$client/utils/style";

    import Hint from "$client/components/shared/hint-text.svelte";
    import Tooltip from "$client/components/shared/tooltip.svelte";

    import { createEventDispatcher } from "svelte";
    import type { HTMLInputAttributes } from "svelte/elements";
    import { ExclamationCircle, Icon } from "svelte-hero-icons";

    interface $$Props extends HTMLInputAttributes {
        type?: string;
        id: string;
        label: string;
        name: string;
        value?: string;
        errors?: string[];
        hideLabel?: boolean;
        hideOptional?: boolean;
        hint?: string;
    }

    export let type: $$Props["type"] = "text";
    export let id: $$Props["id"];
    export let label: $$Props["label"];
    export let name: $$Props["name"];
    export let value: $$Props["value"] = "";
    export let errors: $$Props["errors"] = undefined;
    export let hideLabel: $$Props["hideLabel"] = false;
    export let hideOptional: $$Props["hideOptional"] = false;
    export let hint: $$Props["hint"] = undefined;
    export { classes as class };

    let classes = "";

    const dispatch = createEventDispatcher<{
        input: {
            name: string;
            value: string;
        };
    }>();

    const handleInput = (event: Event) => {
        const target = event.target as HTMLInputElement;
        value = target.value;

        dispatch("input", {
            name: target.name,
            value: target.value,
        });
    };
</script>

<label
    for={id}
    class={classNames("block text-sm font-medium text-gray-700", hideLabel && "sr-only")}
>
    {label}
</label>
<div class={classNames("relative mt-1 inline-flex w-full", classes)}>
    <span
        class="inline-flex items-center rounded-l-md border border-r-0 border-gray-300 bg-gray-50 px-3 text-gray-500 sm:text-sm"
    >
        https://
    </span>

    <input
        {...$$restProps}
        type={type}
        id={id}
        name={name}
        value={value}
        on:input={handleInput}
        inputmode="url"
        class={classNames(
            "peer block w-full appearance-none rounded-r-md border px-3 py-2 placeholder-gray-400 shadow-sm read-only:bg-gray-100 focus:enabled:outline-none focus:enabled:ring-1 disabled:bg-gray-100 sm:text-sm",
            errors?.length
                ? "border-red-300 pr-10 text-red-900 focus:enabled:border-red-500 focus:enabled:ring-red-500"
                : "border-gray-300 focus:enabled:border-rose-500 focus:enabled:ring-rose-500"
        )}
        use:validate={{
            errors: errors,
            error: (values) => {
                if (values) errors = [...values, ...(errors ?? [])];
            },
        }}
    />

    {#if !hideOptional}
        <span class="absolute -top-6 right-0 hidden text-sm text-gray-400 peer-optional:block">
            Optional
        </span>
    {/if}

    {#if errors?.length}
        <div class="absolute inset-y-0 right-0 z-[1] flex items-center pr-3">
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
