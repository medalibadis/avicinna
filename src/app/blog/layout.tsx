import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'المدونة الطبية - مقالات ونصائح صحية | Medical Blog - AVICINNA',
  description:
    'اقرأ أحدث المقالات والنصائح الطبية حول العلاج في تركيا، السياحة العلاجية، زراعة الشعر، جراحة القلب، تجميل الأسنان والمزيد من المواضيع الصحية المتخصصة.',
  keywords: [
    'مدونة طبية',
    'مقالات صحية تركيا',
    'نصائح العلاج في تركيا',
    'تجربتي في العلاج بتركيا',
    'medical blog Turkey',
    'health articles Istanbul',
    'blog médical Turquie',
  ],
  openGraph: {
    title: 'المدونة الطبية | AVICINNA Medical Blog',
    description:
      'مقالات طبية متخصصة ونصائح صحية حول العلاج والسياحة العلاجية في تركيا.',
    type: 'website',
  },
  alternates: {
    canonical: '/blog',
  },
};

export default function BlogLayout({ children }: { children: React.ReactNode }) {
  return children;
}
