/**
 * ══════════════════════════════════════════════════════════════════════
 * CountryBarsChart — adoção por país, barras horizontais em blocos por RÉGUA
 * ══════════════════════════════════════════════════════════════════════
 *
 * SVG puro. A cor codifica o MÉTODO de medição, não o país: países medidos
 * pela mesma régua (Eurostat) compartilham a cor; os medidos por réguas
 * próprias (Pew, Cetic) ficam num bloco separado com cor de alerta e
 * legenda própria — a separação visual É a tese do artigo (o método muda
 * a manchete), então este gráfico nunca deve virar um ranking único.
 *
 * Texto por props; números via `dataset` em `data/artigos-charts.ts`
 * (o `compileMDX` só entrega atributo string).
 */

import { countryBarsDatasets } from '@/data/artigos-charts';

interface CountryBarsChartProps {
  /** Chave em `countryBarsDatasets`. */
  dataset: string;
  title: string;
  subtitle?: string;
  /** Descrição para leitor de tela. */
  description: string;
  /** Procedência, dentro do SVG. */
  source?: string;
}

const W = 720;
const PAD = { top: 48, right: 64, bottom: 36, left: 150 };
const BAR_H = 16;
const BAR_GAP = 8;
const GROUP_GAP = 34;

export function CountryBarsChart({
  dataset,
  title,
  subtitle,
  description,
  source,
}: CountryBarsChartProps) {
  const data = countryBarsDatasets[dataset];
  if (!data) {
    throw new Error(`CountryBarsChart: dataset desconhecido "${dataset}"`);
  }
  const plotW = W - PAD.left - PAD.right;
  const sx = (v: number) => (v / data.max) * plotW;

  const nBars = data.groups.reduce((s, g) => s + g.items.length, 0);
  const H =
    PAD.top +
    nBars * (BAR_H + BAR_GAP) +
    (data.groups.length - 1) * GROUP_GAP +
    data.groups.length * 18 +
    PAD.bottom;

  let y = PAD.top;

  return (
    <figure className='my-10 not-prose'>
      <svg
        viewBox={`0 0 ${W} ${H}`}
        className='w-full h-auto rounded-lg border border-white/10 bg-neutral-900/60'
        role='img'
        aria-label={description}
      >
        <title>{description}</title>

        <text x={PAD.left - 126} y={22} className='fill-white' fontSize='15' fontWeight='700'>
          {title}
        </text>
        {subtitle ? (
          <text x={PAD.left - 126} y={38} className='fill-neutral-400' fontSize='11'>
            {subtitle}
          </text>
        ) : null}

        {data.groups.map((g) => {
          const groupTop = y;
          y += 18;
          const bars = g.items.map((item) => {
            const barY = y;
            y += BAR_H + BAR_GAP;
            return (
              <g key={item.name}>
                <text
                  x={PAD.left - 10}
                  y={barY + BAR_H / 2 + 4}
                  className={item.emphasis ? 'fill-white' : 'fill-neutral-300'}
                  fontSize='11'
                  fontWeight={item.emphasis ? '700' : '400'}
                  textAnchor='end'
                >
                  {item.name}
                </text>
                <rect
                  x={PAD.left}
                  y={barY}
                  width={sx(item.value)}
                  height={BAR_H}
                  rx='4'
                  fill={g.color}
                  opacity={item.emphasis ? 1 : 0.82}
                />
                <text
                  x={PAD.left + sx(item.value) + 8}
                  y={barY + BAR_H / 2 + 4}
                  className={item.emphasis ? 'fill-white' : 'fill-neutral-400'}
                  fontSize='11'
                  fontWeight={item.emphasis ? '700' : '400'}
                >
                  {item.valueLabel}
                </text>
              </g>
            );
          });
          const groupBlock = (
            <g key={g.label}>
              <text
                x={PAD.left - 126}
                y={groupTop + 8}
                className='fill-neutral-400'
                fontSize='10'
                fontWeight='700'
                letterSpacing='0.08em'
              >
                {g.label.toUpperCase()}
              </text>
              {bars}
            </g>
          );
          y += GROUP_GAP - BAR_GAP;
          return groupBlock;
        })}

        {source ? (
          <text x={PAD.left - 126} y={H - 12} className='fill-neutral-500' fontSize='9'>
            {source}
          </text>
        ) : null}
      </svg>
    </figure>
  );
}
