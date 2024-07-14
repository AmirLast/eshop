<script lang="ts">
  import { goto } from '$app/navigation';
  import type { PageData } from './$types';
  import Header from './component/header.svelte';

  export let data: PageData;
  let product = data.product;
  let { supabase, session } = data;

  $: ({ supabase, session } = data);
</script>

<svelte:head>
<title>Home – ESHOP</title>
</svelte:head>

<Header {data} />

<section class="text-center py-8">
<h2 class="text-4xl font-bold mb-4">Get Shoes Limited!</h2>
<p class="text-lg mb-6">Times are tough. 🥾👟👞🥿👠👡👢</p>

<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
  {#each data.product as product}
    <div class="bg-white shadow-md rounded-lg overflow-hidden">
      {#each product.image as image}
      <img src={supabase.storage.from('').getPublicUrl(image).data.publicUrl} alt={product.name} class="w-full h-48 object-cover" />
      {/each}
      <div class="p-4">
        <h3 class="text-2xl font-bold mb-2">{product.name}</h3>
        <p class="text-gray-700 mb-4">{product.description}</p>
        <p class="text-gray-700 mb-4">{product.quantity}</p>
        <div class="text-xl font-semibold mb-4">${product.price.toFixed(2)}</div>
        <button class="bg-purple-600 text-white py-2 px-4 rounded">Buy Now</button>
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
