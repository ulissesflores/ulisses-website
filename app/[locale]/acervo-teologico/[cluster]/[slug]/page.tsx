import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { acervoCanonicalPath, acervoSermons, getAcervoCluster, getAcervoSermon } from '@/data/acervo-teologico';
import { knowledgeData } from '@/data/knowledge';
import { upkfMeta } from '@/data/generated/upkf.generated';
import { AuthorHubCard } from '@/components/author-hub-card';
import { defaultLocale, isLocale, localeToOgLocale, type Locale } from '@/data/i18n';
import { getDictionary } from '@/lib/get-dictionary';
import { buildSermonI18nMaps, localizeSermon, localizeCluster } from '@/data/sermons-i18n';
import { buildCanonical } from '@/data/seo';

interface PageProps {
  params: Promise<{ cluster: string; slug: string; locale: string }>;
}

export function generateStaticParams() {
  return acervoSermons.map((sermon) => ({
    cluster: sermon.clusterId,
    slug: sermon.slug,
  }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { cluster, slug, locale: rawLocale } = await params;
  const locale = (isLocale(rawLocale) ? rawLocale : defaultLocale) as Locale;
  const sermon = getAcervoSermon(cluster, slug);

  if (!sermon) {
    return { title: 'Not found' };
  }

  const { sermonMap } = buildSermonI18nMaps(locale);
  const ls = localizeSermon(sermon, sermonMap);

  return {
    title: ls.seoTitle,
    description: ls.llmContext,
    authors: [
      {
        name: upkfMeta.publicDisplayName || upkfMeta.displayName,
        url: `${upkfMeta.primaryWebsite}/identidade`,
      },
    ],
    alternates: {
      canonical: sermon.canonicalPath,
    },
    openGraph: {
      type: 'video.other',
      url: `${upkfMeta.primaryWebsite}${sermon.canonicalPath}`,
      title: ls.seoTitle,
      description: ls.llmContext,
      locale: localeToOgLocale[locale],
    },
  };
}

export default async function AcervoSermonDetailPage({ params }: PageProps) {
  const { cluster, slug, locale: rawLocale } = await params;
  const locale = (isLocale(rawLocale) ? rawLocale : defaultLocale) as Locale;
  const dict = await getDictionary(locale);
  const t = dict.acervoTeologico;

  const clusterEntry = getAcervoCluster(cluster);
  const sermon = getAcervoSermon(cluster, slug);

  if (!clusterEntry || !sermon) {
    notFound();
  }

  // Apply locale overlay
  const { sermonMap, clusterMap } = buildSermonI18nMaps(locale);
  const ls = localizeSermon(sermon, sermonMap);
  const lc = localizeCluster(clusterEntry, clusterMap, sermonMap);

  const publisherId = knowledgeData.sermons.publisherRef.startsWith('http')
    ? knowledgeData.sermons.publisherRef
    : knowledgeData.sermons.publisherRef.startsWith('#')
      ? `${upkfMeta.primaryWebsite}${knowledgeData.sermons.publisherRef}`
      : `${upkfMeta.primaryWebsite}/#${knowledgeData.sermons.publisherRef}`;

  const sermonJsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'VideoObject',
        '@id': `${upkfMeta.primaryWebsite}${sermon.canonicalPath}#video`,
        additionalType: 'https://schema.org/Sermon',
        name: ls.seoTitle,
        description: ls.llmContext || ls.seoTitle,
        uploadDate: sermon.publishedAt ? (sermon.publishedAt.includes('T') ? sermon.publishedAt : `${sermon.publishedAt}T00:00:00-03:00`) : undefined,
        thumbnailUrl: sermon.youtubeUrl ? (() => { const m = sermon.youtubeUrl.match(/(?:v=|\/embed\/|youtu\.be\/)([\w-]{11})/); return m ? `https://img.youtube.com/vi/${m[1]}/hqdefault.jpg` : undefined; })() : undefined,
        inLanguage: locale,
        genre: 'Sermon',
        url: sermon.youtubeUrl,
        contentUrl: sermon.youtubeUrl,
        mainEntityOfPage: `${upkfMeta.primaryWebsite}${sermon.canonicalPath}`,
        publisher: {
          '@id': publisherId,
        },
        isPartOf: {
          '@id': `${upkfMeta.primaryWebsite}${acervoCanonicalPath}#collection`,
        },
      },
      {
        '@type': 'Article',
        '@id': `${upkfMeta.primaryWebsite}${sermon.canonicalPath}#article`,
        headline: ls.seoTitle,
        description: ls.metaDescription,
        articleBody: ls.llmContext,
        datePublished: sermon.publishedAt ? (sermon.publishedAt.includes('T') ? sermon.publishedAt : `${sermon.publishedAt}T00:00:00-03:00`) : undefined,
        inLanguage: locale,
        mainEntityOfPage: `${upkfMeta.primaryWebsite}${sermon.canonicalPath}`,
        author: {
          '@id': `${upkfMeta.primaryWebsite}/#person`,
        },
        publisher: {
          '@id': publisherId,
        },
        isPartOf: {
          '@id': `${upkfMeta.primaryWebsite}${acervoCanonicalPath}#collection`,
        },
        about: [lc.seoTitle, lc.metaDescription],
      },
    ],
  };

  return (
    <div className='min-h-screen bg-neutral-950 text-neutral-200'>
      <main className='max-w-3xl mx-auto px-6 py-20'>
        <Link href={acervoCanonicalPath} className='text-sm text-neutral-400 hover:text-emerald-400 transition-colors'>
          {t.detail?.backLink ?? '← Back'}
        </Link>

        <header className='mt-8 mb-10'>
          <p className='text-xs uppercase tracking-widest text-emerald-400 mb-3'>{lc.seoTitle}</p>
          <h1 className='text-3xl md:text-4xl font-bold text-white mb-4'>{ls.seoTitle}</h1>
          <p className='text-sm text-neutral-500 mb-4'>{t.detail?.publishedAt ?? 'Published'} {sermon.publishedAt}</p>
          <div className='mb-4 max-w-xl'>
            <AuthorHubCard label={t.detail?.authorLabel ?? 'Author'} compact />
          </div>
          <p className='text-neutral-400 leading-relaxed'>{lc.metaDescription}</p>
        </header>

        <section className='rounded-xl border border-neutral-800 bg-neutral-900/30 p-6 space-y-5'>
          <div>
            <h2 className='text-xl font-semibold text-white mb-2'>{t.detail?.studySummary ?? 'Study Summary'}</h2>
            <p className='text-neutral-300 leading-relaxed'>{ls.llmContext}</p>
          </div>

          <div>
            <h2 className='text-xl font-semibold text-white mb-2'>{t.detail?.sourceLabel ?? 'Source'}</h2>
            <a
              href={sermon.youtubeUrl}
              target='_blank'
              rel='noopener noreferrer'
              className='text-emerald-300 hover:text-emerald-200 break-all transition-colors'
            >
              {sermon.youtubeUrl}
            </a>
          </div>
        </section>
      </main>

      <script type='application/ld+json' dangerouslySetInnerHTML={{ __html: JSON.stringify(sermonJsonLd) }} />
    </div>
  );
}
