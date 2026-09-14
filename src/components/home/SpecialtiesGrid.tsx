'use client';

import React from 'react';
import Link from 'next/link';
import { useLanguage } from '@/context/LanguageContext';
import { useData } from '@/context/DataContext';
import { ArrowRight, ArrowLeft } from 'lucide-react';

export const SpecialtiesGrid: React.FC = () => {
  const { t, language, direction } = useLanguage();
  const { treatments } = useData();
  const isRtl = direction === 'rtl';

  return (
    <section id="specialties" className="py-20 bg-[#F4F7FA]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 bg-[#EAF6FF] text-[#0097FB] text-xs font-bold uppercase tracking-wider px-3.5 py-1.5 rounded-full mb-3 border border-[#0097FB]/20">
            {t.specialties.badge}
          </div>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-[#032654] tracking-tight mb-4">
            {t.specialties.title}
          </h2>
          <p className="text-sm sm:text-base text-[#64748B] leading-relaxed">
            {t.specialties.subtitle}
          </p>
        </div>

        {/* Top 4 Featured Specialties Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          {treatments.slice(0, 4).map((treatment) => (
            <Link
              key={treatment.slug}
              href={`/treatments/${treatment.slug}`}
              className="group relative h-96 rounded-3xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 block border border-slate-100"
            >
              {/* Background Image */}
              <img
                src={treatment.image}
                alt={treatment.title[language]}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
              />

              {/* Dark Navy Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#032654] via-[#032654]/65 to-transparent" />

              {/* Content Overlay */}
              <div className="absolute inset-0 p-6 flex flex-col justify-end text-white">
                <span className="text-xs font-semibold text-[#00BFFF] uppercase tracking-wider mb-1">
                  AVICINNA CLINICAL
                </span>
                <h3 className="text-xl font-bold mb-2 group-hover:text-[#00BFFF] transition-colors">
                  {treatment.title[language]}
                </h3>
                <p className="text-xs text-slate-200/80 line-clamp-2 leading-relaxed mb-4">
                  {treatment.shortDescription[language]}
                </p>

                <div className="flex items-center gap-2 text-xs font-bold text-[#00BFFF] group-hover:text-white transition-colors">
                  <span>{t.specialties.viewDetails}</span>
                  {isRtl ? <ArrowLeft className="w-3.5 h-3.5" /> : <ArrowRight className="w-3.5 h-3.5" />}
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Secondary Specialties Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {treatments.slice(4, 8).map((treatment) => (
            <Link
              key={treatment.slug}
              href={`/treatments/${treatment.slug}`}
              className="group relative h-64 rounded-3xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 block border border-slate-100"
            >
              <img
                src={treatment.image}
                alt={treatment.title[language]}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#032654] via-[#032654]/70 to-transparent" />
              <div className="absolute inset-0 p-5 flex flex-col justify-end text-white">
                <h3 className="text-base font-bold mb-1.5 group-hover:text-[#00BFFF] transition-colors">
                  {treatment.title[language]}
                </h3>
                <div className="flex items-center gap-1.5 text-xs font-bold text-[#00BFFF]">
                  <span>{t.specialties.viewDetails}</span>
                  {isRtl ? <ArrowLeft className="w-3 h-3" /> : <ArrowRight className="w-3 h-3" />}
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Bottom Section CTA */}
        <div className="text-center">
          <Link
            href="/treatments"
            className="inline-flex items-center gap-2 bg-white hover:bg-[#EAF6FF] text-[#032654] hover:text-[#0097FB] font-bold text-sm px-8 py-3.5 rounded-full border border-slate-200 hover:border-[#0097FB]/30 shadow-xs transition-all duration-200 hover:shadow-md"
          >
            <span>{t.specialties.cta}</span>
            {isRtl ? <ArrowLeft className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}
          </Link>
        </div>
      </div>
    </section>
  );
};
