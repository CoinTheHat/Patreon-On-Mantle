import { NextResponse } from 'next/server';
import { supabase } from '@/utils/supabase';

export async function GET() {
    const { data, error } = await supabase
        .from('hashtags')
        .select('*')
        .order('sortOrder', { ascending: true });

    if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data);
}

export async function POST(request: Request) {
    try {
        const body = await request.json();

        // Check if bulk add (array)
        if (Array.isArray(body)) {
            const hashtags = body.map((tag: any) => ({
                id: tag.id || tag.label.toLowerCase().replace(/[^a-z0-9]+/g, ''),
                label: tag.label,
                sortOrder: tag.sortOrder || 0,
                isActive: tag.isActive ?? true,
                isTrending: tag.isTrending ?? false
            }));

            const { data, error } = await supabase
                .from('hashtags')
                .insert(hashtags)
                .select();

            if (error) throw error;
            return NextResponse.json(data);
        }

        // Single add
        const { label, sortOrder, isActive, isTrending } = body;
        const id = body.id || label.toLowerCase().replace(/[^a-z0-9]+/g, '');

        const { data, error } = await supabase
            .from('hashtags')
            .insert([
                { id, label, sortOrder: sortOrder || 0, isActive: isActive ?? true, isTrending: isTrending ?? false }
            ])
            .select()
            .single();

        if (error) throw error;

        return NextResponse.json(data);
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
