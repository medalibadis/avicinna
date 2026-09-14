import { MetadataRoute } from 'next';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://avicinna.netlify.app';

  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1.0,
      alternates: {
        languages: {
          ar: `${baseUrl}?lang=ar`,
          en: `${baseUrl}?lang=en`,
          fr: `${baseUrl}?lang=fr`,
        },
      },
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/doctors`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/treatments`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/patient-stories`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/blog`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.85,
    },
  ];

  // If Supabase is not configured, return only static routes
  if (!isSupabaseConfigured || !supabase) {
    return staticRoutes;
  }

  // Fetch slugs from Supabase for dynamic routes
  const [doctorsRes, treatmentsRes, storiesRes, articlesRes] = await Promise.all([
    supabase.from('doctors').select('slug').order('created_at', { ascending: false }),
    supabase.from('treatments').select('slug').order('created_at', { ascending: false }),
    supabase.from('stories').select('slug').order('created_at', { ascending: false }),
    supabase.from('articles').select('slug, published_date').order('published_date', { ascending: false }),
  ]);

  // Dynamic doctor routes
  const doctorRoutes: MetadataRoute.Sitemap = (doctorsRes.data ?? []).map((doc) => ({
    url: `${baseUrl}/doctors/${doc.slug}`,
    lastModified: new Date(),
    changeFrequency: 'weekly',
    priority: 0.85,
  }));

  // Dynamic treatment routes
  const treatmentRoutes: MetadataRoute.Sitemap = (treatmentsRes.data ?? []).map((treat) => ({
    url: `${baseUrl}/treatments/${treat.slug}`,
    lastModified: new Date(),
    changeFrequency: 'weekly',
    priority: 0.85,
  }));

  // Dynamic story routes
  const storyRoutes: MetadataRoute.Sitemap = (storiesRes.data ?? []).map((story) => ({
    url: `${baseUrl}/patient-stories/${story.slug}`,
    lastModified: new Date(),
    changeFrequency: 'monthly',
    priority: 0.75,
  }));

  // Dynamic article routes
  const articleRoutes: MetadataRoute.Sitemap = (articlesRes.data ?? []).map((art) => ({
    url: `${baseUrl}/blog/${art.slug}`,
    lastModified: art.published_date ? new Date(art.published_date) : new Date(),
    changeFrequency: 'weekly',
    priority: 0.8,
  }));

  return [
    ...staticRoutes,
    ...treatmentRoutes,
    ...doctorRoutes,
    ...storyRoutes,
    ...articleRoutes,
  ];
}
