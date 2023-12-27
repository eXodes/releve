<script lang="ts">
    import Tooltip from "$client/components/shared/tooltip.svelte";
    import { classNames } from "$client/utils/style";

    import Hint from "$client/components/shared/hint-text.svelte";
    import { createEventDispatcher } from "svelte";

    import { createListbox } from "svelte-headlessui";
    import transition from "svelte-transition-classes";
    import { Check, ChevronUpDown, ExclamationCircle, Icon } from "svelte-hero-icons";

    interface ListboxOption<T = string> {
        label: string;
        value: T;
    }

    interface $$Props {
        id: string;
        label: string;
        name: string;
        options?: ListboxOption[];
        value?: string;
        errors?: string[];
        hint?: string;
        multiple?: boolean;
        required?: boolean;
        disabled?: boolean;
        debug?: boolean;
    }

    export let id: $$Props["id"];
    export let label: $$Props["label"];
    export let name: $$Props["name"];
    export let options: ListboxOption[] = [];
    export let value: $$Props["value"] = undefined;
    export let errors: $$Props["errors"] = undefined;
    export let hint: $$Props["hint"] = undefined;
    export let multiple: boolean = false;
    export let required: boolean = false;
    export let disabled: boolean = false;
    export { classes as class };

    let classes = "";
    const defaultValue = multiple ? value?.split(",") ?? [] : value;

    const dispatch = createEventDispatcher<{
        input: {
            name: string;
            value: string | string[];
        };
    }>();

    const listbox = createListbox({
        label,
        selected: multiple
            ? options.filter((option) => defaultValue?.includes(option.value))
            : options.find((option) => {
                  return option.value === defaultValue;
              }),
    });

    const handleInput = (event: Event) => {
        const { selected } = (event as CustomEvent).detail satisfies { selected: ListboxOption };

        const value = multiple
            ? selected?.map((option: ListboxOption) => option.value)
            : selected?.value;

        dispatch("input", {
            name,
            value,
        });
    };

    const isSelected = (value: ListboxOption["value"]) => {
        return multiple
            ? !!$listbox.selected?.find((option: ListboxOption) => option.value === value)
            : $listbox.selected?.value === value;
    };

    $: selectedSingle = options.find((option) => {
        return option.value === defaultValue;
    });

    $: selectedMultiple = options.filter((option) => defaultValue?.includes(option.value));

    $: listbox.set({
        selected: multiple ? selectedMultiple : selectedSingle,
    });

    $: selectedLabel = multiple
        ? $listbox.selected?.map((option: ListboxOption) => option.label)?.join(", ")
        : $listbox.selected?.label;
</script>

<label for={id} class="flex gap-2 text-sm font-medium text-gray-700">
    {label}
</label>

<div class={classNames("relative mt-1", classes)}>
    <button
        id={id}
        class={classNames(
            "peer block min-h-[2.375rem] w-full appearance-none rounded-md border px-3 py-2 text-left placeholder-gray-400 shadow-sm focus:enabled:outline-none focus:enabled:ring-1 disabled:bg-gray-100 sm:text-sm",
            errors?.length
                ? "border-red-300 pr-16 text-red-900 focus:enabled:border-red-500 focus:enabled:ring-red-500"
                : "border-gray-300 pr-8 focus:enabled:border-rose-500 focus:enabled:ring-rose-500"
        )}
        disabled={disabled}
        use:listbox.button
        on:select={handleInput}
    >
        {selectedLabel ?? ""}
        <span
            class={classNames(
                "pointer-events-none absolute inset-y-0 right-0 flex items-center",
                errors?.length ? "pr-9" : "pr-2"
            )}
        >
            <Icon src={ChevronUpDown} class="h-5 w-5 text-gray-400" aria-hidden="true" />
        </span>

        {#if multiple}
            {#each $listbox.selected as selected}
                <input type="hidden" name={name} value={selected.value} hidden />
            {/each}
        {:else}
            <input type="hidden" name={name} value={$listbox.selected?.value} hidden />
        {/if}
    </button>

    {#if !required}
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

    {#if $listbox.expanded}
        <ul
            class="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-sm shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none"
            use:listbox.items
            in:transition={{
                duration: 100,
                base: "transition ease-out duration-100",
                from: "opacity-0",
                to: "opacity-100",
            }}
            out:transition={{
                duration: 100,
                base: "transition ease-in duration-100",
                from: "opacity-100",
                to: "opacity-0",
            }}
        >
            {#each options as option (option.value)}
                {@const active = $listbox.active?.value === option.value}
                {@const selected = isSelected(option.value)}
                <li
                    class={classNames(
                        "relative cursor-default select-none py-2 pl-10 pr-4",
                        active ? "bg-gray-100 text-gray-900" : "text-gray-700"
                    )}
                    use:listbox.item={{ value: option }}
                >
                    <span
                        class={classNames(
                            "block truncate",
                            selected ? "font-medium" : "font-normal"
                        )}
                    >
                        {option.label}
                    </span>

                    {#if selected}
                        <span
                            class="absolute inset-y-0 left-0 flex items-center pl-3 text-rose-600"
                            aria-hidden="true"
                        >
                            <Icon src={Check} class="h-5 w-5" />
                        </span>
                    {/if}
                </li>
            {/each}
        </ul>
    {/if}
</div>

{#if hint}
    <Hint>{hint}</Hint>
{/if}
