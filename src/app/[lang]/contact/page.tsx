import React from 'react';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { ContactView } from '@/components/pages/ContactView';
import { buildLanguageAlternates, isValidLocale } from '@/lib/i18nRoutes';
import type { Locale } from '@/types/cms';

const metaByLang: Record<Locale, { title: string; description: string }> = {
  ar: {
    title: 'تواصل معنا | احصل على استشارة طبية مجانية في تركيا - AVICINNA',
    description:
      'تواصل مع فريق التنسيق الطبي لمنصة أفيسينا، أرسل تقاريرك الطبية واحصل على تقييم مجاني وعرض سعر من أفضل مستشفيات إسطنبول خلال 24 ساعة.',
  },
  fr: {
    title: 'Contact & Avis Médical Gratuit | AVICINNA Istanbul',
    description:
      'Contactez notre coordination médicale francophone et envoyez vos examens médicaux pour recevoir un devis personnalisé sous 24 heures.',
  },
  en: {
    title: 'Contact Us | Free Medical Assessment in Istanbul - AVICINNA',
    description:
      'Connect with the AVICINNA medical coordination desk 24/7, upload medical scans, and receive an all-inclusive quote within 24 hours.',
  },
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  if (!isValidLocale(lang)) return { robots: { index: false, follow: false } };
  const m = metaByLang[lang];
  return {
    title: m.title,
    description: m.description,
    alternates: buildLanguageAlternates({ barePath: '/contact', currentLang: lang }),
  };
}

export default async function ContactPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  if (!isValidLocale(lang)) notFound();
  return <ContactView />;
}

