import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'المدونة الطبية | مقالات ونصائح السياحة العلاجية',
  description:
    'أحدث المقالات والنصائح الطبية حول العلاج في تركيا، جراحة القلب، زراعة الشعر، وتجميل الأسنان بإشراف نخبة الأطباء والاستشاريين في إسطنبول.',
  openGraph: {
    title: 'المدونة الطبية | مقالات ونصائح السياحة العلاجية',
    description:
      'مقالات طبية متخصصة ونصائح صحية حول العلاج والسياحة العلاجية في تركيا.',
    url: 'https://avicinna.com/blog',
    siteName: 'AVICINNA',
    type: 'website',
  },
  alternates: {
    canonical: 'https://avicinna.com/blog',
  },
};

export default function BlogLayout({ children }: { children: React.ReactNode }) {
  return children;
}
