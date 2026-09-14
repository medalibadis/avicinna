import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'تواصل معنا - استشارة طبية مجانية | Contact AVICINNA',
  description:
    'احصل على استشارة طبية مجانية خلال 24 ساعة من أفضل أطباء تركيا. تواصل مع فريق أفيسينا للحصول على خطة علاجية مخصصة وعرض سعر شامل. Free medical consultation with top Turkish doctors.',
  keywords: [
    'استشارة طبية مجانية تركيا',
    'تواصل أفيسينا',
    'حجز موعد طبيب تركيا',
    'عرض سعر علاج إسطنبول',
    'free medical consultation Turkey',
    'contact AVICINNA',
    'book appointment Istanbul hospital',
    'consultation médicale gratuite Turquie',
  ],
  openGraph: {
    title: 'استشارة طبية مجانية - تواصل مع فريق أفيسينا | Contact AVICINNA',
    description:
      'فريقنا الطبي جاهز لمراجعة تقاريرك الطبية وتقديم خطة علاج شاملة مع عرض سعر خلال 24 ساعة.',
    type: 'website',
  },
  alternates: {
    canonical: '/contact',
  },
};

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return children;
}
