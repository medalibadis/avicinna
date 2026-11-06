'use client';

import React, { useState, useRef, useCallback, useEffect } from 'react';
import Link from 'next/link';
import { useLanguage } from '@/context/LanguageContext';
import { useData } from '@/context/DataContext';
import { articleCategories, Article } from '@/data/articles';
import { Clock, Building, ArrowRight, ArrowLeft } from 'lucide-react';

export const MedicalBlogPreview: React.FC = () => {
  const { t, language, direction } = useLanguage();
  const { articles } = useData();
  const [selectedCat, setSelectedCat] = useState('all');
  const isRtl = direction === 'rtl';

  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [activeIndex, setActiveIndex] = useState(0);

  const filteredArticles =
    selectedCat === 'all'
      ? articles.slice(0, 3)
      : articles.filter((art) => art.categorySlug === selectedCat).slice(0, 3);

  // Synchronize mobile scroll tracking with active indicator dot
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
    return () => {
      container.removeEventListener('scroll', handleScroll);
    };
  }, [handleScroll, filteredArticles]);

  // Reset active index when category changes
  useEffect(() => {
    setActiveIndex(0);
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTo({ left: 0, behavior: 'smooth' });
    }
  }, [selectedCat]);

  const renderArticleCard = (article: Article) => (
    <article className="bg-white dark:bg-slate-900 rounded-3xl overflow-hidden border border-slate-200/80 dark:border-slate-800 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col group h-full">
      {/* Image & Category Badge - Clickable to blog article */}
      <Link
        href={`/blog/${article.slug}`}
        className="block relative h-56 overflow-hidden bg-slate-100 dark:bg-slate-800 group/img cursor-pointer"
        aria-label={article.title[language]}
      >
        <img
          src={article.image}
          alt={article.title[language]}
          className="w-full h-full object-cover group-hover/img:scale-105 group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute top-3 right-3 bg-[#0097FB] text-white text-[11px] font-bold px-3 py-1 rounded-full shadow-md pointer-events-none">
          {article.categoryName[language]}
        </div>
      </Link>

      {/* Content */}
      <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
        <div>
          {/* Meta: Source & Reading Time */}
          <div className="flex items-center justify-between text-xs text-slate-400 mb-3">
            <span className="flex items-center gap-1 truncate max-w-[180px]">
              <Building className="w-3.5 h-3.5 text-[#0097FB] flex-shrink-0" />
              <span className="truncate">{article.sourceHospital[language]}</span>
            </span>
            <span className="flex items-center gap-1 flex-shrink-0">
              <Clock className="w-3.5 h-3.5" />
              <span>
                {article.readingTimeMinutes} {t.blog.minRead}
              </span>
            </span>
          </div>

          <Link href={`/blog/${article.slug}`} className="block">
            <h3 className="text-base sm:text-lg font-bold text-[#032654] dark:text-white mb-2 leading-snug group-hover:text-[#0097FB] transition-colors">
              {article.title[language]}
            </h3>
          </Link>

          <p className="text-xs sm:text-sm text-[#64748B] dark:text-slate-400 leading-relaxed line-clamp-3">
            {article.excerpt[language]}
          </p>
        </div>

        {/* Read More Link */}
        <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
          <Link
            href={`/blog/${article.slug}`}
            className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-[#0097FB] hover:text-[#032654] dark:hover:text-white transition-colors cursor-pointer"
          >
            <span>{t.blog.readMore}</span>
            {isRtl ? <ArrowLeft className="w-3.5 h-3.5" /> : <ArrowRight className="w-3.5 h-3.5" />}
          </Link>
        </div>
      </div>
    </article>
  );

  return (
    <section id="blog" className="py-20 bg-[#F4F7FA] dark:bg-[#0B1120]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 bg-[#EAF6FF] dark:bg-sky-950/60 text-[#0097FB] dark:text-sky-400 text-xs font-bold uppercase tracking-wider px-3.5 py-1.5 rounded-full mb-3 border border-[#0097FB]/20 dark:border-sky-500/30">
            {t.blog.badge}
          </div>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-[#032654] dark:text-white tracking-tight mb-4">
            {t.blog.title}
          </h2>
          <p className="text-sm sm:text-base text-[#64748B] dark:text-slate-400 leading-relaxed">
            {t.blog.subtitle}
          </p>
        </div>

        {/* Category Filter Pills */}
        <div className="flex items-center justify-center flex-wrap gap-2 mb-12">
          {articleCategories.slice(0, 6).map((cat) => {
            const isActive = selectedCat === cat.slug;
            return (
              <button
                key={cat.slug}
                onClick={() => setSelectedCat(cat.slug)}
                type="button"
                className={`px-4 py-2 rounded-full text-xs sm:text-sm font-semibold transition-all duration-200 cursor-pointer ${
                  isActive
                    ? 'bg-[#0097FB] text-white shadow-sm shadow-[#0097FB]/25 scale-105'
                    : 'bg-white dark:bg-slate-900 text-[#163B63] dark:text-slate-200 hover:bg-[#EAF6FF] dark:hover:bg-slate-800 border border-slate-200/60 dark:border-slate-800'
                }`}
              >
                {cat.name[language]}
              </button>
            );
          })}
        </div>

        {/* ─── MOBILE VIEW ONLY (< md): Horizontal Swipeable Carousel ─── */}
        <div className="block md:hidden mb-8">
          <div
            ref={scrollContainerRef}
            className="flex overflow-x-auto snap-x snap-mandatory scrollbar-none [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden -mx-4 px-4 sm:-mx-6 sm:px-6 gap-4 pb-4 pt-1"
            style={{ WebkitOverflowScrolling: 'touch' }}
          >
            {filteredArticles.map((article, idx) => (
              <div
                key={article.id}
                ref={(el) => {
                  cardRefs.current[idx] = el;
                }}
                className="w-[84vw] max-w-[340px] flex-shrink-0 snap-center"
              >
                {renderArticleCard(article)}
              </div>
            ))}
          </div>

          {/* Mobile Swipe Pagination Dots Indicator */}
          {filteredArticles.length > 1 && (
            <div className="flex items-center justify-center gap-1.5 pt-2 pb-1">
              {filteredArticles.map((_, idx) => (
                <button
                  key={idx}
                  type="button"
                  aria-label={`Article slide ${idx + 1}`}
                  onClick={() => scrollToCard(idx)}
                  className={`h-1.5 rounded-full transition-all duration-300 cursor-pointer ${
                    activeIndex === idx
                      ? 'w-6 bg-[#0097FB] dark:bg-sky-400'
                      : 'w-1.5 bg-slate-300 dark:bg-slate-700 hover:bg-slate-400'
                  }`}
                />
              ))}
            </div>
          )}
        </div>

        {/* ─── DESKTOP VIEW ONLY (>= md): 3-Column Grid ─── */}
        <div className="hidden md:grid md:grid-cols-3 gap-8 mb-12">
          {filteredArticles.map((article) => (
            <div key={article.id}>{renderArticleCard(article)}</div>
          ))}
        </div>

        {/* View All Articles CTA */}
        <div className="text-center">
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 bg-[#032654] hover:bg-[#163B63] dark:bg-sky-600 dark:hover:bg-sky-500 text-white font-bold text-sm px-8 py-4 rounded-full shadow-md shadow-[#032654]/20 transition-all duration-200"
          >
            <span>{t.blog.allBlogCta}</span>
            {isRtl ? <ArrowLeft className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}
          </Link>
        </div>
      </div>
    </section>
  );
};
