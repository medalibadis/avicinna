'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import { LanguageProvider } from '@/context/LanguageContext';
import { LocaleAlternatesProvider } from '@/context/LocaleAlternatesContext';
import { DataProvider } from '@/context/DataContext';
import { ThemeProvider } from '@/context/ThemeContext';
import { AccentProvider } from '@/context/AccentContext';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { FloatingWhatsApp } from '@/components/layout/FloatingWhatsApp';
import { TrackingScripts } from '@/components/analytics/TrackingScripts';
import type { SiteSectionsData } from '@/data/defaultSections';
import type { Locale } from '@/types/cms';

export function AppShell({
  children,
  initialLanguage = 'ar',
  initialTracking,
  initialSections,
}: {
  children: React.ReactNode;
  initialLanguage?: Locale;
  initialTracking?: {
    enableTracking: boolean;
    ga4MeasurementId: string;
    metaPixelId: string;
  };
  initialSections?: SiteSectionsData;
}) {
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith('/admin');
  const isAuth = pathname?.startsWith('/auth');
  const hidePublicShell = isAdmin || isAuth;

  return (
    <ThemeProvider>
      <AccentProvider>
        <DataProvider initialSections={initialSections}>
          <LanguageProvider initialLanguage={initialLanguage}>
            <LocaleAlternatesProvider>
              {!hidePublicShell && <TrackingScripts initialTracking={initialTracking} />}
              {!hidePublicShell && <Header />}
              <div className="flex-1 flex flex-col">{children}</div>
              {!hidePublicShell && <Footer />}
              {!hidePublicShell && <FloatingWhatsApp />}
            </LocaleAlternatesProvider>
          </LanguageProvider>
        </DataProvider>
      </AccentProvider>
    </ThemeProvider>
  );
}
