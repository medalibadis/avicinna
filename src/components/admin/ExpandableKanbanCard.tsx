'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, ArrowRight, ArrowLeft, Clock, Copy, Check, ArrowUpRight, CheckCircle2 } from 'lucide-react';

export interface ExpandableKanbanCardProps {
  id: string;
  trackingId: string;
  date: string;
  patientName: string;
  phone: string;
  specialty: string;
  nextStageLabel?: string;
  isTerminal?: boolean;
  terminalLabel?: string;
  onWhatsApp: () => void;
  onAdvanceStage?: () => void;
  onClick?: () => void;
  isRtl?: boolean;
}

export function ExpandableKanbanCard({
  id,
  trackingId,
  date,
  patientName,
  phone,
  specialty,
  nextStageLabel,
  isTerminal = false,
  terminalLabel = 'Dossier',
  onWhatsApp,
  onAdvanceStage,
  onClick,
  isRtl = false,
}: ExpandableKanbanCardProps) {
  const [copied, setCopied] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const copyPhone = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(phone);
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };

  const Arrow = isRtl ? ArrowLeft : ArrowRight;

  return (
    <motion.div
      layout
      whileHover={{ y: -3, scale: 1.01 }}
      transition={{ type: 'spring', stiffness: 400, damping: 28 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={onClick}
      className="group relative rounded-2xl border border-slate-200/90 bg-white p-4 shadow-2xs transition-all hover:border-sky-500/50 hover:shadow-lg dark:border-slate-800/90 dark:bg-[#111827]/90 dark:hover:border-sky-500/50 cursor-pointer"
    >
      {/* Top Row: Ref Code & Date */}
      <div className="flex items-center justify-between gap-2">
        <span className="rounded-md bg-sky-500/10 px-2 py-0.5 font-mono text-[11px] font-bold text-sky-600 dark:text-sky-400 border border-sky-500/20">
          {trackingId || id}
        </span>
        <span className="flex items-center gap-1 text-[11px] font-medium text-slate-400 dark:text-slate-500 tabular-nums">
          <Clock className="h-3 w-3 shrink-0" />
          <span>{date}</span>
        </span>
      </div>

      {/* Patient Name & Copyable Phone */}
      <div className="mt-2.5 flex items-start justify-between gap-2">
        <div className="min-w-0 flex-1">
          <h4
            dir="auto"
            className="text-sm font-bold text-slate-900 group-hover:text-sky-600 dark:group-hover:text-sky-400 transition-colors leading-snug truncate dark:text-white"
          >
            {patientName}
          </h4>
          <button
            type="button"
            onClick={copyPhone}
            title={copied ? 'Copié !' : 'Copier le numéro'}
            className="mt-0.5 inline-flex items-center gap-1 font-mono text-xs text-slate-500 hover:text-sky-500 dark:text-slate-400 dark:hover:text-sky-400 tabular-nums cursor-pointer"
          >
            <span dir="ltr">{phone}</span>
            {copied ? (
              <Check className="h-3 w-3 text-emerald-500 shrink-0" />
            ) : (
              <Copy className="h-3 w-3 opacity-0 transition-opacity group-hover:opacity-100 shrink-0" />
            )}
          </button>
        </div>

        <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-slate-100 text-slate-400 group-hover:bg-sky-500 group-hover:text-white dark:bg-slate-800 transition-all">
          <ArrowUpRight className="h-3.5 w-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
        </span>
      </div>

      {/* Specialty Pill (Wraps cleanly without clipping, dir="auto" for natural bidi alignment) */}
      <div className="mt-3 rounded-xl border border-slate-100 bg-slate-50/80 px-3 py-1.5 text-xs font-semibold text-slate-700 dark:border-slate-800 dark:bg-slate-900/60 dark:text-slate-300">
        <span dir="auto" className="line-clamp-1 block text-start">{specialty}</span>
      </div>

      {/* Action Footer: Redesigned to NEVER truncate WhatsApp or Next Stage */}
      <div
        className="mt-3.5 flex items-center gap-2 pt-2.5 border-t border-slate-100 dark:border-slate-800"
        onClick={(e) => e.stopPropagation()}
      >
        {/* WhatsApp Button: Clean prominent action */}
        <motion.button
          type="button"
          whileTap={{ scale: 0.96 }}
          onClick={(e) => {
            e.stopPropagation();
            onWhatsApp();
          }}
          className="inline-flex h-9 flex-1 items-center justify-center gap-1.5 rounded-xl bg-[#25D366] hover:bg-[#20bd5a] px-3 text-xs font-bold text-white shadow-2xs transition-colors cursor-pointer"
          title="Ouvrir WhatsApp"
        >
          <MessageCircle className="h-4 w-4 shrink-0 fill-current" />
          <span className="whitespace-nowrap font-semibold">WhatsApp</span>
        </motion.button>

        {/* Next Stage Button: Sleek and clear without text squishing */}
        {!isTerminal && nextStageLabel && onAdvanceStage ? (
          <motion.button
            type="button"
            whileTap={{ scale: 0.96 }}
            onClick={(e) => {
              e.stopPropagation();
              onAdvanceStage();
            }}
            title={nextStageLabel}
            className="inline-flex h-9 items-center justify-center gap-1.5 rounded-xl border border-slate-200/90 bg-slate-100 px-3 text-xs font-semibold text-slate-700 transition-all hover:border-sky-500/50 hover:bg-sky-500/10 hover:text-sky-600 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:text-sky-400 cursor-pointer"
          >
            <span className="whitespace-nowrap">{nextStageLabel}</span>
            <Arrow className="h-3.5 w-3.5 shrink-0" />
          </motion.button>
        ) : (
          <motion.button
            type="button"
            whileTap={{ scale: 0.96 }}
            onClick={(e) => {
              e.stopPropagation();
              if (onClick) onClick();
            }}
            title={terminalLabel}
            className="inline-flex h-9 items-center justify-center gap-1.5 rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-3 text-xs font-bold text-emerald-700 dark:text-emerald-300 transition-all hover:bg-emerald-500/20 cursor-pointer"
          >
            <CheckCircle2 className="h-3.5 w-3.5 shrink-0 text-emerald-500" />
            <span className="whitespace-nowrap">{terminalLabel}</span>
          </motion.button>
        )}
      </div>
    </motion.div>
  );
}
