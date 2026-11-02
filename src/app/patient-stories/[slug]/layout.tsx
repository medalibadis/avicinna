import type { Metadata } from 'next';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import { patientStoriesData } from '@/data/stories';

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  return patientStoriesData.map((s) => ({
    slug: s.slug,
  }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;

  let patientName = '';
  let treatmentName = '';
  let countryName = '';
  let storyImage = '';

  if (isSupabaseConfigured && supabase) {
    const { data: story } = await supabase
      .from('stories')
      .select('patient_name_ar, patient_name_en, treatment_ar, treatment_en, country_ar, country_en, image, rating')
      .eq('slug', slug)
      .single();

    if (story) {
      patientName = story.patient_name_ar || story.patient_name_en;
      treatmentName = story.treatment_ar || story.treatment_en;
      countryName = story.country_ar || story.country_en;
      storyImage = story.image || '';
    }
  }

  if (!patientName) {
    const local = patientStoriesData.find((s) => s.slug === slug || s.id === slug);
    if (local) {
      patientName = local.patientName.ar;
      treatmentName = local.treatment.ar;
      countryName = local.country.ar;
      storyImage = local.image;
    }
  }

  if (!patientName) {
    return {
      title: 'قصة نجاح غير موجودة | أفيسينا',
    };
  }

  const title = `تجربة ${patientName} في ${treatmentName} بتركيا | أفيسينا`;
  const description = `قصة نجاح ${patientName} من ${countryName} في ${treatmentName} بمستشفيات إسطنبول المعتمدة دولياً عبر منصة أفيسينا.`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: 'article',
      url: `https://avicinna.com/patient-stories/${slug}`,
      siteName: 'AVICINNA',
      images: storyImage ? [{ url: storyImage, width: 1200, height: 630, alt: patientName }] : undefined,
    },
    alternates: {
      canonical: `https://avicinna.com/patient-stories/${slug}`,
    },
  };
}

export default function StorySlugLayout({ children }: { children: React.ReactNode }) {
  return children;
}
