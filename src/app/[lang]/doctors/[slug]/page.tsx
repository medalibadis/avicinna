import React from 'react';
import type { Metadata } from 'next';
import { notFound, permanentRedirect } from 'next/navigation';
import { readCmsStore } from '@/lib/cmsStore';
import {
  buildLanguageAlternates,
  findEntityByAnySlug,
  getEntitySlug,
  getLocalizedEntityPath,
  getLocalizedPath,
  getPublicBaseUrl,
  isValidLocale,
} from '@/lib/i18nRoutes';
import { RegisterLocaleAlternates } from '@/context/LocaleAlternatesContext';
import { DoctorDetailView } from '@/components/pages/DoctorDetailView';

export const dynamic = 'force-dynamic';

type Props = {
  params: Promise<{ lang: string; slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang, slug } = await params;
  if (!isValidLocale(lang)) return { robots: { index: false, follow: false } };

  const store = readCmsStore();
  const doctor = findEntityByAnySlug(store.doctors, slug);
  if (!doctor) {
    return {
      title: 'Physician Not Found | AVICINNA',
      robots: { index: false, follow: false },
    };
  }

  const customSeo = doctor.seo?.[lang];
  const fallbackTitle =
    lang === 'ar'
      ? `${doctor.name.ar} | ${doctor.specialtyName.ar} في تركيا - أفيسينا`
      : lang === 'fr'
      ? `${doctor.name.fr || doctor.name.en} | ${doctor.specialtyName.fr || doctor.specialtyName.en} à Istanbul`
      : `${doctor.name.en} | ${doctor.specialtyName.en} in Istanbul - AVICINNA`;
  const title = customSeo?.title?.trim() || fallbackTitle;
  const fallbackDesc = `${doctor.title[lang] || doctor.title.en} — ${doctor.hospital[lang] || doctor.hospital.en}.`;
  const description = customSeo?.description?.trim() || fallbackDesc;
  const alternates = buildLanguageAlternates({
    section: 'doctors',
    entity: doctor,
    currentLang: lang,
  });

  return {
    title,
    description,
    ...(customSeo?.focusKeyword ? { keywords: [customSeo.focusKeyword] } : {}),
    alternates,
    openGraph: {
      title,
      description,
      url: alternates.canonical as string,
      images: [{ url: doctor.image, width: 800, height: 800, alt: doctor.name[lang] }],
      type: 'profile',
    },
  };
}

export default async function DoctorDetailPage({ params }: Props) {
  const { lang, slug } = await params;
  if (!isValidLocale(lang)) notFound();

  const store = readCmsStore();
  const doctor = findEntityByAnySlug(store.doctors, slug);
  if (!doctor) notFound();

  const expectedSlug = getEntitySlug(doctor, lang);
  if (decodeURIComponent(slug) !== expectedSlug) {
    permanentRedirect(getLocalizedEntityPath('doctors', doctor, lang));
  }

  const baseUrl = getPublicBaseUrl();
  const pageUrl = `${baseUrl}${getLocalizedEntityPath('doctors', doctor, lang)}`;

  // Notice: ZERO AggregateRating schema
  const physicianSchema = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Physician',
        '@id': `${pageUrl}#physician`,
        name: doctor.name[lang] || doctor.name.en,
        jobTitle: doctor.title[lang] || doctor.title.en,
        medicalSpecialty: doctor.specialtyName[lang] || doctor.specialtyName.en,
        image: doctor.image,
        url: pageUrl,
        hospitalAffiliation: {
          '@type': 'Hospital',
          name: doctor.hospital[lang] || doctor.hospital.en,
        },
        knowsLanguage: doctor.languages,
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
            name: lang === 'ar' ? 'الأطباء والجراحون' : lang === 'fr' ? 'Médecins' : 'Doctors',
            item: `${baseUrl}${getLocalizedPath('/doctors', lang)}`,
          },
          {
            '@type': 'ListItem',
            position: 3,
            name: doctor.name[lang] || doctor.name.en,
            item: pageUrl,
          },
        ],
      },
    ],
  };

  return (
    <>
      <RegisterLocaleAlternates
        paths={{
          ar: getLocalizedEntityPath('doctors', doctor, 'ar'),
          fr: getLocalizedEntityPath('doctors', doctor, 'fr'),
          en: getLocalizedEntityPath('doctors', doctor, 'en'),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(physicianSchema) }}
      />
      <DoctorDetailView initialDoctor={doctor} />
    </>
  );
}

