/**
 * ══════════════════════════════════════════════════════════════════════
 * ObligationMatrix — o que cada bloco de pedidos obriga, marcador por marcador
 * ══════════════════════════════════════════════════════════════════════
 *
 * SVG puro, sem lib de gráficos. Cada linha é um bloco de pedidos de um documento;
 * cada coluna é UM marcador de compromisso procurado dentro daquele bloco (cifra,
 * prazo, verbo que obriga, quem responde, alvo verificável).
 *
 * A figura existe para sustentar uma ASSERÇÃO DE AUSÊNCIA, e asserção de ausência só
 * vale com duas coisas que estão desenhadas AQUI DENTRO, não só na prosa:
 *
 *   1. O espaço de busca ENUMERADO — as colunas. O leitor vê o que foi procurado, e
 *      pode discordar da lista. "Não achei nada" sem a lista não é medida, é opinião.
 *   2. Um CONTROLE POSITIVO — a última linha, separada por régua tracejada: outro
 *      documento, da mesma editora, sobre o mesmo assunto, onde a régua ACENDE. Ele
 *      acende três das cinco colunas e apaga duas, de propósito: controle que acende
 *      tudo não calibra nada.
 *
 * A quarentena do controle é visual E textual — a régua o separa e o rótulo dele diz
 * o documento e a data. Um número do controle lido como se fosse do documento medido
 * é o erro que essa dupla trava existe para impedir.
 *
 * Três estados por célula, e a diferença entre eles é o que torna a figura defensável:
 * `ausente` (o marcador não aparece), `parcial` (um componente genuíno do marcador
 * aparece e o resto falta — a célula ganha um micro-rótulo dizendo O QUE falta) e
 * `presente` (aparece, com o verbatim no micro-rótulo). Sem o estado `parcial` a
 * matriz vira acusação em vez de medida.
 *
 * As marcas são SHAPES, não glifos: `—`, `◐` e `●` como texto dependeriam de a fonte
 * do site ter esses pontos de código. Fahkwang não tem U+25D0; o browser cairia num
 * fallback e o medidor de rótulos mediria `.notdef` — divergência silenciosa, que é
 * exatamente a classe de falha que o medidor existe para pegar.
 *
 * Texto por props e pelo dataset do locale; a estrutura via `dataset` em
 * `data/obligation-matrix.ts` (o `compileMDX` só entrega atributo string).
 * Procedência desenhada DENTRO do SVG: a imagem circula sem o texto.
 */

import { obligationMatrixDatasets, type ObligationEstado } from '@/data/obligation-matrix';

interface ObligationMatrixProps {
  /** Chave em `obligationMatrixDatasets` — um dataset por locale (é tudo texto). */
  dataset: string;
  title: string;
  subtitle?: string;
  /** Descrição para leitor de tela — a figura é informativa, não decorativa. */
  description: string;
  /** Procedência, dentro do SVG. */
  source?: string;
}

const W = 760;
const PAD = { top: 96, right: 8, bottom: 10, left: 8 };
const COL_ROTULO = 236; // número do bloco + destinatário + volume de pedidos
const COL_W = (W - PAD.left - PAD.right - COL_ROTULO) / 5;
const X0 = PAD.left + COL_ROTULO;
const ROW_H = 52;
const GAP_CONTROLE = 14; // respiro da régua tracejada que põe o controle em quarentena
const R_MARCA = 7;

/**
 * `direction: 'ltr'` no `<svg>` conserta a GEOMETRIA sob o `dir="rtl"` do corpo hebraico,
 * mas quebra a ORDEM de qualquer string que misture hebraico com latino ou número: com
 * base LTR, "חברות AI בחזית" é desenhado "בחזית AI חברות". Medido nesta figura (o
 * subtítulo e três rótulos do dataset `-he` saíram invertidos no primeiro render).
 *
 * `unicode-bidi: plaintext` faz cada `<text>` inferir a base do PRIMEIRO caractere forte
 * dele: o hebraico volta a ordenar RTL, o latino segue LTR, e a âncora `x` continua onde
 * o projeto a pôs — medido lado a lado contra um `<div dir="rtl">` de referência. Não é
 * herdado, então vai em cada `<text>`.
 */
const BIDI = { unicodeBidi: 'plaintext' } as const;

const COR = {
  ausente: '#525252',
  parcial: '#fbbf24',
  presente: '#4ade80',
  regua: '#ffffff1a',
};

/** Onde o texto de uma linha começa: o controle não tem número, então não recua. */
const xTexto = (controle?: boolean) => (controle ? PAD.left : PAD.left + 30);

/**
 * Posiciona os três itens da legenda em linha, acumulando a largura estimada de cada
 * um (~5,1 px por caractere a 10 px — o SVG não mede texto).
 *
 * ponytail: terceira cópia desta estimativa (as outras em `vram-ladder.tsx` e no
 * medidor `scripts/charts/checar-rotulos-svg.py`). Fica duplicada de propósito: unificar
 * exigiria editar um componente já publicado e o espelho em Python no mesmo passo, e a
 * divergência entre as cópias não é silenciosa — o medidor confere as três contra a
 * fonte real. Converger quando alguma delas precisar mudar.
 */
function itensLegenda(legenda: { ausente: string; parcial: string; presente: string }) {
  let x = PAD.left;
  return (['ausente', 'parcial', 'presente'] as const).map((estado) => {
    const item = { estado, texto: legenda[estado], x };
    x += 15 + legenda[estado].length * 5.1 + 22;
    return item;
  });
}

/** A marca da célula, em geometria: traço (ausente), meia-lua (parcial), disco (presente). */
function Marca({ estado, cx, cy }: { estado: ObligationEstado; cx: number; cy: number }) {
  if (estado === 'ausente') {
    return (
      <line
        x1={cx - R_MARCA}
        y1={cy}
        x2={cx + R_MARCA}
        y2={cy}
        stroke={COR.ausente}
        strokeWidth={2}
        strokeLinecap='round'
      />
    );
  }
  if (estado === 'presente') {
    return <circle cx={cx} cy={cy} r={R_MARCA} fill={COR.presente} />;
  }
  // Parcial: o disco só até a metade, com o contorno inteiro para a metade vazia ainda
  // se ler como parte da mesma marca.
  return (
    <g>
      <circle cx={cx} cy={cy} r={R_MARCA} fill='none' stroke={COR.parcial} strokeWidth={1.5} />
      <path
        d={`M ${cx} ${cy - R_MARCA} A ${R_MARCA} ${R_MARCA} 0 0 0 ${cx} ${cy + R_MARCA} Z`}
        fill={COR.parcial}
      />
    </g>
  );
}

export function ObligationMatrix({
  dataset,
  title,
  subtitle,
  description,
  source,
}: ObligationMatrixProps) {
  const data = obligationMatrixDatasets[dataset];
  if (!data) {
    throw new Error(`ObligationMatrix: dataset desconhecido "${dataset}"`);
  }
  const { colunas, linhas, legenda, conclusao } = data;

  const medidas = linhas.filter((l) => !l.controle);
  const controle = linhas.find((l) => l.controle);
  const yControle = PAD.top + medidas.length * ROW_H + GAP_CONTROLE;
  const yLegenda = yControle + (controle ? ROW_H : 0) + 22;
  const yConclusao = yLegenda + 26;
  const H = yConclusao + conclusao.length * 15 + (source ? 18 : 0) + PAD.bottom;

  /** Uma linha da matriz: rótulo à esquerda, uma marca por coluna. */
  const Linha = (l: (typeof linhas)[number], y: number) => (
    <g key={l.numero || 'controle'}>
      {l.numero ? (
        <text
          x={PAD.left}
          y={y + 19}
          className='fill-neutral-600'
          fontSize='14'
          fontWeight='700'
          style={BIDI}
        >
          {l.numero}
        </text>
      ) : null}
      {l.destinatario.map((linha, k) => (
        <text
          key={linha}
          x={xTexto(l.controle)}
          y={y + 16 + k * 12}
          className={l.controle ? 'fill-neutral-500' : 'fill-neutral-200'}
          fontSize={l.controle ? '9.5' : '11'}
          style={BIDI}
        >
          {linha}
        </text>
      ))}
      {l.volume ? (
        <text
          x={xTexto(l.controle)}
          y={y + 41}
          className='fill-neutral-500'
          fontSize='9'
          style={BIDI}
        >
          {l.volume}
        </text>
      ) : null}

      {l.celulas.map((celula, c) => {
        const cx = X0 + (c + 0.5) * COL_W;
        return (
          <g key={colunas[c].join(' ')}>
            <Marca estado={celula.estado} cx={cx} cy={y + 18} />
            {(celula.nota ?? []).map((nota, k) => (
              <text
                key={nota}
                x={cx}
                y={y + 32 + k * 9}
                textAnchor='middle'
                fontSize='8'
                fill={celula.estado === 'parcial' ? COR.parcial : COR.presente}
                style={BIDI}
              >
                {nota}
              </text>
            ))}
          </g>
        );
      })}
    </g>
  );

  return (
    <figure className='my-10 not-prose'>
      <svg
        viewBox={`0 0 ${W} ${H}`}
        className='w-full h-auto rounded-lg border border-white/10 bg-neutral-900/60 font-chart'
        /* O corpo em hebraico é envolto em dir="rtl" pelo mdx-components, e o SVG herda:
           com direction rtl, cada <text> de âncora `start` cresce para a ESQUERDA e sai
           da moldura. A geometria da matriz é LTR em toda língua; a ORDEM de cada texto
           volta ao certo pelo `unicode-bidi: plaintext` de BIDI, acima. */
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

        {/* Cabeçalho das colunas: o espaço de busca, enumerado. */}
        {colunas.map((coluna, c) =>
          coluna.map((linha, k) => (
            <text
              key={`${c}-${linha}`}
              x={X0 + (c + 0.5) * COL_W}
              y={70 + k * 11}
              textAnchor='middle'
              className='fill-neutral-400'
              fontSize='9.5'
              style={BIDI}
            >
              {linha}
            </text>
          )),
        )}
        <line x1={PAD.left} y1={88} x2={W - PAD.right} y2={88} stroke={COR.regua} strokeWidth={1} />

        {medidas.map((l, i) => Linha(l, PAD.top + i * ROW_H))}

        {/* Régua tracejada: o controle é outro documento e não pode ser lido como
            mais uma linha da tabela. */}
        {controle ? (
          <>
            <line
              x1={PAD.left}
              y1={yControle - 8}
              x2={W - PAD.right}
              y2={yControle - 8}
              stroke={COR.regua}
              strokeWidth={1}
              strokeDasharray='4 4'
            />
            {Linha(controle, yControle)}
          </>
        ) : null}

        {itensLegenda(legenda).map((item) => (
          <g key={item.texto}>
            <Marca estado={item.estado} cx={item.x + 7} cy={yLegenda - 4} />
            <text
              x={item.x + 15 + 7}
              y={yLegenda}
              className='fill-neutral-400'
              fontSize='10'
              style={BIDI}
            >
              {item.texto}
            </text>
          </g>
        ))}

        {conclusao.map((linha, k) => (
          <text
            key={linha}
            x={PAD.left}
            y={yConclusao + k * 15}
            className='fill-neutral-200'
            fontSize='11'
            style={BIDI}
          >
            {linha}
          </text>
        ))}

        {source ? (
          <text
            x={PAD.left}
            y={H - PAD.bottom}
            className='fill-neutral-500'
            fontSize='9'
            style={BIDI}
          >
            {source}
          </text>
        ) : null}
      </svg>
    </figure>
  );
}
