<script lang="ts">
    import { onDestroy } from 'svelte';
    import { goto } from '$app/navigation';
    import type { PageData } from './$types';
    import Header from '../component/header.svelte';

    export let data: PageData;
    let products = data.product;
    let { supabase, session } = data;
    $: ({ supabase, session } = data);

    console.log('Product data:', products);

    let quantity: number | null = null;
    let newQuantity: number = 0; // Ensure this is initialized as a number
    let showOption = false;
    let idproduct: string | null = null;

    function handleOption(id: string, quant: number) {
        showOption = true;
        idproduct = id;
        quantity = quant;
    }

    const updateProduct = async () => {
        if (quantity === null || idproduct === null) return;

        showOption = false;
        const total = Number(quantity) + Number(newQuantity);

        console.log('newQuantity:', newQuantity);
        console.log('product.quantity:', quantity);
        console.log('total:', total);
        console.log('product.id:', idproduct);

        try {
            const { data: updatedProduct, error } = await supabase.from('product')
                .update({ quantity: total })
                .eq('id', idproduct);

            if (error) {
                throw error;
            }

            console.log('Product updated successfully:', updatedProduct);
            alert('Product updated successfully!');
            window.location.href = '/manager/product';
        } catch (error) {
            console.error('Error updating product:', error);
            alert(`Failed to update product: ${error.message}`);
        }
    }

    const deleteProduct = async () => {
        if (idproduct === null) return;

        showOption = false;

        try {
            const { data: deletedProduct, error } = await supabase.from('product')
                .delete()
                .eq('id', idproduct);

            if (error) {
                throw error;
            }

            console.log('Product deleted successfully:', deletedProduct);
            alert('Product deleted successfully!');
            window.location.href = '/manager/product';
        } catch (error) {
            console.error('Error deleting product:', error);
            alert(`Failed to delete product: ${error.message}`);
        }
    }

    onDestroy(() => {
        // Cleanup code if needed
    });

    const handleAdd = async () => {
            console.log("Successfully signed out.");
            window.location.href = '/manager/add';
    };
</script>

<svelte:head>
    <title>View Products – ESHOP</title>
</svelte:head>

<Header {data} />

<main class="max-w-5xl mx-auto p-6 bg-white shadow-md rounded-md mt-10">
    <div class="flex flex-row justify-between w-full">
        <h1 class="text-3xl font-bold mb-6">View Products</h1>
        <div>
        <button class="bg-purple-500 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded" on:click={handleAdd}>Add Product</button>
        </div>
    </div>

    <section>
        <table class="min-w-full bg-white">
            <thead class="bg-gray-200">
                <tr>
                    <th class="py-2">ID</th>
                    <th class="py-2">Name</th>
                    <th class="py-2">Description</th>
                    <th class="py-2">Quantity</th>
                    <th class="py-2">Price</th>
                    <th class="py-2">Option</th>
                </tr>
            </thead>
            <tbody>
                {#each products as item, index}
                    <tr class="border-t">
                        <td class="py-2 text-center">{index + 1}</td>
                        <td class="py-2 text-center">{item.name}</td>
                        <td class="py-2 text-center">{item.description}</td>
                        <td class="py-2 text-center">{item.quantity}</td>
                        <td class="py-2 text-center">{item.price}</td>
                        <td class="py-2 text-center">
                            <button class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" on:click={() => handleOption(item.id, item.quantity)}>
                                Option
                            </button>
                        </td>
                    </tr>
                {/each}
            </tbody>
        </table>
    </section>
</main>

{#if showOption}
<div class="modal fixed inset-0 flex items-center justify-center bg-gray-500 bg-opacity-75">
    <div class="bg-white p-6 rounded shadow-md text-center">
        <p>Are you sure you want to perform this action?</p>
        <form>
            <label for="quantity">New Quantity</label>
            <input id="quantity" type="number" class="border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50" bind:value={newQuantity} />
            <button type="button" class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded m-2" on:click={updateProduct}>Update</button>
            <button type="button" class="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded m-2" on:click={deleteProduct}>Delete</button>
            <button type="button" class="border border-gray-300 rounded-md shadow-sm py-2 px-4 text-gray-700 m-2" on:click={() => (showOption = false)}>Cancel</button>
        </form>
    </div>
</div>
{/if}

<style>
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
