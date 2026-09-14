'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useData } from '@/context/DataContext';
import {
  LayoutDashboard,
  Layers,
  Users,
  Stethoscope,
  HeartHandshake,
  BookOpen,
  Inbox,
  Building2,
  ExternalLink,
  RotateCcw,
  Menu,
  X,
  Sparkles,
  ShieldCheck,
  ChevronRight,
  PlusCircle,
} from 'lucide-react';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { inquiries, resetToDefaults, isSupabaseConnected, syncStatus, refreshFromSupabase } = useData();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleManualSync = async () => {
    setIsRefreshing(true);
    await refreshFromSupabase();
    setTimeout(() => setIsRefreshing(false), 500);
  };

  const pendingInquiriesCount = inquiries.filter(
    (inq) => inq.status === 'new' || inq.status === 'in_review'
  ).length;

  const navItems = [
    {
      href: '/admin',
      label: 'نظرة عامة / Overview',
      icon: LayoutDashboard,
      exact: true,
    },
    {
      href: '/admin/sections',
      label: 'أقسام الموقع / Site Sections',
      icon: Layers,
    },
    {
      href: '/admin/hospitals',
      label: 'المستشفيات الشريكة / Hospitals',
      icon: Building2,
    },
    {
      href: '/admin/doctors',
      label: 'الأطباء والجراحون / Doctors',
      icon: Users,
    },
    {
      href: '/admin/treatments',
      label: 'التخصصات والعمليات / Treatments',
      icon: Stethoscope,
    },
    {
      href: '/admin/stories',
      label: 'قصص وتجارب المرضى / Stories',
      icon: HeartHandshake,
    },
    {
      href: '/admin/blog',
      label: 'المدونة والمقالات / Blog',
      icon: BookOpen,
    },
    {
      href: '/admin/inquiries',
      label: 'طلبات الاستشارة / Leads',
      icon: Inbox,
      badge: pendingInquiriesCount > 0 ? pendingInquiriesCount : undefined,
    },
  ];

  const handleReset = () => {
    if (
      window.confirm(
        'هل أنت متأكد من رغبتك في استعادة البيانات التجريبية الافتراضية؟ سيتم مسح أي تعديلات غير محفوظة.\nAre you sure you want to reset all data to default demo data?'
      )
    ) {
      resetToDefaults();
      alert('تمت استعادة البيانات الافتراضية بنجاح!');
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 flex flex-col lg:flex-row antialiased selection:bg-sky-100 selection:text-sky-900">
      {/* Mobile Topbar */}
      <div className="lg:hidden bg-[#0A192F] border-b border-slate-800 px-4 py-3.5 flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-sky-400 to-sky-600 text-white flex items-center justify-center font-black text-sm shadow-md shadow-sky-500/20">
            A
          </div>
          <div>
            <span className="font-extrabold tracking-tight text-white text-sm">AVICINNA</span>
            <span className="text-[10px] text-sky-400 block font-semibold -mt-1">ADMIN CMS</span>
          </div>
        </div>
        <button
          type="button"
          onClick={() => setMobileOpen(!mobileOpen)}
          className="p-2 rounded-xl bg-white/10 text-slate-200 hover:text-white hover:bg-white/15 cursor-pointer"
        >
          {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Sidebar Navigation */}
      <aside
        className={`fixed inset-y-0 right-0 rtl:right-0 rtl:left-auto ltr:left-0 ltr:right-auto z-40 w-72 bg-[#0A192F] text-slate-300 border-l rtl:border-l rtl:border-r-0 ltr:border-r ltr:border-l-0 border-slate-800/80 flex flex-col justify-between transition-transform duration-300 lg:translate-x-0 lg:static lg:h-screen ${
          mobileOpen ? 'translate-x-0' : 'translate-x-full lg:translate-x-0'
        }`}
      >
        <div className="flex flex-col flex-1 overflow-y-auto">
          {/* Logo Brand Header */}
          <div className="p-6 border-b border-white/10">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-sky-400 to-sky-600 text-white flex items-center justify-center font-black text-lg shadow-lg shadow-sky-500/25 ring-2 ring-sky-400/20">
                  A
                </div>
                <div>
                  <div className="font-black text-base tracking-wider text-white">
                    AVICINNA
                  </div>
                  <div className="text-[10px] text-sky-400 font-bold tracking-widest uppercase">
                    Control Center
                  </div>
                </div>
              </div>
              <span className="px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-300 text-[10px] font-extrabold border border-emerald-500/30 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                LIVE
              </span>
            </div>
            <p className="text-[11px] text-slate-400 leading-relaxed mt-2">
              منصة الإدارة الذكية للمحتوى الطبي، الأطباء والاستشارات الدولية
            </p>
          </div>

          {/* Navigation Links */}
          <nav className="p-4 space-y-1.5 flex-1">
            <div className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400 px-3 py-1.5">
              الوحدات البرمجية / Modules
            </div>

            {navItems.map((item) => {
              const isActive = item.exact
                ? pathname === item.href
                : pathname === item.href || pathname?.startsWith(item.href + '/');

              const Icon = item.icon;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                    isActive
                      ? 'bg-gradient-to-r from-sky-500/20 to-sky-500/10 text-sky-300 font-bold border border-sky-400/30 shadow-sm shadow-sky-500/10'
                      : 'text-slate-300 hover:bg-white/5 hover:text-white border border-transparent'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={`w-4 h-4 ${isActive ? 'text-sky-400' : 'text-slate-400'}`} />
                    <span>{item.label}</span>
                  </div>

                  {item.badge && (
                    <span className="px-2 py-0.5 rounded-full bg-rose-500 text-white text-[10px] font-extrabold shadow-sm">
                      {item.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Bottom Actions */}
          <div className="p-4 border-t border-white/10 space-y-2">
            <Link
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl bg-white/5 hover:bg-white/10 text-slate-200 hover:text-white text-xs font-bold border border-white/10 transition-colors shadow-xs"
            >
              <ExternalLink className="w-3.5 h-3.5 text-sky-400" />
              <span>معاينة الموقع المباشر / View Live</span>
            </Link>

            <button
              type="button"
              onClick={handleReset}
              className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 text-xs font-semibold border border-rose-500/20 transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>استعادة البيانات الافتراضية / Reset</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Main Admin Workspace */}
      <main className="flex-1 flex flex-col min-w-0 overflow-y-auto min-h-screen bg-[#F8FAFC]">
        {/* Top Header Bar */}
        <header className="bg-white/95 backdrop-blur-md border-b border-slate-200/80 px-6 py-3.5 flex items-center justify-between sticky top-0 z-30 shadow-xs">
          <div className="flex items-center gap-3">
            {isSupabaseConnected ? (
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-bold">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>Supabase PostgreSQL متصل</span>
                {syncStatus === 'syncing' && (
                  <span className="text-[10px] text-emerald-600 animate-pulse">(جاري المزامنة...)</span>
                )}
              </div>
            ) : (
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-50 text-amber-700 border border-amber-200 text-xs font-semibold">
                <span className="w-2 h-2 rounded-full bg-amber-500" />
                <span>الوضع المحلي (Local Demo) • جهز مفاتيح Supabase للربط الفوري</span>
              </div>
            )}

            {isSupabaseConnected && (
              <button
                type="button"
                onClick={handleManualSync}
                disabled={isRefreshing}
                className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer disabled:opacity-50"
                title="تحديث البيانات من قاعدة البيانات"
              >
                <RotateCcw className={`w-3 h-3 ${isRefreshing ? 'animate-spin text-sky-600' : ''}`} />
                <span>مزامنة</span>
              </button>
            )}
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/admin/doctors"
              className="hidden sm:inline-flex items-center gap-1.5 bg-sky-600 hover:bg-sky-700 active:scale-98 text-white text-xs font-bold px-4 py-2 rounded-xl shadow-sm shadow-sky-600/20 transition-all"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span>طبيب جديد</span>
            </Link>

            <Link
              href="/admin/blog"
              className="hidden sm:inline-flex items-center gap-1.5 bg-white hover:bg-slate-50 active:scale-98 text-slate-700 text-xs font-bold px-4 py-2 rounded-xl border border-slate-200 shadow-xs transition-all"
            >
              <PlusCircle className="w-3.5 h-3.5 text-sky-600" />
              <span>مقال جديد</span>
            </Link>

            <div className="flex items-center gap-2 border-r rtl:border-r rtl:border-l-0 ltr:border-l ltr:border-r-0 border-slate-200 px-3">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-sky-500 to-sky-700 text-white font-black flex items-center justify-center text-xs shadow-sm">
                AD
              </div>
              <div className="hidden md:block text-right rtl:text-right ltr:text-left">
                <div className="text-xs font-bold text-slate-800">إدارة المنصة</div>
                <div className="text-[10px] text-slate-400 font-medium">Administrator</div>
              </div>
            </div>
          </div>
        </header>

        {/* Content Viewport */}
        <div className="flex-1 p-6 sm:p-8 max-w-7xl w-full mx-auto">{children}</div>
      </main>
    </div>
  );
}
