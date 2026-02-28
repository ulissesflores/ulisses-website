import type { MetadataRoute } from 'next';
import { publications, publicationCollections } from '@/data/publications';
import { knowledgeData } from '@/data/knowledge';
import { upkfMeta } from '@/data/generated/upkf.generated';
import { buildLanguageAlternates } from '@/data/seo';
import { certificationsSotaData } from '@/data/certifications-sota';
import { acervoCanonicalPath, acervoLatestPublishedAt, acervoSermons } from '@/data/acervo-teologico';

function isIndexableSitemapPath(path: string): boolean {
  const normalized = path.toLowerCase();

  if (/\.(md|docx|json|jsonld)(?:$|[?#])/.test(normalized)) {
    return false;
  }

  const extensionMatch = normalized.match(/\.([a-z0-9]+)(?:$|[?#])/);
  if (!extensionMatch) {
    return true;
  }

  return extensionMatch[1] === 'pdf';
}

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

function maybeMakeSitemapEntry(
  path: string,
  lastModified: string,
  changeFrequency: 'daily' | 'weekly' | 'monthly',
  priority: number,
): MetadataRoute.Sitemap[number] | null {
  if (!isIndexableSitemapPath(path)) {
    return null;
  }

  return makeSitemapEntry(path, lastModified, changeFrequency, priority);
}

export default function sitemap(): MetadataRoute.Sitemap {
  const latestSiteDate =
    publications
      .map((publication) => publication.updatedAt)
      .sort((a, b) => b.localeCompare(a))[0] || upkfMeta.generatedAt;

  const collectionEntries = Object.keys(publicationCollections)
    .map((category) => {
      const latestCategoryDate =
        publications
          .filter((publication) => publication.category === category)
          .map((publication) => publication.updatedAt)
          .sort((a, b) => b.localeCompare(a))[0] || latestSiteDate;

      return maybeMakeSitemapEntry(`/${category}`, latestCategoryDate, 'weekly', 0.85);
    })
    .filter((entry): entry is MetadataRoute.Sitemap[number] => Boolean(entry));

  const publicationEntries = publications
    .map((publication) =>
      maybeMakeSitemapEntry(
        `/${publication.category}/${publication.id}`,
        publication.updatedAt,
        'monthly',
        publication.category === 'research' ? 0.9 : 0.8,
      ),
    )
    .filter((entry): entry is MetadataRoute.Sitemap[number] => Boolean(entry));

  const deepResearchEntries = publications
    .flatMap((publication) => {
      const date = publication.updatedAt;
      return [
        maybeMakeSitemapEntry(publication.mdUrl, date, 'monthly', 0.62),
        maybeMakeSitemapEntry(publication.primaryPdfUrl || publication.downloadUrl, date, 'monthly', 0.7),
        maybeMakeSitemapEntry(publication.docxUrl, date, 'monthly', 0.58),
      ];
    })
    .filter((entry): entry is MetadataRoute.Sitemap[number] => Boolean(entry));

  const certificationsEntries = [
    maybeMakeSitemapEntry('/certifications', knowledgeData.generatedAt, 'weekly', 0.78),
    ...certificationsSotaData.map((certification) =>
      maybeMakeSitemapEntry(certification.canonicalPath, certification.publishedAt, 'monthly', 0.62),
    ),
  ].filter((entry): entry is MetadataRoute.Sitemap[number] => Boolean(entry));

  const blogLatest =
    knowledgeData.blog.posts
      .map((post) => post.publishedAt)
      .sort((a, b) => b.localeCompare(a))[0] || latestSiteDate;

  const blogEntries = [
    maybeMakeSitemapEntry(knowledgeData.blog.canonicalPath, blogLatest, 'weekly', 0.75),
    ...knowledgeData.blog.posts.map((post) => maybeMakeSitemapEntry(post.canonicalPath, post.publishedAt, 'monthly', 0.65)),
  ].filter((entry): entry is MetadataRoute.Sitemap[number] => Boolean(entry));

  const acervoEntries = [
    maybeMakeSitemapEntry(acervoCanonicalPath, acervoLatestPublishedAt, 'weekly', 0.76),
    ...acervoSermons.map((sermon) => maybeMakeSitemapEntry(sermon.canonicalPath, sermon.publishedAt, 'monthly', 0.58)),
  ].filter((entry): entry is MetadataRoute.Sitemap[number] => Boolean(entry));
  const identidadeEntry = maybeMakeSitemapEntry('/identidade', upkfMeta.generatedAt, 'daily', 0.92);
  const simulationEntries = [
    maybeMakeSitemapEntry('/simulacoes', upkfMeta.generatedAt, 'weekly', 0.72),
    maybeMakeSitemapEntry('/simulacoes/rapaduria-2027', upkfMeta.generatedAt, 'weekly', 0.68),
  ].filter((entry): entry is MetadataRoute.Sitemap[number] => Boolean(entry));

  return [
    makeSitemapEntry('/', latestSiteDate, 'weekly', 1),
    ...(identidadeEntry ? [identidadeEntry] : []),
    ...simulationEntries,
    ...collectionEntries,
    ...publicationEntries,
    ...deepResearchEntries,
    ...certificationsEntries,
    ...blogEntries,
    ...acervoEntries,
  ];
}
