'use client';

import React, { useState, useMemo, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useLanguage } from '@/context/LanguageContext';
import { useData } from '@/context/DataContext';
import { articleCategories } from '@/data/articles';
import {
  Search,
  Clock,
  User,
  Building2,
  ChevronLeft,
  ChevronRight,
  BookOpen,
  Sparkles,
} from 'lucide-react';
import { WordPressArticle } from '@/lib/wordpress';

interface BlogClientViewProps {
  initialArticles: WordPressArticle[];
  isLiveWp: boolean;
}

export function BlogClientView({ initialArticles, isLiveWp }: BlogClientViewProps) {
  const { language, direction } = useLanguage();
  const { articles: localArticles } = useData();
  const gridRef = useRef<HTMLDivElement>(null);

  const ArrowIcon = direction === 'rtl' ? ChevronLeft : ChevronRight;
  const PrevIcon = direction === 'rtl' ? ChevronRight : ChevronLeft;
  const NextIcon = direction === 'rtl' ? ChevronLeft : ChevronRight;

  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  // Merge server-provided WordPress articles with any locally added ones in DataContext
  const allArticles = useMemo(() => {
    const list = [...initialArticles];
    const seenSlugs = new Set(initialArticles.map((a) => a.slug));

    localArticles.forEach((loc) => {
      if (!seenSlugs.has(loc.slug)) {
        list.push({
          id: loc.id,
          slug: loc.slug,
          categorySlug: loc.categorySlug,
          categoryName: loc.categoryName,
          title: loc.title,
          excerpt: loc.excerpt,
          htmlContent: '',
          paragraphs: loc.content[language] || loc.content.ar,
          readingTimeMinutes: loc.readingTimeMinutes,
          publishedDate: loc.publishedDate,
          sourceHospital: loc.sourceHospital,
          image: loc.image,
          author: loc.author,
          seo: {
            title: `${loc.title[language] || loc.title.ar} - AVICINNA`,
            description: loc.excerpt[language] || loc.excerpt.ar,
            focusKeyword: loc.title[language] || loc.title.ar,
            canonical: `/blog/${loc.slug}`,
          },
          isFromWordPress: false,
        });
        seenSlugs.add(loc.slug);
      }
    });

    return list;
  }, [initialArticles, localArticles, language]);

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
      showingResults: (start: number, end: number, total: number) =>
        `عرض ${start} - ${end} من أصل ${total} مقال طبي`,
      prevPage: 'السابق',
      nextPage: 'التالي',
      wpLiveBadge: 'متصل بووردبريس Headless CMS',
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
      showingResults: (start: number, end: number, total: number) =>
        `Showing ${start} - ${end} of ${total} medical articles`,
      prevPage: 'Previous',
      nextPage: 'Next',
      wpLiveBadge: 'Live WordPress Headless CMS',
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
      showingResults: (start: number, end: number, total: number) =>
        `Affichage de ${start} à ${end} sur ${total} articles`,
      prevPage: 'Précédent',
      nextPage: 'Suivant',
      wpLiveBadge: 'Connecté à WordPress Headless CMS',
    },
  }[language];

  // Filter articles based on category and search
  const filteredArticles = useMemo(() => {
    return allArticles.filter((article) => {
      const matchesCategory =
        selectedCategory === 'all' || article.categorySlug === selectedCategory;

      const q = searchQuery.toLowerCase().trim();
      const titleStr = (article.title[language] || article.title.ar || '').toLowerCase();
      const excerptStr = (article.excerpt[language] || article.excerpt.ar || '').toLowerCase();
      const authorStr = (article.author?.name[language] || article.author?.name.ar || '').toLowerCase();

      const matchesSearch = !q || titleStr.includes(q) || excerptStr.includes(q) || authorStr.includes(q);

      return matchesCategory && matchesSearch;
    });
  }, [allArticles, selectedCategory, searchQuery, language]);

  // Reset page to 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedCategory, searchQuery]);

  // Pagination calculation
  const totalArticles = filteredArticles.length;
  const totalPages = Math.max(1, Math.ceil(totalArticles / itemsPerPage));
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, totalArticles);
  const paginatedArticles = filteredArticles.slice(startIndex, endIndex);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    if (gridRef.current) {
      gridRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  // Google Schema.org ItemList for Rich Results Carousel
  const itemListSchema = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    itemListElement: paginatedArticles.map((art, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      url: `https://avicinna.netlify.app/blog/${art.slug}`,
      name: art.title[language] || art.title.ar,
      description: art.excerpt[language] || art.excerpt.ar,
      image: art.image,
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListSchema) }}
      />

      <div className="pt-24 pb-16 bg-slate-50 min-h-screen">
        {/* Hero Banner */}
        <div className="bg-gradient-to-b from-[#021838] to-[#032654] text-white py-16 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
          <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#38bdf8_1px,transparent_1px)] [background-size:16px_16px]" />
          <div className="max-w-7xl mx-auto relative z-10 text-center max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-500/20 text-sky-300 text-xs font-semibold mb-4 border border-sky-500/30">
              <Sparkles className="w-3.5 h-3.5" />
              <span>{content.badge}</span>
              {isLiveWp && (
                <span className="inline-flex items-center gap-1 text-[11px] text-emerald-300 bg-emerald-500/20 px-2 py-0.5 rounded-full border border-emerald-500/30">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  {content.wpLiveBadge}
                </span>
              )}
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
                className="w-full py-3.5 px-12 rounded-2xl bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:bg-white text-sm transition-all text-slate-900"
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
                  {cat.name[language] || cat.name.ar}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Articles Section & Grid */}
        <div ref={gridRef} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 scroll-mt-28">
          {/* Results Counter Bar */}
          {totalArticles > 0 && (
            <div className="flex items-center justify-between pb-4 mb-6 border-b border-slate-200/80 text-xs sm:text-sm text-slate-500">
              <span>{content.showingResults(startIndex + 1, endIndex, totalArticles)}</span>
              <span>
                صفحة {currentPage} من {totalPages}
              </span>
            </div>
          )}

          {paginatedArticles.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-3xl border border-slate-200 shadow-sm">
              <BookOpen className="w-12 h-12 text-slate-300 mx-auto mb-3" />
              <p className="text-slate-600 text-base">{content.noResults}</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {paginatedArticles.map((article) => (
                <div
                  key={article.id}
                  className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden hover:shadow-xl hover:border-sky-200 transition-all duration-300 flex flex-col group"
                >
                  {/* Visual Header */}
                  <div className="relative h-56 overflow-hidden bg-slate-100">
                    <img
                      src={article.image}
                      alt={article.title[language] || article.title.ar}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent" />

                    {/* Category Badge */}
                    <div className="absolute top-4 left-4 rtl:left-auto rtl:right-4 bg-white/95 backdrop-blur-sm text-sky-700 px-3 py-1 rounded-full text-xs font-bold shadow-sm">
                      {article.categoryName[language] || article.categoryName.ar}
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
                      <h2 className="text-lg font-bold text-slate-900 group-hover:text-sky-600 transition-colors leading-snug line-clamp-2">
                        {article.title[language] || article.title.ar}
                      </h2>

                      <p className="text-xs sm:text-sm text-slate-600 mt-2 line-clamp-3 leading-relaxed">
                        {article.excerpt[language] || article.excerpt.ar}
                      </p>

                      <div className="mt-4 pt-3 border-t border-slate-100 space-y-1 text-xs text-slate-500">
                        <div className="flex items-center gap-1.5">
                          <User className="w-3.5 h-3.5 text-sky-500" />
                          <span className="font-semibold text-slate-700">
                            {article.author.name[language] || article.author.name.ar}
                          </span>
                          {article.author.role && (
                            <span className="text-slate-400">
                              ({article.author.role[language] || article.author.role.ar})
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-1.5">
                          <Building2 className="w-3.5 h-3.5 text-sky-500" />
                          <span className="truncate">
                            {article.sourceHospital[language] || article.sourceHospital.ar}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Action Link */}
                    <div className="pt-4 border-t border-slate-100">
                      <Link
                        href={`/blog/${article.slug}`}
                        className="w-full py-2.5 px-4 rounded-xl bg-sky-50 hover:bg-sky-500 text-sky-700 hover:text-white font-semibold text-xs transition-colors text-center flex items-center justify-center gap-1.5 cursor-pointer"
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

          {/* Dynamic Pagination Ribbon */}
          {totalPages > 1 && (
            <div className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-3">
              <div className="bg-white border border-slate-200/90 shadow-sm rounded-2xl p-2 flex items-center gap-1.5">
                {/* Previous Button */}
                <button
                  type="button"
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed hover:bg-slate-100 text-slate-700"
                >
                  <PrevIcon className="w-4 h-4" />
                  <span>{content.prevPage}</span>
                </button>

                {/* Number Buttons */}
                <div className="flex items-center gap-1 px-1 border-x border-slate-100">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNumber) => (
                    <button
                      key={pageNumber}
                      type="button"
                      onClick={() => handlePageChange(pageNumber)}
                      className={`w-9 h-9 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center ${
                        currentPage === pageNumber
                          ? 'bg-sky-500 text-white shadow-md shadow-sky-500/25 ring-2 ring-sky-500/20 scale-105'
                          : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                      }`}
                    >
                      {pageNumber}
                    </button>
                  ))}
                </div>

                {/* Next Button */}
                <button
                  type="button"
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed hover:bg-slate-100 text-slate-700"
                >
                  <span>{content.nextPage}</span>
                  <NextIcon className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
