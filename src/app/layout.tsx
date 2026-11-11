import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { headers } from 'next/headers';
import './globals.css';
import { AppShell } from '@/components/layout/AppShell';
import { getPublicSections, getPublicTrackingConfig } from '@/lib/cmsStore';
import { isValidLocale } from '@/lib/i18nRoutes';
import type { Locale } from '@/types/cms';

const inter = Inter({
  variable: '--font-inter',
  subsets: ['latin'],
  display: 'swap',
});

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL && !process.env.NEXT_PUBLIC_SITE_URL.includes('localhost')
    ? process.env.NEXT_PUBLIC_SITE_URL
    : 'https://avicinna.com';

// IMPORTANT: Do NOT set alternates.canonical on RootLayout so 404 and system pages
// never inherit a false homepage canonical. Each public page emits its own canonical + hreflang.
export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: 'AVICINNA | أفيسينا للرعاية الطبية والسياحة العلاجية في تركيا',
    template: '%s',
  },
  description:
    'منصة أفيسينا الطبية الدولية تربط المرضى بأفضل البروفيسورات والمستشفيات المعتمدة دولياً (JCI) في إسطنبول، تركيا.',
  creator: 'AVICINNA',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  verification: {
    google: 'cmFnJanscmk0ia48oNs2uu0f5E1W7WmZxORJBPENKmI',
  },
  icons: {
    icon: '/favicon.ico',
    apple: '/apple-touch-icon.png',
  },
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const hdrs = await headers();
  const hdrLocale = hdrs.get('x-avicinna-locale');
  const locale: Locale = isValidLocale(hdrLocale) ? hdrLocale : 'ar';
  const dir = locale === 'ar' ? 'rtl' : 'ltr';
  const tracking = getPublicTrackingConfig();
  const initialSections = getPublicSections();

  return (
    <html
      lang={locale}
      dir={dir}
      className={`${inter.variable} h-full antialiased overflow-x-hidden w-full max-w-full`}
    >
      <head>
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
        <AppShell initialLanguage={locale} initialTracking={tracking} initialSections={initialSections}>
          {children}
        </AppShell>
      </body>
    </html>
  );
}
