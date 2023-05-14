<script lang="ts">
    import { classNames } from "$client/utils/style";

    export let src: string | null | undefined;
    export let alt: string;
    export let fallback: string | undefined = "/images/no-image.png";

    export let ratioClass = "aspect-w-1 aspect-h-1";
    export let objectClass = "object-center object-cover";

    const handleImageError = () => {
        src = fallback;
    };
</script>

<div class={ratioClass}>
    <img
        src={src ?? fallback}
        alt={alt}
        class={classNames("h-full w-full break-words text-xs", objectClass)}
        on:error={handleImageError}
    />
</div>
