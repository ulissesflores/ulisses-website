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

export async function GET() {
  const baseUrl = upkfMeta.primaryWebsite;

  const resources = publications
    .map((publication) => ({
      path: publication.primaryPdfUrl || publication.downloadUrl,
      lastModified: publication.updatedAt,
      changefreq: 'monthly',
      priority: '0.7',
    }))
    .filter((resource) => isIndexableSitemapPath(resource.path));

  const uniqueResources = Array.from(new Map(resources.map((resource) => [resource.path, resource])).values());

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${uniqueResources
  .map(
    (resource) => `  <url>
    <loc>${escapeXml(`${baseUrl}${resource.path}`)}</loc>
    <lastmod>${escapeXml(resource.lastModified)}</lastmod>
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
