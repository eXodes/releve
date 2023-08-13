<script lang="ts">
    import { classNames } from "$client/utils/style";

    import Hint from "$client/components/shared/hint-text.svelte";

    import { Popover, PopoverButton, PopoverPanel, Transition } from "@rgossiaux/svelte-headlessui";
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
            value: boolean;
        };
    }>();

    const handleInput = (event: Event) => {
        const target = event.target as HTMLInputElement;

        dispatch("input", {
            name: target.name,
            value: target.checked,
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
        <div
            class={classNames(
                "absolute inset-y-0 right-0 z-10 flex items-center pr-3",
                !errors?.length && "invisible"
            )}
        >
            <Popover class="relative">
                <PopoverButton class="flex items-center">
                    <Icon
                        src={ExclamationCircle}
                        solid
                        class="h-5 w-5 text-red-500 hover:text-red-600"
                    />
                    <span class="sr-only">Show validation error</span>
                </PopoverButton>

                <Transition
                    class="absolute bottom-8 left-1/2 z-10 inline-table w-full max-w-7xl origin-bottom -translate-x-1/2 "
                    enter="transition duration-100 ease-out"
                    enterFrom="transform scale-95 opacity-0"
                    enterTo="transform scale-100 opacity-100"
                    leave="transition duration-75 ease-out"
                    leaveFrom="transform scale-100 opacity-100"
                    leaveTo="transform scale-95 opacity-0"
                >
                    <PopoverPanel
                        class="rounded bg-red-100 px-2.5 py-1.5 shadow-md shadow-red-500/20"
                    >
                        <p class="min-w-[12rem] text-center text-xs text-red-700">{errors[0]}</p>
                    </PopoverPanel>

                    <span
                        class="absolute -bottom-2 left-1/2 z-10 -translate-x-1/2 border-x-8 border-t-8 border-x-transparent border-t-red-100 drop-shadow-sm"
                    />
                </Transition>
            </Popover>
        </div>
    {/if}
</div>
{#if hint}
    <Hint>{hint}</Hint>
{/if}
