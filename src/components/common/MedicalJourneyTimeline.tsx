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
          <div className="inline-flex items-center gap-2 bg-[#EAF6FF] text-[#0097FB] text-xs font-bold uppercase tracking-wider px-3.5 py-1.5 rounded-full mb-3 border border-[#0097FB]/20">
            {t.journey.badge}
          </div>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-[#032654] tracking-tight mb-4">
            {t.journey.title}
          </h2>
          <p className="text-sm sm:text-base text-[#64748B] leading-relaxed">
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
                className="flex flex-col items-center text-center p-4 rounded-2xl bg-[#F4F7FA] border border-slate-100 hover:border-[#0097FB]/30 hover:bg-[#EAF6FF]/40 transition-all duration-300 relative group"
              >
                {/* Step Number Badge */}
                <span className="text-[10px] font-black text-[#0097FB] bg-[#EAF6FF] px-2 py-0.5 rounded-full mb-3 border border-[#0097FB]/20">
                  {step.num}
                </span>

                {/* Step Icon */}
                <div className="w-12 h-12 rounded-xl bg-white shadow-xs border border-slate-200/60 text-[#0097FB] flex items-center justify-center mb-3 group-hover:scale-110 group-hover:bg-[#0097FB] group-hover:text-white transition-all">
                  <Icon className="w-5 h-5 stroke-[1.75]" />
                </div>

                {/* Step Title */}
                <h4 className="text-xs font-bold text-[#163B63] leading-snug">
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
