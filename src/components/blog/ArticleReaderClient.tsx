'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useLanguage } from '@/context/LanguageContext';
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
  AlertCircle,
  Bookmark,
  ListOrdered,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { CopyArticleButton } from '@/components/blog/ArticleInteractive';

type Lang = 'ar' | 'en' | 'fr';

interface ArticleReaderClientProps {
  article: any;
}

const readerDict = {
  ar: {
    jciVerified: 'مراجعة وتدقيق طبي معتمد JCI',
    readTime: 'دقائق قراءة',
    publishedOn: 'تاريخ النشر:',
    shareBtn: 'مشاركة المقال',
    shareCopied: 'تم نسخ الرابط بنجاح!',
    takeawaysTitle: 'أبرز النقاط الطبية المستفادة',
    takeaway1: 'معلومات طبية موثقة وفق أحدث المعايير الدولية والاعتمادات الصحية العالمية (JCI).',
    takeaway2: 'مقارنة شفافة للتكاليف ونسب النجاح المعتمدة في كبرى المستشفيات التركية.',
    takeaway3: 'إمكانية الحصول على رأي طبي ثانٍ مجاني من أطبائنا الاستشاريين في إسطنبول.',
    consultationCtaTitle: 'هل ترغب في استشارة الفريق الطبي المختص بخصوص هذه الحالة؟',
    consultationCtaSub: 'أرسل تقاريرك الطبية لنقوم بمراجعتها وإعداد خطة علاجية مخصصة وعرض أسعار فوري خلال 24 ساعة.',
    consultationBtn: 'طلب دراسة الحالة مجاناً',
    whatsappBtn: 'استشارة فورية عبر واتساب',
    translatePillLabel: 'قراءة المقال بلغة أخرى:',
    disclaimer: 'إخلاء مسؤولية طبي: المعلومات الواردة في هذا المقال هي للتثقيف والتوعية الصحية ولا تغني عن استشارة الطبيب المتخصص وفحص الحالة السريرية.',
    certifiedSource: 'محتوى طبي معتمد ومراجع',
  },
  en: {
    jciVerified: 'JCI-Accredited Clinical Review',
    readTime: 'min read',
    publishedOn: 'Published:',
    shareBtn: 'Share Article',
    shareCopied: 'Link copied successfully!',
    takeawaysTitle: 'Key Clinical Takeaways',
    takeaway1: 'Clinically verified information aligned with global health and JCI hospital standards.',
    takeaway2: 'Transparent cost benchmarking and success rate data across top Turkish medical centers.',
    takeaway3: 'Complimentary second medical opinion available from accredited consultants in Istanbul.',
    consultationCtaTitle: 'Need a Specialist Medical Consultation for This Condition?',
    consultationCtaSub: 'Submit your clinical reports for review by our surgical board; receive an individualized treatment assessment within 24 hours.',
    consultationBtn: 'Request Free Case Review',
    whatsappBtn: 'Direct WhatsApp Consultation',
    translatePillLabel: 'Read article in another language:',
    disclaimer: 'Medical Disclaimer: Information in this article is for clinical education and cannot replace individualized medical consultation with a board-certified physician.',
    certifiedSource: 'Certified Clinical Content',
  },
  fr: {
    jciVerified: 'Revue Clinique Certifiée JCI',
    readTime: 'min de lecture',
    publishedOn: 'Date de publication :',
    shareBtn: 'Partager l’Article',
    shareCopied: 'Lien copié avec succès !',
    takeawaysTitle: 'Points Clés & Synthèse Clinique',
    takeaway1: 'Informations médicales rigoureuses conformes aux standards internationaux JCI.',
    takeaway2: 'Analyse transparente des tarifs et taux de réussite dans les meilleurs hôpitaux turcs.',
    takeaway3: 'Second avis médical gratuit délivré par nos professeurs consultants à Istanbul.',
    consultationCtaTitle: 'Souhaitez-vous consulter l’équipe médicale pour ce traitement ?',
    consultationCtaSub: 'Transmettez vos examens médicaux pour une étude personnalisée et un devis complet sous 24h.',
    consultationBtn: 'Demande d’Étude Gratuite',
    whatsappBtn: 'Échanger sur WhatsApp',
    translatePillLabel: 'Lire l’article en une autre langue :',
    disclaimer: 'Avertissement médical : Ces informations sont destinées à l’information générale et ne se substituent aucunement à une consultation médicale spécialisée.',
    certifiedSource: 'Contenu Médical Certifié',
  },
};

export function ArticleReaderClient({ article }: ArticleReaderClientProps) {
  const { language } = useLanguage();
  const currentLang = (language === 'fr' || language === 'en' || language === 'ar' ? language : 'ar') as Lang;
  const [activeArticleLang, setActiveArticleLang] = useState<Lang>(currentLang);
  const [isCrossfading, setIsCrossfading] = useState(false);
  const [isTranslating, setIsTranslating] = useState(false);
  const [readingProgress, setReadingProgress] = useState(0);

  // Track reading scroll progress
  useEffect(() => {
    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (totalHeight > 0) {
        const currentProgress = (window.scrollY / totalHeight) * 100;
        setReadingProgress(Math.min(100, Math.max(0, currentProgress)));
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

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
    } catch {
      // Graceful fallback to existing content
    } finally {
      setIsTranslating(false);
    }
  }, [article, translations]);

  const handleLanguageSwitch = (lang: Lang) => {
    if (lang === activeArticleLang) return;
    setIsCrossfading(true);
    setActiveArticleLang(lang);
    if (!translations[lang]) {
      translateOnDemand(lang);
    }
    setTimeout(() => setIsCrossfading(false), 350);
  };

  const t = readerDict[activeArticleLang] || readerDict.ar;
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
    <>
      {/* Sticky Reading Progress Bar at the top of the viewport */}
      <div className="fixed top-0 inset-x-0 z-50 h-1 bg-slate-200/50 dark:bg-slate-800/50">
        <motion.div
          className="h-full bg-gradient-to-r from-sky-500 via-teal-400 to-emerald-400 shadow-sm"
          style={{ width: `${readingProgress}%` }}
        />
      </div>

      <article
        dir={activeArticleLang === 'ar' ? 'rtl' : 'ltr'}
        className="bg-white text-slate-900 border border-slate-200/80 shadow-md dark:bg-slate-900/90 dark:text-slate-100 dark:border-white/10 dark:shadow-sky-950/20 rounded-3xl p-6 sm:p-12 space-y-8 relative overflow-hidden transition-colors duration-300"
      >
        {/* Subtle Laser Shimmer Beam when switching language */}
        {isCrossfading && (
          <motion.div
            initial={{ opacity: 0, x: '-100%' }}
            animate={{ opacity: 1, x: '100%' }}
            transition={{ duration: 0.45, ease: 'easeInOut' }}
            className="pointer-events-none absolute inset-0 z-20 bg-gradient-to-r from-transparent via-sky-500/10 to-transparent"
          />
        )}

        {/* Reading Header Bar with Inline Language Switcher Pill */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-3 bg-slate-50/90 dark:bg-slate-800/80 rounded-2xl border border-slate-200/80 dark:border-slate-700/80">
          <div className="flex items-center gap-2">
            <Globe className="w-4 h-4 text-sky-600 dark:text-sky-400 shrink-0" />
            <span className="text-xs font-bold text-slate-700 dark:text-slate-200">{t.translatePillLabel}</span>
          </div>

          <div dir="ltr" className="relative inline-flex items-center rounded-full border border-slate-200 dark:border-slate-700 bg-slate-100/90 dark:bg-slate-900/90 p-1 shadow-2xs">
            {(['fr', 'ar', 'en'] as Lang[]).map((lang) => {
              const isSelected = activeArticleLang === lang;
              return (
                <button
                  key={lang}
                  type="button"
                  onClick={() => handleLanguageSwitch(lang)}
                  className={`relative px-3.5 py-1 rounded-full text-xs font-black uppercase transition-all duration-200 cursor-pointer select-none ${
                    isSelected
                      ? 'bg-gradient-to-r from-sky-600 to-teal-600 text-white shadow-md shadow-sky-600/30'
                      : 'text-slate-700 dark:text-slate-300 hover:text-sky-600 dark:hover:text-sky-400'
                  }`}
                >
                  <span className="relative z-10">{lang}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* On-demand Live Translation Banner */}
        {isTranslating && (
          <motion.div
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            className="flex items-center gap-3 px-4 py-3 rounded-2xl bg-gradient-to-r from-sky-500/10 via-teal-500/10 to-transparent border border-sky-200 dark:border-sky-800 text-sky-700 dark:text-sky-300 text-xs font-bold shadow-xs animate-pulse"
          >
            <Sparkles className="w-4 h-4 text-sky-600 dark:text-sky-400 animate-spin shrink-0" />
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
                <span className="bg-sky-50 dark:bg-sky-950/60 text-sky-700 dark:text-sky-400 text-xs font-bold px-3 py-1 rounded-full border border-sky-100 dark:border-sky-900/40">
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

                <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-teal-700 dark:text-teal-400 bg-teal-50 dark:bg-teal-950/60 px-2.5 py-0.5 rounded-full border border-teal-200 dark:border-teal-900/60">
                  <Sparkles className="w-3 h-3 text-teal-600 dark:text-teal-400" />
                  <span>{t.certifiedSource}</span>
                </span>
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
                  <div className="w-11 h-11 rounded-2xl bg-sky-50 dark:bg-sky-950/60 text-sky-700 dark:text-sky-400 flex items-center justify-center font-bold ring-4 ring-sky-50 dark:ring-sky-950/40">
                    <User className="w-5 h-5 text-sky-600 dark:text-sky-400" />
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
                  <CopyArticleButton text={t.shareBtn} copiedText={t.shareCopied} />
                </div>
              </div>
            </header>

            {/* Featured Image */}
            <div className="relative rounded-3xl overflow-hidden aspect-[16/9] shadow-md bg-slate-100 dark:bg-slate-800 border border-slate-200/60 dark:border-slate-700/60">
              <img
                src={article.image}
                alt={localizedTitle}
                className="w-full h-full object-cover"
                loading="eager"
              />
            </div>

            {/* Clinical Takeaways Box */}
            <div className="bg-sky-50/70 dark:bg-slate-800/60 border border-sky-100 dark:border-slate-700/80 rounded-3xl p-5 sm:p-6 space-y-3">
              <div className="flex items-center gap-2 text-sky-950 dark:text-sky-300 font-black text-sm">
                <Sparkles className="w-4 h-4 text-sky-600 dark:text-sky-400" />
                <span>{t.takeawaysTitle}</span>
              </div>
              <ul className="space-y-2 text-xs sm:text-sm text-slate-700 dark:text-slate-300">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-teal-500 shrink-0 mt-0.5" />
                  <span>{t.takeaway1}</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-teal-500 shrink-0 mt-0.5" />
                  <span>{t.takeaway2}</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-teal-500 shrink-0 mt-0.5" />
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
                  <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-full" />
                  <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-5/6" />
                  <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-4/6" />
                </div>
              )}
            </div>

            {/* Medical Disclaimer Alert */}
            <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-900 dark:text-amber-200 flex items-start gap-3">
              <AlertCircle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
              <p className="leading-relaxed">{t.disclaimer}</p>
            </div>

            {/* Medical Consultation Callout CTA */}
            <div className="bg-gradient-to-br from-sky-950 via-teal-950 to-slate-950 rounded-3xl p-6 sm:p-8 text-white space-y-4 shadow-xl border border-sky-800/40">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-teal-200 text-xs font-semibold">
                <CalendarCheck className="w-3.5 h-3.5 text-teal-400" />
                <span>AVICINNA Medical Coordination</span>
              </div>
              <h3 className="text-lg sm:text-xl font-black text-white leading-snug">
                {t.consultationCtaTitle}
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-2xl">
                {t.consultationCtaSub}
              </p>
              <div className="flex flex-wrap items-center gap-3 pt-2">
                <Link
                  href="/contact"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-sky-500 to-teal-500 hover:from-sky-600 hover:to-teal-600 text-white font-bold text-xs sm:text-sm shadow-md transition-all active:scale-95"
                >
                  <span>{t.consultationBtn}</span>
                </Link>
                <a
                  href={`https://wa.me/905367771747?text=${whatsappMessage}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs sm:text-sm shadow-md transition-all active:scale-95"
                >
                  <PhoneCall className="w-3.5 h-3.5" />
                  <span>{t.whatsappBtn}</span>
                </a>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </article>
    </>
  );
}
