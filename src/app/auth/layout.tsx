import React from 'react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'AVICINNA Secure Portal | تسجيل الدخول الآمن',
  robots: {
    index: false,
    follow: false,
    nocache: true,
    googleBot: {
      index: false,
      follow: false,
      noimageindex: true,
    },
  },
};

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

