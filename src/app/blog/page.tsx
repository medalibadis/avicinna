'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { useLanguage } from '@/context/LanguageContext';
import { useData } from '@/context/DataContext';
import { articleCategories } from '@/data/articles';
import {
  Search,
  Clock,
  Calendar,
  User,
  Building2,
  ChevronLeft,
  ChevronRight,
  BookOpen,
  Sparkles,
  ShieldCheck,
} from 'lucide-react';

export default function BlogPage() {
  const { language, direction, t } = useLanguage();
  const { articles: articlesData } = useData();
  const ArrowIcon = direction === 'rtl' ? ChevronLeft : ChevronRight;

  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const content = {
    ar: {
      badge: 'المدونة الطبية المعتمدة',
      title: 'دليل العلاج والسياحة الطبية في تركيا',
      subtitle:
        'مقالات طبية استشارية مكتوبة ومراجعة بواسطة نخبة من الأطباء والجراحين في تركيا لمساعدتك في اتخاذ قرارات صحية واعية وموثوقة.',
      searchPlaceholder: 'ابحث عن مقال طبي، عملية جراحية، أو معلومة صحية...',
      readMore: 'قراءة المقال كاملاً',
      minRead: 'دقائق قراءة',
      byAuthor: 'بقلم:',
      publishedOn: 'تاريخ النشر:',
      noResults: 'لم يتم العثور على مقالات تطابق بحثك. يرجى تجربة كلمات أخرى.',
      allCategories: 'جميع المقالات',
    },
    en: {
      badge: 'Certified Medical Blog',
      title: 'Medical Tourism & Clinical Treatment Guides',
      subtitle:
        'Evidence-based articles reviewed by Turkey’s leading medical faculty to empower international patients with authentic clinical insights and travel guidance.',
      searchPlaceholder: 'Search articles, surgical procedures, or clinical topics...',
      readMore: 'Read Full Article',
      minRead: 'min read',
      byAuthor: 'By:',
      publishedOn: 'Published:',
      noResults: 'No articles matched your query. Please try different keywords.',
      allCategories: 'All Articles',
    },
    fr: {
      badge: 'Blog Médical Certifié',
      title: 'Guides Cliniques & Tourisme Médical en Turquie',
      subtitle:
        'Des articles rédigés et validés par des chirurgiens et professeurs pour vous guider sereinement dans votre parcours de soins à Istanbul.',
      searchPlaceholder: 'Rechercher un article, une intervention chirurgicale...',
      readMore: 'Lire l’Article Complet',
      minRead: 'min de lecture',
      byAuthor: 'Par :',
      publishedOn: 'Publié le :',
      noResults: 'Aucun article ne correspond à votre recherche.',
      allCategories: 'Tous les Articles',
    },
  }[language];

  const filteredArticles = useMemo(() => {
    return articlesData.filter((article) => {
      const matchesCategory =
        selectedCategory === 'all' || article.categorySlug === selectedCategory;

      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        article.title[language].toLowerCase().includes(q) ||
        article.excerpt[language].toLowerCase().includes(q) ||
        article.author.name[language].toLowerCase().includes(q);

      return matchesCategory && matchesSearch;
    });
  }, [selectedCategory, searchQuery, language]);

  return (
    <div className="pt-24 pb-16 bg-slate-50 min-h-screen">
      {/* Hero Banner */}
      <div className="bg-gradient-to-b from-slate-900 to-[#0A192F] text-white py-16 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#38bdf8_1px,transparent_1px)] [background-size:16px_16px]" />
        <div className="max-w-7xl mx-auto relative z-10 text-center max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-500/20 text-sky-300 text-xs font-semibold mb-4 border border-sky-500/30">
            <Sparkles className="w-3.5 h-3.5" />
            <span>{content.badge}</span>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight leading-tight">
            {content.title}
          </h1>
          <p className="mt-4 text-base sm:text-lg text-slate-300 leading-relaxed">
            {content.subtitle}
          </p>
        </div>
      </div>

      {/* Search & Category Filter Ribbon */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-20">
        <div className="bg-white rounded-3xl shadow-xl border border-slate-100 p-4 sm:p-6 space-y-4">
          {/* Search Input */}
          <div className="relative">
            <Search className="w-5 h-5 text-slate-400 absolute top-1/2 -translate-y-1/2 right-4 rtl:right-4 ltr:left-4 ltr:right-auto pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={content.searchPlaceholder}
              className="w-full py-3.5 px-12 rounded-2xl bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:bg-white text-sm transition-all"
            />
          </div>

          {/* Categories Horizontal Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-thin">
            {articleCategories.map((cat) => (
              <button
                key={cat.id}
                type="button"
                onClick={() => setSelectedCategory(cat.slug)}
                className={`px-4 py-2 rounded-full text-xs sm:text-sm font-semibold whitespace-nowrap transition-all cursor-pointer ${
                  selectedCategory === cat.slug
                    ? 'bg-sky-500 text-white shadow-sm'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                {cat.name[language]}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Articles Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12">
        {filteredArticles.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-3xl border border-slate-200">
            <BookOpen className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <p className="text-slate-600 text-base">{content.noResults}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredArticles.map((article) => (
              <div
                key={article.id}
                className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden hover:shadow-xl hover:border-sky-200 transition-all duration-300 flex flex-col group"
              >
                {/* Visual Header */}
                <div className="relative h-56 overflow-hidden bg-slate-100">
                  <img
                    src={article.image}
                    alt={article.title[language]}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent" />

                  {/* Category Badge */}
                  <div className="absolute top-4 left-4 rtl:left-auto rtl:right-4 bg-white/95 backdrop-blur-sm text-sky-700 px-3 py-1 rounded-full text-xs font-bold shadow-sm">
                    {article.categoryName[language]}
                  </div>

                  {/* Reading Time */}
                  <div className="absolute bottom-4 left-4 rtl:left-auto rtl:right-4 bg-slate-900/80 backdrop-blur-sm text-white px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-sky-400" />
                    <span>
                      {article.readingTimeMinutes} {content.minRead}
                    </span>
                  </div>
                </div>

                {/* Body Content */}
                <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                  <div>
                    <h3 className="text-lg font-bold text-slate-900 group-hover:text-sky-600 transition-colors leading-snug line-clamp-2">
                      {article.title[language]}
                    </h3>

                    <p className="text-xs sm:text-sm text-slate-600 mt-2 line-clamp-3 leading-relaxed">
                      {article.excerpt[language]}
                    </p>

                    <div className="mt-4 pt-3 border-t border-slate-100 space-y-1 text-xs text-slate-500">
                      <div className="flex items-center gap-1.5">
                        <User className="w-3.5 h-3.5 text-sky-500" />
                        <span className="font-semibold text-slate-700">
                          {article.author.name[language]}
                        </span>
                        <span className="text-slate-400">({article.author.role[language]})</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Building2 className="w-3.5 h-3.5 text-sky-500" />
                        <span className="truncate">{article.sourceHospital[language]}</span>
                      </div>
                    </div>
                  </div>

                  {/* Action Link */}
                  <div className="pt-4 border-t border-slate-100">
                    <Link
                      href={`/blog/${article.slug}`}
                      className="w-full py-2.5 px-4 rounded-xl bg-sky-50 hover:bg-sky-500 text-sky-700 hover:text-white font-semibold text-xs transition-colors text-center flex items-center justify-center gap-1.5"
                    >
                      <span>{content.readMore}</span>
                      <ArrowIcon className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
