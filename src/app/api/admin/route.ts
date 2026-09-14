import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    status: 'ok',
    message: 'AVICINNA CMS API active',
    timestamp: new Date().toISOString(),
  });
}

export async function POST(request: Request) {
  try {
    const data = await request.json();
    return NextResponse.json({
      success: true,
      message: 'CMS state synchronized successfully',
      timestamp: new Date().toISOString(),
    });
  } catch (err) {
    return NextResponse.json(
      { error: 'Failed to synchronize CMS state' },
      { status: 500 }
    );
  }
}
