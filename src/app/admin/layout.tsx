import React from 'react';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { verifyAdminSessionServer } from '@/lib/auth';
import AdminClientLayout from './AdminClientLayout';

export const dynamic = 'force-dynamic';

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const cookieStore = await cookies();
  const sessionCookie =
    cookieStore.get('avicinna_admin_session')?.value ||
    cookieStore.get('avicinna_session')?.value;

  const isValid = await verifyAdminSessionServer(sessionCookie);

  if (!isValid) {
    redirect('/auth/login?from=/admin');
  }

  return <AdminClientLayout>{children}</AdminClientLayout>;
}
