'use client';

import React, { useState, useMemo, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { useLanguage } from '@/context/LanguageContext';
import { useData } from '@/context/DataContext';
import { Doctor } from '@/data/doctors';
import { Treatment } from '@/data/treatments';
import {
  Search,
  Star,
  Building2,
  Calendar,
  Award,
  ChevronLeft,
  ChevronRight,
  Stethoscope,
} from 'lucide-react';

interface DoctorsDirectoryClientProps {
  initialDoctors: Doctor[];
  initialTreatments: Treatment[];
}

function SearchParamsHandler({
  onParamsChange,
}: {
  onParamsChange: (search: string, specialty: string, id: string) => void;
}) {
  const searchParams = useSearchParams();

  useEffect(() => {
    const q = searchParams.get('search') || searchParams.get('q') || '';
    const specialty = searchParams.get('specialty') || 'all';
    const id = searchParams.get('id') || searchParams.get('slug') || '';
    onParamsChange(q, specialty, id);
  }, [searchParams, onParamsChange]);

  return null;
}

export function DoctorsDirectoryClient({
  initialDoctors,
  initialTreatments,
}: DoctorsDirectoryClientProps) {
  const { language, direction } = useLanguage();
  const { doctors: contextDoctors, treatments: contextTreatments } = useData();

  const doctors = contextDoctors?.length ? contextDoctors : initialDoctors;
  const treatments = contextTreatments?.length ? contextTreatments : initialTreatments;

  const ArrowIcon = direction === 'rtl' ? ChevronLeft : ChevronRight;

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSpecialty, setSelectedSpecialty] = useState('all');

  const handleParamsChange = (q: string, specialty: string, id: string) => {
    if (q) setSearchQuery(q);
    if (specialty) setSelectedSpecialty(specialty);
    if (id && doctors?.length) {
      const matched = doctors.find(
        (d) =>
          d.id.toLowerCase() === id.toLowerCase() ||
          d.slug.toLowerCase() === id.toLowerCase()
      );
      if (matched) {
        setSearchQuery(matched.name[language] || matched.name.en || '');
      }
    }
  };

  const content = {
    ar: {
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
    <>
      <Suspense fallback={null}>
        <SearchParamsHandler onParamsChange={handleParamsChange} />
      </Suspense>

      {/* Filter and Search Bar Ribbon */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-20">
        <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-xl border border-slate-100 dark:border-slate-800 p-4 sm:p-6 space-y-4">
          {/* Search Input */}
          <div className="relative">
            <Search className="w-5 h-5 text-slate-400 absolute top-1/2 -translate-y-1/2 right-4 rtl:right-4 ltr:left-4 ltr:right-auto pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={content.searchPlaceholder}
              className="w-full py-3.5 px-12 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:bg-white dark:focus:bg-slate-800 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 transition-all"
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
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
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
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                }`}
              >
                {item.title[language]}
              </button>
            ))}
          </div>

          <div className="text-xs text-slate-500 dark:text-slate-400 font-medium pt-1">
            {content.showing}{' '}
            <span className="font-bold text-slate-800 dark:text-white">{filteredDoctors.length}</span>{' '}
            {content.of}{' '}
            <span className="font-bold text-slate-800 dark:text-white">{doctors.length}</span>{' '}
            {content.doctorsCount}
          </div>
        </div>
      </div>

      {/* Doctors Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12">
        {filteredDoctors.length === 0 ? (
          <div className="text-center py-20 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800">
            <Stethoscope className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto mb-3" />
            <p className="text-slate-600 dark:text-slate-400 text-base">{content.noResults}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredDoctors.map((doctor, idx) => (
              <motion.div
                key={doctor.id}
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{
                  type: 'spring',
                  stiffness: 350,
                  damping: 26,
                  delay: (idx % 3) * 0.08,
                }}
                whileHover={{ y: -5, transition: { duration: 0.2 } }}
                className="bg-white dark:bg-slate-900 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-800 overflow-hidden hover:shadow-xl hover:border-sky-200 dark:hover:border-sky-500/40 transition-colors duration-300 flex flex-col group cursor-pointer"
              >
                {/* Image & Badges */}
                <div className="relative h-64 overflow-hidden bg-slate-100 dark:bg-slate-800">
                  <img
                    src={doctor.image}
                    alt={doctor.name[language] || doctor.name.ar}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />

                  {/* Experience Badge */}
                  <div className="absolute top-4 left-4 rtl:left-auto rtl:right-4 bg-white/95 dark:bg-slate-900/90 backdrop-blur-sm text-slate-900 dark:text-white px-3 py-1 rounded-full text-xs font-bold shadow-sm flex items-center gap-1.5">
                    <Award className="w-3.5 h-3.5 text-sky-600 dark:text-sky-400" />
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
                    <div className="text-xs font-bold text-sky-600 dark:text-sky-400 uppercase tracking-wider mb-1">
                      {doctor.specialtyName[language] || doctor.specialtyName.ar}
                    </div>
                    <h2 className="text-xl font-bold text-slate-900 dark:text-white group-hover:text-sky-600 dark:group-hover:text-sky-400 transition-colors">
                      {doctor.name[language] || doctor.name.ar}
                    </h2>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-2">
                      {doctor.title[language] || doctor.title.ar}
                    </p>

                    <div className="mt-3 flex items-center gap-1.5 text-xs text-slate-600 dark:text-slate-300">
                      <Building2 className="w-4 h-4 text-sky-500 flex-shrink-0" />
                      <span className="truncate">{doctor.hospital[language] || doctor.hospital.ar}</span>
                    </div>

                    {/* Expertise Tags */}
                    <div className="mt-3 flex flex-wrap gap-1.5">
                      {(doctor.areasOfExpertise[language] || doctor.areasOfExpertise.ar).slice(0, 2).map((area, areaIdx) => (
                        <span
                          key={areaIdx}
                          className="bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 text-slate-600 dark:text-slate-300 text-[11px] px-2 py-0.5 rounded-md"
                        >
                          {area}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center gap-3">
                    <Link
                      href={`/doctors/${doctor.slug}`}
                      className="flex-1 py-2.5 px-4 rounded-xl bg-sky-50 dark:bg-sky-950/40 hover:bg-sky-500 text-sky-700 dark:text-sky-300 hover:text-white font-semibold text-xs transition-colors text-center flex items-center justify-center gap-1 cursor-pointer"
                    >
                      <span>{content.viewProfile}</span>
                      <ArrowIcon className="w-3.5 h-3.5" />
                    </Link>
                    <Link
                      href={`/contact?doctor=${doctor.slug}`}
                      className="py-2.5 px-3 rounded-xl bg-slate-900 dark:bg-sky-600 hover:bg-slate-800 dark:hover:bg-sky-500 text-white text-xs font-semibold transition-colors flex items-center justify-center cursor-pointer"
                      title={content.bookAppointment}
                    >
                      <Calendar className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
