<script lang="ts">
    import { goto } from '$app/navigation';
    import type { PageData } from './$types';
    import { onMount, onDestroy } from 'svelte';
    
    export let data: PageData;

    let { supabase, session } = data;
    $: ({ supabase, session } = data);

    let isDropdownOpen = false;

    const handleSignOut = async () => {
        await supabase.auth.signOut();
        goto('/', { replaceState: true });
    };
    // Function to toggle dropdown visibility
    const toggleDropdown = () => {
        isDropdownOpen = !isDropdownOpen;
    };

    // Close dropdown when clicking outside of it
    onMount(() => {
        const closeDropdownOnClickOutside = (event: MouseEvent) => {
            if (!document.getElementById('mobile-menu-button').contains(event.target as Node)) {
                isDropdownOpen = false;
            }
        };
        
        document.addEventListener('click', closeDropdownOnClickOutside);
        
        // Cleanup event listener on component destroy
        onDestroy(() => {
            document.removeEventListener('click', closeDropdownOnClickOutside);
        });
    });
</script>

<div class="flex flex-col relative z-20">
    <div class="max-w-[1400px] mx-auto w-full flex items-center justify-between p-4 py-6">
        <a href="/buyer">
            <h2 class="text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight">ESHOP</h2>
        </a>
        <nav class="hidden md:flex items-center gap-4 lg:gap-6">
            <div class="mt-5 flex lg:ml-4 lg:mt-0">
                <span class="sm:ml-3">
                    <button type="button" class="inline-flex items-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600" on:click={handleSignOut}>
                        Logout
                    </button>
                </span>
            </div>
        </nav>

        <!-- Dropdown -->
        <div class="relative ml-3 sm:hidden">
            <button type="button" class="inline-flex items-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:ring-gray-400" id="mobile-menu-button" aria-expanded="{isDropdownOpen}" aria-haspopup="true" on:click={toggleDropdown}>
                More
                <svg class="-mr-1 ml-1.5 h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                    <path fill-rule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z" clip-rule="evenodd" />
                </svg>
            </button>

            <!-- Dropdown menu -->
            {#if isDropdownOpen}
                <div class="absolute right-0 z-10 -mr-1 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none" role="menu" aria-orientation="vertical" aria-labelledby="mobile-menu-button" tabindex="-1">
                    <a on:click={handleSignOut} class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" role="menuitem" tabindex="-1" id="mobile-menu-item-1">Logout</a>
                </div>
            {/if}
        </div>
    </div>
</div>

<style>
    .relative {
        position: relative;
    }

    .absolute {
        position: absolute;
    }

    .bg-yellow-500 {
        background-color: #fbbf24;
    }
</style>
