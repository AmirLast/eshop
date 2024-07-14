<script lang="ts">
  import { goto } from '$app/navigation';
  import type { PageData } from './$types';
  import Header from './component/header.svelte';
  import Modal from './component/Modal.svelte';
  import { onDestroy } from 'svelte';

  export let data: PageData;
  let product = data.product;
  let { supabase, session } = data;

  let selectedProduct = null;

  $: ({ supabase, session } = data);

  function openModal(product) {
    selectedProduct = product;
  }

  function closeModal() {
    selectedProduct = null;
  }

  onDestroy(() => {
    console.log('Component destroyed');
  });
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
      <div class="bg-white shadow-md rounded-lg overflow-hidden" on:click={() => openModal(prod)} key={prod.id}>
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
        </div>
      </div>
    {/each}
  </div>

  {#if selectedProduct}
    <Modal product={selectedProduct} closeModal={closeModal} />
  {/if}
</section>

<style>
  section {
    max-width: 1200px;
    margin: auto;
  }
</style>
