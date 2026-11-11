import React from 'react';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { fetchWordPressPosts } from '@/lib/wordpress';
import { BlogClientView } from '@/components/blog/BlogClientView';
import {
  buildLanguageAlternates,
  getLocalizedPath,
  getPublicBaseUrl,
  isValidLocale,
} from '@/lib/i18nRoutes';
import type { Locale } from '@/types/cms';

export const dynamic = 'force-dynamic';

const metaByLang: Record<Locale, { title: string; description: string; crumb: string }> = {
  ar: {
    title: 'المدونة الطبية | دليل السياحة العلاجية في تركيا - AVICINNA',
    description:
      'دليل شامل وموثق لعلاج الأورام، جراحة القلب، زراعة الشعر، وتجميل الأسنان في أفضل مستشفيات إسطنبول المعتمدة دولياً.',
    crumb: 'المدونة الطبية',
  },
  fr: {
    title: 'Blog Médical | Guides des Soins & Chirurgies en Turquie - AVICINNA',
    description:
      'Articles médicaux rédigés et vérifiés par nos spécialistes d’Istanbul : cardiologie, oncologie, greffes et implants dentaires.',
    crumb: 'Blog Médical',
  },
  en: {
    title: 'Medical Blog | Turkey Treatment & Surgery Guides - AVICINNA',
    description:
      'Evidence-based articles authored and medically reviewed by accredited Istanbul specialists across oncology, cardiology, and surgery.',
    crumb: 'Medical Blog',
  },
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  if (!isValidLocale(lang)) return { robots: { index: false, follow: false } };
  const m = metaByLang[lang];
  const alternates = buildLanguageAlternates({ barePath: '/blog', currentLang: lang });
  return {
    title: m.title,
    description: m.description,
    alternates,
    openGraph: {
      title: m.title,
      description: m.description,
      url: alternates.canonical as string,
      type: 'website',
    },
  };
}

export default async function BlogPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  if (!isValidLocale(lang)) notFound();

  const wpRes = await fetchWordPressPosts({ perPage: 50 });
  const baseUrl = getPublicBaseUrl();
  const pageUrl = `${baseUrl}${getLocalizedPath('/blog', lang)}`;
  const m = metaByLang[lang];

  const blogSchema = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'MedicalWebPage',
        '@id': `${pageUrl}#webpage`,
        url: pageUrl,
        name: m.title,
        description: m.description,
        inLanguage: lang,
        publisher: {
          '@id': 'https://avicinna.com/#organization',
        },
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          {
            '@type': 'ListItem',
            position: 1,
            name: lang === 'ar' ? 'الرئيسية' : lang === 'fr' ? 'Accueil' : 'Home',
            item: `${baseUrl}${getLocalizedPath('/', lang)}`,
          },
          {
            '@type': 'ListItem',
            position: 2,
            name: m.crumb,
            item: pageUrl,
          },
        ],
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(blogSchema) }}
      />
      <BlogClientView initialArticles={wpRes.posts} isLiveWp={wpRes.isLiveWp} />
    </>
  );
}

