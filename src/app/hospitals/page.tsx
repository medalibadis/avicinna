'use client';

import React, { useState, useMemo, useEffect, Suspense } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { useLanguage } from '@/context/LanguageContext';
import { useData } from '@/context/DataContext';
import { HospitalPartner } from '@/data/hospitals';
import { Doctor } from '@/data/doctors';
import { AnimatedNumberTicker } from '@/components/ui/DopaminePrimitives';
import {
  Building2,
  Search,
  MapPin,
  ShieldCheck,
  Star,
  Bed,
  Stethoscope,
  Activity,
  Award,
  ChevronLeft,
  ChevronRight,
  Filter,
  X,
  MessageCircle,
  Calendar,
  Sparkles,
  CheckCircle2,
  GraduationCap,
  Languages,
  Layers,
  ArrowUpRight,
  PhoneCall,
  Clock,
  Compass,
  ChevronDown,
  RotateCcw,
} from 'lucide-react';

interface FilterDropdownOption {
  id: string;
  label: string;
}

function FilterDropdown({
  id,
  label,
  icon: Icon,
  value,
  options,
  onChange,
  isOpen,
  onToggle,
  variant = 'light',
}: {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  value: string;
  options: FilterDropdownOption[];
  onChange: (val: string) => void;
  isOpen: boolean;
  onToggle: () => void;
  variant?: 'light' | 'dark';
}) {
  const selectedOption = options.find((o) => o.id === value) || options[0];

  return (
    <div className="relative w-full" data-dropdown-id={id}>
      <label
        className={`block text-[11px] font-bold uppercase tracking-wider mb-1.5 flex items-center gap-1.5 ${
          variant === 'dark' ? 'text-slate-300' : 'text-slate-500 dark:text-slate-400'
        }`}
      >
        <Icon className={`w-3.5 h-3.5 ${variant === 'dark' ? 'text-[#00BFFF]' : 'text-[#0097FB]'}`} />
        <span>{label}</span>
      </label>

      {/* Trigger Button */}
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={isOpen}
        className={`w-full flex items-center justify-between gap-2 rounded-xl py-2.5 px-3.5 text-xs sm:text-sm font-semibold transition-all duration-200 cursor-pointer border text-start ${
          variant === 'dark'
            ? 'bg-white/10 hover:bg-white/15 text-white border-white/20 focus:ring-2 focus:ring-[#00BFFF] focus:outline-none'
            : 'bg-white dark:bg-slate-900/90 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-800 dark:text-white border-slate-200/90 dark:border-slate-700/80 focus:border-[#0097FB] focus:ring-2 focus:ring-[#0097FB]/20 focus:outline-none shadow-xs'
        }`}
      >
        <span className="truncate">{selectedOption?.label}</span>
        <ChevronDown
          className={`w-4 h-4 flex-shrink-0 transition-transform duration-200 ${
            isOpen ? 'rotate-180 text-[#0097FB]' : variant === 'dark' ? 'text-slate-300' : 'text-slate-400'
          }`}
        />
      </button>

      {/* Popover Menu - Positioned cleanly BELOW the button */}
      {isOpen && (
        <div
          className="absolute top-full start-0 mt-2 w-full min-w-[240px] max-w-md bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200/90 dark:border-slate-800 py-1.5 z-50 max-h-64 overflow-y-auto animate-in fade-in zoom-in-95 duration-150"
          style={{ boxShadow: '0 20px 40px -15px rgba(0,0,0,0.2)' }}
        >
          {options.map((opt) => {
            const isSelected = opt.id === value;
            return (
              <button
                key={opt.id}
                type="button"
                onClick={() => {
                  onChange(opt.id);
                  onToggle();
                }}
                className={`w-full flex items-center justify-between gap-2 px-3.5 py-2.5 text-xs sm:text-sm text-start font-medium transition-colors cursor-pointer ${
                  isSelected
                    ? 'bg-[#EAF6FF] dark:bg-sky-950/50 text-[#0097FB] dark:text-sky-300 font-bold'
                    : 'text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <span className="truncate">{opt.label}</span>
                {isSelected && <CheckCircle2 className="w-4 h-4 text-[#0097FB] flex-shrink-0" />}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

function HospitalsPageContent() {
  const { language, direction, t } = useLanguage();
  const { hospitals, doctors, treatments } = useData();
  const searchParams = useSearchParams();
  const ArrowIcon = direction === 'rtl' ? ChevronLeft : ChevronRight;
  const isRtl = direction === 'rtl';

  const content = t.hospitalsPage;

  // Active view mode: 'grid' (All Hospitals) | 'matcher' (Direct Hospital + Specialty Matcher)
  const [activeTab, setActiveTab] = useState<'grid' | 'matcher'>('grid');

  // Active dropdown state for custom dropdown popovers (only one open at a time, click outside closes)
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const toggleDropdown = (id: string) => {
    setOpenDropdown((curr) => (curr === id ? null : id));
  };

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest('[data-dropdown-id]')) {
        setOpenDropdown(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCity, setSelectedCity] = useState<string>('all');
  const [selectedSpecialty, setSelectedSpecialty] = useState<string>('all');
  const [selectedAccreditation, setSelectedAccreditation] = useState<string>('all');

  // Selected Hospital Modal / Drawer state
  const [selectedHospital, setSelectedHospital] = useState<HospitalPartner | null>(null);
  const [hospitalSpecialtyFilter, setHospitalSpecialtyFilter] = useState<string>('all');

  // Deep-linking from search or external link
  const paramId = searchParams.get('id') || searchParams.get('slug');
  const paramSearch = searchParams.get('search') || searchParams.get('q');
  const paramCity = searchParams.get('city');
  const paramSpecialty = searchParams.get('specialty');

  useEffect(() => {
    if (paramSearch) {
      setSearchQuery(paramSearch);
    }
    if (paramCity) {
      setSelectedCity(paramCity);
    }
    if (paramSpecialty) {
      setSelectedSpecialty(paramSpecialty);
    }
    if (paramId && hospitals?.length) {
      const matched = hospitals.find(
        (h) =>
          h.id.toLowerCase() === paramId.toLowerCase() ||
          h.slug.toLowerCase() === paramId.toLowerCase()
      );
      if (matched) {
        setSelectedHospital(matched);
        setHospitalSpecialtyFilter('all');
      }
    }
  }, [paramId, paramSearch, paramCity, paramSpecialty, hospitals]);

  // Selected Doctor for CV Modal
  const [selectedDoctorForCv, setSelectedDoctorForCv] = useState<Doctor | null>(null);

  // Matcher state (Tab 2)
  const [matcherHospitalId, setMatcherHospitalId] = useState<string>('all');
  const [matcherSpecialtySlug, setMatcherSpecialtySlug] = useState<string>('all');

  // Distinct cities from hospital data
  const cityOptions = useMemo(() => [
    { id: 'all', label: content.allCities },
    { id: 'istanbul-europe', label: content.cityEurope },
    { id: 'istanbul-asia', label: content.cityAsia },
    { id: 'ankara', label: content.cityAnkara },
    { id: 'kocaeli', label: content.cityKocaeli },
  ], [content]);

  // Distinct specialties from treatments data (formatted for FilterDropdown)
  const specialtyOptions = useMemo(() => [
    { id: 'all', label: content.allSpecialties },
    ...treatments.map((tr) => ({
      id: tr.slug,
      label: tr.title?.[language] || tr.title?.en || tr.slug,
    })),
  ], [treatments, language, content.allSpecialties]);

  // Matcher hospital options
  const matcherHospitalOptions = useMemo(() => [
    {
      id: 'all',
      label:
        language === 'ar'
          ? 'جميع المستشفيات الشريكة (11 صرح طبي)'
          : language === 'fr'
          ? 'Tous les hôpitaux partenaires (11 campus)'
          : 'All Partner Hospitals (11 Campuses)',
    },
    ...(hospitals || []).map((hosp) => ({
      id: hosp.id,
      label: hosp.name?.[language] || hosp.name?.en || hosp.name?.ar || 'Hospital',
    })),
  ], [hospitals, language]);

  // Distinct accreditations
  const accreditationOptions = useMemo(() => [
    { id: 'all', label: content.allAccreditations },
    { id: 'JCI', label: content.accreditationJci },
    { id: 'LEED', label: content.accreditationLeed },
    { id: 'ACADEMIC', label: content.accreditationAcademic },
  ], [content]);

  // Filtered hospitals with full safe optional chaining
  const filteredHospitals = useMemo(() => {
    return (hospitals || []).filter((hosp) => {
      // City filter
      if (selectedCity !== 'all' && hosp.cityCategory && hosp.cityCategory !== selectedCity) {
        return false;
      }

      // Accreditation filter
      if (selectedAccreditation !== 'all' && hosp.accreditationBadge !== selectedAccreditation) {
        return false;
      }

      // Specialty filter
      if (selectedSpecialty !== 'all') {
        const specList = hosp.specialties || [];
        if (!specList.includes(selectedSpecialty)) {
          return false;
        }
      }

      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchesName =
          hosp.name?.[language]?.toLowerCase().includes(q) ||
          hosp.name?.en?.toLowerCase().includes(q) ||
          hosp.name?.ar?.toLowerCase().includes(q) ||
          false;
        const matchesCity = hosp.city?.[language]?.toLowerCase().includes(q) || false;
        const techList = hosp.technologies?.[language] || hosp.technologies?.en || [];
        const matchesTech = Array.isArray(techList) && techList.some((tech) => tech?.toLowerCase().includes(q));
        const matchesAccreditation = hosp.accreditation?.toLowerCase().includes(q) || false;

        if (!matchesName && !matchesCity && !matchesTech && !matchesAccreditation) {
          return false;
        }
      }

      return true;
    });
  }, [hospitals, selectedCity, selectedAccreditation, selectedSpecialty, searchQuery, language]);

  // Doctors belonging to selected hospital (filtered by in-hospital specialty)
  const hospitalDoctors = useMemo(() => {
    if (!selectedHospital) return [];
    return (doctors || []).filter((doc) => {
      const belongsToHospital =
        doc.hospitalId === selectedHospital.id ||
        (doc.hospital?.[language] && selectedHospital.name?.[language] &&
         doc.hospital[language].toLowerCase().includes(selectedHospital.name[language].toLowerCase()));

      if (!belongsToHospital) return false;

      if (hospitalSpecialtyFilter !== 'all') {
        return doc.specialtySlug === hospitalSpecialtyFilter;
      }

      return true;
    });
  }, [selectedHospital, doctors, hospitalSpecialtyFilter, language]);

  // Matcher results (Tab 2)
  const matchedDoctors = useMemo(() => {
    return (doctors || []).filter((doc) => {
      const matchHosp = matcherHospitalId === 'all' || doc.hospitalId === matcherHospitalId;
      const matchSpec = matcherSpecialtySlug === 'all' || doc.specialtySlug === matcherSpecialtySlug;
      return matchHosp && matchSpec;
    });
  }, [doctors, matcherHospitalId, matcherSpecialtySlug]);

  // Reset all filters
  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedCity('all');
    setSelectedSpecialty('all');
    setSelectedAccreditation('all');
  };

  // WhatsApp inquiry helper
  const getWhatsAppHospitalLink = (hosp: HospitalPartner) => {
    const hospName = hosp.name?.[language] || hosp.name?.en || hosp.name?.ar || 'Hospital';
    const msgText: Record<string, string> = {
      ar: `مرحباً منصة أفيسينا، أود الاستفسار عن حجز موعد واستشارة طبية في ${hospName}.`,
      en: `Hello AVICINNA, I would like to request information and consultation at ${hospName}.`,
      fr: `Bonjour AVICINNA, je souhaite obtenir des informations et une consultation à ${hospName}.`,
    };
    const message = encodeURIComponent(msgText[language] || msgText.en);
    return `https://wa.me/905442822769?text=${message}`;
  };

  const getWhatsAppDoctorLink = (doc: Doctor, hospName?: string) => {
    const docName = doc.name?.[language] || doc.name?.en || 'Doctor';
    const specialty = doc.specialtyName?.[language] || doc.specialtyName?.en || 'Specialist';
    const targetHosp = hospName || doc.hospital?.[language] || doc.hospital?.en || 'Partner Hospital';
    const msgText: Record<string, string> = {
      ar: `مرحباً منصة أفيسينا، أود حجز استشارة طبية مع الطبيب ${docName} (${specialty}) في ${targetHosp}.`,
      en: `Hello AVICINNA, I would like to book a consultation with ${docName} (${specialty}) at ${targetHosp}.`,
      fr: `Bonjour AVICINNA, je souhaite planifier une consultation avec le ${docName} (${specialty}) à ${targetHosp}.`,
    };
    const message = encodeURIComponent(msgText[language] || msgText.en);
    return `https://wa.me/905442822769?text=${message}`;
  };

  return (
    <div className="pt-28 lg:pt-36 pb-20 bg-slate-50 dark:bg-[#080E1A] min-h-screen transition-colors">
      {/* ─── Hero Header ─── */}
      <div className="bg-gradient-to-b from-[#021838] via-[#032654] to-[#043370] text-white py-16 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        {/* Glow ambient effects */}
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-[#0097FB]/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-[#00BFFF]/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#38bdf8_1px,transparent_1px)] [background-size:20px_20px]" />

        <div className="max-w-7xl mx-auto relative z-10 text-center max-w-4xl">
          {/* Eyebrow badge */}
          <div className="inline-flex items-center gap-2 bg-[#0097FB]/20 border border-[#00BFFF]/40 text-[#00BFFF] text-xs sm:text-sm font-bold uppercase tracking-wider px-4 py-1.5 rounded-full mb-4 shadow-inner">
            <Building2 className="w-4 h-4 text-[#00BFFF]" />
            <span>{content.badge}</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight mb-5 leading-tight">
            {content.title}
          </h1>

          <p className="text-sm sm:text-lg text-slate-200/90 leading-relaxed mb-8 max-w-3xl mx-auto">
            {content.subtitle}
          </p>

          {/* Quick Statistics Strip (Ample 32px+ breathing room and spring animated tickers) */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 max-w-3xl mx-auto pt-6">
            <div className="bg-white/10 backdrop-blur-md border border-white/10 rounded-2xl p-3.5 sm:p-5 text-center transition-all hover:bg-white/15">
              <span className="block text-2xl sm:text-3xl font-black text-white">
                <AnimatedNumberTicker value={11} />
              </span>
              <span className="text-[11px] sm:text-xs text-slate-300 font-medium mt-1 block">
                {language === 'ar' ? 'صرحاً استشفائياً معتمداً' : language === 'fr' ? 'Hôpitaux accrédités JCI' : 'JCI Accredited Hospitals'}
              </span>
            </div>
            <div className="bg-white/10 backdrop-blur-md border border-white/10 rounded-2xl p-3.5 sm:p-5 text-center transition-all hover:bg-white/15">
              <span className="block text-2xl sm:text-3xl font-black text-[#00BFFF]">
                <AnimatedNumberTicker value={5800} prefix="+" />
              </span>
              <span className="text-[11px] sm:text-xs text-slate-300 font-medium mt-1 block">
                {language === 'ar' ? 'سرير استشفاء وعناية' : language === 'fr' ? 'Lits d’hospitalisation & réanimation' : 'Total Hospital Beds'}
              </span>
            </div>
            <div className="bg-white/10 backdrop-blur-md border border-white/10 rounded-2xl p-3.5 sm:p-5 text-center transition-all hover:bg-white/15">
              <span className="block text-2xl sm:text-3xl font-black text-emerald-400">
                <AnimatedNumberTicker value={100} suffix="%" />
              </span>
              <span className="text-[11px] sm:text-xs text-slate-300 font-medium mt-1 block">
                {language === 'ar' ? 'اعتماد دولي JCI & LEED' : language === 'fr' ? 'Certifications JCI & LEED' : 'International Certifications'}
              </span>
            </div>
            <div className="bg-white/10 backdrop-blur-md border border-white/10 rounded-2xl p-3.5 sm:p-5 text-center transition-all hover:bg-white/15">
              <span className="block text-2xl sm:text-3xl font-black text-amber-300">
                <AnimatedNumberTicker value={100} prefix="+" />
              </span>
              <span className="text-[11px] sm:text-xs text-slate-300 font-medium mt-1 block">
                {language === 'ar' ? 'بروفيسوراً واستشارياً' : language === 'fr' ? 'Professeurs & Spécialistes' : 'Board-Certified Faculty'}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-7 relative z-20">
        {/* ─── Mode Tabs Switcher ─── */}
        <div className="flex justify-center mb-8">
          <div className="bg-white/95 dark:bg-slate-900/95 backdrop-blur-md p-1.5 rounded-2xl sm:rounded-full shadow-xl shadow-slate-900/10 dark:shadow-none border border-slate-200/80 dark:border-slate-800 inline-flex items-center gap-1.5 max-w-full">
            <button
              onClick={() => setActiveTab('grid')}
              className={`px-5 sm:px-6 py-2.5 rounded-full text-xs sm:text-sm font-extrabold transition-all duration-300 flex items-center gap-2 cursor-pointer ${
                activeTab === 'grid'
                  ? 'bg-gradient-to-r from-[#032654] to-[#0097FB] text-white shadow-md shadow-[#0097FB]/30 scale-[1.02]'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100/80 dark:hover:bg-slate-800'
              }`}
            >
              <Building2 className="w-4 h-4" />
              <span>{content.finderTabHospitals}</span>
              <span
                className={`text-[10px] px-2 py-0.5 rounded-full font-bold transition-colors ${
                  activeTab === 'grid'
                    ? 'bg-white/20 text-white'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
                }`}
              >
                {hospitals?.length || 11}
              </span>
            </button>
            <button
              onClick={() => setActiveTab('matcher')}
              className={`px-5 sm:px-6 py-2.5 rounded-full text-xs sm:text-sm font-extrabold transition-all duration-300 flex items-center gap-2 cursor-pointer ${
                activeTab === 'matcher'
                  ? 'bg-gradient-to-r from-[#032654] to-[#0097FB] text-white shadow-md shadow-[#0097FB]/30 scale-[1.02]'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100/80 dark:hover:bg-slate-800'
              }`}
            >
              <Compass className="w-4 h-4" />
              <span>{content.finderTabMatcher}</span>
            </button>
          </div>
        </div>

        {/* ══════════════════════════════════════════════════════════
            TAB 1: ALL HOSPITALS (GRID & SPECIALTY EXPLORER)
        ══════════════════════════════════════════════════════════ */}
        {activeTab === 'grid' && (
          <div className="space-y-8 animate-in fade-in duration-300">
            {/* Search and Filters Card */}
            <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-xl shadow-slate-200/50 dark:shadow-none border border-slate-200/80 dark:border-slate-800 p-5 sm:p-7 space-y-5">
              {/* Top Row: Search Input */}
              <div className="relative">
                <div className="absolute inset-y-0 start-4 flex items-center pointer-events-none text-slate-400">
                  <Search className="w-5 h-5 text-[#0097FB]" />
                </div>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={content.searchPlaceholder}
                  className="w-full bg-slate-50/80 dark:bg-slate-800/80 hover:bg-slate-100/60 dark:hover:bg-slate-800 focus:bg-white dark:focus:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:border-[#0097FB] rounded-2xl py-3.5 ps-12 pe-12 text-sm text-slate-800 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-4 focus:ring-[#0097FB]/10 transition-all shadow-inner"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute inset-y-0 end-4 flex items-center text-slate-400 hover:text-slate-600 cursor-pointer"
                    aria-label="Clear search"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>

              {/* Middle Row: 3 Structured Dropdown Selectors */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5 pt-1">
                {/* 1. Location / City */}
                <div className="bg-slate-50/80 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80 rounded-2xl p-3 hover:border-[#0097FB]/40 dark:hover:border-sky-500/50 transition-colors">
                  <FilterDropdown
                    id="city"
                    label={content.filterByCity}
                    icon={MapPin}
                    value={selectedCity}
                    options={cityOptions}
                    onChange={setSelectedCity}
                    isOpen={openDropdown === 'city'}
                    onToggle={() => toggleDropdown('city')}
                  />
                </div>

                {/* 2. Medical Specialty */}
                <div className="bg-slate-50/80 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80 rounded-2xl p-3 hover:border-[#0097FB]/40 dark:hover:border-sky-500/50 transition-colors">
                  <FilterDropdown
                    id="specialty"
                    label={content.filterBySpecialty}
                    icon={Stethoscope}
                    value={selectedSpecialty}
                    options={specialtyOptions}
                    onChange={setSelectedSpecialty}
                    isOpen={openDropdown === 'specialty'}
                    onToggle={() => toggleDropdown('specialty')}
                  />
                </div>

                {/* 3. Accreditation */}
                <div className="bg-slate-50/80 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80 rounded-2xl p-3 hover:border-emerald-500/40 dark:hover:border-emerald-400/50 transition-colors">
                  <FilterDropdown
                    id="accreditation"
                    label={content.filterByAccreditation}
                    icon={ShieldCheck}
                    value={selectedAccreditation}
                    options={accreditationOptions}
                    onChange={setSelectedAccreditation}
                    isOpen={openDropdown === 'accreditation'}
                    onToggle={() => toggleDropdown('accreditation')}
                  />
                </div>
              </div>

              {/* Tertiary Row: Quick Popular Filter Pills (Horizontal non-wrapping slider) */}
              <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center gap-2 overflow-hidden">
                <span className="text-[11px] font-bold text-slate-400 dark:text-slate-500 flex items-center gap-1 flex-shrink-0">
                  <Sparkles className="w-3 h-3 text-[#0097FB]" />
                  <span>{content.quickFiltersLabel}</span>
                </span>
                <div className="flex items-center gap-1.5 overflow-x-auto py-1 text-xs no-scrollbar flex-1">
                  {/* All */}
                  <button
                    onClick={handleResetFilters}
                    className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap transition-all duration-200 cursor-pointer ${
                      selectedCity === 'all' && selectedSpecialty === 'all' && selectedAccreditation === 'all' && !searchQuery
                        ? 'bg-[#032654] dark:bg-sky-500 text-white shadow-sm'
                        : 'bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    {language === 'ar' ? 'الكل' : language === 'fr' ? 'Tous' : 'All'} ({hospitals?.length || 11})
                  </button>

                  {/* Istanbul Europe */}
                  <button
                    onClick={() => setSelectedCity(selectedCity === 'istanbul-europe' ? 'all' : 'istanbul-europe')}
                    className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap transition-all duration-200 cursor-pointer ${
                      selectedCity === 'istanbul-europe'
                        ? 'bg-[#0097FB] text-white shadow-sm'
                        : 'bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    {content.cityEurope}
                  </button>

                  {/* Istanbul Asia */}
                  <button
                    onClick={() => setSelectedCity(selectedCity === 'istanbul-asia' ? 'all' : 'istanbul-asia')}
                    className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap transition-all duration-200 cursor-pointer ${
                      selectedCity === 'istanbul-asia'
                        ? 'bg-[#0097FB] text-white shadow-sm'
                        : 'bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    {content.cityAsia}
                  </button>

                  {/* Ankara */}
                  <button
                    onClick={() => setSelectedCity(selectedCity === 'ankara' ? 'all' : 'ankara')}
                    className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap transition-all duration-200 cursor-pointer ${
                      selectedCity === 'ankara'
                        ? 'bg-[#0097FB] text-white shadow-sm'
                        : 'bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    {content.cityAnkara}
                  </button>

                  {/* JCI */}
                  <button
                    onClick={() => setSelectedAccreditation(selectedAccreditation === 'JCI' ? 'all' : 'JCI')}
                    className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap transition-all duration-200 cursor-pointer ${
                      selectedAccreditation === 'JCI'
                        ? 'bg-emerald-600 text-white shadow-sm'
                        : 'bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    JCI
                  </button>

                  {/* Cardiology */}
                  <button
                    onClick={() => setSelectedSpecialty(selectedSpecialty === 'cardiac-surgery' ? 'all' : 'cardiac-surgery')}
                    className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap transition-all duration-200 cursor-pointer ${
                      selectedSpecialty === 'cardiac-surgery'
                        ? 'bg-[#0097FB] text-white shadow-sm'
                        : 'bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    {language === 'ar' ? 'جراحة القلب' : language === 'fr' ? 'Chirurgie Cardiaque' : 'Cardiac Surgery'}
                  </button>

                  {/* Oncology */}
                  <button
                    onClick={() => setSelectedSpecialty(selectedSpecialty === 'oncology' ? 'all' : 'oncology')}
                    className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap transition-all duration-200 cursor-pointer ${
                      selectedSpecialty === 'oncology'
                        ? 'bg-[#0097FB] text-white shadow-sm'
                        : 'bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    {language === 'ar' ? 'علاج الأورام' : language === 'fr' ? 'Oncologie' : 'Oncology'}
                  </button>

                  {/* Orthopedics */}
                  <button
                    onClick={() => setSelectedSpecialty(selectedSpecialty === 'orthopedics' ? 'all' : 'orthopedics')}
                    className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap transition-all duration-200 cursor-pointer ${
                      selectedSpecialty === 'orthopedics'
                        ? 'bg-[#0097FB] text-white shadow-sm'
                        : 'bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    {language === 'ar' ? 'جراحة العظام' : language === 'fr' ? 'Orthopédie' : 'Orthopedics'}
                  </button>
                </div>
              </div>

              {/* Status Bar: Live counter & Active Filter Badges */}
              <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-100 dark:border-slate-800 text-xs">
                {/* Result count with pulsating green indicator */}
                <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400 font-medium">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                  </span>
                  <span>
                    {content.showing}{' '}
                    <strong className="text-slate-900 dark:text-white font-bold">{filteredHospitals.length}</strong>{' '}
                    {content.of}{' '}
                    <strong className="text-slate-900 dark:text-white font-bold">{hospitals?.length || 11}</strong>{' '}
                    {content.hospitalsCountLabel}
                  </span>
                </div>

                {/* Active Filter Badges and Reset button */}
                <div className="flex flex-wrap items-center gap-2">
                  {selectedCity !== 'all' && (
                    <span className="inline-flex items-center gap-1 bg-[#032654]/10 dark:bg-sky-500/20 text-[#032654] dark:text-sky-300 font-bold px-2.5 py-1 rounded-lg text-[11px] border border-transparent dark:border-sky-500/30">
                      <span>{cityOptions.find((c) => c.id === selectedCity)?.label}</span>
                      <button onClick={() => setSelectedCity('all')} className="hover:text-red-500 cursor-pointer" aria-label="Remove city filter">
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  )}

                  {selectedSpecialty !== 'all' && (
                    <span className="inline-flex items-center gap-1 bg-[#0097FB]/10 dark:bg-sky-500/20 text-[#0097FB] dark:text-sky-300 font-bold px-2.5 py-1 rounded-lg text-[11px] border border-transparent dark:border-sky-500/30">
                      <span>{specialtyOptions.find((s) => s.id === selectedSpecialty)?.label}</span>
                      <button onClick={() => setSelectedSpecialty('all')} className="hover:text-red-500 cursor-pointer" aria-label="Remove specialty filter">
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  )}

                  {selectedAccreditation !== 'all' && (
                    <span className="inline-flex items-center gap-1 bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 font-bold px-2.5 py-1 rounded-lg text-[11px] border border-transparent dark:border-emerald-500/30">
                      <span>{accreditationOptions.find((a) => a.id === selectedAccreditation)?.label}</span>
                      <button onClick={() => setSelectedAccreditation('all')} className="hover:text-red-500 cursor-pointer" aria-label="Remove accreditation filter">
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  )}

                  {searchQuery && (
                    <span className="inline-flex items-center gap-1 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold px-2.5 py-1 rounded-lg text-[11px] border border-transparent dark:border-slate-700">
                      <span>"{searchQuery}"</span>
                      <button onClick={() => setSearchQuery('')} className="hover:text-red-500 cursor-pointer" aria-label="Clear search text">
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  )}

                  {(selectedCity !== 'all' ||
                    selectedSpecialty !== 'all' ||
                    selectedAccreditation !== 'all' ||
                    searchQuery) && (
                    <button
                      onClick={handleResetFilters}
                      className="inline-flex items-center gap-1 text-xs font-bold text-slate-500 dark:text-slate-400 hover:text-red-500 dark:hover:text-red-400 transition-colors ps-2 cursor-pointer"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span>{content.clearAllFilters}</span>
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Hospitals Cards Grid */}
            {filteredHospitals.length === 0 ? (
              <div className="bg-white dark:bg-slate-900 rounded-3xl p-12 text-center max-w-lg mx-auto shadow-sm border border-slate-100 dark:border-slate-800 space-y-4">
                <div className="w-16 h-16 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-400 flex items-center justify-center mx-auto">
                  <Building2 className="w-8 h-8 text-[#0097FB]" />
                </div>
                <h3 className="text-lg font-bold text-slate-800 dark:text-white">{content.noResults}</h3>
                <button
                  onClick={handleResetFilters}
                  className="bg-[#0097FB] text-white text-xs font-bold py-2 px-5 rounded-full hover:bg-[#032654] dark:hover:bg-sky-600 transition-colors cursor-pointer"
                >
                  {content.resetFilters}
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
                {filteredHospitals.map((hosp, idx) => {
                  const doctorsCountForHosp = (doctors || []).filter(
                    (doc) => doc.hospitalId === hosp.id
                  ).length;

                  const hospTechnologies = hosp.technologies?.[language] || hosp.technologies?.en || [
                    language === 'ar' ? 'روبوت دافنشي الجراحي' : 'Da Vinci Robotic Surgery',
                    language === 'ar' ? 'رنين مغناطيسي 3 تسلا' : '3T MRI',
                  ];

                  return (
                    <motion.div
                      key={hosp.id}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true, margin: '-40px' }}
                      transition={{
                        type: 'spring',
                        stiffness: 340,
                        damping: 26,
                        delay: (idx % 3) * 0.08,
                      }}
                      whileHover={{ y: -5, transition: { duration: 0.2 } }}
                      className="group bg-white dark:bg-slate-900 rounded-3xl overflow-hidden shadow-sm hover:shadow-xl border border-slate-200/80 dark:border-slate-800 hover:border-[#0097FB]/40 dark:hover:border-sky-500/40 transition-colors duration-300 flex flex-col justify-between"
                    >
                      {/* Image & Badges Banner */}
                      <div className="relative h-56 sm:h-60 overflow-hidden bg-slate-900">
                        <img
                          src={hosp.image || '/images/hospitals/acibadem-altunizade.jpg'}
                          alt={hosp.name?.[language] || hosp.name?.en || 'Hospital'}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                          loading="lazy"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-950/30 to-transparent" />

                        {/* Top Badges */}
                        <div className="absolute top-3 left-3 right-3 flex items-center justify-between gap-2 pointer-events-none">
                          <span className="inline-flex items-center gap-1 bg-[#032654]/90 backdrop-blur-md text-white text-[11px] font-bold px-3 py-1 rounded-full shadow-md border border-white/10">
                            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                            <span>{hosp.accreditationBadge || 'JCI'}</span>
                          </span>

                          <span className="inline-flex items-center gap-1 bg-amber-500/90 backdrop-blur-md text-white text-[11px] font-bold px-2.5 py-1 rounded-full shadow-md">
                            <Star className="w-3 h-3 fill-current" />
                            <span>{hosp.rating || 4.9}</span>
                          </span>
                        </div>

                        {/* Bottom Name & City in Image */}
                        <div className="absolute bottom-3 left-4 right-4 text-white">
                          <h3 className="font-extrabold text-base sm:text-lg leading-snug drop-shadow-sm mb-1 line-clamp-2">
                            {hosp.name?.[language] || hosp.name?.en || 'Hospital'}
                          </h3>
                          <p className="text-xs text-slate-300 flex items-center gap-1.5 drop-shadow-sm">
                            <MapPin className="w-3.5 h-3.5 text-[#00BFFF] flex-shrink-0" />
                            <span>{hosp.city?.[language] || hosp.city?.en || 'Istanbul'}</span>
                          </p>
                        </div>
                      </div>

                      {/* Content Body */}
                      <div className="p-5 sm:p-6 space-y-4 flex-1 flex flex-col justify-between">
                        <div className="space-y-3">
                          {/* Hospital Type */}
                          <div className="text-xs font-semibold text-[#0097FB] dark:text-sky-300 bg-[#EAF6FF] dark:bg-sky-950/50 px-3 py-1 rounded-xl inline-block">
                            {hosp.type?.[language] || hosp.type?.en || 'Academic Medical Center'}
                          </div>

                          {/* Description snippet */}
                          <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed line-clamp-3">
                            {hosp.description?.[language] || hosp.description?.en || ''}
                          </p>

                          {/* Key Metrics Chips */}
                          <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-100 dark:border-slate-800 text-center">
                            <div className="bg-slate-50 dark:bg-slate-800/70 p-2 rounded-xl">
                              <span className="block text-xs font-black text-slate-900 dark:text-white">
                                {hosp.bedsCount ?? 250}
                              </span>
                              <span className="text-[10px] text-slate-500 dark:text-slate-400 font-medium">
                                {content.bedsCount}
                              </span>
                            </div>
                            <div className="bg-slate-50 dark:bg-slate-800/70 p-2 rounded-xl">
                              <span className="block text-xs font-black text-slate-900 dark:text-white">
                                {hosp.operatingRoomsCount ?? 12}
                              </span>
                              <span className="text-[10px] text-slate-500 dark:text-slate-400 font-medium">
                                {content.operatingRooms}
                              </span>
                            </div>
                            <div className="bg-slate-50 dark:bg-slate-800/70 p-2 rounded-xl">
                              <span className="block text-xs font-black text-slate-900 dark:text-white">
                                {hosp.establishedYear ?? 2012}
                              </span>
                              <span className="text-[10px] text-slate-500 dark:text-slate-400 font-medium">
                                {content.establishedYear}
                              </span>
                            </div>
                          </div>

                          {/* Key Technologies Tags */}
                          <div>
                            <span className="text-[11px] font-bold text-slate-400 dark:text-slate-500 block mb-1.5">
                              {content.keyTechnologies}:
                            </span>
                            <div className="flex flex-wrap gap-1.5">
                              {hospTechnologies.slice(0, 3).map((tech, tIdx) => (
                                <span
                                  key={tIdx}
                                  className="text-[10px] bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 px-2.5 py-0.5 rounded-lg font-medium"
                                >
                                  {tech}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="pt-4 border-t border-slate-100 dark:border-slate-800 space-y-2">
                          {/* Explore Doctors button */}
                          <button
                            onClick={() => {
                              setSelectedHospital(hosp);
                              setHospitalSpecialtyFilter('all');
                            }}
                            className="w-full flex items-center justify-center gap-2 bg-[#032654] hover:bg-[#0097FB] dark:bg-sky-600 dark:hover:bg-sky-500 text-white font-bold py-2.5 px-4 rounded-xl shadow-sm transition-all duration-200 text-xs sm:text-sm cursor-pointer group-hover:shadow-md"
                          >
                            <Stethoscope className="w-4 h-4 text-[#00BFFF] dark:text-white" />
                            <span>{content.viewHospitalDoctors}</span>
                            <ArrowIcon className="w-4 h-4 opacity-75" />
                          </button>

                          {/* Direct WhatsApp button */}
                          <a
                            href={getWhatsAppHospitalLink(hosp)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-full flex items-center justify-center gap-2 bg-emerald-50 dark:bg-emerald-950/40 hover:bg-emerald-100 dark:hover:bg-emerald-900/50 text-emerald-700 dark:text-emerald-300 border border-emerald-200/80 dark:border-emerald-800/60 font-bold py-2 px-4 rounded-xl transition-all duration-200 text-xs cursor-pointer"
                          >
                            <MessageCircle className="w-3.5 h-3.5 fill-current text-emerald-600 dark:text-emerald-400" />
                            <span>{content.whatsappInquiry}</span>
                          </a>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* ══════════════════════════════════════════════════════════
            TAB 2: DIRECT DOCTOR & SPECIALTY MATCHER
        ══════════════════════════════════════════════════════════ */}
        {activeTab === 'matcher' && (
          <div className="space-y-8 animate-in fade-in duration-300">
            {/* Matcher Box Header */}
            <div className="bg-gradient-to-r from-[#032654] to-[#0a488a] text-white rounded-3xl p-6 sm:p-10 shadow-xl border border-white/10">
              <div className="max-w-2xl mb-8">
                <span className="text-xs font-bold uppercase tracking-wider text-[#00BFFF] bg-[#0097FB]/20 px-3 py-1 rounded-full inline-block mb-3">
                  {language === 'ar'
                    ? 'البحث والتنسيق الطبي المباشر'
                    : language === 'fr'
                    ? 'Recherche Directe & Coordination Médicale'
                    : 'Direct Specialist Matching'}
                </span>
                <h2 className="text-2xl sm:text-3xl font-black mb-2">
                  {content.matcherTitle}
                </h2>
                <p className="text-xs sm:text-sm text-slate-200 leading-relaxed">
                  {content.matcherSubtitle}
                </p>
              </div>

              {/* Selector Controls */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* 1. Hospital Selector */}
                <FilterDropdown
                  id="matcher-hospital"
                  label={content.selectHospitalLabel}
                  icon={Building2}
                  value={matcherHospitalId}
                  options={matcherHospitalOptions}
                  onChange={setMatcherHospitalId}
                  isOpen={openDropdown === 'matcher-hospital'}
                  onToggle={() => toggleDropdown('matcher-hospital')}
                  variant="dark"
                />

                {/* 2. Specialty Selector */}
                <FilterDropdown
                  id="matcher-specialty"
                  label={content.selectSpecialtyLabel}
                  icon={Stethoscope}
                  value={matcherSpecialtySlug}
                  options={specialtyOptions}
                  onChange={setMatcherSpecialtySlug}
                  isOpen={openDropdown === 'matcher-specialty'}
                  onToggle={() => toggleDropdown('matcher-specialty')}
                  variant="dark"
                />
              </div>

              <div className="mt-6 flex items-center justify-between text-xs text-slate-300 pt-4 border-t border-white/10">
                <span>
                  {content.showing} <strong className="text-white">{matchedDoctors.length}</strong>{' '}
                  {content.matchedDoctorsFound}
                </span>
                {(matcherHospitalId !== 'all' || matcherSpecialtySlug !== 'all') && (
                  <button
                    onClick={() => {
                      setMatcherHospitalId('all');
                      setMatcherSpecialtySlug('all');
                    }}
                    className="text-[#00BFFF] hover:underline font-bold cursor-pointer"
                  >
                    {content.resetFilters}
                  </button>
                )}
              </div>
            </div>

            {/* Matched Doctors Cards Grid */}
            {matchedDoctors.length === 0 ? (
              <div className="bg-white dark:bg-slate-900 rounded-3xl p-10 text-center max-w-md mx-auto shadow-sm border border-slate-100 dark:border-slate-800 space-y-4">
                <div className="w-16 h-16 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-400 flex items-center justify-center mx-auto">
                  <Stethoscope className="w-8 h-8 text-[#0097FB]" />
                </div>
                <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
                  {language === 'ar'
                    ? 'لم يتم العثور على أطباء بهذا التخصص في هذا المستشفى المحدد'
                    : language === 'fr'
                    ? 'Aucun médecin trouvé pour cette spécialité dans cet hôpital'
                    : 'No doctors found for this specialty in this hospital'}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {language === 'ar'
                    ? 'يمكن لفريقنا الطبي مراجعة حالتك واقتراح استشاري متخصص متاح فوراً.'
                    : language === 'fr'
                    ? 'Notre équipe médicale peut examiner votre dossier et vous recommander un spécialiste disponible.'
                    : 'Our medical team can review your case and connect you directly with an available specialist.'}
                </p>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-2 pt-2">
                  <button
                    onClick={() => {
                      setMatcherHospitalId('all');
                      setMatcherSpecialtySlug('all');
                    }}
                    className="w-full sm:w-auto bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-bold py-2.5 px-4 rounded-xl transition-colors cursor-pointer"
                  >
                    {content.resetFilters}
                  </button>
                  <a
                    href="https://wa.me/905442822769?text=Hello%20AVICINNA%2C%20I%20need%20a%20specialist%20consultation"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full sm:w-auto bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-bold py-2.5 px-4 rounded-xl transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-sm"
                  >
                    <MessageCircle className="w-3.5 h-3.5 fill-current" />
                    <span>{content.whatsappInquiry}</span>
                  </a>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {matchedDoctors.map((doc) => (
                <div
                  key={doc.id}
                  className="bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-sm border border-slate-200/80 dark:border-slate-800 hover:shadow-xl hover:border-[#0097FB]/40 dark:hover:border-sky-500/40 transition-all duration-300 flex flex-col justify-between"
                >
                  <div className="space-y-4">
                    {/* Doctor Header (Photo + Title) */}
                    <div className="flex items-start gap-4">
                      <Link
                        href={`/doctors/${doc.slug}`}
                        className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-2xl overflow-hidden bg-slate-100 dark:bg-slate-800 flex-shrink-0 border-2 border-[#0097FB]/20 hover:opacity-90 transition-opacity block cursor-pointer"
                      >
                        <img
                          src={doc.image}
                          alt={doc.name?.[language] || doc.name?.en || 'Doctor'}
                          className="w-full h-full object-cover"
                        />
                        <span className="absolute bottom-1 right-1 w-3.5 h-3.5 bg-emerald-500 border-2 border-white rounded-full" />
                      </Link>
                      <div className="flex-1">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-[#0097FB] dark:text-sky-300 bg-[#EAF6FF] dark:bg-sky-950/50 px-2.5 py-0.5 rounded-full inline-block mb-1">
                          {doc.specialtyName?.[language] || doc.specialtyName?.en}
                        </span>
                        <h4 className="font-extrabold text-slate-900 dark:text-white text-sm sm:text-base leading-tight">
                          <Link
                            href={`/doctors/${doc.slug}`}
                            className="hover:text-[#0097FB] dark:hover:text-sky-400 transition-colors"
                          >
                            {doc.name?.[language] || doc.name?.en}
                          </Link>
                        </h4>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-1 mt-0.5">
                          {doc.title?.[language] || doc.title?.en}
                        </p>
                      </div>
                    </div>

                    {/* Hospital Tag */}
                    <div className="flex items-center gap-2 text-xs text-slate-700 dark:text-slate-300 bg-slate-50 dark:bg-slate-800/70 p-2.5 rounded-xl border border-slate-100 dark:border-slate-700/60">
                      <Building2 className="w-4 h-4 text-[#0097FB] flex-shrink-0" />
                      <span className="font-semibold line-clamp-1">
                        {doc.hospital?.[language] || doc.hospital?.en}
                      </span>
                    </div>

                    {/* Stats */}
                    <div className="flex items-center justify-between text-xs text-slate-600 dark:text-slate-400 px-1">
                      <span className="flex items-center gap-1 font-semibold">
                        <Clock className="w-3.5 h-3.5 text-slate-400" />
                        {doc.experienceYears} {content.experienceYears}
                      </span>
                      <span className="flex items-center gap-1 font-bold text-amber-500">
                        <Star className="w-3.5 h-3.5 fill-current text-amber-400" />
                        {doc.rating} ({doc.reviewCount})
                      </span>
                    </div>

                    {/* Key Procedures Chips */}
                    <div>
                      <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 block mb-1">
                        {content.procedures}:
                      </span>
                      <div className="flex flex-wrap gap-1">
                        {(doc.procedures?.[language] || doc.procedures?.en || []).slice(0, 2).map((proc, idx) => (
                          <span
                            key={idx}
                            className="text-[10px] bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 px-2 py-0.5 rounded-md"
                          >
                            {proc}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="pt-4 mt-4 border-t border-slate-100 dark:border-slate-800 space-y-2">
                    <Link
                      href={`/doctors/${doc.slug}`}
                      className="w-full bg-slate-100 dark:bg-slate-800 hover:bg-[#0097FB] dark:hover:bg-sky-600 hover:text-white dark:hover:text-white text-slate-800 dark:text-slate-200 text-xs font-bold py-2 rounded-xl transition-colors cursor-pointer block text-center"
                    >
                      {content.viewDoctorProfile}
                    </Link>
                    <a
                      href={getWhatsAppDoctorLink(doc)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full flex items-center justify-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-2 px-3 rounded-xl shadow-sm text-xs transition-colors cursor-pointer"
                    >
                      <MessageCircle className="w-3.5 h-3.5 fill-current" />
                      <span>{content.consultDoctorWhatsapp}</span>
                    </a>
                  </div>
                </div>
              ))}
            </div>
            )}
          </div>
        )}
      </div>

      {/* ══════════════════════════════════════════════════════════
          MODAL: SELECTED HOSPITAL DETAIL DRAWER / POPUP
      ══════════════════════════════════════════════════════════ */}
      {selectedHospital && (
        <div
          className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 overflow-y-auto animate-in fade-in duration-200"
          onClick={() => setSelectedHospital(null)}
        >
          <div
            className="bg-white dark:bg-slate-900 rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-100 dark:border-slate-800 overflow-hidden text-slate-900 dark:text-white animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
            dir={isRtl ? 'rtl' : 'ltr'}
          >
            {/* Modal Header Image Banner */}
            <div className="relative h-64 sm:h-72 overflow-hidden bg-slate-900">
              <img
                src={selectedHospital.image || '/images/hospitals/acibadem-altunizade.jpg'}
                alt={selectedHospital.name?.[language] || selectedHospital.name?.en || 'Hospital'}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />

              {/* Close Button */}
              <button
                onClick={() => setSelectedHospital(null)}
                className="absolute top-4 right-4 rtl:right-auto rtl:left-4 w-9 h-9 rounded-full bg-black/60 hover:bg-black text-white flex items-center justify-center transition-colors cursor-pointer"
                aria-label="Close"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Title & City in Banner */}
              <div className="absolute bottom-4 left-6 right-6 text-white space-y-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="bg-emerald-500 text-white text-[11px] font-bold px-3 py-0.5 rounded-full shadow-sm">
                    {selectedHospital.accreditationBadge || 'JCI'}
                  </span>
                  <span className="bg-white/20 backdrop-blur-md text-slate-200 text-[11px] font-medium px-3 py-0.5 rounded-full">
                    {selectedHospital.city?.[language] || selectedHospital.city?.en || 'Istanbul'}
                  </span>
                </div>
                <h2 className="text-xl sm:text-3xl font-black leading-tight drop-shadow-sm">
                  {selectedHospital.name?.[language] || selectedHospital.name?.en || 'Hospital'}
                </h2>
                <p className="text-xs sm:text-sm text-slate-300 flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-[#00BFFF]" />
                  <span>
                    {selectedHospital.address?.[language] ||
                      selectedHospital.address?.en ||
                      selectedHospital.city?.[language] ||
                      ''}
                  </span>
                </p>
              </div>
            </div>

            {/* Modal Body */}
            <div className="p-6 sm:p-8 space-y-8">
              {/* Overview & Key Stats */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
                <div className="bg-slate-50 dark:bg-slate-800/70 p-3 rounded-2xl border border-slate-100 dark:border-slate-700/60">
                  <span className="block text-xl font-black text-slate-900 dark:text-white">
                    {selectedHospital.bedsCount ?? 250}
                  </span>
                  <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">{content.bedsCount}</span>
                </div>
                <div className="bg-slate-50 dark:bg-slate-800/70 p-3 rounded-2xl border border-slate-100 dark:border-slate-700/60">
                  <span className="block text-xl font-black text-[#0097FB]">
                    {selectedHospital.icuBedsCount ?? 50}
                  </span>
                  <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">{content.icuCount}</span>
                </div>
                <div className="bg-slate-50 dark:bg-slate-800/70 p-3 rounded-2xl border border-slate-100 dark:border-slate-700/60">
                  <span className="block text-xl font-black text-slate-900 dark:text-white">
                    {selectedHospital.operatingRoomsCount ?? 12}
                  </span>
                  <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                    {content.operatingRooms}
                  </span>
                </div>
                <div className="bg-slate-50 dark:bg-slate-800/70 p-3 rounded-2xl border border-slate-100 dark:border-slate-700/60">
                  <span className="block text-xl font-black text-slate-900 dark:text-white">
                    {selectedHospital.establishedYear ?? 2012}
                  </span>
                  <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                    {content.establishedYear}
                  </span>
                </div>
              </div>

              {/* Description */}
              <div>
                <h4 className="font-bold text-base text-slate-900 dark:text-white mb-2">
                  {language === 'ar' ? 'نبذة عن المستشفى' : 'About the Hospital'}
                </h4>
                <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                  {selectedHospital.description?.[language] || selectedHospital.description?.en || ''}
                </p>
              </div>

              {/* Technologies List */}
              <div>
                <h4 className="font-bold text-sm text-slate-900 dark:text-white uppercase tracking-wide mb-3 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-[#0097FB]" />
                  <span>{content.keyTechnologies}</span>
                </h4>
                <div className="flex flex-wrap gap-2">
                  {(
                    selectedHospital.technologies?.[language] ||
                    selectedHospital.technologies?.en || [
                      language === 'ar' ? 'روبوت دافنشي الجراحي' : 'Da Vinci Robotic Surgery',
                      language === 'ar' ? 'رنين مغناطيسي 3 تسلا' : '3T MRI',
                    ]
                  ).map((tech, idx) => (
                    <span
                      key={idx}
                      className="text-xs font-semibold bg-[#EAF6FF] dark:bg-sky-950/50 text-[#0097FB] dark:text-sky-300 border border-[#0097FB]/20 dark:border-sky-800/40 px-3 py-1.5 rounded-xl flex items-center gap-1.5"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#0097FB]" />
                      <span>{tech}</span>
                    </span>
                  ))}
                </div>
              </div>

              {/* ─── In-Hospital Specialty Filter & Doctors Section ─── */}
              <div className="pt-6 border-t border-slate-200 dark:border-slate-800">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
                  <div>
                    <h3 className="text-xl font-extrabold text-slate-900 dark:text-white">
                      {content.doctorsInHospital}
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      {content.filterHospitalDoctorsBySpecialty}
                    </p>
                  </div>

                  {/* WhatsApp consultation CTA for this hospital */}
                  <a
                    href={getWhatsAppHospitalLink(selectedHospital)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs py-2 px-4 rounded-xl shadow-md transition-colors"
                  >
                    <MessageCircle className="w-4 h-4 fill-current" />
                    <span>{content.bookConsultation}</span>
                  </a>
                </div>

                {/* Specialty Tabs within Hospital */}
                <div className="flex flex-wrap gap-2 mb-6">
                  <button
                    onClick={() => setHospitalSpecialtyFilter('all')}
                    className={`text-xs font-bold px-3.5 py-1.5 rounded-full transition-colors ${
                      hospitalSpecialtyFilter === 'all'
                        ? 'bg-[#0097FB] text-white shadow-sm'
                        : 'bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    {content.allHospitalSpecialties}
                  </button>
                  {treatments
                    .filter((tr) => (selectedHospital.specialties || []).includes(tr.slug))
                    .map((tr) => (
                      <button
                        key={tr.slug}
                        onClick={() => setHospitalSpecialtyFilter(tr.slug)}
                        className={`text-xs font-semibold px-3.5 py-1.5 rounded-full transition-colors ${
                          hospitalSpecialtyFilter === tr.slug
                            ? 'bg-[#0097FB] text-white shadow-sm'
                            : 'bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300'
                        }`}
                      >
                        {tr.title?.[language] || tr.title?.en}
                      </button>
                    ))}
                </div>

                {/* Hospital Doctors List */}
                {hospitalDoctors.length === 0 ? (
                  <div className="bg-slate-50 dark:bg-slate-800/60 rounded-2xl p-8 text-center text-slate-500 dark:text-slate-400 text-xs">
                    {language === 'ar'
                      ? 'لدينا استشاريون إضافيون متاحون في هذا التخصص، يرجى التواصل معنا عبر واتساب لربطك بهم.'
                      : 'Additional senior specialists are available on request. Please contact us via WhatsApp.'}
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {hospitalDoctors.map((doc) => (
                      <div
                        key={doc.id}
                        className="bg-slate-50 dark:bg-slate-800/70 rounded-2xl p-5 border border-slate-100 dark:border-slate-700/60 hover:border-[#0097FB]/40 dark:hover:border-sky-500/40 transition-all flex flex-col justify-between space-y-4"
                      >
                        <div className="space-y-3">
                          <div className="flex items-start gap-3.5">
                            <Link href={`/doctors/${doc.slug}`} className="flex-shrink-0 block cursor-pointer">
                              <img
                                src={doc.image}
                                alt={doc.name?.[language] || doc.name?.en || 'Doctor'}
                                className="w-16 h-16 rounded-2xl object-cover border-2 border-white dark:border-slate-700 shadow-sm hover:opacity-90 transition-opacity"
                              />
                            </Link>
                            <div>
                              <span className="text-[10px] font-bold text-[#0097FB] dark:text-sky-300 bg-[#EAF6FF] dark:bg-sky-950/50 px-2 py-0.5 rounded-md inline-block mb-1">
                                {doc.specialtyName?.[language] || doc.specialtyName?.en}
                              </span>
                              <h4 className="font-bold text-slate-900 dark:text-white text-sm leading-snug">
                                <Link
                                  href={`/doctors/${doc.slug}`}
                                  className="hover:text-[#0097FB] dark:hover:text-sky-400 transition-colors"
                                >
                                  {doc.name?.[language] || doc.name?.en}
                                </Link>
                              </h4>
                              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                                {doc.experienceYears} {content.experienceYears}
                              </p>
                            </div>
                          </div>

                          {/* Biography Preview */}
                          <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-2 leading-relaxed">
                            {doc.biography?.[language] || doc.biography?.en || ''}
                          </p>

                          {/* Education / Fellowships preview */}
                          <div className="text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-1.5 font-medium line-clamp-1">
                            <GraduationCap className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                            <span>
                              {(doc.education?.[language] || doc.education?.en || [])[0] || 'International Fellow'}
                            </span>
                          </div>
                        </div>

                        {/* Card Actions */}
                        <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-200/60 dark:border-slate-700/60">
                          <Link
                            href={`/doctors/${doc.slug}`}
                            className="text-xs font-bold bg-white dark:bg-slate-800 hover:bg-[#0097FB] dark:hover:bg-sky-600 hover:text-white dark:hover:text-white text-slate-800 dark:text-slate-200 py-2 px-3 rounded-xl border border-slate-200 dark:border-slate-700 hover:border-[#0097FB] transition-colors text-center cursor-pointer flex items-center justify-center"
                          >
                            <span>{content.viewDoctorProfile}</span>
                          </Link>
                          <a
                            href={getWhatsAppDoctorLink(doc, selectedHospital.name?.[language])}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs font-bold bg-emerald-500 hover:bg-emerald-600 text-white py-2 px-3 rounded-xl transition-colors flex items-center justify-center gap-1.5 text-center cursor-pointer"
                          >
                            <MessageCircle className="w-3 h-3 fill-current" />
                            <span>واتساب</span>
                          </a>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════
          MODAL: FULL DOCTOR CV & CREDENTIALS
      ══════════════════════════════════════════════════════════ */}
      {selectedDoctorForCv && (
        <div
          className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 overflow-y-auto animate-in fade-in duration-200"
          onClick={() => setSelectedDoctorForCv(null)}
        >
          <div
            className="bg-white dark:bg-slate-900 rounded-3xl max-w-2xl w-full max-h-[85vh] overflow-y-auto shadow-2xl border border-slate-100 dark:border-slate-800 p-6 sm:p-8 space-y-6 text-slate-900 dark:text-white animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
            dir={isRtl ? 'rtl' : 'ltr'}
          >
            {/* Header with Photo & Close */}
            <div className="flex items-start justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-5">
              <div className="flex items-start gap-4">
                <img
                  src={selectedDoctorForCv.image}
                  alt={selectedDoctorForCv.name?.[language] || selectedDoctorForCv.name?.en || 'Doctor'}
                  className="w-20 h-20 rounded-2xl object-cover border-2 border-[#0097FB]/20 shadow-md"
                />
                <div className="space-y-1">
                  <span className="text-xs font-bold text-[#0097FB] dark:text-sky-300 bg-[#EAF6FF] dark:bg-sky-950/50 px-2.5 py-0.5 rounded-full inline-block">
                    {selectedDoctorForCv.specialtyName?.[language] || selectedDoctorForCv.specialtyName?.en}
                  </span>
                  <h3 className="text-xl font-extrabold text-slate-900 dark:text-white">
                    {selectedDoctorForCv.name?.[language] || selectedDoctorForCv.name?.en}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                    {selectedDoctorForCv.title?.[language] || selectedDoctorForCv.title?.en}
                  </p>
                  <p className="text-xs text-slate-600 dark:text-slate-300 flex items-center gap-1">
                    <Building2 className="w-3.5 h-3.5 text-[#0097FB]" />
                    <span className="font-semibold">
                      {selectedDoctorForCv.hospital?.[language] || selectedDoctorForCv.hospital?.en}
                    </span>
                  </p>
                </div>
              </div>

              <button
                onClick={() => setSelectedDoctorForCv(null)}
                className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 flex items-center justify-center transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Biography */}
            <div>
              <h4 className="font-bold text-sm text-slate-900 dark:text-white mb-1.5">
                {language === 'ar' ? 'السيرة الطبية والمهنية' : 'Medical Biography'}
              </h4>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                {selectedDoctorForCv.biography?.[language] || selectedDoctorForCv.biography?.en || ''}
              </p>
            </div>

            {/* Core Procedures */}
            <div>
              <h4 className="font-bold text-xs uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-2">
                {content.procedures}
              </h4>
              <div className="flex flex-wrap gap-2">
                {(selectedDoctorForCv.procedures?.[language] || selectedDoctorForCv.procedures?.en || []).map(
                  (proc, idx) => (
                    <span
                      key={idx}
                      className="text-xs bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 font-medium px-3 py-1 rounded-lg"
                    >
                      {proc}
                    </span>
                  )
                )}
              </div>
            </div>

            {/* Education & Fellowships */}
            <div>
              <h4 className="font-bold text-xs uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-2">
                {content.education}
              </h4>
              <ul className="space-y-1.5 text-xs text-slate-700 dark:text-slate-300">
                {(selectedDoctorForCv.education?.[language] || selectedDoctorForCv.education?.en || []).map(
                  (edu, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <GraduationCap className="w-4 h-4 text-[#0097FB] flex-shrink-0 mt-0.5" />
                      <span>{edu}</span>
                    </li>
                  )
                )}
              </ul>
            </div>

            {/* Languages */}
            <div>
              <h4 className="font-bold text-xs uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-2">
                {content.languages}
              </h4>
              <div className="flex flex-wrap gap-2">
                {(selectedDoctorForCv.languages || ['English', 'Türkçe']).map((lang, idx) => (
                  <span
                    key={idx}
                    className="text-xs bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 border border-emerald-200/80 dark:border-emerald-800/60 px-2.5 py-1 rounded-md font-medium"
                  >
                    {lang}
                  </span>
                ))}
              </div>
            </div>

            {/* Modal Bottom CTA */}
            <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex flex-wrap items-center gap-3">
              <Link
                href={`/doctors/${selectedDoctorForCv.slug}`}
                className="py-3 px-4 rounded-xl bg-sky-50 dark:bg-sky-950/40 hover:bg-[#0097FB] text-[#0097FB] dark:text-sky-300 hover:text-white text-xs font-bold transition-colors text-center"
              >
                {content.viewDoctorProfile}
              </Link>
              <a
                href={getWhatsAppDoctorLink(selectedDoctorForCv)}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 flex items-center justify-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-3 px-4 rounded-xl shadow-md transition-colors text-sm"
              >
                <MessageCircle className="w-4 h-4 fill-current" />
                <span>{content.consultDoctorWhatsapp}</span>
              </a>
              <button
                onClick={() => setSelectedDoctorForCv(null)}
                className="py-3 px-5 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-bold text-slate-700 dark:text-slate-300 transition-colors"
              >
                {content.closeModal}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function HospitalsPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-slate-50 dark:bg-[#080E1A] flex items-center justify-center">
          <div className="w-8 h-8 rounded-full border-2 border-[#0097FB] border-t-transparent animate-spin" />
        </div>
      }
    >
      <HospitalsPageContent />
    </Suspense>
  );
}
