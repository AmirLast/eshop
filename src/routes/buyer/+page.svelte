<script lang="ts">
  import { goto } from '$app/navigation';
  import type { PageData } from './$types';
  import Header from './component/header.svelte';
  import { onDestroy } from 'svelte';

  export let data: PageData;
  let product = data.product;
  let { supabase, session } = data;

  let selectedSizes = {};

  $: ({ supabase, session } = data);

  onDestroy(() => {
    console.log('Component destroyed');
  });

  async function addToCart(productId: number, size: string) {
    try {
      const { error } = await supabase.from('cart').insert({
        profile_id: session.user.id,
        product_id: productId,
        size: size,
        quantity: 1, // Assuming default quantity to add is 1
      });

      if (error) {
        console.error('Error adding to cart:', error.message);
      } else {
        console.log('Product added to cart successfully');
        // Optionally, notify user or update UI to reflect addition to cart
        // Refresh data after adding to cart
        const { data: cart, error: cartError } = await supabase
          .from('cart')
          .select(`*, product:product_id(*)`)
          .eq('profile_id', session?.user.id);

        if (cartError) {
          console.error(cartError);
        } else {
          // Update cart data in the component state
          data.cart = cart;
        }
      }
    } catch (error) {
      console.error('Unexpected error adding to cart:', error.message);
    }
  }
</script>

<svelte:head>
  <title>Home – ESHOP</title>
</svelte:head>

<Header {data} />

<section class="text-center py-8">
  <h2 class="text-4xl font-bold mb-4">Get Shoes Limited!</h2>
  <p class="text-lg mb-6">Times are tough. 🥾👟👞🥿👠👡👢</p>

  <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
    {#each product as prod}
      <div class="bg-white shadow-md rounded-lg overflow-hidden" key={prod.id}>
        {#if prod.image}
          {#await supabase.storage.from('').getPublicUrl(prod.image).data.publicUrl then url}
            <img src={url} alt={prod.name} class="w-full h-56 object-cover" />
          {:catch error}
            <p class="text-red-500">Error loading image</p>
          {/await}
        {/if}
        <div class="p-4">
          <h3 class="text-2xl font-bold mb-2">Name Product: {prod.name}</h3>
          <p class="text-gray-700 mb-4">Description: {prod.description}</p>
          <p class="text-gray-700 mb-4">Quantity: {prod.quantity}</p>
          <div class="text-xl font-semibold mb-4">Price: RM {prod.price.toFixed(2)}</div>
          {#if prod.size && prod.size.length > 0}
            <div class="mb-4">
              <label for="size" class="block text-sm font-medium text-gray-700">Size:</label>
              <select id="size" bind:value={selectedSizes[prod.id]} class="mt-1 block px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm">
                {#each prod.size as size}
                  <option value={size}>{size}</option>
                {/each}
              </select>
            </div>
          {/if}
          <button class="bg-purple-600 text-white py-2 px-4 rounded" on:click={() => addToCart(prod.id, selectedSizes[prod.id] || '')}>Add to Cart</button>
        </div>
      </div>
    {/each}
  </div>
</section>

<style>
  section {
    max-width: 1200px;
    margin: auto;
  }

  select {
    width: 100%;
    padding: 0.5rem;
    border-radius: 0.25rem;
    border: 1px solid #ccc;
    margin-bottom: 1rem;
  }

  button {
    margin-top: 1rem;
  }
</style>
