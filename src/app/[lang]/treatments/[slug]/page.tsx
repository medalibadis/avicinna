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
import { TreatmentDetailView } from '@/components/pages/TreatmentDetailView';

export const dynamic = 'force-dynamic';

type Props = {
  params: Promise<{ lang: string; slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang, slug } = await params;
  if (!isValidLocale(lang)) return { robots: { index: false, follow: false } };

  const store = readCmsStore();
  const treatment = findEntityByAnySlug(store.treatments, slug);
  if (!treatment) {
    return {
      title: 'Specialty Not Found | AVICINNA',
      robots: { index: false, follow: false },
    };
  }

  const customSeo = treatment.seo?.[lang];
  const fallbackTitle =
    lang === 'ar'
      ? `${treatment.title.ar} في تركيا | أفيسينا للرعاية الطبية`
      : lang === 'fr'
      ? `${treatment.title.fr || treatment.title.en} en Turquie | AVICINNA Istanbul`
      : `${treatment.title.en} in Turkey | AVICINNA Accredited Hospitals`;
  const title = customSeo?.title?.trim() || fallbackTitle;
  const description =
    customSeo?.description?.trim() || treatment.shortDescription[lang] || treatment.shortDescription.en;
  const alternates = buildLanguageAlternates({
    section: 'treatments',
    entity: treatment,
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
      images: [{ url: treatment.image, width: 1200, height: 630, alt: treatment.title[lang] }],
      type: 'website',
    },
  };
}

export default async function TreatmentDetailPage({ params }: Props) {
  const { lang, slug } = await params;
  if (!isValidLocale(lang)) notFound();

  const store = readCmsStore();
  const treatment = findEntityByAnySlug(store.treatments, slug);
  if (!treatment) notFound();

  const expectedSlug = getEntitySlug(treatment, lang);
  if (decodeURIComponent(slug) !== expectedSlug) {
    permanentRedirect(getLocalizedEntityPath('treatments', treatment, lang));
  }

  const baseUrl = getPublicBaseUrl();
  const pageUrl = `${baseUrl}${getLocalizedEntityPath('treatments', treatment, lang)}`;

  const faqSchema =
    treatment.faqs.length > 0
      ? {
          '@context': 'https://schema.org',
          '@type': 'FAQPage',
          mainEntity: treatment.faqs.map((faq) => ({
            '@type': 'Question',
            name: faq.question[lang] || faq.question.en,
            acceptedAnswer: {
              '@type': 'Answer',
              text: faq.answer[lang] || faq.answer.en,
            },
          })),
        }
      : null;

  const procedureSchema = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'MedicalProcedure',
        name: treatment.title[lang] || treatment.title.en,
        description: treatment.shortDescription[lang] || treatment.shortDescription.en,
        image: treatment.image,
        url: pageUrl,
        procedureType: 'https://schema.org/SurgicalProcedure',
        howPerformed: treatment.fullOverview[lang] || treatment.fullOverview.en,
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
            name: lang === 'ar' ? 'التخصصات الطبية' : lang === 'fr' ? 'Traitements' : 'Treatments',
            item: `${baseUrl}${getLocalizedPath('/treatments', lang)}`,
          },
          {
            '@type': 'ListItem',
            position: 3,
            name: treatment.title[lang] || treatment.title.en,
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
          ar: getLocalizedEntityPath('treatments', treatment, 'ar'),
          fr: getLocalizedEntityPath('treatments', treatment, 'fr'),
          en: getLocalizedEntityPath('treatments', treatment, 'en'),
        }}
      />
      {faqSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
        />
      )}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(procedureSchema) }}
      />
      <TreatmentDetailView initialTreatment={treatment} />
    </>
  );
}

