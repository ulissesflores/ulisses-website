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
        width: 2752,
        height: 1536,
        alt: 'IA 2027: Simulação Interativa sobre o Futuro da Inteligência Artificial — AGI Strategic Simulation',
      },
    ],
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
        '@type': ['WebPage', 'Article', 'SoftwareApplication'],
        '@id': `${origin}${canonicalPath}#webpage`,
        url: `${origin}${canonicalPath}`,
        name: 'IA 2027: Simulação Interativa sobre o Futuro da Inteligência Artificial',
        headline: 'IA 2027: Simulação Interativa sobre o Futuro da Inteligência Artificial',
        description:
          'Explore a única simulação interativa em português sobre a chegada da AGI (Inteligência Artificial Geral). Análise de cenários futuros, corrida tecnológica e impacto econômico por Ulisses Flores — Cientista, Consultor, Professor e Palestrante.',
        inLanguage: 'pt-BR',
        keywords: 'futuro da inteligência artificial, cenários futuros IA, o que é AGI, inteligência artificial geral, soberania tecnológica, impacto da IA no mercado, agentes autônomos',
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
            sameAs: 'https://en.wikipedia.org/wiki/Artificial_general_intelligence',
            description: 'Inteligência artificial com capacidade cognitiva comparável ou superior à humana.',
          },
          {
            '@type': 'Thing',
            name: 'AI Safety',
            sameAs: 'https://en.wikipedia.org/wiki/AI_safety',
            description: 'Pesquisa em segurança e alinhamento de sistemas de inteligência artificial avançada.',
          },
        ],
        // Resolve SoftwareApplication required fields
        applicationCategory: 'WebApplication',
        operatingSystem: 'Any',
        offers: {
          '@type': 'Offer',
          price: '0',
          priceCurrency: 'BRL',
        },
        // Resolve Article image warning
        image: `${origin}/simulacao-ia-2027-futuro-agi-ulisses-flores.jpg`,
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
          <p className='text-xs uppercase tracking-[0.2em] text-emerald-400 mb-3'>Simulações Estratégicas → Cenários Futuros da IA</p>
          <h1 className='text-4xl md:text-5xl font-bold text-white mb-4'>
            IA 2027: Simulação Interativa sobre o Futuro da Inteligência Artificial
          </h1>
          <p className='text-xl text-neutral-300 leading-relaxed max-w-3xl'>
            Os CEOs da OpenAI, Google DeepMind e Anthropic convergem em um ponto crítico: a Inteligência
            Artificial Geral (AGI) pode ser alcançada antes do final desta década. Quando a máquina superar
            a capacidade cognitiva humana, as regras que governam a economia global, o mercado de trabalho e
            o poder geopolítico serão reescritas de forma irreversível. Esta simulação modela de forma
            interativa os próximos anos dessa transição.
          </p>
        </header>

        {/* Alert Card — Why this matters */}
        <div className='rounded-2xl border border-amber-500/20 bg-amber-950/15 p-6 mb-8'>
          <div className='flex items-start gap-3'>
            <AlertTriangle size={22} className='text-amber-400 shrink-0 mt-0.5' />
            <div>
              <h2 className='text-lg font-semibold text-white mb-2'>Por que isso importa</h2>
              <p className='text-neutral-300 leading-relaxed text-sm'>
                A soberania tecnológica não é mais ficção científica; é a disputa econômica e arquitetônica
                mais urgente do nosso tempo. Como cientista, consultor em IA e criador desta adaptação,
                estruturei este cenário baseado em modelagens de Harvard, MIRI e analistas de segurança de IA.
                O ponto de ruptura central explorado aqui é: o que acontece com a economia e a infraestrutura
                de sistemas quando a IA começa a acelerar sua própria pesquisa de forma recursiva? O ramo que
                escolhermos definirá o futuro.
              </p>
            </div>
          </div>
        </div>

        {/* How it works */}
        <div className='grid gap-4 md:grid-cols-2 mb-8'>
          {[
            {
              icon: Clock,
              title: 'Linha do Tempo 2025–2027',
              description: 'Narrativa cronológica baseada em projeções reais de evolução de hardware e software.',
              color: 'text-cyan-400',
            },
            {
              icon: BarChart3,
              title: 'Métricas de Impacto em Tempo Real',
              description: 'Acompanhe a receita corporativa, aprovação pública e proliferação de agentes autônomos.',
              color: 'text-emerald-400',
            },
            {
              icon: GitFork,
              title: 'Ponto de Bifurcação (Slowdown vs. Race)',
              description: 'Você decide o desfecho: uma pausa coordenada global ou uma corrida armamentista pelo domínio da AGI.',
              color: 'text-violet-400',
            },
            {
              icon: BookOpen,
              title: 'Arquitetura e Fundamentos Técnicos',
              description: 'Notas de rodapé expansíveis detalhando a engenharia de sistemas e o impacto macroeconômico por trás de cada previsão.',
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
            href='#ia-2027-sim'
            className='inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white px-8 py-4 rounded-full font-bold text-lg transition-all shadow-[0_0_30px_rgba(16,185,129,0.2)] hover:shadow-[0_0_40px_rgba(16,185,129,0.35)]'
          >
            <Zap size={20} />
            Iniciar Simulação
          </a>
        </div>

        <div className='max-w-xl mx-auto mb-4'>
          <AuthorHubCard
            label='Tradução & Curadoria'
            compact
            description='Adaptação, curadoria e análise técnica por Ulisses Flores — Cientista, Consultor em IA, Professor, Palestrante e Mestrando.'
          />
        </div>
      </section>

      {/* The Simulation Component */}
      <IA2027Simulation initialPath={initialPath} />

      {/* FAQ Section */}
      <section className='bg-neutral-950 text-neutral-200 pb-16'>
        <div className='max-w-4xl mx-auto px-6'>
          <FaqSection items={ia2027Faq} sectionTitle='Perguntas sobre IA 2027 e o Futuro da Inteligência Artificial' />
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
