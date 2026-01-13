import { NextResponse } from 'next/server';
import { supabase } from '@/utils/supabase';

export async function GET() {
    const { data, error } = await supabase
        .from('categories')
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
        const { name, icon, sortOrder, isActive } = body;

        // Auto-generate slug from name if not provided
        const id = body.id || name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

        const { data, error } = await supabase
            .from('categories')
            .insert([
                { id, name, icon, sortOrder: sortOrder || 0, isActive: isActive ?? true }
            ])
            .select()
            .single();

        if (error) throw error;

        return NextResponse.json(data);
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
