<script lang="ts">
	import { goto } from '$app/navigation';
	import type { PageData } from './$types';

	export let data: PageData;
	let { supabase, session } = data;
	$: ({ supabase, session } = data);

	let loading = false;
	let newPassword = '';
	let confirmPassword = '';
	let successMessage = '';
	let errorMessage = '';

	const handleUpdatePassword = async () => {
		if (!newPassword || !confirmPassword || newPassword !== confirmPassword) {
			errorMessage = 'Passwords do not match or are empty';
			return;
		}
		errorMessage = '';
		loading = true;

		const { error } = await supabase.auth.updateUser({ password: newPassword });
		if (error) {
			errorMessage = error.message;
		} else {
			successMessage = 'Password has been successfully updated!';
			setTimeout(() => {
				goto('/login');
			}, 3000); // Redirect to login page after 3 seconds
		}

		loading = false;
	};
</script>

<div class="flex flex-col gap-10 flex-1 items-center justify-center pb-10 md:pb-14">
	<h2 class="text-3xl sm:text-2xl md:text-3xl lg:text-4xl max-w-[1200px] mx-auto w-full text-center font-semibold">Update Password</h2>
	<form class="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
		<div class="mb-6">
			<div class="label">
				<span class="block text-gray-700 text-sm font-bold mb-2 max-w-[1000px]">New Password</span>
			</div>
			<input
				type="password"
				bind:value={newPassword}
				placeholder="Enter your new password"
				class="shadow border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus: shadow-outline"
			/>
		</div>

		<div class="mb-6">
			<div class="label">
				<span class="block text-gray-700 text-sm font-bold mb-2 max-w-[1000px]">Confirm Password</span>
			</div>
			<input
				type="password"
				bind:value={confirmPassword}
				placeholder="Confirm your new password"
				class="shadow border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus: shadow-outline"
			/>
		</div>

		{#if errorMessage !== ''}
			<p class="mt-2 text-sm font-bold text-error border border-solid border-error-content p-3 rounded-xl">
				{errorMessage}
			</p>
		{/if}

		{#if successMessage !== ''}
			<p class="mt-2 text-sm font-bold text-success border border-solid border-success-content p-3 rounded-xl">
				{successMessage}
			</p>
		{/if}

		<div class="flex items-center justify-center">
			<button disabled={loading} on:click={handleUpdatePassword} class="specialBtnDark hover:bg-red-900 py-2 px-4 rounded focus:outline-none sm:px-20">
				Update Password
			</button>
		</div>
	</form>
</div>
