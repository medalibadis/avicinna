'use client';

import React from 'react';
import Link from 'next/link';
import { useLanguage } from '@/context/LanguageContext';
import { useData } from '@/context/DataContext';
import { getLocalizedEntityPath, getLocalizedPath } from '@/lib/i18nRoutes';
import { ArrowRight, ArrowLeft } from 'lucide-react';

export const SpecialtiesGrid: React.FC = () => {
  const { t, language, direction } = useLanguage();
  const { treatments } = useData();
  const isRtl = direction === 'rtl';

  const visibleTreatments = treatments.slice(0, 8);

  return (
    <section id="specialties" className="py-14 sm:py-20 bg-[#F4F7FA] dark:bg-[#0B1120] transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-8 sm:mb-14">
          <div className="inline-flex items-center gap-2 bg-[#EAF6FF] dark:bg-sky-950/60 text-[#0097FB] dark:text-sky-400 text-xs font-bold uppercase tracking-wider px-3.5 py-1.5 rounded-full mb-3 border border-[#0097FB]/20 dark:border-sky-500/30">
            {t.specialties.badge}
          </div>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-[#032654] dark:text-white tracking-tight mb-3 sm:mb-4">
            {t.specialties.title}
          </h2>
          <p className="text-sm sm:text-base text-[#64748B] dark:text-slate-400 leading-relaxed">
            {t.specialties.subtitle}
          </p>
        </div>

        {/* Multi-row Balanced Grid: 2x4 on Mobile & Tablet (no slider!), 4x2 (4|4) on Desktop */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-5 md:gap-6 mb-8 sm:mb-10">
          {visibleTreatments.map((treatment, idx) => (
            <div
              key={treatment.slug}
              className="transition-transform duration-300 hover:-translate-y-1.5"
            >
              <Link
                href={getLocalizedEntityPath('treatments', treatment, language)}
                className={`group relative h-[215px] sm:h-[270px] ${
                  idx < 4 ? 'lg:h-96' : 'lg:h-64'
                } rounded-2xl sm:rounded-3xl overflow-hidden shadow-md hover:shadow-2xl hover:shadow-sky-500/20 transition-all duration-500 block border border-slate-100 dark:border-slate-800 hover:border-sky-400/60`}
              >
                <img
                  src={treatment.image}
                  alt={treatment.title[language]}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                  loading={idx < 4 ? 'eager' : 'lazy'}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#021838]/95 via-[#032654]/60 to-[#021838]/15" />
                <div className="absolute inset-0 p-3 sm:p-5 md:p-6 flex flex-col justify-end text-white">
                  {idx < 4 && (
                    <span className="hidden sm:flex text-[11px] font-bold text-[#00BFFF] uppercase tracking-wider mb-1 items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                      AVICINNA CLINICAL
                    </span>
                  )}
                  <h3 className="text-sm sm:text-lg lg:text-xl font-bold mb-1.5 text-white leading-snug group-hover:text-[#00BFFF] transition-colors line-clamp-2">
                    {treatment.title[language]}
                  </h3>
                  {idx < 4 && (
                    <div className="hidden sm:block mb-3">
                      <p className="line-clamp-2 text-xs text-slate-200/85 leading-relaxed">
                        {treatment.shortDescription[language]}
                      </p>
                    </div>
                  )}
                  <div className="rounded-xl sm:rounded-2xl bg-white/12 backdrop-blur-md border border-white/15 px-2.5 py-1.5 sm:p-2.5">
                    <div className="flex items-center justify-between text-[10.5px] sm:text-[11px] font-semibold text-slate-200 gap-1">
                      <span className="hidden sm:inline text-emerald-300 font-bold">
                        {language === 'ar' ? 'اعتماد JCI' : language === 'fr' ? 'Certifié JCI' : 'JCI Accredited'}
                      </span>
                      <span className="text-sky-300 font-bold flex items-center gap-1 ms-auto sm:ms-0">
                        <span className="truncate">{t.specialties.viewDetails}</span>
                        {isRtl ? <ArrowLeft className="w-3 h-3 sm:w-3.5 sm:h-3.5 shrink-0" /> : <ArrowRight className="w-3 h-3 sm:w-3.5 sm:h-3.5 shrink-0" />}
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            </div>
          ))}
        </div>

        {/* Bottom Section CTA */}
        <div className="text-center">
          <Link
            href={getLocalizedPath('/treatments', language)}
            className="inline-flex items-center gap-2 bg-white dark:bg-slate-900 hover:bg-[#EAF6FF] dark:hover:bg-slate-800 text-[#032654] dark:text-white hover:text-[#0097FB] dark:hover:text-sky-400 font-bold text-sm px-8 py-3.5 rounded-full border border-slate-200 dark:border-slate-700 shadow-xs transition-all duration-200 hover:shadow-md"
          >
            <span>{t.specialties.cta}</span>
            {isRtl ? <ArrowLeft className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}
          </Link>
        </div>
      </div>
    </section>
  );
};
