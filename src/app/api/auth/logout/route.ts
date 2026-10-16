import { NextResponse } from 'next/server';

export async function POST() {
  const response = NextResponse.json({
    success: true,
    message: 'تم تسجيل الخروج بنجاح / Logged out successfully',
  });

  const clearOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax' as const,
    path: '/',
    maxAge: 0,
  };

  response.cookies.set('avicinna_admin_session', '', clearOptions);
  response.cookies.set('avicinna_session', '', clearOptions);

  return response;
}

export async function GET(request: Request) {
  const url = new URL(request.url);
  const redirectUrl = new URL('/auth/login', url.origin);
  const response = NextResponse.redirect(redirectUrl, 303);

  const clearOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax' as const,
    path: '/',
    maxAge: 0,
  };

  response.cookies.set('avicinna_admin_session', '', clearOptions);
  response.cookies.set('avicinna_session', '', clearOptions);

  return response;
}
