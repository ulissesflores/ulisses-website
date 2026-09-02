/**
 * ══════════════════════════════════════════════════════════════════════
 * ThermometerTrioDiagram — três termômetros lado a lado, em SVG puro
 * ══════════════════════════════════════════════════════════════════════
 *
 * Figura-âncora do `ia-mercado-de-trabalho`: previsão / exposição / medição.
 * Mesma geometria nas duas cenas (mundo e Brasil) — o degrau 5 da escada
 * retoma o degrau 1 por construção (`PADRAO-ARTIGO.md` §1). Um termômetro
 * pode ser `vazio`: tracejado em ouro, sem preenchimento — é a lacuna que o
 * artigo denuncia, desenhada como lacuna (dado que não existe não vira
 * gráfico; posição qualitativa declarada na procedência).
 *
 * Níveis dos tubos são ILUSTRATIVOS (declarado na `source` da invocação);
 * os números vivem nos rótulos, todos de primária reconferida.
 *
 * Texto por props; conteúdo via `dataset` em `data/thermometer-trio-diagram.ts`
 * (o `compileMDX` só entrega atributo string).
 */

import { thermometerTrioDatasets } from '@/data/thermometer-trio-diagram';

interface ThermometerTrioDiagramProps {
  /** Chave em `thermometerTrioDatasets`. */
  dataset: string;
  title: string;
  subtitle?: string;
  /** Descrição para leitor de tela — a figura é informativa, não decorativa. */
  description: string;
  /** Procedência, desenhada DENTRO do SVG — a imagem circula sozinha. */
  source?: string;
}

const W = 720;
const H = 312;
const COLS = [144, 360, 576] as const;
const TUBE = { w: 28, top: 100, h: 90 };
const BULB_R = 16;
const BULB_CY = TUBE.top + TUBE.h + 12;

export function ThermometerTrioDiagram({
  dataset,
  title,
  subtitle,
  description,
  source,
}: ThermometerTrioDiagramProps) {
  const data = thermometerTrioDatasets[dataset];
  if (!data) {
    throw new Error(`ThermometerTrioDiagram: dataset desconhecido "${dataset}"`);
  }
  if (data.termometros.length !== COLS.length) {
    throw new Error(
      `ThermometerTrioDiagram: esperados ${COLS.length} termômetros, vieram ${data.termometros.length}`
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

        <text x={24} y={24} className='fill-white' fontSize='15' fontWeight='700'>
          {title}
        </text>
        {subtitle ? (
          <text x={24} y={40} className='fill-neutral-400' fontSize='11'>
            {subtitle}
          </text>
        ) : null}

        {data.termometros.map((t, i) => {
          const cx = COLS[i];
          const tubeX = cx - TUBE.w / 2;
          const nivel = t.nivel;
          const fillH = !t.vazio && nivel !== undefined ? TUBE.h * nivel : 0;

          return (
            <g key={t.nome}>
              <text
                x={cx}
                y={70}
                textAnchor='middle'
                className='fill-white'
                fontSize='12'
                fontWeight='700'
                letterSpacing='0.06em'
              >
                {t.nome}
              </text>
              <text
                x={cx}
                y={86}
                textAnchor='middle'
                className='fill-neutral-400'
                fontSize='10'
              >
                {t.pergunta}
              </text>

              {/* tubo */}
              <rect
                x={tubeX}
                y={TUBE.top}
                width={TUBE.w}
                height={TUBE.h}
                rx={8}
                fill={t.vazio ? 'none' : 'rgba(255,255,255,.05)'}
                stroke={t.vazio ? '#c4ad7f' : 'rgba(255,255,255,.15)'}
                strokeWidth={1.5}
                strokeDasharray={t.vazio ? '5 4' : undefined}
              />
              {fillH > 0 ? (
                <rect
                  x={tubeX + 4}
                  y={TUBE.top + TUBE.h - fillH}
                  width={TUBE.w - 8}
                  height={fillH}
                  rx={4}
                  fill={t.cor}
                />
              ) : null}

              {/* bulbo */}
              <circle
                cx={cx}
                cy={BULB_CY}
                r={BULB_R}
                fill={t.vazio ? 'none' : t.cor}
                stroke={t.vazio ? '#c4ad7f' : 'none'}
                strokeWidth={t.vazio ? 1.5 : 0}
                strokeDasharray={t.vazio ? '5 4' : undefined}
              />
              {t.vazio ? (
                <text
                  x={cx}
                  y={BULB_CY + 5}
                  textAnchor='middle'
                  fill='#c4ad7f'
                  fontSize='14'
                  fontWeight='700'
                >
                  ?
                </text>
              ) : null}

              <text
                x={cx}
                y={244}
                textAnchor='middle'
                className='fill-white'
                fontSize='11'
                fontWeight='700'
              >
                {t.leitura}
              </text>
              {t.sub ? (
                <text
                  x={cx}
                  y={260}
                  textAnchor='middle'
                  className='fill-neutral-400'
                  fontSize='10'
                >
                  {t.sub}
                </text>
              ) : null}
            </g>
          );
        })}

        <text x={24} y={H - 32} className='fill-white' fontSize='12' fontWeight='700'>
          {data.conclusao}
        </text>

        {source ? (
          <text x={24} y={H - 12} className='fill-neutral-500' fontSize='9'>
            {source}
          </text>
        ) : null}
      </svg>
    </figure>
  );
}
