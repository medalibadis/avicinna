'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface CelestialThemeSwitchProps {
  theme: 'dark' | 'light';
  onToggle: (newTheme: 'dark' | 'light') => void;
}

export function CelestialThemeSwitch({ theme, onToggle }: CelestialThemeSwitchProps) {
  const isDark = theme === 'dark';

  const handleToggle = (e: React.MouseEvent<HTMLButtonElement>) => {
    const nextTheme = isDark ? 'light' : 'dark';

    // Fallback if browser doesn't support View Transitions API
    if (
      typeof document === 'undefined' ||
      !('startViewTransition' in document) ||
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
    ) {
      onToggle(nextTheme);
      return;
    }

    // Calculate exact click coordinates for circular liquid reveal
    const rect = e.currentTarget.getBoundingClientRect();
    const x = rect.left + rect.width / 2;
    const y = rect.top + rect.height / 2;
    const endRadius = Math.hypot(
      Math.max(x, window.innerWidth - x),
      Math.max(y, window.innerHeight - y)
    );

    try {
      const transition = (document as unknown as { startViewTransition: (cb: () => void) => { ready: Promise<void> } }).startViewTransition(() => {
        onToggle(nextTheme);
        document.documentElement.classList.toggle('dark', nextTheme === 'dark');
      });

      transition.ready
        .then(() => {
          document.documentElement.animate(
            {
              clipPath: [
                `circle(0px at ${x}px ${y}px)`,
                `circle(${endRadius}px at ${x}px ${y}px)`,
              ],
            },
            {
              duration: 550,
              easing: 'cubic-bezier(0.22, 1, 0.36, 1)',
              pseudoElement: '::view-transition-new(root)',
            }
          );
        })
        .catch(() => {
          // Gracefully ignore AbortError when a transition is superseded or skipped
        });
    } catch {
      onToggle(nextTheme);
      document.documentElement.classList.toggle('dark', nextTheme === 'dark');
    }
  };

  return (
    <motion.button
      type="button"
      dir="ltr"
      style={{ direction: 'ltr' }}
      onClick={handleToggle}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.92 }}
      aria-label="Toggle Night/Light Mode"
      className={`relative flex h-7 w-12 sm:h-9 sm:w-16 shrink-0 items-center rounded-full p-0.5 sm:p-1 transition-colors duration-500 cursor-pointer select-none ${
        isDark
          ? 'border border-slate-700/80 bg-slate-900 shadow-inner'
          : 'border border-sky-200 bg-gradient-to-r from-sky-400 to-blue-500 shadow-inner'
      }`}
    >
      {/* Background Stars (Night Mode) & Fluffy Clouds (Light Mode) */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden rounded-full">
        <AnimatePresence initial={false}>
          {isDark ? (
            <motion.div
              key="stars"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              className="absolute inset-0"
            >
              <span className="absolute right-2 sm:right-3 top-1.5 sm:top-2 h-1 w-1 rounded-full bg-white animate-pulse" />
              <span className="absolute right-4 sm:right-6 bottom-1.5 sm:bottom-2 h-1 sm:h-1.5 w-1 sm:w-1.5 rounded-full bg-sky-200/90 animate-pulse" />
            </motion.div>
          ) : (
            <motion.div
              key="clouds"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
              className="absolute inset-0"
            >
              <span className="absolute left-1.5 sm:left-2.5 bottom-0.5 sm:bottom-1 h-2 sm:h-2.5 w-4 sm:w-5 rounded-full bg-white/75 blur-[0.3px]" />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Sliding Sun / Moon Orb with Spring Physics */}
      <motion.div
        layout
        transition={{ type: 'spring', stiffness: 420, damping: 28 }}
        className={`relative z-10 flex h-5 w-5 sm:h-7 sm:w-7 shrink-0 items-center justify-center rounded-full shadow-md ${
          isDark
            ? 'translate-x-0 bg-slate-800 text-amber-300 ring-1 ring-white/15'
            : 'translate-x-5 sm:translate-x-7 bg-amber-300 text-amber-600 shadow-amber-500/50'
        }`}
      >
        <motion.svg
          key={isDark ? 'moon' : 'sun'}
          initial={{ rotate: -90, scale: 0.6 }}
          animate={{ rotate: 0, scale: 1 }}
          transition={{ type: 'spring', stiffness: 350, damping: 20 }}
          viewBox="0 0 24 24"
          fill="currentColor"
          className="h-3 w-3 sm:h-4 sm:w-4"
        >
          {isDark ? (
            <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
          ) : (
            <>
              <circle cx="12" cy="12" r="5" />
              <path
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                d="M12 2v2m0 16v2M4.93 4.93l1.41 1.41m11.32 11.32l1.41 1.41M2 12h2m16 0h2M4.93 19.07l1.41-1.41m11.32-11.32l1.41-1.41"
              />
            </>
          )}
        </motion.svg>
      </motion.div>
    </motion.button>
  );
}
