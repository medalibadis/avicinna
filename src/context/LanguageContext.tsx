'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { Language, translations, TranslationDictionary } from '@/data/translations';

interface LanguageContextType {
  language: Language;
  direction: 'rtl' | 'ltr';
  setLanguage: (lang: Language) => void;
  t: TranslationDictionary;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({
  children,
  initialLanguage = 'ar',
}: {
  children: React.ReactNode;
  initialLanguage?: Language;
}) {
  const [language, setLanguageState] = useState<Language>(initialLanguage);

  // Sync whenever route-level initialLanguage changes (e.g., navigating from / to /fr or /en)
  useEffect(() => {
    setLanguageState(initialLanguage);
    document.documentElement.lang = initialLanguage;
    document.documentElement.dir = initialLanguage === 'ar' ? 'rtl' : 'ltr';
  }, [initialLanguage]);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    try {
      localStorage.setItem('avicinna_lang', lang);
    } catch {
      // ignore storage quota errors
    }
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
  };

  const direction = language === 'ar' ? 'rtl' : 'ltr';
  const t = translations[language] || translations.ar;

  return (
    <LanguageContext.Provider value={{ language, direction, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    return {
      language: 'ar' as Language,
      direction: 'rtl' as 'rtl' | 'ltr',
      setLanguage: () => {},
      t: translations.ar,
    };
  }
  return context;
}
