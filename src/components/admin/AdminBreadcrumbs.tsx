'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useLanguage } from '@/context/LanguageContext';
import { ChevronLeft, ChevronRight, Home } from 'lucide-react';

const ROUTE_LABELS: Record<string, { ar: string; en: string; fr: string }> = {
  admin: { ar: 'لوحة التحكم', en: 'Dashboard', fr: 'Tableau de bord' },
  sections: { ar: 'أقسام الموقع', en: 'Site Sections', fr: 'Sections du site' },
  hospitals: { ar: 'المستشفيات الشريكة', en: 'Hospitals', fr: 'Hôpitaux partenaires' },
  doctors: { ar: 'الأطباء والجراحون', en: 'Doctors', fr: 'Médecins & Chirurgiens' },
  treatments: { ar: 'التخصصات والعمليات', en: 'Treatments', fr: 'Traitements & Chirurgies' },
  stories: { ar: 'قصص المرضى', en: 'Patient Stories', fr: 'Témoignages patients' },
  blog: { ar: 'المدونة والمقالات', en: 'Blog & Articles', fr: 'Blog & Articles' },
  inquiries: { ar: 'طلبات الاستشارة', en: 'Leads & Inquiries', fr: 'Demandes reçues' },
  settings: { ar: 'إعدادات المنصة', en: 'Settings', fr: 'Paramètres' },
};

export function AdminBreadcrumbs() {
  const pathname = usePathname();
  const { language, direction } = useLanguage();
  const langKey = language === 'ar' || language === 'en' || language === 'fr' ? language : 'ar';
  const Separator = direction === 'rtl' ? ChevronLeft : ChevronRight;

  const homeLabel = {
    ar: 'الرئيسية',
    en: 'Home',
    fr: 'Accueil',
  }[langKey];

  const overviewLabel = {
    ar: 'نظرة عامة',
    en: 'Overview',
    fr: 'Aperçu général',
  }[langKey];

  const segments = pathname.split('/').filter(Boolean);

  if (segments.length <= 1) {
    return (
      <div className="hidden sm:flex items-center gap-1.5 text-xs text-slate-500 font-medium">
        <Home className="w-3.5 h-3.5 text-[#0097FB]" />
        <span className="font-bold text-[#032654]">{overviewLabel}</span>
      </div>
    );
  }

  return (
    <nav aria-label="Breadcrumb" className="hidden sm:flex items-center gap-1.5 text-xs text-slate-500 font-medium">
      <Link
        href="/admin"
        className="flex items-center gap-1 text-slate-600 hover:text-[#0097FB] transition-colors"
      >
        <Home className="w-3.5 h-3.5" />
        <span>{homeLabel}</span>
      </Link>

      {segments.map((segment, index) => {
        if (index === 0 && segment === 'admin') return null;
        const href = `/${segments.slice(0, index + 1).join('/')}`;
        const isLast = index === segments.length - 1;
        const routeObj = ROUTE_LABELS[segment];
        const labelText = routeObj ? routeObj[langKey] : segment;

        return (
          <React.Fragment key={href}>
            <Separator className="w-3 h-3 text-slate-400" />
            {isLast ? (
              <span className="font-bold text-[#0097FB] bg-[#EAF6FF] px-2.5 py-0.5 rounded-lg border border-[#0097FB]/20">
                {labelText}
              </span>
            ) : (
              <Link href={href} className="text-slate-600 hover:text-[#0097FB] transition-colors">
                {labelText}
              </Link>
            )}
          </React.Fragment>
        );
      })}
    </nav>
  );
}
