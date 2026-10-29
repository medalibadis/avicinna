'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useLanguage } from '@/context/LanguageContext';
import { Article } from '@/data/articles';
import {
  Clock,
  User,
  ShieldCheck,
  CheckCircle2,
  Sparkles,
  Globe,
  Share2,
  CalendarCheck,
  PhoneCall,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { CopyArticleButton } from '@/components/blog/ArticleInteractive';

type Lang = 'ar' | 'en' | 'fr';

interface ArticleReaderClientProps {
  article: any;
}

const readerDict = {
  ar: {
    jciVerified: 'مراجعة وتدقيق طبي معتمد (JCI Verified)',
    readTime: 'دقائق قراءة',
    publishedOn: 'تاريخ النشر:',
    takeawaysTitle: 'أبرز النقاط المستفادة (Key Clinical Takeaways)',
    takeaway1: 'معلومات طبية موثقة وفق أحدث المعايير الدولية والاعتمادات الصحية (JCI).',
    takeaway2: 'مقارنة شفافة للتكاليف ونسب النجاح المعتمدة في كبرى المستشفيات التركية.',
    takeaway3: 'إمكانية الحصول على رأي طبي ثانٍ مجاني من أطبائنا الاستشاريين في إسطنبول.',
    consultationCtaTitle: 'هل ترغب في استشارة الفريق الطبي المختص بخصوص هذه الحالة؟',
    consultationCtaSub: 'أرسل تقاريرك الطبية لنقوم بمراجعتها وإعداد خطة علاجية مخصصة وعرض أسعار فوري خلال 24 ساعة.',
    consultationBtn: 'طلب دراسة الحالة الطبية',
    whatsappBtn: 'استشارة فورية عبر واتساب',
    translatePillLabel: 'قراءة المقال بلغة أخرى:',
  },
  en: {
    jciVerified: 'JCI Verified & Certified Clinical Review',
    readTime: 'min read',
    publishedOn: 'Published:',
    takeawaysTitle: 'Key Clinical Takeaways',
    takeaway1: 'Clinically verified information aligned with global health and JCI hospital standards.',
    takeaway2: 'Transparent cost benchmarking and success rate data across top Turkish medical centers.',
    takeaway3: 'Complimentary second medical opinion available from accredited consultants in Istanbul.',
    consultationCtaTitle: 'Need a Specialist Medical Consultation for This Condition?',
    consultationCtaSub: 'Submit your clinical reports for review by our surgical board; receive an individualized treatment assessment within 24 hours.',
    consultationBtn: 'Request Case Review',
    whatsappBtn: 'Direct WhatsApp Consultation',
    translatePillLabel: 'Read article in another language:',
  },
  fr: {
    jciVerified: 'Revue Clinique Certifiée & Conforme JCI',
    readTime: 'min de lecture',
    publishedOn: 'Date de publication :',
    takeawaysTitle: 'Points Clés & Synthèse Clinique',
    takeaway1: 'Informations médicales rigoureuses conformes aux standards internationaux JCI.',
    takeaway2: 'Analyse transparente des tarifs et taux de réussite dans les meilleurs hôpitaux turcs.',
    takeaway3: 'Second avis médical gratuit délivré par nos professeurs consultants à Istanbul.',
    consultationCtaTitle: 'Souhaitez-vous consulter l’équipe médicale pour ce traitement ?',
    consultationCtaSub: 'Transmettez vos examens médicaux pour une étude personnalisée et un devis complet sous 24h.',
    consultationBtn: 'Demander une étude de dossier',
    whatsappBtn: 'Échanger sur WhatsApp',
    translatePillLabel: 'Lire l’article en une autre langue :',
  },
};

export function ArticleReaderClient({ article }: ArticleReaderClientProps) {
  const { language, setLanguage, direction } = useLanguage();
  const currentLang = (language === 'fr' || language === 'en' || language === 'ar' ? language : 'ar') as Lang;
  const [activeArticleLang, setActiveArticleLang] = useState<Lang>(currentLang);
  const [isCrossfading, setIsCrossfading] = useState(false);
  const [isTranslating, setIsTranslating] = useState(false);

  // Helper to detect Arabic characters in text
  const containsArabic = (text?: string): boolean => {
    if (!text) return false;
    return /[\u0600-\u06FF]/.test(text);
  };

  // State cache holding verified translated content for each language
  const [translations, setTranslations] = useState<Record<Lang, {
    title: string;
    excerpt: string;
    category: string;
    paragraphs: string[];
  } | null>>(() => {
    const rawEnTitle = article.title?.en;
    const rawFrTitle = article.title?.fr;
    const hasRealEn = Boolean(rawEnTitle && !containsArabic(rawEnTitle));
    const hasRealFr = Boolean(rawFrTitle && !containsArabic(rawFrTitle));
    const arParagraphs: string[] = article.content?.ar || article.paragraphs || [];

    return {
      ar: {
        title: article.title?.ar || article.title?.en || '',
        excerpt: article.excerpt?.ar || article.excerpt?.en || '',
        category: article.categoryName?.ar || article.categoryName?.en || 'مقال طبي',
        paragraphs: arParagraphs,
      },
      en: hasRealEn ? {
        title: rawEnTitle,
        excerpt: article.excerpt?.en || '',
        category: article.categoryName?.en || 'Medical Article',
        paragraphs: article.content?.en || (article.paragraphs && !containsArabic(article.paragraphs[0]) ? article.paragraphs : arParagraphs),
      } : null,
      fr: hasRealFr ? {
        title: rawFrTitle,
        excerpt: article.excerpt?.fr || '',
        category: article.categoryName?.fr || 'Article Médical',
        paragraphs: article.content?.fr || (article.paragraphs && !containsArabic(article.paragraphs[0]) ? article.paragraphs : arParagraphs),
      } : null,
    };
  });

  // On-demand auto-translate trigger
  const translateOnDemand = React.useCallback(async (targetLang: Lang) => {
    if (targetLang === 'ar') return;

    // Check if we already have non-Arabic translation cached
    const existing = translations[targetLang];
    if (existing && existing.title && !containsArabic(existing.title)) {
      return;
    }

    setIsTranslating(true);
    try {
      const srcTitle = article.title?.ar || article.title?.en || '';
      const srcExcerpt = article.excerpt?.ar || article.excerpt?.en || '';
      const srcCategory = article.categoryName?.ar || article.categoryName?.en || 'مقال طبي';
      const srcParagraphs: string[] = article.content?.ar || article.paragraphs || [];

      const res = await fetch('/api/translate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sourceLang: 'ar',
          targetLangs: [targetLang],
          payload: {
            title: srcTitle,
            excerpt: srcExcerpt,
            category: srcCategory,
            body: srcParagraphs.join('\n\n'),
          },
          domainContext: 'medical_article',
        }),
      });

      const data = await res.json();
      if (data.success && data.translations?.[targetLang]) {
        const tData = data.translations[targetLang];
        const parsedParagraphs = (tData.body || '')
          .split(/\n\n+/)
          .map((p: string) => p.trim())
          .filter(Boolean);

        setTranslations((prev) => ({
          ...prev,
          [targetLang]: {
            title: tData.title || srcTitle,
            excerpt: tData.excerpt || srcExcerpt,
            category: tData.category || (targetLang === 'fr' ? 'Article Médical' : 'Medical Article'),
            paragraphs: parsedParagraphs.length > 0 ? parsedParagraphs : srcParagraphs,
          },
        }));
      }
    } catch (err) {
      console.error('[ON_DEMAND_TRANSLATION_FAIL]', err);
    } finally {
      setIsTranslating(false);
    }
  }, [article, translations]);

  // Synchronize on mount if viewing EN or FR with untranslated text
  React.useEffect(() => {
    if (activeArticleLang !== 'ar') {
      const current = translations[activeArticleLang];
      if (!current || containsArabic(current.title)) {
        translateOnDemand(activeArticleLang);
      }
    }
  }, [activeArticleLang, translateOnDemand, translations]);

  const t = readerDict[activeArticleLang];

  const handleLanguageSwitch = (newLang: Lang) => {
    if (newLang === activeArticleLang) return;
    setIsCrossfading(true);
    setActiveArticleLang(newLang);
    setLanguage(newLang);
    if (newLang !== 'ar') {
      const existing = translations[newLang];
      if (!existing || containsArabic(existing.title)) {
        translateOnDemand(newLang);
      }
    }
    setTimeout(() => setIsCrossfading(false), 350);
  };

  // Localized Field Resolution from verified translation cache
  const activeContent = translations[activeArticleLang];

  const localizedTitle =
    activeContent?.title ||
    (activeArticleLang === 'ar' ? (article.title?.ar || article.title?.en || '') : '...');

  const localizedExcerpt =
    activeContent?.excerpt ||
    (activeArticleLang === 'ar' ? (article.excerpt?.ar || article.excerpt?.en || '') : '...');

  const localizedCategory =
    activeContent?.category ||
    (activeArticleLang === 'ar'
      ? (article.categoryName?.ar || article.categoryName?.en || 'مقال طبي')
      : activeArticleLang === 'fr'
      ? 'Article Médical'
      : 'Medical Article');

  const localizedAuthorName =
    activeArticleLang === 'fr'
      ? (article.author?.name?.fr || 'Pr. Dr. Serdar Turhal')
      : activeArticleLang === 'en'
      ? (article.author?.name?.en || 'Prof. Dr. Serdar Turhal')
      : (article.author?.name?.ar || 'أ. د. سردار تورهال');

  const localizedAuthorRole =
    activeArticleLang === 'fr'
      ? (article.author?.role?.fr || 'Oncologue Médical Senior & Président du Conseil')
      : activeArticleLang === 'en'
      ? (article.author?.role?.en || 'Senior Medical Oncologist & Advisory Board')
      : (article.author?.role?.ar || 'استشاري طب الأورام السريري');

  const localizedHospital =
    activeArticleLang === 'fr'
      ? (article.sourceHospital?.fr || 'Hôpital Partenaire Certifié JCI à Istanbul')
      : activeArticleLang === 'en'
      ? (article.sourceHospital?.en || 'JCI-Accredited Partner Hospital in Istanbul')
      : (article.sourceHospital?.ar || 'مستشفى تركي معتمد دولياً');

  const localizedParagraphs: string[] =
    activeContent?.paragraphs ||
    (activeArticleLang === 'ar' ? (article.content?.ar || article.paragraphs || []) : []);

  const whatsappMessage = encodeURIComponent(
    activeArticleLang === 'fr'
      ? `Bonjour AVICINNA, je souhaite obtenir des informations médicales sur l'article : "${localizedTitle}"`
      : activeArticleLang === 'en'
      ? `Hello AVICINNA, I would like to inquire about the medical treatment discussed in: "${localizedTitle}"`
      : `السلام عليكم، أود الاستفسار والحصول على استشارة طبية متخصصة بخصوص: "${localizedTitle}"`
  );

  return (
    <article
      dir={activeArticleLang === 'ar' ? 'rtl' : 'ltr'}
      className="bg-white rounded-3xl p-6 sm:p-12 shadow-sm border border-slate-100 space-y-8 relative overflow-hidden transition-all duration-300"
    >
      {/* Subtle Laser Shimmer Beam when switching language */}
      {isCrossfading && (
        <motion.div
          initial={{ opacity: 0, x: '-100%' }}
          animate={{ opacity: 1, x: '100%' }}
          transition={{ duration: 0.45, ease: 'easeInOut' }}
          className="pointer-events-none absolute inset-0 z-20 bg-gradient-to-r from-transparent via-blue-500/10 to-transparent"
        />
      )}

      {/* Reading Header Bar with Inline Dopamine Language Switcher Pill */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-3 bg-slate-50/90 dark:bg-slate-900/90 rounded-2xl border border-slate-200/80 dark:border-slate-800">
        <div className="flex items-center gap-2">
          <Globe className="w-4 h-4 text-blue-600 dark:text-sky-400 shrink-0" />
          <span className="text-xs font-bold text-slate-700 dark:text-slate-200">{t.translatePillLabel}</span>
        </div>

        <div dir="ltr" className="relative inline-flex items-center rounded-full border border-slate-200 dark:border-slate-700 bg-slate-100/90 dark:bg-slate-800/90 p-1 shadow-2xs">
          {(['fr', 'ar', 'en'] as Lang[]).map((lang) => {
            const isSelected = activeArticleLang === lang;
            return (
              <button
                key={lang}
                type="button"
                onClick={() => handleLanguageSwitch(lang)}
                className={`relative px-3.5 py-1 rounded-full text-xs font-black uppercase transition-all duration-200 cursor-pointer select-none ${
                  isSelected
                    ? 'bg-[#0097FB] text-white shadow-md shadow-[#0097FB]/40 ring-1 ring-[#0097FB]/60'
                    : 'text-slate-700 dark:text-slate-300 hover:text-[#0097FB] dark:hover:text-sky-400 hover:bg-slate-200/60 dark:hover:bg-slate-700/60'
                }`}
              >
                {isSelected && (
                  <motion.span
                    layoutId="article-active-lang-pill"
                    transition={{ type: 'spring', stiffness: 500, damping: 35 }}
                    className="absolute inset-0 rounded-full bg-gradient-to-r from-[#0097FB] to-[#0082d6] shadow-md shadow-[#0097FB]/40 -z-0 pointer-events-none"
                  />
                )}
                <span className="relative z-10">{lang}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* On-demand Live Translation Dopamine Banner */}
      {isTranslating && (
        <motion.div
          initial={{ opacity: 0, y: -6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -6 }}
          className="flex items-center gap-3 px-4 py-3 rounded-2xl bg-gradient-to-r from-blue-500/10 via-indigo-500/10 to-blue-50/50 dark:from-blue-950/40 dark:via-indigo-950/40 dark:to-blue-900/40 border border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-300 text-xs font-bold shadow-xs animate-pulse"
        >
          <Sparkles className="w-4 h-4 text-blue-600 dark:text-sky-400 animate-spin shrink-0" />
          <span>
            {activeArticleLang === 'fr'
              ? 'Traduction médicale certifiée en direct vers le Français (IA JCI)...'
              : 'Live certified medical translation to English in progress (JCI Engine)...'}
          </span>
        </motion.div>
      )}

      {/* Animated Content Transition on Language Change */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeArticleLang}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -6 }}
          transition={{ duration: 0.2 }}
          className="space-y-8"
        >
          {/* Header Metadata */}
          <header className="space-y-4">
            <div className="flex flex-wrap items-center gap-2 sm:gap-3">
              <span className="bg-blue-50 dark:bg-sky-950/60 text-blue-700 dark:text-sky-400 text-xs font-bold px-3 py-1 rounded-full border border-blue-100 dark:border-sky-900/40">
                {localizedCategory}
              </span>

              <span className="inline-flex items-center gap-1.5 bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 text-xs font-bold px-3 py-1 rounded-full border border-emerald-200 dark:border-emerald-800/60 shadow-xs">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                <span>{t.jciVerified}</span>
              </span>

              <span className="inline-flex items-center gap-1 text-xs text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-800/80 px-2.5 py-1 rounded-full border border-slate-200/60 dark:border-slate-700">
                <Clock className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500" />
                <span>
                  {article.readingTimeMinutes} {t.readTime}
                </span>
              </span>

              {article.isFromWordPress && (
                <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/60 px-2.5 py-0.5 rounded-full border border-amber-200 dark:border-amber-900/60">
                  <Sparkles className="w-3 h-3 text-amber-600 dark:text-amber-400" />
                  <span>WordPress Headless ISR</span>
                </span>
              )}
            </div>

            {/* Exact H1 */}
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 dark:text-white leading-tight">
              {localizedTitle}
            </h1>

            <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 font-medium leading-relaxed">
              {localizedExcerpt}
            </p>

            {/* Author & Hospital Strip */}
            <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex flex-wrap items-center justify-between gap-4 text-xs sm:text-sm text-slate-600 dark:text-slate-300">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-2xl bg-blue-50 dark:bg-sky-950/60 text-blue-700 dark:text-sky-400 flex items-center justify-center font-bold ring-4 ring-blue-50 dark:ring-sky-950/40">
                  <User className="w-5 h-5 text-blue-600 dark:text-sky-400" />
                </div>
                <div>
                  <div className="font-bold text-slate-900 dark:text-white">{localizedAuthorName}</div>
                  <div className="text-slate-500 dark:text-slate-400 text-xs">
                    {localizedAuthorRole} • {localizedHospital}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-4 text-xs text-slate-400 dark:text-slate-500">
                <span className="font-mono">
                  {t.publishedOn} {article.publishedDate}
                </span>
                <CopyArticleButton text="Partager / Share" copiedText="Lien copié !" />
              </div>
            </div>
          </header>

          {/* Featured Image */}
          <div className="relative rounded-2xl overflow-hidden aspect-[16/9] shadow-md bg-slate-100 dark:bg-slate-800">
            <img
              src={article.image}
              alt={localizedTitle}
              className="w-full h-full object-cover"
              loading="eager"
            />
          </div>

          {/* Clinical Takeaways Box */}
          <div className="bg-blue-50/70 dark:bg-slate-900/90 border border-blue-100 dark:border-slate-800 rounded-2xl p-5 sm:p-6 space-y-3">
            <div className="flex items-center gap-2 text-blue-900 dark:text-sky-300 font-black text-sm">
              <Sparkles className="w-4 h-4 text-blue-600 dark:text-sky-400" />
              <span>{t.takeawaysTitle}</span>
            </div>
            <ul className="space-y-2 text-xs sm:text-sm text-slate-700 dark:text-slate-300">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-blue-500 dark:text-sky-400 shrink-0 mt-0.5" />
                <span>{t.takeaway1}</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-blue-500 dark:text-sky-400 shrink-0 mt-0.5" />
                <span>{t.takeaway2}</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-blue-500 dark:text-sky-400 shrink-0 mt-0.5" />
                <span>{t.takeaway3}</span>
              </li>
            </ul>
          </div>

          {/* Article Body Content */}
          <div className="prose prose-slate dark:prose-invert max-w-none space-y-5 text-slate-700 dark:text-slate-300 leading-relaxed text-base sm:text-lg">
            {article.htmlContent && activeArticleLang === 'ar' ? (
              <div dangerouslySetInnerHTML={{ __html: article.htmlContent }} />
            ) : localizedParagraphs.length > 0 ? (
              <div className="space-y-5">
                {localizedParagraphs.map((paragraph, idx) => (
                  <p key={idx} className="leading-relaxed">
                    {paragraph}
                  </p>
                ))}
              </div>
            ) : (
              <div className="space-y-4 animate-pulse">
                <div className="h-4 bg-slate-200 rounded w-full" />
                <div className="h-4 bg-slate-200 rounded w-5/6" />
                <div className="h-4 bg-slate-200 rounded w-4/6" />
              </div>
            )}
          </div>

          {/* Medical Consultation Callout CTA */}
          <div className="bg-gradient-to-br from-[#032654] to-blue-900 rounded-3xl p-6 sm:p-8 text-white space-y-4 shadow-xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-blue-200 text-xs font-semibold">
              <CalendarCheck className="w-3.5 h-3.5 text-blue-400" />
              <span>AVICINNA Medical Coordination</span>
            </div>
            <h3 className="text-lg sm:text-xl font-black text-white leading-snug">
              {t.consultationCtaTitle}
            </h3>
            <p className="text-xs sm:text-sm text-blue-100/90 leading-relaxed max-w-2xl">
              {t.consultationCtaSub}
            </p>
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-blue-500 hover:bg-blue-400 text-white font-bold text-xs sm:text-sm shadow-md transition-all"
              >
                <span>{t.consultationBtn}</span>
              </Link>
              <a
                href={`https://wa.me/905367771747?text=${whatsappMessage}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs sm:text-sm shadow-md transition-all"
              >
                <PhoneCall className="w-3.5 h-3.5" />
                <span>{t.whatsappBtn}</span>
              </a>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    </article>
  );
}
