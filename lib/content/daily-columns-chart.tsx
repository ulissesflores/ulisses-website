/**
 * ══════════════════════════════════════════════════════════════════════
 * DailyColumnsChart — uma coluna por dia numa série temporal, com callouts
 * ══════════════════════════════════════════════════════════════════════
 *
 * COMPONENTE NOVO do artigo `conluio-dos-agentes`. O site não tem série
 * temporal de colunas (os candidatos — utilization/noise-floor/constraint —
 * ou são log-log, ou computam curva teórica, ou têm `mode` semanticamente
 * travado). Aqui a forma É a tese: seis semanas quase zeradas, um pico, e o
 * penhasco do desligamento. Os DIAS ZERADOS têm de aparecer, senão o gráfico
 * esconde o buraco.
 *
 * SVG puro; texto por props (o corpo sabe o idioma); números e cores via
 * `dataset` em `data/artigos-charts.ts` (o `compileMDX` só entrega atributo
 * string). Determinístico: nada de aleatório, ordem fixa no dataset.
 *
 * Cor codifica PAPEL, não categoria: o pico vem em ouro (o que ver primeiro),
 * o dia do desligamento em azul (a série-tese), o resto em cinza. Vermelho
 * jamais — não há vilão nesta figura.
 *
 * Orçamento de texto por vaga (medido por `checar-figuras.py`, não estimado):
 *   - title: largura total menos as margens (W - 32)
 *   - callout (acima da coluna): 64 px
 *   - rótulo de dia (sob o eixo): 52 px, centrado na coluna
 *   - unitLabel + source: metade da largura cada, cantos opostos do rodapé
 */

import { dailyColumnsDatasets } from '@/data/artigos-charts';

interface DailyColumnsChartProps {
  /** Chave em `dailyColumnsDatasets`. */
  dataset: string;
  title: string;
  subtitle?: string;
  /** Descrição para leitor de tela — o gráfico é informativo, não decorativo. */
  description: string;
  /** Procedência (e o atalho), desenhada DENTRO do SVG. */
  source?: string;
}

const W = 720;
const H = 400;
const PAD = { top: 64, right: 24, bottom: 56, left: 26 };
const OURO = '#a48f65';

export function DailyColumnsChart({
  dataset,
  title,
  subtitle,
  description,
  source,
}: DailyColumnsChartProps) {
  const data = dailyColumnsDatasets[dataset];
  if (!data) {
    throw new Error(`DailyColumnsChart: dataset desconhecido "${dataset}"`);
  }

  const plotW = W - PAD.left - PAD.right;
  const plotH = H - PAD.top - PAD.bottom;
  const baseY = PAD.top + plotH;
  const n = data.columns.length;
  const step = plotW / n;
  const barW = Math.max(3, step * 0.62);
  const sy = (v: number) => (v / data.max) * plotH;

  return (
    <figure className='my-10 not-prose'>
      <svg
        viewBox={`0 0 ${W} ${H}`}
        className='w-full h-auto rounded-lg border border-white/10 bg-neutral-900/60 font-chart'
        role='img'
        aria-label={description}
      >
        <title>{description}</title>

        <text x={PAD.left} y={26} className='fill-white' fontSize='15' fontWeight='700'>
          {title}
        </text>
        {subtitle ? (
          <text x={PAD.left} y={45} className='fill-neutral-400' fontSize='12'>
            {subtitle}
          </text>
        ) : null}

        {/* linha de base */}
        <line
          x1={PAD.left}
          y1={baseY}
          x2={W - PAD.right}
          y2={baseY}
          stroke='#3f3f46'
          strokeWidth='1'
        />

        {data.columns.map((c, i) => {
          const x = PAD.left + i * step + (step - barW) / 2;
          const h = sy(c.value);
          const y = baseY - h;
          const cx = PAD.left + i * step + step / 2;
          return (
            <g key={c.dia}>
              <rect x={x} y={y} width={barW} height={Math.max(h, c.value > 0 ? 1 : 0)} fill={c.color} />
              {c.callout ? (
                <text
                  x={cx}
                  y={y - 6}
                  textAnchor='middle'
                  fontSize='12'
                  fontWeight='700'
                  fill={c.color === OURO ? OURO : '#e5e7eb'}
                >
                  {c.callout}
                </text>
              ) : null}
              {c.label ? (
                <text
                  x={cx}
                  y={baseY + 16}
                  textAnchor='middle'
                  fontSize='11'
                  className='fill-neutral-400'
                >
                  {c.label}
                </text>
              ) : null}
            </g>
          );
        })}

        <text x={PAD.left} y={H - 12} fontSize='11' className='fill-neutral-500'>
          {data.unitLabel}
        </text>
        {source ? (
          <text x={W - PAD.right} y={H - 12} textAnchor='end' fontSize='11' className='fill-neutral-500'>
            {source}
          </text>
        ) : null}
      </svg>
    </figure>
  );
}
