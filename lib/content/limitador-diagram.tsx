/**
 * ══════════════════════════════════════════════════════════════════════
 * LimitadorDiagram — dois carros, o mesmo motor, dois limitadores (SVG puro)
 * ══════════════════════════════════════════════════════════════════════
 *
 * Figura-âncora do `acesso-mythos-5-1`. Cada faixa é um carro: o desenho do carro, o
 * motor (idêntico nas duas, ligado por "o mesmo motor"), e uma pista de aceleração onde o
 * limitador (barra de ouro) corta a aceleração que chega. Depois do limitador a pista fica
 * tracejada: é o que NÃO chega.
 *
 * DUAS CENAS, UMA GEOMETRIA (`PADRAO-ARTIGO.md` §1, degraus 1 e 5):
 *   `analogia` — a faixa só com carro, motor e pista. Nenhum número: a posição do limitador
 *                é qualitativa, e a `source` diz isso dentro do SVG (§5).
 *   `numeros`  — a MESMA faixa, com as mesmas posições, e duas linhas a mais debaixo da
 *                pista: as rodadas (um quadrado por rodada; cheio em ouro = rodada com
 *                trava) e a prova (um círculo por falha plantada; cheio em azul = achada).
 * O leitor reconhece a forma da figura 1 na figura 6: é por isso que carro, motor e pista
 * ficam nos MESMOS offsets em ambas — só a altura do cartão cresce.
 *
 * Cor por ATRIBUTO SVG, nunca por classe do Tailwind (§4.7): ouro #a48f65 = a trava (o que
 * o leitor deve ver primeiro); azul #60a5fa = o que chega; cinza #64748b = o que passou sem
 * trava e o trecho bloqueado. A distinção entre "trava" e "passou" não é só cor: quadrado
 * CHEIO contra VAZADO; limitador é barra grossa e sólida.
 *
 * GEOMETRIA (para o medidor do site, §4.10) — viewBox 720 de largura, esquerda 24, direita 24:
 *   cartão: x 24, w 672, h 104 (analogia) ou 164 (numeros); intervalo entre cartões 34
 *   carro: x 44..128, y +18..+56 · name x 44, y +78 (12 bold) · detail x 44, y +94 (10)
 *   motor: caixa x 170..254, y +22..+58, rótulo centrado (11 bold)
 *   pista: x 290..672, y +34..+48 · rótulo da pista x 290, y +18 (10) · limitador: barra
 *          x = 290 + 382*cut, y +24..+62, rótulo centrado em y +18 (10 bold)
 *   rodadas: rótulo x 290, y +84 (10) · quadrados 20x20, passo 28, y +92
 *   prova: rótulo x 290, y +132 (10) · círculos r 7, passo 28, cy +146
 *   "o mesmo motor": pílula 128x20 centrada em x 212, no intervalo entre os cartões (10 bold)
 *   conclusão: x 24, 12 px, linhas de 16 · source: x 24, 9 px, H-12
 *
 * Texto por props e pelo dataset (o `compileMDX` só entrega atributo string).
 * Procedência DENTRO do SVG: a imagem circula sem o texto.
 */

import { limitadorDatasets } from '@/data/artigos-charts';

interface LimitadorDiagramProps {
  /** Chave em `limitadorDatasets`. */
  dataset: string;
  title: string;
  subtitle?: string;
  /** Descrição para leitor de tela — a figura é informativa, não decorativa. */
  description: string;
  /** Procedência, desenhada DENTRO do SVG. */
  source?: string;
}

const W = 720;
const LEFT = 24;
const CARD_W = W - 2 * LEFT; // 672
const CARD_GAP = 34;
const CARD_H = { analogia: 104, numeros: 164 } as const;
const TRACK_X = 290;
const TRACK_W = 382;
const ENGINE = { x: 170, w: 84, y: 22, h: 36 };
const SQ = 20;
const STEP = 28;

const OURO = '#a48f65';
const OURO_CLARO = '#c4ad7f';
const AZUL = '#60a5fa';
const CINZA = '#64748b';
const BRANCO = '#ffffff';
const TEXTO = '#e5e5e5';
const APOIO = '#a3a3a3';
const FRACO = '#737373';

/** Carro de perfil, em linha: corpo, vidro e duas rodas. Origem no canto superior esquerdo. */
function Carro({ x, y }: { x: number; y: number }) {
  return (
    <g transform={`translate(${x} ${y})`} fill='none' stroke={APOIO} strokeWidth={1.5}>
      <path
        d='M2 28 L2 22 Q2 18 7 17 L24 15 L34 4 Q36 2 40 2 L60 2 Q64 2 66 5 L74 16 L79 19 Q83 20 83 25 L83 28 Z'
        fill='#ffffff0d'
        strokeLinejoin='round'
      />
      <path d='M30 15 L38 6 L50 6 L50 15 Z M54 15 L54 6 L61 6 L67 15 Z' />
      <circle cx={20} cy={29} r={7} fill='#14191f' />
      <circle cx={64} cy={29} r={7} fill='#14191f' />
    </g>
  );
}

export function LimitadorDiagram({
  dataset,
  title,
  subtitle,
  description,
  source,
}: LimitadorDiagramProps) {
  const data = limitadorDatasets[dataset];
  if (!data) {
    throw new Error(`LimitadorDiagram: dataset desconhecido "${dataset}"`);
  }
  const { mode, lanes, conclusion } = data;
  const cardH = CARD_H[mode];
  const top0 = subtitle ? 56 : 44;
  const tops = lanes.map((_, i) => top0 + i * (cardH + CARD_GAP));
  const yFim = tops[lanes.length - 1] + cardH;
  const yConclusao = yFim + 30;
  const H = yConclusao + conclusion.length * 16 + (source ? 24 : 12);
  const pillCx = ENGINE.x + ENGINE.w / 2;
  const yGap = tops[0] + cardH + CARD_GAP / 2;

  return (
    <figure className='my-10 not-prose'>
      <svg
        viewBox={`0 0 ${W} ${H}`}
        className='w-full h-auto rounded-lg border border-white/10 bg-neutral-900/60 font-chart'
        role='img'
        aria-label={description}
      >
        <title>{description}</title>

        <text x={LEFT} y={24} fill={BRANCO} fontSize='15' fontWeight='700'>
          {title}
        </text>
        {subtitle ? (
          <text x={LEFT} y={40} fill={APOIO} fontSize='11'>
            {subtitle}
          </text>
        ) : null}

        {lanes.map((lane, i) => {
          const t = tops[i];
          const limX = TRACK_X + TRACK_W * lane.cut;
          return (
            <g key={lane.name}>
              <rect
                x={LEFT}
                y={t}
                width={CARD_W}
                height={cardH}
                rx={8}
                fill='#ffffff0d'
                stroke='#ffffff26'
                strokeWidth={1}
              />
              <Carro x={44} y={t + 18} />
              <text x={44} y={t + 78} fill={BRANCO} fontSize='12' fontWeight='700'>
                {lane.name}
              </text>
              <text x={44} y={t + 94} fill={APOIO} fontSize='10'>
                {lane.detail}
              </text>

              <rect
                x={ENGINE.x}
                y={t + ENGINE.y}
                width={ENGINE.w}
                height={ENGINE.h}
                rx={6}
                fill='#ffffff14'
                stroke={APOIO}
                strokeWidth={1.5}
              />
              <text
                x={ENGINE.x + ENGINE.w / 2}
                y={t + ENGINE.y + 22}
                textAnchor='middle'
                fill={BRANCO}
                fontSize='11'
                fontWeight='700'
              >
                {data.motor}
              </text>
              <line
                x1={ENGINE.x + ENGINE.w}
                y1={t + 41}
                x2={TRACK_X - 6}
                y2={t + 41}
                stroke={CINZA}
                strokeWidth={1.5}
              />
              <path d={`M${TRACK_X - 6} ${t + 37} L${TRACK_X} ${t + 41} L${TRACK_X - 6} ${t + 45} Z`} fill={CINZA} />

              <text x={TRACK_X} y={t + 18} fill={APOIO} fontSize='10'>
                {data.pista}
              </text>
              <rect
                x={TRACK_X}
                y={t + 34}
                width={limX - TRACK_X}
                height={14}
                rx={3}
                fill={AZUL}
              />
              <rect
                x={limX}
                y={t + 34}
                width={TRACK_X + TRACK_W - limX}
                height={14}
                rx={3}
                fill='none'
                stroke={CINZA}
                strokeWidth={1.5}
                strokeDasharray='4 3'
              />
              <rect x={limX - 2.5} y={t + 24} width={5} height={38} rx={1.5} fill={OURO} />
              <text
                x={limX}
                y={t + 18}
                textAnchor='middle'
                fill={OURO_CLARO}
                fontSize='10'
                fontWeight='700'
              >
                {data.limitador}
              </text>

              {lane.rounds ? (
                <g>
                  <text x={TRACK_X} y={t + 84} fill={TEXTO} fontSize='10'>
                    {lane.rounds.label}
                  </text>
                  {Array.from({ length: lane.rounds.total }, (_, k) => (
                    <rect
                      key={k}
                      x={TRACK_X + k * STEP}
                      y={t + 92}
                      width={SQ}
                      height={SQ}
                      rx={3}
                      fill={k < lane.rounds!.cuts ? OURO : 'none'}
                      stroke={k < lane.rounds!.cuts ? OURO : CINZA}
                      strokeWidth={1.5}
                    />
                  ))}
                </g>
              ) : null}
              {lane.proof ? (
                <g>
                  <text x={TRACK_X} y={t + 132} fill={TEXTO} fontSize='10'>
                    {lane.proof.label}
                  </text>
                  {Array.from({ length: lane.proof.total }, (_, k) => (
                    <circle
                      key={k}
                      cx={TRACK_X + 7 + k * STEP}
                      cy={t + 146}
                      r={7}
                      fill={k < lane.proof!.found ? AZUL : 'none'}
                      stroke={k < lane.proof!.found ? AZUL : CINZA}
                      strokeWidth={1.5}
                    />
                  ))}
                </g>
              ) : null}
            </g>
          );
        })}

        {/* O mesmo motor: liga as duas caixas pelo intervalo entre os cartões. */}
        <line
          x1={pillCx}
          y1={tops[0] + ENGINE.y + ENGINE.h}
          x2={pillCx}
          y2={yGap - 10}
          stroke={APOIO}
          strokeWidth={1.5}
        />
        <line
          x1={pillCx}
          y1={yGap + 10}
          x2={pillCx}
          y2={tops[1] + ENGINE.y}
          stroke={APOIO}
          strokeWidth={1.5}
        />
        <rect x={pillCx - 64} y={yGap - 10} width={128} height={20} rx={10} fill='#14191f' stroke={APOIO} strokeWidth={1.5} />
        <text x={pillCx} y={yGap + 4} textAnchor='middle' fill={BRANCO} fontSize='10' fontWeight='700'>
          {data.igual}
        </text>

        {conclusion.map((linha, k) => (
          <text key={linha} x={LEFT} y={yConclusao + k * 16} fill={TEXTO} fontSize='12'>
            {linha}
          </text>
        ))}

        {source ? (
          <text x={LEFT} y={H - 12} fill={FRACO} fontSize='9'>
            {source}
          </text>
        ) : null}
      </svg>
    </figure>
  );
}
