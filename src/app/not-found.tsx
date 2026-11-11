'use client';

import React from 'react';
import Link from 'next/link';
import { useLanguage } from '@/context/LanguageContext';
import { getLocalizedPath } from '@/lib/i18nRoutes';
import { AlertCircle, ArrowLeft, ArrowRight, Home, PhoneCall } from 'lucide-react';

export default function NotFound() {
  const { language, direction } = useLanguage();
  const isRtl = direction === 'rtl';

  const copy = {
    ar: {
      code: '404',
      title: 'الصفحة غير موجودة',
      desc: 'عذراً، الرابط الذي طلبته غير متوفر أو تم نقله. يمكنك العودة إلى الصفحة الرئيسية أو التواصل مع فريقنا الطبي مباشرة.',
      home: 'العودة للرئيسية',
      contact: 'استشارة مجانية',
    },
    fr: {
      code: '404',
      title: 'Page introuvable',
      desc: 'Désolé, la page demandée n’existe pas ou a été déplacée. Vous pouvez revenir à l’accueil ou contacter notre coordination médicale.',
      home: 'Retour à l’accueil',
      contact: 'Consultation Gratuite',
    },
    en: {
      code: '404',
      title: 'Page Not Found',
      desc: 'Sorry, the page you requested does not exist or has been moved. You can return to the homepage or contact our medical team directly.',
      home: 'Back to Homepage',
      contact: 'Free Consultation',
    },
  }[language];

  return (
    <main className="min-h-[75vh] flex items-center justify-center bg-gradient-to-b from-slate-50 to-white dark:from-[#0B1120] dark:to-[#081529] px-4 py-28">
      <div className="max-w-xl w-full text-center bg-white dark:bg-[#0F1E33] border border-slate-200 dark:border-white/10 rounded-3xl p-8 sm:p-12 shadow-xl">
        <div className="w-16 h-16 rounded-2xl bg-amber-50 dark:bg-amber-900/20 text-amber-600 flex items-center justify-center mx-auto mb-6">
          <AlertCircle className="w-8 h-8" />
        </div>
        <div className="text-5xl font-black text-[#032654] dark:text-[#047AC3] mb-3 tracking-tight">
          {copy.code}
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#032654] dark:text-white mb-4">
          {copy.title}
        </h1>
        <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed mb-8">
          {copy.desc}
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            href={getLocalizedPath('/', language)}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-[#032654] hover:bg-[#047AC3] text-white font-bold text-sm transition-colors"
          >
            <Home className="w-4 h-4" />
            <span>{copy.home}</span>
            {isRtl ? <ArrowLeft className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}
          </Link>
          <Link
            href={getLocalizedPath('/contact', language)}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-slate-100 dark:bg-white/10 hover:bg-slate-200 dark:hover:bg-white/15 text-[#032654] dark:text-white font-bold text-sm transition-colors"
          >
            <PhoneCall className="w-4 h-4" />
            <span>{copy.contact}</span>
          </Link>
        </div>
      </div>
    </main>
  );
}

