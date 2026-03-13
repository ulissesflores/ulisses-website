import type { Metadata } from 'next';
import Link from 'next/link';
import { IA2027Simulation } from '@/components/simulations/ia-2027/ia-2027-simulation';
import { upkfMeta } from '@/data/generated/upkf.generated';
import { AuthorHubCard } from '@/components/author-hub-card';
import { FaqSection } from '@/components/faq-section';
import { ia2027Faq } from '@/data/faq';

const canonicalPath = '/simulacoes/ia-2027/corrida-estrategica';
const parentPath = '/simulacoes/ia-2027';

export const metadata: Metadata = {
  title: 'Corrida Estratégica: Cenário Race da IA 2027 | Ulisses Flores',
  description:
    'Explore o cenário de Corrida Estratégica da simulação IA 2027: aceleração máxima rumo à AGI, escalada de autonomia e risco de perda de controle humano. Análise por Ulisses Flores — Consultor em IA, Professor, Palestrante e Mestrando AGTU (EUA).',
  keywords: [
    'corrida estratégica IA',
    'race AGI',
    'corrida armamentista inteligência artificial',
    'superinteligência riscos',
    'AGI perda de controle',
    'cenários futuros IA',
    'soberania tecnológica',
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
    type: 'article',
    url: `${upkfMeta.primaryWebsite}${canonicalPath}`,
    title: 'Corrida Estratégica: Cenário Race da IA 2027',
    description:
      'Explore o cenário de Corrida Estratégica da simulação IA 2027: aceleração máxima rumo à AGI, escalada de autonomia e risco de perda de controle humano.',
    locale: 'pt_BR',
    images: [
      {
        url: `${upkfMeta.primaryWebsite}/simulacao-ia-2027-futuro-agi-ulisses-flores.jpg`,
        width: 2752,
        height: 1536,
        alt: 'IA 2027 · Corrida Estratégica — Cenário Race',
      },
    ],
  },
};

export default function CorridaEstrategicaPage() {
  const origin = upkfMeta.primaryWebsite;

  const pageJsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': ['WebPage', 'Article'],
        '@id': `${origin}${canonicalPath}#webpage`,
        url: `${origin}${canonicalPath}`,
        name: 'IA 2027 · Corrida Estratégica',
        headline: 'Corrida Estratégica: O Cenário de Aceleração Máxima Rumo à AGI',
        description:
          'Explore o cenário de Corrida Estratégica da simulação IA 2027: aceleração máxima rumo à AGI, escalada de autonomia e risco de perda de controle humano.',
        inLanguage: 'pt-BR',
        keywords:
          'corrida estratégica IA, race AGI, corrida armamentista inteligência artificial, superinteligência riscos, AGI perda de controle',
        isPartOf: {
          '@id': `${origin}${parentPath}#webpage`,
        },
        author: {
          '@id': `${origin}/#person`,
        },
        image: `${origin}/simulacao-ia-2027-futuro-agi-ulisses-flores.jpg`,
      },
    ],
  };

  return (
    <>
      {/* Hero Section */}
      <section className='bg-white text-black pt-20 pb-16 border-b border-gray-200'>
        <div className='max-w-4xl mx-auto px-6'>
          {/* Breadcrumb */}
          <div className='flex items-center gap-2 mb-6 flex-wrap'>
            <Link
              href='/simulacoes'
              className='text-xs font-mono uppercase tracking-widest text-blue-700 hover:underline'
            >
              Simulações Estratégicas
            </Link>
            <span className='text-xs text-gray-400'>→</span>
            <Link
              href='/simulacoes/ia-2027'
              className='text-xs font-mono uppercase tracking-widest text-blue-700 hover:underline'
            >
              IA 2027
            </Link>
            <span className='text-xs text-gray-400'>→</span>
            <span className='text-xs font-mono uppercase tracking-widest text-red-600'>
              Corrida Estratégica
            </span>
          </div>

          {/* H1 */}
          <h1 className='text-4xl sm:text-5xl font-bold leading-tight tracking-tight mb-6'>
            IA 2027 · Corrida Estratégica
          </h1>

          {/* Lead */}
          <p className='text-lg text-gray-700 leading-relaxed mb-8 max-w-3xl'>
            O cenário em que empresas e nações aceleram irrestritamente rumo à Inteligência
            Artificial Geral. Escalada de autonomia, concentração de poder e risco progressivo
            de perda de controle humano sobre sistemas de IA superinteligentes.
          </p>

          {/* Alert card */}
          <div className='border-l-4 border-red-500 bg-red-50 px-6 py-5 rounded-r-xl mb-10'>
            <p className='text-sm font-semibold text-red-800 uppercase tracking-wide mb-2'>
              Cenário Alternativo — Final Race
            </p>
            <p className='text-gray-800 leading-relaxed'>
              Este é o ramo de aceleração máxima da simulação IA 2027. A narrativa explora o que
              acontece quando a competição por domínio tecnológico supera qualquer esforço de
              contenção: quem vence a corrida, o que é perdido no caminho, e se o controle humano
              pode ser mantido em um mundo de AGI não alinhada.
            </p>
          </div>

          {/* CTA */}
          <div className='flex flex-col sm:flex-row items-start sm:items-center gap-4'>
            <Link
              href='/simulacoes/ia-2027'
              className='inline-flex items-center gap-2 bg-black text-white font-semibold px-6 py-3 rounded-full hover:bg-red-700 transition-colors text-sm'
            >
              ← Ver Simulação Completa
            </Link>
            <Link
              href='/simulacoes/ia-2027/desaceleracao-coordenada'
              className='text-xs text-gray-500 hover:text-gray-700 underline'
            >
              Ver cenário alternativo: Desaceleração Coordenada →
            </Link>
          </div>
        </div>
      </section>

      {/* Simulation locked to race path */}
      <IA2027Simulation initialPath='race' />

      {/* Author section */}
      <section className='bg-neutral-950 text-neutral-200 pb-12 pt-2'>
        <div className='max-w-7xl mx-auto px-6'>
          <AuthorHubCard
            label='Tradução & Curadoria'
            description='Adaptação, curadoria e análise técnica por Ulisses Flores — Cientista, Consultor em IA, Professor, Palestrante e Mestrando.'
          />
        </div>
      </section>

      {/* FAQ section */}
      <section className='bg-neutral-950 text-neutral-200 pb-16'>
        <div className='max-w-4xl mx-auto px-6'>
          <FaqSection
            items={ia2027Faq}
            sectionTitle='Perguntas sobre IA 2027 e o Futuro da Inteligência Artificial'
          />
        </div>
      </section>

      <script
        id='structured-data-corrida-estrategica'
        type='application/ld+json'
        dangerouslySetInnerHTML={{ __html: JSON.stringify(pageJsonLd) }}
      />
    </>
  );
}
