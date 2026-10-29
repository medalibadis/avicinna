'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Compass,
  MousePointerClick,
  Target,
  CheckCircle2,
  Keyboard,
  X,
  ChevronRight,
  ChevronLeft,
  Zap,
} from 'lucide-react';
import type { Locale } from './AdminShell';

// ============================================================================
// 1. GLOBAL TOUR DEFINITIONS & INTERACTIVE FEATURE SHOWCASES
// ============================================================================

export interface GlobalTourStep {
  id: string;
  targetSelector: string;
  badge: Record<Locale, string>;
  title: Record<Locale, string>;
  description: Record<Locale, string>;
  actionHint: Record<Locale, string>;
  shortcut?: string;
  targetButtonLabel: Record<Locale, string>;
}

export const GLOBAL_ADMIN_TOUR_STEPS: GlobalTourStep[] = [
  {
    id: 'command',
    targetSelector: '#tour-command-search',
    badge: {
      fr: 'Étape 1 sur 5 • Recherche & Commandes Rapides',
      en: 'Step 1 of 5 • Fast Navigation & Actions',
      ar: 'الخطوة 1 من 5 • البحث السريع والأوامر الفورية',
    },
    title: {
      fr: 'Recherche Globale & Palette d’Actions (⌘K)',
      en: 'Global Search & Command Palette (⌘K)',
      ar: 'البحث الشامل ولوحة الأوامر السريعة (⌘K)',
    },
    description: {
      fr: 'Appuyez sur Ctrl+K (ou ⌘K) n’importe où pour localiser un patient, un chirurgien ou un hôpital en un instant.',
      en: 'Press Ctrl+K (or ⌘K) anywhere to instantly locate any patient, surgeon, hospital, or trigger rapid actions.',
      ar: 'اضغط على Ctrl+K في أي وقت للوصول الفوري إلى المرضى، الأطباء، والمستشفيات الشريكة دون مغادرة الصفحة.',
    },
    actionHint: {
      fr: 'Cliquez ici ou tapez ⌘K pour ouvrir la barre de commande',
      en: 'Click here or press ⌘K to open the instant command bar',
      ar: 'انقر هنا أو اضغط ⌘K لفتح شريط الأوامر المباشر',
    },
    shortcut: '⌘K',
    targetButtonLabel: {
      fr: 'Recherche ⌘K',
      en: 'Search ⌘K',
      ar: 'بحث سريع ⌘K',
    },
  },
  {
    id: 'language',
    targetSelector: '#tour-language-switcher',
    badge: {
      fr: 'Étape 2 sur 5 • Moteur Multilingue Synchrone',
      en: 'Step 2 of 5 • Multilingual Sync Engine',
      ar: 'الخطوة 2 من 5 • المزامنة الثلاثية الفورية',
    },
    title: {
      fr: 'Synchronisation Immédiate (AR • FR • EN)',
      en: 'Instant Multilingual Switch (AR • FR • EN)',
      ar: 'التبديل والمزامنة بين اللغات (عربي • إنجليزي • فرنسي)',
    },
    description: {
      fr: 'Basculez l’interface dans votre langue. Toutes les modifications sont synchronisées automatiquement via IA dans les 3 langues.',
      en: 'Toggle the interface into your preferred language. All edits written once can be synchronized across all 3 languages via AI.',
      ar: 'بدّل لغة العرض بنقرة واحدة، واستخدم محرك الذكاء الاصطناعي لمزامنة المحتوى في اللغات الثلاث تلقائياً.',
    },
    actionHint: {
      fr: 'Sélectionnez FR, AR ou EN pour adapter toute la plateforme',
      en: 'Select FR, AR, or EN to switch the entire platform direction and locale',
      ar: 'اختر اللغة المناسبة لضبط اتجاه الواجهة والترجمة',
    },
    targetButtonLabel: {
      fr: 'Sélecteur de Langue',
      en: 'Language Switcher',
      ar: 'مبدل اللغات',
    },
  },
  {
    id: 'theme',
    targetSelector: '#tour-theme-switcher',
    badge: {
      fr: 'Étape 3 sur 5 • Ergonomie & Confort Visuel',
      en: 'Step 3 of 5 • Ergonomics & Ambiance Modes',
      ar: 'الخطوة 3 من 5 • الراحة البصرية والوضع النهاري والليلي',
    },
    title: {
      fr: 'Mode Nuit Obsidienne & Mode Jour Clinique',
      en: 'Obsidian Night & Clinical Daylight Modes',
      ar: 'الوضع الليلي المريح والوضع النهاري الطبي',
    },
    description: {
      fr: 'Passez du mode Jour apaisant au mode Nuit haute-précision avec une animation circulaire fluide et zéro scintillement.',
      en: 'Transition seamlessly between calming Daylight and high-contrast Obsidian Night mode with fluid liquid reveal.',
      ar: 'بدّل بسلاسة بين الوضع النهاري المريح والوضع الليلي الطبي عالي الدقة دون أي وميض أو تأخير.',
    },
    actionHint: {
      fr: 'Cliquez sur l’orbe céleste pour inverser le thème en douceur',
      en: 'Click the celestial orb to trigger the liquid theme reveal',
      ar: 'انقر على الزر الدائري للتبديل بين الوضعين',
    },
    targetButtonLabel: {
      fr: 'Switch Jour / Nuit',
      en: 'Day / Night Switch',
      ar: 'مفتاح الوضع الليلي',
    },
  },
  {
    id: 'active-action',
    targetSelector: '#tour-save-changes-btn, #tour-auto-sync-btn, #tour-add-hospital-btn, #tour-add-doctor-btn, #tour-view-toggle',
    badge: {
      fr: 'Étape 4 sur 5 • Actions Clés & Sauvegarde',
      en: 'Step 4 of 5 • Primary Actions & Save',
      ar: 'الخطوة 4 من 5 • الإجراءات النشطة وحفظ التغييرات',
    },
    title: {
      fr: 'Enregistrement & Actions Principales',
      en: 'Instant Save & Page Primary Actions',
      ar: 'حفظ التعديلات والإجراءات النشطة على الصفحة',
    },
    description: {
      fr: 'Enregistrez vos modifications en direct ou ajoutez de nouvelles entités médicales validées en temps réel.',
      en: 'Persist your edits in real time or create newly accredited medical entries with instant live validation.',
      ar: 'احفظ كافة التعديلات المدخلة أو أضف عناصر جديدة بنقرة واحدة مع التحقق الفوري في قاعدة البيانات.',
    },
    actionHint: {
      fr: 'Cliquez pour enregistrer ou ajouter un élément',
      en: 'Click here to save changes or create a new entry',
      ar: 'انقر على هذا الزر لحفظ التغييرات أو إضافة عنصر جديد',
    },
    shortcut: '⌘S',
    targetButtonLabel: {
      fr: 'Action Principale',
      en: 'Primary Action',
      ar: 'الإجراء الرئيسي',
    },
  },
  {
    id: 'sidebar',
    targetSelector: '#tour-sidebar-nav',
    badge: {
      fr: 'Étape 5 sur 5 • Pôles & Répertoires Médicaux',
      en: 'Step 5 of 5 • Medical Registries & Sections',
      ar: 'الخطوة 5 من 5 • السجلات والأقسام الطبية',
    },
    title: {
      fr: 'Gestion Complète des Établissements & Chirurgiens',
      en: 'Complete Hospital & Surgeon Registries',
      ar: 'إدارة المستشفيات الشريكة والأطباء والاستشارات',
    },
    description: {
      fr: 'Basculez entre le centre de triage, les hôpitaux certifiés JCI, l’annuaire des spécialistes et l’éditeur CMS.',
      en: 'Switch between patient intake triage, JCI-accredited partner hospitals, surgeon rosters, and homepage CMS sections.',
      ar: 'تنقل بسهولة بين لوحة المتابعة، شبكة المستشفيات المعتمدة، كادر الأطباء، وإدارة محتوى الموقع.',
    },
    actionHint: {
      fr: 'Utilisez la barre latérale pour naviguer dans tous les répertoires',
      en: 'Use the sidebar to explore and manage all medical directories',
      ar: 'استخدم القائمة الجانبية للتنقل بين كافة الأدلة الطبية',
    },
    shortcut: '⌘B',
    targetButtonLabel: {
      fr: 'Menu Latéral',
      en: 'Sidebar Navigation',
      ar: 'القائمة الجانبية',
    },
  },
];

export type TourStep = GlobalTourStep;

// ============================================================================
// 2. LIVE ON-SCREEN SPOTLIGHT OVERLAY WITH DYNAMIC RESIZE ENGINE
// ============================================================================

export interface LiveSpotlightTourProps {
  steps: {
    targetSelector: string;
    title: string;
    desc: string;
    actionHint?: string;
    shortcut?: string;
  }[];
  initialStepIndex?: number;
  isOpen: boolean;
  onClose: () => void;
  locale?: Locale;
}

export function LiveSpotlightTour({
  steps,
  initialStepIndex = 0,
  isOpen,
  onClose,
  locale = 'fr',
}: LiveSpotlightTourProps) {
  const [mounted, setMounted] = useState(false);
  const [currentIdx, setCurrentIdx] = useState(initialStepIndex);
  const [targetRect, setTargetRect] = useState<DOMRect | null>(null);
  const [clickedTarget, setClickedTarget] = useState(false);
  const [windowSize, setWindowSize] = useState({
    width: typeof window !== 'undefined' ? window.innerWidth : 1200,
    height: typeof window !== 'undefined' ? window.innerHeight : 800,
  });

  const isRtl = locale === 'ar';

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    setCurrentIdx(initialStepIndex);
    setClickedTarget(false);
  }, [initialStepIndex, isOpen]);

  // Synchronous bounding rect measurement (pure calculation, never scrolls)
  const measureTarget = useCallback(() => {
    if (!isOpen || steps.length === 0) return;
    const currentStep = steps[currentIdx] || steps[0];
    if (!currentStep) return;

    try {
      const el = document.querySelector(currentStep.targetSelector) as HTMLElement | null;
      if (el) {
        const rect = el.getBoundingClientRect();
        setTargetRect(rect);
      } else {
        setTargetRect(null);
      }
    } catch (err) {
      setTargetRect(null);
    }
  }, [isOpen, steps, currentIdx]);

  // Smooth-scroll ONLY when switching to a different step
  useEffect(() => {
    if (!isOpen || steps.length === 0) return;
    const currentStep = steps[currentIdx] || steps[0];
    if (!currentStep) return;

    try {
      const el = document.querySelector(currentStep.targetSelector) as HTMLElement | null;
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'center' });
        measureTarget();
        const t1 = setTimeout(measureTarget, 80);
        const t2 = setTimeout(measureTarget, 240);
        const t3 = setTimeout(measureTarget, 480);
        return () => {
          clearTimeout(t1);
          clearTimeout(t2);
          clearTimeout(t3);
        };
      }
    } catch {
      // Ignore lookup errors
    }
  }, [currentIdx, isOpen, measureTarget]);

  // Real-time window resizing and layout tracking via requestAnimationFrame + ResizeObserver
  useEffect(() => {
    if (!isOpen) return;

    let rafId: number;
    const handleDynamicUpdate = () => {
      cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(() => {
        setWindowSize({
          width: window.innerWidth,
          height: window.innerHeight,
        });
        measureTarget();
      });
    };

    window.addEventListener('resize', handleDynamicUpdate, { passive: true });
    window.addEventListener('scroll', handleDynamicUpdate, { passive: true, capture: true });

    let ro: ResizeObserver | null = null;
    if (typeof ResizeObserver !== 'undefined' && document.body) {
      ro = new ResizeObserver(handleDynamicUpdate);
      ro.observe(document.body);
    }

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener('resize', handleDynamicUpdate);
      window.removeEventListener('scroll', handleDynamicUpdate, true);
      if (ro) ro.disconnect();
    };
  }, [isOpen, measureTarget]);

  // Keyboard navigation: ArrowRight / ArrowLeft / Escape
  useEffect(() => {
    if (!isOpen) return;

    const handleTourKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        if (isRtl) {
          setCurrentIdx((i) => Math.max(0, i - 1));
        } else {
          setCurrentIdx((i) => Math.min(steps.length - 1, i + 1));
        }
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        if (isRtl) {
          setCurrentIdx((i) => Math.min(steps.length - 1, i + 1));
        } else {
          setCurrentIdx((i) => Math.max(0, i - 1));
        }
      }
    };

    window.addEventListener('keydown', handleTourKeyDown);
    return () => window.removeEventListener('keydown', handleTourKeyDown);
  }, [isOpen, steps.length, isRtl, onClose]);

  if (!mounted || !isOpen || steps.length === 0) return null;

  const currentStep = steps[currentIdx] || steps[0];
  const hasMultiple = steps.length > 1;

  // Execute actual target action
  const handleTryClickTarget = () => {
    try {
      const el = document.querySelector(currentStep.targetSelector) as HTMLElement | null;
      if (el) {
        setClickedTarget(true);
        el.click();
        setTimeout(() => setClickedTarget(false), 900);
      }
    } catch (err) {
      console.warn('Could not trigger click on target element', err);
    }
  };

  // ========================================================================
  // DYNAMIC VIEWPORT & COLLISION-FREE POSITIONING CALCULATION
  // ========================================================================
  const cardWidth = Math.min(390, windowSize.width - 32);
  const cardHeight = 280;

  let tooltipTop = 100;
  let tooltipLeft = 16;

  if (!targetRect) {
    // Fallback: screen center
    tooltipTop = Math.max(24, windowSize.height / 2 - cardHeight / 2);
    tooltipLeft = Math.max(16, (windowSize.width - cardWidth) / 2);
  } else if (windowSize.width < 640) {
    // Small mobile screens: safely dock at the bottom to avoid covering the UI
    tooltipTop = Math.max(16, windowSize.height - cardHeight - 16);
    tooltipLeft = Math.max(16, (windowSize.width - cardWidth) / 2);
  } else if (targetRect.height > 400) {
    // Large full-height component (e.g. Sidebar Navigation):
    // Position comfortably beside it in the main content area
    tooltipTop = Math.max(80, Math.min(windowSize.height - cardHeight - 32, 130));

    if (targetRect.left > windowSize.width / 2) {
      // Sidebar on the right side (Arabic RTL) -> position to the left of sidebar
      tooltipLeft = Math.max(16, targetRect.left - cardWidth - 20);
    } else {
      // Sidebar on the left side (LTR) -> position to the right of sidebar
      tooltipLeft = Math.min(windowSize.width - cardWidth - 16, targetRect.right + 20);
    }
  } else {
    // Standard elements: check available space below and above
    const spaceBelow = windowSize.height - targetRect.bottom;
    const spaceAbove = targetRect.top;

    if (spaceBelow >= cardHeight + 20) {
      tooltipTop = targetRect.bottom + 16;
    } else if (spaceAbove >= cardHeight + 20) {
      tooltipTop = targetRect.top - cardHeight - 16;
    } else {
      tooltipTop = Math.max(16, Math.min(windowSize.height - cardHeight - 16, targetRect.bottom + 12));
    }

    // Horizontal positioning: align with target or center with safe edge clamping
    if (targetRect.right > windowSize.width - 240) {
      // Target is near the right edge
      tooltipLeft = Math.max(16, targetRect.right - cardWidth);
    } else if (targetRect.left < 240) {
      // Target is near the left edge
      tooltipLeft = Math.min(windowSize.width - cardWidth - 16, targetRect.left);
    } else {
      // Target is centered
      const targetCenterX = targetRect.left + targetRect.width / 2;
      tooltipLeft = Math.max(16, Math.min(windowSize.width - cardWidth - 16, targetCenterX - cardWidth / 2));
    }
  }

  // Cursor coordinates
  const cursorX = targetRect ? targetRect.left + targetRect.width / 2 : windowSize.width / 2;
  const cursorY = targetRect ? targetRect.top + targetRect.height / 2 : windowSize.height / 2;

  // Render via React Portal to document.body to break out of any parent stacking contexts
  return createPortal(
    <AnimatePresence>
      <div className="fixed inset-0 z-[9999] overflow-hidden pointer-events-auto">
        {/* Luminous Ambient Clinical Veil (Calm, translucent depth of field) */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-slate-900/20 dark:bg-slate-950/45 backdrop-blur-[2.5px] transition-opacity cursor-pointer"
        />

        {/* Ethereal Clinical Spotlight Ring around Target Element */}
        {targetRect && (
          <motion.div
            key={`target-ring-${currentIdx}`}
            initial={false}
            animate={{
              top: Math.max(0, targetRect.top - 6),
              left: Math.max(0, targetRect.left - 6),
              width: targetRect.width + 12,
              height: targetRect.height + 12,
              opacity: 1,
            }}
            transition={{ type: 'spring', stiffness: 500, damping: 32 }}
            style={{
              position: 'fixed',
              zIndex: 10001,
            }}
            className="pointer-events-none rounded-2xl ring-4 ring-sky-500 shadow-[0_0_35px_rgba(14,165,233,0.55),0_0_70px_rgba(14,165,233,0.25)]"
          >
            {/* Pulsing Beacon Ring */}
            <span className="absolute -inset-2.5 rounded-2xl border-2 border-sky-400 animate-ping opacity-60 pointer-events-none" />

            {/* Precision Corner Reticle Brackets */}
            <span className="absolute -top-1.5 -left-1.5 h-3.5 w-3.5 border-t-2 border-l-2 border-sky-300 rounded-tl-sm pointer-events-none" />
            <span className="absolute -top-1.5 -right-1.5 h-3.5 w-3.5 border-t-2 border-r-2 border-sky-300 rounded-tr-sm pointer-events-none" />
            <span className="absolute -bottom-1.5 -left-1.5 h-3.5 w-3.5 border-b-2 border-l-2 border-sky-300 rounded-bl-sm pointer-events-none" />
            <span className="absolute -bottom-1.5 -right-1.5 h-3.5 w-3.5 border-b-2 border-r-2 border-sky-300 rounded-br-sm pointer-events-none" />

            {/* Micro-Pill Target Label */}
            <span className="absolute -top-7 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full bg-sky-600 px-2.5 py-0.5 text-[10px] font-black text-white shadow-md shadow-sky-600/30 pointer-events-none">
              {locale === 'fr' ? 'Élément Actif' : locale === 'ar' ? 'الزر المستهدف' : 'Target Element'}
            </span>
          </motion.div>
        )}

        {/* Dynamic Animated Pointer with Real-Time Coordinate Tracking */}
        {targetRect && (
          <motion.div
            key={`cursor-pos-${currentIdx}`}
            initial={false}
            animate={{
              x: cursorX,
              y: cursorY,
              opacity: 1,
            }}
            transition={{ type: 'spring', stiffness: 450, damping: 30 }}
            style={{ position: 'fixed', top: 0, left: 0, zIndex: 10002, pointerEvents: 'none' }}
          >
            {/* Pointer SVG with gentle physical click pulse */}
            <motion.div
              animate={{
                scale: [1, 0.85, 1],
              }}
              transition={{
                duration: 1.2,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
              className="relative -top-2 -left-2"
            >
              <svg
                width="34"
                height="34"
                viewBox="0 0 24 24"
                fill="none"
                className="drop-shadow-[0_4px_14px_rgba(0,151,251,0.6)]"
              >
                <path
                  d="M5.5 3.5L11.5 19.5L14.5 13.5L20.5 11.5L5.5 3.5Z"
                  fill="#0097FB"
                  stroke="#FFFFFF"
                  strokeWidth="2.2"
                  strokeLinejoin="round"
                />
              </svg>

              {/* Touch ripple indicator */}
              <span className="absolute top-1 left-1 h-7 w-7 rounded-full border-2 border-sky-400 bg-sky-400/25 animate-ping pointer-events-none" />

              {/* Floating action cue tag */}
              <div
                dir={isRtl ? 'rtl' : 'ltr'}
                className="absolute top-5 left-6 whitespace-nowrap rounded-lg bg-sky-900/90 border border-sky-400/50 px-2 py-0.5 text-[10px] font-extrabold text-white shadow-md backdrop-blur-sm pointer-events-none"
              >
                {locale === 'fr' ? 'Cliquez ici' : locale === 'ar' ? 'انقر هنا' : 'Click here'}
              </div>
            </motion.div>
          </motion.div>
        )}

        {/* Responsive, Collision-Free Guided Tooltip HUD */}
        <motion.div
          key={`tooltip-pos-${currentIdx}`}
          initial={false}
          animate={{
            top: tooltipTop,
            left: tooltipLeft,
            opacity: 1,
          }}
          transition={{ type: 'spring', stiffness: 450, damping: 32 }}
          dir={isRtl ? 'rtl' : 'ltr'}
          style={{
            position: 'fixed',
            width: cardWidth,
            zIndex: 10003,
          }}
          className="rounded-3xl border border-sky-500/40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-2xl p-5 sm:p-6 shadow-2xl text-slate-900 dark:text-white"
        >
          {/* Top Progress Track */}
          <div className="absolute top-0 inset-x-0 h-1 overflow-hidden rounded-t-3xl bg-slate-100 dark:bg-slate-800">
            <motion.div
              className="h-full bg-gradient-to-r from-sky-500 to-teal-500"
              initial={{ width: 0 }}
              animate={{ width: `${((currentIdx + 1) / steps.length) * 100}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>

          {/* Header Bar */}
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sky-500/10 text-sky-700 dark:text-sky-300 text-xs font-bold border border-sky-500/20">
                <Compass className="w-3.5 h-3.5 text-sky-600 dark:text-sky-400 shrink-0" />
                <span>
                  {locale === 'fr'
                    ? `Étape ${currentIdx + 1} / ${steps.length}`
                    : locale === 'ar'
                    ? `الخطوة ${currentIdx + 1} من ${steps.length}`
                    : `Step ${currentIdx + 1} of ${steps.length}`}
                </span>
              </span>

              {currentStep.shortcut && (
                <kbd className="rounded-md border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 font-mono text-[10px] font-bold text-slate-700 dark:text-slate-300">
                  {currentStep.shortcut}
                </kbd>
              )}
            </div>

            <button
              type="button"
              onClick={onClose}
              title={locale === 'fr' ? 'Fermer la visite (Échap)' : locale === 'ar' ? 'إغلاق الجولة (Esc)' : 'Close Tour (Esc)'}
              className="rounded-full p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Title & Description */}
          <div className="mt-3.5 space-y-1.5">
            <h4 className="text-base font-extrabold text-slate-900 dark:text-white leading-snug">
              {currentStep.title}
            </h4>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              {currentStep.desc}
            </p>
          </div>

          {/* Action Hint & Interactive Click Simulator */}
          {currentStep.actionHint && (
            <div className="mt-3 rounded-xl bg-sky-50/90 dark:bg-sky-950/40 border border-sky-200/70 dark:border-sky-800/60 p-2.5 text-[11px] font-semibold text-sky-800 dark:text-sky-300 flex items-center justify-between gap-2">
              <div className="flex items-center gap-2 min-w-0">
                <MousePointerClick className="w-3.5 h-3.5 text-sky-600 dark:text-sky-400 shrink-0" />
                <span className="truncate">{currentStep.actionHint}</span>
              </div>

              <button
                type="button"
                onClick={handleTryClickTarget}
                className="inline-flex items-center gap-1 shrink-0 rounded-lg bg-sky-600 hover:bg-sky-700 text-white px-2.5 py-1 text-[10px] font-bold transition-all shadow-2xs cursor-pointer"
              >
                <Zap className="w-3 h-3 text-yellow-300" />
                <span>
                  {clickedTarget
                    ? locale === 'fr'
                      ? 'Déclenché !'
                      : locale === 'ar'
                      ? 'تم التفعيل !'
                      : 'Triggered!'
                    : locale === 'fr'
                    ? 'Tester'
                    : locale === 'ar'
                    ? 'تجربة الزر'
                    : 'Try Live'}
                </span>
              </button>
            </div>
          )}

          {/* Direct Step Indicator Dots */}
          <div className="mt-4 flex items-center justify-center gap-1.5">
            {steps.map((_, dotIdx) => (
              <button
                key={dotIdx}
                type="button"
                onClick={() => setCurrentIdx(dotIdx)}
                className={`h-1.5 rounded-full transition-all cursor-pointer ${
                  dotIdx === currentIdx
                    ? 'w-6 bg-sky-500'
                    : 'w-1.5 bg-slate-200 dark:bg-slate-700 hover:bg-slate-300'
                }`}
                title={`Step ${dotIdx + 1}`}
              />
            ))}
          </div>

          {/* Navigation Controls Bar */}
          <div className="mt-4 flex items-center justify-between pt-3 border-t border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-2">
              {hasMultiple && currentIdx > 0 && (
                <button
                  type="button"
                  onClick={() => setCurrentIdx((i) => Math.max(0, i - 1))}
                  className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer"
                >
                  {isRtl ? <ChevronRight className="w-3.5 h-3.5" /> : <ChevronLeft className="w-3.5 h-3.5" />}
                  <span>{locale === 'fr' ? 'Précédent' : locale === 'ar' ? 'السابق' : 'Previous'}</span>
                </button>
              )}

              {hasMultiple && currentIdx < steps.length - 1 ? (
                <button
                  type="button"
                  onClick={() => setCurrentIdx((i) => Math.min(steps.length - 1, i + 1))}
                  className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-xl bg-gradient-to-r from-sky-600 to-teal-600 hover:from-sky-700 hover:to-teal-700 text-white text-xs font-bold shadow-sm shadow-sky-600/20 cursor-pointer"
                >
                  <span>{locale === 'fr' ? 'Suivant' : locale === 'ar' ? 'التالي' : 'Next'}</span>
                  {isRtl ? <ChevronLeft className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
                </button>
              ) : (
                <button
                  type="button"
                  onClick={onClose}
                  className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-sm shadow-emerald-600/20 cursor-pointer"
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>{locale === 'fr' ? 'Terminer la visite' : locale === 'ar' ? 'إنهاء الجولة' : 'Finish Tour'}</span>
                </button>
              )}
            </div>

            <button
              type="button"
              onClick={onClose}
              className="text-[11px] text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition-colors cursor-pointer"
            >
              {locale === 'fr' ? 'Quitter (Échap)' : locale === 'ar' ? 'إغلاق (Esc)' : 'Exit (Esc)'}
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>,
    document.body
  );
}

export const GUIDE_ENABLED_KEY = 'avicinna_admin_guide_enabled_v1';

export function useAdminGuideStatus() {
  const [isEnabled, setIsEnabled] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem(GUIDE_ENABLED_KEY);
      if (saved !== null) {
        return saved === 'true';
      }
      const settingsRaw = localStorage.getItem('avicinna_admin_settings_v1');
      if (settingsRaw) {
        try {
          const parsed = JSON.parse(settingsRaw);
          if (typeof parsed.adminGuideEnabled === 'boolean') {
            return parsed.adminGuideEnabled;
          }
        } catch {}
      }
    }
    return true;
  });

  useEffect(() => {
    const handleStatusChange = () => {
      const saved = localStorage.getItem(GUIDE_ENABLED_KEY);
      if (saved !== null) {
        setIsEnabled(saved === 'true');
        return;
      }
      const settingsRaw = localStorage.getItem('avicinna_admin_settings_v1');
      if (settingsRaw) {
        try {
          const parsed = JSON.parse(settingsRaw);
          if (typeof parsed.adminGuideEnabled === 'boolean') {
            setIsEnabled(parsed.adminGuideEnabled);
            return;
          }
        } catch {}
      }
      setIsEnabled(true);
    };

    window.addEventListener('storage', handleStatusChange);
    window.addEventListener('avicinna:guide-status-changed', handleStatusChange);

    return () => {
      window.removeEventListener('storage', handleStatusChange);
      window.removeEventListener('avicinna:guide-status-changed', handleStatusChange);
    };
  }, []);

  const setGuideEnabled = (enabled: boolean) => {
    setIsEnabled(enabled);
    if (typeof window !== 'undefined') {
      localStorage.setItem(GUIDE_ENABLED_KEY, String(enabled));
      const settingsRaw = localStorage.getItem('avicinna_admin_settings_v1');
      if (settingsRaw) {
        try {
          const parsed = JSON.parse(settingsRaw);
          parsed.adminGuideEnabled = enabled;
          localStorage.setItem('avicinna_admin_settings_v1', JSON.stringify(parsed));
        } catch {}
      }
      window.dispatchEvent(new Event('avicinna:guide-status-changed'));
    }
  };

  return { isEnabled, setGuideEnabled };
}

// ============================================================================
// 3. TOP NAVBAR INTERACTIVE ONBOARDING GUIDE TRIGGER (DIRECT LIVE WALKTHROUGH)
// ============================================================================

export function InteractiveAdminGuide({ locale = 'fr' }: { locale?: Locale }) {
  const { isEnabled } = useAdminGuideStatus();
  const [liveTourActive, setLiveTourActive] = useState(false);
  const [shortcutsModalOpen, setShortcutsModalOpen] = useState(false);
  const isRtl = locale === 'ar';

  useEffect(() => {
    if (!isEnabled) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      if (
        target.tagName === 'INPUT' ||
        target.tagName === 'TEXTAREA' ||
        target.isContentEditable
      ) {
        return;
      }

      if (e.key === '?' || (e.shiftKey && e.key === '/')) {
        e.preventDefault();
        setLiveTourActive((prev) => !prev);
      }
    };

    const handleStartTour = () => {
      setLiveTourActive(true);
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('avicinna:start-admin-tour', handleStartTour);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('avicinna:start-admin-tour', handleStartTour);
    };
  }, [isEnabled]);

  if (!isEnabled) return null;

  const shortcutsList = [
    {
      key: '⌘K',
      desc:
        locale === 'fr'
          ? 'Palette de commandes globale & recherche'
          : locale === 'ar'
          ? 'البحث الشامل ولوحة الأوامر السريعة'
          : 'Global Search & Command Palette',
    },
    {
      key: '⌘B',
      desc:
        locale === 'fr'
          ? 'Replier / Déplier la barre latérale'
          : locale === 'ar'
          ? 'طي / توسيع القائمة الجانبية'
          : 'Toggle Sidebar Collapse',
    },
    {
      key: '⌘S',
      desc:
        locale === 'fr'
          ? 'Enregistrer les modifications en cours'
          : locale === 'ar'
          ? 'حفظ التعديلات النشطة فوراً'
          : 'Save active modifications',
    },
    {
      key: '?',
      desc:
        locale === 'fr'
          ? 'Démarrer la visite guidée en direct sur l’écran'
          : locale === 'ar'
          ? 'بدء الجولة الإرشادية الحية على الشاشة'
          : 'Start live on-screen spotlight tour',
    },
    {
      key: 'Esc',
      desc:
        locale === 'fr'
          ? 'Fermer les modales ou quitter la visite'
          : locale === 'ar'
          ? 'إغلاق النوافذ أو إنهاء الجولة'
          : 'Close modals or exit tour',
    },
  ];

  const tourStepsForLiveSpotlight = GLOBAL_ADMIN_TOUR_STEPS.map((s) => ({
    targetSelector: s.targetSelector,
    title: s.title[locale],
    desc: s.description[locale],
    actionHint: s.actionHint[locale],
    shortcut: s.shortcut,
  }));

  return (
    <>
      {/* Trigger Button on Top Navbar: Direct 1-Click Launch to Live On-Screen Tour */}
      <motion.button
        type="button"
        whileHover={{ scale: 1.04 }}
        whileTap={{ scale: 0.96 }}
        onClick={() => setLiveTourActive(true)}
        title={
          locale === 'fr'
            ? 'Guide interactif sur l’écran (Touche ?)'
            : locale === 'ar'
            ? 'الجولة الإرشادية التفاعلية على الشاشة (?)'
            : 'Interactive Screen Tour (?)'
        }
        className="inline-flex items-center gap-1.5 rounded-full border border-sky-500/30 bg-sky-500/10 dark:bg-sky-500/15 px-3 py-1.5 text-xs font-semibold text-sky-700 dark:text-sky-300 shadow-2xs transition-colors hover:bg-sky-500/20 cursor-pointer"
      >
        <Compass className="h-3.5 w-3.5 text-sky-600 dark:text-sky-400" />
        <span>
          {locale === 'fr'
            ? 'Guide interactif'
            : locale === 'ar'
            ? 'دليل الاستخدام'
            : 'Interactive Guide'}
        </span>
        <kbd className="hidden sm:inline-block rounded bg-sky-500/20 px-1 py-0.2 font-mono text-[10px] text-sky-700 dark:text-sky-300">
          ?
        </kbd>
      </motion.button>

      {/* Live Spotlight Tour (Glides cursor directly on real UI) */}
      <LiveSpotlightTour
        isOpen={liveTourActive}
        onClose={() => setLiveTourActive(false)}
        steps={tourStepsForLiveSpotlight}
        locale={locale}
      />

      {/* Optional Clean Keyboard Shortcuts Drawer Modal */}
      <AnimatePresence>
        {shortcutsModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShortcutsModalOpen(false)}
              className="fixed inset-0 bg-slate-900/30 dark:bg-slate-950/50 backdrop-blur-sm"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              dir={isRtl ? 'rtl' : 'ltr'}
              className="relative z-10 w-full max-w-lg rounded-3xl border border-slate-200 dark:border-slate-800 bg-white/95 dark:bg-slate-900/95 backdrop-blur-2xl p-6 shadow-2xl text-slate-900 dark:text-white"
            >
              <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-2">
                  <Keyboard className="w-5 h-5 text-sky-600 dark:text-sky-400" />
                  <h3 className="text-base font-bold">
                    {locale === 'fr'
                      ? 'Raccourcis Clavier'
                      : locale === 'ar'
                      ? 'اختصارات لوحة المفاتيح'
                      : 'Keyboard Shortcuts'}
                  </h3>
                </div>

                <button
                  type="button"
                  onClick={() => setShortcutsModalOpen(false)}
                  className="rounded-full p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="mt-4 space-y-2.5">
                {shortcutsList.map((sc) => (
                  <div
                    key={sc.key}
                    className="flex items-center justify-between rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-800/60 p-3 text-xs"
                  >
                    <span className="text-slate-700 dark:text-slate-300 font-medium">{sc.desc}</span>
                    <kbd className="rounded-lg border border-sky-400/30 bg-sky-500/10 px-2.5 py-1 font-mono text-[11px] font-bold text-sky-700 dark:text-sky-300">
                      {sc.key}
                    </kbd>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}

// ============================================================================
// 4. IN-PAGE INTERACTIVE SECTION TIP BANNER (WITH ON-PAGE LIVE SPOTLIGHT)
// ============================================================================

export interface InteractiveStepItem {
  id?: string;
  number?: number;
  title: string;
  desc: string;
  targetButtonLabel: string;
  actionOutcome: string;
  targetSelector?: string;
}

interface ContextualSectionTipProps {
  title: string;
  steps: string[] | InteractiveStepItem[];
  locale?: Locale;
}

export function ContextualSectionTip({
  title,
  steps,
  locale = 'fr',
}: ContextualSectionTipProps) {
  const { isEnabled } = useAdminGuideStatus();
  const [expanded, setExpanded] = useState(false);
  const [activeStepIdx, setActiveStepIdx] = useState(0);
  const [spotlightOpen, setSpotlightOpen] = useState(false);
  const isRtl = locale === 'ar';

  if (!isEnabled) return null;

  // Normalize steps to InteractiveStepItem[]
  const normalizedSteps: InteractiveStepItem[] = steps.map((s, idx) => {
    if (typeof s === 'string') {
      const parts = s.split(' : ');
      const cleanText = s.replace(/^[0-9]+\.\s*/, '');
      return {
        number: idx + 1,
        title: parts.length > 1 ? parts[0] : `${locale === 'fr' ? 'Étape' : locale === 'ar' ? 'الخطوة' : 'Step'} ${idx + 1}`,
        desc: cleanText,
        targetButtonLabel: idx === 0 ? '+ Action' : idx === 1 ? 'Auto-Translate' : 'Confirm',
        actionOutcome:
          locale === 'fr'
            ? 'Action guidée sur la page'
            : locale === 'ar'
            ? 'تم التحقق من الإجراء'
            : 'Guided action verified',
      };
    }
    return {
      ...s,
      number: s.number || idx + 1,
    };
  });

  // Map step to spotlight target selector
  const getSelectorForStep = (stepItem: InteractiveStepItem, idx: number) => {
    if (stepItem.targetSelector) return stepItem.targetSelector;
    if (idx === 0) return '#tour-auto-sync-btn, #tour-add-hospital-btn, #tour-add-doctor-btn, #tour-view-toggle';
    if (idx === 1) return '#tour-sections-tabs, #tour-settings-tabs, #tour-hospital-search, #tour-doctor-search, #tour-table-search';
    return '#tour-save-changes-btn, #tour-command-search, #tour-language-switcher';
  };

  const handleLaunchSpotlightForStep = (idx: number) => {
    setActiveStepIdx(idx);
    setSpotlightOpen(true);
  };

  const toggleLabel = expanded
    ? locale === 'fr'
      ? 'Masquer le guide'
      : locale === 'ar'
      ? 'إخفاء الخطوات'
      : 'Hide Interactive Steps'
    : locale === 'fr'
    ? `Afficher les étapes (${normalizedSteps.length})`
    : locale === 'ar'
    ? `عرض الخطوات التفاعلية (${normalizedSteps.length})`
    : `Show Interactive Steps (${normalizedSteps.length})`;

  // Strip any AI emojis from the title
  const cleanTitle = title.replace(/[\u{1F300}-\u{1F9FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/gu, '').trim();

  const spotlightStepsList = normalizedSteps.map((st, i) => ({
    targetSelector: getSelectorForStep(st, i),
    title: st.title,
    desc: st.desc,
    actionHint:
      locale === 'fr'
        ? `Cliquez ici pour déclencher : ${st.targetButtonLabel}`
        : locale === 'ar'
        ? `انقر هنا لتنفيذ: ${st.targetButtonLabel}`
        : `Click here to execute: ${st.targetButtonLabel}`,
  }));

  return (
    <>
      {/* Live Spotlight Overlay launched directly from the banner */}
      <LiveSpotlightTour
        isOpen={spotlightOpen}
        onClose={() => setSpotlightOpen(false)}
        initialStepIndex={activeStepIdx}
        steps={spotlightStepsList}
        locale={locale}
      />

      <div className="mb-5 overflow-hidden rounded-2xl border border-sky-500/25 bg-sky-500/5 dark:bg-sky-950/20 backdrop-blur-md">
        {/* Banner Bar */}
        <button
          type="button"
          onClick={() => setExpanded(!expanded)}
          className="flex w-full items-center justify-between px-4 py-2.5 text-left text-xs font-semibold text-sky-700 dark:text-sky-300 cursor-pointer"
        >
          <span className="flex items-center gap-2">
            <Compass className="h-4 w-4 text-sky-600 dark:text-sky-400 shrink-0" />
            <span className="font-bold">{cleanTitle}</span>
          </span>
          <span className="text-[11px] font-bold text-sky-700 dark:text-sky-300 underline underline-offset-2 opacity-90 hover:opacity-100">
            {toggleLabel}
          </span>
        </button>

        <AnimatePresence initial={false}>
          {expanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 360, damping: 30 }}
              className="border-t border-sky-500/15 p-4 space-y-4"
            >
              {/* Step Action Cards */}
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                {normalizedSteps.map((stepItem, idx) => {
                  const isSelected = activeStepIdx === idx;
                  return (
                    <div
                      key={idx}
                      className={`flex flex-col justify-between rounded-xl p-3.5 text-xs transition-all ${
                        isSelected
                          ? 'border-2 border-sky-500 bg-white shadow-sm dark:bg-slate-900 text-slate-900 dark:text-white'
                          : 'border border-slate-200/80 dark:border-slate-800 bg-white/70 dark:bg-slate-900/50 text-slate-600 dark:text-slate-300'
                      }`}
                    >
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span
                            className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full font-bold text-[11px] ${
                              isSelected
                                ? 'bg-sky-500 text-white'
                                : 'bg-sky-500/15 text-sky-600 dark:text-sky-400'
                            }`}
                          >
                            {stepItem.number}
                          </span>
                          <span className="text-[11px] font-bold text-slate-800 dark:text-slate-200">
                            {stepItem.title}
                          </span>
                        </div>

                        <p className="leading-relaxed line-clamp-3 text-slate-600 dark:text-slate-300">
                          {stepItem.desc}
                        </p>
                      </div>

                      {/* On-Page Pointer Action Button */}
                      <div className="mt-3 pt-2.5 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                        <span className="font-semibold text-slate-500 dark:text-slate-400 text-[10px] truncate max-w-[120px]">
                          {stepItem.targetButtonLabel}
                        </span>

                        <motion.button
                          type="button"
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => handleLaunchSpotlightForStep(idx)}
                          className="inline-flex items-center gap-1 rounded-lg bg-sky-600 hover:bg-sky-700 text-white px-2.5 py-1 text-[11px] font-bold shadow-2xs transition-colors cursor-pointer"
                        >
                          <Target className="w-3 h-3" />
                          <span>
                            {locale === 'fr'
                              ? 'Montrer sur l’écran'
                              : locale === 'ar'
                              ? 'أشر لي على الشاشة'
                              : 'Point on Screen'}
                          </span>
                        </motion.button>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Bottom Quick Action Note */}
              <div className="rounded-xl border border-sky-500/20 bg-sky-500/5 dark:bg-sky-950/30 p-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                <span className="text-slate-600 dark:text-slate-300 font-medium">
                  {locale === 'fr'
                    ? 'Astuce : Cliquez sur "Montrer sur l’écran" pour que le curseur pointe automatiquement vers le bon bouton sur votre page.'
                    : locale === 'ar'
                    ? 'تلميح: اضغط على "أشر لي على الشاشة" ليتحرك مؤشر افتراضي ويحدد الزر المطلوب مباشرة.'
                    : 'Tip: Click "Point on Screen" to animate a virtual cursor directly onto the target button.'}
                </span>

                <button
                  type="button"
                  onClick={() => handleLaunchSpotlightForStep(0)}
                  className="inline-flex items-center gap-1.5 text-sky-700 dark:text-sky-300 font-bold hover:underline shrink-0 cursor-pointer"
                >
                  <span>
                    {locale === 'fr'
                      ? 'Lancer le parcours complet'
                      : locale === 'ar'
                      ? 'تشغيل الجولة الكاملة'
                      : 'Play Full Sequence'}
                  </span>
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  );
}

// Backwards compatibility alias
export function SimulatedCursorDemo() {
  return null;
}
