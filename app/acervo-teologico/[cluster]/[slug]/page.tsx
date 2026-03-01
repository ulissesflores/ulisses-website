import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { acervoCanonicalPath, acervoSermons, getAcervoCluster, getAcervoSermon } from '@/data/acervo-teologico';
import { knowledgeData } from '@/data/knowledge';
import { upkfMeta } from '@/data/generated/upkf.generated';
import { buildLanguageAlternates } from '@/data/seo';
import AuthorHubCard from '@/components/author-hub-card';

interface PageProps {
  params: Promise<{ cluster: string; slug: string }>;
}

function extractYoutubeVideoId(urlValue: string): string {
  try {
    const parsed = new URL(urlValue);
    const byQuery = parsed.searchParams.get('v');
    if (byQuery) {
      return byQuery;
    }
    const parts = parsed.pathname.split('/').filter(Boolean);
    return parts.length > 0 ? parts[parts.length - 1] : '';
  } catch {
    const byQuery = urlValue.match(/[?&]v=([A-Za-z0-9_-]{6,})/);
    if (byQuery) {
      return byQuery[1];
    }
    const byPath = urlValue.match(/(?:embed|shorts|youtu\.be)\/([A-Za-z0-9_-]{6,})/);
    return byPath ? byPath[1] : '';
  }
}

function ensureIsoDate(dateValue: string): string {
  if (dateValue.includes('T')) {
    return dateValue;
  }
  return `${dateValue}T00:00:00Z`;
}

export function generateStaticParams() {
  return acervoSermons.map((sermon) => ({
    cluster: sermon.clusterId,
    slug: sermon.slug,
  }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { cluster, slug } = await params;
  const sermon = getAcervoSermon(cluster, slug);

  if (!sermon) {
    return { title: 'Mensagem nao encontrada' };
  }

  const videoId = extractYoutubeVideoId(sermon.youtubeUrl);
  const thumbnailUrl = videoId
    ? `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`
    : `${upkfMeta.primaryWebsite}/carlos-ulisses-flores-cto.jpg`;

  return {
    title: sermon.seoTitle,
    description: sermon.llmContext,
    authors: [
      {
        name: upkfMeta.publicDisplayName || upkfMeta.displayName,
        url: `${upkfMeta.primaryWebsite}/identidade`,
      },
    ],
    alternates: {
      canonical: sermon.canonicalPath,
      languages: buildLanguageAlternates(sermon.canonicalPath),
    },
    openGraph: {
      type: 'video.other',
      url: `${upkfMeta.primaryWebsite}${sermon.canonicalPath}`,
      title: sermon.seoTitle,
      description: sermon.llmContext,
      images: [thumbnailUrl],
    },
  };
}

export default async function AcervoSermonDetailPage({ params }: PageProps) {
  const { cluster, slug } = await params;

  const clusterEntry = getAcervoCluster(cluster);
  const sermon = getAcervoSermon(cluster, slug);

  if (!clusterEntry || !sermon) {
    notFound();
  }

  const publisherId = knowledgeData.sermons.publisherRef.startsWith('http')
    ? knowledgeData.sermons.publisherRef
    : knowledgeData.sermons.publisherRef.startsWith('#')
      ? `${upkfMeta.primaryWebsite}${knowledgeData.sermons.publisherRef}`
      : `${upkfMeta.primaryWebsite}/#${knowledgeData.sermons.publisherRef}`;
  const videoId = extractYoutubeVideoId(sermon.youtubeUrl);
  const thumbnailUrl = videoId
    ? `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`
    : `${upkfMeta.primaryWebsite}/carlos-ulisses-flores-cto.jpg`;
  const embedUrl = videoId ? `https://www.youtube.com/embed/${videoId}` : sermon.youtubeUrl;

  const sermonJsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'VideoObject',
        '@id': `${upkfMeta.primaryWebsite}${sermon.canonicalPath}#video`,
        additionalType: 'https://schema.org/Sermon',
        name: sermon.seoTitle,
        description: sermon.llmContext,
        uploadDate: ensureIsoDate(sermon.publishedAt),
        thumbnailUrl,
        embedUrl,
        image: [thumbnailUrl],
        inLanguage: knowledgeData.sermons.inLanguage,
        genre: 'Sermon',
        url: sermon.youtubeUrl,
        contentUrl: sermon.youtubeUrl,
        mainEntityOfPage: `${upkfMeta.primaryWebsite}${sermon.canonicalPath}`,
        publisher: {
          '@id': publisherId,
          '@type': 'Organization',
          logo: {
            '@type': 'ImageObject',
            url: `${upkfMeta.primaryWebsite}/carlos-ulisses-flores-cto.jpg`,
          },
        },
        isPartOf: {
          '@id': `${upkfMeta.primaryWebsite}${acervoCanonicalPath}#collection`,
        },
      },
      {
        '@type': 'Article',
        '@id': `${upkfMeta.primaryWebsite}${sermon.canonicalPath}#article`,
        headline: sermon.seoTitle,
        description: sermon.metaDescription,
        articleBody: sermon.llmContext,
        datePublished: sermon.publishedAt,
        dateModified: sermon.publishedAt,
        image: [thumbnailUrl],
        inLanguage: knowledgeData.sermons.inLanguage,
        mainEntityOfPage: `${upkfMeta.primaryWebsite}${sermon.canonicalPath}`,
        author: {
          '@id': `${upkfMeta.primaryWebsite}/#person`,
        },
        publisher: {
          '@id': publisherId,
          '@type': 'Organization',
          logo: {
            '@type': 'ImageObject',
            url: `${upkfMeta.primaryWebsite}/carlos-ulisses-flores-cto.jpg`,
          },
        },
        isPartOf: {
          '@id': `${upkfMeta.primaryWebsite}${acervoCanonicalPath}#collection`,
        },
        about: [clusterEntry.seoTitle, clusterEntry.metaDescription],
      },
    ],
  };

  return (
    <div className='min-h-screen bg-neutral-950 text-neutral-200'>
      <main className='max-w-3xl mx-auto px-6 py-20'>
        <Link href={acervoCanonicalPath} className='text-sm text-neutral-400 hover:text-emerald-400 transition-colors'>
          Voltar para Acervo Teologico
        </Link>

        <header className='mt-8 mb-10'>
          <p className='text-xs uppercase tracking-widest text-emerald-400 mb-3'>{clusterEntry.seoTitle}</p>
          <h1 className='text-3xl md:text-4xl font-bold text-white mb-4'>{sermon.seoTitle}</h1>
          <p className='text-sm text-neutral-500 mb-4'>Publicado em {sermon.publishedAt}</p>
          <p className='text-neutral-400 leading-relaxed whitespace-pre-line'>{clusterEntry.prose}</p>
        </header>

        <section className='rounded-xl border border-neutral-800 bg-neutral-900/30 p-6 space-y-5'>
          <div>
            <h2 className='text-xl font-semibold text-white mb-2'>Resumo do Estudo</h2>
            <p className='text-neutral-300 leading-relaxed'>{sermon.llmContext}</p>
          </div>

          <div>
            <h2 className='text-xl font-semibold text-white mb-2'>Enquadramento do Cluster</h2>
            <p className='text-neutral-300 leading-relaxed whitespace-pre-line'>{sermon.clusterMetaDescription}</p>
          </div>

          <div>
            <h2 className='text-xl font-semibold text-white mb-2'>Fonte da Mensagem</h2>
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

        <AuthorHubCard />
      </main>

      <script type='application/ld+json' dangerouslySetInnerHTML={{ __html: JSON.stringify(sermonJsonLd) }} />
    </div>
  );
}
