<script lang="ts">
    import { Color } from "$client/enums/theme";
    import { classNames } from "$client/utils/style";

    import transition from "svelte-transition-classes";
    import { CheckCircle, Icon, XCircle } from "svelte-hero-icons";

    export let show = false;
    export let color: Color.SUCCESS | Color.DANGER;

    const icon = {
        [Color.SUCCESS]: CheckCircle,
        [Color.DANGER]: XCircle,
    };

    const backgroundColor = {
        [Color.SUCCESS]: "bg-green-50",
        [Color.DANGER]: "bg-red-50",
    };

    const iconColor = {
        [Color.SUCCESS]: "text-green-400",
        [Color.DANGER]: "text-red-400",
    };

    const textColor = {
        [Color.SUCCESS]: "text-green-800",
        [Color.DANGER]: "text-red-800",
    };
</script>

{#if show}
    <div
        in:transition={{
            duration: 200,
            base: "transition ease-out duration-200",
            from: "transform opacity-0 scale-95",
            to: "transform opacity-100 scale-100",
        }}
        out:transition={{
            duration: 75,
            base: "transition ease-in duration-75",
            from: "transform opacity-100 scale-100",
            to: "transform opacity-0 scale-95",
        }}
    >
        <div class={classNames("rounded-md p-4", backgroundColor[color])}>
            <div class="flex">
                <div class="flex-shrink-0">
                    <Icon
                        src={icon[color]}
                        solid
                        class={classNames("h-5 w-5", iconColor[color])}
                        aria-hidden="true"
                    />
                </div>
                <div class="ml-3">
                    <p class={classNames("text-sm font-medium", textColor[color])}>
                        <slot />
                    </p>
                </div>
            </div>
        </div>
    </div>
{/if}
