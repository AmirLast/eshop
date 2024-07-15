import type { PageLoad } from './$types';

export const load = (async ({ parent }) => {
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

    // Fetch cart data
    const { data: cart, error: cartError } = await supabase
        .from('cart')
        .select('*')
        .eq('profile_id', session?.user.id);

    if (cartError) {
        console.error(cartError);
    }

    return { profiles, cart };
}) satisfies PageLoad;
