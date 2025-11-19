import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseServer, getAuthUser } from '@/lib/db';
import { generateSlug, validatePost, formatPost } from '@/lib/posts';
import { Post, PaginationQuery } from '@/types/post';

// GET /api/posts - List all posts with pagination and filters
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = Math.max(1, parseInt(searchParams.get('page') || '1'));
    const limit = Math.min(50, parseInt(searchParams.get('limit') || '10'));
    const status = searchParams.get('status') || 'published';
    const author_id = searchParams.get('author_id');
    const search = searchParams.get('search');

    const supabase = getSupabaseServer();
    const offset = (page - 1) * limit;

    let query = supabase
      .from('posts')
      .select('*', { count: 'exact' })
      .order('created_at', { ascending: false });

    // Filter by status
    if (status) {
      query = query.eq('status', status);
    }

    // Filter by author
    if (author_id) {
      query = query.eq('author_id', author_id);
    }

    // Search in title and excerpt
    if (search) {
      query = query.or(`title.ilike.%${search}%,excerpt.ilike.%${search}%`);
    }

    // Apply pagination
    const { data, error, count } = await query
      .range(offset, offset + limit - 1);

    if (error) throw error;

    return NextResponse.json({
      success: true,
      data: data.map(formatPost),
      pagination: {
        page,
        limit,
        total: count || 0,
        pages: Math.ceil((count || 0) / limit),
      },
    });
  } catch (error: any) {
    console.error('[v0] GET /api/posts error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to fetch posts' },
      { status: 500 }
    );
  }
}

// POST /api/posts - Create a new post
export async function POST(request: NextRequest) {
  try {
    const user = await getAuthUser(request);
    if (!user) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { title, content, excerpt, featured_image, tags, status } = body;

    // Validate input
    const validation = validatePost({ title, content, excerpt, featured_image, tags });
    if (!validation.valid) {
      return NextResponse.json(
        { success: false, error: 'Validation failed', errors: validation.errors },
        { status: 400 }
      );
    }

    const slug = generateSlug(title);
    const supabase = getSupabaseServer();

    const { data, error } = await supabase
      .from('posts')
      .insert([
        {
          title,
          slug,
          content,
          excerpt: excerpt || null,
          featured_image: featured_image || null,
          tags: tags || [],
          status: status || 'draft',
          author_id: user.id,
          published_at: status === 'published' ? new Date().toISOString() : null,
        },
      ])
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json(
      { success: true, data: formatPost(data) },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('[v0] POST /api/posts error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to create post' },
      { status: 500 }
    );
  }
}
