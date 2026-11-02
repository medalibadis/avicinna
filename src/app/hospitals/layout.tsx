import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'أفضل مستشفيات تركيا المعتمدة دولياً JCI | أفيسينا',
  description:
    'دليل أفضل 11 مستشفى معتمد دولياً JCI في إسطنبول وأنقرة: أجيبادم، ميموريال، المستشفى الأمريكي، ومستشفى جامعة كوتش. استشارة مجانية مع كبار الجراحين.',
  alternates: {
    canonical: 'https://avicinna.com/hospitals',
  },
  openGraph: {
    title: 'أفضل مستشفيات تركيا المعتمدة دولياً JCI | أفيسينا',
    description:
      'دليل أفضل 11 مستشفى معتمد دولياً JCI في إسطنبول وأنقرة. استشارة مجانية مع كبار الجراحين.',
    url: 'https://avicinna.com/hospitals',
    siteName: 'AVICINNA',
    images: [
      {
        url: '/images/hospitals/acibadem-altunizade.jpg',
        width: 1200,
        height: 630,
        alt: 'مستشفيات إسطنبول المعتمدة دوليا JCI',
      },
    ],
    locale: 'ar_SA',
    type: 'website',
  },
};

export default function HospitalsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const hospitalsSchema = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'MedicalWebPage',
        '@id': 'https://avicinna.com/hospitals#webpage',
        url: 'https://avicinna.com/hospitals',
        name: 'أفضل مستشفيات تركيا المعتمدة دولياً JCI | أفيسينا',
        description: 'دليل أفضل 11 مستشفى معتمد دولياً JCI في إسطنبول وأنقرة.',
        inLanguage: 'ar',
        publisher: {
          '@type': 'MedicalOrganization',
          '@id': 'https://avicinna.com/#organization',
          name: 'AVICINNA Healthcare Turkey',
          url: 'https://avicinna.com',
        },
      },
      {
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
            name: 'المستشفيات الشريكة',
            item: 'https://avicinna.com/hospitals',
          },
        ],
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(hospitalsSchema) }}
      />
      {children}
    </>
  );
}
