<script lang="ts">
    import Tooltip from "$client/components/shared/tooltip.svelte";

    import Hint from "$client/components/shared/hint-text.svelte";

    import { createEventDispatcher } from "svelte";
    import { ExclamationCircle, Icon } from "svelte-hero-icons";

    interface $$Props extends Partial<HTMLInputElement> {
        id: string;
        label: string;
        name: string;
        value?: string;
        checked?: boolean;
        errors?: string[];
        hint?: string;
    }

    export let id: $$Props["id"];
    export let label: $$Props["label"];
    export let name: $$Props["name"];
    export let value: $$Props["value"] = undefined;
    export let checked: $$Props["checked"] = false;
    export let errors: $$Props["errors"] = undefined;
    export let hint: $$Props["hint"] = undefined;

    const dispatch = createEventDispatcher<{
        input: {
            name: string;
            value: string;
        };
    }>();

    const handleInput = (event: Event) => {
        const target = event.target as HTMLInputElement;

        dispatch("input", {
            name: target.name,
            value: target.checked ? target.value : "",
        });
    };
</script>

<div class="flex items-center">
    <input
        {...$$restProps}
        type="checkbox"
        id={id}
        name={name}
        value={value}
        class="h-4 w-4 rounded border-gray-300 text-rose-600 accent-rose-500 hover:bg-gray-50 focus:enabled:outline-none focus:enabled:ring-rose-500 disabled:bg-gray-100 disabled:checked:bg-gray-300"
        bind:checked={checked}
        on:input={handleInput}
    />
    <label for={id} class="ml-2 block text-sm text-gray-900">
        {label}
    </label>

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
