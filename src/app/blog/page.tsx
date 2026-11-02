import React from 'react';
import { fetchWordPressPosts } from '@/lib/wordpress';
import { BlogClientView } from '@/components/blog/BlogClientView';
import type { Metadata } from 'next';

export const revalidate = 60; // Incremental Static Regeneration (ISR) every 60s

export const metadata: Metadata = {
  title: 'المدونة الطبية | دليل السياحة العلاجية في تركيا',
  description:
    'دليل شامل وموثق لعلاج الأورام، جراحة القلب، زراعة الشعر، وتجميل الأسنان في أفضل مستشفيات إسطنبول المعتمدة دولياً. استشارات مجانية من كبار الأطباء.',
  alternates: {
    canonical: 'https://avicinna.com/blog',
  },
  openGraph: {
    title: 'المدونة الطبية | دليل السياحة العلاجية في تركيا',
    description:
      'مقالات طبية استشارية ومقارنات تكاليف موثقة لنخبة أطباء وجراحي إسطنبول لمساعدتك في اتخاذ قرارات صحية واعية.',
    url: 'https://avicinna.com/blog',
    type: 'website',
  },
};

export default async function BlogPage() {
  const wpRes = await fetchWordPressPosts({ perPage: 50 });

  const blogSchema = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'MedicalWebPage',
        '@id': 'https://avicinna.com/blog#webpage',
        url: 'https://avicinna.com/blog',
        name: 'المدونة الطبية | دليل السياحة العلاجية في تركيا',
        description: 'دليل شامل وموثق لعلاج الأورام، جراحة القلب، زراعة الشعر وتجميل الأسنان في إسطنبول.',
        inLanguage: 'ar',
        publisher: {
          '@type': 'MedicalOrganization',
          '@id': 'https://avicinna.com/#organization',
          name: 'AVICINNA Healthcare Turkey',
          url: 'https://avicinna.com',
        },
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          {
            '@type': 'ListItem',
            position: 1,
            name: 'الرئيسية',
            item: 'https://avicinna.com',
          },
          {
            '@type': 'ListItem',
            position: 2,
            name: 'المدونة الطبية',
            item: 'https://avicinna.com/blog',
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
      <BlogClientView
        initialArticles={wpRes.posts}
        isLiveWp={wpRes.isLiveWp}
      />
    </>
  );
}
