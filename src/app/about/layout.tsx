import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'من نحن - أفيسينا للرعاية الطبية الدولية | About AVICINNA',
  description:
    'تعرف على منصة أفيسينا، الشريك الموثوق للسياحة العلاجية في تركيا. أكثر من 10 سنوات خبرة في ربط المرضى الدوليين بأفضل المستشفيات والأطباء المعتمدين دولياً في إسطنبول. Learn about AVICINNA, your trusted partner for medical tourism in Turkey.',
  keywords: [
    'من نحن أفيسينا',
    'سياحة علاجية تركيا',
    'شركة سياحة طبية إسطنبول',
    'about AVICINNA',
    'medical tourism company Turkey',
    'healthcare facilitator Istanbul',
  ],
  openGraph: {
    title: 'من نحن - أفيسينا | About AVICINNA Healthcare Turkey',
    description:
      'أكثر من عقد من الخبرة في تنسيق الرعاية الصحية الدولية مع أفضل المستشفيات المعتمدة JCI في إسطنبول.',
    type: 'website',
  },
  alternates: {
    canonical: '/about',
  },
};

export default function AboutLayout({ children }: { children: React.ReactNode }) {
  return children;
}
