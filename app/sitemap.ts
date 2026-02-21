import type { MetadataRoute } from 'next';
import { publications, publicationCollections } from '@/data/publications';
import { upkfMeta } from '@/data/generated/upkf.generated';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = upkfMeta.primaryWebsite;
  const latestSiteDate =
    publications
      .map((publication) => publication.updatedAt)
      .sort((a, b) => b.localeCompare(a))[0] || upkfMeta.generatedAt;

  const collectionEntries = Object.keys(publicationCollections).map((category) => {
    const latestCategoryDate =
      publications
        .filter((publication) => publication.category === category)
        .map((publication) => publication.updatedAt)
        .sort((a, b) => b.localeCompare(a))[0] || latestSiteDate;

    return {
      url: `${baseUrl}/${category}`,
      lastModified: latestCategoryDate,
      changeFrequency: 'weekly' as const,
      priority: 0.85,
    };
  });

  const publicationEntries = publications.map((publication) => ({
    url: `${baseUrl}/${publication.category}/${publication.id}`,
    lastModified: publication.updatedAt,
    changeFrequency: 'monthly' as const,
    priority: publication.category === 'research' ? 0.9 : 0.8,
  }));

  return [
    {
      url: baseUrl,
      lastModified: latestSiteDate,
      changeFrequency: 'weekly',
      priority: 1,
    },
    {
      url: `${baseUrl}/feed.xml`,
      lastModified: latestSiteDate,
      changeFrequency: 'daily',
      priority: 0.7,
    },
    ...collectionEntries,
    ...publicationEntries,
  ];
}
