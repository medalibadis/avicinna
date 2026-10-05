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
        const body = await req.json();
        slug = body.slug || '';
      } catch {
        // Body may be empty
      }
    }

    // Revalidate paths for blog listing, dynamic sitemap, and specific article
    revalidatePath('/blog');
    revalidatePath('/sitemap.xml');
    try {
      revalidateTag('wordpress-blog', 'seconds');
    } catch {
      // fallback
    }

    if (slug) {
      revalidatePath(`/blog/${slug}`);
      try {
        revalidateTag(`wordpress-post-${slug}`, 'seconds');
      } catch {
        // fallback
      }
    }

    return NextResponse.json({
      revalidated: true,
      slug: slug || 'all',
      timestamp: Date.now(),
    });
  } catch (err: any) {
    return NextResponse.json({ message: 'Error revalidating', error: err.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  return handleRevalidation(req);
}

export async function GET(req: NextRequest) {
  return handleRevalidation(req);
}
