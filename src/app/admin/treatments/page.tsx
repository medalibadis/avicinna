'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { useData } from '@/context/DataContext';
import { useLanguage } from '@/context/LanguageContext';
import { Treatment } from '@/data/treatments';
import {
  Stethoscope,
  Plus,
  Edit2,
  Trash2,
  X,
  Search,
  Sparkles,
  Layers,
  Activity,
  CheckCircle2,
} from 'lucide-react';
import { ImageUploadField } from '@/components/admin/ImageUploadField';
import { ModalPortal } from '@/components/admin/ModalPortal';

const treatmentsDict = {
  ar: {
    badge: 'التخصصات الطبية',
    pageTitle: 'إدارة التخصصات والعمليات الجراحية',
    pageSubtitle: 'إضافة وتحديث التخصصات الطبية والإجراءات الجراحية المتاحة والحالات المرضية المستهدفة.',
    addBtn: 'إضافة تخصص جديد',
    searchPlaceholder: 'ابحث باسم التخصص أو الإجراء أو الوصف...',
    proceduresCount: 'إجراءات جراحية',
    conditionsCount: 'حالات مرضية',
    editBtn: 'تعديل',
    deleteBtn: 'حذف',
    modalTitleAdd: 'إضافة تخصص طبي جديد',
    modalTitleEdit: 'تعديل التخصص الطبي',
    modalSubtitleAdd: 'أدخل بيانات التخصص باللغات الثلاث لإتاحته للمرضى ومحركات البحث.',
    modalSubtitleEdit: 'تحديث العمليات والتقنيات الجراحية والمحتوى متعدد اللغات.',
    fieldTitleAr: 'اسم التخصص (عربي) *',
    fieldTitleEn: 'اسم التخصص (إنجليزي) *',
    fieldTitleFr: 'اسم التخصص (فرنسي) *',
    fieldCoverImage: 'صورة التخصص أو الغلاف *',
    fieldCoverHelper: 'يمكنك رفع صورة من جهازك، أو اختيارها من المعرض، أو إدخال رابط مباشر.',
    fieldShortDescAr: 'الوصف الموجز (عربي)',
    fieldShortDescEn: 'الوصف الموجز (إنجليزي)',
    fieldShortDescFr: 'الوصف الموجز (فرنسي)',
    fieldOverviewAr: 'النظرة الطبية الشاملة (عربي)',
    fieldOverviewEn: 'النظرة الطبية الشاملة (إنجليزي)',
    fieldOverviewFr: 'النظرة الطبية الشاملة (فرنسي)',
    fieldConditions: 'الحالات المرضية المعالجة (مفصولة بفاصلة)',
    fieldWhyTurkey: 'لماذا تركيا لهذا التخصص؟ (مفصولة بفاصلة)',
    cancelBtn: 'إلغاء',
    saveBtn: 'حفظ التغييرات',
    createBtn: 'إضافة التخصص',
    deleteConfirm: (name: string) => `هل أنت متأكد من حذف تخصص: ${name}؟`,
    noResults: 'لا توجد تخصصات مطابقة لمعايير البحث.',
  },
  en: {
    badge: 'Medical Specialties',
    pageTitle: 'Treatments & Surgeries Management',
    pageSubtitle: 'Add and manage clinical departments, surgical procedures, target conditions, and multilingual copy.',
    addBtn: 'Add New Treatment',
    searchPlaceholder: 'Search by specialty name, procedure, or description...',
    proceduresCount: 'surgical procedures',
    conditionsCount: 'treated conditions',
    editBtn: 'Edit',
    deleteBtn: 'Delete',
    modalTitleAdd: 'Add New Medical Specialty',
    modalTitleEdit: 'Edit Medical Specialty',
    modalSubtitleAdd: 'Input specialty details across all three languages for international patients and SEO.',
    modalSubtitleEdit: 'Update surgical procedures, technologies, and multilingual content.',
    fieldTitleAr: 'Specialty Name (Arabic) *',
    fieldTitleEn: 'Specialty Name (English) *',
    fieldTitleFr: 'Specialty Name (French) *',
    fieldCoverImage: 'Cover Image *',
    fieldCoverHelper: 'Upload an image from your device, choose from media gallery, or paste a URL.',
    fieldShortDescAr: 'Short Description (Arabic)',
    fieldShortDescEn: 'Short Description (English)',
    fieldShortDescFr: 'Short Description (French)',
    fieldOverviewAr: 'Full Clinical Overview (Arabic)',
    fieldOverviewEn: 'Full Clinical Overview (English)',
    fieldOverviewFr: 'Full Clinical Overview (French)',
    fieldConditions: 'Treated Conditions (comma-separated)',
    fieldWhyTurkey: 'Why Turkey for this Treatment? (comma-separated)',
    cancelBtn: 'Cancel',
    saveBtn: 'Save Changes',
    createBtn: 'Create Treatment',
    deleteConfirm: (name: string) => `Are you sure you want to delete treatment: ${name}?`,
    noResults: 'No medical specialties match your search query.',
  },
  fr: {
    badge: 'Spécialités Médicales',
    pageTitle: 'Gestion des Soins et Chirurgies',
    pageSubtitle: 'Ajoutez et gérez les départements médicaux, interventions chirurgicales et pathologies traitées.',
    addBtn: 'Ajouter un Soin',
    searchPlaceholder: 'Rechercher par spécialité, acte chirurgical ou mot-clé...',
    proceduresCount: 'actes chirurgicaux',
    conditionsCount: 'pathologies',
    editBtn: 'Modifier',
    deleteBtn: 'Supprimer',
    modalTitleAdd: 'Ajouter une Nouvelle Spécialité',
    modalTitleEdit: 'Modifier la Spécialité Médicale',
    modalSubtitleAdd: 'Renseignez les données trilingues pour les patients internationaux et le référencement SEO.',
    modalSubtitleEdit: 'Mettez à jour les interventions chirurgicales et le contenu médical.',
    fieldTitleAr: 'Nom du soin (Arabe) *',
    fieldTitleEn: 'Nom du soin (Anglais) *',
    fieldTitleFr: 'Nom du soin (Français) *',
    fieldCoverImage: 'Image de Couverture *',
    fieldCoverHelper: 'Téléchargez une image locale, choisissez depuis la galerie ou collez un lien direct.',
    fieldShortDescAr: 'Description courte (Arabe)',
    fieldShortDescEn: 'Description courte (Anglais)',
    fieldShortDescFr: 'Description courte (Français)',
    fieldOverviewAr: 'Aperçu clinique complet (Arabe)',
    fieldOverviewEn: 'Aperçu clinique complet (Anglais)',
    fieldOverviewFr: 'Aperçu clinique complet (Français)',
    fieldConditions: 'Pathologies prises en charge (séparées par une virgule)',
    fieldWhyTurkey: 'Pourquoi la Turquie pour ce soin ? (séparées par une virgule)',
    cancelBtn: 'Annuler',
    saveBtn: 'Enregistrer les Modifications',
    createBtn: 'Ajouter le Soin',
    deleteConfirm: (name: string) => `Êtes-vous sûr de vouloir supprimer le soin : ${name} ?`,
    noResults: 'Aucun soin médical ne correspond à votre recherche.',
  },
};

function AdminTreatmentsContent() {
  const { treatments, addTreatment, updateTreatment, deleteTreatment } = useData();
  const { language, direction } = useLanguage();
  const searchParams = useSearchParams();

  const langKey = language === 'ar' || language === 'en' || language === 'fr' ? language : 'ar';
  const d = treatmentsDict[langKey];

  const [searchQuery, setSearchQuery] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingTreatment, setEditingTreatment] = useState<Treatment | null>(null);
  const [highlightedId, setHighlightedId] = useState<string | null>(null);

  // Form state
  const [titleAr, setTitleAr] = useState('');
  const [titleEn, setTitleEn] = useState('');
  const [titleFr, setTitleFr] = useState('');
  const [shortDescAr, setShortDescAr] = useState('');
  const [shortDescEn, setShortDescEn] = useState('');
  const [shortDescFr, setShortDescFr] = useState('');
  const [fullOverviewAr, setFullOverviewAr] = useState('');
  const [fullOverviewEn, setFullOverviewEn] = useState('');
  const [fullOverviewFr, setFullOverviewFr] = useState('');
  const [imageUrl, setImageUrl] = useState(
    'https://images.unsplash.com/photo-1579684385127-1ef15d508118?q=80&w=1200&auto=format&fit=crop'
  );
  const [conditionsRaw, setConditionsRaw] = useState('');
  const [whyTurkeyRaw, setWhyTurkeyRaw] = useState('');

  // Deep-linking from search bar
  const targetEditId = searchParams.get('edit') || searchParams.get('id');
  const targetSearch = searchParams.get('search') || searchParams.get('q');

  useEffect(() => {
    if (targetSearch) {
      setSearchQuery(targetSearch);
    }
    if (targetEditId && treatments.length > 0) {
      const match = treatments.find(
        (t) =>
          t.id.toLowerCase() === targetEditId.toLowerCase() ||
          t.slug.toLowerCase() === targetEditId.toLowerCase()
      );
      if (match) {
        setHighlightedId(match.id);
        setSearchQuery(match.title[langKey] || match.title.en);
        openEditModal(match);
      }
    }
  }, [targetEditId, targetSearch, treatments, langKey]);

  const openAddModal = () => {
    setEditingTreatment(null);
    setTitleAr('');
    setTitleEn('');
    setTitleFr('');
    setShortDescAr('أحدث الحلول الطبية والجراحية في إسطنبول تحت إشراف نخبة الأطباء.');
    setShortDescEn('Advanced surgical procedures and therapies in Istanbul led by top faculty.');
    setShortDescFr('Procédures chirurgicales et thérapeutiques de pointe à Istanbul.');
    setFullOverviewAr('قسم متكامل مجهز بأحدث التقنيات الجراحية والمجالس الطبية الاستشارية.');
    setFullOverviewEn('Comprehensive department equipped with state-of-the-art surgical technology.');
    setFullOverviewFr('Département d’excellence équipé des technologies chirurgicales de dernière génération.');
    setImageUrl('https://images.unsplash.com/photo-1579684385127-1ef15d508118?q=80&w=1200&auto=format&fit=crop');
    setConditionsRaw('الحالات المتقدمة, التشخيص الدقيق, الرعاية المتكاملة');
    setWhyTurkeyRaw('نسب نجاح تفوق 98%, توفير مالي يصل إلى 60%, مستشفيات معتمدة دولياً JCI');
    setModalOpen(true);
  };

  const openEditModal = (t: Treatment) => {
    setEditingTreatment(t);
    setTitleAr(t.title?.ar || '');
    setTitleEn(t.title?.en || '');
    setTitleFr(t.title?.fr || t.title?.en || '');
    setShortDescAr(t.shortDescription?.ar || '');
    setShortDescEn(t.shortDescription?.en || '');
    setShortDescFr(t.shortDescription?.fr || t.shortDescription?.en || '');
    setFullOverviewAr(t.fullOverview?.ar || '');
    setFullOverviewEn(t.fullOverview?.en || '');
    setFullOverviewFr(t.fullOverview?.fr || t.fullOverview?.en || '');
    setImageUrl(t.image);
    setConditionsRaw(t.conditionsTreated?.ar?.join(', ') || '');
    setWhyTurkeyRaw(t.whyTurkey?.ar?.join(', ') || '');
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
        fr: titleFr || titleEn,
      },
      shortDescription: {
        ar: shortDescAr,
        en: shortDescEn,
        fr: shortDescFr || shortDescEn,
      },
      fullOverview: {
        ar: fullOverviewAr,
        en: fullOverviewEn || fullOverviewAr,
        fr: fullOverviewFr || fullOverviewEn || fullOverviewAr,
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
    const tName = t.title[langKey] || t.title.ar;
    if (window.confirm(d.deleteConfirm(tName))) {
      deleteTreatment(t.id);
    }
  };

  const filteredTreatments = treatments.filter((item) => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return true;
    return (
      item.title.ar?.toLowerCase().includes(q) ||
      item.title.en?.toLowerCase().includes(q) ||
      item.title.fr?.toLowerCase().includes(q) ||
      item.shortDescription.ar?.toLowerCase().includes(q) ||
      item.shortDescription.en?.toLowerCase().includes(q)
    );
  });

  return (
    <div dir={direction} className="space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sky-50 dark:bg-sky-950/40 border border-sky-200 dark:border-sky-800/60 text-sky-700 dark:text-sky-300 text-xs font-bold mb-1 shadow-2xs">
            <Stethoscope className="w-3.5 h-3.5 text-sky-600 dark:text-sky-400" />
            <span>{d.badge}</span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
            {d.pageTitle} ({treatments.length})
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-xs mt-1 max-w-2xl leading-relaxed">
            {d.pageSubtitle}
          </p>
        </div>

        <button
          type="button"
          onClick={openAddModal}
          className="inline-flex items-center gap-2 bg-[#0097FB] hover:bg-[#0082d6] active:scale-98 text-white text-xs sm:text-sm font-bold px-5 py-2.5 rounded-xl shadow-md shadow-[#0097FB]/25 transition-all cursor-pointer flex-shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>{d.addBtn}</span>
        </button>
      </div>

      {/* Search Input */}
      <div className="relative">
        <Search className="w-5 h-5 text-slate-400 absolute top-1/2 -translate-y-1/2 rtl:right-4 rtl:left-auto ltr:left-4 ltr:right-auto pointer-events-none" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder={d.searchPlaceholder}
          className="w-full bg-white dark:bg-slate-900/90 border border-slate-200/80 dark:border-slate-800 shadow-xs rounded-2xl py-3.5 px-12 text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 outline-none placeholder:text-slate-400 dark:placeholder:text-slate-500 transition-all"
        />
        {searchQuery && (
          <button
            type="button"
            onClick={() => setSearchQuery('')}
            className="absolute top-1/2 -translate-y-1/2 rtl:left-4 rtl:right-auto ltr:right-4 ltr:left-auto p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Treatments Grid */}
      {filteredTreatments.length === 0 ? (
        <div className="bg-white dark:bg-slate-900/90 rounded-3xl p-12 text-center border border-slate-200/80 dark:border-slate-800 shadow-xs">
          <div className="w-12 h-12 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center mx-auto mb-3 text-slate-400">
            <Search className="w-6 h-6" />
          </div>
          <p className="text-sm font-bold text-slate-700 dark:text-slate-300">{d.noResults}</p>
        </div>
      ) : (
        <div className="grid grid-cols-[repeat(auto-fit,minmax(320px,1fr))] gap-6">
          {filteredTreatments.map((t) => {
            const isHighlighted = highlightedId === t.id;
            const primaryTitle = t.title[langKey] || t.title.en || t.title.ar;
            const primaryDesc = t.shortDescription[langKey] || t.shortDescription.en || t.shortDescription.ar;

            return (
              <div
                key={t.id}
                className={`bg-white dark:bg-slate-900/90 border rounded-3xl overflow-hidden flex flex-col justify-between shadow-xs group transition-all duration-300 ${
                  isHighlighted
                    ? 'border-sky-500 ring-4 ring-sky-500/20 shadow-xl scale-[1.01]'
                    : 'border-slate-200/80 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 hover:shadow-md dark:hover:shadow-sky-500/5'
                }`}
              >
                <div className="relative h-44 bg-slate-100 dark:bg-slate-800 overflow-hidden">
                  <img
                    src={t.image}
                    alt={primaryTitle}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                  <div className="absolute bottom-3 left-3 right-3 text-white">
                    <h3 className="font-bold text-base leading-snug">{primaryTitle}</h3>
                    {langKey === 'ar' && t.title.en && (
                      <div className="text-[11px] text-sky-300 font-medium dir-ltr">{t.title.en}</div>
                    )}
                  </div>
                </div>

                <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                  <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-3 leading-relaxed">
                    {primaryDesc}
                  </p>

                  <div className="pt-2 border-t border-slate-100 dark:border-slate-800 text-[11px] text-slate-500 dark:text-slate-400 font-semibold flex items-center justify-between">
                    <span className="bg-slate-50 dark:bg-slate-800 px-2 py-0.5 rounded-md border border-slate-100 dark:border-slate-700 dark:text-slate-300">
                      {t.procedures?.[langKey]?.length || t.procedures?.en?.length || t.procedures?.ar?.length || 1} {d.proceduresCount}
                    </span>
                    <span className="bg-slate-50 dark:bg-slate-800 px-2 py-0.5 rounded-md border border-slate-100 dark:border-slate-700 dark:text-slate-300">
                      {t.conditionsTreated?.[langKey]?.length || t.conditionsTreated?.en?.length || t.conditionsTreated?.ar?.length || 3} {d.conditionsCount}
                    </span>
                  </div>

                  {/* Action Buttons */}
                  <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => openEditModal(t)}
                      className="flex-1 py-2 px-3 rounded-xl bg-slate-50 hover:bg-sky-50 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 hover:text-sky-700 dark:text-slate-200 dark:hover:text-sky-300 border border-slate-200 dark:border-slate-700 text-xs font-bold transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <Edit2 className="w-3.5 h-3.5 text-sky-600 dark:text-sky-400" />
                      <span>{d.editBtn}</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(t)}
                      className="p-2 rounded-xl bg-slate-50 hover:bg-rose-50 dark:bg-slate-800 dark:hover:bg-rose-950/40 text-slate-600 hover:text-rose-600 dark:text-slate-300 dark:hover:text-rose-400 border border-slate-200 dark:border-slate-700 transition-colors cursor-pointer"
                      title={d.deleteBtn}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Modal Add / Edit */}
      <ModalPortal isOpen={modalOpen}>
        <div dir={direction} className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-5 bg-slate-900/20 backdrop-blur-xl dark:bg-slate-950/50 animate-in fade-in duration-200 overflow-hidden">
          <div
            dir={direction}
            className="bg-white/95 dark:bg-slate-900/95 backdrop-blur-2xl border border-slate-200/90 dark:border-slate-800 rounded-[26px] sm:rounded-[30px] max-w-2xl w-full max-h-[86vh] flex flex-col shadow-2xl shadow-slate-900/15 overflow-hidden animate-in zoom-in-95 duration-200 text-slate-900 dark:text-slate-100"
          >
            <div className="p-5 sm:p-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between shrink-0 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-2xl bg-sky-50 text-sky-600 flex items-center justify-center ring-4 ring-sky-500/10 shadow-xs">
                  <Stethoscope className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-base sm:text-lg font-black text-slate-900 dark:text-slate-100">
                    {editingTreatment ? d.modalTitleEdit : d.modalTitleAdd}
                  </h2>
                  <p className="text-xs text-slate-400">
                    {editingTreatment ? d.modalSubtitleEdit : d.modalSubtitleAdd}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                className="w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleFormSubmit} className="flex-1 flex flex-col min-h-0 overflow-hidden">
              <div className="flex-1 overflow-y-auto overflow-x-hidden overscroll-contain p-5 sm:p-6 space-y-4">
              {/* Trilingual Title Fields */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    {d.fieldTitleAr}
                  </label>
                  <input
                    type="text"
                    required
                    value={titleAr}
                    onChange={(e) => setTitleAr(e.target.value)}
                    placeholder="جراحة القلب والأوعية الدموية"
                    className="w-full bg-slate-50/70 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 focus:bg-white dark:focus:bg-slate-800 focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white outline-none transition-all placeholder:text-slate-400 dark:placeholder:text-slate-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    {d.fieldTitleEn}
                  </label>
                  <input
                    type="text"
                    required
                    value={titleEn}
                    onChange={(e) => setTitleEn(e.target.value)}
                    placeholder="Cardiovascular Surgery"
                    className="w-full bg-slate-50/70 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 focus:bg-white dark:focus:bg-slate-800 focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white outline-none dir-ltr transition-all placeholder:text-slate-400 dark:placeholder:text-slate-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    {d.fieldTitleFr}
                  </label>
                  <input
                    type="text"
                    required
                    value={titleFr}
                    onChange={(e) => setTitleFr(e.target.value)}
                    placeholder="Chirurgie Cardiovasculaire"
                    className="w-full bg-slate-50/70 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 focus:bg-white dark:focus:bg-slate-800 focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white outline-none dir-ltr transition-all placeholder:text-slate-400 dark:placeholder:text-slate-500"
                  />
                </div>
              </div>

              <ImageUploadField
                label={d.fieldCoverImage}
                value={imageUrl}
                onChange={setImageUrl}
                folder="treatments"
                aspectRatio="video"
                helperText={d.fieldCoverHelper}
              />

              {/* Trilingual Short Descriptions */}
              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    {d.fieldShortDescAr}
                  </label>
                  <textarea
                    rows={2}
                    value={shortDescAr}
                    onChange={(e) => setShortDescAr(e.target.value)}
                    className="w-full bg-slate-50/70 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 focus:bg-white dark:focus:bg-slate-800 focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white outline-none transition-all placeholder:text-slate-400 dark:placeholder:text-slate-500"
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      {d.fieldShortDescEn}
                    </label>
                    <textarea
                      rows={2}
                      value={shortDescEn}
                      onChange={(e) => setShortDescEn(e.target.value)}
                      className="w-full bg-slate-50/70 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 focus:bg-white dark:focus:bg-slate-800 focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white outline-none dir-ltr transition-all placeholder:text-slate-400 dark:placeholder:text-slate-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      {d.fieldShortDescFr}
                    </label>
                    <textarea
                      rows={2}
                      value={shortDescFr}
                      onChange={(e) => setShortDescFr(e.target.value)}
                      className="w-full bg-slate-50/70 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 focus:bg-white dark:focus:bg-slate-800 focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white outline-none dir-ltr transition-all placeholder:text-slate-400 dark:placeholder:text-slate-500"
                    />
                  </div>
                </div>
              </div>

              {/* Clinical Overviews */}
              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    {d.fieldOverviewAr}
                  </label>
                  <textarea
                    rows={2}
                    value={fullOverviewAr}
                    onChange={(e) => setFullOverviewAr(e.target.value)}
                    className="w-full bg-slate-50/70 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 focus:bg-white dark:focus:bg-slate-800 focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white outline-none transition-all placeholder:text-slate-400 dark:placeholder:text-slate-500"
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      {d.fieldOverviewEn}
                    </label>
                    <textarea
                      rows={2}
                      value={fullOverviewEn}
                      onChange={(e) => setFullOverviewEn(e.target.value)}
                      className="w-full bg-slate-50/70 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 focus:bg-white dark:focus:bg-slate-800 focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white outline-none dir-ltr transition-all placeholder:text-slate-400 dark:placeholder:text-slate-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      {d.fieldOverviewFr}
                    </label>
                    <textarea
                      rows={2}
                      value={fullOverviewFr}
                      onChange={(e) => setFullOverviewFr(e.target.value)}
                      className="w-full bg-slate-50/70 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 focus:bg-white dark:focus:bg-slate-800 focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white outline-none dir-ltr transition-all placeholder:text-slate-400 dark:placeholder:text-slate-500"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  {d.fieldConditions}
                </label>
                <input
                  type="text"
                  value={conditionsRaw}
                  onChange={(e) => setConditionsRaw(e.target.value)}
                  className="w-full bg-slate-50/70 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 focus:bg-white dark:focus:bg-slate-800 focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20 rounded-xl px-4 py-2 text-xs text-slate-900 dark:text-white outline-none transition-all placeholder:text-slate-400 dark:placeholder:text-slate-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  {d.fieldWhyTurkey}
                </label>
                <input
                  type="text"
                  value={whyTurkeyRaw}
                  onChange={(e) => setWhyTurkeyRaw(e.target.value)}
                  className="w-full bg-slate-50/70 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 focus:bg-white dark:focus:bg-slate-800 focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20 rounded-xl px-4 py-2 text-xs text-slate-900 dark:text-white outline-none transition-all placeholder:text-slate-400 dark:placeholder:text-slate-500"
                />
              </div>

              </div>

              {/* Modal Footer Controls - Sticky & Always Visible */}
              <div className="p-4 sm:px-6 border-t border-slate-100 dark:border-slate-800 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md flex items-center justify-end gap-3 shrink-0">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-bold cursor-pointer transition-colors"
                >
                  {d.cancelBtn}
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 rounded-xl bg-gradient-to-r from-sky-600 to-teal-600 hover:from-sky-700 hover:to-teal-700 text-white text-xs font-bold shadow-md shadow-sky-600/20 cursor-pointer transition-all"
                >
                  {editingTreatment ? d.saveBtn : d.createBtn}
                </button>
              </div>
            </form>
          </div>
        </div>
      </ModalPortal>
    </div>
  );
}

export default function AdminTreatmentsPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-[50vh] flex items-center justify-center">
          <div className="w-8 h-8 rounded-full border-2 border-[#0097FB] border-t-transparent animate-spin" />
        </div>
      }
    >
      <AdminTreatmentsContent />
    </Suspense>
  );
}
