import { NextRequest, NextResponse } from 'next/server';

export async function DELETE(
  request: NextRequest,
  props: { params: Promise<{ id: string }> }
) {
  const params = await props.params;
  try {
    // Mock delete - not implemented with file storage
    return NextResponse.json({ success: true, message: 'Comment deleted' });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: 'Failed to delete comment' },
      { status: 500 }
    );
  }
}
