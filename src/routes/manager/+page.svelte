<script lang="ts">
  import Header from './component/header.svelte';
  import type { PageData } from './$types';

  export let data: PageData;
  let { profile, purchases, statusCounts } = data;
</script>

<svelte:head>
  <title>Manager Dashboard – ESHOP</title>
</svelte:head>

<Header {data} />

<main class="max-w-5xl mx-auto p-6 bg-white shadow-md rounded-md mt-10 w-full">
  <h1 class="text-3xl font-bold mb-6">Manager Dashboard</h1>

  <!-- Status Summary Table -->
  <section>
    <h2 class="text-2xl font-semibold mb-4">Status</h2>
    <table class="min-w-full bg-white">
      <thead class="bg-gray-200">
        <tr>
          <th class="py-2 text-center">Pending</th>
          <th class="py-2 text-center">Delivery</th> 
          <th class="py-2 text-center">Until</th>
        </tr>
      </thead>
      <tbody>
        <tr class="border-t">
          <td class="py-2 text-center">{statusCounts.pending}</td>
          <td class="py-2 text-center">{statusCounts.delivery}</td>
          <td class="py-2 text-center">{statusCounts.until}</td>
        </tr>
      </tbody>
    </table>
  </section>

  <!-- Purchases Table -->
  <section class="mb-10">
    <h2 class="text-2xl font-semibold mb-4">Purchases</h2>
    <table class="min-w-full bg-white">
      <thead class="bg-gray-200">
        <tr>
          <th class="py-4 text-center">No</th>
          <th class="py-4 text-center">Name</th>
          <th class="py-4 text-center">No. Phone</th>
          <th class="py-4 text-center">Address</th>
          <th class="py-4 text-center">Product Details</th>
          <th class="py-4 text-center">Total</th>
        </tr>
      </thead>
      <tbody>
        {#each purchases as purchase, index}
          <tr class="border-t">
            <td class="py-4 text-center">{index + 1}</td>
            <td class="py-4 text-center">{purchase.profiles.username}</td>
            <td class="py-4 text-center">{purchase.profiles.phone}</td>
            <td class="py-4 text-center">{purchase.profiles.address}</td>
            <td class="py-4 text-center">{purchase.product_details}</td>
            <td class="py-4 text-center">{purchase.total_amount}</td>
          </tr>
        {/each}
      </tbody>
    </table>
  </section>
</main>
