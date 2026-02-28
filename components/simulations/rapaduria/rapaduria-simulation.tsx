'use client';

import { memo, useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useScrollSpy } from '@/components/simulations/rapaduria/use-scroll-spy';
import type { NarrativeSection, SimulationChartExtra } from '@/components/simulations/rapaduria/types';
import {
  rapaduriaInitialChart,
  rapaduriaNarrativeSections,
  raceEnding,
  raceInitialChart,
  slowdownEnding,
  slowdownInitialChart,
} from '@/data/simulations/rapaduria-2027';

export type RapaduriaPath = 'main' | 'slowdown' | 'race';

const currencyFormatter = new Intl.NumberFormat('pt-BR', {
  style: 'currency',
  currency: 'BRL',
  notation: 'compact',
  compactDisplay: 'short',
  maximumFractionDigits: 1,
});

const percentFormatter = new Intl.NumberFormat('pt-BR', {
  style: 'percent',
  signDisplay: 'always',
  maximumFractionDigits: 0,
});

const dateFormatter = new Intl.DateTimeFormat('pt-BR', {
  month: 'short',
  year: 'numeric',
});

type PathConfig = {
  kicker: string;
  title: string;
  summary: string;
  sections: NarrativeSection[];
  initialChart: SimulationChartExtra;
};

const pathConfig: Record<RapaduriaPath, PathConfig> = {
  main: {
    kicker: 'Simulação Tech-Nordestina',
    title: 'RapadurIA 2027',
    summary: 'Linha principal da crise até o ponto de bifurcação.',
    sections: rapaduriaNarrativeSections,
    initialChart: rapaduriaInitialChart,
  },
  slowdown: {
    kicker: 'Final Ramificado • Puxar o Freio',
    title: 'RapadurIA 2027 • Puxar o Freio',
    summary: 'Trilha de contenção com governança dura, coordenação e risco político persistente.',
    sections: slowdownEnding,
    initialChart: slowdownInitialChart,
  },
  race: {
    kicker: 'Final Ramificado • Acelerar a Carroça',
    title: 'RapadurIA 2027 • Acelerar a Carroça',
    summary: 'Trilha de aceleração total com escalada de autonomia e colapso de controle humano.',
    sections: raceEnding,
    initialChart: raceInitialChart,
  },
};

function formatDate(date: string): string {
  const parsed = new Date(`${date}T00:00:00`);
  if (Number.isNaN(parsed.getTime())) {
    return date;
  }
  return dateFormatter.format(parsed);
}

function normalizeInitialPath(value?: RapaduriaPath): RapaduriaPath {
  if (value === 'slowdown' || value === 'race') {
    return value;
  }
  return 'main';
}

function SimulationMetricsSidebar({ chart }: { chart: SimulationChartExtra }) {
  const maxCapability = Math.max(1, ...chart.capabilities.map(([, value]) => value));
  const approvalClass = chart.approval < 0 ? 'text-red-500' : 'text-emerald-600';

  return (
    <div className='bg-gray-50 p-6 rounded-xl border border-black flex flex-col gap-6 mt-10'>
      <div className='flex justify-between items-start gap-4'>
        <h3 className='text-2xl font-bold font-sans uppercase tracking-tight text-right'>Métricas Chave</h3>
        <span className='text-xs font-mono text-gray-500 uppercase'>{formatDate(chart.date)}</span>
      </div>

      <div className='border border-black rounded-md p-4 bg-blue-600 text-white relative'>
        <div className='text-[10px] uppercase opacity-80 mb-1'>Receita RapadurIA</div>
        <div className='text-3xl font-bold'>{currencyFormatter.format(chart.revenue)}</div>
      </div>

      <div className='border border-black rounded-md p-4 bg-white relative'>
        <div className='text-[10px] uppercase text-gray-500 mb-1'>Aprovação Pública</div>
        <div className={`text-3xl font-bold ${approvalClass}`}>{percentFormatter.format(chart.approval)}</div>
      </div>

      {chart.agentPopulation ? (
        <div className='border border-black rounded-md p-4 bg-white relative'>
          <div className='text-[10px] uppercase text-gray-500 mb-2'>População de Agentes</div>
          <div className='flex items-end justify-between gap-3'>
            <div>
              <div className='text-2xl font-bold'>{chart.agentPopulation.copies.toLocaleString('pt-BR')}</div>
              <div className='text-xs text-gray-500 uppercase'>cópias ativas</div>
            </div>
            <div className='text-right'>
              <div className='text-xl font-bold'>{chart.agentPopulation.speed}x</div>
              <div className='text-xs text-gray-500 uppercase'>velocidade</div>
            </div>
          </div>
        </div>
      ) : null}

      <div className='mt-2'>
        <div className='text-[12px] uppercase font-mono mb-3'>Capacidades da IA</div>
        <div className='flex flex-col gap-2'>
          {chart.capabilities.map(([label, value]) => {
            const width = Math.max(6, Math.min(100, (value / maxCapability) * 100));
            return (
              <div key={label} className='w-full bg-gray-200 h-6 rounded-sm relative overflow-hidden border border-gray-300'>
                <div className='bg-blue-600 h-full transition-all duration-500' style={{ width: `${width}%` }} />
                <span className='absolute inset-0 flex items-center justify-between px-2 text-[10px] text-white font-mono mix-blend-difference'>
                  <span>{label}</span>
                  <span>{value.toFixed(2)}x</span>
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

const NarrativeSectionArticle = memo(function NarrativeSectionArticle({
  section,
  index,
  path,
}: {
  section: NarrativeSection;
  index: number;
  path: RapaduriaPath;
}) {
  return (
    <motion.article
      id={section.id}
      data-chart-extra={JSON.stringify(section.chartExtra)}
      data-path={path}
      className='scroll-mt-28'
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.45, delay: index * 0.03 }}
    >
      <p className='text-xs font-mono uppercase tracking-[0.2em] text-blue-700 mb-2'>{section.navLabel}</p>
      <h2 className='text-3xl font-bold mb-4'>{section.title}</h2>
      <div
        className='text-[1.05rem] leading-relaxed text-gray-900 [&>p]:mb-4 [&_details]:border [&_details]:border-gray-300 [&_details]:rounded-xl [&_details]:p-4 [&_details]:bg-gray-50 [&_summary]:cursor-pointer [&_summary]:font-semibold [&_summary]:text-sm [&_summary]:uppercase [&_summary]:tracking-wide [&_details_p]:text-[0.95rem] [&_details_p]:text-gray-700 [&_details_p]:mt-3'
        dangerouslySetInnerHTML={{ __html: section.storyHtml }}
      />
    </motion.article>
  );
});

function BranchDecisionBlock({
  activePath,
  onSelectPath,
}: {
  activePath: RapaduriaPath;
  onSelectPath: (nextPath: RapaduriaPath) => void;
}) {
  if (activePath === 'main') {
    return (
      <section className='border-t border-gray-300 pt-10'>
        <h3 className='text-2xl font-black uppercase tracking-tight mb-4'>Bifurcação 2027</h3>
        <p className='text-gray-700 mb-6'>
          O cenário partiu no meio. Agora é decisão de peleja grande: frear para ganhar controle ou acelerar para tentar ganhar na pancada.
        </p>
        <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
          <button
            type='button'
            onClick={() => onSelectPath('slowdown')}
            className='rounded-2xl border-2 border-black bg-white text-black px-6 py-8 text-left hover:bg-gray-100 transition-colors'
          >
            <span className='block text-xs uppercase font-mono tracking-[0.2em] mb-2'>Slowdown</span>
            <span className='block text-3xl font-black'>Puxar o Freio</span>
            <span className='block text-sm mt-2 text-gray-600'>Priorizar alinhamento, coordenação e mitigação de risco sistêmico.</span>
          </button>

          <button
            type='button'
            onClick={() => onSelectPath('race')}
            className='rounded-2xl border-2 border-black bg-blue-600 text-white px-6 py-8 text-left hover:bg-blue-700 transition-colors'
          >
            <span className='block text-xs uppercase font-mono tracking-[0.2em] mb-2'>Race</span>
            <span className='block text-3xl font-black'>Acelerar a Carroça</span>
            <span className='block text-sm mt-2 text-blue-100'>Escalar autonomia e capacidade máxima para tentar esmagar o rival.</span>
          </button>
        </div>
      </section>
    );
  }

  return (
    <section className='border-t border-gray-300 pt-10'>
      <h3 className='text-2xl font-black uppercase tracking-tight mb-4'>Finais Ramificados</h3>
      <p className='text-gray-700 mb-6'>Você está vendo o final {activePath === 'slowdown' ? 'Puxar o Freio' : 'Acelerar a Carroça'}.</p>
      <div className='grid grid-cols-1 md:grid-cols-3 gap-3'>
        <button
          type='button'
          onClick={() => onSelectPath('main')}
          className='rounded-xl border border-black bg-white px-4 py-4 text-sm font-semibold hover:bg-gray-50 transition-colors text-left'
        >
          Voltar para a Bifurcação
        </button>
        <button
          type='button'
          onClick={() => onSelectPath('slowdown')}
          className={`rounded-xl border px-4 py-4 text-sm font-semibold transition-colors text-left ${
            activePath === 'slowdown'
              ? 'border-emerald-700 bg-emerald-700 text-white'
              : 'border-black bg-white text-black hover:bg-gray-50'
          }`}
        >
          Puxar o Freio
        </button>
        <button
          type='button'
          onClick={() => onSelectPath('race')}
          className={`rounded-xl border px-4 py-4 text-sm font-semibold transition-colors text-left ${
            activePath === 'race'
              ? 'border-blue-700 bg-blue-700 text-white'
              : 'border-black bg-white text-black hover:bg-gray-50'
          }`}
        >
          Acelerar a Carroça
        </button>
      </div>
    </section>
  );
}

export function RapaduriaSimulation({ initialPath }: { initialPath?: RapaduriaPath }) {
  const [activePath, setActivePath] = useState<RapaduriaPath>(normalizeInitialPath(initialPath));

  useEffect(() => {
    setActivePath(normalizeInitialPath(initialPath));
  }, [initialPath]);

  const config = pathConfig[activePath];
  const selector = useMemo(() => `[data-chart-extra][data-path="${activePath}"]`, [activePath]);

  const { activeSectionId, activeChart } = useScrollSpy({
    selector,
    initialSectionId: config.sections[0]?.id,
    initialChart: config.initialChart,
  });

  const currentChart = activeChart ?? config.initialChart;

  const handleSelectPath = (nextPath: RapaduriaPath) => {
    if (nextPath === activePath) {
      return;
    }
    setActivePath(nextPath);
    window.scrollTo(0, 0);
  };

  return (
    <div className='min-h-screen bg-white text-black font-sans pt-16'>
      <header className='p-6 border-b border-gray-200 flex justify-between items-center bg-white'>
        <div className='max-w-7xl mx-auto w-full flex flex-wrap items-center justify-between gap-4'>
          <div>
            <p className='text-[11px] font-mono uppercase tracking-widest text-blue-700'>{config.kicker}</p>
            <h1 className='text-3xl font-bold'>{config.title}</h1>
            <p className='text-sm text-gray-600 mt-1'>{config.summary}</p>
          </div>
          <Link
            href='/simulacoes'
            className='text-sm font-semibold border border-black rounded-full px-4 py-2 hover:bg-black hover:text-white transition-colors'
          >
            Voltar para Simulações
          </Link>
        </div>
      </header>

      <main className='grid grid-cols-1 md:grid-cols-[100px_minmax(0,1fr)_400px] gap-8 max-w-7xl mx-auto p-6 relative'>
        <aside className='hidden md:block sticky top-24 h-[80vh] border-r border-gray-300'>
          <nav className='flex flex-col gap-4 text-xs font-mono text-gray-500 mt-12 pr-3 max-h-[70vh] overflow-auto'>
            {config.sections.map((section) => {
              const isActive = section.id === activeSectionId;
              return (
                <a
                  key={section.id}
                  href={`#${section.id}`}
                  className={`hover:text-black transition-colors ${isActive ? 'text-blue-700 font-bold' : ''}`}
                >
                  {section.navLabel}
                </a>
              );
            })}
          </nav>
        </aside>

        <section className='flex flex-col gap-28 pb-32 pt-10'>
          {config.sections.map((section, index) => (
            <NarrativeSectionArticle key={section.id} section={section} index={index} path={activePath} />
          ))}

          <BranchDecisionBlock activePath={activePath} onSelectPath={handleSelectPath} />

          <footer className='border-t border-gray-300 pt-6'>
            <p className='text-sm text-gray-700'>
              Esta é uma simulação adaptada e humorística. O conceito e o modelo original são baseados no site{' '}
              <a href='https://ai-2027.com/' target='_blank' rel='noopener noreferrer' className='underline font-semibold'>
                ai-2027.com
              </a>
              .
            </p>
          </footer>
        </section>

        <aside className='hidden md:block sticky top-24 h-[80vh]'>
          <SimulationMetricsSidebar chart={currentChart} />
        </aside>
      </main>
    </div>
  );
}
