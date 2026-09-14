'use client';

import React from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useLanguage } from '@/context/LanguageContext';
import { useData } from '@/context/DataContext';
import {
  Clock,
  Calendar,
  User,
  Building2,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  AlertCircle,
  Share2,
  PhoneCall,
  CalendarCheck,
  BookOpen,
  CheckCircle2,
} from 'lucide-react';

export default function ArticleDetailPage() {
  const params = useParams();
  const slug = params?.slug as string;
  const { language, direction, t } = useLanguage();
  const { articles: articlesData } = useData();
  const ArrowIcon = direction === 'rtl' ? ChevronLeft : ChevronRight;

  const article = articlesData.find((a) => a.slug === slug);

  if (!article) {
    return (
      <div className="pt-32 pb-20 text-center max-w-xl mx-auto px-4">
        <h1 className="text-2xl font-bold text-slate-900 mb-4">
          {language === 'ar'
            ? 'لم يتم العثور على المقال الطبي المطلوب'
            : language === 'fr'
            ? 'Article introuvable'
            : 'Article Not Found'}
        </h1>
        <Link
          href="/blog"
          className="inline-flex items-center gap-2 bg-sky-500 text-white font-semibold px-6 py-2.5 rounded-full"
        >
          <span>{language === 'ar' ? 'العودة للمدونة الطبية' : 'Back to Blog'}</span>
        </Link>
      </div>
    );
  }

  const relatedArticles = articlesData
    .filter((a) => a.slug !== article.slug)
    .slice(0, 3);

  const content = {
    ar: {
      breadcrumbHome: 'الرئيسية',
      breadcrumbBlog: 'المدونة الطبية',
      medicallyReviewed: 'مراجعة وتدقيق طبي معتمد',
      minRead: 'دقائق قراءة',
      authorLabel: 'الكاتب الطبي:',
      hospitalLabel: 'المستشفى الأكاديمي:',
      disclaimerHeading: 'إخلاء مسؤولية طبي هام (Medical Disclaimer)',
      disclaimerText:
        'المعلومات الواردة في هذا المقال مقدمة لأغراض تثقيفية وتوعوية عامة فقط، ولا تعتبر بديلاً عن الاستشارة أو التشخيص الطبي المتخصص من قبل طبيب مرخص. نوصي دائماً باستشارة طبيبك أو فريقنا الاستشاري قبل اتخاذ أي قرار علاجي.',
      relatedHeading: 'مقالات طبية ذات صلة',
      shareArticle: 'مشاركة المقال',
      ctaTitle: 'هل تحتاج استشارة طبية متخصصة حول هذه الحالة؟',
      ctaSubtitle:
        'أرسل تقاريرك الطبية الآن لمراجعتها من قبل نفس الفريق الطبي في إسطنبول وتقديم رأي طبي ثانٍ مجاني.',
      consultationBtn: 'طلب استشارة لحالتي',
      whatsappBtn: 'تواصل فوري عبر واتساب',
      publishedOn: 'تاريخ النشر:',
    },
    en: {
      breadcrumbHome: 'Home',
      breadcrumbBlog: 'Medical Blog',
      medicallyReviewed: 'Medically Reviewed & Verified',
      minRead: 'min read',
      authorLabel: 'Medical Author:',
      hospitalLabel: 'Affiliated Academic Hospital:',
      disclaimerHeading: 'Important Medical Disclaimer',
      disclaimerText:
        'The clinical information provided herein is intended solely for educational and informational purposes. It should not substitute for professional medical advice, diagnosis, or clinical evaluation by a licensed healthcare physician.',
      relatedHeading: 'Related Clinical Guides',
      shareArticle: 'Share Article',
      ctaTitle: 'Need a Specialist Medical Consultation for This Condition?',
      ctaSubtitle:
        'Submit your medical reports today to receive a complimentary second opinion from our board-certified faculty in Istanbul.',
      consultationBtn: 'Request Case Consultation',
      whatsappBtn: 'Chat on WhatsApp',
      publishedOn: 'Published:',
    },
    fr: {
      breadcrumbHome: 'Accueil',
      breadcrumbBlog: 'Blog Médical',
      medicallyReviewed: 'Revue et Validation Médicale',
      minRead: 'min de lecture',
      authorLabel: 'Auteur Médical :',
      hospitalLabel: 'Hôpital de Rattachement :',
      disclaimerHeading: 'Avertissement Médical Important',
      disclaimerText:
        'Les informations publiées dans cet article sont destinées à des fins purement éducatives et ne sauraient en aucun cas se substituer à un diagnostic ou une consultation médicale auprès d’un praticien qualifié.',
      relatedHeading: 'Articles Similaires',
      shareArticle: 'Partager l’article',
      ctaTitle: 'Besoin d’un Avis Médical Spécialisé pour Cette Pathologie ?',
      ctaSubtitle:
        'Transmettez vos examens pour une étude gratuite par nos professeurs référents à Istanbul sous 24h.',
      consultationBtn: 'Demander un Avis Médical',
      whatsappBtn: 'Échanger sur WhatsApp',
      publishedOn: 'Publié le :',
    },
  }[language];

  // Schema.org Article
  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'MedicalWebPage',
    headline: article.title[language],
    description: article.excerpt[language],
    image: article.image,
    datePublished: article.publishedDate,
    author: {
      '@type': 'Person',
      name: article.author.name[language],
      jobTitle: article.author.role[language],
    },
    publisher: {
      '@type': 'Organization',
      name: 'AVICINNA Healthcare Turkey',
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />

      <div className="pt-24 pb-16 bg-slate-50 min-h-screen">
        {/* Breadcrumbs */}
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center gap-2 text-xs sm:text-sm text-slate-500">
            <Link href="/" className="hover:text-sky-600 transition-colors">
              {content.breadcrumbHome}
            </Link>
            <ArrowIcon className="w-3.5 h-3.5 text-slate-400" />
            <Link href="/blog" className="hover:text-sky-600 transition-colors">
              {content.breadcrumbBlog}
            </Link>
            <ArrowIcon className="w-3.5 h-3.5 text-slate-400" />
            <span className="text-slate-900 font-semibold truncate max-w-[200px] sm:max-w-none">
              {article.title[language]}
            </span>
          </div>
        </div>

        {/* Article Container */}
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mt-2">
          <article className="bg-white rounded-3xl p-6 sm:p-12 shadow-sm border border-slate-100 space-y-8">
            {/* Header Meta */}
            <div className="space-y-4">
              <div className="flex flex-wrap items-center gap-3">
                <span className="bg-sky-50 text-sky-700 text-xs font-bold px-3 py-1 rounded-full">
                  {article.categoryName[language]}
                </span>
                <span className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-700 text-xs font-semibold px-3 py-1 rounded-full border border-emerald-100">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>{content.medicallyReviewed}</span>
                </span>
                <span className="inline-flex items-center gap-1 text-xs text-slate-400">
                  <Clock className="w-3.5 h-3.5" />
                  <span>
                    {article.readingTimeMinutes} {content.minRead}
                  </span>
                </span>
              </div>

              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 leading-tight">
                {article.title[language]}
              </h1>

              <p className="text-base sm:text-lg text-slate-600 font-medium leading-relaxed">
                {article.excerpt[language]}
              </p>

              {/* Author Strip */}
              <div className="pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-4 text-xs sm:text-sm text-slate-600">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-sky-100 text-sky-700 flex items-center justify-center font-bold">
                    <User className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="font-bold text-slate-900">
                      {article.author.name[language]}
                    </div>
                    <div className="text-slate-500 text-xs">
                      {article.author.role[language]} • {article.sourceHospital[language]}
                    </div>
                  </div>
                </div>

                <div className="text-xs text-slate-400">
                  {content.publishedOn} {article.publishedDate}
                </div>
              </div>
            </div>

            {/* Featured Image */}
            <div className="relative rounded-2xl overflow-hidden aspect-[16/9] shadow-md bg-slate-100">
              <img
                src={article.image}
                alt={article.title[language]}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Article Content Paragraphs */}
            <div className="prose prose-slate max-w-none space-y-5 text-slate-700 leading-relaxed text-base sm:text-lg">
              {article.content[language].map((paragraph, idx) => (
                <p key={idx} className="leading-relaxed">
                  {paragraph}
                </p>
              ))}
            </div>

            {/* In-Article Consultation Box */}
            <div className="bg-gradient-to-r from-slate-900 via-[#0A192F] to-slate-900 rounded-2xl p-6 sm:p-8 text-white space-y-4">
              <h3 className="text-lg sm:text-xl font-bold">{content.ctaTitle}</h3>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                {content.ctaSubtitle}
              </p>
              <div className="flex flex-wrap gap-3 pt-2">
                <Link
                  href="/contact"
                  className="inline-flex items-center gap-2 bg-sky-500 hover:bg-sky-600 text-white font-semibold px-6 py-2.5 rounded-full text-xs sm:text-sm transition-all"
                >
                  <CalendarCheck className="w-4 h-4" />
                  <span>{content.consultationBtn}</span>
                </Link>
                <a
                  href={`https://wa.me/905000000000?text=Question%20about%20${article.title.en}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold px-6 py-2.5 rounded-full text-xs sm:text-sm transition-all"
                >
                  <PhoneCall className="w-4 h-4" />
                  <span>{content.whatsappBtn}</span>
                </a>
              </div>
            </div>

            {/* Medical Disclaimer Box */}
            <div className="p-5 rounded-2xl bg-amber-50/70 border border-amber-200/80 flex items-start gap-3.5 text-xs sm:text-sm text-amber-900">
              <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
              <div>
                <div className="font-bold mb-1">{content.disclaimerHeading}</div>
                <p className="text-amber-800 leading-relaxed text-xs">
                  {content.disclaimerText}
                </p>
              </div>
            </div>
          </article>

          {/* Related Articles Section */}
          <div className="mt-12">
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mb-6 flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-sky-500" />
              <span>{content.relatedHeading}</span>
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {relatedArticles.map((rel) => (
                <Link
                  key={rel.id}
                  href={`/blog/${rel.slug}`}
                  className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100 hover:border-sky-200 hover:shadow-md transition-all group flex flex-col justify-between"
                >
                  <div>
                    <div className="relative h-36 rounded-xl overflow-hidden mb-3">
                      <img
                        src={rel.image}
                        alt={rel.title[language]}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                    <div className="text-[11px] font-bold text-sky-600 uppercase mb-1">
                      {rel.categoryName[language]}
                    </div>
                    <h3 className="font-bold text-slate-800 text-sm group-hover:text-sky-600 transition-colors line-clamp-2">
                      {rel.title[language]}
                    </h3>
                  </div>
                  <div className="pt-3 border-t border-slate-100 text-xs text-slate-400 mt-3 flex items-center justify-between">
                    <span>{rel.readingTimeMinutes} {content.minRead}</span>
                    <span className="text-sky-500 font-semibold group-hover:underline">
                      →
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
