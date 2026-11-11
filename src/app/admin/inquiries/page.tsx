'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useData } from '@/context/DataContext';
import { ConsultationInquiry } from '@/context/DataContext';
import { useLanguage } from '@/context/LanguageContext';
import {
  Inbox,
  Search,
  PhoneCall,
  Mail,
  MapPin,
  Clock,
  Trash2,
  MessageSquare,
  Sparkles,
  ArrowLeft,
  Download,
  UserCheck,
  Paperclip,
  Send,
  Bell,
  Globe,
} from 'lucide-react';
import { StatusDropdown } from '@/components/admin/StatusDropdown';
import { useConfirmDialog } from '@/context/ConfirmDialogContext';
import { toast } from 'sonner';

const inquiriesDict = {
  ar: {
    badge: 'طلبات واستفسارات المرضى',
    pageTitle: 'إدارة طلبات الاستشارة الطبية',
    pageSubtitle: 'متابعة استفسارات المرضى الواردة من استمارات الموقع، وتحديث حالات المتابعة والتواصل عبر واتساب.',
    totalLeads: 'إجمالي الطلبات:',
    searchPlaceholder: 'ابحث بالاسم، الهاتف، أو الرمز...',
    tabs: {
      all: 'الكل',
      new: 'جديد',
      in_review: 'قيد المراجعة',
      contacted: 'تم التواصل',
      scheduled: 'تم الحجز',
    },
    noResults: 'لا توجد طلبات استشارة مطابقة للبحث.',
    orderDate: 'تاريخ الطلب:',
    caseDetails: 'تفاصيل الحالة ووصف المريض:',
    whatsappChat: 'فتح محادثة واتساب المباشرة',
    confirmDelete: (name: string) => `هل أنت متأكد من حذف طلب الاستشارة الخاص بـ: ${name}؟`,
    deleteTitle: 'حذف الطلب',
    generalSpecialty: 'العلاج في تركيا',
    viewingSpecificPatient: 'ملف المريض المحدد',
    backToTriageBtn: 'العودة لمركز الفرز',
    viewAllLeadsBtn: 'عرض جميع الطلبات',
  },
  en: {
    badge: 'Patient Inquiries & Leads',
    pageTitle: 'Consultation Leads Management',
    pageSubtitle: 'Monitor incoming patient inquiries submitted via web forms, track administrative status, and connect on WhatsApp.',
    totalLeads: 'Total Leads:',
    searchPlaceholder: 'Search by patient name, phone, or ID...',
    tabs: {
      all: 'All',
      new: 'New',
      in_review: 'In Review',
      contacted: 'Contacted',
      scheduled: 'Scheduled',
    },
    noResults: 'No consultation inquiries match your filter.',
    orderDate: 'Submitted on:',
    caseDetails: 'Case Details & Medical Description:',
    whatsappChat: 'Open WhatsApp Consultation Chat',
    confirmDelete: (name: string) => `Are you sure you want to delete inquiry for: ${name}?`,
    deleteTitle: 'Delete Lead',
    generalSpecialty: 'Treatment in Turkey',
    viewingSpecificPatient: 'Selected Patient Dossier',
    backToTriageBtn: 'Back to Triage Center',
    viewAllLeadsBtn: 'View All Leads',
  },
  fr: {
    badge: 'Demandes & Dossiers Patients',
    pageTitle: 'Gestion des Demandes de Consultation',
    pageSubtitle: 'Suivez les dossiers soumis par les visiteurs du site, actualisez le statut médical et contactez sur WhatsApp.',
    totalLeads: 'Total Demandes :',
    searchPlaceholder: 'Rechercher par nom, téléphone ou référence...',
    tabs: {
      all: 'Toutes',
      new: 'Nouvelles',
      in_review: 'En examen',
      contacted: 'Contacté',
      scheduled: 'Rendez-vous',
    },
    noResults: 'Aucune demande ne correspond à la recherche.',
    orderDate: 'Date de réception :',
    caseDetails: 'Détails du cas & Description médicale :',
    whatsappChat: 'Ouvrir la conversation WhatsApp directe',
    confirmDelete: (name: string) => `Voulez-vous vraiment supprimer la demande de : ${name} ?`,
    deleteTitle: 'Supprimer la demande',
    generalSpecialty: 'Soins en Turquie',
    viewingSpecificPatient: 'Dossier du Patient Sélectionné',
    backToTriageBtn: 'Retour au Centre de Triage',
    viewAllLeadsBtn: 'Voir toutes les demandes',
  },
};

function AdminInquiriesContent() {
  const { inquiries, updateInquiry, updateInquiryStatus, deleteInquiry } = useData();
  const { language } = useLanguage();
  const searchParams = useSearchParams();
  const langKey = language === 'ar' || language === 'en' || language === 'fr' ? language : 'ar';
  const d = inquiriesDict[langKey];

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [selectedLang, setSelectedLang] = useState<'all' | 'ar' | 'fr' | 'en'>('all');
  const [coordinators, setCoordinators] = useState<Array<{ id: string; username: string; fullName: string; role: string }>>([]);
  const [noteDrafts, setNoteDrafts] = useState<Record<string, string>>({});
  const [savingNoteId, setSavingNoteId] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/users?coordinators=true')
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (data?.users) setCoordinators(data.users);
      })
      .catch(() => {});
  }, []);

  // Deep-linking from global search
  const paramId = searchParams.get('id') || searchParams.get('trackingId');
  const paramSearch = searchParams.get('search') || searchParams.get('q');

  useEffect(() => {
    if (paramSearch) {
      setSearchQuery(paramSearch);
    }
    if (paramId && inquiries.length > 0) {
      const match = inquiries.find(
        (inq) =>
          inq.id.toLowerCase() === paramId.toLowerCase() ||
          inq.trackingId.toLowerCase() === paramId.toLowerCase()
      );
      if (match) {
        setSelectedStatus('all');
        setSelectedLang('all');
        setSearchQuery(match.trackingId || match.fullName);
      }
    }
  }, [paramId, paramSearch, inquiries]);

  const filteredInquiries = inquiries.filter((inq) => {
    const matchesStatus = selectedStatus === 'all' || inq.status === selectedStatus;
    const matchesLang = selectedLang === 'all' || (inq.language || 'ar') === selectedLang;
    const q = searchQuery.toLowerCase().trim();
    const matchesSearch =
      !q ||
      inq.fullName.toLowerCase().includes(q) ||
      inq.phone.includes(q) ||
      inq.trackingId.toLowerCase().includes(q) ||
      (inq.email && inq.email.toLowerCase().includes(q)) ||
      (inq.specialty && inq.specialty.toLowerCase().includes(q)) ||
      (inq.assignedName && inq.assignedName.toLowerCase().includes(q)) ||
      (inq.country && inq.country.toLowerCase().includes(q));

    return matchesStatus && matchesLang && matchesSearch;
  });

  const handleAssignCoordinator = async (inq: ConsultationInquiry, userId: string) => {
    const user = coordinators.find((c) => c.id === userId);
    await updateInquiry(inq.id, {
      assignedTo: user ? user.id : null,
      assignedName: user ? user.fullName : null,
    });
    toast.success(
      langKey === 'fr'
        ? user
          ? `Assigné à ${user.fullName}`
          : 'Assignation retirée'
        : langKey === 'en'
        ? user
          ? `Assigned to ${user.fullName}`
          : 'Unassigned lead'
        : user
        ? `تم تعيين المنسق: ${user.fullName}`
        : 'تم إلغاء تعيين المنسق'
    );
  };

  const handleAddInternalNote = async (inqId: string) => {
    const text = (noteDrafts[inqId] || '').trim();
    if (!text) return;
    setSavingNoteId(inqId);
    try {
      await updateInquiry(inqId, { internalNote: text });
      setNoteDrafts((prev) => ({ ...prev, [inqId]: '' }));
      toast.success(
        langKey === 'fr' ? 'Note interne ajoutée' : langKey === 'en' ? 'Internal note saved' : 'تم حفظ الملاحظة الداخلية'
      );
    } finally {
      setSavingNoteId(null);
    }
  };

  const { confirm } = useConfirmDialog();

  const handleDelete = async (inq: ConsultationInquiry) => {
    const ok = await confirm({
      title: langKey === 'ar' ? 'تأكيد حذف طلب الاستشارة' : 'Delete Consultation Lead',
      message: d.confirmDelete(inq.fullName),
      itemName: inq.fullName,
      variant: 'danger',
      icon: 'trash',
      confirmText: langKey === 'ar' ? 'نعم، احذف الطلب' : 'Delete Lead',
    });

    if (ok) {
      deleteInquiry(inq.id);
      toast.success(langKey === 'ar' ? `تم حذف طلب ${inq.fullName} بنجاح` : `Inquiry for "${inq.fullName}" deleted successfully.`);
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200/80 dark:border-slate-800">
        <div className="flex items-start gap-3.5">
          <div className="hidden sm:flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-rose-500/10 dark:bg-rose-950/40 border border-rose-500/20 dark:border-rose-800/60 text-rose-600 dark:text-rose-400 shadow-2xs">
            <Inbox className="w-5 h-5" />
          </div>
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 text-rose-700 dark:text-rose-400 text-xs font-bold mb-1 shadow-2xs">
              <Inbox className="w-3.5 h-3.5 text-rose-600 dark:text-rose-400" />
              <span>{d.badge}</span>
            </div>
            <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              {d.pageTitle}
            </h1>
            <p className="text-slate-500 dark:text-slate-400 text-xs mt-1 leading-relaxed max-w-2xl">
              {d.pageSubtitle}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <div className="text-xs text-slate-600 dark:text-slate-300 bg-white dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700 px-4 py-2 rounded-xl shadow-2xs">
            {d.totalLeads} <span className="text-slate-900 dark:text-white font-bold">{inquiries.length}</span>
          </div>
          <a
            href="/api/consultation?format=csv"
            download="avicinna_leads.csv"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 dark:bg-sky-600 dark:hover:bg-sky-700 text-white text-xs font-bold shadow-xs transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            <span>{langKey === 'fr' ? 'Exporter CSV' : langKey === 'en' ? 'Export CSV' : 'تصدير CSV'}</span>
          </a>
        </div>
      </div>

      {/* Deep-link Focused Patient Notice */}
      {paramId && searchQuery && (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-2xl bg-sky-50 dark:bg-sky-950/60 border border-sky-200/90 dark:border-sky-800 text-sky-900 dark:text-sky-100 shadow-2xs">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-sky-600 text-white flex items-center justify-center shrink-0">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-medium text-sky-700 dark:text-sky-300">
                {d.viewingSpecificPatient}
              </p>
              <p className="text-sm font-extrabold text-slate-900 dark:text-white">
                {searchQuery}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => {
                setSearchQuery('');
                window.history.replaceState({}, '', '/admin/inquiries');
              }}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-800 dark:text-slate-200 transition-colors cursor-pointer"
            >
              <span>{d.viewAllLeadsBtn}</span>
            </button>
            <Link
              href="/admin"
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-sky-600 hover:bg-sky-700 text-white text-xs font-bold transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5 rtl:rotate-180" />
              <span>{d.backToTriageBtn}</span>
            </Link>
          </div>
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="bg-white dark:bg-slate-900/90 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-4 flex flex-col lg:flex-row lg:items-center justify-between gap-4 shadow-2xs">
        {/* Search & Language Filter */}
        <div className="flex flex-wrap items-center gap-2.5 w-full lg:w-auto">
          <div className="relative flex-1 sm:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute top-1/2 -translate-y-1/2 rtl:right-3 rtl:left-auto ltr:left-3 ltr:right-auto pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={d.searchPlaceholder}
              className="w-full bg-slate-50/70 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 focus:bg-white dark:focus:bg-slate-800 focus:border-[#0097FB] dark:focus:border-sky-500 focus:ring-2 focus:ring-[#0097FB]/20 rounded-xl py-2 text-xs text-slate-900 dark:text-slate-100 outline-none transition-all placeholder:text-slate-400 dark:placeholder:text-slate-500 rtl:pr-9 rtl:pl-3 ltr:pl-9 ltr:pr-3"
            />
          </div>

          <div className="inline-flex items-center gap-1 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-1">
            <Globe className="w-3.5 h-3.5 text-slate-400 mx-1" />
            {(['all', 'ar', 'fr', 'en'] as const).map((l) => (
              <button
                key={l}
                type="button"
                onClick={() => setSelectedLang(l)}
                className={`px-2 py-1 rounded-lg text-[11px] font-bold uppercase cursor-pointer transition-colors ${
                  selectedLang === l
                    ? 'bg-slate-900 dark:bg-sky-600 text-white'
                    : 'text-slate-600 dark:text-slate-300 hover:bg-slate-200/70 dark:hover:bg-slate-700'
                }`}
              >
                {l}
              </button>
            ))}
          </div>
        </div>

        {/* Status Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto">
          {[
            { id: 'all', label: d.tabs.all },
            { id: 'new', label: d.tabs.new },
            { id: 'in_review', label: d.tabs.in_review },
            { id: 'contacted', label: d.tabs.contacted },
            { id: 'scheduled', label: d.tabs.scheduled },
          ].map((status) => (
            <button
              key={status.id}
              type="button"
              onClick={() => setSelectedStatus(status.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                selectedStatus === status.id
                  ? 'bg-[#0097FB] text-white shadow-xs shadow-[#0097FB]/25'
                  : 'bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              {status.label}
            </button>
          ))}
        </div>
      </div>

      {/* Inquiries List */}
      <div className="space-y-4">
        {filteredInquiries.length === 0 ? (
          <div className="text-center py-16 bg-white dark:bg-slate-900/90 border border-slate-200/80 dark:border-slate-800 rounded-3xl shadow-2xs">
            <Inbox className="w-12 h-12 text-slate-400 mx-auto mb-3" />
            <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">{d.noResults}</p>
          </div>
        ) : (
          filteredInquiries.map((inq) => {
            const cleanPhone = inq.phone.replace(/[^0-9]/g, '');
            const whatsappMessage = encodeURIComponent(
              `Hello ${inq.fullName}, this is AVICINNA International Healthcare Patient Services in Turkey regarding your inquiry (${inq.trackingId}) for ${inq.specialty || d.generalSpecialty}. How can our medical coordinators assist you today?`
            );
            const isSelected =
              paramId &&
              (inq.id.toLowerCase() === paramId.toLowerCase() ||
                inq.trackingId.toLowerCase() === paramId.toLowerCase());

            return (
              <div
                key={inq.id}
                className={`bg-white dark:bg-slate-900/90 border rounded-2xl p-5 hover:shadow-md transition-all space-y-4 shadow-2xs duration-200 ${
                  isSelected
                    ? 'border-sky-500 ring-2 ring-sky-500/30 dark:ring-sky-400/30'
                    : 'border-slate-200/80 dark:border-slate-800 hover:border-[#0097FB]/40 dark:hover:border-sky-500/50'
                }`}
              >
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
                  <div className="flex flex-wrap items-center gap-2.5">
                    <span className="font-mono text-xs font-bold text-[#0097FB] dark:text-sky-400 bg-[#EAF6FF] dark:bg-sky-950/50 px-2.5 py-1 rounded-lg border border-[#0097FB]/20 dark:border-sky-800/60">
                      {inq.trackingId}
                    </span>
                    <h3 className="font-bold text-slate-900 dark:text-white text-base">{inq.fullName}</h3>
                    <span className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-[10px] font-extrabold uppercase text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                      {(inq.language || 'ar').toUpperCase()}
                    </span>
                    {inq.specialty && (
                      <span className="px-2.5 py-0.5 rounded-full bg-teal-50 dark:bg-teal-950/50 text-teal-700 dark:text-teal-300 border border-teal-200 dark:border-teal-800 text-[11px] font-bold">
                        {inq.specialty}
                      </span>
                    )}
                    {inq.country && (
                      <span className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1 font-medium">
                        <MapPin className="w-3.5 h-3.5 text-[#0097FB] dark:text-sky-400" />
                        <span>{inq.country}</span>
                      </span>
                    )}
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    {/* Coordinator Assignment Dropdown */}
                    <div className="inline-flex items-center gap-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-2.5 py-1.5">
                      <UserCheck className="w-3.5 h-3.5 text-sky-600 dark:text-sky-400 shrink-0" />
                      <select
                        value={inq.assignedTo || ''}
                        onChange={(e) => handleAssignCoordinator(inq, e.target.value)}
                        aria-label="Assign coordinator"
                        className="bg-transparent text-xs font-bold text-slate-800 dark:text-slate-100 outline-none cursor-pointer"
                      >
                        <option value="">
                          {langKey === 'fr' ? 'Non assigné' : langKey === 'en' ? 'Unassigned' : 'غير معين'}
                        </option>
                        {coordinators.map((coord) => (
                          <option key={coord.id} value={coord.id}>
                            {coord.fullName} ({coord.role})
                          </option>
                        ))}
                      </select>
                    </div>

                    <StatusDropdown
                      currentStatus={inq.status}
                      onStatusChange={(newStatus) => updateInquiryStatus(inq.id, newStatus)}
                    />

                    <button
                      type="button"
                      onClick={() => handleDelete(inq)}
                      className="p-2 rounded-xl bg-slate-50 dark:bg-slate-800 hover:bg-rose-50 dark:hover:bg-rose-950/40 text-slate-500 dark:text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 border border-slate-200 dark:border-slate-700 transition-colors cursor-pointer"
                      title={d.deleteTitle}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Details Strip */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs text-slate-600 dark:text-slate-300 bg-slate-50/80 dark:bg-slate-800/60 p-3 rounded-xl border border-slate-200/80 dark:border-slate-700/80">
                  <div className="flex items-center gap-2">
                    <PhoneCall className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 flex-shrink-0" />
                    <span className="font-mono text-slate-800 dark:text-slate-200 font-semibold dir-ltr">{inq.phone}</span>
                  </div>

                  {inq.email && (
                    <div className="flex items-center gap-2 truncate">
                      <Mail className="w-3.5 h-3.5 text-[#0097FB] dark:text-sky-400 flex-shrink-0" />
                      <span className="truncate text-slate-800 dark:text-slate-200">{inq.email}</span>
                    </div>
                  )}

                  <div className="flex items-center gap-2">
                    <Clock className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500 flex-shrink-0" />
                    <span className="text-slate-500 dark:text-slate-400">{d.orderDate} {new Date(inq.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>

                {/* Notes */}
                {inq.notes && (
                  <div className="text-xs text-slate-700 dark:text-slate-300 bg-slate-50 dark:bg-slate-800/40 p-3.5 rounded-xl border border-slate-200 dark:border-slate-700/80 leading-relaxed">
                    <span className="font-bold text-slate-900 dark:text-white block mb-1">
                      {d.caseDetails}
                    </span>
                    {inq.notes}
                  </div>
                )}

                {/* Uploaded Medical Files / Attachments */}
                {inq.attachments && inq.attachments.length > 0 && (
                  <div className="p-3.5 rounded-xl bg-sky-50/70 dark:bg-sky-950/30 border border-sky-200/80 dark:border-sky-800/60 space-y-2">
                    <div className="flex items-center gap-1.5 text-xs font-extrabold text-sky-900 dark:text-sky-200">
                      <Paperclip className="w-3.5 h-3.5 text-sky-600" />
                      <span>
                        {langKey === 'fr'
                          ? `Documents médicaux joints (${inq.attachments.length})`
                          : langKey === 'en'
                          ? `Uploaded Medical Files (${inq.attachments.length})`
                          : `الملفات والتقارير الطبية المرفقة (${inq.attachments.length})`}
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {inq.attachments.map((att) => (
                        <a
                          key={att.id}
                          href={att.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          download={att.name}
                          className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white dark:bg-slate-900 border border-sky-200 dark:border-slate-700 text-xs font-bold text-sky-700 dark:text-sky-300 hover:bg-sky-100/70 dark:hover:bg-slate-800 transition-colors"
                        >
                          <Download className="w-3.5 h-3.5 shrink-0" />
                          <span className="max-w-[200px] truncate">{att.name}</span>
                          <span className="text-[10px] text-slate-400 font-mono">
                            ({Math.max(1, Math.round((att.size || 0) / 1024))} KB)
                          </span>
                        </a>
                      ))}
                    </div>
                  </div>
                )}

                {/* Instant Alert Notification Log Badges */}
                {inq.notificationLog && inq.notificationLog.length > 0 && (
                  <div className="flex flex-wrap items-center gap-2 text-[11px]">
                    <span className="inline-flex items-center gap-1 font-bold text-slate-500 dark:text-slate-400">
                      <Bell className="w-3 h-3" />
                      <span>{langKey === 'fr' ? 'Alertes :' : langKey === 'en' ? 'Alerts:' : 'حالة الإشعارات:'}</span>
                    </span>
                    {inq.notificationLog.map((log, idx) => (
                      <span
                        key={`${log.channel}-${idx}`}
                        title={log.detail || ''}
                        className={`px-2 py-0.5 rounded-full font-bold border ${
                          log.status === 'sent'
                            ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800'
                            : log.status === 'failed'
                            ? 'bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 border-rose-200 dark:border-rose-800'
                            : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 border-slate-200 dark:border-slate-700'
                        }`}
                      >
                        {log.channel.toUpperCase()}: {log.status}
                      </span>
                    ))}
                  </div>
                )}

                {/* Internal Coordinator Notes Thread */}
                <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-700/80 space-y-2.5">
                  <div className="text-xs font-extrabold text-slate-800 dark:text-slate-200">
                    {langKey === 'fr'
                      ? 'Notes internes des coordinateurs'
                      : langKey === 'en'
                      ? 'Internal Coordinator Notes'
                      : 'ملاحظات الفريق والمنسقين الداخلية'}
                  </div>

                  {inq.internalNotes && inq.internalNotes.length > 0 && (
                    <div className="space-y-1.5 max-h-40 overflow-y-auto">
                      {inq.internalNotes.map((n) => (
                        <div
                          key={n.id}
                          className="p-2.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-700 text-xs"
                        >
                          <div className="flex items-center justify-between gap-2 text-[10px] text-slate-500 mb-1">
                            <span className="font-bold text-slate-800 dark:text-slate-200">
                              {n.author} {n.authorRole ? `(${n.authorRole})` : ''}
                            </span>
                            <span className="font-mono">{new Date(n.createdAt).toLocaleString()}</span>
                          </div>
                          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">{n.text}</p>
                        </div>
                      ))}
                    </div>
                  )}

                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={noteDrafts[inq.id] || ''}
                      onChange={(e) => setNoteDrafts((prev) => ({ ...prev, [inq.id]: e.target.value }))}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          handleAddInternalNote(inq.id);
                        }
                      }}
                      placeholder={
                        langKey === 'fr'
                          ? 'Ajouter une note interne confidentielle...'
                          : langKey === 'en'
                          ? 'Add internal coordinator note...'
                          : 'أضف ملاحظة داخلية للمتابعة...'
                      }
                      className="flex-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white outline-none focus:border-sky-500"
                    />
                    <button
                      type="button"
                      disabled={savingNoteId === inq.id || !(noteDrafts[inq.id] || '').trim()}
                      onClick={() => handleAddInternalNote(inq.id)}
                      className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-900 dark:bg-sky-600 hover:bg-slate-800 dark:hover:bg-sky-700 text-white text-xs font-bold disabled:opacity-40 cursor-pointer transition-colors"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>{langKey === 'fr' ? 'Ajouter' : langKey === 'en' ? 'Add' : 'حفظ'}</span>
                    </button>
                  </div>
                </div>

                {/* Direct Action */}
                <div className="pt-1 flex items-center justify-end gap-2">
                  {inq.assignedName && (
                    <span className="text-[11px] font-bold text-sky-700 dark:text-sky-300 bg-sky-50 dark:bg-sky-950/40 px-2.5 py-1 rounded-lg border border-sky-200 dark:border-sky-800">
                      {inq.assignedName}
                    </span>
                  )}
                  <a
                    href={`https://wa.me/${cleanPhone}?text=${whatsappMessage}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 active:scale-98 text-white text-xs font-bold px-4 py-2 rounded-xl shadow-xs shadow-emerald-600/20 transition-all hover:shadow-md"
                  >
                    <MessageSquare className="w-3.5 h-3.5" />
                    <span>{d.whatsappChat}</span>
                  </a>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

export default function AdminInquiriesPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-[50vh] flex items-center justify-center">
          <div className="w-8 h-8 rounded-full border-2 border-rose-500 border-t-transparent animate-spin" />
        </div>
      }
    >
      <AdminInquiriesContent />
    </Suspense>
  );
}
