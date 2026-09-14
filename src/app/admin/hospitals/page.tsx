'use client';

import React, { useState } from 'react';
import { useData } from '@/context/DataContext';
import { HospitalPartner } from '@/data/hospitals';
import {
  Building2,
  Plus,
  Edit2,
  Trash2,
  CheckCircle2,
  X,
  Search,
  MapPin,
  ShieldCheck,
  Star,
} from 'lucide-react';

export default function AdminHospitalsPage() {
  const { hospitals, addHospital, updateHospital, deleteHospital } = useData();

  const [searchQuery, setSearchQuery] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingHospital, setEditingHospital] = useState<HospitalPartner | null>(null);
  const [notification, setNotification] = useState<string | null>(null);

  // Form state
  const [nameAr, setNameAr] = useState('');
  const [nameEn, setNameEn] = useState('');
  const [nameFr, setNameFr] = useState('');
  const [typeAr, setTypeAr] = useState('');
  const [typeEn, setTypeEn] = useState('');
  const [typeFr, setTypeFr] = useState('');
  const [cityAr, setCityAr] = useState('');
  const [cityEn, setCityEn] = useState('');
  const [cityFr, setCityFr] = useState('');
  const [accreditation, setAccreditation] = useState('JCI Accredited & ISO 9001');
  const [specialtiesCount, setSpecialtiesCount] = useState(30);
  const [image, setImage] = useState('https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?q=80&w=1200&auto=format&fit=crop');
  const [featured, setFeatured] = useState(true);
  const [descAr, setDescAr] = useState('');
  const [descEn, setDescEn] = useState('');
  const [descFr, setDescFr] = useState('');

  const showToast = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3000);
  };

  const openAddModal = () => {
    setEditingHospital(null);
    setNameAr('');
    setNameEn('');
    setNameFr('');
    setTypeAr('مستشفى تخصصي وجراحي دولي');
    setTypeEn('International Academic & Surgical Center');
    setTypeFr('Centre Hospitalier Universitaire International');
    setCityAr('إسطنبول');
    setCityEn('Istanbul');
    setCityFr('Istanbul');
    setAccreditation('JCI Accredited & ISO 9001');
    setSpecialtiesCount(32);
    setImage('https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?q=80&w=1200&auto=format&fit=crop');
    setFeatured(true);
    setDescAr('مستشفى مجهز بأحدث تقنيات الروبوت الجراحي والمختبرات المتقدمة.');
    setDescEn('Equipped with state-of-the-art robotic surgical suites and specialized care units.');
    setDescFr('Doté de blocs opératoires robotisés à la pointe de la technologie.');
    setModalOpen(true);
  };

  const openEditModal = (hosp: HospitalPartner) => {
    setEditingHospital(hosp);
    setNameAr(hosp.name.ar);
    setNameEn(hosp.name.en);
    setNameFr(hosp.name.fr || hosp.name.en);
    setTypeAr(hosp.type.ar);
    setTypeEn(hosp.type.en);
    setTypeFr(hosp.type.fr || hosp.type.en);
    setCityAr(hosp.city.ar);
    setCityEn(hosp.city.en);
    setCityFr(hosp.city.fr || hosp.city.en);
    setAccreditation(hosp.accreditation);
    setSpecialtiesCount(hosp.specialtiesCount);
    setImage(hosp.image);
    setFeatured(hosp.featured);
    setDescAr(hosp.description.ar);
    setDescEn(hosp.description.en);
    setDescFr(hosp.description.fr || hosp.description.en);
    setModalOpen(true);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nameAr || !nameEn) return;

    const payload: HospitalPartner = {
      id: editingHospital ? editingHospital.id : `hosp-${Date.now()}`,
      name: {
        ar: nameAr,
        en: nameEn,
        fr: nameFr || nameEn,
      },
      type: {
        ar: typeAr,
        en: typeEn,
        fr: typeFr || typeEn,
      },
      city: {
        ar: cityAr,
        en: cityEn,
        fr: cityFr || cityEn,
      },
      accreditation,
      specialtiesCount: Number(specialtiesCount) || 10,
      image,
      featured,
      description: {
        ar: descAr,
        en: descEn,
        fr: descFr || descEn,
      },
    };

    if (editingHospital) {
      updateHospital(payload);
      showToast('تم تحديث بيانات المستشفى بنجاح!');
    } else {
      addHospital(payload);
      showToast('تمت إضافة المستشفى الشريك الجديد بنجاح!');
    }

    setModalOpen(false);
  };

  const handleDelete = (id: string, name: string) => {
    if (window.confirm(`هل أنت متأكد من حذف المستشفى: "${name}"؟`)) {
      deleteHospital(id);
      showToast('تم حذف المستشفى بنجاح.');
    }
  };

  const filteredHospitals = hospitals.filter((h) => {
    const q = searchQuery.toLowerCase();
    return (
      h.name.ar.toLowerCase().includes(q) ||
      h.name.en.toLowerCase().includes(q) ||
      h.city.ar.toLowerCase().includes(q) ||
      h.city.en.toLowerCase().includes(q) ||
      h.accreditation.toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-50 border border-cyan-200 text-cyan-700 text-xs font-bold mb-1">
            <Building2 className="w-3.5 h-3.5 text-cyan-600" />
            <span>شبكة المستشفيات والمراكز الجراحية</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900">
            المستشفيات الشريكة / Partner Hospitals ({hospitals.length})
          </h1>
          <p className="text-slate-500 text-xs mt-1">
            إدارة شبكة المستشفيات والمجمعات الطبية المعتمدة المعروضة في الصفحة الرئيسية وقسم الشركاء.
          </p>
        </div>

        <button
          type="button"
          onClick={openAddModal}
          className="inline-flex items-center gap-2 bg-sky-600 hover:bg-sky-700 active:scale-98 text-white text-sm font-bold px-5 py-2.5 rounded-xl shadow-sm shadow-sky-600/20 transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>إضافة مستشفى جديد / Add Hospital</span>
        </button>
      </div>

      {notification && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs sm:text-sm font-bold flex items-center gap-2 animate-in fade-in duration-200 shadow-xs">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
          <span>{notification}</span>
        </div>
      )}

      {/* Search Filter */}
      <div className="flex items-center gap-3 bg-white border border-slate-200/80 rounded-2xl p-3 shadow-xs">
        <Search className="w-5 h-5 text-slate-400" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="ابحث عن مستشفى بالاسم، المدينة، أو الاعتماد... / Search by name, city, accreditation"
          className="bg-transparent text-slate-900 placeholder-slate-400 text-sm focus:outline-none w-full"
        />
      </div>

      {/* Hospitals Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredHospitals.map((hosp) => (
          <div
            key={hosp.id}
            className="bg-white border border-slate-200/80 rounded-3xl overflow-hidden hover:border-slate-300 hover:shadow-md transition-all duration-200 flex flex-col justify-between group shadow-xs"
          >
            {/* Header Image */}
            <div className="h-48 relative overflow-hidden bg-slate-100">
              <img
                src={hosp.image}
                alt={hosp.name.en}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
              
              {/* Badges */}
              <div className="absolute top-3 right-3 flex items-center gap-2">
                {hosp.featured && (
                  <span className="bg-amber-400 text-slate-950 text-[11px] font-black px-2.5 py-1 rounded-full shadow-sm flex items-center gap-1">
                    <Star className="w-3 h-3 fill-slate-950" />
                    <span>مميز</span>
                  </span>
                )}
                <span className="bg-sky-600/90 backdrop-blur-xs text-white text-[11px] font-bold px-2.5 py-1 rounded-full shadow-sm">
                  {hosp.specialtiesCount}+ تخصص
                </span>
              </div>

              <div className="absolute bottom-3 left-3 right-3 text-white">
                <div className="text-xs font-bold text-sky-200 flex items-center gap-1 drop-shadow-sm">
                  <MapPin className="w-3.5 h-3.5 text-sky-300" />
                  <span>{hosp.city.ar} ({hosp.city.en})</span>
                </div>
              </div>
            </div>

            {/* Body */}
            <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
              <div className="space-y-2">
                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-bold">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  <span>{hosp.accreditation}</span>
                </div>
                <h3 className="text-base font-bold text-slate-900 leading-snug group-hover:text-sky-600 transition-colors">
                  {hosp.name.ar}
                </h3>
                <div className="text-xs text-slate-500 font-medium">
                  {hosp.name.en}
                </div>
                <p className="text-xs text-slate-600 line-clamp-2 mt-2 leading-relaxed">
                  {hosp.description.ar}
                </p>
              </div>

              {/* Action Buttons */}
              <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                <div className="text-[11px] text-slate-400 font-mono">
                  ID: {hosp.id}
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => openEditModal(hosp)}
                    className="p-2 rounded-xl bg-slate-50 hover:bg-sky-50 text-slate-600 hover:text-sky-600 border border-slate-200 transition-colors cursor-pointer"
                    title="تعديل / Edit"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(hosp.id, hosp.name.ar)}
                    className="p-2 rounded-xl bg-slate-50 hover:bg-rose-50 text-slate-600 hover:text-rose-600 border border-slate-200 transition-colors cursor-pointer"
                    title="حذف / Delete"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredHospitals.length === 0 && (
        <div className="p-12 text-center bg-white border border-slate-200/80 rounded-3xl shadow-xs">
          <Building2 className="w-12 h-12 text-slate-400 mx-auto mb-3" />
          <p className="text-slate-500 text-sm">لم يتم العثور على مستشفيات مطابقة للبحث.</p>
        </div>
      )}

      {/* Modal: Add/Edit Hospital */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto animate-in fade-in duration-200">
          <div className="bg-white border border-slate-200 rounded-3xl max-w-2xl w-full p-6 sm:p-8 relative max-h-[90vh] overflow-y-auto shadow-2xl">
            {/* Close Button */}
            <button
              type="button"
              onClick={() => setModalOpen(false)}
              className="absolute top-6 left-6 rtl:left-6 rtl:right-auto ltr:right-6 ltr:left-auto text-slate-400 hover:text-slate-700 p-2 rounded-xl bg-slate-100 hover:bg-slate-200 cursor-pointer transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="mb-6">
              <h2 className="text-xl font-bold text-slate-900">
                {editingHospital ? 'تعديل بيانات المستشفى' : 'إضافة مستشفى شريك جديد'}
              </h2>
              <p className="text-slate-500 text-xs mt-1">
                املأ البيانات باللغتين العربية والإنجليزية لضمان عرض المستشفى بشكل متقن في كافة نسخ الموقع.
              </p>
            </div>

            <form onSubmit={handleFormSubmit} className="space-y-4">
              {/* Names */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    اسم المستشفى (بالعربية) *
                  </label>
                  <input
                    type="text"
                    required
                    value={nameAr}
                    onChange={(e) => setNameAr(e.target.value)}
                    placeholder="مثال: مجموعة مستشفيات أجيبادم"
                    className="w-full bg-slate-50/70 border border-slate-200 focus:bg-white focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20 rounded-xl px-3.5 py-2 text-sm text-slate-900 outline-none transition-all"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Hospital Name (English) *
                  </label>
                  <input
                    type="text"
                    required
                    value={nameEn}
                    onChange={(e) => setNameEn(e.target.value)}
                    placeholder="e.g. Acibadem Healthcare Group"
                    className="w-full bg-slate-50/70 border border-slate-200 focus:bg-white focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20 rounded-xl px-3.5 py-2 text-sm text-slate-900 outline-none dir-ltr transition-all"
                  />
                </div>
              </div>

              {/* Types */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    تصنيف المستشفى (بالعربية)
                  </label>
                  <input
                    type="text"
                    value={typeAr}
                    onChange={(e) => setTypeAr(e.target.value)}
                    placeholder="مثال: مستشفى جامعي وتخصصي دولي"
                    className="w-full bg-slate-50/70 border border-slate-200 focus:bg-white focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20 rounded-xl px-3.5 py-2 text-sm text-slate-900 outline-none transition-all"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Hospital Category (English)
                  </label>
                  <input
                    type="text"
                    value={typeEn}
                    onChange={(e) => setTypeEn(e.target.value)}
                    placeholder="e.g. Academic & Tertiary Surgical Hospital"
                    className="w-full bg-slate-50/70 border border-slate-200 focus:bg-white focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20 rounded-xl px-3.5 py-2 text-sm text-slate-900 outline-none dir-ltr transition-all"
                  />
                </div>
              </div>

              {/* City & Accreditation */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    المدينة (بالعربية)
                  </label>
                  <input
                    type="text"
                    value={cityAr}
                    onChange={(e) => setCityAr(e.target.value)}
                    placeholder="مثال: إسطنبول (مسلك)"
                    className="w-full bg-slate-50/70 border border-slate-200 focus:bg-white focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20 rounded-xl px-3.5 py-2 text-sm text-slate-900 outline-none transition-all"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    City (English)
                  </label>
                  <input
                    type="text"
                    value={cityEn}
                    onChange={(e) => setCityEn(e.target.value)}
                    placeholder="e.g. Istanbul (Maslak)"
                    className="w-full bg-slate-50/70 border border-slate-200 focus:bg-white focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20 rounded-xl px-3.5 py-2 text-sm text-slate-900 outline-none dir-ltr transition-all"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    شهادة الاعتماد الدولية
                  </label>
                  <input
                    type="text"
                    value={accreditation}
                    onChange={(e) => setAccreditation(e.target.value)}
                    placeholder="مثال: JCI Accredited & ISO 9001"
                    className="w-full bg-slate-50/70 border border-slate-200 focus:bg-white focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20 rounded-xl px-3.5 py-2 text-sm text-slate-900 outline-none dir-ltr transition-all"
                  />
                </div>
              </div>

              {/* Specialties count & featured & image */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    عدد التخصصات المتاحة
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="100"
                    value={specialtiesCount}
                    onChange={(e) => setSpecialtiesCount(Number(e.target.value))}
                    className="w-full bg-slate-50/70 border border-slate-200 focus:bg-white focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20 rounded-xl px-3.5 py-2 text-sm text-slate-900 outline-none transition-all"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    رابط صورة الصرح الطبي (Image URL)
                  </label>
                  <input
                    type="url"
                    value={image}
                    onChange={(e) => setImage(e.target.value)}
                    className="w-full bg-slate-50/70 border border-slate-200 focus:bg-white focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20 rounded-xl px-3.5 py-2 text-sm text-slate-900 outline-none dir-ltr transition-all"
                  />
                </div>
              </div>

              {/* Featured toggle */}
              <div className="flex items-center gap-3 p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                <input
                  type="checkbox"
                  id="featured-check"
                  checked={featured}
                  onChange={(e) => setFeatured(e.target.checked)}
                  className="w-4 h-4 accent-sky-600 rounded cursor-pointer"
                />
                <label htmlFor="featured-check" className="text-xs font-bold text-slate-700 cursor-pointer">
                  تمييز المستشفى كشريك استراتيجي رئيسي في الصفحة الرئيسية (Featured Partner)
                </label>
              </div>

              {/* Descriptions */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  نبذة تعريفية عن المستشفى (بالعربية)
                </label>
                <textarea
                  rows={3}
                  value={descAr}
                  onChange={(e) => setDescAr(e.target.value)}
                  placeholder="نبذة عن التجهيزات، الأقسام وغرف العمليات..."
                  className="w-full bg-slate-50/70 border border-slate-200 focus:bg-white focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20 rounded-xl px-3.5 py-2 text-sm text-slate-900 outline-none transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Hospital Overview (English)
                </label>
                <textarea
                  rows={3}
                  value={descEn}
                  onChange={(e) => setDescEn(e.target.value)}
                  placeholder="Overview of hospital facilities, tech and capacities..."
                  className="w-full bg-slate-50/70 border border-slate-200 focus:bg-white focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20 rounded-xl px-3.5 py-2 text-sm text-slate-900 outline-none dir-ltr transition-all"
                />
              </div>

              {/* Submit Buttons */}
              <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-bold cursor-pointer transition-colors"
                >
                  إلغاء / Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-700 text-white text-sm font-bold shadow-sm shadow-sky-600/20 cursor-pointer transition-all"
                >
                  {editingHospital ? 'حفظ التعديلات' : 'إضافة المستشفى'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
