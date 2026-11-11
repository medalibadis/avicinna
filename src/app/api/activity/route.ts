import { NextResponse } from 'next/server';
import { requireApiAuth } from '@/lib/serverAuth';
import { readCmsStore } from '@/lib/cmsStore';

export async function GET(request: Request) {
  const auth = await requireApiAuth(request, ['admin']);
  if (!auth.ok) return auth.response;

  const url = new URL(request.url);
  const limit = Math.min(500, Math.max(10, Number(url.searchParams.get('limit') || 150)));
  const actionFilter = (url.searchParams.get('action') || '').trim().toLowerCase();

  const store = readCmsStore();
  const filtered = store.activityLogs
    .filter((log) => !actionFilter || log.action.toLowerCase().includes(actionFilter))
    .slice(0, limit);

  return NextResponse.json({ logs: filtered });
}

