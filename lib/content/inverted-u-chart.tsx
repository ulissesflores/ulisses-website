/**
 * ══════════════════════════════════════════════════════════════════════
 * InvertedUChart — intensidade de curiosidade 4·g·(1-g) + lacuna-fantasma
 * ══════════════════════════════════════════════════════════════════════
 *
 * A curva é a própria função (calculada aqui); o ponto destacado — a lacuna
 * feita só de ruído — vem do dataset em `data/artigos-charts-noisytv.ts`,
 * porque é um número MEDIDO, não uma escolha de desenho. Texto por props
 * (compileMDX só passa prop string).
 */

import { noisyTvCharts } from '@/data/artigos-charts-noisytv';

interface InvertedUChartProps {
  /** Chave em `noisyTvCharts` (dataset do ponto destacado). */
  dataset: string;
  title: string;
  subtitle?: string;
  xLabel: string;
  yLabel: string;
  /** Descrição para leitor de tela. */
  description: string;
  /** Procedência, desenhada dentro do SVG. */
  source?: string;
}

const W = 720;
const H = 420;
const PAD = { top: 56, right: 24, bottom: 64, left: 56 };
const N_AMOSTRAS = 96;

const intensidade = (g: number) => 4 * g * (1 - g);

export function InvertedUChart({
  dataset,
  title,
  subtitle,
  xLabel,
  yLabel,
  description,
  source,
}: InvertedUChartProps) {
  const data = noisyTvCharts[dataset as keyof typeof noisyTvCharts];
  if (!data || !('destaque' in data)) {
    throw new Error(`InvertedUChart: dataset desconhecido "${dataset}"`);
  }
  const { destaque } = data;
  const plotW = W - PAD.left - PAD.right;
  const plotH = H - PAD.top - PAD.bottom;
  const sx = (g: number) => PAD.left + g * plotW;
  const sy = (v: number) => PAD.top + plotH - v * plotH;

  const curva = Array.from({ length: N_AMOSTRAS + 1 }, (_, i) => {
    const g = i / N_AMOSTRAS;
    return `${sx(g)},${sy(intensidade(g))}`;
  }).join(' ');

  const gD = destaque.g;
  const vD = intensidade(gD);
  const ticks = [0, 0.25, 0.5, 0.75, 1];

  return (
    <figure className='my-10 not-prose'>
      <svg
        viewBox={`0 0 ${W} ${H}`}
        className='w-full h-auto rounded-lg border border-white/10 bg-neutral-900/60 font-chart'
        role='img'
        aria-label={description}
      >
        <title>{description}</title>

        <text x={PAD.left} y={24} className='fill-white' fontSize='15' fontWeight='700'>
          {title}
        </text>
        {subtitle ? (
          <text x={PAD.left} y={42} className='fill-neutral-400' fontSize='11'>
            {subtitle}
          </text>
        ) : null}

        {ticks.map((t) => (
          <g key={`t${t}`}>
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
              {t.toFixed(2).replace('.', ',')}
            </text>
            <text
              x={sx(t)}
              y={PAD.top + plotH + 18}
              className='fill-neutral-500'
              fontSize='10'
              textAnchor='middle'
            >
              {t.toFixed(2).replace('.', ',')}
            </text>
          </g>
        ))}

        <polyline
          points={curva}
          fill='none'
          stroke='#60a5fa'
          strokeWidth='2.5'
          strokeLinejoin='round'
        />

        {/* Máximo teórico em g=0,5: referência discreta. */}
        <circle cx={sx(0.5)} cy={sy(1)} r='4' fill='#60a5fa' opacity='0.7' />

        {/* Lacuna-fantasma: guias até os eixos + ponto de alerta. */}
        <line
          x1={sx(gD)}
          x2={sx(gD)}
          y1={sy(0)}
          y2={sy(vD)}
          stroke='#f87171'
          strokeWidth='1.5'
          strokeDasharray='4 4'
        />
        <line
          x1={PAD.left}
          x2={sx(gD)}
          y1={sy(vD)}
          y2={sy(vD)}
          stroke='#f87171'
          strokeWidth='1.5'
          strokeDasharray='4 4'
        />
        <circle cx={sx(gD)} cy={sy(vD)} r='7' fill='#f87171' />
        {/* Rótulo abaixo-à-direita do ponto: a cúpula da curva fica acima dessa faixa. */}
        <text
          x={sx(gD) + 12}
          y={sy(vD) + 20}
          className='fill-white'
          fontSize='11'
          fontWeight='700'
        >
          {destaque.label}
        </text>

        <text
          x={PAD.left + plotW / 2}
          y={H - 30}
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
        {source ? (
          <text x={PAD.left} y={H - 10} className='fill-neutral-500' fontSize='9'>
            {source}
          </text>
        ) : null}
      </svg>
    </figure>
  );
}
