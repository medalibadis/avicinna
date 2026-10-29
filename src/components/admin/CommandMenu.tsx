'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Command } from 'cmdk';
import { useData } from '@/context/DataContext';
import { useLanguage } from '@/context/LanguageContext';
import {
  LayoutDashboard,
  Layers,
  Building2,
  Stethoscope,
  HeartPulse,
  MessageSquareHeart,
  BookOpen,
  Inbox,
  Settings,
  Plus,
  Globe,
  RotateCcw,
  ExternalLink,
  Search,
  X,
  Sun,
  Moon,
} from 'lucide-react';
import { toast } from 'sonner';
import { useTheme } from '@/context/ThemeContext';

interface CommandMenuProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CommandMenu({ open, onOpenChange }: CommandMenuProps) {
  const router = useRouter();
  const { doctors, hospitals, clearLocalCache } = useData();
  const { language, setLanguage } = useLanguage();
  const { theme, toggleTheme } = useTheme();

  // Keyboard shortcut Cmd+K / Ctrl+K
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if ((e.key === 'k' || e.key === 'K') && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        onOpenChange(!open);
      }
    };
    document.addEventListener('keydown', down);
    return () => document.removeEventListener('keydown', down);
  }, [open, onOpenChange]);

  const runCommand = (command: () => void) => {
    onOpenChange(false);
    command();
  };

  const labels = {
    en: {
      placeholder: 'Type a command or search doctors, hospitals...',
      navigation: 'Navigation',
      quickActions: 'Quick Actions',
      doctors: 'Doctors & Specialists',
      hospitals: 'Partner Hospitals',
      language: 'Language Switcher',
      noResults: 'No matching commands or medical records found.',
      cacheCleared: 'Cache cleared successfully. Re-syncing in 5s...',
      undo: 'Undo',
      cacheRestored: 'Cache reset cancelled.',
    },
    fr: {
      placeholder: 'Rechercher une commande, médecin, hôpital...',
      navigation: 'Navigation',
      quickActions: 'Actions Rapides',
      doctors: 'Médecins & Chirurgiens',
      hospitals: 'Hôpitaux Partenaires',
      language: 'Langue',
      noResults: 'Aucun résultat trouvé.',
      cacheCleared: 'Cache vidé avec succès. Réinitialisation dans 5s...',
      undo: 'Annuler',
      cacheRestored: 'Réinitialisation annulée.',
    },
    ar: {
      placeholder: 'ابحث عن أمر أو طبيب أو مستشفى...',
      navigation: 'التنقل في لوحة التحكم',
      quickActions: 'الإجراءات السريعة',
      doctors: 'الأطباء والاستشاريون',
      hospitals: 'المستشفيات الشريكة',
      language: 'تغيير لغة العرض',
      noResults: 'لم يتم العثور على نتائج مطابقة.',
      cacheCleared: 'تم مسح الكاش بنجاح. ستتم المزامنة خلال 5 ثوانٍ...',
      undo: 'تراجع',
      cacheRestored: 'تم التراجع عن مسح الكاش.',
    },
  }[language];

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 px-4 bg-slate-900/20 backdrop-blur-xl dark:bg-slate-950/50 animate-in fade-in duration-200">
      <div
        className="fixed inset-0 -z-10"
        onClick={() => onOpenChange(false)}
        aria-hidden="true"
      />
      
      <div className="relative w-full max-w-2xl rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-white/95 dark:bg-slate-900/95 p-3 shadow-2xl backdrop-blur-2xl text-slate-800 dark:text-slate-100 overflow-hidden">
        <Command
          className="w-full flex flex-col"
          loop
        >
          {/* Top Search Input with Official Logo */}
          <div className="flex items-center gap-2.5 border-b border-slate-200/80 dark:border-slate-800 px-3 pb-3">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-sky-600 to-teal-600 p-1 shadow-2xs shrink-0">
              <img src="/images/logo-icon-white.png" alt="AVICINNA" className="h-full w-full object-contain" />
            </div>
            <Search className="h-4 w-4 text-sky-600 shrink-0" />
            <Command.Input
              autoFocus
              placeholder={labels.placeholder}
              className="flex-1 bg-transparent text-sm font-medium text-slate-900 dark:text-white outline-none placeholder:text-slate-400"
            />
            <button
              type="button"
              onClick={() => onOpenChange(false)}
              className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-700 dark:hover:text-slate-200"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* Results List */}
          <Command.List className="max-h-[60vh] overflow-y-auto px-1 py-2 text-xs">
            <Command.Empty className="py-8 text-center text-sm text-slate-500 dark:text-slate-400">
              {labels.noResults}
            </Command.Empty>

            {/* Quick Actions */}
            <Command.Group heading={labels.quickActions} className="px-2 py-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-400">
              <Command.Item
                onSelect={() => runCommand(() => toggleTheme())}
                className="flex items-center justify-between gap-2.5 rounded-xl px-3 py-2 text-slate-700 dark:text-slate-200 hover:bg-sky-50 dark:hover:bg-slate-800 cursor-pointer aria-selected:bg-sky-50 dark:aria-selected:bg-slate-800"
              >
                <div className="flex items-center gap-2.5">
                  {theme === 'dark' ? (
                    <Sun className="h-4 w-4 text-amber-500 fill-amber-400" />
                  ) : (
                    <Moon className="h-4 w-4 text-amber-500 fill-amber-400" />
                  )}
                  <span className="font-semibold text-xs">
                    {theme === 'dark' ? 'Switch to Clinical Daylight Mode' : 'Switch to Obsidian Night Mode'}
                  </span>
                </div>
                <kbd className="rounded bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 text-[10px] text-slate-500 dark:text-slate-400">⌘D</kbd>
              </Command.Item>

              <Command.Item
                onSelect={() => runCommand(() => router.push('/admin/doctors'))}
                className="flex items-center justify-between gap-2.5 rounded-xl px-3 py-2 text-slate-700 dark:text-slate-200 hover:bg-sky-50 dark:hover:bg-slate-800 cursor-pointer aria-selected:bg-sky-50 dark:aria-selected:bg-slate-800"
              >
                <div className="flex items-center gap-2.5">
                  <Plus className="h-4 w-4 text-sky-600" />
                  <span className="font-semibold text-xs">+ New Doctor & Specialist</span>
                </div>
                <kbd className="rounded bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 text-[10px] text-slate-500 dark:text-slate-400">N D</kbd>
              </Command.Item>

              <Command.Item
                onSelect={() => runCommand(() => router.push('/admin/blog'))}
                className="flex items-center justify-between gap-2.5 rounded-xl px-3 py-2 text-slate-700 dark:text-slate-200 hover:bg-sky-50 dark:hover:bg-slate-800 cursor-pointer aria-selected:bg-sky-50 dark:aria-selected:bg-slate-800"
              >
                <div className="flex items-center gap-2.5">
                  <Plus className="h-4 w-4 text-teal-600" />
                  <span className="font-semibold text-xs">+ New Medical Article</span>
                </div>
                <kbd className="rounded bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 text-[10px] text-slate-500 dark:text-slate-400">N A</kbd>
              </Command.Item>

              <Command.Item
                onSelect={() =>
                  runCommand(() => {
                    let cancelled = false;
                    const timeout = setTimeout(() => {
                      if (!cancelled) clearLocalCache();
                    }, 5000);

                    toast.success(labels.cacheCleared, {
                      action: {
                        label: labels.undo,
                        onClick: () => {
                          cancelled = true;
                          clearTimeout(timeout);
                          toast.info(labels.cacheRestored);
                        },
                      },
                      duration: 5000,
                    });
                  })
                }
                className="flex items-center justify-between gap-2.5 rounded-xl px-3 py-2 text-amber-800 hover:bg-amber-50 cursor-pointer aria-selected:bg-amber-50"
              >
                <div className="flex items-center gap-2.5">
                  <RotateCcw className="h-4 w-4 text-amber-600" />
                  <span className="font-semibold text-xs">Clear Cache (with 5s Undo)</span>
                </div>
                <span className="text-[10px] text-amber-600">5s Safety</span>
              </Command.Item>

              <Command.Item
                onSelect={() => runCommand(() => window.open('/', '_blank'))}
                className="flex items-center justify-between gap-2.5 rounded-xl px-3 py-2 text-slate-700 hover:bg-slate-100 cursor-pointer aria-selected:bg-slate-100"
              >
                <div className="flex items-center gap-2.5">
                  <ExternalLink className="h-4 w-4 text-slate-500" />
                  <span className="font-medium text-xs">Open Live Website</span>
                </div>
              </Command.Item>
            </Command.Group>

            {/* Navigation Routes */}
            <Command.Group heading={labels.navigation} className="px-2 py-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-400 mt-2">
              <Command.Item
                onSelect={() => runCommand(() => router.push('/admin'))}
                className="flex items-center gap-2.5 rounded-xl px-3 py-2 text-slate-700 hover:bg-sky-50 hover:text-sky-900 cursor-pointer aria-selected:bg-sky-50 aria-selected:text-sky-900"
              >
                <LayoutDashboard className="h-4 w-4 text-sky-600" />
                <span className="text-xs">Executive Dashboard</span>
              </Command.Item>
              <Command.Item
                onSelect={() => runCommand(() => router.push('/admin/sections'))}
                className="flex items-center gap-2.5 rounded-xl px-3 py-2 text-slate-700 hover:bg-sky-50 hover:text-sky-900 cursor-pointer aria-selected:bg-sky-50 aria-selected:text-sky-900"
              >
                <Layers className="h-4 w-4 text-sky-600" />
                <span className="text-xs">Site Sections Editor</span>
              </Command.Item>
              <Command.Item
                onSelect={() => runCommand(() => router.push('/admin/hospitals'))}
                className="flex items-center gap-2.5 rounded-xl px-3 py-2 text-slate-700 hover:bg-sky-50 hover:text-sky-900 cursor-pointer aria-selected:bg-sky-50 aria-selected:text-sky-900"
              >
                <Building2 className="h-4 w-4 text-teal-600" />
                <span className="text-xs">Partner Hospitals</span>
              </Command.Item>
              <Command.Item
                onSelect={() => runCommand(() => router.push('/admin/doctors'))}
                className="flex items-center gap-2.5 rounded-xl px-3 py-2 text-slate-700 hover:bg-sky-50 hover:text-sky-900 cursor-pointer aria-selected:bg-sky-50 aria-selected:text-sky-900"
              >
                <Stethoscope className="h-4 w-4 text-teal-600" />
                <span className="text-xs">Doctors & Specialists</span>
              </Command.Item>
              <Command.Item
                onSelect={() => runCommand(() => router.push('/admin/treatments'))}
                className="flex items-center gap-2.5 rounded-xl px-3 py-2 text-slate-700 hover:bg-sky-50 hover:text-sky-900 cursor-pointer aria-selected:bg-sky-50 aria-selected:text-sky-900"
              >
                <HeartPulse className="h-4 w-4 text-rose-600" />
                <span className="text-xs">Treatments & Procedures</span>
              </Command.Item>
              <Command.Item
                onSelect={() => runCommand(() => router.push('/admin/stories'))}
                className="flex items-center gap-2.5 rounded-xl px-3 py-2 text-slate-700 hover:bg-sky-50 hover:text-sky-900 cursor-pointer aria-selected:bg-sky-50 aria-selected:text-sky-900"
              >
                <MessageSquareHeart className="h-4 w-4 text-amber-600" />
                <span className="text-xs">Patient Stories & Testimonials</span>
              </Command.Item>
              <Command.Item
                onSelect={() => runCommand(() => router.push('/admin/blog'))}
                className="flex items-center gap-2.5 rounded-xl px-3 py-2 text-slate-700 hover:bg-sky-50 hover:text-sky-900 cursor-pointer aria-selected:bg-sky-50 aria-selected:text-sky-900"
              >
                <BookOpen className="h-4 w-4 text-indigo-600" />
                <span className="text-xs">Blog & Medical Articles</span>
              </Command.Item>
              <Command.Item
                onSelect={() => runCommand(() => router.push('/admin/inquiries'))}
                className="flex items-center gap-2.5 rounded-xl px-3 py-2 text-slate-700 hover:bg-sky-50 hover:text-sky-900 cursor-pointer aria-selected:bg-sky-50 aria-selected:text-sky-900"
              >
                <Inbox className="h-4 w-4 text-sky-600" />
                <span className="text-xs">Consultation Inquiries</span>
              </Command.Item>
              <Command.Item
                onSelect={() => runCommand(() => router.push('/admin/settings'))}
                className="flex items-center gap-2.5 rounded-xl px-3 py-2 text-slate-700 hover:bg-sky-50 hover:text-sky-900 cursor-pointer aria-selected:bg-sky-50 aria-selected:text-sky-900"
              >
                <Settings className="h-4 w-4 text-slate-600" />
                <span className="text-xs">Platform & System Settings</span>
              </Command.Item>
            </Command.Group>

            {/* Doctors Quick Search */}
            {doctors.length > 0 && (
              <Command.Group heading={labels.doctors} className="px-2 py-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-400 mt-2">
                {doctors.slice(0, 5).map((doc) => (
                  <Command.Item
                    key={doc.id}
                    onSelect={() => runCommand(() => router.push(`/admin/doctors?id=${doc.id}`))}
                    className="flex items-center justify-between gap-2.5 rounded-xl px-3 py-2 text-slate-700 hover:bg-teal-50 hover:text-teal-900 cursor-pointer aria-selected:bg-teal-50"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <Stethoscope className="h-3.5 w-3.5 text-teal-600 shrink-0" />
                      <span className="truncate text-xs font-semibold">{doc.name[language] || doc.name.en}</span>
                    </div>
                    <span className="text-[10px] text-slate-400 shrink-0">{doc.title[language] || doc.title.en}</span>
                  </Command.Item>
                ))}
              </Command.Group>
            )}

            {/* Hospitals Quick Search */}
            {hospitals.length > 0 && (
              <Command.Group heading={labels.hospitals} className="px-2 py-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-400 mt-2">
                {hospitals.slice(0, 5).map((hosp) => (
                  <Command.Item
                    key={hosp.id}
                    onSelect={() => runCommand(() => router.push(`/admin/hospitals?id=${hosp.id}`))}
                    className="flex items-center justify-between gap-2.5 rounded-xl px-3 py-2 text-slate-700 hover:bg-sky-50 hover:text-sky-900 cursor-pointer aria-selected:bg-sky-50"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <Building2 className="h-3.5 w-3.5 text-sky-600 shrink-0" />
                      <span className="truncate text-xs font-semibold">{hosp.name[language] || hosp.name.en}</span>
                    </div>
                    <span className="text-[10px] text-slate-400 shrink-0">{hosp.city[language] || hosp.city.en}</span>
                  </Command.Item>
                ))}
              </Command.Group>
            )}

            {/* Language Switcher */}
            <Command.Group heading={labels.language} className="px-2 py-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-400 mt-2">
              <Command.Item
                onSelect={() => runCommand(() => setLanguage('en'))}
                className="flex items-center justify-between rounded-xl px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-100 cursor-pointer"
              >
                <div className="flex items-center gap-2">
                  <Globe className="h-3.5 w-3.5 text-sky-600" />
                  <span>English (EN)</span>
                </div>
                {language === 'en' && <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />}
              </Command.Item>
              <Command.Item
                onSelect={() => runCommand(() => setLanguage('fr'))}
                className="flex items-center justify-between rounded-xl px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-100 cursor-pointer"
              >
                <div className="flex items-center gap-2">
                  <Globe className="h-3.5 w-3.5 text-teal-600" />
                  <span>Français (FR)</span>
                </div>
                {language === 'fr' && <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />}
              </Command.Item>
              <Command.Item
                onSelect={() => runCommand(() => setLanguage('ar'))}
                className="flex items-center justify-between rounded-xl px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-100 cursor-pointer"
              >
                <div className="flex items-center gap-2">
                  <Globe className="h-3.5 w-3.5 text-amber-600" />
                  <span>العربية (AR)</span>
                </div>
                {language === 'ar' && <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />}
              </Command.Item>
            </Command.Group>
          </Command.List>
        </Command>
      </div>
    </div>
  );
}
