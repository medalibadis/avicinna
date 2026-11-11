import { MetadataRoute } from 'next';
import { readCmsStore } from '@/lib/cmsStore';
import {
  DEFAULT_ENTITY_UPDATED_AT,
  SUPPORTED_LOCALES,
  getLocalizedEntityPath,
  getLocalizedPath,
  getPublicBaseUrl,
  parseRealDate,
} from '@/lib/i18nRoutes';

export const dynamic = 'force-dynamic';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = getPublicBaseUrl();
  const store = readCmsStore();
  const routes: MetadataRoute.Sitemap = [];

  const staticPaths: Array<{ path: string; changeFrequency: 'weekly' | 'monthly'; priority: number }> = [
    { path: '/', changeFrequency: 'weekly', priority: 1.0 },
    { path: '/treatments', changeFrequency: 'weekly', priority: 0.9 },
    { path: '/doctors', changeFrequency: 'weekly', priority: 0.9 },
    { path: '/hospitals', changeFrequency: 'weekly', priority: 0.85 },
    { path: '/patient-stories', changeFrequency: 'weekly', priority: 0.85 },
    { path: '/blog', changeFrequency: 'weekly', priority: 0.85 },
    { path: '/about', changeFrequency: 'monthly', priority: 0.7 },
    { path: '/contact', changeFrequency: 'monthly', priority: 0.8 },
  ];

  const staticLastMod = parseRealDate(DEFAULT_ENTITY_UPDATED_AT);

  // 1. Static localized pages across AR (root), FR (/fr/...), EN (/en/...)
  for (const item of staticPaths) {
    const languages = {
      ar: `${baseUrl}${getLocalizedPath(item.path, 'ar')}`,
      fr: `${baseUrl}${getLocalizedPath(item.path, 'fr')}`,
      en: `${baseUrl}${getLocalizedPath(item.path, 'en')}`,
      'x-default': `${baseUrl}${getLocalizedPath(item.path, 'ar')}`,
    };
    for (const locale of SUPPORTED_LOCALES) {
      routes.push({
        url: languages[locale],
        lastModified: staticLastMod,
        changeFrequency: item.changeFrequency,
        priority: locale === 'ar' ? item.priority : Math.max(0.5, item.priority - 0.05),
        alternates: { languages },
      });
    }
  }

  // 2. Treatments
  for (const t of store.treatments) {
    const languages = {
      ar: `${baseUrl}${getLocalizedEntityPath('treatments', t, 'ar')}`,
      fr: `${baseUrl}${getLocalizedEntityPath('treatments', t, 'fr')}`,
      en: `${baseUrl}${getLocalizedEntityPath('treatments', t, 'en')}`,
      'x-default': `${baseUrl}${getLocalizedEntityPath('treatments', t, 'ar')}`,
    };
    const lastMod = parseRealDate(t.updatedAt, DEFAULT_ENTITY_UPDATED_AT);
    for (const locale of SUPPORTED_LOCALES) {
      routes.push({
        url: languages[locale],
        lastModified: lastMod,
        changeFrequency: 'weekly',
        priority: 0.85,
        alternates: { languages },
      });
    }
  }

  // 3. Doctors
  for (const d of store.doctors) {
    const languages = {
      ar: `${baseUrl}${getLocalizedEntityPath('doctors', d, 'ar')}`,
      fr: `${baseUrl}${getLocalizedEntityPath('doctors', d, 'fr')}`,
      en: `${baseUrl}${getLocalizedEntityPath('doctors', d, 'en')}`,
      'x-default': `${baseUrl}${getLocalizedEntityPath('doctors', d, 'ar')}`,
    };
    const lastMod = parseRealDate(d.updatedAt, DEFAULT_ENTITY_UPDATED_AT);
    for (const locale of SUPPORTED_LOCALES) {
      routes.push({
        url: languages[locale],
        lastModified: lastMod,
        changeFrequency: 'monthly',
        priority: 0.8,
        alternates: { languages },
      });
    }
  }

  // 4. Hospitals
  for (const h of store.hospitals) {
    const languages = {
      ar: `${baseUrl}${getLocalizedEntityPath('hospitals', h, 'ar')}`,
      fr: `${baseUrl}${getLocalizedEntityPath('hospitals', h, 'fr')}`,
      en: `${baseUrl}${getLocalizedEntityPath('hospitals', h, 'en')}`,
      'x-default': `${baseUrl}${getLocalizedEntityPath('hospitals', h, 'ar')}`,
    };
    const lastMod = parseRealDate(h.updatedAt, DEFAULT_ENTITY_UPDATED_AT);
    for (const locale of SUPPORTED_LOCALES) {
      routes.push({
        url: languages[locale],
        lastModified: lastMod,
        changeFrequency: 'monthly',
        priority: 0.8,
        alternates: { languages },
      });
    }
  }

  // 5. Patient Stories
  for (const s of store.stories) {
    const languages = {
      ar: `${baseUrl}${getLocalizedEntityPath('patient-stories', s, 'ar')}`,
      fr: `${baseUrl}${getLocalizedEntityPath('patient-stories', s, 'fr')}`,
      en: `${baseUrl}${getLocalizedEntityPath('patient-stories', s, 'en')}`,
      'x-default': `${baseUrl}${getLocalizedEntityPath('patient-stories', s, 'ar')}`,
    };
    const lastMod = parseRealDate(s.updatedAt, DEFAULT_ENTITY_UPDATED_AT);
    for (const locale of SUPPORTED_LOCALES) {
      routes.push({
        url: languages[locale],
        lastModified: lastMod,
        changeFrequency: 'monthly',
        priority: 0.75,
        alternates: { languages },
      });
    }
  }

  // 6. Medical Blog Articles (real updatedDate / updatedAt / publishedDate)
  for (const art of store.articles) {
    const languages = {
      ar: `${baseUrl}${getLocalizedEntityPath('blog', art, 'ar')}`,
      fr: `${baseUrl}${getLocalizedEntityPath('blog', art, 'fr')}`,
      en: `${baseUrl}${getLocalizedEntityPath('blog', art, 'en')}`,
      'x-default': `${baseUrl}${getLocalizedEntityPath('blog', art, 'ar')}`,
    };
    const lastMod = parseRealDate(
      art.updatedAt || art.updatedDate || art.publishedDate,
      DEFAULT_ENTITY_UPDATED_AT
    );
    for (const locale of SUPPORTED_LOCALES) {
      routes.push({
        url: languages[locale],
        lastModified: lastMod,
        changeFrequency: 'weekly',
        priority: 0.8,
        alternates: { languages },
      });
    }
  }

  // 7. Standalone CMS Pages (/privacy, /terms, custom published pages)
  for (const page of store.pages.filter((p) => p.status === 'published')) {
    const getPageSlug = (loc: 'ar' | 'fr' | 'en') => page.slugs?.[loc]?.trim() || page.slug;
    const languages = {
      ar: `${baseUrl}${getLocalizedPath(`/${getPageSlug('ar')}`, 'ar')}`,
      fr: `${baseUrl}${getLocalizedPath(`/${getPageSlug('fr')}`, 'fr')}`,
      en: `${baseUrl}${getLocalizedPath(`/${getPageSlug('en')}`, 'en')}`,
      'x-default': `${baseUrl}${getLocalizedPath(`/${getPageSlug('ar')}`, 'ar')}`,
    };
    const lastMod = parseRealDate(page.updatedAt || page.createdAt, DEFAULT_ENTITY_UPDATED_AT);
    for (const locale of SUPPORTED_LOCALES) {
      routes.push({
        url: languages[locale],
        lastModified: lastMod,
        changeFrequency: 'monthly',
        priority: 0.5,
        alternates: { languages },
      });
    }
  }

  return routes;
}
