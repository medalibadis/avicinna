'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';
import { useAccent } from '@/context/AccentContext';

/**
 * 1. Sliding Segmented Button Pill (`seg__pill` from Fernly)
 */
export function SlidingPillTabs<T extends string>({
  tabs,
  activeId,
  onChange,
  layoutId = 'fernly-seg-pill',
  size = 'md',
  className = '',
}: {
  tabs: { id: T; label: string; count?: number | string; icon?: React.ComponentType<{ className?: string }> }[];
  activeId: T;
  onChange: (id: T) => void;
  layoutId?: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}) {
  const { accentOption } = useAccent();

  const sizeClasses = {
    sm: 'py-1 px-3 text-xs',
    md: 'py-1.5 px-3.5 text-xs sm:text-sm',
    lg: 'py-2 px-5 text-sm sm:text-base font-bold',
  }[size];

  return (
    <div
      role="group"
      className={`relative inline-flex items-center gap-1 p-1 rounded-2xl bg-slate-100/80 dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700/80 backdrop-blur-md overflow-hidden ${className}`}
    >
      {tabs.map((tab) => {
        const isActive = activeId === tab.id;
        const Icon = tab.icon;
        return (
          <button
            key={tab.id}
            type="button"
            onClick={() => onChange(tab.id)}
            className={`relative z-10 ${sizeClasses} rounded-xl font-bold transition-colors cursor-pointer select-none flex items-center gap-2 ${
              isActive
                ? 'text-white'
                : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200/50 dark:hover:bg-slate-700/50'
            }`}
          >
            {isActive && (
              <motion.span
                layoutId={layoutId}
                transition={{ type: 'spring', stiffness: 480, damping: 34 }}
                className="absolute inset-0 rounded-xl shadow-md -z-10"
                style={{
                  background: `linear-gradient(135deg, ${accentOption.color} 0%, #0369A1 100%)`,
                }}
              />
            )}
            {Icon && <Icon className="w-3.5 h-3.5" />}
            <span>{tab.label}</span>
            {tab.count !== undefined && (
              <span
                className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                  isActive
                    ? 'bg-white/20 text-white'
                    : 'bg-slate-200/80 dark:bg-slate-700 text-slate-700 dark:text-slate-300'
                }`}
              >
                {tab.count}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}

/**
 * 2. Bento Card Lift with Ambient Glow & Spring Dynamics (Fernly `data-lift`)
 */
export function BentoCardLift({
  children,
  className = '',
  href,
  onClick,
  arrow = false,
}: {
  children: React.ReactNode;
  className?: string;
  href?: string;
  onClick?: () => void;
  arrow?: boolean;
}) {
  const content = (
    <motion.div
      whileHover={{ y: -4, scale: 1.008 }}
      whileTap={{ scale: 0.99 }}
      transition={{ type: 'spring', stiffness: 400, damping: 25 }}
      onClick={onClick}
      className={`group relative overflow-hidden rounded-3xl border border-slate-200/80 dark:border-slate-800 bg-white/95 dark:bg-slate-900/95 p-5 sm:p-6 shadow-xs hover:shadow-xl hover:shadow-sky-500/10 dark:hover:shadow-sky-500/5 transition-all duration-300 ${className}`}
    >
      {arrow && (
        <div className="absolute top-4 end-4 w-7 h-7 rounded-xl bg-slate-100/70 dark:bg-slate-800 text-slate-400 dark:text-slate-500 group-hover:text-sky-600 dark:group-hover:text-sky-400 group-hover:bg-sky-50 dark:group-hover:bg-sky-950/50 flex items-center justify-center transition-all duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 pointer-events-none">
          <ArrowUpRight className="w-3.5 h-3.5" />
        </div>
      )}
      {children}
    </motion.div>
  );

  return content;
}

/**
 * 3. Morphing SVG Sparkline Path
 */
const SPARKLINE_PATHS = {
  '7d': {
    fill: 'M 0 16 Q 25 8, 50 14 T 75 6 T 100 10 L 100 20 L 0 20 Z',
    stroke: 'M 0 16 Q 25 8, 50 14 T 75 6 T 100 10',
  },
  '30d': {
    fill: 'M 0 14 Q 25 4, 50 11 T 75 5 T 100 8 L 100 20 L 0 20 Z',
    stroke: 'M 0 14 Q 25 4, 50 11 T 75 5 T 100 8',
  },
  '90d': {
    fill: 'M 0 17 Q 20 6, 45 15 T 75 3 T 100 6 L 100 20 L 0 20 Z',
    stroke: 'M 0 17 Q 20 6, 45 15 T 75 3 T 100 6',
  },
};

export function MorphingSparkline({
  range = '30d',
  color = '#0284C7',
  id = 'sparkline-generic',
}: {
  range?: '7d' | '30d' | '90d';
  color?: string;
  id?: string;
}) {
  const current = SPARKLINE_PATHS[range] || SPARKLINE_PATHS['30d'];

  return (
    <div className="w-full h-8 overflow-hidden pointer-events-none mt-1">
      <svg className="w-full h-full" viewBox="0 0 100 20" preserveAspectRatio="none">
        <defs>
          <linearGradient id={id} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity="0.35" />
            <stop offset="100%" stopColor={color} stopOpacity="0.0" />
          </linearGradient>
        </defs>
        <motion.path
          d={current.fill}
          fill={`url(#${id})`}
          animate={{ d: current.fill }}
          transition={{ type: 'spring', stiffness: 280, damping: 26 }}
        />
        <motion.path
          d={current.stroke}
          fill="none"
          stroke={color}
          strokeWidth="1.8"
          strokeLinecap="round"
          animate={{ d: current.stroke }}
          transition={{ type: 'spring', stiffness: 280, damping: 26 }}
        />
      </svg>
    </div>
  );
}
