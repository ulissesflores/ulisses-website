/**
 * ══════════════════════════════════════════════════════════════════════
 * EffortCostChart — custo por tarefa (log) x desempenho, por nível de esforço
 * ══════════════════════════════════════════════════════════════════════
 *
 * SVG puro, sem dependência de biblioteca de gráficos: são 4 séries de 5
 * pontos numa escala log — uma lib inteira para isso não se paga.
 *
 * Todo texto vem por props: o corpo do artigo é quem sabe o idioma. Os NÚMEROS
 * vêm de `data/artigos-charts.ts` referenciados por `dataset`, porque o
 * `compileMDX` só entrega ao componente os atributos string do JSX — atributo
 * de expressão chega `undefined`.
 */

import { chartDatasets } from '@/data/artigos-charts';

interface EffortCostChartProps {
  /** Chave em `chartDatasets`. */
  dataset: string;
  title: string;
  subtitle?: string;
  xLabel: string;
  yLabel: string;
  /** Descrição para leitor de tela — o gráfico é informativo, não decorativo. */
  description: string;
}

const W = 720;
const H = 420;
const PAD = { top: 44, right: 132, bottom: 62, left: 52 };

export function EffortCostChart({
  dataset,
  title,
  subtitle,
  xLabel,
  yLabel,
  description,
}: EffortCostChartProps) {
  const data = chartDatasets[dataset];
  if (!data) {
    throw new Error(`EffortCostChart: dataset desconhecido "${dataset}"`);
  }
  const { series, xDomain, yDomain, xTicks, yTicks } = data;
  const [x0, x1] = [Math.log10(xDomain[0]), Math.log10(xDomain[1])];
  const [y0, y1] = yDomain;
  const plotW = W - PAD.left - PAD.right;
  const plotH = H - PAD.top - PAD.bottom;

  const sx = (cost: number) =>
    PAD.left + ((Math.log10(cost) - x0) / (x1 - x0)) * plotW;
  const sy = (score: number) =>
    PAD.top + plotH - ((score - y0) / (y1 - y0)) * plotH;

  return (
    <figure className='my-10 not-prose'>
      <svg
        viewBox={`0 0 ${W} ${H}`}
        className='w-full h-auto rounded-lg border border-white/10 bg-neutral-900/60'
        role='img'
        aria-label={description}
      >
        <title>{description}</title>

        <text x={PAD.left} y={22} className='fill-white' fontSize='15' fontWeight='700'>
          {title}
        </text>
        {subtitle ? (
          <text x={PAD.left} y={38} className='fill-neutral-400' fontSize='11'>
            {subtitle}
          </text>
        ) : null}

        {yTicks.map((t) => (
          <g key={`y${t}`}>
            <line
              x1={PAD.left}
              x2={PAD.left + plotW}
              y1={sy(t)}
              y2={sy(t)}
              className='stroke-white/10'
              strokeWidth='1'
            />
            <text
              x={PAD.left - 8}
              y={sy(t) + 4}
              className='fill-neutral-500'
              fontSize='10'
              textAnchor='end'
            >
              {t}
            </text>
          </g>
        ))}

        {xTicks.map((t) => (
          <text
            key={`x${t}`}
            x={sx(t)}
            y={PAD.top + plotH + 18}
            className='fill-neutral-500'
            fontSize='10'
            textAnchor='middle'
          >
            {`$${t}`}
          </text>
        ))}

        {series.map((s) => (
          <g key={s.label}>
            <polyline
              points={s.points.map(([c, v]) => `${sx(c)},${sy(v)}`).join(' ')}
              fill='none'
              stroke={s.color}
              strokeWidth='2'
              strokeLinejoin='round'
              strokeLinecap='round'
            />
            {s.points.map(([c, v]) => (
              <circle key={`${c}-${v}`} cx={sx(c)} cy={sy(v)} r='4' fill={s.color} />
            ))}
          </g>
        ))}

        {series.map((s, i) => (
          <g key={`legend-${s.label}`} transform={`translate(${PAD.left + plotW + 16}, ${PAD.top + 8 + i * 22})`}>
            <circle cx='0' cy='-4' r='5' fill={s.color} />
            <text x='12' y='0' className='fill-neutral-300' fontSize='11'>
              {s.label}
            </text>
          </g>
        ))}

        <text
          x={PAD.left + plotW / 2}
          y={H - 14}
          className='fill-neutral-400'
          fontSize='11'
          textAnchor='middle'
        >
          {xLabel}
        </text>
        <text
          x={-(PAD.top + plotH / 2)}
          y={16}
          className='fill-neutral-400'
          fontSize='11'
          textAnchor='middle'
          transform='rotate(-90)'
        >
          {yLabel}
        </text>
      </svg>
    </figure>
  );
}
