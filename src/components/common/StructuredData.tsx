'use client';

import React from 'react';
import { initialSiteConfig } from '@/data/siteConfig';
import type { Locale } from '@/types/cms';

export const MedicalOrganizationSchema: React.FC<{ locale?: Locale }> = ({ locale = 'ar' }) => {
  const descriptions: Record<Locale, string> = {
    ar: 'منصة أفيسينا للرعاية الطبية الدولية تربط المرضى بأرقى المستشفيات التركية المعتمدة (JCI) ونخبة البروفيسورات في إسطنبول مع تنسيق علاجي شامل.',
    fr: 'AVICINNA met en relation les patients internationaux avec les hôpitaux accrédités JCI et les professeurs de renommée mondiale à Istanbul, en Turquie.',
    en: 'Premier international medical coordination platform connecting global patients with JCI-accredited hospitals, senior professors, and advanced surgical care in Istanbul, Turkey.',
  };

  const pageUrl = locale === 'ar' ? 'https://avicinna.com' : `https://avicinna.com/${locale}`;

  const schema = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'MedicalBusiness',
        '@id': 'https://avicinna.com/#organization',
        name: 'AVICINNA',
        alternateName: ['أفيسينا للرعاية الطبية الدولية', 'Avicinna International Healthcare Turkey'],
        url: pageUrl,
        logo: 'https://avicinna.com/logo.png',
        image: 'https://images.unsplash.com/photo-1587351021759-3e566b6af7cc?q=80&w=1200',
        description: descriptions[locale],
        telephone: initialSiteConfig.contact.phone,
        email: initialSiteConfig.contact.email,
        address: {
          '@type': 'PostalAddress',
          streetAddress: 'Levent & Atasehir Medical District',
          addressLocality: 'Istanbul',
          addressRegion: 'Marmara',
          addressCountry: 'TR',
        },
        geo: {
          '@type': 'GeoCoordinates',
          latitude: 41.0082,
          longitude: 28.9784,
        },
        openingHoursSpecification: [
          {
            '@type': 'OpeningHoursSpecification',
            dayOfWeek: [
              'Monday',
              'Tuesday',
              'Wednesday',
              'Thursday',
              'Friday',
              'Saturday',
              'Sunday',
            ],
            opens: '00:00',
            closes: '23:59',
          },
        ],
        priceRange: '$$',
        medicalSpecialty: [
          'Cardiovascular',
          'Neurology',
          'Orthopedics',
          'Oncology',
          'PlasticSurgery',
          'Dentistry',
        ],
      },
      {
        '@type': 'WebSite',
        '@id': 'https://avicinna.com/#website',
        url: 'https://avicinna.com',
        name: 'AVICINNA',
        inLanguage: locale,
        publisher: {
          '@id': 'https://avicinna.com/#organization',
        },
      },
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
};

export const DoctorSchema: React.FC<{
  name: string;
  specialty: string;
  hospital: string;
  image: string;
  url?: string;
}> = ({ name, specialty, hospital, image, url }) => {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Physician',
    name,
    medicalSpecialty: specialty,
    ...(url ? { url } : {}),
    hospitalAffiliation: {
      '@type': 'Hospital',
      name: hospital,
    },
    image,
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
};

export const MedicalProcedureSchema: React.FC<{
  name: string;
  description: string;
  image: string;
  url?: string;
}> = ({ name, description, image, url }) => {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'MedicalProcedure',
    name,
    description,
    image,
    ...(url ? { url } : {}),
    procedureType: 'https://schema.org/SurgicalProcedure',
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
};

export const FAQSchema: React.FC<{
  faqs: { question: string; answer: string }[];
}> = ({ faqs }) => {
  if (!faqs || faqs.length === 0) return null;
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((f) => ({
      '@type': 'Question',
      name: f.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: f.answer,
      },
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
};
