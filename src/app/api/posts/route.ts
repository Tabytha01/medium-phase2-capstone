import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';
import { generateSlug, validatePost, formatPost } from '@/lib/posts';
import { PostStatus } from '@/types/post';

// GET /api/posts - List all posts with pagination and filters
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = Math.max(1, parseInt(searchParams.get('page') || '1'));
    const limit = Math.min(50, parseInt(searchParams.get('limit') || '10'));
    const status = (searchParams.get('status') as PostStatus) || 'PUBLISHED';
    const authorId = searchParams.get('authorId');
    const search = searchParams.get('search');
    const tag = searchParams.get('tag');

    const skip = (page - 1) * limit;

    const where: any = {
      status: status,
    };

    if (authorId) {
      where.authorId = authorId;
    }

    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { content: { contains: search, mode: 'insensitive' } },
        { excerpt: { contains: search, mode: 'insensitive' } },
      ];
    }

    if (tag) {
      where.PostTag = {
        some: {
          Tag: {
            slug: tag,
          },
        },
      };
    }

    const [posts, total] = await Promise.all([
      prisma.post.findMany({
        where,
        include: {
          author: {
            select: {
              id: true,
              name: true,
              email: true,
              avatarUrl: true,
              bio: true,
            },
          },
          PostTag: {
            include: {
              Tag: true,
            },
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
        skip,
        take: limit,
      }),
      prisma.post.count({ where }),
    ]);

    return NextResponse.json({
      success: true,
      data: posts.map(formatPost),
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error: any) {
    console.error('[API] GET /api/posts error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to fetch posts' },
      { status: 500 }
    );
  }
}

// POST /api/posts - Create a new post
export async function POST(request: NextRequest) {
  try {
    console.log('POST /api/posts called');
    const user = await getCurrentUser();
    console.log('Current user:', user);
    if (!user) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const validation = validatePost(body);

    if (!validation.valid) {
      return NextResponse.json(
        { success: false, error: 'Validation failed', errors: validation.errors },
        { status: 400 }
      );
    }

    const { title, content, excerpt, coverImage, tags, status } = validation.data!;
    const slug = generateSlug(title);

    // Handle tags creation/connection
    const tagConnectOrCreate = tags?.map((tagName) => {
        const tagSlug = tagName.toLowerCase().replace(/[^a-z0-9-]/g, '-');
        return {
            where: { slug: tagSlug },
            create: { name: tagName, slug: tagSlug },
        };
    });

    const post = await prisma.post.create({
      data: {
        title,
        slug,
        content,
        excerpt,
        coverImage,
        status: (status as PostStatus) || 'DRAFT',
        publishedAt: status === 'PUBLISHED' ? new Date() : null,
        authorId: user.id,
        PostTag: tagConnectOrCreate ? {
            create: tagConnectOrCreate.map(t => ({
                Tag: {
                    connectOrCreate: t
                }
            }))
        } : undefined
      },
      include: {
        author: true,
        PostTag: {
          include: {
            Tag: true
          }
        }
      }
    });

    return NextResponse.json(
      { success: true, data: formatPost(post) },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('[API] POST /api/posts error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to create post' },
      { status: 500 }
    );
  }
}
