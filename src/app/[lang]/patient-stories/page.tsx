import React from 'react';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { PatientStoriesView } from '@/components/pages/PatientStoriesView';
import { buildLanguageAlternates, isValidLocale } from '@/lib/i18nRoutes';
import type { Locale } from '@/types/cms';

const metaByLang: Record<Locale, { title: string; description: string }> = {
  ar: {
    title: 'قصص وتجارب مرضى أفيسينا في إسطنبول | AVICINNA',
    description:
      'استعرض قصص النجاح الواقعية وتجارب الشفاء لمرضى دوليين أجروا عملياتهم الجراحية عبر منصة أفيسينا في أفضل مستشفيات إسطنبول.',
  },
  fr: {
    title: 'Témoignages & Histoires de Guérison à Istanbul | AVICINNA',
    description:
      'Découvrez les récits authentiques et parcours cliniques de nos patients opérés avec succès en Turquie.',
  },
  en: {
    title: 'Patient Stories & Clinical Recovery Journeys in Turkey | AVICINNA',
    description:
      'Explore authentic recovery stories from international patients treated across Istanbul’s top JCI-accredited hospitals.',
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
    alternates: buildLanguageAlternates({ barePath: '/patient-stories', currentLang: lang }),
  };
}

export default async function PatientStoriesPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  if (!isValidLocale(lang)) notFound();
  return <PatientStoriesView />;
}

