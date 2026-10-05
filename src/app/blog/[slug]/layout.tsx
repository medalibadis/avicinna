import type { Metadata } from 'next';
import { fetchWordPressPostBySlug, getPublicSiteUrl } from '@/lib/wordpress';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';

type Props = {
  params: Promise<{ slug: string }>;
  children: React.ReactNode;
};

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const publicBaseUrl = getPublicSiteUrl();

  // 1. First priority: Check WordPress Headless CMS (with Rank Math / Yoast SEO)
  try {
    const wpArticle = await fetchWordPressPostBySlug(slug);
    if (wpArticle) {
      const title = wpArticle.seo.title || `${wpArticle.title.ar} - AVICINNA`;
      const description = wpArticle.seo.description || wpArticle.excerpt.ar || '';
      const canonical = `${publicBaseUrl}/blog/${slug}`;

      return {
        title,
        description,
        keywords: [
          wpArticle.seo.focusKeyword,
          wpArticle.title.ar,
          wpArticle.categoryName.ar,
          'العلاج في تركيا',
          'سياحة علاجية إسطنبول',
          'AVICINNA Healthcare',
        ].filter(Boolean),
        openGraph: {
          title,
          description,
          url: canonical,
          siteName: 'AVICINNA Medical Tourism Turkey',
          type: 'article',
          publishedTime: wpArticle.publishedDate,
          authors: [wpArticle.author.name.ar],
          images: wpArticle.image
            ? [
                {
                  url: wpArticle.image,
                  width: 1200,
                  height: 630,
                  alt: wpArticle.title.ar,
                },
              ]
            : undefined,
        },
        twitter: {
          card: 'summary_large_image',
          title,
          description,
          images: wpArticle.image ? [wpArticle.image] : undefined,
        },
        alternates: {
          canonical,
        },
      };
    }
  } catch (e) {
    // continue to fallback
  }

  // 2. Secondary fallback: Check Supabase
  if (isSupabaseConfigured && supabase) {
    const { data: article } = await supabase
      .from('articles')
      .select('title_ar, title_en, excerpt_ar, excerpt_en, image, author_ar, published_date')
      .eq('slug', slug)
      .single();

    if (article) {
      const title = `${article.title_ar} - AVICINNA`;
      const description = article.excerpt_ar || article.excerpt_en || '';
      const canonical = `${publicBaseUrl}/blog/${slug}`;

      return {
        title,
        description,
        openGraph: {
          title: article.title_ar,
          description,
          type: 'article',
          url: canonical,
          publishedTime: article.published_date,
          authors: article.author_ar ? [article.author_ar] : undefined,
          images: article.image ? [{ url: article.image, width: 1200, height: 630, alt: article.title_ar }] : undefined,
        },
        alternates: {
          canonical,
        },
      };
    }
  }

  return {
    title: 'مقال طبي | AVICINNA',
    description: 'مقالات طبية متخصصة ومراجعة من كبار الأطباء والاستشاريين في تركيا.',
    alternates: {
      canonical: `${publicBaseUrl}/blog/${slug}`,
    },
  };
}

export default function BlogSlugLayout({ children }: { children: React.ReactNode }) {
  return children;
}
