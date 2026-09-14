'use client';

import React from 'react';
import { useLanguage } from '@/context/LanguageContext';
import {
  MessageSquare,
  FileUp,
  ClipboardCheck,
  Building,
  CreditCard,
  PlaneTakeoff,
  UserCheck,
  Stethoscope,
  HeartHandshake,
} from 'lucide-react';

export const MedicalJourneyTimeline: React.FC = () => {
  const { t, language } = useLanguage();

  const steps = [
    { num: '01', title: t.journey.step1, icon: MessageSquare },
    { num: '02', title: t.journey.step2, icon: FileUp },
    { num: '03', title: t.journey.step3, icon: ClipboardCheck },
    { num: '04', title: t.journey.step4, icon: Building },
    { num: '05', title: t.journey.step5, icon: CreditCard },
    { num: '06', title: t.journey.step6, icon: PlaneTakeoff },
    { num: '07', title: t.journey.step7, icon: UserCheck },
    { num: '08', title: t.journey.step8, icon: Stethoscope },
    { num: '09', title: t.journey.step9, icon: HeartHandshake },
  ];

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 bg-sky-50 text-sky-700 text-xs font-bold uppercase tracking-wider px-3.5 py-1.5 rounded-full mb-3 border border-sky-100">
            {t.journey.badge}
          </div>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-[#0A192F] tracking-tight mb-4">
            {t.journey.title}
          </h2>
          <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
            {t.journey.subtitle}
          </p>
        </div>

        {/* Responsive Connected Stepper */}
        <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-9 gap-4 relative">
          {steps.map((step, idx) => {
            const Icon = step.icon;
            return (
              <div
                key={idx}
                className="flex flex-col items-center text-center p-4 rounded-2xl bg-slate-50 border border-slate-100 hover:border-sky-300 hover:bg-sky-50/40 transition-all duration-300 relative group"
              >
                {/* Step Number Badge */}
                <span className="text-[10px] font-black text-sky-600 bg-sky-100 px-2 py-0.5 rounded-full mb-3">
                  {step.num}
                </span>

                {/* Step Icon */}
                <div className="w-12 h-12 rounded-xl bg-white shadow-xs border border-slate-200/60 text-sky-600 flex items-center justify-center mb-3 group-hover:scale-110 group-hover:bg-sky-500 group-hover:text-white transition-all">
                  <Icon className="w-5 h-5 stroke-[1.75]" />
                </div>

                {/* Step Title */}
                <h4 className="text-xs font-bold text-slate-800 leading-snug">
                  {step.title.replace(/^\d+\.\s*/, '')}
                </h4>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
