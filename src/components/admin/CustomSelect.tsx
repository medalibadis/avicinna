'use client';

import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Check } from 'lucide-react';

export interface SelectOption {
  value: string;
  label: string;
  subLabel?: string;
  icon?: React.ComponentType<{ className?: string }>;
}

interface CustomSelectProps {
  label?: string;
  options: SelectOption[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

export function CustomSelect({
  label,
  options,
  value,
  onChange,
  placeholder = 'اختر من القائمة...',
  className = '',
}: CustomSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const selectedOption = options.find((opt) => opt.value === value);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className={`space-y-1.5 ${className}`} ref={containerRef}>
      {label && <label className="block text-xs font-bold text-slate-700">{label}</label>}

      <div className="relative">
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className={`w-full bg-white border border-slate-200/90 rounded-xl px-4 py-2.5 text-xs text-slate-800 flex items-center justify-between shadow-xs transition-all cursor-pointer ${
            isOpen ? 'ring-2 ring-sky-500/20 border-sky-500 shadow-sm' : 'hover:border-slate-300'
          }`}
        >
          <div className="flex items-center gap-2.5 truncate">
            {selectedOption?.icon && <selectedOption.icon className="w-4 h-4 text-sky-600 shrink-0" />}
            <span className="font-semibold truncate">
              {selectedOption ? selectedOption.label : placeholder}
            </span>
            {selectedOption?.subLabel && (
              <span className="text-[10px] text-slate-400 font-normal truncate">
                ({selectedOption.subLabel})
              </span>
            )}
          </div>
          <ChevronDown
            className={`w-4 h-4 text-slate-400 transition-transform duration-200 shrink-0 ${
              isOpen ? 'rotate-180 text-sky-600' : ''
            }`}
          />
        </button>

        {isOpen && (
          <div className="absolute right-0 rtl:right-0 rtl:left-auto ltr:left-0 ltr:right-auto mt-1.5 w-full bg-white/95 backdrop-blur-xl border border-slate-200/90 rounded-2xl shadow-xl shadow-slate-900/10 py-1.5 z-50 animate-in fade-in zoom-in-95 duration-150 max-h-60 overflow-y-auto ring-1 ring-black/5">
            <div className="space-y-0.5 px-1.5">
              {options.map((option) => {
                const isSelected = option.value === value;
                const Icon = option.icon;

                return (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => {
                      onChange(option.value);
                      setIsOpen(false);
                    }}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-sky-50 text-sky-700 font-bold border border-sky-200/60 shadow-xs'
                        : 'text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      {Icon && (
                        <Icon
                          className={`w-3.5 h-3.5 shrink-0 ${isSelected ? 'text-sky-600' : 'text-slate-400'}`}
                        />
                      )}
                      <div className="text-right rtl:text-right ltr:text-left truncate">
                        <span className="truncate">{option.label}</span>
                        {option.subLabel && (
                          <span className="text-[10px] text-slate-400 block font-normal truncate">
                            {option.subLabel}
                          </span>
                        )}
                      </div>
                    </div>

                    {isSelected && <Check className="w-3.5 h-3.5 text-sky-600 shrink-0 mr-1 rtl:mr-0 rtl:ml-1" />}
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
