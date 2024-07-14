// cart.ts
import type { PageLoad } from './$types';

export const load: PageLoad = async ({ parent, url }) => {
  const { supabase, session } = await parent();

  // Fetch user profile
  const { data: profiles } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', session?.user.id)
    .single();

  // Fetch products
  const { data: product } = await supabase
    .from('product')
    .select('*');

  // Fetch items in the cart
  const { data: cart } = await supabase
    .from('cart')
    .select('*')
    .eq('profile_id', session?.user.id);

  return { profiles, product, cart };
};
