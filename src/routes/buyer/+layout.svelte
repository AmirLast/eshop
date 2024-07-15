<script lang="ts">
    import { page } from '$app/stores';
    import { get } from 'svelte/store';
    import type { LayoutData } from './$types';

    export let data: LayoutData;

    let isbuyer = false;
    let isLoading = true;
    let pathStartsWithStudent = false;

    // Update the component state based on the data
    $: {
        if (data.profiles) {
            isbuyer = data.profiles.role === 'buyer';
            isLoading = false;
        }
    }

    // Check if the path starts with "/buyer"
    $: pathStartsWithStudent = get(page).url.pathname.startsWith('/buyer');
</script>

{#if isLoading}
    <p>Loading...</p>
{:else}
    {#if pathStartsWithStudent}
        {#if isbuyer}
            <!--<p>Welcome, student!</p>-->
            <slot />
        {:else}
            <p>You are not an buyer.</p>
        {/if}
    {:else}
        <p>This path is not restricted to buyer.</p>
    {/if}
{/if}
