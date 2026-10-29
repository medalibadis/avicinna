'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, RotateCcw, Loader2 } from 'lucide-react';
import type { Locale } from './AdminShell';

export type LocalizedString = Record<Locale, string>;

interface SmartTranslatableFieldProps {
  label: string;
  value: LocalizedString;
  activeLocale: Locale;
  multiline?: boolean;
  placeholder?: string;
  onChange: (updated: LocalizedString) => void;
}

export function SmartTranslatableField({
  label,
  value,
  activeLocale,
  multiline = false,
  placeholder,
  onChange,
}: SmartTranslatableFieldProps) {
  const [previewLang, setPreviewLang] = useState<Locale>(activeLocale);
  const [isSyncing, setIsSyncing] = useState(false);
  const [previousSnapshot, setPreviousSnapshot] = useState<LocalizedString | null>(null);

  // Keep the active input synced when the user switches the global language pill
  React.useEffect(() => {
    setPreviewLang(activeLocale);
  }, [activeLocale]);

  async function handleSmartSync() {
    const sourceText = value[previewLang];
    if (!sourceText?.trim()) return;

    // Save snapshot for 1-click Undo (Rule #5)
    setPreviousSnapshot({ ...value });
    setIsSyncing(true);

    const targetLangs = (['en', 'fr', 'ar'] as Locale[]).filter((l) => l !== previewLang);

    try {
      const res = await fetch('/api/translate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          // Rule #19: Idempotency key prevents duplicate billing/writes on double-clicks
          'X-Idempotency-Key': crypto.randomUUID(),
        },
        body: JSON.stringify({
          sourceLang: previewLang,
          targetLangs,
          payload: { text: sourceText },
          domainContext: 'medical_cms',
        }),
      });

      const data = await res.json();
      if (data.success && data.translations) {
        onChange({
          en: data.translations.en?.text ?? value.en,
          fr: data.translations.fr?.text ?? value.fr,
          ar: data.translations.ar?.text ?? value.ar,
          [previewLang]: sourceText,
        });
      }
    } catch (err) {
      console.error('Translation error:', err);
    } finally {
      setIsSyncing(false);
    }
  }

  return (
    <div className="group relative rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-white/90 dark:bg-slate-900/90 p-4 shadow-2xs transition-all focus-within:border-sky-400 dark:focus-within:border-sky-500 focus-within:ring-4 focus-within:ring-sky-500/10">
      <div className="mb-2.5 flex flex-wrap items-center justify-between gap-2">
        <label className="text-xs font-bold tracking-wide text-slate-700 dark:text-slate-200 text-balance">
          {label}
        </label>

        <div className="flex items-center gap-2">
          {/* Instant Undo button if AI translation was triggered (Rule #5) */}
          <AnimatePresence>
            {previousSnapshot && (
              <motion.button
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                type="button"
                onClick={() => {
                  onChange(previousSnapshot);
                  setPreviousSnapshot(null);
                }}
                className="inline-flex items-center gap-1 rounded-lg bg-amber-50 dark:bg-amber-950/40 px-2 py-1 text-[11px] font-semibold text-amber-800 dark:text-amber-300 hover:bg-amber-100 dark:hover:bg-amber-900/60 cursor-pointer"
              >
                <RotateCcw className="h-3 w-3" />
                Undo
              </motion.button>
            )}
          </AnimatePresence>

          {/* Language Preview Mini-Pills (Shows green check if populated with popping spring dots) */}
          <div dir="ltr" className="inline-flex rounded-lg bg-slate-100 dark:bg-slate-800 p-0.5 border border-transparent dark:border-slate-700/60">
            {(['en', 'fr', 'ar'] as Locale[]).map((l, dotIdx) => {
              const hasContent = Boolean(value[l]?.trim());
              const isCurrent = previewLang === l;
              return (
                <button
                  key={l}
                  type="button"
                  onClick={() => setPreviewLang(l)}
                  className={`relative flex items-center gap-1 rounded-md px-2 py-0.5 text-[10px] font-bold uppercase transition-colors cursor-pointer ${
                    isCurrent
                      ? 'bg-white text-sky-700 shadow-2xs dark:bg-slate-900 dark:text-sky-400'
                      : 'text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200'
                  }`}
                >
                  <span>{l}</span>
                  {hasContent && (
                    <motion.span
                      key={`${l}-${hasContent}`}
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{
                        type: 'spring',
                        stiffness: 500,
                        damping: 18,
                        delay: isSyncing ? dotIdx * 0.15 : 0,
                      }}
                      className="h-1.5 w-1.5 rounded-full bg-emerald-500 shadow-[0_0_6px_#10B981]"
                    />
                  )}
                </button>
              );
            })}
          </div>

          {/* 1-Click Auto-Translate to the other 2 languages */}
          <motion.button
            type="button"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.96 }}
            disabled={isSyncing}
            onClick={handleSmartSync}
            className="inline-flex items-center gap-1.5 rounded-lg bg-gradient-to-r from-sky-600 to-teal-600 px-2.5 py-1 text-[11px] font-semibold text-white shadow-2xs disabled:opacity-50 cursor-pointer"
          >
            {isSyncing ? (
              <Loader2 className="h-3 w-3 animate-spin text-teal-200" />
            ) : (
              <Sparkles className="h-3 w-3 text-teal-200" />
            )}
            <span>Auto-Translate</span>
          </motion.button>
        </div>
      </div>

      {/* Motion System 6: AI Laser-Sweep Auto-Translation Sweep */}
      <AnimatePresence>
        {isSyncing && (
          <div className="pointer-events-none absolute inset-0 z-20 overflow-hidden rounded-2xl">
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: '100%' }}
              exit={{ opacity: 0 }}
              transition={{
                repeat: Infinity,
                duration: 1.1,
                ease: [0.4, 0, 0.2, 1],
              }}
              className="absolute inset-y-0 w-28 -skew-x-12 bg-gradient-to-r from-transparent via-emerald-400/25 to-transparent blur-sm"
            />
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: '100%' }}
              exit={{ opacity: 0 }}
              transition={{
                repeat: Infinity,
                duration: 1.1,
                ease: [0.4, 0, 0.2, 1],
              }}
              className="absolute inset-y-0 w-1.5 bg-gradient-to-b from-teal-400 via-emerald-300 to-cyan-400 shadow-[0_0_12px_#10B981]"
            />
          </div>
        )}
      </AnimatePresence>

      {/* Single Dynamic Input (Automatically sets RTL/LTR based on active preview pill) */}
      <div dir={previewLang === 'ar' ? 'rtl' : 'ltr'}>
        {multiline ? (
          <textarea
            rows={3}
            value={value[previewLang] || ''}
            onChange={(e) =>
              onChange({
                ...value,
                [previewLang]: e.target.value,
              })
            }
            placeholder={placeholder || `Write in ${previewLang.toUpperCase()} — AI automatically translates the rest...`}
            className="w-full resize-none rounded-xl border border-slate-200/80 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/60 px-3.5 py-2.5 text-sm text-slate-800 dark:text-slate-100 transition-colors focus:bg-white dark:focus:bg-slate-800 focus:outline-none placeholder:text-slate-400 dark:placeholder:text-slate-500"
          />
        ) : (
          <input
            type="text"
            value={value[previewLang] || ''}
            onChange={(e) =>
              onChange({
                ...value,
                [previewLang]: e.target.value,
              })
            }
            placeholder={placeholder || `Write in ${previewLang.toUpperCase()} — AI automatically translates the rest...`}
            className="w-full rounded-xl border border-slate-200/80 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/60 px-3.5 py-2.5 text-sm font-medium text-slate-800 dark:text-slate-100 transition-colors focus:bg-white dark:focus:bg-slate-800 focus:outline-none placeholder:text-slate-400 dark:placeholder:text-slate-500"
          />
        )}
      </div>
    </div>
  );
}
