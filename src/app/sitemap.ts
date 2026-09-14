import { MetadataRoute } from 'next';
import { doctorsData } from '@/data/doctors';
import { treatmentsData } from '@/data/treatments';
import { patientStoriesData } from '@/data/stories';
import { articlesData } from '@/data/articles';

export default function sitemap(): MetadataRoute.Sitemap {
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

  // Dynamic doctor routes
  const doctorRoutes: MetadataRoute.Sitemap = doctorsData.map((doc) => ({
    url: `${baseUrl}/doctors/${doc.slug}`,
    lastModified: new Date(),
    changeFrequency: 'weekly',
    priority: 0.85,
  }));

  // Dynamic treatment routes
  const treatmentRoutes: MetadataRoute.Sitemap = treatmentsData.map((treat) => ({
    url: `${baseUrl}/treatments/${treat.slug}`,
    lastModified: new Date(),
    changeFrequency: 'weekly',
    priority: 0.85,
  }));

  // Dynamic story routes
  const storyRoutes: MetadataRoute.Sitemap = patientStoriesData.map((story) => ({
    url: `${baseUrl}/patient-stories/${story.slug}`,
    lastModified: new Date(),
    changeFrequency: 'monthly',
    priority: 0.75,
  }));

  // Dynamic article routes
  const articleRoutes: MetadataRoute.Sitemap = articlesData.map((art) => ({
    url: `${baseUrl}/blog/${art.slug}`,
    lastModified: new Date(art.publishedDate),
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
