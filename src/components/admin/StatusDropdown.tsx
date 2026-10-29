'use client';

import React, { useState, useRef, useEffect } from 'react';
import { ConsultationInquiry } from '@/context/DataContext';
import { useLanguage } from '@/context/LanguageContext';
import { ChevronDown, Check, Clock, Sparkles, PhoneCall, CalendarCheck } from 'lucide-react';

interface StatusOption {
  value: ConsultationInquiry['status'];
  labels: {
    ar: string;
    en: string;
    fr: string;
  };
  dotColor: string;
  badgeBg: string;
  badgeText: string;
  badgeBorder: string;
  icon: React.ComponentType<{ className?: string }>;
}

const statusOptions: StatusOption[] = [
  {
    value: 'new',
    labels: {
      ar: 'طلب جديد',
      en: 'New Lead',
      fr: 'Nouvelle demande',
    },
    dotColor: 'bg-rose-500',
    badgeBg: 'bg-rose-50 dark:bg-rose-950/40',
    badgeText: 'text-rose-700 dark:text-rose-300',
    badgeBorder: 'border-rose-200 dark:border-rose-800/60',
    icon: Sparkles,
  },
  {
    value: 'in_review',
    labels: {
      ar: 'قيد المراجعة',
      en: 'In Review',
      fr: 'En cours d’examen',
    },
    dotColor: 'bg-amber-500',
    badgeBg: 'bg-amber-50 dark:bg-amber-950/40',
    badgeText: 'text-amber-700 dark:text-amber-300',
    badgeBorder: 'border-amber-200 dark:border-amber-800/60',
    icon: Clock,
  },
  {
    value: 'contacted',
    labels: {
      ar: 'تم التواصل',
      en: 'Contacted',
      fr: 'Contacté',
    },
    dotColor: 'bg-sky-500',
    badgeBg: 'bg-sky-50 dark:bg-sky-950/40',
    badgeText: 'text-sky-700 dark:text-sky-300',
    badgeBorder: 'border-sky-200 dark:border-sky-800/60',
    icon: PhoneCall,
  },
  {
    value: 'scheduled',
    labels: {
      ar: 'تم الحجز',
      en: 'Scheduled',
      fr: 'Rendez-vous fixé',
    },
    dotColor: 'bg-emerald-500',
    badgeBg: 'bg-emerald-50 dark:bg-emerald-950/40',
    badgeText: 'text-emerald-700 dark:text-emerald-300',
    badgeBorder: 'border-emerald-200 dark:border-emerald-800/60',
    icon: CalendarCheck,
  },
];

interface StatusDropdownProps {
  currentStatus: ConsultationInquiry['status'];
  onStatusChange: (status: ConsultationInquiry['status']) => void;
}

export function StatusDropdown({ currentStatus, onStatusChange }: StatusDropdownProps) {
  const { language } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const currentOption = statusOptions.find((opt) => opt.value === currentStatus) || statusOptions[0];
  const CurrentIcon = currentOption.icon;
  const langKey = language === 'ar' || language === 'en' || language === 'fr' ? language : 'ar';

  const popoverHeader = {
    ar: 'تحديث حالة الطلب',
    en: 'Update Lead Status',
    fr: 'Modifier le statut',
  }[langKey];

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative inline-block text-right rtl:text-right ltr:text-left" ref={dropdownRef}>
      {/* Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold border shadow-2xs transition-all cursor-pointer select-none active:scale-98 whitespace-nowrap ${
          currentOption.badgeBg
        } ${currentOption.badgeText} ${currentOption.badgeBorder} ${
          isOpen ? 'ring-2 ring-sky-500/20 shadow-xs' : 'hover:shadow-2xs'
        }`}
      >
        <span className={`w-2.5 h-2.5 rounded-full ${currentOption.dotColor} animate-pulse`} />
        <CurrentIcon className="w-4 h-4 opacity-90 shrink-0" />
        <span className="leading-none">{currentOption.labels[langKey]}</span>
        <ChevronDown
          className={`w-3.5 h-3.5 text-slate-400 shrink-0 transition-transform duration-200 ${
            isOpen ? 'rotate-180' : ''
          }`}
        />
      </button>

      {/* Custom Popup Popover */}
      {isOpen && (
        <div className="absolute right-0 rtl:right-0 rtl:left-auto ltr:left-0 ltr:right-auto mt-2 w-52 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border border-slate-200/90 dark:border-slate-700 rounded-2xl shadow-xl shadow-slate-900/10 dark:shadow-black/50 py-1.5 z-50 animate-in fade-in zoom-in-95 duration-150 ring-1 ring-black/5">
          <div className="px-3 py-1.5 text-[10px] font-extrabold uppercase tracking-wider text-slate-400 dark:text-slate-500 border-b border-slate-100 dark:border-slate-800 mb-1">
            {popoverHeader}
          </div>

          <div className="space-y-0.5 px-1.5">
            {statusOptions.map((option) => {
              const isSelected = option.value === currentStatus;
              const Icon = option.icon;

              return (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => {
                    onStatusChange(option.value);
                    setIsOpen(false);
                  }}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    isSelected
                      ? `${option.badgeBg} ${option.badgeText} ring-1 ${option.badgeBorder}`
                      : 'text-slate-700 dark:text-slate-200 hover:bg-slate-50/90 dark:hover:bg-slate-800'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <span className={`w-2 h-2 rounded-full ${option.dotColor}`} />
                    <Icon className={`w-3.5 h-3.5 ${isSelected ? option.badgeText : 'text-slate-400 dark:text-slate-500'}`} />
                    <span className="leading-tight">{option.labels[langKey]}</span>
                  </div>

                  {isSelected && <Check className={`w-4 h-4 ${option.badgeText}`} />}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
