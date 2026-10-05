import { NextRequest, NextResponse } from 'next/server';
import { draftMode } from 'next/headers';
import { redirect } from 'next/navigation';

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const secret = searchParams.get('secret');
  const slug = searchParams.get('slug');

  const configuredSecret = process.env.WORDPRESS_PREVIEW_SECRET || 'avicinna_wp_secure_token_change_me';

  if (!secret || secret !== configuredSecret) {
    return NextResponse.json({ message: 'Invalid preview token' }, { status: 401 });
  }

  if (!slug) {
    return NextResponse.json({ message: 'Missing slug parameter' }, { status: 400 });
  }

  // Enable Draft Mode
  const draft = await draftMode();
  draft.enable();

  // Redirect to the article path
  redirect(`/blog/${slug}`);
}
