import type { PageLoad } from './$types';

export const load = (async ({ parent, url }) => {
	const { supabase, session } = await parent();
	const { data: profiles } = await supabase
		.from('profiles')
		.select(`*`)
		.eq('id', session?.user.id)
		.single();

	const { data: product } = await supabase
		.from('product')
		.select(`*`)

	return { profiles, product };
}) satisfies PageLoad;