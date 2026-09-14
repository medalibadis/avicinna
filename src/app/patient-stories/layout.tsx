import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'تجارب المرضى - قصص نجاح العلاج في تركيا | Patient Stories - AVICINNA',
  description:
    'اقرأ تجارب حقيقية لمرضى دوليين عولجوا بنجاح في أفضل مستشفيات تركيا عبر منصة أفيسينا. قصص نجاح في جراحة القلب، زراعة الشعر، تجميل الأسنان والعظام.',
  keywords: [
    'تجارب مرضى تركيا',
    'تجربتي في العلاج بتركيا',
    'قصص نجاح العلاج في إسطنبول',
    'آراء المرضى أفيسينا',
    'patient stories Turkey',
    'medical tourism reviews',
    'témoignages patients Turquie',
  ],
  openGraph: {
    title: 'تجارب المرضى وقصص النجاح | AVICINNA Patient Stories',
    description:
      'تجارب حقيقية لمرضى من حول العالم عولجوا بنجاح في مستشفيات تركيا المعتمدة.',
    type: 'website',
  },
  alternates: {
    canonical: '/patient-stories',
  },
};

export default function PatientStoriesLayout({ children }: { children: React.ReactNode }) {
  return children;
}
