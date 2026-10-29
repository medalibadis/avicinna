'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useLanguage } from '@/context/LanguageContext';
import { useTheme } from '@/context/ThemeContext';
import { Logo } from '@/components/common/Logo';
import { AnimatedNavbarLogo } from '@/components/public/BrandLogoMotion';
import { LanguageSwitcher } from './LanguageSwitcher';
import { Phone, Menu, X, Calendar, ChevronDown, Sun, Moon } from 'lucide-react';
import { useData } from '@/context/DataContext';
import { CelestialThemeSwitch } from '@/components/ui/CelestialThemeSwitch';

export const Header: React.FC = () => {
  const { t, language } = useLanguage();
  const { theme, toggleTheme } = useTheme();
  const { treatments: treatmentsData } = useData();
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [servicesDropdownOpen, setServicesDropdownOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
    setServicesDropdownOpen(false);
  }, [pathname]);

  const navLinks = [
    { href: '/', label: t.nav.home },
    { href: '/treatments', label: t.nav.services, hasDropdown: true },
    { href: '/hospitals', label: t.nav.hospitals },
    { href: '/doctors', label: t.nav.doctors },
    { href: '/patient-stories', label: t.nav.patientStories },
    { href: '/blog', label: t.nav.blog },
    { href: '/about', label: t.nav.about },
    { href: '/contact', label: t.nav.contact },
  ];

  const isDarkHeroPage = pathname === '/';
  const isDarkLogo = (!isScrolled && isDarkHeroPage) || theme === 'dark';

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled
            ? 'bg-white/95 dark:bg-slate-900/95 backdrop-blur-md shadow-sm border-b border-slate-100 dark:border-slate-800 py-3'
            : isDarkHeroPage
            ? 'bg-transparent py-4'
            : 'bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-slate-100 dark:border-slate-800 py-3.5'
        }`}
      >
        <div className="max-w-[1600px] mx-auto px-2.5 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between gap-1 sm:gap-4">
            {/* Logo */}
            <div className="shrink-0">
              <AnimatedNavbarLogo locale={language as any} />
            </div>

            {/* Desktop Navigation (Visible at xl+ / 1280px+) */}
            <nav
              className={`hidden xl:flex items-center gap-1 2xl:gap-1.5 p-1 rounded-full border backdrop-blur-md transition-colors ${
                !isScrolled && isDarkHeroPage
                  ? 'bg-white/10 dark:bg-white/5 border-white/15 dark:border-white/10'
                  : 'bg-slate-100/80 dark:bg-slate-800/80 border-slate-200/80 dark:border-slate-700/80'
              }`}
            >
              {navLinks.map((link) => {
                const isActive =
                  link.href === '/'
                    ? pathname === '/'
                    : pathname.startsWith(link.href);

                if (link.hasDropdown) {
                  return (
                    <div
                      key={link.href}
                      className="relative"
                      onMouseEnter={() => setServicesDropdownOpen(true)}
                      onMouseLeave={() => setServicesDropdownOpen(false)}
                    >
                      <Link
                        href={link.href}
                        className={`inline-flex items-center gap-1 px-3 2xl:px-4 py-1.5 2xl:py-2 rounded-full text-xs xl:text-[13px] 2xl:text-sm font-semibold whitespace-nowrap transition-all duration-200 select-none ${
                          isActive
                            ? 'bg-[#0097FB] text-white shadow-sm shadow-[#0097FB]/30 font-bold'
                            : !isScrolled && isDarkHeroPage
                            ? 'text-white/85 hover:text-white hover:bg-white/10'
                            : 'text-[#163B63] dark:text-slate-200 hover:text-[#0097FB] dark:hover:text-sky-400 hover:bg-[#EAF6FF] dark:hover:bg-slate-800'
                        }`}
                      >
                        <span>{link.label}</span>
                        <ChevronDown className="w-3.5 h-3.5 opacity-70" />
                      </Link>

                      {/* Dropdown Menu */}
                      {servicesDropdownOpen && (
                        <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-72 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl rounded-2xl shadow-xl border border-slate-100 dark:border-slate-800 p-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                          <div className="text-[11px] font-semibold uppercase tracking-wider text-[#64748B] dark:text-slate-400 px-3 py-1.5 border-b border-slate-100 dark:border-slate-800">
                            {t.specialties.badge}
                          </div>
                          <div className="py-1 max-h-72 overflow-y-auto">
                            {treatmentsData.map((item) => (
                              <Link
                                key={item.slug}
                                href={`/treatments/${item.slug}`}
                                className="block px-3 py-2 rounded-xl text-xs xl:text-sm font-medium text-[#163B63] dark:text-slate-200 hover:bg-[#EAF6FF] dark:hover:bg-slate-800 hover:text-[#0097FB] dark:hover:text-sky-400 transition-colors"
                              >
                                {item.title[language]}
                              </Link>
                            ))}
                          </div>
                          <div className="border-t border-slate-100 dark:border-slate-800 p-1.5 mt-1">
                            <Link
                              href="/treatments"
                              className="block text-center text-xs font-semibold text-[#0097FB] dark:text-sky-400 hover:text-[#032654] dark:hover:text-sky-300 py-1"
                            >
                              {t.specialties.cta} →
                            </Link>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                }

                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`inline-flex items-center px-3 2xl:px-4 py-1.5 2xl:py-2 rounded-full text-xs xl:text-[13px] 2xl:text-sm font-semibold whitespace-nowrap transition-all duration-200 select-none ${
                      isActive
                        ? 'bg-[#0097FB] text-white shadow-sm shadow-[#0097FB]/30 font-bold'
                        : !isScrolled && isDarkHeroPage
                        ? 'text-white/85 hover:text-white hover:bg-white/10'
                        : 'text-[#163B63] dark:text-slate-200 hover:text-[#0097FB] dark:hover:text-sky-400 hover:bg-[#EAF6FF] dark:hover:bg-slate-800'
                    }`}
                  >
                    {link.label}
                  </Link>
                );
              })}
            </nav>

            {/* Language Switcher & Primary CTA (xl+) */}
            <div className="hidden xl:flex items-center gap-2.5 2xl:gap-3 flex-shrink-0">
              <LanguageSwitcher isScrolled={isScrolled || !isDarkHeroPage} id="header-desktop" />

              {/* Celestial Liquid Theme Switcher */}
              <CelestialThemeSwitch theme={theme} onToggle={toggleTheme} />

              <a
                href={pathname === '/' ? '#consultation' : '/#consultation'}
                onClick={(e) => {
                  if (pathname === '/') {
                    e.preventDefault();
                    const el = document.getElementById('consultation');
                    if (el) {
                      el.scrollIntoView({ behavior: 'smooth' });
                    }
                  }
                }}
                className="inline-flex items-center gap-2 bg-[#0097FB] hover:bg-[#0082d6] text-white text-xs 2xl:text-sm font-bold px-4 2xl:px-5 py-2 2xl:py-2.5 rounded-full shadow-md shadow-[#0097FB]/25 hover:shadow-[#0097FB]/35 transition-all duration-200 transform hover:-translate-y-0.5 active:translate-y-0 cursor-pointer whitespace-nowrap"
              >
                <Calendar className="w-3.5 h-3.5 2xl:w-4 2xl:h-4 flex-shrink-0" />
                <span>{t.nav.freeConsultation}</span>
              </a>
            </div>

            {/* Mobile & Tablet Controls (< xl) */}
            <div className="flex items-center gap-1 sm:gap-2 xl:hidden flex-shrink-0">
              <LanguageSwitcher isScrolled={isScrolled || !isDarkHeroPage} id="header-mobile" />

              <CelestialThemeSwitch theme={theme} onToggle={toggleTheme} />

              <a
                href={pathname === '/' ? '#consultation' : '/#consultation'}
                onClick={(e) => {
                  if (pathname === '/') {
                    e.preventDefault();
                    const el = document.getElementById('consultation');
                    if (el) {
                      el.scrollIntoView({ behavior: 'smooth' });
                    }
                  }
                }}
                className="hidden md:inline-flex items-center gap-1.5 bg-[#0097FB] hover:bg-[#0082d6] text-white text-xs font-semibold px-3 py-1.5 rounded-full shadow-sm"
              >
                <Calendar className="w-3.5 h-3.5 flex-shrink-0" />
                <span>{language === 'fr' ? 'Consultation' : language === 'ar' ? 'استشارة' : 'Consult'}</span>
              </a>

              <button
                type="button"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className={`p-1.5 sm:p-2 rounded-xl transition-colors cursor-pointer ${
                  !isScrolled && isDarkHeroPage
                    ? 'text-white hover:bg-white/10'
                    : 'text-[#163B63] dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
                aria-label="Toggle menu"
              >
                {mobileMenuOpen ? <X className="w-5 h-5 sm:w-6 sm:h-6" /> : <Menu className="w-5 h-5 sm:w-6 sm:h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="xl:hidden bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 shadow-xl px-4 pt-3 pb-6 space-y-2 animate-in slide-in-from-top-4 duration-200">
            <div className="space-y-1">
              {navLinks.map((link) => {
                const isActive =
                  link.href === '/'
                    ? pathname === '/'
                    : pathname.startsWith(link.href);

                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`block px-4 py-2.5 rounded-xl text-base font-medium transition-colors ${
                      isActive
                        ? 'bg-[#EAF6FF] dark:bg-sky-950/60 text-[#0097FB] dark:text-sky-400 font-bold'
                        : 'text-[#163B63] dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800'
                    }`}
                  >
                    {link.label}
                  </Link>
                );
              })}
            </div>

            <div className="pt-3 border-t border-slate-100">
              <a
                href={pathname === '/' ? '#consultation' : '/#consultation'}
                onClick={(e) => {
                  setMobileMenuOpen(false);
                  if (pathname === '/') {
                    e.preventDefault();
                    const el = document.getElementById('consultation');
                    if (el) {
                      el.scrollIntoView({ behavior: 'smooth' });
                    }
                  }
                }}
                className="w-full flex items-center justify-center gap-2 bg-[#0097FB] hover:bg-[#0082d6] text-white font-semibold py-3 rounded-xl shadow-md shadow-[#0097FB]/20 transition-colors"
              >
                <Calendar className="w-5 h-5 flex-shrink-0" />
                <span>{t.nav.freeConsultation}</span>
              </a>
            </div>
          </div>
        )}
      </header>
    </>
  );
};
