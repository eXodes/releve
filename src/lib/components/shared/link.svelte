<script lang="ts">
    import { ExternalLink, Icon } from "svelte-hero-icons";

    interface $$Props extends Partial<HTMLAnchorElement> {
        href: string;
        rel?: string;
        target?: string;
    }

    export let href: $$Props["href"];
    export let rel: $$Props["rel"] = undefined;
    export let target: $$Props["target"] = undefined;
</script>

<a
    href={href}
    rel={rel}
    target={rel === "external" ? "_blank" : target}
    class="inline-flex items-center gap-0.5 font-medium text-rose-600 hover:text-rose-500 hover:underline hover:decoration-rose-500 hover:decoration-2"
>
    <slot />

    {#if rel === "external"}
        <Icon src={ExternalLink} solid class="h-5 w-5 text-rose-500" aria-hidden="true" />
    {/if}
</a>
