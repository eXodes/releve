<script context="module" lang="ts">
    import type { Load } from "@sveltejs/kit";

    export const load: Load = ({ error, status }) => {
        return {
            props: {
                status,
                stack: error?.stack,
            },
        };
    };
</script>

<script lang="ts">
    import Container from "$components/shared/container.svelte";

    export let status: string;
    export let stack: string;
</script>

<Container>
    <div class="my-auto flex-shrink-0 py-16 sm:py-32">
        <p class="text-sm font-semibold uppercase tracking-wide text-rose-600">{status} error</p>
        <h1 class="mt-2 text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl">
            Page not found
        </h1>
        <p class="mt-2 text-base text-gray-500">
            Sorry, we couldn’t find the page you’re looking for.
        </p>
        <div class="mt-6">
            <a href="/" class="text-base font-medium text-rose-600 hover:text-rose-500">
                Go back home<span aria-hidden="true"> &rarr;</span>
            </a>
        </div>

        {#if stack}
            <pre
                class="mt-10 whitespace-pre-line rounded-md bg-gray-600 p-2 text-sm text-gray-100 text-gray-500">
			{stack}
            </pre>
        {/if}
    </div>
</Container>
