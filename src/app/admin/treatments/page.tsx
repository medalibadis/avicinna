'use client';

import React, { useState } from 'react';
import { useData } from '@/context/DataContext';
import { Treatment } from '@/data/treatments';
import {
  Stethoscope,
  Plus,
  Edit2,
  Trash2,
  X,
  Search,
} from 'lucide-react';

export default function AdminTreatmentsPage() {
  const { treatments, addTreatment, updateTreatment, deleteTreatment } = useData();

  const [searchQuery, setSearchQuery] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingTreatment, setEditingTreatment] = useState<Treatment | null>(null);

  // Form state
  const [titleAr, setTitleAr] = useState('');
  const [titleEn, setTitleEn] = useState('');
  const [shortDescAr, setShortDescAr] = useState('');
  const [shortDescEn, setShortDescEn] = useState('');
  const [fullOverviewAr, setFullOverviewAr] = useState('');
  const [imageUrl, setImageUrl] = useState(
    'https://images.unsplash.com/photo-1579684385127-1ef15d508118?q=80&w=1200&auto=format&fit=crop'
  );
  const [conditionsRaw, setConditionsRaw] = useState('');
  const [whyTurkeyRaw, setWhyTurkeyRaw] = useState('');

  const openAddModal = () => {
    setEditingTreatment(null);
    setTitleAr('');
    setTitleEn('');
    setShortDescAr('أحدث الحلول الطبية والجراحية في إسطنبول تحت إشراف نخبة الأطباء.');
    setShortDescEn('Advanced surgical procedures and therapies in Istanbul led by top faculty.');
    setFullOverviewAr('قسم متكامل مجهز بأحدث التقنيات الجراحية والمجالس الطبية الاستشارية.');
    setImageUrl('https://images.unsplash.com/photo-1579684385127-1ef15d508118?q=80&w=1200&auto=format&fit=crop');
    setConditionsRaw('الحالات المتقدمة, التشخيص الدقيق, الرعاية المتكاملة');
    setWhyTurkeyRaw('نسب نجاح تفوق 98%, توفير مالي يصل إلى 60%, مستشفيات معتمدة دولياً JCI');
    setModalOpen(true);
  };

  const openEditModal = (t: Treatment) => {
    setEditingTreatment(t);
    setTitleAr(t.title.ar);
    setTitleEn(t.title.en);
    setShortDescAr(t.shortDescription.ar);
    setShortDescEn(t.shortDescription.en);
    setFullOverviewAr(t.fullOverview.ar);
    setImageUrl(t.image);
    setConditionsRaw(t.conditionsTreated.ar.join(', '));
    setWhyTurkeyRaw(t.whyTurkey.ar.join(', '));
    setModalOpen(true);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!titleAr || !titleEn) return;

    const parsedConditions = conditionsRaw.split(',').map((s) => s.trim()).filter(Boolean);
    const parsedWhy = whyTurkeyRaw.split(',').map((s) => s.trim()).filter(Boolean);

    const payload: Treatment = {
      id: editingTreatment ? editingTreatment.id : `treat-${Date.now()}`,
      slug: editingTreatment
        ? editingTreatment.slug
        : titleEn.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
      title: {
        ar: titleAr,
        en: titleEn,
        fr: titleEn,
      },
      shortDescription: {
        ar: shortDescAr,
        en: shortDescEn,
        fr: shortDescEn,
      },
      fullOverview: {
        ar: fullOverviewAr,
        en: fullOverviewAr,
        fr: fullOverviewAr,
      },
      image: imageUrl,
      iconName: editingTreatment?.iconName || 'Activity',
      featured: true,
      conditionsTreated: {
        ar: parsedConditions,
        en: parsedConditions,
        fr: parsedConditions,
      },
      procedures: editingTreatment ? editingTreatment.procedures : {
        ar: [{ name: 'الفحص والاستشارة الدقيقة', desc: 'تقييم شامل للحالة قبل الجراحة.' }],
        en: [{ name: 'Detailed Clinical Consultation', desc: 'Pre-op diagnostic assessment.' }],
        fr: [{ name: 'Consultation Préopératoire', desc: 'Évaluation clinique complète.' }],
      },
      whyTurkey: {
        ar: parsedWhy,
        en: parsedWhy,
        fr: parsedWhy,
      },
      faqs: editingTreatment ? editingTreatment.faqs : [],
      doctorIds: editingTreatment ? editingTreatment.doctorIds : [],
    };

    if (editingTreatment) {
      updateTreatment(payload);
    } else {
      addTreatment(payload);
    }

    setModalOpen(false);
  };

  const handleDelete = (t: Treatment) => {
    if (window.confirm(`هل أنت متأكد من رغبتك في حذف تخصص: ${t.title.ar}؟`)) {
      deleteTreatment(t.id);
    }
  };

  const filteredTreatments = treatments.filter((item) => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return true;
    return (
      item.title.ar.toLowerCase().includes(q) ||
      item.title.en.toLowerCase().includes(q) ||
      item.shortDescription.ar.toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sky-50 border border-sky-200 text-sky-700 text-xs font-bold mb-1">
            <Stethoscope className="w-3.5 h-3.5 text-sky-600" />
            <span>التخصصات الطبية</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900">
            إدارة التخصصات والعمليات / Treatments Management ({treatments.length})
          </h1>
          <p className="text-slate-500 text-xs mt-1">
            إضافة وتعديل التخصصات الطبية، الإجراءات المتاحة، الحالات المرضية، ونقاط القوة.
          </p>
        </div>

        <button
          type="button"
          onClick={openAddModal}
          className="inline-flex items-center gap-2 bg-sky-600 hover:bg-sky-700 active:scale-98 text-white text-xs sm:text-sm font-bold px-5 py-2.5 rounded-xl shadow-sm shadow-sky-600/20 transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>إضافة تخصص جديد / Add Treatment</span>
        </button>
      </div>

      {/* Search Input */}
      <div className="relative">
        <Search className="w-5 h-5 text-slate-400 absolute top-1/2 -translate-y-1/2 right-4 rtl:right-4 ltr:left-4 ltr:right-auto pointer-events-none" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="ابحث باسم التخصص أو الإجراء..."
          className="w-full bg-white border border-slate-200/80 shadow-xs rounded-2xl py-3 px-12 text-sm text-slate-900 focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 outline-none placeholder:text-slate-400 transition-all"
        />
      </div>

      {/* Treatments Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTreatments.map((t) => (
          <div
            key={t.id}
            className="bg-white border border-slate-200/80 hover:border-slate-300 hover:shadow-md rounded-3xl overflow-hidden flex flex-col justify-between shadow-xs group transition-all duration-200"
          >
            <div className="relative h-44 bg-slate-100 overflow-hidden">
              <img
                src={t.image}
                alt={t.title.ar}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
              <div className="absolute bottom-3 left-3 right-3 text-white">
                <h3 className="font-bold text-base leading-snug">{t.title.ar}</h3>
                <div className="text-[11px] text-sky-300 font-medium">{t.title.en}</div>
              </div>
            </div>

            <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
              <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed">
                {t.shortDescription.ar}
              </p>

              <div className="pt-2 border-t border-slate-100 text-[11px] text-slate-500 font-semibold flex items-center justify-between">
                <span className="bg-slate-50 px-2 py-0.5 rounded-md border border-slate-100">{t.procedures.ar.length} إجراءات جراحية</span>
                <span className="bg-slate-50 px-2 py-0.5 rounded-md border border-slate-100">{t.conditionsTreated.ar.length} حالات مرضية</span>
              </div>

              {/* Action Buttons */}
              <div className="pt-2 border-t border-slate-100 flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => openEditModal(t)}
                  className="flex-1 py-2 px-3 rounded-xl bg-slate-50 hover:bg-sky-50 text-slate-700 hover:text-sky-700 border border-slate-200 text-xs font-bold transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Edit2 className="w-3.5 h-3.5 text-sky-600" />
                  <span>تعديل / Edit</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleDelete(t)}
                  className="p-2 rounded-xl bg-slate-50 hover:bg-rose-50 text-slate-600 hover:text-rose-600 border border-slate-200 transition-colors cursor-pointer"
                  title="حذف التخصص"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal Add / Edit */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto space-y-5 shadow-2xl text-slate-900">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <Stethoscope className="w-5 h-5 text-sky-600" />
                <span>{editingTreatment ? 'تعديل التخصص الطبي' : 'إضافة تخصص طبي جديد'}</span>
              </h2>
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleFormSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    اسم التخصص (عربي) *
                  </label>
                  <input
                    type="text"
                    required
                    value={titleAr}
                    onChange={(e) => setTitleAr(e.target.value)}
                    placeholder="جراحة القلب والأوعية الدموية"
                    className="w-full bg-slate-50/70 border border-slate-200 focus:bg-white focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20 rounded-xl px-4 py-2 text-xs text-slate-900 outline-none transition-all"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    اسم التخصص (إنجليزي) *
                  </label>
                  <input
                    type="text"
                    required
                    value={titleEn}
                    onChange={(e) => setTitleEn(e.target.value)}
                    placeholder="Cardiovascular Surgery"
                    className="w-full bg-slate-50/70 border border-slate-200 focus:bg-white focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20 rounded-xl px-4 py-2 text-xs text-slate-900 outline-none dir-ltr transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  رابط صورة التخصص (Image URL)
                </label>
                <input
                  type="url"
                  required
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  className="w-full bg-slate-50/70 border border-slate-200 focus:bg-white focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20 rounded-xl px-4 py-2 text-xs text-slate-900 dir-ltr font-mono outline-none transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  الوصف الموجز (Short Description)
                </label>
                <textarea
                  rows={2}
                  value={shortDescAr}
                  onChange={(e) => setShortDescAr(e.target.value)}
                  className="w-full bg-slate-50/70 border border-slate-200 focus:bg-white focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20 rounded-xl px-4 py-2 text-xs text-slate-900 outline-none transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  النظرة الطبية الشاملة (Full Overview)
                </label>
                <textarea
                  rows={3}
                  value={fullOverviewAr}
                  onChange={(e) => setFullOverviewAr(e.target.value)}
                  className="w-full bg-slate-50/70 border border-slate-200 focus:bg-white focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20 rounded-xl px-4 py-2 text-xs text-slate-900 outline-none transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  الحالات المرضية المعالجة (مفصولة بفاصلة)
                </label>
                <input
                  type="text"
                  value={conditionsRaw}
                  onChange={(e) => setConditionsRaw(e.target.value)}
                  className="w-full bg-slate-50/70 border border-slate-200 focus:bg-white focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20 rounded-xl px-4 py-2 text-xs text-slate-900 outline-none transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  لماذا تركيا لهذا التخصص؟ (مفصولة بفاصلة)
                </label>
                <input
                  type="text"
                  value={whyTurkeyRaw}
                  onChange={(e) => setWhyTurkeyRaw(e.target.value)}
                  className="w-full bg-slate-50/70 border border-slate-200 focus:bg-white focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20 rounded-xl px-4 py-2 text-xs text-slate-900 outline-none transition-all"
                />
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold cursor-pointer transition-colors"
                >
                  إلغاء / Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 rounded-xl bg-sky-600 hover:bg-sky-700 text-white text-xs font-bold shadow-sm shadow-sky-600/20 cursor-pointer transition-all"
                >
                  {editingTreatment ? 'حفظ التعديلات' : 'إضافة التخصص'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
