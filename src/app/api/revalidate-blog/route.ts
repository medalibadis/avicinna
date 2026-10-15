import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath, revalidateTag } from 'next/cache';

async function handleRevalidation(req: NextRequest) {
  const secretParam = req.nextUrl.searchParams.get('secret');
  const configuredSecret = process.env.WORDPRESS_PREVIEW_SECRET || 'avicinna_wp_secure_token_change_me';

  if (!secretParam || secretParam !== configuredSecret) {
    return NextResponse.json({ message: 'Invalid or missing security secret' }, { status: 401 });
  }

  try {
    let slug = req.nextUrl.searchParams.get('slug') || '';

    if (!slug && req.method === 'POST') {
      try {
        const rawBody = await req.text();
        if (rawBody && rawBody.length < 10240) {
          const body = JSON.parse(rawBody);
          if (body && typeof body.slug === 'string') {
            slug = body.slug;
          }
        }
      } catch {
        // Body may be empty or invalid JSON, ignore
      }
    }

    // Sanitize slug strictly to prevent path traversal or injection
    const sanitizedSlug = slug
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9\-_]/g, '')
      .slice(0, 120);

    // Revalidate paths for blog listing, dynamic sitemap, and specific article
    try {
      revalidatePath('/blog');
      revalidatePath('/sitemap.xml');
    } catch (e) {
      console.warn('revalidatePath warning:', e);
    }

    try {
      revalidateTag('wordpress-blog', 'seconds');
    } catch {
      try {
        (revalidateTag as any)('wordpress-blog');
      } catch {}
    }

    if (sanitizedSlug) {
      try {
        revalidatePath(`/blog/${sanitizedSlug}`);
      } catch (e) {
        console.warn('revalidatePath slug warning:', e);
      }

      try {
        revalidateTag(`wordpress-post-${sanitizedSlug}`, 'seconds');
      } catch {
        try {
          (revalidateTag as any)(`wordpress-post-${sanitizedSlug}`);
        } catch {}
      }
    }

    return NextResponse.json({
      revalidated: true,
      slug: sanitizedSlug || 'all',
      timestamp: Date.now(),
    });
  } catch (err: any) {
    return NextResponse.json(
      { message: 'Error during revalidation', error: String(err?.message || err) },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  return handleRevalidation(req);
}

export async function GET(req: NextRequest) {
  return handleRevalidation(req);
}
