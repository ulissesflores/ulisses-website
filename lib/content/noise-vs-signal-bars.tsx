/**
 * ══════════════════════════════════════════════════════════════════════
 * NoiseVsSignalBars — barras horizontais: ruído do instrumento x sinal
 * ══════════════════════════════════════════════════════════════════════
 *
 * SVG puro, sem lib de gráficos: são 4 barras. Todo texto vem por props
 * (o corpo do artigo sabe o idioma); os NÚMEROS vêm de
 * `data/artigos-charts-noisytv.ts` referenciados por `dataset`, porque o
 * `compileMDX` só entrega ao componente atributo string do JSX.
 */

import { noisyTvCharts } from '@/data/artigos-charts-noisytv';

interface NoiseVsSignalBarsProps {
  /** Chave em `noisyTvCharts` (dataset de barras). */
  dataset: string;
  title: string;
  subtitle?: string;
  /** Descrição para leitor de tela — o gráfico é informativo, não decorativo. */
  description: string;
  /** Procedência, desenhada DENTRO do SVG: a imagem circula sem o texto. */
  source?: string;
}

const W = 720;
const ROW_H = 56;
const PAD = { top: 56, right: 64, bottom: 40, left: 16 };
const COR = { ruido: '#f87171', sinal: '#60a5fa' };

export function NoiseVsSignalBars({
  dataset,
  title,
  subtitle,
  description,
  source,
}: NoiseVsSignalBarsProps) {
  const data = noisyTvCharts[dataset as keyof typeof noisyTvCharts];
  if (!data || !('barras' in data)) {
    throw new Error(`NoiseVsSignalBars: dataset desconhecido "${dataset}"`);
  }
  const { barras, xMax } = data;
  const plotW = W - PAD.left - PAD.right;
  const H = PAD.top + barras.length * ROW_H + PAD.bottom;
  const sx = (v: number) => (v / xMax) * plotW;

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

        {barras.map((b, i) => {
          const y = PAD.top + i * ROW_H;
          return (
            <g key={b.label}>
              <text x={PAD.left} y={y + 14} className='fill-neutral-300' fontSize='11'>
                {b.label}
              </text>
              <rect
                x={PAD.left}
                y={y + 20}
                width={sx(b.valor)}
                height={18}
                rx={3}
                fill={COR[b.tipo]}
                opacity={b.tipo === 'ruido' ? 0.95 : 0.8}
              />
              <text
                x={PAD.left + sx(b.valor) + 8}
                y={y + 34}
                className='fill-white'
                fontSize='12'
                fontWeight='700'
              >
                {b.valor.toFixed(3).replace('.', ',')}
              </text>
            </g>
          );
        })}

        {source ? (
          <text x={PAD.left} y={H - 12} className='fill-neutral-500' fontSize='9'>
            {source}
          </text>
        ) : null}
      </svg>
    </figure>
  );
}
