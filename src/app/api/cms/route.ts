import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { requireApiAuth } from '@/lib/serverAuth';
import { appendActivityLog, getPublicTrackingConfig, readCmsStore, updateCmsStore } from '@/lib/cmsStore';
import { getClientIp } from '@/lib/rateLimit';

export async function GET(request: Request) {
  const store = readCmsStore();
  const url = new URL(request.url);
  const includeAdmin = url.searchParams.get('admin') === 'true';

  if (includeAdmin) {
    const auth = await requireApiAuth(request);
    if (!auth.ok) return auth.response;
    const isAdmin = auth.session.role === 'admin';
    return NextResponse.json({
      sections: store.sections,
      settings: isAdmin
        ? store.settings
        : {
            ...store.settings,
            tracking: getPublicTrackingConfig(),
            notifications: undefined,
          },
      doctors: store.doctors,
      hospitals: store.hospitals,
      treatments: store.treatments,
      stories: store.stories,
      articles: store.articles,
      pages: store.pages,
      redirects: auth.session.role === 'coordinator' ? [] : store.redirects,
      media: auth.session.role === 'coordinator' ? [] : store.media,
      socialVideos: store.socialVideos,
      inquiries: auth.session.role === 'editor' ? [] : store.inquiries,
    });
  }

  return NextResponse.json({
    sections: store.sections,
    doctors: store.doctors,
    hospitals: store.hospitals,
    treatments: store.treatments,
    stories: store.stories,
    articles: store.articles,
    pages: store.pages.filter((p) => p.status === 'published'),
    socialVideos: store.socialVideos,
    publicSettings: {
      contact: store.settings.contact,
      sectionsVisibility: store.settings.sectionsVisibility,
      tracking: getPublicTrackingConfig(),
    },
  });
}

export async function POST(request: Request) {
  const auth = await requireApiAuth(request, ['admin', 'editor']);
  if (!auth.ok) return auth.response;

  const clientIp = getClientIp(request);

  try {
    const body = await request.json();
    const { entityType, data } = body as { entityType: string; data: any };

    if (!entityType || data === undefined) {
      return NextResponse.json({ error: 'entityType and data are required' }, { status: 400 });
    }

    if (entityType === 'settings' && auth.session.role !== 'admin') {
      return NextResponse.json({ error: 'Only administrators can modify platform settings' }, { status: 403 });
    }

    const now = new Date().toISOString();

    updateCmsStore((state) => {
      switch (entityType) {
        case 'sections':
          return { ...state, sections: data };
        case 'settings':
          return { ...state, settings: { ...state.settings, ...data } };
        case 'doctors':
          return {
            ...state,
            doctors: Array.isArray(data)
              ? data.map((d) => ({ ...d, updatedAt: d.updatedAt || now }))
              : state.doctors,
          };
        case 'hospitals':
          return {
            ...state,
            hospitals: Array.isArray(data)
              ? data.map((h) => ({ ...h, updatedAt: h.updatedAt || now }))
              : state.hospitals,
          };
        case 'treatments':
          return {
            ...state,
            treatments: Array.isArray(data)
              ? data.map((t) => ({ ...t, updatedAt: t.updatedAt || now }))
              : state.treatments,
          };
        case 'stories':
          return {
            ...state,
            stories: Array.isArray(data)
              ? data.map((s) => ({ ...s, updatedAt: s.updatedAt || now }))
              : state.stories,
          };
        case 'articles':
          return {
            ...state,
            articles: Array.isArray(data)
              ? data.map((a) => ({ ...a, updatedAt: a.updatedAt || now }))
              : state.articles,
          };
        case 'pages':
          return {
            ...state,
            pages: Array.isArray(data)
              ? data.map((p) => ({ ...p, updatedAt: p.updatedAt || now }))
              : state.pages,
          };
        case 'socialVideos':
          return { ...state, socialVideos: Array.isArray(data) ? data : state.socialVideos };
        case 'redirects':
          return { ...state, redirects: Array.isArray(data) ? data : state.redirects };
        case 'media':
          return { ...state, media: Array.isArray(data) ? data : state.media };
        default:
          return state;
      }
    });

    appendActivityLog({
      actorId: auth.session.userId,
      actorUsername: auth.session.username,
      actorRole: auth.session.role,
      action: `cms_update_${entityType}`,
      targetType: entityType,
      details: `Updated ${entityType} via admin panel`,
      ipAddress: clientIp,
    });

    try {
      revalidatePath('/', 'layout');
      revalidatePath('/sitemap.xml');
    } catch {
      // ignore if outside request revalidation context
    }

    return NextResponse.json({ success: true, updatedAt: now });
  } catch (err) {
    console.error('[api/cms POST]:', err);
    return NextResponse.json({ error: 'Failed to persist CMS update' }, { status: 500 });
  }
}

