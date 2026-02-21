import type { MetadataRoute } from 'next';
import { publications, publicationCollections } from '@/data/publications';
import { knowledgeData } from '@/data/knowledge';
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

  const certificationsEntries = [
    {
      url: `${baseUrl}/certifications`,
      lastModified: knowledgeData.generatedAt,
      changeFrequency: 'weekly' as const,
      priority: 0.78,
    },
    ...knowledgeData.certifications.map((certification) => ({
      url: `${baseUrl}${certification.canonicalPath}`,
      lastModified: certification.publishedAt,
      changeFrequency: 'monthly' as const,
      priority: 0.62,
    })),
  ];

  const blogLatest =
    knowledgeData.blog.posts
      .map((post) => post.publishedAt)
      .sort((a, b) => b.localeCompare(a))[0] || latestSiteDate;

  const blogEntries = [
    {
      url: `${baseUrl}${knowledgeData.blog.canonicalPath}`,
      lastModified: blogLatest,
      changeFrequency: 'weekly' as const,
      priority: 0.75,
    },
    ...knowledgeData.blog.posts.map((post) => ({
      url: `${baseUrl}${post.canonicalPath}`,
      lastModified: post.publishedAt,
      changeFrequency: 'monthly' as const,
      priority: 0.65,
    })),
  ];

  const sermonsCount = knowledgeData.sermons.collections.reduce((sum, collection) => sum + collection.items.length, 0);
  const sermonsLatest =
    knowledgeData.sermons.collections
      .flatMap((collection) => collection.items.map((item) => item.publishedAt))
      .sort((a, b) => b.localeCompare(a))[0] || latestSiteDate;

  const sermonEntries = [
    {
      url: `${baseUrl}${knowledgeData.sermons.canonicalPath}`,
      lastModified: sermonsLatest,
      changeFrequency: 'weekly' as const,
      priority: 0.76,
    },
    ...knowledgeData.sermons.collections.map((collection) => ({
      url: `${baseUrl}${collection.canonicalPath}`,
      lastModified:
        collection.items.map((item) => item.publishedAt).sort((a, b) => b.localeCompare(a))[0] || sermonsLatest,
      changeFrequency: 'weekly' as const,
      priority: 0.68,
    })),
    ...knowledgeData.sermons.collections.flatMap((collection) =>
      collection.items.map((item) => ({
        url: `${baseUrl}${item.canonicalPath}`,
        lastModified: item.publishedAt,
        changeFrequency: 'monthly' as const,
        priority: 0.58,
      })),
    ),
  ];

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
    ...certificationsEntries,
    ...blogEntries,
    ...(sermonsCount > 0 ? sermonEntries : []),
  ];
}
