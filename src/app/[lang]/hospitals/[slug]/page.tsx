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
import { HospitalDetailView } from '@/components/pages/HospitalDetailView';

export const dynamic = 'force-dynamic';

type Props = {
  params: Promise<{ lang: string; slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang, slug } = await params;
  if (!isValidLocale(lang)) return { robots: { index: false, follow: false } };

  const store = readCmsStore();
  const hospital = findEntityByAnySlug(store.hospitals, slug);
  if (!hospital) {
    return {
      title: 'Hospital Not Found | AVICINNA',
      robots: { index: false, follow: false },
    };
  }

  const customSeo = hospital.seo?.[lang];
  const fallbackTitle =
    lang === 'ar'
      ? `${hospital.name.ar} | مستشفيات تركيا المعتمدة JCI - أفيسينا`
      : lang === 'fr'
      ? `${hospital.name.fr || hospital.name.en} | Hôpital Accrédité JCI Turquie - AVICINNA`
      : `${hospital.name.en} | JCI-Accredited Hospital Turkey - AVICINNA`;
  const title = customSeo?.title?.trim() || fallbackTitle;
  const description =
    customSeo?.description?.trim() ||
    hospital.description[lang] ||
    hospital.type?.[lang] ||
    hospital.description.en;
  const alternates = buildLanguageAlternates({
    section: 'hospitals',
    entity: hospital,
    currentLang: lang,
  });

  const baseUrl = getPublicBaseUrl();
  const imgUrl = hospital.image.startsWith('http') ? hospital.image : `${baseUrl}${hospital.image}`;

  return {
    title,
    description,
    ...(customSeo?.focusKeyword ? { keywords: [customSeo.focusKeyword] } : {}),
    alternates,
    openGraph: {
      title,
      description,
      url: alternates.canonical as string,
      images: [{ url: imgUrl, width: 1200, height: 630, alt: hospital.name[lang] }],
      type: 'website',
    },
  };
}

export default async function HospitalDetailPage({ params }: Props) {
  const { lang, slug } = await params;
  if (!isValidLocale(lang)) notFound();

  const store = readCmsStore();
  const hospital = findEntityByAnySlug(store.hospitals, slug);
  if (!hospital) notFound();

  const expectedSlug = getEntitySlug(hospital, lang);
  if (decodeURIComponent(slug) !== expectedSlug) {
    permanentRedirect(getLocalizedEntityPath('hospitals', hospital, lang));
  }

  const baseUrl = getPublicBaseUrl();
  const pageUrl = `${baseUrl}${getLocalizedEntityPath('hospitals', hospital, lang)}`;
  const imgUrl = hospital.image.startsWith('http') ? hospital.image : `${baseUrl}${hospital.image}`;

  // Notice: ZERO AggregateRating / Review schema
  const schema = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Hospital',
        '@id': `${pageUrl}#hospital`,
        name: hospital.name[lang] || hospital.name.en,
        alternateName: [hospital.name.ar, hospital.name.en, hospital.name.fr],
        description: hospital.description[lang] || hospital.description.en,
        image: imgUrl,
        url: pageUrl,
        address: {
          '@type': 'PostalAddress',
          streetAddress: hospital.address[lang] || hospital.address.en,
          addressLocality: hospital.city[lang] || hospital.city.en,
          addressCountry: 'TR',
        },
        medicalSpecialty: hospital.specialties,
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
            name: lang === 'ar' ? 'المستشفيات الشريكة' : lang === 'fr' ? 'Hôpitaux' : 'Hospitals',
            item: `${baseUrl}${getLocalizedPath('/hospitals', lang)}`,
          },
          {
            '@type': 'ListItem',
            position: 3,
            name: hospital.name[lang] || hospital.name.en,
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
          ar: getLocalizedEntityPath('hospitals', hospital, 'ar'),
          fr: getLocalizedEntityPath('hospitals', hospital, 'fr'),
          en: getLocalizedEntityPath('hospitals', hospital, 'en'),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
      <HospitalDetailView initialHospital={hospital} initialDoctors={store.doctors} />
    </>
  );
}

