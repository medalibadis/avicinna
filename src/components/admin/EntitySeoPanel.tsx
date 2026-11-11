'use client';

import React, { useState, useRef } from 'react';
import { Globe, Search, ArrowRightLeft } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import type { Locale, LocalizedSeo, LocalizedSlugs, LocalizedString } from '@/types/cms';
import { getLocalizedPath } from '@/lib/i18nRoutes';

interface EntitySeoPanelProps {
  sectionPrefix?: 'treatments' | 'doctors' | 'hospitals' | 'patient-stories' | 'blog' | '';
  baseSlug: string;
  slugs?: LocalizedSlugs;
  seo?: LocalizedSeo;
  fallbackTitle?: Partial<LocalizedString>;
  fallbackDesc?: Partial<LocalizedString>;
  onChangeSlugs: (next: LocalizedSlugs) => void;
  onChangeSeo: (next: LocalizedSeo) => void;
  showRedirectSuggestion?: boolean;
}

const seoPanelDict = {
  ar: {
    heading: 'عنوان السيو، الوصف، الكلمة المفتاحية، وروابط URL لكل لغة',
    emptySnippet: 'أضف وصف ميتا مخصصاً لتحسين ظهور الصفحة في نتائج بحث جوجل...',
    urlSlug: 'رابط الصفحة (URL Slug)',
    slugChanged: (old: string) => `تغيّر الرابط من "${old}". هل تريد إنشاء تحويل 301 للحفاظ على الترتيب؟`,
    create301: 'إنشاء تحويل 301',
    redirectCreated: (from: string, to: string) => `تم إنشاء التحويل 301: ${from} -> ${to}`,
    focusKw: 'الكلمة المفتاحية المستهدفة',
    focusKwPh: 'مثال: علاج القلب في تركيا',
    seoTitle: 'عنوان السيو في جوجل (SEO Title)',
    seoTitlePh: 'عنوان مخصص لنتائج جوجل',
    metaDesc: 'وصف الميتا (Meta Description)',
    metaDescPh: 'وصف طبي موجز وجذاب لنتائج البحث...',
  },
  fr: {
    heading: 'Titre SEO, Meta Description, Mot-clé & URLs par Langue',
    emptySnippet: 'Renseignez une meta description personnalisée pour les résultats Google...',
    urlSlug: 'Slug URL',
    slugChanged: (old: string) => `Slug modifié depuis « ${old} ». Conserver votre SEO avec une redirection 301 ?`,
    create301: 'Créer 301',
    redirectCreated: (from: string, to: string) => `Redirection 301 créée : ${from} -> ${to}`,
    focusKw: 'Mot-clé cible (Focus Keyword)',
    focusKwPh: 'Ex: Chirurgie cardiaque en Turquie',
    seoTitle: 'Titre SEO Google',
    seoTitlePh: 'Titre Google personnalisé',
    metaDesc: 'Meta Description',
    metaDescPh: 'Résumé médical convaincant pour Google...',
  },
  en: {
    heading: 'SEO Meta Title, Description, Focus Keyword & Per-Language URL Slugs',
    emptySnippet: 'Configure a custom meta description for Google search snippets...',
    urlSlug: 'URL Slug',
    slugChanged: (old: string) => `Slug changed from "${old}". Keep old rankings with a 301 redirect?`,
    create301: 'Create 301',
    redirectCreated: (from: string, to: string) => `301 Redirect created: ${from} -> ${to}`,
    focusKw: 'Focus Keyword',
    focusKwPh: 'e.g., Cardiac Surgery in Turkey',
    seoTitle: 'SEO Title',
    seoTitlePh: 'Custom Google SERP Title',
    metaDesc: 'Meta Description',
    metaDescPh: 'Compelling medical summary for search results...',
  },
};

export function EntitySeoPanel({
  sectionPrefix = '',
  baseSlug,
  slugs = {},
  seo = {},
  fallbackTitle = {},
  fallbackDesc = {},
  onChangeSlugs,
  onChangeSeo,
  showRedirectSuggestion = true,
}: EntitySeoPanelProps) {
  const { language, direction } = useLanguage();
  const uiLang = language === 'fr' || language === 'en' ? language : 'ar';
  const t = seoPanelDict[uiLang];

  const [activeLang, setActiveLang] = useState<Locale>('ar');
  const initialSlugsRef = useRef<LocalizedSlugs>({
    ar: slugs.ar || baseSlug,
    fr: slugs.fr || baseSlug,
    en: slugs.en || baseSlug,
  });
  const [redirectSavedMsg, setRedirectSavedMsg] = useState('');

  const currentSlug = slugs[activeLang] || baseSlug;
  const currentMeta = seo[activeLang] || {};
  const previewTitle = currentMeta.title?.trim() || fallbackTitle[activeLang] || 'AVICINNA Medical Care';
  const previewDesc = currentMeta.description?.trim() || fallbackDesc[activeLang] || '';
  const previewUrl = `avicinna.com${getLocalizedPath(
    sectionPrefix ? `/${sectionPrefix}/${currentSlug}` : `/${currentSlug}`,
    activeLang
  )}`;

  const oldSlug = initialSlugsRef.current[activeLang] || baseSlug;
  const slugChanged = Boolean(showRedirectSuggestion && oldSlug && currentSlug && oldSlug !== currentSlug);

  const handleQuickRedirect = async () => {
    const fromPath = getLocalizedPath(
      sectionPrefix ? `/${sectionPrefix}/${oldSlug}` : `/${oldSlug}`,
      activeLang
    );
    const toPath = getLocalizedPath(
      sectionPrefix ? `/${sectionPrefix}/${currentSlug}` : `/${currentSlug}`,
      activeLang
    );
    const res = await fetch('/api/redirects', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        fromPath,
        toPath,
        statusCode: 301,
        note: `Auto-created on ${activeLang.toUpperCase()} slug change`,
      }),
    });
    if (res.ok) {
      setRedirectSavedMsg(t.redirectCreated(fromPath, toPath));
      initialSlugsRef.current[activeLang] = currentSlug;
    }
  };

  return (
    <div dir={direction} className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50/70 dark:bg-slate-800/40 p-4 space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200 dark:border-slate-700 pb-3">
        <div className="flex items-center gap-2 text-xs font-extrabold text-slate-800 dark:text-white">
          <Search className="w-4 h-4 text-sky-500 shrink-0" />
          <span>{t.heading}</span>
        </div>

        <div className="flex items-center gap-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl p-1">
          {(['ar', 'fr', 'en'] as Locale[]).map((l) => (
            <button
              key={l}
              type="button"
              onClick={() => {
                setActiveLang(l);
                setRedirectSavedMsg('');
              }}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-bold uppercase cursor-pointer ${
                activeLang === l
                  ? 'bg-sky-600 text-white'
                  : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              {l}
            </button>
          ))}
        </div>
      </div>

      {/* Clean Google SERP Preview */}
      <div
        dir={activeLang === 'ar' ? 'rtl' : 'ltr'}
        className="rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 p-4 space-y-1"
      >
        <div className="flex items-center gap-1.5 text-[11px] text-slate-500 font-mono truncate" dir="ltr">
          <Globe className="w-3 h-3 text-sky-500 shrink-0" />
          <span>{previewUrl}</span>
        </div>
        <div className="text-base font-medium text-[#1a0dab] dark:text-[#8ab4f8] line-clamp-1">
          {previewTitle}
        </div>
        <p className="text-xs text-[#4d5156] dark:text-slate-300 line-clamp-2 leading-relaxed">
          {previewDesc || t.emptySnippet}
        </p>
      </div>

      {/* Slug Input */}
      <div className="space-y-1.5">
        <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-300">
          {t.urlSlug} ({activeLang.toUpperCase()})
        </label>
        <input
          type="text"
          dir="ltr"
          value={slugs[activeLang] || ''}
          onChange={(e) =>
            onChangeSlugs({
              ...slugs,
              [activeLang]: e.target.value
                .toLowerCase()
                .replace(/\s+/g, '-')
                .replace(/[^a-z0-9-\u0600-\u06FF]/g, ''),
            })
          }
          placeholder={baseSlug || 'custom-url-slug'}
          className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs font-mono"
        />
        {slugChanged && (
          <div className="flex items-center justify-between gap-2 p-2 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 text-[11px] text-amber-800 dark:text-amber-300">
            <span>{t.slugChanged(oldSlug)}</span>
            <button
              type="button"
              onClick={handleQuickRedirect}
              className="px-2.5 py-1 rounded-lg bg-amber-600 text-white font-bold flex items-center gap-1 shrink-0 cursor-pointer"
            >
              <ArrowRightLeft className="w-3 h-3" />
              <span>{t.create301}</span>
            </button>
          </div>
        )}
        {redirectSavedMsg && (
          <div dir="ltr" className="text-[11px] text-emerald-600 font-semibold">
            {redirectSavedMsg}
          </div>
        )}
      </div>

      {/* Focus Keyword + SEO Title + Meta Description */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-300 mb-1">
            {t.focusKw} ({activeLang.toUpperCase()})
          </label>
          <input
            type="text"
            dir={activeLang === 'ar' ? 'rtl' : 'ltr'}
            value={currentMeta.focusKeyword || ''}
            onChange={(e) =>
              onChangeSeo({
                ...seo,
                [activeLang]: { ...currentMeta, focusKeyword: e.target.value },
              })
            }
            placeholder={t.focusKwPh}
            className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs"
          />
        </div>

        <div>
          <div className="flex justify-between text-[11px] font-bold text-slate-600 dark:text-slate-300 mb-1">
            <span>
              {t.seoTitle} ({activeLang.toUpperCase()})
            </span>
            <span dir="ltr" className="font-mono text-slate-400">
              {(currentMeta.title || '').length}/60
            </span>
          </div>
          <input
            type="text"
            dir={activeLang === 'ar' ? 'rtl' : 'ltr'}
            value={currentMeta.title || ''}
            onChange={(e) =>
              onChangeSeo({
                ...seo,
                [activeLang]: { ...currentMeta, title: e.target.value },
              })
            }
            placeholder={fallbackTitle[activeLang] || t.seoTitlePh}
            className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs"
          />
        </div>
      </div>

      <div>
        <div className="flex justify-between text-[11px] font-bold text-slate-600 dark:text-slate-300 mb-1">
          <span>
            {t.metaDesc} ({activeLang.toUpperCase()})
          </span>
          <span dir="ltr" className="font-mono text-slate-400">
            {(currentMeta.description || '').length}/160
          </span>
        </div>
        <textarea
          rows={2}
          dir={activeLang === 'ar' ? 'rtl' : 'ltr'}
          value={currentMeta.description || ''}
          onChange={(e) =>
            onChangeSeo({
              ...seo,
              [activeLang]: { ...currentMeta, description: e.target.value },
            })
          }
          placeholder={fallbackDesc[activeLang] || t.metaDescPh}
          className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs"
        />
      </div>
    </div>
  );
}
