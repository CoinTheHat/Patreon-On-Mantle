import { NextResponse } from 'next/server';
import { supabase } from '@/utils/supabase';

export async function PUT(request: Request, { params }: { params: { id: string } }) {
    const id = params.id;
    const body = await request.json();

    // Verify ownership
    const { data: existingPost, error: fetchError } = await supabase
        .from('posts')
        .select('*')
        .eq('id', id)
        .single();

    if (fetchError || !existingPost) {
        return NextResponse.json({ error: 'Post not found' }, { status: 404 });
    }

    if (existingPost.creatorAddress !== body.creatorAddress) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    // Update post
    const payload = {
        title: body.title,
        content: body.content,
        image: body.image || null,
        videoUrl: body.videoUrl || null,
        minTier: Number(body.minTier) || 0,
        isPublic: !!body.isPublic
    };

    const { error } = await supabase
        .from('posts')
        .update(payload)
        .eq('id', id);

    if (error) {
        console.error("Supabase Update Error:", error.message, error.details);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
    const id = params.id;
    const body = await request.json();

    // Verify ownership
    const { data: existingPost, error: fetchError } = await supabase
        .from('posts')
        .select('*')
        .eq('id', id)
        .single();

    if (fetchError || !existingPost) {
        return NextResponse.json({ error: 'Post not found' }, { status: 404 });
    }

    if (existingPost.creatorAddress !== body.creatorAddress) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    // Delete post
    const { error } = await supabase
        .from('posts')
        .delete()
        .eq('id', id);

    if (error) {
        console.error("Supabase Delete Error:", error.message);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
}
