// src/routes/dashboard.ts
import type { PageLoad } from './$types';

export const load = (async ({ parent }) => {
    const { supabase, session } = await parent();

    const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', session?.user.id)
        .single();

    if (profileError) {
        console.error(profileError);
    }

    const { data: purchases, error: purchasesError } = await supabase
        .from('pay')
        .select(`
            *,
            profiles (username, phone, address)
        `);
    
    if (purchasesError) {
        console.error(purchasesError);
    }

    const { data: statusData, error: statusError } = await supabase
        .from('pay')
        .select('payment_status');

    if (statusError) {
        console.error(statusError);
    }

    const statusCounts = {
        pending: 0,
        delivery: 0,
        until: 0
    };

    statusData?.forEach((status: { payment_status: keyof typeof statusCounts }) => {
        if (status.payment_status in statusCounts) {
            statusCounts[status.payment_status]++;
        }
    });

    return { profile, purchases, statusData, statusCounts };
}) satisfies PageLoad;
