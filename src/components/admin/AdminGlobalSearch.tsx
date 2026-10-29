'use client';

import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useData } from '@/context/DataContext';
import { useLanguage } from '@/context/LanguageContext';
import {
  Search,
  Users,
  Building2,
  Stethoscope,
  BookOpen,
  Inbox,
  Settings,
  Layers,
  ArrowRight,
  ArrowLeft,
  X,
  Command,
  ChevronRight,
  ChevronLeft,
  Sparkles,
  ExternalLink,
  PhoneCall,
  Check,
} from 'lucide-react';

interface SearchResultItem {
  id: string;
  category: 'pages' | 'doctors' | 'hospitals' | 'treatments' | 'inquiries';
  title: string;
  subtitle: string;
  badge?: string;
  href: string;
  phone?: string;
}

const searchDict = {
  ar: {
    btnPlaceholder: 'البحث السريع في النظام (Ctrl + K)...',
    btnShort: 'بحث...',
    inputPlaceholder: 'ابحث عن طبيب، مستشفى، تخصص، هاتف، أو صفحة...',
    allTab: 'الكل',
    pagesTab: 'الصفحات',
    doctorsTab: 'الأطباء',
    hospitalsTab: 'المستشفيات',
    treatmentsTab: 'التخصصات',
    inquiriesTab: 'الاستشارات',
    suggestedHeading: 'اختصارات مقترحة وسريعة',
    noResults: 'لا توجد نتائج مطابقة لـ',
    noResultsSub: 'جرّب البحث باسم الطبيب، أو رقم الهاتف، أو اسم التخصص الطبي.',
    badgePage: 'PAGE',
    badgeDoctor: 'DOCTOR',
    badgeHospital: 'HOSPITAL',
    badgeTreatment: 'SURGERY',
    badgeNewLead: 'NEW LEAD',
    badgeLead: 'INQUIRY',
    resultsCount: (n: number) => `${n} نتائج`,
    hintNavigate: 'Navigate',
    hintOpen: 'Select',
    hintClose: 'Close',
    yearsExp: 'سنة خبرة',
    generalSpecialty: 'عام',
    systemName: 'AVICINNA GLOBAL SEARCH',
    pages: {
      overview: { title: 'لوحة التحكم والتحليلات', subtitle: 'نظرة عامة ومتابعة المرضى اللحظية' },
      sections: { title: 'محرر أقسام الموقع', subtitle: 'تعديل نصوص الهيرو والأرقام والمميزات' },
      hospitals: { title: 'إدارة المستشفيات الشريكة', subtitle: 'شبكة المستشفيات والمراكز المعتمدة JCI' },
      doctors: { title: 'إدارة الأطباء والاستشاريين', subtitle: 'سير الأطباء والشهادات والعمليات المرتبطة' },
      treatments: { title: 'التخصصات والعمليات الجراحية', subtitle: 'الأقسام العلاجية والتفاصيل الطبية' },
      stories: { title: 'قصص وتجارب المرضى', subtitle: 'مقاطع الفيديو وتجارب التعافي الموثقة' },
      blog: { title: 'المدونة والمقالات الطبية', subtitle: 'مقالات التوعية الصحية وتهيئة محركات البحث' },
      inquiries: { title: 'مركز طلبات الاستشارة', subtitle: 'استفسارات المرضى والتحويل المباشر لواتساب' },
      settings: { title: 'إعدادات المنصة والنظام', subtitle: 'أرقام التواصل والربط السحابي ومزامنة البيانات' },
    },
  },
  en: {
    btnPlaceholder: 'Quick command search (Ctrl + K)...',
    btnShort: 'Search...',
    inputPlaceholder: 'Search indicators, doctors, hospitals, inquiries, pages...',
    allTab: 'All',
    pagesTab: 'Pages',
    doctorsTab: 'Doctors',
    hospitalsTab: 'Hospitals',
    treatmentsTab: 'Treatments',
    inquiriesTab: 'Leads',
    suggestedHeading: 'Suggested Navigation & Actions',
    noResults: 'No results found matching',
    noResultsSub: 'Try searching by doctor name, phone number, or medical specialty.',
    badgePage: 'PAGE',
    badgeDoctor: 'DOCTOR',
    badgeHospital: 'HOSPITAL',
    badgeTreatment: 'SURGERY',
    badgeNewLead: 'NEW LEAD',
    badgeLead: 'LEAD',
    resultsCount: (n: number) => `${n} results`,
    hintNavigate: 'Navigate',
    hintOpen: 'Select',
    hintClose: 'Close',
    yearsExp: 'yrs exp',
    generalSpecialty: 'General',
    systemName: 'AVICINNA GLOBAL SEARCH',
    pages: {
      overview: { title: 'Dashboard Overview', subtitle: 'Real-time patient intake and KPIs' },
      sections: { title: 'Site Sections Editor', subtitle: 'Hero headlines, statistics, and highlights' },
      hospitals: { title: 'Partner Hospitals', subtitle: 'JCI accredited medical centers network' },
      doctors: { title: 'Doctors Directory', subtitle: 'Consultant profiles, credentials, and surgeries' },
      treatments: { title: 'Treatments & Surgeries', subtitle: 'Clinical departments and treatment guides' },
      stories: { title: 'Patient Stories', subtitle: 'Documented recovery journeys and videos' },
      blog: { title: 'Blog & Clinical Articles', subtitle: 'Health education and SEO guides' },
      inquiries: { title: 'Consultation Inquiries', subtitle: 'Patient triage and WhatsApp routing' },
      settings: { title: 'Platform Settings', subtitle: 'Hotline configuration and cloud database sync' },
    },
  },
  fr: {
    btnPlaceholder: 'Recherche rapide (Ctrl + K)...',
    btnShort: 'Recherche...',
    inputPlaceholder: 'Rechercher médecin, hôpital, spécialité, téléphone ou page...',
    allTab: 'Tous',
    pagesTab: 'Pages',
    doctorsTab: 'Médecins',
    hospitalsTab: 'Hôpitaux',
    treatmentsTab: 'Soins',
    inquiriesTab: 'Demandes',
    suggestedHeading: 'Raccourcis et Accès Rapide',
    noResults: 'Aucun résultat trouvé pour',
    noResultsSub: 'Essayez avec un nom de médecin, numéro de téléphone ou spécialité.',
    badgePage: 'PAGE',
    badgeDoctor: 'DOCTEUR',
    badgeHospital: 'HÔPITAL',
    badgeTreatment: 'SOIN',
    badgeNewLead: 'NOUVEAU',
    badgeLead: 'LEAD',
    resultsCount: (n: number) => `${n} résultats`,
    hintNavigate: 'Naviguer',
    hintOpen: 'Ouvrir',
    hintClose: 'Fermer',
    yearsExp: 'ans d’exp.',
    generalSpecialty: 'Général',
    systemName: 'AVICINNA GLOBAL SEARCH',
    pages: {
      overview: { title: 'Tableau de Bord', subtitle: 'Suivi des patients en direct et indicateurs' },
      sections: { title: 'Éditeur des Sections', subtitle: 'Titres d’accroche, compteurs et atouts' },
      hospitals: { title: 'Hôpitaux Partenaires', subtitle: 'Réseau d’établissements agréés JCI' },
      doctors: { title: 'Répertoire Médical', subtitle: 'Praticiens, qualifications et interventions' },
      treatments: { title: 'Traitements & Chirurgies', subtitle: 'Pôles cliniques et protocoles de soins' },
      stories: { title: 'Témoignages Patients', subtitle: 'Retours d’expérience et parcours de soins' },
      blog: { title: 'Blog Médical & Conseils', subtitle: 'Articles de santé et référencement naturel' },
      inquiries: { title: 'Demandes de Consultation', subtitle: 'Triage des leads et contact WhatsApp' },
      settings: { title: 'Paramètres Plateforme', subtitle: 'Numéro WhatsApp officiel et synchronisation' },
    },
  },
};

export function AdminGlobalSearch() {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [query, setQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<'all' | 'pages' | 'doctors' | 'hospitals' | 'treatments' | 'inquiries'>('all');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const { doctors, hospitals, treatments, inquiries } = useData();
  const { language, direction } = useLanguage();
  const langKey = language === 'ar' || language === 'en' || language === 'fr' ? language : 'ar';
  const d = searchDict[langKey];
  const ChevronIcon = direction === 'rtl' ? ChevronLeft : ChevronRight;

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsOpen((prev) => !prev);
      }
      if (e.key === 'Escape') {
        setIsOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
      setSelectedIndex(0);
    } else {
      setQuery('');
      setActiveCategory('all');
      setSelectedIndex(0);
    }
  }, [isOpen]);

  useEffect(() => {
    setSelectedIndex(0);
  }, [query, activeCategory]);

  // Aggregate results based on query & activeCategory
  const q = query.trim().toLowerCase();
  const allResults: SearchResultItem[] = [];

  // 1. Pages
  const pagesList: SearchResultItem[] = [
    { id: 'p-overview', category: 'pages', title: d.pages.overview.title, subtitle: d.pages.overview.subtitle, badge: d.badgePage, href: '/admin' },
    { id: 'p-inquiries', category: 'pages', title: d.pages.inquiries.title, subtitle: d.pages.inquiries.subtitle, badge: d.badgePage, href: '/admin/inquiries' },
    { id: 'p-doctors', category: 'pages', title: d.pages.doctors.title, subtitle: d.pages.doctors.subtitle, badge: d.badgePage, href: '/admin/doctors' },
    { id: 'p-hospitals', category: 'pages', title: d.pages.hospitals.title, subtitle: d.pages.hospitals.subtitle, badge: d.badgePage, href: '/admin/hospitals' },
    { id: 'p-treatments', category: 'pages', title: d.pages.treatments.title, subtitle: d.pages.treatments.subtitle, badge: d.badgePage, href: '/admin/treatments' },
    { id: 'p-stories', category: 'pages', title: d.pages.stories.title, subtitle: d.pages.stories.subtitle, badge: d.badgePage, href: '/admin/stories' },
    { id: 'p-blog', category: 'pages', title: d.pages.blog.title, subtitle: d.pages.blog.subtitle, badge: d.badgePage, href: '/admin/blog' },
    { id: 'p-sections', category: 'pages', title: d.pages.sections.title, subtitle: d.pages.sections.subtitle, badge: d.badgePage, href: '/admin/sections' },
    { id: 'p-settings', category: 'pages', title: d.pages.settings.title, subtitle: d.pages.settings.subtitle, badge: d.badgePage, href: '/admin/settings' },
  ];

  if (activeCategory === 'all' || activeCategory === 'pages') {
    pagesList.forEach((p) => {
      if (!q || p.title.toLowerCase().includes(q) || p.subtitle.toLowerCase().includes(q)) {
        allResults.push(p);
      }
    });
  }

  // 2. Inquiries
  if (activeCategory === 'all' || activeCategory === 'inquiries') {
    inquiries.forEach((inq) => {
      const matchName = inq.fullName?.toLowerCase().includes(q);
      const matchPhone = inq.phone?.includes(q);
      const matchTrack = inq.trackingId?.toLowerCase().includes(q);
      const matchSpec = inq.specialty?.toLowerCase().includes(q);
      if (!q || matchName || matchPhone || matchTrack || matchSpec) {
        allResults.push({
          id: `inq-${inq.id}`,
          category: 'inquiries',
          title: inq.fullName,
          subtitle: `${inq.phone} • ${inq.trackingId} • ${inq.specialty || d.generalSpecialty}`,
          badge: inq.status === 'new' ? d.badgeNewLead : d.badgeLead,
          href: `/admin/inquiries?id=${inq.id}`,
          phone: inq.phone,
        });
      }
    });
  }

  // 3. Doctors
  if (activeCategory === 'all' || activeCategory === 'doctors') {
    doctors.forEach((doc) => {
      const matchName =
        doc.name?.ar?.toLowerCase().includes(q) ||
        doc.name?.en?.toLowerCase().includes(q) ||
        doc.name?.fr?.toLowerCase().includes(q);
      const matchTitle =
        doc.title?.ar?.toLowerCase().includes(q) ||
        doc.title?.en?.toLowerCase().includes(q) ||
        doc.title?.fr?.toLowerCase().includes(q);
      const matchSpec =
        doc.specialtySlug?.toLowerCase().includes(q) ||
        doc.specialtyName?.ar?.toLowerCase().includes(q) ||
        doc.specialtyName?.en?.toLowerCase().includes(q) ||
        doc.specialtyName?.fr?.toLowerCase().includes(q);
      if (!q || matchName || matchTitle || matchSpec) {
        const name = doc.name?.[langKey] || doc.name?.ar || doc.name?.en || 'Doctor';
        const title = doc.title?.[langKey] || doc.title?.ar || doc.title?.en || '';
        const specialty = doc.specialtyName?.[langKey] || doc.specialtyName?.ar || doc.specialtyName?.en || '';
        allResults.push({
          id: `doc-${doc.id}`,
          category: 'doctors',
          title: name,
          subtitle: `${title ? `${title} • ` : ''}${specialty ? `${specialty} • ` : ''}${doc.experienceYears || ''} ${d.yearsExp}`,
          badge: d.badgeDoctor,
          href: `/admin/doctors?edit=${doc.id}`,
        });
      }
    });
  }

  // 4. Hospitals
  if (activeCategory === 'all' || activeCategory === 'hospitals') {
    hospitals.forEach((h) => {
      const matchName =
        h.name?.ar?.toLowerCase().includes(q) ||
        h.name?.en?.toLowerCase().includes(q) ||
        h.name?.fr?.toLowerCase().includes(q);
      const matchCity =
        h.city?.ar?.toLowerCase().includes(q) ||
        h.city?.en?.toLowerCase().includes(q) ||
        h.city?.fr?.toLowerCase().includes(q);
      if (!q || matchName || matchCity) {
        const name = h.name?.[langKey] || h.name?.ar || h.name?.en || 'Hospital';
        const city = h.city?.[langKey] || h.city?.ar || h.city?.en || '';
        allResults.push({
          id: `hosp-${h.id}`,
          category: 'hospitals',
          title: name,
          subtitle: `${city || ''} • ${h.accreditationBadge || 'JCI'}`,
          badge: d.badgeHospital,
          href: `/admin/hospitals?edit=${h.id}`,
        });
      }
    });
  }

  // 5. Treatments
  if (activeCategory === 'all' || activeCategory === 'treatments') {
    treatments.forEach((t) => {
      const matchTitle =
        t.title?.ar?.toLowerCase().includes(q) ||
        t.title?.en?.toLowerCase().includes(q) ||
        t.title?.fr?.toLowerCase().includes(q);
      if (!q || matchTitle) {
        const title = t.title?.[langKey] || t.title?.ar || t.title?.en || 'Treatment';
        const desc = t.shortDescription?.[langKey] || t.shortDescription?.ar || t.shortDescription?.en || '';
        allResults.push({
          id: `treat-${t.id}`,
          category: 'treatments',
          title: title,
          subtitle: desc,
          badge: d.badgeTreatment,
          href: `/admin/treatments?edit=${t.id}`,
        });
      }
    });
  }

  const getItemIcon = (cat: SearchResultItem['category']) => {
    switch (cat) {
      case 'doctors':
        return <Users className="w-4 h-4 text-sky-400" />;
      case 'hospitals':
        return <Building2 className="w-4 h-4 text-emerald-400" />;
      case 'treatments':
        return <Stethoscope className="w-4 h-4 text-purple-400" />;
      case 'inquiries':
        return <Inbox className="w-4 h-4 text-rose-400" />;
      case 'pages':
      default:
        return <Layers className="w-4 h-4 text-slate-400" />;
    }
  };

  const categories = [
    { id: 'all', label: d.allTab },
    { id: 'pages', label: d.pagesTab },
    { id: 'doctors', label: d.doctorsTab },
    { id: 'hospitals', label: d.hospitalsTab },
    { id: 'treatments', label: d.treatmentsTab },
    { id: 'inquiries', label: d.inquiriesTab },
  ] as const;

  const modalContent = isOpen ? (
    <div
      role="dialog"
      aria-modal="true"
      dir={direction}
      className="fixed inset-0 z-[99999] flex items-center justify-center p-4 sm:p-6 bg-black/85 backdrop-blur-xl animate-in fade-in duration-150 overflow-hidden"
      onClick={() => setIsOpen(false)}
    >
      {/* Subtle Ambient Radial Glow in the dead-center behind the modal */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-[#0097FB]/15 rounded-full blur-3xl pointer-events-none" />

      {/* Modal Container: Perfectly centered, ShiftFX concept card */}
      <div
        className="relative z-10 w-full max-w-xl bg-[#121620] border border-white/10 rounded-2xl shadow-[0_25px_80px_rgba(0,0,0,0.95)] overflow-hidden flex flex-col max-h-[80vh] animate-in zoom-in-95 duration-150 ring-1 ring-white/5"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Input with Icon & ESC Pill */}
        <div className="flex items-center gap-3 px-4 py-3.5 border-b border-white/10 bg-transparent">
          <div className="w-8 h-8 rounded-xl bg-white/5 border border-white/5 flex items-center justify-center flex-shrink-0 text-[#0097FB]">
            <Search className="w-4 h-4 stroke-[2.5]" />
          </div>
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => {
              const maxIdx = Math.min(allResults.length, 16) - 1;
              if (e.key === 'ArrowDown') {
                e.preventDefault();
                setSelectedIndex((prev) => (maxIdx >= 0 ? Math.min(prev + 1, maxIdx) : 0));
              } else if (e.key === 'ArrowUp') {
                e.preventDefault();
                setSelectedIndex((prev) => Math.max(prev - 1, 0));
              } else if (e.key === 'Enter') {
                e.preventDefault();
                const target = allResults[selectedIndex];
                if (target) {
                  router.push(target.href);
                  setIsOpen(false);
                }
              }
            }}
            placeholder={d.inputPlaceholder}
            className="w-full bg-transparent text-sm font-medium text-white placeholder:text-slate-500 outline-none"
          />
          {query && (
            <button
              type="button"
              onClick={() => setQuery('')}
              className="p-1 text-slate-400 hover:text-white rounded-lg hover:bg-white/10 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <kbd
            onClick={() => setIsOpen(false)}
            className="px-2 py-0.5 rounded text-[10px] text-slate-400 font-mono border border-white/10 bg-white/5 shadow-2xs cursor-pointer hover:bg-white/10 hover:text-white transition-colors flex-shrink-0"
          >
            ESC
          </kbd>
        </div>

        {/* Category Filter Pills (ShiftFX Concept Match) */}
        <div className="flex items-center gap-2 px-4 py-2.5 border-b border-white/10 bg-white/[0.02] overflow-x-auto">
          {categories.map((cat) => {
            const isSelected = activeCategory === cat.id;
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => setActiveCategory(cat.id as any)}
                className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold transition-all whitespace-nowrap cursor-pointer ${
                  isSelected
                    ? 'bg-[#0097FB] text-white shadow-xs shadow-[#0097FB]/30 font-bold'
                    : 'text-slate-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <span>{cat.label}</span>
              </button>
            );
          })}
        </div>

        {/* Results List */}
        <div className="overflow-y-auto max-h-[50vh] p-2 space-y-0.5 [scrollbar-width:thin] [scrollbar-color:rgba(255,255,255,0.2)_transparent]">
          {allResults.length === 0 ? (
            <div className="p-10 text-center text-slate-500">
              <div className="w-10 h-10 rounded-xl bg-white/5 text-slate-400 flex items-center justify-center mx-auto mb-2 border border-white/5">
                <Search className="w-5 h-5" />
              </div>
              <p className="text-xs font-bold text-slate-300 mb-0.5">
                {d.noResults} {query ? `"${query}"` : ''}
              </p>
              <p className="text-[11px] text-slate-500 max-w-sm mx-auto">
                {d.noResultsSub}
              </p>
            </div>
          ) : (
            allResults.slice(0, 16).map((item, idx) => {
              const isSelected = idx === selectedIndex;
              return (
                <Link
                  key={item.id}
                  href={item.href}
                  onClick={() => setIsOpen(false)}
                  onMouseEnter={() => setSelectedIndex(idx)}
                  className={`flex items-center justify-between p-3 rounded-xl transition-all group cursor-pointer border ${
                    isSelected
                      ? 'bg-white/10 border-white/15 shadow-sm'
                      : 'border-transparent hover:bg-white/5'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div
                      className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 transition-colors border ${
                        isSelected
                          ? 'bg-[#0097FB]/25 border-[#0097FB]/50 text-white'
                          : 'bg-white/5 border-white/10'
                      }`}
                    >
                      {getItemIcon(item.category)}
                    </div>
                    <div className="min-w-0">
                      <div
                        className={`text-xs font-bold transition-colors truncate flex items-center gap-2 ${
                          isSelected ? 'text-sky-300' : 'text-white group-hover:text-sky-300'
                        }`}
                      >
                        <span>{item.title}</span>
                        {item.badge && (
                          <span
                            className={`text-[9px] font-mono tracking-wider uppercase px-1.5 py-0.5 rounded border ${
                              isSelected
                                ? 'bg-[#0097FB]/30 border-[#0097FB]/40 text-white'
                                : 'bg-white/10 text-slate-300 border-white/5 group-hover:bg-[#0097FB]/30 group-hover:text-white'
                            }`}
                          >
                            {item.badge}
                          </span>
                        )}
                      </div>
                      <div
                        className={`text-[11px] truncate mt-0.5 ${
                          isSelected ? 'text-slate-200' : 'text-slate-400 group-hover:text-slate-300'
                        }`}
                      >
                        {item.subtitle}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 flex-shrink-0 mr-2 rtl:mr-0 rtl:ml-2">
                    <ChevronIcon
                      className={`w-4 h-4 transition-transform ${
                        isSelected ? 'text-sky-400 rtl:-translate-x-1 ltr:translate-x-1' : 'text-slate-600'
                      }`}
                    />
                  </div>
                </Link>
              );
            })
          )}
        </div>

        {/* Bottom Footer (ShiftFX Concept Match: Keyboard Hints + Glowing Global Search Label) */}
        <div className="px-4 py-2.5 bg-black/40 border-t border-white/10 text-[11px] text-slate-400 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <span className="inline-flex items-center gap-1 font-mono text-[10px] bg-white/5 border border-white/10 px-1.5 py-0.5 rounded text-slate-300">
              <span>↑</span>
              <span>↓</span>
              <span className="text-slate-400 font-sans ml-1 rtl:mr-1 rtl:ml-0">{d.hintNavigate}</span>
            </span>
            <span className="inline-flex items-center gap-1 font-mono text-[10px] bg-white/5 border border-white/10 px-1.5 py-0.5 rounded text-slate-300">
              <span>↵</span>
              <span className="text-slate-400 font-sans ml-1 rtl:mr-1 rtl:ml-0">{d.hintOpen}</span>
            </span>
            <span className="inline-flex items-center gap-1 font-mono text-[10px] bg-white/5 border border-white/10 px-1.5 py-0.5 rounded text-slate-300">
              <span>esc</span>
              <span className="text-slate-400 font-sans ml-1 rtl:mr-1 rtl:ml-0">{d.hintClose}</span>
            </span>
          </div>

          <div className="flex items-center gap-2 font-mono text-[10px] tracking-wider uppercase text-slate-400 font-bold">
            <span className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_8px_#34d399] animate-pulse" />
            <span>{d.systemName}</span>
          </div>
        </div>
      </div>
    </div>
  ) : null;

  return (
    <>
      {/* Sleek Responsive Search Trigger in Topbar */}
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2 sm:gap-2.5 h-9 px-2.5 sm:px-3.5 rounded-xl bg-slate-100/90 hover:bg-[#EAF6FF] text-slate-600 hover:text-[#0097FB] text-xs font-semibold border border-slate-200/90 hover:border-[#0097FB]/50 transition-all cursor-pointer group shadow-2xs max-w-[200px] sm:max-w-xs lg:max-w-sm shrink-0"
        title="Ctrl + K"
      >
        <Search className="w-3.5 h-3.5 text-slate-400 group-hover:text-[#0097FB] transition-colors shrink-0" />
        <span className="hidden sm:inline truncate text-slate-500 group-hover:text-[#032654] text-xs font-medium">
          {d.btnPlaceholder}
        </span>
        <kbd className="hidden lg:inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-md bg-white text-[10px] text-slate-400 group-hover:text-[#0097FB] group-hover:border-[#0097FB]/30 font-mono border border-slate-200/80 shadow-2xs ms-auto shrink-0 transition-colors">
          <Command className="w-2.5 h-2.5" /> K
        </kbd>
      </button>

      {/* Render via React Portal directly into document.body to break out of all header/main stacking contexts */}
      {mounted && typeof document !== 'undefined' && modalContent && createPortal(modalContent, document.body)}
    </>
  );
}
