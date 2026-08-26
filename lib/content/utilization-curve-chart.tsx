/**
 * ══════════════════════════════════════════════════════════════════════
 * UtilizationCurveChart — custo por milhão de tokens x utilização (log-log)
 * ══════════════════════════════════════════════════════════════════════
 *
 * SVG puro. Duas cenas com a MESMA geometria, escolhidas por `mode`:
 *   "assumido" — uma máquina, a linha da API e o ponto de 1 % que o autor
 *                tinha assumido (a primeira figura do artigo);
 *   "medido"   — três máquinas, a mesma linha da API, três âncoras medidas
 *                (chat mediano, chat intenso, agente de código) e o 1 %
 *                esmaecido no meio do vazio (a figura que retoma a primeira).
 *
 * Eixo X = fração do tempo em que a máquina gera token; eixo Y = US$ por
 * milhão de tokens de saída. Os dois são logarítmicos porque a curva varre
 * quatro ordens de grandeza em cada eixo — em escala linear ela vira um L.
 *
 * Texto por props (o corpo do artigo sabe o idioma); NÚMEROS e rótulos das
 * séries/âncoras via `dataset` em `data/utilization-curve.ts`, porque o
 * `compileMDX` só entrega atributo string. A projeção (Mac M5 Ultra, sem
 * benchmark) é tracejada — a distinção nunca é só cor.
 */

import { utilizationCurveDatasets } from '@/data/utilization-curve';

interface UtilizationCurveChartProps {
  /** Chave em `utilizationCurveDatasets`. */
  dataset: string;
  /** Cena: "assumido" | "medido". */
  mode: string;
  title: string;
  subtitle?: string;
  xLabel: string;
  yLabel: string;
  /** Descrição para leitor de tela — o gráfico é informativo, não decorativo. */
  description: string;
  /** Procedência (e o atalho), desenhada DENTRO do SVG. */
  source?: string;
}

const W = 720;
const H = 470;
const PAD = { top: 44, right: 220, bottom: 70, left: 66 };
const OURO = '#a48f65';
const API_COLOR = '#d4d4d8';
const GHOST = '#64748b';

type Sep = { thousands: string; decimal: string; pctSpace: string };

/** 0.0001 -> "0,01 %" (pt) / "0.01%" (en) — separadores vêm do dataset, não do runtime. */
function fmtPct(u: number, sep: Sep): string {
  const p = Number((u * 100).toPrecision(3));
  return `${String(p).replace('.', sep.decimal)}${sep.pctSpace}%`;
}

/** 1000 -> "1.000" (pt) / "1,000" (en); a unidade mora no yLabel. Determinístico no servidor e no cliente. */
function fmtNum(v: number, sep: Sep): string {
  return String(v).replace(/\B(?=(\d{3})+(?!\d))/g, sep.thousands);
}

export function UtilizationCurveChart({
  dataset,
  mode,
  title,
  subtitle,
  xLabel,
  yLabel,
  description,
  source,
}: UtilizationCurveChartProps) {
  const scenes = utilizationCurveDatasets[dataset];
  if (!scenes) {
    throw new Error(`UtilizationCurveChart: dataset desconhecido "${dataset}"`);
  }
  const data = scenes[mode];
  if (!data) {
    throw new Error(`UtilizationCurveChart: cena desconhecida "${mode}" em "${dataset}"`);
  }
  const { series, api, anchors, ghost, xDomain, yDomain, xTicks, yTicks, sep } = data;
  const [x0, x1] = [Math.log10(xDomain[0]), Math.log10(xDomain[1])];
  const [y0, y1] = [Math.log10(yDomain[0]), Math.log10(yDomain[1])];
  const plotW = W - PAD.left - PAD.right;
  const plotH = H - PAD.top - PAD.bottom;
  const sx = (u: number) => PAD.left + ((Math.log10(u) - x0) / (x1 - x0)) * plotW;
  const sy = (c: number) => PAD.top + plotH - ((Math.log10(c) - y0) / (y1 - y0)) * plotH;
  const legend: { label: string; color: string; dashed: boolean }[] = [
    ...series.map((s) => ({ label: s.label, color: s.color, dashed: s.dashed })),
    { label: api.label, color: API_COLOR, dashed: true },
  ];

  return (
    <figure className='my-10 not-prose'>
      <svg
        viewBox={`0 0 ${W} ${H}`}
        className='w-full h-auto rounded-lg border border-white/10 bg-neutral-900/60 font-chart'
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
              {fmtNum(t, sep)}
            </text>
          </g>
        ))}

        {xTicks.map((t) => (
          <g key={`x${t}`}>
            <line
              x1={sx(t)}
              x2={sx(t)}
              y1={PAD.top}
              y2={PAD.top + plotH}
              className='stroke-white/10'
              strokeWidth='1'
            />
            <text
              x={sx(t)}
              y={PAD.top + plotH + 18}
              className='fill-neutral-500'
              fontSize='10'
              textAnchor='middle'
            >
              {fmtPct(t, sep)}
            </text>
          </g>
        ))}

        {/* A linha da API: o preço que a máquina precisa alcançar. */}
        <line
          x1={PAD.left}
          x2={PAD.left + plotW}
          y1={sy(api.cost)}
          y2={sy(api.cost)}
          stroke={API_COLOR}
          strokeWidth='1.5'
          strokeDasharray='6 4'
        />

        {series.map((s) => (
          <polyline
            key={s.label}
            points={s.points.map(([u, c]) => `${sx(u)},${sy(c)}`).join(' ')}
            fill='none'
            stroke={s.color}
            strokeWidth={s.color === OURO ? '2.5' : '2'}
            strokeDasharray={s.dashed ? '7 5' : undefined}
            strokeLinejoin='round'
            strokeLinecap='round'
          />
        ))}

        {/* O 1 % que o autor tinha assumido: cheio na cena "assumido", vazado na "medido". */}
        <g>
          <circle
            cx={sx(ghost.u)}
            cy={sy(ghost.cost)}
            r='6'
            fill={mode === 'assumido' ? OURO : 'none'}
            stroke={mode === 'assumido' ? OURO : GHOST}
            strokeWidth='2'
            strokeDasharray={mode === 'assumido' ? undefined : '3 2'}
          />
          <text
            x={sx(ghost.u) + 10}
            y={sy(ghost.cost) - 8}
            className={mode === 'assumido' ? 'fill-white' : 'fill-neutral-500'}
            fontSize='11'
            fontWeight={mode === 'assumido' ? '700' : '400'}
          >
            {ghost.label}
          </text>
        </g>

        {/* Âncoras medidas: ouro = o que o artigo quer que o leitor veja primeiro. */}
        {anchors.map((a) => {
          // À direita e acima do ponto o espaço é vazio (a curva desce e a margem da
          // legenda está livre abaixo dela); só um ponto colado à borda direita vai à esquerda.
          const left = a.u > 0.5;
          return (
            <g key={a.label}>
              <circle cx={sx(a.u)} cy={sy(a.cost)} r='6' fill={OURO} stroke='#14191f' strokeWidth='1.5' />
              {/* A curva desce para a direita: acima-à-direita e abaixo-à-esquerda do
                  ponto são as regiões vazias — é onde o rótulo não cruza linha nenhuma. */}
              <text
                x={sx(a.u) + (left ? -10 : 10)}
                y={sy(a.cost) + (left ? 20 : -9)}
                className='fill-white'
                fontSize='11'
                fontWeight='700'
                textAnchor={left ? 'end' : 'start'}
              >
                {a.label}
              </text>
            </g>
          );
        })}

        {legend.map((l, i) => (
          <g key={`legend-${l.label}`} transform={`translate(${PAD.left + plotW + 16}, ${PAD.top + 8 + i * 22})`}>
            <line
              x1='0'
              x2='18'
              y1='-4'
              y2='-4'
              stroke={l.color}
              strokeWidth='2.5'
              strokeDasharray={l.dashed ? '5 3' : undefined}
            />
            <text x='24' y='0' className='fill-neutral-300' fontSize='11'>
              {l.label}
            </text>
          </g>
        ))}

        <text
          x={PAD.left + plotW / 2}
          y={H - 34}
          className='fill-neutral-400'
          fontSize='11'
          textAnchor='middle'
        >
          {xLabel}
        </text>
        {source ? (
          <text x={PAD.left} y={H - 12} className='fill-neutral-500' fontSize='9'>
            {source}
          </text>
        ) : null}
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
