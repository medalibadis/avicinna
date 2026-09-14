'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useLanguage } from '@/context/LanguageContext';
import { useData } from '@/context/DataContext';
import { Star, Building2, Calendar, ArrowRight, ArrowLeft } from 'lucide-react';

export const FeaturedDoctors: React.FC = () => {
  const { t, language, direction } = useLanguage();
  const { doctors } = useData();
  const [selectedSpecialty, setSelectedSpecialty] = useState<string>('all');

  const isRtl = direction === 'rtl';

  const filterTabs = [
    { slug: 'all', label: t.doctors.filterAll },
    { slug: 'cardiac-surgery', label: language === 'ar' ? 'جراحة القلب' : 'Cardiology' },
    { slug: 'neurosurgery', label: language === 'ar' ? 'جراحة الأعصاب' : 'Neurosurgery' },
    { slug: 'orthopedics', label: language === 'ar' ? 'جراحة العظام' : 'Orthopedics' },
    { slug: 'hair-transplant', label: language === 'ar' ? 'زراعة الشعر' : 'Hair' },
    { slug: 'dentistry', label: language === 'ar' ? 'طب الأسنان' : 'Dentistry' },
  ];

  const filteredDoctors =
    selectedSpecialty === 'all'
      ? doctors.slice(0, 4)
      : doctors.filter((doc) => doc.specialtySlug === selectedSpecialty);

  return (
    <section id="doctors" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 bg-[#EAF6FF] text-[#0097FB] text-xs font-bold uppercase tracking-wider px-3.5 py-1.5 rounded-full mb-3 border border-[#0097FB]/20">
            {t.doctors.badge}
          </div>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-[#032654] tracking-tight mb-4">
            {t.doctors.title}
          </h2>
          <p className="text-sm sm:text-base text-[#64748B] leading-relaxed">
            {t.doctors.subtitle}
          </p>
        </div>

        {/* Specialty Filter Tabs */}
        <div className="flex items-center justify-center flex-wrap gap-2 mb-12">
          {filterTabs.map((tab) => {
            const isActive = selectedSpecialty === tab.slug;
            return (
              <button
                key={tab.slug}
                onClick={() => setSelectedSpecialty(tab.slug)}
                type="button"
                className={`px-4 py-2 rounded-full text-xs sm:text-sm font-semibold transition-all duration-200 cursor-pointer ${
                  isActive
                    ? 'bg-[#0097FB] text-white shadow-sm shadow-[#0097FB]/25 scale-105'
                    : 'bg-[#F4F7FA] text-[#163B63] hover:bg-[#EAF6FF]'
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Doctor Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {filteredDoctors.map((doctor) => (
            <div
              key={doctor.id}
              className="bg-white rounded-3xl overflow-hidden border border-slate-200/80 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col group"
            >
              {/* Image & Specialty Badge */}
              <div className="relative h-64 overflow-hidden bg-slate-100">
                <img
                  src={doctor.image}
                  alt={doctor.name[language]}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-3 right-3 bg-[#0097FB] text-white text-[11px] font-bold px-3 py-1 rounded-full shadow-md">
                  {doctor.specialtyName[language]}
                </div>
                <div className="absolute bottom-3 left-3 bg-white/95 backdrop-blur-md px-2.5 py-1 rounded-lg text-xs font-bold text-slate-800 flex items-center gap-1 shadow-sm">
                  <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  <span>{doctor.rating}</span>
                  <span className="text-[10px] text-slate-400">({doctor.reviewCount})</span>
                </div>
              </div>

              {/* Content */}
              <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                <div>
                  <h3 className="text-lg font-bold text-[#032654] group-hover:text-[#0097FB] transition-colors">
                    {doctor.name[language]}
                  </h3>
                  <p className="text-xs font-medium text-[#0097FB] mb-2">
                    {doctor.title[language]}
                  </p>
                  <div className="flex items-center gap-1.5 text-xs text-[#64748B] mb-3">
                    <Building2 className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                    <span className="truncate">{doctor.hospital[language]}</span>
                  </div>
                  <p className="text-xs text-[#64748B] line-clamp-2 leading-relaxed">
                    {doctor.biography[language]}
                  </p>
                </div>

                {/* Actions */}
                <div className="pt-3 border-t border-slate-100 flex items-center gap-2">
                  <Link
                    href={`/doctors/${doctor.slug}`}
                    className="flex-1 text-center py-2 px-3 rounded-xl bg-[#F4F7FA] hover:bg-[#EAF6FF] text-[#163B63] hover:text-[#0097FB] text-xs font-bold transition-colors"
                  >
                    {t.doctors.viewProfile}
                  </Link>
                  <a
                    href="#consultation"
                    className="flex-1 text-center py-2 px-3 rounded-xl bg-[#0097FB] hover:bg-[#0082d6] text-white text-xs font-bold transition-colors shadow-xs shadow-[#0097FB]/20"
                  >
                    {t.doctors.requestConsultation}
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* View All Doctors CTA */}
        <div className="text-center">
          <Link
            href="/doctors"
            className="inline-flex items-center gap-2 bg-[#032654] hover:bg-[#163B63] text-white font-bold text-sm px-8 py-4 rounded-full shadow-md shadow-[#032654]/20 transition-all duration-200"
          >
            <span>{t.doctors.allDoctorsCta}</span>
            {isRtl ? <ArrowLeft className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}
          </Link>
        </div>
      </div>
    </section>
  );
};
