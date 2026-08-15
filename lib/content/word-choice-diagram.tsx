/**
 * ══════════════════════════════════════════════════════════════════════
 * WordChoiceDiagram — onde a marca d'água mora, e onde ela não pega
 * ══════════════════════════════════════════════════════════════════════
 *
 * DESTINO NO SITE: `lib/content/word-choice-diagram.tsx` + registro em
 * `lib/content/mdx-components.tsx`. Os textos vêm de
 * `data/word-choice-diagram.ts` (o `compileMDX` só entrega atributo
 * string — daí `dataset` por id, como em `WaffleChart`/`KitchenDiagram`).
 *
 * A MESMA FIGURA APARECE DUAS VEZES no artigo: `mode="livre"` mostra o
 * empate entre duas palavras igualmente boas (a chave desempata, e é aí
 * que a marca fica) e `mode="travado"` mostra o passo em que só existe
 * uma resposta certa (sem empate, nada a marcar). Por isso `mode` NÃO
 * entra em nenhum cálculo de posição: ele só escolhe a cena. As duas
 * ficam com a mesma geometria por construção, não por disciplina.
 *
 * Nada de aleatório: tudo sai de índice, para o render ser idêntico no
 * servidor e no cliente (mesmo motivo do TvChannelsDiagram).
 *
 * Paleta (dataviz da marca, superfície #14191f):
 *   ouro  #a48f65  a palavra que a chave escolheu, e a própria chave (DESTAQUE)
 *   azul  #60a5fa  a candidata que serviria igual e não saiu
 *   âmbar #fbbf24  a resposta obrigatória — onde a marca não age
 *   cinza #64748b  o que não existe / recessivo
 * O texto da pílula cinza usa #cbd5e1: o cinza da marca mede 3,7:1 sobre
 * o fundo dos gráficos e passa como forma, não como texto de 10px.
 */

import {
  wordChoiceDatasets,
  type WordChoiceCandidate,
  type WordChoiceScene,
} from '@/data/word-choice-diagram';

interface WordChoiceDiagramProps {
  /** Chave em `wordChoiceDatasets`. */
  dataset: string;
  /** `"livre"` (há empate) ou `"travado"` (só uma resposta certa). */
  mode?: string;
  title: string;
  /** Descrição para leitor de tela — a figura é informativa, não decorativa. */
  description: string;
  /** Procedência, desenhada DENTRO do SVG — a imagem circula sozinha. */
  source?: string;
}

const W = 760;
const H = 360;

/** Tira da frase já escrita. */
const TIRA = { x: 24, y: 62, h: 40, gap: 8 };
const SLOT_W = 132;

/** Coluna das candidatas. A nota de cada uma vai DENTRO da caixa: à direita
 *  ela era cortada pelo viewBox, e corte de rótulo é silencioso. */
const CAND = { x: 452, w: 268, h: 46, y: [164, 226] };

/** Onde o caminho se divide — e onde a chave aponta. */
const GARFO_Y = 218;

/** Caixa da chave. */
const CHAVE = { x: 60, y: 192, w: 268, h: 52 };

const COR = {
  /** Ouro da marca: o DESTAQUE. Aqui, a palavra que a chave escolheu — e a
   *  própria chave, que é o que a produz. Papel definido na paleta dataviz da
   *  marca (header de `data/artigos-charts.ts` do site). */
  escolhida: '#a48f65',
  /** Azul, série-tese: a candidata que serviria igual e não saiu. */
  alternativa: '#60a5fa',
  unica: '#fbbf24',
  chave: '#a48f65',
  apagado: '#64748b',
  textoApagado: '#cbd5e1',
};

/** O SVG não mede texto. Coeficientes medidos na Fahkwang que o site serve:
 *  a 12px o pior caso das palavras usadas fica em ~8,2 px por caractere no
 *  peso 700 e ~7,8 no 400 — daí 8 + folga fixa. Estimar por baixo produz
 *  caixa colada no texto; o orçamento por vaga está no arquivo de dados. */
function larguraCaixa(texto: string, peso: 400 | 700) {
  return Math.round(texto.length * (peso === 700 ? 8 : 7.6)) + 24;
}

function CaixaTexto({
  x,
  y,
  w,
  h,
  texto,
  cor,
  preenchida,
  tracejada,
  peso = 400,
  px = 12,
}: {
  x: number;
  y: number;
  w: number;
  h: number;
  texto: string;
  cor: string;
  preenchida?: boolean;
  tracejada?: boolean;
  peso?: 400 | 700;
  px?: number;
}) {
  return (
    <g>
      <rect
        x={x}
        y={y}
        width={w}
        height={h}
        rx={6}
        fill={preenchida ? cor : 'rgba(255,255,255,0.03)'}
        fillOpacity={preenchida ? 0.22 : 1}
        stroke={cor}
        strokeWidth={preenchida ? 1.8 : 1.2}
        strokeDasharray={tracejada ? '5 4' : undefined}
      />
      <text
        x={x + w / 2}
        y={y + h / 2 + px / 3}
        fill={cor === COR.apagado ? COR.textoApagado : '#ffffff'}
        fontSize={px}
        fontWeight={peso}
        textAnchor='middle'
      >
        {texto}
      </text>
    </g>
  );
}

function Candidata({ c, y, ponta }: { c: WordChoiceCandidate; y: number; ponta: number }) {
  const cor =
    c.tone === 'unica'
      ? COR.unica
      : c.tone === 'ausente'
        ? COR.apagado
        : c.tone === 'escolhida'
          ? COR.escolhida
          : COR.alternativa;
  const preenchida = c.tone === 'escolhida' || c.tone === 'unica';
  return (
    <g>
      <rect
        x={CAND.x}
        y={y}
        width={CAND.w}
        height={CAND.h}
        rx={6}
        fill={preenchida ? cor : 'rgba(255,255,255,0.03)'}
        fillOpacity={preenchida ? 0.22 : 1}
        stroke={cor}
        strokeWidth={preenchida ? 1.8 : 1.2}
        strokeDasharray={c.tone === 'ausente' ? '5 4' : undefined}
      />
      <text
        x={CAND.x + CAND.w / 2}
        y={y + 20}
        fill={c.tone === 'ausente' ? COR.textoApagado : '#ffffff'}
        fontSize='13'
        fontWeight='700'
        textAnchor='middle'
      >
        {c.word}
      </text>
      <text
        x={CAND.x + CAND.w / 2}
        y={y + 36}
        fill={c.tone === 'ausente' ? COR.textoApagado : cor}
        fontSize='10'
        textAnchor='middle'
        opacity={0.9}
      >
        {c.note}
      </text>
      {/* braço do garfo até esta candidata */}
      <line
        x1={ponta}
        y1={GARFO_Y}
        x2={CAND.x - 6}
        y2={y + CAND.h / 2}
        stroke={cor}
        strokeWidth={1.4}
        opacity={c.tone === 'ausente' ? 0.4 : 0.8}
        strokeDasharray={c.tone === 'ausente' ? '4 4' : undefined}
      />
    </g>
  );
}

export function WordChoiceDiagram({
  dataset,
  mode = 'livre',
  title,
  description,
  source,
}: WordChoiceDiagramProps) {
  const data = wordChoiceDatasets[dataset];
  if (!data) {
    throw new Error(`WordChoiceDiagram: dataset desconhecido "${dataset}"`);
  }
  const travado = mode === 'travado';
  const cena: WordChoiceScene = travado ? data.travado : data.livre;
  const corCena = travado ? COR.unica : COR.escolhida;

  // A tira: cada palavra vira uma caixa, e o espaço vazio fecha a fila.
  let cursor = TIRA.x;
  const caixas = cena.written.map((p) => {
    const w = larguraCaixa(p, 400);
    const item = { p, x: cursor, w };
    cursor += w + TIRA.gap;
    return item;
  });
  const slotX = cursor;
  const slotCx = slotX + SLOT_W / 2;

  return (
    <figure className='my-10 not-prose'>
      <svg
        viewBox={`0 0 ${W} ${H}`}
        className='w-full h-auto rounded-lg border border-white/10 bg-neutral-900/60 font-chart'
        role='img'
        aria-label={description}
      >
        <title>{description}</title>

        <text x={TIRA.x} y={26} className='fill-white' fontSize='15' fontWeight='700'>
          {title}
        </text>

        {/* ───────────── A frase já escrita, palavra a palavra ───────────── */}
        {caixas.map((c) => (
          <CaixaTexto
            key={c.x}
            x={c.x}
            y={TIRA.y}
            w={c.w}
            h={TIRA.h}
            texto={c.p}
            cor='rgba(255,255,255,0.28)'
          />
        ))}

        {/* O espaço vazio: é aqui que a escolha acontece. */}
        <rect
          x={slotX}
          y={TIRA.y}
          width={SLOT_W}
          height={TIRA.h}
          rx={6}
          fill='rgba(255,255,255,0.02)'
          stroke={corCena}
          strokeWidth={1.6}
          strokeDasharray='6 4'
        />
        <text
          x={slotCx}
          y={TIRA.y + TIRA.h / 2 + 5}
          fill={corCena}
          fontSize='15'
          fontWeight='700'
          textAnchor='middle'
        >
          ?
        </text>
        <text x={slotCx} y={TIRA.y - 8} fill={corCena} fontSize='10' textAnchor='middle'>
          {cena.slotLabel}
        </text>

        {/* Do espaço vazio desce um pé até o ponto onde o caminho se divide. */}
        <line
          x1={slotCx}
          y1={TIRA.y + TIRA.h}
          x2={slotCx}
          y2={GARFO_Y}
          stroke={corCena}
          strokeWidth={1.4}
          opacity={0.8}
        />

        {/* ───────────── As duas candidatas ───────────── */}
        {cena.candidates.map((c, i) => (
          <Candidata key={c.word} c={c} y={CAND.y[i] ?? CAND.y[0]} ponta={slotCx} />
        ))}

        {/* ───────────── A chave: a fonte do sorteio ───────────── */}
        <rect
          x={CHAVE.x}
          y={CHAVE.y}
          width={CHAVE.w}
          height={CHAVE.h}
          rx={8}
          fill='rgba(164,143,101,0.10)'
          stroke={COR.chave}
          strokeWidth={1.5}
          strokeDasharray={travado ? '5 4' : undefined}
          opacity={travado ? 0.55 : 1}
        />
        <text
          x={CHAVE.x + 16}
          y={CHAVE.y + 22}
          fill={COR.chave}
          fontSize='12'
          fontWeight='700'
          opacity={travado ? 0.7 : 1}
        >
          {cena.keyLabel}
        </text>
        <text
          x={CHAVE.x + 16}
          y={CHAVE.y + 38}
          className='fill-neutral-400'
          fontSize='10'
          opacity={travado ? 0.8 : 1}
        >
          {cena.keyNote}
        </text>
        {/* A chave aponta para o ponto da divisão — é ali que ela age. */}
        <line
          x1={CHAVE.x + CHAVE.w}
          y1={GARFO_Y}
          x2={slotCx - 10}
          y2={GARFO_Y}
          stroke={COR.chave}
          strokeWidth={1.6}
          opacity={travado ? 0.35 : 1}
          strokeDasharray={travado ? '4 4' : undefined}
          markerEnd={`url(#wc-ponta-${travado ? 'travado' : 'livre'})`}
        />

        <defs>
          <marker
            id={`wc-ponta-${travado ? 'travado' : 'livre'}`}
            markerWidth='8'
            markerHeight='8'
            refX='7'
            refY='4'
            orient='auto'
          >
            <path d='M0,0 L8,4 L0,8 z' fill={COR.chave} opacity={travado ? 0.35 : 1} />
          </marker>
        </defs>

        <text x={TIRA.x} y={H - 40} className='fill-neutral-300' fontSize='11'>
          {cena.caption}
        </text>

        {source ? (
          <text x={TIRA.x} y={H - 14} className='fill-neutral-500' fontSize='9'>
            {source}
          </text>
        ) : null}
      </svg>
    </figure>
  );
}
