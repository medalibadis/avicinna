'use client';

import React, { useState, useRef, useCallback, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useLanguage } from '@/context/LanguageContext';
import { useData } from '@/context/DataContext';
import { Doctor } from '@/data/doctors';
import { Star, Building2, Calendar, ArrowRight, ArrowLeft } from 'lucide-react';

export const FeaturedDoctors: React.FC = () => {
  const { t, language, direction } = useLanguage();
  const { doctors } = useData();
  const [selectedSpecialty, setSelectedSpecialty] = useState<string>('all');

  const isRtl = direction === 'rtl';

  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [activeIndex, setActiveIndex] = useState(0);

  const filterTabs = [
    { slug: 'all', label: t.doctors.filterAll },
    {
      slug: 'cardiac-surgery',
      label: language === 'ar' ? 'جراحة القلب' : language === 'fr' ? 'Chirurgie Cardiaque' : 'Cardiology',
    },
    {
      slug: 'neurosurgery',
      label: language === 'ar' ? 'جراحة الأعصاب' : language === 'fr' ? 'Neurochirurgie' : 'Neurosurgery',
    },
    {
      slug: 'orthopedics',
      label: language === 'ar' ? 'جراحة العظام' : language === 'fr' ? 'Orthopédie' : 'Orthopedics',
    },
    {
      slug: 'hair-transplant',
      label: language === 'ar' ? 'زراعة الشعر' : language === 'fr' ? 'Greffe de Cheveux' : 'Hair Transplant',
    },
    {
      slug: 'dentistry',
      label: language === 'ar' ? 'طب الأسنان' : language === 'fr' ? 'Dentisterie' : 'Dentistry',
    },
  ];

  const filteredDoctors =
    selectedSpecialty === 'all'
      ? doctors.slice(0, 4)
      : doctors.filter((doc) => doc.specialtySlug === selectedSpecialty);

  // Synchronize mobile scroll tracking with active indicator dot
  const handleScroll = useCallback(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const containerRect = container.getBoundingClientRect();
    const containerCenter = containerRect.left + containerRect.width / 2;

    let closestIndex = 0;
    let minDistance = Infinity;

    cardRefs.current.forEach((el, idx) => {
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const itemCenter = rect.left + rect.width / 2;
      const distance = Math.abs(containerCenter - itemCenter);
      if (distance < minDistance) {
        minDistance = distance;
        closestIndex = idx;
      }
    });

    setActiveIndex(closestIndex);
  }, []);

  const scrollToCard = (index: number) => {
    const target = cardRefs.current[index];
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
      setActiveIndex(index);
    }
  };

  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    container.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      container.removeEventListener('scroll', handleScroll);
    };
  }, [handleScroll, filteredDoctors]);

  // Reset active index when filter changes
  useEffect(() => {
    setActiveIndex(0);
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTo({ left: 0, behavior: 'smooth' });
    }
  }, [selectedSpecialty]);

  const renderCardContent = (doctor: Doctor) => (
    <div className="bg-white dark:bg-slate-900 rounded-3xl overflow-hidden border border-slate-200/80 dark:border-slate-800 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col group h-full">
      {/* Image & Specialty Badge - Clickable to doctor profile */}
      <Link
        href={`/doctors/${doctor.slug}`}
        className="block relative h-64 overflow-hidden bg-slate-100 dark:bg-slate-800 group/img cursor-pointer"
        aria-label={doctor.name[language]}
      >
        <img
          src={doctor.image}
          alt={doctor.name[language]}
          className="w-full h-full object-cover group-hover/img:scale-105 group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute top-3 right-3 bg-[#0097FB] text-white text-[11px] font-bold px-3 py-1 rounded-full shadow-md pointer-events-none">
          {doctor.specialtyName[language]}
        </div>
        <div className="absolute bottom-3 left-3 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md px-2.5 py-1 rounded-lg text-xs font-bold text-slate-800 dark:text-white flex items-center gap-1 shadow-sm border border-slate-100 dark:border-slate-800 pointer-events-none">
          <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
          <span>{doctor.rating}</span>
          <span className="text-[10px] text-slate-400">({doctor.reviewCount})</span>
        </div>
      </Link>

      {/* Content */}
      <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
        <div>
          <Link href={`/doctors/${doctor.slug}`} className="block">
            <h3 className="text-lg font-bold text-[#032654] dark:text-white group-hover:text-[#0097FB] transition-colors leading-snug">
              {doctor.name[language]}
            </h3>
          </Link>
          <p className="text-xs font-medium text-[#0097FB] mb-2">
            {doctor.title[language]}
          </p>
          <div className="flex items-center gap-1.5 text-xs text-[#64748B] dark:text-slate-400 mb-3">
            <Building2 className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
            <span className="truncate">{doctor.hospital[language]}</span>
          </div>
          <p className="text-xs text-[#64748B] dark:text-slate-400 line-clamp-2 leading-relaxed">
            {doctor.biography[language]}
          </p>
        </div>

        {/* Actions */}
        <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center gap-2">
          <Link
            href={`/doctors/${doctor.slug}`}
            className="flex-1 text-center py-2 px-3 rounded-xl bg-[#F4F7FA] dark:bg-slate-800 hover:bg-[#EAF6FF] dark:hover:bg-slate-700 text-[#163B63] dark:text-slate-200 hover:text-[#0097FB] dark:hover:text-sky-400 text-xs font-bold transition-colors cursor-pointer"
          >
            {t.doctors.viewProfile}
          </Link>
          <a
            href="#consultation"
            className="flex-1 text-center py-2 px-3 rounded-xl bg-[#0097FB] hover:bg-[#0082d6] text-white text-xs font-bold transition-colors shadow-xs shadow-[#0097FB]/20 cursor-pointer"
          >
            {t.doctors.requestConsultation}
          </a>
        </div>
      </div>
    </div>
  );

  return (
    <section id="doctors" className="py-12 sm:py-20 bg-white dark:bg-[#080E1A]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 bg-[#EAF6FF] dark:bg-sky-950/60 text-[#0097FB] dark:text-sky-400 text-xs font-bold uppercase tracking-wider px-3.5 py-1.5 rounded-full mb-3 border border-[#0097FB]/20 dark:border-sky-500/30">
            {t.doctors.badge}
          </div>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-[#032654] dark:text-white tracking-tight mb-4">
            {t.doctors.title}
          </h2>
          <p className="text-sm sm:text-base text-[#64748B] dark:text-slate-400 leading-relaxed">
            {t.doctors.subtitle}
          </p>
        </div>

        {/* Specialty Filter Tabs */}
        <div className="flex items-center sm:justify-center overflow-x-auto sm:flex-wrap no-scrollbar pb-2 sm:pb-0 gap-2 mb-8 sm:mb-12 px-2 sm:px-0 -mx-2 sm:mx-0 scroll-smooth">
          {filterTabs.map((tab) => {
            const isActive = selectedSpecialty === tab.slug;
            return (
              <button
                key={tab.slug}
                onClick={() => setSelectedSpecialty(tab.slug)}
                type="button"
                className={`px-3.5 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-semibold transition-all duration-200 cursor-pointer shrink-0 whitespace-nowrap ${
                  isActive
                    ? 'bg-[#0097FB] text-white shadow-sm shadow-[#0097FB]/25 scale-105'
                    : 'bg-[#F4F7FA] dark:bg-slate-800 text-[#163B63] dark:text-slate-200 hover:bg-[#EAF6FF] dark:hover:bg-slate-700'
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* ─── MOBILE VIEW ONLY (< md): Horizontal Swipeable Carousel ─── */}
        <div className="block md:hidden mb-8">
          <div
            ref={scrollContainerRef}
            className="flex overflow-x-auto snap-x snap-mandatory scrollbar-none [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden -mx-4 px-4 sm:-mx-6 sm:px-6 gap-4 pb-4 pt-1"
            style={{ WebkitOverflowScrolling: 'touch' }}
          >
            {filteredDoctors.map((doctor, idx) => (
              <div
                key={doctor.id}
                ref={(el) => {
                  cardRefs.current[idx] = el;
                }}
                className="w-[82vw] max-w-[320px] flex-shrink-0 snap-center"
              >
                {renderCardContent(doctor)}
              </div>
            ))}
          </div>

          {/* Mobile Swipe Pagination Dots Indicator */}
          {filteredDoctors.length > 1 && (
            <div className="flex items-center justify-center gap-1.5 pt-2 pb-1">
              {filteredDoctors.map((_, idx) => (
                <button
                  key={idx}
                  type="button"
                  aria-label={`Doctor slide ${idx + 1}`}
                  onClick={() => scrollToCard(idx)}
                  className={`h-1.5 rounded-full transition-all duration-300 cursor-pointer ${
                    activeIndex === idx
                      ? 'w-6 bg-[#0097FB] dark:bg-sky-400'
                      : 'w-1.5 bg-slate-300 dark:bg-slate-700 hover:bg-slate-400'
                  }`}
                />
              ))}
            </div>
          )}
        </div>

        {/* ─── DESKTOP VIEW ONLY (>= md): Grid Layout ─── */}
        <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
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
                delay: idx * 0.08,
              }}
              whileHover={{ y: -5, transition: { duration: 0.2 } }}
              className="h-full"
            >
              {renderCardContent(doctor)}
            </motion.div>
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
