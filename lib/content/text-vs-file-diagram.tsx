/**
 * ══════════════════════════════════════════════════════════════════════
 * TextVsFileDiagram — no texto é marca d'água; no arquivo é credencial
 * ══════════════════════════════════════════════════════════════════════
 *
 * DESTINO NO SITE: `lib/content/text-vs-file-diagram.tsx` + registro em
 * `lib/content/mdx-components.tsx`. Texto em `data/text-vs-file-diagram.ts`
 * (o `compileMDX` só entrega atributo string — daí `dataset` por id).
 *
 * A distinção é da própria Anthropic e é a que mais se perde na cobertura:
 * o texto NÃO recebe nada — o padrão está na escolha das palavras; o
 * arquivo recebe uma nota assinada (C2PA) nos metadados, e o conteúdo dele
 * fica intacto. Dois mecanismos diferentes com o mesmo apelido.
 *
 * A figura põe os dois lado a lado porque é comparação, não sequência: os
 * painéis têm a MESMA geometria por construção (mesma largura, mesmas
 * alturas de linha), então o olho compara o conteúdo, não o tamanho.
 *
 * Nada de aleatório: o destaque das palavras vem de `marked` no dado, não
 * de sorteio — render idêntico no servidor e no cliente.
 *
 * Paleta (dataviz da marca, superfície #14191f):
 *   ouro  #a48f65  o TEXTO e as palavras que a chave decidiu — é o assunto do
 *                  artigo, logo o destaque, que é o papel do ouro na paleta
 *                  dataviz da marca (`data/artigos-charts.ts` do site)
 *   azul  #60a5fa  o ARQUIVO e a credencial C2PA — a outra coisa, série-tese.
 *                  Azul e não âmbar de propósito: âmbar divide a matiz 84° com
 *                  o ouro e os dois painéis ficariam parecidos lado a lado.
 *   cinza #64748b  moldura e apoio
 */

import { textVsFileDatasets } from '@/data/text-vs-file-diagram';

interface TextVsFileDiagramProps {
  /** Chave em `textVsFileDatasets`. */
  dataset: string;
  title: string;
  /** Descrição para leitor de tela — a figura é informativa, não decorativa. */
  description: string;
  /** Procedência, desenhada DENTRO do SVG — a imagem circula sozinha. */
  source?: string;
}

const W = 720;
const H = 356;

/** Os dois painéis: mesma caixa, lado a lado. */
const PANEL = { y: 62, h: 240, w: 328, gap: 16 };
const LEFT_X = 24;
const RIGHT_X = LEFT_X + PANEL.w + PANEL.gap;

/** Respiro interno. Orçamento de texto por painel = PANEL.w - 2 * PAD. */
const PAD = 18;

const OURO = '#a48f65';
const OURO_CLARO = '#c4ad7f';
/** Ouro clareado só para TEXTO sobre a superfície escura: o ouro cheio a 11px
 *  fica no limite de leitura. */
const OURO_TEXTO = '#e0d3b8';

/** Tira de palavras do painel esquerdo. */
const PILL = { y: 128, h: 34, gap: 6 };

/** Miniatura do arquivo e a etiqueta da credencial, no painel direito. */
const THUMB = { x: 18, y: 104, w: 132, h: 82 };
const TAG = { x: 176, y: 124, w: 134, h: 42 };

/** As duas notas de rodapé de cada painel, medidas a partir do TOPO do
 *  painel: a segunda tem de fechar dentro de PANEL.h, senão vaza a caixa. */
const NOTE_Y = [206, 226];

export function TextVsFileDiagram({
  dataset,
  title,
  description,
  source,
}: TextVsFileDiagramProps) {
  const data = textVsFileDatasets[dataset];
  if (!data) {
    throw new Error(`TextVsFileDiagram: dataset desconhecido "${dataset}"`);
  }

  const pillW =
    (PANEL.w - 2 * PAD - (data.left.words.length - 1) * PILL.gap) / data.left.words.length;

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

        {/* ── Painel esquerdo: o texto ───────────────────────────────── */}
        <rect
          x={LEFT_X}
          y={PANEL.y}
          width={PANEL.w}
          height={PANEL.h}
          rx={10}
          fill={OURO}
          fillOpacity={0.08}
          stroke={OURO}
          strokeOpacity={0.5}
          strokeWidth={1}
        />
        <text
          x={LEFT_X + PAD}
          y={PANEL.y + 30}
          fill={OURO_CLARO}
          fontSize='13'
          fontWeight='700'
        >
          {data.left.badge}
        </text>
        <text
          x={LEFT_X + PAD}
          y={PANEL.y + 50}
          className='fill-neutral-400'
          fontSize='11'
        >
          {data.left.subtitle}
        </text>

        {data.left.words.map((word, i) => {
          const x = LEFT_X + PAD + i * (pillW + PILL.gap);
          return (
            <g key={`${word.text}-${i}`}>
              <rect
                x={x}
                y={PANEL.y + PILL.y - PILL.h / 2}
                width={pillW}
                height={PILL.h}
                rx={6}
                fill={word.marked ? OURO : '#ffffff'}
                fillOpacity={word.marked ? 0.25 : 0.04}
                stroke={word.marked ? OURO : '#ffffff'}
                strokeOpacity={word.marked ? 1 : 0.15}
                strokeWidth={1}
              />
              <text
                x={x + pillW / 2}
                y={PANEL.y + PILL.y + 4}
                textAnchor='middle'
                fill={word.marked ? OURO_TEXTO : '#d4d4d4'}
                fontSize='11'
                fontWeight={word.marked ? '700' : '400'}
              >
                {word.text}
              </text>
            </g>
          );
        })}

        <text
          x={LEFT_X + PAD}
          y={PANEL.y + PILL.y + 42}
          fill={OURO_CLARO}
          fontSize='11'
        >
          {data.left.wordsNote}
        </text>

        {/* ── Painel direito: o arquivo ──────────────────────────────── */}
        <rect
          x={RIGHT_X}
          y={PANEL.y}
          width={PANEL.w}
          height={PANEL.h}
          rx={10}
          className='fill-sky-400/[0.06] stroke-sky-400/40'
          strokeWidth={1}
        />
        <text
          x={RIGHT_X + PAD}
          y={PANEL.y + 30}
          className='fill-sky-300'
          fontSize='13'
          fontWeight='700'
        >
          {data.right.badge}
        </text>
        <text
          x={RIGHT_X + PAD}
          y={PANEL.y + 50}
          className='fill-neutral-400'
          fontSize='11'
        >
          {data.right.subtitle}
        </text>

        {/* A miniatura é forma, não texto: sugere "um arquivo de imagem"
            sem depender de rótulo — e o conteúdo dela não muda, que é
            justamente o ponto do painel. */}
        <rect
          x={RIGHT_X + THUMB.x}
          y={PANEL.y + THUMB.y}
          width={THUMB.w}
          height={THUMB.h}
          rx={6}
          className='fill-white/[0.04] stroke-white/25'
          strokeWidth={1}
        />
        <circle
          cx={RIGHT_X + THUMB.x + 34}
          cy={PANEL.y + THUMB.y + 28}
          r={11}
          className='fill-white/20'
        />
        <path
          d={`M ${RIGHT_X + THUMB.x + 10} ${PANEL.y + THUMB.y + THUMB.h - 12}
              L ${RIGHT_X + THUMB.x + 52} ${PANEL.y + THUMB.y + 40}
              L ${RIGHT_X + THUMB.x + 88} ${PANEL.y + THUMB.y + THUMB.h - 12} Z`}
          className='fill-white/20'
        />
        <path
          d={`M ${RIGHT_X + THUMB.x + 66} ${PANEL.y + THUMB.y + THUMB.h - 12}
              L ${RIGHT_X + THUMB.x + 98} ${PANEL.y + THUMB.y + 52}
              L ${RIGHT_X + THUMB.x + 124} ${PANEL.y + THUMB.y + THUMB.h - 12} Z`}
          className='fill-white/12'
        />

        {/* A credencial fica AO LADO do arquivo, nunca dentro da imagem —
            a linha tracejada carrega exatamente essa ideia. */}
        <line
          x1={RIGHT_X + THUMB.x + THUMB.w}
          y1={PANEL.y + TAG.y + TAG.h / 2}
          x2={RIGHT_X + TAG.x}
          y2={PANEL.y + TAG.y + TAG.h / 2}
          className='stroke-sky-400/50'
          strokeWidth={1.5}
          strokeDasharray='4 3'
        />
        <rect
          x={RIGHT_X + TAG.x}
          y={PANEL.y + TAG.y}
          width={TAG.w}
          height={TAG.h}
          rx={6}
          className='fill-sky-400/10 stroke-sky-400/60'
          strokeWidth={1}
        />
        <text
          x={RIGHT_X + TAG.x + TAG.w / 2}
          y={PANEL.y + TAG.y + 26}
          textAnchor='middle'
          className='fill-sky-300'
          fontSize='11'
          fontWeight='700'
        >
          {data.right.tagLabel}
        </text>

        {/* ── As duas notas de cada painel, na mesma altura ──────────── */}
        {data.left.notes.map((nota, i) => (
          <text
            key={nota}
            x={LEFT_X + PAD}
            y={PANEL.y + NOTE_Y[i]}
            className='fill-neutral-300'
            fontSize='11'
          >
            {nota}
          </text>
        ))}
        {data.right.notes.map((nota, i) => (
          <text
            key={nota}
            x={RIGHT_X + PAD}
            y={PANEL.y + NOTE_Y[i]}
            className='fill-neutral-300'
            fontSize='11'
          >
            {nota}
          </text>
        ))}

        {source ? (
          <text x={24} y={H - 14} className='fill-neutral-500' fontSize='10'>
            {source}
          </text>
        ) : null}
      </svg>
    </figure>
  );
}
