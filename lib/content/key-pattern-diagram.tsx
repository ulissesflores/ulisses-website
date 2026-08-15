/**
 * ══════════════════════════════════════════════════════════════════════
 * KeyPatternDiagram — uma escolha não diz nada; a sequência diz
 * ══════════════════════════════════════════════════════════════════════
 *
 * DESTINO NO SITE: `lib/content/key-pattern-diagram.tsx` + registro em
 * `lib/content/mdx-components.tsx`. Texto em `data/key-pattern-diagram.ts`
 * (o `compileMDX` só entrega atributo string — daí `dataset` por id).
 *
 * É a figura MAIS SIMPLES do artigo e a que fecha o raciocínio, nas duas
 * cenas do mesmo componente:
 *
 *   mode="dia" — uma escolha só. O medidor embaixo para no meio: metade das
 *                pessoas faria a mesma coisa por acaso.
 *   mode="mes" — a mesma leitura sobre trinta escolhas. O padrão aparece, e
 *                o medidor sobe.
 *
 * As duas cenas compartilham a geometria inteira (mesma faixa, mesmo
 * medidor, mesmas alturas): a ÚNICA coisa que muda é quantas células a faixa
 * contém. É esse o argumento — não é a escolha que carrega a marca, é a
 * quantidade delas.
 *
 * O medidor é QUALITATIVO e declarado como tal na procedência: não existe
 * número público de confiança por comprimento (a curva está no paper do
 * SynthID-Text, atrás de paywall), e desenhar uma curva inventada num
 * gráfico seria fabricar dado. A posição do marcador vem do dado, não de
 * conta.
 *
 * Nada de aleatório: o padrão do mês é uma string fixa de '1'/'0' no módulo
 * de dados — render idêntico no servidor e no cliente. Numa peça sobre a
 * diferença entre sortear e sortear-com-chave, sortear a figura seria
 * contraditório.
 *
 * Paleta (dataviz da marca, superfície #14191f):
 *   ouro  #a48f65  a escolha que bate com a chave — o DESTAQUE
 *   azul  #60a5fa  a alternativa que serviria igual
 *   cinza #64748b  a escolha que não bate, e o apoio
 */

import { keyPatternDatasets } from '@/data/key-pattern-diagram';

interface KeyPatternDiagramProps {
  /** Chave em `keyPatternDatasets`. */
  dataset: string;
  /** `"dia"` (uma escolha) ou `"mes"` (trinta). */
  mode?: string;
  title: string;
  /** Descrição para leitor de tela — a figura é informativa, não decorativa. */
  description: string;
  /** Procedência, desenhada DENTRO do SVG — a imagem circula sozinha. */
  source?: string;
}

const W = 720;
const H = 330;

/** A faixa das escolhas. Mesma caixa nas duas cenas — só muda quantas
 *  células cabem dentro dela. */
const FAIXA = { x: 24, y: 82, w: 672, h: 76 };
const GAP = 4;

/** O medidor de compatibilidade, abaixo da faixa. */
const MEDIDOR = { x: 24, y: 226, w: 672, h: 14 };

const OURO = '#a48f65';
const OURO_CLARO = '#c4ad7f';

export function KeyPatternDiagram({
  dataset,
  mode = 'dia',
  title,
  description,
  source,
}: KeyPatternDiagramProps) {
  const data = keyPatternDatasets[dataset];
  if (!data) {
    throw new Error(`KeyPatternDiagram: dataset desconhecido "${dataset}"`);
  }
  const cena = mode === 'mes' ? data.mes : data.dia;

  const marcas = [...cena.pattern];
  const n = marcas.length;
  const celulaW = (FAIXA.w - (n - 1) * GAP) / n;
  /** Rótulo dentro da célula só cabe quando há poucas: na cena do mês a
   *  célula tem ~18px e qualquer texto seria cortado em silêncio. */
  const comRotulo = n <= 3;

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
        <text x={24} y={62} className='fill-neutral-400' fontSize='11' fontWeight='700'>
          {cena.badge}
        </text>

        {marcas.map((marca, i) => {
          const bate = marca === '1';
          const x = FAIXA.x + i * (celulaW + GAP);
          return (
            <g key={i}>
              <rect
                x={x}
                y={FAIXA.y}
                width={celulaW}
                height={FAIXA.h}
                rx={comRotulo ? 8 : 3}
                fill={bate ? OURO : 'transparent'}
                fillOpacity={bate ? 0.38 : 0}
                stroke={bate ? OURO : '#64748b'}
                strokeOpacity={bate ? 1 : 0.3}
                strokeWidth={1}
              />
              {comRotulo ? (
                <>
                  <text
                    x={x + celulaW / 2}
                    y={FAIXA.y + 32}
                    textAnchor='middle'
                    fill={bate ? OURO_CLARO : '#cbd5e1'}
                    fontSize='13'
                    fontWeight='700'
                  >
                    {cena.cellLabel}
                  </text>
                  <text
                    x={x + celulaW / 2}
                    y={FAIXA.y + 54}
                    textAnchor='middle'
                    className='fill-neutral-400'
                    fontSize='11'
                  >
                    {cena.cellNote}
                  </text>
                </>
              ) : null}
            </g>
          );
        })}

        {/* ── O medidor: onde esta leitura cai entre acaso e chave ─────── */}
        <text x={MEDIDOR.x} y={MEDIDOR.y - 22} className='fill-neutral-400' fontSize='11'>
          {data.meterAxis}
        </text>
        <rect
          x={MEDIDOR.x}
          y={MEDIDOR.y}
          width={MEDIDOR.w}
          height={MEDIDOR.h}
          rx={7}
          fill='#ffffff'
          fillOpacity={0.05}
          stroke='#ffffff'
          strokeOpacity={0.15}
          strokeWidth={1}
        />
        <rect
          x={MEDIDOR.x}
          y={MEDIDOR.y}
          width={MEDIDOR.w * cena.meter}
          height={MEDIDOR.h}
          rx={7}
          fill={OURO}
          fillOpacity={0.55}
        />
        <line
          x1={MEDIDOR.x + MEDIDOR.w * cena.meter}
          y1={MEDIDOR.y - 9}
          x2={MEDIDOR.x + MEDIDOR.w * cena.meter}
          y2={MEDIDOR.y + MEDIDOR.h + 9}
          stroke={OURO_CLARO}
          strokeWidth={3}
        />
        <text
          x={MEDIDOR.x}
          y={MEDIDOR.y + MEDIDOR.h + 26}
          className='fill-neutral-400'
          fontSize='10'
        >
          {data.meterLow}
        </text>
        <text
          x={MEDIDOR.x + MEDIDOR.w}
          y={MEDIDOR.y + MEDIDOR.h + 26}
          textAnchor='end'
          className='fill-neutral-400'
          fontSize='10'
        >
          {data.meterHigh}
        </text>

        <text x={24} y={H - 40} className='fill-neutral-300' fontSize='11'>
          {cena.caption}
        </text>
        {source ? (
          <text x={24} y={H - 14} className='fill-neutral-500' fontSize='9'>
            {source}
          </text>
        ) : null}
      </svg>
    </figure>
  );
}
