import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { knowledgeData } from '@/data/knowledge';
import { upkfMeta } from '@/data/generated/upkf.generated';

interface PageProps {
  params: Promise<{ collection: string; slug: string }>;
}

function findSermon(collectionSlug: string, sermonSlug: string) {
  const collection = knowledgeData.sermons.collections.find((item) => item.slug === collectionSlug);
  if (!collection) {
    return null;
  }

  const sermon = collection.items.find((item) => item.slug === sermonSlug);
  if (!sermon) {
    return null;
  }

  return { collection, sermon };
}

export function generateStaticParams() {
  return knowledgeData.sermons.collections.flatMap((collection) =>
    collection.items.map((item) => ({
      collection: collection.slug,
      slug: item.slug,
    })),
  );
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { collection, slug } = await params;
  const match = findSermon(collection, slug);

  if (!match) {
    return { title: 'Sermon not found' };
  }

  return {
    title: match.sermon.name,
    description: match.sermon.summary,
    alternates: {
      canonical: match.sermon.canonicalPath,
    },
    openGraph: {
      type: 'video.other',
      url: `${upkfMeta.primaryWebsite}${match.sermon.canonicalPath}`,
      title: match.sermon.name,
      description: match.sermon.summary,
    },
  };
}

export default async function SermonDetailPage({ params }: PageProps) {
  const { collection, slug } = await params;
  const match = findSermon(collection, slug);

  if (!match) {
    notFound();
  }

  const { collection: series, sermon } = match;
  const publisherId = knowledgeData.sermons.publisherRef.startsWith('http')
    ? knowledgeData.sermons.publisherRef
    : knowledgeData.sermons.publisherRef.startsWith('#')
      ? `${upkfMeta.primaryWebsite}${knowledgeData.sermons.publisherRef}`
      : `${upkfMeta.primaryWebsite}/#${knowledgeData.sermons.publisherRef}`;

  const sermonJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'VideoObject',
    additionalType: 'https://schema.org/Sermon',
    '@id': `${upkfMeta.primaryWebsite}${sermon.canonicalPath}#sermon`,
    name: sermon.name,
    description: sermon.summary,
    datePublished: sermon.publishedAt,
    inLanguage: knowledgeData.sermons.inLanguage,
    genre: 'Sermon',
    url: sermon.youtubeUrl,
    mainEntityOfPage: `${upkfMeta.primaryWebsite}${sermon.canonicalPath}`,
    isPartOf: {
      '@id': `${upkfMeta.primaryWebsite}${series.canonicalPath}#collection`,
    },
    publisher: {
      '@id': publisherId,
    },
  };

  return (
    <div className='min-h-screen bg-neutral-950 text-neutral-200'>
      <main className='max-w-3xl mx-auto px-6 py-20'>
        <Link href={series.canonicalPath} className='text-sm text-neutral-400 hover:text-emerald-400 transition-colors'>
          Voltar para coleção
        </Link>

        <header className='mt-8 mb-10'>
          <p className='text-xs uppercase tracking-widest text-emerald-400 mb-3'>{series.name}</p>
          <h1 className='text-3xl md:text-4xl font-bold text-white mb-4'>{sermon.name}</h1>
          <p className='text-sm text-neutral-500 mb-4'>Publicado em {sermon.publishedAt}</p>
          <p className='text-neutral-400 leading-relaxed'>{sermon.summary}</p>
        </header>

        <section className='rounded-xl border border-neutral-800 bg-neutral-900/30 p-6 space-y-5'>
          <h2 className='text-xl font-semibold text-white'>Fonte do Sermão</h2>
          <p className='text-neutral-300 leading-relaxed'>
            Esta página organiza os metadados canônicos da mensagem e mantém vínculo com a fonte original de distribuição.
          </p>
          <a href={sermon.youtubeUrl} target='_blank' rel='noopener noreferrer' className='text-emerald-300 hover:text-emerald-200 break-all'>
            {sermon.youtubeUrl}
          </a>
        </section>
      </main>

      <script type='application/ld+json' dangerouslySetInnerHTML={{ __html: JSON.stringify(sermonJsonLd) }} />
    </div>
  );
}
