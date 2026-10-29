'use client';

import React, { useState, useRef, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useLanguage } from '@/context/LanguageContext';
import { useData } from '@/context/DataContext';
import {
  Search,
  Calendar,
  ArrowRight,
  ArrowLeft,
  Shield,
  Sparkles,
  Users,
  Building2,
  Stethoscope,
  ChevronRight,
  ChevronLeft,
  X,
  ExternalLink,
} from 'lucide-react';

const heroSearchDict = {
  ar: {
    quickSearchBtn: 'بحث سريع',
    searchPlaceholder: 'ابحث عن طبيب، مستشفى، أو تخصص طبي...',
    doctorsCategory: 'الأطباء والاستشاريون',
    hospitalsCategory: 'المستشفيات الشريكة المعتمدة',
    treatmentsCategory: 'التخصصات والعمليات الجراحية',
    viewDoctor: 'الملف الطبي الكامل',
    viewHospital: 'عرض المستشفى',
    viewTreatment: 'تفاصيل الإجراء',
    noResults: 'لم يتم العثور على نتائج مطابقة لـ',
    noResultsSub: 'جرّب البحث باسم الطبيب، أو اسم المستشفى، أو التخصص مثل زراعة الشعر، القلب، العظام...',
    searchAll: 'عرض جميع النتائج لـ',
    allDoctorsCount: (n: number) => `${n} أطباء متاحين`,
    allHospitalsCount: (n: number) => `${n} مستشفيات معتمدة`,
    freeConsultationBadge: 'استشارات مجانية 100% بدون أي التزام مالي',
  },
  en: {
    quickSearchBtn: 'Search',
    searchPlaceholder: 'Search by doctor name, hospital, or medical procedure...',
    doctorsCategory: 'Consultant Physicians & Surgeons',
    hospitalsCategory: 'Accredited Partner Hospitals',
    treatmentsCategory: 'Treatments & Procedures',
    viewDoctor: 'View Profile',
    viewHospital: 'Explore Hospital',
    viewTreatment: 'View Procedure',
    noResults: 'No matches found for',
    noResultsSub: 'Try searching by physician name, hospital name, or specialty like Cardiology, Hair Transplant...',
    searchAll: 'Search all results for',
    allDoctorsCount: (n: number) => `${n} available doctors`,
    allHospitalsCount: (n: number) => `${n} accredited centers`,
    freeConsultationBadge: '100% Free Consultation with No Obligation',
  },
  fr: {
    quickSearchBtn: 'Rechercher',
    searchPlaceholder: 'Rechercher un médecin, hôpital ou spécialité...',
    doctorsCategory: 'Médecins & Chirurgiens Spécialistes',
    hospitalsCategory: 'Hôpitaux Partenaires Agréés',
    treatmentsCategory: 'Soins & Interventions Chirurgicales',
    viewDoctor: 'Voir le Profil',
    viewHospital: 'Voir l’Hôpital',
    viewTreatment: 'Détails du Soin',
    noResults: 'Aucun résultat trouvé pour',
    noResultsSub: 'Essayez un nom de médecin, d’hôpital ou une spécialité comme Cardiologie, Greffe...',
    searchAll: 'Rechercher tout pour',
    allDoctorsCount: (n: number) => `${n} médecins disponibles`,
    allHospitalsCount: (n: number) => `${n} centres accrédités`,
    freeConsultationBadge: 'Consultation 100% gratuite sans engagement',
  },
};

export const HeroSection: React.FC = () => {
  const { t, language, direction } = useLanguage();
  const { sections, doctors, hospitals, treatments } = useData();
  const router = useRouter();

  const langKey = language === 'ar' || language === 'en' || language === 'fr' ? language : 'ar';
  const dict = heroSearchDict[langKey];
  const isRtl = direction === 'rtl';
  const ArrowIcon = isRtl ? ChevronLeft : ChevronRight;

  const [searchQuery, setSearchQuery] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const heroData = sections.hero;
  const eyebrow = heroData.eyebrow[language] || t.hero.eyebrow;

  // Clean headline fragments and sanitize legacy artifacts
  const rawPart1 = (heroData.headlinePart1?.[language] || t.hero.headlinePart1 || '').trim();
  const rawHighlight = (heroData.headlineHighlight?.[language] || t.hero.headlineHighlight || '').trim();
  const rawPart2 = (heroData.headlinePart2?.[language] || (t.hero as any)?.headlinePart2 || '').trim();

  const cleanPart1 = rawPart1.replace(/\s+pour\s+votre$/i, '').replace(/\s+for\s+your$/i, '').trim();
  const isLegacyPart2 = ['voyage', 'journey', 'لرعايتكم'].includes(rawPart2.toLowerCase());
  const cleanPart2 = isLegacyPart2 ? '' : rawPart2;

  const cleanHighlight =
    language === 'fr' && rawHighlight.toLowerCase() === 'santé'
      ? 'Pour Votre Santé'
      : language === 'en' && rawHighlight.toLowerCase() === 'care'
      ? 'For Your Care'
      : rawHighlight;

  const subtitle = heroData.subtitle[language] || t.hero.subtitle;

  // Click outside listener to dismiss dropdown
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Compute live search suggestions across Doctors, Hospitals, Treatments
  const suggestions = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) {
      return { matchingDoctors: [], matchingHospitals: [], matchingTreatments: [] };
    }

    const matchingDoctors = (doctors || []).filter((doc) => {
      const matchName =
        doc.name?.[langKey]?.toLowerCase().includes(q) ||
        doc.name?.ar?.toLowerCase().includes(q) ||
        doc.name?.en?.toLowerCase().includes(q) ||
        doc.name?.fr?.toLowerCase().includes(q);
      const matchTitle =
        doc.title?.[langKey]?.toLowerCase().includes(q) ||
        doc.title?.en?.toLowerCase().includes(q);
      const matchSpec =
        doc.specialtyName?.[langKey]?.toLowerCase().includes(q) ||
        doc.specialtySlug?.toLowerCase().includes(q);
      return matchName || matchTitle || matchSpec;
    }).slice(0, 4);

    const matchingHospitals = (hospitals || []).filter((hosp) => {
      const matchName =
        hosp.name?.[langKey]?.toLowerCase().includes(q) ||
        hosp.name?.ar?.toLowerCase().includes(q) ||
        hosp.name?.en?.toLowerCase().includes(q) ||
        hosp.name?.fr?.toLowerCase().includes(q);
      const matchCity =
        hosp.city?.[langKey]?.toLowerCase().includes(q) ||
        hosp.city?.en?.toLowerCase().includes(q);
      return matchName || matchCity;
    }).slice(0, 3);

    const matchingTreatments = (treatments || []).filter((tr) => {
      const matchTitle =
        tr.title?.[langKey]?.toLowerCase().includes(q) ||
        tr.title?.ar?.toLowerCase().includes(q) ||
        tr.title?.en?.toLowerCase().includes(q);
      const matchDesc =
        tr.shortDescription?.[langKey]?.toLowerCase().includes(q) ||
        tr.shortDescription?.en?.toLowerCase().includes(q);
      return matchTitle || matchDesc;
    }).slice(0, 3);

    return { matchingDoctors, matchingHospitals, matchingTreatments };
  }, [searchQuery, doctors, hospitals, treatments, langKey]);

  const hasMatches =
    suggestions.matchingDoctors.length > 0 ||
    suggestions.matchingHospitals.length > 0 ||
    suggestions.matchingTreatments.length > 0;

  // Handle Search Submission: Smart routing based on best match
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const q = searchQuery.trim();
    if (!q) return;

    setIsDropdownOpen(false);

    // If there is a single clear doctor match, navigate to doctor profile directly
    if (suggestions.matchingDoctors.length === 1 && suggestions.matchingHospitals.length === 0) {
      router.push(`/doctors/${suggestions.matchingDoctors[0].slug}`);
      return;
    }

    // If there is a single clear hospital match, navigate to hospital detail directly
    if (suggestions.matchingHospitals.length === 1 && suggestions.matchingDoctors.length === 0) {
      router.push(`/hospitals?id=${suggestions.matchingHospitals[0].id}`);
      return;
    }

    // If doctors matched, go to doctors search
    if (suggestions.matchingDoctors.length > 0 && suggestions.matchingHospitals.length === 0 && suggestions.matchingTreatments.length === 0) {
      router.push(`/doctors?search=${encodeURIComponent(q)}`);
      return;
    }

    // If hospitals matched, go to hospitals search
    if (suggestions.matchingHospitals.length > 0 && suggestions.matchingDoctors.length === 0 && suggestions.matchingTreatments.length === 0) {
      router.push(`/hospitals?search=${encodeURIComponent(q)}`);
      return;
    }

    // Fallback: search treatments/procedures
    router.push(`/treatments?search=${encodeURIComponent(q)}`);
  };

  return (
    <section className="relative z-30 min-h-0 sm:min-h-[90vh] flex items-center justify-center pt-20 sm:pt-28 pb-10 sm:pb-16 bg-[#032654] w-full max-w-full overflow-x-clip">
      {/* 1. AUTO-PLAYING AMBIENT MEDICAL VIDEO BACKGROUND */}
      <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
        <video
          autoPlay
          loop
          muted
          playsInline
          poster="https://images.unsplash.com/photo-1587351021759-3e566b6af7cc?q=80&w=2000&auto=format&fit=crop"
          className="h-full w-full scale-105 object-cover opacity-40 filter saturate-125 transition-opacity duration-1000"
        >
          <source
            src="https://assets.mixkit.co/videos/preview/mixkit-doctors-walking-in-a-modern-hospital-corridor-41446-large.mp4"
            type="video/mp4"
          />
        </video>

        {/* Dynamic Multi-Layer Vignette Scrim for 100% Typographic Legibility */}
        <div className="absolute inset-0 bg-gradient-to-b from-slate-950/85 via-[#021838]/80 to-[#021838]/95 dark:from-[#050B14]/90 dark:via-[#09172B]/85 dark:to-[#050B14]" />
        <div className="absolute -top-32 left-1/2 h-[500px] w-[900px] -translate-x-1/2 rounded-full bg-sky-500/20 blur-[140px] pointer-events-none" />
        <div className="absolute -bottom-24 right-1/4 h-72 w-72 rounded-full bg-teal-500/15 blur-[120px] pointer-events-none" />
      </div>

      <div className="relative z-10 w-full max-w-5xl mx-auto px-3 sm:px-6 lg:px-8 text-center text-white">
        {/* Trust Eyebrow Badge */}
        <div className="inline-flex items-center gap-2 bg-[#0097FB]/15 border border-[#00BFFF]/30 backdrop-blur-md px-3.5 sm:px-4 py-1 sm:py-1.5 rounded-full mb-4 sm:mb-5 shadow-xs">
          <Sparkles className="w-3.5 h-3.5 text-[#00BFFF] animate-spin duration-3000" />
          <span className="text-[11px] sm:text-sm font-semibold text-[#00BFFF] tracking-wide">
            {eyebrow}
          </span>
        </div>

        {/* Main Headline (Optimized typography hierarchy & line balance) */}
        <h1 className="text-xl sm:text-3xl lg:text-5xl font-black tracking-tight leading-tight sm:leading-[1.2] mb-3 sm:mb-5 max-w-3xl mx-auto">
          <span>{cleanPart1}</span>{' '}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#0097FB] via-[#00BFFF] to-[#0097FB] inline">
            {cleanHighlight}
          </span>
          {cleanPart2 && <span> {cleanPart2}</span>}
        </h1>

        {/* Supporting Subtitle */}
        <p className="text-xs sm:text-base lg:text-lg text-slate-200/90 max-w-2xl mx-auto leading-relaxed mb-6 sm:mb-8 font-normal line-clamp-3 sm:line-clamp-none">
          {subtitle}
        </p>

        {/* ─── Search / Consultation Entry Component with Live Autocomplete ─── */}
        <div ref={containerRef} className="w-full max-w-2xl mx-auto mb-10 relative z-30">
          {/* Search Bar + Floating Dropdown Anchor */}
          <div className="relative w-full">
            <form
              onSubmit={handleSearch}
              className="relative flex items-center bg-white/95 dark:bg-slate-900/90 backdrop-blur-xl rounded-2xl sm:rounded-full p-1.5 sm:p-2 shadow-2xl shadow-black/40 border border-white/20 dark:border-white/10 transition-all focus-within:ring-2 focus-within:ring-[#0097FB] z-20 w-full"
            >
              <div className="flex items-center justify-center rtl:pr-2.5 rtl:pl-1.5 ltr:pl-2.5 ltr:pr-1.5 text-[#0097FB] shrink-0">
                <Search className="w-4 h-4 sm:w-5 sm:h-5" />
              </div>
              <input
                type="text"
                dir="auto"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setIsDropdownOpen(true);
                }}
                onFocus={() => {
                  if (searchQuery.trim().length > 0) {
                    setIsDropdownOpen(true);
                  }
                }}
                placeholder={dict.searchPlaceholder}
                className="w-full min-w-0 flex-1 bg-transparent text-slate-800 dark:text-white placeholder-slate-400 dark:placeholder-slate-400 text-xs sm:text-base font-medium focus:outline-none px-1.5 sm:px-2 py-1.5 sm:py-2"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => {
                    setSearchQuery('');
                    setIsDropdownOpen(false);
                  }}
                  className="p-1 sm:p-1.5 text-slate-400 hover:text-slate-600 dark:text-slate-400 dark:hover:text-slate-200 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors mx-1 sm:mx-1.5 cursor-pointer"
                  aria-label="Clear search"
                >
                  <X className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                </button>
              )}
              <button
                type="submit"
                className="bg-[#0097FB] hover:bg-[#0082d6] text-white font-bold text-xs sm:text-sm px-4 sm:px-6 py-2.5 sm:py-3 rounded-xl sm:rounded-full transition-all duration-200 shadow-md shadow-[#0097FB]/30 flex-shrink-0 cursor-pointer"
              >
                {dict.quickSearchBtn}
              </button>
            </form>

            {/* ─── Live Autocomplete Dropdown (Direct deep links to Doctor, Hospital, Treatment) ─── */}
            {isDropdownOpen && searchQuery.trim().length >= 1 && (
              <div
                dir={direction}
                className="absolute left-0 right-0 top-full mt-2.5 bg-[#0d1627]/98 dark:bg-[#08101e]/98 backdrop-blur-2xl border border-sky-400/40 rounded-2xl shadow-2xl shadow-black/90 overflow-hidden text-start z-50 max-h-[380px] sm:max-h-[440px] overflow-y-auto animate-in fade-in zoom-in-98 duration-150 [scrollbar-width:thin] [scrollbar-color:rgba(56,189,248,0.3)_transparent] ring-1 ring-white/10"
              >
                {hasMatches ? (
                  <div className="p-3 space-y-4">
                    {/* Category 1: Doctors */}
                    {suggestions.matchingDoctors.length > 0 && (
                      <div>
                        <div className="flex items-center gap-1.5 px-3 py-1.5 text-[11px] font-bold text-sky-400 uppercase tracking-wider">
                          <Users className="w-3.5 h-3.5" />
                          <span>{dict.doctorsCategory}</span>
                        </div>
                        <div className="space-y-1 mt-1">
                          {suggestions.matchingDoctors.map((doc) => {
                            const docName = doc.name?.[langKey] || doc.name?.ar || doc.name?.en || 'Doctor';
                            const docTitle = doc.title?.[langKey] || doc.title?.en || '';
                            const docSpec = doc.specialtyName?.[langKey] || doc.specialtyName?.en || '';
                            return (
                              <Link
                                key={doc.id}
                                href={`/doctors/${doc.slug}`}
                                onClick={() => setIsDropdownOpen(false)}
                                className="flex items-center justify-between p-2.5 rounded-xl hover:bg-white/10 transition-colors group cursor-pointer border border-transparent hover:border-white/10"
                              >
                                <div className="flex items-center gap-3 min-w-0">
                                  <img
                                    src={doc.image}
                                    alt={docName}
                                    className="w-10 h-10 rounded-full object-cover border border-white/20 flex-shrink-0"
                                  />
                                  <div className="min-w-0">
                                    <div className="text-sm font-bold text-white group-hover:text-sky-400 transition-colors truncate">
                                      {docName}
                                    </div>
                                    <div className="text-xs text-slate-400 truncate">
                                      {docTitle ? `${docTitle} • ` : ''}
                                      {docSpec}
                                    </div>
                                  </div>
                                </div>
                                <span className="text-[11px] text-sky-400 font-semibold px-2 py-1 rounded-lg bg-sky-500/10 border border-sky-500/20 flex items-center gap-1 flex-shrink-0 ml-2 rtl:ml-0 rtl:mr-2">
                                  <span>{dict.viewDoctor}</span>
                                  <ArrowIcon className="w-3 h-3" />
                                </span>
                              </Link>
                            );
                          })}
                        </div>
                      </div>
                    )}

                    {/* Category 2: Hospitals */}
                    {suggestions.matchingHospitals.length > 0 && (
                      <div>
                        <div className="flex items-center gap-1.5 px-3 py-1.5 text-[11px] font-bold text-emerald-400 uppercase tracking-wider">
                          <Building2 className="w-3.5 h-3.5" />
                          <span>{dict.hospitalsCategory}</span>
                        </div>
                        <div className="space-y-1 mt-1">
                          {suggestions.matchingHospitals.map((hosp) => {
                            const hospName = hosp.name?.[langKey] || hosp.name?.ar || hosp.name?.en || 'Hospital';
                            const city = hosp.city?.[langKey] || hosp.city?.ar || hosp.city?.en || '';
                            return (
                              <Link
                                key={hosp.id}
                                href={`/hospitals?id=${hosp.id}`}
                                onClick={() => setIsDropdownOpen(false)}
                                className="flex items-center justify-between p-2.5 rounded-xl hover:bg-white/10 transition-colors group cursor-pointer border border-transparent hover:border-white/10"
                              >
                                <div className="flex items-center gap-3 min-w-0">
                                  <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400 flex-shrink-0">
                                    <Building2 className="w-5 h-5" />
                                  </div>
                                  <div className="min-w-0">
                                    <div className="text-sm font-bold text-white group-hover:text-emerald-400 transition-colors truncate">
                                      {hospName}
                                    </div>
                                    <div className="text-xs text-slate-400 truncate">
                                      {city} • {hosp.accreditationBadge || 'JCI'}
                                    </div>
                                  </div>
                                </div>
                                <span className="text-[11px] text-emerald-400 font-semibold px-2 py-1 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center gap-1 flex-shrink-0 ml-2 rtl:ml-0 rtl:mr-2">
                                  <span>{dict.viewHospital}</span>
                                  <ArrowIcon className="w-3 h-3" />
                                </span>
                              </Link>
                            );
                          })}
                        </div>
                      </div>
                    )}

                    {/* Category 3: Treatments */}
                    {suggestions.matchingTreatments.length > 0 && (
                      <div>
                        <div className="flex items-center gap-1.5 px-3 py-1.5 text-[11px] font-bold text-purple-400 uppercase tracking-wider">
                          <Stethoscope className="w-3.5 h-3.5" />
                          <span>{dict.treatmentsCategory}</span>
                        </div>
                        <div className="space-y-1 mt-1">
                          {suggestions.matchingTreatments.map((tr) => {
                            const trTitle = tr.title?.[langKey] || tr.title?.ar || tr.title?.en || 'Treatment';
                            const trDesc = tr.shortDescription?.[langKey] || tr.shortDescription?.en || '';
                            return (
                              <Link
                                key={tr.id}
                                href={`/treatments/${tr.slug}`}
                                onClick={() => setIsDropdownOpen(false)}
                                className="flex items-center justify-between p-2.5 rounded-xl hover:bg-white/10 transition-colors group cursor-pointer border border-transparent hover:border-white/10"
                              >
                                <div className="flex items-center gap-3 min-w-0">
                                  <div className="w-10 h-10 rounded-xl bg-purple-500/20 border border-purple-500/30 flex items-center justify-center text-purple-400 flex-shrink-0">
                                    <Stethoscope className="w-5 h-5" />
                                  </div>
                                  <div className="min-w-0">
                                    <div className="text-sm font-bold text-white group-hover:text-purple-400 transition-colors truncate">
                                      {trTitle}
                                    </div>
                                    <div className="text-xs text-slate-400 truncate">
                                      {trDesc}
                                    </div>
                                  </div>
                                </div>
                                <span className="text-[11px] text-purple-400 font-semibold px-2 py-1 rounded-lg bg-purple-500/10 border border-purple-500/20 flex items-center gap-1 flex-shrink-0 ml-2 rtl:ml-0 rtl:mr-2">
                                  <span>{dict.viewTreatment}</span>
                                  <ArrowIcon className="w-3 h-3" />
                                </span>
                              </Link>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="p-8 text-center text-slate-400">
                    <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center mx-auto mb-2 text-slate-400">
                      <Search className="w-5 h-5" />
                    </div>
                    <p className="text-xs font-bold text-white mb-1">
                      {dict.noResults} &ldquo;{searchQuery}&rdquo;
                    </p>
                    <p className="text-[11px] text-slate-400 max-w-md mx-auto leading-relaxed">
                      {dict.noResultsSub}
                    </p>
                  </div>
                )}

                {/* Search all footer */}
                <div className="p-3 bg-black/40 border-t border-white/10 flex items-center justify-between text-xs text-slate-300">
                  <span>
                    {dict.searchAll} &ldquo;<span className="text-white font-bold">{searchQuery}</span>&rdquo;
                  </span>
                  <button
                    type="button"
                    onClick={handleSearch}
                    className="text-xs font-bold text-sky-400 hover:text-sky-300 flex items-center gap-1 cursor-pointer"
                  >
                    <span>{dict.quickSearchBtn}</span>
                    <ArrowIcon className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Quick-Filter Popular Specialty Chips */}
          <div className="mt-3 flex items-center sm:justify-center gap-1.5 sm:gap-2 overflow-x-auto sm:flex-wrap no-scrollbar px-1 sm:px-0 py-1 relative z-10 w-full max-w-full">
            {[
              language === 'ar' ? 'جراحة الأورام' : language === 'fr' ? 'Oncologie' : 'Oncology',
              language === 'ar' ? 'جراحة القلب' : language === 'fr' ? 'Chirurgie Cardiaque' : 'Heart Surgery',
              language === 'ar' ? 'جراحة المخ والأعصاب' : language === 'fr' ? 'Neurochirurgie' : 'Neurosurgery',
              language === 'ar' ? 'زراعة الأعضاء' : language === 'fr' ? 'Greffe d’Organes' : 'Organ Transplant',
              language === 'ar' ? 'الروبوت الجراحي Da Vinci' : language === 'fr' ? 'Chirurgie Robotique' : 'Robotic Surgery',
            ].map((chip) => (
              <button
                key={chip}
                type="button"
                onClick={() => {
                  setSearchQuery(chip);
                  setIsDropdownOpen(true);
                }}
                className="rounded-full border border-white/20 bg-white/10 hover:bg-white/20 px-3 sm:px-3.5 py-1 text-[11px] sm:text-xs font-semibold text-slate-200 backdrop-blur-md transition-all hover:border-[#00BFFF]/60 hover:text-white cursor-pointer shrink-0 whitespace-nowrap"
              >
                {chip}
              </button>
            ))}
          </div>
        </div>

        {/* Dual Primary / Secondary CTAs */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 mb-8 sm:mb-12">
          <a
            href="#consultation"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 bg-[#0097FB] hover:bg-[#0082d6] text-white font-bold text-sm sm:text-base px-6 sm:px-8 py-3.5 sm:py-4 rounded-full shadow-lg shadow-[#0097FB]/25 transition-all duration-200 transform hover:-translate-y-0.5 cursor-pointer"
          >
            <Calendar className="w-4 h-4 sm:w-5 sm:h-5" />
            <span>{t.hero.primaryCta}</span>
          </a>

          <a
            href="/treatments"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 border border-white/25 text-white font-semibold text-sm sm:text-base px-6 sm:px-8 py-3.5 sm:py-4 rounded-full backdrop-blur-md transition-all duration-200"
          >
            <span>{t.hero.secondaryCta}</span>
            {isRtl ? <ArrowLeft className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}
          </a>
        </div>

        {/* Trust Badges Bar */}
        <div className="pt-6 border-t border-white/10 flex flex-wrap items-center justify-center gap-6 sm:gap-10 text-xs sm:text-sm text-slate-300 font-medium">
          <div className="flex items-center gap-2">
            <Shield className="w-4 h-4 text-[#00BFFF]" />
            <span>{t.hero.trustBadge}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
            <span>{dict.freeConsultationBadge}</span>
          </div>
        </div>
      </div>
    </section>
  );
};
