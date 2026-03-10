'use client';

import { memo, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useScrollSpy } from '@/components/simulations/ia-2027/use-scroll-spy';
import { processNarrativeFootnotes } from '@/components/simulations/ia-2027/footnotes';
import type {
  Footnote,
  NarrativeSection,
  SimulationChartExtra,
  SimulationPath,
} from '@/components/simulations/ia-2027/types';
import {
  footnotesData,
  mainInitialChart,
  mainTimeline,
  raceEnding,
  raceInitialChart,
  slowdownEnding,
  slowdownInitialChart,
} from '@/data/simulations/ia-2027';

const FALLBACK_CHART: SimulationChartExtra = {
  date: '2025-01-01',
  capabilities: [],
  approval: 0,
  revenue: 0,
};

const currencyFormatter = new Intl.NumberFormat('pt-BR', {
  style: 'currency',
  currency: 'USD',
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
  footnotes: Footnote[];
  firstReferenceByFootnote: Map<number, string>;
};

const processedMain = processNarrativeFootnotes(mainTimeline as NarrativeSection[], 'main');
const processedSlowdown = processNarrativeFootnotes(slowdownEnding as NarrativeSection[], 'slowdown');
const processedRace = processNarrativeFootnotes(raceEnding as NarrativeSection[], 'race');

const pathConfig: Record<SimulationPath, PathConfig> = {
  main: {
    kicker: 'Simulação Prospectiva',
    title: 'IA 2027',
    summary: 'Linha principal do cenário (2025-2027), culminando no ponto de bifurcação estratégica.',
    sections: processedMain.sections,
    initialChart: (mainInitialChart as SimulationChartExtra) ?? FALLBACK_CHART,
    footnotes: (footnotesData as Footnote[]).filter((note) => note.context === 'main'),
    firstReferenceByFootnote: processedMain.firstReferenceByFootnote,
  },
  slowdown: {
    kicker: 'Final Alternativo • Desaceleração',
    title: 'IA 2027 • Slowdown',
    summary: 'Ramo de contenção, coordenação internacional e reforço de alinhamento técnico.',
    sections: processedSlowdown.sections,
    initialChart: (slowdownInitialChart as SimulationChartExtra) ?? FALLBACK_CHART,
    footnotes: (footnotesData as Footnote[]).filter((note) => note.context === 'slowdown'),
    firstReferenceByFootnote: processedSlowdown.firstReferenceByFootnote,
  },
  race: {
    kicker: 'Final Alternativo • Corrida',
    title: 'IA 2027 • Race',
    summary: 'Ramo de aceleração máxima, com escalada de autonomia e perda progressiva de controle humano.',
    sections: processedRace.sections,
    initialChart: (raceInitialChart as SimulationChartExtra) ?? FALLBACK_CHART,
    footnotes: (footnotesData as Footnote[]).filter((note) => note.context === 'race'),
    firstReferenceByFootnote: processedRace.firstReferenceByFootnote,
  },
};

function normalizeInitialPath(value?: SimulationPath): SimulationPath {
  if (value === 'slowdown' || value === 'race') {
    return value;
  }
  return 'main';
}

function formatDate(date: string): string {
  const parsed = new Date(`${date}T00:00:00`);
  if (Number.isNaN(parsed.getTime())) {
    return date;
  }
  return dateFormatter.format(parsed);
}

function resolveNumber(value: unknown, fallback = 0): number {
  return typeof value === 'number' && Number.isFinite(value) ? value : fallback;
}

function resolveCapabilities(value: unknown): [string, number][] {
  if (!Array.isArray(value)) {
    return [];
  }

  return value
    .filter(
      (metric): metric is [string, number] =>
        Array.isArray(metric) && metric.length === 2 && typeof metric[0] === 'string' && typeof metric[1] === 'number',
    )
    .map(([label, score]) => [label, score]);
}

const compactNumber = new Intl.NumberFormat('pt-BR', {
  notation: 'compact',
  compactDisplay: 'short',
  maximumFractionDigits: 0,
});

function SimulationMetricsSidebar({ chart }: { chart: SimulationChartExtra }) {
  const revenue = resolveNumber(chart.revenue);
  const approval = resolveNumber(chart.approval);
  const capex = resolveNumber(chart.capex as number);
  const power = chart.power as string | undefined;
  const capabilities = resolveCapabilities(chart.capabilities);
  const maxCapability = Math.max(1, ...capabilities.map(([, value]) => value));
  const approvalClass = approval < 0 ? 'text-red-400' : 'text-emerald-400';

  return (
    <div className='bg-neutral-900/60 p-6 rounded-2xl border border-neutral-800 flex flex-col gap-5 mt-10'>
      <div className='flex justify-between items-start gap-4'>
        <h3 className='text-lg font-bold uppercase tracking-tight text-white'>Indicadores</h3>
        <span className='text-xs font-mono text-neutral-500 uppercase'>{formatDate(chart.date)}</span>
      </div>

      <div className='grid grid-cols-2 gap-3'>
        <div className='rounded-xl p-3 bg-emerald-600/15 border border-emerald-500/25'>
          <div className='text-[10px] uppercase text-emerald-400/80 mb-1'>Receita</div>
          <div className='text-xl font-bold text-emerald-300'>{currencyFormatter.format(revenue)}</div>
        </div>

        <div className='rounded-xl p-3 bg-neutral-800/60 border border-neutral-700'>
          <div className='text-[10px] uppercase text-neutral-500 mb-1'>Aprovação</div>
          <div className={`text-xl font-bold ${approvalClass}`}>{percentFormatter.format(approval)}</div>
        </div>
      </div>

      {(capex > 0 || power) ? (
        <div className='grid grid-cols-2 gap-3'>
          {capex > 0 ? (
            <div className='rounded-xl p-3 bg-neutral-800/60 border border-neutral-700'>
              <div className='text-[10px] uppercase text-neutral-500 mb-1'>Capex</div>
              <div className='text-xl font-bold text-white'>{currencyFormatter.format(capex)}</div>
            </div>
          ) : null}
          {power ? (
            <div className='rounded-xl p-3 bg-neutral-800/60 border border-neutral-700'>
              <div className='text-[10px] uppercase text-neutral-500 mb-1'>Pico Potência</div>
              <div className='text-xl font-bold text-white'>{power}</div>
            </div>
          ) : null}
        </div>
      ) : null}

      {chart.agentPopulation ? (
        <div className='rounded-xl p-3 bg-neutral-800/60 border border-neutral-700'>
          <div className='text-[10px] uppercase text-neutral-500 mb-2'>População de Agentes</div>
          <div className='flex items-end justify-between gap-3'>
            <div>
              <div className='text-lg font-bold text-white'>{compactNumber.format(chart.agentPopulation.copies)}</div>
              <div className='text-[10px] text-neutral-500 uppercase'>cópias ativas</div>
            </div>
            <div className='text-right'>
              <div className='text-lg font-bold text-white'>{chart.agentPopulation.speed}×</div>
              <div className='text-[10px] text-neutral-500 uppercase'>velocidade</div>
            </div>
          </div>
        </div>
      ) : null}

      <div>
        <div className='text-[11px] uppercase font-mono text-neutral-400 mb-2'>Capacidades</div>
        {capabilities.length === 0 ? (
          <p className='text-sm text-neutral-500'>Sem dados de capacidades para este período.</p>
        ) : (
          <div className='flex flex-col gap-1.5'>
            {capabilities.map(([label, value]) => {
              const width = Math.max(6, Math.min(100, (value / maxCapability) * 100));
              return (
                <div key={label} className='w-full bg-neutral-800 h-5 rounded-md relative overflow-hidden border border-neutral-700'>
                  <div className='bg-emerald-500/70 h-full transition-all duration-500' style={{ width: `${width}%` }} />
                  <span className='absolute inset-0 flex items-center justify-between px-2 text-[9px] text-neutral-200 font-mono'>
                    <span>{label}</span>
                    <span>{value.toFixed(1)}×</span>
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

function FootnoteTooltipHandler({ containerRef, path }: { containerRef: React.RefObject<HTMLDivElement | null>; path: SimulationPath }) {
  const tooltipRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const showTooltip = (e: Event) => {
      const target = (e.target as HTMLElement).closest?.(`a[href^="#fn-${path}-"]`) as HTMLAnchorElement | null;
      if (!target) return;

      const match = target.href.match(/#fn-\w+-(\d+)$/);
      if (!match) return;
      const num = Number(match[1]);
      const footnote = (footnotesData as Footnote[]).find((f) => f.context === path && f.num === num);
      if (!footnote) return;

      if (tooltipRef.current) {
        tooltipRef.current.remove();
      }

      const tooltip = document.createElement('div');
      tooltip.className = 'ia2027-footnote-tooltip';
      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = footnote.html;
      tooltip.textContent = tempDiv.textContent?.replace(/\s*↩\s*$/, '') ?? '';
      tooltipRef.current = tooltip;

      const sup = target.closest('sup') ?? target;
      sup.style.position = 'relative';
      sup.appendChild(tooltip);
    };

    const hideTooltip = () => {
      if (tooltipRef.current) {
        tooltipRef.current.remove();
        tooltipRef.current = null;
      }
    };

    container.addEventListener('mouseover', showTooltip);
    container.addEventListener('mouseout', hideTooltip);
    return () => {
      container.removeEventListener('mouseover', showTooltip);
      container.removeEventListener('mouseout', hideTooltip);
      hideTooltip();
    };
  }, [containerRef, path]);

  return null;
}

const NarrativeSectionArticle = memo(function NarrativeSectionArticle({
  section,
  index,
  path,
}: {
  section: NarrativeSection;
  index: number;
  path: SimulationPath;
}) {
  const containerRef = useRef<HTMLDivElement>(null);

  return (
    <motion.article
      id={section.id}
      data-chart-extra={JSON.stringify(section.chartExtra)}
      data-path={path}
      className='scroll-mt-28'
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.4, delay: index * 0.02 }}
    >
      <p className='text-xs font-mono uppercase tracking-[0.18em] text-emerald-400 mb-2'>{section.navLabel}</p>
      <h2 className='text-3xl font-bold mb-4 text-white'>{section.title}</h2>
      <div
        ref={containerRef}
        className='ia2027-story text-[1.05rem] leading-relaxed'
        dangerouslySetInnerHTML={{ __html: section.storyHtml }}
      />
      <FootnoteTooltipHandler containerRef={containerRef} path={path} />
    </motion.article>
  );
});

function BranchDecisionBlock({
  activePath,
  onSelectPath,
}: {
  activePath: SimulationPath;
  onSelectPath: (nextPath: SimulationPath) => void;
}) {
  if (activePath === 'main') {
    return (
      <section className='border-t border-neutral-800 pt-10'>
        <h3 className='text-2xl font-black uppercase tracking-tight mb-4 text-white'>Bifurcação de Cenário</h3>
        <p className='text-neutral-400 mb-6'>
          A partir deste ponto, a narrativa se divide em dois ramos alternativos: desaceleração coordenada ou corrida
          estratégica acelerada.
        </p>
        <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
          <button
            type='button'
            onClick={() => onSelectPath('slowdown')}
            className='rounded-2xl border-2 border-neutral-700 bg-neutral-900 text-white px-6 py-8 text-left hover:bg-neutral-800 hover:border-emerald-500/50 transition-colors'
          >
            <span className='block text-xs uppercase font-mono tracking-[0.2em] mb-2 text-emerald-400'>Slowdown</span>
            <span className='block text-3xl font-black'>Desaceleração Coordenada</span>
            <span className='block text-sm mt-2 text-neutral-400'>Priorizar segurança, verificabilidade e coordenação institucional.</span>
          </button>

          <button
            type='button'
            onClick={() => onSelectPath('race')}
            className='rounded-2xl border-2 border-red-500/30 bg-red-950/30 text-white px-6 py-8 text-left hover:bg-red-900/30 hover:border-red-500/50 transition-colors'
          >
            <span className='block text-xs uppercase font-mono tracking-[0.2em] mb-2 text-red-400'>Race</span>
            <span className='block text-3xl font-black'>Corrida Estratégica</span>
            <span className='block text-sm mt-2 text-red-300/70'>Maximizar velocidade e vantagem estratégica sob risco sistêmico elevado.</span>
          </button>
        </div>
      </section>
    );
  }

  return (
    <section className='border-t border-neutral-800 pt-10'>
      <h3 className='text-2xl font-black uppercase tracking-tight mb-4 text-white'>Finais Alternativos</h3>
      <p className='text-neutral-400 mb-6'>Ramo ativo: {activePath === 'slowdown' ? 'Desaceleração (Slowdown)' : 'Corrida (Race)'}.</p>
      <div className='grid grid-cols-1 md:grid-cols-3 gap-3'>
        <button
          type='button'
          onClick={() => onSelectPath('main')}
          className='rounded-xl border border-neutral-700 bg-neutral-900 px-4 py-4 text-sm font-semibold hover:bg-neutral-800 transition-colors text-left text-neutral-200'
        >
          Voltar para a Bifurcação
        </button>
        <button
          type='button'
          onClick={() => onSelectPath('slowdown')}
          className={`rounded-xl border px-4 py-4 text-sm font-semibold transition-colors text-left ${
            activePath === 'slowdown'
              ? 'border-emerald-500 bg-emerald-600 text-white'
              : 'border-neutral-700 bg-neutral-900 text-neutral-200 hover:bg-neutral-800'
          }`}
        >
          Desaceleração Coordenada
        </button>
        <button
          type='button'
          onClick={() => onSelectPath('race')}
          className={`rounded-xl border px-4 py-4 text-sm font-semibold transition-colors text-left ${
            activePath === 'race'
              ? 'border-red-500 bg-red-600 text-white'
              : 'border-neutral-700 bg-neutral-900 text-neutral-200 hover:bg-neutral-800'
          }`}
        >
          Corrida Estratégica
        </button>
      </div>
    </section>
  );
}

function FootnotesBlock({
  path,
  footnotes,
  firstReferenceByFootnote,
}: {
  path: SimulationPath;
  footnotes: Footnote[];
  firstReferenceByFootnote: Map<number, string>;
}) {
  if (!footnotes.length) {
    return null;
  }

  return (
    <section className='border-t border-neutral-800 pt-10'>
      <h3 className='text-2xl font-black uppercase tracking-tight mb-6 text-white'>Referências Bibliográficas</h3>
      <ol className='space-y-4'>
        {footnotes.map((footnote) => {
          const backReferenceId = firstReferenceByFootnote.get(footnote.num);
          return (
            <li
              key={footnote.id}
              id={`fn-${path}-${footnote.num}`}
              className='scroll-mt-28 border border-neutral-800 rounded-lg p-4 bg-neutral-900/50 text-sm text-neutral-400 leading-relaxed'
            >
              <div dangerouslySetInnerHTML={{ __html: footnote.html }} />
              {backReferenceId ? (
                <a href={`#${backReferenceId}`} className='inline-block mt-2 text-emerald-400 font-semibold hover:underline'>
                  Voltar ao trecho
                </a>
              ) : null}
            </li>
          );
        })}
      </ol>
    </section>
  );
}

export function IA2027Simulation({ initialPath }: { initialPath?: SimulationPath }) {
  const [activePath, setActivePath] = useState<SimulationPath>(normalizeInitialPath(initialPath));

  useEffect(() => {
    setActivePath(normalizeInitialPath(initialPath));
  }, [initialPath]);

  useEffect(() => {
    const root = document.documentElement;
    const previousBehavior = root.style.scrollBehavior;
    root.style.scrollBehavior = 'smooth';
    return () => {
      root.style.scrollBehavior = previousBehavior;
    };
  }, []);

  const config = pathConfig[activePath];
  const selector = useMemo(() => `[data-chart-extra][data-path="${activePath}"]`, [activePath]);

  const { activeSectionId, activeChart } = useScrollSpy({
    selector,
    initialSectionId: config.sections[0]?.id,
    initialChart: config.initialChart,
  });

  const currentChart = activeChart ?? config.initialChart;

  const handleSelectPath = useCallback((nextPath: SimulationPath) => {
    if (nextPath === activePath) {
      return;
    }
    setActivePath(nextPath);
    // Scroll to the simulation container, not page top
    requestAnimationFrame(() => {
      const el = document.getElementById('simulacao');
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      }
    });
  }, [activePath]);

  return (
    <div id='simulacao' className='min-h-screen bg-neutral-950 text-neutral-200 font-sans pt-4'>
      <header className='p-6 border-b border-neutral-800 flex justify-between items-center'>
        <div className='max-w-7xl mx-auto w-full flex flex-wrap items-center justify-between gap-4'>
          <div>
            <p className='text-[11px] font-mono uppercase tracking-widest text-emerald-400'>{config.kicker}</p>
            <h2 className='text-3xl font-bold text-white'>{config.title}</h2>
            <p className='text-sm text-neutral-400 mt-1'>{config.summary}</p>
          </div>
          <Link
            href='/simulacoes'
            className='text-sm font-semibold border border-neutral-700 rounded-full px-4 py-2 text-neutral-300 hover:bg-neutral-800 hover:text-white transition-colors'
          >
            Voltar para Simulações
          </Link>
        </div>
      </header>

      <main className='grid grid-cols-1 lg:grid-cols-[120px_minmax(0,1fr)_380px] gap-8 max-w-7xl mx-auto p-6 relative'>
        <aside className='hidden lg:block sticky top-24 h-[80vh] border-r border-neutral-800'>
          <nav className='flex flex-col gap-4 text-xs font-mono text-neutral-500 mt-12 pr-3 max-h-[70vh] overflow-auto'>
            {config.sections.map((section) => {
              const isActive = section.id === activeSectionId;
              return (
                <a
                  key={section.id}
                  href={`#${section.id}`}
                  className={`hover:text-white transition-colors ${isActive ? 'text-emerald-400 font-bold' : ''}`}
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

          <FootnotesBlock
            path={activePath}
            footnotes={config.footnotes}
            firstReferenceByFootnote={config.firstReferenceByFootnote}
          />

          <footer className='border-t border-neutral-800 pt-6'>
            <p className='text-sm text-neutral-500'>
              Esta simulação em português é baseada no cenário original publicado em{' '}
              <a href='https://ai-2027.com/' target='_blank' rel='noopener noreferrer' className='underline font-semibold text-emerald-400 hover:text-emerald-300'>
                ai-2027.com
              </a>
              . Tradução e adaptação por Ulisses Flores.
            </p>
          </footer>
        </section>

        <aside className='hidden lg:block sticky top-24 h-[80vh]'>
          <SimulationMetricsSidebar chart={currentChart} />
        </aside>
      </main>
    </div>
  );
}
