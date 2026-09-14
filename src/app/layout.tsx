import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://avicinna.netlify.app';

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: 'AVICINNA | أفيسينا - منصة الرعاية الطبية الدولية في تركيا',
    template: '%s | AVICINNA Healthcare Turkey',
  },
  description:
    'منصة أفيسينا الطبية الدولية تربطكم بأفضل الأطباء والمستشفيات المعتمدة دولياً (JCI) في تركيا. استشارة مجانية، مرافقة كاملة ورحلة علاجية متميزة في إسطنبول.',
  keywords: [
    'علاج في تركيا',
    'مستشفيات إسطنبول',
    'سياحة علاجية تركيا',
    'زراعة شعر في تركيا',
    'جراحة قلب تركيا',
    'جراحة عظام إسطنبول',
    'أفيسينا',
    'AVICINNA',
    'medical tourism Turkey',
    'Istanbul hospitals JCI',
    'best doctors Turkey',
    'traitement médical Turquie',
  ],
  authors: [{ name: 'AVICINNA International Healthcare Board' }],
  creator: 'AVICINNA',
  publisher: 'AVICINNA Medical Group',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  alternates: {
    canonical: '/',
    languages: {
      'ar-SA': '/?lang=ar',
      'en-US': '/?lang=en',
      'fr-FR': '/?lang=fr',
    },
  },
  openGraph: {
    title: 'AVICINNA | Premier Medical Care & Surgery in Turkey',
    description:
      'Connecting international patients with leading JCI-accredited hospitals and specialist professors in Istanbul, Turkey. Free 24h medical assessment.',
    url: siteUrl,
    siteName: 'AVICINNA Healthcare Turkey',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1587351021759-3e566b6af7cc?q=80&w=1200&auto=format&fit=crop',
        width: 1200,
        height: 630,
        alt: 'AVICINNA Premier Healthcare Turkey',
      },
    ],
    locale: 'ar_SA',
    alternateLocale: ['en_US', 'fr_FR'],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AVICINNA | Premier Medical Tourism in Istanbul, Turkey',
    description:
      'Direct access to top JCI-accredited hospitals and distinguished surgical professors in Turkey. Free 24h treatment assessment.',
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
};

import { AppShell } from "@/components/layout/AppShell";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ar" dir="rtl" className={`${inter.variable} h-full antialiased`}>
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
      <body className="min-h-full flex flex-col bg-white text-slate-900">
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}
