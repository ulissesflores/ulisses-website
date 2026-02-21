import type { MetadataRoute } from 'next';
import { publications, publicationCollections } from '@/data/publications';
import { upkfMeta } from '@/data/generated/upkf.generated';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = upkfMeta.primaryWebsite;

  const collectionEntries = Object.keys(publicationCollections).map((category) => ({
    url: `${baseUrl}/${category}`,
    lastModified: upkfMeta.generatedAt,
    changeFrequency: 'weekly' as const,
    priority: 0.85,
  }));

  const publicationEntries = publications.map((publication) => ({
    url: `${baseUrl}/${publication.category}/${publication.id}`,
    lastModified: publication.updatedAt,
    changeFrequency: 'monthly' as const,
    priority: publication.category === 'research' ? 0.9 : 0.8,
  }));

  return [
    {
      url: baseUrl,
      lastModified: upkfMeta.generatedAt,
      changeFrequency: 'weekly',
      priority: 1,
    },
    ...collectionEntries,
    ...publicationEntries,
  ];
}
