import type { Metadata } from 'next';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;

  if (!isSupabaseConfigured || !supabase) {
    return {
      title: 'تجربة مريض - AVICINNA',
    };
  }

  const { data: story } = await supabase
    .from('stories')
    .select('patient_name_ar, patient_name_en, treatment_ar, treatment_en, country_ar, country_en, image, rating')
    .eq('slug', slug)
    .single();

  if (!story) {
    return {
      title: 'قصة مريض غير موجودة | AVICINNA',
    };
  }

  const title = `تجربة ${story.patient_name_ar} - ${story.treatment_ar} في تركيا | AVICINNA`;
  const description = `قصة نجاح ${story.patient_name_ar} من ${story.country_ar} في ${story.treatment_ar} بمستشفيات تركيا المعتمدة عبر منصة أفيسينا. تقييم ${story.rating}/5. ${story.patient_name_en}'s ${story.treatment_en} success story in Turkey.`;

  return {
    title,
    description,
    keywords: [
      `تجربة ${story.treatment_ar} تركيا`,
      `${story.treatment_en} Turkey review`,
      'تجارب مرضى تركيا',
      'قصص نجاح العلاج',
      'patient reviews Turkey',
    ],
    openGraph: {
      title: `تجربة ${story.patient_name_ar} | ${story.treatment_ar} - AVICINNA`,
      description,
      type: 'article',
      images: story.image ? [{ url: story.image, width: 1200, height: 630, alt: `${story.patient_name_en} - ${story.treatment_en}` }] : undefined,
    },
    alternates: {
      canonical: `/patient-stories/${slug}`,
    },
  };
}

export default function StorySlugLayout({ children }: { children: React.ReactNode }) {
  return children;
}
