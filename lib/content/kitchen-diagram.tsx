/**
 * ══════════════════════════════════════════════════════════════════════
 * KitchenDiagram — a cozinha: o que é fixo, o que cresce, o que não muda
 * ══════════════════════════════════════════════════════════════════════
 *
 * DESTINO NO SITE: `lib/content/kitchen-diagram.tsx` + registro em
 * `lib/content/mdx-components.tsx`. Os rótulos vêm de
 * `data/kitchen-diagram.ts` (o `compileMDX` só entrega atributo string —
 * daí o `dataset` por id, como em `WaffleChart`/`CountryBarsChart`).
 *
 * A MESMA FIGURA APARECE DUAS VEZES no artigo, e isso é o método virando
 * imagem: `mode="plain"` no primeiro andar (só nomes de cozinha) e
 * `mode="labeled"` no segundo (a mesma cena com as etiquetas técnicas
 * coladas por cima). Por isso a geometria é constante de módulo e o
 * `mode` NÃO entra em nenhum cálculo de posição: as etiquetas são uma
 * camada a mais, nunca um desenho diferente. Se um dia alguém precisar
 * mexer no layout, mexe uma vez e vale para os dois.
 *
 * Nada de aleatório: blocos e pontos saem de índice, para o render ser
 * idêntico no servidor e no cliente (mesmo motivo do TvChannelsDiagram).
 *
 * Paleta (dataviz da marca, lote 7, superfície #14191f) escolhida para
 * casar com os gráficos do mesmo artigo — o leitor carrega a cor da
 * ilustração para dentro do gráfico:
 *   cinza #64748b = despensa  -> mesma cor da parcela "pesos" na anatomia
 *   azul  #60a5fa = bancada   -> mesma cor da parcela "cache"
 *   âmbar #fbbf24 = panela    -> a atenção linear, que não aparece lá
 * Identidade nunca é só-cor: toda forma tem nome escrito ao lado.
 */

import { kitchenDatasets, type KitchenPiece } from '@/data/kitchen-diagram';

interface KitchenDiagramProps {
  /** Chave em `kitchenDatasets`. */
  dataset: string;
  /** `"plain"` (só cozinha) ou `"labeled"` (mesma cena + etiquetas técnicas). */
  mode?: string;
  title: string;
  /** Descrição para leitor de tela — a figura é informativa, não decorativa. */
  description: string;
  /** Procedência, desenhada DENTRO do SVG — a imagem circula sozinha. */
  source?: string;
}

const W = 760;
const H = 470;
const KITCHEN = { x: 24, y: 44, w: 712, h: 386 };

/** Faixa vertical das três formas. Uma só, para os dois modos. */
const BAND = { top: 136, h: 164 };

/** Colunas: despensa | bancada | panela. */
const COL = {
  pantry: { x: 48, w: 166 },
  counter: { x: 246, w: 314 },
  pot: { x: 592, w: 120 },
};

/** Linhas de base da legenda sob cada forma. */
const CAP = { name: 348, note: 364, note2: 378, tagTop: 386, tagNote: 414 };

const COR = { pantry: '#64748b', counter: '#60a5fa', pot: '#fbbf24' };

/** Cor do TEXTO da etiqueta. Igual à da forma, exceto no cinza: #64748b sobre
 *  #14191f mede 3,7:1 — passa como forma, reprova como texto de 10px. O traço
 *  da pílula continua no cinza, então o código de cor sobrevive intacto. */
const COR_TEXTO = { pantry: '#cbd5e1', counter: COR.counter, pot: COR.pot };

const TAG_H = 20;

/** O SVG não mede texto: a pílula é dimensionada por contagem de caracteres.
 *  Os coeficientes são MEDIDOS na fonte que o site realmente usa (Fahkwang Bold,
 *  10px, via `font-chart`), não estimados: as cinco etiquetas em pt-br medem entre
 *  5,68 e 6,60 px por caractere. `6` + 22 de folga deixa 8-15 px de respiro de cada
 *  lado em todas elas. Chutar por uma fonte mais estreita rende pílula colada no
 *  texto — foi o que aconteceu na primeira versão.
 *  Orçamento por vaga (medidor: `checar-kitchen.py`, no mesmo diretório). */
function larguraEtiqueta(texto: string) {
  return Math.round(texto.length * 6) + 22;
}

function Etiqueta({
  x,
  top,
  texto,
  cor,
  corTexto,
  ancora = 'middle',
}: {
  x: number;
  top: number;
  texto: string;
  /** Cor do traço da pílula — é ela que carrega o código de cor. */
  cor: string;
  corTexto?: string;
  ancora?: 'start' | 'middle' | 'end';
}) {
  const w = larguraEtiqueta(texto);
  const esq = ancora === 'middle' ? x - w / 2 : ancora === 'end' ? x - w : x;
  return (
    <g>
      <rect
        x={esq}
        y={top}
        width={w}
        height={TAG_H}
        rx={TAG_H / 2}
        fill='rgba(255,255,255,0.06)'
        stroke={cor}
        strokeWidth={1}
      />
      <text
        x={esq + w / 2}
        y={top + 14}
        fill={corTexto ?? cor}
        fontSize='10'
        fontWeight='700'
        textAnchor='middle'
      >
        {texto}
      </text>
    </g>
  );
}

/** Legenda de uma forma: nome e comportamento nos dois modos; etiqueta técnica só no `labeled`. */
function Legenda({
  cx,
  peca,
  cor,
  corTexto,
  etiquetado,
}: {
  cx: number;
  peca: KitchenPiece;
  cor: string;
  corTexto: string;
  etiquetado: boolean;
}) {
  return (
    <g>
      <text x={cx} y={CAP.name} className='fill-white' fontSize='13' fontWeight='700' textAnchor='middle'>
        {peca.name}
      </text>
      <text x={cx} y={CAP.note} className='fill-neutral-400' fontSize='10' textAnchor='middle'>
        {peca.note}
      </text>
      {peca.note2 ? (
        <text x={cx} y={CAP.note2} className='fill-neutral-400' fontSize='10' textAnchor='middle'>
          {peca.note2}
        </text>
      ) : null}
      {etiquetado ? (
        <>
          <Etiqueta x={cx} top={CAP.tagTop} texto={peca.tag} cor={cor} corTexto={corTexto} />
          {peca.tagNote ? (
            <text x={cx} y={CAP.tagNote} fill={corTexto} fontSize='9.5' textAnchor='middle' opacity={0.85}>
              {peca.tagNote}
            </text>
          ) : null}
        </>
      ) : null}
    </g>
  );
}

/** Despensa: prateleiras CHEIAS de ponta a ponta — bloco maciço, tamanho constante.
 *  Barras inteiras de propósito: se fossem potes contáveis, o leitor tentaria
 *  contá-los e o waffle das 64 camadas, logo abaixo no artigo, perderia a força. */
function Despensa() {
  const { x, w } = COL.pantry;
  const prateleiras: React.ReactNode[] = [];
  for (let linha = 0; linha < 4; linha += 1) {
    prateleiras.push(
      <rect
        key={linha}
        x={x + 12}
        y={BAND.top + 12 + linha * 37}
        width={w - 24}
        height={29}
        rx={3}
        fill={COR.pantry}
        opacity={0.62}
      />
    );
  }
  return (
    <g>
      <rect
        x={x}
        y={BAND.top}
        width={w}
        height={BAND.h}
        rx={8}
        fill='rgba(100,116,139,0.14)'
        stroke={COR.pantry}
        strokeWidth={1.5}
      />
      {prateleiras}
    </g>
  );
}

/** Bancada: 32 lugares, 13 já ocupados — enche da esquerda para a direita. */
function Bancada({ ocupados = 13 }: { ocupados?: number }) {
  const { x, w } = COL.counter;
  const cols = 8;
  const linhas = 4;
  const celW = (w - 20) / cols;
  const celH = (BAND.h - 20) / linhas;
  const blocos: React.ReactNode[] = [];
  for (let i = 0; i < cols * linhas; i += 1) {
    const cheio = i < ocupados;
    blocos.push(
      <rect
        key={i}
        x={x + 10 + (i % cols) * celW + 3}
        y={BAND.top + 10 + Math.floor(i / cols) * celH + 3}
        width={celW - 6}
        height={celH - 6}
        rx={3}
        fill={cheio ? COR.counter : 'rgba(96,165,250,0.05)'}
        opacity={cheio ? 0.85 : 1}
        stroke={cheio ? 'none' : 'rgba(96,165,250,0.3)'}
        strokeDasharray={cheio ? undefined : '3 3'}
      />
    );
  }
  return (
    <g>
      <rect
        x={x}
        y={BAND.top}
        width={w}
        height={BAND.h}
        rx={8}
        fill='rgba(255,255,255,0.03)'
        stroke='rgba(96,165,250,0.55)'
        strokeWidth={1.5}
      />
      {blocos}
    </g>
  );
}

/** Panela de caldo: mesmo diâmetro sempre, por mais que entre. */
function Panela() {
  const cx = COL.pot.x + COL.pot.w / 2;
  const cy = BAND.top + BAND.h / 2;
  return (
    <g>
      <circle cx={cx} cy={cy} r={52} fill='rgba(251,191,36,0.16)' stroke={COR.pot} strokeWidth={2} />
      <circle cx={cx} cy={cy} r={36} fill='none' stroke={COR.pot} strokeWidth={1} opacity={0.55} />
      <circle cx={cx} cy={cy} r={20} fill={COR.pot} opacity={0.4} />
    </g>
  );
}

export function KitchenDiagram({ dataset, mode = 'plain', title, description, source }: KitchenDiagramProps) {
  const data = kitchenDatasets[dataset];
  if (!data) {
    throw new Error(`KitchenDiagram: dataset desconhecido "${dataset}"`);
  }
  const etiquetado = mode === 'labeled';
  // Duas instâncias convivem na mesma página (plain + labeled): id único por modo.
  const ponta = `kd-ponta-${etiquetado ? 'labeled' : 'plain'}`;

  const cCounter = COL.counter.x + COL.counter.w / 2;
  const fimBancada = COL.counter.x + COL.counter.w;

  const fluxo: React.ReactNode[] = [];
  for (let i = 0; i < 11; i += 1) {
    fluxo.push(
      <circle key={i} cx={COL.counter.x + 6 + i * 26} cy={122} r={3} fill={COR.counter} opacity={0.55} />
    );
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
        <defs>
          <marker id={ponta} markerWidth='8' markerHeight='8' refX='7' refY='4' orient='auto'>
            <path d='M0,0 L8,4 L0,8 z' fill={COR.counter} />
          </marker>
        </defs>

        <text x={KITCHEN.x} y={26} className='fill-white' fontSize='15' fontWeight='700'>
          {title}
        </text>

        {/* ───────────── O espaço total: tudo tem de caber aqui dentro ───────────── */}
        <rect
          x={KITCHEN.x}
          y={KITCHEN.y}
          width={KITCHEN.w}
          height={KITCHEN.h}
          rx={12}
          fill='rgba(255,255,255,0.02)'
          stroke='rgba(255,255,255,0.28)'
          strokeWidth={1.5}
        />
        <text x={KITCHEN.x + 16} y={68} className='fill-neutral-300' fontSize='12' fontWeight='700'>
          {data.kitchen.name}
        </text>
        <text x={KITCHEN.x + 16} y={84} className='fill-neutral-500' fontSize='10'>
          {data.kitchen.note}
        </text>
        {etiquetado ? (
          <Etiqueta
            x={KITCHEN.x + KITCHEN.w - 24}
            top={58}
            texto={data.kitchen.tag}
            cor='#d4d4d8'
            ancora='end'
          />
        ) : null}

        {/* ───────────── O que entra, um pedaço por vez ───────────── */}
        <text x={COL.counter.x} y={106} className='fill-neutral-400' fontSize='10'>
          {data.inflow.name}
        </text>
        {etiquetado ? (
          <Etiqueta x={fimBancada} top={92} texto={data.inflow.tag} cor={COR.counter} ancora='end' />
        ) : null}
        <line
          x1={COL.counter.x}
          y1={122}
          x2={fimBancada - 8}
          y2={122}
          stroke={COR.counter}
          strokeWidth='1.2'
          opacity={0.5}
          markerEnd={`url(#${ponta})`}
        />
        {fluxo}

        {/* ───────────── As três formas: geometria idêntica nos dois modos ───────────── */}
        <Despensa />
        <Bancada />
        <Panela />

        {/* Só a bancada tem direção: as outras duas não se mexem. */}
        <line
          x1={COL.counter.x}
          y1={312}
          x2={fimBancada - 8}
          y2={312}
          stroke={COR.counter}
          strokeWidth='1.4'
          markerEnd={`url(#${ponta})`}
        />
        <text x={cCounter} y={328} fill={COR.counter} fontSize='9.5' textAnchor='middle'>
          {data.growth}
        </text>

        <Legenda
          cx={COL.pantry.x + COL.pantry.w / 2}
          peca={data.pantry}
          cor={COR.pantry}
          corTexto={COR_TEXTO.pantry}
          etiquetado={etiquetado}
        />
        <Legenda
          cx={cCounter}
          peca={data.counter}
          cor={COR.counter}
          corTexto={COR_TEXTO.counter}
          etiquetado={etiquetado}
        />
        <Legenda
          cx={COL.pot.x + COL.pot.w / 2}
          peca={data.pot}
          cor={COR.pot}
          corTexto={COR_TEXTO.pot}
          etiquetado={etiquetado}
        />

        {source ? (
          <text x={KITCHEN.x} y={H - 14} className='fill-neutral-500' fontSize='9'>
            {source}
          </text>
        ) : null}
      </svg>
    </figure>
  );
}
