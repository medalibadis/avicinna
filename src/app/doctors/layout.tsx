import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'أفضل أطباء وجراحين في تركيا | نخبة استشاريي إسطنبول',
  description:
    'تعرف على نخبة الأطباء والجراحين الاستشاريين في أفضل مستشفيات إسطنبول المعتمدة دولياً JCI. جراحة قلب، زراعة شعر، جراحة عظام، أسنان وتجميل.',
  openGraph: {
    title: 'أفضل أطباء وجراحين في تركيا | نخبة استشاريي إسطنبول',
    description:
      'نخبة البروفيسورات والجراحين الاستشاريين في أرقى مستشفيات إسطنبول المعتمدة دولياً.',
    url: 'https://avicinna.com/doctors',
    type: 'website',
  },
  alternates: {
    canonical: 'https://avicinna.com/doctors',
  },
};

export default function DoctorsLayout({ children }: { children: React.ReactNode }) {
  return children;
}
