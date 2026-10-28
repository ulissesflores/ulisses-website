/**
 * ══════════════════════════════════════════════════════════════════════
 * MandatosChart — a faixa de governos e, em cima dela, o que se quer dizer (SVG puro)
 * ══════════════════════════════════════════════════════════════════════
 *
 * COMPONENTE NOVO nº 1 do `raio-x-do-brasil-por-governo` (figuras 1 e 4). Duas CENAS, UMA
 * GEOMETRIA (`PADRAO-ARTIGO.md` §1 e §2): a faixa de governos (posição, altura e rótulos) é
 * idêntica nas duas; só o eixo do tempo e o que fica acima da faixa mudam.
 *   mode 'janelas' — a régua de 62 anos. Acima da faixa, as JANELAS que o infográfico
 *                    imprimiu (barras finas cinza-claro). Governos fora do infográfico em
 *                    OURO hachurado (o buraco é o que o leitor vê primeiro); os dentro, em
 *                    azul cheio; a Junta de 1969 (2 meses) em cinza, sem rótulo.
 *   mode 'indice'  — o mesmo desenho com um CANDLE por mandato acima da faixa: corpo da
 *                    abertura ao fechamento (cheio se subiu, vazado se caiu), pavio no
 *                    máximo/mínimo, colchete OURO na faixa p5-p95 dos pesos sorteados.
 *
 * Cor por ATRIBUTO SVG hex, nunca classe do Tailwind (§4.7). Ouro = o que ver primeiro;
 * azul = série-tese; cinza = recessivo. A distinção não é só cor: hachura contra cheio
 * (governo omitido), corpo cheio contra vazado (sobe/cai). Nada aleatório (§4.8). O id do
 * padrão hachurado nasce da chave do dataset, para duas figuras na mesma página não colidirem.
 *
 * REGRA ANTI-COLISÃO DOS RÓTULOS: vive em `dados.py` (`_linhas_rotulos`), que mede a Fahkwang
 * real e grava `row` em cada governo (0 = colado sob o segmento; 1..3 = linhas abaixo, com
 * fio-guia). O componente só obedece; o medidor (`checar-figuras.py`) audita a colocação recebida (parede,
 * vizinhança, fio-guia) sem recalculá-la.
 *
 * GEOMETRIA (para o medidor do site, §4.10) — viewBox 720 x H, esquerda/direita 24:
 *   eixo x: X0 = 48 (= axis.from), X1 = 688 (= axis.to); px(a) = 48 + (a - from)/(to - from) * 640
 *   título x 24 y 22 (15 bold) · subtítulo x 24 y 38 (11)
 *   faixa: y = STRIP_Y, h = 26; STRIP_Y = 96 (janelas) | 228 (indice); segmento x = px(start),
 *          w = px(end) - px(start), com 0,5 px de respiro de cada lado (a Junta, sem respiro, min 1,5 px)
 *   anos: rótulo centrado em px(tick.at), linha de base STRIP_Y - 7 (10); grade vertical de
 *          gridTop até STRIP_Y; gridTop = 52 (janelas) | 58 (indice)
 *   janelas (só 'janelas'): barra h 5 em y = 56 + row * 8, x = px(start) .. px(end)
 *   candle (só 'indice'): área y 58 (=100) .. 204 (=0); y(v) = 204 - v / 100 * 146; centro
 *          cx = px((start + end) / 2) do governo; corpo 16 de largura (cx-8 .. cx+8);
 *          pavio em cx; colchete em x = cx + 17 (traços de 5 px para a esquerda);
 *          rótulo de fechamento: ancorado no fim em x = cx - 13, y = y(c) + 4 (11 bold)
 *          rótulo do eixo y: ancorado no fim em x = 40, y = y(v) + 3,5 (10)
 *   rótulo de governo: centrado em cx do segmento, 10 px, linha de base
 *          STRIP_Y + 26 + 14 + row * 14; fio-guia (row > 0) de STRIP_Y + 28 até a base - 11
 *   conclusão: x 24, 12 bold, primeira linha de base = última linha de rótulo + 28, passo 16
 *   legenda: colunas de 672 / cols de largura; swatch em x0 .. x0 + 14, texto em x0 + 22 (10);
 *          primeira linha de base = última de conclusão + 26, passo 16
 *   H = última linha da legenda + 28 · source: x 24, y H - 12 (9)
 *
 * Texto por props e pelo dataset (o `compileMDX` só entrega atributo string); `mode` também
 * é prop string. Procedência DENTRO do SVG: a imagem circula sem o texto.
 *
 * INTERFACES (vão em `data/artigos-charts.ts` junto do dataset):
 *
 *   export interface MandatosGov {
 *     id: string; label: string;            // label '' = sem rótulo (Junta)
 *     start: number; end: number;           // ano decimal (2026,797 = 19/10/2026)
 *     kind: 'no' | 'fora' | 'junta';        // no infográfico | fora (ouro hachurado) | Junta
 *     row: number;                          // -1 sem rótulo; 0..3 linha do rótulo
 *   }
 *   export interface MandatosJanela { label: string; start: number; end: number; row: number }
 *   export interface MandatosCandle {
 *     gov: string; o: number; c: number; h: number; l: number;
 *     p5: number; p95: number; closeLabel: string;
 *   }
 *   export interface MandatosTick { at: number; label: string }
 *   export interface MandatosLegendItem {
 *     kind: 'no' | 'fora' | 'janela' | 'junta' | 'cheio' | 'vazado' | 'pavio' | 'faixa';
 *     label: string;
 *   }
 *   export interface MandatosDataset {
 *     axis: { from: number; to: number; ticks: readonly MandatosTick[] };
 *     govs: readonly MandatosGov[];
 *     windows?: readonly MandatosJanela[];   // mode janelas
 *     candles?: readonly MandatosCandle[];   // mode indice
 *     yTicks?: readonly MandatosTick[];      // mode indice (0..100)
 *     legend: { cols: number; items: readonly MandatosLegendItem[] };
 *     conclusion: readonly string[];
 *   }
 */

import { mandatosDatasets } from '@/data/artigos-charts';

interface MandatosChartProps {
  /** Chave em `mandatosDatasets`. */
  dataset: string;
  /** 'janelas' (a régua) ou 'indice' (os candles). */
  mode: string;
  title: string;
  subtitle?: string;
  /** Descrição para leitor de tela: enumera os elementos na ordem desenhada. */
  description: string;
  /** Procedência, desenhada DENTRO do SVG. */
  source?: string;
}

const W = 720;
const LEFT = 24;
const X0 = 48;
const X1 = 688;
const STRIP_H = 26;
const STRIP_Y = { janelas: 96, indice: 228 } as const;
const GRID_TOP = { janelas: 52, indice: 58 } as const;
const WIN = { y0: 56, h: 5, gap: 3 };
const PLOT = { top: 58, bottom: 204 };
const LABEL_FIRST = 14;
const LABEL_STEP = 14;
const CANDLE_HALF = 8;
const BRACKET_DX = 17;
const BRACKET_CAP = 5;
const CLOSE_DX = 13;

const OURO = '#a48f65';
const OURO_CLARO = '#c4ad7f';
const AZUL = '#60a5fa';
const CINZA = '#64748b';
const CINZA_CLARO = '#d4d4d8';
const FUNDO = '#14191f';
const GRADE = '#3f3f46';

export function MandatosChart({
  dataset,
  mode,
  title,
  subtitle,
  description,
  source,
}: MandatosChartProps) {
  const data = mandatosDatasets[dataset];
  if (!data) {
    throw new Error(`MandatosChart: dataset desconhecido "${dataset}"`);
  }
  if (mode !== 'janelas' && mode !== 'indice') {
    throw new Error(`MandatosChart: mode desconhecido "${mode}"`);
  }
  if (mode === 'janelas' && !data.windows) {
    throw new Error(`MandatosChart: "${dataset}" não tem windows para mode janelas`);
  }
  if (mode === 'indice' && (!data.candles || !data.yTicks)) {
    throw new Error(`MandatosChart: "${dataset}" não tem candles/yTicks para mode indice`);
  }

  const { from, to } = data.axis;
  const px = (a: number) => X0 + ((a - from) / (to - from)) * (X1 - X0);
  const stripY = STRIP_Y[mode];
  const stripB = stripY + STRIP_H;
  const gridTop = GRID_TOP[mode];
  const sy = (v: number) => PLOT.bottom - (v / 100) * (PLOT.bottom - PLOT.top);

  const maxRow = data.govs.reduce((m, g) => Math.max(m, g.row), 0);
  const lastLabel = stripB + LABEL_FIRST + maxRow * LABEL_STEP;
  const conclusionY = lastLabel + 28;
  const legendY = conclusionY + (data.conclusion.length - 1) * 16 + 26;
  const legendRows = Math.ceil(data.legend.items.length / data.legend.cols);
  const legendLast = legendY + (legendRows - 1) * 16;
  const H = legendLast + 28;
  const slot = (W - 2 * LEFT) / data.legend.cols;
  const patId = `hachura-${dataset.replace(/[^a-zA-Z0-9]/g, '-')}`;

  const center = (id: string): number => {
    const g = data.govs.find((x) => x.id === id);
    if (!g) throw new Error(`MandatosChart: governo "${id}" não existe em "${dataset}"`);
    return px((g.start + g.end) / 2);
  };

  const swatch = (kind: string, x: number, y: number) => {
    switch (kind) {
      case 'no':
        return <rect x={x} y={y - 8} width={14} height={9} fill={AZUL} />;
      case 'fora':
        return (
          <rect
            x={x}
            y={y - 8}
            width={14}
            height={9}
            fill={`url(#${patId})`}
            stroke={OURO}
            strokeWidth='1'
            strokeDasharray='3 2'
          />
        );
      case 'janela':
        return <rect x={x} y={y - 5} width={14} height={5} rx={2.5} fill={CINZA_CLARO} />;
      case 'junta':
        return <rect x={x} y={y - 8} width={14} height={9} fill={CINZA} />;
      case 'cheio':
        return <rect x={x + 2} y={y - 9} width={10} height={10} fill={AZUL} stroke={AZUL} strokeWidth='2' />;
      case 'vazado':
        return <rect x={x + 2} y={y - 9} width={10} height={10} fill={FUNDO} stroke={AZUL} strokeWidth='2' />;
      case 'pavio':
        return <line x1={x + 7} y1={y - 11} x2={x + 7} y2={y + 2} stroke={CINZA_CLARO} strokeWidth='1.5' />;
      default:
        return (
          <path
            d={`M ${x + 3} ${y - 10} H ${x + 9} V ${y + 2} H ${x + 3}`}
            fill='none'
            stroke={OURO}
            strokeWidth='2'
          />
        );
    }
  };

  return (
    <figure className='my-10 not-prose'>
      <svg
        viewBox={`0 0 ${W} ${H}`}
        className='w-full h-auto rounded-lg border border-white/10 bg-neutral-900/60 font-chart'
        role='img'
        aria-label={description}
      >
        <title>{description}</title>
        <defs>
          <pattern
            id={patId}
            width='6'
            height='6'
            patternUnits='userSpaceOnUse'
            patternTransform='rotate(45)'
          >
            <rect width='6' height='6' fill={OURO} fillOpacity='0.16' />
            <line x1='0' y1='0' x2='0' y2='6' stroke={OURO} strokeWidth='2.5' />
          </pattern>
        </defs>

        <text x={LEFT} y={22} fill='#ffffff' fontSize='15' fontWeight='700'>
          {title}
        </text>
        {subtitle ? (
          <text x={LEFT} y={38} fill='#a3a3a3' fontSize='11'>
            {subtitle}
          </text>
        ) : null}

        {/* grade vertical e anos */}
        {data.axis.ticks.map((t) => (
          <g key={t.label}>
            <line
              x1={px(t.at)}
              y1={gridTop}
              x2={px(t.at)}
              y2={stripY}
              stroke={GRADE}
              strokeWidth='1'
              opacity='0.7'
            />
            <text x={px(t.at)} y={stripY - 7} fill='#a3a3a3' fontSize='10' textAnchor='middle'>
              {t.label}
            </text>
          </g>
        ))}

        {/* cena 'janelas': as janelas impressas pelo infográfico */}
        {mode === 'janelas' && data.windows
          ? data.windows.map((w) => (
              <rect
                key={w.label}
                x={px(w.start)}
                y={WIN.y0 + w.row * (WIN.h + WIN.gap)}
                width={px(w.end) - px(w.start)}
                height={WIN.h}
                rx={2.5}
                fill={CINZA_CLARO}
              />
            ))
          : null}

        {/* cena 'indice': eixo y e candles */}
        {mode === 'indice' && data.yTicks
          ? data.yTicks.map((t) => (
              <g key={t.label}>
                <line
                  x1={X0}
                  y1={sy(t.at)}
                  x2={X1}
                  y2={sy(t.at)}
                  stroke={GRADE}
                  strokeWidth='1'
                  opacity={t.at === 0 ? 1 : 0.7}
                />
                <text x={40} y={sy(t.at) + 3.5} fill='#a3a3a3' fontSize='10' textAnchor='end'>
                  {t.label}
                </text>
              </g>
            ))
          : null}
        {mode === 'indice' && data.candles
          ? data.candles.map((c) => {
              const cx = center(c.gov);
              const sobe = c.c >= c.o;
              const topo = sy(Math.max(c.o, c.c));
              const alt = Math.max(Math.abs(sy(c.o) - sy(c.c)), 2);
              const bx = cx + BRACKET_DX;
              return (
                <g key={c.gov}>
                  <line x1={cx} y1={sy(c.h)} x2={cx} y2={sy(c.l)} stroke={CINZA_CLARO} strokeWidth='1.5' />
                  <rect
                    x={cx - CANDLE_HALF}
                    y={topo}
                    width={2 * CANDLE_HALF}
                    height={alt}
                    fill={sobe ? AZUL : FUNDO}
                    stroke={AZUL}
                    strokeWidth='2'
                  />
                  <path
                    d={`M ${bx - BRACKET_CAP} ${sy(c.p95)} H ${bx} V ${sy(c.p5)} H ${bx - BRACKET_CAP}`}
                    fill='none'
                    stroke={OURO}
                    strokeWidth='2'
                  />
                  <text
                    x={cx - CLOSE_DX}
                    y={sy(c.c) + 4}
                    fill='#ffffff'
                    fontSize='11'
                    fontWeight='700'
                    textAnchor='end'
                  >
                    {c.closeLabel}
                  </text>
                </g>
              );
            })
          : null}

        {/* a faixa de governos (a mesma geometria nas duas cenas) */}
        {data.govs.map((g) => {
          const a = px(g.start);
          const b = px(g.end);
          const junta = g.kind === 'junta';
          const x = junta ? a : a + 0.5;
          const w = junta ? Math.max(b - a, 1.5) : Math.max(b - a - 1, 1);
          const fill = g.kind === 'fora' ? `url(#${patId})` : g.kind === 'junta' ? CINZA : AZUL;
          return (
            <rect
              key={g.id}
              x={x}
              y={stripY}
              width={w}
              height={STRIP_H}
              fill={fill}
              stroke={g.kind === 'fora' ? OURO : 'none'}
              strokeWidth={g.kind === 'fora' ? 1 : 0}
              strokeDasharray={g.kind === 'fora' ? '3 2' : undefined}
            />
          );
        })}

        {/* rótulos (linha 0 sob o segmento; 1..3 com fio-guia) */}
        {data.govs.map((g) => {
          if (g.row < 0 || !g.label) return null;
          const cx = px((g.start + g.end) / 2);
          const base = stripB + LABEL_FIRST + g.row * LABEL_STEP;
          return (
            <g key={g.id}>
              {g.row > 0 ? (
                <line x1={cx} y1={stripB + 2} x2={cx} y2={base - 11} stroke='#52525b' strokeWidth='1' />
              ) : null}
              <text
                x={cx}
                y={base}
                fill={g.kind === 'fora' ? OURO_CLARO : '#e5e7eb'}
                fontSize='10'
                textAnchor='middle'
              >
                {g.label}
              </text>
            </g>
          );
        })}

        {/* frase-conclusão, dentro do SVG */}
        {data.conclusion.map((linha, k) => (
          <text
            key={linha}
            x={LEFT}
            y={conclusionY + k * 16}
            fill='#ffffff'
            fontSize='12'
            fontWeight='700'
          >
            {linha}
          </text>
        ))}

        {/* legenda em colunas iguais */}
        {data.legend.items.map((it, i) => {
          const col = i % data.legend.cols;
          const row = Math.floor(i / data.legend.cols);
          const x0 = LEFT + col * slot;
          const y = legendY + row * 16;
          return (
            <g key={it.label}>
              {swatch(it.kind, x0, y)}
              <text x={x0 + 22} y={y} fill={CINZA_CLARO} fontSize='10'>
                {it.label}
              </text>
            </g>
          );
        })}

        {source ? (
          <text x={LEFT} y={H - 12} fill='#737373' fontSize='9'>
            {source}
          </text>
        ) : null}
      </svg>
    </figure>
  );
}
