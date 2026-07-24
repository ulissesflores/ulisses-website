import type { MetadataRoute } from 'next';
import { publications, publicationCollections } from '@/data/publications';
import { knowledgeData } from '@/data/knowledge';
import { upkfMeta } from '@/data/generated/upkf.generated';
import { acervoCanonicalPath, acervoLatestPublishedAt } from '@/data/acervo-teologico';
import { artigosByDateDesc, artigosCanonicalPath, artigosLatestDate } from '@/data/artigos';
import { buildLanguageAlternates, noindexPublicationCategories } from '@/data/seo';

// ── Helpers ─────────────────────────────────────────────────────────────────────

export function isIndexableSitemapPath(path: string): boolean {
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

/**
 * Build the alternates.languages map for a given path.
 *
 * Delegates to the single source of truth (`buildLanguageAlternates`) so the
 * sitemap, `<link rel="alternate">` tags, and any other hreflang consumer
 * agree byte-for-byte. Emits 5 locale variants + `x-default`; the `pt-BR` and
 * `x-default` entries use the bare canonical URL (no `/pt-br/` prefix) to
 * avoid redirect loops in the hreflang cluster.
 */
function buildSitemapAlternates(path: string): Record<string, string> {
  return buildLanguageAlternates(path);
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
      languages: buildSitemapAlternates(path === '' ? '/' : path),
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

// ── Sitemap ─────────────────────────────────────────────────────────────────────

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

  // Publicações noindex (rebrand) ficam FORA do sitemap — página e artefatos
  // (PDF etc.). Submeter URL noindex no sitemap é sinal conflitante p/ Google.
  const indexablePublications = publications.filter(
    (publication) => !noindexPublicationCategories.includes(publication.category),
  );

  const publicationEntries = indexablePublications
    .map((publication) =>
      maybeMakeSitemapEntry(
        `/${publication.category}/${publication.id}`,
        publication.updatedAt,
        'monthly',
        publication.category === 'research' ? 0.9 : 0.8,
      ),
    )
    .filter((entry): entry is MetadataRoute.Sitemap[number] => Boolean(entry));

  const deepResearchEntries = indexablePublications
    .flatMap((publication) => {
      const date = publication.updatedAt;
      return [
        maybeMakeSitemapEntry(publication.mdUrl, date, 'monthly', 0.62),
        maybeMakeSitemapEntry(publication.primaryPdfUrl || publication.downloadUrl, date, 'monthly', 0.7),
        maybeMakeSitemapEntry(publication.docxUrl, date, 'monthly', 0.58),
      ];
    })
    .filter((entry): entry is MetadataRoute.Sitemap[number] => Boolean(entry));

  // Só o índice /certifications entra no sitemap. As páginas de item são noindex
  // (registro de credencial templado — thin) e sair do sitemap evita o sinal
  // conflitante "indexe-me" + meta noindex. Seguem rastreáveis pelos links internos.
  const certificationsEntries = [
    maybeMakeSitemapEntry('/certifications', knowledgeData.generatedAt, 'weekly', 0.78),
  ].filter((entry): entry is MetadataRoute.Sitemap[number] => Boolean(entry));

  const blogLatest =
    knowledgeData.blog.posts
      .map((post) => post.publishedAt)
      .sort((a, b) => b.localeCompare(a))[0] || latestSiteDate;

  // Só os índices /mundo-politico e /acervo-teologico entram no sitemap. As páginas
  // de item são noindex (off-brand + sem demanda) — sair do sitemap evita o sinal
  // conflitante. Seguem rastreáveis pelos links internos dos índices.
  const blogEntries = [
    maybeMakeSitemapEntry(knowledgeData.blog.canonicalPath, blogLatest, 'weekly', 0.75),
  ].filter((entry): entry is MetadataRoute.Sitemap[number] => Boolean(entry));

  const acervoEntries = [
    maybeMakeSitemapEntry(acervoCanonicalPath, acervoLatestPublishedAt, 'weekly', 0.76),
  ].filter((entry): entry is MetadataRoute.Sitemap[number] => Boolean(entry));

  // Seção autoral `/artigos` — indexável (não entra em noindexPublicationCategories).
  // O literal '/artigos' precisa aparecer aqui: validate-pre-deploy casa o
  // `canonicalPath` da página contra o texto deste arquivo.
  const artigosEntries = [
    maybeMakeSitemapEntry('/artigos', artigosLatestDate || latestSiteDate, 'weekly', 0.85),
    ...artigosByDateDesc.map((artigo) =>
      maybeMakeSitemapEntry(`${artigosCanonicalPath}/${artigo.slug}`, artigo.date, 'monthly', 0.8),
    ),
  ].filter((entry): entry is MetadataRoute.Sitemap[number] => Boolean(entry));

  const identidadeEntry = maybeMakeSitemapEntry('/identidade', upkfMeta.generatedAt, 'daily', 0.92);

  const commercialEntries = [
    maybeMakeSitemapEntry('/consultoria', upkfMeta.generatedAt, 'weekly', 0.95),
    maybeMakeSitemapEntry('/palestras', upkfMeta.generatedAt, 'weekly', 0.92),
  ].filter((entry): entry is MetadataRoute.Sitemap[number] => Boolean(entry));

  const simulationEntries = [
    maybeMakeSitemapEntry('/simulacoes', upkfMeta.generatedAt, 'weekly', 0.72),
    maybeMakeSitemapEntry('/simulacoes/ia-2027', upkfMeta.generatedAt, 'weekly', 0.68),
    maybeMakeSitemapEntry('/simulacoes/ia-2027/desaceleracao-coordenada', upkfMeta.generatedAt, 'weekly', 0.65),
    maybeMakeSitemapEntry('/simulacoes/ia-2027/corrida-estrategica', upkfMeta.generatedAt, 'weekly', 0.65),
    maybeMakeSitemapEntry('/whitepapers/projeto-psi', upkfMeta.generatedAt, 'weekly', 0.72),
    maybeMakeSitemapEntry('/projeto-psi', upkfMeta.generatedAt, 'weekly', 0.80),
    maybeMakeSitemapEntry('/simulacoes/goldenleaf', upkfMeta.generatedAt, 'weekly', 0.62),
    maybeMakeSitemapEntry('/clube-santo', upkfMeta.generatedAt, 'weekly', 0.68),
  ].filter((entry): entry is MetadataRoute.Sitemap[number] => Boolean(entry));

  return [
    makeSitemapEntry('/', latestSiteDate, 'weekly', 1),
    ...(identidadeEntry ? [identidadeEntry] : []),
    ...commercialEntries,
    ...artigosEntries,
    ...simulationEntries,
    ...collectionEntries,
    ...publicationEntries,
    ...deepResearchEntries,
    ...certificationsEntries,
    ...blogEntries,
    ...acervoEntries,
  ];
}
