'use client';

import React from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { Language } from '@/data/translations';

export const LanguageSwitcher: React.FC<{ isScrolled?: boolean }> = ({ isScrolled = false }) => {
  const { language, setLanguage } = useLanguage();

  const languages: { code: Language; label: string }[] = [
    { code: 'fr', label: 'FR' },
    { code: 'ar', label: 'AR' },
    { code: 'en', label: 'EN' },
  ];

  return (
    <div
      className={`inline-flex items-center p-1 rounded-full text-xs font-semibold tracking-wider transition-all duration-200 ${
        isScrolled
          ? 'bg-slate-100 border border-slate-200/80 text-slate-700'
          : 'bg-white/10 backdrop-blur-md border border-white/20 text-white'
      }`}
      role="group"
      aria-label="Language Selector"
    >
      {languages.map(({ code, label }) => {
        const isActive = language === code;
        return (
          <button
            key={code}
            onClick={() => setLanguage(code)}
            type="button"
            className={`px-2.5 py-1 rounded-full transition-all duration-200 cursor-pointer ${
              isActive
                ? 'bg-sky-500 text-white shadow-sm font-bold scale-105'
                : isScrolled
                ? 'text-slate-600 hover:text-sky-600'
                : 'text-white/80 hover:text-white'
            }`}
          >
            {label}
          </button>
        );
      })}
    </div>
  );
};
