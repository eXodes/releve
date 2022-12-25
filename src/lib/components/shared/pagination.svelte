<script lang="ts">
    import type { PaginationMeta } from "$types/meta";

    import { classNames } from "$utils/style";

    export let meta: PaginationMeta;
</script>

{#if meta.total}
    <nav
        class="mt-4 flex items-center justify-between px-4 py-3 sm:px-6 md:mt-2"
        aria-label="Pagination"
    >
        <div class="flex flex-1 justify-between gap-4">
            <a
                href={meta.previous}
                class={classNames(
                    "inline-flex items-center justify-center rounded-md border py-2 px-4 text-sm font-medium shadow-sm",
                    meta.previous
                        ? "border-gray-300 text-gray-700 bg-white hover:bg-gray-50 cursor-pointer"
                        : "border-gray-100 bg-gray-100 text-gray-400 cursor-not-allowed"
                )}
            >
                Previous
            </a>
            <a
                href={meta.next}
                class={classNames(
                    "inline-flex items-center justify-center rounded-md border py-2 px-4 text-sm font-medium shadow-sm",
                    meta.next
                        ? "border-gray-300 text-gray-700 bg-white hover:bg-gray-50 cursor-pointer"
                        : "border-gray-100 bg-gray-100 text-gray-400 cursor-not-allowed"
                )}
            >
                Next
            </a>
        </div>
    </nav>
{/if}
