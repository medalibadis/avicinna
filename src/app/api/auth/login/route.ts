import { NextResponse } from 'next/server';
import { validateAdminCredentials, createAdminSessionToken } from '@/lib/auth';
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

  // 1. Check if IP address is currently locked out
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

    // 2. Honeypot Bot Trap: Automated scrapers fill hidden fields
    if (body.company_website || body.website_decoy) {
      const banSeconds = triggerHoneypotBan(clientIp);
      await enforceTarpitDelay(2000);
      return NextResponse.json(
        { error: 'Bot signature detected. Access revoked.' },
        { status: 403, headers: { 'Retry-After': String(banSeconds) } }
      );
    }

    const user = body.user || body.username || body.email;
    const password = body.password || body.pass;
    const securityPin = body.securityPin || body.pin;

    if (!user || !password) {
      return NextResponse.json(
        { error: 'يرجى إدخال اسم المستخدم وكلمة المرور / Missing credentials' },
        { status: 400 }
      );
    }

    // 3. Multi-Factor Credential Validation
    const isValid = await validateAdminCredentials(user, password, securityPin);

    if (!isValid) {
      // Apply Tarpit Delay (1.5s) to defeat multi-threaded brute force tools
      await enforceTarpitDelay(1500);

      const attemptResult = recordFailedAttempt(clientIp);

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

    // 4. Successful Authentication: Reset IP attempts & Issue Secure Token
    resetIpAttempts(clientIp);

    const token = await createAdminSessionToken(user);
    const response = NextResponse.json({
      success: true,
      user,
      message: 'تم تسجيل الدخول بنجاح / Authentication successful',
    });

    // Set secure HttpOnly cookies
    const cookieOptions = {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax' as const,
      path: '/',
      maxAge: 24 * 60 * 60, // 24 hours
    };

    response.cookies.set('avicinna_admin_session', token, cookieOptions);
    response.cookies.set('avicinna_session', token, cookieOptions);

    return response;
  } catch (error) {
    console.error('Auth Login Error:', error);
    return NextResponse.json(
      { error: 'Internal server error during authentication' },
      { status: 500 }
    );
  }
}
