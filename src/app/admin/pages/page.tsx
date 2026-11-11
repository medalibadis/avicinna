'use client';

import React, { useState } from 'react';
import { useData } from '@/context/DataContext';
import { useLanguage } from '@/context/LanguageContext';
import { RichTextEditor } from '@/components/admin/RichTextEditor';
import { EntitySeoPanel } from '@/components/admin/EntitySeoPanel';
import { ModalPortal } from '@/components/admin/ModalPortal';
import { getLocalizedPath } from '@/lib/i18nRoutes';
import type { CmsPage, Locale } from '@/types/cms';
import {
  FileText,
  Plus,
  Edit3,
  Trash2,
  ExternalLink,
  X,
  Save,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';
import { toast } from 'sonner';

const emptyPageTemplate = (): CmsPage => {
  const now = new Date().toISOString();
  return {
    id: `page-${Date.now()}`,
    slug: '',
    slugs: { ar: '', fr: '', en: '' },
    title: { ar: '', fr: '', en: '' },
    subtitle: { ar: '', fr: '', en: '' },
    contentHtml: { ar: '', fr: '', en: '' },
    seo: {},
    status: 'published',
    isSystem: false,
    showInFooter: true,
    createdAt: now,
    updatedAt: now,
  };
};

export default function AdminPagesPage() {
  const { pages, addPage, updatePage, deletePage } = useData();
  const { language, direction } = useLanguage();
  const [editingPage, setEditingPage] = useState<CmsPage | null>(null);
  const [isNew, setIsNew] = useState(false);
  const [contentLang, setContentLang] = useState<Locale>('ar');

  const handleOpenCreate = () => {
    setIsNew(true);
    setContentLang('ar');
    setEditingPage(emptyPageTemplate());
  };

  const handleOpenEdit = (pg: CmsPage) => {
    setIsNew(false);
    setContentLang('ar');
    setEditingPage(JSON.parse(JSON.stringify(pg)));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingPage) return;
    const cleanSlug =
      editingPage.slug.trim() ||
      editingPage.title.en
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '') ||
      `page-${Date.now()}`;

    const toSave: CmsPage = {
      ...editingPage,
      slug: cleanSlug,
      slugs: {
        ar: editingPage.slugs?.ar?.trim() || cleanSlug,
        fr: editingPage.slugs?.fr?.trim() || cleanSlug,
        en: editingPage.slugs?.en?.trim() || cleanSlug,
      },
      updatedAt: new Date().toISOString(),
    };

    if (isNew) {
      await addPage(toSave);
      toast.success('Page created and published');
    } else {
      await updatePage(toSave);
      toast.success('Page updated');
    }
    setEditingPage(null);
  };

  const handleDelete = async (pg: CmsPage) => {
    if (pg.isSystem) {
      toast.error('System legal pages (Privacy & Terms) cannot be deleted, only edited.');
      return;
    }
    await deletePage(pg.id);
    toast.success('Page removed');
  };

  return (
    <div dir={direction} className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200/80 dark:border-slate-800 shadow-xs">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white flex items-center gap-2.5">
            <FileText className="w-6 h-6 text-[#0097FB]" />
            <span>
              {language === 'ar'
                ? 'إدارة الصفحات المستقلة والقانونية'
                : language === 'fr'
                ? 'Pages Statiques & Mentions Légales'
                : 'Standalone Pages & Legal Module'}
            </span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            {language === 'ar'
              ? 'إدارة صفحات سياسة الخصوصية والشروط والأحكام وإنشاء صفحات مستقلة جديدة باللغات الثلاث.'
              : language === 'fr'
              ? 'Gérez /privacy, /terms et créez des pages éditoriales trilingues.'
              : 'Manage Privacy Policy (/privacy), Terms of Service (/terms), and create standalone multilingual pages.'}
          </p>
        </div>

        <button
          type="button"
          onClick={handleOpenCreate}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#0097FB] hover:bg-[#0082d6] text-white font-bold text-xs sm:text-sm shadow-md cursor-pointer shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>{language === 'ar' ? 'إنشاء صفحة جديدة' : language === 'fr' ? 'Nouvelle Page' : 'Create New Page'}</span>
        </button>
      </div>

      {/* Pages Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {pages.map((pg) => (
          <div
            key={pg.id}
            className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200/80 dark:border-slate-800 shadow-xs flex flex-col justify-between space-y-4"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between gap-2">
                <span
                  className={`text-[10px] font-bold uppercase px-2.5 py-0.5 rounded-full ${
                    pg.status === 'published'
                      ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200'
                      : 'bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border border-amber-200'
                  }`}
                >
                  {pg.status}
                </span>
                {pg.isSystem && (
                  <span className="inline-flex items-center gap-1 text-[10px] font-bold text-sky-600 bg-sky-50 dark:bg-sky-950/50 px-2 py-0.5 rounded-full">
                    <ShieldCheck className="w-3 h-3" />
                    Legal / Core
                  </span>
                )}
              </div>

              <div>
                <h2 className="text-base font-extrabold text-slate-900 dark:text-white">
                  {pg.title[language] || pg.title.ar || pg.title.en}
                </h2>
                <div className="text-xs font-mono text-slate-400 mt-0.5" dir="ltr">
                  /{pg.slug}
                </div>
              </div>

              <div className="flex flex-wrap gap-1.5 text-[10px]" dir="ltr">
                {(['ar', 'fr', 'en'] as Locale[]).map((l) => (
                  <a
                    key={l}
                    href={getLocalizedPath(`/${pg.slugs?.[l] || pg.slug}`, l)}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 px-2 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-sky-50 text-slate-700 dark:text-slate-300 font-mono"
                  >
                    <span className="uppercase font-bold">{l}:</span>
                    <span>{getLocalizedPath(`/${pg.slugs?.[l] || pg.slug}`, l)}</span>
                    <ExternalLink className="w-2.5 h-2.5" />
                  </a>
                ))}
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2">
              <button
                type="button"
                onClick={() => handleOpenEdit(pg)}
                className="flex-1 inline-flex items-center justify-center gap-1.5 py-2 rounded-xl bg-sky-50 dark:bg-sky-950/40 hover:bg-sky-600 text-sky-700 dark:text-sky-300 hover:text-white font-bold text-xs transition-colors cursor-pointer"
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>{language === 'ar' ? 'تعديل' : language === 'fr' ? 'Modifier' : 'Edit Page'}</span>
              </button>
              {!pg.isSystem && (
                <button
                  type="button"
                  onClick={() => handleDelete(pg)}
                  className="p-2 rounded-xl bg-rose-50 dark:bg-rose-950/30 text-rose-600 hover:bg-rose-600 hover:text-white transition-colors cursor-pointer"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Edit / Create Page Modal */}
      {editingPage && (
        <ModalPortal isOpen={Boolean(editingPage)}>
          <div className="fixed inset-0 z-[100] bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
            <form
              onSubmit={handleSave}
              className="w-full max-w-4xl bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden my-8"
            >
              <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-800/60">
                <h3 className="font-black text-base text-slate-900 dark:text-white flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-[#0097FB]" />
                  <span>
                    {isNew
                      ? language === 'ar'
                        ? 'إنشاء صفحة مستقلة جديدة'
                        : language === 'fr'
                        ? 'Créer une page statique'
                        : 'Create Standalone Page'
                      : `${language === 'ar' ? 'تعديل الصفحة:' : language === 'fr' ? 'Modifier la page :' : 'Edit Page:'} ${editingPage.slug}`}
                  </span>
                </h3>
                <button type="button" onClick={() => setEditingPage(null)} className="text-slate-400 hover:text-slate-700">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-6 space-y-5 max-h-[75vh] overflow-y-auto">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                  <div>
                    <label className="block font-bold mb-1">
                      {language === 'ar' ? 'الرابط الأساسي (Slug) *' : language === 'fr' ? 'Slug de base *' : 'Base Slug *'}
                    </label>
                    <input
                      type="text"
                      required
                      dir="ltr"
                      disabled={Boolean(editingPage.isSystem)}
                      value={editingPage.slug}
                      onChange={(e) =>
                        setEditingPage({
                          ...editingPage,
                          slug: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '-'),
                        })
                      }
                      placeholder="privacy"
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-mono disabled:opacity-60"
                    />
                  </div>
                  <div>
                    <label className="block font-bold mb-1">
                      {language === 'ar' ? 'حالة النشر' : language === 'fr' ? 'Statut' : 'Status'}
                    </label>
                    <select
                      value={editingPage.status}
                      onChange={(e) =>
                        setEditingPage({ ...editingPage, status: e.target.value as 'published' | 'draft' })
                      }
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
                    >
                      <option value="published">{language === 'ar' ? 'منشور (مباشر)' : language === 'fr' ? 'Publié (En ligne)' : 'Published (Live)'}</option>
                      <option value="draft">{language === 'ar' ? 'مسودة (مخفي)' : language === 'fr' ? 'Brouillon (Masqué)' : 'Draft (Hidden)'}</option>
                    </select>
                  </div>
                  <div className="flex items-end pb-2">
                    <label className="inline-flex items-center gap-2 cursor-pointer font-bold">
                      <input
                        type="checkbox"
                        checked={Boolean(editingPage.showInFooter)}
                        onChange={(e) => setEditingPage({ ...editingPage, showInFooter: e.target.checked })}
                        className="rounded border-slate-300"
                      />
                      <span>
                        {language === 'ar' ? 'عرض الرابط في التذييل' : language === 'fr' ? 'Afficher dans le pied de page' : 'Show Link in Footer'}
                      </span>
                    </label>
                  </div>
                </div>

                {/* Language Editor Switcher */}
                <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-2">
                  {(['ar', 'fr', 'en'] as Locale[]).map((l) => (
                    <button
                      key={l}
                      type="button"
                      onClick={() => setContentLang(l)}
                      className={`px-4 py-1.5 rounded-xl text-xs font-bold uppercase cursor-pointer ${
                        contentLang === l
                          ? 'bg-[#0097FB] text-white'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
                      }`}
                    >
                      {l === 'ar' ? 'العربية (AR)' : l === 'fr' ? 'Français (FR)' : 'English (EN)'}
                    </button>
                  ))}
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold mb-1">
                      {language === 'ar' ? 'عنوان الصفحة' : language === 'fr' ? 'Titre de la page' : 'Page Title'} ({contentLang.toUpperCase()})
                    </label>
                    <input
                      type="text"
                      required={contentLang === 'ar'}
                      dir={contentLang === 'ar' ? 'rtl' : 'ltr'}
                      value={editingPage.title[contentLang] || ''}
                      onChange={(e) =>
                        setEditingPage({
                          ...editingPage,
                          title: { ...editingPage.title, [contentLang]: e.target.value },
                        })
                      }
                      className="w-full px-3 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold mb-1">
                      {language === 'ar' ? 'العنوان الفرعي' : language === 'fr' ? 'Sous-titre' : 'Subtitle'} ({contentLang.toUpperCase()})
                    </label>
                    <input
                      type="text"
                      dir={contentLang === 'ar' ? 'rtl' : 'ltr'}
                      value={editingPage.subtitle?.[contentLang] || ''}
                      onChange={(e) =>
                        setEditingPage({
                          ...editingPage,
                          subtitle: {
                            ar: editingPage.subtitle?.ar || '',
                            fr: editingPage.subtitle?.fr || '',
                            en: editingPage.subtitle?.en || '',
                            [contentLang]: e.target.value,
                          },
                        })
                      }
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs"
                    />
                  </div>

                  <RichTextEditor
                    label={`${language === 'ar' ? 'محتوى الصفحة' : language === 'fr' ? 'Contenu de la page' : 'Page Content'} (${contentLang.toUpperCase()})`}
                    lang={contentLang}
                    dir={contentLang === 'ar' ? 'rtl' : 'ltr'}
                    value={editingPage.contentHtml[contentLang] || ''}
                    onChange={(html) =>
                      setEditingPage({
                        ...editingPage,
                        contentHtml: { ...editingPage.contentHtml, [contentLang]: html },
                      })
                    }
                    minHeight={240}
                  />
                </div>

                <EntitySeoPanel
                  sectionPrefix=""
                  baseSlug={editingPage.slug}
                  slugs={editingPage.slugs}
                  seo={editingPage.seo}
                  fallbackTitle={editingPage.title}
                  fallbackDesc={editingPage.subtitle}
                  onChangeSlugs={(nextSlugs) => setEditingPage({ ...editingPage, slugs: nextSlugs })}
                  onChangeSeo={(nextSeo) => setEditingPage({ ...editingPage, seo: nextSeo })}
                />
              </div>

              <div className="px-6 py-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-800/60 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setEditingPage(null)}
                  className="px-5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 text-xs font-bold cursor-pointer"
                >
                  {language === 'ar' ? 'إلغاء' : language === 'fr' ? 'Annuler' : 'Cancel'}
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-[#0097FB] hover:bg-[#0082d6] text-white text-xs font-bold flex items-center gap-2 cursor-pointer"
                >
                  <Save className="w-4 h-4" />
                  <span>{language === 'ar' ? 'حفظ الصفحة' : language === 'fr' ? 'Enregistrer' : 'Save Page'}</span>
                </button>
              </div>
            </form>
          </div>
        </ModalPortal>
      )}
    </div>
  );
}

