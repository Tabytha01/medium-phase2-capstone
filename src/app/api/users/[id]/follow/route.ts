import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';

interface RouteParams {
  params: {
    id: string;
  };
}

// POST /api/users/[id]/follow - Follow/unfollow a user
export async function POST(request: NextRequest, { params }: RouteParams) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { id: targetUserId } = params;

    if (user.id === targetUserId) {
      return NextResponse.json(
        { success: false, error: 'Cannot follow yourself' },
        { status: 400 }
      );
    }

    // Verify target user exists
    const targetUser = await prisma.user.findUnique({
      where: { id: targetUserId },
    });

    if (!targetUser) {
      return NextResponse.json(
        { success: false, error: 'User not found' },
        { status: 404 }
      );
    }

    // Check if already following
    const existingFollow = await prisma.follow.findUnique({
      where: {
        followerId_followingId: {
          followerId: user.id,
          followingId: targetUserId,
        },
      },
    });

    if (existingFollow) {
      // Unfollow
      await prisma.follow.delete({
        where: { id: existingFollow.id },
      });

      return NextResponse.json({
        success: true,
        data: { following: false },
      });
    } else {
      // Follow
      await prisma.follow.create({
        data: {
          followerId: user.id,
          followingId: targetUserId,
        },
      });

      return NextResponse.json({
        success: true,
        data: { following: true },
      });
    }
  } catch (error: any) {
    console.error('[API] POST /api/users/[id]/follow error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to toggle follow' },
      { status: 500 }
    );
  }
}

// GET /api/users/[id]/follow - Get follow status
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const user = await getCurrentUser();
    const { id: targetUserId } = params;

    if (!user) {
      return NextResponse.json({
        success: true,
        data: { following: false },
      });
    }

    const follow = await prisma.follow.findUnique({
      where: {
        followerId_followingId: {
          followerId: user.id,
          followingId: targetUserId,
        },
      },
    });

    return NextResponse.json({
      success: true,
      data: { following: !!follow },
    });
  } catch (error: any) {
    console.error('[API] GET /api/users/[id]/follow error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to get follow status' },
      { status: 500 }
    );
  }
}