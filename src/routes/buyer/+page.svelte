<script lang="ts">
  import { goto } from '$app/navigation';
  import type { PageData } from './$types';
  import Header from './component/header.svelte';
  import { onDestroy } from 'svelte';

  export let data: PageData;
  let product = data.product;
  let { supabase, session } = data;

  $: ({ supabase, session } = data);

  onDestroy(() => {
    console.log('Component destroyed');
  });

  async function addToCart(productId: number) {
    try {
      const { error } = await supabase.from('cart').insert({
        profile_id: session.user.id,
        product_id: productId,
        quantity: 1, // Assuming default quantity to add is 1
      });

      if (error) {
        console.error('Error adding to cart:', error.message);
        // Handle error if necessary
      } else {
        console.log('Product added to cart successfully');
        // Optionally, notify user or update UI to reflect addition to cart
      }
    } catch (error) {
      console.error('Unexpected error adding to cart:', error.message);
      // Handle unexpected errors
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
          <button class="bg-purple-600 text-white py-2 px-4 rounded" on:click={() => addToCart(prod.id)}>Cart</button>
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
</style>
