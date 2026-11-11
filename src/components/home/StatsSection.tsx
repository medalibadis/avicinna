'use client';

import React, { useEffect, useState, useRef } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { useData } from '@/context/DataContext';
import { Users, Building2, Stethoscope } from 'lucide-react';

function parseMetricTarget(rawValue: string): {
  target: number;
  prefix: string;
  suffix: string;
  useComma: boolean;
} {
  const str = String(rawValue || '').trim();
  const match = str.match(/^([^0-9]*)([0-9][0-9,.]*)(.*)$/);
  if (!match) return { target: 0, prefix: '', suffix: str, useComma: false };
  const [, prefix, numPart, suffix] = match;
  const numeric = parseInt(numPart.replace(/[^0-9]/g, ''), 10) || 0;
  return {
    target: numeric,
    prefix,
    suffix,
    useComma: numPart.includes(','),
  };
}

function formatMetricProgress(
  current: number,
  parsed: { prefix: string; suffix: string; useComma: boolean }
): string {
  const formatted = parsed.useComma ? current.toLocaleString('en-US') : String(current);
  return `${parsed.prefix}${formatted}${parsed.suffix}`;
}

export const StatsSection: React.FC = () => {
  const { language } = useLanguage();
  const { sections } = useData();
  const [animFinished, setAnimFinished] = useState(false);
  const [animValues, setAnimValues] = useState<[number, number, number] | null>(null);
  const hasStartedRef = useRef(false);
  const sectionRef = useRef<HTMLDivElement>(null);

  const rawPatients = sections.stats.patientsCount || '+2,500';
  const rawHospitals = sections.stats.hospitalsCount || '+15';
  const rawExperience = sections.stats.experienceCount || '+10';

  const parsedPatients = parseMetricTarget(rawPatients);
  const parsedHospitals = parseMetricTarget(rawHospitals);
  const parsedExperience = parseMetricTarget(rawExperience);

  useEffect(() => {
    hasStartedRef.current = false;
    setAnimFinished(false);
    setAnimValues(null);

    const node = sectionRef.current;
    if (!node) return;

    const pTarget = parseMetricTarget(rawPatients).target;
    const hTarget = parseMetricTarget(rawHospitals).target;
    const eTarget = parseMetricTarget(rawExperience).target;

    const runAnimation = () => {
      if (hasStartedRef.current) return;
      hasStartedRef.current = true;

      const duration = 500;
      const frameRate = 1000 / 60;
      const totalFrames = Math.max(1, Math.round(duration / frameRate));

      let frame = 0;
      const timer = setInterval(() => {
        frame++;
        const progress = Math.min(1, frame / totalFrames);
        const easeOut = 1 - Math.pow(1 - progress, 3);

        setAnimValues([
          Math.round(pTarget * easeOut),
          Math.round(hTarget * easeOut),
          Math.round(eTarget * easeOut),
        ]);

        if (frame >= totalFrames) {
          clearInterval(timer);
          setAnimValues(null);
          setAnimFinished(true);
        }
      }, frameRate);
    };

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          runAnimation();
          observer.disconnect();
        }
      },
      { threshold: 0.15 }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [rawPatients, rawHospitals, rawExperience]);

  const stats = [
    {
      count:
        animValues !== null && !animFinished
          ? formatMetricProgress(animValues[0], parsedPatients)
          : rawPatients,
      label: sections.stats.patientsLabel?.[language] || '',
      icon: Users,
      desc:
        language === 'ar'
          ? 'من أكثر من 35 دولة'
          : language === 'fr'
          ? 'Originaires de plus de 35 pays'
          : 'From over 35 countries',
    },
    {
      count:
        animValues !== null && !animFinished
          ? formatMetricProgress(animValues[1], parsedHospitals)
          : rawHospitals,
      label: sections.stats.hospitalsLabel?.[language] || '',
      icon: Building2,
      desc:
        language === 'ar'
          ? 'معتمدة دولياً من JCI'
          : language === 'fr'
          ? 'Accrédités JCI et normes ISO'
          : 'JCI & ISO accredited',
    },
    {
      count:
        animValues !== null && !animFinished
          ? formatMetricProgress(animValues[2], parsedExperience)
          : rawExperience,
      label: sections.stats.experienceLabel?.[language] || '',
      icon: Stethoscope,
      desc:
        language === 'ar'
          ? 'بأحدث التقنيات الجراحية'
          : language === 'fr'
          ? 'Technologies chirurgicales avancées'
          : 'Advanced surgical care',
    },
  ];

  return (
    <section ref={sectionRef} className="relative z-20 -mt-4 sm:-mt-8 md:-mt-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="bg-white dark:bg-slate-900/95 backdrop-blur-xl rounded-2xl sm:rounded-3xl shadow-xl shadow-slate-200/50 dark:shadow-none border border-slate-100 dark:border-slate-800 p-4 sm:p-8 lg:p-10 transition-all duration-300">
        <div className="grid grid-cols-3 gap-2 sm:gap-8 divide-x rtl:divide-x-reverse divide-slate-100 dark:divide-slate-800">
          {stats.map((stat, idx) => {
            const Icon = stat.icon;
            return (
              <div
                key={idx}
                className="flex flex-col items-center text-center p-1 sm:p-4 transition-transform duration-300 hover:scale-105"
              >
                <div className="w-10 h-10 sm:w-14 sm:h-14 rounded-xl sm:rounded-2xl bg-[#EAF6FF] dark:bg-sky-950/60 text-[#0097FB] dark:text-sky-400 flex items-center justify-center mb-1.5 sm:mb-4 border border-[#0097FB]/20 dark:border-sky-800/60 shadow-xs">
                  <Icon className="w-5 h-5 sm:w-7 sm:h-7" />
                </div>
                <div dir="ltr" className="text-lg sm:text-4xl lg:text-5xl font-black text-[#032654] dark:text-white tracking-tight font-sans mb-0.5 sm:mb-2">
                  {stat.count}
                </div>
                <div className="text-[10.5px] sm:text-base lg:text-lg font-bold text-[#163B63] dark:text-slate-200 mb-0.5 sm:mb-1 leading-snug line-clamp-2">
                  {stat.label}
                </div>
                <div className="hidden sm:block text-xs font-medium text-[#64748B] dark:text-slate-400">
                  {stat.desc}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
