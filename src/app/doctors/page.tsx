'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { useLanguage } from '@/context/LanguageContext';
import { useData } from '@/context/DataContext';
import {
  Search,
  Star,
  Building2,
  Calendar,
  Languages,
  Award,
  ChevronLeft,
  ChevronRight,
  Filter,
  Stethoscope,
  Sparkles,
} from 'lucide-react';

export default function DoctorsPage() {
  const { language, direction, t } = useLanguage();
  const { doctors, treatments } = useData();
  const ArrowIcon = direction === 'rtl' ? ChevronLeft : ChevronRight;

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSpecialty, setSelectedSpecialty] = useState('all');

  const content = {
    ar: {
      badge: 'الكادر الطبي الاستشاري',
      title: 'نخبة أطباء وجراحي تركيا المعتمدين',
      subtitle:
        'تعرف على الأطباء والبروفيسورات الأكثر خبرة في إسطنبول، الحاصلين على أعلى الاعتمادات الطبية الأوروبية والأمريكية وسجل حافل بآلاف العمليات الجراحية الناجحة.',
      searchPlaceholder: 'ابحث باسم الطبيب، التخصص، أو المستشفى...',
      allSpecialties: 'جميع التخصصات',
      experienceYears: 'سنة خبرة',
      viewProfile: 'عرض الملف الطبي الكامل',
      bookAppointment: 'حجز استشارة مجانية',
      noResults: 'لم يتم العثور على أطباء يطابقون بحثك. يرجى تجربة كلمات بحث أخرى.',
      showing: 'عرض',
      of: 'من أصل',
      doctorsCount: 'طبيباً استشارياً',
    },
    en: {
      badge: 'Consultant Medical Faculty',
      title: 'Istanbul’s Elite Board-Certified Surgeons',
      subtitle:
        'Explore profiles of renowned Turkish medical professors holding distinguished European and US fellowships with thousands of successful complex surgeries.',
      searchPlaceholder: 'Search by doctor name, specialty, or hospital...',
      allSpecialties: 'All Specialties',
      experienceYears: 'Years Exp.',
      viewProfile: 'View Full Medical Profile',
      bookAppointment: 'Book Free Consultation',
      noResults: 'No physicians matched your search criteria. Please try another term.',
      showing: 'Showing',
      of: 'of',
      doctorsCount: 'specialist physicians',
    },
    fr: {
      badge: 'Corps Médical Spécialisé',
      title: 'L’Élite des Chirurgiens et Professeurs en Turquie',
      subtitle:
        'Découvrez nos praticiens chevronnés diplômés des plus grandes facultés de médecine, cumulant des milliers d’interventions chirurgicales réussies à Istanbul.',
      searchPlaceholder: 'Rechercher par nom, spécialité ou hôpital...',
      allSpecialties: 'Toutes les Spécialités',
      experienceYears: 'ans d’expérience',
      viewProfile: 'Voir le Profil Médical',
      bookAppointment: 'Prendre Rendez-vous',
      noResults: 'Aucun médecin ne correspond à votre recherche. Essayez d’autres mots-clés.',
      showing: 'Affichage de',
      of: 'sur',
      doctorsCount: 'médecins spécialistes',
    },
  }[language];

  // Filtered doctors
  const filteredDoctors = useMemo(() => {
    return doctors.filter((doc) => {
      const matchesSpecialty =
        selectedSpecialty === 'all' || doc.specialtySlug === selectedSpecialty;

      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        doc.name[language].toLowerCase().includes(q) ||
        doc.title[language].toLowerCase().includes(q) ||
        doc.specialtyName[language].toLowerCase().includes(q) ||
        doc.hospital[language].toLowerCase().includes(q);

      return matchesSpecialty && matchesSearch;
    });
  }, [doctors, searchQuery, selectedSpecialty, language]);

  return (
    <div className="pt-24 pb-16 bg-slate-50 min-h-screen">
      {/* Hero Header */}
      <div className="bg-gradient-to-b from-slate-900 to-[#0A192F] text-white py-16 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#38bdf8_1px,transparent_1px)] [background-size:16px_16px]" />
        <div className="max-w-7xl mx-auto relative z-10 text-center max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-500/20 text-sky-300 text-xs font-semibold mb-4 border border-sky-500/30">
            <Sparkles className="w-3.5 h-3.5" />
            <span>{content.badge}</span>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight leading-tight">
            {content.title}
          </h1>
          <p className="mt-4 text-base sm:text-lg text-slate-300 leading-relaxed">
            {content.subtitle}
          </p>
        </div>
      </div>

      {/* Filter and Search Bar Ribbon */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-20">
        <div className="bg-white rounded-3xl shadow-xl border border-slate-100 p-4 sm:p-6 space-y-4">
          {/* Search Input */}
          <div className="relative">
            <Search className="w-5 h-5 text-slate-400 absolute top-1/2 -translate-y-1/2 right-4 rtl:right-4 ltr:left-4 ltr:right-auto pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={content.searchPlaceholder}
              className="w-full py-3.5 px-12 rounded-2xl bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:bg-white text-sm transition-all"
            />
          </div>

          {/* Specialty Filters */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-thin">
            <button
              type="button"
              onClick={() => setSelectedSpecialty('all')}
              className={`px-4 py-2 rounded-full text-xs sm:text-sm font-semibold whitespace-nowrap transition-all cursor-pointer ${
                selectedSpecialty === 'all'
                  ? 'bg-sky-500 text-white shadow-sm'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              {content.allSpecialties}
            </button>
            {treatments.map((item) => (
              <button
                key={item.slug}
                type="button"
                onClick={() => setSelectedSpecialty(item.slug)}
                className={`px-4 py-2 rounded-full text-xs sm:text-sm font-semibold whitespace-nowrap transition-all cursor-pointer ${
                  selectedSpecialty === item.slug
                    ? 'bg-sky-500 text-white shadow-sm'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                {item.title[language]}
              </button>
            ))}
          </div>

          <div className="text-xs text-slate-500 font-medium pt-1">
            {content.showing} <span className="font-bold text-slate-800">{filteredDoctors.length}</span> {content.of}{' '}
            <span className="font-bold text-slate-800">{doctors.length}</span> {content.doctorsCount}
          </div>
        </div>
      </div>

      {/* Doctors Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12">
        {filteredDoctors.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-3xl border border-slate-200">
            <Stethoscope className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <p className="text-slate-600 text-base">{content.noResults}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredDoctors.map((doctor) => (
              <div
                key={doctor.id}
                className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden hover:shadow-xl hover:border-sky-200 transition-all duration-300 flex flex-col group"
              >
                {/* Image & Badges */}
                <div className="relative h-64 overflow-hidden bg-slate-100">
                  <img
                    src={doctor.image}
                    alt={doctor.name[language]}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent" />

                  {/* Experience Badge */}
                  <div className="absolute top-4 left-4 rtl:left-auto rtl:right-4 bg-white/95 backdrop-blur-sm text-slate-900 px-3 py-1 rounded-full text-xs font-bold shadow-sm flex items-center gap-1.5">
                    <Award className="w-3.5 h-3.5 text-sky-600" />
                    <span>
                      {doctor.experienceYears} {content.experienceYears}
                    </span>
                  </div>

                  {/* Rating Badge */}
                  <div className="absolute bottom-4 left-4 rtl:left-auto rtl:right-4 bg-slate-900/80 backdrop-blur-sm text-white px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                    <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                    <span>{doctor.rating}</span>
                    <span className="text-slate-300">({doctor.reviewCount})</span>
                  </div>
                </div>

                {/* Body Content */}
                <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                  <div>
                    <div className="text-xs font-bold text-sky-600 uppercase tracking-wider mb-1">
                      {doctor.specialtyName[language]}
                    </div>
                    <h3 className="text-xl font-bold text-slate-900 group-hover:text-sky-600 transition-colors">
                      {doctor.name[language]}
                    </h3>
                    <p className="text-xs text-slate-500 mt-1 line-clamp-2">
                      {doctor.title[language]}
                    </p>

                    <div className="mt-3 flex items-center gap-1.5 text-xs text-slate-600">
                      <Building2 className="w-4 h-4 text-sky-500 flex-shrink-0" />
                      <span className="truncate">{doctor.hospital[language]}</span>
                    </div>

                    {/* Expertise Tags */}
                    <div className="mt-3 flex flex-wrap gap-1.5">
                      {doctor.areasOfExpertise[language].slice(0, 2).map((area, idx) => (
                        <span
                          key={idx}
                          className="bg-slate-50 border border-slate-100 text-slate-600 text-[11px] px-2 py-0.5 rounded-md"
                        >
                          {area}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="pt-4 border-t border-slate-100 flex items-center gap-3">
                    <Link
                      href={`/doctors/${doctor.slug}`}
                      className="flex-1 py-2.5 px-4 rounded-xl bg-sky-50 hover:bg-sky-500 text-sky-700 hover:text-white font-semibold text-xs transition-colors text-center flex items-center justify-center gap-1"
                    >
                      <span>{content.viewProfile}</span>
                      <ArrowIcon className="w-3.5 h-3.5" />
                    </Link>
                    <Link
                      href={`/contact?doctor=${doctor.slug}`}
                      className="py-2.5 px-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold transition-colors flex items-center justify-center"
                      title={content.bookAppointment}
                    >
                      <Calendar className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
