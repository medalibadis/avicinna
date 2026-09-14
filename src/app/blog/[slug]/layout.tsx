import type { Metadata } from 'next';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;

  if (!isSupabaseConfigured || !supabase) {
    return {
      title: 'مقال طبي - AVICINNA',
    };
  }

  const { data: article } = await supabase
    .from('articles')
    .select('title_ar, title_en, excerpt_ar, excerpt_en, image, author_ar, published_date')
    .eq('slug', slug)
    .single();

  if (!article) {
    return {
      title: 'مقال غير موجود | AVICINNA',
    };
  }

  const title = `${article.title_ar} | ${article.title_en} - AVICINNA`;
  const description = article.excerpt_ar || article.excerpt_en || '';

  return {
    title,
    description,
    keywords: [
      article.title_ar,
      article.title_en,
      'مقالات طبية',
      'العلاج في تركيا',
      'medical articles Turkey',
    ],
    openGraph: {
      title: article.title_ar || article.title_en,
      description,
      type: 'article',
      publishedTime: article.published_date,
      authors: article.author_ar ? [article.author_ar] : undefined,
      images: article.image ? [{ url: article.image, width: 1200, height: 630, alt: article.title_en }] : undefined,
    },
    alternates: {
      canonical: `/blog/${slug}`,
    },
  };
}

export default function BlogSlugLayout({ children }: { children: React.ReactNode }) {
  return children;
}
