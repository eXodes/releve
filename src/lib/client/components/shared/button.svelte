<script lang="ts">
    import { Color, Size } from "$client/enums/theme";
    import { classNames } from "$client/utils/style";

    interface $$Props extends Partial<HTMLButtonElement> {
        type?: "button" | "submit" | "reset";
        size?: Size;
        color?: Color.PRIMARY | Color.SECONDARY | Color.DANGER | "default";
        block?: boolean;
        disabled?: boolean;
        ref?: HTMLButtonElement;
    }

    const sizeClass = {
        [Size.SMALLER]: "py-1.5 px-2.5 text-xs",
        [Size.SMALL]: "py-2 px-3 text-sm leading-4",
        [Size.MEDIUM]: "py-2 px-4 text-sm",
        [Size.LARGE]: "px-4 py-2 text-base",
    };

    const colorClass = {
        [Color.PRIMARY]:
            "border-transparent bg-rose-600 text-white hover:enabled:bg-rose-700 disabled:bg-rose-300 disabled:text-rose-100",
        [Color.SECONDARY]:
            "border-transparent bg-rose-100 text-rose-700 hover:enabled:bg-rose-200 disabled:bg-rose-50 disabled:text-rose-200",
        [Color.DANGER]:
            "border-transparent bg-red-100 text-red-700 hover:enabled:bg-red-200 disabled:bg-red-50 disabled:text-red-200",
        ["default"]:
            "border-gray-300 bg-white text-gray-700 hover:enabled:bg-gray-50 disabled:border-gray-100 disabled:bg-gray-100 disabled:text-gray-400",
    };

    export let type: $$Props["type"] = "button";
    export let block: $$Props["block"] = false;
    export let disabled: $$Props["disabled"] = false;
    export let size: $$Props["size"] = Size.MEDIUM;
    export let color: $$Props["color"] = "default";
    export let ref: $$Props["ref"] = undefined;
    export { classes as class };

    let classes = "";
</script>

<button
    type={type}
    disabled={disabled}
    on:click
    class={classNames(
        "inline-flex items-center justify-center rounded-md border font-medium shadow-sm focus:enabled:outline-none focus:enabled:ring-2 focus:enabled:ring-rose-500 focus:enabled:ring-offset-2",
        size && sizeClass[size],
        color && colorClass[color],
        block && "w-full",
        classes
    )}
    bind:this={ref}
    {...$$restProps}
>
    <slot />
</button>
