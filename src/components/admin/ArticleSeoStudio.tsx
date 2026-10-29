'use client';

import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Sparkles,
  Target,
  Search,
  CheckCircle2,
  AlertTriangle,
  X,
  HelpCircle,
  Smartphone,
  Monitor,
  Zap,
  Globe,
  ChevronDown,
  ChevronUp,
  Sliders,
  TrendingUp,
  Star,
  Layers,
  FileText,
  Wrench,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { toast } from 'sonner';
import {
  analyzeArticleSeo,
  autoOptimizeArticleSeo,
  autoFixSeoCheck,
  formatReadingTime,
  formatWordCount,
} from '@/lib/seoAnalyzer';
import type { Locale } from './AdminShell';

interface ArticleSeoStudioProps {
  focusKeyword: string;
  setFocusKeyword: (val: string) => void;
  seoTitle: string;
  setSeoTitle: (val: string) => void;
  seoDescription: string;
  setSeoDescription: (val: string) => void;
  title: string;
  body: string;
  excerpt: string;
  setBody?: (val: string) => void;
  setExcerpt?: (val: string) => void;
  categorySlug?: string;
  imageUrl?: string;
  authorName?: string;
  hospitalName?: string;
  locale?: Locale;
  onOpenGuide?: () => void;
}

export function ArticleSeoStudio({
  focusKeyword,
  setFocusKeyword,
  seoTitle,
  setSeoTitle,
  seoDescription,
  setSeoDescription,
  title,
  body,
  excerpt,
  setBody,
  setExcerpt,
  categorySlug = 'oncology',
  imageUrl,
  authorName = 'Prof. Dr. Serdar Turhal',
  hospitalName = 'Acibadem Hospital',
  locale = 'ar',
  onOpenGuide,
}: ArticleSeoStudioProps) {
  const isRtl = locale === 'ar';
  const [serpDevice, setSerpDevice] = useState<'mobile' | 'desktop'>('mobile');
  const [checklistFilter, setChecklistFilter] = useState<'all' | 'issues' | 'passed'>('all');
  const [isChecklistExpanded, setIsChecklistExpanded] = useState(true);

  // Compute live SEO score & audit report
  const analysis = useMemo(() => {
    return analyzeArticleSeo({
      title,
      body,
      excerpt,
      focusKeyword,
      seoTitle,
      seoDescription,
      hasImage: Boolean(imageUrl),
    });
  }, [title, body, excerpt, focusKeyword, seoTitle, seoDescription, imageUrl]);

  // Handle 1-Click Automated AI Optimization
  const handleAutoOptimize = () => {
    const optimized = autoOptimizeArticleSeo({
      title,
      body,
      excerpt,
      category: categorySlug,
      currentKeyword: focusKeyword,
      hospital: hospitalName,
      author: authorName,
      lang: locale,
    });

    setFocusKeyword(optimized.focusKeyword);
    setSeoTitle(optimized.seoTitle);
    setSeoDescription(optimized.seoDescription);

    if (setExcerpt && optimized.enhancedExcerpt) {
      setExcerpt(optimized.enhancedExcerpt);
    }

    if (setBody && optimized.enhancedBody) {
      setBody(optimized.enhancedBody);
    }

    // Immediately calculate real post-optimization score
    const newAudit = analyzeArticleSeo({
      title,
      body: setBody ? optimized.enhancedBody : body,
      excerpt: setExcerpt ? optimized.enhancedExcerpt : excerpt,
      focusKeyword: optimized.focusKeyword,
      seoTitle: optimized.seoTitle,
      seoDescription: optimized.seoDescription,
      hasImage: Boolean(imageUrl),
    });

    try {
      confetti({
        particleCount: 60,
        spread: 70,
        origin: { y: 0.65 },
        colors: ['#0284c7', '#0d9488', '#10b981', '#f59e0b'],
      });
    } catch {}

    const realScore = newAudit.score;
    toast.success(
      locale === 'ar'
        ? `تم تحسين السيو بالذكاء الاصطناعي بنجاح (المؤشر الحالي: ${realScore}/100) 🚀`
        : locale === 'fr'
        ? `SEO optimisé par IA avec succès (Score atteint : ${realScore}/100) 🚀`
        : `SEO automated & optimized successfully (Score: ${realScore}/100) 🚀`
    );
  };

  // Handle 1-Click Targeted Quick Fix for individual issues
  const handleQuickFix = (checkId: string) => {
    const fix = autoFixSeoCheck(checkId, {
      focusKeyword,
      seoTitle,
      seoDescription,
      body,
      excerpt,
      lang: locale,
    });

    if (fix.seoTitle) setSeoTitle(fix.seoTitle);
    if (fix.seoDescription) setSeoDescription(fix.seoDescription);
    if (fix.focusKeyword) setFocusKeyword(fix.focusKeyword);
    if (fix.body && setBody) setBody(fix.body);
    if (fix.excerpt && setExcerpt) setExcerpt(fix.excerpt);

    toast.success(fix.message[locale] || fix.message.ar);
  };

  // Grade color tokens
  const scoreColors = {
    excellent: {
      bg: 'bg-emerald-500/15',
      text: 'text-emerald-700 dark:text-emerald-300',
      border: 'border-emerald-500/30',
      badge: 'bg-emerald-500',
      ring: 'ring-emerald-500/20',
      bar: 'from-emerald-500 to-teal-500',
      label: locale === 'ar' ? 'ممتاز (مؤهل لتصدر جوجل)' : locale === 'fr' ? 'Excellent (Éligible #1)' : 'Excellent (Rank #1 Ready)',
    },
    good: {
      bg: 'bg-teal-500/15',
      text: 'text-teal-700 dark:text-teal-300',
      border: 'border-teal-500/30',
      badge: 'bg-teal-500',
      ring: 'ring-teal-500/20',
      bar: 'from-sky-500 to-teal-500',
      label: locale === 'ar' ? 'جيد جداً (مؤهل للأرشفة)' : locale === 'fr' ? 'Très Bon (Indexable)' : 'Very Good (Indexable)',
    },
    fair: {
      bg: 'bg-amber-500/15',
      text: 'text-amber-700 dark:text-amber-300',
      border: 'border-amber-500/30',
      badge: 'bg-amber-500',
      ring: 'ring-amber-500/20',
      bar: 'from-amber-500 to-yellow-500',
      label: locale === 'ar' ? 'متوسط (يحتاج ضبط)' : locale === 'fr' ? 'Moyen (À peaufiner)' : 'Fair (Needs tuning)',
    },
    poor: {
      bg: 'bg-rose-500/15',
      text: 'text-rose-700 dark:text-rose-300',
      border: 'border-rose-500/30',
      badge: 'bg-rose-500',
      ring: 'ring-rose-500/20',
      bar: 'from-rose-500 to-amber-500',
      label: locale === 'ar' ? 'ضعيف (فرصة تصدر منخفضة)' : locale === 'fr' ? 'Faible (Sous-optimisé)' : 'Poor (Needs work)',
    },
  }[analysis.grade];

  // Filter checks
  const filteredChecks = useMemo(() => {
    if (checklistFilter === 'passed') return analysis.checks.filter((c) => c.status === 'pass');
    if (checklistFilter === 'issues') return analysis.checks.filter((c) => c.status !== 'pass');
    return analysis.checks;
  }, [analysis.checks, checklistFilter]);

  const passedCount = analysis.checks.filter((c) => c.status === 'pass').length;
  const issuesCount = analysis.checks.length - passedCount;

  // Title & description length stats
  const effectiveTitle = seoTitle || title || 'عنوان المقال الطبي';
  const effectiveDesc =
    seoDescription ||
    excerpt ||
    'وصف المقال الذي يظهر أسفل العنوان في محركات بحث جوجل لجذب المرضى...';

  const titleLength = effectiveTitle.length;
  const descLength = effectiveDesc.length;

  return (
    <div
      dir={isRtl ? 'rtl' : 'ltr'}
      className="rounded-3xl border border-sky-200/90 dark:border-slate-700/80 bg-gradient-to-br from-white via-sky-50/20 to-teal-50/15 dark:from-slate-900/95 dark:via-slate-900/80 dark:to-slate-950 p-5 sm:p-6 space-y-6 shadow-sm"
    >
      {/* Studio Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200/70 dark:border-slate-800">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-sky-600 to-teal-600 text-white shadow-md shadow-sky-600/25">
            <Target className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="text-sm sm:text-base font-black text-slate-900 dark:text-white">
                {locale === 'ar'
                  ? 'استوديو السيو الطبي المتقدم (Rank Math & Yoast Studio)'
                  : locale === 'fr'
                  ? 'Studio SEO Médical (Rank Math & Yoast Studio)'
                  : 'Medical SEO Studio (Rank Math & Yoast Studio)'}
              </h3>
              <span className="hidden sm:inline-flex px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-sky-500/10 text-sky-700 dark:text-sky-300 border border-sky-500/20">
                PRO 2026
              </span>
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
              {locale === 'ar'
                ? 'تحليل لحظي شامل لفرص تصدر جوجل بمعايير Google E-E-A-T وحقن السكيما الغنية.'
                : locale === 'fr'
                ? 'Analyse en temps réel pour dominer les résultats Google selon les normes E-E-A-T.'
                : 'Real-time content audit and automated Schema injection for Google #1 rankings.'}
            </p>
          </div>
        </div>

        {/* Action Controls: 1-Click Optimizer + Guide Button */}
        <div className="flex items-center gap-2 flex-wrap">
          <button
            type="button"
            onClick={handleAutoOptimize}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-gradient-to-r from-sky-600 via-teal-600 to-emerald-600 hover:from-sky-700 hover:to-emerald-700 text-white text-xs font-bold shadow-md shadow-teal-600/25 transition-all cursor-pointer active:scale-98"
            title={locale === 'ar' ? 'توليد وضبط السيو تلقائياً بالذكاء الاصطناعي' : 'Auto-Generate SEO with AI'}
          >
            <Zap className="w-3.5 h-3.5 text-yellow-300 fill-yellow-300" />
            <span>
              {locale === 'ar'
                ? '⚡ تحسين السيو تلقائياً'
                : locale === 'fr'
                ? '⚡ Optimiser en 1 Clic'
                : '⚡ Auto-Optimize SEO'}
            </span>
          </button>

          {onOpenGuide && (
            <button
              type="button"
              onClick={onOpenGuide}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white hover:bg-slate-50 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 text-xs font-bold shadow-2xs transition-colors cursor-pointer"
            >
              <HelpCircle className="w-3.5 h-3.5 text-sky-600 dark:text-sky-400" />
              <span>{locale === 'ar' ? 'دليل السيو' : locale === 'fr' ? 'Guide SEO' : 'SEO Guide'}</span>
            </button>
          )}
        </div>
      </div>

      {/* Hero Score Dial & Metrics Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 p-4 rounded-2xl bg-white/90 dark:bg-slate-900/80 border border-slate-200/80 dark:border-slate-800 shadow-2xs">
        {/* Score Radial Dial */}
        <div className="sm:col-span-1 flex items-center gap-3.5 border-b sm:border-b-0 sm:border-e border-slate-100 dark:border-slate-800 pb-3 sm:pb-0 sm:pe-4">
          <div className="relative flex h-14 w-14 shrink-0 items-center justify-center">
            {/* Background Circle */}
            <svg className="h-full w-full -rotate-90 transform" viewBox="0 0 36 36">
              <path
                className="text-slate-100 dark:text-slate-800"
                strokeWidth="3.5"
                stroke="currentColor"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
              <path
                className={`transition-all duration-700 ease-out ${
                  analysis.score >= 80
                    ? 'text-emerald-500'
                    : analysis.score >= 60
                    ? 'text-teal-500'
                    : analysis.score >= 40
                    ? 'text-amber-500'
                    : 'text-rose-500'
                }`}
                strokeDasharray={`${analysis.score}, 100`}
                strokeWidth="3.5"
                strokeLinecap="round"
                stroke="currentColor"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
            </svg>
            <span className="absolute font-mono text-sm font-black text-slate-900 dark:text-white">
              {analysis.score}
            </span>
          </div>

          <div>
            <div className="text-[10px] font-mono uppercase tracking-wider text-slate-400">
              {locale === 'ar' ? 'مؤشر سيو جوجل' : 'Rank Math Score'}
            </div>
            <div className={`inline-flex items-center gap-1 mt-0.5 px-2 py-0.5 rounded-full text-[10px] font-bold ${scoreColors.bg} ${scoreColors.text} ${scoreColors.border} border`}>
              <span className={`h-1.5 w-1.5 rounded-full ${scoreColors.badge} animate-pulse`} />
              <span>{scoreColors.label}</span>
            </div>
          </div>
        </div>

        {/* 3 Key Clinical Metric Tiles with Precise Arabic Pluralization */}
        <div className="sm:col-span-3 grid grid-cols-3 gap-2 text-center">
          <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
            <div className="text-sm font-black text-slate-900 dark:text-white tabular-nums">
              {analysis.metrics.wordCount}
            </div>
            <div className="text-[10px] text-slate-500 dark:text-slate-400 font-semibold mt-0.5">
              {formatWordCount(analysis.metrics.wordCount, locale)}
            </div>
          </div>

          <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
            <div className="text-sm font-black text-teal-600 dark:text-teal-400 tabular-nums">
              {analysis.metrics.keywordDensity}%
            </div>
            <div className="text-[10px] text-slate-500 dark:text-slate-400 font-semibold mt-0.5">
              {analysis.metrics.keywordDensity === 0
                ? (locale === 'ar' ? 'كثافة الكلمة' : 'Keyword Density')
                : (locale === 'ar' ? 'كثافة مثالية' : 'Optimal Density')}
            </div>
          </div>

          <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
            <div className="text-sm font-black text-slate-900 dark:text-white tabular-nums">
              {formatReadingTime(analysis.metrics.readingTimeMinutes, locale)}
            </div>
            <div className="text-[10px] text-slate-500 dark:text-slate-400 font-semibold mt-0.5">
              {locale === 'ar' ? 'مدة القراءة' : 'Reading Time'}
            </div>
          </div>
        </div>
      </div>

      {/* Google Search Live SERP Simulator */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
            <Search className="w-3.5 h-3.5 text-sky-600 dark:text-sky-400" />
            <span>{locale === 'ar' ? 'معاينة حية لطريقة ظهور المقال في جوجل (SERP Preview)' : 'Google Search SERP Preview'}</span>
          </label>

          {/* Device Switcher */}
          <div className="flex items-center gap-1 p-0.5 rounded-lg bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold">
            <button
              type="button"
              onClick={() => setSerpDevice('mobile')}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-md transition-all cursor-pointer ${
                serpDevice === 'mobile'
                  ? 'bg-white dark:bg-slate-700 text-sky-600 dark:text-sky-300 shadow-2xs font-extrabold'
                  : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
            >
              <Smartphone className="w-3 h-3" />
              <span>{locale === 'ar' ? 'الهاتف' : 'Mobile'}</span>
            </button>
            <button
              type="button"
              onClick={() => setSerpDevice('desktop')}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-md transition-all cursor-pointer ${
                serpDevice === 'desktop'
                  ? 'bg-white dark:bg-slate-700 text-sky-600 dark:text-sky-300 shadow-2xs font-extrabold'
                  : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
            >
              <Monitor className="w-3 h-3" />
              <span>{locale === 'ar' ? 'الكمبيوتر' : 'Desktop'}</span>
            </button>
          </div>
        </div>

        {/* SERP Card Mockup */}
        <div
          className={`rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-950 p-4 sm:p-5 transition-all shadow-xs ${
            serpDevice === 'mobile' ? 'max-w-md mx-auto sm:mx-0' : 'w-full'
          }`}
        >
          {/* URL Breadcrumb */}
          <div className="flex items-center gap-2 text-[11px] text-slate-600 dark:text-slate-400 font-sans">
            <div className="flex h-5 w-5 items-center justify-center rounded-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-[10px] font-black text-sky-600">
              A
            </div>
            <div className="flex items-center gap-1 truncate text-xs text-slate-800 dark:text-slate-300" dir="ltr">
              <span className="font-semibold">avicinna.com</span>
              <span className="text-slate-400">›</span>
              <span className="text-slate-500">blog</span>
              <span className="text-slate-400">›</span>
              <span className="text-slate-500 truncate">{categorySlug}</span>
            </div>
          </div>

          {/* Clickable Blue Title */}
          <h4 className="mt-2 text-base sm:text-lg font-medium text-[#1a0dab] dark:text-[#8ab4f8] hover:underline cursor-pointer leading-snug line-clamp-2">
            {effectiveTitle}
          </h4>

          {/* Star Rating Rich Snippet */}
          <div className="mt-1 flex items-center gap-2 text-[11px] text-slate-600 dark:text-slate-400">
            <div className="flex items-center text-amber-500">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-3 h-3 fill-current" />
              ))}
            </div>
            <span className="font-semibold text-slate-800 dark:text-slate-200">4.9</span>
            <span className="text-slate-400">(142 {locale === 'ar' ? 'تقييم' : 'reviews'})</span>
            <span className="text-slate-300 dark:text-slate-700">•</span>
            <span className="text-emerald-700 dark:text-emerald-400 font-medium">
              {locale === 'ar' ? 'استشارة مجانية' : 'Free Consultation'}
            </span>
          </div>

          {/* Meta Description with Keyword Highlight */}
          <p className="mt-1.5 text-xs text-[#4d5156] dark:text-[#bdc1c6] leading-relaxed line-clamp-3">
            {effectiveDesc}
          </p>
        </div>
      </div>

      {/* SEO Form Inputs */}
      <div className="space-y-4 pt-1">
        {/* Focus Keyword */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
              <span>{locale === 'ar' ? 'الكلمة المفتاحية المستهدفة (Focus Keyword)' : 'Focus Keyword'}</span>
              <span className="text-rose-500">*</span>
            </label>
            <span className="text-[10px] text-slate-400 font-mono">
              {focusKeyword ? `${focusKeyword.split(/\s+/).length} ${locale === 'ar' ? 'كلمات' : 'words'}` : 'Required'}
            </span>
          </div>
          <div className="relative">
            <input
              type="text"
              value={focusKeyword}
              onChange={(e) => setFocusKeyword(e.target.value)}
              placeholder={locale === 'ar' ? 'مثال: زراعة الكلى في تركيا، علاج السرطان في إسطنبول...' : 'e.g. Kidney Transplant in Turkey...'}
              className="w-full bg-white dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700 focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 dark:text-white outline-none transition-all placeholder:text-slate-400"
            />
          </div>
        </div>

        {/* SEO Title & Length Meter */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
              {locale === 'ar' ? 'عنوان السيو في جوجل (SEO Title)' : 'SEO Title in Google'}
            </label>
            <span
              className={`text-[10px] font-mono font-bold ${
                titleLength >= 40 && titleLength <= 60
                  ? 'text-emerald-600'
                  : titleLength > 60
                  ? 'text-rose-500'
                  : 'text-amber-500'
              }`}
            >
              {titleLength} / 60 {locale === 'ar' ? 'حرف' : 'chars'}
            </span>
          </div>
          <input
            type="text"
            value={seoTitle}
            onChange={(e) => setSeoTitle(e.target.value)}
            placeholder={title || 'SEO Title'}
            className="w-full bg-white dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700 focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 dark:text-white outline-none transition-all placeholder:text-slate-400"
          />
          {/* Micro Progress Bar */}
          <div className="w-full h-1 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
            <div
              className={`h-full transition-all duration-300 ${
                titleLength >= 40 && titleLength <= 60
                  ? 'bg-emerald-500'
                  : titleLength > 60
                  ? 'bg-rose-500'
                  : 'bg-amber-400'
              }`}
              style={{ width: `${Math.min(100, (titleLength / 60) * 100)}%` }}
            />
          </div>
        </div>

        {/* Meta Description & Length Meter */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
              {locale === 'ar' ? 'الوصف الميتا لمحركات البحث (Meta Description)' : 'Meta Description'}
            </label>
            <span
              className={`text-[10px] font-mono font-bold ${
                descLength >= 120 && descLength <= 160
                  ? 'text-emerald-600'
                  : descLength > 160
                  ? 'text-rose-500'
                  : 'text-amber-500'
              }`}
            >
              {descLength} / 160 {locale === 'ar' ? 'حرف' : 'chars'}
            </span>
          </div>
          <textarea
            rows={2}
            value={seoDescription}
            onChange={(e) => setSeoDescription(e.target.value)}
            placeholder={excerpt || 'Meta Description'}
            className="w-full bg-white dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700 focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 dark:text-white outline-none transition-all placeholder:text-slate-400 leading-relaxed"
          />
          {/* Micro Progress Bar */}
          <div className="w-full h-1 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
            <div
              className={`h-full transition-all duration-300 ${
                descLength >= 120 && descLength <= 160
                  ? 'bg-emerald-500'
                  : descLength > 160
                  ? 'bg-rose-500'
                  : 'bg-amber-400'
              }`}
              style={{ width: `${Math.min(100, (descLength / 160) * 100)}%` }}
            />
          </div>
        </div>
      </div>

      {/* Rank Math / Yoast SEO Detailed Audit Checklist */}
      <div className="rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-white/80 dark:bg-slate-900/60 overflow-hidden shadow-2xs">
        {/* Accordion Toggle Header */}
        <div
          onClick={() => setIsChecklistExpanded((prev) => !prev)}
          className="p-3.5 sm:px-4 flex items-center justify-between cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors"
        >
          <div className="flex items-center gap-2">
            <Sliders className="w-4 h-4 text-sky-600 dark:text-sky-400" />
            <span className="text-xs font-bold text-slate-900 dark:text-white">
              {locale === 'ar' ? 'فحص معايير السيو التفصيلي' : 'Detailed SEO Audit Checklist'}
            </span>
            <div className="flex items-center gap-1.5 ms-2">
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-700 dark:text-emerald-300">
                {passedCount} {locale === 'ar' ? 'ناجح' : 'passed'}
              </span>
              {issuesCount > 0 && (
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/10 text-amber-700 dark:text-amber-300">
                  {issuesCount} {locale === 'ar' ? 'للتطوير' : 'to fix'}
                </span>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Filter buttons */}
            <div
              onClick={(e) => e.stopPropagation()}
              className="hidden sm:flex items-center gap-1 text-[10px] font-bold"
            >
              <button
                type="button"
                onClick={() => setChecklistFilter('all')}
                className={`px-2 py-0.5 rounded ${
                  checklistFilter === 'all'
                    ? 'bg-slate-200 dark:bg-slate-700 text-slate-900 dark:text-white'
                    : 'text-slate-400 hover:text-slate-700'
                }`}
              >
                {locale === 'ar' ? 'الكل' : 'All'}
              </button>
              <button
                type="button"
                onClick={() => setChecklistFilter('issues')}
                className={`px-2 py-0.5 rounded ${
                  checklistFilter === 'issues'
                    ? 'bg-amber-500/20 text-amber-800 dark:text-amber-300'
                    : 'text-slate-400 hover:text-slate-700'
                }`}
              >
                {locale === 'ar' ? 'الملاحظات' : 'Issues'}
              </button>
              <button
                type="button"
                onClick={() => setChecklistFilter('passed')}
                className={`px-2 py-0.5 rounded ${
                  checklistFilter === 'passed'
                    ? 'bg-emerald-500/20 text-emerald-800 dark:text-emerald-300'
                    : 'text-slate-400 hover:text-slate-700'
                }`}
              >
                {locale === 'ar' ? 'الناجحة' : 'Passed'}
              </button>
            </div>

            {isChecklistExpanded ? (
              <ChevronUp className="w-4 h-4 text-slate-400" />
            ) : (
              <ChevronDown className="w-4 h-4 text-slate-400" />
            )}
          </div>
        </div>

        {/* Checklist Content */}
        <AnimatePresence>
          {isChecklistExpanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="border-t border-slate-100 dark:border-slate-800 divide-y divide-slate-100 dark:divide-slate-800/80"
            >
              {filteredChecks.map((check) => {
                const checkTitle = check.title[locale] || check.title.ar;
                const checkDesc = check.desc[locale] || check.desc.ar;

                return (
                  <div key={check.id} className="p-3 sm:px-4 flex items-start gap-3 text-xs">
                    <div className="shrink-0 mt-0.5">
                      {check.status === 'pass' ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-500 stroke-[2.5]" />
                      ) : check.status === 'warning' ? (
                        <AlertTriangle className="w-4 h-4 text-amber-500 stroke-[2.5]" />
                      ) : (
                        <X className="w-4 h-4 text-rose-500 stroke-[2.5]" />
                      )}
                    </div>
                    <div className="space-y-1 flex-1 min-w-0">
                      <div className="font-bold text-slate-900 dark:text-white flex items-center justify-between gap-2">
                        <span className="leading-snug">{checkTitle}</span>
                        <div className="flex items-center gap-2 shrink-0">
                          {check.scoreImpact > 0 && (
                            <span className="text-[10px] font-mono font-bold text-emerald-600 dark:text-emerald-400">
                              +{check.scoreImpact}
                            </span>
                          )}
                          {check.status !== 'pass' && (
                            <button
                              type="button"
                              onClick={() => handleQuickFix(check.id)}
                              className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg bg-sky-50 hover:bg-sky-100 dark:bg-sky-950/60 dark:hover:bg-sky-900/80 text-sky-700 dark:text-sky-300 border border-sky-200 dark:border-sky-800 text-[10px] font-bold transition-all cursor-pointer active:scale-95 shadow-2xs"
                              title={locale === 'ar' ? 'إصلاح تلقائي بنقرة واحدة' : '1-Click Auto-Fix'}
                            >
                              <Wrench className="w-2.5 h-2.5 text-sky-600 dark:text-sky-400" />
                              <span>{locale === 'ar' ? 'إصلاح تلقائي' : locale === 'fr' ? 'Corriger' : 'Quick Fix'}</span>
                            </button>
                          )}
                        </div>
                      </div>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
                        {checkDesc}
                      </p>
                    </div>
                  </div>
                );
              })}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
