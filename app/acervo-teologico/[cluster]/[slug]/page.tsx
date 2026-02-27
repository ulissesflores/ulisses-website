import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { acervoCanonicalPath, acervoSermons, getAcervoCluster, getAcervoSermon } from '@/data/acervo-teologico';
import { knowledgeData } from '@/data/knowledge';
import { upkfMeta } from '@/data/generated/upkf.generated';
import { buildLanguageAlternates } from '@/data/seo';

interface PageProps {
  params: Promise<{ cluster: string; slug: string }>;
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

  return {
    title: sermon.seoTitle,
    description: sermon.metaDescription,
    alternates: {
      canonical: sermon.canonicalPath,
      languages: buildLanguageAlternates(sermon.canonicalPath),
    },
    openGraph: {
      type: 'video.other',
      url: `${upkfMeta.primaryWebsite}${sermon.canonicalPath}`,
      title: sermon.seoTitle,
      description: sermon.metaDescription,
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

  const sermonJsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'VideoObject',
        '@id': `${upkfMeta.primaryWebsite}${sermon.canonicalPath}#video`,
        additionalType: 'https://schema.org/Sermon',
        name: sermon.seoTitle,
        description: sermon.llmContext,
        uploadDate: sermon.publishedAt,
        inLanguage: knowledgeData.sermons.inLanguage,
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
        headline: sermon.seoTitle,
        description: sermon.metaDescription,
        articleBody: sermon.llmContext,
        datePublished: sermon.publishedAt,
        inLanguage: knowledgeData.sermons.inLanguage,
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
          <p className='text-neutral-400 leading-relaxed'>{sermon.clusterMetaDescription}</p>
        </header>

        <section className='rounded-xl border border-neutral-800 bg-neutral-900/30 p-6 space-y-5'>
          <div>
            <h2 className='text-xl font-semibold text-white mb-2'>LLM Context</h2>
            <p className='text-neutral-300 leading-relaxed'>{sermon.llmContext}</p>
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
      </main>

      <script type='application/ld+json' dangerouslySetInnerHTML={{ __html: JSON.stringify(sermonJsonLd) }} />
    </div>
  );
}
