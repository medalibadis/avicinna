'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

/**
 * 1. Shimmer Placeholder Box
 */
export function ShimmerBlock({
  className = '',
  rounded = 'rounded-2xl',
}: {
  className?: string;
  rounded?: string;
}) {
  return (
    <div
      className={`animate-shimmer ${rounded} border border-slate-200/50 dark:border-slate-800/60 ${className}`}
    />
  );
}

/**
 * 2. Bento Dashboard Skeleton matching Fernly video layout
 */
export function BentoDashboardSkeleton() {
  return (
    <div className="space-y-6 sm:space-y-8 animate-in fade-in duration-150">
      {/* Header Bar Skeleton */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-slate-200/80 dark:border-slate-800">
        <div className="space-y-2">
          <ShimmerBlock className="h-4 w-40" />
          <ShimmerBlock className="h-8 w-72" />
          <ShimmerBlock className="h-3.5 w-60" />
        </div>
        <div className="flex items-center gap-3">
          <ShimmerBlock className="h-10 w-36 rounded-xl" />
          <ShimmerBlock className="h-10 w-32 rounded-xl" />
        </div>
      </div>

      {/* 4 Bento Stat Cards Skeleton */}
      <div className="grid grid-cols-[repeat(auto-fit,minmax(240px,1fr))] gap-4 sm:gap-5">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="p-5 rounded-3xl border border-slate-200/80 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 shadow-xs space-y-4"
          >
            <div className="flex items-center justify-between">
              <ShimmerBlock className="h-11 w-11 rounded-xl" />
              <ShimmerBlock className="h-6 w-16 rounded-full" />
            </div>
            <div className="space-y-2">
              <ShimmerBlock className="h-8 w-24" />
              <ShimmerBlock className="h-4 w-32" />
              <ShimmerBlock className="h-3 w-48" />
            </div>
            <ShimmerBlock className="h-6 w-full rounded-lg" />
            <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
              <ShimmerBlock className="h-4 w-28 rounded-md" />
            </div>
          </div>
        ))}
      </div>

      {/* Main Content & Side Column Skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Table / Triage Board */}
        <div className="lg:col-span-2 p-6 rounded-3xl border border-slate-200/80 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="space-y-1.5">
              <ShimmerBlock className="h-6 w-48" />
              <ShimmerBlock className="h-3.5 w-64" />
            </div>
            <ShimmerBlock className="h-9 w-44 rounded-full" />
          </div>
          <ShimmerBlock className="h-11 w-full rounded-2xl" />
          <div className="flex gap-2">
            {[1, 2, 3, 4, 5].map((j) => (
              <ShimmerBlock key={j} className="h-8 w-20 rounded-full" />
            ))}
          </div>
          <div className="space-y-2 pt-2">
            {[1, 2, 3, 4].map((row) => (
              <ShimmerBlock key={row} className="h-16 w-full rounded-2xl" />
            ))}
          </div>
        </div>

        {/* Side Column Quick Actions */}
        <div className="space-y-4">
          <div className="p-6 rounded-3xl border border-slate-200/80 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 space-y-4">
            <ShimmerBlock className="h-5 w-32" />
            <div className="space-y-2.5">
              {[1, 2, 3].map((k) => (
                <ShimmerBlock key={k} className="h-14 w-full rounded-2xl" />
              ))}
            </div>
          </div>

          <div className="p-6 rounded-3xl border border-slate-200/80 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 space-y-3">
            <ShimmerBlock className="h-5 w-40" />
            <ShimmerBlock className="h-12 w-full rounded-2xl" />
            <ShimmerBlock className="h-12 w-full rounded-2xl" />
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * 3. Fernly Kanban Board Skeleton (matching 00:01 in anim.mp4)
 */
export function KanbanSkeleton() {
  return (
    <div className="space-y-6 animate-in fade-in duration-150">
      <div className="flex items-center justify-between pb-4 border-b border-slate-200/80 dark:border-slate-800">
        <div className="space-y-2">
          <ShimmerBlock className="h-7 w-32" />
          <ShimmerBlock className="h-3.5 w-64" />
        </div>
        <ShimmerBlock className="h-10 w-28 rounded-xl" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((col) => (
          <div
            key={col}
            className="p-4 rounded-3xl border border-slate-200/80 dark:border-slate-800 bg-slate-100/60 dark:bg-slate-900/60 space-y-3"
          >
            <div className="flex items-center justify-between pb-2">
              <ShimmerBlock className="h-5 w-24 rounded-lg" />
              <ShimmerBlock className="h-5 w-7 rounded-full" />
            </div>
            <div className="space-y-3">
              {[1, 2, 3].map((card) => (
                <ShimmerBlock key={card} className="h-28 w-full rounded-2xl" />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/**
 * 4. Stagger Reveal Wrapper
 * Displays instantaneous shimmer skeleton for ~180ms, then smoothly cascades
 * the actual content with spring physics.
 */
export function FernlyContentLoader({
  children,
  skeleton = <BentoDashboardSkeleton />,
  delayMs = 180,
}: {
  children: React.ReactNode;
  skeleton?: React.ReactNode;
  delayMs?: number;
}) {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, delayMs);
    return () => clearTimeout(timer);
  }, [delayMs]);

  return (
    <div className="w-full">
      <AnimatePresence mode="wait">
        {loading ? (
          <motion.div
            key="skeleton"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.12 }}
          >
            {skeleton}
          </motion.div>
        ) : (
          <motion.div
            key="content"
            initial={{ opacity: 0, y: 12, scale: 0.99 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ type: 'spring', stiffness: 380, damping: 28 }}
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
