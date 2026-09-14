import type { Metadata } from 'next';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;

  if (!isSupabaseConfigured || !supabase) {
    return {
      title: 'طبيب - AVICINNA',
    };
  }

  const { data: doctor } = await supabase
    .from('doctors')
    .select('name_ar, name_en, specialty_ar, specialty_en, hospital_ar, hospital_en, image')
    .eq('slug', slug)
    .single();

  if (!doctor) {
    return {
      title: 'طبيب غير موجود | AVICINNA',
    };
  }

  const title = `${doctor.name_ar} - ${doctor.specialty_ar} | ${doctor.name_en} - AVICINNA`;
  const description = `${doctor.name_ar}، ${doctor.specialty_ar} في ${doctor.hospital_ar}. احجز استشارة مجانية مع أفضل الأطباء في تركيا عبر منصة أفيسينا. ${doctor.name_en}, ${doctor.specialty_en} at ${doctor.hospital_en}.`;

  return {
    title,
    description,
    keywords: [
      doctor.name_ar,
      doctor.name_en,
      doctor.specialty_ar,
      doctor.specialty_en,
      `${doctor.specialty_ar} في تركيا`,
      `best ${doctor.specialty_en} Turkey`,
    ],
    openGraph: {
      title: `${doctor.name_ar} | ${doctor.specialty_ar} - AVICINNA`,
      description,
      type: 'profile',
      images: doctor.image ? [{ url: doctor.image, width: 600, height: 600, alt: doctor.name_en }] : undefined,
    },
    alternates: {
      canonical: `/doctors/${slug}`,
    },
  };
}

export default function DoctorSlugLayout({ children }: { children: React.ReactNode }) {
  return children;
}
