import { NextRequest, NextResponse } from 'next/server';
import { loadFollows, saveFollows } from '@/lib/dataStorage';

interface RouteParams {
  params: Promise<{
    id: string;
  }>;
}

export async function POST(request: NextRequest, { params }: RouteParams) {
  try {
    const { id: targetUserId } = await params;
    const userId = request.headers.get('x-user-id');

    if (!userId) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    if (userId === targetUserId) {
      return NextResponse.json(
        { success: false, error: 'Cannot follow yourself' },
        { status: 400 }
      );
    }

    const follows = loadFollows();
    const existingIndex = follows.findIndex(f => 
      f.followerId === userId && f.followingId === targetUserId
    );

    if (existingIndex > -1) {
      // Unfollow
      follows.splice(existingIndex, 1);
      saveFollows(follows);
      return NextResponse.json({ success: true, data: { following: false } });
    } else {
      // Follow
      follows.push({
        id: `follow_${Date.now()}`,
        followerId: userId,
        followingId: targetUserId,
        createdAt: new Date().toISOString(),
      });
      saveFollows(follows);
      return NextResponse.json({ success: true, data: { following: true } });
    }
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: 'Failed to toggle follow' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { id: targetUserId } = await params;
    const userId = request.headers.get('x-user-id');

    if (!userId) {
      return NextResponse.json({ success: true, data: { following: false } });
    }

    const follows = loadFollows();
    const isFollowing = follows.some(f => 
      f.followerId === userId && f.followingId === targetUserId
    );

    return NextResponse.json({ success: true, data: { following: isFollowing } });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: 'Failed to get follow status' },
      { status: 500 }
    );
  }
}