'use client';

import React from 'react';
import Link from 'next/link';
import { useData } from '@/context/DataContext';
import {
  Users,
  Stethoscope,
  HeartHandshake,
  BookOpen,
  Inbox,
  Layers,
  Building2,
  ArrowUpRight,
  Clock,
  CheckCircle2,
  AlertCircle,
  PhoneCall,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  TrendingUp,
} from 'lucide-react';
import { StatusDropdown } from '@/components/admin/StatusDropdown';

export default function AdminOverviewPage() {
  const { doctors, treatments, stories, articles, hospitals, inquiries, updateInquiryStatus } = useData();

  const newInquiries = inquiries.filter((inq) => inq.status === 'new');
  const recentInquiries = inquiries.slice(0, 5);

  const metrics = [
    {
      title: 'الأطباء والاستشاريون',
      subtitle: 'Doctors & Faculty',
      count: doctors.length,
      icon: Users,
      iconBg: 'bg-[#EAF6FF] text-[#0097FB] border border-[#0097FB]/20',
      badgeColor: 'bg-[#EAF6FF] text-[#0097FB]',
      href: '/admin/doctors',
    },
    {
      title: 'المستشفيات الشريكة',
      subtitle: 'Partner Hospitals',
      count: hospitals.length,
      icon: Building2,
      iconBg: 'bg-[#EAF6FF] text-[#00BFFF] border border-[#00BFFF]/20',
      badgeColor: 'bg-[#EAF6FF] text-[#00BFFF]',
      href: '/admin/hospitals',
    },
    {
      title: 'التخصصات والعمليات',
      subtitle: 'Treatments & Surgeries',
      count: treatments.length,
      icon: Stethoscope,
      iconBg: 'bg-emerald-50 text-emerald-600 border border-emerald-100',
      badgeColor: 'bg-emerald-100 text-emerald-800',
      href: '/admin/treatments',
    },
    {
      title: 'قصص وتجارب المرضى',
      subtitle: 'Patient Stories',
      count: stories.length,
      icon: HeartHandshake,
      iconBg: 'bg-purple-50 text-purple-600 border border-purple-100',
      badgeColor: 'bg-purple-100 text-purple-800',
      href: '/admin/stories',
    },
    {
      title: 'المقالات والمدونة',
      subtitle: 'Blog Articles',
      count: articles.length,
      icon: BookOpen,
      iconBg: 'bg-amber-50 text-amber-600 border border-amber-100',
      badgeColor: 'bg-amber-100 text-amber-800',
      href: '/admin/blog',
    },
    {
      title: 'طلبات الاستشارة الواردة',
      subtitle: 'Consultation Leads',
      count: inquiries.length,
      badge: newInquiries.length > 0 ? `${newInquiries.length} جديد` : undefined,
      icon: Inbox,
      iconBg: 'bg-rose-50 text-rose-600 border border-rose-100',
      badgeColor: 'bg-rose-100 text-rose-800',
      href: '/admin/inquiries',
    },
  ];

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="bg-white border border-slate-200/80 rounded-3xl p-6 sm:p-8 relative overflow-hidden shadow-xs">
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-[#EAF6FF] via-[#EAF6FF]/40 to-transparent rounded-full -mr-16 -mt-16 pointer-events-none" />
        <div className="relative z-10 space-y-3 max-w-3xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#EAF6FF] border border-[#0097FB]/20 text-[#0097FB] text-xs font-bold">
            <Sparkles className="w-3.5 h-3.5 text-[#0097FB]" />
            <span>لوحة التحكم المباشرة AVICINNA CMS</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#032654] tracking-tight">
            مرحباً بك في لوحة إدارة منصة أفيسينا الطبية
          </h1>
          <p className="text-[#64748B] text-xs sm:text-sm leading-relaxed">
            التحكم الكامل في محتويات الموقع: تعديل نصوص وأرقام الصفحة الرئيسية، إدارة شبكة الأطباء والمستشفيات الشريكة، نشر العمليات وقصص المرضى والمقالات، ومتابعة طلبات الاستشارة اللحظية.
          </p>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {metrics.map((m, idx) => {
          const Icon = m.icon;
          return (
            <Link
              key={idx}
              href={m.href}
              className="bg-white border border-slate-200/80 hover:border-[#0097FB]/40 rounded-2xl p-5 hover:shadow-md transition-all duration-200 flex flex-col justify-between group"
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`w-11 h-11 rounded-xl ${m.iconBg} flex items-center justify-center transition-colors`}>
                  <Icon className="w-5 h-5 stroke-[2]" />
                </div>
                {m.badge ? (
                  <span className="px-2.5 py-0.5 rounded-full bg-rose-50 text-rose-600 border border-rose-200 text-[10px] font-extrabold shadow-xs animate-pulse">
                    {m.badge}
                  </span>
                ) : (
                  <div className="w-7 h-7 rounded-lg bg-[#F4F7FA] text-slate-400 group-hover:text-[#0097FB] group-hover:bg-[#EAF6FF] flex items-center justify-center transition-colors">
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </div>
                )}
              </div>

              <div>
                <div className="text-3xl font-black text-[#032654] group-hover:text-[#0097FB] transition-colors">
                  {m.count}
                </div>
                <div className="text-xs font-bold text-[#163B63] mt-1">{m.title}</div>
                <div className="text-[11px] text-[#64748B] mt-0.5">{m.subtitle}</div>
              </div>
            </Link>
          );
        })}
      </div>

      {/* Quick Action Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Link
          href="/admin/sections"
          className="bg-white border border-slate-200/80 hover:border-sky-300 rounded-2xl p-6 shadow-xs hover:shadow-md transition-all group"
        >
          <div className="w-12 h-12 rounded-xl bg-sky-50 text-sky-600 border border-sky-100 flex items-center justify-center mb-4 group-hover:bg-sky-600 group-hover:text-white transition-colors">
            <Layers className="w-6 h-6 stroke-[1.75]" />
          </div>
          <h3 className="font-bold text-slate-900 text-base mb-1 group-hover:text-sky-600 transition-colors">
            محرر أقسام الموقع / Sections Editor
          </h3>
          <p className="text-slate-600 text-xs leading-relaxed">
            عدل عنوان الهيدر، أرقام الإحصائيات، نبذة عن أفيسينا، ومميزات الخدمة مباشرة.
          </p>
        </Link>

        <Link
          href="/admin/doctors"
          className="bg-white border border-slate-200/80 hover:border-emerald-300 rounded-2xl p-6 shadow-xs hover:shadow-md transition-all group"
        >
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-100 flex items-center justify-center mb-4 group-hover:bg-emerald-600 group-hover:text-white transition-colors">
            <Users className="w-6 h-6 stroke-[1.75]" />
          </div>
          <h3 className="font-bold text-slate-900 text-base mb-1 group-hover:text-emerald-600 transition-colors">
            إدارة الأطباء / Doctors Management
          </h3>
          <p className="text-slate-600 text-xs leading-relaxed">
            أضف طبيباً جديداً بصورته ومستشفاه وتخصصه وخبرته وربطه بالعمليات الطبية.
          </p>
        </Link>

        <Link
          href="/admin/inquiries"
          className="bg-white border border-slate-200/80 hover:border-rose-300 rounded-2xl p-6 shadow-xs hover:shadow-md transition-all group"
        >
          <div className="w-12 h-12 rounded-xl bg-rose-50 text-rose-600 border border-rose-100 flex items-center justify-center mb-4 group-hover:bg-rose-600 group-hover:text-white transition-colors">
            <Inbox className="w-6 h-6 stroke-[1.75]" />
          </div>
          <h3 className="font-bold text-slate-900 text-base mb-1 group-hover:text-rose-600 transition-colors">
            طلبات الاستشارة / Patient Leads
          </h3>
          <p className="text-slate-600 text-xs leading-relaxed">
            استعرض طلبات المرضى الجدد من الموقع وتواصل معهم مباشرة عبر واتساب.
          </p>
        </Link>
      </div>

      {/* Recent Inquiries Quick Table */}
      <div className="bg-white border border-slate-200/80 rounded-3xl p-6 sm:p-7 shadow-xs">
        <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-100">
          <div>
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <Inbox className="w-5 h-5 text-sky-600" />
              <span>أحدث طلبات الاستشارة الواردة / Recent Inquiries</span>
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              المرضى الذين سجلوا استفساراتهم مؤخراً عبر الموقع
            </p>
          </div>
          <Link
            href="/admin/inquiries"
            className="text-xs text-sky-600 hover:text-sky-700 font-bold bg-sky-50 px-3 py-1.5 rounded-xl border border-sky-100 transition-colors"
          >
            عرض جميع الطلبات ({inquiries.length}) →
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-right rtl:text-right ltr:text-left text-xs sm:text-sm">
            <thead>
              <tr className="text-slate-500 border-b border-slate-200/80 bg-slate-50/70">
                <th className="py-3 px-3 font-bold rounded-r-xl rtl:rounded-r-xl rtl:rounded-l-none ltr:rounded-l-xl ltr:rounded-r-none">رمز الطلب</th>
                <th className="py-3 px-3 font-bold">اسم المريض</th>
                <th className="py-3 px-3 font-bold">الهاتف / واتساب</th>
                <th className="py-3 px-3 font-bold">التخصص المطلوب</th>
                <th className="py-3 px-3 font-bold">الحالة</th>
                <th className="py-3 px-3 font-bold rounded-l-xl rtl:rounded-l-xl rtl:rounded-r-none ltr:rounded-r-xl ltr:rounded-l-none">إجراء سريع</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {recentInquiries.map((inq) => (
                <tr key={inq.id} className="hover:bg-slate-50/70 transition-colors">
                  <td className="py-3.5 px-3 font-mono text-sky-600 font-bold">{inq.trackingId}</td>
                  <td className="py-3.5 px-3 font-bold text-slate-900">{inq.fullName}</td>
                  <td className="py-3.5 px-3 text-slate-600 dir-ltr">{inq.phone}</td>
                  <td className="py-3.5 px-3 text-slate-700">{inq.specialty || 'عام'}</td>
                  <td className="py-3.5 px-3">
                    <StatusDropdown
                      currentStatus={inq.status}
                      onStatusChange={(newStatus) => updateInquiryStatus(inq.id, newStatus)}
                    />
                  </td>
                  <td className="py-3.5 px-3">
                    <a
                      href={`https://wa.me/${inq.phone.replace(/[^0-9]/g, '')}?text=Hello%20${encodeURIComponent(
                        inq.fullName
                      )},%20this%20is%20AVICINNA%20Healthcare`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 text-xs font-bold transition-colors"
                    >
                      <PhoneCall className="w-3.5 h-3.5" />
                      <span>واتساب</span>
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
