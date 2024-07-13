import type { PageLoad } from './$types';

export const load = (async ({ parent, url }) => {
	const { supabase, session } = await parent();
	const { data: profiles } = await supabase
		.from('profiles')
		.select(`*`)
		.eq('id', session?.user.id)
		.single();

	return { profiles };
}) satisfies PageLoad;