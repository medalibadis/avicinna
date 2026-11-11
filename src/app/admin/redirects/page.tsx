'use client';

import React, { useState, useEffect } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import type { RedirectRule } from '@/types/cms';
import { ArrowRightLeft, Plus, Trash2, CheckCircle2, PauseCircle } from 'lucide-react';
import { toast } from 'sonner';

const redirDict = {
  ar: {
    title: 'إدارة التحويلات الدائمة (301 / 302 Redirects)',
    sub: 'حافظ على ترتيب الصفحات في جوجل وامنع الروابط المكسورة عند تغيير رابط أي مقال أو علاج.',
    fromPh: 'المسار القديم (مثال: /old-treatment-slug)',
    toPh: 'المسار الجديد (مثال: /fr/treatments/chirurgie-cardiaque)',
    perm301: '301 دائم (Permanent)',
    temp302: '302 مؤقت (Temporary)',
    addBtn: 'إضافة قاعدة',
    notePh: 'ملاحظة اختيارية (سبب التحويل)...',
    loading: 'جارٍ تحميل قواعد التحويل...',
    empty: 'لا توجد تحويلات مخصصة بعد. أضف قاعدة أعلاه أو أنشئها تلقائياً عند تغيير رابط أي صفحة.',
    colSource: 'المسار القديم',
    colTarget: 'الوجهة الجديدة',
    colCode: 'الرمز',
    colHits: 'الزيارات',
    colStatus: 'الحالة',
    colActions: 'إجراء',
    active: 'نشط',
    paused: 'متوقف',
    addedToast: 'تم حفظ قاعدة التحويل وتفعيلها بنجاح',
    addErr: 'فشل إضافة قاعدة التحويل',
    deletedToast: 'تم حذف قاعدة التحويل',
    toggledToast: (on: boolean) => (on ? 'تم تفعيل التحويل' : 'تم إيقاف التحويل مؤقتاً'),
  },
  fr: {
    title: 'Gestionnaire de Redirections (301 / 302)',
    sub: 'Préservez votre référencement SEO et évitez les erreurs 404 lorsque vous modifiez l’URL d’un article ou d’un soin.',
    fromPh: 'Ancien chemin (ex: /ancien-soin)',
    toPh: 'Destination (ex: /fr/treatments/chirurgie-cardiaque)',
    perm301: '301 Permanente',
    temp302: '302 Temporaire',
    addBtn: 'Ajouter',
    notePh: 'Note optionnelle (raison de la redirection)...',
    loading: 'Chargement des redirections...',
    empty: 'Aucune redirection configurée. Ajoutez-en une ci-dessus ou depuis la panneau SEO d’un article.',
    colSource: 'Chemin Source',
    colTarget: 'Destination',
    colCode: 'Code',
    colHits: 'Clics',
    colStatus: 'Statut',
    colActions: 'Actions',
    active: 'Actif',
    paused: 'En pause',
    addedToast: 'Redirection enregistrée et activée',
    addErr: 'Échec d’ajout de la redirection',
    deletedToast: 'Redirection supprimée',
    toggledToast: (on: boolean) => (on ? 'Redirection activée' : 'Redirection mise en pause'),
  },
  en: {
    title: '301 / 302 URL Redirects Manager',
    sub: 'Preserve SEO rankings and prevent broken links whenever article or treatment URLs change.',
    fromPh: 'Old Path (e.g., /old-treatment-slug)',
    toPh: 'Destination (e.g., /fr/treatments/chirurgie-cardiaque)',
    perm301: '301 Permanent',
    temp302: '302 Temporary',
    addBtn: 'Add Rule',
    notePh: 'Optional note (reason for redirect)...',
    loading: 'Loading redirect rules...',
    empty: 'No custom redirects configured yet. Add one above or edit an entity slug to auto-create one.',
    colSource: 'Source Path',
    colTarget: 'Target Destination',
    colCode: 'Code',
    colHits: 'Hits',
    colStatus: 'Status',
    colActions: 'Actions',
    active: 'Active',
    paused: 'Paused',
    addedToast: 'Redirect rule saved and active',
    addErr: 'Failed to add redirect',
    deletedToast: 'Redirect deleted',
    toggledToast: (on: boolean) => (on ? 'Redirect activated' : 'Redirect paused'),
  },
};

export default function AdminRedirectsPage() {
  const { language, direction } = useLanguage();
  const langKey = language === 'fr' || language === 'en' ? language : 'ar';
  const t = redirDict[langKey];

  const [redirects, setRedirects] = useState<RedirectRule[]>([]);
  const [loading, setLoading] = useState(true);
  const [fromPath, setFromPath] = useState('');
  const [toPath, setToPath] = useState('');
  const [statusCode, setStatusCode] = useState<301 | 302>(301);
  const [note, setNote] = useState('');

  const loadRedirects = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/redirects', { cache: 'no-store' });
      const data = await res.json();
      if (res.ok && data.redirects) setRedirects(data.redirects);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRedirects();
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch('/api/redirects', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ fromPath, toPath, statusCode, note }),
    });
    const data = await res.json();
    if (!res.ok) {
      toast.error(data.error || t.addErr);
      return;
    }
    setRedirects((prev) => [data.redirect, ...prev]);
    setFromPath('');
    setToPath('');
    setNote('');
    toast.success(t.addedToast);
  };

  const handleToggleActive = async (rule: RedirectRule) => {
    const res = await fetch('/api/redirects', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: rule.id, isActive: !rule.isActive }),
    });
    const data = await res.json();
    if (res.ok && data.redirect) {
      setRedirects((prev) => prev.map((r) => (r.id === rule.id ? data.redirect : r)));
      toast.success(t.toggledToast(Boolean(data.redirect.isActive)));
    }
  };

  const handleDelete = async (id: string) => {
    const res = await fetch(`/api/redirects?id=${encodeURIComponent(id)}`, { method: 'DELETE' });
    if (res.ok) {
      setRedirects((prev) => prev.filter((r) => r.id !== id));
      toast.success(t.deletedToast);
    }
  };

  return (
    <div dir={direction} className="space-y-6">
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200/90 dark:border-slate-800 shadow-xs space-y-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white flex items-center gap-2.5">
            <ArrowRightLeft className="w-6 h-6 text-[#0097FB] shrink-0" />
            <span>{t.title}</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">{t.sub}</p>
        </div>

        <form onSubmit={handleCreate} className="grid grid-cols-1 md:grid-cols-12 gap-3 pt-3 border-t border-slate-100 dark:border-slate-800 text-xs">
          <input
            type="text"
            required
            dir="ltr"
            placeholder={t.fromPh}
            value={fromPath}
            onChange={(e) => setFromPath(e.target.value)}
            className="md:col-span-4 px-3 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-mono text-slate-900 dark:text-white outline-none"
          />
          <input
            type="text"
            required
            dir="ltr"
            placeholder={t.toPh}
            value={toPath}
            onChange={(e) => setToPath(e.target.value)}
            className="md:col-span-4 px-3 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-mono text-slate-900 dark:text-white outline-none"
          />
          <select
            value={statusCode}
            onChange={(e) => setStatusCode(Number(e.target.value) as 301 | 302)}
            className="md:col-span-2 px-3 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-bold text-slate-900 dark:text-white outline-none"
          >
            <option value={301}>{t.perm301}</option>
            <option value={302}>{t.temp302}</option>
          </select>
          <button
            type="submit"
            className="md:col-span-2 px-4 py-2.5 rounded-xl bg-[#0097FB] hover:bg-[#0082d6] text-white font-bold flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>{t.addBtn}</span>
          </button>
          <input
            type="text"
            placeholder={t.notePh}
            value={note}
            onChange={(e) => setNote(e.target.value)}
            className="md:col-span-12 px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white outline-none"
          />
        </form>
      </div>

      {/* Table */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/90 dark:border-slate-800 overflow-hidden shadow-xs">
        {loading ? (
          <div className="p-8 text-center text-sm text-slate-400">{t.loading}</div>
        ) : redirects.length === 0 ? (
          <div className="p-10 text-center text-sm text-slate-500">{t.empty}</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-start">
              <thead className="bg-slate-50 dark:bg-slate-800/70 border-b border-slate-200 dark:border-slate-700 font-bold text-slate-600 dark:text-slate-300">
                <tr>
                  <th className="p-3.5 text-start">{t.colSource}</th>
                  <th className="p-3.5 text-start">{t.colTarget}</th>
                  <th className="p-3.5 text-start">{t.colCode}</th>
                  <th className="p-3.5 text-start">{t.colHits}</th>
                  <th className="p-3.5 text-start">{t.colStatus}</th>
                  <th className="p-3.5 text-end">{t.colActions}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {redirects.map((rule) => (
                  <tr key={rule.id} className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40">
                    <td className="p-3.5 font-mono text-rose-600 dark:text-rose-400" dir="ltr">{rule.fromPath}</td>
                    <td className="p-3.5 font-mono text-emerald-700 dark:text-emerald-400" dir="ltr">{rule.toPath}</td>
                    <td className="p-3.5 font-bold">{rule.statusCode}</td>
                    <td className="p-3.5 font-mono">{rule.hits || 0}</td>
                    <td className="p-3.5">
                      <button
                        type="button"
                        onClick={() => handleToggleActive(rule)}
                        className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full font-bold cursor-pointer ${
                          rule.isActive
                            ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300'
                            : 'bg-slate-100 text-slate-500 dark:bg-slate-800'
                        }`}
                      >
                        {rule.isActive ? <CheckCircle2 className="w-3 h-3" /> : <PauseCircle className="w-3 h-3" />}
                        <span>{rule.isActive ? t.active : t.paused}</span>
                      </button>
                    </td>
                    <td className="p-3.5 text-end">
                      <button
                        type="button"
                        onClick={() => handleDelete(rule.id)}
                        className="p-1.5 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-lg cursor-pointer"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
