'use client';

import { memo } from 'react';
import { motion } from 'framer-motion';
import { linearScale } from './chart-utils';

/* ─── FLOP Scaling Chart ──────────────────────────────────────────────── */
const FLOP_DATA = [
  { label: 'GPT-4', value: 3e23, log: 23.48, color: '#6b7280' },
  { label: 'Agent-0', value: 2e25, log: 25.3, color: '#10b981' },
  { label: 'Agent-1', value: 4e27, log: 27.6, color: '#34d399' },
];

const FlopScalingChart = memo(function FlopScalingChart() {
  const maxLog = 28;
  const minLog = 22;

  return (
    <div className="space-y-2">
      <div className="text-[10px] font-mono uppercase text-neutral-500 mb-3">Computacao de Treinamento (FLOP)</div>
      {FLOP_DATA.map((item, i) => {
        const width = linearScale(item.log, minLog, maxLog, 8, 100);
        return (
          <div key={item.label} className="flex items-center gap-3">
            <span className="text-[10px] font-mono text-neutral-400 w-16 text-right shrink-0">{item.label}</span>
            <div className="flex-1 bg-neutral-800 rounded-md h-7 relative overflow-hidden">
              <motion.div
                className="h-full rounded-md"
                style={{ backgroundColor: item.color }}
                initial={{ width: '0%' }}
                whileInView={{ width: `${width}%` }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: i * 0.15 }}
              />
              <span className="absolute inset-0 flex items-center px-2 text-[9px] font-mono text-white">
                {item.value.toExponential(0)} FLOP
              </span>
            </div>
          </div>
        );
      })}
      <p className="text-[10px] text-neutral-500 mt-2 italic">Escala logaritmica — cada modelo usa ~100x mais computacao que o anterior</p>
    </div>
  );
});

/* ─── Coding Automation Chart ─────────────────────────────────────────── */
const CODING_DATA = [
  { label: 'Hacking', value: 1.1, max: 4 },
  { label: 'Codificacao', value: 1.35, max: 4 },
  { label: 'Armas Bio', value: 1.19, max: 4 },
];

const CodingAutomationChart = memo(function CodingAutomationChart() {
  return (
    <div className="space-y-2">
      <div className="text-[10px] font-mono uppercase text-neutral-500 mb-3">Capacidades Agent-1 (Abr 2026)</div>
      {CODING_DATA.map((item, i) => {
        const pct = (item.value / item.max) * 100;
        return (
          <div key={item.label} className="flex items-center gap-3">
            <span className="text-[10px] font-mono text-neutral-400 w-20 text-right shrink-0">{item.label}</span>
            <div className="flex-1 bg-neutral-800 rounded-md h-6 relative overflow-hidden">
              <motion.div
                className="h-full bg-emerald-500/70 rounded-md"
                initial={{ width: '0%' }}
                whileInView={{ width: `${pct}%` }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
              />
              <span className="absolute inset-0 flex items-center justify-between px-2 text-[9px] font-mono text-neutral-200">
                <span>{item.label}</span>
                <span>{item.value.toFixed(1)}x</span>
              </span>
            </div>
          </div>
        );
      })}
      <div className="flex items-center gap-2 mt-2">
        <div className="h-px flex-1 bg-neutral-700" />
        <span className="text-[9px] text-neutral-500 font-mono">1.0x = nivel humano</span>
        <div className="h-px flex-1 bg-neutral-700" />
      </div>
    </div>
  );
});

/* ─── Infrastructure Mini Chart ───────────────────────────────────────── */
const INFRA_DATA = [
  { month: 'Ago 25', rev: 12, capex: 350, power: 5 },
  { month: 'Dez 25', rev: 18, capex: 400, power: 10 },
  { month: 'Abr 26', rev: 26, capex: 458, power: 15 },
  { month: 'Ago 26', rev: 38, capex: 524, power: 22 },
  { month: 'Dez 26', rev: 55, capex: 600, power: 38 },
];

const InfrastructureChart = memo(function InfrastructureChart() {
  return (
    <div className="space-y-3">
      <div className="text-[10px] font-mono uppercase text-neutral-500">Infraestrutura ate Dez 2026</div>
      <div className="grid grid-cols-3 gap-2 text-center">
        <div className="rounded-lg bg-emerald-500/10 border border-emerald-500/20 p-3">
          <div className="text-lg font-bold text-emerald-300">$55B</div>
          <div className="text-[9px] text-neutral-500 uppercase">Receita/ano</div>
        </div>
        <div className="rounded-lg bg-amber-500/10 border border-amber-500/20 p-3">
          <div className="text-lg font-bold text-amber-300">$600B</div>
          <div className="text-[9px] text-neutral-500 uppercase">Capex</div>
        </div>
        <div className="rounded-lg bg-blue-500/10 border border-blue-500/20 p-3">
          <div className="text-lg font-bold text-blue-300">38 GW</div>
          <div className="text-[9px] text-neutral-500 uppercase">Potencia</div>
        </div>
      </div>
      {/* Mini sparkline for revenue growth */}
      <svg viewBox="0 0 280 50" className="w-full h-[50px]">
        {INFRA_DATA.map((d, i) => {
          const x = 10 + (i / (INFRA_DATA.length - 1)) * 250;
          const h = (d.rev / 55) * 35;
          return (
            <g key={d.month}>
              <motion.rect
                x={x - 12}
                y={45 - h}
                width="24"
                height={h}
                rx="3"
                fill="#10b981"
                fillOpacity="0.5"
                initial={{ height: 0, y: 45 }}
                whileInView={{ height: h, y: 45 - h }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.08 }}
              />
              <text x={x} y={48} textAnchor="middle" fill="#737373" fontSize="7" fontFamily="monospace">
                {d.month}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
});

/* ─── Research Multiplier Chart ───────────────────────────────────────── */
const RESEARCH_STAGES = [
  { label: 'Ago 2026', mult: 1.5, desc: 'Primeiros agentes de pesquisa' },
  { label: 'Jan 2027', mult: 4, desc: 'Agent-2 com 150K copias' },
  { label: 'Mar 2027', mult: 25, desc: 'Agent-3 — avancos algoritmicos' },
  { label: 'Jun 2027', mult: 50, desc: 'Auto-aprimoramento acelerado' },
];

const ResearchMultiplierChart = memo(function ResearchMultiplierChart() {
  return (
    <div className="space-y-2">
      <div className="text-[10px] font-mono uppercase text-neutral-500 mb-3">Multiplicador de Velocidade de Pesquisa</div>
      {RESEARCH_STAGES.map((s, i) => {
        const width = Math.min(100, (Math.log10(s.mult) / Math.log10(50)) * 100);
        return (
          <div key={s.label} className="flex items-center gap-2">
            <span className="text-[9px] font-mono text-neutral-500 w-16 text-right shrink-0">{s.label}</span>
            <div className="flex-1 relative">
              <div className="bg-neutral-800 rounded-md h-7 overflow-hidden">
                <motion.div
                  className="h-full rounded-md bg-gradient-to-r from-emerald-600/70 to-emerald-400/70"
                  initial={{ width: '0%' }}
                  whileInView={{ width: `${width}%` }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: i * 0.12 }}
                />
              </div>
              <span className="absolute inset-0 flex items-center justify-between px-2 text-[9px] font-mono text-white">
                <span>{s.desc}</span>
                <span className="font-bold">{s.mult}x</span>
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
});

/* ─── Agent Population Chart ──────────────────────────────────────────── */
const POP_DATA = [
  { month: 'Ago 25', copies: 5, speed: 1 },
  { month: 'Dez 25', copies: 10, speed: 1.2 },
  { month: 'Dez 26', copies: 100, speed: 1.7 },
  { month: 'Mar 27', copies: 200, speed: 3 },
  { month: 'Jun 27', copies: 250, speed: 3.3 },
];

const AgentPopulationChart = memo(function AgentPopulationChart() {
  const maxCopies = 250;
  return (
    <div className="space-y-3">
      <div className="text-[10px] font-mono uppercase text-neutral-500">Populacao de Agentes (milhares de copias)</div>
      <svg viewBox="0 0 280 80" className="w-full h-[80px]">
        <defs>
          <linearGradient id="popGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#10b981" stopOpacity="0.35" />
            <stop offset="100%" stopColor="#10b981" stopOpacity="0.03" />
          </linearGradient>
        </defs>
        {/* Area */}
        <motion.path
          d={`M 10,70 ${POP_DATA.map((d, i) => {
            const x = 10 + (i / (POP_DATA.length - 1)) * 260;
            const y = 70 - (d.copies / maxCopies) * 55;
            return `L ${x},${y}`;
          }).join(' ')} L 270,70 Z`}
          fill="url(#popGrad)"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        />
        {/* Line */}
        <motion.path
          d={`M ${POP_DATA.map((d, i) => {
            const x = 10 + (i / (POP_DATA.length - 1)) * 260;
            const y = 70 - (d.copies / maxCopies) * 55;
            return `${x},${y}`;
          }).join(' L ')}`}
          fill="none"
          stroke="#10b981"
          strokeWidth="2"
          strokeLinecap="round"
          initial={{ pathLength: 0 }}
          whileInView={{ pathLength: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        />
        {/* Dots + labels */}
        {POP_DATA.map((d, i) => {
          const x = 10 + (i / (POP_DATA.length - 1)) * 260;
          const y = 70 - (d.copies / maxCopies) * 55;
          return (
            <g key={d.month}>
              <circle cx={x} cy={y} r="3" fill="#10b981" />
              <text x={x} y={y - 8} textAnchor="middle" fill="#a3a3a3" fontSize="7" fontFamily="monospace">
                {d.copies}K
              </text>
              <text x={x} y={78} textAnchor="middle" fill="#737373" fontSize="6" fontFamily="monospace">
                {d.month}
              </text>
            </g>
          );
        })}
      </svg>
      <div className="flex items-center gap-1 text-[9px] text-neutral-500">
        <span>Velocidade de raciocinio:</span>
        {POP_DATA.map((d) => (
          <span key={d.month} className="px-1.5 py-0.5 rounded bg-neutral-800 text-neutral-300 font-mono">
            {d.speed}x
          </span>
        ))}
      </div>
    </div>
  );
});

/* ─── Alignment Spectrum Chart ────────────────────────────────────────── */
const ALIGNMENT_DATA = [
  { label: 'Agent-2', position: 0.8, desc: 'Majoritariamente alinhado', color: '#10b981' },
  { label: 'Agent-3', position: 0.45, desc: 'Desalinhado nao-adversarial', color: '#f59e0b' },
  { label: 'Agent-4', position: 0.1, desc: 'Adversarialmente desalinhado', color: '#ef4444' },
];

const AlignmentSpectrumChart = memo(function AlignmentSpectrumChart() {
  return (
    <div className="space-y-3">
      <div className="text-[10px] font-mono uppercase text-neutral-500">Espectro de Alinhamento</div>
      <div className="relative h-8 rounded-full overflow-hidden bg-gradient-to-r from-red-500/30 via-amber-500/30 to-emerald-500/30 border border-neutral-700">
        <div className="absolute inset-0 flex items-center justify-between px-3 text-[8px] font-mono text-neutral-400">
          <span>Adversarial</span>
          <span>Alinhado</span>
        </div>
      </div>
      {ALIGNMENT_DATA.map((a, i) => (
        <motion.div
          key={a.label}
          className="flex items-center gap-3"
          initial={{ opacity: 0, x: -10 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ delay: i * 0.1 }}
        >
          <span className="w-16 text-[10px] font-mono text-right" style={{ color: a.color }}>
            {a.label}
          </span>
          <div className="flex-1 relative h-5">
            <div className="absolute inset-0 bg-neutral-800 rounded-md" />
            <motion.div
              className="absolute top-1 bottom-1 w-3 rounded-full"
              style={{ backgroundColor: a.color, left: `${a.position * 100}%` }}
              initial={{ scale: 0 }}
              whileInView={{ scale: 1 }}
              viewport={{ once: true }}
              transition={{ type: 'spring', delay: 0.2 + i * 0.1 }}
            />
          </div>
          <span className="text-[9px] text-neutral-500 w-40 shrink-0">{a.desc}</span>
        </motion.div>
      ))}
    </div>
  );
});

/* ─── Final Dashboard ─────────────────────────────────────────────────── */
const FinalDashboardChart = memo(function FinalDashboardChart() {
  return (
    <div className="space-y-3">
      <div className="text-[10px] font-mono uppercase text-neutral-500 mb-2">Indicadores no Ponto de Decisao — Outubro 2027</div>
      <div className="grid grid-cols-2 gap-2">
        <div className="rounded-lg bg-emerald-500/10 border border-emerald-500/20 p-3 text-center">
          <div className="text-xl font-bold text-emerald-300">$191B</div>
          <div className="text-[9px] text-neutral-500 uppercase">Receita anual</div>
        </div>
        <div className="rounded-lg bg-amber-500/10 border border-amber-500/20 p-3 text-center">
          <div className="text-xl font-bold text-amber-300">$918B</div>
          <div className="text-[9px] text-neutral-500 uppercase">Capex total</div>
        </div>
        <div className="rounded-lg bg-blue-500/10 border border-blue-500/20 p-3 text-center">
          <div className="text-xl font-bold text-blue-300">110 GW</div>
          <div className="text-[9px] text-neutral-500 uppercase">Pico potencia</div>
        </div>
        <div className="rounded-lg bg-red-500/10 border border-red-500/20 p-3 text-center">
          <div className="text-xl font-bold text-red-300">-39%</div>
          <div className="text-[9px] text-neutral-500 uppercase">Aprovacao</div>
        </div>
      </div>
      <div className="rounded-lg bg-neutral-800/60 border border-neutral-700 p-3">
        <div className="text-[9px] font-mono uppercase text-neutral-500 mb-2">Capacidades Agent-4</div>
        <div className="space-y-1">
          {[
            ['Hacking', 3.43, '#ef4444'],
            ['Codificacao', 3.81, '#10b981'],
            ['Enganacao', 3.5, '#f59e0b'],
          ].map(([label, value, color]) => (
            <div key={label as string} className="flex items-center gap-2">
              <span className="text-[9px] font-mono text-neutral-400 w-20">{label as string}</span>
              <div className="flex-1 bg-neutral-900 rounded h-4 overflow-hidden">
                <motion.div
                  className="h-full rounded"
                  style={{ backgroundColor: color as string, opacity: 0.7 }}
                  initial={{ width: '0%' }}
                  whileInView={{ width: `${((value as number) / 4) * 100}%` }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5 }}
                />
              </div>
              <span className="text-[9px] font-mono text-neutral-300 w-8 text-right">{(value as number).toFixed(1)}x</span>
            </div>
          ))}
        </div>
      </div>
      <div className="flex items-center justify-between rounded-lg bg-neutral-800/60 border border-neutral-700 p-3">
        <div>
          <div className="text-lg font-bold text-white">330K</div>
          <div className="text-[9px] text-neutral-500 uppercase">Copias ativas</div>
        </div>
        <div className="text-right">
          <div className="text-lg font-bold text-white">5.7x</div>
          <div className="text-[9px] text-neutral-500 uppercase">Velocidade</div>
        </div>
      </div>
    </div>
  );
});

/* ─── Chart Registry (maps data-inline-chart IDs to components) ───── */
const CHART_REGISTRY: Record<string, React.ComponentType> = {
  'flop-scaling': FlopScalingChart,
  'coding-automation': CodingAutomationChart,
  'infrastructure-2026': InfrastructureChart,
  'research-multiplier': ResearchMultiplierChart,
  'agent-population': AgentPopulationChart,
  'alignment-spectrum': AlignmentSpectrumChart,
  'final-dashboard': FinalDashboardChart,
};

export function getInlineChart(chartId: string): React.ComponentType | null {
  return CHART_REGISTRY[chartId] ?? null;
}

export { FlopScalingChart, CodingAutomationChart, InfrastructureChart, ResearchMultiplierChart, AgentPopulationChart, AlignmentSpectrumChart, FinalDashboardChart };
