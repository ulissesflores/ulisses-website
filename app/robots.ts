import type { MetadataRoute } from 'next';
import { upkfMeta } from '@/data/generated/upkf.generated';

export default function robots(): MetadataRoute.Robots {
  const baseUrl = upkfMeta.primaryWebsite;

  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
    host: baseUrl,
  };
}
