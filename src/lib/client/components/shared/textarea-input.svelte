<script lang="ts">
    import { validate } from "$client/actions/form";
    import Tooltip from "$client/components/shared/tooltip.svelte";
    import { classNames } from "$client/utils/style";

    import Hint from "$client/components/shared/hint-text.svelte";

    import { createEventDispatcher } from "svelte";
    import type { HTMLTextareaAttributes } from "svelte/elements";
    import { ExclamationCircle, Icon } from "svelte-hero-icons";

    interface $$Props extends HTMLTextareaAttributes {
        id: string;
        label: string;
        name: string;
        value?: string;
        rows?: number;
        errors?: string[];
        hint?: string;
    }

    export let id: $$Props["id"];
    export let label: $$Props["label"];
    export let name: $$Props["name"];
    export let value: $$Props["value"] = "";
    export let rows: $$Props["rows"] = 3;
    export let errors: $$Props["errors"] = undefined;
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

<label for={id} class="block text-sm font-medium text-gray-700">
    {label}
</label>
<div class={classNames("relative mt-1", classes)}>
    <textarea
        {...$$restProps}
        id={id}
        name={name}
        value={value}
        rows={rows}
        on:input={handleInput}
        class={classNames(
            "peer block w-full resize-none appearance-none rounded-md border px-3 py-2 placeholder-gray-400 shadow-sm read-only:bg-gray-100 focus:enabled:outline-none focus:enabled:ring-1 disabled:bg-gray-100 sm:text-sm",
            errors?.length
                ? "border-red-300 pr-10 text-red-900 caret-red-500 focus:enabled:border-red-500 focus:enabled:ring-red-500"
                : "border-gray-300 caret-rose-500 focus:enabled:border-rose-500 focus:enabled:ring-rose-500"
        )}
        use:validate={{
            errors: errors,
            error: (values) => {
                if (values) errors = [...values, ...(errors ?? [])];
            },
        }}
    />

    <span class="absolute -top-6 right-0 hidden text-sm text-gray-400 peer-optional:block">
        Optional
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
