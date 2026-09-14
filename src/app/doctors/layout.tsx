import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'أفضل أطباء وجراحين في تركيا | Best Doctors in Turkey - AVICINNA',
  description:
    'تعرف على نخبة الأطباء والجراحين الاستشاريين في أفضل مستشفيات إسطنبول المعتمدة دولياً JCI. جراحة قلب، زراعة شعر، جراحة عظام، أسنان وتجميل. Top surgeons and professors in Istanbul JCI-accredited hospitals.',
  keywords: [
    'أفضل أطباء تركيا',
    'جراحين إسطنبول',
    'أطباء قلب تركيا',
    'جراح تجميل إسطنبول',
    'أفضل دكتور زراعة شعر تركيا',
    'طبيب عظام إسطنبول',
    'best doctors Turkey',
    'top surgeons Istanbul',
    'meilleurs chirurgiens Turquie',
  ],
  openGraph: {
    title: 'أفضل الأطباء والجراحين في تركيا | AVICINNA Doctors',
    description:
      'نخبة البروفيسورات والجراحين الاستشاريين في أرقى مستشفيات إسطنبول المعتمدة دولياً.',
    type: 'website',
  },
  alternates: {
    canonical: '/doctors',
  },
};

export default function DoctorsLayout({ children }: { children: React.ReactNode }) {
  return children;
}
