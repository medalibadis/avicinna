import React from 'react';
import type { Metadata } from 'next';
import { notFound, permanentRedirect } from 'next/navigation';
import { readCmsStore } from '@/lib/cmsStore';
import {
  getLocalizedPath,
  getPublicBaseUrl,
  isValidLocale,
} from '@/lib/i18nRoutes';
import { RegisterLocaleAlternates } from '@/context/LocaleAlternatesContext';
import { CmsPageView } from '@/components/pages/CmsPageView';
import type { CmsPage, Locale } from '@/types/cms';

export const dynamic = 'force-dynamic';

type Props = {
  params: Promise<{ lang: string; pageSlug: string }>;
};

function findPublishedPage(pages: CmsPage[], pageSlug: string): CmsPage | undefined {
  const clean = decodeURIComponent(pageSlug).trim().toLowerCase();
  return pages.find(
    (p) =>
      p.status === 'published' &&
      (p.slug.toLowerCase() === clean ||
        p.slugs?.ar?.toLowerCase() === clean ||
        p.slugs?.fr?.toLowerCase() === clean ||
        p.slugs?.en?.toLowerCase() === clean)
  );
}

function getPageSlugForLocale(page: CmsPage, lang: Locale): string {
  return page.slugs?.[lang]?.trim() || page.slug;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang, pageSlug } = await params;
  if (!isValidLocale(lang)) return { robots: { index: false, follow: false } };

  const store = readCmsStore();
  const page = findPublishedPage(store.pages, pageSlug);
  if (!page) {
    return {
      title: 'Page Not Found | AVICINNA',
      robots: { index: false, follow: false },
    };
  }

  const baseUrl = getPublicBaseUrl();
  const customSeo = page.seo?.[lang];
  const title = customSeo?.title?.trim() || `${page.title[lang] || page.title.ar} | AVICINNA`;
  const description = customSeo?.description?.trim() || page.subtitle?.[lang] || page.title[lang];

  const arUrl = `${baseUrl}${getLocalizedPath(`/${getPageSlugForLocale(page, 'ar')}`, 'ar')}`;
  const frUrl = `${baseUrl}${getLocalizedPath(`/${getPageSlugForLocale(page, 'fr')}`, 'fr')}`;
  const enUrl = `${baseUrl}${getLocalizedPath(`/${getPageSlugForLocale(page, 'en')}`, 'en')}`;

  return {
    title,
    description,
    alternates: {
      canonical: lang === 'ar' ? arUrl : lang === 'fr' ? frUrl : enUrl,
      languages: {
        ar: arUrl,
        fr: frUrl,
        en: enUrl,
        'x-default': arUrl,
      },
    },
  };
}

export default async function StandaloneCmsPage({ params }: Props) {
  const { lang, pageSlug } = await params;
  if (!isValidLocale(lang)) notFound();

  const store = readCmsStore();
  const page = findPublishedPage(store.pages, pageSlug);
  if (!page) {
    notFound();
  }

  const expectedSlug = getPageSlugForLocale(page, lang);
  if (decodeURIComponent(pageSlug) !== expectedSlug) {
    permanentRedirect(getLocalizedPath(`/${expectedSlug}`, lang));
  }

  return (
    <>
      <RegisterLocaleAlternates
        paths={{
          ar: getLocalizedPath(`/${getPageSlugForLocale(page, 'ar')}`, 'ar'),
          fr: getLocalizedPath(`/${getPageSlugForLocale(page, 'fr')}`, 'fr'),
          en: getLocalizedPath(`/${getPageSlugForLocale(page, 'en')}`, 'en'),
        }}
      />
      <CmsPageView initialPage={page} />
    </>
  );
}

