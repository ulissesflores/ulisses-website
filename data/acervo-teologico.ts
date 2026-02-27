import { knowledgeData } from './knowledge';
import { acervoCanonicalPath, allSermonMigrations, sermonMigrationClusters } from './sermons-migration';

interface LegacySermonRecord {
  collectionName: string;
  collectionSlug: string;
  position: number;
  publishedAt: string;
  youtubeUrl: string;
  name: string;
  summary: string;
}

export interface AcervoSermon {
  clusterId: string;
  clusterCanonicalPath: string;
  clusterSeoTitle: string;
  clusterMetaDescription: string;
  slug: string;
  canonicalPath: string;
  seoTitle: string;
  metaDescription: string;
  llmContext: string;
  originalPath: string;
  publishedAt: string;
  youtubeUrl: string;
  legacyName: string;
  legacySummary: string;
  legacyCollectionName: string;
  position: number;
}

export interface AcervoCluster {
  id: string;
  canonicalPath: string;
  seoTitle: string;
  metaDescription: string;
  sermons: AcervoSermon[];
}

function toMetaDescription(text: string): string {
  const trimmed = text.trim();
  if (trimmed.length <= 180) {
    return trimmed;
  }
  return `${trimmed.slice(0, 177).trimEnd()}...`;
}

const legacySermonByPath = new Map<string, LegacySermonRecord>();

knowledgeData.sermons.collections.forEach((collection) => {
  collection.items.forEach((item) => {
    legacySermonByPath.set(item.canonicalPath, {
      collectionName: collection.name,
      collectionSlug: collection.slug,
      position: item.position,
      publishedAt: item.publishedAt,
      youtubeUrl: item.youtubeUrl,
      name: item.name,
      summary: item.summary,
    });
  });
});

export const acervoClusters: AcervoCluster[] = sermonMigrationClusters.map((cluster) => {
  const sermons = cluster.sermons.map((migrationSermon) => {
    const legacy = legacySermonByPath.get(migrationSermon.originalPath);

    if (!legacy) {
      throw new Error(`Sermon legado nao encontrado para migracao: ${migrationSermon.originalPath}`);
    }

    const canonicalPath = `${cluster.canonicalPath}/${migrationSermon.newSlug}`;

    return {
      clusterId: cluster.id,
      clusterCanonicalPath: cluster.canonicalPath,
      clusterSeoTitle: cluster.seoTitle,
      clusterMetaDescription: cluster.metaDescription,
      slug: migrationSermon.newSlug,
      canonicalPath,
      seoTitle: migrationSermon.seoTitle,
      metaDescription: toMetaDescription(migrationSermon.llmContext),
      llmContext: migrationSermon.llmContext,
      originalPath: migrationSermon.originalPath,
      publishedAt: legacy.publishedAt,
      youtubeUrl: legacy.youtubeUrl,
      legacyName: legacy.name,
      legacySummary: legacy.summary,
      legacyCollectionName: legacy.collectionName,
      position: legacy.position,
    };
  });

  return {
    id: cluster.id,
    canonicalPath: cluster.canonicalPath,
    seoTitle: cluster.seoTitle,
    metaDescription: cluster.metaDescription,
    sermons,
  };
});

export const acervoSermons: AcervoSermon[] = acervoClusters.flatMap((cluster) => cluster.sermons);

if (acervoSermons.length !== allSermonMigrations.length) {
  throw new Error(
    `Total de sermoes no acervo (${acervoSermons.length}) diferente da migracao (${allSermonMigrations.length}).`,
  );
}

const uniqueClusterAndSlug = new Set(acervoSermons.map((item) => `${item.clusterId}/${item.slug}`));
if (uniqueClusterAndSlug.size !== acervoSermons.length) {
  throw new Error('Slug duplicado detectado dentro do acervo teologico.');
}

export const acervoLatestPublishedAt =
  acervoSermons.map((item) => item.publishedAt).sort((a, b) => b.localeCompare(a))[0] || knowledgeData.generatedAt;

export const acervoSermonByKey = new Map(acervoSermons.map((item) => [`${item.clusterId}/${item.slug}`, item]));

export const acervoClusterById = new Map(acervoClusters.map((cluster) => [cluster.id, cluster]));

export function getAcervoCluster(clusterId: string): AcervoCluster | null {
  return acervoClusterById.get(clusterId) ?? null;
}

export function getAcervoSermon(clusterId: string, slug: string): AcervoSermon | null {
  return acervoSermonByKey.get(`${clusterId}/${slug}`) ?? null;
}

export { acervoCanonicalPath };
