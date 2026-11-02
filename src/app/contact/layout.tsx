import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'تواصل معنا | استشارة طبية مجانية في إسطنبول',
  description:
    'احصل على استشارة طبية مجانية خلال 24 ساعة من نخبة أطباء وجراحي تركيا. تواصل مع فريق أفيسينا للحصول على خطة علاجية مخصصة وعرض سعر رسمي.',
  openGraph: {
    title: 'تواصل معنا | استشارة طبية مجانية في إسطنبول',
    description:
      'فريقنا الطبي جاهز لمراجعة تقاريرك الطبية وتقديم خطة علاج شاملة مع عرض سعر رسمي خلال 24 ساعة.',
    url: 'https://avicinna.com/contact',
    siteName: 'AVICINNA',
    type: 'website',
  },
  alternates: {
    canonical: 'https://avicinna.com/contact',
  },
};

export default function ContactLayout({ children }: { children: React.ReactNode }) {
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
        name: 'تواصل معنا',
        item: 'https://avicinna.com/contact',
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
