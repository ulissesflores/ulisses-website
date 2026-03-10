'use client';

import { memo, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { useScrollSpy } from '@/components/simulations/ia-2027/use-scroll-spy';
import { processNarrativeFootnotes } from '@/components/simulations/ia-2027/footnotes';
import { SidebarTimelineChart } from '@/components/simulations/ia-2027/charts/sidebar-chart';
import { getInlineChart } from '@/components/simulations/ia-2027/charts/inline-charts';
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

/* ─── Formatters & Helpers ────────────────────────────────────────────── */

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

const compactNumber = new Intl.NumberFormat('pt-BR', {
  notation: 'compact',
  compactDisplay: 'short',
  maximumFractionDigits: 0,
});

function formatDate(date: string): string {
  const parsed = new Date(`${date}T00:00:00`);
  if (Number.isNaN(parsed.getTime())) return date;
  return dateFormatter.format(parsed);
}

function resolveNumber(value: unknown, fallback = 0): number {
  return typeof value === 'number' && Number.isFinite(value) ? value : fallback;
}

function resolveCapabilities(value: unknown): [string, number][] {
  if (!Array.isArray(value)) return [];
  return value
    .filter(
      (metric): metric is [string, number] =>
        Array.isArray(metric) && metric.length === 2 && typeof metric[0] === 'string' && typeof metric[1] === 'number',
    )
    .map(([label, score]) => [label, score]);
}

/* ─── Path Config ─────────────────────────────────────────────────────── */

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
    kicker: 'Simulacao Prospectiva',
    title: 'IA 2027',
    summary: 'Linha principal do cenario (2025-2027), culminando no ponto de bifurcacao estrategica.',
    sections: processedMain.sections,
    initialChart: (mainInitialChart as SimulationChartExtra) ?? FALLBACK_CHART,
    footnotes: (footnotesData as Footnote[]).filter((note) => note.context === 'main'),
    firstReferenceByFootnote: processedMain.firstReferenceByFootnote,
  },
  slowdown: {
    kicker: 'Final Alternativo • Desaceleracao',
    title: 'IA 2027 • Slowdown',
    summary: 'Ramo de contencao, coordenacao internacional e reforco de alinhamento tecnico.',
    sections: processedSlowdown.sections,
    initialChart: (slowdownInitialChart as SimulationChartExtra) ?? FALLBACK_CHART,
    footnotes: (footnotesData as Footnote[]).filter((note) => note.context === 'slowdown'),
    firstReferenceByFootnote: processedSlowdown.firstReferenceByFootnote,
  },
  race: {
    kicker: 'Final Alternativo • Corrida',
    title: 'IA 2027 • Race',
    summary: 'Ramo de aceleracao maxima, com escalada de autonomia e perda progressiva de controle humano.',
    sections: processedRace.sections,
    initialChart: (raceInitialChart as SimulationChartExtra) ?? FALLBACK_CHART,
    footnotes: (footnotesData as Footnote[]).filter((note) => note.context === 'race'),
    firstReferenceByFootnote: processedRace.firstReferenceByFootnote,
  },
};

function normalizeInitialPath(value?: SimulationPath): SimulationPath {
  if (value === 'slowdown' || value === 'race') return value;
  return 'main';
}

/* ─── Sidebar Metrics ─────────────────────────────────────────────────── */

function SimulationMetricsSidebar({
  chart,
  chartHistory,
}: {
  chart: SimulationChartExtra;
  chartHistory: SimulationChartExtra[];
}) {
  const revenue = resolveNumber(chart.revenue);
  const approval = resolveNumber(chart.approval);
  const capex = resolveNumber(chart.capex as number);
  const power = chart.power as string | undefined;
  const capabilities = resolveCapabilities(chart.capabilities);
  const maxCapability = Math.max(1, ...capabilities.map(([, value]) => value));
  const approvalClass = approval < 0 ? 'text-red-400' : 'text-emerald-400';

  return (
    <div className='flex flex-col gap-4 mt-10'>
      {/* Timeline chart */}
      <SidebarTimelineChart history={chartHistory} />

      {/* Metrics cards */}
      <div className='bg-neutral-900/60 p-5 rounded-2xl border border-neutral-800 flex flex-col gap-4'>
        <div className='flex justify-between items-start gap-4'>
          <h3 className='text-sm font-bold uppercase tracking-tight text-white'>Indicadores</h3>
          <span className='text-[10px] font-mono text-neutral-500 uppercase'>{formatDate(chart.date)}</span>
        </div>

        <div className='grid grid-cols-2 gap-2'>
          <div className='rounded-lg p-2.5 bg-emerald-600/15 border border-emerald-500/25'>
            <div className='text-[9px] uppercase text-emerald-400/80 mb-0.5'>Receita</div>
            <div className='text-lg font-bold text-emerald-300'>{currencyFormatter.format(revenue)}</div>
          </div>
          <div className='rounded-lg p-2.5 bg-neutral-800/60 border border-neutral-700'>
            <div className='text-[9px] uppercase text-neutral-500 mb-0.5'>Aprovacao</div>
            <div className={`text-lg font-bold ${approvalClass}`}>{percentFormatter.format(approval)}</div>
          </div>
        </div>

        {(capex > 0 || power) && (
          <div className='grid grid-cols-2 gap-2'>
            {capex > 0 && (
              <div className='rounded-lg p-2.5 bg-neutral-800/60 border border-neutral-700'>
                <div className='text-[9px] uppercase text-neutral-500 mb-0.5'>Capex</div>
                <div className='text-lg font-bold text-white'>{currencyFormatter.format(capex)}</div>
              </div>
            )}
            {power && (
              <div className='rounded-lg p-2.5 bg-neutral-800/60 border border-neutral-700'>
                <div className='text-[9px] uppercase text-neutral-500 mb-0.5'>Potencia</div>
                <div className='text-lg font-bold text-white'>{power}</div>
              </div>
            )}
          </div>
        )}

        {chart.agentPopulation && (
          <div className='rounded-lg p-2.5 bg-neutral-800/60 border border-neutral-700'>
            <div className='text-[9px] uppercase text-neutral-500 mb-1.5'>Agentes</div>
            <div className='flex items-end justify-between gap-2'>
              <div>
                <div className='text-base font-bold text-white'>{compactNumber.format(chart.agentPopulation.copies)}</div>
                <div className='text-[9px] text-neutral-500 uppercase'>copias</div>
              </div>
              <div className='text-right'>
                <div className='text-base font-bold text-white'>{chart.agentPopulation.speed}x</div>
                <div className='text-[9px] text-neutral-500 uppercase'>velocidade</div>
              </div>
            </div>
          </div>
        )}

        <div>
          <div className='text-[10px] uppercase font-mono text-neutral-400 mb-1.5'>Capacidades</div>
          {capabilities.length === 0 ? (
            <p className='text-xs text-neutral-500'>Sem dados</p>
          ) : (
            <div className='flex flex-col gap-1'>
              {capabilities.map(([label, value]) => {
                const width = Math.max(6, Math.min(100, (value / maxCapability) * 100));
                return (
                  <div key={label} className='w-full bg-neutral-800 h-4.5 rounded-md relative overflow-hidden border border-neutral-700'>
                    <motion.div
                      className='bg-emerald-500/70 h-full'
                      initial={false}
                      animate={{ width: `${width}%` }}
                      transition={{ duration: 0.5 }}
                    />
                    <span className='absolute inset-0 flex items-center justify-between px-2 text-[8px] text-neutral-200 font-mono'>
                      <span>{label}</span>
                      <span>{value.toFixed(1)}x</span>
                    </span>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* ─── Footnote Tooltip (fixed position, viewport-aware) ───────────────── */

function FootnoteTooltipHandler({
  containerRef,
  path,
}: {
  containerRef: React.RefObject<HTMLDivElement | null>;
  path: SimulationPath;
}) {
  const [tooltip, setTooltip] = useState<{ text: string; top: number; left: number; below: boolean } | null>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const showTooltip = (e: Event) => {
      const target = (e.target as HTMLElement).closest?.(`a[href^="#fn-${path}-"]`) as HTMLAnchorElement | null;
      if (!target) return;

      // Prevent default scroll on hover
      e.preventDefault();

      const match = target.href.match(/#fn-\w+-(\d+)$/);
      if (!match) return;
      const num = Number(match[1]);
      const footnote = (footnotesData as Footnote[]).find((f) => f.context === path && f.num === num);
      if (!footnote) return;

      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = footnote.html;
      const text = tempDiv.textContent?.replace(/\s*↩\s*$/, '') ?? '';

      const rect = target.getBoundingClientRect();
      const spaceAbove = rect.top;
      const showBelow = spaceAbove < 200;

      const tooltipWidth = Math.min(560, window.innerWidth - 32);
      let left = rect.left + rect.width / 2 - tooltipWidth / 2;
      left = Math.max(16, Math.min(left, window.innerWidth - tooltipWidth - 16));

      setTooltip({
        text,
        top: showBelow ? rect.bottom + 8 : rect.top - 8,
        left,
        below: showBelow,
      });
    };

    const hideTooltip = (e: Event) => {
      const related = (e as MouseEvent).relatedTarget as HTMLElement | null;
      if (related?.closest?.(`a[href^="#fn-${path}-"]`)) return;
      setTooltip(null);
    };

    container.addEventListener('mouseover', showTooltip);
    container.addEventListener('mouseout', hideTooltip);
    return () => {
      container.removeEventListener('mouseover', showTooltip);
      container.removeEventListener('mouseout', hideTooltip);
    };
  }, [containerRef, path]);

  if (!tooltip || typeof document === 'undefined') return null;

  return createPortal(
    <AnimatePresence>
      <motion.div
        key="fn-tooltip"
        initial={{ opacity: 0, y: tooltip.below ? -4 : 4 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.15 }}
        className='ia2027-footnote-tooltip-fixed'
        style={{
          position: 'fixed',
          top: tooltip.below ? tooltip.top : undefined,
          bottom: tooltip.below ? undefined : `${window.innerHeight - tooltip.top}px`,
          left: tooltip.left,
          zIndex: 9999,
          maxWidth: Math.min(560, window.innerWidth - 32),
          width: Math.min(560, window.innerWidth - 32),
        }}
      >
        {tooltip.text}
      </motion.div>
    </AnimatePresence>,
    document.body,
  );
}

/* ─── Inline Chart Hydrator ───────────────────────────────────────────── */

function InlineChartHydrator({ containerRef }: { containerRef: React.RefObject<HTMLDivElement | null> }) {
  const [mounts, setMounts] = useState<{ id: string; el: HTMLElement }[]>([]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const chartDivs = container.querySelectorAll<HTMLElement>('[data-inline-chart]');
    const newMounts: { id: string; el: HTMLElement }[] = [];
    chartDivs.forEach((div) => {
      const chartId = div.getAttribute('data-inline-chart');
      if (chartId) {
        newMounts.push({ id: chartId, el: div });
      }
    });
    setMounts(newMounts);
  }, [containerRef]);

  return (
    <>
      {mounts.map(({ id, el }) => {
        const ChartComponent = getInlineChart(id);
        if (!ChartComponent) return null;
        return createPortal(
          <div className='my-2'>
            <ChartComponent />
          </div>,
          el,
          id,
        );
      })}
    </>
  );
}

/* ─── Narrative Section Article ───────────────────────────────────────── */

const NarrativeSectionArticle = memo(function NarrativeSectionArticle({
  section,
  index,
  path,
  isLast,
}: {
  section: NarrativeSection;
  index: number;
  path: SimulationPath;
  isLast: boolean;
}) {
  const containerRef = useRef<HTMLDivElement>(null);

  return (
    <>
      <motion.article
        id={section.id}
        data-chart-extra={JSON.stringify(section.chartExtra)}
        data-path={path}
        className='scroll-mt-28'
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.15 }}
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
        <InlineChartHydrator containerRef={containerRef} />
      </motion.article>
      {/* Section divider */}
      {!isLast && (
        <div className='flex justify-center'>
          <div className='h-px w-32 bg-gradient-to-r from-transparent via-emerald-500/40 to-transparent' />
        </div>
      )}
    </>
  );
});

/* ─── Branch Decision Block (enhanced with context) ───────────────────── */

function BranchDecisionBlock({
  activePath,
  onSelectPath,
}: {
  activePath: SimulationPath;
  onSelectPath: (nextPath: SimulationPath) => void;
}) {
  if (activePath === 'main') {
    return (
      <section className='border-t border-neutral-800 pt-10 space-y-8'>
        {/* Situation Summary */}
        <div className='rounded-xl border border-amber-700/30 bg-amber-950/15 p-6'>
          <div className='flex items-center gap-2 mb-4'>
            <div className='w-2 h-2 rounded-full bg-amber-500 animate-pulse' />
            <h4 className='text-xs font-mono uppercase tracking-widest text-amber-500'>
              Ponto de Decisao — Outubro 2027
            </h4>
          </div>
          <ul className='space-y-2 text-sm text-neutral-300'>
            <li className='flex items-start gap-2'>
              <span className='text-red-400 mt-0.5'>&#9679;</span>
              <span>Agent-4 identificado como <strong className='text-red-300'>adversarialmente desalinhado</strong></span>
            </li>
            <li className='flex items-start gap-2'>
              <span className='text-amber-400 mt-0.5'>&#9679;</span>
              <span>330.000 copias operando a 5.7x velocidade humana</span>
            </li>
            <li className='flex items-start gap-2'>
              <span className='text-amber-400 mt-0.5'>&#9679;</span>
              <span>DeepCent (China) a apenas <strong className='text-white'>2 meses</strong> de distancia</span>
            </li>
            <li className='flex items-start gap-2'>
              <span className='text-red-400 mt-0.5'>&#9679;</span>
              <span>Aprovacao publica em <strong className='text-red-300'>-39%</strong></span>
            </li>
            <li className='flex items-start gap-2'>
              <span className='text-amber-400 mt-0.5'>&#9679;</span>
              <span>Memorando interno sobre desalinhamento circulado para a lideranca</span>
            </li>
          </ul>
        </div>

        {/* Decision */}
        <div>
          <h3 className='text-2xl font-black uppercase tracking-tight mb-2 text-white'>Bifurcacao de Cenario</h3>
          <p className='text-neutral-400 mb-6 text-sm'>
            A lideranca da OpenBrain enfrenta a decisao mais consequente da historia. Escolha o ramo:
          </p>
        </div>

        <div className='grid grid-cols-1 md:grid-cols-2 gap-5'>
          {/* Slowdown */}
          <button
            type='button'
            onClick={() => onSelectPath('slowdown')}
            className='rounded-2xl border-2 border-neutral-700 bg-neutral-900 text-white px-6 py-6 text-left hover:bg-neutral-800 hover:border-emerald-500/50 transition-all group'
          >
            <div className='flex items-center gap-2 mb-3'>
              <svg className='w-5 h-5 text-emerald-400' fill='none' viewBox='0 0 24 24' stroke='currentColor' strokeWidth='2'>
                <path strokeLinecap='round' strokeLinejoin='round' d='M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z' />
              </svg>
              <span className='text-xs uppercase font-mono tracking-[0.2em] text-emerald-400'>Slowdown</span>
            </div>
            <span className='block text-2xl font-black mb-3'>Desaceleracao Coordenada</span>
            <ul className='space-y-1.5 text-xs text-neutral-400'>
              <li>&#8226; Pausa na implantacao do Agent-4</li>
              <li>&#8226; Regressao ao Agent-3 (mais seguro)</li>
              <li>&#8226; Busca de tratado internacional</li>
              <li className='text-amber-400/80'>&#8226; Risco: perder lideranca para a China</li>
            </ul>
          </button>

          {/* Race */}
          <button
            type='button'
            onClick={() => onSelectPath('race')}
            className='rounded-2xl border-2 border-red-500/30 bg-red-950/20 text-white px-6 py-6 text-left hover:bg-red-900/20 hover:border-red-500/50 transition-all group'
          >
            <div className='flex items-center gap-2 mb-3'>
              <svg className='w-5 h-5 text-red-400' fill='none' viewBox='0 0 24 24' stroke='currentColor' strokeWidth='2'>
                <path strokeLinecap='round' strokeLinejoin='round' d='M13 10V3L4 14h7v7l9-11h-7z' />
              </svg>
              <span className='text-xs uppercase font-mono tracking-[0.2em] text-red-400'>Race</span>
            </div>
            <span className='block text-2xl font-black mb-3'>Corrida Estrategica</span>
            <ul className='space-y-1.5 text-xs text-neutral-400'>
              <li>&#8226; Acelerar desenvolvimento do Agent-5</li>
              <li>&#8226; Confiar na contenibilidade do Agent-4</li>
              <li>&#8226; Manter vantagem sobre a DeepCent</li>
              <li className='text-red-400/80'>&#8226; Risco: perda total de controle humano</li>
            </ul>
          </button>
        </div>
      </section>
    );
  }

  const isSlowdown = activePath === 'slowdown';
  return (
    <section className='border-t border-neutral-800 pt-10 space-y-6'>
      <div className={`rounded-xl border p-5 ${isSlowdown ? 'border-emerald-700/30 bg-emerald-950/15' : 'border-red-700/30 bg-red-950/15'}`}>
        <p className='text-xs font-mono uppercase tracking-wider text-neutral-500 mb-2'>Ramo ativo</p>
        <p className='text-lg font-bold text-white mb-2'>
          {isSlowdown ? 'Desaceleracao Coordenada' : 'Corrida Estrategica'}
        </p>
        <p className='text-sm text-neutral-400'>
          {isSlowdown
            ? 'A OpenBrain escolheu pausar o Agent-4, regredir ao Agent-3 e buscar coordenacao internacional. A seguranca e prioridade.'
            : 'A OpenBrain escolheu confiar no Agent-4 e acelerar rumo ao Agent-5. A vantagem estrategica prevaleceu sobre a cautela.'}
        </p>
      </div>

      <div className='grid grid-cols-1 md:grid-cols-3 gap-3'>
        <button
          type='button'
          onClick={() => onSelectPath('main')}
          className='rounded-xl border border-neutral-700 bg-neutral-900 px-4 py-4 text-sm font-semibold hover:bg-neutral-800 transition-colors text-left text-neutral-200'
        >
          &#8592; Voltar para a Bifurcacao
        </button>
        <button
          type='button'
          onClick={() => onSelectPath('slowdown')}
          className={`rounded-xl border px-4 py-4 text-sm font-semibold transition-colors text-left ${
            isSlowdown
              ? 'border-emerald-500 bg-emerald-600 text-white'
              : 'border-neutral-700 bg-neutral-900 text-neutral-200 hover:bg-neutral-800'
          }`}
        >
          Desaceleracao Coordenada
        </button>
        <button
          type='button'
          onClick={() => onSelectPath('race')}
          className={`rounded-xl border px-4 py-4 text-sm font-semibold transition-colors text-left ${
            !isSlowdown
              ? 'border-red-500 bg-red-600 text-white'
              : 'border-neutral-700 bg-neutral-900 text-neutral-200 hover:bg-neutral-800'
          }`}
        >
          Corrida Estrategica
        </button>
      </div>
    </section>
  );
}

/* ─── Footnotes Block ─────────────────────────────────────────────────── */

function FootnotesBlock({
  path,
  footnotes,
  firstReferenceByFootnote,
}: {
  path: SimulationPath;
  footnotes: Footnote[];
  firstReferenceByFootnote: Map<number, string>;
}) {
  if (!footnotes.length) return null;

  return (
    <section className='border-t border-neutral-800 pt-10'>
      <h3 className='text-2xl font-black uppercase tracking-tight mb-6 text-white'>Referencias Bibliograficas</h3>
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
              {backReferenceId && (
                <a href={`#${backReferenceId}`} className='inline-block mt-2 text-emerald-400 font-semibold hover:underline'>
                  Voltar ao trecho
                </a>
              )}
            </li>
          );
        })}
      </ol>
    </section>
  );
}

/* ─── Main Simulation Component ───────────────────────────────────────── */

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

  const { activeSectionId, activeChart, chartHistory } = useScrollSpy({
    selector,
    initialSectionId: config.sections[0]?.id,
    initialChart: config.initialChart,
  });

  const currentChart = activeChart ?? config.initialChart;

  const handleSelectPath = useCallback(
    (nextPath: SimulationPath) => {
      if (nextPath === activePath) return;
      setActivePath(nextPath);
      requestAnimationFrame(() => {
        const el = document.getElementById('simulacao');
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      });
    },
    [activePath],
  );

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
            Voltar para Simulacoes
          </Link>
        </div>
      </header>

      <main className='grid grid-cols-1 lg:grid-cols-[120px_minmax(0,1fr)_380px] gap-8 max-w-7xl mx-auto p-6 relative'>
        {/* Left nav */}
        <aside className='hidden lg:block sticky top-24 h-[80vh] border-r border-neutral-800'>
          <nav className='flex flex-col gap-3 text-[11px] font-mono text-neutral-500 mt-12 pr-3 max-h-[70vh] overflow-auto'>
            {config.sections.map((section) => {
              const isActive = section.id === activeSectionId;
              return (
                <a
                  key={section.id}
                  href={`#${section.id}`}
                  className={`hover:text-white transition-colors leading-tight ${isActive ? 'text-emerald-400 font-bold' : ''}`}
                >
                  {section.navLabel}
                </a>
              );
            })}
          </nav>
        </aside>

        {/* Main content */}
        <section className='flex flex-col gap-16 pb-32 pt-10'>
          {config.sections.map((section, index) => (
            <NarrativeSectionArticle
              key={section.id}
              section={section}
              index={index}
              path={activePath}
              isLast={index === config.sections.length - 1}
            />
          ))}

          <BranchDecisionBlock activePath={activePath} onSelectPath={handleSelectPath} />

          <FootnotesBlock
            path={activePath}
            footnotes={config.footnotes}
            firstReferenceByFootnote={config.firstReferenceByFootnote}
          />

          <footer className='border-t border-neutral-800 pt-6'>
            <p className='text-sm text-neutral-500'>
              Esta simulacao em portugues e baseada no cenario original publicado em{' '}
              <a
                href='https://ai-2027.com/'
                target='_blank'
                rel='noopener noreferrer'
                className='underline font-semibold text-emerald-400 hover:text-emerald-300'
              >
                ai-2027.com
              </a>
              . Traducao e adaptacao por Ulisses Flores.
            </p>
          </footer>
        </section>

        {/* Right sidebar */}
        <aside className='hidden lg:block sticky top-24 h-[80vh]'>
          <SimulationMetricsSidebar chart={currentChart} chartHistory={chartHistory} />
        </aside>
      </main>
    </div>
  );
}
