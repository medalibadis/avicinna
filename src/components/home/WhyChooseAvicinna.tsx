'use client';

import React from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { useData } from '@/context/DataContext';
import { FileText, Building, HeartPulse, MessageSquare, MessageCircle, CheckCircle } from 'lucide-react';

export const WhyChooseAvicinna: React.FC = () => {
  const { t, language } = useLanguage();
  const { sections } = useData();

  const phoneRaw = (sections.whyChoose.whatsappNumber || '+90 500 000 00 00').replace(/[^0-9]/g, '');
  const defaultMsg: Record<string, string> = {
    ar: 'مرحباً، أود الحصول على استشارة طبية مجانية عبر منصة AVICINNA بخصوص حالتي.',
    en: 'Hello, I would like to request a free medical consultation with the AVICINNA team regarding treatment in Turkey.',
    fr: 'Bonjour, je souhaite obtenir une consultation médicale gratuite avec l\'équipe AVICINNA concernant des soins en Turquie.',
  };
  const message = encodeURIComponent(defaultMsg[language] || defaultMsg.en);
  const whatsappUrl = `https://wa.me/${phoneRaw}?text=${message}`;

  const features = [
    {
      icon: FileText,
      title: t.whyChoose.card1Title,
      desc: t.whyChoose.card1Desc,
    },
    {
      icon: Building,
      title: t.whyChoose.card2Title,
      desc: t.whyChoose.card2Desc,
    },
    {
      icon: HeartPulse,
      title: t.whyChoose.card3Title,
      desc: t.whyChoose.card3Desc,
    },
    {
      icon: MessageSquare,
      title: t.whyChoose.card4Title,
      desc: t.whyChoose.card4Desc,
    },
  ];

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* Content Column (7 cols) */}
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 bg-[#EAF6FF] text-[#0097FB] text-xs font-bold uppercase tracking-wider px-3.5 py-1.5 rounded-full border border-[#0097FB]/20">
              {t.whyChoose.badge}
            </div>

            <h2 className="text-2xl sm:text-4xl font-extrabold text-[#032654] tracking-tight leading-tight">
              {t.whyChoose.title}
            </h2>

            <p className="text-sm sm:text-base text-[#64748B] leading-relaxed">
              {t.whyChoose.subtitle}
            </p>

            {/* 4 Feature Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 pt-3">
              {features.map((feat, idx) => {
                const Icon = feat.icon;
                return (
                  <div
                    key={idx}
                    className="p-5 rounded-2xl bg-white border border-slate-100 shadow-xs hover:border-[#0097FB]/30 transition-all duration-300 hover:bg-[#EAF6FF]/30"
                  >
                    <div className="w-10 h-10 rounded-xl bg-[#EAF6FF] shadow-xs border border-[#0097FB]/20 text-[#0097FB] flex items-center justify-center mb-3">
                      <Icon className="w-5 h-5" />
                    </div>
                    <h3 className="text-base font-bold text-[#163B63] mb-1.5">
                      {feat.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-[#64748B] leading-relaxed">
                      {feat.desc}
                    </p>
                  </div>
                );
              })}
            </div>

            {/* WhatsApp CTA */}
            <div className="pt-3">
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2.5 bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-sm px-8 py-4 rounded-full shadow-lg shadow-emerald-500/25 transition-all duration-200 transform hover:-translate-y-0.5"
              >
                <MessageCircle className="w-5 h-5 fill-current" />
                <span>{t.whyChoose.whatsappCta}</span>
              </a>
            </div>
          </div>

          {/* Visual Column (5 cols) */}
          <div className="lg:col-span-5 relative">
            <div className="relative rounded-3xl overflow-hidden shadow-2xl border border-slate-100">
              <img
                src="https://images.unsplash.com/photo-1622253692010-333f2da6031d?q=80&w=1000&auto=format&fit=crop"
                alt="AVICINNA Medical Coordinator and Doctor"
                className="w-full h-[520px] object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#032654]/80 via-transparent to-transparent" />

              <div className="absolute bottom-6 left-6 right-6 bg-white/95 backdrop-blur-md p-5 rounded-2xl shadow-lg border border-white/40">
                <div className="flex items-center gap-2 text-[#0097FB] font-bold text-sm mb-1">
                  <CheckCircle className="w-4 h-4 text-emerald-500" />
                  <span>{language === 'ar' ? 'فريق طبي متعدد اللغات' : 'Multilingual Medical Board'}</span>
                </div>
                <p className="text-xs text-[#64748B] leading-relaxed">
                  {language === 'ar'
                    ? 'نرافقك باللغات العربية، الإنجليزية والفرنسية في كل خطوة.'
                    : 'Personal medical translators supporting you in Arabic, English, and French.'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
