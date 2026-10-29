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
} from 'lucide-react';
import { StatusDropdown } from '@/components/admin/StatusDropdown';

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
  const { inquiries, updateInquiryStatus, deleteInquiry } = useData();
  const { language } = useLanguage();
  const searchParams = useSearchParams();
  const langKey = language === 'ar' || language === 'en' || language === 'fr' ? language : 'ar';
  const d = inquiriesDict[langKey];

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');

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
        setSearchQuery(match.trackingId || match.fullName);
      }
    }
  }, [paramId, paramSearch, inquiries]);

  const filteredInquiries = inquiries.filter((inq) => {
    const matchesStatus = selectedStatus === 'all' || inq.status === selectedStatus;
    const q = searchQuery.toLowerCase().trim();
    const matchesSearch =
      !q ||
      inq.fullName.toLowerCase().includes(q) ||
      inq.phone.includes(q) ||
      inq.trackingId.toLowerCase().includes(q) ||
      (inq.country && inq.country.toLowerCase().includes(q));

    return matchesStatus && matchesSearch;
  });

  const handleDelete = (inq: ConsultationInquiry) => {
    if (window.confirm(d.confirmDelete(inq.fullName))) {
      deleteInquiry(inq.id);
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

        <div className="text-xs text-slate-600 dark:text-slate-300 bg-white dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700 px-4 py-2 rounded-xl shadow-2xs">
          {d.totalLeads} <span className="text-slate-900 dark:text-white font-bold">{inquiries.length}</span>
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
      <div className="bg-white dark:bg-slate-900/90 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-2xs">
        {/* Search */}
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute top-1/2 -translate-y-1/2 rtl:right-3 rtl:left-auto ltr:left-3 ltr:right-auto pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={d.searchPlaceholder}
            className="w-full bg-slate-50/70 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 focus:bg-white dark:focus:bg-slate-800 focus:border-[#0097FB] dark:focus:border-sky-500 focus:ring-2 focus:ring-[#0097FB]/20 rounded-xl py-2 text-xs text-slate-900 dark:text-slate-100 outline-none transition-all placeholder:text-slate-400 dark:placeholder:text-slate-500 rtl:pr-9 rtl:pl-3 ltr:pl-9 ltr:pr-3"
          />
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
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-xs font-bold text-[#0097FB] dark:text-sky-400 bg-[#EAF6FF] dark:bg-sky-950/50 px-2.5 py-1 rounded-lg border border-[#0097FB]/20 dark:border-sky-800/60">
                      {inq.trackingId}
                    </span>
                    <h3 className="font-bold text-slate-900 dark:text-white text-base">{inq.fullName}</h3>
                    {inq.country && (
                      <span className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1 font-medium">
                        <MapPin className="w-3.5 h-3.5 text-[#0097FB] dark:text-sky-400" />
                        <span>{inq.country}</span>
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
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

                {/* Direct Action */}
                <div className="pt-1 flex items-center justify-end">
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
