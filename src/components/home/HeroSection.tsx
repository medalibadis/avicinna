'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useLanguage } from '@/context/LanguageContext';
import { useData } from '@/context/DataContext';
import { Search, Calendar, ArrowRight, ArrowLeft, Shield, Sparkles } from 'lucide-react';

export const HeroSection: React.FC = () => {
  const { t, language, direction } = useLanguage();
  const { sections } = useData();
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');

  const isRtl = direction === 'rtl';
  const heroData = sections.hero;
  const eyebrow = heroData.eyebrow[language] || t.hero.eyebrow;
  const headlinePart1 = heroData.headlinePart1[language] || t.hero.headlinePart1;
  const headlineHighlight = heroData.headlineHighlight[language] || t.hero.headlineHighlight;
  const subtitle = heroData.subtitle[language] || t.hero.subtitle;

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    router.push(`/treatments?search=${encodeURIComponent(searchQuery)}`);
  };

  return (
    <section className="relative min-h-[92vh] flex items-center justify-center pt-28 pb-20 overflow-hidden bg-[#032654]">
      {/* Background Image with Deep Navy Gradient Overlay */}
      <div className="absolute inset-0 z-0">
        <div
          className="absolute inset-0 bg-cover bg-center scale-105 transform animate-pulse duration-10000"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1587351021759-3e566b6af7cc?q=80&w=2000&auto=format&fit=crop')`,
          }}
        />
        {/* Navy Gradient Overlay for high text legibility */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#021838]/95 via-[#032654]/90 to-[#032654]/85" />
        <div className="absolute inset-0 bg-radial-at-c from-[#0097FB]/15 via-transparent to-transparent pointer-events-none" />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-white">
        {/* Trust Eyebrow Badge */}
        <div className="inline-flex items-center gap-2 bg-[#0097FB]/15 border border-[#00BFFF]/30 backdrop-blur-md px-4 py-1.5 rounded-full mb-6">
          <Sparkles className="w-4 h-4 text-[#00BFFF] animate-spin duration-3000" />
          <span className="text-xs sm:text-sm font-semibold text-[#00BFFF] tracking-wide">
            {eyebrow}
          </span>
        </div>

        {/* Main Headline */}
        <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-[1.2] mb-6 max-w-4xl mx-auto">
          <span>{headlinePart1}</span>{' '}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#0097FB] via-[#00BFFF] to-[#0097FB] block sm:inline">
            {headlineHighlight}
          </span>
        </h1>

        {/* Supporting Subtitle */}
        <p className="text-base sm:text-xl text-slate-200/90 max-w-3xl mx-auto leading-relaxed mb-10 font-normal">
          {subtitle}
        </p>

        {/* Search / Consultation Entry Component */}
        <div className="max-w-2xl mx-auto mb-10">
          <form
            onSubmit={handleSearch}
            className="relative flex items-center bg-white/95 backdrop-blur-md rounded-2xl sm:rounded-full p-2 shadow-2xl shadow-black/40 border border-white/20"
          >
            <div className="flex items-center justify-center pl-3 pr-2 text-[#0097FB]">
              <Search className="w-5 h-5" />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t.hero.searchPlaceholder}
              className="w-full bg-transparent text-slate-800 placeholder-slate-400 text-sm sm:text-base font-medium focus:outline-none px-2 py-2"
            />
            <button
              type="submit"
              className="bg-[#0097FB] hover:bg-[#0082d6] text-white font-semibold text-sm px-6 py-3 rounded-xl sm:rounded-full transition-all duration-200 shadow-md shadow-[#0097FB]/30 flex-shrink-0 cursor-pointer"
            >
              {language === 'ar' ? 'بحث سريع' : language === 'fr' ? 'Rechercher' : 'Search'}
            </button>
          </form>
        </div>

        {/* Dual Primary / Secondary CTAs */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
          <a
            href="#consultation"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-3 bg-[#0097FB] hover:bg-[#0082d6] text-white font-bold text-base px-8 py-4 rounded-full shadow-lg shadow-[#0097FB]/25 transition-all duration-200 transform hover:-translate-y-0.5 cursor-pointer"
          >
            <Calendar className="w-5 h-5" />
            <span>{t.hero.primaryCta}</span>
          </a>

          <a
            href="/treatments"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 border border-white/25 text-white font-semibold text-base px-8 py-4 rounded-full backdrop-blur-md transition-all duration-200"
          >
            <span>{t.hero.secondaryCta}</span>
            {isRtl ? <ArrowLeft className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}
          </a>
        </div>

        {/* Trust Badges Bar */}
        <div className="pt-6 border-t border-white/10 flex flex-wrap items-center justify-center gap-6 sm:gap-10 text-xs sm:text-sm text-slate-300 font-medium">
          <div className="flex items-center gap-2">
            <Shield className="w-4 h-4 text-[#00BFFF]" />
            <span>{t.hero.trustBadge}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
            <span>
              {language === 'ar'
                ? 'استشارات مجانية 100% بدون أي التزام مالي'
                : language === 'fr'
                ? 'Consultation 100% gratuite sans engagement'
                : '100% Free Consultation with No Obligation'}
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};
