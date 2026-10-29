'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import { LanguageProvider } from '@/context/LanguageContext';
import { DataProvider } from '@/context/DataContext';
import { ThemeProvider } from '@/context/ThemeContext';
import { AccentProvider } from '@/context/AccentContext';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { FloatingWhatsApp } from '@/components/layout/FloatingWhatsApp';

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith('/admin');
  const isAuth = pathname?.startsWith('/auth');
  const hidePublicShell = isAdmin || isAuth;

  return (
    <ThemeProvider>
      <AccentProvider>
        <DataProvider>
          <LanguageProvider>
            {!hidePublicShell && <Header />}
            <div className="flex-1 flex flex-col">{children}</div>
            {!hidePublicShell && <Footer />}
            {!hidePublicShell && <FloatingWhatsApp />}
          </LanguageProvider>
        </DataProvider>
      </AccentProvider>
    </ThemeProvider>
  );
}
