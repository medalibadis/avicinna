import { NextRequest, NextResponse } from 'next/server';
import { syncArticleToWordPress, checkWordPressStatus } from '@/lib/wordpress';

export async function GET() {
  const status = await checkWordPressStatus();
  return NextResponse.json(status);
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const result = await syncArticleToWordPress(body);
    if (!result.success) {
      return NextResponse.json({ success: false, error: result.error }, { status: 502 });
    }
    return NextResponse.json({ success: true, data: result.data });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
