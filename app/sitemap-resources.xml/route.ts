import { upkfMeta } from '@/data/generated/upkf.generated';
import { publications } from '@/data/publications';

export const revalidate = 3600;

function escapeXml(value: string): string {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&apos;');
}

export async function GET() {
  const baseUrl = upkfMeta.primaryWebsite;
  const lastModified = upkfMeta.generatedAt;

  const resources = [
    { path: '/site.jsonld', changefreq: 'weekly', priority: '0.6' },
    { path: '/public.jsonld', changefreq: 'weekly', priority: '0.7' },
    { path: '/full.jsonld', changefreq: 'monthly', priority: '0.3' },
    { path: '/upkf-source.md', changefreq: 'monthly', priority: '0.4' },
    { path: '/.well-known/did.json', changefreq: 'weekly', priority: '0.6' },
    { path: '/.well-known/keybase.txt', changefreq: 'weekly', priority: '0.6' },
    { path: '/llms.txt', changefreq: 'weekly', priority: '0.8' },
    { path: '/llms-full.txt', changefreq: 'weekly', priority: '0.7' },
    { path: '/doi/manifest.json', changefreq: 'weekly', priority: '0.7' },
    { path: '/feed.xml', changefreq: 'daily', priority: '0.7' },
    ...publications.flatMap((publication) => [
      { path: publication.mdUrl, changefreq: 'monthly', priority: '0.55' },
      { path: publication.primaryPdfUrl || publication.downloadUrl, changefreq: 'monthly', priority: '0.65' },
      { path: publication.docxUrl, changefreq: 'monthly', priority: '0.52' },
    ]),
  ];

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${resources
  .map(
    (resource) => `  <url>
    <loc>${escapeXml(`${baseUrl}${resource.path}`)}</loc>
    <lastmod>${escapeXml(lastModified)}</lastmod>
    <changefreq>${resource.changefreq}</changefreq>
    <priority>${resource.priority}</priority>
  </url>`,
  )
  .join('\n')}
</urlset>
`;

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
    },
  });
}
