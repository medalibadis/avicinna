'use client';

import React, { useState } from 'react';
import { MessageCircle, X, Send, Sparkles } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { useData } from '@/context/DataContext';

export const FloatingWhatsApp: React.FC = () => {
  const { language, t } = useLanguage();
  const { sections } = useData();
  const [isOpen, setIsOpen] = useState(false);

  // Official WhatsApp number from client
  const phoneRaw = (sections.finalCta.phone || '+90 544 282 27 69').replace(/[^0-9]/g, '') || '905442822769';

  const defaultMsg: Record<string, string> = {
    ar: 'مرحباً، أود الحصول على استشارة طبية مجانية عبر منصة AVICINNA بخصوص حالتي.',
    en: 'Hello, I would like to request a free medical consultation with the AVICINNA team regarding treatment in Turkey.',
    fr: "Bonjour, je souhaite obtenir une consultation médicale gratuite avec l'équipe AVICINNA concernant des soins en Turquie.",
  };
  const message = encodeURIComponent(defaultMsg[language] || defaultMsg.en);
  const whatsappUrl = `https://wa.me/${phoneRaw}?text=${message}`;

  return (
    <div
      id="whatsapp-floating-container"
      className="fixed bottom-4 sm:bottom-6 right-3 sm:right-6 z-50 flex flex-col items-end select-none"
      dir="ltr"
    >
      {/* Quick Chat Popup Card */}
      {isOpen && (
        <div
          className="mb-3 w-[calc(100vw-1.5rem)] max-w-sm sm:w-84 bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden animate-in fade-in slide-in-from-bottom-3 duration-200"
          dir={language === 'ar' ? 'rtl' : 'ltr'}
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-[#021b3b] to-[#032654] text-white p-3.5 sm:p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-emerald-500 flex items-center justify-center text-white shadow-md shadow-emerald-500/30">
                  <MessageCircle className="w-4 h-4 sm:w-5 sm:h-5 fill-current" />
                </div>
                <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-400 border-2 border-[#032654] rounded-full animate-pulse" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h4 className="font-bold text-xs sm:text-sm tracking-wide">AVICINNA</h4>
                  <span className="text-[9px] sm:text-[10px] bg-emerald-500/20 text-emerald-300 px-1.5 py-0.5 rounded-full font-semibold">
                    24/7
                  </span>
                </div>
                <p className="text-[10px] sm:text-[11px] text-emerald-400 font-medium flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block animate-ping" />
                  {language === 'ar'
                    ? 'متصل الآن للمساعدة الطبية الفورية'
                    : language === 'fr'
                    ? 'En ligne pour assistance médicale'
                    : 'Online for Immediate Assistance'}
                </p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-white/70 hover:text-white p-1.5 rounded-lg hover:bg-white/10 transition-colors"
              aria-label="Close WhatsApp chat card"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Body */}
          <div className="p-3.5 sm:p-4 bg-slate-50 space-y-3 sm:space-y-3.5">
            <div className="bg-white p-3 sm:p-3.5 rounded-2xl rounded-tr-none shadow-xs text-xs text-slate-700 leading-relaxed border border-slate-100/80">
              <p className="font-semibold text-slate-900 mb-1 flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                {language === 'ar'
                  ? 'مرحباً بك في أفيسينا الدولية'
                  : language === 'fr'
                  ? 'Bienvenue chez AVICINNA'
                  : 'Welcome to AVICINNA Health'}
              </p>
              {language === 'ar'
                ? 'فريقنا الطبي جاهز للرد على استفسارك ومراجعة تقاريرك الطبية مجاناً واقتراح أفضل المستشفيات والبروفيسورات المناسبة لحالتك.'
                : language === 'fr'
                ? 'Notre équipe médicale est disponible 24/7 sur WhatsApp pour étudier vos rapports médicaux et vous orienter vers les meilleurs spécialistes en Turquie.'
                : 'Our medical coordinators are available 24/7 on WhatsApp for your free case review and direct guidance to top-tier Turkish hospital faculties.'}
            </div>

            <div className="text-[10px] sm:text-[11px] text-slate-500 flex items-center justify-between px-1">
              <span>{language === 'ar' ? 'الرقم الرسمي:' : language === 'fr' ? 'Ligne officielle :' : 'Official Line:'}</span>
              <span className="font-mono font-bold text-slate-800" dir="ltr">+90 544 282 27 69</span>
            </div>

            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full flex items-center justify-center gap-2.5 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white font-bold py-2.5 sm:py-3 px-4 rounded-xl shadow-lg shadow-emerald-500/25 transition-all duration-200 text-xs sm:text-sm active:scale-[0.98]"
            >
              <MessageCircle className="w-4 h-4 fill-current" />
              <span>{t.common.whatsapp}</span>
              <Send className="w-3.5 h-3.5 rtl:rotate-180 opacity-80" />
            </a>
          </div>
        </div>
      )}

      {/* Floating Action Button (Always on the right, perfectly sized for mobile) */}
      <button
        id="btn-floating-whatsapp"
        onClick={() => setIsOpen(!isOpen)}
        className="group relative flex items-center justify-center gap-2 bg-gradient-to-tr from-emerald-600 via-emerald-500 to-teal-400 text-white rounded-full shadow-2xl shadow-emerald-500/40 hover:shadow-emerald-500/60 p-2.5 sm:px-5 sm:py-3.5 transition-all duration-300 transform hover:scale-105 active:scale-95 cursor-pointer border border-white/20"
        aria-label="WhatsApp Medical Coordinator +90 544 282 27 69"
      >
        {/* Pulsing ring indicator */}
        <span className="absolute -inset-1 rounded-full bg-emerald-400/30 animate-ping pointer-events-none" />

        {/* WhatsApp Icon */}
        <div className="relative flex items-center justify-center">
          <MessageCircle className="w-5 h-5 sm:w-6 sm:h-6 fill-current animate-[pulse_2s_ease-in-out_infinite]" />
          <span className="absolute -top-1 -right-1 w-2 h-2 sm:w-2.5 sm:h-2.5 bg-white border-2 border-emerald-500 rounded-full" />
        </div>

        {/* Desktop Label (Hidden on mobile for clean touch target, visible on sm+) */}
        <span className="hidden sm:inline-block font-extrabold text-sm tracking-wide text-white drop-shadow-sm">
          {t.common.whatsapp}
        </span>
      </button>
    </div>
  );
};
