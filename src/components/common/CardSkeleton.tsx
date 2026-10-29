'use client';

import React from 'react';

export function CardSkeleton({
  className = '',
  lines = 3,
  hasImage = true,
}: {
  className?: string;
  lines?: number;
  hasImage?: boolean;
}) {
  return (
    <div
      className={`relative overflow-hidden rounded-3xl border border-slate-200/80 bg-white/90 p-5 shadow-clinical-soft backdrop-blur-md ${className}`}
    >
      {/* Laser shimmer animation */}
      <div className="pointer-events-none absolute inset-0 -translate-x-full animate-[shimmer_1.8s_infinite] bg-gradient-to-r from-transparent via-slate-200/50 to-transparent" />

      {hasImage && (
        <div className="mb-4 h-44 w-full rounded-2xl bg-slate-200/70" />
      )}

      <div className="space-y-3">
        <div className="h-4 w-3/4 rounded-lg bg-slate-200/80" />
        {Array.from({ length: lines }).map((_, i) => (
          <div
            key={i}
            className="h-3 rounded-md bg-slate-200/60"
            style={{ width: `${Math.max(45, 90 - i * 15)}%` }}
          />
        ))}
      </div>

      <div className="mt-5 flex items-center justify-between border-t border-slate-100 pt-3">
        <div className="h-6 w-20 rounded-full bg-slate-200/60" />
        <div className="h-6 w-16 rounded-full bg-slate-200/60" />
      </div>
    </div>
  );
}

export function KpiSkeleton() {
  return (
    <div className="relative overflow-hidden rounded-3xl border border-slate-200/80 bg-white/90 p-5 shadow-clinical-soft backdrop-blur-md">
      <div className="pointer-events-none absolute inset-0 -translate-x-full animate-[shimmer_1.8s_infinite] bg-gradient-to-r from-transparent via-slate-200/50 to-transparent" />
      <div className="flex items-center justify-between mb-3">
        <div className="h-11 w-11 rounded-xl bg-slate-200/70" />
        <div className="h-6 w-16 rounded-full bg-slate-200/60" />
      </div>
      <div className="space-y-2 mt-4">
        <div className="h-8 w-24 rounded-lg bg-slate-200/80" />
        <div className="h-4 w-32 rounded-md bg-slate-200/60" />
        <div className="h-3 w-40 rounded-md bg-slate-200/50" />
      </div>
    </div>
  );
}
