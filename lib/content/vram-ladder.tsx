/**
 * ══════════════════════════════════════════════════════════════════════
 * VramLadder — a escada da VRAM: o que cabe em cada placa, com as DUAS parcelas
 * ══════════════════════════════════════════════════════════════════════
 *
 * SVG puro, sem lib de gráficos. Cada linha é um degrau de memória (4 GB …
 * 256 GB) e a trilha da linha representa a capacidade DAQUELE degrau — a
 * escala é normalizada por linha, de propósito: a pergunta do artigo é
 * "cabe?", não "quantas vezes 256 é maior que 4". O número absoluto está
 * escrito no rótulo à esquerda.
 *
 * A barra tem dois segmentos empilhados porque a conta tem duas parcelas:
 * os PESOS (fixos, você sabe antes de baixar) e o CACHE do contexto de
 * referência (cresce enquanto você conversa). O terceiro segmento, em
 * vermelho, é o que a mesma linha passaria a ocupar no contexto MÁXIMO do
 * modelo — quando ele ultrapassa a trilha, aquele degrau do card viral só
 * é verdade em contexto curto. Esse transbordo É a tese do artigo, então
 * este gráfico nunca deve virar uma barra única de "tamanho do modelo".
 *
 * Texto por props e pelo dataset do locale; números via `dataset` em
 * `data/artigos-charts.ts` (o `compileMDX` só entrega atributo string).
 * Procedência desenhada DENTRO do SVG: a imagem circula sem o texto.
 */

import { vramLadderDatasets } from '@/data/artigos-charts';

interface VramLadderProps {
  /** Chave em `vramLadderDatasets` — um dataset por locale (os rótulos são texto). */
  dataset: string;
  title: string;
  subtitle?: string;
  /** Descrição para leitor de tela — o gráfico é informativo, não decorativo. */
  description: string;
  /** Procedência, dentro do SVG. */
  source?: string;
}

const W = 760;
const ROW_H = 58;
const PAD = { top: 58, right: 8, bottom: 54, left: 8 };
const COL_CAP = 152; // rótulo do degrau, em duas linhas (capacidade / hardware)
const COL_FIM = 140; // faixa livre à direita: é para onde o transbordo cresce
const BAR_Y = 30;
const BAR_H = 15;

const COR = {
  trilha: '#ffffff12',
  borda: '#ffffff26',
  pesos: '#60a5fa',
  cache: '#a78bfa',
  estouro: '#f87171',
};

/** Quanto da trilha pode transbordar para a direita antes de cortar o desenho. */
const TRANSBORDO_MAX = 1.28;

/** Posiciona os três itens da legenda em linha, acumulando a largura estimada de cada um. */
function itensLegenda(legenda: { pesos: string; cache: string; estouro: string }) {
  const cores = [COR.pesos, COR.cache, COR.estouro];
  let x = PAD.left;
  return [legenda.pesos, legenda.cache, legenda.estouro].map((texto, i) => {
    const item = { texto, cor: cores[i], x };
    x += 15 + texto.length * 5.1 + 22;
    return item;
  });
}

export function VramLadder({ dataset, title, subtitle, description, source }: VramLadderProps) {
  const data = vramLadderDatasets[dataset];
  if (!data) {
    throw new Error(`VramLadder: dataset desconhecido "${dataset}"`);
  }
  const { degraus, legenda } = data;

  const plotW = W - PAD.left - PAD.right - COL_CAP - COL_FIM;
  const x0 = PAD.left + COL_CAP;
  const H = PAD.top + degraus.length * ROW_H + PAD.bottom;

  return (
    <figure className='my-10 not-prose'>
      <svg
        viewBox={`0 0 ${W} ${H}`}
        className='w-full h-auto rounded-lg border border-white/10 bg-neutral-900/60 font-chart'
        /* O corpo em hebraico é envolto em dir="rtl" pelo mdx-components, e o SVG herda:
           com direction rtl, cada <text> de âncora `start` cresce para a ESQUERDA e sai da
           moldura (medido: a coluna dos degraus ficava cortada no canto). A geometria do
           gráfico é LTR em toda língua; o algoritmo bidi ainda ordena certo o texto hebraico
           DENTRO de cada <text>. */
        style={{ direction: 'ltr' }}
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

        {degraus.map((d, i) => {
          const y = PAD.top + i * ROW_H;
          // Escala normalizada pela capacidade DESTA linha.
          const sx = (gib: number) => (gib / d.capacidade) * plotW;
          const wPesos = Math.min(sx(d.pesos), plotW * TRANSBORDO_MAX);
          const wRef = Math.min(sx(d.pesos + d.cacheRef), plotW * TRANSBORDO_MAX);
          const wMax = Math.min(sx(d.pesos + d.cacheMax), plotW * TRANSBORDO_MAX);
          const estoura = d.pesos + d.cacheMax > d.capacidade;
          const estouraNoRef = d.pesos + d.cacheRef > d.capacidade;

          return (
            <g key={d.capacidade}>
              {/* Degrau: capacidade em cima, hardware embaixo (duas linhas, para o
                  rótulo longo não invadir a área do gráfico) */}
              <text x={PAD.left} y={y + 18} className='fill-white' fontSize='15' fontWeight='700'>
                {d.capacidade} GB
              </text>
              <text x={PAD.left} y={y + 32} className='fill-neutral-500' fontSize='9'>
                {d.hardware}
              </text>

              {/* Modelo escolhido para o degrau */}
              <text x={x0} y={y + 22} className='fill-neutral-300' fontSize='10.5'>
                {d.modelo}
                <tspan className='fill-neutral-500'>{'  '}{d.quant}</tspan>
              </text>

              {/* Até que contexto o degrau se sustenta, alinhado ao fim da trilha */}
              <text
                x={x0 + plotW}
                y={y + 22}
                textAnchor='end'
                fontSize='10'
                fontWeight={estouraNoRef ? '700' : '400'}
                fill={estouraNoRef ? COR.estouro : '#a3a3a3'}
              >
                {d.cabeAte}
              </text>

              {/* Trilha = a capacidade da placa */}
              <rect
                x={x0}
                y={y + BAR_Y}
                width={plotW}
                height={BAR_H}
                rx={3}
                fill={COR.trilha}
                stroke={COR.borda}
                strokeWidth={1}
              />

              {/* Transbordo no contexto máximo: desenhado ANTES, fica por baixo */}
              {estoura ? (
                <rect
                  x={x0 + wRef}
                  y={y + BAR_Y}
                  width={Math.max(wMax - wRef, 2)}
                  height={BAR_H}
                  rx={3}
                  fill={COR.estouro}
                  opacity={0.55}
                />
              ) : null}

              {/* Cache do contexto de referência */}
              <rect
                x={x0 + wPesos}
                y={y + BAR_Y}
                width={Math.max(wRef - wPesos, 1.5)}
                height={BAR_H}
                fill={COR.cache}
                opacity={0.9}
              />

              {/* Pesos */}
              <rect x={x0} y={y + BAR_Y} width={wPesos} height={BAR_H} rx={3} fill={COR.pesos} />

              {/* Fim da capacidade: a linha que o transbordo cruza */}
              <line
                x1={x0 + plotW}
                y1={y + BAR_Y - 3}
                x2={x0 + plotW}
                y2={y + BAR_Y + BAR_H + 3}
                stroke='#ffffff'
                strokeWidth={1.5}
                opacity={0.85}
              />

            </g>
          );
        })}

        {/* Legenda. Sem medição de texto no SVG: a largura de cada item é estimada em
            ~5,1 px por caractere a 10 px, que é o suficiente para não sobrepor. */}
        {itensLegenda(legenda).map((item) => (
          <g key={item.texto}>
            <rect x={item.x} y={H - PAD.bottom + 14} width={10} height={10} rx={2} fill={item.cor} />
            <text x={item.x + 15} y={H - PAD.bottom + 22} className='fill-neutral-400' fontSize='10'>
              {item.texto}
            </text>
          </g>
        ))}

        {source ? (
          <text x={PAD.left} y={H - 10} className='fill-neutral-500' fontSize='9'>
            {source}
          </text>
        ) : null}
      </svg>
    </figure>
  );
}
