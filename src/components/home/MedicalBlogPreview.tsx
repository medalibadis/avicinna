'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useLanguage } from '@/context/LanguageContext';
import { useData } from '@/context/DataContext';
import { articleCategories } from '@/data/articles';
import { Clock, Building, ArrowRight, ArrowLeft, Search } from 'lucide-react';

export const MedicalBlogPreview: React.FC = () => {
  const { t, language, direction } = useLanguage();
  const { articles } = useData();
  const [selectedCat, setSelectedCat] = useState('all');
  const isRtl = direction === 'rtl';

  const filteredArticles =
    selectedCat === 'all'
      ? articles.slice(0, 3)
      : articles.filter((art) => art.categorySlug === selectedCat).slice(0, 3);

  return (
    <section id="blog" className="py-20 bg-[#F4F7FA]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 bg-[#EAF6FF] text-[#0097FB] text-xs font-bold uppercase tracking-wider px-3.5 py-1.5 rounded-full mb-3 border border-[#0097FB]/20">
            {t.blog.badge}
          </div>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-[#032654] tracking-tight mb-4">
            {t.blog.title}
          </h2>
          <p className="text-sm sm:text-base text-[#64748B] leading-relaxed">
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
                    : 'bg-white text-[#163B63] hover:bg-[#EAF6FF] border border-slate-200/60'
                }`}
              >
                {cat.name[language]}
              </button>
            );
          })}
        </div>

        {/* Articles 3-Column Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {filteredArticles.map((article) => (
            <article
              key={article.id}
              className="bg-white rounded-3xl overflow-hidden border border-slate-200/80 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col group"
            >
              {/* Image & Category Badge */}
              <div className="relative h-56 overflow-hidden bg-slate-100">
                <img
                  src={article.image}
                  alt={article.title[language]}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-3 right-3 bg-[#0097FB] text-white text-[11px] font-bold px-3 py-1 rounded-full shadow-md">
                  {article.categoryName[language]}
                </div>
              </div>

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

                  <h3 className="text-base sm:text-lg font-bold text-[#032654] mb-2 leading-snug group-hover:text-[#0097FB] transition-colors">
                    {article.title[language]}
                  </h3>

                  <p className="text-xs sm:text-sm text-[#64748B] leading-relaxed line-clamp-3">
                    {article.excerpt[language]}
                  </p>
                </div>

                {/* Read More Link */}
                <div className="pt-4 border-t border-slate-100">
                  <Link
                    href={`/blog/${article.slug}`}
                    className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-[#0097FB] hover:text-[#032654] transition-colors"
                  >
                    <span>{t.blog.readMore}</span>
                    {isRtl ? <ArrowLeft className="w-3.5 h-3.5" /> : <ArrowRight className="w-3.5 h-3.5" />}
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>

        {/* View All Articles CTA */}
        <div className="text-center">
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 bg-[#032654] hover:bg-[#163B63] text-white font-bold text-sm px-8 py-4 rounded-full shadow-md shadow-[#032654]/20 transition-all duration-200"
          >
            <span>{t.blog.allBlogCta}</span>
            {isRtl ? <ArrowLeft className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}
          </Link>
        </div>
      </div>
    </section>
  );
};
