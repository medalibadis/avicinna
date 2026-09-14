'use client';

import React, { useState } from 'react';
import { useData } from '@/context/DataContext';
import { ConsultationInquiry } from '@/context/DataContext';
import {
  Inbox,
  Search,
  PhoneCall,
  Mail,
  MapPin,
  Clock,
  Trash2,
  MessageSquare,
} from 'lucide-react';

export default function AdminInquiriesPage() {
  const { inquiries, updateInquiryStatus, deleteInquiry } = useData();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');

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
    if (window.confirm(`هل أنت متأكد من حذف طلب الاستشارة الخاص بـ: ${inq.fullName}؟`)) {
      deleteInquiry(inq.id);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-50 border border-rose-200 text-rose-700 text-xs font-bold mb-1">
            <Inbox className="w-3.5 h-3.5 text-rose-600" />
            <span>طلبات واستفسارات المرضى</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900">
            إدارة طلبات الاستشارة / Consultation Leads
          </h1>
          <p className="text-slate-500 text-xs mt-1">
            متابعة استفسارات المرضى الواردة من استمارات الموقع، وتحديث حالات المتابعة والتواصل عبر واتساب.
          </p>
        </div>

        <div className="text-xs text-slate-600 bg-white border border-slate-200/80 px-4 py-2 rounded-xl shadow-xs">
          إجمالي الطلبات: <span className="text-slate-900 font-bold">{inquiries.length}</span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white border border-slate-200/80 rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xs">
        {/* Search */}
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute top-1/2 -translate-y-1/2 right-3 rtl:right-3 ltr:left-3 ltr:right-auto pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="ابحث بالاسم، الهاتف، أو الرمز..."
            className="w-full bg-slate-50/70 border border-slate-200 focus:bg-white focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20 rounded-xl py-2 px-9 text-xs text-slate-900 outline-none transition-all placeholder:text-slate-400"
          />
        </div>

        {/* Status Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto">
          {[
            { id: 'all', label: 'الكل' },
            { id: 'new', label: 'جديد' },
            { id: 'in_review', label: 'قيد المراجعة' },
            { id: 'contacted', label: 'تم التواصل' },
            { id: 'scheduled', label: 'تم الحجز' },
          ].map((status) => (
            <button
              key={status.id}
              type="button"
              onClick={() => setSelectedStatus(status.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-colors cursor-pointer ${
                selectedStatus === status.id
                  ? 'bg-sky-600 text-white shadow-xs shadow-sky-600/20'
                  : 'bg-slate-50 border border-slate-200 text-slate-600 hover:bg-slate-100 hover:text-slate-900'
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
          <div className="text-center py-16 bg-white border border-slate-200/80 rounded-3xl shadow-xs">
            <Inbox className="w-12 h-12 text-slate-400 mx-auto mb-3" />
            <p className="text-slate-500 text-sm">لا توجد طلبات استشارة مطابقة للبحث.</p>
          </div>
        ) : (
          filteredInquiries.map((inq) => {
            const cleanPhone = inq.phone.replace(/[^0-9]/g, '');
            const whatsappMessage = encodeURIComponent(
              `مرحباً بك ${inq.fullName}، نحن فريق منصة AVICINNA للرعاية الطبية في تركيا. تواصلنا معك بخصوص طلب الاستشارة الطبية برمز (${inq.trackingId}) لتخصص (${inq.specialty || 'العلاج في تركيا'}). كيف يمكننا مساعدتك اليوم؟`
            );

            return (
              <div
                key={inq.id}
                className="bg-white border border-slate-200/80 rounded-2xl p-5 hover:border-slate-300 hover:shadow-md transition-all space-y-4 shadow-xs duration-200"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-xs font-bold text-sky-700 bg-sky-50 px-2.5 py-1 rounded-lg border border-sky-200">
                      {inq.trackingId}
                    </span>
                    <h3 className="font-bold text-slate-900 text-base">{inq.fullName}</h3>
                    {inq.country && (
                      <span className="text-xs text-slate-500 flex items-center gap-1 font-medium">
                        <MapPin className="w-3.5 h-3.5 text-sky-600" />
                        <span>{inq.country}</span>
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    {/* Status Dropdown */}
                    <select
                      value={inq.status}
                      onChange={(e) =>
                        updateInquiryStatus(inq.id, e.target.value as ConsultationInquiry['status'])
                      }
                      className={`text-xs font-bold px-3 py-1.5 rounded-xl border outline-none cursor-pointer transition-colors ${
                        inq.status === 'new'
                          ? 'bg-rose-50 text-rose-700 border-rose-200'
                          : inq.status === 'in_review'
                          ? 'bg-amber-50 text-amber-700 border-amber-200'
                          : inq.status === 'contacted'
                          ? 'bg-sky-50 text-sky-700 border-sky-200'
                          : 'bg-emerald-50 text-emerald-700 border-emerald-200'
                      }`}
                    >
                      <option value="new">
                        جديد (New)
                      </option>
                      <option value="in_review">
                        قيد المراجعة (In Review)
                      </option>
                      <option value="contacted">
                        تم التواصل (Contacted)
                      </option>
                      <option value="scheduled">
                        تم الحجز (Scheduled)
                      </option>
                    </select>

                    <button
                      type="button"
                      onClick={() => handleDelete(inq)}
                      className="p-2 rounded-xl bg-slate-50 hover:bg-rose-50 text-slate-500 hover:text-rose-600 border border-slate-200 transition-colors cursor-pointer"
                      title="حذف الطلب"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Details Strip */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs text-slate-600 bg-slate-50/80 p-3 rounded-xl border border-slate-200/80">
                  <div className="flex items-center gap-2">
                    <PhoneCall className="w-3.5 h-3.5 text-emerald-600" />
                    <span className="font-mono text-slate-800 font-semibold dir-ltr">{inq.phone}</span>
                  </div>
                  {inq.email && (
                    <div className="flex items-center gap-2 truncate">
                      <Mail className="w-3.5 h-3.5 text-sky-600" />
                      <span className="truncate text-slate-800">{inq.email}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-2">
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                    <span>تاريخ الطلب: {new Date(inq.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>

                {/* Notes */}
                {inq.notes && (
                  <div className="text-xs text-slate-700 bg-slate-50 p-3 rounded-xl border border-slate-200 leading-relaxed">
                    <span className="font-bold text-sky-700 block mb-1">
                      تفاصيل الحالة / وصف المريض:
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
                    className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 active:scale-98 text-white text-xs font-bold px-4 py-2 rounded-xl shadow-sm shadow-emerald-600/20 transition-all"
                  >
                    <MessageSquare className="w-3.5 h-3.5" />
                    <span>فتح محادثة واتساب المباشرة / Chat on WhatsApp</span>
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
