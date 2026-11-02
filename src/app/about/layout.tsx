import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'من نحن | أفيسينا للرعاية الطبية في تركيا',
  description:
    'تعرف على منصة أفيسينا، الشريك الموثوق للسياحة العلاجية في تركيا. نربط المرضى الدوليين بأفضل المستشفيات والأطباء المعتمدين دولياً JCI في إسطنبول.',
  openGraph: {
    title: 'من نحن | أفيسينا للرعاية الطبية في تركيا',
    description:
      'أكثر من عقد من الخبرة في تنسيق الرعاية الصحية الدولية مع أفضل المستشفيات المعتمدة JCI في إسطنبول.',
    url: 'https://avicinna.com/about',
    siteName: 'AVICINNA',
    type: 'website',
  },
  alternates: {
    canonical: 'https://avicinna.com/about',
  },
};

export default function AboutLayout({ children }: { children: React.ReactNode }) {
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
        name: 'من نحن',
        item: 'https://avicinna.com/about',
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
