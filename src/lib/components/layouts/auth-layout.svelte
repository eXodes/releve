<script lang="ts">
    export let showLogo = true;
</script>

<div class="flex min-h-screen">
    <div class="relative hidden w-0 flex-1 lg:block">
        <img
            class="absolute inset-0 h-full w-full object-cover"
            src="https://images.unsplash.com/photo-1502741509793-1bf00d85aeff?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1908&q=80"
            alt=""
        />
    </div>
    <div
        class="flex flex-1 flex-col justify-center py-12 px-4 sm:px-6 lg:flex-none lg:px-20 xl:px-40"
    >
        <div class="mx-auto w-full max-w-sm lg:w-96">
            {#if showLogo}
                <img class="h-12 w-auto" src="/workflow-mark.svg" alt="Workflow" />
            {/if}
            <h2 class="mt-6 text-3xl font-extrabold text-gray-900">
                <slot name="title" />
            </h2>
            <p class="mt-2 text-sm text-gray-600">
                <slot name="subtext" />
            </p>

            <div class="mt-8">
                <div class="mt-6">
                    <slot />
                </div>
            </div>
        </div>
    </div>
</div>
