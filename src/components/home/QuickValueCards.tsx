'use client';

import React from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { Award, Network, UserCheck } from 'lucide-react';

export const QuickValueCards: React.FC = () => {
  const { t } = useLanguage();

  const cards = [
    {
      icon: Award,
      title: t.values.experienceTitle,
      desc: t.values.experienceDesc,
    },
    {
      icon: Network,
      title: t.values.networkTitle,
      desc: t.values.networkDesc,
    },
    {
      icon: UserCheck,
      title: t.values.guidanceTitle,
      desc: t.values.guidanceDesc,
    },
  ];

  return (
    <section className="py-8 sm:py-16 bg-[#F8FAFC] dark:bg-[#0B1120]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
          {cards.map((card, idx) => {
            const Icon = card.icon;
            return (
              <div
                key={idx}
                className="bg-white dark:bg-slate-900 rounded-2xl p-5 sm:p-7 border border-slate-200/70 dark:border-slate-800 shadow-xs sm:shadow-sm hover:shadow-md transition-all duration-300 transform hover:-translate-y-1 group flex sm:flex-col items-start gap-4 sm:gap-0"
              >
                <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl bg-sky-50 dark:bg-sky-950/60 text-sky-600 dark:text-sky-400 flex items-center justify-center shrink-0 sm:mb-5 border border-sky-100 dark:border-sky-800/60 group-hover:bg-sky-500 group-hover:text-white transition-colors duration-300">
                  <Icon className="w-5 h-5 sm:w-6 sm:h-6 stroke-[1.75]" />
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white mb-1 sm:mb-2 group-hover:text-sky-600 dark:group-hover:text-sky-400 transition-colors">
                    {card.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                    {card.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
