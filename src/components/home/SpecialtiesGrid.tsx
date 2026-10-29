'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useLanguage } from '@/context/LanguageContext';
import { useData } from '@/context/DataContext';
import { ArrowRight, ArrowLeft } from 'lucide-react';

export const SpecialtiesGrid: React.FC = () => {
  const { t, language, direction } = useLanguage();
  const { treatments } = useData();
  const isRtl = direction === 'rtl';

  return (
    <section id="specialties" className="py-20 bg-[#F4F7FA] dark:bg-[#0B1120] transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ type: 'spring', stiffness: 350, damping: 28 }}
          className="text-center max-w-3xl mx-auto mb-14"
        >
          <div className="inline-flex items-center gap-2 bg-[#EAF6FF] dark:bg-sky-950/60 text-[#0097FB] dark:text-sky-400 text-xs font-bold uppercase tracking-wider px-3.5 py-1.5 rounded-full mb-3 border border-[#0097FB]/20 dark:border-sky-500/30">
            {t.specialties.badge}
          </div>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-[#032654] dark:text-white tracking-tight mb-4">
            {t.specialties.title}
          </h2>
          <p className="text-sm sm:text-base text-[#64748B] dark:text-slate-400 leading-relaxed">
            {t.specialties.subtitle}
          </p>
        </motion.div>

        {/* Top 4 Featured Specialties Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          {treatments.slice(0, 4).map((treatment, idx) => (
            <motion.div
              key={treatment.slug}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{
                type: 'spring',
                stiffness: 350,
                damping: 26,
                delay: idx * 0.08,
              }}
              whileHover={{ y: -6, transition: { duration: 0.2 } }}
            >
              <Link
                href={`/treatments/${treatment.slug}`}
                className="group relative h-96 rounded-3xl overflow-hidden shadow-md hover:shadow-2xl hover:shadow-sky-500/20 transition-all duration-500 block border border-slate-100 dark:border-slate-800 hover:border-sky-400/60 ring-0 hover:ring-2 hover:ring-sky-400/40"
              >
                {/* Background Image with Ken Burns Zoom & Pan */}
                <img
                  src={treatment.image}
                  alt={treatment.title[language]}
                  className="w-full h-full object-cover group-hover:scale-115 group-hover:-translate-y-2 transition-transform duration-1000 ease-out"
                />

                {/* Dark Navy Overlay Scrim */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#021838] via-[#032654]/70 to-transparent group-hover:via-[#032654]/60 transition-colors" />

                {/* Content Overlay */}
                <div className="absolute inset-0 p-6 flex flex-col justify-end text-white">
                  <span className="text-[11px] font-bold text-[#00BFFF] uppercase tracking-wider mb-1 flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    AVICINNA CLINICAL
                  </span>
                  <h3 className="text-xl font-bold mb-2 group-hover:text-[#00BFFF] transition-colors leading-snug">
                    {treatment.title[language]}
                  </h3>
                  <p className="text-xs text-slate-200/80 line-clamp-2 leading-relaxed mb-3">
                    {treatment.shortDescription[language]}
                  </p>

                  {/* Sliding Statistics Drawer on Hover */}
                  <div className="overflow-hidden rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 p-2.5 transition-all duration-300 group-hover:border-sky-400/40 group-hover:bg-slate-950/60">
                    <div className="flex items-center justify-between text-[11px] font-semibold text-slate-200">
                      <span className="text-emerald-300">
                        {language === 'ar' ? 'نسبة نجاح 99.4%' : language === 'fr' ? 'Succès 99.4%' : '99.4% Success'}
                      </span>
                      <span className="text-sky-300 font-bold flex items-center gap-1">
                        <span>{t.specialties.viewDetails}</span>
                        {isRtl ? <ArrowLeft className="w-3 h-3" /> : <ArrowRight className="w-3 h-3" />}
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* Secondary Specialties Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {treatments.slice(4, 8).map((treatment, idx) => (
            <motion.div
              key={treatment.slug}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{
                type: 'spring',
                stiffness: 350,
                damping: 26,
                delay: idx * 0.06,
              }}
              whileHover={{ y: -4, transition: { duration: 0.2 } }}
            >
              <Link
                href={`/treatments/${treatment.slug}`}
                className="group relative h-64 rounded-3xl overflow-hidden shadow-sm hover:shadow-xl hover:shadow-sky-500/15 transition-all duration-500 block border border-slate-100 dark:border-slate-800 hover:border-sky-400/50 hover:ring-2 hover:ring-sky-400/30"
              >
                <img
                  src={treatment.image}
                  alt={treatment.title[language]}
                  className="w-full h-full object-cover group-hover:scale-115 group-hover:-translate-y-1 transition-transform duration-1000 ease-out"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#021838] via-[#032654]/75 to-transparent" />
                <div className="absolute inset-0 p-5 flex flex-col justify-end text-white">
                  <h3 className="text-base font-bold mb-1 group-hover:text-[#00BFFF] transition-colors leading-snug">
                    {treatment.title[language]}
                  </h3>
                  <div className="flex items-center justify-between text-xs font-semibold text-slate-300 pt-1">
                    <span className="text-[11px] text-emerald-400">
                      {language === 'ar' ? '99.4% نجاح' : '99.4% Success'}
                    </span>
                    <span className="text-[#00BFFF] flex items-center gap-1 font-bold group-hover:text-white transition-colors">
                      <span>{t.specialties.viewDetails}</span>
                      {isRtl ? <ArrowLeft className="w-3 h-3" /> : <ArrowRight className="w-3 h-3" />}
                    </span>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* Bottom Section CTA */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <Link
            href="/treatments"
            className="inline-flex items-center gap-2 bg-white dark:bg-slate-900 hover:bg-[#EAF6FF] dark:hover:bg-slate-800 text-[#032654] dark:text-white hover:text-[#0097FB] dark:hover:text-sky-400 font-bold text-sm px-8 py-3.5 rounded-full border border-slate-200 dark:border-slate-700 hover:border-[#0097FB]/30 shadow-xs transition-all duration-200 hover:shadow-md cursor-pointer"
          >
            <span>{t.specialties.cta}</span>
            {isRtl ? <ArrowLeft className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}
          </Link>
        </motion.div>
      </div>
    </section>
  );
};
