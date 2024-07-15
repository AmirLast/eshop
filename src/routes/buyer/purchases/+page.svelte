<script lang="ts">
    import { goto } from '$app/navigation';
    import type { PageData } from './$types';
    import Header from '../component/header.svelte';
  
    export let data: PageData;
    let profiles = data.profiles;
    let purchases = data.purchases;
  
    let { supabase, session } = data;
  
    $: ({ supabase, session } = data);
  </script>
  
  <svelte:head>
    <title>Purchases - ESHOP</title>
  </svelte:head>
  
  <Header {data} />
  
  <section class="text-center py-8">
    <h2 class="text-4xl font-bold mb-4">Your Purchases</h2>
  
    {#if purchases && purchases.length > 0}
      <table class="w-full text-left mb-6">
        <thead>
          <tr>
            <th class="pb-4">No Receipt</th>
            <th class="pb-4">Product Details</th>
            <th class="pb-4">Total Quantity</th>
            <th class="pb-4">Total Amount</th>
            <th class="pb-4">Status</th>
            <th class="pb-4">Date</th>
          </tr>
        </thead>
        <tbody>
          {#each purchases as item}
            <tr class="border-t">
              <td class="py-4">{item.no_receipt}</td>
              <td class="py-4">{item.product_details}</td>
              <td class="py-4">{item.total_quantity}</td>
              <td class="py-4">RM {item.total_amount.toFixed(2)}</td>
              <td class="py-4">{item.payment_status}</td>
              <td class="py-4">{new Date(item.created_at).toLocaleDateString()}</td>
            </tr>
          {/each}
        </tbody>
      </table>
    {:else}
      <p class="text-xl text-gray-600">You have no purchases.</p>
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
  
    .bg-purple-600 {
      background-color: #6b46c1;
    }
  
    .bg-purple-600:hover {
      background-color: #553c9a;
    }
  </style>
  