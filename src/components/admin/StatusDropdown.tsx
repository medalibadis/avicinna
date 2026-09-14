'use client';

import React, { useState, useRef, useEffect } from 'react';
import { ConsultationInquiry } from '@/context/DataContext';
import { ChevronDown, Check, Clock, Sparkles, PhoneCall, CalendarCheck } from 'lucide-react';

interface StatusOption {
  value: ConsultationInquiry['status'];
  labelAr: string;
  labelEn: string;
  dotColor: string;
  badgeBg: string;
  badgeText: string;
  badgeBorder: string;
  icon: React.ComponentType<{ className?: string }>;
}

const statusOptions: StatusOption[] = [
  {
    value: 'new',
    labelAr: 'جديد',
    labelEn: 'New Request',
    dotColor: 'bg-rose-500',
    badgeBg: 'bg-rose-50',
    badgeText: 'text-rose-700',
    badgeBorder: 'border-rose-200',
    icon: Sparkles,
  },
  {
    value: 'in_review',
    labelAr: 'قيد المراجعة',
    labelEn: 'In Review',
    dotColor: 'bg-amber-500',
    badgeBg: 'bg-amber-50',
    badgeText: 'text-amber-700',
    badgeBorder: 'border-amber-200',
    icon: Clock,
  },
  {
    value: 'contacted',
    labelAr: 'تم التواصل',
    labelEn: 'Contacted',
    dotColor: 'bg-sky-500',
    badgeBg: 'bg-sky-50',
    badgeText: 'text-sky-700',
    badgeBorder: 'border-sky-200',
    icon: PhoneCall,
  },
  {
    value: 'scheduled',
    labelAr: 'تم الحجز',
    labelEn: 'Scheduled',
    dotColor: 'bg-emerald-500',
    badgeBg: 'bg-emerald-50',
    badgeText: 'text-emerald-700',
    badgeBorder: 'border-emerald-200',
    icon: CalendarCheck,
  },
];

interface StatusDropdownProps {
  currentStatus: ConsultationInquiry['status'];
  onStatusChange: (status: ConsultationInquiry['status']) => void;
}

export function StatusDropdown({ currentStatus, onStatusChange }: StatusDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const currentOption = statusOptions.find((opt) => opt.value === currentStatus) || statusOptions[0];
  const CurrentIcon = currentOption.icon;

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
        className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-bold border shadow-xs transition-all cursor-pointer select-none active:scale-98 ${
          currentOption.badgeBg
        } ${currentOption.badgeText} ${currentOption.badgeBorder} ${
          isOpen ? 'ring-2 ring-sky-500/20 shadow-md' : 'hover:shadow-sm'
        }`}
      >
        <span className={`w-2 h-2 rounded-full ${currentOption.dotColor} animate-pulse`} />
        <CurrentIcon className="w-3.5 h-3.5 opacity-90" />
        <span>{currentOption.labelAr}</span>
        <span className="text-[10px] opacity-70 font-semibold">({currentOption.labelEn})</span>
        <ChevronDown
          className={`w-3.5 h-3.5 text-slate-400 transition-transform duration-200 ${
            isOpen ? 'rotate-180' : ''
          }`}
        />
      </button>

      {/* Custom Popup Popover */}
      {isOpen && (
        <div className="absolute right-0 rtl:right-0 rtl:left-auto ltr:left-0 ltr:right-auto mt-2 w-56 bg-white/95 backdrop-blur-xl border border-slate-200/90 rounded-2xl shadow-2xl shadow-slate-900/15 py-1.5 z-50 animate-in fade-in zoom-in-95 duration-150 ring-1 ring-black/5">
          <div className="px-3 py-1.5 text-[10px] font-extrabold uppercase tracking-wider text-slate-400 border-b border-slate-100 mb-1">
            تحديث حالة الطلب / Update Status
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
                      : 'text-slate-700 hover:bg-slate-50/90'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <span className={`w-2 h-2 rounded-full ${option.dotColor}`} />
                    <Icon className={`w-3.5 h-3.5 ${isSelected ? option.badgeText : 'text-slate-400'}`} />
                    <div className="text-right rtl:text-right ltr:text-left">
                      <div className="leading-tight">{option.labelAr}</div>
                      <div className="text-[10px] text-slate-400 font-normal">{option.labelEn}</div>
                    </div>
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
