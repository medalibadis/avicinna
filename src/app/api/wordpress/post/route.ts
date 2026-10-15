import { NextRequest, NextResponse } from 'next/server';
import { syncArticleToWordPress, checkWordPressStatus } from '@/lib/wordpress';

export async function GET() {
  try {
    const status = await checkWordPressStatus();
    return NextResponse.json(status);
  } catch (error: any) {
    return NextResponse.json(
      {
        online: false,
        error: error?.message || 'WordPress connection check failed',
      },
      { status: 200 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const raw = await req.text();
    // 200KB max payload
    if (raw.length > 204800) {
      return NextResponse.json(
        { success: false, error: 'Payload too large. Maximum article size is 200KB.' },
        { status: 413 }
      );
    }

    let body: any;
    try {
      body = JSON.parse(raw);
    } catch {
      return NextResponse.json(
        { success: false, error: 'Invalid JSON payload' },
        { status: 400 }
      );
    }

    if (!body || typeof body !== 'object' || Array.isArray(body)) {
      return NextResponse.json(
        { success: false, error: 'Expected JSON object in request body' },
        { status: 400 }
      );
    }

    // Prototype pollution prevention
    const dangerousKeys = ['__proto__', 'constructor', 'prototype'];
    for (const key of Object.keys(body)) {
      if (dangerousKeys.includes(key)) {
        return NextResponse.json(
          { success: false, error: 'Invalid property key in payload' },
          { status: 400 }
        );
      }
    }

    if (!body.title || typeof body.title !== 'string') {
      return NextResponse.json(
        { success: false, error: 'Article title is required' },
        { status: 400 }
      );
    }

    const result = await syncArticleToWordPress(body);
    if (!result.success) {
      return NextResponse.json(
        { success: false, error: result.error || 'WordPress sync failed' },
        { status: 502 }
      );
    }

    return NextResponse.json({ success: true, data: result.data });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err?.message || 'Internal error handling post synchronization' },
      { status: 500 }
    );
  }
}
