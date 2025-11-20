import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';
import { ReactionType } from '@prisma/client';

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
            { success: false, error: 'postId and type are required' },
            { status: 400 }
        );
    }

    // Check if reaction exists
    const existingReaction = await prisma.reaction.findUnique({
        where: {
            type_postId_userId: {
                postId,
                userId: user.id,
                type: type as ReactionType
            }
        }
    });

    if (existingReaction) {
        // Toggle off
        await prisma.reaction.delete({
            where: { id: existingReaction.id }
        });
        return NextResponse.json({ success: true, active: false });
    } else {
        // Toggle on
        await prisma.reaction.create({
            data: {
                id: crypto.randomUUID(),
                postId,
                userId: user.id,
                type: type as ReactionType
            }
        });
        return NextResponse.json({ success: true, active: true });
    }

  } catch (error: any) {
    console.error('[API] POST /api/reactions error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to update reaction' },
      { status: 500 }
    );
  }
}

// GET /api/reactions?postId=...
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
        const [likes, claps, userReaction] = await Promise.all([
            prisma.reaction.count({ where: { postId, type: 'LIKE' } }),
            prisma.reaction.count({ where: { postId, type: 'CLAP' } }),
            // Since we can't easily get current user in GET without session,
            // we might skip userReaction here or require auth.
            // For public view, just counts are enough.
             Promise.resolve(null)
        ]);

        // If user is logged in, we could check their reaction, but that requires async headers/session check
        // For now return counts
        return NextResponse.json({ 
            success: true, 
            data: { 
                likes, 
                claps 
            } 
        });

    } catch (error: any) {
         return NextResponse.json(
            { success: false, error: 'Failed to fetch reactions' },
            { status: 500 }
        );
    }
}
