import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'تجارب وقصص نجاح المرضى في تركيا | أفيسينا',
  description:
    'اقرأ تجارب حقيقية لمرضى دوليين عولجوا بنجاح في أرقى مستشفيات تركيا المعتمدة دولياً عبر منصة أفيسينا في جراحة القلب، زراعة الشعر، والعظام.',
  openGraph: {
    title: 'تجارب وقصص نجاح المرضى في تركيا | أفيسينا',
    description:
      'تجارب حقيقية لمرضى من حول العالم عولجوا بنجاح في مستشفيات تركيا المعتمدة دولياً.',
    url: 'https://avicinna.com/patient-stories',
    siteName: 'AVICINNA',
    type: 'website',
  },
  alternates: {
    canonical: 'https://avicinna.com/patient-stories',
  },
};

export default function PatientStoriesLayout({ children }: { children: React.ReactNode }) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'الرئيسية',
        item: 'https://avicinna.com',
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'تجارب المرضى',
        item: 'https://avicinna.com/patient-stories',
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
      {children}
    </>
  );
}
