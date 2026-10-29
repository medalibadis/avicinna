'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useData, SiteSectionsData } from '@/context/DataContext';
import { useLanguage } from '@/context/LanguageContext';
import { SmartTranslatableField, LocalizedString } from '@/components/admin/SingleInputAutoTranslator';
import { ContextualSectionTip } from '@/components/admin/AdminOnboardingGuide';
import type { Locale } from '@/components/admin/AdminShell';
import {
  Layers,
  Save,
  CheckCircle2,
  Sparkles,
  BarChart3,
  FileText,
  ShieldCheck,
  PhoneCall,
  Loader2,
  Undo2,
} from 'lucide-react';
import { toast } from 'sonner';

const SECTIONS_UI: Record<Locale, any> = {
  en: {
    badge: 'Homepage CMS Editor',
    title: 'Site Sections Editor',
    subtitle: 'Manage headlines, clinical stats, and key messaging with 1-click AI translation into AR & FR. Changes reflect immediately.',
    save: 'Save Changes',
    saving: 'Saving...',
    saveSuccess: 'Changes saved successfully and live website updated!',
    autoSyncAll: 'Auto-Sync Active Tab to AR & FR',
    syncingAll: 'Translating tab...',
    tabs: {
      hero: 'Hero Section',
      stats: 'Stats & Metrics',
      about: 'About AVICINNA',
      why: 'Why Choose Us',
      cta: 'Consultation CTA',
    },
    fields: {
      eyebrow: 'Hero Eyebrow Badge',
      headlinePart1: 'Main Headline Part 1',
      headlineHighlight: 'Headline Highlighted Segment',
      subtitle: 'Hero Subtitle / Description',
      patientsCount: 'Patients Treated Count',
      patientsLabel: 'Patients Label',
      hospitalsCount: 'Partner Hospitals Count',
      hospitalsLabel: 'Hospitals Label',
      experienceCount: 'Years of Experience',
      experienceLabel: 'Experience Label',
      satisfactionRate: 'Satisfaction Rate',
      satisfactionLabel: 'Satisfaction Label',
      aboutBadge: 'About Badge',
      aboutHeading: 'About Main Heading',
      aboutLead: 'About Lead Paragraph',
      whyBadge: 'Why Us Badge',
      whyTitle: 'Why Us Main Title',
      whySubtitle: 'Why Us Description',
      whyWhatsapp: 'Dedicated WhatsApp Contact Number',
      ctaTitle: 'Consultation Banner Title',
      ctaSubtitle: 'Consultation Banner Subtitle',
      ctaPhone: 'Hotline / WhatsApp Number',
    },
  },
  fr: {
    badge: 'Éditeur de Page d’Accueil',
    title: 'Éditeur des Sections du Site',
    subtitle: 'Modifiez les textes, statistiques et messages clés avec traduction automatique vers AR & EN. Mises à jour instantanées.',
    save: 'Enregistrer les Modifications',
    saving: 'Enregistrement...',
    saveSuccess: 'Modifications enregistrées avec succès et site en direct actualisé !',
    autoSyncAll: 'Synchroniser l’Onglet Actif vers AR & EN',
    syncingAll: 'Traduction en cours...',
    tabs: {
      hero: 'Section Hero',
      stats: 'Statistiques & Chiffres',
      about: 'À Propos d’AVICINNA',
      why: 'Pourquoi Nous Choisir',
      cta: 'Bannière de Consultation',
    },
    fields: {
      eyebrow: 'Badge d’Accroche Hero',
      headlinePart1: 'Titre Principal Partie 1',
      headlineHighlight: 'Segment Mis en Valeur',
      subtitle: 'Sous-titre / Description Hero',
      patientsCount: 'Nombre de Patients Traités',
      patientsLabel: 'Libellé des Patients',
      hospitalsCount: 'Nombre d’Hôpitaux Partenaires',
      hospitalsLabel: 'Libellé des Hôpitaux',
      experienceCount: 'Années d’Expérience',
      experienceLabel: 'Libellé d’Expérience',
      satisfactionRate: 'Taux de Satisfaction',
      satisfactionLabel: 'Libellé de Satisfaction',
      aboutBadge: 'Badge À Propos',
      aboutHeading: 'Titre Principal À Propos',
      aboutLead: 'Paragraphe d’Introduction',
      whyBadge: 'Badge Pourquoi Nous',
      whyTitle: 'Titre Principal Pourquoi Nous',
      whySubtitle: 'Description Pourquoi Nous',
      whyWhatsapp: 'Numéro WhatsApp Dédié',
      ctaTitle: 'Titre de la Bannière',
      ctaSubtitle: 'Sous-titre de la Bannière',
      ctaPhone: 'Ligne Directe / WhatsApp',
    },
  },
  ar: {
    badge: 'محرر الواجهة الرئيسية',
    title: 'تعديل أقسام الموقع',
    subtitle: 'عدل النصوص والعناوين والأرقام في الصفحة الرئيسية مع ترجمة ذكية بضغطة زر. تظهر التعديلات مباشرة للمرضى.',
    save: 'حفظ التعديلات',
    saving: 'جاري الحفظ...',
    saveSuccess: 'تم حفظ التعديلات بنجاح وتحديث محتوى الموقع المباشر!',
    autoSyncAll: 'مزامنة وتبديل الترجمة للقسم النشط',
    syncingAll: 'جاري الترجمة الآلية...',
    tabs: {
      hero: 'قسم الهيرو',
      stats: 'الإحصائيات والأرقام',
      about: 'نبذة عن أفيسينا',
      why: 'لماذا تختارنا',
      cta: 'شريط التواصل الختامي',
    },
    fields: {
      eyebrow: 'شارة الهيرو الترحيبية',
      headlinePart1: 'العنوان الرئيسي - الجزء الأول',
      headlineHighlight: 'النص المميز باللون الأزرق',
      subtitle: 'وصف وتفاصيل الهيرو',
      patientsCount: 'عدد المرضى المعالجين',
      patientsLabel: 'وصف إحصائية المرضى',
      hospitalsCount: 'عدد المستشفيات الشريكة',
      hospitalsLabel: 'وصف إحصائية المستشفيات',
      experienceCount: 'سنوات الخبرة الطبية',
      experienceLabel: 'وصف إحصائية الخبرة',
      satisfactionRate: 'نسبة رضا المرضى',
      satisfactionLabel: 'وصف إحصائية الرضا',
      aboutBadge: 'شارة قسم نبذة عنا',
      aboutHeading: 'العنوان الرئيسي لقسم نبذة عنا',
      aboutLead: 'فقرة التعريف والريادة',
      whyBadge: 'شارة قسم لماذا تختارنا',
      whyTitle: 'العنوان الرئيسي لقسم لماذا تختارنا',
      whySubtitle: 'وصف مميزات الرعاية والمرافقة',
      whyWhatsapp: 'رقم واتساب المنسقين',
      ctaTitle: 'عنوان شريط التواصل الختامي',
      ctaSubtitle: 'تفاصيل شريط الاستشارة',
      ctaPhone: 'رقم هاتف الاستشارات الفورية',
    },
  },
};

export default function AdminSectionsPage() {
  const { sections, updateSection } = useData();
  const { language } = useLanguage();
  const locale = (language || 'en') as Locale;
  const t = SECTIONS_UI[locale] || SECTIONS_UI.en;

  const [formData, setFormData] = useState<SiteSectionsData>(sections);
  const [activeTab, setActiveTab] = useState<'hero' | 'stats' | 'about' | 'why' | 'cta'>('hero');
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [isTranslatingTab, setIsTranslatingTab] = useState(false);

  React.useEffect(() => {
    if (sections) {
      setFormData(sections);
    }
  }, [sections]);

  const handleSave = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    updateSection('hero', formData.hero);
    updateSection('stats', formData.stats);
    updateSection('about', formData.about);
    updateSection('whyChoose', formData.whyChoose);
    updateSection('finalCta', formData.finalCta);

    setSavedSuccess(true);
    toast.success(t.saveSuccess);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  // 1-Click Auto-Translate all fields of the active tab into the other 2 languages
  const handleAutoSyncActiveTab = async () => {
    setIsTranslatingTab(true);
    const targetLangs = (['en', 'fr', 'ar'] as Locale[]).filter((l) => l !== locale);

    try {
      if (activeTab === 'hero') {
        const fieldsToTranslate = ['eyebrow', 'headlinePart1', 'headlineHighlight', 'subtitle'] as const;
        const updatedHero = { ...formData.hero };

        for (const field of fieldsToTranslate) {
          const sourceText = updatedHero[field][locale];
          if (!sourceText) continue;

          const res = await fetch('/api/translate', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'X-Idempotency-Key': crypto.randomUUID(),
            },
            body: JSON.stringify({
              sourceLang: locale,
              targetLangs,
              payload: { text: sourceText },
              domainContext: 'medical_cms',
            }),
          });
          const data = await res.json();
          if (data.success && data.translations) {
            updatedHero[field] = {
              en: data.translations.en?.text ?? updatedHero[field].en,
              fr: data.translations.fr?.text ?? updatedHero[field].fr,
              ar: data.translations.ar?.text ?? updatedHero[field].ar,
              [locale]: sourceText,
            };
          }
        }
        setFormData({ ...formData, hero: updatedHero });
      } else if (activeTab === 'stats') {
        const fieldsToTranslate = ['patientsLabel', 'hospitalsLabel', 'experienceLabel', 'satisfactionLabel'] as const;
        const updatedStats = { ...formData.stats };

        for (const field of fieldsToTranslate) {
          const sourceText = updatedStats[field][locale];
          if (!sourceText) continue;

          const res = await fetch('/api/translate', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'X-Idempotency-Key': crypto.randomUUID(),
            },
            body: JSON.stringify({
              sourceLang: locale,
              targetLangs,
              payload: { text: sourceText },
              domainContext: 'medical_cms',
            }),
          });
          const data = await res.json();
          if (data.success && data.translations) {
            updatedStats[field] = {
              en: data.translations.en?.text ?? updatedStats[field].en,
              fr: data.translations.fr?.text ?? updatedStats[field].fr,
              ar: data.translations.ar?.text ?? updatedStats[field].ar,
              [locale]: sourceText,
            };
          }
        }
        setFormData({ ...formData, stats: updatedStats });
      } else if (activeTab === 'about') {
        const fieldsToTranslate = ['badge', 'heading', 'lead'] as const;
        const updatedAbout = { ...formData.about };

        for (const field of fieldsToTranslate) {
          const sourceText = updatedAbout[field][locale];
          if (!sourceText) continue;

          const res = await fetch('/api/translate', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'X-Idempotency-Key': crypto.randomUUID(),
            },
            body: JSON.stringify({
              sourceLang: locale,
              targetLangs,
              payload: { text: sourceText },
              domainContext: 'medical_cms',
            }),
          });
          const data = await res.json();
          if (data.success && data.translations) {
            updatedAbout[field] = {
              en: data.translations.en?.text ?? updatedAbout[field].en,
              fr: data.translations.fr?.text ?? updatedAbout[field].fr,
              ar: data.translations.ar?.text ?? updatedAbout[field].ar,
              [locale]: sourceText,
            };
          }
        }
        setFormData({ ...formData, about: updatedAbout });
      } else if (activeTab === 'why') {
        const fieldsToTranslate = ['badge', 'title', 'subtitle'] as const;
        const updatedWhy = { ...formData.whyChoose };

        for (const field of fieldsToTranslate) {
          const sourceText = updatedWhy[field][locale];
          if (!sourceText) continue;

          const res = await fetch('/api/translate', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'X-Idempotency-Key': crypto.randomUUID(),
            },
            body: JSON.stringify({
              sourceLang: locale,
              targetLangs,
              payload: { text: sourceText },
              domainContext: 'medical_cms',
            }),
          });
          const data = await res.json();
          if (data.success && data.translations) {
            updatedWhy[field] = {
              en: data.translations.en?.text ?? updatedWhy[field].en,
              fr: data.translations.fr?.text ?? updatedWhy[field].fr,
              ar: data.translations.ar?.text ?? updatedWhy[field].ar,
              [locale]: sourceText,
            };
          }
        }
        setFormData({ ...formData, whyChoose: updatedWhy });
      } else if (activeTab === 'cta') {
        const fieldsToTranslate = ['title', 'subtitle'] as const;
        const updatedCta = { ...formData.finalCta };

        for (const field of fieldsToTranslate) {
          const sourceText = updatedCta[field][locale];
          if (!sourceText) continue;

          const res = await fetch('/api/translate', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'X-Idempotency-Key': crypto.randomUUID(),
            },
            body: JSON.stringify({
              sourceLang: locale,
              targetLangs,
              payload: { text: sourceText },
              domainContext: 'medical_cms',
            }),
          });
          const data = await res.json();
          if (data.success && data.translations) {
            updatedCta[field] = {
              en: data.translations.en?.text ?? updatedCta[field].en,
              fr: data.translations.fr?.text ?? updatedCta[field].fr,
              ar: data.translations.ar?.text ?? updatedCta[field].ar,
              [locale]: sourceText,
            };
          }
        }
        setFormData({ ...formData, finalCta: updatedCta });
      }
      toast.success('Section auto-translated to AR, FR, and EN successfully!');
    } catch (err) {
      console.error('Error auto translating section:', err);
      toast.error('Failed to auto-translate section');
    } finally {
      setIsTranslatingTab(false);
    }
  };

  const tabsConfig = [
    { id: 'hero', label: t.tabs.hero, icon: Sparkles },
    { id: 'stats', label: t.tabs.stats, icon: BarChart3 },
    { id: 'about', label: t.tabs.about, icon: FileText },
    { id: 'why', label: t.tabs.why, icon: ShieldCheck },
    { id: 'cta', label: t.tabs.cta, icon: PhoneCall },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200/80 dark:border-slate-800">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sky-500/10 dark:bg-sky-950/40 border border-sky-500/20 dark:border-sky-800/60 text-sky-700 dark:text-sky-300 text-xs font-bold mb-1">
            <Layers className="w-3.5 h-3.5 text-sky-600 dark:text-sky-400" />
            <span>{t.badge}</span>
          </div>
          <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white text-balance">
            {t.title}
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-xs mt-1 text-pretty max-w-2xl">
            {t.subtitle}
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <motion.button
            id="tour-auto-sync-btn"
            type="button"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            disabled={isTranslatingTab}
            onClick={handleAutoSyncActiveTab}
            className="inline-flex items-center gap-2 rounded-xl border border-teal-200/80 dark:border-teal-800/60 bg-teal-50/70 dark:bg-teal-950/40 px-4 py-2.5 text-xs font-semibold text-teal-800 dark:text-teal-300 transition-colors hover:bg-teal-100/80 dark:hover:bg-teal-900/60 cursor-pointer disabled:opacity-50"
          >
            {isTranslatingTab ? (
              <Loader2 className="w-4 h-4 animate-spin text-teal-600 dark:text-teal-400" />
            ) : (
              <Sparkles className="w-4 h-4 text-teal-600 dark:text-teal-400" />
            )}
            <span>{isTranslatingTab ? t.syncingAll : t.autoSyncAll}</span>
          </motion.button>

          <motion.button
            id="tour-save-changes-btn"
            type="button"
            onClick={handleSave}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="inline-flex items-center gap-2 bg-gradient-to-r from-sky-600 to-teal-600 hover:from-sky-700 hover:to-teal-700 text-white text-xs font-bold px-5 py-2.5 rounded-xl shadow-sm shadow-sky-600/20 transition-all cursor-pointer"
          >
            <Save className="w-4 h-4" />
            <span>{t.save}</span>
          </motion.button>
        </div>
      </div>

      {/* Contextual Page Interactive Guide */}
      <ContextualSectionTip
        locale={locale}
        title={
          locale === 'fr'
            ? 'Guide d’Édition : Mise à Jour et Traduction des Sections du Site'
            : locale === 'ar'
            ? 'دليل التعديل السريع: تحديث ومزامنة نصوص أقسام الموقع'
            : 'Interactive Workflow: Homepage Content & Instant Translation'
        }
        steps={
          locale === 'fr'
            ? [
                {
                  title: 'Sélection de Section',
                  desc: 'Choisissez l’onglet à modifier (Hero, Statistiques, À Propos, Pourquoi Nous, ou Bannière de Consultation).',
                  targetButtonLabel: 'Onglet Hero / Stats',
                  actionOutcome: 'Champs de section affichés',
                  targetSelector: '#tour-sections-tabs',
                },
                {
                  title: 'Rédaction en 1 Langue',
                  desc: 'Ajustez vos titres et chiffres directement dans votre langue active sans faire de triple saisie.',
                  targetButtonLabel: 'Saisie Directe',
                  actionOutcome: 'Texte actif mis à jour',
                  targetSelector: '#tour-sections-tabs',
                },
                {
                  title: 'Synchronisation IA & Publication',
                  desc: 'Cliquez sur "Synchroniser l’Onglet Actif" pour traduire vers les 2 autres langues, puis cliquez sur Enregistrer.',
                  targetButtonLabel: 'Synchroniser l’Onglet Actif',
                  actionOutcome: 'Traductions appliquées et publiées',
                  targetSelector: '#tour-auto-sync-btn',
                },
              ]
            : locale === 'ar'
            ? [
                {
                  title: 'اختيار القسم',
                  desc: 'اختر تبويب القسم المراد تعديله (الواجهة الرئيسية، الإحصائيات، نبذة عنا، لماذا نحن، شريط التواصل).',
                  targetButtonLabel: 'تبويب القسم',
                  actionOutcome: 'تم عرض حقول القسم المحدد',
                  targetSelector: '#tour-sections-tabs',
                },
                {
                  title: 'الكتابة بلغة واحدة',
                  desc: 'اكتب أو عدّل النصوص والأرقام بلغتك الحالية دون الحاجة للكتابة 3 مرات متتالية.',
                  targetButtonLabel: 'حقل المحتوى الذكي',
                  actionOutcome: 'تم تحديث النص مباشرة',
                  targetSelector: '#tour-sections-tabs',
                },
                {
                  title: 'المزامنة والنشر',
                  desc: 'اضغط على "مزامنة التبويب الحالي" لتوليد باقي اللغات تلقائياً ثم اضغط حفظ التعديلات.',
                  targetButtonLabel: 'مزامنة التبويب الحالي',
                  actionOutcome: 'تم نشر التعديلات المترجمة فوراً',
                  targetSelector: '#tour-auto-sync-btn',
                },
              ]
            : [
                {
                  title: 'Select Section Tab',
                  desc: 'Pick the section tab to configure (Hero, Stats, About Us, Why Choose Us, or Consultation Banner).',
                  targetButtonLabel: 'Hero / Stats Tab',
                  actionOutcome: 'Section form inputs loaded',
                  targetSelector: '#tour-sections-tabs',
                },
                {
                  title: 'Write Once in Active Language',
                  desc: 'Update headlines and metrics directly in your current language without duplicate manual typing.',
                  targetButtonLabel: 'Smart Content Input',
                  actionOutcome: 'Content updated in current view',
                  targetSelector: '#tour-sections-tabs',
                },
                {
                  title: 'Auto-Sync & Publish',
                  desc: 'Click "Auto-Sync Active Tab" to generate AR, FR, and EN translations, then hit Save Changes to publish.',
                  targetButtonLabel: 'Auto-Sync Active Tab',
                  actionOutcome: 'All translations live across the site',
                  targetSelector: '#tour-auto-sync-btn',
                },
              ]
        }
      />

      {/* Success banner */}
      {savedSuccess && (
        <motion.div
          initial={{ opacity: 0, y: -6 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 text-xs sm:text-sm font-bold flex items-center gap-2 shadow-xs"
        >
          <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0" />
          <span>{t.saveSuccess}</span>
        </motion.div>
      )}

      {/* Spring Liquid Tabs */}
      <div id="tour-sections-tabs" className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-slate-200/80 dark:border-slate-800 no-scrollbar">
        {tabsConfig.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id as any)}
              className={`relative flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-semibold transition-all whitespace-nowrap cursor-pointer ${
                isActive
                  ? 'text-sky-900 dark:text-sky-300 font-bold'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/60 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              {isActive && (
                <motion.div
                  layoutId="sections-tab-pill"
                  transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                  className="absolute inset-0 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm"
                />
              )}
              <span className="relative z-10 flex items-center gap-2">
                <Icon className={`w-4 h-4 ${isActive ? 'text-sky-600 dark:text-sky-400' : 'text-slate-400 dark:text-slate-500'}`} />
                <span>{tab.label}</span>
              </span>
            </button>
          );
        })}
      </div>

      {/* Form Content using Single-Input Smart Composer */}
      <form onSubmit={handleSave} className="space-y-6">
        {/* HERO SECTION TAB */}
        {activeTab === 'hero' && (
          <div className="space-y-5">
            <SmartTranslatableField
              label={t.fields.eyebrow}
              value={formData.hero.eyebrow}
              activeLocale={locale}
              onChange={(updated) =>
                setFormData({
                  ...formData,
                  hero: { ...formData.hero, eyebrow: updated },
                })
              }
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <SmartTranslatableField
                label={t.fields.headlinePart1}
                value={formData.hero.headlinePart1}
                activeLocale={locale}
                onChange={(updated) =>
                  setFormData({
                    ...formData,
                    hero: { ...formData.hero, headlinePart1: updated },
                  })
                }
              />

              <SmartTranslatableField
                label={t.fields.headlineHighlight}
                value={formData.hero.headlineHighlight}
                activeLocale={locale}
                onChange={(updated) =>
                  setFormData({
                    ...formData,
                    hero: { ...formData.hero, headlineHighlight: updated },
                  })
                }
              />
            </div>

            <SmartTranslatableField
              label={t.fields.subtitle}
              value={formData.hero.subtitle}
              activeLocale={locale}
              multiline
              onChange={(updated) =>
                setFormData({
                  ...formData,
                  hero: { ...formData.hero, subtitle: updated },
                })
              }
            />
          </div>
        )}

        {/* STATS & METRICS TAB */}
        {activeTab === 'stats' && (
          <div className="space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-white/90 dark:bg-slate-900/90 p-4 shadow-2xs space-y-3">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-200">
                  {t.fields.patientsCount}
                </label>
                <input
                  type="text"
                  value={formData.stats.patientsCount}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      stats: { ...formData.stats, patientsCount: e.target.value },
                    })
                  }
                  className="w-full rounded-xl border border-slate-200/80 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/60 px-3.5 py-2.5 text-sm font-semibold tabular-nums text-slate-800 dark:text-slate-100 focus:bg-white dark:focus:bg-slate-800 focus:outline-none"
                />
                <SmartTranslatableField
                  label={t.fields.patientsLabel}
                  value={formData.stats.patientsLabel}
                  activeLocale={locale}
                  onChange={(updated) =>
                    setFormData({
                      ...formData,
                      stats: { ...formData.stats, patientsLabel: updated },
                    })
                  }
                />
              </div>

              <div className="rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-white/90 dark:bg-slate-900/90 p-4 shadow-2xs space-y-3">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-200">
                  {t.fields.hospitalsCount}
                </label>
                <input
                  type="text"
                  value={formData.stats.hospitalsCount}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      stats: { ...formData.stats, hospitalsCount: e.target.value },
                    })
                  }
                  className="w-full rounded-xl border border-slate-200/80 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/60 px-3.5 py-2.5 text-sm font-semibold tabular-nums text-slate-800 dark:text-slate-100 focus:bg-white dark:focus:bg-slate-800 focus:outline-none"
                />
                <SmartTranslatableField
                  label={t.fields.hospitalsLabel}
                  value={formData.stats.hospitalsLabel}
                  activeLocale={locale}
                  onChange={(updated) =>
                    setFormData({
                      ...formData,
                      stats: { ...formData.stats, hospitalsLabel: updated },
                    })
                  }
                />
              </div>

              <div className="rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-white/90 dark:bg-slate-900/90 p-4 shadow-2xs space-y-3">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-200">
                  {t.fields.experienceCount}
                </label>
                <input
                  type="text"
                  value={formData.stats.experienceCount}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      stats: { ...formData.stats, experienceCount: e.target.value },
                    })
                  }
                  className="w-full rounded-xl border border-slate-200/80 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/60 px-3.5 py-2.5 text-sm font-semibold tabular-nums text-slate-800 dark:text-slate-100 focus:bg-white dark:focus:bg-slate-800 focus:outline-none"
                />
                <SmartTranslatableField
                  label={t.fields.experienceLabel}
                  value={formData.stats.experienceLabel}
                  activeLocale={locale}
                  onChange={(updated) =>
                    setFormData({
                      ...formData,
                      stats: { ...formData.stats, experienceLabel: updated },
                    })
                  }
                />
              </div>

              <div className="rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-white/90 dark:bg-slate-900/90 p-4 shadow-2xs space-y-3">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-200">
                  {t.fields.satisfactionRate}
                </label>
                <input
                  type="text"
                  value={formData.stats.satisfactionRate}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      stats: { ...formData.stats, satisfactionRate: e.target.value },
                    })
                  }
                  className="w-full rounded-xl border border-slate-200/80 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/60 px-3.5 py-2.5 text-sm font-semibold tabular-nums text-slate-800 dark:text-slate-100 focus:bg-white dark:focus:bg-slate-800 focus:outline-none"
                />
                <SmartTranslatableField
                  label={t.fields.satisfactionLabel}
                  value={formData.stats.satisfactionLabel}
                  activeLocale={locale}
                  onChange={(updated) =>
                    setFormData({
                      ...formData,
                      stats: { ...formData.stats, satisfactionLabel: updated },
                    })
                  }
                />
              </div>
            </div>
          </div>
        )}

        {/* ABOUT SECTION TAB */}
        {activeTab === 'about' && (
          <div className="space-y-5">
            <SmartTranslatableField
              label={t.fields.aboutBadge}
              value={formData.about.badge}
              activeLocale={locale}
              onChange={(updated) =>
                setFormData({
                  ...formData,
                  about: { ...formData.about, badge: updated },
                })
              }
            />

            <SmartTranslatableField
              label={t.fields.aboutHeading}
              value={formData.about.heading}
              activeLocale={locale}
              onChange={(updated) =>
                setFormData({
                  ...formData,
                  about: { ...formData.about, heading: updated },
                })
              }
            />

            <SmartTranslatableField
              label={t.fields.aboutLead}
              value={formData.about.lead}
              activeLocale={locale}
              multiline
              onChange={(updated) =>
                setFormData({
                  ...formData,
                  about: { ...formData.about, lead: updated },
                })
              }
            />
          </div>
        )}

        {/* WHY CHOOSE US TAB */}
        {activeTab === 'why' && (
          <div className="space-y-5">
            <SmartTranslatableField
              label={t.fields.whyBadge}
              value={formData.whyChoose.badge}
              activeLocale={locale}
              onChange={(updated) =>
                setFormData({
                  ...formData,
                  whyChoose: { ...formData.whyChoose, badge: updated },
                })
              }
            />

            <SmartTranslatableField
              label={t.fields.whyTitle}
              value={formData.whyChoose.title}
              activeLocale={locale}
              onChange={(updated) =>
                setFormData({
                  ...formData,
                  whyChoose: { ...formData.whyChoose, title: updated },
                })
              }
            />

            <SmartTranslatableField
              label={t.fields.whySubtitle}
              value={formData.whyChoose.subtitle}
              activeLocale={locale}
              multiline
              onChange={(updated) =>
                setFormData({
                  ...formData,
                  whyChoose: { ...formData.whyChoose, subtitle: updated },
                })
              }
            />

            <div className="rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-white/90 dark:bg-slate-900/90 p-4 shadow-2xs space-y-2">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-200">
                {t.fields.whyWhatsapp}
              </label>
              <input
                type="text"
                dir="ltr"
                value={formData.whyChoose.whatsappNumber}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    whyChoose: { ...formData.whyChoose, whatsappNumber: e.target.value },
                  })
                }
                className="w-full rounded-xl border border-slate-200/80 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/60 px-3.5 py-2.5 text-sm font-semibold tabular-nums text-slate-800 dark:text-slate-100 focus:bg-white dark:focus:bg-slate-800 focus:outline-none"
              />
            </div>
          </div>
        )}

        {/* BOTTOM CTA TAB */}
        {activeTab === 'cta' && (
          <div className="space-y-5">
            <SmartTranslatableField
              label={t.fields.ctaTitle}
              value={formData.finalCta.title}
              activeLocale={locale}
              onChange={(updated) =>
                setFormData({
                  ...formData,
                  finalCta: { ...formData.finalCta, title: updated },
                })
              }
            />

            <SmartTranslatableField
              label={t.fields.ctaSubtitle}
              value={formData.finalCta.subtitle}
              activeLocale={locale}
              multiline
              onChange={(updated) =>
                setFormData({
                  ...formData,
                  finalCta: { ...formData.finalCta, subtitle: updated },
                })
              }
            />

            <div className="rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-white/90 dark:bg-slate-900/90 p-4 shadow-2xs space-y-2">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-200">
                {t.fields.ctaPhone}
              </label>
              <input
                type="text"
                dir="ltr"
                value={formData.finalCta.phone}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    finalCta: { ...formData.finalCta, phone: e.target.value },
                  })
                }
                className="w-full rounded-xl border border-slate-200/80 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/60 px-3.5 py-2.5 text-sm font-semibold tabular-nums text-slate-800 dark:text-slate-100 focus:bg-white dark:focus:bg-slate-800 focus:outline-none"
              />
            </div>
          </div>
        )}
      </form>
    </div>
  );
}
