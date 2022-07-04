<script lang="ts">
    import { classNames } from "$utils/style";

    export let src: string | null | undefined;
    export let alt: string | undefined;

    export let ratioClass = "aspect-w-1 aspect-h-1";
    export let objectClass = "object-center object-cover";
</script>

<div class={ratioClass}>
    <img
        src={src ?? "/no-image.jpg"}
        alt={alt ?? "No image"}
        class={classNames("w-full h-full break-words text-xs", objectClass)}
        on:error={() => (src = "/no-image.jpg")}
    />
</div>
