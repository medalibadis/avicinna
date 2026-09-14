'use client';

import React, { useState } from 'react';
import { useData } from '@/context/DataContext';
import { PatientStory } from '@/data/stories';
import {
  HeartHandshake,
  Plus,
  Edit2,
  Trash2,
  Star,
  MapPin,
  Search,
  X,
} from 'lucide-react';
import { ImageUploadField } from '@/components/admin/ImageUploadField';
import { CustomSelect } from '@/components/admin/CustomSelect';

export default function AdminStoriesPage() {
  const { stories, treatments, addStory, updateStory, deleteStory } = useData();

  const [searchQuery, setSearchQuery] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingStory, setEditingStory] = useState<PatientStory | null>(null);

  // Form state
  const [patientName, setPatientName] = useState('');
  const [countryAr, setCountryAr] = useState('');
  const [countryEn, setCountryEn] = useState('');
  const [treatmentSlug, setTreatmentSlug] = useState('cardiac-surgery');
  const [durationAr, setDurationAr] = useState('7 أيام في إسطنبول');
  const [doctorNameAr, setDoctorNameAr] = useState('أ. د. أحمد أوزكارا');
  const [hospitalAr, setHospitalAr] = useState('مستشفى أجيبادم إسطنبول');
  const [titleAr, setTitleAr] = useState('');
  const [shortStoryAr, setShortStoryAr] = useState('');
  const [fullExperienceRaw, setFullExperienceRaw] = useState('');
  const [imageUrl, setImageUrl] = useState(
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=800&auto=format&fit=crop'
  );
  const [rating, setRating] = useState(5);

  const openAddModal = () => {
    setEditingStory(null);
    setPatientName('');
    setCountryAr('المملكة العربية السعودية');
    setCountryEn('Saudi Arabia');
    setTreatmentSlug('cardiac-surgery');
    setDurationAr('8 أيام في إسطنبول');
    setDoctorNameAr('أ. د. أحمد أوزكارا');
    setHospitalAr('مستشفى أجيبادم إسطنبول ومجموعة أفيسينا');
    setTitleAr('تجربة علاجية ناجحة واستعادة كاملة للصحة في إسطنبول');
    setShortStoryAr('تجربة رائعة مع فريق أفيسينا، تم تنظيم كافة تفاصيل الرحلة بدقة متناهية.');
    setFullExperienceRaw(
      'بدأت رحلتي بالتواصل مع منصة أفيسينا وإرسال التقارير الطبية.\nتم استقبالي في مطار إسطنبول بسيارة VIP ونقلي إلى الفندق.\nأجريت الفحوصات والعملية بنجاح تام وبمرافقة مترجم طبي معتمد.\nأشكر الفريق الطبي على الرعاية الفائقة والاهتمام الإنساني.'
    );
    setImageUrl('https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=800&auto=format&fit=crop');
    setRating(5);
    setModalOpen(true);
  };

  const openEditModal = (story: PatientStory) => {
    setEditingStory(story);
    setPatientName(story.patientName);
    setCountryAr(story.country.ar);
    setCountryEn(story.country.en);
    setTreatmentSlug(story.treatmentSlug);
    setDurationAr(story.duration.ar);
    setDoctorNameAr(story.doctorName.ar);
    setHospitalAr(story.hospital.ar);
    setTitleAr(story.title.ar);
    setShortStoryAr(story.shortStory.ar);
    setFullExperienceRaw(story.fullExperience.ar.join('\n'));
    setImageUrl(story.image);
    setRating(story.rating);
    setModalOpen(true);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!patientName || !titleAr) return;

    const matchedTreatment = treatments.find((t) => t.slug === treatmentSlug);
    const treatmentTitle = matchedTreatment?.title.ar || 'علاج جراحي تخصصي';

    const paragraphs = fullExperienceRaw
      .split('\n')
      .map((p) => p.trim())
      .filter(Boolean);

    const payload: PatientStory = {
      id: editingStory ? editingStory.id : `story-${Date.now()}`,
      slug: editingStory
        ? editingStory.slug
        : `${patientName.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-${Date.now()}`,
      patientName,
      country: {
        ar: countryAr,
        en: countryEn,
        fr: countryEn,
      },
      treatment: {
        ar: treatmentTitle,
        en: matchedTreatment?.title.en || treatmentTitle,
        fr: matchedTreatment?.title.fr || treatmentTitle,
      },
      treatmentSlug,
      duration: {
        ar: durationAr,
        en: durationAr,
        fr: durationAr,
      },
      doctorName: {
        ar: doctorNameAr,
        en: doctorNameAr,
        fr: doctorNameAr,
      },
      hospital: {
        ar: hospitalAr,
        en: hospitalAr,
        fr: hospitalAr,
      },
      title: {
        ar: titleAr,
        en: titleAr,
        fr: titleAr,
      },
      shortStory: {
        ar: shortStoryAr,
        en: shortStoryAr,
        fr: shortStoryAr,
      },
      fullExperience: {
        ar: paragraphs,
        en: paragraphs,
        fr: paragraphs,
      },
      timeline: editingStory ? editingStory.timeline : [
        { step: { ar: 'اليوم 1', en: 'Day 1', fr: 'Jour 1' }, detail: { ar: 'الوصول لمطار إسطنبول والاستقبال VIP', en: 'VIP airport arrival', fr: 'Arrivée VIP' } },
        { step: { ar: 'اليوم 2', en: 'Day 2', fr: 'Jour 2' }, detail: { ar: 'الفحوصات الطبية ولقاء الجراح', en: 'Clinical diagnostics and consultation', fr: 'Examens cliniques' } },
        { step: { ar: 'اليوم 3', en: 'Day 3', fr: 'Jour 3' }, detail: { ar: 'إجراء العملية بنجاح تام', en: 'Successful surgery', fr: 'Intervention réussie' } },
        { step: { ar: 'اليوم 7', en: 'Day 7', fr: 'Jour 7' }, detail: { ar: 'المتابعة الطبية والعودة للوطن', en: 'Discharge and return flight', fr: 'Retour au pays' } },
      ],
      image: imageUrl,
      hasVideo: editingStory ? editingStory.hasVideo : false,
      rating: Number(rating),
    };

    if (editingStory) {
      updateStory(payload);
    } else {
      addStory(payload);
    }

    setModalOpen(false);
  };

  const handleDelete = (s: PatientStory) => {
    if (window.confirm(`هل أنت متأكد من رغبتك في حذف قصة المريض: ${s.patientName}؟`)) {
      deleteStory(s.id);
    }
  };

  const filteredStories = stories.filter((s) => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return true;
    return (
      s.patientName.toLowerCase().includes(q) ||
      s.title.ar.toLowerCase().includes(q) ||
      s.country.ar.toLowerCase().includes(q) ||
      s.treatment.ar.toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-50 border border-purple-200 text-purple-700 text-xs font-bold mb-1">
            <HeartHandshake className="w-3.5 h-3.5 text-purple-600" />
            <span>قصص وتجارب المرضى</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900">
            إدارة تجارب المرضى / Patient Stories Management ({stories.length})
          </h1>
          <p className="text-slate-500 text-xs mt-1">
            نشر قصص الشفاء، صور وتفاصيل إقامة المرضى في إسطنبول، وتقييماتهم للخدمة.
          </p>
        </div>

        <button
          type="button"
          onClick={openAddModal}
          className="inline-flex items-center gap-2 bg-sky-600 hover:bg-sky-700 active:scale-98 text-white text-xs sm:text-sm font-bold px-5 py-2.5 rounded-xl shadow-sm shadow-sky-600/20 transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>إضافة قصة مريض / Add Story</span>
        </button>
      </div>

      {/* Search Input */}
      <div className="relative">
        <Search className="w-5 h-5 text-slate-400 absolute top-1/2 -translate-y-1/2 right-4 rtl:right-4 ltr:left-4 ltr:right-auto pointer-events-none" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="ابحث باسم المريض، البلد، أو العلاج..."
          className="w-full bg-white border border-slate-200/80 shadow-xs rounded-2xl py-3 px-12 text-sm text-slate-900 focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 outline-none placeholder:text-slate-400 transition-all"
        />
      </div>

      {/* Stories Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredStories.map((s) => (
          <div
            key={s.id}
            className="bg-white border border-slate-200/80 hover:border-slate-300 hover:shadow-md rounded-3xl p-5 flex flex-col justify-between space-y-4 shadow-xs group transition-all duration-200"
          >
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <img
                  src={s.image}
                  alt={s.patientName}
                  className="w-16 h-16 rounded-2xl object-cover border border-slate-200 shadow-xs flex-shrink-0"
                />
                <div className="min-w-0 flex-1">
                  <span className="text-[10px] font-bold text-sky-700 uppercase tracking-wider bg-sky-50 border border-sky-200 px-2 py-0.5 rounded-md inline-block">
                    {s.treatment.ar}
                  </span>
                  <h3 className="text-base font-bold text-slate-900 mt-1 truncate group-hover:text-sky-600 transition-colors">
                    {s.patientName}
                  </h3>
                  <div className="text-[11px] text-slate-500 flex items-center gap-1 mt-0.5">
                    <MapPin className="w-3 h-3 text-sky-600" />
                    <span>{s.country.ar}</span>
                  </div>
                </div>
              </div>

              <h4 className="text-xs font-bold text-slate-800 line-clamp-2 leading-snug">
                {s.title.ar}
              </h4>

              <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                &ldquo;{s.shortStory.ar}&rdquo;
              </p>

              <div className="pt-2 border-t border-slate-100 text-[11px] text-slate-500 flex items-center justify-between">
                <span className="bg-slate-50 px-2 py-0.5 rounded-md border border-slate-100 font-medium">{s.duration.ar}</span>
                <div className="flex items-center gap-0.5 text-amber-500">
                  {[...Array(s.rating)].map((_, i) => (
                    <Star key={i} className="w-3 h-3 fill-current" />
                  ))}
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="pt-3 border-t border-slate-100 flex items-center gap-2">
              <button
                type="button"
                onClick={() => openEditModal(s)}
                className="flex-1 py-2 px-3 rounded-xl bg-slate-50 hover:bg-sky-50 text-slate-700 hover:text-sky-700 border border-slate-200 text-xs font-bold transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Edit2 className="w-3.5 h-3.5 text-sky-600" />
                <span>تعديل / Edit</span>
              </button>
              <button
                type="button"
                onClick={() => handleDelete(s)}
                className="p-2 rounded-xl bg-slate-50 hover:bg-rose-50 text-slate-600 hover:text-rose-600 border border-slate-200 transition-colors cursor-pointer"
                title="حذف القصة"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal Add / Edit Story */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-md animate-in fade-in duration-200">
          <div className="bg-white border border-slate-200/90 rounded-[32px] p-6 sm:p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto space-y-5 shadow-2xl shadow-slate-900/20 text-slate-900 ring-1 ring-black/5 animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-2xl bg-sky-50 text-sky-600 flex items-center justify-center ring-4 ring-sky-500/10 shadow-xs">
                  <HeartHandshake className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-base sm:text-lg font-black text-slate-900">
                    {editingStory ? 'تعديل قصة المريض' : 'إضافة تجربة مريض جديدة'}
                  </h2>
                  <p className="text-xs text-slate-400">
                    {editingStory ? 'تحديث تفاصيل الرحلة العلاجية وتقييم المريض' : 'أدخل قصة المريض لتظهر في قسم قصص النجاح الموثقة'}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                className="w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleFormSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    اسم المريض *
                  </label>
                  <input
                    type="text"
                    required
                    value={patientName}
                    onChange={(e) => setPatientName(e.target.value)}
                    placeholder="محمد السعيد"
                    className="w-full bg-slate-50/70 border border-slate-200 focus:bg-white focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20 rounded-xl px-4 py-2 text-xs text-slate-900 outline-none transition-all"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    الدولة / المدينة *
                  </label>
                  <input
                    type="text"
                    required
                    value={countryAr}
                    onChange={(e) => setCountryAr(e.target.value)}
                    placeholder="المملكة العربية السعودية (الرياض)"
                    className="w-full bg-slate-50/70 border border-slate-200 focus:bg-white focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20 rounded-xl px-4 py-2 text-xs text-slate-900 outline-none transition-all"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <CustomSelect
                    label="التخصص الطبي / Treatment *"
                    value={treatmentSlug}
                    onChange={setTreatmentSlug}
                    options={treatments.map((t) => ({
                      value: t.slug,
                      label: t.title.ar,
                      subLabel: t.title.en,
                    }))}
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    مدة الإقامة في إسطنبول
                  </label>
                  <input
                    type="text"
                    value={durationAr}
                    onChange={(e) => setDurationAr(e.target.value)}
                    className="w-full bg-slate-50/70 border border-slate-200 focus:bg-white focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20 rounded-xl px-4 py-2 text-xs text-slate-900 outline-none transition-all"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    الطبيب المعالج
                  </label>
                  <input
                    type="text"
                    value={doctorNameAr}
                    onChange={(e) => setDoctorNameAr(e.target.value)}
                    className="w-full bg-slate-50/70 border border-slate-200 focus:bg-white focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20 rounded-xl px-4 py-2 text-xs text-slate-900 outline-none transition-all"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    المستشفى
                  </label>
                  <input
                    type="text"
                    value={hospitalAr}
                    onChange={(e) => setHospitalAr(e.target.value)}
                    className="w-full bg-slate-50/70 border border-slate-200 focus:bg-white focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20 rounded-xl px-4 py-2 text-xs text-slate-900 outline-none transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  عنوان القصة الرئيسي *
                </label>
                <input
                  type="text"
                  required
                  value={titleAr}
                  onChange={(e) => setTitleAr(e.target.value)}
                  className="w-full bg-slate-50/70 border border-slate-200 focus:bg-white focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20 rounded-xl px-4 py-2 text-xs text-slate-900 outline-none transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  اقتباس أو ملخص القصة
                </label>
                <textarea
                  rows={2}
                  value={shortStoryAr}
                  onChange={(e) => setShortStoryAr(e.target.value)}
                  className="w-full bg-slate-50/70 border border-slate-200 focus:bg-white focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20 rounded-xl px-4 py-2 text-xs text-slate-900 outline-none transition-all"
                />
              </div>

              <ImageUploadField
                label="صورة المريض أو نتيجة العلاج (Photo) *"
                value={imageUrl}
                onChange={setImageUrl}
                folder="stories"
                aspectRatio="square"
                helperText="يمكنك سحب صورة من جهازك، أو اختيارها مباشرة، أو لصق رابط مباشر"
              />

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  القصة الكاملة (فقرة في كل سطر)
                </label>
                <textarea
                  rows={4}
                  value={fullExperienceRaw}
                  onChange={(e) => setFullExperienceRaw(e.target.value)}
                  className="w-full bg-slate-50/70 border border-slate-200 focus:bg-white focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20 rounded-xl px-4 py-2 text-xs text-slate-900 leading-relaxed outline-none transition-all"
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
                  {editingStory ? 'حفظ التعديلات' : 'إضافة القصة'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
