import React from 'react';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { TreatmentsView } from '@/components/pages/TreatmentsView';
import { buildLanguageAlternates, isValidLocale } from '@/lib/i18nRoutes';
import type { Locale } from '@/types/cms';

const metaByLang: Record<Locale, { title: string; description: string }> = {
  ar: {
    title: 'التخصصات الطبية والعلاجات الجراحية في تركيا | AVICINNA',
    description:
      'استعرض كافة التخصصات الطبية المتقدمة في مستشفيات إسطنبول المعتمدة دولياً: جراحة القلب، الأعصاب، زراعة الأعضاء، الأورام، العظام، والأسنان.',
  },
  fr: {
    title: 'Traitements Médicaux & Spécialités Chirurgicales en Turquie | AVICINNA',
    description:
      'Découvrez nos pôles d’excellence à Istanbul : chirurgie cardiaque, neurochirurgie, oncologie, orthopédie, greffes et soins dentaires certifiés JCI.',
  },
  en: {
    title: 'Medical Treatments & Accredited Surgical Specialties in Turkey | AVICINNA',
    description:
      'Explore specialized medical departments at Turkey’s JCI hospitals: cardiac surgery, neurosurgery, oncology, orthopedics, transplants, and dentistry.',
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
    alternates: buildLanguageAlternates({ barePath: '/treatments', currentLang: lang }),
  };
}

export default async function TreatmentsPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  if (!isValidLocale(lang)) notFound();
  return <TreatmentsView />;
}

