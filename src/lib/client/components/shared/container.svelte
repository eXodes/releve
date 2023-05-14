<script lang="ts">
    import { classNames } from "$client/utils/style";

    export { classes as class };

    let classes = "";
</script>

<div class={classNames("mx-auto my-6 max-w-7xl px-3 sm:px-6 lg:px-8", classes)}>
    <slot />
</div>
