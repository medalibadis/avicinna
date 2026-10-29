'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Check } from 'lucide-react';

export type AccentColor = 'ocean' | 'forest' | 'teal' | 'ember';

export interface AccentOption {
  id: AccentColor;
  label: { ar: string; en: string; fr: string };
  color: string;
  gradient: string;
}

export const ACCENT_OPTIONS: AccentOption[] = [
  {
    id: 'ocean',
    label: { ar: 'أزرق محيطي (كلاسيك)', en: 'Ocean Blue', fr: 'Bleu Océan' },
    color: '#0284C7',
    gradient: 'from-sky-600 to-blue-700',
  },
  {
    id: 'forest',
    label: { ar: 'أخضر الغابة (فيرنلي)', en: 'Forest Green', fr: 'Vert Forêt' },
    color: '#10B981',
    gradient: 'from-emerald-500 to-teal-700',
  },
  {
    id: 'teal',
    label: { ar: 'تركواز سريري متقدم', en: 'Clinical Teal', fr: 'Turquoise Clinique' },
    color: '#0D9488',
    gradient: 'from-teal-600 to-cyan-700',
  },
  {
    id: 'ember',
    label: { ar: 'كهرمان الغسق الدافئ', en: 'Warm Ember', fr: 'Ambre Chaud' },
    color: '#F59E0B',
    gradient: 'from-amber-500 to-orange-600',
  },
];

interface AccentContextValue {
  accent: AccentColor;
  setAccent: (accent: AccentColor) => void;
  accentOption: AccentOption;
}

const AccentContext = createContext<AccentContextValue>({
  accent: 'ocean',
  setAccent: () => {},
  accentOption: ACCENT_OPTIONS[0],
});

const STORAGE_KEY = 'avicinna:accent';

export function AccentProvider({ children }: { children: React.ReactNode }) {
  const [accent, setAccentState] = useState<AccentColor>('ocean');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY) as AccentColor | null;
      if (saved && ['ocean', 'forest', 'teal', 'ember'].includes(saved)) {
        setAccentState(saved);
        document.documentElement.dataset.accent = saved;
      } else {
        document.documentElement.dataset.accent = 'ocean';
      }
    } catch {
      // fallback
    }
  }, []);

  const setAccent = (newAccent: AccentColor) => {
    setAccentState(newAccent);
    document.documentElement.dataset.accent = newAccent;
    try {
      localStorage.setItem(STORAGE_KEY, newAccent);
    } catch {
      // ignore
    }

    const opt = ACCENT_OPTIONS.find((o) => o.id === newAccent) || ACCENT_OPTIONS[0];
    const htmlLang = document.documentElement.lang || 'ar';
    const msg =
      htmlLang === 'fr'
        ? `Thème accentué défini sur ${opt.label.fr}`
        : htmlLang === 'en'
        ? `Accent set to ${opt.label.en}`
        : `تم تفعيل سمة: ${opt.label.ar}`;

    setToastMessage(msg);
  };

  useEffect(() => {
    if (!toastMessage) return;
    const timer = setTimeout(() => setToastMessage(null), 2400);
    return () => clearTimeout(timer);
  }, [toastMessage]);

  const currentOption = ACCENT_OPTIONS.find((o) => o.id === accent) || ACCENT_OPTIONS[0];

  return (
    <AccentContext.Provider value={{ accent, setAccent, accentOption: currentOption }}>
      {children}

      {/* Fernly-Inspired Bottom Floating Pill Toast */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.92 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 15, scale: 0.95 }}
            transition={{ type: 'spring', stiffness: 450, damping: 30 }}
            className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[9999] pointer-events-none"
          >
            <div className="flex items-center gap-2.5 px-4 py-2.5 rounded-full bg-slate-900/95 dark:bg-slate-100/95 text-white dark:text-slate-900 shadow-2xl border border-white/10 dark:border-slate-900/10 backdrop-blur-md text-xs sm:text-sm font-bold tracking-tight">
              <span
                className="w-3 h-3 rounded-full flex-shrink-0 shadow-xs"
                style={{ backgroundColor: currentOption.color }}
              />
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>{toastMessage}</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </AccentContext.Provider>
  );
}

export function useAccent() {
  return useContext(AccentContext);
}
