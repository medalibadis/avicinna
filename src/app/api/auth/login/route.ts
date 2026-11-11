import { NextResponse } from 'next/server';
import { createAdminSessionToken } from '@/lib/auth';
import {
  appendActivityLog,
  findUserByIdentifier,
  sanitizeUser,
  updateCmsStore,
  verifyPasswordHash,
} from '@/lib/cmsStore';
import { verifyTotpCode } from '@/lib/totp';
import {
  getClientIp,
  isIpLockedOut,
  recordFailedAttempt,
  resetIpAttempts,
  triggerHoneypotBan,
  enforceTarpitDelay,
} from '@/lib/rateLimit';

export async function POST(request: Request) {
  const clientIp = getClientIp(request);

  const lockoutStatus = isIpLockedOut(clientIp);
  if (lockoutStatus.locked) {
    return NextResponse.json(
      {
        error: `تم حظر عنوان IP مؤقتاً لمدة ${Math.ceil(lockoutStatus.retryAfterSeconds / 60)} دقيقة بسبب محاولات متكررة غير صحيحة / Access temporarily locked due to repeated failed attempts.`,
        locked: true,
        retryAfter: lockoutStatus.retryAfterSeconds,
      },
      {
        status: 429,
        headers: {
          'Retry-After': String(lockoutStatus.retryAfterSeconds),
        },
      }
    );
  }

  try {
    const body = await request.json();

    if (body.company_website || body.website_decoy) {
      const banSeconds = triggerHoneypotBan(clientIp);
      await enforceTarpitDelay(2000);
      appendActivityLog({
        actorId: 'unknown',
        actorUsername: String(body.user || 'bot'),
        actorRole: 'anonymous',
        action: 'login_honeypot_ban',
        targetType: 'auth',
        details: `Honeypot triggered from IP ${clientIp}`,
        ipAddress: clientIp,
      });
      return NextResponse.json(
        { error: 'Bot signature detected. Access revoked.' },
        { status: 403, headers: { 'Retry-After': String(banSeconds) } }
      );
    }

    const identifier = String(body.user || body.username || body.email || '').trim();
    const password = String(body.password || body.pass || '');
    const totpCode = String(body.totpCode || body.otp || '').trim();

    if (!identifier || !password) {
      return NextResponse.json(
        { error: 'يرجى إدخال اسم المستخدم وكلمة المرور / Missing credentials' },
        { status: 400 }
      );
    }

    const user = findUserByIdentifier(identifier);
    const passwordMatches = user ? verifyPasswordHash(password, user.passwordHash) : false;

    if (!user || !user.isActive || !passwordMatches) {
      await enforceTarpitDelay(1500);
      const attemptResult = recordFailedAttempt(clientIp);

      appendActivityLog({
        actorId: user?.id || 'unknown',
        actorUsername: identifier,
        actorRole: user?.role || 'anonymous',
        action: 'login_failed',
        targetType: 'auth',
        details: user && !user.isActive ? 'Disabled account login attempt' : 'Invalid username or password',
        ipAddress: clientIp,
      });

      if (attemptResult.locked) {
        return NextResponse.json(
          {
            error: `تم تجاوز الحد الأقصى للمحاولات. تم حظر عنوان IP مؤقتاً لمدة ${Math.ceil(attemptResult.retryAfterSeconds / 60)} دقيقة / Maximum attempts exceeded. IP locked for 15 minutes.`,
            locked: true,
            retryAfter: attemptResult.retryAfterSeconds,
            remainingAttempts: 0,
          },
          {
            status: 429,
            headers: {
              'Retry-After': String(attemptResult.retryAfterSeconds),
            },
          }
        );
      }

      return NextResponse.json(
        {
          error: `بيانات الدخول غير صحيحة. المحاولات المتبقية: ${attemptResult.remainingAttempts} / Invalid credentials. Attempts remaining: ${attemptResult.remainingAttempts}`,
          remainingAttempts: attemptResult.remainingAttempts,
        },
        { status: 401 }
      );
    }

    // Two-Factor Authentication via Authenticator App (TOTP)
    if (user.totpEnabled && user.totpSecret) {
      if (!totpCode) {
        return NextResponse.json({
          success: false,
          requires2fa: true,
          message: 'Please enter the 6-digit verification code from your authenticator app.',
        });
      }

      const totpValid = verifyTotpCode(user.totpSecret, totpCode, 1);
      if (!totpValid) {
        await enforceTarpitDelay(1500);
        const attemptResult = recordFailedAttempt(clientIp);
        appendActivityLog({
          actorId: user.id,
          actorUsername: user.username,
          actorRole: user.role,
          action: 'login_failed_2fa',
          targetType: 'auth',
          details: 'Invalid Authenticator App TOTP code',
          ipAddress: clientIp,
        });

        return NextResponse.json(
          {
            requires2fa: true,
            error: `رمز التحقق الثنائي غير صحيح. المحاولات المتبقية: ${attemptResult.remainingAttempts} / Invalid authenticator code. Attempts remaining: ${attemptResult.remainingAttempts}`,
            remainingAttempts: attemptResult.remainingAttempts,
            locked: attemptResult.locked,
            retryAfter: attemptResult.retryAfterSeconds,
          },
          { status: attemptResult.locked ? 429 : 401 }
        );
      }
    }

    resetIpAttempts(clientIp);

    const now = new Date().toISOString();
    updateCmsStore((state) => ({
      ...state,
      users: state.users.map((u) => (u.id === user.id ? { ...u, lastLoginAt: now } : u)),
    }));

    appendActivityLog({
      actorId: user.id,
      actorUsername: user.username,
      actorRole: user.role,
      action: 'login_success',
      targetType: 'auth',
      targetId: user.id,
      details: `Signed in (${user.totpEnabled ? 'Password + TOTP 2FA' : 'Password'})`,
      ipAddress: clientIp,
    });

    const token = await createAdminSessionToken({
      userId: user.id,
      username: user.username,
      fullName: user.fullName,
      role: user.role,
      tokenVersion: user.tokenVersion,
    });

    const response = NextResponse.json({
      success: true,
      user: sanitizeUser(user),
      totpRecommended: !user.totpEnabled,
      message: 'تم تسجيل الدخول بنجاح / Authentication successful',
    });

    const cookieOptions = {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax' as const,
      path: '/',
      maxAge: 24 * 60 * 60,
    };

    response.cookies.set('avicinna_admin_session', token, cookieOptions);
    response.cookies.set('avicinna_session', token, cookieOptions);

    return response;
  } catch (error) {
    console.error('Auth Login Error:', error);
    return NextResponse.json({ error: 'Internal server error during authentication' }, { status: 500 });
  }
}
