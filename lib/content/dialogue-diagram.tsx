/**
 * ══════════════════════════════════════════════════════════════════════
 * DialogueDiagram — balões de fala empilhados, com marca de dramatização
 * ══════════════════════════════════════════════════════════════════════
 *
 * COMPONENTE NOVO do artigo `conluio-dos-agentes` (o "balão de fala" aprovado
 * no Gate 1). O site não tem nada de fala; o `StepFlowDiagram` é cadeia
 * causal, não conversa. Aqui cada balão é um post do wiki, DRAMATIZADO —
 * a marca de dramatização vai DENTRO do SVG (PADRAO §5, estende a regra do
 * `marca-dagua`), e o post real verbatim vive no parágrafo abaixo, no corpo.
 *
 * SVG puro; texto por props; conteúdo via `dataset` em `data/artigos-charts.ts`
 * (o `compileMDX` só entrega atributo string). Determinístico.
 *
 * Cor codifica o PAPEL da fala, nunca "série N": âmbar = a resposta postada
 * (a cola em si); azul = pedido de gabarito; cinza = aviso operacional;
 * ouro = a fala-estrela, uma só por figura (a que o leitor deve notar).
 * Identidade nunca é só cor — cada balão tem autor e hora escritos.
 *
 * Orçamento de texto por vaga (medido por `checar-figuras.py`):
 *   - title: W - 32
 *   - disclaimer (faixa no topo): W - 120 (deixa espaço para o ícone)
 *   - author: 300 px · time: 120 px (mesma linha, cantos opostos do balão)
 *   - text: quebrado em linhas de <= LINE_CHARS; altura do balão cresce com as linhas
 */

import { dialogueDatasets } from '@/data/artigos-charts';

interface DialogueDiagramProps {
  /** Chave em `dialogueDatasets`. */
  dataset: string;
  title: string;
  subtitle?: string;
  /** Descrição para leitor de tela. */
  description: string;
  /** Procedência, dentro do SVG. */
  source?: string;
}

const W = 720;
const PAD = { top: 92, left: 24, right: 24, bottom: 40 };
const BUBBLE_GAP = 18;
const LINE_H = 20;
const LINE_CHARS = 68;
const TEXT_TOP = 46; // distância do topo do balão até a 1ª linha de texto

const OURO = '#a48f65';
const AZUL = '#60a5fa';
const AMBAR = '#fbbf24';
const CINZA = '#64748b';

const TONE: Record<string, string> = {
  answer: AMBAR,
  ask: AZUL,
  notice: CINZA,
  alert: OURO,
};

/** Quebra gulosa por palavra; determinística. */
function wrap(text: string, max: number): string[] {
  const words = text.split(' ');
  const lines: string[] = [];
  let cur = '';
  for (const w of words) {
    if (cur && (cur + ' ' + w).length > max) {
      lines.push(cur);
      cur = w;
    } else {
      cur = cur ? cur + ' ' + w : w;
    }
  }
  if (cur) lines.push(cur);
  return lines;
}

export function DialogueDiagram({
  dataset,
  title,
  subtitle,
  description,
  source,
}: DialogueDiagramProps) {
  const data = dialogueDatasets[dataset];
  if (!data) {
    throw new Error(`DialogueDiagram: dataset desconhecido "${dataset}"`);
  }

  const bubbles = data.bubbles.map((b) => {
    const lines = wrap(b.text, LINE_CHARS);
    const h = TEXT_TOP + lines.length * LINE_H + 14;
    return { ...b, lines, h };
  });

  const totalBubbles = bubbles.reduce((s, b) => s + b.h, 0);
  const H = PAD.top + totalBubbles + (bubbles.length - 1) * BUBBLE_GAP + PAD.bottom;
  const bubbleW = W - PAD.left - PAD.right;

  let y = PAD.top;

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

        {/* faixa de dramatização — dentro do SVG, PADRAO §5 */}
        <g>
          <rect
            x={PAD.left}
            y={54}
            width={bubbleW}
            height={26}
            rx={4}
            fill='#a48f6522'
            stroke={OURO}
            strokeWidth='1'
            strokeDasharray='4 3'
          />
          <text x={PAD.left + 12} y={71} fontSize='11.5' fontStyle='italic' fill={OURO}>
            {data.disclaimer}
          </text>
        </g>

        {bubbles.map((b) => {
          const color = TONE[b.tone] ?? AZUL;
          const top = y;
          y += b.h + BUBBLE_GAP;
          return (
            <g key={b.author + b.time}>
              <rect
                x={PAD.left}
                y={top}
                width={bubbleW}
                height={b.h}
                rx={10}
                fill='#14191f'
                stroke={color}
                strokeWidth='1.5'
              />
              {/* rabinho do balão */}
              <path
                d={`M ${PAD.left + 26} ${top + b.h} l 12 0 l -18 14 z`}
                fill='#14191f'
                stroke={color}
                strokeWidth='1.5'
              />
              <text x={PAD.left + 16} y={top + 24} fontSize='12.5' fontWeight='700' fill={color}>
                {b.author}
              </text>
              <text
                x={PAD.left + bubbleW - 16}
                y={top + 24}
                textAnchor='end'
                fontSize='11'
                className='fill-neutral-500'
              >
                {b.time}
              </text>
              {b.lines.map((ln, i) => (
                <text
                  key={i}
                  x={PAD.left + 16}
                  y={top + TEXT_TOP + i * LINE_H}
                  fontSize='13.5'
                  className='fill-neutral-100'
                >
                  {ln}
                </text>
              ))}
            </g>
          );
        })}

        {source ? (
          <text x={W - PAD.right} y={H - 12} textAnchor='end' fontSize='11' className='fill-neutral-500'>
            {source}
          </text>
        ) : null}
      </svg>
    </figure>
  );
}
