import type { Metadata } from 'next';
import type { Locale, LocalizedSlugs } from '@/types/cms';

export const SUPPORTED_LOCALES: Locale[] = ['ar', 'fr', 'en'];
export const DEFAULT_LOCALE: Locale = 'ar';

export const DEFAULT_TREATMENT_FR_SLUGS: Record<string, string> = {
  'cardiac-surgery': 'chirurgie-cardiaque',
  neurosurgery: 'neurochirurgie',
  orthopedics: 'orthopedie',
  'organ-transplant': 'greffe-organes',
  'hair-transplant': 'greffe-cheveux',
  dentistry: 'dentisterie',
  oncology: 'oncologie',
  diagnostics: 'diagnostic-medical',
};

export const DEFAULT_ENTITY_UPDATED_AT = '2026-10-20T12:00:00.000Z';

export function isValidLocale(val?: string | null): val is Locale {
  return val === 'ar' || val === 'fr' || val === 'en';
}

export function getPublicBaseUrl(): string {
  const envUrl = process.env.NEXT_PUBLIC_SITE_URL;
  if (envUrl && !envUrl.includes('localhost') && !envUrl.includes('127.0.0.1')) {
    return envUrl.replace(/\/+$/, '');
  }
  return 'https://avicinna.com';
}

export function stripLocalePrefix(pathname: string): {
  locale: Locale;
  barePath: string;
  hasPrefix: boolean;
} {
  const clean = pathname.startsWith('/') ? pathname : `/${pathname}`;
  const match = clean.match(/^\/(ar|fr|en)(\/|$)(.*)/);
  if (match) {
    const loc = match[1] as Locale;
    const rest = match[3] ? `/${match[3]}` : '/';
    return {
      locale: loc,
      barePath: rest === '/' ? '/' : rest.replace(/\/+$/, ''),
      hasPrefix: true,
    };
  }
  return {
    locale: DEFAULT_LOCALE,
    barePath: clean === '/' ? '/' : clean.replace(/\/+$/, ''),
    hasPrefix: false,
  };
}

export function getLocalizedPath(barePath: string, locale: Locale): string {
  const normalized = barePath.startsWith('/') ? barePath : `/${barePath}`;
  const clean = normalized === '/' ? '' : normalized.replace(/\/+$/, '');
  if (locale === 'ar') {
    return clean || '/';
  }
  return `/${locale}${clean}`;
}

export function getEntitySlug(
  entity: { slug: string; id?: string; slugs?: LocalizedSlugs },
  locale: Locale
): string {
  const custom = entity.slugs?.[locale]?.trim();
  if (custom) return custom;
  if (locale === 'fr' && DEFAULT_TREATMENT_FR_SLUGS[entity.slug]) {
    return DEFAULT_TREATMENT_FR_SLUGS[entity.slug];
  }
  return entity.slug;
}

export function getLocalizedEntityPath(
  section: 'treatments' | 'doctors' | 'hospitals' | 'patient-stories' | 'blog',
  entity: { slug: string; id?: string; slugs?: LocalizedSlugs },
  locale: Locale
): string {
  const slug = getEntitySlug(entity, locale);
  return getLocalizedPath(`/${section}/${slug}`, locale);
}

export function findEntityByAnySlug<
  T extends { id?: string; slug: string; slugs?: LocalizedSlugs }
>(items: T[], slugOrId: string): T | undefined {
  const decoded = decodeURIComponent(slugOrId).trim();
  const frFallbackReverse = Object.entries(DEFAULT_TREATMENT_FR_SLUGS).find(
    ([, frSlug]) => frSlug === decoded
  )?.[0];

  return items.find(
    (item) =>
      item.slug === decoded ||
      item.id === decoded ||
      item.slugs?.ar === decoded ||
      item.slugs?.en === decoded ||
      item.slugs?.fr === decoded ||
      (frFallbackReverse && item.slug === frFallbackReverse)
  );
}

export function buildLanguageAlternates(options: {
  section?: 'treatments' | 'doctors' | 'hospitals' | 'patient-stories' | 'blog';
  barePath?: string;
  entity?: { slug: string; id?: string; slugs?: LocalizedSlugs };
  currentLang: Locale;
}): NonNullable<Metadata['alternates']> {
  const baseUrl = getPublicBaseUrl();
  const { section, barePath = '/', entity, currentLang } = options;

  const urlFor = (lang: Locale) => {
    if (section && entity) {
      return `${baseUrl}${getLocalizedEntityPath(section, entity, lang)}`;
    }
    return `${baseUrl}${getLocalizedPath(barePath, lang)}`;
  };

  const arUrl = urlFor('ar');
  const frUrl = urlFor('fr');
  const enUrl = urlFor('en');

  return {
    canonical: urlFor(currentLang),
    languages: {
      ar: arUrl,
      fr: frUrl,
      en: enUrl,
      'x-default': arUrl,
    },
  };
}

export function parseRealDate(dateStr?: string | null, fallback = DEFAULT_ENTITY_UPDATED_AT): Date {
  if (!dateStr) return new Date(fallback);
  const parsed = new Date(dateStr);
  return Number.isNaN(parsed.getTime()) ? new Date(fallback) : parsed;
}

export function slugifyText(input: string): string {
  return (input || '')
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-\u0600-\u06FF]/g, '')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

