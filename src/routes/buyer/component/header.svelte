<script lang="ts">
    import { goto } from '$app/navigation';
    import type { PageData } from './$types';
    import { onMount, onDestroy } from 'svelte';

    export let data: PageData;

    let cart = data.cart || [];

    let { supabase, session } = data;
    $: ({ supabase, session } = data);

    let isDropdownOpen = false;

    const handleSignOut = async () => {
        await supabase.auth.signOut();
        goto('/', { replaceState: true });
    };

    const handleCart = async () => {
        goto('/buyer/cart');
    };

    const handlePurchases = async () => {
        goto('/buyer/purchases');
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
                <span class="hidden sm:block relative">
                    <button type="button" class="inline-flex items-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50" on:click={handlePurchases}>
                        <svg class="-ml-0.5 mr-1.5 h-5 w-5 text-gray-400" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                            <path d="M16.75 5h-2.125C14.584 3.72 13.39 3 12 3S9.416 3.72 9.375 5H7.25C6.007 5 5 6.007 5 7.25v11.5C5 19.993 6.007 21 7.25 21h9.5C17.993 21 19 19.993 19 18.75V7.25C19 6.007 17.993 5 16.75 5zM12 4.75c.585 0 1.167.353 1.375.812H10.625C10.833 4.603 11.415 4.75 12 4.75zM7.25 6.5h9.5c.414 0 .75.336.75.75v1h-11v-1c0-.414.336-.75.75-.75zm-1 3h11v9.25c0 .414-.336.75-.75.75h-9.5a.751.75 0 0 1-.75-.75V9.5z"/>
                        </svg>
                        Purchases
                    </button>
                    <button type="button" class="inline-flex items-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50" on:click={handleCart}>
                        <svg class="-ml-0.5 mr-1.5 h-5 w-5 text-gray-400" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                            <path d="M7 4h10l1.25 6H8.22l-1-4.8L6.3 5.7 4.23 6.6 4 6H2V4h3L6.28 3h12.44l.97 4.61-.91.91-1.97 1.97-1 1H8.55L7 12.7V4zm0 2v6.55l1.78-.89 2.95-1.48H18L16.8 6H7zm1.55 11a2 2 0 1 1 0 4 2 2 0 0 1 0-4zm9.9 0a2 2 0 1 1 0 4 2 2 0 0 1 0-4z"/>
                        </svg>
                        Cart
                        {#if data.cart?.length > 0}
                            <span class="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white bg-yellow-500 rounded-full">{data.cart?.length}</span>
                        {/if}
                    </button>
                </span>
        
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
                    <a href="/buyer/purhases" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" role="menuitem" tabindex="-1" id="mobile-menu-item-0">Purchases</a>
                    <a href="/buyer/cart" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" role="menuitem" tabindex="-1" id="mobile-menu-item-0">Cart</a>
                    <!-- svelte-ignore a11y-click-events-have-key-events -->
                    <a on:click={handleSignOut} class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" role="menuitem" tabindex="-1" id="mobile-menu-item-0">Logout</a>
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
