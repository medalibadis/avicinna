'use client';

import React from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { useData } from '@/context/DataContext';
import { Hotel, Car, Languages, Check, Building2, MapPin } from 'lucide-react';

export const HospitalsPartners: React.FC = () => {
  const { t, language } = useLanguage();
  const { hospitals } = useData();

  const supportingItems = [
    {
      icon: Hotel,
      title: t.hospitals.facilityTitle,
      desc: t.hospitals.facilityDesc,
    },
    {
      icon: Car,
      title: t.hospitals.transferTitle,
      desc: t.hospitals.transferDesc,
    },
    {
      icon: Languages,
      title: t.hospitals.coordinationTitle,
      desc: t.hospitals.coordinationDesc,
    },
  ];

  return (
    <section className="py-20 bg-[#032654] text-white relative overflow-hidden">
      {/* Subtle Background Glow */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-[#0097FB]/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-[#00BFFF]/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 bg-[#0097FB]/15 border border-[#00BFFF]/30 text-[#00BFFF] text-xs font-bold uppercase tracking-wider px-3.5 py-1.5 rounded-full mb-3">
            {t.hospitals.badge}
          </div>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight mb-4">
            {t.hospitals.title}
          </h2>
          <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
            {t.hospitals.subtitle}
          </p>
        </div>

        {/* 2 Large Featured Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {/* Featured Card 1: Luxury Patient Suites */}
          <div className="group relative rounded-3xl overflow-hidden bg-white/5 border border-white/10 shadow-2xl hover:border-[#00BFFF]/40 transition-all duration-300">
            <div className="h-72 overflow-hidden relative">
              <img
                src="https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?q=80&w=1200&auto=format&fit=crop"
                alt="Luxury Patient Suite Istanbul"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#032654] via-[#032654]/40 to-transparent" />
              <div className="absolute top-4 right-4 bg-[#0097FB] text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-md">
                VIP 5-Star Experience
              </div>
            </div>
            <div className="p-7">
              <div className="flex items-center gap-2 text-xs font-semibold text-[#00BFFF] uppercase tracking-wider mb-2">
                <Hotel className="w-4 h-4" />
                <span>AVICINNA HOSPITALITY</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-white mb-3">
                {t.hospitals.card1Title}
              </h3>
              <p className="text-sm text-slate-300 leading-relaxed mb-4">
                {t.hospitals.card1Desc}
              </p>
              <div className="flex flex-wrap gap-2 text-xs text-slate-300">
                <span className="bg-white/10 px-3 py-1 rounded-lg">إقامة 5 نجوم</span>
                <span className="bg-white/10 px-3 py-1 rounded-lg">خدمة تمريض فندقي</span>
                <span className="bg-white/10 px-3 py-1 rounded-lg">وجبات صحية مخصصة</span>
              </div>
            </div>
          </div>

          {/* Featured Card 2: Acibadem Hospital Istanbul */}
          <div className="group relative rounded-3xl overflow-hidden bg-white/5 border border-white/10 shadow-2xl hover:border-[#00BFFF]/40 transition-all duration-300">
            <div className="h-72 overflow-hidden relative">
              <img
                src="https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?q=80&w=1200&auto=format&fit=crop"
                alt="Acibadem Hospital Istanbul"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#032654] via-[#032654]/40 to-transparent" />
              <div className="absolute top-4 right-4 bg-emerald-500 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-md">
                JCI Accredited
              </div>
            </div>
            <div className="p-7">
              <div className="flex items-center gap-2 text-xs font-semibold text-[#00BFFF] uppercase tracking-wider mb-2">
                <Building2 className="w-4 h-4" />
                <span>PREMIER HOSPITAL NETWORK</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-white mb-3">
                {t.hospitals.card2Title}
              </h3>
              <p className="text-sm text-slate-300 leading-relaxed mb-4">
                {t.hospitals.card2Desc}
              </p>
              <div className="flex flex-wrap gap-2 text-xs text-slate-300">
                <span className="bg-white/10 px-3 py-1 rounded-lg">مستشفيات معتمدة</span>
                <span className="bg-white/10 px-3 py-1 rounded-lg">جراحة روبوتية</span>
                <span className="bg-white/10 px-3 py-1 rounded-lg">مختبرات توافق وراثي</span>
              </div>
            </div>
          </div>
        </div>

        {/* 3 Supporting Value Items */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6 border-t border-white/10 mb-14">
          {supportingItems.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="flex items-start gap-4 p-5 rounded-2xl bg-white/5 border border-white/5 hover:border-[#00BFFF]/30 transition-colors"
              >
                <div className="w-12 h-12 rounded-xl bg-[#0097FB]/20 text-[#00BFFF] flex items-center justify-center flex-shrink-0">
                  <Icon className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="text-base font-bold text-white mb-1">
                    {item.title}
                  </h4>
                  <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Partner Hospitals Logo / Badges Strip */}
        <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
          <div className="text-center text-xs font-bold uppercase tracking-wider text-slate-400 mb-5">
            {language === 'ar' ? 'شبكتنا الاستراتيجية من المستشفيات والمراكز المعتمدة' : 'Accredited Healthcare & Surgical Partners'}
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
            {hospitals.map((hosp) => (
              <div
                key={hosp.id}
                className="bg-white/5 rounded-xl p-4 border border-white/5 flex flex-col items-center justify-center hover:bg-white/10 transition-colors"
              >
                <div className="text-sm font-bold text-white mb-1">
                  {hosp.name[language]}
                </div>
                <div className="text-[11px] text-[#00BFFF] font-medium">
                  {hosp.accreditation}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
