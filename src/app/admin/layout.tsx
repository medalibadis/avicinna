'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useData } from '@/context/DataContext';
import { Logo } from '@/components/common/Logo';
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
  const { inquiries, clearLocalCache, isSupabaseConnected, syncStatus, refreshFromSupabase } = useData();
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

  const handleClearCache = () => {
    if (
      window.confirm(
        'هل أنت متأكد؟ سيتم مسح الذاكرة المحلية وإعادة تحميل البيانات من قاعدة البيانات.\nAre you sure? This will clear local cache and re-sync from Supabase.'
      )
    ) {
      clearLocalCache();
    }
  };

  return (
    <div className="h-screen w-full overflow-hidden bg-[#F0F4F8] text-slate-900 flex flex-col lg:flex-row antialiased selection:bg-[#EAF6FF] selection:text-[#0097FB]">
      {/* Mobile Topbar */}
      <div className="lg:hidden bg-[#032654] px-4 py-3 flex items-center justify-between sticky top-0 z-50 shadow-lg">
        <Logo variant="dark" size="sm" />
        <button
          type="button"
          onClick={() => setMobileOpen(!mobileOpen)}
          className="p-2 rounded-xl bg-white/10 text-white/80 hover:text-white hover:bg-white/20 transition-colors cursor-pointer"
        >
          {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Sidebar Navigation - Fixed full height to bottom */}
      <aside
        className={`fixed inset-y-0 right-0 rtl:right-0 rtl:left-auto ltr:left-0 ltr:right-auto z-40 w-72 bg-gradient-to-b from-[#032654] via-[#042d5f] to-[#021a3d] text-slate-200 flex flex-col justify-between transition-transform duration-300 lg:translate-x-0 lg:relative lg:min-h-screen lg:flex-shrink-0 shadow-2xl ${
          mobileOpen ? 'translate-x-0' : 'translate-x-full lg:translate-x-0'
        }`}
      >
        <div className="flex flex-col h-full justify-between overflow-hidden">
          {/* Top Brand Header */}
          <div className="p-5 sm:p-6 border-b border-white/10 flex-shrink-0">
            <div className="flex items-center justify-between mb-2">
              <Logo variant="dark" size="md" />
              <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-extrabold border border-emerald-400/30 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                LIVE
              </span>
            </div>
            <p className="text-[11px] text-sky-200/60 leading-relaxed mt-2.5 font-medium">
              منصة الإدارة الذكية للمحتوى الطبي، الأطباء والاستشارات الدولية
            </p>
          </div>

          {/* Navigation Links (Scrollable area) */}
          <nav className="p-3.5 space-y-1 flex-1 overflow-y-auto">
            <div className="text-[10px] font-extrabold uppercase tracking-widest text-sky-300/50 px-3 py-1.5">
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
                  className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-200 group ${
                    isActive
                      ? 'bg-[#0097FB]/15 text-white font-bold border-r-3 rtl:border-r-3 rtl:border-l-0 ltr:border-l-3 ltr:border-r-0 border-[#0097FB] shadow-lg shadow-[#0097FB]/10'
                      : 'text-slate-300 hover:bg-white/8 hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={`w-4 h-4 transition-colors ${isActive ? 'text-[#0097FB]' : 'text-slate-400 group-hover:text-[#0097FB]'}`} />
                    <span>{item.label}</span>
                  </div>

                  {item.badge && (
                    <span className="px-2 py-0.5 rounded-full bg-rose-500 text-white text-[10px] font-extrabold shadow-lg">
                      {item.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Bottom Actions Area */}
          <div className="p-4 border-t border-white/10 bg-black/10 space-y-2 flex-shrink-0">
            <Link
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl bg-white/10 hover:bg-[#0097FB]/20 text-slate-200 hover:text-white text-xs font-bold border border-white/15 hover:border-[#0097FB]/40 transition-all"
            >
              <ExternalLink className="w-3.5 h-3.5 text-[#0097FB]" />
              <span>معاينة الموقع المباشر / View Live</span>
            </Link>

            <button
              type="button"
              onClick={handleClearCache}
              className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-xl bg-amber-500/15 hover:bg-amber-500/25 text-amber-300 text-xs font-semibold border border-amber-400/20 transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5 text-amber-400" />
              <span>مسح الذاكرة المحلية / Clear Cache</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Main Admin Workspace - Scrollable */}
      <main className="flex-1 flex flex-col min-w-0 h-full overflow-y-auto bg-[#F0F4F8]">
        {/* Top Header Bar */}
        <header className="bg-white border-b border-slate-200/80 px-6 py-3.5 flex items-center justify-between sticky top-0 z-30 shadow-xs flex-shrink-0">
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
                className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold text-[#163B63] hover:text-[#032654] bg-[#EAF6FF] hover:bg-sky-100 rounded-lg transition-colors cursor-pointer disabled:opacity-50"
                title="تحديث البيانات من قاعدة البيانات"
              >
                <RotateCcw className={`w-3 h-3 ${isRefreshing ? 'animate-spin text-[#0097FB]' : 'text-[#0097FB]'}`} />
                <span>مزامنة</span>
              </button>
            )}
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/admin/doctors"
              className="hidden sm:inline-flex items-center gap-1.5 bg-[#0097FB] hover:bg-[#0082d6] active:scale-98 text-white text-xs font-bold px-4 py-2 rounded-xl shadow-sm shadow-[#0097FB]/25 transition-all"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span>طبيب جديد</span>
            </Link>

            <Link
              href="/admin/blog"
              className="hidden sm:inline-flex items-center gap-1.5 bg-white hover:bg-[#EAF6FF] active:scale-98 text-[#032654] text-xs font-bold px-4 py-2 rounded-xl border border-slate-200 hover:border-[#0097FB]/40 shadow-xs transition-all"
            >
              <PlusCircle className="w-3.5 h-3.5 text-[#0097FB]" />
              <span>مقال جديد</span>
            </Link>

            <div className="flex items-center gap-2 border-r rtl:border-r rtl:border-l-0 ltr:border-l ltr:border-r-0 border-slate-200 px-3">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#032654] to-[#0097FB] text-white font-black flex items-center justify-center text-xs shadow-sm">
                AD
              </div>
              <div className="hidden md:block text-right rtl:text-right ltr:text-left">
                <div className="text-xs font-bold text-[#032654]">إدارة المنصة</div>
                <div className="text-[10px] text-[#64748B] font-medium">Administrator</div>
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
