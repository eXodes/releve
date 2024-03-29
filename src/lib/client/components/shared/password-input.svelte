<script lang="ts">
    import { validate } from "$client/actions/form";
    import { classNames } from "$client/utils/style";

    import Hint from "$client/components/shared/hint-text.svelte";
    import Tooltip from "$client/components/shared/tooltip.svelte";

    import { createEventDispatcher } from "svelte";
    import type { HTMLInputAttributes } from "svelte/elements";
    import { ExclamationCircle, Eye, EyeSlash, Icon } from "svelte-hero-icons";

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
    let showPassword = false;

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
<div class={classNames("relative mt-1", classes)}>
    {#if $$slots.prefix}
        <div class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
            <slot name="prefix" />
        </div>
    {/if}

    <input
        {...$$restProps}
        type={showPassword ? "text" : "password"}
        id={id}
        name={name}
        value={value}
        on:input={handleInput}
        class={classNames(
            "peer block w-full appearance-none rounded-md border px-3 py-2 placeholder-gray-400 shadow-sm focus:enabled:outline-none focus:enabled:ring-1 disabled:bg-gray-100 sm:text-sm",
            $$slots.prefix && "pl-10",
            $$slots.suffix && "pr-10",
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

    {#if $$slots.suffix}
        <div class="pointer-events-none absolute inset-y-0 left-0 flex items-center pr-3">
            <slot name="suffix" />
        </div>
    {/if}

    {#if !hideOptional}
        <span class="absolute -top-6 right-0 hidden text-sm text-gray-400 peer-optional:block">
            Optional
        </span>
    {/if}

    <span
        class={classNames(
            "absolute inset-y-0 z-10 mr-3 flex items-center transition-all duration-75 ease-in-out",
            errors?.length ? "right-8" : "right-0"
        )}
    >
        <button
            type="button"
            class={classNames("rounded-full focus:outline-none focus:ring-2 focus:ring-gray-600")}
            on:click={() => (showPassword = !showPassword)}
        >
            <Icon
                src={showPassword ? Eye : EyeSlash}
                solid
                class="h-5 w-5 text-gray-500 hover:text-gray-600"
            />
        </button>
    </span>

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
