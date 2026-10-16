import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { verifyAdminSessionServer } from '@/lib/auth';

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Intercept all administrative paths
  if (pathname === '/admin' || pathname.startsWith('/admin/')) {
    const adminSessionCookie =
      request.cookies.get('avicinna_admin_session')?.value ||
      request.cookies.get('avicinna_session')?.value;

    const authHeader = request.headers.get('authorization');
    const bearerToken = authHeader?.startsWith('Bearer ') ? authHeader.substring(7) : null;

    const tokenToCheck = adminSessionCookie || bearerToken;
    const isValid = await verifyAdminSessionServer(tokenToCheck);

    if (!isValid) {
      // 307 Temporary Redirect to login page preserving destination
      const loginUrl = new URL('/auth/login', request.url);
      loginUrl.searchParams.set('from', pathname);
      return NextResponse.redirect(loginUrl, 307);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/admin/:path*',
    '/admin',
  ],
};
