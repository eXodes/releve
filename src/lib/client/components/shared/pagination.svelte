<script lang="ts">
    import { page } from "$app/stores";
    import type { PaginationMeta } from "$client/types/meta";
    import { classNames } from "$client/utils/style";

    import { stringify } from "qs";

    export let meta: PaginationMeta | undefined;

    $: generatePreviousUrl = () => {
        if (!meta?.previous) return undefined;

        const queries = stringify(meta.previous);

        return `${$page.url.pathname}?${queries}`;
    };

    $: generateNextUrl = () => {
        if (!meta?.next) return undefined;

        const queries = stringify(meta.next);

        return `${$page.url.pathname}?${queries}`;
    };
</script>

{#if meta}
    <nav
        class="mt-4 flex items-center justify-between px-4 py-3 sm:px-6 md:mt-2"
        aria-label="Pagination"
    >
        <div class="flex flex-1 justify-between gap-4">
            <a
                href={generatePreviousUrl()}
                class={classNames(
                    "inline-flex items-center justify-center rounded-md border px-4 py-2 text-sm font-medium shadow-sm",
                    meta.previous
                        ? "cursor-pointer border-gray-300 bg-white text-gray-700 hover:bg-gray-50"
                        : "cursor-not-allowed border-gray-100 bg-gray-100 text-gray-400"
                )}
            >
                Previous
            </a>
            <a
                href={generateNextUrl()}
                class={classNames(
                    "inline-flex items-center justify-center rounded-md border px-4 py-2 text-sm font-medium shadow-sm",
                    meta.next
                        ? "cursor-pointer border-gray-300 bg-white text-gray-700 hover:bg-gray-50"
                        : "cursor-not-allowed border-gray-100 bg-gray-100 text-gray-400"
                )}
            >
                Next
            </a>
        </div>
    </nav>
{/if}
