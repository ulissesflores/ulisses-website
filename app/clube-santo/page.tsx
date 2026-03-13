import type { Metadata } from 'next';
import Link from 'next/link';
import { upkfMeta } from '@/data/generated/upkf.generated';
import { AuthorHubCard } from '@/components/author-hub-card';
import { FaqSection } from '@/components/faq-section';
import { clubeSantoFaq } from '@/data/faq';

const canonicalPath = '/clube-santo';

export const metadata: Metadata = {
  title: 'Clube Santo — Instituto Teológico e Comunidade de Formação Bíblica | Ulisses Flores',
  description:
    'O Clube Santo é o instituto teológico e comunidade de formação bíblica fundado por Ulisses Flores — Pesquisador Polímata, Pregador e Mestrando em IA pela AGTU (EUA). Acervo de sermões, estudos bíblicos e análise historiográfica.',
  keywords: [
    'clube santo',
    'instituto teológico',
    'comunidade bíblica',
    'formação teológica',
    'sermões',
    'estudos bíblicos',
    'Ulisses Flores teologia',
    'pregador',
    'análise historiográfica bíblica',
    'cânon bíblico',
  ],
  authors: [
    {
      name: upkfMeta.publicDisplayName || upkfMeta.displayName,
      url: `${upkfMeta.primaryWebsite}/identidade`,
    },
  ],
  alternates: {
    canonical: canonicalPath,
  },
  openGraph: {
    type: 'website',
    url: `${upkfMeta.primaryWebsite}${canonicalPath}`,
    title: 'Clube Santo — Instituto Teológico e Comunidade de Formação Bíblica | Ulisses Flores',
    description:
      'Instituto teológico e comunidade de formação bíblica fundado por Ulisses Flores — Pesquisador Polímata, Pregador e Mestrando em IA pela AGTU (EUA).',
    locale: 'pt_BR',
  },
};

export default function ClubeSantoPage() {
  const origin = upkfMeta.primaryWebsite;

  const pageJsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebPage',
        '@id': `${origin}${canonicalPath}#webpage`,
        url: `${origin}${canonicalPath}`,
        name: 'Clube Santo — Instituto Teológico e Comunidade de Formação Bíblica',
        description:
          'Instituto teológico e comunidade de formação bíblica com sermões, estudos e análise historiográfica.',
        inLanguage: 'pt-BR',
        isPartOf: {
          '@id': `${origin}/#website`,
        },
        author: {
          '@id': `${origin}/#person`,
        },
      },
      {
        '@type': 'Organization',
        '@id': `${origin}${canonicalPath}#organization`,
        name: 'Clube Santo',
        description:
          'Instituto teológico e comunidade de formação bíblica fundado por Ulisses Flores.',
        url: `${origin}${canonicalPath}`,
        founder: {
          '@id': `${origin}/#person`,
        },
      },
    ],
  };

  return (
    <>
      {/* Hero Section */}
      <section className='bg-white text-black pt-20 pb-16 border-b border-gray-200'>
        <div className='max-w-4xl mx-auto px-6'>
          {/* Breadcrumb */}
          <div className='flex items-center gap-2 mb-6'>
            <Link href='/' className='text-xs font-mono uppercase tracking-widest text-blue-700 hover:underline'>
              Home
            </Link>
            <span className='text-xs text-gray-400'>→</span>
            <span className='text-xs font-mono uppercase tracking-widest text-gray-500'>
              Clube Santo
            </span>
          </div>

          {/* H1 */}
          <h1 className='text-4xl sm:text-5xl font-bold leading-tight tracking-tight mb-6'>
            Instituto Teológico e Comunidade de Formação Bíblica
          </h1>

          {/* Lead paragraph */}
          <p className='text-lg text-gray-700 leading-relaxed mb-8 max-w-3xl'>
            O Clube Santo é o instituto teológico fundado por Ulisses Flores para formação bíblica
            rigorosa, análise historiográfica e comunidade de estudo. Reúne um acervo de mais de 50
            sermões, pesquisas sobre canonização escribal, historicidade bíblica e fundamentos
            transcendentes da ordem econômica — conectando teologia, história e ciência.
          </p>

          {/* Authority block */}
          <div className='border-l-4 border-blue-600 bg-blue-50 px-6 py-5 rounded-r-xl mb-10'>
            <p className='text-sm font-semibold text-blue-800 uppercase tracking-wide mb-2'>
              Rigor acadêmico aplicado à formação teológica
            </p>
            <p className='text-gray-800 leading-relaxed'>
              Como Pesquisador Polímata, Ulisses Flores aplica metodologia científica à análise
              bíblica — combinando arqueologia, historiografia, análise textual e tradição reformada.
              As pesquisas publicadas incluem análise exaustiva da historicidade de Jesus (métodos
              arqueológicos e historiográficos) e estudo histórico-crítico da formação do cânon bíblico.
            </p>
          </div>

          {/* Credential chips */}
          <div className='flex flex-wrap gap-2 mb-8'>
            {[
              'Pesquisador Polímata',
              'Pregador & Expositor Bíblico',
              'Mestrando AGTU (EUA)',
              'Análise Historiográfica',
              'Tradição Reformada',
              '+56 Sermões Indexados',
            ].map((credential) => (
              <span
                key={credential}
                className='text-xs font-mono border border-gray-300 bg-gray-50 text-gray-700 px-3 py-1 rounded-full'
              >
                {credential}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Content Sections */}
      <section className='bg-neutral-950 text-neutral-200 py-16'>
        <div className='max-w-5xl mx-auto px-6'>
          <h2 className='text-2xl font-bold text-white mb-8'>Coleções e Acervo</h2>

          <div className='grid sm:grid-cols-2 gap-6 mb-10'>
            {/* Acervo Teológico */}
            <article className='rounded-xl border border-neutral-800 bg-neutral-900/40 p-6'>
              <span className='text-[10px] uppercase tracking-[0.2em] text-emerald-300 border border-emerald-700/40 rounded-full px-3 py-1'>
                Acervo Principal
              </span>
              <h3 className='text-lg font-bold text-white mt-4 mb-2'>Acervo Teológico</h3>
              <p className='text-sm text-neutral-400 leading-relaxed mb-4'>
                Mais de 56 sermões indexados, organizados cronologicamente com exposição bíblica
                detalhada, notas exegéticas e referências cruzadas.
              </p>
              <Link
                href='/acervo-teologico'
                className='inline-flex items-center gap-2 border border-emerald-700/50 text-emerald-300 hover:bg-emerald-900/30 font-medium px-4 py-2 rounded-full transition-colors text-sm'
              >
                Explorar Acervo →
              </Link>
            </article>

            {/* Pesquisas */}
            <article className='rounded-xl border border-neutral-800 bg-neutral-900/40 p-6'>
              <span className='text-[10px] uppercase tracking-[0.2em] text-cyan-300 border border-cyan-700/40 rounded-full px-3 py-1'>
                Pesquisa Acadêmica
              </span>
              <h3 className='text-lg font-bold text-white mt-4 mb-2'>Publicações de Pesquisa</h3>
              <p className='text-sm text-neutral-400 leading-relaxed mb-4'>
                Pesquisas com rigor científico sobre historicidade bíblica, canonização escribal,
                fundamentos transcendentes da economia e intersecção fé-ciência.
              </p>
              <Link
                href='/research'
                className='inline-flex items-center gap-2 border border-cyan-700/50 text-cyan-300 hover:bg-cyan-900/30 font-medium px-4 py-2 rounded-full transition-colors text-sm'
              >
                Ver Pesquisas →
              </Link>
            </article>
          </div>

          {/* Featured Research Links */}
          <div className='rounded-xl border border-neutral-800 bg-neutral-900/30 p-6'>
            <h3 className='text-lg font-semibold text-white mb-4'>Publicações em Destaque</h3>
            <div className='space-y-3'>
              <Link
                href='/research/2024-historicity-jesus-archaeology'
                className='block text-sm text-emerald-300 hover:text-emerald-200 transition-colors'
              >
                📄 Análise Historiográfica e Arqueológica Exaustiva: A Historicidade de Jesus →
              </Link>
              <Link
                href='/research/2024-scribal-canonization-ezra'
                className='block text-sm text-emerald-300 hover:text-emerald-200 transition-colors'
              >
                📄 Canonização Escribal: Análise Histórico-Crítica da Formação do Cânon →
              </Link>
              <Link
                href='/essays/2024-theology-economic-order'
                className='block text-sm text-emerald-300 hover:text-emerald-200 transition-colors'
              >
                📄 Fundamentos Transcendentes da Ordem Econômica →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Author block */}
      <section className='bg-neutral-950 text-neutral-200 pb-4'>
        <div className='max-w-5xl mx-auto px-6'>
          <AuthorHubCard
            label='Fundador & Pesquisador'
            description='Clube Santo fundado e curado por Ulisses Flores — Pesquisador Polímata, Pregador, Consultor Estratégico de IA e Mestrando em IA pela AGTU (EUA).'
          />
        </div>
      </section>

      {/* CTA */}
      <section className='bg-neutral-950 text-neutral-200 py-12'>
        <div className='max-w-4xl mx-auto px-6 text-center'>
          <h2 className='text-xl font-bold text-white mb-3'>
            Interesse em formação teológica ou palestra sobre fé e ciência?
          </h2>
          <p className='text-neutral-400 mb-6 max-w-2xl mx-auto text-sm leading-relaxed'>
            Ulisses Flores ministra estudos bíblicos, palestras sobre a intersecção entre teologia
            e ciência, e oferece mentoria em pesquisa historiográfica bíblica. Entre em contato.
          </p>
          <Link
            href='/'
            className='inline-flex items-center gap-2 bg-white text-black font-semibold px-6 py-3 rounded-full hover:bg-gray-100 transition-colors text-sm'
          >
            Falar com Ulisses Flores →
          </Link>
        </div>
      </section>

      {/* FAQ */}
      <section className='bg-neutral-950 text-neutral-200 pb-16'>
        <div className='max-w-4xl mx-auto px-6'>
          <FaqSection
            items={clubeSantoFaq}
            sectionTitle='Perguntas sobre o Clube Santo'
          />
        </div>
      </section>

      <script
        id='structured-data-clube-santo'
        type='application/ld+json'
        dangerouslySetInnerHTML={{ __html: JSON.stringify(pageJsonLd) }}
      />
    </>
  );
}
