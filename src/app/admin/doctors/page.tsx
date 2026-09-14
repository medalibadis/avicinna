'use client';

import React, { useState } from 'react';
import { useData } from '@/context/DataContext';
import { Doctor } from '@/data/doctors';
import {
  Users,
  Plus,
  Edit2,
  Trash2,
  Star,
  Building2,
  Search,
  X,
  Stethoscope,
} from 'lucide-react';
import { ImageUploadField } from '@/components/admin/ImageUploadField';

export default function AdminDoctorsPage() {
  const { doctors, treatments, addDoctor, updateDoctor, deleteDoctor } = useData();

  const [searchQuery, setSearchQuery] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingDoctor, setEditingDoctor] = useState<Doctor | null>(null);

  // Form state
  const [nameAr, setNameAr] = useState('');
  const [nameEn, setNameEn] = useState('');
  const [titleAr, setTitleAr] = useState('');
  const [titleEn, setTitleEn] = useState('');
  const [specialtySlug, setSpecialtySlug] = useState('cardiac-surgery');
  const [hospitalAr, setHospitalAr] = useState('مستشفى أجيبادم إسطنبول ومجموعة أفيسينا');
  const [experienceYears, setExperienceYears] = useState(15);
  const [rating, setRating] = useState(4.9);
  const [reviewCount, setReviewCount] = useState(120);
  const [imageUrl, setImageUrl] = useState(
    'https://images.unsplash.com/photo-1622253692010-333f2da6031d?q=80&w=800&auto=format&fit=crop'
  );
  const [bioAr, setBioAr] = useState('');
  const [bioEn, setBioEn] = useState('');
  const [expertiseRaw, setExpertiseRaw] = useState('');
  const [proceduresRaw, setProceduresRaw] = useState('');
  const [educationRaw, setEducationRaw] = useState('');

  const openAddModal = () => {
    setEditingDoctor(null);
    setNameAr('');
    setNameEn('');
    setTitleAr('استشاري جراحة متقدمة في إسطنبول');
    setTitleEn('Consultant Specialist Surgeon');
    setSpecialtySlug(treatments[0]?.slug || 'cardiac-surgery');
    setHospitalAr('مستشفى أجيبادم التخصصي ومجموعة أفيسينا');
    setExperienceYears(18);
    setRating(4.9);
    setReviewCount(140);
    setImageUrl('https://images.unsplash.com/photo-1622253692010-333f2da6031d?q=80&w=800&auto=format&fit=crop');
    setBioAr('طبيب استشاري رائد يتمتع بخبرة سريرية واسعة وسجل حافل بالعمليات الجراحية الناجحة.');
    setBioEn('Leading consultant surgeon with extensive clinical background and international recognition.');
    setExpertiseRaw('جراحة متقدمة بالمنظار, استشارات تخصصية دقيقة, رعاية ما بعد الجراحة');
    setProceduresRaw('العمليات الجراحية الدقيقة, تنظير الأعضاء, تقييم الحالات المعقدة');
    setEducationRaw('كلية الطب جامعة إسطنبول, زمالة الجراحة الأوروبية');
    setModalOpen(true);
  };

  const openEditModal = (doc: Doctor) => {
    setEditingDoctor(doc);
    setNameAr(doc.name.ar);
    setNameEn(doc.name.en);
    setTitleAr(doc.title.ar);
    setTitleEn(doc.title.en);
    setSpecialtySlug(doc.specialtySlug);
    setHospitalAr(doc.hospital.ar);
    setExperienceYears(doc.experienceYears);
    setRating(doc.rating);
    setReviewCount(doc.reviewCount);
    setImageUrl(doc.image);
    setBioAr(doc.biography.ar);
    setBioEn(doc.biography.en);
    setExpertiseRaw(doc.areasOfExpertise.ar.join(', '));
    setProceduresRaw(doc.procedures.ar.join(', '));
    setEducationRaw(doc.education.ar.join(', '));
    setModalOpen(true);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nameAr || !nameEn) return;

    const matchedTreatment = treatments.find((t) => t.slug === specialtySlug);
    const specialtyName = {
      ar: matchedTreatment?.title.ar || 'جراحة متخصصة',
      en: matchedTreatment?.title.en || 'Specialized Surgery',
      fr: matchedTreatment?.title.fr || 'Chirurgie Spécialisée',
    };

    const parsedExpertise = expertiseRaw.split(',').map((s) => s.trim()).filter(Boolean);
    const parsedProcedures = proceduresRaw.split(',').map((s) => s.trim()).filter(Boolean);
    const parsedEducation = educationRaw.split(',').map((s) => s.trim()).filter(Boolean);

    const docPayload: Doctor = {
      id: editingDoctor ? editingDoctor.id : `doc-${Date.now()}`,
      slug: editingDoctor
        ? editingDoctor.slug
        : nameEn.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
      name: {
        ar: nameAr,
        en: nameEn,
        fr: nameEn,
      },
      title: {
        ar: titleAr,
        en: titleEn,
        fr: titleEn,
      },
      specialtySlug,
      specialtyName,
      hospital: {
        ar: hospitalAr,
        en: hospitalAr,
        fr: hospitalAr,
      },
      experienceYears: Number(experienceYears),
      image: imageUrl,
      rating: Number(rating),
      reviewCount: Number(reviewCount),
      languages: ['العربية (مترجم)', 'English', 'Türkçe'],
      biography: {
        ar: bioAr,
        en: bioEn,
        fr: bioEn,
      },
      areasOfExpertise: {
        ar: parsedExpertise,
        en: parsedExpertise,
        fr: parsedExpertise,
      },
      procedures: {
        ar: parsedProcedures,
        en: parsedProcedures,
        fr: parsedProcedures,
      },
      education: {
        ar: parsedEducation,
        en: parsedEducation,
        fr: parsedEducation,
      },
    };

    if (editingDoctor) {
      updateDoctor(docPayload);
    } else {
      addDoctor(docPayload);
    }

    setModalOpen(false);
  };

  const handleDelete = (doc: Doctor) => {
    if (window.confirm(`هل أنت متأكد من رغبتك في حذف ملف الطبيب: ${doc.name.ar}؟`)) {
      deleteDoctor(doc.id);
    }
  };

  const filteredDoctors = doctors.filter((doc) => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return true;
    return (
      doc.name.ar.toLowerCase().includes(q) ||
      doc.name.en.toLowerCase().includes(q) ||
      doc.specialtyName.ar.toLowerCase().includes(q) ||
      doc.hospital.ar.toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-bold mb-1">
            <Users className="w-3.5 h-3.5 text-emerald-600" />
            <span>قاعدة بيانات الأطباء</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900">
            إدارة الأطباء والجراحين / Doctors Management ({doctors.length})
          </h1>
          <p className="text-slate-500 text-xs mt-1">
            إضافة أطباء جدد، تعديل الملفات الشخصية، السيرة الذاتية والصور ومجالات التخصص.
          </p>
        </div>

        <button
          type="button"
          onClick={openAddModal}
          className="inline-flex items-center gap-2 bg-sky-600 hover:bg-sky-700 active:scale-98 text-white text-xs sm:text-sm font-bold px-5 py-2.5 rounded-xl shadow-sm shadow-sky-600/20 transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>إضافة طبيب جديد / Add Doctor</span>
        </button>
      </div>

      {/* Search Filter Bar */}
      <div className="relative">
        <Search className="w-5 h-5 text-slate-400 absolute top-1/2 -translate-y-1/2 right-4 rtl:right-4 ltr:left-4 ltr:right-auto pointer-events-none" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="ابحث باسم الطبيب، التخصص، أو المستشفى..."
          className="w-full bg-white border border-slate-200/80 shadow-xs rounded-2xl py-3 px-12 text-sm text-slate-900 focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 outline-none placeholder:text-slate-400 transition-all"
        />
      </div>

      {/* Doctors Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredDoctors.map((doc) => (
          <div
            key={doc.id}
            className="bg-white border border-slate-200/80 hover:border-slate-300 hover:shadow-md rounded-3xl p-5 flex flex-col justify-between space-y-4 shadow-xs group transition-all duration-200"
          >
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <img
                  src={doc.image}
                  alt={doc.name.ar}
                  className="w-16 h-16 rounded-2xl object-cover border border-slate-200 shadow-xs flex-shrink-0"
                />
                <div className="min-w-0 flex-1">
                  <span className="text-[10px] font-bold text-sky-700 uppercase tracking-wider bg-sky-50 border border-sky-200 px-2 py-0.5 rounded-md inline-block">
                    {doc.specialtyName.ar}
                  </span>
                  <h3 className="text-base font-bold text-slate-900 mt-1 truncate group-hover:text-sky-600 transition-colors">
                    {doc.name.ar}
                  </h3>
                  <p className="text-[11px] text-slate-500 truncate">{doc.name.en}</p>
                </div>
              </div>

              <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                {doc.title.ar}
              </p>

              <div className="pt-2 border-t border-slate-100 space-y-1 text-xs text-slate-600">
                <div className="flex items-center gap-1.5 truncate">
                  <Building2 className="w-3.5 h-3.5 text-sky-600 flex-shrink-0" />
                  <span className="truncate">{doc.hospital.ar}</span>
                </div>
                <div className="flex items-center justify-between text-[11px] pt-1">
                  <div className="flex items-center gap-1 text-amber-500 font-bold">
                    <Star className="w-3 h-3 fill-current" />
                    <span>{doc.rating}</span>
                    <span className="text-slate-400 font-normal">({doc.reviewCount})</span>
                  </div>
                  <div className="text-slate-600 font-semibold bg-slate-50 px-2 py-0.5 rounded-md border border-slate-100">
                    {doc.experienceYears} سنة خبرة
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="pt-3 border-t border-slate-100 flex items-center gap-2">
              <button
                type="button"
                onClick={() => openEditModal(doc)}
                className="flex-1 py-2 px-3 rounded-xl bg-slate-50 hover:bg-sky-50 text-slate-700 hover:text-sky-700 border border-slate-200 text-xs font-bold transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Edit2 className="w-3.5 h-3.5 text-sky-600" />
                <span>تعديل / Edit</span>
              </button>
              <button
                type="button"
                onClick={() => handleDelete(doc)}
                className="p-2 rounded-xl bg-slate-50 hover:bg-rose-50 text-slate-600 hover:text-rose-600 border border-slate-200 transition-colors cursor-pointer"
                title="حذف الطبيب"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal for Add / Edit Doctor */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto space-y-5 shadow-2xl text-slate-900">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <Stethoscope className="w-5 h-5 text-sky-600" />
                <span>{editingDoctor ? 'تعديل بيانات الطبيب' : 'إضافة طبيب استشاري جديد'}</span>
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
                    الاسم باللغة العربية *
                  </label>
                  <input
                    type="text"
                    required
                    value={nameAr}
                    onChange={(e) => setNameAr(e.target.value)}
                    placeholder="أ. د. أحمد أوزكارا"
                    className="w-full bg-slate-50/70 border border-slate-200 focus:bg-white focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20 rounded-xl px-4 py-2.5 text-xs text-slate-900 outline-none transition-all"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    الاسم باللغة الإنجليزية *
                  </label>
                  <input
                    type="text"
                    required
                    value={nameEn}
                    onChange={(e) => setNameEn(e.target.value)}
                    placeholder="Prof. Dr. Ahmet Ozkara"
                    className="w-full bg-slate-50/70 border border-slate-200 focus:bg-white focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20 rounded-xl px-4 py-2.5 text-xs text-slate-900 outline-none dir-ltr transition-all"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    اللقب والتخصص الدقيق (عربي)
                  </label>
                  <input
                    type="text"
                    value={titleAr}
                    onChange={(e) => setTitleAr(e.target.value)}
                    className="w-full bg-slate-50/70 border border-slate-200 focus:bg-white focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20 rounded-xl px-4 py-2.5 text-xs text-slate-900 outline-none transition-all"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    اللقب والتخصص الدقيق (إنجليزي)
                  </label>
                  <input
                    type="text"
                    value={titleEn}
                    onChange={(e) => setTitleEn(e.target.value)}
                    className="w-full bg-slate-50/70 border border-slate-200 focus:bg-white focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20 rounded-xl px-4 py-2.5 text-xs text-slate-900 outline-none dir-ltr transition-all"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    التخصص الطبي المرتبط
                  </label>
                  <select
                    value={specialtySlug}
                    onChange={(e) => setSpecialtySlug(e.target.value)}
                    className="w-full bg-slate-50/70 border border-slate-200 focus:bg-white focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20 rounded-xl px-4 py-2.5 text-xs text-slate-900 outline-none transition-all"
                  >
                    {treatments.map((t) => (
                      <option key={t.slug} value={t.slug}>
                        {t.title.ar} ({t.title.en})
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    المستشفى الشريك
                  </label>
                  <input
                    type="text"
                    value={hospitalAr}
                    onChange={(e) => setHospitalAr(e.target.value)}
                    className="w-full bg-slate-50/70 border border-slate-200 focus:bg-white focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20 rounded-xl px-4 py-2.5 text-xs text-slate-900 outline-none transition-all"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    سنوات الخبرة
                  </label>
                  <input
                    type="number"
                    value={experienceYears}
                    onChange={(e) => setExperienceYears(Number(e.target.value))}
                    className="w-full bg-slate-50/70 border border-slate-200 focus:bg-white focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20 rounded-xl px-4 py-2 text-xs text-slate-900 outline-none transition-all"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">التقييم</label>
                  <input
                    type="number"
                    step="0.1"
                    min="1"
                    max="5"
                    value={rating}
                    onChange={(e) => setRating(Number(e.target.value))}
                    className="w-full bg-slate-50/70 border border-slate-200 focus:bg-white focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20 rounded-xl px-4 py-2 text-xs text-slate-900 outline-none transition-all"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    عدد التقييمات
                  </label>
                  <input
                    type="number"
                    value={reviewCount}
                    onChange={(e) => setReviewCount(Number(e.target.value))}
                    className="w-full bg-slate-50/70 border border-slate-200 focus:bg-white focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20 rounded-xl px-4 py-2 text-xs text-slate-900 outline-none transition-all"
                  />
                </div>
              </div>

              <ImageUploadField
                label="صورة الطبيب الشخصية (Photo) *"
                value={imageUrl}
                onChange={setImageUrl}
                folder="doctors"
                aspectRatio="portrait"
                helperText="يمكنك سحب صورة من جهازك، أو اختيارها مباشرة، أو لصق رابط مباشر"
              />

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  السيرة الطبية والمهنية (بالعربية)
                </label>
                <textarea
                  rows={3}
                  value={bioAr}
                  onChange={(e) => setBioAr(e.target.value)}
                  className="w-full bg-slate-50/70 border border-slate-200 focus:bg-white focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20 rounded-xl px-4 py-2 text-xs text-slate-900 leading-relaxed outline-none transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  مجالات التخصص الدقيق (مفصولة بفاصلة)
                </label>
                <input
                  type="text"
                  value={expertiseRaw}
                  onChange={(e) => setExpertiseRaw(e.target.value)}
                  className="w-full bg-slate-50/70 border border-slate-200 focus:bg-white focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20 rounded-xl px-4 py-2 text-xs text-slate-900 outline-none transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  أبرز العمليات الجراحية (مفصولة بفاصلة)
                </label>
                <input
                  type="text"
                  value={proceduresRaw}
                  onChange={(e) => setProceduresRaw(e.target.value)}
                  className="w-full bg-slate-50/70 border border-slate-200 focus:bg-white focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20 rounded-xl px-4 py-2 text-xs text-slate-900 outline-none transition-all"
                />
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-colors cursor-pointer"
                >
                  إلغاء / Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-700 text-white text-xs font-bold shadow-sm shadow-sky-600/20 transition-all cursor-pointer"
                >
                  {editingDoctor ? 'حفظ التعديلات' : 'إضافة الطبيب'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
