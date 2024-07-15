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

  async function removeFromCart(productId) {
    try {
      const { error } = await supabase
        .from('cart')
        .delete()
        .eq('profile_id', session.user.id)
        .eq('product_id', productId);

      if (error) {
        console.error('Error removing from cart:', error.message);
      } else {
        console.log('Product removed from cart successfully');
        // Update cart data after removal
        cart = cart.filter(item => item.product_id !== productId);
      }
    } catch (error) {
      console.error('Unexpected error removing from cart:', error.message);
    }
  }

  function calculateSubtotal() {
    return cart.reduce((total, item) => total + (item.product.price * item.quantity), 0).toFixed(2);
  }
</script>

<svelte:head>
  <title>Shopping Cart - ESHOP</title>
</svelte:head>

<Header {data} />

<section class="text-center py-8">
  <h2 class="text-4xl font-bold mb-4">Your Cart</h2>

  {#if cart && cart.length > 0}
    <table class="w-full text-left mb-6">
      <thead>
        <tr>
          <th class="pb-4">Product</th>
          <th class="pb-4">Size</th>
          <th class="pb-4">Quantity</th>
          <th class="pb-4">Price</th>
          <th class="pb-4">Remove</th>
        </tr>
      </thead>
      <tbody>
        {#each cart as item}
          <tr class="border-t">
            <td class="py-4">
              <div class="flex items-center">
                {#if item.product.image}
                  {#await supabase.storage.from('').getPublicUrl(item.product.image).data.publicUrl then url} 
                    <img src={url} alt={item.product.name} class="w-16 h-16 object-cover mr-4" />
                  {:catch error}
                    <p class="text-red-500">Error loading image</p>
                  {/await}
                {/if}
                <span>{item.product.name}, {item.product.size}</span>
              </div>
            </td>
            <td class="py-4">
              <input disabled type="text" value={item.size} class="w-16 text-center border rounded" />
            </td>
            <td class="py-4">
              <input type="number" min="1" value={item.quantity} class="w-16 text-center border rounded" />
            </td>
            <td class="py-4">RM {item.product.price.toFixed(2)}</td>
            <td class="py-4">
              <button class="bg-red-600 text-white p-2 rounded" on:click={() => removeFromCart(item.product_id)}>×</button>
            </td>
          </tr>
        {/each}
      </tbody>
    </table>

    <div class="text-right">
      <p class="text-xl font-bold mb-4">Subtotal: RM {calculateSubtotal()}</p>
      <button class="bg-purple-600 text-white py-2 px-6 rounded">Check Out</button>
    </div>
  {:else}
    <p class="text-xl text-gray-600">Your cart is empty.</p>
  {/if}

  <div class="mt-6">
    <button class="bg-purple-600 text-white py-2 px-4 rounded" on:click={() => goto('/buyer')}>Back To All Products</button>
  </div>
</section>

<style>
  section {
    max-width: 1200px;
    margin: auto;
  }

  table {
    width: 100%;
    border-collapse: collapse;
  }

  th, td {
    padding: 1rem;
    text-align: left;
  }

  th {
    border-bottom: 2px solid #ddd;
  }

  td {
    border-bottom: 1px solid #ddd;
  }

  .bg-red-600 {
    background-color: #e3342f;
  }

  .bg-red-600:hover {
    background-color: #cc1f1a;
  }
</style>
