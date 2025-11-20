import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';

export async function POST(
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

    const targetUserId = params.id;

    if (user.id === targetUserId) {
        return NextResponse.json(
            { success: false, error: 'You cannot follow yourself' },
            { status: 400 }
        );
    }

    const existingFollow = await prisma.follow.findUnique({
        where: {
            followerId_followingId: {
                followerId: user.id,
                followingId: targetUserId
            }
        }
    });

    if (existingFollow) {
        // Unfollow
        await prisma.follow.delete({
            where: { id: existingFollow.id }
        });
        return NextResponse.json({ success: true, following: false });
    } else {
        // Follow
        await prisma.follow.create({
            data: {
                followerId: user.id,
                followingId: targetUserId
            }
        });
        return NextResponse.json({ success: true, following: true });
    }

  } catch (error: any) {
    console.error('[API] POST /api/users/[id]/follow error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to update follow status' },
      { status: 500 }
    );
  }
}
