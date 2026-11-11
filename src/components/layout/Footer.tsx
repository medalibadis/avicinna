'use client';

import React from 'react';
import Link from 'next/link';
import { useLanguage } from '@/context/LanguageContext';
import { Logo } from '@/components/common/Logo';
import { useData } from '@/context/DataContext';
import { getLocalizedEntityPath, getLocalizedPath } from '@/lib/i18nRoutes';
import { Phone, Mail, MapPin, Clock, ShieldCheck, Lock } from 'lucide-react';

export const Footer: React.FC = () => {
  const { t, language } = useLanguage();
  const { treatments: treatmentsData, sections, settings, pages } = useData();

  const contactInfo = {
    address: {
      ar: 'إسطنبول، ليفنت / أتاشهير، الجمهورية التركية',
      en: 'Istanbul (Levent & Atasehir), Republic of Turkey',
      fr: 'Istanbul (Levent & Atasehir), République de Turquie',
    },
    phone: settings?.contact?.phone || sections.finalCta.phone || '+90 544 282 27 69',
    email: settings?.contact?.email || 'contact@avicinna-health.com',
    workingHours: {
      ar: 'التنسيق والاستشارات الطبية متاح 24 ساعة / 7 أيام',
      en: '24/7 International Patient Coordination',
      fr: 'Coordination internationale disponible 24h/24 et 7j/7',
    },
  };

  const customFooterPages = (pages || []).filter(
    (p) => p.status === 'published' && p.showInFooter && !['privacy', 'terms'].includes(p.slug)
  );

  return (
    <footer className="bg-[#032654] dark:bg-[#060D1A] text-slate-300 pt-16 pb-10 border-t border-white/10 dark:border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-12 pb-14 border-b border-white/10">
          {/* Column 1: Brand & About */}
          <div className="space-y-4">
            <Logo variant="footer" size="lg" />
            <p className="text-sm text-slate-300/80 leading-relaxed pt-2">
              {t.footer.tagline}
            </p>
            <div className="flex items-center gap-2 text-xs text-[#00BFFF] font-semibold bg-[#0097FB]/10 border border-[#00BFFF]/30 px-3 py-2 rounded-xl">
              <ShieldCheck className="w-4 h-4 text-[#00BFFF] flex-shrink-0" />
              <span>{t.hero.trustBadge}</span>
            </div>
          </div>

          {/* Column 2: Medical Specialties */}
          <div>
            <h3 className="text-white font-bold text-base mb-4 tracking-wide">
              {t.footer.servicesTitle}
            </h3>
            <ul className="space-y-2.5 text-sm">
              {treatmentsData.slice(0, 6).map((item) => (
                <li key={item.slug}>
                  <Link
                    href={getLocalizedEntityPath('treatments', item, language)}
                    className="text-slate-300/80 hover:text-[#00BFFF] transition-colors flex items-center gap-1.5"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-[#0097FB]"></span>
                    <span>{item.title[language]}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Quick Links */}
          <div>
            <h3 className="text-white font-bold text-base mb-4 tracking-wide">
              {t.footer.quickLinksTitle}
            </h3>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link href={getLocalizedPath('/', language)} className="text-slate-300/80 hover:text-[#00BFFF] transition-colors">
                  {t.nav.home}
                </Link>
              </li>
              <li>
                <Link href={getLocalizedPath('/hospitals', language)} className="text-slate-300/80 hover:text-[#00BFFF] transition-colors">
                  {t.nav.hospitals}
                </Link>
              </li>
              <li>
                <Link href={getLocalizedPath('/doctors', language)} className="text-slate-300/80 hover:text-[#00BFFF] transition-colors">
                  {t.nav.doctors}
                </Link>
              </li>
              <li>
                <Link href={getLocalizedPath('/patient-stories', language)} className="text-slate-300/80 hover:text-[#00BFFF] transition-colors">
                  {t.nav.patientStories}
                </Link>
              </li>
              <li>
                <Link href={getLocalizedPath('/blog', language)} className="text-slate-300/80 hover:text-[#00BFFF] transition-colors">
                  {t.nav.blog}
                </Link>
              </li>
              <li>
                <Link href={getLocalizedPath('/about', language)} className="text-slate-300/80 hover:text-[#00BFFF] transition-colors">
                  {t.nav.about}
                </Link>
              </li>
              <li>
                <Link href={getLocalizedPath('/contact', language)} className="text-slate-300/80 hover:text-[#00BFFF] transition-colors">
                  {t.nav.contact}
                </Link>
              </li>
              {customFooterPages.map((pg) => (
                <li key={pg.id}>
                  <Link
                    href={getLocalizedPath(`/${pg.slugs?.[language] || pg.slug}`, language)}
                    className="text-slate-300/80 hover:text-[#00BFFF] transition-colors"
                  >
                    {pg.title[language] || pg.title.ar}
                  </Link>
                </li>
              ))}
              <li>
                <Link href="/admin" className="text-slate-400 hover:text-[#00BFFF] transition-colors inline-flex items-center gap-1 text-xs pt-1">
                  <Lock className="w-3 h-3 text-[#0097FB]" />
                  <span>{t.common.adminDashboard}</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Contact & Location */}
          <div>
            <h3 className="text-white font-bold text-base mb-4 tracking-wide">
              {t.footer.contactTitle}
            </h3>
            <div className="space-y-3.5 text-sm text-slate-300/80">
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-[#00BFFF] flex-shrink-0 mt-0.5" />
                <span>{contactInfo.address[language]}</span>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-[#00BFFF] flex-shrink-0" />
                <a
                  href={`tel:${contactInfo.phone}`}
                  className="hover:text-white transition-colors"
                  dir="ltr"
                >
                  {contactInfo.phone}
                </a>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-[#00BFFF] flex-shrink-0" />
                <a
                  href={`mailto:${contactInfo.email}`}
                  className="hover:text-white transition-colors"
                >
                  {contactInfo.email}
                </a>
              </div>
              <div className="flex items-center gap-3 text-xs text-emerald-400 pt-1">
                <Clock className="w-4 h-4 flex-shrink-0" />
                <span>{contactInfo.workingHours[language]}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <p>{t.footer.rights}</p>
          <div className="flex flex-wrap items-center gap-6">
            <Link href={getLocalizedPath('/privacy', language)} className="hover:text-white transition-colors">
              {t.footer.privacy}
            </Link>
            <Link href={getLocalizedPath('/terms', language)} className="hover:text-white transition-colors">
              {t.footer.terms}
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
