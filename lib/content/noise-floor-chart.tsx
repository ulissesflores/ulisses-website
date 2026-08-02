/**
 * ══════════════════════════════════════════════════════════════════════
 * NoiseFloorChart — piso de ruído do cosseno (1/sqrt(d)) por dimensão
 * ══════════════════════════════════════════════════════════════════════
 *
 * Curva teórica contínua + pontos medidos + linhas horizontais de sinal.
 * SVG puro; texto por props; números por `dataset` em
 * `data/artigos-charts-noisytv.ts` (compileMDX só passa prop string).
 * A curva é calculada aqui (é uma função, 1/sqrt(d)); o que é MEDIDO ou
 * escolhido (pontos, sinais, domínio) vive no dataset.
 */

import { noisyTvCharts } from '@/data/artigos-charts-noisytv';

interface NoiseFloorChartProps {
  /** Chave em `noisyTvCharts` (dataset de piso por dimensão). */
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

export function NoiseFloorChart({
  dataset,
  title,
  subtitle,
  xLabel,
  yLabel,
  description,
  source,
}: NoiseFloorChartProps) {
  const data = noisyTvCharts[dataset as keyof typeof noisyTvCharts];
  if (!data || !('medidos' in data)) {
    throw new Error(`NoiseFloorChart: dataset desconhecido "${dataset}"`);
  }
  const { dimDomain, xTicks, yMax, medidos, sinais } = data;
  const [d0, d1] = [Math.log10(dimDomain[0]), Math.log10(dimDomain[1])];
  const plotW = W - PAD.left - PAD.right;
  const plotH = H - PAD.top - PAD.bottom;

  const sx = (dim: number) => PAD.left + ((Math.log10(dim) - d0) / (d1 - d0)) * plotW;
  const sy = (v: number) => PAD.top + plotH - (v / yMax) * plotH;

  const curva = Array.from({ length: N_AMOSTRAS + 1 }, (_, i) => {
    const dim = 10 ** (d0 + (i / N_AMOSTRAS) * (d1 - d0));
    return `${sx(dim)},${sy(1 / Math.sqrt(dim))}`;
  }).join(' ');

  const yTicks = [0, 0.1, 0.2, 0.3, 0.4].filter((t) => t <= yMax);

  return (
    <figure className='my-10 not-prose'>
      <svg
        viewBox={`0 0 ${W} ${H}`}
        className='w-full h-auto rounded-lg border border-white/10 bg-neutral-900/60'
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
              {t.toFixed(1).replace('.', ',')}
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
            {t}
          </text>
        ))}

        {/* Sinais que o instrumento deveria detectar: tracejado por baixo da curva. */}
        {sinais.map((s, i) => (
          <g key={s.label}>
            <line
              x1={PAD.left}
              x2={PAD.left + plotW}
              y1={sy(s.valor)}
              y2={sy(s.valor)}
              stroke='#60a5fa'
              strokeWidth='1.5'
              strokeDasharray='6 4'
            />
            <text
              x={PAD.left + plotW - 4}
              y={sy(s.valor) + (i === 0 ? -6 : 14)}
              fill='#60a5fa'
              fontSize='10'
              textAnchor='end'
            >
              {s.label}
            </text>
          </g>
        ))}

        <polyline
          points={curva}
          fill='none'
          stroke='#f87171'
          strokeWidth='2.5'
          strokeLinejoin='round'
        />

        {/* Ponto na metade direita ancora o rótulo pela ponta, senão vaza da moldura. */}
        {medidos.map((m) => {
          const direita = sx(m.dim) > PAD.left + plotW / 2;
          return (
            <g key={m.label}>
              <circle cx={sx(m.dim)} cy={sy(m.sigma)} r='6' fill='#fbbf24' />
              <text
                x={sx(m.dim) + (direita ? -10 : 10)}
                y={sy(m.sigma) - 10}
                className='fill-white'
                fontSize='11'
                fontWeight='700'
                textAnchor={direita ? 'end' : 'start'}
              >
                {m.label}
              </text>
            </g>
          );
        })}

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
