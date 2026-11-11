'use client';

import React, { useState, useEffect } from 'react';
import { useData } from '@/context/DataContext';
import { useLanguage } from '@/context/LanguageContext';
import type { MediaItem } from '@/types/cms';
import {
  Image as ImageIcon,
  Upload,
  Copy,
  Trash2,
  Save,
  Search,
  Loader2,
  Plus,
} from 'lucide-react';
import { toast } from 'sonner';

const mediaDict = {
  ar: {
    title: 'مكتبة الوسائط والنص البديل متعدد اللغات (Alt Text)',
    sub: 'ارفع الصور، أضف وصف SEO (Alt Text) بالعربية والفرنسية والإنجليزية، وأعد استخدامها في المقالات والصفحات.',
    uploadBtn: 'رفع صورة من الجهاز',
    urlPlaceholder: 'أو الصق رابط صورة مباشر...',
    altArPh: 'النص البديل (عربي)',
    altFrPh: 'النص البديل (فرنسي)',
    altEnPh: 'النص البديل (إنجليزي)',
    addUrlBtn: 'إضافة رابط',
    searchPh: 'ابحث باسم الملف أو النص البديل...',
    empty: 'لا توجد ملفات وسائط بعد. ارفع صورة أعلاه لبناء المكتبة.',
    copyUrl: 'نسخ الرابط',
    copied: 'تم نسخ رابط الصورة',
    uploadedToast: 'تم رفع الصورة مع النص البديل بنجاح',
    uploadFail: 'فشل رفع الصورة',
    extAdded: 'تمت إضافة الصورة الخارجية',
    extFail: 'فشل إضافة الصورة',
    altSaved: 'تم حفظ بيانات النص البديل',
    deletedToast: 'تم حذف الصورة من المكتبة',
    altMissing: 'غير محدد',
    altLabelAr: 'النص البديل (عربي)',
    altLabelFr: 'النص البديل (فرنسي)',
    altLabelEn: 'النص البديل (إنجليزي)',
    saveAltBtn: 'حفظ بيانات النص البديل (SEO Alt)',
    folders: {
      all: 'الكل',
      articles: 'المقالات',
      hospitals: 'المستشفيات',
      doctors: 'الأطباء',
      treatments: 'العلاجات',
      general: 'عام',
    } as Record<string, string>,
  },
  fr: {
    title: 'Médiathèque & Textes Alternatifs (Alt Text)',
    sub: 'Téléversez des images, définissez les balises Alt SEO en AR/FR/EN et réutilisez-les dans vos articles et pages.',
    uploadBtn: 'Importer une image',
    urlPlaceholder: 'Ou coller une URL d’image directe...',
    altArPh: 'Alt AR',
    altFrPh: 'Alt FR',
    altEnPh: 'Alt EN',
    addUrlBtn: 'Ajouter URL',
    searchPh: 'Rechercher par nom ou texte alt...',
    empty: 'Aucun média enregistré pour le moment. Importez une image ci-dessus.',
    copyUrl: 'Copier URL',
    copied: 'URL de l’image copiée',
    uploadedToast: 'Image importée avec texte alternatif',
    uploadFail: 'Échec de l’importation',
    extAdded: 'Média externe ajouté',
    extFail: 'Échec d’ajout du média',
    altSaved: 'Texte alternatif enregistré',
    deletedToast: 'Média supprimé',
    altMissing: 'Manquant',
    altLabelAr: 'Texte Alt (AR)',
    altLabelFr: 'Texte Alt (FR)',
    altLabelEn: 'Texte Alt (EN)',
    saveAltBtn: 'Enregistrer les métadonnées Alt',
    folders: {
      all: 'Tout',
      articles: 'Articles',
      hospitals: 'Hôpitaux',
      doctors: 'Médecins',
      treatments: 'Soins',
      general: 'Général',
    } as Record<string, string>,
  },
  en: {
    title: 'Media Library & Multilingual Alt Text',
    sub: 'Upload images, assign SEO Alt Text in AR/FR/EN, and reuse assets across articles and pages.',
    uploadBtn: 'Upload Image File',
    urlPlaceholder: 'Or paste Image URL...',
    altArPh: 'Alt AR',
    altFrPh: 'Alt FR',
    altEnPh: 'Alt EN',
    addUrlBtn: 'Add URL',
    searchPh: 'Search filename or alt text...',
    empty: 'No media items yet. Upload an image above to build your library.',
    copyUrl: 'Copy URL',
    copied: 'Image URL copied',
    uploadedToast: 'Image uploaded with alt text',
    uploadFail: 'Upload failed',
    extAdded: 'External media added',
    extFail: 'Failed to add media',
    altSaved: 'Alt text saved',
    deletedToast: 'Media deleted',
    altMissing: 'Missing',
    altLabelAr: 'Alt Text (AR)',
    altLabelFr: 'Alt Text (FR)',
    altLabelEn: 'Alt Text (EN)',
    saveAltBtn: 'Save Alt Text Metadata',
    folders: {
      all: 'All',
      articles: 'Articles',
      hospitals: 'Hospitals',
      doctors: 'Doctors',
      treatments: 'Treatments',
      general: 'General',
    } as Record<string, string>,
  },
};

export default function AdminMediaLibraryPage() {
  const { media, setMedia } = useData();
  const { language, direction } = useLanguage();
  const langKey = language === 'fr' || language === 'en' ? language : 'ar';
  const t = mediaDict[langKey];

  const [search, setSearch] = useState('');
  const [folder, setFolder] = useState('all');
  const [uploading, setUploading] = useState(false);
  const [selectedItem, setSelectedItem] = useState<MediaItem | null>(null);
  const [newUrlInput, setNewUrlInput] = useState('');
  const [newAltAr, setNewAltAr] = useState('');
  const [newAltFr, setNewAltFr] = useState('');
  const [newAltEn, setNewAltEn] = useState('');
  const [newFolder] = useState('articles');

  useEffect(() => {
    fetch('/api/media', { cache: 'no-store' })
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => {
        if (d?.media) setMedia(d.media);
      })
      .catch(() => {});
  }, [setMedia]);

  const handleUploadFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append('file', file);
      fd.append('altAr', newAltAr || file.name);
      fd.append('altFr', newAltFr || file.name);
      fd.append('altEn', newAltEn || file.name);
      fd.append('folder', newFolder);
      const res = await fetch('/api/media', { method: 'POST', body: fd });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || t.uploadFail);
      setMedia((prev) => [data.item, ...prev]);
      toast.success(t.uploadedToast);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : t.uploadFail);
    } finally {
      setUploading(false);
      e.target.value = '';
    }
  };

  const handleRegisterUrl = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUrlInput.trim()) return;
    const res = await fetch('/api/media', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        url: newUrlInput.trim(),
        folder: newFolder,
        alt: { ar: newAltAr, fr: newAltFr, en: newAltEn },
      }),
    });
    const data = await res.json();
    if (res.ok && data.item) {
      setMedia((prev) => [data.item, ...prev]);
      setNewUrlInput('');
      setNewAltAr('');
      setNewAltFr('');
      setNewAltEn('');
      toast.success(t.extAdded);
    } else {
      toast.error(data.error || t.extFail);
    }
  };

  const handleUpdateAlt = async () => {
    if (!selectedItem) return;
    const res = await fetch('/api/media', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        id: selectedItem.id,
        alt: selectedItem.alt,
        caption: selectedItem.caption,
        folder: selectedItem.folder,
      }),
    });
    const data = await res.json();
    if (res.ok && data.item) {
      setMedia((prev) => prev.map((m) => (m.id === data.item.id ? data.item : m)));
      toast.success(t.altSaved);
    }
  };

  const handleDelete = async (id: string) => {
    const res = await fetch(`/api/media?id=${encodeURIComponent(id)}`, { method: 'DELETE' });
    if (res.ok) {
      setMedia((prev) => prev.filter((m) => m.id !== id));
      if (selectedItem?.id === id) setSelectedItem(null);
      toast.success(t.deletedToast);
    }
  };

  const filtered = media.filter((m) => {
    if (folder !== 'all' && m.folder !== folder) return false;
    const q = search.toLowerCase().trim();
    if (!q) return true;
    return (
      m.filename.toLowerCase().includes(q) ||
      m.alt.ar.toLowerCase().includes(q) ||
      m.alt.fr.toLowerCase().includes(q) ||
      m.alt.en.toLowerCase().includes(q)
    );
  });

  return (
    <div dir={direction} className="space-y-6">
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200/90 dark:border-slate-800 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white flex items-center gap-2.5">
              <ImageIcon className="w-6 h-6 text-[#0097FB] shrink-0" />
              <span>{t.title}</span>
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">{t.sub}</p>
          </div>
          <label className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#0097FB] hover:bg-[#0082d6] text-white font-bold text-xs shadow-md cursor-pointer shrink-0">
            {uploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
            <span>{t.uploadBtn}</span>
            <input type="file" accept="image/*" onChange={handleUploadFile} className="hidden" />
          </label>
        </div>

        {/* Register External URL + Alt Text */}
        <form onSubmit={handleRegisterUrl} className="grid grid-cols-1 sm:grid-cols-6 gap-2.5 pt-2 border-t border-slate-100 dark:border-slate-800 text-xs">
          <input
            type="text"
            dir="ltr"
            placeholder={t.urlPlaceholder}
            value={newUrlInput}
            onChange={(e) => setNewUrlInput(e.target.value)}
            className="sm:col-span-2 px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-mono text-slate-900 dark:text-white outline-none"
          />
          <input
            type="text"
            dir="rtl"
            placeholder={t.altArPh}
            value={newAltAr}
            onChange={(e) => setNewAltAr(e.target.value)}
            className="px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white outline-none"
          />
          <input
            type="text"
            dir="ltr"
            placeholder={t.altFrPh}
            value={newAltFr}
            onChange={(e) => setNewAltFr(e.target.value)}
            className="px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white outline-none"
          />
          <input
            type="text"
            dir="ltr"
            placeholder={t.altEnPh}
            value={newAltEn}
            onChange={(e) => setNewAltEn(e.target.value)}
            className="px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white outline-none"
          />
          <button
            type="submit"
            className="px-3 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold flex items-center justify-center gap-1 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>{t.addUrlBtn}</span>
          </button>
        </form>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[220px]">
          <Search className="w-4 h-4 text-slate-400 absolute top-3 start-3.5" />
          <input
            type="text"
            placeholder={t.searchPh}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full ps-10 pe-4 py-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-800 text-xs text-slate-900 dark:text-white outline-none"
          />
        </div>
        {['all', 'articles', 'hospitals', 'doctors', 'treatments', 'general'].map((f) => (
          <button
            key={f}
            type="button"
            onClick={() => setFolder(f)}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold cursor-pointer ${
              folder === f ? 'bg-[#0097FB] text-white' : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-800'
            }`}
          >
            {t.folders[f] || f}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className={selectedItem ? 'lg:col-span-8' : 'lg:col-span-12'}>
          {filtered.length === 0 ? (
            <div className="bg-white dark:bg-slate-900 rounded-3xl p-12 text-center border border-slate-200 dark:border-slate-800 text-slate-500 text-sm">
              {t.empty}
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {filtered.map((item) => (
                <div
                  key={item.id}
                  onClick={() => setSelectedItem(item)}
                  className={`bg-white dark:bg-slate-900 rounded-2xl overflow-hidden border-2 transition-all cursor-pointer group ${
                    selectedItem?.id === item.id ? 'border-[#0097FB] shadow-md' : 'border-slate-200/80 dark:border-slate-800'
                  }`}
                >
                  <div className="aspect-video bg-slate-100 dark:bg-slate-800 overflow-hidden relative">
                    <img src={item.url} alt={item.alt[langKey] || item.alt.en || item.filename} className="w-full h-full object-cover" />
                    <span className="absolute top-2 end-2 text-[9px] font-bold px-2 py-0.5 rounded bg-black/60 text-white uppercase">
                      {t.folders[item.folder] || item.folder}
                    </span>
                  </div>
                  <div className="p-3 space-y-1.5">
                    <div className="text-xs font-bold text-slate-800 dark:text-white truncate">{item.filename}</div>
                    <div className="text-[10px] text-slate-500 truncate">
                      Alt: {item.alt[langKey] || item.alt.en || item.alt.ar || t.altMissing}
                    </div>
                    <div className="flex items-center justify-between pt-1">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          navigator.clipboard.writeText(item.url);
                          toast.success(t.copied);
                        }}
                        className="text-[11px] font-bold text-sky-600 hover:underline flex items-center gap-1"
                      >
                        <Copy className="w-3 h-3" />
                        <span>{t.copyUrl}</span>
                      </button>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDelete(item.id);
                        }}
                        className="text-rose-500 hover:text-rose-700"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {selectedItem && (
          <div className="lg:col-span-4 bg-white dark:bg-slate-900 rounded-3xl p-5 border border-slate-200 dark:border-slate-800 space-y-4 h-fit sticky top-24">
            <img src={selectedItem.url} alt={selectedItem.alt[langKey] || selectedItem.alt.en} className="w-full aspect-video object-cover rounded-2xl" />
            <div className="text-xs font-mono bg-slate-100 dark:bg-slate-800 p-2 rounded-xl truncate" dir="ltr">
              {selectedItem.url}
            </div>
            <div className="space-y-2.5 text-xs">
              <div>
                <label className="font-bold block mb-1">{t.altLabelAr}</label>
                <input
                  type="text"
                  dir="rtl"
                  value={selectedItem.alt.ar}
                  onChange={(e) =>
                    setSelectedItem({ ...selectedItem, alt: { ...selectedItem.alt, ar: e.target.value } })
                  }
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
                />
              </div>
              <div>
                <label className="font-bold block mb-1">{t.altLabelFr}</label>
                <input
                  type="text"
                  dir="ltr"
                  value={selectedItem.alt.fr}
                  onChange={(e) =>
                    setSelectedItem({ ...selectedItem, alt: { ...selectedItem.alt, fr: e.target.value } })
                  }
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
                />
              </div>
              <div>
                <label className="font-bold block mb-1">{t.altLabelEn}</label>
                <input
                  type="text"
                  dir="ltr"
                  value={selectedItem.alt.en}
                  onChange={(e) =>
                    setSelectedItem({ ...selectedItem, alt: { ...selectedItem.alt, en: e.target.value } })
                  }
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
                />
              </div>
              <button
                type="button"
                onClick={handleUpdateAlt}
                className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Save className="w-4 h-4" />
                <span>{t.saveAltBtn}</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
