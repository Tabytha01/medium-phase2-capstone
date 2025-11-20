import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';
import { validatePost, formatPost } from '@/lib/posts';
import { PostStatus } from '@/types/post';

// GET /api/posts/[id] - Get a single post by ID or Slug
export async function GET(
  request: NextRequest,
  props: { params: Promise<{ id: string }> }
) {
  const params = await props.params;
  try {
    const { id } = params;

    const post = await prisma.post.findFirst({
      where: {
        OR: [
          { id: id },
          { slug: id }
        ]
      },
      include: {
        author: {
            select: {
                id: true,
                name: true,
                email: true,
                avatarUrl: true,
                bio: true
            }
        },
        PostTag: {
          include: {
            Tag: true,
          },
        },
      },
    });

    if (!post) {
      return NextResponse.json(
        { success: false, error: 'Post not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: formatPost(post) });
  } catch (error: any) {
    console.error('[API] GET /api/posts/[id] error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch post' },
      { status: 500 }
    );
  }
}

// PUT /api/posts/[id] - Update a post
export async function PUT(
  request: NextRequest,
  props: { params: Promise<{ id: string }> }
) {
  const params = await props.params;
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { id } = params;
    const body = await request.json();

    // Check if post exists and user owns it
    const existingPost = await prisma.post.findUnique({
      where: { id },
    });

    if (!existingPost) {
      return NextResponse.json(
        { success: false, error: 'Post not found' },
        { status: 404 }
      );
    }

    if (existingPost.authorId !== user.id) {
      return NextResponse.json(
        { success: false, error: 'Forbidden: You can only edit your own posts' },
        { status: 403 }
      );
    }

    const validation = validatePost(body);
    if (!validation.valid) {
      return NextResponse.json(
        { success: false, error: 'Validation failed', errors: validation.errors },
        { status: 400 }
      );
    }

    const { title, content, excerpt, coverImage, tags, status } = validation.data!;

    // Update tags if provided
    let postTagUpdate = undefined;
    if (tags) {
        // First delete existing connections
        await prisma.postTag.deleteMany({
            where: { postId: id }
        });
        
        // Then create new ones
        postTagUpdate = {
            create: tags.map((tagName) => {
                const tagSlug = tagName.toLowerCase().replace(/[^a-z0-9-]/g, '-');
                return {
                    Tag: {
                        connectOrCreate: {
                            where: { slug: tagSlug },
                            create: { name: tagName, slug: tagSlug }
                        }
                    }
                };
            })
        };
    }

    const updatedPost = await prisma.post.update({
      where: { id },
      data: {
        title,
        content,
        excerpt,
        coverImage,
        status: (status as PostStatus),
        updatedAt: new Date(),
        publishedAt: status === 'PUBLISHED' && !existingPost.publishedAt 
          ? new Date() 
          : existingPost.publishedAt,
        PostTag: postTagUpdate
      },
      include: {
        author: true,
        PostTag: {
            include: {
                Tag: true
            }
        }
      },
    });

    return NextResponse.json({ success: true, data: formatPost(updatedPost) });
  } catch (error: any) {
    console.error('[API] PUT /api/posts/[id] error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to update post' },
      { status: 500 }
    );
  }
}

// DELETE /api/posts/[id] - Delete a post
export async function DELETE(
  request: NextRequest,
  props: { params: Promise<{ id: string }> }
) {
  const params = await props.params;
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { id } = params;

    const existingPost = await prisma.post.findUnique({
      where: { id },
    });

    if (!existingPost) {
      return NextResponse.json(
        { success: false, error: 'Post not found' },
        { status: 404 }
      );
    }

    if (existingPost.authorId !== user.id) {
      return NextResponse.json(
        { success: false, error: 'Forbidden: You can only delete your own posts' },
        { status: 403 }
      );
    }

    await prisma.post.delete({
      where: { id },
    });

    return NextResponse.json({ success: true, message: 'Post deleted successfully' });
  } catch (error: any) {
    console.error('[API] DELETE /api/posts/[id] error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to delete post' },
      { status: 500 }
    );
  }
}
