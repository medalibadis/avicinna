import type { Metadata } from 'next';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';

import { doctorsData } from '@/data/doctors';

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  return doctorsData.map((d) => ({
    slug: d.slug,
  }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;

  let docName = '';
  let docSpecialty = '';
  let docHospital = '';
  let docImage = '';

  if (isSupabaseConfigured && supabase) {
    const { data: doctor } = await supabase
      .from('doctors')
      .select('name_ar, name_en, specialty_ar, specialty_en, hospital_ar, hospital_en, image')
      .eq('slug', slug)
      .single();

    if (doctor) {
      docName = doctor.name_ar || doctor.name_en;
      docSpecialty = doctor.specialty_ar || doctor.specialty_en;
      docHospital = doctor.hospital_ar || doctor.hospital_en;
      docImage = doctor.image || '';
    }
  }

  if (!docName) {
    const localDoc = doctorsData.find((d) => d.slug === slug || d.id === slug);
    if (localDoc) {
      docName = localDoc.name.ar;
      docSpecialty = localDoc.specialtyName.ar;
      docHospital = localDoc.hospital.ar;
      docImage = localDoc.image;
    }
  }

  if (!docName) {
    return {
      title: 'طبيب غير موجود | أفيسينا',
    };
  }

  const title = `${docName} - استشاري ${docSpecialty} في إسطنبول`;
  const description = `${docName}، ${docSpecialty} في ${docHospital}. احجز استشارة طبية مجانية في أرقى مستشفيات تركيا المعتمدة دولياً.`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: 'profile',
      url: `https://avicinna.com/doctors/${slug}`,
      images: docImage ? [{ url: docImage, width: 600, height: 600, alt: docName }] : undefined,
    },
    alternates: {
      canonical: `https://avicinna.com/doctors/${slug}`,
    },
  };
}

export default async function DoctorSlugLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const localDoc = doctorsData.find((d) => d.slug === slug || d.id === slug);

  const docSchema = localDoc
    ? {
        '@context': 'https://schema.org',
        '@graph': [
          {
            '@type': 'Physician',
            '@id': `https://avicinna.com/doctors/${slug}#physician`,
            name: localDoc.name.ar,
            url: `https://avicinna.com/doctors/${slug}`,
            image: localDoc.image,
            jobTitle: localDoc.title.ar,
            medicalSpecialty: localDoc.specialtyName.ar,
            hospitalAffiliation: {
              '@type': 'Hospital',
              name: localDoc.hospital.ar,
            },
            aggregateRating: {
              '@type': 'AggregateRating',
              ratingValue: localDoc.rating,
              reviewCount: localDoc.reviewCount,
            },
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
                name: 'الأطباء والجراحون',
                item: 'https://avicinna.com/doctors',
              },
              {
                '@type': 'ListItem',
                position: 3,
                name: localDoc.name.ar,
                item: `https://avicinna.com/doctors/${slug}`,
              },
            ],
          },
        ],
      }
    : null;

  return (
    <>
      {docSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(docSchema) }}
        />
      )}
      {children}
    </>
  );
}
