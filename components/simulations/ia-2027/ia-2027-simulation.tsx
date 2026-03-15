'use client';

import { memo, useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useDict } from '@/lib/i18n-context';
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

function normalizeInitialPath(value?: SimulationPath): SimulationPath {
  if (value === 'slowdown' || value === 'race') {
    return value;
  }
  return 'main';
}

function formatDate(date: string, locale: string): string {
  const parsed = new Date(`${date}T00:00:00`);
  if (Number.isNaN(parsed.getTime())) {
    return date;
  }
  return new Intl.DateTimeFormat(locale, { month: 'short', year: 'numeric' }).format(parsed);
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

function SimulationMetricsSidebar({ chart }: { chart: SimulationChartExtra }) {
  const { ia2027, locale } = useDict();
  const t = ia2027.simulation;

  const currencyFormatter = useMemo(
    () =>
      new Intl.NumberFormat(locale, {
        style: 'currency',
        currency: 'BRL',
        notation: 'compact',
        compactDisplay: 'short',
        maximumFractionDigits: 1,
      }),
    [locale],
  );

  const percentFormatter = useMemo(
    () =>
      new Intl.NumberFormat(locale, {
        style: 'percent',
        signDisplay: 'always',
        maximumFractionDigits: 0,
      }),
    [locale],
  );

  const revenue = resolveNumber(chart.revenue);
  const approval = resolveNumber(chart.approval);
  const capabilities = resolveCapabilities(chart.capabilities);
  const maxCapability = Math.max(1, ...capabilities.map(([, value]) => value));
  const approvalClass = approval < 0 ? 'text-red-400' : 'text-emerald-400';

  return (
    <div className='bg-neutral-900/60 p-6 rounded-xl border border-neutral-700 flex flex-col gap-6 mt-10'>
      <div className='flex justify-between items-start gap-4'>
        <h3 className='text-2xl font-bold font-sans uppercase tracking-tight text-right text-white'>{t.indicators}</h3>
        <span className='text-xs font-mono text-neutral-500 uppercase'>{formatDate(chart.date, locale)}</span>
      </div>

      <div className='border border-neutral-700 rounded-md p-4 bg-emerald-800 text-white'>
        <div className='text-[10px] uppercase opacity-85 mb-1'>{t.revenue}</div>
        <div className='text-3xl font-bold'>{currencyFormatter.format(revenue)}</div>
      </div>

      <div className='border border-neutral-700 rounded-md p-4 bg-neutral-900'>
        <div className='text-[10px] uppercase text-neutral-500 mb-1'>{t.publicApproval}</div>
        <div className={`text-3xl font-bold ${approvalClass}`}>{percentFormatter.format(approval)}</div>
      </div>

      {chart.agentPopulation ? (
        <div className='border border-black rounded-md p-4 bg-white'>
          <div className='text-[10px] uppercase text-gray-500 mb-2'>{t.agentPopulation}</div>
          <div className='flex items-end justify-between gap-3'>
            <div>
              <div className='text-2xl font-bold'>{chart.agentPopulation.copies.toLocaleString(locale)}</div>
              <div className='text-xs text-gray-500 uppercase'>{t.activeCopies}</div>
            </div>
            <div className='text-right'>
              <div className='text-xl font-bold'>{chart.agentPopulation.speed}x</div>
              <div className='text-xs text-gray-500 uppercase'>{t.speed}</div>
            </div>
          </div>
        </div>
      ) : null}

      <div className='mt-2'>
        <div className='text-[12px] uppercase font-mono mb-3'>{t.capabilities}</div>
        {capabilities.length === 0 ? (
          <p className='text-sm text-gray-500'>{t.noCapabilities}</p>
        ) : (
          <div className='flex flex-col gap-2'>
            {capabilities.map(([label, value]) => {
              const width = Math.max(6, Math.min(100, (value / maxCapability) * 100));
              return (
                <div key={label} className='w-full bg-gray-200 h-6 rounded-sm relative overflow-hidden border border-gray-300'>
                  <div className='bg-blue-700 h-full transition-all duration-500' style={{ width: `${width}%` }} />
                  <span className='absolute inset-0 flex items-center justify-between px-2 text-[10px] text-white font-mono mix-blend-difference'>
                    <span>{label}</span>
                    <span>{value.toFixed(2)}x</span>
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

const NarrativeSectionArticle = memo(function NarrativeSectionArticle({
  section,
  index,
  path,
}: {
  section: NarrativeSection;
  index: number;
  path: SimulationPath;
}) {
  return (
    <motion.article
      id={section.id}
      data-chart-extra={JSON.stringify(section.chartExtra)}
      data-path={path}
      className='scroll-mt-28'
      initial={{ opacity: 1, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.35, delay: index * 0.02 }}
    >
      <p className='text-xs font-mono uppercase tracking-[0.18em] text-blue-800 mb-2'>{section.navLabel}</p>
      <h2 className='text-3xl font-bold mb-4'>{section.title}</h2>
      <div
        className='text-[1.05rem] leading-relaxed text-gray-900 [&>p]:mb-4 [&_details]:border [&_details]:border-gray-300 [&_details]:rounded-xl [&_details]:p-4 [&_details]:bg-gray-50 [&_summary]:cursor-pointer [&_summary]:font-semibold [&_summary]:text-sm [&_summary]:uppercase [&_summary]:tracking-wide [&_details_p]:text-[0.95rem] [&_details_p]:text-gray-700 [&_details_p]:mt-3 [&_sup_a]:text-indigo-700 [&_sup_a]:font-semibold [&_sup_a]:no-underline [&_sup_a:hover]:underline'
        dangerouslySetInnerHTML={{ __html: section.storyHtml }}
      />
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
  const { ia2027 } = useDict();
  const t = ia2027.simulation;

  if (activePath === 'main') {
    return (
      <section className='border-t border-neutral-700 pt-10'>
        <p className='text-xs uppercase font-mono tracking-[0.2em] text-cyan-400 mb-2'>{t.singularityKicker}</p>
        <h3 className='text-3xl font-black tracking-tight mb-4 text-white'>{t.strategicChoice}</h3>
        <p className='text-neutral-300 mb-8 leading-relaxed max-w-3xl'>
          {t.choiceDescription}
        </p>
        <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
          <button
            type='button'
            onClick={() => onSelectPath('slowdown')}
            className='rounded-2xl border-2 border-emerald-700/60 bg-emerald-950/30 text-white px-6 py-8 text-left hover:bg-emerald-900/40 hover:border-emerald-500 transition-colors group'
          >
            <span className='block text-xs uppercase font-mono tracking-[0.2em] mb-2 text-emerald-400'>{t.slowdownLabel}</span>
            <span className='block text-3xl font-black text-emerald-400 group-hover:text-emerald-300'>{t.slowdownTitle}</span>
            <span className='block text-sm mt-3 text-neutral-400 leading-relaxed'>{t.slowdownDescription}</span>
          </button>

          <button
            type='button'
            onClick={() => onSelectPath('race')}
            className='rounded-2xl border-2 border-red-700/60 bg-red-950/30 text-white px-6 py-8 text-left hover:bg-red-900/40 hover:border-red-500 transition-colors group'
          >
            <span className='block text-xs uppercase font-mono tracking-[0.2em] mb-2 text-red-500'>{t.raceLabel}</span>
            <span className='block text-3xl font-black text-red-500 group-hover:text-red-400'>{t.raceTitle}</span>
            <span className='block text-sm mt-3 text-neutral-400 leading-relaxed'>{t.raceDescription}</span>
          </button>
        </div>
      </section>
    );
  }

  return (
    <section className='border-t border-neutral-700 pt-10'>
      <h3 className='text-2xl font-black uppercase tracking-tight mb-4 text-white'>{t.alternateEndings}</h3>
      <p className='text-neutral-400 mb-6'>
        {t.activeBranch} {activePath === 'slowdown' ? t.slowdownLabel : t.raceLabel}.
      </p>
      <div className='grid grid-cols-1 md:grid-cols-3 gap-3'>
        <button
          type='button'
          onClick={() => onSelectPath('main')}
          className='rounded-xl border border-neutral-700 bg-neutral-900/60 text-neutral-300 px-4 py-4 text-sm font-semibold hover:bg-neutral-800 transition-colors text-left'
        >
          {t.backToBifurcation}
        </button>
        <button
          type='button'
          onClick={() => onSelectPath('slowdown')}
          className={`rounded-xl border px-4 py-4 text-sm font-semibold transition-colors text-left ${
            activePath === 'slowdown'
              ? 'border-emerald-600 bg-emerald-700 text-white'
              : 'border-neutral-700 bg-neutral-900/60 text-neutral-400 hover:bg-neutral-800'
          }`}
        >
          {t.slowdownLabel}
        </button>
        <button
          type='button'
          onClick={() => onSelectPath('race')}
          className={`rounded-xl border px-4 py-4 text-sm font-semibold transition-colors text-left ${
            activePath === 'race'
              ? 'border-red-600 bg-red-700 text-white'
              : 'border-neutral-700 bg-neutral-900/60 text-neutral-400 hover:bg-neutral-800'
          }`}
        >
          {t.raceLabel}
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
  const { ia2027 } = useDict();
  const t = ia2027.simulation;

  if (!footnotes.length) {
    return null;
  }

  return (
    <section className='border-t border-gray-300 pt-10'>
      <h3 className='text-2xl font-black uppercase tracking-tight mb-6'>{t.references}</h3>
      <ol className='space-y-4'>
        {footnotes.map((footnote) => {
          const backReferenceId = firstReferenceByFootnote.get(footnote.num);
          return (
            <li
              key={footnote.id}
              id={`fn-${path}-${footnote.num}`}
              className='scroll-mt-28 border border-gray-200 rounded-lg p-4 bg-gray-50 text-sm text-gray-700 leading-relaxed'
            >
              <div dangerouslySetInnerHTML={{ __html: footnote.html }} />
              {backReferenceId ? (
                <a href={`#${backReferenceId}`} className='inline-block mt-2 text-indigo-700 font-semibold hover:underline'>
                  {t.backToExcerpt}
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
  const { ia2027 } = useDict();
  const t = ia2027.simulation;

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

  const pathConfigMap: Record<SimulationPath, PathConfig> = useMemo(
    () => ({
      main: {
        kicker: t.pathMain.kicker,
        title: t.pathMain.title,
        summary: t.pathMain.summary,
        sections: processedMain.sections,
        initialChart: (mainInitialChart as SimulationChartExtra) ?? FALLBACK_CHART,
        footnotes: (footnotesData as Footnote[]).filter((note) => note.context === 'main'),
        firstReferenceByFootnote: processedMain.firstReferenceByFootnote,
      },
      slowdown: {
        kicker: t.pathSlowdown.kicker,
        title: t.pathSlowdown.title,
        summary: t.pathSlowdown.summary,
        sections: processedSlowdown.sections,
        initialChart: (slowdownInitialChart as SimulationChartExtra) ?? FALLBACK_CHART,
        footnotes: (footnotesData as Footnote[]).filter((note) => note.context === 'slowdown'),
        firstReferenceByFootnote: processedSlowdown.firstReferenceByFootnote,
      },
      race: {
        kicker: t.pathRace.kicker,
        title: t.pathRace.title,
        summary: t.pathRace.summary,
        sections: processedRace.sections,
        initialChart: (raceInitialChart as SimulationChartExtra) ?? FALLBACK_CHART,
        footnotes: (footnotesData as Footnote[]).filter((note) => note.context === 'race'),
        firstReferenceByFootnote: processedRace.firstReferenceByFootnote,
      },
    }),
    [t],
  );

  const config = pathConfigMap[activePath];
  const selector = useMemo(() => `[data-chart-extra][data-path="${activePath}"]`, [activePath]);

  const { activeSectionId, activeChart } = useScrollSpy({
    selector,
    initialSectionId: config.sections[0]?.id,
    initialChart: config.initialChart,
  });

  const currentChart = activeChart ?? config.initialChart;

  const handleSelectPath = (nextPath: SimulationPath) => {
    if (nextPath === activePath) {
      return;
    }
    setActivePath(nextPath);
    const simEl = document.getElementById('ia-2027-sim');
    if (simEl) {
      simEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <div id='ia-2027-sim' className='min-h-screen bg-white text-black font-sans'>
      <header className='p-6 border-b border-gray-200 flex justify-between items-center bg-white'>
        <div className='max-w-7xl mx-auto w-full flex flex-wrap items-center justify-between gap-4'>
          <div>
            <p className='text-[11px] font-mono uppercase tracking-widest text-blue-700'>{config.kicker}</p>
            <h2 className='text-3xl font-bold'>{config.title}</h2>
          </div>
          <Link
            href='/simulacoes'
            className='text-sm font-semibold border border-black rounded-full px-4 py-2 hover:bg-black hover:text-white transition-colors'
          >
            {t.backLink}
          </Link>
        </div>
      </header>

      <main className='grid grid-cols-1 md:grid-cols-[120px_minmax(0,1fr)_400px] gap-8 max-w-7xl mx-auto p-6 relative'>
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

          <FootnotesBlock
            path={activePath}
            footnotes={config.footnotes}
            firstReferenceByFootnote={config.firstReferenceByFootnote}
          />

          <footer className='border-t border-gray-300 pt-6 space-y-3'>
            <p className='text-sm text-gray-700'>
              {t.footerAdaptation}{' '}
              <a href='https://ai-2027.com/' target='_blank' rel='noopener noreferrer' className='underline font-semibold'>
                ai-2027.com
              </a>
              .
            </p>
            <p className='text-sm text-gray-500'>{t.footerAuthors}</p>
            <p className='text-sm text-gray-500'>{t.footerTranslation}</p>
          </footer>
        </section>

        <aside className='hidden md:block sticky top-24 h-[80vh]'>
          <SimulationMetricsSidebar chart={currentChart} />
        </aside>
      </main>
    </div>
  );
}
