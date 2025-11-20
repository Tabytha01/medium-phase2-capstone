import { NextRequest, NextResponse } from 'next/server';
import { PostStatus } from '@/types/post';
import { loadPosts, addPost } from '@/lib/fileStorage';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status') || 'PUBLISHED';
    
    const allPosts = loadPosts();
    const filteredPosts = allPosts.filter(post => post.status === status);
    
    return NextResponse.json({
      success: true,
      data: filteredPosts,
      pagination: {
        page: 1,
        limit: 10,
        total: filteredPosts.length,
        pages: 1,
      },
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: 'Failed to fetch posts' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { title, content, excerpt, coverImage, tags, status } = body;

    if (!title || !content) {
      return NextResponse.json(
        { success: false, error: 'Title and content are required' },
        { status: 400 }
      );
    }

    const userId = request.headers.get('x-user-id') || `user_${Date.now()}`;
    const userName = request.headers.get('x-user-name') || 'User';
    
    const post = {
      id: `post_${Date.now()}`,
      title,
      slug: title.toLowerCase().replace(/\s+/g, '-') + '-' + Date.now(),
      content,
      excerpt,
      coverImage,
      status: status || 'DRAFT',
      publishedAt: status === 'PUBLISHED' ? new Date().toISOString() : null,
      authorId: userId,
      author: {
        id: userId,
        name: userName,
        email: `${userName.toLowerCase()}@example.com`,
      },
      tags: tags?.map((tag: string, index: number) => ({
        id: `tag_${index}`,
        name: tag,
        slug: tag.toLowerCase(),
      })) || [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    addPost(post);

    return NextResponse.json(
      { success: true, data: post },
      { status: 201 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: 'Failed to create post' },
      { status: 500 }
    );
  }
}