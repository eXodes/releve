<script lang="ts">
    import { Popover, PopoverButton, PopoverPanel, Transition } from "@rgossiaux/svelte-headlessui";

    export let content: string;
</script>

<Popover class="relative">
    <PopoverButton class="flex items-center">
        <slot />
    </PopoverButton>

    <Transition
        class="absolute bottom-8 left-1/2 z-10 inline-table w-full max-w-7xl origin-bottom -translate-x-1/2 "
        enter="transition duration-100 ease-out"
        enterFrom="transform scale-95 opacity-0"
        enterTo="transform scale-100 opacity-100"
        leave="transition duration-75 ease-out"
        leaveFrom="transform scale-100 opacity-100"
        leaveTo="transform scale-95 opacity-0"
    >
        <PopoverPanel class="rounded bg-gray-100 px-2.5 py-1.5 shadow-md shadow-gray-500/20">
            <p class="min-w-[12rem] text-center text-xs text-gray-700">{content}</p>
        </PopoverPanel>

        <span
            class="absolute left-1/2 -bottom-2 z-10 -translate-x-1/2 border-x-8 border-t-8 border-x-transparent border-t-gray-100 drop-shadow-sm"
        />
    </Transition>
</Popover>
