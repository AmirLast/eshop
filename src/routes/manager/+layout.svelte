<script lang="ts">
    import { page } from '$app/stores';
    import { get } from 'svelte/store';
    import type { LayoutData } from './$types';

    export let data: LayoutData;

    let ismanager = false;
    let isLoading = true;
    let pathStartsWithmanager = false;

    // Update the component state based on the data
    $: {
        if (data.profiles) {
            ismanager = data.profiles.role === 'manager';
            isLoading = false;
        }
    }

    // Check if the path starts with "/admin"
    $: pathStartsWithmanager = get(page).url.pathname.startsWith('/manager');
</script>

{#if isLoading}
    <p>Loading...</p>
{:else}
    {#if pathStartsWithmanager}
        {#if ismanager}
            <!--<p>Welcome, manager!</p>-->
            <slot />
        {:else}
            <p>You are not an manager.</p>
        {/if}
    {:else}
        <p>This path is not restricted to managers.</p>
    {/if}
{/if}
