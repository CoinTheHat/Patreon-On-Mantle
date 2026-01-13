import { NextResponse } from 'next/server';
import { supabase } from '@/utils/supabase';

export async function GET(request: Request, { params }: { params: Promise<{ address: string }> }) {
    const resolvedParams = await params;
    const { address } = resolvedParams;

    const { data, error } = await supabase
        .from('creatorTaxonomy')
        .select('*')
        .eq('creatorAddress', address)
        .single();

    if (error && error.code !== 'PGRST116') { // Ignore "Row not found"
        return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data || { categoryIds: [], hashtagIds: [] });
}

export async function PATCH(request: Request, { params }: { params: Promise<{ address: string }> }) {
    const resolvedParams = await params;
    const { address } = resolvedParams;

    try {
        const body = await request.json();
        const { categoryIds, hashtagIds } = body;

        const { data, error } = await supabase
            .from('creatorTaxonomy')
            .upsert({
                creatorAddress: address,
                categoryIds,
                hashtagIds,
                updatedAt: new Date().toISOString()
            })
            .select()
            .single();

        if (error) throw error;

        return NextResponse.json(data);
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
