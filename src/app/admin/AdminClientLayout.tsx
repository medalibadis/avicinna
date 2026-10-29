'use client';

import React, { useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useData } from '@/context/DataContext';
import { useLanguage } from '@/context/LanguageContext';
import { AdminShell, Locale } from '@/components/admin/AdminShell';
import { CommandMenu } from '@/components/admin/CommandMenu';
import { Toaster } from 'sonner';

export default function AdminClientLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { language, setLanguage } = useLanguage();
  const { inquiries, clearLocalCache } = useData();
  const [commandOpen, setCommandOpen] = useState(false);

  const pendingInquiriesCount = inquiries.filter(
    (inq) => inq.status === 'new' || inq.status === 'in_review'
  ).length;

  const handleLogout = async () => {
    const confirmMsg = {
      en: 'Are you sure you want to sign out?',
      fr: 'Êtes-vous sûr de vouloir vous déconnecter ?',
      ar: 'هل تريد تسجيل الخروج من لوحة الإدارة؟',
    }[language as Locale] || 'Are you sure you want to sign out?';

    if (window.confirm(confirmMsg)) {
      try {
        await fetch('/api/auth/logout', { method: 'POST' });
        router.push('/auth/login');
        router.refresh();
      } catch (err) {
        console.error('Logout error:', err);
        window.location.href = '/auth/login';
      }
    }
  };

  return (
    <>
      <AdminShell
        activeRoute={pathname}
        onNavigate={(path) => router.push(path)}
        locale={language as Locale}
        onChangeLocale={(newLoc) => setLanguage(newLoc)}
        onOpenCommandMenu={() => setCommandOpen(true)}
        onClearCache={clearLocalCache}
        onLogout={handleLogout}
        pendingInquiriesCount={pendingInquiriesCount}
      >
        {children}
      </AdminShell>

      {/* Glassmorphic Command Menu (Cmd+K) */}
      <CommandMenu open={commandOpen} onOpenChange={setCommandOpen} />

      {/* Sonner Toast Container for 5s Interactive Undo Toasts */}
      <Toaster
        position={language === 'ar' ? 'bottom-left' : 'bottom-right'}
        richColors
        closeButton
      />
    </>
  );
}
