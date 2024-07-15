// cart.ts
import type { PageLoad } from './$types';

export const load: PageLoad = async ({ parent, url }) => {
  try {
    const { supabase, session } = await parent();

    // Fetch user profile
    const { data: profiles, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', session?.user.id)
      .single();
    
    if (profileError) throw new Error(`Profile fetch error: ${profileError.message}`);

    // Fetch products
    const { data: product, error: productError } = await supabase
      .from('product')
      .select('*');

    if (productError) throw new Error(`Product fetch error: ${productError.message}`);

    // Fetch items in the cart
    const { data: cart, error: cartError } = await supabase
      .from('cart')
      .select(`*, product:product_id(*)`)
      .eq('profile_id', session?.user.id);

    if (cartError) throw new Error(`Cart fetch error: ${cartError.message}`);

    return { profiles, product, cart };
  } catch (error) {
    console.error('Load function error:', error);
    throw error;
  }
};
