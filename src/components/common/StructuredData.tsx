'use client';

import React from 'react';
import { initialSiteConfig } from '@/data/siteConfig';

export const MedicalOrganizationSchema: React.FC = () => {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'MedicalBusiness',
    '@id': 'https://avicinna.com/#organization',
    name: 'AVICINNA',
    alternateName: ['أفيسينا للرعاية الطبية الدولية', 'Avicinna International Healthcare Turkey'],
    url: 'https://avicinna.com',
    logo: 'https://avicinna.com/logo.png',
    image: 'https://images.unsplash.com/photo-1587351021759-3e566b6af7cc?q=80&w=1200',
    description:
      'Premier international medical assistance and medical tourism platform connecting global patients with top accredited hospitals, professors, and advanced surgical care in Istanbul, Turkey.',
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
  rating: number;
  reviewCount: number;
}> = ({ name, specialty, hospital, image, rating, reviewCount }) => {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Physician',
    name,
    medicalSpecialty: specialty,
    hospitalAffiliation: hospital,
    image,
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: rating,
      reviewCount: reviewCount,
    },
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
}> = ({ name, description, image }) => {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'MedicalProcedure',
    name,
    description,
    image,
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
