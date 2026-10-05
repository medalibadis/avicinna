import { Article, articlesData } from '@/data/articles';

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
  paragraphs: string[];
  readingTimeMinutes: number;
  publishedDate: string;
  sourceHospital: {
    ar: string;
    en: string;
    fr: string;
  };
  image: string;
  author: {
    name: { ar: string; en: string; fr: string };
    role: { ar: string; en: string; fr: string };
  };
  seo: {
    title: string;
    description: string;
    focusKeyword: string;
    canonical: string;
  };
  isFromWordPress: boolean;
}

export function getWordPressUrl(): string {
  return (
    process.env.WORDPRESS_URL ||
    process.env.NEXT_PUBLIC_WORDPRESS_URL ||
    'http://localhost:8080'
  ).replace(/\/+$/, '');
}

export function getPublicSiteUrl(): string {
  return (
    process.env.NEXT_PUBLIC_SITE_URL ||
    (typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3000')
  ).replace(/\/+$/, '');
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
    ? rawCanonical.replace(/https?:\/\/cms\.[^/]+/i, publicBaseUrl)
    : `${publicBaseUrl}/blog/${raw.slug}`;

  return {
    id: `wp-${raw.id}`,
    slug: raw.slug,
    categorySlug,
    categoryName: {
      ar: categoryNameAr,
      en: categoryNameAr,
      fr: categoryNameAr,
    },
    title: {
      ar: cleanTitle,
      en: cleanTitle,
      fr: cleanTitle,
    },
    excerpt: {
      ar: cleanExcerpt,
      en: cleanExcerpt,
      fr: cleanExcerpt,
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
export function convertLocalArticleToWP(art: Article): WordPressArticle {
  const publicBaseUrl = getPublicSiteUrl();
  const htmlContent = art.content.ar.map((p) => `<p>${p}</p>`).join('');

  return {
    id: art.id,
    slug: art.slug,
    categorySlug: art.categorySlug,
    categoryName: art.categoryName,
    title: art.title,
    excerpt: art.excerpt,
    htmlContent,
    paragraphs: art.content.ar,
    readingTimeMinutes: art.readingTimeMinutes,
    publishedDate: art.publishedDate,
    sourceHospital: art.sourceHospital,
    image: art.image,
    author: art.author,
    seo: {
      title: `${art.title.ar} | AVICINNA`,
      description: art.excerpt.ar,
      focusKeyword: art.title.ar,
      canonical: `${publicBaseUrl}/blog/${art.slug}`,
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

  try {
    const res = await fetch(`${wpUrl}/wp-json/wp/v2/posts?${queryParams.toString()}`, {
      next: { tags: ['wordpress-blog'], revalidate: 60 },
      headers: { Accept: 'application/json' },
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
  } catch (err) {
    // WordPress server may be offline or starting up, fall back gracefully
  }

  // Fallback to local articles data
  let localList = articlesData.map(convertLocalArticleToWP);

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
  isDraft = false
): Promise<WordPressArticle | null> {
  const wpUrl = getWordPressUrl();
  try {
    const res = await fetch(`${wpUrl}/wp-json/wp/v2/posts?slug=${encodeURIComponent(slug)}`, {
      next: { tags: [`wordpress-post-${slug}`], revalidate: 60 },
      headers: { Accept: 'application/json' },
    });

    if (res.ok) {
      const data: WordPressRawPost[] = await res.json();
      if (data && data.length > 0) {
        return normalizeWordPressPost(data[0]);
      }
    }
  } catch (err) {
    // Fall back to local
  }

  // Fallback to local articles data
  const localFound = articlesData.find((a) => a.slug === slug);
  if (localFound) {
    return convertLocalArticleToWP(localFound);
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
        },
        rank_math_seo: {
          title: payload.seoTitle || `${payload.title} - AVICINNA`,
          description: payload.seoDescription || payload.excerpt,
          focus_keyword: payload.focusKeyword || payload.title,
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
  try {
    const res = await fetch(`${wpUrl}/health`, { cache: 'no-store' });
    if (res.ok) {
      const json = await res.json();
      return { online: true, totalArticles: json.totalArticles, url: wpUrl };
    }
  } catch (e) {
    // offline
  }
  return { online: false, url: wpUrl };
}
