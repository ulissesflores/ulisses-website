/**
 * ══════════════════════════════════════════════════════════════════════
 * CostLadder — a conta ao lado do que foi gasto para produzi-la
 * ══════════════════════════════════════════════════════════════════════
 *
 * SVG puro, sem lib de gráficos. Cada linha tem sempre a MESMA geometria:
 *
 *   rótulo  |  barra proporcional (o que foi gasto)  |  a conta  |  nota
 *
 * A escada do artigo `glm-5-3-flash` usa esta geometria cinco vezes, com
 * dados sucessivos — é o pedido do PADRAO-ARTIGO (a figura da analogia
 * reaparece com os dados de cada cena, e só depois vem o gráfico de
 * número). O que muda entre as cenas é o que a barra mede; o que nunca
 * muda é a leitura "barra grande à esquerda, conta pequena à direita".
 *
 * A escala das barras é COMPARTILHADA dentro de cada cena (normalizada
 * pelo maior valor da cena), ao contrário da `VramLadder`, que normaliza
 * por linha: aqui a pergunta é "quanto MAIOR que o outro", não "cabe?".
 * Por isso uma barra de 2,9% aparece como um traço — esse traço é a tese.
 *
 * `referencia` desenha uma linha vertical na escala das barras (a memória
 * de uma máquina, um teto de orçamento). Fica atrás das barras.
 *
 * Texto por props e pelo dataset do locale; números via `dataset` em
 * `data/artigos-charts.ts` (o `compileMDX` só entrega atributo string).
 * Procedência e frase-conclusão desenhadas DENTRO do SVG: a imagem
 * circula sem o texto do artigo.
 *
 * ORÇAMENTO POR VAGA — em PIXELS, que é o que o medidor mede na Fahkwang real
 * (`assets/checar-cost-ladder.py`; teste negativo reprova 89 de 133 textos).
 * A parede é a VIZINHANÇA, não a moldura:
 *   title · subtitle · conclusao · source .......... 740 px (a moldura inteira)
 *   label · sublabel ............................... 196 px (até a trilha)
 *   bill ........................................... 122 px (do fim da trilha até a coluna)
 *   nota · notaLabel ............................... 98 px
 *   workLabel + billLabel .......................... 410 px A DIVIDIR entre os dois
 *   referencia.texto ............................... 526 px
 * O respiro entre vizinhos é 12 px, não 8: o Chrome desenha a Fahkwang cerca de 4%
 * mais larga que o medidor do PIL, e com 8 px a conta "US$ 5.455,22" passava no
 * medidor por 0,2 px e encostava na barra no PNG. Pego no olho, não no gate.
 * Alongue um rótulo de propósito e confirme que reprova — medidor que nunca
 * reprovou não mede, carimba.
 */

import { costLadderDatasets } from '@/data/artigos-charts';

interface CostLadderProps {
  /** Chave em `costLadderDatasets` — um dataset por cena e por locale. */
  dataset: string;
  title: string;
  subtitle?: string;
  /** Descrição para leitor de tela — o gráfico é informativo, não decorativo. */
  description: string;
  /** Procedência, dentro do SVG. */
  source?: string;
}

const W = 760;
const ROW_H = 52;
const PAD = { top: 64, right: 10, bottom: 58, left: 10 };
const COL_LABEL = 208; // rótulo em duas linhas
const COL_BILL = 134; // a conta, ancorada à direita da sua coluna
const COL_NOTA = 110; // nota curta, ancorada à direita da moldura
const BAR_Y = 17;
const BAR_H = 16;

const COR = {
  trilha: '#ffffff10',
  borda: '#ffffff26',
  destaque: '#a48f65', // ouro da marca: o que o leitor tem de ver primeiro
  padrao: '#60a5fa', // azul série-tese
  extra: '#fbbf24', // âmbar: segundo segmento empilhado
  recessiva: '#64748b',
  referencia: '#ffffff',
};

/**
 * `direction: 'ltr'` no `<svg>` conserta a GEOMETRIA sob o `dir="rtl"` que o
 * `mdx-components` põe no corpo hebraico — sem isso cada `<text>` de âncora
 * `start` cresce para a esquerda e sai da moldura. Mas base LTR quebra a ORDEM
 * de qualquer string que misture hebraico com latino ou número.
 *
 * `unicode-bidi: plaintext` faz cada `<text>` inferir a base do PRIMEIRO
 * caractere forte: o hebraico volta a ordenar RTL, o latino segue LTR e a
 * âncora `x` continua onde o projeto a pôs. Não é herdado, então vai em CADA
 * `<text>` — receita do `obligation-matrix`, que nasceu quebrado sem ela.
 */
const BIDI = { unicodeBidi: 'plaintext' } as const;

export function CostLadder({ dataset, title, subtitle, description, source }: CostLadderProps) {
  const data = costLadderDatasets[dataset];
  if (!data) {
    throw new Error(`CostLadder: dataset desconhecido "${dataset}"`);
  }
  const { rows, workLabel, billLabel, notaLabel, referencia, conclusao } = data;

  const plotW = W - PAD.left - PAD.right - COL_LABEL - COL_BILL - COL_NOTA;
  const x0 = PAD.left + COL_LABEL;
  const xBill = x0 + plotW + COL_BILL;
  const xNota = W - PAD.right;
  const H = PAD.top + rows.length * ROW_H + PAD.bottom;

  // Escala compartilhada: o maior total da cena ocupa a trilha inteira.
  const maxWork = Math.max(
    ...rows.map((r) => r.work + (r.workExtra ?? 0)),
    referencia?.valor ?? 0,
  );
  const sx = (v: number) => (v / maxWork) * plotW;

  return (
    <figure className='my-10 not-prose'>
      <svg
        viewBox={`0 0 ${W} ${H}`}
        className='w-full h-auto rounded-lg border border-white/10 bg-neutral-900/60 font-chart'
        style={{ direction: 'ltr' }}
        role='img'
        aria-label={description}
      >
        <title>{description}</title>

        <text
          x={PAD.left}
          y={24}
          className='fill-white'
          fontSize='15'
          fontWeight='700'
          style={BIDI}
        >
          {title}
        </text>
        {subtitle ? (
          <text x={PAD.left} y={42} className='fill-neutral-400' fontSize='11' style={BIDI}>
            {subtitle}
          </text>
        ) : null}

        {/* Cabeçalhos das três colunas */}
        <text x={x0} y={PAD.top - 8} className='fill-neutral-500' fontSize='9.5' style={BIDI}>
          {workLabel}
        </text>
        <text
          x={xBill}
          y={PAD.top - 8}
          textAnchor='end'
          className='fill-neutral-500'
          fontSize='9.5'
          style={BIDI}
        >
          {billLabel}
        </text>
        {notaLabel ? (
          <text
            x={xNota}
            y={PAD.top - 8}
            textAnchor='end'
            className='fill-neutral-500'
            fontSize='9.5'
            style={BIDI}
          >
            {notaLabel}
          </text>
        ) : null}

        {rows.map((r, i) => {
          const y = PAD.top + i * ROW_H;
          const cor = r.destaque ? COR.destaque : r.recessiva ? COR.recessiva : COR.padrao;
          const wPrincipal = sx(r.work);
          const wExtra = r.workExtra ? sx(r.workExtra) : 0;

          return (
            <g key={r.label}>
              <text
                x={PAD.left}
                y={y + 16}
                fontSize='13.5'
                fontWeight={r.destaque ? '700' : '600'}
                fill={r.destaque ? COR.destaque : '#ffffff'}
                style={BIDI}
              >
                {r.label}
              </text>
              {r.sublabel ? (
                <text
                  x={PAD.left}
                  y={y + 30}
                  className='fill-neutral-500'
                  fontSize='9.5'
                  style={BIDI}
                >
                  {r.sublabel}
                </text>
              ) : null}

              {/* Trilha: o mesmo comprimento em todas as linhas, para a comparação
                  ser exata por construção. */}
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

              {/* Segundo segmento (empilhado), desenhado antes para ficar por baixo */}
              {wExtra > 0 ? (
                <rect
                  x={x0 + wPrincipal}
                  y={y + BAR_Y}
                  width={Math.max(wExtra, 1.5)}
                  height={BAR_H}
                  rx={3}
                  fill={COR.extra}
                  opacity={0.85}
                />
              ) : null}

              {/* A barra. Piso de 2 px: barra de 2,9% ainda tem de ser VISÍVEL —
                  o traço minúsculo é o argumento, sumir dele seria perder a figura. */}
              <rect
                x={x0}
                y={y + BAR_Y}
                width={Math.max(wPrincipal, 2)}
                height={BAR_H}
                rx={3}
                fill={cor}
              />

              <text
                x={xBill}
                y={y + 29}
                textAnchor='end'
                fontSize='14'
                fontWeight='700'
                fill={r.destaque ? COR.destaque : '#e5e5e5'}
                style={BIDI}
              >
                {r.bill}
              </text>
              {r.nota ? (
                <text
                  x={xNota}
                  y={y + 29}
                  textAnchor='end'
                  className='fill-neutral-400'
                  fontSize='10.5'
                  style={BIDI}
                >
                  {r.nota}
                </text>
              ) : null}
            </g>
          );
        })}

        {/* Linha de referência (um teto de memória, um teto de orçamento) */}
        {referencia ? (
          <g>
            <line
              x1={x0 + sx(referencia.valor)}
              y1={PAD.top + 6}
              x2={x0 + sx(referencia.valor)}
              y2={PAD.top + rows.length * ROW_H - 4}
              stroke={COR.referencia}
              strokeWidth={1.5}
              strokeDasharray='4 3'
              opacity={0.7}
            />
            <text
              x={x0 + sx(referencia.valor) + 6}
              y={PAD.top + rows.length * ROW_H + 10}
              className='fill-neutral-400'
              fontSize='9.5'
              style={BIDI}
            >
              {referencia.texto}
            </text>
          </g>
        ) : null}

        {/* Frase-conclusão: a figura circula sozinha e tem de se explicar sozinha */}
        <text
          x={PAD.left}
          y={H - 26}
          fill={COR.destaque}
          fontSize='11.5'
          fontWeight='600'
          style={BIDI}
        >
          {conclusao}
        </text>

        {source ? (
          <text x={PAD.left} y={H - 9} className='fill-neutral-500' fontSize='9' style={BIDI}>
            {source}
          </text>
        ) : null}
      </svg>
    </figure>
  );
}
