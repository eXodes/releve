<script lang="ts">
    import { classNames } from "$utils/style";
    import { Color, Size } from "$enums/theme";

    interface $$Props extends Partial<HTMLSpanElement> {
        size?: Size.SMALL | Size.MEDIUM | Size.LARGE;
        color?: Color.SUCCESS | Color.DANGER | Color.WARNING | Color.INFO;
    }

    export let size: $$Props["size"] = Size.MEDIUM;
    export let color: $$Props["color"] = Color.INFO;
    export { classes as class };

    let classes = "";

    const sizeClass = {
        [Size.SMALL]: "px-2.5 py-0.5",
        [Size.MEDIUM]: "px-3 py-0.5",
        [Size.LARGE]: "px-3.5 py-0.5",
    };

    const colorClass = {
        [Color.SUCCESS]: "bg-green-100 text-green-800",
        [Color.DANGER]: "bg-red-100 text-red-800",
        [Color.WARNING]: "bg-yellow-100 text-yellow-800",
        [Color.INFO]: "bg-gray-100 text-gray-800",
    };
</script>

<span
    class={classNames(
        "inline-flex items-center rounded-full text-sm font-medium",
        size && sizeClass[size],
        color && colorClass[color],
        classes
    )}
    {...$$restProps}
>
    <slot />
</span>
