import React from 'react';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { HomeView } from '@/components/pages/HomeView';
import { buildLanguageAlternates, getPublicBaseUrl, isValidLocale } from '@/lib/i18nRoutes';
import type { Locale } from '@/types/cms';

export const dynamic = 'force-dynamic';

const homeMeta: Record<Locale, { title: string; description: string; ogLocale: string }> = {
  ar: {
    title: 'AVICINNA | أفيسينا للرعاية الطبية والسياحة العلاجية في تركيا',
    description:
      'منصة أفيسينا الطبية الدولية تربطكم بأفضل الأطباء البروفيسورات والمستشفيات المعتمدة دولياً (JCI) في إسطنبول، تركيا. استشارة مجانية وخطة علاجية شاملة.',
    ogLocale: 'ar_SA',
  },
  fr: {
    title: 'AVICINNA | Tourisme Médical d’Excellence & Hôpitaux en Turquie',
    description:
      'Plateforme médicale internationale AVICINNA : accès aux meilleurs chirurgiens et hôpitaux accrédités JCI à Istanbul. Devis gratuit et accompagnement 360° en français.',
    ogLocale: 'fr_FR',
  },
  en: {
    title: 'AVICINNA | Premier Medical Tourism & Accredited Hospitals in Turkey',
    description:
      'AVICINNA connects international patients with top professors and JCI-accredited hospitals in Istanbul, Turkey. Free medical evaluation and all-inclusive care.',
    ogLocale: 'en_US',
  },
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  if (!isValidLocale(lang)) return { robots: { index: false, follow: false } };

  const meta = homeMeta[lang];
  const baseUrl = getPublicBaseUrl();
  const alternates = buildLanguageAlternates({ barePath: '/', currentLang: lang });

  return {
    title: meta.title,
    description: meta.description,
    alternates,
    openGraph: {
      title: meta.title,
      description: meta.description,
      url: alternates.canonical as string,
      siteName: 'AVICINNA',
      locale: meta.ogLocale,
      type: 'website',
      images: [
        {
          url: `${baseUrl}/images/hospitals/memorial-bahcelievler.jpg`,
          width: 1200,
          height: 630,
          alt: 'AVICINNA International Healthcare Turkey',
        },
      ],
    },
    robots: { index: true, follow: true },
  };
}

export default async function LocalizedHomePage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  if (!isValidLocale(lang)) notFound();
  return <HomeView locale={lang} />;
}

