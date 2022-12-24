<script lang="ts">
    import { createEventDispatcher } from "svelte";
    import { Icon, Search, XCircle } from "svelte-hero-icons";

    import TextInput from "$components/shared/text-input.svelte";

    export let label = "Search";
    export let name = "search";
    export let value: string | undefined = undefined;
    export let placeholder = "Search";

    const dispatch = createEventDispatcher<{
        input: {
            name: string;
            value: string;
        };
    }>();

    const handleClear = () => {
        value = "";

        dispatch("input", {
            name,
            value,
        });
    };
</script>

<div class="relative">
    <TextInput
        type="search"
        id="display-name"
        label={label}
        name={name}
        bind:value
        placeholder={placeholder}
        hideLabel={true}
        hideOptional={true}
        on:input
        class="ml-auto font-normal sm:w-48"
    >
        <svelte:fragment slot="prefix">
            <Icon src={Search} class="h-5 w-5 text-gray-400" aria-hidden="true" />
        </svelte:fragment>
    </TextInput>

    {#if value}
        <button class="absolute inset-y-0 right-2 flex items-center" on:click={handleClear}>
            <Icon
                src={XCircle}
                class="h-5 w-5 cursor-pointer text-gray-600 hover:text-gray-500"
                solid
            />
        </button>
    {/if}
</div>
