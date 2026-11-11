import React from 'react';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { AboutView } from '@/components/pages/AboutView';
import { buildLanguageAlternates, isValidLocale } from '@/lib/i18nRoutes';
import type { Locale } from '@/types/cms';

const metaByLang: Record<Locale, { title: string; description: string }> = {
  ar: {
    title: 'من نحن | منصة أفيسينا للسياحة العلاجية الدولية في تركيا - AVICINNA',
    description:
      'تعرف على رؤية ورسالة منصة أفيسينا الطبية الدولية في إسطنبول، شراكاتنا مع المستشفيات المعتمدة دولياً JCI، وفريقنا الطبي.',
  },
  fr: {
    title: 'À Propos d’AVICINNA | Coordination Médicale Internationale en Turquie',
    description:
      'Découvrez notre réseau d’hôpitaux accrédités JCI à Istanbul, nos chirurgiens chevronnés et notre conciergerie médicale francophone 360°.',
  },
  en: {
    title: 'About Us | AVICINNA International Healthcare Platform in Turkey',
    description:
      'Learn about AVICINNA in Istanbul, our partnerships with JCI-accredited hospitals, elite physicians, and 360° patient concierge support.',
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
  return {
    title: m.title,
    description: m.description,
    alternates: buildLanguageAlternates({ barePath: '/about', currentLang: lang }),
  };
}

export default async function AboutPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  if (!isValidLocale(lang)) notFound();
  return <AboutView />;
}

