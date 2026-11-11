import { NextResponse } from 'next/server';
import { requireApiAuth } from '@/lib/serverAuth';
import {
  appendActivityLog,
  hashPassword,
  readCmsStore,
  sanitizeUser,
  updateCmsStore,
} from '@/lib/cmsStore';
import { getClientIp } from '@/lib/rateLimit';
import type { AdminRole, AdminUserRecord } from '@/types/cms';

export async function GET(request: Request) {
  const url = new URL(request.url);
  const onlyCoordinators = url.searchParams.get('coordinators') === 'true';

  if (onlyCoordinators) {
    const auth = await requireApiAuth(request, ['admin', 'coordinator']);
    if (!auth.ok) return auth.response;
    const store = readCmsStore();
    const assignees = store.users
      .filter((u) => u.isActive && (u.role === 'coordinator' || u.role === 'admin'))
      .map((u) => ({ id: u.id, username: u.username, fullName: u.fullName, role: u.role }));
    return NextResponse.json({ users: assignees });
  }

  const auth = await requireApiAuth(request, ['admin']);
  if (!auth.ok) return auth.response;

  const store = readCmsStore();
  return NextResponse.json({
    users: store.users.map(sanitizeUser),
  });
}

export async function POST(request: Request) {
  const auth = await requireApiAuth(request, ['admin']);
  if (!auth.ok) return auth.response;

  const clientIp = getClientIp(request);
  try {
    const body = await request.json();
    const username = String(body.username || '').trim().toLowerCase();
    const email = String(body.email || '').trim().toLowerCase();
    const fullName = String(body.fullName || '').trim();
    const password = String(body.password || '');
    const role = (body.role as AdminRole) || 'editor';

    if (!username || !email || !fullName || password.length < 8) {
      return NextResponse.json(
        { error: 'Username, email, full name, and password (min 8 chars) are required' },
        { status: 400 }
      );
    }

    if (!['admin', 'editor', 'coordinator'].includes(role)) {
      return NextResponse.json({ error: 'Invalid role' }, { status: 400 });
    }

    const store = readCmsStore();
    const duplicate = store.users.find(
      (u) => u.username.toLowerCase() === username || u.email.toLowerCase() === email
    );
    if (duplicate) {
      return NextResponse.json({ error: 'Username or email already exists' }, { status: 409 });
    }

    const now = new Date().toISOString();
    const newUser: AdminUserRecord = {
      id: `usr-${Date.now()}`,
      username,
      email,
      fullName,
      role,
      passwordHash: hashPassword(password),
      totpEnabled: false,
      isActive: true,
      tokenVersion: 1,
      createdAt: now,
      updatedAt: now,
    };

    updateCmsStore((state) => ({
      ...state,
      users: [...state.users, newUser],
    }));

    appendActivityLog({
      actorId: auth.session.userId,
      actorUsername: auth.session.username,
      actorRole: auth.session.role,
      action: 'user_created',
      targetType: 'user',
      targetId: newUser.id,
      details: `Created user ${newUser.username} (${newUser.role})`,
      ipAddress: clientIp,
    });

    return NextResponse.json({ success: true, user: sanitizeUser(newUser) });
  } catch (err) {
    console.error('[api/users POST]:', err);
    return NextResponse.json({ error: 'Failed to create user' }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  const auth = await requireApiAuth(request, ['admin']);
  if (!auth.ok) return auth.response;

  const clientIp = getClientIp(request);
  try {
    const body = await request.json();
    const id = String(body.id || '');
    if (!id) {
      return NextResponse.json({ error: 'User ID required' }, { status: 400 });
    }

    const store = readCmsStore();
    const existing = store.users.find((u) => u.id === id);
    if (!existing) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Prevent disabling or demoting the last active admin
    const activeAdmins = store.users.filter((u) => u.isActive && u.role === 'admin');
    if (
      existing.role === 'admin' &&
      activeAdmins.length <= 1 &&
      (body.isActive === false || (body.role && body.role !== 'admin'))
    ) {
      return NextResponse.json(
        { error: 'Cannot disable or demote the last active administrator' },
        { status: 400 }
      );
    }

    const nextRole: AdminRole =
      body.role && ['admin', 'editor', 'coordinator'].includes(body.role)
        ? body.role
        : existing.role;
    const nextIsActive = typeof body.isActive === 'boolean' ? body.isActive : existing.isActive;
    const nextFullName = body.fullName ? String(body.fullName).trim() : existing.fullName;
    const nextEmail = body.email ? String(body.email).trim().toLowerCase() : existing.email;
    const resetPassword = body.newPassword ? String(body.newPassword) : '';
    const reset2fa = Boolean(body.reset2fa);

    if (resetPassword && resetPassword.length < 8) {
      return NextResponse.json({ error: 'New password must be at least 8 characters' }, { status: 400 });
    }

    const shouldBumpToken =
      nextRole !== existing.role || !nextIsActive || Boolean(resetPassword);

    const updatedUser: AdminUserRecord = {
      ...existing,
      role: nextRole,
      isActive: nextIsActive,
      fullName: nextFullName,
      email: nextEmail,
      passwordHash: resetPassword ? hashPassword(resetPassword) : existing.passwordHash,
      totpEnabled: reset2fa ? false : existing.totpEnabled,
      totpSecret: reset2fa ? undefined : existing.totpSecret,
      tokenVersion: shouldBumpToken ? existing.tokenVersion + 1 : existing.tokenVersion,
      updatedAt: new Date().toISOString(),
    };

    updateCmsStore((state) => ({
      ...state,
      users: state.users.map((u) => (u.id === id ? updatedUser : u)),
    }));

    appendActivityLog({
      actorId: auth.session.userId,
      actorUsername: auth.session.username,
      actorRole: auth.session.role,
      action: 'user_updated',
      targetType: 'user',
      targetId: id,
      details: `Updated ${updatedUser.username} (role=${nextRole}, active=${nextIsActive}${resetPassword ? ', password reset' : ''}${reset2fa ? ', 2FA reset' : ''})`,
      ipAddress: clientIp,
    });

    return NextResponse.json({ success: true, user: sanitizeUser(updatedUser) });
  } catch (err) {
    console.error('[api/users PATCH]:', err);
    return NextResponse.json({ error: 'Failed to update user' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  const auth = await requireApiAuth(request, ['admin']);
  if (!auth.ok) return auth.response;

  const clientIp = getClientIp(request);
  const url = new URL(request.url);
  const id = url.searchParams.get('id') || '';
  if (!id) {
    return NextResponse.json({ error: 'User ID required' }, { status: 400 });
  }

  if (id === auth.session.userId) {
    return NextResponse.json({ error: 'Cannot delete your own active account' }, { status: 400 });
  }

  const store = readCmsStore();
  const target = store.users.find((u) => u.id === id);
  if (!target) {
    return NextResponse.json({ error: 'User not found' }, { status: 404 });
  }

  const activeAdmins = store.users.filter((u) => u.isActive && u.role === 'admin' && u.id !== id);
  if (target.role === 'admin' && activeAdmins.length === 0) {
    return NextResponse.json({ error: 'Cannot delete the last administrator' }, { status: 400 });
  }

  updateCmsStore((state) => ({
    ...state,
    users: state.users.filter((u) => u.id !== id),
  }));

  appendActivityLog({
    actorId: auth.session.userId,
    actorUsername: auth.session.username,
    actorRole: auth.session.role,
    action: 'user_deleted',
    targetType: 'user',
    targetId: id,
    details: `Removed user ${target.username} (${target.role})`,
    ipAddress: clientIp,
  });

  return NextResponse.json({ success: true });
}

