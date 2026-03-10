import type { Metadata } from 'next';
import Link from 'next/link';
import { AlertTriangle, Clock, GitFork, BarChart3, BookOpen, Zap } from 'lucide-react';
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
  title: 'IA 2027 em Português | Simulação sobre Soberania de IA e AGI',
  description:
    'Simulação prospectiva em português do cenário AI 2027: narrativa interativa sobre inteligência artificial geral (AGI), soberania tecnológica, corrida armamentista de IA e cenários de 2025 a 2035 com finais ramificados.',
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
    title: 'IA 2027 em Português | Simulação sobre Soberania de IA e AGI',
    description:
      'O que acontece quando a inteligência artificial supera a capacidade humana? Simulação narrativa com timeline interativa, métricas dinâmicas e dois finais alternativos.',
  },
};

export default async function IA2027Page({
  searchParams,
}: {
  searchParams: IA2027SearchParams;
}) {
  const resolvedSearchParams = await searchParams;
  const initialPath = parseInitialPath(resolvedSearchParams.path);
  const origin = upkfMeta.primaryWebsite;

  const pageJsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': ['WebPage', 'Article'],
        '@id': `${origin}${canonicalPath}#webpage`,
        url: `${origin}${canonicalPath}`,
        name: 'IA 2027 em Português — Simulação Prospectiva sobre Soberania de IA',
        headline: 'IA 2027 em Português: Simulação Interativa sobre AGI e o Futuro da Inteligência Artificial',
        description:
          'Simulação prospectiva traduzida e adaptada do cenário AI 2027, com timeline interativa, métricas dinâmicas, finais ramificados e análise sobre soberania de inteligência artificial.',
        inLanguage: 'pt-BR',
        isPartOf: {
          '@id': `${origin}/#website`,
        },
        author: {
          '@id': `${origin}/#person`,
        },
        translationOfWork: {
          '@type': 'CreativeWork',
          url: 'https://ai-2027.com/',
          name: 'AI 2027',
          inLanguage: 'en',
        },
        about: [
          {
            '@type': 'Thing',
            name: 'Artificial General Intelligence',
            description: 'Inteligência artificial com capacidade cognitiva comparável ou superior à humana.',
          },
          {
            '@type': 'Thing',
            name: 'AI Safety',
            description: 'Pesquisa em segurança e alinhamento de sistemas de inteligência artificial avançada.',
          },
        ],
        keywords: [
          'IA 2027', 'AGI', 'inteligência artificial geral', 'simulação IA',
          'soberania de IA', 'AI safety', 'alinhamento de IA', 'cenário prospectivo',
          'superinteligência', 'corrida armamentista IA',
        ],
      },
    ],
  };

  return (
    <div className='min-h-screen bg-neutral-950 text-neutral-200'>
      <div className='fixed inset-0 bg-[radial-gradient(circle_800px_at_50%_-200px,#10b98110,transparent)] pointer-events-none' />

      {/* Intro / Context Section */}
      <section className='relative max-w-4xl mx-auto px-6 pt-20 pb-12 z-10'>
        <Link href='/simulacoes' className='text-sm text-neutral-400 hover:text-emerald-400 transition-colors'>
          ← Voltar para Simulações
        </Link>

        <header className='mt-8 mb-10'>
          <p className='text-xs uppercase tracking-[0.2em] text-emerald-400 mb-3'>Simulação Prospectiva</p>
          <h1 className='text-4xl md:text-5xl font-bold text-white mb-4'>IA 2027 em Português</h1>
          <p className='text-xl text-neutral-300 leading-relaxed max-w-3xl'>
            Tradução e adaptação do cenário original{' '}
            <a
              href='https://ai-2027.com/'
              target='_blank'
              rel='noopener noreferrer'
              className='text-emerald-400 hover:underline font-medium'
            >
              AI 2027
            </a>{' '}
            — uma simulação narrativa sobre os próximos anos da inteligência artificial, soberania tecnológica
            e os riscos de uma corrida sem freios rumo à AGI.
          </p>
        </header>

        {/* Alert Card — Why this matters */}
        <div className='rounded-2xl border border-amber-500/20 bg-amber-950/15 p-6 mb-8'>
          <div className='flex items-start gap-3'>
            <AlertTriangle size={22} className='text-amber-400 shrink-0 mt-0.5' />
            <div>
              <h2 className='text-lg font-semibold text-white mb-2'>Por que isso importa</h2>
              <p className='text-neutral-300 leading-relaxed text-sm'>
                A soberania da inteligência artificial não é ficção científica — é uma questão geopolítica
                real que está se desenrolando agora. Esta simulação modela cenários de 2025 a 2035 baseados
                em projeções de pesquisadores de IA, economistas e analistas de segurança. O ponto central:
                o que acontece quando a IA começa a acelerar sua própria pesquisa? A resposta define o futuro.
              </p>
            </div>
          </div>
        </div>

        {/* How it works */}
        <div className='grid gap-4 md:grid-cols-2 mb-8'>
          {[
            {
              icon: Clock,
              title: 'Timeline interativa',
              description: 'Narrativa cronológica de 2025 a 2027 com acompanhamento por scroll. Cada seção representa um marco na evolução da IA.',
              color: 'text-cyan-400',
            },
            {
              icon: BarChart3,
              title: 'Métricas dinâmicas',
              description: 'Receita, capacidades, aprovação pública e população de agentes — indicadores que se atualizam conforme você avança na narrativa.',
              color: 'text-emerald-400',
            },
            {
              icon: GitFork,
              title: 'Finais ramificados',
              description: 'No ponto de bifurcação, escolha entre Slowdown (freio coordenado) e Race (corrida acelerada) — dois futuros drasticamente diferentes.',
              color: 'text-violet-400',
            },
            {
              icon: BookOpen,
              title: 'Expandables e referências',
              description: 'Seções expandíveis com detalhes técnicos e notas de rodapé para quem quer se aprofundar nos fundamentos da previsão.',
              color: 'text-amber-400',
            },
          ].map((item) => {
            const Icon = item.icon;
            return (
              <div key={item.title} className='rounded-xl border border-neutral-800 bg-neutral-900/40 p-5'>
                <Icon size={20} className={`${item.color} mb-3`} />
                <h3 className='text-sm font-semibold text-white mb-1'>{item.title}</h3>
                <p className='text-xs text-neutral-400 leading-relaxed'>{item.description}</p>
              </div>
            );
          })}
        </div>

        {/* CTA to start simulation */}
        <div className='text-center mb-8'>
          <a
            href='#simulacao'
            className='inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white px-8 py-4 rounded-full font-bold text-lg transition-all shadow-[0_0_30px_rgba(16,185,129,0.2)] hover:shadow-[0_0_40px_rgba(16,185,129,0.35)]'
          >
            <Zap size={20} />
            Iniciar Simulação
          </a>
        </div>

        <div className='max-w-xl mx-auto mb-4'>
          <AuthorHubCard
            label='Autor da Simulação'
            compact
            description='Tradução e adaptação conectadas ao hub canônico de identidade para validação autoral.'
          />
        </div>
      </section>

      {/* The Simulation Component */}
      <IA2027Simulation initialPath={initialPath} />

      {/* FAQ Section */}
      <section className='bg-neutral-950 text-neutral-200 pb-16'>
        <div className='max-w-4xl mx-auto px-6'>
          <FaqSection items={ia2027Faq} sectionTitle='Perguntas sobre a Simulação IA 2027' />
        </div>
      </section>

      <script
        id='structured-data-ia-2027'
        type='application/ld+json'
        dangerouslySetInnerHTML={{ __html: JSON.stringify(pageJsonLd) }}
      />
    </div>
  );
}
