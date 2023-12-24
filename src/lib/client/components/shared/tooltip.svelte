<script lang="ts">
    import { classNames } from "$client/utils/style";

    import { createPopover } from "svelte-headlessui";
    import transition from "svelte-transition-classes";
    import { createPopperActions } from "svelte-popperjs";

    type Variant = "default" | "error";

    export let variant: Variant = "default";

    const popover = createPopover();

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

    const buttonClass = {
        default: "focus:ring-gray-500",
        error: "focus:ring-red-500",
    }[variant];

    const backgroundClass = {
        default: "bg-stone-700 shadow-gray-500/20",
        error: "bg-red-100 shadow-red-500/20",
    }[variant];

    const contentClass = {
        default: "text-white",
        error: "text-red-700",
    }[variant];

    const arrowClass = {
        default: "border-t-stone-700",
        error: "border-t-red-100",
    }[variant];
</script>

<div class="relative" use:popperRef>
    <button
        class={classNames(
            "flex items-center rounded-full focus:outline-none focus:ring-2",
            buttonClass
        )}
        use:popover.button
    >
        <slot name="button" />
    </button>

    {#if $popover.expanded}
        <div
            in:transition={{
                duration: 100,
                base: "transition duration-100 ease-out",
                from: "transform scale-95 opacity-0",
                to: "transform scale-100 opacity-100",
            }}
            out:transition={{
                duration: 75,
                base: "transition duration-75 ease-out",
                from: "transform scale-100 opacity-100",
                to: "transform scale-95 opacity-0",
            }}
        >
            <div
                class="absolute bottom-8 left-1/2 z-10 inline-table w-full max-w-7xl origin-bottom -translate-x-1/2"
                use:popperContent
            >
                <div
                    class={classNames("rounded px-2.5 py-1.5 shadow-md", backgroundClass)}
                    use:popover.panel
                >
                    <p class={classNames("min-w-[12rem] text-center text-xs", contentClass)}>
                        <slot name="content" />
                    </p>
                </div>

                <span
                    class={classNames(
                        "absolute -bottom-2 left-1/2 z-10 -translate-x-1/2 border-x-8 border-t-8 border-x-transparent drop-shadow-sm",
                        arrowClass
                    )}
                    data-popper-arrow
                />
            </div>
        </div>
    {/if}
</div>
