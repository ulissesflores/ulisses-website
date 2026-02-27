import type { MetadataRoute } from 'next';
import { upkfMeta } from '@/data/generated/upkf.generated';

export default function robots(): MetadataRoute.Robots {
  const parsed = new URL(upkfMeta.primaryWebsite);
  const origin = parsed.origin;
  const host = parsed.host;

  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/*.md$', '/*.docx$'],
      },
      {
        userAgent: ['GPTBot', 'ChatGPT-User', 'Google-Extended', 'ClaudeBot', 'PerplexityBot'],
        allow: '/',
        disallow: ['/*.md$', '/*.docx$'],
      },
    ],
    sitemap: [`${origin}/sitemap.xml`, `${origin}/sitemap-resources.xml`],
    host,
  };
}
