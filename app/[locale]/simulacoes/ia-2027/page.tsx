import { defaultLocale } from '@/data/i18n';
import type { Metadata } from 'next';
import Link from 'next/link';
import { IA2027Simulation } from '@/components/simulations/ia-2027/ia-2027-simulation';
import type { SimulationPath } from '@/components/simulations/ia-2027/types';
import { upkfMeta } from '@/data/generated/upkf.generated';
import { AuthorHubCard } from '@/components/author-hub-card';
import { FaqSection } from '@/components/faq-section';
import { ia2027Faq } from '@/data/faq';

const canonicalPath = '/simulacoes/ia-2027';

type IA2027SearchParams = Promise<{
  path?: string | string[];
}>;

function parseInitialPath(rawPath?: string | string[]): SimulationPath {
  const value = Array.isArray(rawPath) ? rawPath[0] : rawPath;
  if (value === 'slowdown' || value === 'race') {
    return value;
  }
  return 'main';
}

export const metadata: Metadata = {
  title: 'IA 2027: Simulação Interativa sobre o Futuro da Inteligência Artificial | AGI e Soberania',
  description:
    'Explore a única simulação interativa em português sobre a chegada da AGI (Inteligência Artificial Geral). Análise de cenários futuros, corrida tecnológica e impacto econômico por Ulisses Flores — Cientista, Consultor, Professor e Palestrante.',
  keywords: [
    'futuro da inteligência artificial',
    'cenários futuros IA',
    'o que é AGI',
    'inteligência artificial geral',
    'soberania tecnológica',
    'impacto da IA no mercado',
    'agentes autônomos',
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
    title: 'IA 2027: Simulação Interativa sobre o Futuro da Inteligência Artificial | AGI e Soberania',
    description:
      'Explore a única simulação interativa em português sobre a chegada da AGI. Análise de cenários futuros, corrida tecnológica e impacto econômico por Ulisses Flores — Cientista, Consultor, Professor e Palestrante.',
    locale: 'pt_BR',
    images: [
      {
        url: `${upkfMeta.primaryWebsite}/simulacao-ia-2027-futuro-agi-ulisses-flores.jpg`,
        width: 1200,
        height: 630,
        alt: 'Simulação Estratégica IA-2027 por Ulisses Flores',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'IA 2027: Simulação Interativa sobre o Futuro da Inteligência Artificial | AGI e Soberania',
    description:
      'Explore a única simulação interativa em português sobre a chegada da AGI. Análise de cenários futuros, corrida tecnológica e impacto econômico por Ulisses Flores.',
    images: [`${upkfMeta.primaryWebsite}/simulacao-ia-2027-futuro-agi-ulisses-flores.jpg`],
  },
};

export default async function IA2027Page({
  searchParams,
}: {
  searchParams: IA2027SearchParams;
}) {
  const resolvedSearchParams = await searchParams;
  const initialPath = parseInitialPath(resolvedSearchParams.path);

  const pageJsonLd = {
    '@context': 'https://schema.org',
    '@type': ['WebPage', 'Article', 'SoftwareApplication'],
    '@id': `${upkfMeta.primaryWebsite}${canonicalPath}#webpage`,
    url: `${upkfMeta.primaryWebsite}${canonicalPath}`,
    name: 'IA 2027: Simulação Interativa sobre o Futuro da Inteligência Artificial',
    headline: 'IA 2027: Simulação Interativa sobre o Futuro da Inteligência Artificial',
    description:
      'Explore a única simulação interativa em português sobre a chegada da AGI (Inteligência Artificial Geral). Análise de cenários futuros, corrida tecnológica e impacto econômico por Ulisses Flores — Cientista, Consultor, Professor e Palestrante.',
    inLanguage: defaultLocale,
    keywords: 'futuro da inteligência artificial, cenários futuros IA, o que é AGI, inteligência artificial geral, soberania tecnológica, impacto da IA no mercado, agentes autônomos',
    about: [
      {
        '@type': 'Thing',
        name: 'Artificial General Intelligence',
        sameAs: 'https://en.wikipedia.org/wiki/Artificial_general_intelligence',
      },
      {
        '@type': 'Thing',
        name: 'AI Safety',
        sameAs: 'https://en.wikipedia.org/wiki/AI_safety',
      },
    ],
    translationOfWork: {
      '@type': 'CreativeWork',
      url: 'https://ai-2027.com/',
      name: 'AI 2027',
      inLanguage: 'en',
    },
    isPartOf: {
      '@id': `${upkfMeta.primaryWebsite}/#website`,
    },
    author: {
      '@id': `${upkfMeta.primaryWebsite}/#person`,
    },
    applicationCategory: 'EducationalApplication',
    operatingSystem: 'Web',
    image: `${upkfMeta.primaryWebsite}/simulacao-ia-2027-futuro-agi-ulisses-flores.jpg`,
  };

  return (
    <>
      {/* Hero Section — server-rendered for SEO/GEO/LLM */}
      <section className='bg-neutral-950 text-neutral-200 pt-20 pb-16 border-b border-neutral-800'>
        <div className='max-w-4xl mx-auto px-6'>

          {/* Breadcrumb / Kicker */}
          <div className='flex items-center gap-2 mb-6'>
            <Link
              href='/simulacoes'
              className='text-xs font-mono uppercase tracking-widest text-emerald-400 hover:underline'
            >
              Simulações Estratégicas
            </Link>
            <span className='text-xs text-neutral-600'>→</span>
            <span className='text-xs font-mono uppercase tracking-widest text-neutral-500'>
              Cenários Futuros da IA
            </span>
          </div>

          {/* H1 */}
          <h1 className='text-4xl sm:text-5xl font-bold leading-tight tracking-tight mb-6 text-white'>
            IA 2027: Simulação Interativa sobre o Futuro da Inteligência Artificial
          </h1>

          {/* Lead paragraph */}
          <p className='text-lg text-neutral-400 leading-relaxed mb-8 max-w-3xl'>
            Os CEOs da OpenAI, Google DeepMind e Anthropic convergem em um ponto crítico: a
            Inteligência Artificial Geral (AGI) pode ser alcançada antes do final desta década.
            Quando a máquina superar a capacidade cognitiva humana, as regras que governam a
            economia global, o mercado de trabalho e o poder geopolítico serão reescritas de
            forma irreversível. Esta simulação modela de forma interativa os próximos anos
            dessa transição.
          </p>

          {/* Alert card — EEAT / Por que isso importa */}
          <div className='border-l-4 border-cyan-700 bg-cyan-950/20 px-6 py-5 rounded-r-xl mb-10'>
            <p className='text-sm font-semibold text-cyan-400 uppercase tracking-wide mb-2'>
              Por que isso importa
            </p>
            <p className='text-neutral-300 leading-relaxed'>
              A soberania tecnológica não é mais ficção científica; é a disputa econômica e
              arquitetônica mais urgente do nosso tempo. Como cientista, consultor em IA e
              criador desta adaptação, estruturei este cenário baseado em modelagens de Harvard,
              MIRI e analistas de segurança de IA. O ponto de ruptura central explorado aqui
              é: o que acontece com a economia e a infraestrutura de sistemas quando a IA começa
              a acelerar sua própria pesquisa de forma recursiva? O ramo que escolhermos
              definirá o futuro.
            </p>
          </div>

          {/* Feature cards */}
          <div className='grid grid-cols-1 sm:grid-cols-2 gap-4 mb-10'>
            {[
              {
                title: 'Linha do Tempo 2025–2027',
                body: 'Narrativa cronológica baseada em projeções reais de evolução de hardware e software.',
              },
              {
                title: 'Métricas de Impacto em Tempo Real',
                body: 'Acompanhe a receita corporativa, aprovação pública e proliferação de agentes autônomos.',
              },
              {
                title: 'Ponto de Bifurcação (Slowdown vs. Race)',
                body: 'Você decide o desfecho: uma pausa coordenada global ou uma corrida armamentista pelo domínio da AGI.',
              },
              {
                title: 'Arquitetura e Fundamentos Técnicos',
                body: 'Notas de rodapé expansíveis detalhando a engenharia de sistemas e o impacto macroeconômico por trás de cada previsão.',
              },
            ].map((card) => (
              <div
                key={card.title}
                className='border border-neutral-800 rounded-xl p-5 bg-neutral-900/40'
              >
                <p className='font-semibold text-sm text-white mb-1'>{card.title}</p>
                <p className='text-sm text-neutral-400 leading-relaxed'>{card.body}</p>
              </div>
            ))}
          </div>

          {/* CTA */}
          <div className='flex flex-col sm:flex-row items-start sm:items-center gap-4'>
            <a
              href='#ia-2027-sim'
              className='inline-flex items-center gap-2 bg-emerald-700 text-white font-semibold px-6 py-3 rounded-full hover:bg-emerald-600 transition-colors text-sm'
            >
              Iniciar Simulação →
            </a>
            <p className='text-xs text-neutral-500 max-w-sm'>
              Tradução e adaptação do cenário original publicado em{' '}
              <a
                href='https://ai-2027.com/'
                target='_blank'
                rel='noopener noreferrer'
                className='underline hover:text-gray-700'
              >
                ai-2027.com
              </a>{' '}
              — baseado em modelagens de Harvard, MIRI e analistas de segurança de IA.
            </p>
          </div>
        </div>
      </section>

      {/* Simulation */}
      <IA2027Simulation initialPath={initialPath} />

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
        id='structured-data-ia-2027'
        type='application/ld+json'
        dangerouslySetInnerHTML={{ __html: JSON.stringify(pageJsonLd) }}
      />
    </>
  );
}
