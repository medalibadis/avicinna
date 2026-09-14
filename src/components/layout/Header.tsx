'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useLanguage } from '@/context/LanguageContext';
import { Logo } from '@/components/common/Logo';
import { LanguageSwitcher } from './LanguageSwitcher';
import { Phone, Menu, X, Calendar, ChevronDown } from 'lucide-react';
import { useData } from '@/context/DataContext';

export const Header: React.FC = () => {
  const { t, language } = useLanguage();
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
    { href: '/doctors', label: t.nav.doctors },
    { href: '/patient-stories', label: t.nav.patientStories },
    { href: '/blog', label: t.nav.blog },
    { href: '/treatments', label: t.nav.services, hasDropdown: true },
    { href: '/about', label: t.nav.about },
    { href: '/contact', label: t.nav.contact },
  ];

  const isDarkHeroPage = pathname === '/';

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled
            ? 'bg-white/95 backdrop-blur-md shadow-sm border-b border-slate-100 py-3'
            : isDarkHeroPage
            ? 'bg-transparent py-4'
            : 'bg-white/90 backdrop-blur-md border-b border-slate-100 py-3.5'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <div className="flex-shrink-0">
              <Logo variant={!isScrolled && isDarkHeroPage ? 'dark' : 'header'} size="md" />
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-1 bg-black/5 dark:bg-white/5 p-1 rounded-full border border-slate-200/50 backdrop-blur-sm">
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
                        className={`inline-flex items-center gap-1 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                          isActive
                            ? 'bg-[#0097FB] text-white shadow-sm shadow-[#0097FB]/25 font-semibold'
                            : !isScrolled && isDarkHeroPage
                            ? 'text-white/90 hover:text-white hover:bg-white/10'
                            : 'text-[#163B63] hover:text-[#0097FB] hover:bg-[#EAF6FF]'
                        }`}
                      >
                        {link.label}
                        <ChevronDown className="w-3.5 h-3.5 opacity-70" />
                      </Link>

                      {/* Dropdown Menu */}
                      {servicesDropdownOpen && (
                        <div className="absolute top-full left-1/2 -translate-x-1/2 mt-1 w-72 bg-white rounded-2xl shadow-xl border border-slate-100 p-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                          <div className="text-[11px] font-semibold uppercase tracking-wider text-[#64748B] px-3 py-1.5 border-b border-slate-100">
                            {t.specialties.badge}
                          </div>
                          <div className="py-1 max-h-72 overflow-y-auto">
                            {treatmentsData.map((item) => (
                              <Link
                                key={item.slug}
                                href={`/treatments/${item.slug}`}
                                className="block px-3 py-2 rounded-xl text-sm font-medium text-[#163B63] hover:bg-[#EAF6FF] hover:text-[#0097FB] transition-colors"
                              >
                                {item.title[language]}
                              </Link>
                            ))}
                          </div>
                          <div className="border-t border-slate-100 p-1.5 mt-1">
                            <Link
                              href="/treatments"
                              className="block text-center text-xs font-semibold text-[#0097FB] hover:text-[#032654] py-1"
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
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                      isActive
                        ? 'bg-[#0097FB] text-white shadow-sm shadow-[#0097FB]/25 font-semibold'
                        : !isScrolled && isDarkHeroPage
                        ? 'text-white/90 hover:text-white hover:bg-white/10'
                        : 'text-[#163B63] hover:text-[#0097FB] hover:bg-[#EAF6FF]'
                    }`}
                  >
                    {link.label}
                  </Link>
                );
              })}
            </nav>

            {/* Language Switcher & Primary CTA */}
            <div className="hidden lg:flex items-center gap-3">
              <LanguageSwitcher isScrolled={isScrolled || !isDarkHeroPage} />

              <a
                href="#consultation"
                className="inline-flex items-center gap-2 bg-[#0097FB] hover:bg-[#0082d6] text-white text-sm font-semibold px-5 py-2.5 rounded-full shadow-md shadow-[#0097FB]/25 hover:shadow-[#0097FB]/35 transition-all duration-200 transform hover:-translate-y-0.5 active:translate-y-0 cursor-pointer"
              >
                <Calendar className="w-4 h-4" />
                <span>{t.nav.freeConsultation}</span>
              </a>
            </div>

            {/* Mobile Controls */}
            <div className="flex items-center gap-2 lg:hidden">
              <LanguageSwitcher isScrolled={isScrolled || !isDarkHeroPage} />

              <button
                type="button"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className={`p-2 rounded-xl transition-colors ${
                  !isScrolled && isDarkHeroPage
                    ? 'text-white hover:bg-white/10'
                    : 'text-[#163B63] hover:bg-slate-100'
                }`}
                aria-label="Toggle menu"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-white border-b border-slate-200 shadow-xl px-4 pt-3 pb-6 space-y-2 animate-in slide-in-from-top-4 duration-200">
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
                        ? 'bg-[#EAF6FF] text-[#0097FB] font-bold'
                        : 'text-[#163B63] hover:bg-slate-50'
                    }`}
                  >
                    {link.label}
                  </Link>
                );
              })}
            </div>

            <div className="pt-3 border-t border-slate-100">
              <a
                href="#consultation"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full flex items-center justify-center gap-2 bg-[#0097FB] hover:bg-[#0082d6] text-white font-semibold py-3 rounded-xl shadow-md shadow-[#0097FB]/20 transition-colors"
              >
                <Calendar className="w-5 h-5" />
                <span>{t.nav.freeConsultation}</span>
              </a>
            </div>
          </div>
        )}
      </header>
    </>
  );
};
