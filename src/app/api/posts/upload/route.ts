import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';

// POST /api/posts/upload - Upload image for post
export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json(
        { success: false, error: 'No file provided' },
        { status: 400 }
      );
    }

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { success: false, error: 'Invalid file type. Only images are allowed.' },
        { status: 400 }
      );
    }

    // Validate file size (max 5MB)
    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      return NextResponse.json(
        { success: false, error: 'File too large. Maximum 5MB allowed.' },
        { status: 400 }
      );
    }

    // For now, return a placeholder URL. In production, upload to Cloudinary or similar
    const fileName = `${user.id}-${Date.now()}-${file.name}`;
    const fileUrl = `/uploads/${fileName}`;

    // TODO: Implement actual file upload to Cloudinary or Vercel Blob
    // For production, use:
    // - Cloudinary: Upload via their API
    // - Vercel Blob: Use @vercel/blob
    // - Supabase Storage: Use supabase.storage

    return NextResponse.json({
      success: true,
      data: {
        url: fileUrl,
        fileName,
        size: file.size,
      },
    });
  } catch (error: any) {
    console.error('[v0] POST /api/posts/upload error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Upload failed' },
      { status: 500 }
    );
  }
}
