'use client';

import React, { useState } from 'react';
import { MessageCircle, X } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { useData } from '@/context/DataContext';

export const FloatingWhatsApp: React.FC = () => {
  const { language, direction, t } = useLanguage();
  const { sections } = useData();
  const [isOpen, setIsOpen] = useState(false);

  const phoneRaw = (sections.finalCta.phone || '+90 538 492 18 90').replace(/[^0-9]/g, '');
  const defaultMsg: Record<string, string> = {
    ar: 'مرحباً، أود الحصول على استشارة طبية مجانية عبر منصة AVICINNA بخصوص حالتي.',
    en: 'Hello, I would like to request a free medical consultation with the AVICINNA team regarding treatment in Turkey.',
    fr: 'Bonjour, je souhaite obtenir une consultation médicale gratuite avec l\'équipe AVICINNA concernant des soins en Turquie.',
  };
  const message = encodeURIComponent(defaultMsg[language] || defaultMsg.en);
  const whatsappUrl = `https://wa.me/${phoneRaw}?text=${message}`;

  const isRtl = direction === 'rtl';

  return (
    <div
      className={`fixed bottom-6 z-40 flex flex-col items-end ${
        isRtl ? 'left-6' : 'right-6'
      }`}
    >
      {/* Quick Chat Popup Card */}
      {isOpen && (
        <div
          className={`mb-3 w-80 bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden animate-in fade-in slide-in-from-bottom-3 duration-200 ${
            isRtl ? 'text-right' : 'text-left'
          }`}
        >
          {/* Header */}
          <div className="bg-[#0A192F] text-white p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-emerald-500 flex items-center justify-center text-white">
                <MessageCircle className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-sm">AVICINNA</h4>
                <p className="text-[11px] text-emerald-400 font-medium">
                  {language === 'ar' ? 'متصل الآن للمساعدة الطبية' : 'Online for Medical Assistance'}
                </p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-white/70 hover:text-white p-1 rounded-lg hover:bg-white/10"
              aria-label="Close"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Body */}
          <div className="p-4 bg-slate-50 space-y-3">
            <div className="bg-white p-3 rounded-xl rounded-tl-none shadow-sm text-xs text-slate-700 leading-relaxed border border-slate-100">
              {language === 'ar'
                ? 'مرحباً بك في أفيسينا! فريقنا الطبي والاستشاري جاهز للرد على استفسارك ومراجعة تقاريرك مجاناً عبر واتساب.'
                : language === 'fr'
                ? 'Bienvenue chez AVICINNA ! Notre équipe médicale est disponible 24/7 sur WhatsApp pour répondre à vos questions.'
                : 'Welcome to AVICINNA! Our medical coordinators are available 24/7 on WhatsApp for your free case review.'}
            </div>

            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full flex items-center justify-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white font-semibold py-2.5 px-4 rounded-xl shadow-md transition-colors text-sm"
            >
              <MessageCircle className="w-4 h-4" />
              <span>{t.common.whatsapp}</span>
            </a>
          </div>
        </div>
      )}

      {/* Floating Action Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="group flex items-center gap-3 bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-3.5 rounded-full shadow-lg shadow-emerald-500/30 transition-all duration-300 transform hover:scale-105 active:scale-95 cursor-pointer"
        aria-label="WhatsApp Medical Coordinator"
      >
        <MessageCircle className="w-6 h-6 fill-current animate-pulse" />
        <span className="hidden sm:inline font-bold text-sm tracking-wide">
          {t.common.whatsapp}
        </span>
      </button>
    </div>
  );
};
