import type { Metadata } from 'next';
import Link from 'next/link';
import { knowledgeData } from '@/data/knowledge';
import { upkfMeta } from '@/data/generated/upkf.generated';
import { buildLanguageAlternates } from '@/data/seo';

export const metadata: Metadata = {
  title: 'Sermons and Theological Talks',
  description:
    'Canonical index of sermons and theological talks with structured context, collection grouping, and source links.',
  alternates: {
    canonical: '/sermons',
    languages: buildLanguageAlternates('/sermons'),
  },
  openGraph: {
    type: 'website',
    url: `${upkfMeta.primaryWebsite}/sermons`,
    title: 'Sermons and Theological Talks',
    description:
      'Canonical index of sermon collections with individual pages, publication dates, and source links.',
  },
};

export default function SermonsPage() {
  const totalSermons = knowledgeData.sermons.collections.reduce((sum, collection) => sum + collection.items.length, 0);

  const pageJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    '@id': `${upkfMeta.primaryWebsite}/sermons#collection`,
    url: `${upkfMeta.primaryWebsite}/sermons`,
    name: 'Sermons and Theological Talks',
    description: 'Canonical index of sermon collections and talks.',
    hasPart: knowledgeData.sermons.collections.map((collection) => ({
      '@id': `${upkfMeta.primaryWebsite}${collection.canonicalPath}`,
    })),
  };

  return (
    <div className='min-h-screen bg-neutral-950 text-neutral-200'>
      <main className='max-w-5xl mx-auto px-6 py-20'>
        <Link href='/' className='text-sm text-neutral-400 hover:text-emerald-400 transition-colors'>
          Voltar para Home
        </Link>

        <header className='mt-8 mb-10'>
          <p className='text-xs uppercase tracking-widest text-emerald-400 mb-3'>Sermons</p>
          <h1 className='text-4xl font-bold text-white mb-4'>Sermons and Theological Talks</h1>
          <p className='text-neutral-400 leading-relaxed max-w-3xl'>
            Índice canônico de séries de sermões e mensagens teológicas, com páginas individuais para cada item e link para a
            fonte original.
          </p>
          <p className='text-sm text-neutral-500 mt-4'>
            Total de coleções: {knowledgeData.sermons.collections.length} · Total de sermões: {totalSermons}
          </p>
        </header>

        <div className='space-y-4'>
          {knowledgeData.sermons.collections.map((collection) => (
            <article key={collection.slug} className='rounded-xl border border-neutral-800 bg-neutral-900/30 p-6'>
              <h2 className='text-2xl font-semibold text-white mb-3'>
                <Link href={collection.canonicalPath} className='hover:text-emerald-400 transition-colors'>
                  {collection.name}
                </Link>
              </h2>
              <p className='text-sm text-neutral-400 mb-4'>
                Série com {collection.items.length} mensagens estruturadas em página canônica própria.
              </p>
              <Link href={collection.canonicalPath} className='text-emerald-300 hover:text-emerald-200 text-sm transition-colors'>
                Ver série completa
              </Link>
            </article>
          ))}
        </div>
      </main>

      <script type='application/ld+json' dangerouslySetInnerHTML={{ __html: JSON.stringify(pageJsonLd) }} />
    </div>
  );
}
