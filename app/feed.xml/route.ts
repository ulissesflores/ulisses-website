import { publications } from '@/data/publications';
import { upkfMeta } from '@/data/generated/upkf.generated';

export const revalidate = 3600;

function escapeXml(value: string): string {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&apos;');
}

function toRfc2822(date: string): string {
  const parsed = new Date(date);
  if (Number.isNaN(parsed.getTime())) {
    return new Date().toUTCString();
  }
  return parsed.toUTCString();
}

export async function GET() {
  const siteUrl = upkfMeta.primaryWebsite;
  const sorted = [...publications].sort((a, b) => {
    if (a.publishedAt === b.publishedAt) {
      return a.ordinal - b.ordinal;
    }
    return b.publishedAt.localeCompare(a.publishedAt);
  });

  const latestDate = sorted[0]?.updatedAt || upkfMeta.generatedAt;

  const itemsXml = sorted
    .map((publication) => {
      const link = `${siteUrl}/${publication.category}/${publication.id}`;
      const pdf = `${siteUrl}${publication.primaryPdfUrl || publication.downloadUrl}`;
      const categories = publication.tags.map((tag) => `<category>${escapeXml(tag)}</category>`).join('');

      return `<item>
  <title>${escapeXml(publication.title)}</title>
  <link>${escapeXml(link)}</link>
  <guid isPermaLink="true">${escapeXml(link)}</guid>
  <pubDate>${toRfc2822(publication.publishedAt)}</pubDate>
  <description>${escapeXml(publication.summary)}</description>
  <enclosure url="${escapeXml(pdf)}" type="application/pdf" length="0" />
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
