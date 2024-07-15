// Home.ts
import type { PageLoad } from './$types';

export const load = (async ({ parent, url }) => {
    const { supabase, session } = await parent();

    // Fetch user profile
    const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', session?.user.id)
        .single();

    if (profilesError) {
        console.error(profilesError);
    }

    // Fetch products
    const { data: product, error: productError } = await supabase
        .from('product')
        .select('*');

    if (productError) {
        console.error(productError);
    }

	const { data: cart, error: cartError } = await supabase
      .from('cart')
      .select(`*, product:product_id(*)`)
      .eq('profile_id', session?.user.id);

	if (cartError) {
        console.error(cartError);
    }

    return { profiles, product, cart };
}) satisfies PageLoad;
