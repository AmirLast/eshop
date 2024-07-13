<script>
	import { goto, invalidateAll } from '$app/navigation';

	export let data;
	let { supabase, session } = data;
	$: ({ supabase, session } = data);

	let email = '';
	let password = '';
	let confirmPassword = '';
	let username = '';
	let matrikID = '';
	let full_name = '';
	let errorMessage = '';
	let loading = false;
	let role = 'buyer';
	let phone = '';
    let address = '';
	let showPassword = false;
	let showConfirmPassword = false;

	let errors = {
		email: '',
		password: '',
		confirmPassword: '',
		username: '',
		full_name: '',
		phone: '',
        address: ''
	};

	const validateForm = () => {
		let isValid = true;
		errors = {
			email: '',
			password: '',
			confirmPassword: '',
			username: '',
			full_name: '',
			phone: '',
            address: ''
		};

		const symbolRegex = /[!@#$%^&*(),.?":{}|<>]/;
		const uppercaseRegex = /[A-Z]/;
		const lowercaseRegex = /[a-z]/;
		const number = /[1234567890]/;

		if (!email) {
			errors.email = 'Email is required';
			isValid = false;
		}
		if (!password) {
			errors.password = 'Password type is required';
			isValid = false;
		} else if (password.length < 8) {
			errors.password = 'Password must be at least 8 characters';
			isValid = false;
		} else if (!symbolRegex.test(password)) {
			errors.password = 'Password must contain at least 1 symbol';
			isValid = false;
		} else if (!uppercaseRegex.test(password)) {
			errors.password = 'Password must contain at least 1 uppercase letter';
			isValid = false;
		} else if (!lowercaseRegex.test(password)) {
			errors.password = 'Password must contain at least 1 lowercase letter';
			isValid = false;
		} else if (!number.test(password)) {
			errors.password = 'Password must contain at least 1 number';
			isValid = false;
		}
		if (!confirmPassword) {
			errors.confirmPassword = 'Confirm Password is required';
			isValid = false;
		}
		if (!username) {
			errors.username = 'Username type is required';
			isValid = false;
		}
		if (!full_name) {
			errors.full_name = 'Full Name type is required';
			isValid = false;
		}
		if (!phone) {
			errors.phone = 'Phone type is required';
			isValid = false;
		}
        if (!address) {
			errors.address = 'Address type is required';
			isValid = false;
		}
		return isValid;
	};

	const handleSignIn = async () => {

		if (!validateForm()) {
			console.error('Register validation failed');
			return;
		}

		if (email !== '' && password !== '' && confirmPassword !== '' && username !== '' && address !== '' && full_name !== '' && phone !== '') {
			if (password !== confirmPassword) {
				errorMessage = 'Passwords do not match';
				return;
			}

			loading = true;

			// Check if email already exists
			const { data: existingUsers, error: checkError } = await supabase
				.from('profiles')
				.select('email')
				.eq('email', email);

			if (checkError) {
				errorMessage = checkError.message;
				loading = false;
				return;
			}

			if (existingUsers.length > 0) {
				errorMessage = 'Email already in use';
				loading = false;
				return;
			}

			const { data, error } = await supabase.auth.signUp({
				email,
				password
			});

			if (!error) {
				errorMessage = '';
				await supabase
					.from('profiles')
					.update({ username, full_name, address, role, phone, email })
					// @ts-ignore
					.eq('id', data.user.id);
				alert('Please confirm your email before logging in.');
				goto('/', { replaceState: true });
			} else {
				if (error.status === 429) {
						errorMessage = 'Rate limit exceeded. Please try again later.';
				} else {
					errorMessage = error.message;
				}
			}
		} else {
			errorMessage = 'Please fill all fields';
		}
		loading = false;
	};
</script>

<div class="flex min-h-full flex-col justify-center px-6 py-12 lg:px-8">
    <div class="sm:mx-auto sm:w-full sm:max-w-sm">
        <img class="mx-auto h-10 w-auto" src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=600" alt="Your Company">
        <h2 class="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">Sign in to your account</h2>
    </div>

    <div class="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
        <form class="space-y-6">
        <div>
            <label for="username" class="block text-sm font-medium leading-6 text-gray-900">Username</label>
            <div class="mt-2">
                <input id="username" bind:value={username} placeholder="Your username here" name="username" autocomplete="username" required class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6">
            </div>
            {#if errors.username}<p class="text-red-500 text-xs italic">{errors.username}</p>{/if}
        </div>

        <div>
            <label for="full_name" class="block text-sm font-medium leading-6 text-gray-900">Full Name</label>
            <div class="mt-2">
                <input id="full_name" bind:value={full_name} placeholder="Your Full Name here" name="full_name" autocomplete="full_name" required class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6">
            </div>
            {#if errors.full_name}<p class="text-red-500 text-xs italic">{errors.full_name}</p>{/if}
        </div>
        
        <div>
            <label for="address" class="block text-sm font-medium leading-6 text-gray-900">Address</label>
            <div class="mt-2">
                <input id="address" bind:value={address} placeholder="Your Address here" name="address" autocomplete="address" required class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6">
            </div>
            {#if errors.address}<p class="text-red-500 text-xs italic">{errors.address}</p>{/if}
        </div>
        
        <div>
            <label for="phone" class="block text-sm font-medium leading-6 text-gray-900">No. Phone</label>
            <div class="mt-2">
            <input id="phone" bind:value={phone} placeholder="Your No. Phone here" name="phone" autocomplete="phone" required class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6">
            </div>
            {#if errors.phone}<p class="text-red-500 text-xs italic">{errors.phone}</p>{/if}
        </div>
        
        <div>
            <label for="email" class="block text-sm font-medium leading-6 text-gray-900">Email address</label>
            <div class="mt-2">
            <input type="email" id="email" bind:value={email} placeholder="xxxx@xxx.xxx" name="email" autocomplete="email" required class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6">
            </div>
            {#if errors.email}<p class="text-red-500 text-xs italic">{errors.email}</p>{/if}
        </div>

        <div>
            <div class="flex items-center justify-between">
            <label for="password" class="block text-sm font-medium leading-6 text-gray-900">Password</label>
            </div>
            <div class="relative mt-2">
                {#if showPassword}
                    <input type="text" id="password" bind:value={password} placeholder="Your password here" class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"/>
                {:else}
                    <input type="password" id="password" bind:value={password} placeholder="Your password here" class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"/>
                {/if}
                <div>
                    <!-- svelte-ignore a11y-click-events-have-key-events -->
                    <!-- svelte-ignore a11y-no-static-element-interactions -->
                    <div class="absolute inset-y-0 right-0 px-3 py-2 cursor-pointer" on:click={() => (showPassword = !showPassword)}>
                        {#if showPassword}
                            <span class="fa-solid fa-eye"></span> <!-- Font Awesome icon for show -->
                        {:else}
                            <span class="fa-solid fa-eye-slash"></span> <!-- Font Awesome icon for hide -->
                        {/if}
                    </div>
                </div>
            </div>
            {#if errors.password}<p class="text-red-500 text-xs italic">{errors.password}</p>{/if}
        </div>

        <div>
            <div class="flex items-center justify-between">
            <label for="password" class="block text-sm font-medium leading-6 text-gray-900">Confirm Password</label>
            </div>
            <div class="relative mt-2">
                {#if showConfirmPassword}
                    <input type="text" id="password" bind:value={confirmPassword} placeholder="Your password here" class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"/>
                {:else}
                    <input type="password" id="password" bind:value={confirmPassword} placeholder="Your password here" class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"/>
                {/if}
                <div>
                    <!-- svelte-ignore a11y-click-events-have-key-events -->
                    <!-- svelte-ignore a11y-no-static-element-interactions -->
                    <div class="absolute inset-y-0 right-0 px-3 py-2 cursor-pointer" on:click={() => (showConfirmPassword = !showConfirmPassword)}>
                        {#if showConfirmPassword}
                            <span class="fa-solid fa-eye"></span>
                        {:else}
                            <span class="fa-solid fa-eye-slash"></span>
                        {/if}
                    </div>
                </div>
            </div>
            {#if errors.confirmPassword}<p class="text-red-500 text-xs italic">{errors.confirmPassword}</p>{/if}
        </div>

        <p class="text-red-500 text-center text-xs italic">{errorMessage}</p>

        <div>
            <button disabled={loading} on:click={handleSignIn} id="login-button" class="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">Register</button>
        </div>

        <div class="flex items-center justify-center">
            <a class="font-semibold leading-6 text-indigo-600 hover:text-indigo-500" href="/">Back</a>
        </div>
        </form>
    </div>
</div>