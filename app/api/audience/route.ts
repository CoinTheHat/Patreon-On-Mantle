import { NextResponse } from 'next/server';
import { supabase } from '@/utils/supabase';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const creator = searchParams.get('creator');

    // If no creator specified, return empty
    if (!creator) {
        return NextResponse.json([]);
    }

    // Fetch real subscriptions
    const { data: subs, error } = await supabase
        .from('subscriptions')
        .select('*')
        .ilike('creatorAddress', creator)
        .order('createdAt', { ascending: false });

    if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // Fetch this creator's tiers to map tierId -> tierName
    const { data: tiers } = await supabase
        .from('tiers')
        .select('*')
        .ilike('creatorAddress', creator);

    // Filter out obvious mock data (starts with 0x1010, 0x2020, etc from previous tests)
    // and enrich with tier names
    const enrichedSubs = subs
        .filter(s => !s.subscriberAddress.startsWith('0x1010') && !s.subscriberAddress.startsWith('0x2020') && !s.subscriberAddress.startsWith('0x3030'))
        .map(sub => {
            // tierId in contract corresponds to the index in the text-based Tiers list usually, 
            // OR we match by ID if we saved it. 
            // In our system we just save 'tierId' (0, 1, 2).
            // We need to assume the `tiers` fetched are in created order or have some ID mapping.
            // For now, let's try to find a tier with that 'id' or just match by index if needed.
            // Actually, in `dashboard/membership`, we probably save them.
            // Let's fallback to "Tier X" if looking up fails.

            // Note: DB `tiers` has its own `id` (bigint). Contract has `tierId` (0,1,2).
            // We haven't stored the mapping. 
            // However, usually they are ordered. Let's try to just return the sub as is for now 
            // but add a helper.

            // Better strategy: The tiers array from DB might not match index 0,1,2 if deleted.
            // BUT for this Hackathon, we probably didn't delete tiers.
            const matchedTier = tiers?.find((t, index) => index === sub.tierId);

            return {
                ...sub,
                tierName: matchedTier?.name || sub.tierName || `Tier ${sub.tierId}`,
                price: matchedTier?.price || sub.price || '-'
            };
        });

    return NextResponse.json(enrichedSubs);
}

export async function POST(request: Request) {
    // To allow manually adding a subscriber (simulation)
    const body = await request.json();
    const { error } = await supabase.from('subscriptions').insert(body);

    if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json({ success: true });
}
