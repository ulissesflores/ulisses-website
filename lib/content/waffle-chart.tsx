/**
 * ══════════════════════════════════════════════════════════════════════
 * WaffleChart — a humanidade em N pontos, grupos exclusivos
 * ══════════════════════════════════════════════════════════════════════
 *
 * SVG puro, sem biblioteca. Os 2.500 pontos NÃO viram 2.500 elementos:
 * como os grupos são contíguos na ordem de leitura, cada linha da grade é
 * desenhada como 1-3 <line> com `stroke-dasharray="0 CELL"` e
 * `stroke-linecap="round"` — o navegador renderiza um ponto redondo por
 * célula. ~100 elementos no DOM em vez de 2.500.
 *
 * Todo texto vem por props; os NÚMEROS vêm de `data/artigos-charts.ts`
 * referenciados por `dataset` (o `compileMDX` só entrega atributo string).
 *
 * Paleta validada (dataviz, 2026-08-02, superfície dark): CVD pior par
 * ΔE 10,6 (protan) PASS · visão normal 18,7 PASS. O cinza do primeiro
 * grupo fica ABAIXO de 3:1 de contraste por decisão editorial (grupo
 * "fora da conversa" é recessivo) — o alívio exigido existe: legenda
 * rotulada com contagem + os mesmos números em tabela no corpo do artigo.
 */

import { waffleDatasets } from '@/data/artigos-charts';

interface WaffleChartProps {
  /** Chave em `waffleDatasets`. */
  dataset: string;
  title: string;
  subtitle?: string;
  /** Descrição para leitor de tela — o gráfico é informativo, não decorativo. */
  description: string;
  /** Procedência, desenhada DENTRO do SVG — a imagem circula sozinha. */
  source?: string;
}

const COLS = 50;
const CELL = 11;
const DOT = 7;
const PAD = { top: 48, right: 190, bottom: 40, left: 24 };

export function WaffleChart({ dataset, title, subtitle, description, source }: WaffleChartProps) {
  const data = waffleDatasets[dataset];
  if (!data) {
    throw new Error(`WaffleChart: dataset desconhecido "${dataset}"`);
  }
  const total = data.categories.reduce((s, c) => s + c.count, 0);
  const rows = Math.ceil(total / COLS);
  const W = PAD.left + COLS * CELL + PAD.right;
  const H = PAD.top + rows * CELL + PAD.bottom;

  // Converte a sequência de grupos em segmentos horizontais por linha.
  const segments: { row: number; c0: number; c1: number; color: string }[] = [];
  let idx = 0;
  for (const cat of data.categories) {
    let remaining = cat.count;
    while (remaining > 0) {
      const row = Math.floor(idx / COLS);
      const c0 = idx % COLS;
      const take = Math.min(remaining, COLS - c0);
      segments.push({ row, c0, c1: c0 + take - 1, color: cat.color });
      idx += take;
      remaining -= take;
    }
  }

  const cx = (col: number) => PAD.left + col * CELL + CELL / 2;
  const cy = (row: number) => PAD.top + row * CELL + CELL / 2;

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

        {segments.map((s, i) => (
          <line
            key={i}
            x1={cx(s.c0)}
            y1={cy(s.row)}
            x2={cx(s.c1) + 0.01}
            y2={cy(s.row)}
            stroke={s.color}
            strokeWidth={DOT}
            strokeLinecap='round'
            strokeDasharray={`0 ${CELL}`}
          />
        ))}

        {data.categories.map((c, i) => (
          <g
            key={c.label}
            transform={`translate(${PAD.left + COLS * CELL + 18}, ${PAD.top + 10 + i * 40})`}
          >
            <circle cx='0' cy='-4' r='5' fill={c.color} />
            <text x='12' y='0' className='fill-neutral-300' fontSize='11'>
              {c.label}
            </text>
            <text x='12' y='14' className='fill-neutral-500' fontSize='10'>
              {c.sublabel}
            </text>
          </g>
        ))}

        {source ? (
          <text x={PAD.left} y={H - 12} className='fill-neutral-500' fontSize='9'>
            {source}
          </text>
        ) : null}
      </svg>
    </figure>
  );
}
