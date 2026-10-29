'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import {
  motion,
  AnimatePresence,
} from 'framer-motion';
import {
  LayoutGrid,
  Layers,
  Building2,
  Stethoscope,
  HeartPulse,
  MessageSquareHeart,
  BookOpen,
  Inbox,
  Settings,
  ChevronLeft,
  ChevronRight,
  PanelLeftClose,
  PanelLeftOpen,
  PanelRightClose,
  PanelRightOpen,
  Search,
  ExternalLink,
  RotateCcw,
  LogOut,
  Menu,
  X,
  Sun,
  Moon,
} from 'lucide-react';
import { toast } from 'sonner';
import { useTheme } from '@/context/ThemeContext';
import { useAccent, ACCENT_OPTIONS } from '@/context/AccentContext';
import { CelestialThemeSwitch } from '@/components/ui/CelestialThemeSwitch';
import { InteractiveAdminGuide } from '@/components/admin/AdminOnboardingGuide';

export type Locale = 'en' | 'fr' | 'ar';

interface NavItem {
  id: string;
  path: string;
  label: Record<Locale, string>;
  icon: React.ElementType;
  category: 'main' | 'cms' | 'comms' | 'system';
  shortcut: string;
}

export const NAV_ITEMS: NavItem[] = [
  {
    id: 'dashboard',
    path: '/admin',
    label: { en: 'Executive Dashboard', fr: 'Tableau de Bord', ar: 'لوحة التحكم التنفيذية' },
    icon: LayoutGrid,
    category: 'main',
    shortcut: 'G D',
  },
  {
    id: 'sections',
    path: '/admin/sections',
    label: { en: 'Site Sections', fr: 'Sections du Site', ar: 'أقسام الموقع' },
    icon: Layers,
    category: 'cms',
    shortcut: 'G S',
  },
  {
    id: 'hospitals',
    path: '/admin/hospitals',
    label: { en: 'Partner Hospitals', fr: 'Hôpitaux Partenaires', ar: 'المستشفيات الشريكة' },
    icon: Building2,
    category: 'cms',
    shortcut: 'G H',
  },
  {
    id: 'doctors',
    path: '/admin/doctors',
    label: { en: 'Doctors & Specialists', fr: 'Médecins & Chirurgiens', ar: 'الأطباء والاستشاريون' },
    icon: Stethoscope,
    category: 'cms',
    shortcut: 'G M',
  },
  {
    id: 'treatments',
    path: '/admin/treatments',
    label: { en: 'Treatments & Procedures', fr: 'Spécialités & Actes', ar: 'التخصصات والعمليات' },
    icon: HeartPulse,
    category: 'cms',
    shortcut: 'G T',
  },
  {
    id: 'stories',
    path: '/admin/stories',
    label: { en: 'Patient Stories', fr: 'Témoignages Patients', ar: 'قصص وتجارب المرضى' },
    icon: MessageSquareHeart,
    category: 'cms',
    shortcut: 'G P',
  },
  {
    id: 'articles',
    path: '/admin/blog',
    label: { en: 'Blog & Articles', fr: 'Blog & Articles', ar: 'المدونة والمقالات' },
    icon: BookOpen,
    category: 'cms',
    shortcut: 'G B',
  },
  {
    id: 'inquiries',
    path: '/admin/inquiries',
    label: { en: 'Consultation Inquiries', fr: 'Demandes de Soins', ar: 'طلبات الاستشارة' },
    icon: Inbox,
    category: 'comms',
    shortcut: 'G I',
  },
  {
    id: 'settings',
    path: '/admin/settings',
    label: { en: 'Platform Settings', fr: 'Paramètres Plateforme', ar: 'إعدادات المنصة' },
    icon: Settings,
    category: 'system',
    shortcut: 'G ,',
  },
];

const UI_STRINGS: Record<Locale, Record<string, string>> = {
  en: {
    subtitle: 'Medical Care Turkey',
    searchPlaceholder: 'Quick command search...',
    newDoctor: 'New Doctor',
    newArticle: 'New Article',
    viewLive: 'View Live Website',
    clearCache: 'Clear Cache',
    signOut: 'Sign Out',
    cmsHeader: 'MEDICAL CMS',
    commsHeader: 'COMMUNICATIONS',
    sysHeader: 'SYSTEM & CONFIG',
    home: 'Home',
    cacheCleared: 'Cache reset queued with 5s undo window',
    undo: 'Undo',
    cacheRestored: 'Cache reset cancelled.',
  },
  fr: {
    subtitle: 'Soins Médicaux Turquie',
    searchPlaceholder: 'Recherche rapide...',
    newDoctor: 'Nouveau Médecin',
    newArticle: 'Nouvel Article',
    viewLive: 'Voir le Site en Direct',
    clearCache: 'Vider Cache',
    signOut: 'Déconnexion',
    cmsHeader: 'CMS MÉDICAL',
    commsHeader: 'COMMUNICATIONS',
    sysHeader: 'SYSTÈME & CONFIG',
    home: 'Accueil',
    cacheCleared: 'Réinitialisation du cache en attente (5s pour annuler)',
    undo: 'Annuler',
    cacheRestored: 'Réinitialisation annulée.',
  },
  ar: {
    subtitle: 'أفيسينا للرعاية الطبية',
    searchPlaceholder: 'البحث السريع والأوامر...',
    newDoctor: 'طبيب جديد',
    newArticle: 'مقال جديد',
    viewLive: 'معاينة الموقع المباشر',
    clearCache: 'مسح الكاش',
    signOut: 'تسجيل الخروج',
    cmsHeader: 'إدارة المحتوى الطبي',
    commsHeader: 'المرضى والتواصل',
    sysHeader: 'النظام والتهيئة',
    home: 'الرئيسية',
    cacheCleared: 'تم جدولة مسح الكاش (تراجع متاح خلال 5 ثوانٍ)',
    undo: 'تراجع',
    cacheRestored: 'تم التراجع عن مسح الكاش.',
  },
};

export function AdminShell({
  activeRoute,
  onNavigate,
  locale,
  onChangeLocale,
  onOpenCommandMenu,
  onClearCache,
  onLogout,
  pendingInquiriesCount = 0,
  children,
}: {
  activeRoute: string;
  onNavigate: (path: string) => void;
  locale: Locale;
  onChangeLocale: (l: Locale) => void;
  onOpenCommandMenu: () => void;
  onClearCache?: () => void;
  onLogout?: () => void;
  pendingInquiriesCount?: number;
  children: React.ReactNode;
}) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [hoveredNav, setHoveredNav] = useState<string | null>(null);

  const isRTL = locale === 'ar';
  const t = UI_STRINGS[locale];
  const { theme, toggleTheme } = useTheme();
  const { accent, setAccent, accentOption } = useAccent();
  
  // Find current nav item by path or ID
  const currentNav =
    NAV_ITEMS.find((n) => n.path === activeRoute || n.id === activeRoute) ||
    NAV_ITEMS[0];

  // Keyboard shortcut Cmd+B (sidebar) and Cmd+D (theme)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'b') {
        e.preventDefault();
        setIsCollapsed((prev) => !prev);
      }
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'd') {
        e.preventDefault();
        toggleTheme();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [toggleTheme]);

  // Instant top slim progress indicator on route change
  const [navProgress, setNavProgress] = useState(false);
  useEffect(() => {
    setNavProgress(true);
    const timer = setTimeout(() => setNavProgress(false), 260);
    return () => clearTimeout(timer);
  }, [activeRoute]);

  const handleSafeClearCache = () => {
    let cancelled = false;
    const timeout = setTimeout(() => {
      if (!cancelled && onClearCache) {
        onClearCache();
      }
    }, 5000);

    toast.success(t.cacheCleared, {
      action: {
        label: t.undo,
        onClick: () => {
          cancelled = true;
          clearTimeout(timeout);
          toast.info(t.cacheRestored);
        },
      },
      duration: 5000,
    });
  };

  return (
    <div
      dir={isRTL ? 'rtl' : 'ltr'}
      className="relative flex min-h-dvh w-full bg-[#F8FAFC] dark:bg-[#0B1120] text-slate-800 dark:text-slate-100 antialiased selection:bg-sky-500/15 selection:text-sky-900 transition-colors duration-300"
    >
      {/* Top Slim Performance Progress Bar */}
      <AnimatePresence>
        {navProgress && (
          <motion.div
            initial={{ scaleX: 0, opacity: 1 }}
            animate={{ scaleX: 1, opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.22, ease: 'easeOut' }}
            className="fixed top-0 left-0 right-0 h-[2.5px] z-50 bg-gradient-to-r from-sky-500 via-teal-400 to-sky-400 origin-left shadow-[0_0_10px_rgba(14,165,233,0.8)] pointer-events-none"
          />
        )}
      </AnimatePresence>

      {/* Ambient Calming Clinical Mesh Glow (Light & Dark Clinical Obsidian) */}
      <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
        <div className="absolute -top-40 start-1/4 h-96 w-96 rounded-full bg-sky-200/35 dark:bg-sky-500/10 blur-3xl" />
        <div className="absolute top-1/3 end-10 h-96 w-96 rounded-full bg-teal-200/25 dark:bg-teal-500/10 blur-3xl" />
      </div>

      {/* =====================================================================
          DESKTOP COLLAPSIBLE SIDEBAR (Hidden on Mobile < 1024px to fix 393px bug)
          Uses interruptible spring physics (Rule #11) & Hit Slop (Rule #13)
         ===================================================================== */}
      <motion.aside
        id="tour-sidebar-nav"
        initial={false}
        animate={{ width: isCollapsed ? 84 : 276 }}
        transition={{ type: 'spring', stiffness: 360, damping: 32, mass: 0.8 }}
        className="sticky top-0 z-30 hidden h-dvh shrink-0 flex-col justify-between border-e border-slate-200/80 dark:border-slate-800/80 bg-white/85 dark:bg-slate-900/85 px-3 py-5 backdrop-blur-2xl lg:flex transition-colors duration-300"
      >
        {/* Brand Header with Single Official AVICINNA Logo & Integrated Sidebar Toggle */}
        <div
          className={`flex items-center pb-3 mb-2 border-b border-slate-100 dark:border-slate-800/80 transition-all ${
            isCollapsed ? 'flex-col gap-3 justify-center' : 'justify-between px-2'
          }`}
        >
          <Link
            href="/admin"
            className="flex items-center gap-2 focus:outline-none select-none min-w-0"
            aria-label="AVICINNA"
          >
            {isCollapsed ? (
              <motion.div whileHover={{ scale: 1.08 }} className="relative h-9 w-9 flex items-center justify-center">
                <img
                  src={theme === 'dark' ? '/images/logo-icon-white.png' : '/images/logo-icon.png'}
                  alt="AVICINNA Logo"
                  className="h-8 w-8 object-contain drop-shadow-xs"
                />
              </motion.div>
            ) : (
              <div className="flex items-center gap-2.5 min-w-0">
                <img
                  src={theme === 'dark' ? '/images/logo-icon-white.png' : '/images/logo-icon.png'}
                  alt="AVICINNA Logo"
                  className="h-8 w-8 object-contain drop-shadow-xs shrink-0"
                />
                <div className="flex flex-col min-w-0">
                  <span className="text-base font-black tracking-tight text-slate-900 dark:text-white leading-tight">
                    AVICINNA
                  </span>
                  <span className="text-[10px] font-semibold text-sky-600 dark:text-sky-400 tracking-tight truncate leading-tight mt-0.5">
                    {t.subtitle}
                  </span>
                </div>
              </div>
            )}
          </Link>

          {/* Integrated Collapse Toggle Button (Clean, in-flow, zero collision!) */}
          <motion.button
            type="button"
            onClick={() => setIsCollapsed(!isCollapsed)}
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.92 }}
            title={isCollapsed ? 'Expand Sidebar (⌘B)' : 'Collapse Sidebar (⌘B)'}
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl border border-slate-200/80 dark:border-slate-700 bg-slate-50/70 dark:bg-slate-800 text-slate-500 hover:text-sky-600 dark:text-slate-300 dark:hover:text-sky-400 hover:border-sky-300 dark:hover:border-sky-500 transition-colors shadow-2xs cursor-pointer"
          >
            {isCollapsed ? (
              isRTL ? <PanelLeftOpen className="h-4 w-4" /> : <PanelRightOpen className="h-4 w-4" />
            ) : (
              isRTL ? <PanelRightClose className="h-4 w-4" /> : <PanelLeftClose className="h-4 w-4" />
            )}
          </motion.button>
        </div>

        {/* Navigation Links with Magnetic Hover & Liquid Pill (layoutId) */}
        <nav className="my-4 flex-1 space-y-1 overflow-y-auto overflow-x-hidden px-1 no-scrollbar">
          {NAV_ITEMS.map((item, idx) => {
            const Icon = item.icon;
            const isActive = activeRoute === item.path || (item.path !== '/admin' && activeRoute.startsWith(item.path));
            const showCategoryHeader =
              !isCollapsed &&
              (idx === 1 || idx === 7 || idx === 8);

            return (
              <React.Fragment key={item.id}>
                {showCategoryHeader && (
                  <div className="px-3 pt-4 pb-1 text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 select-none">
                    {idx === 1 ? t.cmsHeader : idx === 7 ? t.commsHeader : t.sysHeader}
                  </div>
                )}

                <div
                  className="relative group"
                  onMouseEnter={() => setHoveredNav(item.id)}
                  onMouseLeave={() => setHoveredNav(null)}
                >
                  <Link
                    href={item.path}
                    prefetch={true}
                    className={`relative flex w-full items-center gap-3 rounded-2xl px-3 py-2.5 text-sm font-medium transition-colors cursor-pointer select-none ${
                      isCollapsed ? 'justify-center' : ''
                    } ${
                      isActive
                        ? 'text-sky-950 dark:text-sky-300 font-bold'
                        : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-100/60 dark:hover:bg-slate-800/40'
                    }`}
                  >
                    {/* Fernly Liquid Morphing Active Background Pill & Continuous Rail */}
                    {isActive && (
                      <motion.div
                        layoutId="sidebar-liquid-pill"
                        transition={{ type: 'spring', stiffness: 400, damping: 32 }}
                        className="absolute inset-0 rounded-2xl shadow-xs"
                        style={{
                          background: `linear-gradient(135deg, ${accentOption.color}15 0%, ${accentOption.color}06 100%)`,
                          borderColor: `${accentOption.color}35`,
                          borderWidth: '1px',
                        }}
                      />
                    )}

                    {isActive && (
                      <motion.span
                        layoutId="sidebar-active-rail"
                        transition={{ type: 'spring', stiffness: 420, damping: 30 }}
                        className="absolute start-0 inset-y-2 w-1 rounded-full shadow-xs"
                        style={{ backgroundColor: accentOption.color }}
                      />
                    )}

                    <motion.div
                      animate={{
                        scale: isCollapsed && hoveredNav === item.id ? 1.18 : 1,
                      }}
                      transition={{ type: 'spring', stiffness: 450, damping: 22 }}
                      className="relative z-10 flex shrink-0 items-center justify-center"
                    >
                      <Icon
                        className="h-5 w-5 transition-colors"
                        style={isActive ? { color: accentOption.color } : undefined}
                      />

                      {/* Collapsed notification floating badge */}
                      {isCollapsed && item.id === 'inquiries' && pendingInquiriesCount > 0 && (
                        <span className="absolute -top-1.5 -end-2 flex h-4 min-w-4 items-center justify-center rounded-full bg-rose-500 px-1 text-[9px] font-bold text-white shadow-xs ring-2 ring-white dark:ring-slate-900">
                          {pendingInquiriesCount}
                        </span>
                      )}
                    </motion.div>

                    <AnimatePresence initial={false}>
                      {!isCollapsed && (
                        <motion.span
                          initial={{ opacity: 0, width: 0 }}
                          animate={{ opacity: 1, width: 'auto' }}
                          exit={{ opacity: 0, width: 0 }}
                          className="relative z-10 flex-1 truncate text-start text-xs sm:text-sm font-semibold tracking-tight"
                        >
                          {item.label[locale]}
                        </motion.span>
                      )}
                    </AnimatePresence>

                    {!isCollapsed && item.id === 'inquiries' && pendingInquiriesCount > 0 && (
                      <span className="relative z-10 rounded-full bg-rose-500/15 dark:bg-rose-500/25 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-800/60 px-2 py-0.5 text-[10px] font-bold shadow-xs">
                        {pendingInquiriesCount}
                      </span>
                    )}

                    {!isCollapsed && isActive && (
                      <motion.span
                        layoutId="sidebar-active-dot"
                        className="relative z-10 h-1.5 w-1.5 rounded-full"
                        style={{ backgroundColor: accentOption.color }}
                      />
                    )}
                  </Link>

                  {/* Floating Tooltip with Shortcut Hint when Sidebar is Collapsed (Rule #4) */}
                  <AnimatePresence>
                    {isCollapsed && hoveredNav === item.id && (
                      <motion.div
                        initial={{ opacity: 0, x: isRTL ? 10 : -10, scale: 0.94 }}
                        animate={{ opacity: 1, x: 0, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.94 }}
                        transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                        className="pointer-events-none fixed z-50 ms-3 flex items-center gap-2 rounded-xl bg-slate-900 dark:bg-slate-800 border border-slate-700 dark:border-slate-700 px-3 py-1.5 text-xs font-semibold text-white shadow-xl"
                        style={{
                          top: 'auto',
                          insetInlineStart: isCollapsed ? '88px' : '280px',
                        }}
                      >
                        <span>{item.label[locale]}</span>
                        <kbd className="rounded bg-white/15 px-1.5 py-0.5 font-mono text-[10px] text-slate-200">
                          {item.shortcut}
                        </kbd>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </React.Fragment>
            );
          })}
        </nav>

        {/* Sidebar Footer (Cleanly spaced, never overlaps dev indicator) */}
        <div className="space-y-2 border-t border-slate-200/80 dark:border-slate-800 pt-3 pb-10">
          <a
            href="/"
            target="_blank"
            rel="noreferrer"
            className="flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200/90 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-800/70 px-3 py-2 text-xs font-semibold text-slate-700 dark:text-slate-300 transition-all hover:border-sky-300 dark:hover:border-sky-500 hover:bg-white dark:hover:bg-slate-800 hover:text-sky-700 dark:hover:text-sky-300"
          >
            <ExternalLink className="h-3.5 w-3.5 shrink-0" />
            {!isCollapsed && <span className="truncate">{t.viewLive}</span>}
          </a>

          <div className={`grid gap-2 ${isCollapsed ? 'grid-cols-1' : 'grid-cols-2'}`}>
            <button
              type="button"
              onClick={handleSafeClearCache}
              className="flex items-center justify-center gap-1.5 rounded-xl border border-amber-200/80 dark:border-amber-800/60 bg-amber-50/60 dark:bg-amber-950/30 px-2 py-2 text-xs font-semibold text-amber-800 dark:text-amber-400 transition-colors hover:bg-amber-100/80 dark:hover:bg-amber-900/40 cursor-pointer"
              title={t.clearCache}
            >
              <RotateCcw className="h-3.5 w-3.5 shrink-0" />
              {!isCollapsed && <span className="truncate">{t.clearCache}</span>}
            </button>
            <button
              type="button"
              onClick={onLogout}
              className="flex items-center justify-center gap-1.5 rounded-xl border border-rose-200/80 dark:border-rose-800/60 bg-rose-50/60 dark:bg-rose-950/30 px-2 py-2 text-xs font-semibold text-rose-700 dark:text-rose-400 transition-colors hover:bg-rose-100/80 dark:hover:bg-rose-900/40 cursor-pointer"
              title={t.signOut}
            >
              <LogOut className="h-3.5 w-3.5 shrink-0" />
              {!isCollapsed && <span className="truncate">{t.signOut}</span>}
            </button>
          </div>
        </div>
      </motion.aside>

      {/* =====================================================================
          MOBILE SWIPE-TO-DISMISS DRAWER (Rule #10 & #14: Safe Area Insets)
          Fixes the 393px iPhone bug where the sidebar cut the screen in half
         ===================================================================== */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileMenuOpen(false)}
              className="fixed inset-0 z-50 bg-slate-900/30 backdrop-blur-xs lg:hidden"
            />
            <motion.aside
              initial={{ x: isRTL ? '100%' : '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: isRTL ? '100%' : '-100%' }}
              transition={{ type: 'spring', stiffness: 380, damping: 34 }}
              drag="x"
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={0.2}
              onDragEnd={(_, info) => {
                if (Math.abs(info.offset.x) > 90 || Math.abs(info.velocity.x) > 400) {
                  setMobileMenuOpen(false);
                }
              }}
              className="fixed inset-y-0 start-0 z-50 flex w-72 max-w-[82vw] flex-col justify-between bg-white dark:bg-slate-900 p-5 pb-[max(1.25rem,env(safe-area-inset-bottom))] pt-[max(1.25rem,env(safe-area-inset-top))] shadow-2xl lg:hidden"
            >
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
                <Link
                  href="/admin"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-2.5 focus:outline-none"
                >
                  <img
                    src={theme === 'dark' ? '/images/logo-icon-white.png' : '/images/logo-icon.png'}
                    alt="AVICINNA Logo"
                    className="h-8 w-8 object-contain shrink-0"
                  />
                  <div className="flex flex-col min-w-0">
                    <span className="text-base font-black tracking-tight text-slate-900 dark:text-white leading-tight">
                      AVICINNA
                    </span>
                    <span className="text-[10px] font-semibold text-sky-600 dark:text-sky-400 tracking-tight truncate leading-tight mt-0.5">
                      {t.subtitle}
                    </span>
                  </div>
                </Link>
                <button
                  type="button"
                  onClick={() => setMobileMenuOpen(false)}
                  className="relative rounded-full p-2 text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 after:absolute after:-inset-2 cursor-pointer"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="my-4 flex-1 space-y-1 overflow-y-auto">
                {NAV_ITEMS.map((item) => {
                  const Icon = item.icon;
                  const isActive = activeRoute === item.path || (item.path !== '/admin' && activeRoute.startsWith(item.path));
                  return (
                    <Link
                      key={item.id}
                      href={item.path}
                      prefetch={true}
                      onClick={() => setMobileMenuOpen(false)}
                      className={`flex w-full items-center gap-3 rounded-xl px-3.5 py-3 text-sm font-semibold cursor-pointer transition-colors ${
                        isActive
                          ? 'bg-sky-50 dark:bg-sky-500/15 text-sky-700 dark:text-sky-300 font-bold'
                          : 'text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
                      }`}
                    >
                      <Icon className="h-5 w-5" />
                      <span>{item.label[locale]}</span>
                    </Link>
                  );
                })}
              </div>

              <div className="border-t border-slate-100 dark:border-slate-800 pt-3">
                <button
                  type="button"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    if (onLogout) onLogout();
                  }}
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-rose-50 dark:bg-rose-950/30 py-2.5 text-xs font-semibold text-rose-700 dark:text-rose-400"
                >
                  <LogOut className="h-4 w-4" />
                  <span>{t.signOut}</span>
                </button>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* =====================================================================
          MAIN CONTENT COLUMN + NON-OVERLAPPING DYNAMIC TOP HEADER (CSS GRID)
         ===================================================================== */}
      {/* =====================================================================
          MAIN CONTENT COLUMN + CLEAN EXECUTIVE TOP HEADER
         ===================================================================== */}
      <div className="relative z-10 flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-30 border-b border-slate-200/80 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl pt-[env(safe-area-inset-top)]">
          <div className="mx-auto flex h-16 max-w-[1600px] items-center justify-between gap-4 px-4 sm:px-6">
            
            {/* LEFT ZONE: Mobile Hamburger + Clean Breadcrumb */}
            <div className="flex min-w-0 items-center gap-3">
              <button
                type="button"
                onClick={() => setMobileMenuOpen(true)}
                aria-label="Open menu"
                className="relative flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-slate-200/80 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 shadow-2xs lg:hidden cursor-pointer"
              >
                <Menu className="h-5 w-5" />
              </button>

              <div className="hidden items-center gap-2 text-xs font-medium text-slate-500 dark:text-slate-400 sm:flex">
                <Link
                  href="/admin"
                  className="hover:text-slate-900 dark:hover:text-white transition-colors"
                >
                  {t.home}
                </Link>
                <span className="text-slate-300 dark:text-slate-600">/</span>
                <span className="truncate rounded-lg bg-sky-500/10 dark:bg-sky-500/20 px-2.5 py-1 font-bold text-sky-800 dark:text-sky-300">
                  {currentNav.label[locale]}
                </span>
              </div>
            </div>

            {/* CENTER ZONE: Fluid Command Search Bar */}
            <div className="flex min-w-0 flex-1 justify-center max-w-md mx-2">
              <button
                id="tour-command-search"
                type="button"
                onClick={onOpenCommandMenu}
                className="group flex h-9 w-full items-center justify-between gap-2 rounded-full border border-slate-200/90 dark:border-slate-700 bg-slate-100/70 dark:bg-slate-800/60 px-3.5 text-xs text-slate-500 dark:text-slate-400 transition-all hover:border-sky-300 hover:bg-white dark:hover:bg-slate-800 hover:shadow-xs cursor-pointer"
              >
                <span className="flex min-w-0 items-center gap-2 truncate">
                  <Search className="h-3.5 w-3.5 shrink-0 text-slate-400 transition-colors group-hover:text-sky-600" />
                  <span className="truncate">{t.searchPlaceholder}</span>
                </span>
                <kbd className="hidden shrink-0 rounded-md border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-1.5 py-0.5 font-mono text-[10px] font-semibold text-slate-600 dark:text-slate-300 shadow-2xs sm:inline-block">
                  ⌘K
                </kbd>
              </button>
            </div>

            {/* RIGHT ZONE: Interactive Guide + Live Site Preview Link + Language Switcher + Celestial Theme Switcher */}
            <div className="flex shrink-0 items-center gap-2 sm:gap-3">
              {/* Interactive Admin Onboarding Spotlight Guide */}
              <InteractiveAdminGuide locale={locale} />

              {/* Live Site Preview Link */}
              <a
                href="/"
                target="_blank"
                rel="noreferrer"
                className="hidden md:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-slate-200/80 dark:border-slate-700 bg-slate-50/70 dark:bg-slate-800/60 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:text-sky-600 dark:hover:text-sky-400 hover:border-sky-300 transition-colors"
                title={t.viewLive}
              >
                <ExternalLink className="h-3.5 w-3.5" />
                <span className="hidden xl:inline">{t.viewLive}</span>
              </a>

              {/* Language Switcher with Smooth Active Pill */}
              <div
                id="tour-language-switcher"
                dir="ltr"
                className="relative inline-flex items-center rounded-full border border-slate-200/80 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 p-0.5"
              >
                {(['fr', 'ar', 'en'] as Locale[]).map((l) => {
                  const active = locale === l;
                  return (
                    <button
                      key={l}
                      type="button"
                      onClick={() => onChangeLocale(l)}
                      className={`relative z-10 px-2.5 py-1 text-[11px] font-bold uppercase transition-colors cursor-pointer ${
                        active ? 'text-white' : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
                      }`}
                    >
                      {active && (
                        <motion.span
                          layoutId="header-lang-pill"
                          transition={{ type: 'spring', stiffness: 420, damping: 30 }}
                          className="absolute inset-0 -z-10 rounded-full bg-gradient-to-r from-sky-600 to-teal-600 shadow-xs"
                        />
                      )}
                      {l}
                    </button>
                  );
                })}
              </div>

              {/* Pinterest-Grade 3D Celestial Liquid Theme Switcher */}
              <div id="tour-theme-switcher">
                <CelestialThemeSwitch theme={theme} onToggle={toggleTheme} />
              </div>
            </div>
          </div>
        </header>

        {/* High-Performance Page Container with Instant Smooth Transition (No mode="wait" blank delay) */}
        <main className="mx-auto w-full max-w-[1600px] flex-1 p-4 sm:p-6 lg:p-8 tabular-nums">
          <motion.div
            key={`${activeRoute}-${locale}`}
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.15, ease: 'easeOut' }}
            className="w-full"
          >
            {children}
          </motion.div>
        </main>
      </div>
    </div>
  );
}
