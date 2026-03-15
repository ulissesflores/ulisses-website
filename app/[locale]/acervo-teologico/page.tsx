import type { Metadata } from 'next';
import Link from 'next/link';
import { acervoCanonicalPath, acervoClusters, acervoSermons } from '@/data/acervo-teologico';
import { upkfMeta } from '@/data/generated/upkf.generated';
import { AuthorHubCard } from '@/components/author-hub-card';
import { FaqSection } from '@/components/faq-section';
import { acervoTeologicoFaq } from '@/data/faq';

export const metadata: Metadata = {
  title: 'Acervo Teológico e Arqueologia Espiritual | Ulisses Flores',
  description:
    'Mais de 50 sermões, pregações expositivas e análises de teologia histórica por Ulisses Flores. Rigor exegético e avivamento.',
  keywords: [
    'acervo teológico',
    'sermões',
    'pregações expositivas',
    'teologia histórica',
    'arqueologia espiritual',
    'exegese bíblica',
    'Ulisses Flores pregador',
    'clube santo',
    'avivamento',
  ],
  authors: [
    {
      name: upkfMeta.publicDisplayName || upkfMeta.displayName,
      url: `${upkfMeta.primaryWebsite}/identidade`,
    },
  ],
  alternates: {
    canonical: acervoCanonicalPath,
  },
  openGraph: {
    type: 'website',
    url: `${upkfMeta.primaryWebsite}${acervoCanonicalPath}`,
    title: 'Acervo Teológico e Arqueologia Espiritual | Ulisses Flores',
    description:
      'Mais de 50 sermões, pregações expositivas e análises de teologia histórica por Ulisses Flores. Rigor exegético e avivamento.',
    locale: 'pt_BR',
  },
};

export default function AcervoTeologicoPage() {
  const pageJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    '@id': `${upkfMeta.primaryWebsite}${acervoCanonicalPath}#collection`,
    url: `${upkfMeta.primaryWebsite}${acervoCanonicalPath}`,
    name: 'Acervo Teológico e Arqueologia Espiritual',
    description:
      'Mais de 50 sermões, pregações expositivas e análises de teologia histórica por Ulisses Flores.',
    inLanguage: 'pt-BR',
    isPartOf: {
      '@id': `${upkfMeta.primaryWebsite}/#website`,
    },
    author: {
      '@id': `${upkfMeta.primaryWebsite}/#person`,
    },
    hasPart: acervoSermons.map((sermon) => ({
      '@type': 'WebPage',
      '@id': `${upkfMeta.primaryWebsite}${sermon.canonicalPath}`,
      name: sermon.seoTitle,
      url: `${upkfMeta.primaryWebsite}${sermon.canonicalPath}`,
    })),
  };

  return (
    <div className='min-h-screen bg-neutral-950 text-neutral-200'>
      {/* ── Hero Section ── */}
      <section className='bg-neutral-950 text-neutral-200 pt-20 pb-16 border-b border-neutral-800'>
        <div className='max-w-4xl mx-auto px-6'>
          {/* Breadcrumb */}
          <div className='flex items-center gap-2 mb-6'>
            <Link href='/' className='text-xs font-mono uppercase tracking-widest text-emerald-400 hover:underline'>
              Home
            </Link>
            <span className='text-xs text-neutral-600'>→</span>
            <span className='text-xs font-mono uppercase tracking-widest text-neutral-500'>
              Acervo Teológico
            </span>
          </div>

          {/* H1 */}
          <h1 className='text-3xl md:text-5xl font-bold text-white mb-6 leading-tight tracking-tight'>
            Acervo Teológico e Arqueologia Espiritual
          </h1>

          {/* Lead paragraph */}
          <p className='text-lg text-neutral-400 leading-relaxed mb-8 max-w-3xl'>
            A fé e o intelecto não são grandezas opostas, mas pilares complementares da busca pela
            Verdade. Este acervo reúne mais de meia centena de sermões e exposições teológicas. Com
            um profundo rigor exegético e uma abordagem focada na &ldquo;Arqueologia Espiritual&rdquo;
            (como a explorada no Clube Santo e no metodismo clássico), este espaço é dedicado à
            edificação sólida, ao avivamento genuíno e à exposição contínua e sem concessões dos
            textos sagrados.
          </p>

          {/* Authority block */}
          <div className='border-l-4 border-cyan-700 bg-cyan-950/20 px-6 py-5 rounded-r-xl mb-10'>
            <p className='text-sm font-semibold text-cyan-400 uppercase tracking-wide mb-2'>
              Rigor exegético e avivamento genuíno
            </p>
            <p className='text-neutral-300 leading-relaxed'>
              Cada sermão e exposição é fundamentado em análise textual rigorosa, tradição reformada e
              pesquisa historiográfica — conectando os textos bíblicos ao contexto arqueológico,
              histórico e linguístico original. O acervo serve como base para formação teológica,
              estudos bíblicos e pesquisa acadêmica em teologia histórica.
            </p>
          </div>

          {/* Credential chips */}
          <div className='flex flex-wrap gap-2 mb-6'>
            {[
              'Pesquisador Polímata',
              'Pregador & Expositor Bíblico',
              'Mestrando AGTU (EUA)',
              'Análise Historiográfica',
              'Tradição Reformada',
              `+${acervoSermons.length} Sermões Indexados`,
            ].map((chip) => (
              <span
                key={chip}
                className='text-xs font-mono border border-neutral-700 bg-neutral-900/40 text-neutral-400 px-3 py-1 rounded-full'
              >
                {chip}
              </span>
            ))}
          </div>

          {/* Stats */}
          <p className='text-sm text-neutral-500'>
            Total de clusters: {acervoClusters.length} · Total de mensagens: {acervoSermons.length}
          </p>
          <div className='mt-4 max-w-xl'>
            <AuthorHubCard label='Autor & Pregador' compact description='Acervo com vínculo canônico de autoria para indexação semântica e GEO.' />
          </div>
        </div>
      </section>

      {/* ── Clusters Grid ── */}
      <main className='max-w-6xl mx-auto px-6 py-16'>
        <h2 className='text-2xl font-bold text-white mb-8'>Clusters Temáticos</h2>

        <div className='space-y-8'>
          {acervoClusters.map((cluster) => (
            <section
              key={cluster.id}
              id={`cluster-${cluster.id}`}
              className='rounded-xl border border-neutral-800 bg-neutral-900/30 p-6 scroll-mt-24'
            >
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
        <div className='mt-12'>
          <FaqSection items={acervoTeologicoFaq} sectionTitle='Perguntas sobre o Acervo Teológico' />
        </div>
      </main>

      <script type='application/ld+json' dangerouslySetInnerHTML={{ __html: JSON.stringify(pageJsonLd) }} />
    </div>
  );
}
