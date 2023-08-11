<script lang="ts">
    import { Popover, PopoverButton, PopoverPanel, Transition } from "@rgossiaux/svelte-headlessui";
</script>

<Popover class="relative">
    <PopoverButton
        class="flex items-center rounded-full focus:outline-none focus:ring-2 focus:ring-gray-500"
    >
        <slot name="button" />
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
        <PopoverPanel class="rounded bg-stone-700 px-2.5 py-1.5 shadow-md shadow-gray-500/20">
            <p class="min-w-[12rem] text-center text-xs text-white">
                <slot name="content" />
            </p>
        </PopoverPanel>

        <span
            class="absolute -bottom-2 left-1/2 z-10 -translate-x-1/2 border-x-8 border-t-8 border-x-transparent border-t-stone-700 drop-shadow-sm"
        />
    </Transition>
</Popover>
