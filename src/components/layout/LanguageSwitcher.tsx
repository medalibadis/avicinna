'use client';

import React from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useLanguage } from '@/context/LanguageContext';
import { useLocaleAlternates } from '@/context/LocaleAlternatesContext';
import { DopamineLanguageSwitcher } from '@/components/ui/DopaminePrimitives';
import { getLocalizedPath, stripLocalePrefix } from '@/lib/i18nRoutes';
import type { Language } from '@/data/translations';

export const LanguageSwitcher: React.FC<{ isScrolled?: boolean; id?: string }> = ({
  isScrolled = false,
  id = 'default',
}) => {
  const { language, setLanguage } = useLanguage();
  const { alternates } = useLocaleAlternates();
  const pathname = usePathname() || '/';
  const router = useRouter();

  const handleLanguageChange = (nextLang: Language) => {
    if (nextLang === language) return;
    setLanguage(nextLang);

    // 1. If the current page registered explicit localized slug alternates (e.g., [slug] pages), navigate straight there
    if (alternates?.[nextLang]) {
      router.push(alternates[nextLang]!);
      return;
    }

    // 2. Otherwise preserve the bare path under the target language route prefix
    const { barePath } = stripLocalePrefix(pathname);
    const targetUrl = getLocalizedPath(barePath, nextLang);
    router.push(targetUrl);
  };

  return (
    <DopamineLanguageSwitcher
      activeLang={language}
      onChange={handleLanguageChange}
      isScrolled={isScrolled}
      id={id}
    />
  );
};
