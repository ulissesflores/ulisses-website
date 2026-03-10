'use client';

import { memo, useMemo } from 'react';
import { motion } from 'framer-motion';
import type { SimulationChartExtra } from '@/components/simulations/ia-2027/types';
import { areaPath, compactUSD, linearScale, linePath, shortMonth } from './chart-utils';

const W = 340;
const H = 170;
const PAD = { top: 12, right: 12, bottom: 28, left: 46 };
const PLOT_W = W - PAD.left - PAD.right;
const PLOT_H = H - PAD.top - PAD.bottom;

function resolveNum(v: unknown, fb = 0): number {
  return typeof v === 'number' && Number.isFinite(v) ? v : fb;
}

export const SidebarTimelineChart = memo(function SidebarTimelineChart({
  history,
}: {
  history: SimulationChartExtra[];
}) {
  const data = useMemo(() => {
    if (history.length === 0) return null;

    const pts = history.map((c) => ({
      date: c.date,
      revenue: resolveNum(c.revenue),
      capex: resolveNum(c.capex as number),
    }));

    const maxRev = Math.max(...pts.map((p) => p.revenue), 1);
    const maxCapex = Math.max(...pts.map((p) => p.capex), 1);
    const maxY = Math.max(maxRev, maxCapex);

    const revPoints = pts.map((p, i) => ({
      x: PAD.left + (pts.length === 1 ? PLOT_W / 2 : linearScale(i, 0, pts.length - 1, 0, PLOT_W)),
      y: PAD.top + PLOT_H - linearScale(p.revenue, 0, maxY, 0, PLOT_H),
    }));

    const capexPoints = pts.map((p, i) => ({
      x: PAD.left + (pts.length === 1 ? PLOT_W / 2 : linearScale(i, 0, pts.length - 1, 0, PLOT_W)),
      y: PAD.top + PLOT_H - linearScale(p.capex, 0, maxY, 0, PLOT_H),
    }));

    const xLabels = pts.map((p, i) => ({
      x: PAD.left + (pts.length === 1 ? PLOT_W / 2 : linearScale(i, 0, pts.length - 1, 0, PLOT_W)),
      label: shortMonth(p.date),
    }));

    // Show max 5 x labels to avoid crowding
    const step = Math.max(1, Math.ceil(xLabels.length / 5));
    const visibleLabels = xLabels.filter((_, i) => i % step === 0 || i === xLabels.length - 1);

    // Y-axis ticks
    const ySteps = [0, maxY * 0.33, maxY * 0.66, maxY];
    const yTicks = ySteps.map((v) => ({
      y: PAD.top + PLOT_H - linearScale(v, 0, maxY, 0, PLOT_H),
      label: compactUSD(v),
    }));

    return {
      revPoints,
      capexPoints,
      revArea: areaPath(revPoints, PAD.top + PLOT_H),
      capexLine: linePath(capexPoints),
      visibleLabels,
      yTicks,
      lastRev: revPoints[revPoints.length - 1],
    };
  }, [history]);

  if (!data) {
    return (
      <div className="h-[170px] rounded-xl border border-neutral-800 bg-neutral-900/40 flex items-center justify-center">
        <span className="text-xs text-neutral-500 font-mono">Scroll para ver a evolucao</span>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-neutral-800 bg-neutral-900/40 overflow-hidden">
      <div className="flex items-center justify-between px-3 pt-2">
        <span className="text-[9px] font-mono uppercase text-neutral-500">Receita & Capex</span>
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1 text-[9px] text-emerald-400">
            <span className="inline-block w-3 h-0.5 bg-emerald-500 rounded" /> Receita
          </span>
          <span className="flex items-center gap-1 text-[9px] text-amber-400">
            <span className="inline-block w-3 h-0.5 bg-amber-500 rounded border-dashed" /> Capex
          </span>
        </div>
      </div>
      <svg viewBox={`0 0 ${W} ${H}`} width="100%" height={H} className="block">
        <defs>
          <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#10b981" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#10b981" stopOpacity="0.02" />
          </linearGradient>
        </defs>

        {/* Grid lines */}
        {data.yTicks.map((t, i) => (
          <g key={i}>
            <line
              x1={PAD.left}
              y1={t.y}
              x2={W - PAD.right}
              y2={t.y}
              stroke="#404040"
              strokeWidth="0.5"
              strokeDasharray="4 4"
            />
            <text x={PAD.left - 4} y={t.y + 3} textAnchor="end" fill="#737373" fontSize="8" fontFamily="monospace">
              {t.label}
            </text>
          </g>
        ))}

        {/* Revenue area */}
        <motion.path
          d={data.revArea}
          fill="url(#revGrad)"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        />
        {/* Revenue line */}
        <motion.path
          d={linePath(data.revPoints)}
          fill="none"
          stroke="#10b981"
          strokeWidth="2"
          strokeLinecap="round"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 0.6 }}
        />

        {/* Capex line (dashed) */}
        <motion.path
          d={data.capexLine}
          fill="none"
          stroke="#f59e0b"
          strokeWidth="1.5"
          strokeDasharray="4 3"
          strokeLinecap="round"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        />

        {/* Current point indicator */}
        {data.lastRev && (
          <g>
            <motion.circle
              cx={data.lastRev.x}
              cy={data.lastRev.y}
              r="4"
              fill="#10b981"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 300, damping: 20 }}
            />
            <motion.circle
              cx={data.lastRev.x}
              cy={data.lastRev.y}
              r="8"
              fill="none"
              stroke="#10b981"
              strokeWidth="1"
              initial={{ scale: 0, opacity: 0.6 }}
              animate={{ scale: [1, 1.6, 1], opacity: [0.6, 0, 0.6] }}
              transition={{ repeat: Infinity, duration: 2 }}
            />
          </g>
        )}

        {/* X-axis labels */}
        {data.visibleLabels.map((l, i) => (
          <text key={i} x={l.x} y={H - 6} textAnchor="middle" fill="#737373" fontSize="8" fontFamily="monospace">
            {l.label}
          </text>
        ))}
      </svg>
    </div>
  );
});
