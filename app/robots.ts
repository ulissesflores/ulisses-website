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
        disallow: ['/*.md', '/*.docx'],
      },
      {
        userAgent: [
          'GPTBot',            // OpenAI crawler
          'ChatGPT-User',     // ChatGPT browsing
          'OAI-SearchBot',    // OpenAI search
          'Google-Extended',  // Gemini AI training
          'ClaudeBot',        // Anthropic Claude
          'PerplexityBot',    // Perplexity AI
          'DeepSeekBot',      // DeepSeek AI
          'Applebot-Extended', // Apple Intelligence
        ],
        allow: ['/', '/*.md'],
        disallow: ['/*.docx'],
      },
    ],
    sitemap: [`${origin}/sitemap.xml`, `${origin}/sitemap-resources.xml`],
    host,
  };
}
