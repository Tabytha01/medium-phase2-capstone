import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';

// GET /api/reactions - Get reactions for a post
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const postId = searchParams.get('postId');

    if (!postId) {
      return NextResponse.json(
        { success: false, error: 'Post ID is required' },
        { status: 400 }
      );
    }

    const user = await getCurrentUser();
    
    const [reactions, userReaction] = await Promise.all([
      prisma.reaction.findMany({
        where: { postId },
        include: {
          User: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      }),
      user ? prisma.reaction.findFirst({
        where: {
          postId,
          userId: user.id,
        },
      }) : null,
    ]);

    return NextResponse.json({
      success: true,
      data: {
        reactions,
        userReaction,
      },
    });
  } catch (error: any) {
    console.error('[API] GET /api/reactions error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to fetch reactions' },
      { status: 500 }
    );
  }
}

// POST /api/reactions - Toggle a reaction
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
    const { postId, type } = body;

    if (!postId || !type) {
      return NextResponse.json(
        { success: false, error: 'Post ID and reaction type are required' },
        { status: 400 }
      );
    }

    if (!['CLAP', 'LIKE'].includes(type)) {
      return NextResponse.json(
        { success: false, error: 'Invalid reaction type' },
        { status: 400 }
      );
    }

    // Verify post exists
    const post = await prisma.post.findUnique({
      where: { id: postId },
    });

    if (!post) {
      return NextResponse.json(
        { success: false, error: 'Post not found' },
        { status: 404 }
      );
    }

    // Check if user already has a reaction on this post
    const existingReaction = await prisma.reaction.findFirst({
      where: {
        postId,
        userId: user.id,
      },
    });

    let reaction;

    if (existingReaction) {
      if (existingReaction.type === type) {
        // Same reaction type - remove it
        await prisma.reaction.delete({
          where: { id: existingReaction.id },
        });
        
        return NextResponse.json({
          success: true,
          data: { removed: true },
        });
      } else {
        // Different reaction type - update it
        reaction = await prisma.reaction.update({
          where: { id: existingReaction.id },
          data: { type },
        });
      }
    } else {
      // No existing reaction - create new one
      reaction = await prisma.reaction.create({
        data: {
          id: `${type}_${postId}_${user.id}`,
          type,
          postId,
          userId: user.id,
        },
      });
    }

    return NextResponse.json({
      success: true,
      data: reaction,
    });
  } catch (error: any) {
    console.error('[API] POST /api/reactions error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to toggle reaction' },
      { status: 500 }
    );
  }
}