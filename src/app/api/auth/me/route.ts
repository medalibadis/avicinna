import { NextResponse } from 'next/server';
import { requireApiAuth } from '@/lib/serverAuth';
import { createAdminSessionToken } from '@/lib/auth';
import {
  appendActivityLog,
  findUserById,
  hashPassword,
  sanitizeUser,
  updateCmsStore,
  verifyPasswordHash,
} from '@/lib/cmsStore';
import {
  buildOtpAuthUri,
  generateTotpQrDataUrl,
  generateTotpSecret,
  verifyTotpCode,
} from '@/lib/totp';
import { getClientIp } from '@/lib/rateLimit';

export async function GET(request: Request) {
  const auth = await requireApiAuth(request);
  if (!auth.ok) return auth.response;

  const user = findUserById(auth.session.userId);
  if (!user) {
    return NextResponse.json({ error: 'User not found' }, { status: 404 });
  }

  return NextResponse.json({
    user: sanitizeUser(user),
  });
}

export async function PATCH(request: Request) {
  const auth = await requireApiAuth(request);
  if (!auth.ok) return auth.response;

  const clientIp = getClientIp(request);
  const user = findUserById(auth.session.userId);
  if (!user) {
    return NextResponse.json({ error: 'User not found' }, { status: 404 });
  }

  try {
    const body = await request.json();
    const action = body.action as string;

    // 1. Change Own Password
    if (action === 'change_password') {
      const currentPassword = String(body.currentPassword || '');
      const newPassword = String(body.newPassword || '');

      if (!verifyPasswordHash(currentPassword, user.passwordHash)) {
        return NextResponse.json(
          { error: 'Current password is incorrect' },
          { status: 400 }
        );
      }
      if (newPassword.length < 8) {
        return NextResponse.json(
          { error: 'New password must be at least 8 characters long' },
          { status: 400 }
        );
      }

      const nextHash = hashPassword(newPassword);
      const nextTokenVersion = (user.tokenVersion || 1) + 1;

      updateCmsStore((state) => ({
        ...state,
        users: state.users.map((u) =>
          u.id === user.id
            ? {
                ...u,
                passwordHash: nextHash,
                tokenVersion: nextTokenVersion,
                updatedAt: new Date().toISOString(),
              }
            : u
        ),
      }));

      appendActivityLog({
        actorId: user.id,
        actorUsername: user.username,
        actorRole: user.role,
        action: 'password_changed',
        targetType: 'user',
        targetId: user.id,
        details: 'User updated account password',
        ipAddress: clientIp,
      });

      const refreshedToken = await createAdminSessionToken({
        userId: user.id,
        username: user.username,
        fullName: user.fullName,
        role: user.role,
        tokenVersion: nextTokenVersion,
      });

      const res = NextResponse.json({ success: true, message: 'Password updated successfully' });
      const cookieOptions = {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax' as const,
        path: '/',
        maxAge: 24 * 60 * 60,
      };
      res.cookies.set('avicinna_admin_session', refreshedToken, cookieOptions);
      res.cookies.set('avicinna_session', refreshedToken, cookieOptions);
      return res;
    }

    // 2. Generate TOTP Setup QR Code
    if (action === 'setup_2fa') {
      const secret = generateTotpSecret();
      const otpAuthUri = buildOtpAuthUri(user.username, secret, 'AVICINNA');
      const qrDataUrl = await generateTotpQrDataUrl(otpAuthUri);

      updateCmsStore((state) => ({
        ...state,
        users: state.users.map((u) =>
          u.id === user.id ? { ...u, totpSecret: secret, updatedAt: new Date().toISOString() } : u
        ),
      }));

      return NextResponse.json({
        success: true,
        secret,
        otpAuthUri,
        qrDataUrl,
      });
    }

    // 3. Verify & Enable TOTP 2FA
    if (action === 'enable_2fa') {
      const code = String(body.code || '').trim();
      const secretToCheck = String(body.secret || user.totpSecret || '').trim();
      if (!secretToCheck || !verifyTotpCode(secretToCheck, code, 1)) {
        return NextResponse.json(
          { error: 'Invalid 6-digit authenticator verification code' },
          { status: 400 }
        );
      }

      updateCmsStore((state) => ({
        ...state,
        users: state.users.map((u) =>
          u.id === user.id
            ? {
                ...u,
                totpSecret: secretToCheck,
                totpEnabled: true,
                updatedAt: new Date().toISOString(),
              }
            : u
        ),
      }));

      appendActivityLog({
        actorId: user.id,
        actorUsername: user.username,
        actorRole: user.role,
        action: '2fa_enabled',
        targetType: 'user',
        targetId: user.id,
        details: 'Enabled TOTP Authenticator App 2FA',
        ipAddress: clientIp,
      });

      return NextResponse.json({ success: true, totpEnabled: true });
    }

    // 4. Disable TOTP 2FA (requires current password)
    if (action === 'disable_2fa') {
      const currentPassword = String(body.currentPassword || '');
      if (!verifyPasswordHash(currentPassword, user.passwordHash)) {
        return NextResponse.json({ error: 'Current password is incorrect' }, { status: 400 });
      }

      updateCmsStore((state) => ({
        ...state,
        users: state.users.map((u) =>
          u.id === user.id
            ? { ...u, totpEnabled: false, totpSecret: undefined, updatedAt: new Date().toISOString() }
            : u
        ),
      }));

      appendActivityLog({
        actorId: user.id,
        actorUsername: user.username,
        actorRole: user.role,
        action: '2fa_disabled',
        targetType: 'user',
        targetId: user.id,
        details: 'Disabled TOTP Authenticator App 2FA',
        ipAddress: clientIp,
      });

      return NextResponse.json({ success: true, totpEnabled: false });
    }

    return NextResponse.json({ error: 'Unsupported action' }, { status: 400 });
  } catch (err) {
    console.error('[api/auth/me] Error:', err);
    return NextResponse.json({ error: 'Failed to update account security' }, { status: 500 });
  }
}

