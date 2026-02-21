import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { knowledgeData } from '@/data/knowledge';
import { upkfMeta } from '@/data/generated/upkf.generated';

interface PageProps {
  params: Promise<{ collection: string }>;
}

export function generateStaticParams() {
  return knowledgeData.sermons.collections.map((collection) => ({
    collection: collection.slug,
  }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { collection } = await params;
  const series = knowledgeData.sermons.collections.find((item) => item.slug === collection);

  if (!series) {
    return { title: 'Sermon collection not found' };
  }

  return {
    title: `${series.name} | Sermons`,
    description: `Coleção canônica com ${series.items.length} mensagens da série "${series.name}".`,
    alternates: {
      canonical: series.canonicalPath,
    },
    openGraph: {
      type: 'website',
      url: `${upkfMeta.primaryWebsite}${series.canonicalPath}`,
      title: `${series.name} | Sermons`,
      description: `Canonical collection page for "${series.name}".`,
    },
  };
}

export default async function SermonCollectionPage({ params }: PageProps) {
  const { collection } = await params;
  const series = knowledgeData.sermons.collections.find((item) => item.slug === collection);

  if (!series) {
    notFound();
  }

  const seriesJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    '@id': `${upkfMeta.primaryWebsite}${series.canonicalPath}#collection`,
    url: `${upkfMeta.primaryWebsite}${series.canonicalPath}`,
    name: series.name,
    description: `Canonical collection page for "${series.name}".`,
    hasPart: series.items.map((item) => ({
      '@id': `${upkfMeta.primaryWebsite}${item.canonicalPath}`,
    })),
    isPartOf: {
      '@id': `${upkfMeta.primaryWebsite}/sermons#collection`,
    },
  };

  return (
    <div className='min-h-screen bg-neutral-950 text-neutral-200'>
      <main className='max-w-5xl mx-auto px-6 py-20'>
        <Link href='/sermons' className='text-sm text-neutral-400 hover:text-emerald-400 transition-colors'>
          Voltar para Sermons
        </Link>

        <header className='mt-8 mb-10'>
          <p className='text-xs uppercase tracking-widest text-emerald-400 mb-3'>Sermon Collection</p>
          <h1 className='text-4xl font-bold text-white mb-4'>{series.name}</h1>
          <p className='text-neutral-400'>Série com {series.items.length} mensagens canônicas indexadas individualmente.</p>
        </header>

        <div className='space-y-4'>
          {series.items.map((item) => (
            <article key={item.slug} className='rounded-xl border border-neutral-800 bg-neutral-900/30 p-6'>
              <div className='flex flex-wrap gap-3 text-xs text-neutral-500 mb-3'>
                <span className='rounded-full border border-neutral-700 px-2 py-1'>#{item.position}</span>
                <span>{item.publishedAt}</span>
              </div>
              <h2 className='text-xl font-semibold text-white mb-3'>
                <Link href={item.canonicalPath} className='hover:text-emerald-400 transition-colors'>
                  {item.name}
                </Link>
              </h2>
              <p className='text-sm text-neutral-400 mb-3'>{item.summary}</p>
              <a href={item.youtubeUrl} target='_blank' rel='noopener noreferrer' className='text-emerald-300 hover:text-emerald-200 text-sm'>
                Fonte original no YouTube
              </a>
            </article>
          ))}
        </div>
      </main>

      <script type='application/ld+json' dangerouslySetInnerHTML={{ __html: JSON.stringify(seriesJsonLd) }} />
    </div>
  );
}

