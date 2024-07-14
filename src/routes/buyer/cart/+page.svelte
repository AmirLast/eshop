<script lang="ts">
  import { goto } from '$app/navigation';
  import type { PageData } from './$types';
  import Header from '../component/header.svelte';
  import { onDestroy } from 'svelte';

  export let data: PageData;
  let profiles = data.profiles;
  let product = data.product;
  let cart = data.cart;

  let { supabase, session } = data;

  $: ({ supabase, session } = data);

  onDestroy(() => {
    console.log('Component destroyed');
  });
</script>

<svelte:head>
  <title>Shopping Cart - ESHOP</title>
</svelte:head>

<Header {data} />

<section class="text-center py-8">
  <h2 class="text-4xl font-bold mb-4">Shopping Cart</h2>

  <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
    {#if cart && cart.length > 0}
      {#each cart as item}
        <div class="bg-white shadow-md rounded-lg overflow-hidden p-4">
          <h3 class="text-xl font-bold mb-2">{item.product.name}</h3>
          <p class="text-gray-700 mb-4">{item.product.description}</p>
          <p class="text-gray-700 mb-4">Price: RM {item.product.price.toFixed(2)}</p>
          <p class="text-gray-700 mb-4">Quantity: {item.quantity}</p>
          <button class="bg-purple-600 text-white py-2 px-4 rounded">Remove from Cart</button>
        </div>
      {/each}
    {:else}
      <p class="text-xl text-gray-600">Your cart is empty.</p>
    {/if}
  </div>
</section>

<style>
  section {
    max-width: 1200px;
    margin: auto;
  }
</style>
