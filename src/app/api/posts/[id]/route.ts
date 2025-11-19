import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseServer, getAuthUser } from '@/lib/db';
import { validatePost, formatPost } from '@/lib/posts';

// GET /api/posts/[id] - Get a single post
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const supabase = getSupabaseServer();

    const { data, error } = await supabase
      .from('posts')
      .select('*')
      .eq('id', id)
      .single();

    if (error || !data) {
      return NextResponse.json(
        { success: false, error: 'Post not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: formatPost(data) });
  } catch (error: any) {
    console.error('[v0] GET /api/posts/[id] error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch post' },
      { status: 500 }
    );
  }
}

// PUT /api/posts/[id] - Update a post
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getAuthUser(request);
    if (!user) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { id } = await params;
    const body = await request.json();

    const supabase = getSupabaseServer();

    // Check if post exists and user owns it
    const { data: existingPost, error: fetchError } = await supabase
      .from('posts')
      .select('*')
      .eq('id', id)
      .single();

    if (fetchError || !existingPost) {
      return NextResponse.json(
        { success: false, error: 'Post not found' },
        { status: 404 }
      );
    }

    if (existingPost.author_id !== user.id) {
      return NextResponse.json(
        { success: false, error: 'Forbidden: You can only edit your own posts' },
        { status: 403 }
      );
    }

    // Validate input
    const validation = validatePost(body);
    if (!validation.valid) {
      return NextResponse.json(
        { success: false, error: 'Validation failed', errors: validation.errors },
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .from('posts')
      .update({
        title: body.title || existingPost.title,
        content: body.content || existingPost.content,
        excerpt: body.excerpt !== undefined ? body.excerpt : existingPost.excerpt,
        featured_image: body.featured_image !== undefined ? body.featured_image : existingPost.featured_image,
        tags: body.tags || existingPost.tags,
        status: body.status || existingPost.status,
        updated_at: new Date().toISOString(),
        published_at: body.status === 'published' && !existingPost.published_at 
          ? new Date().toISOString() 
          : existingPost.published_at,
      })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ success: true, data: formatPost(data) });
  } catch (error: any) {
    console.error('[v0] PUT /api/posts/[id] error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to update post' },
      { status: 500 }
    );
  }
}

// DELETE /api/posts/[id] - Delete a post
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getAuthUser(request);
    if (!user) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { id } = await params;
    const supabase = getSupabaseServer();

    // Check if post exists and user owns it
    const { data: existingPost, error: fetchError } = await supabase
      .from('posts')
      .select('*')
      .eq('id', id)
      .single();

    if (fetchError || !existingPost) {
      return NextResponse.json(
        { success: false, error: 'Post not found' },
        { status: 404 }
      );
    }

    if (existingPost.author_id !== user.id) {
      return NextResponse.json(
        { success: false, error: 'Forbidden: You can only delete your own posts' },
        { status: 403 }
      );
    }

    const { error } = await supabase
      .from('posts')
      .delete()
      .eq('id', id);

    if (error) throw error;

    return NextResponse.json({ success: true, message: 'Post deleted successfully' });
  } catch (error: any) {
    console.error('[v0] DELETE /api/posts/[id] error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to delete post' },
      { status: 500 }
    );
  }
}
