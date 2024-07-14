import type { PageLoad } from './$types';

export const load = (async ({ parent, depends }) => {
    const { supabase, session } = await parent();
    depends('manager:/manager');
    
    const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', session?.user.id)
        .single();

    if (profilesError) {
        console.error(profilesError);
    }

    const { data: product, error: productError } = await supabase
        .from('product')
        .select('*');

    if (productError) {
        console.error(productError);
    }

    return { profiles, product };
}) satisfies PageLoad;
