import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import {
  extractTokenFromRequest,
  verifyAdminSessionToken,
  type AdminSessionPayload,
} from '@/lib/auth';
import { findUserById } from '@/lib/cmsStore';
import type { AdminRole } from '@/types/cms';

export async function getAuthenticatedSessionFromCookies(): Promise<AdminSessionPayload | null> {
  const cookieStore = await cookies();
  const token =
    cookieStore.get('avicinna_admin_session')?.value ||
    cookieStore.get('avicinna_session')?.value;

  const payload = await verifyAdminSessionToken(token);
  if (!payload) return null;

  const user = findUserById(payload.userId);
  if (!user || !user.isActive || user.tokenVersion !== payload.tokenVersion) {
    return null;
  }

  return {
    ...payload,
    role: user.role,
    username: user.username,
    fullName: user.fullName,
  };
}

export async function requireApiAuth(
  request: Request,
  allowedRoles?: AdminRole[]
): Promise<
  | { ok: true; session: AdminSessionPayload }
  | { ok: false; response: NextResponse }
> {
  const token = extractTokenFromRequest(request);
  const payload = await verifyAdminSessionToken(token);
  if (!payload) {
    return {
      ok: false,
      response: NextResponse.json({ error: 'Unauthorized: authentication required' }, { status: 401 }),
    };
  }

  const user = findUserById(payload.userId);
  if (!user || !user.isActive || user.tokenVersion !== payload.tokenVersion) {
    return {
      ok: false,
      response: NextResponse.json({ error: 'Session invalidated or account inactive' }, { status: 401 }),
    };
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return {
      ok: false,
      response: NextResponse.json(
        { error: `Forbidden: requires role [${allowedRoles.join(', ')}]` },
        { status: 403 }
      ),
    };
  }

  return {
    ok: true,
    session: {
      ...payload,
      role: user.role,
      username: user.username,
      fullName: user.fullName,
    },
  };
}

