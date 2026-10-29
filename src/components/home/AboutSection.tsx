'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useLanguage } from '@/context/LanguageContext';
import { ShieldCheck, HeartHandshake, ArrowRight, ArrowLeft } from 'lucide-react';
import { AboutVideoMedallion } from '@/components/public/BrandLogoMotion';

export const AboutSection: React.FC = () => {
  const { t, direction, language } = useLanguage();
  const isRtl = direction === 'rtl';

  return (
    <section className="py-20 bg-white dark:bg-[#080E1A] transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Visual Column with Badge */}
          <motion.div
            initial={{ opacity: 0, x: isRtl ? 25 : -25 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ type: 'spring', stiffness: 350, damping: 28 }}
            className="relative order-2 lg:order-1"
          >
            <div className="relative rounded-3xl overflow-hidden shadow-2xl border border-slate-100 dark:border-slate-800">
              <img
                src="https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?q=80&w=1200&auto=format&fit=crop"
                alt="AVICINNA Partner Hospital Interior"
                className="w-full h-[460px] sm:h-[520px] object-cover hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
            </div>

            {/* 10+ Years Excellence Floating Video Medallion (Placement C) */}
            <div className={`absolute -bottom-6 z-20 ${isRtl ? 'right-2 sm:right-6' : 'left-2 sm:left-6'}`}>
              <AboutVideoMedallion locale={language as any} />
            </div>
          </motion.div>

          {/* Text Content Column */}
          <motion.div
            initial={{ opacity: 0, x: isRtl ? -25 : 25 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ type: 'spring', stiffness: 350, damping: 28 }}
            className="order-1 lg:order-2 space-y-6"
          >
            <div className="inline-flex items-center gap-2 bg-[#EAF6FF] dark:bg-sky-950/60 text-[#0097FB] dark:text-sky-400 text-xs font-bold uppercase tracking-wider px-3.5 py-1.5 rounded-full border border-[#0097FB]/20 dark:border-sky-500/30">
              {t.about.badge}
            </div>

            <h2 className="text-2xl sm:text-4xl font-extrabold text-[#032654] dark:text-white tracking-tight leading-tight">
              {t.about.heading}
            </h2>

            <p className="text-base text-[#64748B] dark:text-slate-300 leading-relaxed">
              {t.about.lead}
            </p>

            {/* Two Highlighted Feature Rows */}
            <div className="space-y-4 pt-2">
              <motion.div
                whileHover={{ y: -3 }}
                transition={{ duration: 0.18 }}
                className="flex items-start gap-4 p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-xs cursor-pointer"
              >
                <div className="w-10 h-10 rounded-xl bg-[#EAF6FF] dark:bg-sky-950/60 text-[#0097FB] dark:text-sky-400 border border-[#0097FB]/20 dark:border-sky-500/30 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-base font-bold text-[#163B63] dark:text-slate-100 mb-1">
                    {t.about.feature1Title}
                  </h4>
                  <p className="text-sm text-[#64748B] dark:text-slate-400 leading-relaxed">
                    {t.about.feature1Desc}
                  </p>
                </div>
              </motion.div>

              <motion.div
                whileHover={{ y: -3 }}
                transition={{ duration: 0.18 }}
                className="flex items-start gap-4 p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-xs cursor-pointer"
              >
                <div className="w-10 h-10 rounded-xl bg-[#EAF6FF] dark:bg-sky-950/60 text-[#0097FB] dark:text-sky-400 border border-[#0097FB]/20 dark:border-sky-500/30 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <HeartHandshake className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-base font-bold text-[#163B63] dark:text-slate-100 mb-1">
                    {t.about.feature2Title}
                  </h4>
                  <p className="text-sm text-[#64748B] dark:text-slate-400 leading-relaxed">
                    {t.about.feature2Desc}
                  </p>
                </div>
              </motion.div>
            </div>

            {/* CTA */}
            <div className="pt-4">
              <Link
                href="/about"
                className="inline-flex items-center gap-2 bg-[#032654] hover:bg-[#163B63] dark:bg-sky-600 dark:hover:bg-sky-500 text-white font-semibold text-sm px-7 py-3.5 rounded-full shadow-md shadow-[#032654]/20 transition-all duration-200 cursor-pointer"
              >
                <span>{t.about.cta}</span>
                {isRtl ? <ArrowLeft className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
