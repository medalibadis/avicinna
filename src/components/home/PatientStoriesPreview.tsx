'use client';

import React, { useState, useRef, useCallback, useEffect } from 'react';
import Link from 'next/link';
import { useLanguage } from '@/context/LanguageContext';
import { useData } from '@/context/DataContext';
import { getLocalizedEntityPath, getLocalizedPath } from '@/lib/i18nRoutes';
import {
  MapPin,
  ArrowRight,
  ArrowLeft,
} from 'lucide-react';
import { getPatientName } from '@/data/stories';

export const PatientStoriesPreview: React.FC = () => {
  const { t, language, direction } = useLanguage();
  const { stories } = useData();
  const isRtl = direction === 'rtl';

  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [activeIndex, setActiveIndex] = useState(0);

  const previewStories = stories.slice(0, 3);

  const handleScroll = useCallback(() => {
    const container = scrollContainerRef.current;
    if (!container) return;
    const containerRect = container.getBoundingClientRect();
    const containerCenter = containerRect.left + containerRect.width / 2;
    let closestIndex = 0;
    let minDistance = Infinity;
    cardRefs.current.forEach((el, idx) => {
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const itemCenter = rect.left + rect.width / 2;
      const distance = Math.abs(containerCenter - itemCenter);
      if (distance < minDistance) {
        minDistance = distance;
        closestIndex = idx;
      }
    });
    setActiveIndex(closestIndex);
  }, []);

  const scrollToCard = (index: number) => {
    const target = cardRefs.current[index];
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
      setActiveIndex(index);
    }
  };

  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;
    container.addEventListener('scroll', handleScroll, { passive: true });
    return () => container.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  return (
    <section id="stories" className="py-20 bg-white dark:bg-[#080E1A] transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 bg-[#EAF6FF] dark:bg-sky-950/60 text-[#0097FB] dark:text-sky-400 text-xs font-bold uppercase tracking-wider px-3.5 py-1.5 rounded-full mb-3 border border-[#0097FB]/20 dark:border-sky-500/30">
            {t.patientStories.badge}
          </div>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-[#032654] dark:text-white tracking-tight mb-4">
            {t.patientStories.title}
          </h2>
          <p className="text-sm sm:text-base text-[#64748B] dark:text-slate-400 leading-relaxed">
            {t.patientStories.subtitle}
          </p>
        </div>

        {/* Single Unified Track: Mobile Carousel + Desktop 3-Column Grid */}
        <div
          ref={scrollContainerRef}
          className="flex overflow-x-auto snap-x snap-mandatory scrollbar-none [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden -mx-4 px-4 sm:mx-0 sm:px-0 gap-4 pb-4 md:grid md:grid-cols-3 md:gap-8 md:overflow-visible md:pb-0 mb-4 md:mb-12"
          style={{ WebkitOverflowScrolling: 'touch' }}
        >
          {previewStories.map((story, idx) => {
            const storyHref = getLocalizedEntityPath('patient-stories', story, language);
            return (
              <div
                key={story.id}
                ref={(el) => {
                  cardRefs.current[idx] = el;
                }}
                className="w-[86vw] max-w-[360px] md:w-auto md:max-w-none flex-shrink-0 snap-center h-full"
              >
                <div className="bg-white dark:bg-slate-900 rounded-3xl overflow-hidden border border-slate-200/80 dark:border-slate-800 shadow-sm hover:shadow-2xl hover:shadow-sky-500/10 transition-all duration-300 flex flex-col group h-full">
                  <Link
                    href={storyHref}
                    className="relative h-60 overflow-hidden bg-slate-100 dark:bg-slate-800 block cursor-pointer"
                    aria-label={story.title[language]}
                  >
                    <img
                      src={story.image}
                      alt={getPatientName(story.patientName, language)}
                      loading="lazy"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent" />
                    <div className="absolute top-3 right-3 rtl:right-auto rtl:left-3 bg-[#0097FB] text-white text-[11px] font-bold px-3 py-1 rounded-full shadow-md">
                      {story.treatment[language]}
                    </div>
                    <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-white text-xs">
                      <span className="font-bold flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-[#00BFFF]" />
                        {story.country[language]}
                      </span>
                      <span className="bg-black/50 px-2.5 py-0.5 rounded-full text-[11px] backdrop-blur-xs font-medium">
                        {story.duration[language]}
                      </span>
                    </div>
                  </Link>

                  <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                    <div>
                      <Link href={storyHref} className="block cursor-pointer">
                        <h3 className="text-base sm:text-lg font-bold text-[#032654] dark:text-white mb-2 leading-snug group-hover:text-[#0097FB] dark:group-hover:text-sky-400 transition-colors">
                          {story.title[language]}
                        </h3>
                        <p className="text-xs sm:text-sm text-[#64748B] dark:text-slate-400 leading-relaxed line-clamp-3">
                          {story.shortStory[language]}
                        </p>
                      </Link>
                    </div>

                    <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
                      <Link
                        href={storyHref}
                        className="inline-flex items-center justify-between w-full text-xs sm:text-sm font-bold text-[#0097FB] hover:text-[#032654] dark:hover:text-white transition-colors cursor-pointer"
                      >
                        <span>
                          {language === 'ar'
                            ? 'قراءة القصة وتفاصيل الرحلة'
                            : language === 'fr'
                            ? 'Lire le Récit Complet'
                            : 'Read Full Story & Timeline'}
                        </span>
                        {isRtl ? <ArrowLeft className="w-3.5 h-3.5" /> : <ArrowRight className="w-3.5 h-3.5" />}
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Mobile Dots */}
        {previewStories.length > 1 && (
          <div className="flex md:hidden items-center justify-center gap-1.5 pb-6">
            {previewStories.map((_, idx) => (
              <button
                key={idx}
                type="button"
                aria-label={`Story slide ${idx + 1}`}
                onClick={() => scrollToCard(idx)}
                className={`h-1.5 rounded-full transition-all duration-300 cursor-pointer ${
                  activeIndex === idx ? 'w-6 bg-[#0097FB]' : 'w-1.5 bg-slate-300 dark:bg-slate-700'
                }`}
              />
            ))}
          </div>
        )}

        <div className="text-center">
          <Link
            href={getLocalizedPath('/patient-stories', language)}
            className="inline-flex items-center gap-2 bg-[#032654] hover:bg-[#163B63] dark:bg-sky-600 dark:hover:bg-sky-500 text-white font-bold text-sm px-8 py-4 rounded-full shadow-md shadow-[#032654]/20 transition-all duration-200 cursor-pointer"
          >
            <span>{t.patientStories.allStoriesCta}</span>
            {isRtl ? <ArrowLeft className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}
          </Link>
        </div>
      </div>
    </section>
  );
};
