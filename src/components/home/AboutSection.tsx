'use client';

import React from 'react';
import Link from 'next/link';
import { useLanguage } from '@/context/LanguageContext';
import { ShieldCheck, HeartHandshake, ArrowRight, ArrowLeft, CheckCircle2 } from 'lucide-react';

export const AboutSection: React.FC = () => {
  const { t, direction, language } = useLanguage();
  const isRtl = direction === 'rtl';

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Visual Column with Badge */}
          <div className="relative order-2 lg:order-1">
            <div className="relative rounded-3xl overflow-hidden shadow-2xl border border-slate-100">
              <img
                src="https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?q=80&w=1200&auto=format&fit=crop"
                alt="AVICINNA Partner Hospital Interior"
                className="w-full h-[460px] sm:h-[520px] object-cover hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
            </div>

            {/* Experience Badge Overlay */}
            <div
              className={`absolute -bottom-6 bg-[#0A192F] text-white p-5 sm:p-6 rounded-2xl shadow-xl border border-sky-400/30 flex items-center gap-4 ${
                isRtl ? '-right-4 sm:right-6' : '-left-4 sm:left-6'
              }`}
            >
              <div className="text-3xl sm:text-4xl font-black text-sky-400 font-sans">
                +10
              </div>
              <div className="text-xs sm:text-sm font-bold leading-tight">
                {language === 'ar' ? (
                  <>
                    سنوات من الخبرة
                    <br />
                    <span className="text-slate-300 font-normal">والرعاية الدولية</span>
                  </>
                ) : (
                  <>
                    Years Experience
                    <br />
                    <span className="text-slate-300 font-normal">in Global Care</span>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Text Content Column */}
          <div className="order-1 lg:order-2 space-y-6">
            <div className="inline-flex items-center gap-2 bg-sky-50 text-sky-700 text-xs font-bold uppercase tracking-wider px-3.5 py-1.5 rounded-full border border-sky-100">
              {t.about.badge}
            </div>

            <h2 className="text-2xl sm:text-4xl font-extrabold text-[#0A192F] tracking-tight leading-tight">
              {t.about.heading}
            </h2>

            <p className="text-base text-slate-600 leading-relaxed">
              {t.about.lead}
            </p>

            {/* Two Highlighted Feature Rows */}
            <div className="space-y-4 pt-2">
              <div className="flex items-start gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-100">
                <div className="w-10 h-10 rounded-xl bg-sky-100 text-sky-700 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-base font-bold text-slate-900 mb-1">
                    {t.about.feature1Title}
                  </h4>
                  <p className="text-sm text-slate-600 leading-relaxed">
                    {t.about.feature1Desc}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-100">
                <div className="w-10 h-10 rounded-xl bg-sky-100 text-sky-700 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <HeartHandshake className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-base font-bold text-slate-900 mb-1">
                    {t.about.feature2Title}
                  </h4>
                  <p className="text-sm text-slate-600 leading-relaxed">
                    {t.about.feature2Desc}
                  </p>
                </div>
              </div>
            </div>

            {/* CTA */}
            <div className="pt-4">
              <Link
                href="/about"
                className="inline-flex items-center gap-2 bg-[#0A192F] hover:bg-[#132A4A] text-white font-semibold text-sm px-7 py-3.5 rounded-full shadow-md transition-all duration-200"
              >
                <span>{t.about.cta}</span>
                {isRtl ? <ArrowLeft className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
