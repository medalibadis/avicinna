import React from 'react';
import { fetchWordPressPosts } from '@/lib/wordpress';
import { BlogClientView } from '@/components/blog/BlogClientView';
import type { Metadata } from 'next';

export const revalidate = 60; // Incremental Static Regeneration (ISR) every 60s

export const metadata: Metadata = {
  title: 'المدونة الطبية | دليل العلاج والسياحة الطبية في تركيا - AVICINNA',
  description:
    'دليل شامل وموثق لعلاج الأورام، جراحة القلب، زراعة الشعر، وتجميل الأسنان في أفضل مستشفيات إسطنبول المعتمدة دولياً. استشارات مجانية من كبار الأطباء.',
  keywords: [
    'العلاج في تركيا',
    'السياحة العلاجية تركيا',
    'علاج الأورام إسطنبول',
    'زراعة الشعر بالسفير',
    'ابتسامة هوليوود تركيا',
    'تكلفة العمليات في تركيا',
    'AVICINNA Medical Tourism',
  ],
  alternates: {
    canonical: 'https://avicinna.netlify.app/blog',
  },
  openGraph: {
    title: 'المدونة الطبية المعتمدة | AVICINNA Healthcare Turkey',
    description:
      'مقالات طبية استشارية ومقارنات تكاليف موثقة لنخبة أطباء وجراحي إسطنبول لمساعدتك في اتخاذ قرارات صحية واعية.',
    url: 'https://avicinna.netlify.app/blog',
    type: 'website',
  },
};

export default async function BlogPage() {
  const wpRes = await fetchWordPressPosts({ perPage: 50 });

  return (
    <BlogClientView
      initialArticles={wpRes.posts}
      isLiveWp={wpRes.isLiveWp}
    />
  );
}
