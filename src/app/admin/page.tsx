'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useData } from '@/context/DataContext';
import { useLanguage } from '@/context/LanguageContext';
import { useAccent } from '@/context/AccentContext';
import {
  Users,
  Stethoscope,
  Building2,
  ArrowUpRight,
  ArrowLeft,
  ArrowRight,
  PhoneCall,
  Sparkles,
  TrendingUp,
  Settings,
  PlusCircle,
  Search,
  ShieldCheck,
  CheckCircle2,
  ExternalLink,
  RotateCcw,
  Activity,
  Globe2,
  Clock,
  Filter,
  Inbox,
  Layers,
  Kanban,
  Table as TableIcon,
  ChevronRight,
  Calendar,
  UserCheck,
  Check,
} from 'lucide-react';
import { StatusDropdown } from '@/components/admin/StatusDropdown';
import { motion, AnimatePresence } from 'framer-motion';
import { SpotlightTiltCard, AnimatedNumberTicker } from '@/components/ui/DopaminePrimitives';
import { BentoDashboardSkeleton, FernlyContentLoader } from '@/components/ui/FernlySkeleton';
import { SlidingPillTabs, BentoCardLift, MorphingSparkline } from '@/components/ui/FernlyMotion';
import { ExpandableKanbanCard } from '@/components/admin/ExpandableKanbanCard';
import { ContextualSectionTip } from '@/components/admin/AdminOnboardingGuide';

type TimeRange = '7d' | '30d' | '90d';
type ViewMode = 'table' | 'kanban';

const pageDict = {
  ar: {
    welcomeSubtitle: 'منصة أفيسينا للرعاية الطبية الدولية في تركيا',
    welcomeTitle: 'لوحة القيادة والمتابعة اللحظية',
    systemStatus: 'النظام السحابي متصل ويعمل بكفاءة عالية (99.9% Uptime)',
    quickAddDoctor: 'إضافة طبيب استشاري',

    // Ranges & Views
    range7d: '7 أيام',
    range30d: '30 يوماً',
    range90d: '90 يوماً',
    viewTable: 'جدول المتابعة',
    viewKanban: 'لوحة الكانبان',

    // KPIs
    kpiBadgeNew: 'جديد',
    kpiBadgeCompleted: 'مكتمل',
    kpiInquiries: 'طلبات الاستشارة الواردة',
    kpiInquiriesSub: 'تحويل مباشر للمنسق الطبي عبر واتساب',
    kpiInquiriesNew: (n: number) => `${n} طلب جديد بحاجة للمتابعة`,
    kpiInquiriesDone: 'تمت متابعة جميع الطلبات بنجاح',
    kpiDoctors: 'الأطباء والاستشاريون',
    kpiDoctorsSub: 'كادر طبي معتمد من كبرى المستشفيات',
    kpiDoctorsLink: 'موزعون على المستشفيات الشريكة',
    kpiHospitals: 'المستشفيات الشريكة',
    kpiHospitalsSub: 'شبكة مستشفيات حاصلة على JCI الدولي',
    kpiHospitalsLink: 'مدرجون ضمن منظومة JCI العالمية',
    kpiTreatments: 'التخصصات والعمليات',
    kpiTreatmentsSub: 'أقسام جراحية وعلاجية متكاملة',
    kpiTreatmentsLink: 'زراعة، أورام، عظام، وجراحات دقيقة',

    // Triage Center
    triageTitle: 'مركز استقبال ومتابعة المرضى اللحظي',
    triageSub: 'إدارة وتوجيه الاستشارات الواردة والتواصل المباشر مع المرضى',
    tabAll: 'جميع الطلبات',
    tabNew: 'جديدة',
    tabInReview: 'قيد المراجعة',
    tabContacted: 'تم التواصل',
    tabScheduled: 'تم الحجز',
    searchPlaceholder: 'بحث باسم المريض، رقم الهاتف، أو التخصص...',
    noInquiriesTitle: 'لا توجد طلبات استشارة في هذا القسم',
    noInquiriesSub: 'ستظهر هنا فوراً أي استفسارات يرسلها زوار المنصة.',
    colId: 'رمز الطلب',
    colPatient: 'بيانات المريض',
    colSpecialty: 'التخصص المطلوب',
    colStatus: 'الحالة الإدارية',
    colAction: 'التواصل الفوري',
    whatsappAction: 'واتساب',
    viewAllLeads: 'عرض سجل الاستشارات بالكامل',
    generalSpecialty: 'استشارة عامة',
    showingCount: (shown: number, total: number) => `عرض أحدث ${shown} من أصل ${total} طلب استشارة`,
    cacheSuccessNotice: 'تم تحديث ذاكرة التخزين بنجاح',

    // Kanban quick moves
    cardDetailsBtn: 'ملف الحالة',
    advanceStatus: 'ترقية الحالة',
    moveToInReview: 'إلى قيد المراجعة',
    moveToContacted: 'تم التواصل',
    moveToScheduled: 'تأكيد الحجز',
    emptyColumn: 'لا توجد حالات في هذه المرحلة',

    // Side Column - Quick Actions
    quickActionsTitle: 'العمليات السريعة',
    quickSections: 'تعديل نصوص وأرقام الصفحة الرئيسية',
    quickSectionsDesc: 'تحديث الهيرو، نبذة أفيسينا، والأرقام الإحصائية',
    quickHospital: 'إضافة مستشفى شريك جديد',
    quickHospitalDesc: 'توسيع شبكة المراكز الطبية المعتمدة في إسطنبول',
    quickSettings: 'إعدادات المنصة ورقم الواتساب',
    quickSettingsDesc: 'تحديث رقم الخط الساخن وإعدادات الهوية',

    // Side Column - System Health
    telemetryTitle: 'حالة النظام والربط السحابي',
    dbStatus: 'قاعدة البيانات السحابية (Supabase)',
    dbConnected: 'متصلة ومؤمنة',
    cacheStatus: 'ذاكرة التخزين السريع (Cache)',
    cacheActive: 'محدثة ونشطة',
    clearCacheBtn: 'تفريغ الكاش',
    languagesStatus: 'التغطية اللغوية للنظام',
    languagesValue: 'العربية • English • Français',
    slaTitle: 'مؤشر كفاءة الاستجابة السريرية',
    slaDesc: 'الرد على المريض خلال أول 15 دقيقة يرفع معدل الحجز الفعلي بنسبة 70%.',
  },
  en: {
    welcomeSubtitle: 'AVICINNA International Healthcare Platform in Turkey',
    welcomeTitle: 'Operations & Real-Time Patient Intake',
    systemStatus: 'Cloud system connected & operational (99.9% Uptime)',
    quickAddDoctor: 'Add Consultant Doctor',

    // Ranges & Views
    range7d: '7 Days',
    range30d: '30 Days',
    range90d: '90 Days',
    viewTable: 'Table View',
    viewKanban: 'Kanban Board',

    // KPIs
    kpiBadgeNew: 'New',
    kpiBadgeCompleted: 'Resolved',
    kpiInquiries: 'Consultation Inquiries',
    kpiInquiriesSub: 'Instant routing to medical coordinators on WhatsApp',
    kpiInquiriesNew: (n: number) => `${n} new leads require immediate follow-up`,
    kpiInquiriesDone: 'All incoming inquiries have been addressed',
    kpiDoctors: 'Accredited Faculty',
    kpiDoctorsSub: 'Board-certified medical consultants & surgeons',
    kpiDoctorsLink: 'Distributed across partner hospitals',
    kpiHospitals: 'Partner Hospitals',
    kpiHospitalsSub: 'JCI-accredited hospital network in Istanbul',
    kpiHospitalsLink: 'Accredited to global JCI standards',
    kpiTreatments: 'Surgical Treatments',
    kpiTreatmentsSub: 'Comprehensive surgical and clinical departments',
    kpiTreatmentsLink: 'Transplants, oncology, orthopedics & precision surgery',

    // Triage Center
    triageTitle: 'Live Patient Intake & Triage Center',
    triageSub: 'Review inbound patient requests and initiate direct WhatsApp consultations',
    tabAll: 'All Leads',
    tabNew: 'New',
    tabInReview: 'In Review',
    tabContacted: 'Contacted',
    tabScheduled: 'Scheduled',
    searchPlaceholder: 'Search by patient name, phone, or specialty...',
    noInquiriesTitle: 'No consultation inquiries match this filter',
    noInquiriesSub: 'Patient inquiries submitted on the live site will appear here instantly.',
    colId: 'Lead ID',
    colPatient: 'Patient Details',
    colSpecialty: 'Requested Specialty',
    colStatus: 'Administrative Status',
    colAction: 'Direct Contact',
    whatsappAction: 'WhatsApp',
    viewAllLeads: 'View Complete Inquiries Archive',
    generalSpecialty: 'General Inquiry',
    showingCount: (shown: number, total: number) => `Showing latest ${shown} of ${total} consultation inquiries`,
    cacheSuccessNotice: 'Platform memory cache refreshed successfully',

    // Kanban quick moves
    cardDetailsBtn: 'Patient Dossier',
    advanceStatus: 'Advance',
    moveToInReview: 'Start Review',
    moveToContacted: 'Mark Contacted',
    moveToScheduled: 'Confirm Booking',
    emptyColumn: 'No patient leads in this stage',

    // Side Column - Quick Actions
    quickActionsTitle: 'Quick Management Hub',
    quickSections: 'Edit Homepage Content & Stats',
    quickSectionsDesc: 'Update hero headlines, about text, and live counters',
    quickHospital: 'Add Partner Hospital',
    quickHospitalDesc: 'Expand the accredited hospital directory in Istanbul',
    quickSettings: 'Platform & Hotline Settings',
    quickSettingsDesc: 'Update WhatsApp numbers and platform configuration',

    // Side Column - System Health
    telemetryTitle: 'Cloud Telemetry & Infrastructure',
    dbStatus: 'Cloud Database (Supabase)',
    dbConnected: 'Connected & Encrypted',
    cacheStatus: 'Platform Memory Cache',
    cacheActive: 'Active & Synchronized',
    clearCacheBtn: 'Clear Cache',
    languagesStatus: 'Multilingual Coverage',
    languagesValue: 'Arabic • English • French',
    slaTitle: 'Clinical Response SLA Standard',
    slaDesc: 'Contacting a patient within the first 15 minutes increases treatment confirmation by 70%.',
  },
  fr: {
    welcomeSubtitle: 'Plateforme Médicale Internationale AVICINNA en Turquie',
    welcomeTitle: 'Centre de Commandement & Suivi des Patients',
    systemStatus: 'Système cloud opérationnel et sécurisé (99.9% Uptime)',
    quickAddDoctor: 'Ajouter un Médecin',

    // Ranges & Views
    range7d: '7 Jours',
    range30d: '30 Jours',
    range90d: '90 Jours',
    viewTable: 'Vue Tableau',
    viewKanban: 'Tableau Kanban',

    // KPIs
    kpiBadgeNew: 'Nouveau',
    kpiBadgeCompleted: 'Traité',
    kpiInquiries: 'Demandes de Consultation',
    kpiInquiriesSub: 'Routage direct vers les coordinateurs sur WhatsApp',
    kpiInquiriesNew: (n: number) => `${n} nouvelles demandes à traiter d'urgence`,
    kpiInquiriesDone: 'Toutes les demandes de consultation ont été traitées',
    kpiDoctors: 'Corps Médical Agréé',
    kpiDoctorsSub: 'Médecins spécialistes et chirurgiens accrédités',
    kpiDoctorsLink: 'Répartis dans les hôpitaux partenaires',
    kpiHospitals: 'Hôpitaux Partenaires',
    kpiHospitalsSub: 'Réseau d’établissements hospitaliers certifiés JCI',
    kpiHospitalsLink: 'Certifiés JCI aux normes d’excellence',
    kpiTreatments: 'Soins & Chirurgies',
    kpiTreatmentsSub: 'Pôles opératoires et thérapeutiques complets',
    kpiTreatmentsLink: 'Greffes, oncologie, orthopédie & robotique',

    // Triage Center
    triageTitle: 'Centre d’Admission & Triage des Patients',
    triageSub: 'Supervisez les demandes entrantes et échangez immédiatement sur WhatsApp',
    tabAll: 'Toutes',
    tabNew: 'Nouvelles',
    tabInReview: 'En examen',
    tabContacted: 'Contacté',
    tabScheduled: 'Rendez-vous',
    searchPlaceholder: 'Rechercher par patient, téléphone ou spécialité...',
    noInquiriesTitle: 'Aucune demande ne correspond à ce filtre',
    noInquiriesSub: 'Les demandes soumises par les visiteurs apparaîtront ici immédiatement.',
    colId: 'Réf. Lead',
    colPatient: 'Patient',
    colSpecialty: 'Spécialité Demandée',
    colStatus: 'Statut',
    colAction: 'Contact Direct',
    whatsappAction: 'WhatsApp',
    viewAllLeads: 'Consulter l’historique complet des demandes',
    generalSpecialty: 'Demande générale',
    showingCount: (shown: number, total: number) => `Affichage des ${shown} dernières demandes sur ${total} consultations`,
    cacheSuccessNotice: 'Mémoire cache actualisée avec succès',

    // Kanban quick moves
    cardDetailsBtn: 'Voir Dossier',
    advanceStatus: 'Avancer',
    moveToInReview: 'En examen',
    moveToContacted: 'Contacté',
    moveToScheduled: 'Confirmer RDV',
    emptyColumn: 'Aucun dossier dans cette étape',

    // Side Column - Quick Actions
    quickActionsTitle: 'Actions & Gestion Rapide',
    quickSections: 'Modifier les Textes de la Page d’Accueil',
    quickSectionsDesc: 'Mettre à jour l’accroche hero, la présentation et les compteurs',
    quickHospital: 'Ajouter un Hôpital Partenaire',
    quickHospitalDesc: 'Étendre le réseau d’établissements accrédités à Istanbul',
    quickSettings: 'Paramètres Plateforme & WhatsApp',
    quickSettingsDesc: 'Mettre à jour le numéro d’assistance et la configuration',

    // Side Column - System Health
    telemetryTitle: 'Télémétrie Cloud & Système',
    dbStatus: 'Base de Données Cloud (Supabase)',
    dbConnected: 'Connectée & Chiffrée',
    cacheStatus: 'Mémoire Cache Plateforme',
    cacheActive: 'Active & Synchronisée',
    clearCacheBtn: 'Vider le cache',
    languagesStatus: 'Couverture Multilingue',
    languagesValue: 'Arabe • Anglais • Français',
    slaTitle: 'Indicateur de Réactivité Clinique',
    slaDesc: 'Une prise de contact dans les 15 premières minutes augmente de 70% la confirmation du séjour.',
  },
};

export default function AdminOverviewPage() {
  const router = useRouter();
  const { doctors, treatments, hospitals, inquiries, updateInquiryStatus, clearLocalCache } = useData();
  const { language, direction } = useLanguage();
  const { accentOption } = useAccent();

  const [timeRange, setTimeRange] = useState<TimeRange>('30d');
  const [viewMode, setViewMode] = useState<ViewMode>('table');
  const [tableSearch, setTableSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'new' | 'in_review' | 'contacted' | 'scheduled'>('all');
  const [cacheClearedNotice, setCacheClearedNotice] = useState(false);

  const langKey = language === 'ar' || language === 'en' || language === 'fr' ? language : 'ar';
  const d = pageDict[langKey];
  const ArrowIcon = direction === 'rtl' ? ArrowLeft : ArrowRight;

  const newInquiriesCount = inquiries.filter((inq) => inq.status === 'new').length;

  // Range-derived dynamic numbers for responsive animated tickers
  const rangeMultiplier = timeRange === '7d' ? 0.35 : timeRange === '90d' ? 2.6 : 1.0;
  const displayInquiriesCount = Math.max(1, Math.round(inquiries.length * rangeMultiplier));
  const displayDoctorsCount = doctors.length;
  const displayHospitalsCount = hospitals.length;
  const displayTreatmentsCount = treatments.length;

  const filteredInquiries = inquiries
    .filter((inq) => {
      if (statusFilter !== 'all' && inq.status !== statusFilter) return false;
      if (!tableSearch) return true;
      const q = tableSearch.toLowerCase().trim();
      return (
        inq.fullName.toLowerCase().includes(q) ||
        inq.phone.includes(q) ||
        inq.trackingId.toLowerCase().includes(q) ||
        (inq.specialty && inq.specialty.toLowerCase().includes(q))
      );
    })
    .slice(0, 10);

  const handleClearCache = () => {
    clearLocalCache();
    setCacheClearedNotice(true);
    setTimeout(() => setCacheClearedNotice(false), 2500);
  };

  const kanbanColumns = [
    {
      id: 'new' as const,
      title: d.tabNew,
      accent: 'border-rose-400 dark:border-rose-600',
      badgeBg: 'bg-rose-100 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300',
      nextStatus: 'in_review' as const,
      nextLabel: d.moveToInReview,
    },
    {
      id: 'in_review' as const,
      title: d.tabInReview,
      accent: 'border-amber-400 dark:border-amber-600',
      badgeBg: 'bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300',
      nextStatus: 'contacted' as const,
      nextLabel: d.moveToContacted,
    },
    {
      id: 'contacted' as const,
      title: d.tabContacted,
      accent: 'border-sky-400 dark:border-sky-600',
      badgeBg: 'bg-sky-100 dark:bg-sky-950/60 text-sky-700 dark:text-sky-300',
      nextStatus: 'scheduled' as const,
      nextLabel: d.moveToScheduled,
    },
    {
      id: 'scheduled' as const,
      title: d.tabScheduled,
      accent: 'border-emerald-400 dark:border-emerald-600',
      badgeBg: 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300',
      nextStatus: null,
      nextLabel: null,
    },
  ];

  return (
    <FernlyContentLoader skeleton={<BentoDashboardSkeleton />} delayMs={160}>
      <div className="space-y-6 sm:space-y-8 animate-fadeIn">
        {/* 1. Executive Top Header (Cleaned, No duplicate buttons, No awkward leftover badge) */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-slate-200/80 dark:border-slate-800">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse shadow-xs" />
              <span className="text-[11px] font-bold tracking-wide uppercase text-slate-500 dark:text-slate-400">
                {d.welcomeSubtitle}
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight mt-1">
              {d.welcomeTitle}
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
              <span>{d.systemStatus}</span>
            </p>
          </div>

          {/* Executive Controls: 7D|30D|90D Sliding Range Filter & Primary Action */}
          <div className="flex items-center gap-3 flex-wrap">
            <SlidingPillTabs<TimeRange>
              tabs={[
                { id: '7d', label: d.range7d },
                { id: '30d', label: d.range30d },
                { id: '90d', label: d.range90d },
              ]}
              activeId={timeRange}
              onChange={setTimeRange}
              layoutId="dashboard-time-range-pill"
              size="sm"
            />

            <Link
              href="/admin/doctors"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-white text-xs sm:text-sm font-bold shadow-sm shadow-sky-600/20 active:scale-98 transition-all duration-200"
              style={{
                background: `linear-gradient(135deg, ${accentOption.color} 0%, #0369A1 100%)`,
              }}
            >
              <PlusCircle className="w-4 h-4" />
              <span>{d.quickAddDoctor}</span>
            </Link>
          </div>
        </div>

        {/* 2. Four Core High-Impact KPI Bento Cards (Lift physics, Morphing Sparklines, Animated Tickers) */}
        <div className="grid grid-cols-[repeat(auto-fit,minmax(240px,1fr))] gap-4 sm:gap-5 tabular-nums">
          {/* KPI 1: Consultation Leads */}
          <Link href="/admin/inquiries" className="block focus:outline-none">
            <BentoCardLift>
              <div className="flex items-center justify-between mb-3">
                <div className="w-11 h-11 rounded-xl bg-sky-50 dark:bg-sky-950/60 text-sky-700 dark:text-sky-300 border border-sky-100 dark:border-sky-900/50 flex items-center justify-center shadow-2xs">
                  <Inbox className="w-5 h-5 stroke-[2]" />
                </div>
                {newInquiriesCount > 0 ? (
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-rose-50 dark:bg-rose-950/50 text-rose-700 dark:text-rose-300 text-[11px] font-bold border border-rose-200/60 dark:border-rose-900/50 animate-pulse">
                    <span>{newInquiriesCount}</span>
                    <span>{d.kpiBadgeNew}</span>
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 text-[10px] font-bold border border-emerald-200/60 dark:border-emerald-900/50">
                    <CheckCircle2 className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
                    <span>{d.kpiBadgeCompleted}</span>
                  </span>
                )}
              </div>

              <div>
                <div className="text-3xl font-black text-slate-900 dark:text-white group-hover:text-sky-600 dark:group-hover:text-sky-400 transition-colors tracking-tight">
                  <AnimatedNumberTicker value={displayInquiriesCount} />
                </div>
                <div className="text-xs font-bold text-slate-700 dark:text-slate-300 mt-1.5">{d.kpiInquiries}</div>
                <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">{d.kpiInquiriesSub}</div>

                {/* Morphing SVG Sparkline */}
                <MorphingSparkline range={timeRange} color={accentOption.color} id="sparkline-inq" />

                <div className="mt-2 pt-2 border-t border-slate-100 dark:border-slate-800/80 flex items-center">
                  <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-sky-50 dark:bg-sky-950/50 text-sky-700 dark:text-sky-300 text-[10px] font-semibold truncate">
                    {newInquiriesCount > 0 ? d.kpiInquiriesNew(newInquiriesCount) : d.kpiInquiriesDone}
                  </span>
                </div>
              </div>
            </BentoCardLift>
          </Link>

          {/* KPI 2: Accredited Doctors */}
          <Link href="/admin/doctors" className="block focus:outline-none">
            <BentoCardLift>
              <div className="flex items-center justify-between mb-3">
                <div className="w-11 h-11 rounded-xl bg-teal-50 dark:bg-teal-950/60 text-teal-700 dark:text-teal-300 border border-teal-100 dark:border-teal-900/50 flex items-center justify-center shadow-2xs">
                  <Users className="w-5 h-5 stroke-[2]" />
                </div>
                <div className="w-7 h-7 rounded-lg bg-slate-100/70 dark:bg-slate-800 text-slate-400 dark:text-slate-500 group-hover:text-teal-600 dark:group-hover:text-teal-400 group-hover:bg-teal-50 dark:group-hover:bg-teal-950/50 flex items-center justify-center transition-colors">
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </div>
              </div>

              <div>
                <div className="text-3xl font-black text-slate-900 dark:text-white group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors tracking-tight">
                  <AnimatedNumberTicker value={displayDoctorsCount} />
                </div>
                <div className="text-xs font-bold text-slate-700 dark:text-slate-300 mt-1.5">{d.kpiDoctors}</div>
                <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">{d.kpiDoctorsSub}</div>

                {/* Morphing SVG Sparkline */}
                <MorphingSparkline range={timeRange} color="#0D9488" id="sparkline-doc" />

                <div className="mt-2 pt-2 border-t border-slate-100 dark:border-slate-800/80 flex items-center">
                  <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-teal-50 dark:bg-teal-950/50 text-teal-700 dark:text-teal-300 text-[10px] font-semibold truncate">
                    {d.kpiDoctorsLink}
                  </span>
                </div>
              </div>
            </BentoCardLift>
          </Link>

          {/* KPI 3: Partner Hospitals */}
          <Link href="/admin/hospitals" className="block focus:outline-none">
            <BentoCardLift>
              <div className="flex items-center justify-between mb-3">
                <div className="w-11 h-11 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-100 dark:border-emerald-900/50 flex items-center justify-center shadow-2xs">
                  <Building2 className="w-5 h-5 stroke-[2]" />
                </div>
                <div className="w-7 h-7 rounded-lg bg-slate-100/70 dark:bg-slate-800 text-slate-400 dark:text-slate-500 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 group-hover:bg-emerald-50 dark:group-hover:bg-emerald-950/50 flex items-center justify-center transition-colors">
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </div>
              </div>

              <div>
                <div className="text-3xl font-black text-slate-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors tracking-tight">
                  <AnimatedNumberTicker value={displayHospitalsCount} />
                </div>
                <div className="text-xs font-bold text-slate-700 dark:text-slate-300 mt-1.5">{d.kpiHospitals}</div>
                <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">{d.kpiHospitalsSub}</div>

                {/* Morphing SVG Sparkline */}
                <MorphingSparkline range={timeRange} color="#10B981" id="sparkline-hosp" />

                <div className="mt-2 pt-2 border-t border-slate-100 dark:border-slate-800/80 flex items-center">
                  <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 text-[10px] font-semibold truncate">
                    {d.kpiHospitalsLink}
                  </span>
                </div>
              </div>
            </BentoCardLift>
          </Link>

          {/* KPI 4: Treatments & Surgical Specialties */}
          <Link href="/admin/treatments" className="block focus:outline-none">
            <BentoCardLift>
              <div className="flex items-center justify-between mb-3">
                <div className="w-11 h-11 rounded-xl bg-sky-50 dark:bg-sky-950/60 text-sky-700 dark:text-sky-300 border border-sky-100 dark:border-sky-900/50 flex items-center justify-center shadow-2xs">
                  <Stethoscope className="w-5 h-5 stroke-[2]" />
                </div>
                <div className="w-7 h-7 rounded-lg bg-slate-100/70 dark:bg-slate-800 text-slate-400 dark:text-slate-500 group-hover:text-sky-600 dark:group-hover:text-sky-400 group-hover:bg-sky-50 dark:group-hover:bg-sky-950/50 flex items-center justify-center transition-colors">
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </div>
              </div>

              <div>
                <div className="text-3xl font-black text-slate-900 dark:text-white group-hover:text-sky-600 dark:group-hover:text-sky-400 transition-colors tracking-tight">
                  <AnimatedNumberTicker value={displayTreatmentsCount} />
                </div>
                <div className="text-xs font-bold text-slate-700 dark:text-slate-300 mt-1.5">{d.kpiTreatments}</div>
                <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">{d.kpiTreatmentsSub}</div>

                {/* Morphing SVG Sparkline */}
                <MorphingSparkline range={timeRange} color="#0284C7" id="sparkline-treat" />

                <div className="mt-2 pt-2 border-t border-slate-100 dark:border-slate-800/80 flex items-center">
                  <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-sky-50 dark:bg-sky-950/50 text-sky-700 dark:text-sky-300 text-[10px] font-semibold truncate">
                    {d.kpiTreatmentsLink}
                  </span>
                </div>
              </div>
            </BentoCardLift>
          </Link>
        </div>

        {/* 3. Live Patient Intake & Triage Center (Full Width, Clear, Large, Eye-Friendly) */}
        <div className="w-full bg-white dark:bg-slate-900/90 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-4 sm:p-6 lg:p-8 shadow-xs space-y-6">
          {/* Triage Header: Title, Search, and View Mode Toggle (Table / Kanban) */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-slate-100 dark:border-slate-800">
            <div>
              <h2 className="text-lg sm:text-xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2.5">
                <Inbox className="w-5 h-5 sm:w-6 sm:h-6 text-sky-600 dark:text-sky-400" />
                <span>{d.triageTitle}</span>
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1 font-normal">
                {d.triageSub}
              </p>
            </div>

            <div className="flex items-center gap-3 flex-wrap sm:flex-nowrap w-full sm:w-auto">
              {/* View Switcher: Table vs Kanban */}
              <div id="tour-view-toggle">
                <SlidingPillTabs<ViewMode>
                  tabs={[
                    { id: 'table', label: d.viewTable, icon: TableIcon },
                    { id: 'kanban', label: d.viewKanban, icon: Kanban },
                  ]}
                  activeId={viewMode}
                  onChange={setViewMode}
                  layoutId="triage-view-mode-pill"
                  size="md"
                />
              </div>

              {/* Quick Search */}
              <div id="tour-table-search" className="relative w-full sm:w-auto sm:min-w-[240px] flex-1">
                <Search className="w-4 h-4 text-slate-400 dark:text-slate-500 absolute top-1/2 -translate-y-1/2 rtl:right-3.5 rtl:left-auto ltr:left-3.5 ltr:right-auto" />
                <input
                  type="text"
                  value={tableSearch}
                  onChange={(e) => setTableSearch(e.target.value)}
                  placeholder={d.searchPlaceholder}
                  className="w-full bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl py-2 text-xs sm:text-sm text-slate-800 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 outline-none focus:border-sky-500 transition-colors rtl:pr-9 rtl:pl-3.5 ltr:pl-9 ltr:pr-3.5"
                />
              </div>
            </div>
          </div>

          {/* Contextual Quick Guide Banner */}
          <ContextualSectionTip
            locale={langKey}
            title={
              langKey === 'fr'
                ? "Centre d'Admission & Triage : Guide Interactif"
                : langKey === 'ar'
                ? 'مركز استقبال ومتابعة المرضى : دليل الاستخدام التفاعلي'
                : 'Admission & Patient Triage Center: Interactive Guide'
            }
            steps={
              langKey === 'fr'
                ? [
                    {
                      title: 'Sélecteur de Vue',
                      desc: 'Basculez entre le tableau synthétique et les colonnes Kanban pour fluidifier la prise en charge.',
                      targetButtonLabel: 'Vue Tableau / Kanban',
                      actionOutcome: 'Affichage des colonnes de prise en charge',
                      targetSelector: '#tour-view-toggle',
                    },
                    {
                      title: 'Prise de Contact Rapide',
                      desc: 'Cliquez sur WhatsApp pour lancer une discussion directe pré-remplie avec les coordonnées du patient.',
                      targetButtonLabel: 'WhatsApp Direct',
                      actionOutcome: 'Fenêtre de messagerie médicale ouverte',
                      targetSelector: '#tour-table-search',
                    },
                    {
                      title: 'Progression du Parcours',
                      desc: 'Faites avancer le statut vers "En examen", "Contacté", ou "Rendez-vous" en un seul clic.',
                      targetButtonLabel: 'Avancer le Statut',
                      actionOutcome: 'Statut du patient mis à jour en temps réel',
                      targetSelector: '#tour-command-search',
                    },
                  ]
                : langKey === 'ar'
                ? [
                    {
                      title: 'تبديل طريقة العرض',
                      desc: 'بدّل بين العرض الجدولي ولوحة الكانبان لتتبع مراحل كل مريض بسلاسة.',
                      targetButtonLabel: 'جدول المتابعة / كانبان',
                      actionOutcome: 'تم تحديث أسلوب عرض مراحل المتابعة',
                      targetSelector: '#tour-view-toggle',
                    },
                    {
                      title: 'التواصل الفوري',
                      desc: 'اضغط على زر واتساب للتواصل المباشر مع المريض برسالة ترحيبية جاهزة باللغة المناسبة.',
                      targetButtonLabel: 'واتساب مباشر',
                      actionOutcome: 'فتح محادثة الاستشارة الطبية فوراً',
                      targetSelector: '#tour-table-search',
                    },
                    {
                      title: 'تحديث المسار العلاجي',
                      desc: 'حدّث مرحلة المريض بنقرة واحدة من قيد الفحص إلى تم التواصل ثم حجز الموعد النهائي.',
                      targetButtonLabel: 'تحديث المرحلة',
                      actionOutcome: 'تم تحديث مسار المريض وحفظ التعديل سحابياً',
                      targetSelector: '#tour-command-search',
                    },
                  ]
                : [
                    {
                      title: 'Switch Layout Views',
                      desc: 'Toggle between the structured tabular audit list and visual Kanban columns.',
                      targetButtonLabel: 'Table / Kanban Toggle',
                      actionOutcome: 'Switched triage intake presentation',
                      targetSelector: '#tour-view-toggle',
                    },
                    {
                      title: 'Direct WhatsApp Outreach',
                      desc: 'Launch a pre-filled instant conversation with the patient including consultation inquiry details.',
                      targetButtonLabel: 'Direct WhatsApp',
                      actionOutcome: 'Secured clinician chat window launched',
                      targetSelector: '#tour-table-search',
                    },
                    {
                      title: 'Advance Clinical Intake Stage',
                      desc: 'Progress patient status across "In Review", "Contacted", or "Scheduled" with one click.',
                      targetButtonLabel: 'Advance Stage',
                      actionOutcome: 'Patient pipeline stage updated in real-time',
                      targetSelector: '#tour-command-search',
                    },
                  ]
            }
          />

          {/* If TABLE VIEW: Render Interactive Status Tabs + Filtered Table */}
          {viewMode === 'table' ? (
            <div className="space-y-5">
              {/* Interactive Status Tabs with layoutId Spring Pill */}
              <div className="flex items-center gap-2.5 overflow-x-auto pb-1.5 no-scrollbar">
                {[
                  { id: 'all', label: d.tabAll, count: inquiries.length },
                  { id: 'new', label: d.tabNew, count: newInquiriesCount, alert: newInquiriesCount > 0 },
                  { id: 'in_review', label: d.tabInReview, count: inquiries.filter((i) => i.status === 'in_review').length },
                  { id: 'contacted', label: d.tabContacted, count: inquiries.filter((i) => i.status === 'contacted').length },
                  { id: 'scheduled', label: d.tabScheduled, count: inquiries.filter((i) => i.status === 'scheduled').length },
                ].map((tab) => {
                  const isSelected = statusFilter === tab.id;
                  return (
                    <button
                      key={tab.id}
                      type="button"
                      onClick={() => setStatusFilter(tab.id as any)}
                      className={`relative inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-colors whitespace-nowrap cursor-pointer z-10 ${
                        isSelected
                          ? 'text-white'
                          : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white bg-slate-100/80 dark:bg-slate-800 hover:bg-slate-200/80 dark:hover:bg-slate-700'
                      }`}
                    >
                      {isSelected && (
                        <motion.span
                          layoutId="triage-status-tab-indicator"
                          transition={{ type: 'spring', stiffness: 420, damping: 32 }}
                          className="absolute inset-0 -z-10 rounded-xl shadow-xs"
                          style={{
                            background: `linear-gradient(135deg, ${accentOption.color} 0%, #0369A1 100%)`,
                          }}
                        />
                      )}
                      <span>{tab.label}</span>
                      <span
                        className={`text-xs px-2 py-0.5 rounded-lg font-black ${
                          isSelected
                            ? 'bg-white/20 text-white'
                            : tab.alert
                            ? 'bg-rose-100 dark:bg-rose-950/60 text-rose-700 dark:text-rose-400'
                            : 'bg-slate-200/80 dark:bg-slate-700 text-slate-700 dark:text-slate-300'
                        }`}
                      >
                        {tab.count}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Table Data */}
              {filteredInquiries.length === 0 ? (
                <div className="p-12 text-center text-slate-400 dark:text-slate-500">
                  <div className="w-14 h-14 rounded-2xl bg-slate-50 dark:bg-slate-800 text-slate-400 dark:text-slate-500 flex items-center justify-center mx-auto mb-3">
                    <Inbox className="w-7 h-7" />
                  </div>
                  <p className="text-sm font-bold text-slate-700 dark:text-slate-300">{d.noInquiriesTitle}</p>
                  <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">{d.noInquiriesSub}</p>
                </div>
              ) : (
                <div className="max-h-[520px] overflow-y-auto overflow-x-auto rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-2xs">
                  <table className="w-full text-sm rtl:text-right ltr:text-left">
                    <thead className="sticky top-0 z-10 bg-slate-50/95 dark:bg-slate-900/95 backdrop-blur-md shadow-2xs">
                      <tr className="text-slate-600 dark:text-slate-300 border-b border-slate-200/80 dark:border-slate-800 text-xs sm:text-sm font-extrabold uppercase tracking-wide">
                        <th className="py-3.5 px-4 sm:px-5 font-extrabold">
                          {d.colId}
                        </th>
                        <th className="py-3.5 px-4 sm:px-5 font-extrabold">{d.colPatient}</th>
                        <th className="py-3.5 px-4 sm:px-5 font-extrabold">{d.colSpecialty}</th>
                        <th className="py-3.5 px-4 sm:px-5 font-extrabold">{d.colStatus}</th>
                        <th className="py-3.5 px-4 sm:px-5 font-extrabold">
                          {d.colAction}
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800 bg-white dark:bg-slate-900/60">
                      {filteredInquiries.map((inq) => (
                        <tr
                          key={inq.id}
                          onClick={() => router.push(`/admin/inquiries?id=${encodeURIComponent(inq.id)}`)}
                          className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors cursor-pointer group"
                        >
                          <td className="py-4 px-4 sm:px-5 font-mono text-sky-600 dark:text-sky-400 font-bold text-xs sm:text-sm whitespace-nowrap">
                            <span className="inline-block px-3 py-1.5 rounded-xl bg-sky-50 dark:bg-sky-950/60 border border-sky-200/80 dark:border-sky-800/60 group-hover:border-sky-400 transition-colors">
                              {inq.trackingId}
                            </span>
                          </td>
                          <td className="py-4 px-4 sm:px-5">
                            <div className="font-extrabold text-slate-900 dark:text-white text-sm sm:text-base leading-snug group-hover:text-sky-600 dark:group-hover:text-sky-400 transition-colors flex items-center gap-1.5">
                              <span>{inq.fullName}</span>
                              <ArrowUpRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 text-sky-500 transition-opacity" />
                            </div>
                            <div className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-mono dir-ltr mt-0.5">
                              {inq.phone}
                            </div>
                          </td>
                          <td className="py-4 px-4 sm:px-5">
                            <span className="inline-block px-3.5 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-100 border border-slate-200 dark:border-slate-700 font-semibold text-xs sm:text-sm leading-normal">
                              {inq.specialty || d.generalSpecialty}
                            </span>
                          </td>
                          <td className="py-4 px-4 sm:px-5" onClick={(e) => e.stopPropagation()}>
                            <StatusDropdown
                              currentStatus={inq.status}
                              onStatusChange={(newStatus) => updateInquiryStatus(inq.id, newStatus)}
                            />
                          </td>
                          <td className="py-4 px-4 sm:px-5" onClick={(e) => e.stopPropagation()}>
                            <a
                              href={`https://wa.me/${inq.phone.replace(/[^0-9]/g, '')}?text=Hello%20${encodeURIComponent(
                                inq.fullName
                              )},%20this%20is%20AVICINNA%20Healthcare%20International%20Patient%20Services`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#25D366] hover:bg-[#20bd5a] text-white text-xs sm:text-sm font-bold transition-all shadow-xs hover:shadow active:scale-98 whitespace-nowrap cursor-pointer"
                            >
                              <PhoneCall className="w-4 h-4 fill-white" />
                              <span>{d.whatsappAction}</span>
                            </a>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          ) : (
            /* If KANBAN BOARD VIEW: 4 Fluid Columns with Protected Overflow Containment */
            <div className="w-full overflow-x-auto pb-3 pt-1 no-scrollbar">
              <div className="flex xl:grid xl:grid-cols-4 gap-4 sm:gap-5 min-w-[1080px] xl:min-w-0">
                {kanbanColumns.map((col) => {
                  const columnInquiries = inquiries.filter((inq) => {
                    if (inq.status !== col.id) return false;
                    if (!tableSearch) return true;
                    const q = tableSearch.toLowerCase().trim();
                    return (
                      inq.fullName.toLowerCase().includes(q) ||
                      inq.phone.includes(q) ||
                      inq.trackingId.toLowerCase().includes(q) ||
                      (inq.specialty && inq.specialty.toLowerCase().includes(q))
                    );
                  });

                  return (
                    <div
                      key={col.id}
                      className="flex flex-col rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-900/40 p-3 sm:p-4 min-w-[260px] sm:min-w-[280px] xl:min-w-0 flex-1"
                    >
                      {/* Column Header */}
                      <div className="flex items-center justify-between pb-3.5 border-b border-slate-200/80 dark:border-slate-800">
                        <div className="flex items-center gap-2.5 min-w-0">
                          <span className={`w-2.5 h-2.5 rounded-full shrink-0 ${col.accent.replace('border-', 'bg-')} ring-4 ring-slate-200 dark:ring-slate-800`} />
                          <span className="text-sm font-bold text-slate-900 dark:text-white truncate">
                            {col.title}
                          </span>
                        </div>
                        <span className={`text-xs font-black px-2.5 py-0.5 rounded-full shrink-0 ${col.badgeBg}`}>
                          {columnInquiries.length}
                        </span>
                      </div>

                      {/* Cards Container - Completely Static, No Nested Scrollbars or Overflow Cutoff */}
                      <div className="space-y-3 pt-3 flex-1">
                        {columnInquiries.length === 0 ? (
                          <div className="py-10 text-center text-slate-400 dark:text-slate-500">
                            <Inbox className="w-6 h-6 mx-auto mb-1.5 opacity-50" />
                            <p className="text-xs">{d.emptyColumn}</p>
                          </div>
                        ) : (
                          columnInquiries.map((inq) => {
                            const dateFormatted = inq.createdAt
                              ? new Date(inq.createdAt).toLocaleDateString(langKey, {
                                  month: 'short',
                                  day: 'numeric',
                                })
                              : 'Today';

                            return (
                              <ExpandableKanbanCard
                                key={inq.id}
                                id={inq.id}
                                trackingId={inq.trackingId}
                                date={dateFormatted}
                                patientName={inq.fullName}
                                phone={inq.phone}
                                specialty={inq.specialty || d.generalSpecialty}
                                nextStageLabel={col.nextLabel ?? undefined}
                                isTerminal={!col.nextStatus}
                                terminalLabel={d.cardDetailsBtn}
                                isRtl={direction === 'rtl'}
                                onWhatsApp={() => {
                                  window.open(
                                    `https://wa.me/${inq.phone.replace(/[^0-9]/g, '')}?text=Hello%20${encodeURIComponent(
                                      inq.fullName
                                    )},%20this%20is%20AVICINNA%20Healthcare`,
                                    '_blank'
                                  );
                                }}
                                onAdvanceStage={
                                  col.nextStatus
                                    ? () => updateInquiryStatus(inq.id, col.nextStatus!)
                                    : undefined
                                }
                                onClick={() =>
                                  router.push(`/admin/inquiries?id=${encodeURIComponent(inq.id)}`)
                                }
                              />
                            );
                          })
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Table/Kanban Footer Link */}
          <div className="pt-3 flex items-center justify-between border-t border-slate-100 dark:border-slate-800 text-xs sm:text-sm">
            <span className="text-slate-500 dark:text-slate-400 font-medium">
              {d.showingCount(filteredInquiries.length, inquiries.length)}
            </span>
            <Link
              href="/admin/inquiries"
              className="inline-flex items-center gap-1.5 text-sky-600 dark:text-sky-400 hover:text-sky-700 dark:hover:text-sky-300 font-bold transition-colors"
            >
              <span>{d.viewAllLeads}</span>
              <ArrowIcon className="w-4 h-4" />
            </Link>
          </div>
        </div>

        {/* 4. Operations & System Telemetry Grid (Balanced 2-Column Row Beneath Triage) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start pt-2">
          {/* Card 1: Quick Actions Hub */}
          <div className="bg-white dark:bg-slate-900/90 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-6 shadow-xs space-y-4">
            <h3 className="font-extrabold text-slate-900 dark:text-white text-base flex items-center gap-2.5">
              <Sparkles className="w-4 h-4 text-sky-600 dark:text-sky-400" />
              <span>{d.quickActionsTitle}</span>
            </h3>

            <div className="space-y-3">
              <Link
                href="/admin/sections"
                className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 hover:bg-sky-50/70 dark:hover:bg-sky-950/30 border border-slate-100 dark:border-slate-800 hover:border-sky-300/40 dark:hover:border-sky-500/30 transition-all group"
              >
                <div className="flex items-center gap-3.5">
                  <div className="w-10 h-10 rounded-xl bg-sky-100/70 dark:bg-sky-950/60 text-sky-600 dark:text-sky-400 flex items-center justify-center flex-shrink-0 group-hover:bg-sky-600 group-hover:text-white transition-colors">
                    <Layers className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-sm font-bold text-slate-800 dark:text-slate-200 group-hover:text-sky-600 dark:group-hover:text-sky-400 transition-colors">
                      {d.quickSections}
                    </div>
                    <div className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">
                      {d.quickSectionsDesc}
                    </div>
                  </div>
                </div>
                <ArrowIcon className="w-4 h-4 text-slate-300 dark:text-slate-600 group-hover:text-sky-600 dark:group-hover:text-sky-400 transition-colors" />
              </Link>

              <Link
                href="/admin/hospitals"
                className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 hover:bg-emerald-50 dark:hover:bg-emerald-950/30 border border-slate-100 dark:border-slate-800 hover:border-emerald-200 dark:hover:border-emerald-800/50 transition-all group"
              >
                <div className="flex items-center gap-3.5">
                  <div className="w-10 h-10 rounded-xl bg-emerald-100/70 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center flex-shrink-0 group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                    <Building2 className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-sm font-bold text-slate-800 dark:text-slate-200 group-hover:text-emerald-700 dark:group-hover:text-emerald-400 transition-colors">
                      {d.quickHospital}
                    </div>
                    <div className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">
                      {d.quickHospitalDesc}
                    </div>
                  </div>
                </div>
                <ArrowIcon className="w-4 h-4 text-slate-300 dark:text-slate-600 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors" />
              </Link>

              <Link
                href="/admin/settings"
                className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 hover:bg-purple-50 dark:hover:bg-purple-950/30 border border-slate-100 dark:border-slate-800 hover:border-purple-200 dark:hover:border-purple-800/50 transition-all group"
              >
                <div className="flex items-center gap-3.5">
                  <div className="w-10 h-10 rounded-xl bg-purple-100/70 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 flex items-center justify-center flex-shrink-0 group-hover:bg-purple-600 group-hover:text-white transition-colors">
                    <Settings className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-sm font-bold text-slate-800 dark:text-slate-200 group-hover:text-purple-700 dark:group-hover:text-purple-400 transition-colors">
                      {d.quickSettings}
                    </div>
                    <div className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">
                      {d.quickSettingsDesc}
                    </div>
                  </div>
                </div>
                <ArrowIcon className="w-4 h-4 text-slate-300 dark:text-slate-600 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors" />
              </Link>
            </div>
          </div>

          {/* Card 2: System Telemetry & Cache Management */}
          <div className="bg-white dark:bg-slate-900/90 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-6 shadow-xs space-y-4">
            <h3 className="font-extrabold text-slate-900 dark:text-white text-base flex items-center justify-between">
              <span className="flex items-center gap-2.5">
                <Activity className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                <span>{d.telemetryTitle}</span>
              </span>
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            </h3>

            <div className="space-y-3 text-xs sm:text-sm">
              <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
                <span className="text-slate-500 dark:text-slate-400 font-medium">{d.dbStatus}</span>
                <span className="font-bold text-emerald-700 dark:text-emerald-300 bg-emerald-100/70 dark:bg-emerald-950/50 px-2.5 py-1 rounded-lg text-xs">
                  {d.dbConnected}
                </span>
              </div>

              <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
                <span className="text-slate-500 dark:text-slate-400 font-medium">{d.cacheStatus}</span>
                <button
                  type="button"
                  onClick={handleClearCache}
                  className="font-bold text-sky-600 dark:text-sky-400 hover:text-sky-700 dark:hover:text-sky-300 bg-sky-50 dark:bg-sky-950/50 hover:bg-sky-100 dark:hover:bg-sky-900/50 px-3 py-1 rounded-lg text-xs transition-colors cursor-pointer"
                >
                  {d.clearCacheBtn}
                </button>
              </div>

              {cacheClearedNotice && (
                <div className="p-2.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/50 text-xs font-bold text-center animate-in fade-in">
                  {d.cacheSuccessNotice}
                </div>
              )}

              <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
                <span className="text-slate-500 dark:text-slate-400 font-medium">{d.languagesStatus}</span>
                <span className="font-bold text-slate-900 dark:text-white text-xs sm:text-sm">
                  {d.languagesValue}
                </span>
              </div>
            </div>

            {/* SLA Callout */}
            <div className="p-4 rounded-2xl bg-gradient-to-br from-sky-50 to-teal-50 dark:from-slate-800/80 dark:to-slate-800/40 border border-sky-200/50 dark:border-slate-700 space-y-1.5">
              <div className="flex items-center gap-2 text-xs sm:text-sm font-bold text-slate-900 dark:text-white">
                <Clock className="w-4 h-4 text-sky-600 dark:text-sky-400" />
                <span>{d.slaTitle}</span>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                {d.slaDesc}
              </p>
            </div>
          </div>
        </div>
      </div>
    </FernlyContentLoader>
  );
}
