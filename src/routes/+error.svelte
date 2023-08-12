<script lang="ts">
    import { dev } from "$app/environment";
    import { page } from "$app/stores";

    import BaseLayout from "$client/components/layouts/base-layout.svelte";
    import Container from "$client/components/shared/container.svelte";
</script>

<BaseLayout>
    <Container>
        <div class="my-auto flex-shrink-0 py-16 sm:py-32">
            <p class="text-sm font-semibold uppercase tracking-wide text-rose-600">
                {$page.status} error
            </p>
            <h1 class="mt-2 text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl">
                {$page.status === 404 ? "Page not found" : $page.error?.code}
            </h1>
            <p class="mt-2 text-base text-gray-500">
                {$page.status === 404
                    ? "Sorry, we couldn't find the page you’re looking for."
                    : $page.error?.message}
            </p>
            <div class="mt-6">
                <a href="/" class="text-base font-medium text-rose-600 hover:text-rose-500">
                    Go back home<span aria-hidden="true"> &rarr;</span>
                </a>
            </div>

            {#if dev && $page.error?.stack}
                <pre
                    class="mt-10 whitespace-pre-line rounded-md bg-gray-600 p-2 text-sm text-gray-100 text-gray-500">
			{$page.error.stack}
            </pre>
            {/if}
        </div>
    </Container>
</BaseLayout>
