<script lang="ts">
    import { validate } from "$client/actions/form";
    import { classNames } from "$client/utils/style";

    import Hint from "$client/components/shared/hint-text.svelte";

    import { Popover, PopoverButton, PopoverPanel, Transition } from "@rgossiaux/svelte-headlessui";
    import { createEventDispatcher } from "svelte";
    import type { HTMLInputAttributes } from "svelte/elements";
    import { ExclamationCircle, Icon } from "svelte-hero-icons";
    import { createPopperActions } from "svelte-popperjs";

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

    const [popperRef, popperContent] = createPopperActions({
        placement: "top",
        modifiers: [
            {
                name: "offset",
                options: {
                    offset: [0, 12],
                },
            },
            {
                name: "preventOverflow",
                options: {
                    padding: 8,
                },
            },
        ],
    });

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
        type={type}
        id={id}
        name={name}
        value={value}
        on:input={handleInput}
        class={classNames(
            "peer block w-full appearance-none rounded-md border px-3 py-2 placeholder-gray-400 shadow-sm read-only:bg-gray-100 focus:enabled:outline-none focus:enabled:ring-1 disabled:bg-gray-100 sm:text-sm",
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

    {#if errors?.length}
        <div
            class={classNames(
                "absolute inset-y-0 right-0 z-10 flex items-center pr-3",
                !errors?.length && "invisible"
            )}
        >
            <Popover class="relative">
                <PopoverButton
                    class="flex items-center rounded-full focus:outline-none focus:ring-2 focus:ring-rose-500"
                    use={[popperRef]}
                >
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
                        use={[popperContent]}
                    >
                        <p class="min-w-[12rem] text-center text-xs text-red-700">{errors[0]}</p>
                    </PopoverPanel>

                    <span
                        class="absolute left-1/2 z-10 -translate-x-1/2 border-x-8 border-t-8 border-x-transparent border-t-red-100 drop-shadow-sm"
                        data-popper-arrow
                    />
                </Transition>
            </Popover>
        </div>
    {/if}
</div>
{#if hint}
    <Hint>{hint}</Hint>
{/if}
