import React from 'react';
import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { getAuthenticatedSessionFromCookies } from '@/lib/serverAuth';
import AdminClientLayout from './AdminClientLayout';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'AVICINNA Command Console',
  robots: {
    index: false,
    follow: false,
    nocache: true,
  },
};

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await getAuthenticatedSessionFromCookies();

  if (!session) {
    redirect('/auth/login?from=/admin');
  }

  return <AdminClientLayout session={session}>{children}</AdminClientLayout>;
}
