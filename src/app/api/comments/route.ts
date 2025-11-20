import { NextRequest, NextResponse } from 'next/server';
import { loadComments, saveComments } from '@/lib/dataStorage';

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

    const allComments = loadComments();
    const postComments = allComments.filter(comment => 
      comment.postId === postId && !comment.parentId
    );

    // Add replies to each comment
    const commentsWithReplies = postComments.map(comment => ({
      ...comment,
      replies: allComments.filter(reply => reply.parentId === comment.id)
    }));

    return NextResponse.json({
      success: true,
      data: commentsWithReplies,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: 'Failed to fetch comments' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { content, postId, parentId } = body;
    const userId = request.headers.get('x-user-id');
    const userName = request.headers.get('x-user-name');

    if (!content || !postId || !userId) {
      return NextResponse.json(
        { success: false, error: 'Content, post ID, and user ID are required' },
        { status: 400 }
      );
    }

    const comment = {
      id: `comment_${Date.now()}`,
      content,
      postId,
      parentId: parentId || null,
      createdAt: new Date().toISOString(),
      author: {
        id: userId,
        name: userName || 'User',
        avatarUrl: null,
      },
    };

    const comments = loadComments();
    comments.push(comment);
    saveComments(comments);

    return NextResponse.json(
      { success: true, data: comment },
      { status: 201 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: 'Failed to create comment' },
      { status: 500 }
    );
  }
}