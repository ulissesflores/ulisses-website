import type { MetadataRoute } from 'next';
import { publications, publicationCollections } from '@/data/publications';
import { knowledgeData } from '@/data/knowledge';
import { upkfMeta } from '@/data/generated/upkf.generated';
import { buildLanguageAlternates } from '@/data/seo';

function makeSitemapEntry(
  path: string,
  lastModified: string,
  changeFrequency: 'daily' | 'weekly' | 'monthly',
  priority: number,
): MetadataRoute.Sitemap[number] {
  const normalizedPath = path === '/' ? '' : path;
  return {
    url: `${upkfMeta.primaryWebsite}${normalizedPath}`,
    lastModified,
    changeFrequency,
    priority,
    alternates: {
      languages: buildLanguageAlternates(path),
    },
  };
}

export default function sitemap(): MetadataRoute.Sitemap {
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

    return makeSitemapEntry(`/${category}`, latestCategoryDate, 'weekly', 0.85);
  });

  const publicationEntries = publications.map((publication) =>
    makeSitemapEntry(
      `/${publication.category}/${publication.id}`,
      publication.updatedAt,
      'monthly',
      publication.category === 'research' ? 0.9 : 0.8,
    ),
  );

  const deepResearchEntries = publications.flatMap((publication) => {
    const date = publication.updatedAt;
    return [
      makeSitemapEntry(publication.mdUrl, date, 'monthly', 0.62),
      makeSitemapEntry(publication.primaryPdfUrl || publication.downloadUrl, date, 'monthly', 0.7),
      makeSitemapEntry(publication.docxUrl, date, 'monthly', 0.58),
    ];
  });

  const certificationsEntries = [
    makeSitemapEntry('/certifications', knowledgeData.generatedAt, 'weekly', 0.78),
    ...knowledgeData.certifications.map((certification) =>
      makeSitemapEntry(certification.canonicalPath, certification.publishedAt, 'monthly', 0.62),
    ),
  ];

  const blogLatest =
    knowledgeData.blog.posts
      .map((post) => post.publishedAt)
      .sort((a, b) => b.localeCompare(a))[0] || latestSiteDate;

  const blogEntries = [
    makeSitemapEntry(knowledgeData.blog.canonicalPath, blogLatest, 'weekly', 0.75),
    ...knowledgeData.blog.posts.map((post) => makeSitemapEntry(post.canonicalPath, post.publishedAt, 'monthly', 0.65)),
  ];

  const sermonsCount = knowledgeData.sermons.collections.reduce((sum, collection) => sum + collection.items.length, 0);
  const sermonsLatest =
    knowledgeData.sermons.collections
      .flatMap((collection) => collection.items.map((item) => item.publishedAt))
      .sort((a, b) => b.localeCompare(a))[0] || latestSiteDate;

  const sermonEntries = [
    makeSitemapEntry(knowledgeData.sermons.canonicalPath, sermonsLatest, 'weekly', 0.76),
    ...knowledgeData.sermons.collections.map((collection) =>
      makeSitemapEntry(
        collection.canonicalPath,
        collection.items.map((item) => item.publishedAt).sort((a, b) => b.localeCompare(a))[0] || sermonsLatest,
        'weekly',
        0.68,
      ),
    ),
    ...knowledgeData.sermons.collections.flatMap((collection) =>
      collection.items.map((item) => makeSitemapEntry(item.canonicalPath, item.publishedAt, 'monthly', 0.58)),
    ),
  ];

  return [
    makeSitemapEntry('/', latestSiteDate, 'weekly', 1),
    makeSitemapEntry('/feed.xml', latestSiteDate, 'daily', 0.7),
    ...collectionEntries,
    ...publicationEntries,
    ...deepResearchEntries,
    ...certificationsEntries,
    ...blogEntries,
    ...(sermonsCount > 0 ? sermonEntries : []),
  ];
}
