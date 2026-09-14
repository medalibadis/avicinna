import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'العلاج في تركيا - التخصصات والعمليات الجراحية | Treatments in Turkey - AVICINNA',
  description:
    'اكتشف أفضل العلاجات والعمليات الجراحية المتاحة في تركيا: جراحة القلب المفتوح، زراعة الشعر بتقنية DHI، تجميل الأسنان، جراحة العظام، علاج السرطان والأورام. أسعار تنافسية مع أعلى معايير الجودة في مستشفيات إسطنبول.',
  keywords: [
    'العلاج في تركيا',
    'عمليات جراحية تركيا',
    'زراعة شعر في تركيا',
    'جراحة قلب تركيا',
    'تجميل أسنان إسطنبول',
    'ابتسامة هوليوود تركيا',
    'جراحة عظام تركيا',
    'علاج سرطان تركيا',
    'أسعار العلاج في تركيا',
    'treatment in Turkey',
    'hair transplant Turkey cost',
    'dental veneers Istanbul',
    'cardiac surgery Turkey',
    'orthopedic surgery Istanbul',
    'traitement en Turquie',
    'greffe de cheveux Turquie',
  ],
  openGraph: {
    title: 'العلاج في تركيا - جميع التخصصات الطبية والجراحية | AVICINNA',
    description:
      'دليلك الشامل للعلاجات والعمليات الجراحية في أفضل مستشفيات تركيا المعتمدة دولياً. استشارة مجانية وعرض سعر خلال 24 ساعة.',
    type: 'website',
  },
  alternates: {
    canonical: '/treatments',
  },
};

export default function TreatmentsLayout({ children }: { children: React.ReactNode }) {
  return children;
}
