import { knowledgeData } from './knowledge';
import { acervoCanonicalPath as migrationAcervoCanonicalPath, allSermonMigrations } from './sermons-migration';

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
  legacyCollectionSlug: string;
  position: number;
}

export interface AcervoCluster {
  id: string;
  canonicalPath: string;
  seoTitle: string;
  metaDescription: string;
  prose: string;
  sermons: AcervoSermon[];
}

interface GeneratedAcervoPayload {
  canonicalPath?: string;
  pageTitle?: string;
  pageDescription?: string;
  clusters?: readonly AcervoCluster[];
}

const generatedAcervo = (knowledgeData as unknown as { acervo?: GeneratedAcervoPayload }).acervo;

if (!generatedAcervo || !Array.isArray(generatedAcervo.clusters)) {
  throw new Error('knowledgeData.acervo.clusters ausente. Rode npm run upkf:generate para materializar SSOT do acervo.');
}

export const acervoCanonicalPath =
  typeof generatedAcervo.canonicalPath === 'string' && generatedAcervo.canonicalPath.trim().length > 0
    ? generatedAcervo.canonicalPath
    : migrationAcervoCanonicalPath;

export const acervoPageTitle = generatedAcervo.pageTitle || 'Acervo Teologico por Clusters';
export const acervoPageDescription =
  generatedAcervo.pageDescription ||
  'Acervo teologico organizado por clusters de autoridade topical, com metadados enriquecidos para indexacao semantica e IA.';

const generatedClusters = generatedAcervo.clusters as readonly AcervoCluster[];

export const acervoClusters: AcervoCluster[] = generatedClusters.map((cluster: AcervoCluster) => ({
  ...cluster,
  sermons: (cluster.sermons || []).map((sermon: AcervoSermon) => ({
    ...sermon,
    originalPath: sermon.originalPath || '',
    legacyCollectionSlug: sermon.legacyCollectionSlug || '',
  })),
}));

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
