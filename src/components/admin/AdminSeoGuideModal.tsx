'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Sparkles,
  Target,
  Search,
  CheckCircle2,
  AlertTriangle,
  BookOpen,
  Zap,
  Globe,
  Award,
  HelpCircle,
  X,
  ExternalLink,
  ChevronRight,
  TrendingUp,
  ShieldCheck,
  Star,
  Layers,
} from 'lucide-react';
import { ModalPortal } from './ModalPortal';
import type { Locale } from './AdminShell';

interface AdminSeoGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
  locale?: Locale;
}

export function AdminSeoGuideModal({
  isOpen,
  onClose,
  locale = 'ar',
}: AdminSeoGuideModalProps) {
  const [activeTab, setActiveTab] = useState<'quickstart' | 'score' | 'eeat' | 'snippets'>('quickstart');
  const isRtl = locale === 'ar';

  const t = {
    ar: {
      badge: 'دليل السيو الطبي وتصدر محركات البحث',
      title: 'دليل تصدر نتائج جوجل (Rank Math & Yoast SEO Masterclass)',
      subtitle: 'كيف تحقق المقالات الطبية المركز الأول في نتائج بحث جوجل بجدارة وسرعة فائقة وفق معايير Google Medic & E-E-A-T.',
      tabs: {
        quickstart: '⚡ التحسين التلقائي',
        score: '🎯 مقياس السيو (0-100)',
        eeat: '🩺 معايير E-E-A-T الطبية',
        snippets: '🌟 السكيما والنتائج الغنية',
      },
      closeBtn: 'إغلاق الدليل',
      quickstartTitle: 'كيف تنشر مقالاً بتهيئة سيو 100/100 في 3 ثوانٍ فقط؟',
      quickstartDesc: 'تم تزويد لوحة أفيسينا بمحرك ذكاء اصطناعي مؤتمت بالكامل يقوم بتحليل المحتوى الطبي وصياغة أنسب المعايير لمحركات البحث دون الحاجة لأي خبرة مسبقة بالسيو.',
      step1Title: '1. كتابة العنوان والمحتوى الطبي',
      step1Desc: 'اكتب عنوان المقال وفقراته الرئيسية في محرر المقال، واختر التصنيف المناسب (مثل: علاج الأورام، جراحة العظام، زراعة الكلى).',
      step2Title: '2. النقر على زر "التحسين التلقائي بالسيو"',
      step2Desc: 'اضغط على زر (⚡ تحسين السيو بالذكاء الاصطناعي)، وسيقوم النظام فوراً باستخراج الكلمة المفتاحية، وتوليد عنوان السيو الأمثل لجوجل، وصياغة الميتا ديسكريبشن بدقة.',
      step3Title: '3. مراجعة المعاينة الحية لجوجل (Google SERP)',
      step3Desc: 'شاهد محاكاة حية لطريقة ظهور مقالك على شاشات الهواتف والكمبيوتر في جوجل، وتأكد من وصول المؤشر للون الأخضر (85 - 100).',
    },
    en: {
      badge: 'Medical SEO & Ranking Master Guide',
      title: 'Google #1 Ranking Guide (Rank Math & Yoast Standards)',
      subtitle: 'Master clinical article ranking on Google search with automated AI optimization and Google E-E-A-T healthcare compliance.',
      tabs: {
        quickstart: '⚡ 1-Click AI',
        score: '🎯 Score (0 - 100)',
        eeat: '🩺 Medical E-E-A-T',
        snippets: '🌟 Schema & Snippets',
      },
      closeBtn: 'Close Guide',
      quickstartTitle: 'How to achieve a 100/100 SEO Score in under 3 seconds?',
      quickstartDesc: 'AVICINNA is equipped with an automated medical SEO intelligence engine that analyzes content and generates high-ranking metadata without manual effort.',
      step1Title: '1. Write Title & Medical Insights',
      step1Desc: 'Draft your article title and key paragraphs, choosing the appropriate medical specialty (e.g. Oncology, Orthopedics, Transplants).',
      step2Title: '2. Click "One-Click Auto-Optimize"',
      step2Desc: 'Hit the (⚡ Auto-Optimize SEO) button. The engine extracts high-intent keywords, writes a CTR-driven Google title, and crafts a meta description.',
      step3Title: '3. Verify Real-Time Google SERP Preview',
      step3Desc: 'Preview exactly how your article looks on desktop and mobile search viewports, aiming for an emerald green score (85 - 100).',
    },
    fr: {
      badge: 'Guide Référencement Médical & Google #1',
      title: 'Guide d’Excellence SEO Google (Normes Rank Math & Yoast)',
      subtitle: 'Positionnez vos articles médicaux en tête des résultats Google grâce à l’optimisation automatisée et aux critères E-E-A-T.',
      tabs: {
        quickstart: '⚡ Optimisation 1 Clic',
        score: '🎯 Score (0 - 100)',
        eeat: '🩺 Critères E-E-A-T',
        snippets: '🌟 Schémas & Snippets',
      },
      closeBtn: 'Fermer le Guide',
      quickstartTitle: 'Comment obtenir un score SEO de 100/100 en 3 secondes ?',
      quickstartDesc: 'AVICINNA intègre un moteur d’optimisation automatique qui analyse le contenu médical et génère instantanément les métadonnées les plus performantes.',
      step1Title: '1. Rédigez le titre et le corps de l’article',
      step1Desc: 'Saisissez le titre et les paragraphes cliniques dans l’éditeur en sélectionnant la spécialité appropriée.',
      step2Title: '2. Cliquez sur "Optimiser le SEO en 1 Clic"',
      step2Desc: 'Cliquez sur le bouton (⚡ Optimiser le SEO). Le système extrait le mot-clé cible, génère le titre Google et rédige la meta description.',
      step3Title: '3. Validez l’Aperçu Google SERP en Direct',
      step3Desc: 'Visualisez le rendu réel sur mobile et ordinateur pour atteindre la zone verte optimale (85 - 100).',
    },
  }[locale] || {
    badge: 'Medical SEO Master Guide',
    title: 'Google #1 Ranking Guide',
    subtitle: 'SEO optimization for medical articles.',
    tabs: {
      quickstart: '⚡ 1-Click AI',
      score: '🎯 Score (0 - 100)',
      eeat: '🩺 Google E-E-A-T',
      snippets: '🌟 Rich Snippets',
    },
    closeBtn: 'Close',
    quickstartTitle: 'Fast SEO Optimization',
    quickstartDesc: 'Automated SEO generator.',
    step1Title: '1. Write content',
    step1Desc: 'Add title and paragraphs.',
    step2Title: '2. Click Auto-Optimize',
    step2Desc: 'Click the button to optimize.',
    step3Title: '3. Preview in SERP',
    step3Desc: 'Check the score.',
  };

  return (
    <ModalPortal isOpen={isOpen}>
      <div
        dir={isRtl ? 'rtl' : 'ltr'}
        className="fixed inset-0 z-[120] flex items-center justify-center p-3 sm:p-6 bg-slate-950/70 backdrop-blur-md animate-in fade-in duration-200"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          className="relative bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-3xl w-full max-h-[88vh] flex flex-col shadow-2xl overflow-hidden"
        >
          {/* Header */}
          <div className="p-5 sm:p-6 border-b border-slate-100 dark:border-slate-800 flex items-start justify-between gap-4 bg-gradient-to-r from-sky-500/5 via-teal-500/5 to-transparent">
            <div className="flex items-start gap-3.5">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-sky-600 to-teal-600 text-white shadow-md shadow-sky-600/20">
                <Target className="h-6 w-6" />
              </div>
              <div>
                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-sky-500/10 text-sky-700 dark:text-sky-300 text-[11px] font-bold mb-1">
                  <Sparkles className="w-3 h-3 text-sky-600 dark:text-sky-400" />
                  <span>{t.badge}</span>
                </div>
                <h3 className="text-base sm:text-lg font-black text-slate-900 dark:text-white leading-tight">
                  {t.title}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-xl leading-relaxed">
                  {t.subtitle}
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="rounded-full p-2 text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation Tabs - Full Width Segmented Control with Zero Clipping */}
          <div className="p-3 sm:px-6 border-b border-slate-100 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-800/40">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {[
                { id: 'quickstart', label: t.tabs.quickstart },
                { id: 'score', label: t.tabs.score },
                { id: 'eeat', label: t.tabs.eeat },
                { id: 'snippets', label: t.tabs.snippets },
              ].map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`px-3 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center text-center cursor-pointer ${
                    activeTab === tab.id
                      ? 'bg-white dark:bg-slate-800 text-sky-600 dark:text-sky-400 shadow-sm border border-slate-200/90 dark:border-slate-700 font-black scale-[1.01]'
                      : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-white/50 dark:hover:bg-slate-800/50'
                  }`}
                >
                  <span className="truncate">{tab.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Scrollable Content Body */}
          <div className="p-5 sm:p-6 overflow-y-auto space-y-6 flex-1 text-slate-800 dark:text-slate-200">
            {/* Tab 1: Quickstart AI */}
            {activeTab === 'quickstart' && (
              <div className="space-y-5 animate-in fade-in duration-150">
                <div className="p-4 rounded-2xl bg-gradient-to-r from-sky-500/10 via-teal-500/10 to-transparent border border-sky-500/20">
                  <h4 className="text-sm font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                    <Zap className="w-4 h-4 text-amber-500 fill-amber-500" />
                    <span>{t.quickstartTitle}</span>
                  </h4>
                  <p className="text-xs text-slate-600 dark:text-slate-300 mt-1.5 leading-relaxed">
                    {t.quickstartDesc}
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
                  <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-800 space-y-2">
                    <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-sky-500 text-white font-bold text-xs">
                      1
                    </div>
                    <h5 className="font-bold text-xs text-slate-900 dark:text-white">
                      {t.step1Title}
                    </h5>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
                      {t.step1Desc}
                    </p>
                  </div>

                  <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-800 space-y-2">
                    <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-teal-500 text-white font-bold text-xs">
                      2
                    </div>
                    <h5 className="font-bold text-xs text-slate-900 dark:text-white">
                      {t.step2Title}
                    </h5>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
                      {t.step2Desc}
                    </p>
                  </div>

                  <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-800 space-y-2">
                    <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-500 text-white font-bold text-xs">
                      3
                    </div>
                    <h5 className="font-bold text-xs text-slate-900 dark:text-white">
                      {t.step3Title}
                    </h5>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
                      {t.step3Desc}
                    </p>
                  </div>
                </div>

                {/* Practical Example Box */}
                <div className="rounded-2xl border border-slate-200 dark:border-slate-800 p-4 bg-white dark:bg-slate-900 space-y-3">
                  <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400">
                    {locale === 'ar' ? 'نموذج تطبيقي فوري لنتائج التحسين' : 'Real-World Output Simulation'}
                  </span>
                  <div className="space-y-1.5 text-xs">
                    <div className="flex items-center gap-2">
                      <span className="text-slate-400 w-28 shrink-0">{locale === 'ar' ? 'الكلمة المفتاحية:' : 'Focus Keyword:'}</span>
                      <span className="font-bold text-teal-600 dark:text-teal-400 bg-teal-500/10 px-2 py-0.5 rounded">
                        {locale === 'ar' ? 'زراعة الكلى في تركيا' : 'Kidney Transplant in Turkey'}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-slate-400 w-28 shrink-0">{locale === 'ar' ? 'عنوان السيو (52 حرف):' : 'SEO Title (52 chars):'}</span>
                      <span className="font-semibold text-slate-900 dark:text-white">
                        {locale === 'ar' ? 'زراعة الكلى في تركيا: دليلك الشامل ونسب النجاح | AVICINNA' : 'Kidney Transplant in Turkey: 2026 Guide & Clinics | AVICINNA'}
                      </span>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="text-slate-400 w-28 shrink-0">{locale === 'ar' ? 'الميتا ديسكريبشن:' : 'Meta Description:'}</span>
                      <span className="text-slate-600 dark:text-slate-300 text-[11px]">
                        {locale === 'ar'
                          ? 'تعرف على تكلفة زراعة الكلى في أفضل مشافي إسطنبول مع استشاريي AVICINNA ونسب نجاح تتجاوز 95%. احصل على استشارة مجانية ودراسة ملفك الآن.'
                          : 'Discover kidney transplant costs in top Istanbul hospitals with AVICINNA consultants and >95% success rate. Get a free medical review now.'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Tab 2: SEO Score Gauge */}
            {activeTab === 'score' && (
              <div className="space-y-4 animate-in fade-in duration-150">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="p-3.5 rounded-2xl bg-emerald-50/70 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 text-center">
                    <div className="text-2xl font-black text-emerald-600 dark:text-emerald-400">80 - 100</div>
                    <div className="text-xs font-bold text-emerald-800 dark:text-emerald-300 mt-0.5">
                      {locale === 'ar' ? 'ممتاز (مؤهل للصفحة الأولى)' : 'Excellent (Top Rank Ready)'}
                    </div>
                    <p className="text-[10px] text-emerald-700/80 dark:text-emerald-400/80 mt-1">
                      {locale === 'ar' ? 'تطابق كامل لكافة متطلبات خوارزميات جوجل' : 'Full compliance with Google algorithm factors'}
                    </p>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-amber-50/70 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 text-center">
                    <div className="text-2xl font-black text-amber-600 dark:text-amber-400">50 - 79</div>
                    <div className="text-xs font-bold text-amber-800 dark:text-amber-300 mt-0.5">
                      {locale === 'ar' ? 'جيد (يحتاج لمسات بسيطة)' : 'Good (Needs minor tweaks)'}
                    </div>
                    <p className="text-[10px] text-amber-700/80 dark:text-amber-400/80 mt-1">
                      {locale === 'ar' ? 'ينقصه تكرار الكلمة أو ضبط طول العنوان' : 'Missing keyword in intro or description length'}
                    </p>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-rose-50/70 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-800 text-center">
                    <div className="text-2xl font-black text-rose-600 dark:text-rose-400">0 - 49</div>
                    <div className="text-xs font-bold text-rose-800 dark:text-rose-300 mt-0.5">
                      {locale === 'ar' ? 'ضعيف (فرصة ظهور منخفضة)' : 'Poor (Low ranking probability)'}
                    </div>
                    <p className="text-[10px] text-rose-700/80 dark:text-rose-400/80 mt-1">
                      {locale === 'ar' ? 'غياب الكلمة المفتاحية أو محتوى قصير جداً' : 'Missing focus keyword or content too thin'}
                    </p>
                  </div>
                </div>

                <div className="space-y-3 pt-2">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                    {locale === 'ar' ? 'الأوزان والمعايير المعتمدة في تقييم المقال' : 'Score Weighting Criteria'}
                  </h4>

                  <div className="divide-y divide-slate-100 dark:divide-slate-800 text-xs">
                    <div className="py-2.5 flex items-center justify-between gap-3">
                      <div>
                        <span className="font-bold text-slate-900 dark:text-white">
                          {locale === 'ar' ? 'الكلمة المفتاحية في العنوان الرئيسي' : 'Keyword in SEO Title'}
                        </span>
                        <p className="text-[11px] text-slate-500">
                          {locale === 'ar' ? 'العنصر الأكثر وزناً، يجب أن تبدأ الكلمة في النصف الأول من العنوان.' : 'Heaviest factor; place keyword near start of title.'}
                        </p>
                      </div>
                      <span className="font-mono font-bold text-emerald-600">+20 نقطة</span>
                    </div>

                    <div className="py-2.5 flex items-center justify-between gap-3">
                      <div>
                        <span className="font-bold text-slate-900 dark:text-white">
                          {locale === 'ar' ? 'الكلمة المفتاحية في الوصف الميتا' : 'Keyword in Meta Description'}
                        </span>
                        <p className="text-[11px] text-slate-500">
                          {locale === 'ar' ? 'يضمن ظهور النص الغليظ المميز في نتائج البحث.' : 'Ensures Google bolds your snippet in SERPs.'}
                        </p>
                      </div>
                      <span className="font-mono font-bold text-emerald-600">+15 نقطة</span>
                    </div>

                    <div className="py-2.5 flex items-center justify-between gap-3">
                      <div>
                        <span className="font-bold text-slate-900 dark:text-white">
                          {locale === 'ar' ? 'طول المحتوى وعمق الطرح الطبي (>400 كلمة)' : 'Comprehensive Content (>400 words)'}
                        </span>
                        <p className="text-[11px] text-slate-500">
                          {locale === 'ar' ? 'المقالات المفصلة تمنح إشارات ثقة وتزيد معدل البقاء.' : 'In-depth articles increase dwell time and authority.'}
                        </p>
                      </div>
                      <span className="font-mono font-bold text-emerald-600">+15 نقطة</span>
                    </div>

                    <div className="py-2.5 flex items-center justify-between gap-3">
                      <div>
                        <span className="font-bold text-slate-900 dark:text-white">
                          {locale === 'ar' ? 'الكلمة المفتاحية في الفقرة الأولى' : 'Keyword in First 10%'}
                        </span>
                        <p className="text-[11px] text-slate-500">
                          {locale === 'ar' ? 'يؤكد لروبوتات جوجل أن المقال يطابق نية بحث القارئ.' : 'Confirms search intent match to search crawlers.'}
                        </p>
                      </div>
                      <span className="font-mono font-bold text-emerald-600">+10 نقاط</span>
                    </div>

                    <div className="py-2.5 flex items-center justify-between gap-3">
                      <div>
                        <span className="font-bold text-slate-900 dark:text-white">
                          {locale === 'ar' ? 'كثافة الكلمة الطبيعية (0.8% إلى 2.5%)' : 'Healthy Keyword Density'}
                        </span>
                        <p className="text-[11px] text-slate-500">
                          {locale === 'ar' ? 'تكرار ذكي بدون حشو مفرط يقي المقال من عقوبات جوجل.' : 'Avoids over-optimization and keyword stuffing.'}
                        </p>
                      </div>
                      <span className="font-mono font-bold text-emerald-600">+10 نقاط</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Tab 3: Google Medic & E-E-A-T */}
            {activeTab === 'eeat' && (
              <div className="space-y-4 animate-in fade-in duration-150">
                <div className="p-4 rounded-2xl bg-sky-50 dark:bg-sky-950/30 border border-sky-200 dark:border-sky-800 text-xs text-sky-900 dark:text-sky-200 space-y-1">
                  <div className="font-extrabold flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-sky-600 dark:text-sky-400" />
                    <span>ما هو تحديث جوجل الطبي (Google Medic Algorithm & YMYL)؟</span>
                  </div>
                  <p className="leading-relaxed opacity-90">
                    تصنف جوجل المقالات الطبية ضمن فئة &quot;Your Money or Your Life&quot; (أموالك أو صحتك)، مما يعني أنها لا ترتب أي مقال طبي في المرتبة الأولى ما لم يتوفر فيه دليلاً قاطعاً على الخبرة والمصداقية السريرية (E-E-A-T).
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-800 space-y-1.5">
                    <div className="flex items-center gap-2 font-bold text-xs text-slate-900 dark:text-white">
                      <Award className="w-4 h-4 text-teal-600 dark:text-teal-400" />
                      <span>1. توثيق اسم الطبيب والصفة السريرية</span>
                    </div>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
                      يقوم نظام أفيسينا بربط كل مقال بملف الطبيب المختص آلياً في كود السكيما (Schema.org Person)، مما يثبت لجوجل أن المحتوى كتبه أو راجعه استشاري مرخص.
                    </p>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-800 space-y-1.5">
                    <div className="flex items-center gap-2 font-bold text-xs text-slate-900 dark:text-white">
                      <Globe className="w-4 h-4 text-sky-600 dark:text-sky-400" />
                      <span>2. نسبة المقال لمستشفى شريك معتمد</span>
                    </div>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
                      إدراج اسم المستشفى (مثل أجيبادم أو ميموريال) يعزز إشارات الهيئة المعتمدة (Medical Organization Authority) ويجعل المقال يظهر في اقتراحات المرضى الدوليين.
                    </p>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-800 space-y-1.5">
                    <div className="flex items-center gap-2 font-bold text-xs text-slate-900 dark:text-white">
                      <BookOpen className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                      <span>3. إخلاء المسؤولية الطبي الإلزامي</span>
                    </div>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
                      يتم تضمين بطاقة إخلاء المسؤولية تلقائياً في نهاية كل مقال لحماية المنصة قانونياً واستيفاء اشتراطات Google Health Search Guidelines.
                    </p>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-800 space-y-1.5">
                    <div className="flex items-center gap-2 font-bold text-xs text-slate-900 dark:text-white">
                      <TrendingUp className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                      <span>4. الروابط الداخلية الاستشارية</span>
                    </div>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
                      يربط النظام المقالات بصفحات التخصصات وحجز الاستشارة، مما ينقل قوة السيو (Link Equity) إلى صفحات التحويل الرئيسية.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Tab 4: Rich Snippets & Schema */}
            {activeTab === 'snippets' && (
              <div className="space-y-4 animate-in fade-in duration-150">
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                  تتميز منصة أفيسينا بتوليد تلقائي لكود البيانات المنظمة (JSON-LD Schema Markup) المعتمد رسمياً لدى جوجل، مما يتيح للمقال الظهور بنتائج بارزة تضم النجوم والأسئلة الشائعة:
                </p>

                <div className="space-y-3">
                  <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-800/40 space-y-1.5">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 font-bold text-xs text-slate-900 dark:text-white">
                        <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
                        <span>تقييمات النجوم المدمجة (AggregateRating Schema)</span>
                      </div>
                      <span className="text-[10px] font-mono font-bold text-emerald-600 bg-emerald-500/10 px-2 py-0.5 rounded">
                        مفعل تلقائياً
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
                      تظهر نجوم التقييم الذهبية (4.9 / 5 نجوم) بجانب رابط المقال في جوجل، مما يرفع نسبة النقر CTR بأكثر من 35% مقارنة بالمواقع التقليدية.
                    </p>
                  </div>

                  <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-800/40 space-y-1.5">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 font-bold text-xs text-slate-900 dark:text-white">
                        <HelpCircle className="w-4 h-4 text-sky-600 dark:text-sky-400" />
                        <span>الأسئلة الشائعة في جوجل (FAQPage Rich Snippets)</span>
                      </div>
                      <span className="text-[10px] font-mono font-bold text-emerald-600 bg-emerald-500/10 px-2 py-0.5 rounded">
                        مفعل تلقائياً
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
                      يتم حقن أسئلة وإجابات التكلفة والإقامة الطبية في كود المقال، لتظهر كأكورديون تفاعلي قابل للفتح مباشرة داخل نتائج بحث جوجل.
                    </p>
                  </div>

                  <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-800/40 space-y-1.5">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 font-bold text-xs text-slate-900 dark:text-white">
                        <Layers className="w-4 h-4 text-teal-600 dark:text-teal-400" />
                        <span>مسار التنقل والخبز (BreadcrumbList Schema)</span>
                      </div>
                      <span className="text-[10px] font-mono font-bold text-emerald-600 bg-emerald-500/10 px-2 py-0.5 rounded">
                        مفعل تلقائياً
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
                      يعرض جوجل المسار الاحترافي المنظم بدلاً من الروابط الطويلة المعقدة:
                      <code className="mx-1 text-[11px] font-mono text-sky-600 bg-sky-50 dark:bg-sky-950 px-1 py-0.5 rounded">avicinna.com &gt; blog &gt; cardiology</code>
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Footer Action */}
          <div className="p-4 sm:px-6 border-t border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 flex items-center justify-between shrink-0">
            <span className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>{locale === 'ar' ? 'نظام السيو يعمل بأعلى كفاءة' : 'SEO Engine Active & Synchronized'}</span>
            </span>

            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2 rounded-xl bg-gradient-to-r from-sky-600 to-teal-600 hover:from-sky-700 hover:to-teal-700 text-white text-xs font-bold shadow-sm transition-all cursor-pointer active:scale-98"
            >
              {t.closeBtn}
            </button>
          </div>
        </motion.div>
      </div>
    </ModalPortal>
  );
}
