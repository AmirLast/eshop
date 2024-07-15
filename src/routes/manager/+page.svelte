<script lang="ts">
  import { onDestroy } from 'svelte';
  import { goto } from '$app/navigation';
  import type { PageData } from './$types';
  import Header from './component/header.svelte';

  export let data: PageData;
  let { supabase, session } = data;
  $: ({ supabase, session } = data);

  let productName = '';
  let productDescription = '';
  let productPrice = 0;
  let productQuantity = 0;
  let productImage: FileList | null = null;
  let productSizes = '';

  onDestroy(() => {
    // Cleanup code if needed
  });

  const saveProduct = async () => {
    if (productImage) {
        const imageFiles = Array.from(productImage);
      const imageUrls = await Promise.all(
        imageFiles.map(async (file, index) => {
            const { data, error } = await supabase.storage
                .from('product')
                .upload(Date.now().toString() + index, file);

            if (error) {
                console.error('Error uploading image:', error.message);
                return null;
            }
            return data;
		})
    );

    function extractFullPath(data) {
        return data.map((item) => item.fullPath);
    }

    const sizesArray = productSizes.split(',').map(size => size.trim());

      const { data, error } = await supabase
        .from('product')
        .insert([
          {
            name: productName,
            description: productDescription,
            price: productPrice,
            quantity: productQuantity,
            image: extractFullPath(imageUrls),
            size: sizesArray
          },
        ]);

      if (error) {
        console.error('Error saving product:', error);
        return;
      }

      console.log('Product saved:', data);
      // Reset form fields
      productName = '';
      productDescription = '';
      productPrice = 0;
      productQuantity = 0;
      productImage = null;
      productSizes = '';
      // Optionally redirect to another page
      goto('/manager');
    }
  };
</script>

<svelte:head>
  <title>Add Product – ESHOP</title>
</svelte:head>

<Header {data} />

<main class="max-w-3xl mx-auto p-6 bg-white shadow-md rounded-md mt-10">
  <h1 class="text-3xl font-bold mb-6">Upload Product</h1>
  <form on:submit|preventDefault={saveProduct} class="space-y-6">
    <div>
      <label class="block text-sm font-medium text-gray-700">Product Name</label>
      <input type="text" bind:value={productName} required class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
    </div>
    <div>
      <label class="block text-sm font-medium text-gray-700">Product Description</label>
      <textarea bind:value={productDescription} required class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"></textarea>
    </div>
    <div>
      <label class="block text-sm font-medium text-gray-700">Product Price</label>
      <input type="number" bind:value={productPrice} required class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
    </div>
    <div>
      <label class="block text-sm font-medium text-gray-700">Product Quantity</label>
      <input type="number" bind:value={productQuantity} required class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
    </div>
    <div>
      <label class="block text-sm font-medium text-gray-700">Product Sizes (comma-separated)</label>
      <input type="text" bind:value={productSizes} required placeholder="e.g., S, M, L, XL" class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
    </div>
    <div>
      <label class="block text-sm font-medium text-gray-700">Product Image</label>
      <input type="file" multiple accept="image/*" on:change={(e) => productImage = e.target.files} required class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
    </div>
    <button type="submit" class="w-full py-2 px-4 bg-indigo-600 text-white rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">Upload Product</button>
  </form>
</main>

<style>
  main {
    max-width: 768px;
    margin: auto;
    padding: 1.5rem;
    background: white;
    border-radius: 0.5rem;
    box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.1);
  }

  form {
    display: flex;
    flex-direction: column;
  }

  label {
    margin-bottom: 0.5rem;
    font-weight: bold;
  }

  input, textarea, select, button {
    margin-bottom: 1rem;
  }

  button {
    align-self: flex-start;
  }
</style>
