// +page.ts
import type { PageLoad } from './$types';

export const load: PageLoad = async ({ parent }) => {
  const { supabase, session } = await parent();

  // Fetch user profile
  const { data: profiles, error: profileError } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', session?.user.id)
    .single();

  if (profileError) throw new Error(`Profile fetch error: ${profileError.message}`);

  // Fetch purchases
  const { data: purchases, error: purchasesError } = await supabase
    .from('pay')
    .select('*')
    .eq('profile_id', session?.user.id);

  if (purchasesError) throw new Error(`Purchases fetch error: ${purchasesError.message}`);

  const { data: cart, error: cartError } = await supabase
      .from('cart')
      .select(`*, product:product_id(*)`)
      .eq('profile_id', session?.user.id);

	if (cartError) {
        console.error(cartError);
    }

  return { profiles, purchases, cart };
};
