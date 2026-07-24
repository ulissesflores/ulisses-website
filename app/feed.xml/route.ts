import { publications } from '@/data/publications';
import { artigoDateToIso, artigos, artigosCanonicalPath } from '@/data/artigos';
import { upkfMeta } from '@/data/generated/upkf.generated';

export const revalidate = 3600;

export function escapeXml(value: string): string {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&apos;');
}

export function toRfc2822(date: string): string {
  const parsed = new Date(date);
  if (Number.isNaN(parsed.getTime())) {
    return new Date().toUTCString();
  }
  return parsed.toUTCString();
}

/** Item do feed, normalizado — publicações e artigos entram na mesma lista. */
interface FeedEntry {
  title: string;
  link: string;
  /** Data de publicação; ordena o feed e vira o `pubDate`. */
  publishedAt: string;
  /** Data da última alteração — só alimenta o `lastBuildDate` do canal. */
  updatedAt: string;
  summary: string;
  tags: readonly string[];
  /** PDF anexo; artigos autorais não têm. */
  pdfUrl?: string;
  /** Desempate entre itens da mesma data (só as publicações usam). */
  ordinal: number;
}

export async function GET() {
  const siteUrl = upkfMeta.primaryWebsite;

  const publicationEntries: FeedEntry[] = publications.map((publication) => ({
    title: publication.title,
    link: `${siteUrl}/${publication.category}/${publication.id}`,
    publishedAt: publication.publishedAt,
    updatedAt: publication.updatedAt,
    summary: publication.summary,
    tags: publication.tags,
    pdfUrl: `${siteUrl}${publication.primaryPdfUrl || publication.downloadUrl}`,
    ordinal: publication.ordinal,
  }));

  const artigoEntries: FeedEntry[] = artigos.map((artigo) => {
    const iso = artigoDateToIso(artigo.date);
    return {
      title: artigo.title,
      link: `${siteUrl}${artigosCanonicalPath}/${artigo.slug}`,
      publishedAt: iso,
      updatedAt: iso,
      summary: artigo.summary,
      tags: artigo.tags,
      ordinal: 0,
    };
  });

  const sorted = [...publicationEntries, ...artigoEntries].sort((a, b) => {
    if (a.publishedAt === b.publishedAt) {
      return a.ordinal - b.ordinal;
    }
    return b.publishedAt.localeCompare(a.publishedAt);
  });

  const latestDate = sorted[0]?.updatedAt || upkfMeta.generatedAt;

  const itemsXml = sorted
    .map((entry) => {
      const categories = entry.tags.map((tag) => `<category>${escapeXml(tag)}</category>`).join('');
      const enclosure = entry.pdfUrl
        ? `\n  <enclosure url="${escapeXml(entry.pdfUrl)}" type="application/pdf" length="0" />`
        : '';

      return `<item>
  <title>${escapeXml(entry.title)}</title>
  <link>${escapeXml(entry.link)}</link>
  <guid isPermaLink="true">${escapeXml(entry.link)}</guid>
  <pubDate>${toRfc2822(entry.publishedAt)}</pubDate>
  <description>${escapeXml(entry.summary)}</description>${enclosure}
  ${categories}
</item>`;
    })
    .join('\n');

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
<channel>
  <title>Ulisses Flores - Research Feed</title>
  <link>${escapeXml(siteUrl)}</link>
  <description>${escapeXml(upkfMeta.description['pt-BR'] || 'Research and publications feed.')}</description>
  <language>pt-BR</language>
  <lastBuildDate>${toRfc2822(latestDate)}</lastBuildDate>
  <generator>ulisses-hub feed generator</generator>
${itemsXml}
</channel>
</rss>
`;

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/rss+xml; charset=utf-8',
      'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
    },
  });
}
