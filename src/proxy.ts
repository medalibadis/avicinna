import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { verifyAdminSessionToken } from '@/lib/auth';
import {
  findMatchingRedirect,
  findUserById,
  incrementRedirectHit,
} from '@/lib/cmsStore';

const PUBLIC_FILE_RE =
  /\.(?:png|jpg|jpeg|gif|webp|avif|svg|ico|css|js|map|woff|woff2|ttf|eot|txt|xml|json)$/i;

export async function proxy(request: NextRequest) {
  const { pathname, search } = request.nextUrl;

  // 1. Always bypass Next internals, API routes, uploaded media, and static asset extensions
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    pathname.startsWith('/uploads') ||
    pathname === '/favicon.ico' ||
    pathname === '/robots.txt' ||
    pathname === '/sitemap.xml' ||
    PUBLIC_FILE_RE.test(pathname)
  ) {
    return NextResponse.next();
  }

  // 2. Active Custom Redirects Manager (never hijack /admin or /auth)
  if (!pathname.startsWith('/admin') && !pathname.startsWith('/auth')) {
    const matchedRedirect = findMatchingRedirect(pathname);
    if (matchedRedirect) {
      incrementRedirectHit(matchedRedirect.id);
      const destination = matchedRedirect.toPath.startsWith('http')
        ? matchedRedirect.toPath
        : new URL(`${matchedRedirect.toPath}${search}`, request.url);
      return NextResponse.redirect(destination, matchedRedirect.statusCode);
    }
  }

  // 3. Auth Pages (/auth/*): force noindex headers + default locale header
  if (pathname.startsWith('/auth')) {
    const requestHeaders = new Headers(request.headers);
    requestHeaders.set('x-avicinna-locale', 'ar');
    const response = NextResponse.next({ request: { headers: requestHeaders } });
    response.headers.set('X-Robots-Tag', 'noindex, nofollow, noarchive');
    return response;
  }

  // 4. Protected Admin Panel (/admin/*): Multi-user RBAC & tokenVersion verification
  if (pathname.startsWith('/admin')) {
    const token =
      request.cookies.get('avicinna_admin_session')?.value ||
      request.cookies.get('avicinna_session')?.value;
    const payload = await verifyAdminSessionToken(token);

    if (!payload) {
      const loginUrl = new URL('/auth/login', request.url);
      loginUrl.searchParams.set('from', pathname);
      const res = NextResponse.redirect(loginUrl);
      res.headers.set('X-Robots-Tag', 'noindex, nofollow, noarchive');
      return res;
    }

    const user = findUserById(payload.userId);
    if (!user || !user.isActive || (user.tokenVersion || 1) !== (payload.tokenVersion || 1)) {
      const loginUrl = new URL('/auth/login', request.url);
      loginUrl.searchParams.set('from', pathname);
      const res = NextResponse.redirect(loginUrl);
      res.headers.set('X-Robots-Tag', 'noindex, nofollow, noarchive');
      res.cookies.delete('avicinna_admin_session');
      res.cookies.delete('avicinna_session');
      return res;
    }

    // Enforce strict route-level RBAC boundaries
    if (
      user.role === 'editor' &&
      (pathname.startsWith('/admin/inquiries') || pathname.startsWith('/admin/settings'))
    ) {
      const res = NextResponse.redirect(new URL('/admin', request.url));
      res.headers.set('X-Robots-Tag', 'noindex, nofollow, noarchive');
      return res;
    }

    if (
      user.role === 'coordinator' &&
      pathname !== '/admin' &&
      !pathname.startsWith('/admin/inquiries') &&
      !pathname.startsWith('/admin/security')
    ) {
      const res = NextResponse.redirect(new URL('/admin/inquiries', request.url));
      res.headers.set('X-Robots-Tag', 'noindex, nofollow, noarchive');
      return res;
    }

    const requestHeaders = new Headers(request.headers);
    requestHeaders.set('x-avicinna-locale', 'ar');
    const response = NextResponse.next({ request: { headers: requestHeaders } });
    response.headers.set('X-Robots-Tag', 'noindex, nofollow, noarchive');
    return response;
  }

  // 5. Public i18n Routing
  // Canonicalize explicit /ar prefix -> /... via 301 permanent redirect
  if (pathname === '/ar' || pathname.startsWith('/ar/')) {
    const stripped = pathname === '/ar' ? '/' : pathname.slice(3);
    const redirectUrl = new URL(`${stripped}${search}`, request.url);
    return NextResponse.redirect(redirectUrl, 301);
  }

  // Explicit /fr or /en localized URLs -> proceed to src/app/[lang]/...
  if (
    pathname === '/fr' ||
    pathname.startsWith('/fr/') ||
    pathname === '/en' ||
    pathname.startsWith('/en/')
  ) {
    const locale = pathname.startsWith('/fr') ? 'fr' : 'en';
    const requestHeaders = new Headers(request.headers);
    requestHeaders.set('x-avicinna-locale', locale);
    return NextResponse.next({ request: { headers: requestHeaders } });
  }

  // Root / unprefixed public URLs -> internally rewrite to /ar/... while keeping root URL clean
  const rewriteUrl = request.nextUrl.clone();
  rewriteUrl.pathname = `/ar${pathname === '/' ? '' : pathname}`;
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set('x-avicinna-locale', 'ar');
  return NextResponse.rewrite(rewriteUrl, { request: { headers: requestHeaders } });
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml).*)'],
};

