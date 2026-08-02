/**
 * ══════════════════════════════════════════════════════════════════════
 * FunnelChart — degraus em ESCALA HONESTA (proporção linear real)
 * ══════════════════════════════════════════════════════════════════════
 *
 * SVG puro. A decisão central: as larguras são proporcionais aos valores
 * REAIS, sem escala log nem "ajuste visual" — o segundo degrau vira uma
 * lasca e o terceiro quase desaparece, e essa invisibilidade É o dado.
 * Largura mínima de 3px só para o degrau não sumir por completo; o rótulo
 * ao lado carrega o valor com a faixa por extenso.
 *
 * Texto por props; números via `dataset` em `data/artigos-charts.ts`
 * (o `compileMDX` só entrega atributo string).
 */

import { funnelDatasets } from '@/data/artigos-charts';

interface FunnelChartProps {
  /** Chave em `funnelDatasets`. */
  dataset: string;
  title: string;
  subtitle?: string;
  /** Descrição para leitor de tela. */
  description: string;
  /** Procedência, dentro do SVG. */
  source?: string;
}

const W = 720;
const PAD = { top: 48, right: 24, bottom: 36, left: 24 };
const BAR_H = 44;
const STEP_GAP = 30;

export function FunnelChart({ dataset, title, subtitle, description, source }: FunnelChartProps) {
  const data = funnelDatasets[dataset];
  if (!data) {
    throw new Error(`FunnelChart: dataset desconhecido "${dataset}"`);
  }
  const plotW = W - PAD.left - PAD.right;
  const max = data.steps[0].value;
  const H = PAD.top + data.steps.length * (BAR_H + STEP_GAP) - STEP_GAP + PAD.bottom + 8;

  return (
    <figure className='my-10 not-prose'>
      <svg
        viewBox={`0 0 ${W} ${H}`}
        className='w-full h-auto rounded-lg border border-white/10 bg-neutral-900/60'
        role='img'
        aria-label={description}
      >
        <title>{description}</title>

        <text x={PAD.left} y={22} className='fill-white' fontSize='15' fontWeight='700'>
          {title}
        </text>
        {subtitle ? (
          <text x={PAD.left} y={38} className='fill-neutral-400' fontSize='11'>
            {subtitle}
          </text>
        ) : null}

        {data.steps.map((step, i) => {
          const barY = PAD.top + 8 + i * (BAR_H + STEP_GAP);
          const wReal = (step.value / max) * plotW;
          const w = Math.max(wReal, 3);
          return (
            <g key={step.label}>
              <rect x={PAD.left} y={barY} width={w} height={BAR_H} rx='4' fill={step.color} />
              {/* Trilho fantasma do degrau anterior: mostra de onde se caiu. */}
              {i > 0 ? (
                <rect
                  x={PAD.left}
                  y={barY}
                  width={(data.steps[i - 1].value / max) * plotW}
                  height={BAR_H}
                  rx='4'
                  fill='none'
                  className='stroke-white/10'
                  strokeWidth='1'
                />
              ) : null}
              {/* Barra larga: rótulo DENTRO em tinta escura (contraste sobre a cor
                  clara); lasca: rótulo FORA em tinta clara sobre a superfície. */}
              <text
                x={PAD.left + (w > plotW * 0.5 ? 12 : w + 12)}
                y={barY + 18}
                className={w > plotW * 0.5 ? 'fill-neutral-900' : 'fill-white'}
                fontSize='13'
                fontWeight='700'
              >
                {step.label}
              </text>
              <text
                x={PAD.left + (w > plotW * 0.5 ? 12 : w + 12)}
                y={barY + 34}
                className={w > plotW * 0.5 ? 'fill-neutral-800' : 'fill-neutral-400'}
                fontSize='11'
              >
                {step.sublabel}
              </text>
            </g>
          );
        })}

        {source ? (
          <text x={PAD.left} y={H - 12} className='fill-neutral-500' fontSize='9'>
            {source}
          </text>
        ) : null}
      </svg>
    </figure>
  );
}
