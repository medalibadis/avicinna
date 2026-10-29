'use client';

import React, { useEffect, useState, useRef } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { useData } from '@/context/DataContext';
import { Users, Building2, Stethoscope } from 'lucide-react';

export const StatsSection: React.FC = () => {
  const { t, language } = useLanguage();
  const { sections } = useData();
  const [hasAnimated, setHasAnimated] = useState(false);
  const [patients, setPatients] = useState(0);
  const [hospitals, setHospitals] = useState(0);
  const [specialties, setSpecialties] = useState(0);
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !hasAnimated) {
          setHasAnimated(true);

          // Counter animations
          const duration = 1500;
          const frameRate = 1000 / 60;
          const totalFrames = Math.round(duration / frameRate);

          let frame = 0;
          const timer = setInterval(() => {
            frame++;
            const progress = frame / totalFrames;
            const easeOut = 1 - Math.pow(1 - progress, 3);

            setPatients(Math.round(2500 * easeOut));
            setHospitals(Math.round(15 * easeOut));
            setSpecialties(Math.round(10 * easeOut));

            if (frame === totalFrames) {
              clearInterval(timer);
              setPatients(2500);
              setHospitals(15);
              setSpecialties(10);
            }
          }, frameRate);
        }
      },
      { threshold: 0.2 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, [hasAnimated]);

  const stats = [
    {
      count: hasAnimated ? sections.stats.patientsCount : `+${patients}`,
      label: sections.stats.patientsLabel[language],
      icon: Users,
      desc:
        language === 'ar'
          ? 'من أكثر من 35 دولة'
          : language === 'fr'
          ? 'Originaires de plus de 35 pays'
          : 'From over 35 countries',
    },
    {
      count: hasAnimated ? sections.stats.hospitalsCount : `+${hospitals}`,
      label: sections.stats.hospitalsLabel[language],
      icon: Building2,
      desc:
        language === 'ar'
          ? 'معتمدة دولياً من JCI'
          : language === 'fr'
          ? 'Accrédités JCI et normes ISO'
          : 'JCI & ISO accredited',
    },
    {
      count: hasAnimated ? sections.stats.experienceCount : `+${specialties}`,
      label: sections.stats.experienceLabel[language],
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
    <section ref={sectionRef} className="relative z-10 -mt-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="bg-white dark:bg-slate-900/95 backdrop-blur-xl rounded-3xl shadow-xl shadow-slate-200/50 dark:shadow-none border border-slate-100 dark:border-slate-800 p-6 sm:p-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 divide-y md:divide-y-0 md:divide-x rtl:md:divide-x-reverse divide-slate-100 dark:divide-slate-800">
          {stats.map((stat, idx) => {
            const Icon = stat.icon;
            return (
              <div
                key={idx}
                className="flex flex-col items-center text-center p-4 transition-transform duration-300 hover:scale-105"
              >
                <div className="w-14 h-14 rounded-2xl bg-[#EAF6FF] dark:bg-sky-950/60 text-[#0097FB] dark:text-sky-400 flex items-center justify-center mb-4 border border-[#0097FB]/20 dark:border-sky-800/60 shadow-xs">
                  <Icon className="w-7 h-7" />
                </div>
                <div className="text-4xl sm:text-5xl font-black text-[#032654] dark:text-white tracking-tight font-sans mb-2">
                  {stat.count}
                </div>
                <div className="text-base sm:text-lg font-bold text-[#163B63] dark:text-slate-200 mb-1">
                  {stat.label}
                </div>
                <div className="text-xs font-medium text-[#64748B] dark:text-slate-400">
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
