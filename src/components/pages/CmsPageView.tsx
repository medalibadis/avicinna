'use client';

import React from 'react';
import Link from 'next/link';
import { useLanguage } from '@/context/LanguageContext';
import { useData } from '@/context/DataContext';
import { getLocalizedPath } from '@/lib/i18nRoutes';
import type { CmsPage } from '@/types/cms';
import { ChevronLeft, ChevronRight, ShieldCheck, Calendar } from 'lucide-react';

export function CmsPageView({ initialPage }: { initialPage: CmsPage }) {
  const { language, direction } = useLanguage();
  const { pages } = useData();
  const ArrowIcon = direction === 'rtl' ? ChevronLeft : ChevronRight;

  const page = pages.find((p) => p.id === initialPage.id) || initialPage;
  const title = page.title?.[language] || page.title?.ar || '';
  const subtitle = page.subtitle?.[language] || page.subtitle?.ar || '';
  const html = page.contentHtml?.[language] || page.contentHtml?.ar || '';

  return (
    <div className="pt-24 pb-20 bg-slate-50 dark:bg-[#080E1A] min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <nav className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 mb-4">
          <Link href={getLocalizedPath('/', language)} className="hover:text-sky-600">
            {language === 'ar' ? 'الرئيسية' : language === 'fr' ? 'Accueil' : 'Home'}
          </Link>
          <ArrowIcon className="w-3.5 h-3.5" />
          <span className="font-semibold text-slate-900 dark:text-white">{title}</span>
        </nav>

        <article className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-12 shadow-sm border border-slate-200/80 dark:border-slate-800 space-y-6">
          <header className="border-b border-slate-100 dark:border-slate-800 pb-6 space-y-3">
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-sky-600 dark:text-sky-400 bg-sky-50 dark:bg-sky-950/60 px-3 py-1 rounded-full">
              <ShieldCheck className="w-4 h-4" />
              <span>AVICINNA LEGAL & GOVERNANCE</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-black text-[#032654] dark:text-white leading-tight">
              {title}
            </h1>
            {subtitle && (
              <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed">
                {subtitle}
              </p>
            )}
            <div className="flex items-center gap-2 text-xs text-slate-400 font-mono">
              <Calendar className="w-3.5 h-3.5" />
              <span>
                {language === 'ar' ? 'آخر تحديث:' : language === 'fr' ? 'Dernière mise à jour :' : 'Last updated:'}{' '}
                {page.updatedAt?.split('T')[0]}
              </span>
            </div>
          </header>

          <div
            className="max-w-none text-slate-700 dark:text-slate-300 leading-relaxed text-sm sm:text-base [&_h2]:text-xl [&_h2]:font-extrabold [&_h2]:text-[#032654] dark:[&_h2]:text-white [&_h2]:mt-7 [&_h2]:mb-3 [&_h3]:text-lg [&_h3]:font-bold [&_h3]:mt-5 [&_h3]:mb-2 [&_p]:mb-4 [&_ul]:list-disc [&_ul]:ps-6 [&_ul]:space-y-2 [&_ul]:mb-4 [&_ol]:list-decimal [&_ol]:ps-6 [&_ol]:space-y-2 [&_a]:text-[#0097FB] [&_a]:underline"
            dangerouslySetInnerHTML={{ __html: html }}
          />
        </article>
      </div>
    </div>
  );
}

