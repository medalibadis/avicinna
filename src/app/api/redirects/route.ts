import { NextResponse } from 'next/server';
import { requireApiAuth } from '@/lib/serverAuth';
import {
  appendActivityLog,
  normalizeRedirectPath,
  readCmsStore,
  updateCmsStore,
} from '@/lib/cmsStore';
import { getClientIp } from '@/lib/rateLimit';
import type { RedirectRule } from '@/types/cms';

export async function GET(req: Request) {
  const auth = await requireApiAuth(req, ['admin', 'editor']);
  if (!auth.ok) return auth.response;

  const store = readCmsStore();
  return NextResponse.json({ redirects: store.redirects });
}

export async function POST(req: Request) {
  const auth = await requireApiAuth(req, ['admin', 'editor']);
  if (!auth.ok) return auth.response;

  try {
    const body = await req.json();
    const { fromPath, toPath, statusCode, isActive, note } = body as {
      fromPath?: string;
      toPath?: string;
      statusCode?: number;
      isActive?: boolean;
      note?: string;
    };

    if (!fromPath?.trim() || !toPath?.trim()) {
      return NextResponse.json(
        { error: 'Both source path (fromPath) and destination path (toPath) are required' },
        { status: 400 }
      );
    }

    const cleanFrom = normalizeRedirectPath(fromPath);
    const cleanTo = toPath.trim().startsWith('http')
      ? toPath.trim()
      : normalizeRedirectPath(toPath);

    if (cleanFrom.toLowerCase() === cleanTo.toLowerCase()) {
      return NextResponse.json(
        { error: 'Source and destination paths cannot be identical (redirect loop)' },
        { status: 400 }
      );
    }

    const store = readCmsStore();
    const duplicate = store.redirects.find(
      (r) => normalizeRedirectPath(r.fromPath).toLowerCase() === cleanFrom.toLowerCase()
    );
    if (duplicate) {
      return NextResponse.json(
        { error: `A redirect rule already exists for "${cleanFrom}"` },
        { status: 409 }
      );
    }

    const validCode: RedirectRule['statusCode'] =
      statusCode === 302 || statusCode === 307 || statusCode === 308 ? statusCode : 301;

    const now = new Date().toISOString();
    const newRule: RedirectRule = {
      id: `red-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      fromPath: cleanFrom,
      toPath: cleanTo,
      statusCode: validCode,
      isActive: isActive !== false,
      hits: 0,
      note: note?.trim() || undefined,
      createdAt: now,
      updatedAt: now,
    };

    updateCmsStore((state) => ({
      ...state,
      redirects: [newRule, ...state.redirects],
    }));

    appendActivityLog({
      actorId: auth.session.userId,
      actorUsername: auth.session.username,
      actorRole: auth.session.role,
      action: 'redirect_created',
      targetType: 'redirect',
      targetId: newRule.id,
      details: `Created ${newRule.statusCode} redirect: ${cleanFrom} -> ${cleanTo}`,
      ipAddress: getClientIp(req),
    });

    return NextResponse.json({ success: true, redirect: newRule }, { status: 201 });
  } catch (err) {
    console.error('[api/redirects POST]:', err);
    return NextResponse.json({ error: 'Failed to create redirect' }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  const auth = await requireApiAuth(req, ['admin', 'editor']);
  if (!auth.ok) return auth.response;

  try {
    const body = await req.json();
    const { id, fromPath, toPath, statusCode, isActive, note } = body as Partial<RedirectRule>;

    if (!id) {
      return NextResponse.json({ error: 'Redirect rule ID is required' }, { status: 400 });
    }

    const store = readCmsStore();
    const existing = store.redirects.find((r) => r.id === id);
    if (!existing) {
      return NextResponse.json({ error: 'Redirect rule not found' }, { status: 404 });
    }

    const nextFrom = fromPath ? normalizeRedirectPath(fromPath) : existing.fromPath;
    const nextTo = toPath
      ? toPath.trim().startsWith('http')
        ? toPath.trim()
        : normalizeRedirectPath(toPath)
      : existing.toPath;

    if (nextFrom.toLowerCase() === nextTo.toLowerCase()) {
      return NextResponse.json(
        { error: 'Source and destination paths cannot match (redirect loop)' },
        { status: 400 }
      );
    }

    const validCode: RedirectRule['statusCode'] =
      statusCode === 301 || statusCode === 302 || statusCode === 307 || statusCode === 308
        ? statusCode
        : existing.statusCode;

    const updated: RedirectRule = {
      ...existing,
      fromPath: nextFrom,
      toPath: nextTo,
      statusCode: validCode,
      isActive: isActive !== undefined ? Boolean(isActive) : existing.isActive,
      note: note !== undefined ? note : existing.note,
      updatedAt: new Date().toISOString(),
    };

    updateCmsStore((state) => ({
      ...state,
      redirects: state.redirects.map((r) => (r.id === id ? updated : r)),
    }));

    appendActivityLog({
      actorId: auth.session.userId,
      actorUsername: auth.session.username,
      actorRole: auth.session.role,
      action: 'redirect_updated',
      targetType: 'redirect',
      targetId: id,
      details: `Updated redirect: ${updated.fromPath} -> ${updated.toPath} (${updated.statusCode}, active=${updated.isActive})`,
      ipAddress: getClientIp(req),
    });

    return NextResponse.json({ success: true, redirect: updated });
  } catch (err) {
    console.error('[api/redirects PATCH]:', err);
    return NextResponse.json({ error: 'Failed to update redirect' }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  const auth = await requireApiAuth(req, ['admin', 'editor']);
  if (!auth.ok) return auth.response;

  try {
    const url = new URL(req.url);
    const id = url.searchParams.get('id');
    if (!id) {
      return NextResponse.json({ error: 'Redirect rule ID is required' }, { status: 400 });
    }

    const existing = readCmsStore().redirects.find((r) => r.id === id);
    if (!existing) {
      return NextResponse.json({ error: 'Redirect rule not found' }, { status: 404 });
    }

    updateCmsStore((state) => ({
      ...state,
      redirects: state.redirects.filter((r) => r.id !== id),
    }));

    appendActivityLog({
      actorId: auth.session.userId,
      actorUsername: auth.session.username,
      actorRole: auth.session.role,
      action: 'redirect_deleted',
      targetType: 'redirect',
      targetId: id,
      details: `Deleted redirect: ${existing.fromPath} -> ${existing.toPath}`,
      ipAddress: getClientIp(req),
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('[api/redirects DELETE]:', err);
    return NextResponse.json({ error: 'Failed to delete redirect' }, { status: 500 });
  }
}

