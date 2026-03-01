import type { Metadata } from 'next';
import Link from 'next/link';
import { acervoCanonicalPath, acervoClusters, acervoPageDescription, acervoPageTitle, acervoSermons } from '@/data/acervo-teologico';
import { upkfMeta } from '@/data/generated/upkf.generated';
import { buildLanguageAlternates } from '@/data/seo';
import AuthorHubCard from '@/components/author-hub-card';

export const metadata: Metadata = {
  title: acervoPageTitle,
  description: acervoPageDescription,
  alternates: {
    canonical: acervoCanonicalPath,
    languages: buildLanguageAlternates(acervoCanonicalPath),
  },
  openGraph: {
    type: 'website',
    url: `${upkfMeta.primaryWebsite}${acervoCanonicalPath}`,
    title: acervoPageTitle,
    description: acervoPageDescription,
  },
};

export default function AcervoTeologicoPage() {
  const pageJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    '@id': `${upkfMeta.primaryWebsite}${acervoCanonicalPath}#collection`,
    url: `${upkfMeta.primaryWebsite}${acervoCanonicalPath}`,
    name: acervoPageTitle,
    description: acervoPageDescription,
    hasPart: acervoSermons.map((sermon) => ({
      '@id': `${upkfMeta.primaryWebsite}${sermon.canonicalPath}`,
    })),
  };

  return (
    <div className='min-h-screen bg-neutral-950 text-neutral-200'>
      <main className='max-w-6xl mx-auto px-6 py-20'>
        <Link href='/' className='text-sm text-neutral-400 hover:text-emerald-400 transition-colors'>
          Voltar para Home
        </Link>

        <header className='mt-8 mb-10'>
          <p className='text-xs uppercase tracking-widest text-emerald-400 mb-3'>Acervo Teologico</p>
          <h1 className='text-4xl font-bold text-white mb-4'>{acervoPageTitle}</h1>
          <p className='text-neutral-400 leading-relaxed max-w-3xl'>{acervoPageDescription}</p>
          <p className='text-sm text-neutral-500 mt-4'>
            Total de clusters: {acervoClusters.length} · Total de mensagens: {acervoSermons.length}
          </p>
        </header>

        <div className='space-y-8'>
          {acervoClusters.map((cluster) => (
            <section
              key={cluster.id}
              id={`cluster-${cluster.id}`}
              className='rounded-xl border border-neutral-800 bg-neutral-900/30 p-6 scroll-mt-24'
            >
              <h2 className='text-2xl font-semibold text-white mb-2'>{cluster.seoTitle}</h2>
              <p className='text-sm text-neutral-400 mb-3'>{cluster.metaDescription}</p>
              <p className='text-sm text-neutral-300 leading-relaxed mb-6 whitespace-pre-line'>{cluster.prose}</p>

              <div className='grid gap-4'>
                {cluster.sermons.map((sermon) => (
                  <article key={sermon.canonicalPath} className='rounded-lg border border-neutral-800 bg-neutral-950/60 p-4'>
                    <h3 className='text-lg font-semibold text-white mb-2'>
                      <Link href={sermon.canonicalPath} className='hover:text-emerald-400 transition-colors'>
                        {sermon.seoTitle}
                      </Link>
                    </h3>
                    <p className='text-xs text-neutral-500 mb-2'>Publicado em {sermon.publishedAt}</p>
                    <p className='text-sm text-neutral-300'>{sermon.llmContext}</p>
                  </article>
                ))}
              </div>
            </section>
          ))}
        </div>

        <AuthorHubCard />
      </main>

      <script type='application/ld+json' dangerouslySetInnerHTML={{ __html: JSON.stringify(pageJsonLd) }} />
    </div>
  );
}
