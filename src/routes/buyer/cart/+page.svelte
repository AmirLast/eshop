<script lang="ts">
  import { goto } from '$app/navigation';
  import type { PageData } from './$types';
  import Header from '../component/header.svelte';
  import { onDestroy } from 'svelte';

  export let data: PageData;
  let profiles = data.profiles;
  let product = data.product;
  let cart = data.cart;
	let showPayConfirm = false;

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

  function handlePay() {
		showPayConfirm = true;
	};

  async function checkout() {
    try {

      showPayConfirm = false;

      let totalQuantity = 0;
      let totalAmount = 0;
      let productDetails = cart.map(item => {
        totalQuantity += item.quantity;
        totalAmount += item.quantity * item.product.price;
        return `${item.product.name} (${item.quantity} x RM ${item.product.price.toFixed(2)})`;
      }).join(', ');

      const { error: payError } = await supabase.from('pay').insert({
        profile_id: session.user.id,
        product_details: productDetails,
        total_quantity: totalQuantity,
        total_amount: totalAmount,
        payment_method: 'cash', // Example payment method
        no_receipt: `REC-${Date.now()}-${Math.random().toString(36).substring(7)}`, // Generate a unique receipt number
      });

      if (payError) {
        console.error('Error inserting payment details:', payError.message);
        return;
      }

      // Delete all items from the cart for the user
      const { error: deleteError } = await supabase
        .from('cart')
        .delete()
        .eq('profile_id', session.user.id);

      if (deleteError) {
        console.error('Error clearing cart:', deleteError.message);
        return;
      }

      // Update cart to empty after successful checkout
      cart = [];
      console.log('Checkout successful and cart cleared');
      // Optionally, redirect to a confirmation page
      // goto('/confirmation');
      alert('purchase successful');
      window.location.href = '/buyer/purchases';
    } catch (error) {
      console.error('Unexpected error during checkout:', error.message);
      // Handle unexpected errors
    }
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
                <span>{item.product.name}</span>
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
      <button class="bg-purple-600 text-white py-2 px-6 rounded" on:click={handlePay}>Check Out</button>
    </div>
  {:else}
    <p class="text-xl text-gray-600">Your cart is empty.</p>
  {/if}

  <div class="mt-6">
    <button class="bg-purple-600 text-white py-2 px-4 rounded" on:click={() => goto('/buyer')}>Back To All Products</button>
  </div>
</section>

{#if showPayConfirm}
  <div class="modal fixed inset-0 flex items-center justify-center bg-gray-500 bg-opacity-75">
    <div class="bg-white p-6 rounded shadow-md text-center">
      <p>Are sure to make payment?</p>
      <button on:click={checkout} class="bg-violet-500 hover:bg-violet-700 p-2 m-2 px-4 py-2 mt-4 rounded">Confirm</button>
      <button on:click={() => (showPayConfirm = false)} class="bg-red-500 hover:bg-red-700 p-2 m-2 px-4 py-2 mt-4 rounded">Cancel</button>
    </div>
  </div>
{/if}

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

  .modal {
        z-index: 9999;
        display: flex;
        align-items: center;
        justify-content: center;
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(0, 0, 0, 0.5);
    }
</style>
