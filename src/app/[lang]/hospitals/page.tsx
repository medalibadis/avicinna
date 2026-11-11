import React from 'react';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { HospitalsView } from '@/components/pages/HospitalsView';
import { buildLanguageAlternates, isValidLocale } from '@/lib/i18nRoutes';
import type { Locale } from '@/types/cms';

const metaByLang: Record<Locale, { title: string; description: string }> = {
  ar: {
    title: 'أفضل المستشفيات المعتمدة دولياً JCI في تركيا | شبكة أفيسينا',
    description:
      'تعرف على أبرز المستشفيات الشريكة في إسطنبول وانقرة مثل مجموعة أجيبادم وميموريال، التجهيزات الطبية وغرف العمليات الهجينة.',
  },
  fr: {
    title: 'Hôpitaux Partenaires Accrédités JCI en Turquie | AVICINNA',
    description:
      'Explorez notre réseau d’hôpitaux d’excellence à Istanbul et Ankara (Acibadem, Memorial), plateaux techniques et blocs robotiques.',
  },
  en: {
    title: 'JCI-Accredited Partner Hospitals in Turkey | AVICINNA Network',
    description:
      'Discover Turkey’s premier JCI-accredited hospitals including Acibadem and Memorial, featuring robotic surgical suites and ICU capacities.',
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
    alternates: buildLanguageAlternates({ barePath: '/hospitals', currentLang: lang }),
  };
}

export default async function HospitalsPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  if (!isValidLocale(lang)) notFound();
  return <HospitalsView />;
}

