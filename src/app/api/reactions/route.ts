import { NextRequest, NextResponse } from 'next/server';
import { loadReactions, saveReactions } from '@/lib/dataStorage';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const postId = searchParams.get('postId');
    const userId = request.headers.get('x-user-id');

    if (!postId) {
      return NextResponse.json(
        { success: false, error: 'Post ID is required' },
        { status: 400 }
      );
    }

    const allReactions = loadReactions();
    const postReactions = allReactions.filter(reaction => reaction.postId === postId);
    const userReaction = userId ? postReactions.find(reaction => reaction.userId === userId) : null;

    return NextResponse.json({
      success: true,
      data: {
        reactions: postReactions,
        userReaction,
      },
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: 'Failed to fetch reactions' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { postId, type } = body;
    const userId = request.headers.get('x-user-id');

    if (!postId || !type || !userId) {
      return NextResponse.json(
        { success: false, error: 'Post ID, type, and user ID are required' },
        { status: 400 }
      );
    }

    const reactions = loadReactions();
    const existingIndex = reactions.findIndex(r => r.postId === postId && r.userId === userId);

    if (existingIndex > -1) {
      if (reactions[existingIndex].type === type) {
        // Remove reaction
        reactions.splice(existingIndex, 1);
        saveReactions(reactions);
        return NextResponse.json({ success: true, data: { removed: true } });
      } else {
        // Update reaction type
        reactions[existingIndex].type = type;
      }
    } else {
      // Add new reaction
      reactions.push({
        id: `reaction_${Date.now()}`,
        type,
        postId,
        userId,
        createdAt: new Date().toISOString(),
      });
    }

    saveReactions(reactions);
    return NextResponse.json({ success: true, data: { type } });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: 'Failed to toggle reaction' },
      { status: 500 }
    );
  }
}