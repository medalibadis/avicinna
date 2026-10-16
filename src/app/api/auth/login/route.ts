import { NextResponse } from 'next/server';
import { validateAdminCredentials, createAdminSessionToken } from '@/lib/auth';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const user = body.user || body.username || body.email;
    const password = body.password || body.pass;

    if (!user || !password) {
      return NextResponse.json(
        { error: 'Missing username or password' },
        { status: 400 }
      );
    }

    const isValid = validateAdminCredentials(user, password);
    if (!isValid) {
      return NextResponse.json(
        { error: 'اسم المستخدم أو كلمة المرور غير صحيحة / Invalid credentials' },
        { status: 401 }
      );
    }

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
