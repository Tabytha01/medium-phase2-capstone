import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';

// GET /api/comments?postId=...
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const postId = searchParams.get('postId');

  if (!postId) {
    return NextResponse.json(
      { success: false, error: 'postId is required' },
      { status: 400 }
    );
  }

  try {
    const comments = await prisma.comment.findMany({
      where: { postId, parentId: null }, // Fetch top-level comments
      include: {
        author: {
            select: {
                id: true,
                name: true,
                avatarUrl: true
            }
        },
        replies: {
            include: {
                author: {
                    select: {
                        id: true,
                        name: true,
                        avatarUrl: true
                    }
                }
            },
            orderBy: {
                createdAt: 'asc'
            }
        }
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    // Map avatarUrl to image for consistency
    const formattedComments = comments.map((comment: any) => ({
        ...comment,
        author: {
            ...comment.author,
            image: comment.author.avatarUrl || comment.author.image
        },
        replies: comment.replies.map((reply: any) => ({
            ...reply,
            author: {
                ...reply.author,
                image: reply.author.avatarUrl || reply.author.image
            }
        }))
    }));

    return NextResponse.json({ success: true, data: formattedComments });
  } catch (error: any) {
    console.error('[API] GET /api/comments error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch comments' },
      { status: 500 }
    );
  }
}

// POST /api/comments - Create a comment
export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { content, postId, parentId } = body;

    if (!content || !postId) {
        return NextResponse.json(
            { success: false, error: 'Content and postId are required' },
            { status: 400 }
        );
    }

    const comment = await prisma.comment.create({
      data: {
        content,
        postId,
        parentId: parentId || null,
        authorId: user.id,
      },
      include: {
        author: {
            select: {
                id: true,
                name: true,
                avatarUrl: true
            }
        }
      }
    });

    const formattedComment = {
        ...comment,
        author: {
            ...comment.author,
            image: comment.author.avatarUrl
        },
        replies: []
    };

    return NextResponse.json({ success: true, data: formattedComment }, { status: 201 });
  } catch (error: any) {
    console.error('[API] POST /api/comments error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to create comment' },
      { status: 500 }
    );
  }
}
