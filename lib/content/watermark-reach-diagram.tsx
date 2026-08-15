/**
 * ══════════════════════════════════════════════════════════════════════
 * WatermarkReachDiagram — onde a marca pega, em DUAS dimensões
 * ══════════════════════════════════════════════════════════════════════
 *
 * DESTINO NO SITE: `lib/content/watermark-reach-diagram.tsx` + registro em
 * `lib/content/mdx-components.tsx`. Texto em `data/watermark-reach-diagram.ts`
 * (o `compileMDX` só entrega atributo string — daí `dataset` por id).
 *
 * POR QUE MATRIZ, E NÃO UMA BARRA "QUANTO MARCA":
 * o artigo trata dois limites que a cobertura costuma achatar num só:
 *
 *   1. quanta ESCOLHA LIVRE o modelo teve  -> decide se a marca chega a ser posta
 *   2. quanto TEXTO existe para medir      -> decide se ela pode ser detectada
 *
 * São independentes. Um parágrafo solto escrito pelo Claude é TOTALMENTE
 * marcado e mesmo assim indetectável; um texto seu longo que ele revisou é
 * longo e quase não tem marca. Uma barra única de "quanto marca" ensinaria
 * errado — daí os quadrantes.
 *
 * Eixos SEM número, de propósito: as posições são qualitativas (é uma
 * figura de conceito, não de medição), e a procedência dentro do SVG diz
 * isso para quem receber a imagem solta.
 *
 * Ordem das células é posição, não aleatoriedade: índice 0..3 mapeia em
 * [cima-esquerda, cima-direita, baixo-esquerda, baixo-direita]. Render
 * idêntico no servidor e no cliente.
 *
 * Paleta (dataviz da marca, superfície #14191f):
 *   ouro  #a48f65  onde a detecção funciona — o DESTAQUE da figura, papel do
 *                  ouro na paleta dataviz da marca (`data/artigos-charts.ts`)
 *   âmbar #fbbf24  onde falta uma das duas condições
 *   cinza #64748b  onde não há nada a medir
 * O ouro fica ao lado do âmbar (mesma matiz 84°) e, no primeiro render, os
 * dois quadrantes ficaram parecidos demais. A distinção passou a ser de
 * FORMA: o quadrante que funciona tem borda CHEIA e mais grossa; os outros
 * três, borda TRACEJADA. Cor sozinha não podia carregar isso.
 */

import { watermarkReachDatasets } from '@/data/watermark-reach-diagram';

interface WatermarkReachDiagramProps {
  /** Chave em `watermarkReachDatasets`. */
  dataset: string;
  title: string;
  /** Descrição para leitor de tela — a figura é informativa, não decorativa. */
  description: string;
  /** Procedência, desenhada DENTRO do SVG — a imagem circula sozinha. */
  source?: string;
}

const W = 720;
/** Altura: abaixo da matriz moram TRÊS faixas — rótulos de coluna (+24), o
 *  nome do eixo X (+46) e a procedência (H-14). Encolher H faz o eixo e a
 *  procedência se sobreporem, e nenhum medidor de LARGURA pega isso. */
const H = 392;

/** Área da matriz. À esquerda sobra faixa para o eixo Y e os rótulos de linha. */
const PLOT = { x: 168, y: 74, w: 528, h: 236 };
const COL_W = PLOT.w / 2;
const ROW_H = PLOT.h / 2;

/** Respiro interno da célula. Orçamento de texto = COL_W - 2 * PAD_CELL. */
const PAD_CELL = 15;

const OURO = '#a48f65';
const OURO_CLARO = '#c4ad7f';

/** Cor por atributo SVG, não por classe arbitrária do Tailwind: uma classe
 *  como `fill-[#a48f65]/15` só existe se o scanner do Tailwind a encontrar no
 *  código-fonte, e dentro de um objeto de configuração ela pode não ser
 *  gerada — o elemento renderiza preto, em silêncio. Atributo sempre pinta. */
const TOM = {
  funciona: {
    fill: OURO,
    fillOpacity: 0.22,
    stroke: OURO,
    strokeOpacity: 1,
    strokeWidth: 2,
    dash: undefined,
    head: OURO_CLARO,
  },
  parcial: {
    fill: '#fbbf24',
    fillOpacity: 0.05,
    stroke: '#fbbf24',
    strokeOpacity: 0.45,
    strokeWidth: 1,
    dash: '5 4',
    head: '#fcd34d',
  },
  nada: {
    fill: '#ffffff',
    fillOpacity: 0.04,
    stroke: '#ffffff',
    strokeOpacity: 0.15,
    strokeWidth: 1,
    dash: '5 4',
    head: '#d4d4d4',
  },
} as const;

export function WatermarkReachDiagram({
  dataset,
  title,
  description,
  source,
}: WatermarkReachDiagramProps) {
  const data = watermarkReachDatasets[dataset];
  if (!data) {
    throw new Error(`WatermarkReachDiagram: dataset desconhecido "${dataset}"`);
  }

  return (
    <figure className='my-10 not-prose'>
      <svg
        viewBox={`0 0 ${W} ${H}`}
        className='w-full h-auto rounded-lg border border-white/10 bg-neutral-900/60 font-chart'
        role='img'
        aria-label={description}
      >
        <title>{description}</title>

        <text x={24} y={34} className='fill-white' fontSize='15' fontWeight='700'>
          {title}
        </text>

        {/* Eixo Y: rotacionado -90°, então o orçamento dele é a ALTURA do plot,
            nunca a largura — medir contra a largura daria falso "cabe". */}
        <text
          x={22}
          y={PLOT.y + PLOT.h / 2}
          transform={`rotate(-90 22 ${PLOT.y + PLOT.h / 2})`}
          textAnchor='middle'
          className='fill-neutral-400'
          fontSize='11'
          fontWeight='700'
        >
          {data.yAxis}
        </text>

        {/* Rótulos de linha, encostados na borda esquerda da matriz. */}
        {[data.yHigh, data.yLow].map((rotulo, i) => (
          <text
            key={rotulo}
            x={PLOT.x - 12}
            y={PLOT.y + i * ROW_H + ROW_H / 2 + 4}
            textAnchor='end'
            className='fill-neutral-300'
            fontSize='11'
          >
            {rotulo}
          </text>
        ))}

        {/* Eixo X e os dois rótulos de coluna, embaixo. */}
        {[data.xLow, data.xHigh].map((rotulo, i) => (
          <text
            key={rotulo}
            x={PLOT.x + i * COL_W + COL_W / 2}
            y={PLOT.y + PLOT.h + 24}
            textAnchor='middle'
            className='fill-neutral-300'
            fontSize='11'
          >
            {rotulo}
          </text>
        ))}
        <text
          x={PLOT.x + PLOT.w / 2}
          y={PLOT.y + PLOT.h + 48}
          textAnchor='middle'
          className='fill-neutral-400'
          fontSize='11'
          fontWeight='700'
        >
          {data.xAxis}
        </text>

        {data.cells.map((cell, i) => {
          const col = i % 2;
          const row = Math.floor(i / 2);
          const x = PLOT.x + col * COL_W;
          const y = PLOT.y + row * ROW_H;
          const tom = TOM[cell.tone];

          return (
            <g key={cell.headline}>
              <rect
                x={x + 4}
                y={y + 4}
                width={COL_W - 8}
                height={ROW_H - 8}
                rx={8}
                fill={tom.fill}
                fillOpacity={tom.fillOpacity}
                stroke={tom.stroke}
                strokeOpacity={tom.strokeOpacity}
                strokeWidth={tom.strokeWidth}
                strokeDasharray={tom.dash}
              />
              <text
                x={x + PAD_CELL}
                y={y + 30}
                fill={tom.head}
                fontSize='12'
                fontWeight='700'
              >
                {cell.headline}
              </text>
              {cell.items.map((item, j) => (
                <text
                  key={item}
                  x={x + PAD_CELL}
                  y={y + 54 + j * 20}
                  className='fill-neutral-300'
                  fontSize='11'
                >
                  {`· ${item}`}
                </text>
              ))}
            </g>
          );
        })}

        {source ? (
          <text x={24} y={H - 14} className='fill-neutral-500' fontSize='10'>
            {source}
          </text>
        ) : null}
      </svg>
    </figure>
  );
}
