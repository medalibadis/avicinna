import { MetadataRoute } from 'next';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import { fetchWordPressPosts } from '@/lib/wordpress';
import { articlesData } from '@/data/articles';
import { doctorsData } from '@/data/doctors';
import { treatmentsData } from '@/data/treatments';
import { patientStoriesData } from '@/data/stories';

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

  // 1. Fetch published articles from WordPress Headless CMS
  const seenArticleSlugs = new Set<string>();
  const articleRoutes: MetadataRoute.Sitemap = [];

  try {
    const wpRes = await fetchWordPressPosts({ perPage: 100 });
    wpRes.posts.forEach((post) => {
      seenArticleSlugs.add(post.slug);
      articleRoutes.push({
        url: `${baseUrl}/blog/${post.slug}`,
        lastModified: post.publishedDate ? new Date(post.publishedDate) : new Date(),
        changeFrequency: 'weekly',
        priority: 0.8,
      });
    });
  } catch {
    // continue
  }

  // 2. Fetch doctors, treatments, stories from Supabase if configured, else use seed data
  let doctorRoutes: MetadataRoute.Sitemap = [];
  let treatmentRoutes: MetadataRoute.Sitemap = [];
  let storyRoutes: MetadataRoute.Sitemap = [];

  if (isSupabaseConfigured && supabase) {
    const [doctorsRes, treatmentsRes, storiesRes, articlesRes] = await Promise.all([
      supabase.from('doctors').select('slug').order('created_at', { ascending: false }),
      supabase.from('treatments').select('slug').order('created_at', { ascending: false }),
      supabase.from('stories').select('slug').order('created_at', { ascending: false }),
      supabase.from('articles').select('slug, published_date').order('published_date', { ascending: false }),
    ]);

    doctorRoutes = (doctorsRes.data ?? []).map((doc) => ({
      url: `${baseUrl}/doctors/${doc.slug}`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.85,
    }));

    treatmentRoutes = (treatmentsRes.data ?? []).map((treat) => ({
      url: `${baseUrl}/treatments/${treat.slug}`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.85,
    }));

    storyRoutes = (storiesRes.data ?? []).map((story) => ({
      url: `${baseUrl}/patient-stories/${story.slug}`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.75,
    }));

    (articlesRes.data ?? []).forEach((art) => {
      if (!seenArticleSlugs.has(art.slug)) {
        seenArticleSlugs.add(art.slug);
        articleRoutes.push({
          url: `${baseUrl}/blog/${art.slug}`,
          lastModified: art.published_date ? new Date(art.published_date) : new Date(),
          changeFrequency: 'weekly',
          priority: 0.8,
        });
      }
    });
  } else {
    // Seed fallback
    doctorRoutes = doctorsData.map((doc) => ({
      url: `${baseUrl}/doctors/${doc.slug}`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.85,
    }));

    treatmentRoutes = treatmentsData.map((treat) => ({
      url: `${baseUrl}/treatments/${treat.slug}`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.85,
    }));

    storyRoutes = patientStoriesData.map((story) => ({
      url: `${baseUrl}/patient-stories/${story.slug}`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.75,
    }));

    articlesData.forEach((art) => {
      if (!seenArticleSlugs.has(art.slug)) {
        seenArticleSlugs.add(art.slug);
        articleRoutes.push({
          url: `${baseUrl}/blog/${art.slug}`,
          lastModified: art.publishedDate ? new Date(art.publishedDate) : new Date(),
          changeFrequency: 'weekly',
          priority: 0.8,
        });
      }
    });
  }

  return [
    ...staticRoutes,
    ...treatmentRoutes,
    ...doctorRoutes,
    ...storyRoutes,
    ...articleRoutes,
  ];
}
