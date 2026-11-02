import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'العلاج في تركيا | التخصصات والعمليات الجراحية',
  description:
    'اكتشف أفضل العمليات الجراحية في تركيا: جراحة القلب، زراعة الشعر، تجميل الأسنان، جراحة العظام، وعلاج الأورام في مستشفيات إسطنبول المعتمدة دولياً JCI.',
  openGraph: {
    title: 'العلاج في تركيا | التخصصات والعمليات الجراحية',
    description:
      'دليلك الشامل للعلاجات والعمليات الجراحية في أفضل مستشفيات تركيا المعتمدة دولياً. استشارة مجانية وعرض سعر خلال 24 ساعة.',
    url: 'https://avicinna.com/treatments',
    siteName: 'AVICINNA',
    type: 'website',
  },
  alternates: {
    canonical: 'https://avicinna.com/treatments',
  },
};

export default function TreatmentsLayout({ children }: { children: React.ReactNode }) {
  const treatmentsSchema = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'MedicalWebPage',
        '@id': 'https://avicinna.com/treatments#webpage',
        url: 'https://avicinna.com/treatments',
        name: 'العلاج في تركيا | التخصصات والعمليات الجراحية',
        description: 'دليلك الشامل للعلاجات والعمليات الجراحية في أرقى مستشفيات إسطنبول المعتمدة دولياً.',
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
            name: 'العلاجات والتخصصات',
            item: 'https://avicinna.com/treatments',
          },
        ],
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(treatmentsSchema) }}
      />
      {children}
    </>
  );
}
