<script lang="ts">
	import { goto } from '$app/navigation';
	import type { PageData } from './$types';

	export let data: PageData;
	let { supabase, session } = data;
	$: ({ supabase, session } = data);

	let loading = false;
	let email = '';
	let token = '';
	let successMessage = '';
	let errorMessage = '';

	const handleResetPass = async () => {
		if (!email || email === '') {
			errorMessage = 'Please enter email';
			return;
		}
		errorMessage = '';
		loading = true;

		const { error } = await supabase.auth.resetPasswordForEmail(email);
		if (error) {
			errorMessage = error.message;
		} else {
			successMessage = 'OTP has been sent to your email!';
		}

		loading = false;
	};

	const handleSendToken = async () => {
		loading = true;
		const { error } = await supabase.auth.verifyOtp({ email, token, type: 'recovery' });
		if (!error) {
			goto('/update-password');
		} else {
			errorMessage = error.message;
		}
		loading = false;
	};
</script>

<div class="flex min-h-full flex-col justify-center px-6 py-12 lg:px-8">
	<div class="sm:mx-auto sm:w-full sm:max-w-sm">
	  <img class="mx-auto h-10 w-auto" src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=600" alt="Your Company">
	  <h2 class="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">Recovery your account</h2>
	</div>
  
	<div class="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
	  <form class="space-y-6">
		<!-- Show email input first -->
		{#if successMessage === ''}
		<div>
			<label for="email" class="block text-sm font-medium leading-6 text-gray-900">Email address</label>
			<div class="mt-2">
				<input id="email" placeholder="xxxx@xxxx.xxx" name="email" type="email" autocomplete="email" bind:value={email} required class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6">
			</div>
		</div>
		{/if}
		
		<!-- Display success message and OTP input field after sending email -->
		{#if successMessage !== ''}
			<p class="mt-2 text-sm font-bold text-success-content bg-base-200 p-3 rounded-xl duration-75">
				{successMessage}
			</p>
			<div>
				<label for="otp" class="block text-sm font-medium leading-6 text-gray-900">Your OTP</label>
				<div class="mt-2">
					<input id="otp" type="text" bind:value={token} placeholder="XXXXXX" required class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6">
				</div>
			</div>
		{/if}

		{#if errorMessage !== ''}
			<p
				class=" text-center mt-2 text-sm font-bold text-error border border-solid border-error-content p-3 rounded-xl text-red-700"
			>
				{errorMessage}
			</p>
		{/if}

		{#if successMessage === ''}
			<div class="flex items-center justify-center w-full">
				<button disabled={loading} on:click={handleResetPass} class="specialBtnDark hover:bg-blue-900 py-2 px-4 rounded focus:outline-none w-full"
					>Send OTP</button
				>
			</div>
		{:else}
			<div class="flex items-center justify-center w-full mb-2">
				<button disabled={loading} on:click={handleSendToken} class="specialBtnDark hover:bg-blue-900 py-2 px-4 rounded focus:outline-none w-full"
					>Verify OTP</button
				>
			</div>
			<div class="flex items-center justify-center w-full">
				{#if errorMessage !== ''}
					<button
						on:click={() => {
							errorMessage = '';
							email = '';
							successMessage = '';
						}}
						class="specialBtn py-2 px-4 rounded focus:outline-none w-full">Re-enter Email</button
					>
				{/if}
			</div>
		{/if}

		<a href="/" class="font-semibold leading-6 text-indigo-600 hover:text-indigo-500">Back</a>
	</div>
  </div>