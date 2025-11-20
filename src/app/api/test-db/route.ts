import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // Mock database test - using file storage
    return NextResponse.json({ 
      success: true, 
      message: 'File storage connected',
      userCount: 0
    });
  } catch (error: any) {
    return NextResponse.json({ 
      success: false, 
      error: error.message 
    }, { status: 500 });
  }
}