'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import { LanguageProvider } from '@/context/LanguageContext';
import { DataProvider } from '@/context/DataContext';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { FloatingWhatsApp } from '@/components/layout/FloatingWhatsApp';

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith('/admin');

  if (isAdmin) {
    return <DataProvider>{children}</DataProvider>;
  }

  return (
    <DataProvider>
      <LanguageProvider>
        <Header />
        <div className="flex-1 flex flex-col">{children}</div>
        <Footer />
        <FloatingWhatsApp />
      </LanguageProvider>
    </DataProvider>
  );
}
