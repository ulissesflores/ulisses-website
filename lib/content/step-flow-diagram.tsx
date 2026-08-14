/**
 * ══════════════════════════════════════════════════════════════════════
 * StepFlowDiagram — cadeia de etapas encadeadas, em SVG puro
 * ══════════════════════════════════════════════════════════════════════
 *
 * Usado para explicar um encadeamento causal ou uma linha do tempo a quem
 * não conhece o assunto: cada etapa é uma caixa com rótulo curto e uma
 * frase de apoio, ligadas por seta. A última etapa pode ser marcada como
 * `alert` para carregar o desfecho (é onde a cadeia falhou).
 *
 * Duas orientações, porque as duas ocorrências do artigo pedem formas
 * diferentes: `chain` empilha na vertical (cadeia causal, texto longo) e
 * `timeline` distribui na horizontal sobre um eixo (datas).
 *
 * Texto por props; conteúdo via `dataset` em `data/artigos-charts.ts`
 * (o `compileMDX` só entrega atributo string).
 */

import { stepFlowDatasets } from '@/data/artigos-charts';

interface StepFlowDiagramProps {
  /** Chave em `stepFlowDatasets`. */
  dataset: string;
  title: string;
  subtitle?: string;
  /** Descrição para leitor de tela. */
  description: string;
  /** Procedência, dentro do SVG. */
  source?: string;
}

const W = 720;

/* Cadeia vertical: caixa larga, cabe frase de apoio em duas linhas. */
const CHAIN = { top: 52, left: 24, right: 24, boxH: 58, gap: 26, bottom: 34 };

/* Linha do tempo: colunas iguais sobre um eixo horizontal. */
const TL = { top: 56, left: 24, right: 24, axisY: 104, bottom: 76 };

export function StepFlowDiagram({
  dataset,
  title,
  subtitle,
  description,
  source,
}: StepFlowDiagramProps) {
  const data = stepFlowDatasets[dataset];
  if (!data) {
    throw new Error(`StepFlowDiagram: dataset desconhecido "${dataset}"`);
  }

  const isTimeline = data.orientation === 'timeline';
  const n = data.steps.length;

  const H = isTimeline
    ? TL.top + TL.bottom + 88
    : CHAIN.top + n * CHAIN.boxH + (n - 1) * CHAIN.gap + CHAIN.bottom;

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
          <marker
            id='sfd-arrow'
            viewBox='0 0 10 10'
            refX='9'
            refY='5'
            markerWidth='6'
            markerHeight='6'
            orient='auto-start-reverse'
          >
            <path d='M 0 0 L 10 5 L 0 10 z' className='fill-neutral-500' />
          </marker>
        </defs>

        <text x={CHAIN.left} y={24} className='fill-white' fontSize='15' fontWeight='700'>
          {title}
        </text>
        {subtitle ? (
          <text x={CHAIN.left} y={40} className='fill-neutral-400' fontSize='11'>
            {subtitle}
          </text>
        ) : null}

        {isTimeline ? (
          <TimelineBody steps={data.steps} />
        ) : (
          <ChainBody steps={data.steps} />
        )}

        {source ? (
          <text x={CHAIN.left} y={H - 12} className='fill-neutral-500' fontSize='10'>
            {source}
          </text>
        ) : null}
      </svg>
    </figure>
  );
}

interface Step {
  label: string;
  detail?: string;
  alert?: boolean;
}

function ChainBody({ steps }: { steps: readonly Step[] }) {
  const boxW = W - CHAIN.left - CHAIN.right;

  return (
    <>
      {steps.map((s, i) => {
        const y = CHAIN.top + i * (CHAIN.boxH + CHAIN.gap);
        const stroke = s.alert ? 'stroke-amber-400/60' : 'stroke-white/15';
        const fill = s.alert ? 'fill-amber-400/10' : 'fill-white/5';

        return (
          <g key={i}>
            <rect
              x={CHAIN.left}
              y={y}
              width={boxW}
              height={CHAIN.boxH}
              rx={8}
              className={`${fill} ${stroke}`}
              strokeWidth={1}
            />
            <text
              x={CHAIN.left + 16}
              y={y + 23}
              className={s.alert ? 'fill-amber-300' : 'fill-white'}
              fontSize='12'
              fontWeight='700'
            >
              {`${i + 1}. ${s.label}`}
            </text>
            {s.detail ? (
              <text
                x={CHAIN.left + 16}
                y={y + 42}
                className='fill-neutral-300'
                fontSize='11'
              >
                {s.detail}
              </text>
            ) : null}

            {i < steps.length - 1 ? (
              <line
                x1={W / 2}
                y1={y + CHAIN.boxH}
                x2={W / 2}
                y2={y + CHAIN.boxH + CHAIN.gap - 4}
                className='stroke-neutral-500'
                strokeWidth={1.5}
                markerEnd='url(#sfd-arrow)'
              />
            ) : null}
          </g>
        );
      })}
    </>
  );
}

function TimelineBody({ steps }: { steps: readonly Step[] }) {
  const plotW = W - TL.left - TL.right;
  const n = steps.length;
  const step = plotW / (n - 1 || 1);

  return (
    <>
      <line
        x1={TL.left}
        y1={TL.axisY}
        x2={W - TL.right}
        y2={TL.axisY}
        className='stroke-white/15'
        strokeWidth={2}
      />

      {steps.map((s, i) => {
        const cx = TL.left + i * step;
        /* Extremos ancoram no início/fim para o rótulo não sair do viewBox. */
        const anchor = i === 0 ? 'start' : i === n - 1 ? 'end' : 'middle';
        const tx = i === 0 ? TL.left : i === n - 1 ? W - TL.right : cx;

        return (
          <g key={i}>
            <circle
              cx={cx}
              cy={TL.axisY}
              r={s.alert ? 7 : 5}
              className={s.alert ? 'fill-amber-400' : 'fill-neutral-400'}
            />
            <text
              x={tx}
              y={TL.axisY - 22}
              textAnchor={anchor}
              className={s.alert ? 'fill-amber-300' : 'fill-white'}
              fontSize='12'
              fontWeight='700'
            >
              {s.label}
            </text>
            {s.detail ? (
              <text
                x={tx}
                y={TL.axisY + 26}
                textAnchor={anchor}
                className='fill-neutral-300'
                fontSize='11'
              >
                {s.detail}
              </text>
            ) : null}
          </g>
        );
      })}
    </>
  );
}
