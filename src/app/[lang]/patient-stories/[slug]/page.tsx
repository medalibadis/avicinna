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
import { PatientStoryDetailView } from '@/components/pages/PatientStoryDetailView';

export const dynamic = 'force-dynamic';

type Props = {
  params: Promise<{ lang: string; slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang, slug } = await params;
  if (!isValidLocale(lang)) return { robots: { index: false, follow: false } };

  const store = readCmsStore();
  const story = findEntityByAnySlug(store.stories, slug);
  if (!story) {
    return {
      title: 'Patient Story Not Found | AVICINNA',
      robots: { index: false, follow: false },
    };
  }

  const customSeo = story.seo?.[lang];
  const title = customSeo?.title?.trim() || `${story.title[lang] || story.title.ar} | AVICINNA`;
  const description = customSeo?.description?.trim() || story.shortStory[lang] || story.shortStory.ar;
  const alternates = buildLanguageAlternates({
    section: 'patient-stories',
    entity: story,
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
      images: [{ url: story.image, width: 1200, height: 630, alt: story.title[lang] }],
      type: 'article',
    },
  };
}

export default async function PatientStoryDetailPage({ params }: Props) {
  const { lang, slug } = await params;
  if (!isValidLocale(lang)) notFound();

  const store = readCmsStore();
  const story = findEntityByAnySlug(store.stories, slug);
  if (!story) notFound();

  const expectedSlug = getEntitySlug(story, lang);
  if (decodeURIComponent(slug) !== expectedSlug) {
    permanentRedirect(getLocalizedEntityPath('patient-stories', story, lang));
  }

  const baseUrl = getPublicBaseUrl();
  const pageUrl = `${baseUrl}${getLocalizedEntityPath('patient-stories', story, lang)}`;

  // Notice: ZERO Review / Rating schema
  const breadcrumbSchema = {
    '@context': 'https://schema.org',
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
        name: lang === 'ar' ? 'قصص المرضى' : lang === 'fr' ? 'Témoignages' : 'Patient Stories',
        item: `${baseUrl}${getLocalizedPath('/patient-stories', lang)}`,
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: story.title[lang] || story.title.ar,
        item: pageUrl,
      },
    ],
  };

  return (
    <>
      <RegisterLocaleAlternates
        paths={{
          ar: getLocalizedEntityPath('patient-stories', story, 'ar'),
          fr: getLocalizedEntityPath('patient-stories', story, 'fr'),
          en: getLocalizedEntityPath('patient-stories', story, 'en'),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <PatientStoryDetailView initialStory={story} />
    </>
  );
}

