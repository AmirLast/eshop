<script>
  import { goto, invalidateAll } from '$app/navigation';

  export let data;
  let { supabase } = data;
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
    </form>

    <div class="relative mt-6">
      <div class="absolute inset-0 flex items-center">
        <div class="w-full border-t border-gray-300"></div>
      </div>
      <div class="relative flex justify-center text-sm">
        <span class="px-2 bg-white text-gray-500">Or continue with</span>
      </div>
    </div>
    
    <div class="mt-6 grid grid-cols-2 gap-3">
      <div>
        <a href="/" class="inline-flex w-full justify-center rounded-md border border-gray-300 bg-white py-2 px-4 text-sm font-medium text-gray-500 shadow-sm hover:bg-gray-50">
          <span class="sr-only">Sign in with Google</span>
          <svg class="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
            <!-- Google icon SVG -->
            <path d="M23.5 12.3c0-.8-.1-1.4-.2-2H12v4h6.5c-.3 1.3-1 2.5-2 3.3v2.7h3.3c2-1.9 3.2-4.7 3.2-8zm-11.5 9c2.7 0 4.9-.9 6.6-2.4l-3.3-2.7c-.9.6-2.1 1-3.3 1-2.6 0-4.8-1.7-5.6-4H4.2v2.8c1.6 3.1 4.8 5.3 8.3 5.3zM4.8 14.3c-.2-.7-.3-1.3-.3-2s.1-1.4.3-2V7.5H1.5c-.7 1.3-1.2 2.7-1.2 4.5s.5 3.2 1.2 4.5l3.3-2.2zm6.7-10.5c1.2 0 2.3.4 3.1 1.1l2.3-2.3c-1.9-1.8-4.5-3-7.4-3C5.7 2 2.5 4.2 1.5 7.5l3.3 2.3c.8-2.4 3-4.2 5.7-4.2z"></path>
          </svg>
          <span class="ml-3">Google</span>
        </a>
      </div>

      <div>
        <a href="/" class="inline-flex w-full justify-center rounded-md border border-gray-300 bg-white py-2 px-4 text-sm font-medium text-gray-500 shadow-sm hover:bg-gray-50">
          <span class="sr-only">Sign in with GitHub</span>
          <svg class="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
            <!-- GitHub icon SVG -->
            <path d="M12 0.3c-6.6 0-12 5.4-12 12 0 5.3 3.4 9.8 8.2 11.4.6.1.8-.3.8-.6V20c-3.3.7-4-1.6-4-1.6-.5-1.3-1.2-1.7-1.2-1.7-.9-.6 0-.6 0-.6 1 .1 1.6 1.1 1.6 1.1.9 1.6 2.4 1.2 3 .9.1-.7.3-1.2.5-1.5-2.7-.3-5.5-1.4-5.5-6.1 0-1.3.5-2.4 1.2-3.3 0-.3-.5-1.3 0-2.7 0 0 1-.3 3.2 1.2.9-.2 1.8-.3 2.8-.3s1.9.1 2.8.3c2.2-1.5 3.2-1.2 3.2-1.2.5 1.4 0 2.4 0 2.7.8.9 1.2 2 1.2 3.3 0 4.7-2.8 5.8-5.5 6.1.3.3.6.8.6 1.5v2.2c0 .3.2.7.8.6C20.6 22.1 24 17.6 24 12.3c0-6.6-5.4-12-12-12z"></path>
          </svg>
          <span class="ml-3">GitHub</span>
        </a>
      </div>
    </div>

    <p class="mt-10 text-center text-sm text-gray-500">
      Not a member?
      <a href="/register" class="font-semibold leading-6 text-indigo-600 hover:text-indigo-500">Register</a>
    </p>
  </div>
</div>
