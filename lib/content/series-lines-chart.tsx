/**
 * ══════════════════════════════════════════════════════════════════════
 * SeriesLinesChart — séries temporais em linha, uma escala só, rótulo direto (SVG puro)
 * ══════════════════════════════════════════════════════════════════════
 *
 * COMPONENTE NOVO nº 2 do `raio-x-do-brasil-por-governo` (figura 6). O site tem curvas
 * (log-log, teóricas) e colunas diárias, mas nenhuma linha temporal linear com várias
 * séries: aqui a forma é a tese — a dívida líquida (ouro) cruza o zero de volta depois de
 * 18 anos, enquanto a dívida bruta e as reservas sobem juntas.
 *
 * Sem eixo duplo: uma escala (US$ bilhões). Sem legenda: cada linha leva o nome e o último
 * valor no fim dela (rótulo direto). A distinção não é só cor: reservas TRACEJADAS contra
 * linhas contínuas, líquida mais grossa (2,5 contra 2). Ouro = o que ver primeiro (a líquida
 * e as duas anotações); azul = série-tese; cinza-claro = a linha recessiva que cruza o ouro.
 * Cor por ATRIBUTO SVG hex (§4.7). Nada aleatório (§4.8): os pontos vêm do dataset, em ordem.
 *
 * GEOMETRIA (para o medidor do site, §4.10) — viewBox 720 x H, H = PLOT.y1 + 90:
 *   plot: x0 = 52, x1 = 580, y0 = 72, y1 = 322 (altura 250)
 *   px(a) = 52 + (a - xFrom) / (xTo - xFrom) * 528 · py(v) = 322 - (v - yMin) / (yMax - yMin) * 250
 *   título x 24 y 22 (15 bold) · subtítulo x 24 y 38 (11) · unidade x 24 y 58 (10)
 *   grade horizontal em py(tick.at) de x0 a x1; rótulo ancorado no fim em x = 44, y = py + 3,5 (10);
 *          a linha do ZERO é a mais clara (#a3a3a3, 1,25 px) e seu rótulo é branco bold
 *   anos: rótulo centrado em px(tick.at), y = y1 + 16 (10), tracinho de 4 px em y1..y1+4
 *   linha: polyline dos pontos (px, py), sem preenchimento, ponta/junção arredondadas
 *   rótulo de fim de linha: início em x = px(último ponto) + 8, y = py(último) + 3,5
 *          (10 bold, na cor da série); parede direita 704
 *   anotação (marks): círculo r 4,5 em (px(at), py(value)); fio vertical do círculo até
 *          y = py(value) - lift + 3; texto de 10 bold com halo, linha de base py(value) - lift;
 *          side 'right' => início em px(at) + 5; side 'left' => fim em px(at) - 5
 *   conclusão: x 24, 12 bold, 1ª linha de base y1 + 46, passo 16 · source: x 24, y H - 12 (9)
 *
 * Texto por props e pelo dataset (o `compileMDX` só entrega atributo string). Procedência
 * DENTRO do SVG: a imagem circula sem o texto.
 *
 * INTERFACES (vão em `data/artigos-charts.ts` junto do dataset):
 *
 *   export interface SeriesLinesSerie {
 *     id: string; color: string; width: number;
 *     dash: string;                              // '' = contínua; '6 3' = tracejada
 *     endLabel: string;                          // nome + último valor, ex. 'Dívida bruta 407,1'
 *     points: readonly (readonly [number, number])[];   // [ano decimal, valor na unidade]
 *   }
 *   export interface SeriesLinesTick { at: number; label: string }
 *   export interface SeriesLinesMark {
 *     at: number; value: number; side: 'left' | 'right'; lift: number; label: string;
 *   }
 *   export interface SeriesLinesDataset {
 *     unit: string; xFrom: number; xTo: number; yMin: number; yMax: number;
 *     xTicks: readonly SeriesLinesTick[]; yTicks: readonly SeriesLinesTick[];
 *     series: readonly SeriesLinesSerie[];
 *     marks: readonly SeriesLinesMark[];
 *     conclusion: readonly string[];
 *   }
 */

import { seriesLinesDatasets } from '@/data/artigos-charts';

interface SeriesLinesChartProps {
  /** Chave em `seriesLinesDatasets`. */
  dataset: string;
  title: string;
  subtitle?: string;
  /** Descrição para leitor de tela: enumera as linhas e as anotações na ordem desenhada. */
  description: string;
  /** Procedência, desenhada DENTRO do SVG. */
  source?: string;
}

const W = 720;
const LEFT = 24;
const PLOT = { x0: 52, x1: 580, y0: 72, y1: 322 };
const OURO = '#a48f65';
const OURO_CLARO = '#c4ad7f';
const FUNDO = '#14191f';
const GRADE = '#3f3f46';

export function SeriesLinesChart({
  dataset,
  title,
  subtitle,
  description,
  source,
}: SeriesLinesChartProps) {
  const data = seriesLinesDatasets[dataset];
  if (!data) {
    throw new Error(`SeriesLinesChart: dataset desconhecido "${dataset}"`);
  }
  const H = PLOT.y1 + 90;
  const px = (a: number) => PLOT.x0 + ((a - data.xFrom) / (data.xTo - data.xFrom)) * (PLOT.x1 - PLOT.x0);
  const py = (v: number) =>
    PLOT.y1 - ((v - data.yMin) / (data.yMax - data.yMin)) * (PLOT.y1 - PLOT.y0);

  return (
    <figure className='my-10 not-prose'>
      <svg
        viewBox={`0 0 ${W} ${H}`}
        className='w-full h-auto rounded-lg border border-white/10 bg-neutral-900/60 font-chart'
        role='img'
        aria-label={description}
      >
        <title>{description}</title>

        <text x={LEFT} y={22} fill='#ffffff' fontSize='15' fontWeight='700'>
          {title}
        </text>
        {subtitle ? (
          <text x={LEFT} y={38} fill='#a3a3a3' fontSize='11'>
            {subtitle}
          </text>
        ) : null}
        <text x={LEFT} y={58} fill='#a3a3a3' fontSize='10'>
          {data.unit}
        </text>

        {/* grade horizontal; o zero é a linha mais clara */}
        {data.yTicks.map((t) => (
          <g key={t.label}>
            <line
              x1={PLOT.x0}
              y1={py(t.at)}
              x2={PLOT.x1}
              y2={py(t.at)}
              stroke={t.at === 0 ? '#a3a3a3' : GRADE}
              strokeWidth={t.at === 0 ? 1.25 : 1}
              opacity={t.at === 0 ? 1 : 0.7}
            />
            <text
              x={44}
              y={py(t.at) + 3.5}
              fill={t.at === 0 ? '#ffffff' : '#a3a3a3'}
              fontSize='10'
              fontWeight={t.at === 0 ? '700' : '400'}
              textAnchor='end'
            >
              {t.label}
            </text>
          </g>
        ))}

        {/* anos */}
        {data.xTicks.map((t) => (
          <g key={t.label}>
            <line x1={px(t.at)} y1={PLOT.y1} x2={px(t.at)} y2={PLOT.y1 + 4} stroke='#737373' strokeWidth='1' />
            <text x={px(t.at)} y={PLOT.y1 + 16} fill='#a3a3a3' fontSize='10' textAnchor='middle'>
              {t.label}
            </text>
          </g>
        ))}

        {/* as linhas (a última do dataset fica por cima: a líquida, em ouro) */}
        {data.series.map((s) => (
          <polyline
            key={s.id}
            points={s.points.map(([a, v]) => `${px(a).toFixed(1)},${py(v).toFixed(1)}`).join(' ')}
            fill='none'
            stroke={s.color}
            strokeWidth={s.width}
            strokeDasharray={s.dash || undefined}
            strokeLinejoin='round'
            strokeLinecap='round'
          />
        ))}

        {/* anotações em ouro */}
        {data.marks.map((m) => {
          const cx = px(m.at);
          const cy = py(m.value);
          const base = cy - m.lift;
          const right = m.side === 'right';
          return (
            <g key={m.label}>
              <line x1={cx} y1={cy - 5} x2={cx} y2={base + 3} stroke={OURO} strokeWidth='1' />
              <circle cx={cx} cy={cy} r={4.5} fill={FUNDO} stroke={OURO} strokeWidth='2' />
              <text
                x={right ? cx + 5 : cx - 5}
                y={base}
                fill={OURO_CLARO}
                fontSize='10'
                fontWeight='700'
                textAnchor={right ? 'start' : 'end'}
                stroke={FUNDO}
                strokeWidth='3'
                paintOrder='stroke'
              >
                {m.label}
              </text>
            </g>
          );
        })}

        {/* rótulo direto no fim de cada linha: nome + último valor */}
        {data.series.map((s) => {
          const [a, v] = s.points[s.points.length - 1];
          return (
            <text
              key={s.id}
              x={px(a) + 8}
              y={py(v) + 3.5}
              fill={s.color}
              fontSize='10'
              fontWeight='700'
            >
              {s.endLabel}
            </text>
          );
        })}

        {/* frase-conclusão, dentro do SVG */}
        {data.conclusion.map((linha, k) => (
          <text
            key={linha}
            x={LEFT}
            y={PLOT.y1 + 46 + k * 16}
            fill='#ffffff'
            fontSize='12'
            fontWeight='700'
          >
            {linha}
          </text>
        ))}

        {source ? (
          <text x={LEFT} y={H - 12} fill='#737373' fontSize='9'>
            {source}
          </text>
        ) : null}
      </svg>
    </figure>
  );
}
