import type { Metadata } from 'next';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;

  if (!isSupabaseConfigured || !supabase) {
    return {
      title: 'علاج - AVICINNA',
    };
  }

  const { data: treatment } = await supabase
    .from('treatments')
    .select('title_ar, title_en, description_ar, description_en, image')
    .eq('slug', slug)
    .single();

  if (!treatment) {
    return {
      title: 'علاج غير موجود | AVICINNA',
    };
  }

  const title = `${treatment.title_ar} في تركيا | ${treatment.title_en} in Turkey - AVICINNA`;
  const descriptionText = treatment.description_ar?.substring(0, 160) || '';
  const description = `${treatment.title_ar} في أفضل مستشفيات تركيا المعتمدة دولياً. ${descriptionText} استشارة مجانية مع أفضل الأطباء المتخصصين.`;

  return {
    title,
    description,
    keywords: [
      treatment.title_ar,
      treatment.title_en,
      `${treatment.title_ar} في تركيا`,
      `${treatment.title_ar} في إسطنبول`,
      `أسعار ${treatment.title_ar} تركيا`,
      `${treatment.title_en} Turkey cost`,
      `${treatment.title_en} Istanbul`,
    ],
    openGraph: {
      title: `${treatment.title_ar} في تركيا | AVICINNA`,
      description,
      type: 'article',
      images: treatment.image ? [{ url: treatment.image, width: 1200, height: 630, alt: treatment.title_en }] : undefined,
    },
    alternates: {
      canonical: `/treatments/${slug}`,
    },
  };
}

export default function TreatmentSlugLayout({ children }: { children: React.ReactNode }) {
  return children;
}
