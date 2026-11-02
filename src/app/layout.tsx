import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL && !process.env.NEXT_PUBLIC_SITE_URL.includes('localhost'))
  ? process.env.NEXT_PUBLIC_SITE_URL
  : 'https://avicinna.com';

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: 'AVICINNA | أفيسينا للرعاية الطبية والسياحة العلاجية في تركيا - Medical Tourism Turkey',
    template: '%s',
  },
  description:
    'AVICINNA Premier Medical Tourism Turkey: منصة أفيسينا الطبية الدولية تربطكم بأفضل الأطباء والمستشفيات المعتمدة دولياً (JCI) في إسطنبول تركيا. استشارة مجانية وخطة علاج متكاملة.',
  creator: 'AVICINNA',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  alternates: {
    canonical: 'https://avicinna.com',
  },
  openGraph: {
    title: 'AVICINNA | أفيسينا للرعاية الطبية والسياحة العلاجية في تركيا - Medical Tourism Turkey',
    description:
      'AVICINNA Premier Healthcare Turkey: ربط المرضى الدوليين بأرقى مستشفيات تركيا المعتمدة JCI ونخبة البروفيسورات في إسطنبول. استشارة مجانية وخطة علاجية متكاملة.',
    url: 'https://avicinna.com',
    siteName: 'AVICINNA',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1587351021759-3e566b6af7cc?q=80&w=1200&auto=format&fit=crop',
        width: 1200,
        height: 630,
        alt: 'AVICINNA Premier Healthcare Turkey',
      },
    ],
    locale: 'ar_SA',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AVICINNA | أفيسينا للرعاية الطبية والسياحة العلاجية في تركيا - Medical Tourism Turkey',
    description:
      'AVICINNA Healthcare Turkey: استشارة طبية مجانية خلال 24 ساعة للعمليات الجراحية في أفضل مستشفيات إسطنبول المعتمدة دولياً.',
    images: ['https://images.unsplash.com/photo-1587351021759-3e566b6af7cc?q=80&w=1200&auto=format&fit=crop'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'cmFnJanscmk0ia48oNs2uu0f5E1W7WmZxORJBPENKmI',
  },
  icons: {
    icon: '/favicon.ico',
    apple: '/apple-touch-icon.png',
  },
};

import { AppShell } from "@/components/layout/AppShell";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ar" dir="rtl" className={`${inter.variable} h-full antialiased overflow-x-hidden w-full max-w-full`}>
      <head>
        {/* Google Fonts: Cairo for Arabic */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Cairo:wght@300;400;500;600;700;800;900&display=swap"
          rel="stylesheet"
        />
        <style
          dangerouslySetInnerHTML={{
            __html: `
              [dir="rtl"] body, [dir="rtl"] input, [dir="rtl"] textarea, [dir="rtl"] select, [dir="rtl"] button {
                font-family: 'Cairo', var(--font-inter), system-ui, sans-serif;
              }
              [dir="ltr"] body, [dir="ltr"] input, [dir="ltr"] textarea, [dir="ltr"] select, [dir="ltr"] button {
                font-family: var(--font-inter), system-ui, sans-serif;
              }
            `,
          }}
        />
      </head>
      <body className="min-h-full flex flex-col bg-white text-slate-900 dark:bg-[#0B1120] dark:text-slate-100 overflow-x-hidden w-full max-w-full relative">
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}
