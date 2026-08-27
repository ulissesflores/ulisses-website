/**
 * ══════════════════════════════════════════════════════════════════════
 * FlowLineDiagram — uma linha de cinco postos, um deles a restrição
 * ══════════════════════════════════════════════════════════════════════
 *
 * DESTINO NO SITE: `lib/content/flow-line-diagram.tsx` + registro em
 * `lib/content/mdx-components.tsx`. Dados em `data/flow-line-diagram.ts`
 * (o `compileMDX` só entrega atributo string — daí o `dataset` por id).
 *
 * A MESMA FIGURA APARECE DUAS VEZES no artigo `teoria-das-restricoes`, de
 * propósito — é a escada didática virando imagem: a padaria no primeiro
 * degrau (`restricao-linha-padaria`) e um agente de IA no quinto
 * (`restricao-linha-agentes`). Por isso TODA a geometria é constante de
 * módulo e o dataset só troca textos e o índice da restrição; ele nunca
 * entra em conta de posição. O leitor reconhece a forma e sente que subiu.
 *
 * O que se desenha: cinco caixas em linha ligadas por setas; a restrição em
 * ouro (o papel de destaque da marca — sempre a restrição, nunca outra
 * coisa); uma pilha de itens esperando antes dela; os postos depois dela
 * tracejados (ociosos); um medidor embaixo com o que entra e o que sai; e a
 * frase-conclusão desenhada dentro do SVG, porque a imagem circula sozinha.
 *
 * Cor por ATRIBUTO SVG, não por classe do Tailwind: classe arbitrária dentro
 * de objeto de configuração pode não ser gerada e renderiza preto em silêncio.
 * Nada de aleatório: a pilha é uma lista fixa — render idêntico no servidor
 * e no cliente.
 *
 * Orçamento de texto por vaga: ver header de `data/flow-line-diagram.ts`
 * (medido na Fahkwang real por `checar-figuras.py`).
 */

import { flowLineDatasets } from '@/data/flow-line-diagram';

interface FlowLineDiagramProps {
  /** Chave em `flowLineDatasets`. */
  dataset: string;
  title: string;
  /** Descrição para leitor de tela — a figura é informativa, não decorativa. */
  description: string;
  /** Procedência, desenhada DENTRO do SVG — a imagem circula sozinha. */
  source?: string;
}

const W = 720;
const H = 330;

/** Cinco caixas de 112 px com 28 px de vão: 5·112 + 4·28 = 672 = W − 2·24. */
const CAIXA = { w: 112, h: 52, y: 92 };
const PASSO = 140;
const CENTROS = [80, 220, 360, 500, 640] as const;
const SETA_Y = 118;

/** A pilha antes da restrição: até 12 quadrados em três colunas, no vão de 28 px.
 *  O tamanho vem do dataset (`fila`, proporcional ao dado medido) — a MESMA cena
 *  reaparece com os dados de cada experimento e o leitor compara pilhas. */
const PILHA = { lado: 7, colunas: [2, 11, 20], linhas: [106, 97, 88, 79], max: 12 } as const;

const ROTULO_FILA_Y = 70;
const ROTULO_OCIOSO_Y = 84;
const CAPACIDADE_Y = 162;
const MEDIDOR = { x: 24, y: 190, w: 672, h: 40, textoY: 215, setaX0: 330, setaX1: 390 };
const CONCLUSAO_Y = 262;
const SOURCE_Y = H - 12;

/** Paleta dataviz da marca (header de `data/artigos-charts.ts`). */
const COR = {
  ouro: '#a48f65',
  ouroClaro: '#c4ad7f',
  cinza: '#64748b',
  cinzaEscuro: '#3f3f46',
  cinzaClaro: '#d4d4d8',
  /** Série-tese da marca: marca o posto cuja capacidade MUDOU neste experimento. */
  azul: '#60a5fa',
  texto: '#e5e5e5',
  textoFraco: '#a3a3a3',
  procedencia: '#737373',
  offwhite: '#f5f0e6',
} as const;

export function FlowLineDiagram({ dataset, title, description, source }: FlowLineDiagramProps) {
  const data = flowLineDatasets[dataset];
  if (!data) {
    throw new Error(`FlowLineDiagram: dataset desconhecido "${dataset}"`);
  }
  if (data.postos.length !== CENTROS.length) {
    throw new Error(`FlowLineDiagram: "${dataset}" precisa de ${CENTROS.length} postos`);
  }
  const r = data.restricao;
  if (r < 0 || r >= CENTROS.length) {
    throw new Error(`FlowLineDiagram: "${dataset}" com restrição fora de 0..${CENTROS.length - 1}`);
  }
  if (data.fila < 0 || data.fila > PILHA.max) {
    throw new Error(`FlowLineDiagram: "${dataset}" com fila fora de 0..${PILHA.max}`);
  }
  const marcador = `fld-seta-${dataset}`;

  const vaoAntes = r > 0 ? CENTROS[r - 1] + CAIXA.w / 2 : null;
  const depois = CENTROS.slice(r + 1);
  const ociosoX = depois.length ? depois.reduce((s, c) => s + c, 0) / depois.length : null;
  const antes = CENTROS.slice(0, r);
  const ociosoAntesX =
    data.ociosoAntes && antes.length ? antes.reduce((s, c) => s + c, 0) / antes.length : null;

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
            id={marcador}
            viewBox='0 0 10 10'
            refX='9'
            refY='5'
            markerWidth='6'
            markerHeight='6'
            orient='auto'
          >
            <path d='M 0 0 L 10 5 L 0 10 z' fill={COR.cinza} />
          </marker>
        </defs>

        <text x={24} y={24} fill='#ffffff' fontSize='15' fontWeight='700'>
          {title}
        </text>

        {/* Setas entre caixas */}
        {CENTROS.slice(0, -1).map((cx, i) => (
          <line
            key={`seta-${i}`}
            x1={cx + CAIXA.w / 2 + 3}
            x2={CENTROS[i + 1] - CAIXA.w / 2 - 3}
            y1={SETA_Y}
            y2={SETA_Y}
            stroke={COR.cinza}
            strokeWidth='1.5'
            markerEnd={`url(#${marcador})`}
          />
        ))}

        {/* Caixas */}
        {data.postos.map((p, i) => {
          const cx = CENTROS[i];
          const ehRestricao = i === r;
          const ocioso = i > r || (Boolean(data.ociosoAntes) && i < r);
          const mudou = Boolean(p.mudou);
          return (
            <g key={p.nome}>
              <rect
                x={cx - CAIXA.w / 2}
                y={CAIXA.y}
                width={CAIXA.w}
                height={CAIXA.h}
                rx={8}
                fill={ehRestricao ? COR.ouro : COR.cinzaEscuro}
                fillOpacity={ehRestricao ? 0.22 : ocioso ? 0.25 : 0.5}
                stroke={ehRestricao ? COR.ouro : mudou ? COR.azul : COR.cinza}
                strokeWidth={ehRestricao || mudou ? 1.5 : 1}
                strokeDasharray={ocioso ? '4 3' : undefined}
              />
              <text
                x={cx}
                y={CAIXA.y + 32}
                textAnchor='middle'
                fill={ehRestricao ? COR.ouroClaro : COR.texto}
                fontSize='12'
                fontWeight='700'
              >
                {p.nome}
              </text>
              {p.capacidade ? (
                <text
                  x={cx}
                  y={CAPACIDADE_Y}
                  textAnchor='middle'
                  fill={ehRestricao ? COR.ouroClaro : mudou ? COR.azul : COR.textoFraco}
                  fontSize='10'
                  fontWeight={ehRestricao || mudou ? '700' : '400'}
                >
                  {p.capacidade}
                </text>
              ) : null}
            </g>
          );
        })}

        {/* A pilha que espera antes da restrição */}
        {vaoAntes !== null ? (
          <g>
            {Array.from({ length: data.fila }, (_, k) => (
              <rect
                key={`pilha-${k}`}
                x={vaoAntes + PILHA.colunas[k % PILHA.colunas.length]}
                y={PILHA.linhas[Math.floor(k / PILHA.colunas.length)]}
                width={PILHA.lado}
                height={PILHA.lado}
                rx={2}
                fill={COR.cinzaClaro}
                fillOpacity={0.85}
              />
            ))}
            <text
              x={vaoAntes + PASSO / 2 - CAIXA.w / 2}
              y={ROTULO_FILA_Y}
              textAnchor='middle'
              fill={COR.cinzaClaro}
              fontSize='10'
            >
              {data.filaAntes}
            </text>
          </g>
        ) : null}

        {/* Sob a corda, os postos ANTES dela também esperam — de propósito */}
        {ociosoAntesX !== null ? (
          <text
            x={ociosoAntesX}
            y={ROTULO_OCIOSO_Y}
            textAnchor='middle'
            fill={COR.textoFraco}
            fontSize='10'
          >
            {data.ociosoAntes}
          </text>
        ) : null}

        {/* Os postos ociosos depois dela */}
        {ociosoX !== null && data.ociosoDepois ? (
          <text
            x={ociosoX}
            y={ROTULO_OCIOSO_Y}
            textAnchor='middle'
            fill={COR.textoFraco}
            fontSize='10'
          >
            {data.ociosoDepois}
          </text>
        ) : null}

        {/* Medidor: o que entra, o que sai */}
        <rect
          x={MEDIDOR.x}
          y={MEDIDOR.y}
          width={MEDIDOR.w}
          height={MEDIDOR.h}
          rx={8}
          fill='#ffffff'
          fillOpacity={0.04}
          stroke='#ffffff'
          strokeOpacity={0.1}
        />
        <text x={MEDIDOR.x + 16} y={MEDIDOR.textoY} fill={COR.texto} fontSize='12'>
          {data.medidor.entra}
        </text>
        <line
          x1={MEDIDOR.setaX0}
          x2={MEDIDOR.setaX1}
          y1={MEDIDOR.y + MEDIDOR.h / 2}
          y2={MEDIDOR.y + MEDIDOR.h / 2}
          stroke={COR.cinza}
          strokeWidth='1.5'
          markerEnd={`url(#${marcador})`}
        />
        <text
          x={MEDIDOR.x + MEDIDOR.w - 16}
          y={MEDIDOR.textoY}
          textAnchor='end'
          fill={COR.ouroClaro}
          fontSize='12'
          fontWeight='700'
        >
          {data.medidor.sai}
        </text>

        <text x={24} y={CONCLUSAO_Y} fill={COR.offwhite} fontSize='12' fontWeight='700'>
          {data.conclusao}
        </text>

        {source ? (
          <text x={24} y={SOURCE_Y} fill={COR.procedencia} fontSize='9'>
            {source}
          </text>
        ) : null}
      </svg>
    </figure>
  );
}
