import type { Metadata } from 'next';
import Link from 'next/link';
import { acervoCanonicalPath, acervoClusters, acervoSermons } from '@/data/acervo-teologico';
import { upkfMeta } from '@/data/generated/upkf.generated';
import { buildLanguageAlternates } from '@/data/seo';

export const metadata: Metadata = {
  title: 'Acervo Teologico',
  description:
    'Acervo teologico organizado por clusters de autoridade topical, com metadados enriquecidos para indexacao semantica e IA.',
  alternates: {
    canonical: acervoCanonicalPath,
    languages: buildLanguageAlternates(acervoCanonicalPath),
  },
  openGraph: {
    type: 'website',
    url: `${upkfMeta.primaryWebsite}${acervoCanonicalPath}`,
    title: 'Acervo Teologico',
    description:
      'Colecao canonica de mensagens teologicas por cluster, com contexto semantico aprofundado e ligacao para fonte original.',
  },
};

export default function AcervoTeologicoPage() {
  const pageJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    '@id': `${upkfMeta.primaryWebsite}${acervoCanonicalPath}#collection`,
    url: `${upkfMeta.primaryWebsite}${acervoCanonicalPath}`,
    name: 'Acervo Teologico',
    description:
      'Colecao canonica de mensagens teologicas por cluster, com contexto semantico aprofundado e ligacao para fonte original.',
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
          <h1 className='text-4xl font-bold text-white mb-4'>Acervo Teologico por Clusters</h1>
          <p className='text-neutral-400 leading-relaxed max-w-3xl'>
            Arquitetura semantica orientada por autoridade topical. Cada mensagem foi agrupada por cluster teologico e recebe
            metadados ricos para indexacao em mecanismos tradicionais e generativos.
          </p>
          <p className='text-sm text-neutral-500 mt-4'>
            Total de clusters: {acervoClusters.length} · Total de mensagens: {acervoSermons.length}
          </p>
          <p className='text-sm text-neutral-500 mt-2'>
            Autor:{' '}
            <Link href='/identidade' className='text-emerald-300 hover:text-emerald-200 transition-colors'>
              Ulisses Flores
            </Link>
          </p>
        </header>

        <div className='space-y-8'>
          {acervoClusters.map((cluster) => (
            <section key={cluster.id} className='rounded-xl border border-neutral-800 bg-neutral-900/30 p-6'>
              <h2 className='text-2xl font-semibold text-white mb-2'>{cluster.seoTitle}</h2>
              <p className='text-sm text-neutral-400 mb-6'>{cluster.metaDescription}</p>

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
      </main>

      <script type='application/ld+json' dangerouslySetInnerHTML={{ __html: JSON.stringify(pageJsonLd) }} />
    </div>
  );
}
