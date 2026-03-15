/**
 * Locale-aware sermon migration data layer.
 * Provides an overlay map so pages can render translated sermon metadata
 * while keeping the same canonical routing and data structure.
 */
import type { Locale } from './i18n';
import { defaultLocale } from './i18n';
import type { AcervoCluster, AcervoSermon } from './acervo-teologico';

// ── Import localized migration JSONs ──────────────────────────────────────────
import baseJson from './seo/sermons-full-migration.json';
import enJson from './seo/sermons-full-migration.en.json';
import esJson from './seo/sermons-full-migration.es.json';
import itJson from './seo/sermons-full-migration.it.json';
import heJson from './seo/sermons-full-migration.he.json';

interface MigJsonItem {
  new_slug: string;
  seo_title: string;
  llm_context: string;
}

interface MigJsonCluster {
  id: string;
  seo_title: string;
  meta_description: string;
  sermoes: MigJsonItem[];
}

interface MigJsonDoc {
  clusters: MigJsonCluster[];
}

const migJsonByLocale: Record<string, MigJsonDoc> = {
  'pt-br': baseJson as unknown as MigJsonDoc,
  en: enJson as unknown as MigJsonDoc,
  es: esJson as unknown as MigJsonDoc,
  it: itJson as unknown as MigJsonDoc,
  he: heJson as unknown as MigJsonDoc,
};

export interface SermonI18n {
  seoTitle: string;
  llmContext: string;
  metaDescription: string;
}

export interface ClusterI18n {
  seoTitle: string;
  metaDescription: string;
}

/**
 * Build per-sermon and per-cluster translation lookup maps for a given locale.
 * Key format: "clusterId/slug" for sermons, "clusterId" for clusters.
 */
export function buildSermonI18nMaps(locale: Locale): {
  sermonMap: Map<string, SermonI18n>;
  clusterMap: Map<string, ClusterI18n>;
} {
  const json = migJsonByLocale[locale] ?? migJsonByLocale[defaultLocale];
  const sermonMap = new Map<string, SermonI18n>();
  const clusterMap = new Map<string, ClusterI18n>();

  for (const cluster of json.clusters) {
    clusterMap.set(cluster.id, {
      seoTitle: cluster.seo_title,
      metaDescription: cluster.meta_description,
    });

    for (const sermon of cluster.sermoes) {
      const key = `${cluster.id}/${sermon.new_slug}`;
      const desc = sermon.llm_context.trim();
      sermonMap.set(key, {
        seoTitle: sermon.seo_title,
        llmContext: sermon.llm_context,
        metaDescription: desc.length <= 180 ? desc : `${desc.slice(0, 177).trimEnd()}...`,
      });
    }
  }

  return { sermonMap, clusterMap };
}

/** Helper: get localized sermon text with fallback to the original AcervoSermon. */
export function localizeSermon(sermon: AcervoSermon, sermonMap: Map<string, SermonI18n>): AcervoSermon {
  const key = `${sermon.clusterId}/${sermon.slug}`;
  const t = sermonMap.get(key);
  if (!t) return sermon;
  return {
    ...sermon,
    seoTitle: t.seoTitle,
    llmContext: t.llmContext,
    metaDescription: t.metaDescription,
  };
}

/** Helper: get localized cluster text with fallback to the original AcervoCluster. */
export function localizeCluster(
  cluster: AcervoCluster,
  clusterMap: Map<string, ClusterI18n>,
  sermonMap: Map<string, SermonI18n>,
): AcervoCluster {
  const ct = clusterMap.get(cluster.id);
  return {
    ...cluster,
    seoTitle: ct?.seoTitle ?? cluster.seoTitle,
    metaDescription: ct?.metaDescription ?? cluster.metaDescription,
    sermons: cluster.sermons.map((s) => localizeSermon(s, sermonMap)),
  };
}
