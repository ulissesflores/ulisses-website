/**
 * ══════════════════════════════════════════════════════════════════════
 * ConstraintExperimentChart — os experimentos da simulação de fila
 * ══════════════════════════════════════════════════════════════════════
 *
 * DESTINO NO SITE: `lib/content/constraint-experiment-chart.tsx` + registro
 * em `lib/content/mdx-components.tsx`. Números em
 * `data/constraint-experiment-chart.ts`, GERADOS por script a partir de
 * `resultados.json` — nunca digitados (o `compileMDX` só entrega atributo
 * string; daí o `dataset` por id).
 *
 * Um componente, DOIS corpos (precedente: `StepFlowDiagram` com `ChainBody`
 * e `TimelineBody`), porque os quatro experimentos do artigo pedem duas
 * formas:
 *   `LinhasBody` — modes `teto` e `residuo`: uma curva medida contra uma
 *     linha de referência em ouro (a restrição) e chamadas de texto nos
 *     pontos que a prosa comenta;
 *   `BarrasBody` — modes `lugar-errado` e `corda`: blocos de barras
 *     horizontais, cada bloco com escala linear própria DECLARADA no SVG,
 *     ou uma régua log comum com ticks desenhados.
 * O `mode` da tag tem de bater com o `modo` do dataset — pareamento errado
 * lança erro em vez de desenhar a figura errada em silêncio.
 *
 * O ouro é SEMPRE a restrição (a linha de referência, a barra "eleva a
 * restrição", a barra "corda"); a curva medida é azul (série-tese); o resto
 * é cinza. Identidade nunca é só cor: toda barra tem nome e valor escritos.
 * Cor por atributo SVG, nunca classe arbitrária do Tailwind.
 *
 * Orçamento de texto por vaga: header de `data/constraint-experiment-chart.ts`,
 * medido por `checar-figuras.py` — rótulo que não cabe é cortado em silêncio.
 */

import {
  constraintExperimentDatasets,
  type CeBarrasDataset,
  type CeLinhasDataset,
} from '@/data/constraint-experiment-chart';

interface ConstraintExperimentChartProps {
  /** Chave em `constraintExperimentDatasets`. */
  dataset: string;
  /** `teto` | `lugar-errado` | `corda` | `residuo` — tem de bater com o dataset. */
  mode: string;
  title: string;
  subtitle?: string;
  /** Só nos modes de linha. */
  xLabel?: string;
  yLabel?: string;
  /** Descrição para leitor de tela — o gráfico é informativo, não decorativo. */
  description: string;
  /** Procedência, desenhada DENTRO do SVG — a imagem circula sozinha. */
  source?: string;
}

const W = 720;
const MARGEM = 24;

/** Paleta dataviz da marca (header de `data/artigos-charts.ts`). */
const COR = {
  ouro: '#a48f65',
  ouroClaro: '#c4ad7f',
  azul: '#60a5fa',
  cinza: '#64748b',
  texto: '#e5e5e5',
  textoMedio: '#d4d4d4',
  textoFraco: '#a3a3a3',
  eixo: '#737373',
  offwhite: '#f5f0e6',
} as const;

const PAPEL = { recessivo: COR.cinza, tese: COR.azul, destaque: COR.ouro } as const;

/* ── Linhas ──────────────────────────────────────────────────────────── */
const LIN = { H: 470, top: 48, right: 24, bottom: 100, left: 60 };

/* ── Barras ──────────────────────────────────────────────────────────── */
const BAR = {
  top: 48,
  left: 176,
  right: 24,
  nomeX: 166,
  cabecalhoH: 18,
  rowH: 26,
  barraH: 16,
  escalaH: 16,
  blocoGap: 20,
  reguaH: 38,
  conclusaoGap: 34,
  sourceGap: 22,
};

export function ConstraintExperimentChart({
  dataset,
  mode,
  title,
  subtitle,
  xLabel,
  yLabel,
  description,
  source,
}: ConstraintExperimentChartProps) {
  const data = constraintExperimentDatasets[dataset];
  if (!data) {
    throw new Error(`ConstraintExperimentChart: dataset desconhecido "${dataset}"`);
  }
  if (data.modo !== mode) {
    throw new Error(
      `ConstraintExperimentChart: mode="${mode}" não bate com o dataset "${dataset}" (modo "${data.modo}")`,
    );
  }
  const linhas = data.modo === 'teto' || data.modo === 'residuo';
  const H = linhas ? LIN.H : alturaBarras(data as CeBarrasDataset);

  return (
    <figure className='my-10 not-prose'>
      <svg
        viewBox={`0 0 ${W} ${H}`}
        className='w-full h-auto rounded-lg border border-white/10 bg-neutral-900/60 font-chart'
        role='img'
        aria-label={description}
      >
        <title>{description}</title>

        <text x={MARGEM} y={22} fill='#ffffff' fontSize='15' fontWeight='700'>
          {title}
        </text>
        {subtitle ? (
          <text x={MARGEM} y={38} fill={COR.textoFraco} fontSize='11'>
            {subtitle}
          </text>
        ) : null}

        {linhas ? (
          <LinhasBody data={data as CeLinhasDataset} xLabel={xLabel} yLabel={yLabel} />
        ) : (
          <BarrasBody data={data as CeBarrasDataset} />
        )}

        <text x={MARGEM} y={H - 36} fill={COR.offwhite} fontSize='12' fontWeight='700'>
          {data.conclusao}
        </text>
        {source ? (
          <text x={MARGEM} y={H - 12} fill={COR.eixo} fontSize='9'>
            {source}
          </text>
        ) : null}
      </svg>
    </figure>
  );
}

function LinhasBody({
  data,
  xLabel,
  yLabel,
}: {
  data: CeLinhasDataset;
  xLabel?: string;
  yLabel?: string;
}) {
  const plotW = W - LIN.left - LIN.right;
  const plotH = LIN.H - LIN.top - LIN.bottom;
  const [x0, x1] = data.xDominio;
  const [y0, y1] = data.yDominio;
  const sx = (x: number) => LIN.left + ((x - x0) / (x1 - x0)) * plotW;
  const sy = (y: number) => LIN.top + plotH - ((y - y0) / (y1 - y0)) * plotH;
  const ref = data.referencia;

  return (
    <>
      {data.yTicks.map((t) => (
        <g key={`y${t.v}`}>
          <line
            x1={LIN.left}
            x2={LIN.left + plotW}
            y1={sy(t.v)}
            y2={sy(t.v)}
            stroke='#ffffff'
            strokeOpacity={0.1}
            strokeWidth='1'
          />
          <text x={LIN.left - 8} y={sy(t.v) + 4} fill={COR.eixo} fontSize='10' textAnchor='end'>
            {t.label}
          </text>
        </g>
      ))}
      {data.xTicks.map((t) => (
        <text
          key={`x${t.v}`}
          x={sx(t.v)}
          y={LIN.top + plotH + 18}
          fill={COR.eixo}
          fontSize='10'
          textAnchor='middle'
        >
          {t.label}
        </text>
      ))}

      {/* A restrição: linha de referência em ouro, com rótulo */}
      {ref.eixo === 'y' ? (
        <g>
          <line
            x1={LIN.left}
            x2={LIN.left + plotW}
            y1={sy(ref.valor)}
            y2={sy(ref.valor)}
            stroke={COR.ouro}
            strokeWidth='1.5'
            strokeDasharray='6 4'
          />
          <text x={LIN.left + 6} y={sy(ref.valor) - 7} fill={COR.ouroClaro} fontSize='10' fontWeight='700'>
            {ref.rotulo}
          </text>
        </g>
      ) : (
        <g>
          <line
            x1={sx(ref.valor)}
            x2={sx(ref.valor)}
            y1={LIN.top}
            y2={LIN.top + plotH}
            stroke={COR.ouro}
            strokeWidth='1.5'
            strokeDasharray='6 4'
          />
          <text
            x={sx(ref.valor) - 6}
            y={LIN.top + 14}
            fill={COR.ouroClaro}
            fontSize='10'
            fontWeight='700'
            textAnchor='end'
          >
            {ref.rotulo}
          </text>
        </g>
      )}

      {/* A curva medida */}
      <polyline
        points={data.pontos.map(([x, y]) => `${sx(x)},${sy(y)}`).join(' ')}
        fill='none'
        stroke={COR.azul}
        strokeWidth='2'
        strokeLinejoin='round'
        strokeLinecap='round'
      />
      {data.pontos.map(([x, y]) => (
        <circle key={`p${x}`} cx={sx(x)} cy={sy(y)} r='3.5' fill={COR.azul} />
      ))}

      {/* Chamadas: o texto que a prosa comenta, ancorado no ponto */}
      {data.chamadas.map((c) => (
        <g key={`c${c.x}`}>
          <line
            x1={sx(c.x)}
            y1={sy(c.y)}
            x2={sx(c.x) + c.dx * 0.7}
            y2={sy(c.y) + c.dy * 0.7}
            stroke={COR.textoFraco}
            strokeWidth='1'
          />
          <text
            x={sx(c.x) + c.dx}
            y={sy(c.y) + c.dy}
            fill={COR.texto}
            fontSize='11'
            textAnchor={c.ancora}
          >
            {c.texto}
          </text>
        </g>
      ))}

      {xLabel ? (
        <text
          x={LIN.left + plotW / 2}
          y={LIN.top + plotH + 44}
          fill={COR.textoFraco}
          fontSize='11'
          textAnchor='middle'
        >
          {xLabel}
        </text>
      ) : null}
      {yLabel ? (
        <text
          x={-(LIN.top + plotH / 2)}
          y={16}
          fill={COR.textoFraco}
          fontSize='11'
          textAnchor='middle'
          transform='rotate(-90)'
        >
          {yLabel}
        </text>
      ) : null}
    </>
  );
}

/** Altura de um bloco de barras (cabeçalho + linhas + escala própria, se houver). */
function alturaBloco(b: CeBarrasDataset['blocos'][number]) {
  return BAR.cabecalhoH + b.barras.length * BAR.rowH + (b.escala ? BAR.escalaH : 0);
}

function alturaBarras(data: CeBarrasDataset) {
  const blocos = data.blocos.reduce((s, b) => s + alturaBloco(b), 0);
  const gaps = (data.blocos.length - 1) * BAR.blocoGap;
  const regua = data.escalaLog ? BAR.reguaH : 0;
  return BAR.top + blocos + gaps + regua + BAR.conclusaoGap + BAR.sourceGap;
}

function BarrasBody({ data }: { data: CeBarrasDataset }) {
  const plotW = W - BAR.left - BAR.right;
  const log = data.escalaLog;
  if (!log && data.blocos.some((b) => !b.escala)) {
    throw new Error('ConstraintExperimentChart: bloco sem `escala` e dataset sem `escalaLog`');
  }
  const sxLog = (v: number) => {
    const [d0, d1] = [Math.log10(log!.dominio[0]), Math.log10(log!.dominio[1])];
    return ((Math.log10(v) - d0) / (d1 - d0)) * plotW;
  };

  let y = BAR.top;
  const blocos = data.blocos.map((b) => {
    const topo = y;
    const sx = log ? sxLog : (v: number) => (v / b.escala!.max) * plotW;
    const linhas = b.barras.map((barra, i) => {
      const rowY = topo + BAR.cabecalhoH + i * BAR.rowH;
      const destaque = barra.papel === 'destaque';
      const w = sx(barra.valor);
      return (
        <g key={barra.nome}>
          <text
            x={BAR.nomeX}
            y={rowY + 17}
            fill={destaque ? '#ffffff' : COR.textoMedio}
            fontSize='11'
            fontWeight={destaque ? '700' : '400'}
            textAnchor='end'
          >
            {barra.nome}
          </text>
          <rect
            x={BAR.left}
            y={rowY + 5}
            width={w}
            height={BAR.barraH}
            rx={4}
            fill={PAPEL[barra.papel]}
            fillOpacity={destaque ? 1 : 0.85}
          />
          <text
            x={BAR.left + w + 8}
            y={rowY + 17}
            fill={destaque ? COR.ouroClaro : COR.textoMedio}
            fontSize='11'
            fontWeight={destaque ? '700' : '400'}
          >
            {barra.rotulo}
          </text>
        </g>
      );
    });
    const escalaY = topo + BAR.cabecalhoH + b.barras.length * BAR.rowH + 12;
    y = topo + alturaBloco(b) + BAR.blocoGap;
    return (
      <g key={b.cabecalho}>
        <text
          x={MARGEM}
          y={topo + 10}
          fill={COR.textoFraco}
          fontSize='10'
          fontWeight='700'
          letterSpacing='0.08em'
        >
          {b.cabecalho.toUpperCase()}
        </text>
        {linhas}
        {b.escala ? (
          <text x={BAR.left} y={escalaY} fill={COR.eixo} fontSize='9'>
            {b.escala.rotulo}
          </text>
        ) : null}
      </g>
    );
  });

  const reguaY = y - BAR.blocoGap + 6;
  return (
    <>
      {log
        ? log.ticks.map((t) => (
            <line
              key={`g${t.v}`}
              x1={BAR.left + sxLog(t.v)}
              x2={BAR.left + sxLog(t.v)}
              y1={BAR.top}
              y2={reguaY}
              stroke='#ffffff'
              strokeOpacity={0.08}
              strokeWidth='1'
            />
          ))
        : null}
      {blocos}
      {log ? (
        <g>
          <line
            x1={BAR.left}
            x2={BAR.left + plotW}
            y1={reguaY}
            y2={reguaY}
            stroke='#ffffff'
            strokeOpacity={0.25}
            strokeWidth='1'
          />
          {log.ticks.map((t) => (
            <text
              key={`t${t.v}`}
              x={BAR.left + sxLog(t.v)}
              y={reguaY + 14}
              fill={COR.eixo}
              fontSize='9'
              textAnchor='middle'
            >
              {t.label}
            </text>
          ))}
          <text x={BAR.left} y={reguaY + 28} fill={COR.eixo} fontSize='9'>
            {log.rotulo}
          </text>
        </g>
      ) : null}
    </>
  );
}
