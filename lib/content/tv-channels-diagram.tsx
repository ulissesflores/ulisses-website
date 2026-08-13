/**
 * ══════════════════════════════════════════════════════════════════════
 * TvChannelsDiagram — TV no canal de recompensa x TV no canal de medição
 * ══════════════════════════════════════════════════════════════════════
 *
 * Diagrama conceitual (sem dataset: não há dado medido aqui, só estrutura).
 * Rótulos com default pt-BR e sobrescrevíveis por props string, para uma
 * eventual tradução — o compileMDX só entrega prop string mesmo.
 * O "chuvisco" é um padrão determinístico de pontos, não aleatório: o
 * render precisa ser estável entre server e client.
 */

interface TvChannelsDiagramProps {
  title: string;
  /** Descrição para leitor de tela. */
  description: string;
  leftTitle?: string;
  rightTitle?: string;
  source?: string;
}

const W = 760;
const H = 440;
const COL = { esq: 24, dir: 396 };
const PANEL_W = 340;

/** Chuvisco determinístico: grade com deslocamento pseudo-fixo por índice. */
function Estatica({ x, y, w, h }: { x: number; y: number; w: number; h: number }) {
  const pontos: React.ReactNode[] = [];
  let k = 0;
  for (let i = 6; i < w - 4; i += 9) {
    for (let j = 6; j < h - 4; j += 8) {
      k += 1;
      const dx = ((k * 7) % 5) - 2;
      const dy = ((k * 11) % 5) - 2;
      pontos.push(
        <circle
          key={`${i}-${j}`}
          cx={x + i + dx}
          cy={y + j + dy}
          r={1.2}
          fill='#f87171'
          opacity={0.25 + ((k * 13) % 4) * 0.18}
        />
      );
    }
  }
  return <g>{pontos}</g>;
}

function Caixa({
  x,
  y,
  w,
  h,
  label,
  sub,
  alerta,
}: {
  x: number;
  y: number;
  w: number;
  h: number;
  label: string;
  sub?: string;
  alerta?: boolean;
}) {
  return (
    <g>
      <rect
        x={x}
        y={y}
        width={w}
        height={h}
        rx={8}
        fill={alerta ? 'rgba(248,113,113,0.10)' : 'rgba(255,255,255,0.04)'}
        stroke={alerta ? '#f87171' : 'rgba(255,255,255,0.25)'}
        strokeWidth={alerta ? 2 : 1}
      />
      <text
        x={x + w / 2}
        y={y + (sub ? h / 2 - 4 : h / 2 + 4)}
        className='fill-white'
        fontSize='12'
        fontWeight='700'
        textAnchor='middle'
      >
        {label}
      </text>
      {sub ? (
        <text
          x={x + w / 2}
          y={y + h / 2 + 13}
          className='fill-neutral-400'
          fontSize='10'
          textAnchor='middle'
        >
          {sub}
        </text>
      ) : null}
    </g>
  );
}

function Seta({
  x1,
  y1,
  x2,
  y2,
  label,
  alerta,
}: {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  label?: string;
  alerta?: boolean;
}) {
  const cor = alerta ? '#f87171' : '#a1a1aa';
  return (
    <g>
      <line
        x1={x1}
        y1={y1}
        x2={x2}
        y2={y2}
        stroke={cor}
        strokeWidth='1.8'
        markerEnd={alerta ? 'url(#ponta-alerta)' : 'url(#ponta)'}
      />
      {label ? (
        <text
          x={(x1 + x2) / 2 + 8}
          y={(y1 + y2) / 2 + 4}
          fill={cor}
          fontSize='10'
        >
          {label}
        </text>
      ) : null}
    </g>
  );
}

export function TvChannelsDiagram({
  title,
  description,
  leftTitle = 'RL clássico: a TV está no AMBIENTE',
  rightTitle = 'Agente LLM: a TV está no INSTRUMENTO',
  source,
}: TvChannelsDiagramProps) {
  const e = COL.esq;
  const d = COL.dir;

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
          <marker id='ponta' markerWidth='8' markerHeight='8' refX='7' refY='4' orient='auto'>
            <path d='M0,0 L8,4 L0,8 z' fill='#a1a1aa' />
          </marker>
          <marker id='ponta-alerta' markerWidth='8' markerHeight='8' refX='7' refY='4' orient='auto'>
            <path d='M0,0 L8,4 L0,8 z' fill='#f87171' />
          </marker>
        </defs>

        <text x={e} y={26} className='fill-white' fontSize='15' fontWeight='700'>
          {title}
        </text>

        {/* ───────────── Painel esquerdo: canal de recompensa ───────────── */}
        <text x={e} y={56} className='fill-neutral-300' fontSize='12' fontWeight='700'>
          {leftTitle}
        </text>
        <Caixa x={e} y={72} w={PANEL_W} h={96} label='Ambiente' sub='labirinto 3D' />
        {/* A TV pendurada dentro do ambiente. */}
        <rect x={e + 216} y={84} width={104} height={72} rx={4} fill='#111' stroke='#f87171' strokeWidth='1.5' />
        <Estatica x={e + 216} y={84} w={104} h={72} />
        <text x={e + 268} y={172} fill='#f87171' fontSize='9' textAnchor='middle'>
          TV: ruído no mundo
        </text>
        <Caixa x={e + 60} y={236} w={220} h={56} label='Agente' sub='política treinada por recompensa' />
        <Seta x1={e + 120} y1={168} x2={e + 120} y2={232} label='observação' />
        <Seta x1={e + 200} y1={232} x2={e + 200} y2={168} label='ação' />
        <Seta x1={e + 170} y1={296} x2={e + 170} y2={352} label='recompensa de surpresa' alerta />
        <text x={e} y={382} fill='#f87171' fontSize='10'>
          erro de previsão vira prêmio; a estática paga para sempre:
        </text>
        <text x={e} y={396} fill='#f87171' fontSize='10' fontWeight='700'>
          o agente estaciona na frente da TV
        </text>

        {/* ───────────── Painel direito: canal de medição ───────────── */}
        <text x={d} y={56} className='fill-neutral-300' fontSize='12' fontWeight='700'>
          {rightTitle}
        </text>
        <Caixa x={d} y={72} w={PANEL_W} h={48} label='LLM amostra o pensamento' sub='temperatura 0,8: mesmo estímulo, texto sempre diferente' />
        <Seta x1={d + PANEL_W / 2} y1={120} x2={d + PANEL_W / 2} y2={148} />
        <Caixa x={d} y={148} w={PANEL_W} h={48} label='Embedder' sub='texto vira vetor; dim baixa = chuvisco alto' alerta />
        <Estatica x={d + 8} y={156} w={56} h={32} />
        <Seta x1={d + PANEL_W / 2} y1={196} x2={d + PANEL_W / 2} y2={224} />
        <Caixa x={d} y={224} w={PANEL_W} h={48} label='Métrica de novidade (cosseno)' sub='piso de ruído 1/sqrt(d) embutido' alerta />
        <Estatica x={d + 8} y={232} w={56} h={32} />
        <Seta x1={d + PANEL_W / 2} y1={272} x2={d + PANEL_W / 2} y2={300} />
        <Caixa x={d} y={300} w={PANEL_W} h={48} label='Gatilho de curiosidade' sub='gap e intensidade lidos do instrumento' />
        <text x={d} y={382} fill='#f87171' fontSize='10'>
          nenhuma recompensa no circuito — e o gatilho já dispara:
        </text>
        <text x={d} y={396} fill='#f87171' fontSize='10' fontWeight='700'>
          a TV está dentro da régua
        </text>

        {source ? (
          <text x={e} y={H - 14} className='fill-neutral-500' fontSize='9'>
            {source}
          </text>
        ) : null}
      </svg>
    </figure>
  );
}
