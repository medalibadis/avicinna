import { NextResponse } from 'next/server';
import { requireApiAuth } from '@/lib/serverAuth';

export async function GET(req: Request) {
  const auth = await requireApiAuth(req);
  if (!auth.ok) return auth.response;

  return NextResponse.json({
    status: 'ok',
    message: 'AVICINNA CMS API active',
    user: auth.session.username,
    role: auth.session.role,
    timestamp: new Date().toISOString(),
  });
}

export async function POST(req: Request) {
  const auth = await requireApiAuth(req, ['admin', 'editor']);
  if (!auth.ok) return auth.response;

  return NextResponse.json({
    success: true,
    message: 'CMS state verified',
    timestamp: new Date().toISOString(),
  });
}
