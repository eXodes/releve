<script lang="ts">
    import { Color } from "$client/enums/theme";
    import { classNames } from "$client/utils/style";

    import { Transition } from "@rgossiaux/svelte-headlessui";
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

<Transition
    show={show}
    enter="transition ease-out duration-200"
    enterFrom="transform opacity-0 scale-95"
    enterTo="transform opacity-100 scale-100"
    leave="transition ease-in duration-75"
    leaveFrom="transform opacity-100 scale-100"
    leaveTo="transform opacity-0 scale-95"
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
</Transition>
