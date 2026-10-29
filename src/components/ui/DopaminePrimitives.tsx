'use client';

import React, { useEffect, useRef } from 'react';
import {
  motion,
  useMotionTemplate,
  useMotionValue,
  useSpring,
  useTransform,
} from 'framer-motion';

/**
 * 1. 3D Interactive Spotlight & Tilt Card (For Dashboard KPIs, Doctors & Hospitals)
 */
export function SpotlightTiltCard({
  children,
  className = '',
  glowColor = 'rgba(0, 151, 251, 0.16)',
}: {
  children: React.ReactNode;
  className?: string;
  glowColor?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [4, -4]), {
    stiffness: 300,
    damping: 25,
  });
  const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-4, 4]), {
    stiffness: 300,
    damping: 25,
  });

  const spotlightX = useMotionValue(0);
  const spotlightY = useMotionValue(0);

  function handleMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const clientX = e.clientX - rect.left;
    const clientY = e.clientY - rect.top;

    mouseX.set(clientX / width - 0.5);
    mouseY.set(clientY / height - 0.5);
    spotlightX.set(clientX);
    spotlightY.set(clientY);
  }

  function handleMouseLeave() {
    mouseX.set(0);
    mouseY.set(0);
  }

  const background = useMotionTemplate`radial-gradient(380px circle at ${spotlightX}px ${spotlightY}px, ${glowColor}, transparent 80%)`;

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ rotateX, rotateY, transformStyle: 'preserve-3d' }}
      whileHover={{ y: -4, scale: 1.01 }}
      whileTap={{ scale: 0.99 }}
      transition={{ type: 'spring', stiffness: 400, damping: 28 }}
      className={`group relative overflow-hidden rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900/90 shadow-sm transition-shadow hover:shadow-xl hover:shadow-blue-900/5 dark:hover:shadow-sky-500/5 ${className}`}
    >
      <motion.div
        className="pointer-events-none absolute -inset-px rounded-2xl opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{ background }}
      />
      <div className="relative z-10">{children}</div>
    </motion.div>
  );
}

/**
 * 2. Spring-Physics Animated Number Counter (For KPI & Hospital Stats)
 */
export function AnimatedNumberTicker({
  value,
  suffix = '',
  prefix = '',
}: {
  value: number;
  suffix?: string;
  prefix?: string;
}) {
  const springValue = useSpring(0, { stiffness: 90, damping: 20 });
  const display = useTransform(springValue, (current) =>
    Math.round(current).toLocaleString()
  );

  useEffect(() => {
    springValue.set(value);
  }, [value, springValue]);

  return (
    <span className="inline-flex items-baseline tabular-nums tracking-tight">
      {prefix && <span>{prefix}</span>}
      <motion.span>{display}</motion.span>
      {suffix && <span>{suffix}</span>}
    </span>
  );
}

/**
 * 3. Spring-Physics Language Switcher with Shared Layout Pill (layoutId="active-lang-pill")
 */
export function DopamineLanguageSwitcher({
  activeLang,
  onChange,
  isScrolled = false,
  id = 'default',
}: {
  activeLang: 'fr' | 'ar' | 'en';
  onChange: (lang: 'fr' | 'ar' | 'en') => void;
  isScrolled?: boolean;
  id?: string;
}) {
  const langs: { code: 'fr' | 'ar' | 'en'; label: string }[] = [
    { code: 'fr', label: 'FR' },
    { code: 'ar', label: 'AR' },
    { code: 'en', label: 'EN' },
  ];

  return (
    <div
      dir="ltr"
      className={`relative inline-flex shrink-0 items-center rounded-full p-1 border transition-all duration-200 backdrop-blur-md ${
        isScrolled
          ? 'bg-slate-100/90 dark:bg-slate-800/90 border-slate-200/90 dark:border-slate-700 text-slate-800 dark:text-slate-100 shadow-2xs'
          : 'bg-white/15 border-white/25 text-white shadow-2xs'
      }`}
    >
      {langs.map(({ code, label }) => {
        const isActive = activeLang === code;
        return (
          <button
            key={code}
            type="button"
            onClick={() => onChange(code)}
            className={`relative px-2.5 2xl:px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider transition-all duration-200 cursor-pointer select-none ${
              isActive
                ? 'text-white font-extrabold'
                : isScrolled
                ? 'text-slate-600 dark:text-slate-300 hover:text-[#0097FB] dark:hover:text-sky-400 hover:bg-slate-200/60 dark:hover:bg-slate-700/60'
                : 'text-white/80 hover:text-white hover:bg-white/10'
            }`}
          >
            {isActive && (
              <motion.span
                layoutId={`active-lang-pill-${id}`}
                transition={{ type: 'spring', stiffness: 500, damping: 35 }}
                className="absolute inset-0 rounded-full bg-gradient-to-r from-[#0097FB] to-[#0082d6] shadow-sm shadow-[#0097FB]/40 -z-0 pointer-events-none"
              />
            )}
            <span className="relative z-10">{label}</span>
          </button>
        );
      })}
    </div>
  );
}

/**
 * 4. Ambient Medical Tech Glow Mesh Wrapper
 */
export function HyperframeMotionWrapper({
  children,
  className = '',
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={`relative overflow-hidden ${className}`}>
      <div className="pointer-events-none absolute -top-40 -start-40 h-96 w-96 rounded-full bg-[#0097FB]/10 blur-[120px]" />
      <div className="pointer-events-none absolute -bottom-40 -end-40 h-96 w-96 rounded-full bg-[#032654]/15 blur-[120px]" />
      <div className="relative z-10">{children}</div>
    </div>
  );
}
