<script>
    import { goto, invalidateAll } from '$app/navigation';

    export let data;
	let { supabase, session } = data;
	$: ({ supabase, session } = data);

	let email = '';
	let password = '';
	let errorMessage = '';
	let loading = false;

	const handleSignIn = async () => {
		if (email !== '' && password !== '') {
			loading = true;
			const { data, error } = await supabase.auth.signInWithPassword({
				email,
				password
			});
			if (!error) {
				errorMessage = '';
				const { data: user_info } = await supabase
					.from('profiles')
					.select('role')
					.eq('id', data.session.user.id)
					.single();
				invalidateAll().then(() => {
					goto(`/${user_info?.role || 'buyer'}`);
				});
			} else {
				errorMessage = error?.message;
			}
		} else {
			errorMessage = 'Please fill Email or Password';
		}
		loading = false;
	};

	const handleForget = async () => {
		loading = true;
		goto('/recovery');
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
          <label for="email" class="block text-sm font-medium leading-6 text-gray-900">Email address</label>
          <div class="mt-2">
            <input id="email" name="email" type="email" autocomplete="email" bind:value={email} required class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6">
          </div>
        </div>
  
        <div>
          <div class="flex items-center justify-between">
            <label for="password" class="block text-sm font-medium leading-6 text-gray-900">Password</label>
            <div class="text-sm">
              <a href="/recovery" class="font-semibold text-indigo-600 hover:text-indigo-500">Forgot password?</a>
            </div>
          </div>
          <div class="mt-2">
            <input id="password" name="password" type="password" autocomplete="current-password" bind:value={password} required class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6">
          </div>
        </div>

        <p class="text-red-500 text-center text-xs italic">{errorMessage}</p>
  
        <div>
          <button disabled={loading} on:click={handleSignIn} id="login-button" class="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">Sign in</button>
        </div>
        <div>
            <div class="ab kw">
                <div aria-hidden="true" class="aa ak lx zg">
                    <div class="tu aft agb"></div>
                </div>
                <div class="ab lx zl awg awk awv">
                    <span class="alt arq ayb">Or continue with</span>
                </div>
            </div>
            <div class="lk mb yp zw">
                <a href="#" class="lx tu zg zl zv aeb alt arl asb awg awm ayb bbt bbz bcd bcl bik bpt">
                    <span>Google</span>
                </a>
                <a href="#" class="lx tu zg zl zv aeb alt arl asb awg awm ayb bbt bbz bcd bcl bik bpt">
                    <span>GitHub</span>
                </a>
            </div>
        </div>
      </form>
  
      <p class="mt-10 text-center text-sm text-gray-500">
        Not a account?
        <a href="/register" class="font-semibold leading-6 text-indigo-600 hover:text-indigo-500">Register</a>
      </p>
    </div>
  </div>
  