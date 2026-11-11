import React from 'react';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { readCmsStore } from '@/lib/cmsStore';
import {
  buildLanguageAlternates,
  getLocalizedEntityPath,
  getLocalizedPath,
  getPublicBaseUrl,
  isValidLocale,
} from '@/lib/i18nRoutes';
import { DoctorsDirectoryClient } from '@/components/doctors/DoctorsDirectoryClient';
import { Sparkles } from 'lucide-react';
import type { Locale } from '@/types/cms';

export const dynamic = 'force-dynamic';

const metaByLang: Record<Locale, { title: string; description: string; badge: string; h1: string; sub: string; crumb: string }> = {
  ar: {
    title: 'أفضل أطباء وجراحين في تركيا | نخبة استشاريي إسطنبول - AVICINNA',
    description:
      'تعرف على نخبة الأطباء والبروفيسورات الاستشاريين في أفضل مستشفيات إسطنبول المعتمدة دولياً JCI عبر جميع التخصصات الجراحية.',
    badge: 'الكادر الطبي الاستشاري',
    h1: 'نخبة أطباء وجراحي تركيا المعتمدين',
    sub: 'تعرف على الأطباء والبروفيسورات الأكثر خبرة في إسطنبول، الحاصلين على أعلى الاعتمادات الطبية الأوروبية والأمريكية.',
    crumb: 'الأطباء والجراحون',
  },
  fr: {
    title: 'Meilleurs Médecins & Professeurs Chirurgiens en Turquie | AVICINNA',
    description:
      'Découvrez nos chirurgiens et professeurs experts exerçant dans les hôpitaux accrédités JCI à Istanbul dans chaque spécialité médicale.',
    badge: 'Corps Médical & Professeurs',
    h1: 'Nos Chirurgiens & Spécialistes Agréés en Turquie',
    sub: 'Consultez les profils de nos chirurgiens et professeurs les plus expérimentés à Istanbul.',
    crumb: 'Médecins & Chirurgiens',
  },
  en: {
    title: 'Top Physicians & Board-Certified Surgeons in Turkey | AVICINNA',
    description:
      'Explore Turkey’s leading medical faculty and board-certified surgeons across JCI-accredited hospitals in Istanbul.',
    badge: 'Consulting Medical Faculty',
    h1: 'Turkey’s Premier Certified Surgeons & Professors',
    sub: 'Meet Istanbul’s leading specialist professors holding US and European clinical fellowships.',
    crumb: 'Doctors & Surgeons',
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
    alternates: buildLanguageAlternates({ barePath: '/doctors', currentLang: lang }),
  };
}

export default async function DoctorsPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  if (!isValidLocale(lang)) notFound();

  const store = readCmsStore();
  const baseUrl = getPublicBaseUrl();
  const m = metaByLang[lang];
  const pageUrl = `${baseUrl}${getLocalizedPath('/doctors', lang)}`;

  // Notice: ZERO AggregateRating / Review schema anywhere
  const doctorsSchema = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'MedicalWebPage',
        '@id': `${pageUrl}#webpage`,
        url: pageUrl,
        name: m.title,
        description: m.description,
        inLanguage: lang,
        publisher: {
          '@id': 'https://avicinna.com/#organization',
        },
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          {
            '@type': 'ListItem',
            position: 1,
            name: lang === 'ar' ? 'الرئيسية' : lang === 'fr' ? 'Accueil' : 'Home',
            item: `${baseUrl}${getLocalizedPath('/', lang)}`,
          },
          {
            '@type': 'ListItem',
            position: 2,
            name: m.crumb,
            item: pageUrl,
          },
        ],
      },
      {
        '@type': 'ItemList',
        itemListElement: store.doctors.map((doc, idx) => ({
          '@type': 'ListItem',
          position: idx + 1,
          item: {
            '@type': 'Physician',
            name: doc.name[lang] || doc.name.ar,
            url: `${baseUrl}${getLocalizedEntityPath('doctors', doc, lang)}`,
            image: doc.image,
            jobTitle: doc.title[lang] || doc.title.ar,
            medicalSpecialty: doc.specialtyName[lang] || doc.specialtyName.ar,
            hospitalAffiliation: {
              '@type': 'Hospital',
              name: doc.hospital[lang] || doc.hospital.ar,
            },
          },
        })),
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(doctorsSchema) }}
      />
      <div className="pt-24 pb-16 bg-slate-50 dark:bg-[#080E1A] min-h-screen transition-colors">
        <div className="bg-gradient-to-b from-[#021838] to-[#032654] text-white py-16 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
          <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#38bdf8_1px,transparent_1px)] [background-size:16px_16px]" />
          <div className="max-w-7xl mx-auto relative z-10 text-center max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-500/20 text-sky-300 text-xs font-semibold mb-4 border border-sky-500/30">
              <Sparkles className="w-3.5 h-3.5" />
              <span>{m.badge}</span>
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight leading-tight">
              {m.h1}
            </h1>
            <p className="mt-4 text-base sm:text-lg text-slate-300 leading-relaxed">{m.sub}</p>
          </div>
        </div>

        <DoctorsDirectoryClient
          initialDoctors={store.doctors}
          initialTreatments={store.treatments}
        />
      </div>
    </>
  );
}

