import { Article, articlesData } from '@/data/articles';
import { readCmsStore } from '@/lib/cmsStore';
import { findEntityByAnySlug, getEntitySlug } from '@/lib/i18nRoutes';
import type { FaqItem, Locale, LocalizedSeo, LocalizedSlugs, MedicalReviewerInfo } from '@/types/cms';

export interface WordPressRawPost {
  id: number;
  date: string;
  modified: string;
  slug: string;
  status: string;
  type: string;
  link: string;
  title: { rendered: string };
  content: { rendered: string };
  excerpt: { rendered: string };
  featured_media_url?: string;
  categories?: number[];
  meta?: {
    reading_time?: number;
    author_name?: string;
    author_role?: string;
    hospital_name?: string;
    category_slug?: string;
    category_name?: string;
  };
  rank_math_seo?: {
    title?: string;
    description?: string;
    focus_keyword?: string;
    canonical?: string;
  };
}

export interface WordPressArticle {
  id: string;
  slug: string;
  categorySlug: string;
  categoryName: {
    ar: string;
    en: string;
    fr: string;
  };
  title: {
    ar: string;
    en: string;
    fr: string;
  };
  excerpt: {
    ar: string;
    en: string;
    fr: string;
  };
  htmlContent: string;
  htmlContentMap?: { ar: string; en: string; fr: string };
  paragraphs: string[];
  content?: {
    ar: string[];
    en: string[];
    fr: string[];
  };
  slugs?: LocalizedSlugs;
  localizedSeo?: LocalizedSeo;
  faqs?: FaqItem[];
  readingTimeMinutes: number;
  publishedDate: string;
  updatedDate?: string;
  updatedAt?: string;
  sourceHospital: {
    ar: string;
    en: string;
    fr: string;
  };
  image: string;
  authorDoctorId?: string;
  author: {
    name: { ar: string; en: string; fr: string };
    role: { ar: string; en: string; fr: string };
  };
  medicalReviewer?: MedicalReviewerInfo;
  seo: {
    title: string;
    description: string;
    focusKeyword: string;
    canonical: string;
  };
  isFromWordPress: boolean;
}

export function getWordPressUrl(): string {
  const raw = (process.env.WORDPRESS_URL || process.env.NEXT_PUBLIC_WORDPRESS_URL || '').trim();
  if (!raw || raw.toLowerCase() === 'none' || raw.toLowerCase() === 'disabled') {
    return '';
  }
  return raw.replace(/\/+$/, '');
}

export function getPublicSiteUrl(): string {
  const envUrl = process.env.NEXT_PUBLIC_SITE_URL;
  if (envUrl && !envUrl.includes('localhost') && !envUrl.includes('127.0.0.1')) {
    return envUrl.replace(/\/+$/, '');
  }
  if (typeof window !== 'undefined' && !window.location.origin.includes('localhost')) {
    return window.location.origin.replace(/\/+$/, '');
  }
  return 'https://avicinna.com';
}

/**
 * Strips HTML tags from string
 */
export function stripHtml(html: string): string {
  if (!html) return '';
  return html.replace(/<[^>]*>/g, '').trim();
}

/**
 * Normalizes raw WordPress post into standard AVICINNA article structure
 */
export function normalizeWordPressPost(raw: WordPressRawPost): WordPressArticle {
  const publicBaseUrl = getPublicSiteUrl();
  const cleanTitle = stripHtml(raw.title?.rendered || 'مقال طبي');
  const cleanExcerpt = stripHtml(raw.excerpt?.rendered || '');
  const rawHtml = raw.content?.rendered || '';

  // Extract paragraphs from HTML for multi-view compatibility
  const paragraphs = rawHtml
    .split(/<\/p>|<br\s*\/?>/i)
    .map((p) => stripHtml(p))
    .filter(Boolean);

  const readingTime = Number(raw.meta?.reading_time) || 5;
  const authorName = raw.meta?.author_name || 'أ. د. سردار تورهال';
  const authorRole = raw.meta?.author_role || 'استشاري طب الأورام السريري';
  const hospitalName = raw.meta?.hospital_name || 'مستشفى أجيبادم للأورام والمركز المعتمد بتركيا';
  const categorySlug = raw.meta?.category_slug || 'oncology';
  const categoryNameAr = raw.meta?.category_name || 'الأورام والسرطان';

  // Clean canonical: strictly ensures it points to public Next.js domain
  const rawCanonical = raw.rank_math_seo?.canonical || '';
  const cleanCanonical = rawCanonical
    ? rawCanonical
        .replace(/https?:\/\/cms\.[^/]+/i, publicBaseUrl)
        .replace(/https?:\/\/avicinna\.netlify\.app/i, publicBaseUrl)
        .replace(/https?:\/\/localhost(:\d+)?/i, publicBaseUrl)
    : `${publicBaseUrl}/blog/${raw.slug}`;

  const isTitleArabic = /[\u0600-\u06FF]/.test(cleanTitle);
  const isExcerptArabic = /[\u0600-\u06FF]/.test(cleanExcerpt);

  return {
    id: `wp-${raw.id}`,
    slug: raw.slug,
    categorySlug,
    categoryName: {
      ar: categoryNameAr,
      en: isTitleArabic ? '' : categoryNameAr,
      fr: isTitleArabic ? '' : categoryNameAr,
    },
    title: {
      ar: isTitleArabic ? cleanTitle : '',
      en: isTitleArabic ? '' : cleanTitle,
      fr: isTitleArabic ? '' : cleanTitle,
    },
    excerpt: {
      ar: isExcerptArabic ? cleanExcerpt : '',
      en: isExcerptArabic ? '' : cleanExcerpt,
      fr: isExcerptArabic ? '' : cleanExcerpt,
    },
    htmlContent: rawHtml,
    paragraphs: paragraphs.length > 0 ? paragraphs : [cleanExcerpt],
    readingTimeMinutes: readingTime,
    publishedDate: raw.date ? raw.date.split('T')[0] : new Date().toISOString().split('T')[0],
    sourceHospital: {
      ar: hospitalName,
      en: hospitalName,
      fr: hospitalName,
    },
    image:
      raw.featured_media_url ||
      'https://images.unsplash.com/photo-1579154204601-01588f351e67?q=80&w=1200&auto=format&fit=crop',
    author: {
      name: { ar: authorName, en: authorName, fr: authorName },
      role: { ar: authorRole, en: authorRole, fr: authorRole },
    },
    seo: {
      title: raw.rank_math_seo?.title || `${cleanTitle} - AVICINNA`,
      description: raw.rank_math_seo?.description || cleanExcerpt,
      focusKeyword: raw.rank_math_seo?.focus_keyword || cleanTitle,
      canonical: cleanCanonical,
    },
    isFromWordPress: true,
  };
}

/**
 * Convert standard Article object to WordPressArticle format
 */
export function convertLocalArticleToWP(art: Article, lang: Locale = 'ar'): WordPressArticle {
  const publicBaseUrl = getPublicSiteUrl();
  const arParagraphs = art.content?.ar || (art as any).paragraphs || [];
  const paragraphsForLang = art.content?.[lang] || arParagraphs;
  const htmlForLang =
    art.htmlContent?.[lang]?.trim() ||
    art.htmlContent?.ar?.trim() ||
    paragraphsForLang.map((p: string) => `<p>${p}</p>`).join('');

  const effectiveSlug = getEntitySlug(art, lang);
  const langSeo = art.seo?.[lang];

  return {
    id: art.id,
    slug: art.slug,
    slugs: art.slugs,
    localizedSeo: art.seo,
    faqs: art.faqs,
    categorySlug: art.categorySlug,
    categoryName: art.categoryName,
    title: art.title,
    excerpt: art.excerpt,
    htmlContent: htmlForLang,
    htmlContentMap: art.htmlContent,
    paragraphs: paragraphsForLang,
    content: art.content,
    readingTimeMinutes: art.readingTimeMinutes,
    publishedDate: art.publishedDate,
    updatedDate: art.updatedDate || art.publishedDate,
    updatedAt: art.updatedAt || (art.updatedDate ? `${art.updatedDate}T10:00:00.000Z` : undefined),
    sourceHospital: art.sourceHospital,
    image: art.image,
    authorDoctorId: art.authorDoctorId,
    author: art.author,
    medicalReviewer: art.medicalReviewer,
    seo: {
      title: langSeo?.title || `${art.title?.[lang] || art.title?.ar || art.title?.en} | AVICINNA`,
      description: langSeo?.description || art.excerpt?.[lang] || art.excerpt?.ar || art.excerpt?.en,
      focusKeyword: langSeo?.focusKeyword || art.title?.[lang] || art.title?.ar || art.title?.en,
      canonical: `${publicBaseUrl}${lang === 'ar' ? '' : `/${lang}`}/blog/${effectiveSlug}`,
    },
    isFromWordPress: false,
  };
}

/**
 * Fetch all posts from WordPress REST API with resilient fallback to local data
 */
export async function fetchWordPressPosts(options?: {
  page?: number;
  perPage?: number;
  categorySlug?: string;
  search?: string;
}): Promise<{ posts: WordPressArticle[]; total: number; totalPages: number; isLiveWp: boolean }> {
  const wpUrl = getWordPressUrl();
  const queryParams = new URLSearchParams();

  if (options?.page) queryParams.set('page', String(options.page));
  if (options?.perPage) queryParams.set('per_page', String(options.perPage));
  if (options?.categorySlug && options.categorySlug !== 'all') {
    queryParams.set('category_slug', options.categorySlug);
  }
  if (options?.search) queryParams.set('search', options.search);

  if (wpUrl) {
    try {
      const res = await fetch(`${wpUrl}/wp-json/wp/v2/posts?${queryParams.toString()}`, {
        next: { tags: ['wordpress-blog'], revalidate: 60 },
        headers: { Accept: 'application/json' },
        signal: AbortSignal.timeout(2000),
      });

      if (res.ok) {
        const total = parseInt(res.headers.get('X-WP-Total') || '0', 10);
        const totalPages = parseInt(res.headers.get('X-WP-TotalPages') || '1', 10);
        const data: WordPressRawPost[] = await res.json();
        const normalized = data.map(normalizeWordPressPost);

        return {
          posts: normalized,
          total: total || normalized.length,
          totalPages: totalPages || 1,
          isLiveWp: true,
        };
      }
    } catch {
      // WordPress server may be offline or not used, fall back instantaneously to CMS store
    }
  }

  // Fallback to CMS store / local articles data
  let sourceArticles = articlesData;
  try {
    sourceArticles = readCmsStore().articles;
  } catch {
    sourceArticles = articlesData;
  }
  let localList = sourceArticles.map((art) => convertLocalArticleToWP(art, 'ar'));

  if (options?.categorySlug && options.categorySlug !== 'all') {
    localList = localList.filter((a) => a.categorySlug === options.categorySlug);
  }
  if (options?.search) {
    const q = options.search.toLowerCase();
    localList = localList.filter(
      (a) =>
        a.title.ar.toLowerCase().includes(q) ||
        a.excerpt.ar.toLowerCase().includes(q) ||
        a.author.name.ar.toLowerCase().includes(q)
    );
  }

  const perPage = options?.perPage || 6;
  const page = options?.page || 1;
  const total = localList.length;
  const totalPages = Math.ceil(total / perPage) || 1;
  const start = (page - 1) * perPage;
  const paginated = localList.slice(start, start + perPage);

  return {
    posts: paginated,
    total,
    totalPages,
    isLiveWp: false,
  };
}

/**
 * Fetch a single post by slug from WordPress REST API (with local fallback)
 */
export async function fetchWordPressPostBySlug(
  slug: string,
  _isDraft = false
): Promise<WordPressArticle | null> {
  const wpUrl = getWordPressUrl();
  if (wpUrl) {
    try {
      const res = await fetch(`${wpUrl}/wp-json/wp/v2/posts?slug=${encodeURIComponent(slug)}`, {
        next: { tags: [`wordpress-post-${slug}`], revalidate: 60 },
        headers: { Accept: 'application/json' },
        signal: AbortSignal.timeout(2000),
      });

      if (res.ok) {
        const data: WordPressRawPost[] = await res.json();
        if (data && data.length > 0) {
          return normalizeWordPressPost(data[0]);
        }
      }
    } catch {
      // Fall back to CMS store
    }
  }

  // Fallback to CMS store / local articles data (matching any localized slug)
  let sourceArticles = articlesData;
  try {
    sourceArticles = readCmsStore().articles;
  } catch {
    sourceArticles = articlesData;
  }
  const localFound = findEntityByAnySlug(sourceArticles, slug);
  if (localFound) {
    return convertLocalArticleToWP(localFound, 'ar');
  }

  return null;
}

/**
 * Push newly created or edited article from Next.js Admin to WordPress REST API
 */
export async function syncArticleToWordPress(payload: {
  id?: string | number;
  title: string;
  content: string;
  excerpt: string;
  slug?: string;
  image?: string;
  readingTime?: number;
  authorName?: string;
  authorRole?: string;
  hospitalName?: string;
  categorySlug?: string;
  categoryName?: string;
  seoTitle?: string;
  seoDescription?: string;
  focusKeyword?: string;
}): Promise<{ success: boolean; data?: any; error?: string }> {
  const wpUrl = getWordPressUrl();
  const secret = process.env.WORDPRESS_PREVIEW_SECRET || 'avicinna_wp_secure_token_change_me';

  try {
    const res = await fetch(`${wpUrl}/wp-json/wp/v2/posts`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${secret}`,
      },
      body: JSON.stringify({
        id: payload.id,
        title: { rendered: payload.title },
        content: { rendered: payload.content },
        excerpt: { rendered: payload.excerpt },
        slug: payload.slug,
        featured_media_url: payload.image,
        meta: {
          reading_time: payload.readingTime,
          author_name: payload.authorName,
          author_role: payload.authorRole,
          hospital_name: payload.hospitalName,
          category_slug: payload.categorySlug,
          category_name: payload.categoryName,
          // Official Rank Math WordPress Database Meta Keys
          rank_math_title: payload.seoTitle || `${payload.title} - AVICINNA`,
          rank_math_description: payload.seoDescription || payload.excerpt,
          rank_math_focus_keyword: payload.focusKeyword || payload.title,
          // Official Yoast SEO WordPress Database Meta Keys
          _yoast_wpseo_title: payload.seoTitle || `${payload.title} - AVICINNA`,
          _yoast_wpseo_metadesc: payload.seoDescription || payload.excerpt,
          _yoast_wpseo_focuskw: payload.focusKeyword || payload.title,
        },
        rank_math_seo: {
          title: payload.seoTitle || `${payload.title} - AVICINNA`,
          description: payload.seoDescription || payload.excerpt,
          focus_keyword: payload.focusKeyword || payload.title,
        },
        yoast_head_json: {
          title: payload.seoTitle || `${payload.title} - AVICINNA`,
          description: payload.seoDescription || payload.excerpt,
        },
      }),
    });

    if (res.ok) {
      const data = await res.json();
      return { success: true, data };
    } else {
      const errText = await res.text();
      return { success: false, error: errText };
    }
  } catch (err: any) {
    return { success: false, error: err?.message || 'Failed to connect to WordPress' };
  }
}

/**
 * Check if the WordPress bridge is online and responding
 */
export async function checkWordPressStatus(): Promise<{ online: boolean; totalArticles?: number; url: string }> {
  const wpUrl = getWordPressUrl();
  if (!wpUrl) {
    return { online: false, url: '' };
  }
  try {
    const res = await fetch(`${wpUrl}/health`, {
      cache: 'no-store',
      signal: AbortSignal.timeout(1500),
    });
    if (res.ok) {
      const json = await res.json();
      return { online: true, totalArticles: json.totalArticles, url: wpUrl };
    }
  } catch {
    // offline
  }
  return { online: false, url: wpUrl };
}
