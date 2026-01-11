import { NextResponse } from 'next/server';
import { supabase } from '@/utils/supabase';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const creatorAddress = searchParams.get('creator');

    if (!creatorAddress) {
        return NextResponse.json({ error: 'Creator address required' }, { status: 400 });
    }

    // 1. Get ALL subscriptions to filter manually for accuracy
    const { data: allSubs, error: subError } = await supabase
        .from('subscriptions')
        .select('*')
        .eq('creatorAddress', creatorAddress);

    if (subError) {
        console.error('Stats error (subs):', subError);
    }

    const now = new Date();

    // Filter logic:
    // 1. Must be Active (expiresAt > now)
    // 2. Must not be a mock test user (0x1010, 0x2020 etc)
    const validSubs = (allSubs || []).filter((sub: any) => {
        const isExpired = new Date(sub.expiresAt) < now;
        const isMock = sub.subscriberAddress.startsWith('0x1010') ||
            sub.subscriberAddress.startsWith('0x2020') ||
            sub.subscriberAddress.startsWith('0x3030');
        return !isExpired && !isMock;
    });

    const membersCount = validSubs.length;

    // 2. Calculate Revenue
    // Fetch tiers to map price
    const { data: tiers } = await supabase
        .from('tiers')
        .select('name, price')
        .eq('creatorAddress', creatorAddress);

    let totalRevenue = 0;

    if (tiers && validSubs.length > 0) {
        // Tiers usually don't have IDs in this schema (index based), so we try to match by name or index
        // But since we rely on `tierId` now:
        validSubs.forEach((sub: any) => {
            if (typeof sub.tierId === 'number' && tiers[sub.tierId]) {
                totalRevenue += parseFloat(tiers[sub.tierId].price);
            } else if (sub.tierName) {
                // Fallback by name
                const t = tiers.find((t: any) => t.name === sub.tierName);
                if (t) totalRevenue += parseFloat(t.price);
            }
        });
    }

    return NextResponse.json({
        activeMembers: membersCount,
        monthlyRevenue: totalRevenue.toFixed(2),
        totalWithdrawals: "0.00"
    });
}
