'use client';

import React from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { useData } from '@/context/DataContext';
import { MessageCircle, Calendar, ShieldCheck, Heart } from 'lucide-react';

export const FinalCTA: React.FC = () => {
  const { t, language } = useLanguage();
  const { sections } = useData();

  const ctaData = sections.finalCta;
  const phone = ctaData.phone || '+90 500 000 00 00';
  const defaultMsg: Record<string, string> = {
    ar: 'مرحباً، أود الحصول على استشارة طبية مجانية عبر منصة AVICINNA بخصوص حالتي.',
    en: 'Hello, I would like to request a free medical consultation with the AVICINNA team regarding treatment in Turkey.',
    fr: 'Bonjour, je souhaite obtenir une consultation médicale gratuite avec l\'équipe AVICINNA concernant des soins en Turquie.',
  };
  const message = encodeURIComponent(defaultMsg[language] || defaultMsg.en);
  const whatsappUrl = `https://wa.me/${phone.replace(/[^0-9]/g, '')}?text=${message}`;

  const headingText = ctaData.title[language] || (language === 'ar'
    ? 'مستعد لاتخاذ الخطوة الأولى نحو الشفاء في إسطنبول؟'
    : language === 'fr'
    ? 'Prêt à franchir la première étape vers votre rétablissement à Istanbul ?'
    : 'Ready to Take the First Step Toward Healing in Istanbul?');

  const subtitleText = ctaData.subtitle[language] || (language === 'ar'
    ? 'تواصل معنا الآن عبر واتساب أو احجز استشارتك المجانية. فريقنا الطبي في خدمتك طوال أيام الأسبوع لدراسة تقاريرك وتنسيق كافة تفاصيل رحلتك.'
    : language === 'fr'
    ? 'Contactez-nous sur WhatsApp ou réservez votre consultation gratuite. Notre équipe médicale étudie votre dossier sans aucun engagement.'
    : 'Get in touch with our team via WhatsApp or book a free consultation. Our board is available 24/7 to review your medical reports.');

  return (
    <section className="py-20 bg-gradient-to-br from-[#06101E] via-[#0A192F] to-[#0F243E] text-white relative overflow-hidden">
      {/* Background Accent Rings */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-sky-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="inline-flex items-center gap-2 bg-sky-500/20 border border-sky-400/40 px-4 py-1.5 rounded-full text-xs sm:text-sm font-semibold text-sky-200 mb-6">
          <Heart className="w-4 h-4 text-sky-400 fill-current animate-pulse" />
          <span>{language === 'ar' ? 'صحتك في أيدٍ أمينة مع AVICINNA' : 'Your Health in Safe Hands with AVICINNA'}</span>
        </div>

        <h2 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight mb-6 max-w-3xl mx-auto">
          {headingText}
        </h2>

        <p className="text-base sm:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed mb-10">
          {subtitleText}
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-base px-8 py-4 rounded-full shadow-lg shadow-emerald-500/30 transition-all duration-200 transform hover:-translate-y-0.5"
          >
            <MessageCircle className="w-5 h-5 fill-current" />
            <span>{t.common.whatsapp}</span>
          </a>

          <a
            href="#consultation"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-sky-500 hover:bg-sky-600 text-white font-bold text-base px-8 py-4 rounded-full shadow-lg shadow-sky-500/30 transition-all duration-200 transform hover:-translate-y-0.5"
          >
            <Calendar className="w-5 h-5" />
            <span>{t.nav.freeConsultation}</span>
          </a>
        </div>
      </div>
    </section>
  );
};
