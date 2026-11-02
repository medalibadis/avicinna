import type { Metadata } from 'next';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import { treatmentsData } from '@/data/treatments';

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  return treatmentsData.map((t) => ({
    slug: t.slug,
  }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;

  let treatTitle = '';
  let treatDesc = '';
  let treatImage = '';

  if (isSupabaseConfigured && supabase) {
    const { data: treatment } = await supabase
      .from('treatments')
      .select('title_ar, title_en, description_ar, description_en, image')
      .eq('slug', slug)
      .single();

    if (treatment) {
      treatTitle = treatment.title_ar || treatment.title_en;
      treatDesc = treatment.description_ar || treatment.description_en || '';
      treatImage = treatment.image || '';
    }
  }

  if (!treatTitle) {
    const local = treatmentsData.find((t) => t.slug === slug || t.id === slug);
    if (local) {
      treatTitle = local.title.ar;
      treatDesc = local.shortDescription?.ar || local.fullOverview?.ar || '';
      treatImage = local.image;
    }
  }

  if (!treatTitle) {
    return {
      title: 'علاج غير موجود | أفيسينا',
    };
  }

  const title = `${treatTitle} في تركيا | التكلفة وأفضل المستشفيات`;
  const description = `${treatTitle} في أفضل مستشفيات تركيا المعتمدة دولياً. ${treatDesc.substring(0, 120)}. استشارة مجانية مع أفضل الجراحين.`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: 'website',
      url: `https://avicinna.com/treatments/${slug}`,
      images: treatImage ? [{ url: treatImage, width: 1200, height: 630, alt: treatTitle }] : undefined,
    },
    alternates: {
      canonical: `https://avicinna.com/treatments/${slug}`,
    },
  };
}

export default async function TreatmentSlugLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const local = treatmentsData.find((t) => t.slug === slug || t.id === slug);

  const treatmentSchema = local
    ? {
        '@context': 'https://schema.org',
        '@graph': [
          {
            '@type': 'MedicalProcedure',
            '@id': `https://avicinna.com/treatments/${slug}#procedure`,
            name: local.title.ar,
            description: local.shortDescription?.ar || local.fullOverview?.ar || '',
            image: local.image,
            procedureType: 'https://schema.org/SurgicalProcedure',
            url: `https://avicinna.com/treatments/${slug}`,
          },
          {
            '@type': 'BreadcrumbList',
            itemListElement: [
              {
                '@type': 'ListItem',
                position: 1,
                name: 'الرئيسية',
                item: 'https://avicinna.com',
              },
              {
                '@type': 'ListItem',
                position: 2,
                name: 'العلاجات والتخصصات',
                item: 'https://avicinna.com/treatments',
              },
              {
                '@type': 'ListItem',
                position: 3,
                name: local.title.ar,
                item: `https://avicinna.com/treatments/${slug}`,
              },
            ],
          },
        ],
      }
    : null;

  return (
    <>
      {treatmentSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(treatmentSchema) }}
        />
      )}
      {children}
    </>
  );
}
