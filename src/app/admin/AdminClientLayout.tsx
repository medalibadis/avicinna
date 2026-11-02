'use client';

import React, { useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useData } from '@/context/DataContext';
import { useLanguage } from '@/context/LanguageContext';
import { AdminShell, Locale } from '@/components/admin/AdminShell';
import { CommandMenu } from '@/components/admin/CommandMenu';
import { Toaster } from 'sonner';
import { ConfirmDialogProvider, useConfirmDialog } from '@/context/ConfirmDialogContext';

function AdminClientLayoutInner({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { language, setLanguage } = useLanguage();
  const { inquiries, clearLocalCache } = useData();
  const [commandOpen, setCommandOpen] = useState(false);
  const { confirm } = useConfirmDialog();

  const pendingInquiriesCount = inquiries.filter(
    (inq) => inq.status === 'new' || inq.status === 'in_review'
  ).length;

  const handleLogout = async () => {
    const isRtl = language === 'ar';
    const ok = await confirm({
      title: isRtl ? 'تسجيل الخروج من لوحة التحكم' : language === 'fr' ? 'Déconnexion' : 'Sign Out of Central Administration',
      message: isRtl
        ? 'هل أنت متأكد من رغبتك في تسجيل الخروج؟ ستحتاج لإدخال بيانات الاعتماد الثلاثية (3FA) مرة أخرى.'
        : language === 'fr'
        ? 'Êtes-vous sûr de vouloir vous déconnecter ?'
        : 'Are you sure you want to sign out? You will need your hardened 3FA credentials to log back in.',
      confirmText: isRtl ? 'تسجيل الخروج' : language === 'fr' ? 'Se déconnecter' : 'Sign Out',
      cancelText: isRtl ? 'إلغاء' : language === 'fr' ? 'Annuler' : 'Cancel',
      variant: 'warning',
      icon: 'logout',
    });

    if (ok) {
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

export default function AdminClientLayout({ children }: { children: React.ReactNode }) {
  return (
    <ConfirmDialogProvider>
      <AdminClientLayoutInner>{children}</AdminClientLayoutInner>
    </ConfirmDialogProvider>
  );
}

