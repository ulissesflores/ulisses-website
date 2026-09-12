/**
 * ══════════════════════════════════════════════════════════════════════
 * MatrizJanelas — a grade plano × janela de uma única captura
 * ══════════════════════════════════════════════════════════════════════
 *
 * SVG puro, sem lib de gráficos. Cada linha é um plano (ou uma razão entre planos); cada
 * coluna é uma unidade publicada; as colunas são agrupadas pela JANELA a que pertencem, e
 * é o agrupamento que carrega a tese — o mesmo rótulo produz contas diferentes conforme a
 * janela em que se lê.
 *
 * DUAS CENAS, uma geometria (`PADRAO-ARTIGO.md` §1, degraus 4 e 3): a cena das células
 * traz os números publicados; a cena das razões traz o que sai de dividir uma linha pela
 * outra, com a conta desenhada embaixo do resultado. A cena vive inteira no dataset — o
 * componente não tem `modo`, porque não há nada que ele desenhe diferente por causa dele.
 * Duas cenas com a mesma geometria comparam por construção (§2, degrau 2 da escada de
 * reuso), e é o que mantém em DOIS o número de componentes novos deste artigo.
 *
 * A célula tem dois estados e a distância entre eles é o que a figura tem de mais frágil
 * a perder: `publicada` traz o número; `naoAplicavel` diz que não havia o que publicar, e
 * traz a razão disso escrita na própria célula. Tratar "não existe" e "foi retirado" como
 * o mesmo estado apagaria a distinção que sustenta a leitura — por isso o estado "saiu da
 * página" NÃO existe aqui: dentro desta captura nenhuma célula tinha saído ainda, e chave
 * de legenda sem marca correspondente no desenho é promessa que a imagem não cumpre.
 *
 * As marcas são SHAPES, não glifos: `—` e `●` como texto dependeriam de a fonte do site
 * ter esses pontos de código; o browser cairia num fallback e o medidor de rótulos mediria
 * outra métrica — divergência silenciosa, que é a classe de falha que o medidor existe
 * para pegar.
 *
 * Texto por props e pelo dataset do locale; a estrutura via `dataset` em
 * `data/rotulo-20x-figuras.ts` (o `compileMDX` só entrega atributo string).
 * Procedência desenhada DENTRO do SVG: a imagem circula sem o texto.
 *
 * Bidi hebraico: basta `font-chart` no `<svg>` raiz — as duas regras de `app/globals.css`
 * presas a `[dir='rtl'] svg.font-chart` viram a base de volta para LTR e põem cada
 * `<text>` em `unicode-bidi: plaintext`. A correção já vive na plataforma; o gate
 * `checar_bidi_hebraico` confere as duas pontas.
 */

import { matrizJanelasDatasets } from '@/data/rotulo-20x-figuras';

interface MatrizJanelasProps {
  /** Chave em `matrizJanelasDatasets` — um dataset por locale (é tudo texto). */
  dataset: string;
  title: string;
  subtitle?: string;
  /** Descrição para leitor de tela — a figura é informativa, não decorativa. */
  description: string;
  /** Procedência, dentro do SVG. */
  source?: string;
}

const W = 760;
const PAD = { right: 8, bottom: 10, left: 8 };
const COL_ROTULO = 120;
const X0 = PAD.left + COL_ROTULO; // 128
const N_COLUNAS = 4;
const COL_W = (W - PAD.left - PAD.right - COL_ROTULO) / N_COLUNAS; // 156
const ROW_H = 56;
const R_MARCA = 5.5;

const COR = {
  destaque: '#a48f65', // ouro da marca — a janela semanal, o que se deve ver primeiro
  serie: '#60a5fa', // azul série-tese — a janela de cinco horas
  recessivo: '#64748b',
  regua: '#ffffff1a',
};

const corDoPapel = (papel: 'destaque' | 'serie' | 'recessivo') => COR[papel];

/** Centro horizontal da coluna `c`. */
const centroColuna = (c: number) => X0 + (c + 0.5) * COL_W;

/**
 * A marca da célula que não se aplica: um traço. Shape, não glifo — ver o cabeçalho.
 * A célula publicada não tem marca: o que ela desenha é o próprio número.
 */
function Traco({ cx, cy }: { cx: number; cy: number }) {
  return (
    <line
      x1={cx - 9}
      y1={cy}
      x2={cx + 9}
      y2={cy}
      stroke={COR.recessivo}
      strokeWidth={2}
      strokeLinecap='round'
    />
  );
}

export function MatrizJanelas({
  dataset,
  title,
  subtitle,
  description,
  source,
}: MatrizJanelasProps) {
  const data = matrizJanelasDatasets[dataset];
  if (!data) {
    throw new Error(`MatrizJanelas: dataset desconhecido "${dataset}"`);
  }
  const { grupos, colunas, linhas, conclusao, legenda } = data;

  const grupoY = subtitle ? 66 : 52;
  const colunaY = grupoY + 26;
  const linhasTop = colunaY + 17;
  const linhasFim = linhasTop + linhas.length * ROW_H;
  const yLegenda = linhasFim + 20;
  const yConclusao = yLegenda + 24;
  const H = yConclusao + conclusao.length * 15 + (source ? 18 : 0) + PAD.bottom;

  /** Faixa de colunas de cada grupo, na ordem em que os grupos as cobrem. */
  let cursor = 0;
  const faixas = grupos.map((g) => {
    const inicio = cursor;
    cursor += g.colunas;
    return { ...g, inicio, fim: cursor };
  });

  return (
    <figure className='my-10 not-prose'>
      <svg
        viewBox={`0 0 ${W} ${H}`}
        className='w-full h-auto rounded-lg border border-white/10 bg-neutral-900/60 font-chart'
        role='img'
        aria-label={description}
      >
        <title>{description}</title>

        <text x={PAD.left} y={24} className='fill-white' fontSize='15' fontWeight='700'>
          {title}
        </text>
        {subtitle ? (
          <text x={PAD.left} y={42} className='fill-neutral-400' fontSize='11'>
            {subtitle}
          </text>
        ) : null}

        {/* A faixa da janela vai atrás das colunas dela e desce até o fim da grade: é o
            agrupamento, e não a cor de um número solto, que carrega a leitura. */}
        {faixas.map((f) => (
          <rect
            key={f.rotulo}
            x={X0 + f.inicio * COL_W}
            y={grupoY - 15}
            width={(f.fim - f.inicio) * COL_W}
            height={linhasFim - grupoY + 15}
            rx={6}
            fill={corDoPapel(f.papel)}
            fillOpacity={f.papel === 'destaque' ? 0.09 : 0.05}
          />
        ))}

        {faixas.map((f) => (
          <text
            key={f.rotulo}
            x={X0 + ((f.inicio + f.fim) / 2) * COL_W}
            y={grupoY}
            textAnchor='middle'
            fill={corDoPapel(f.papel)}
            fontSize='11'
            fontWeight='700'
          >
            {f.rotulo}
          </text>
        ))}

        {colunas.map((coluna, c) => (
          <text
            key={coluna.rotulo}
            x={centroColuna(c)}
            y={colunaY}
            textAnchor='middle'
            className='fill-neutral-400'
            fontSize='9.5'
          >
            {coluna.rotulo}
          </text>
        ))}
        <line
          x1={PAD.left}
          y1={colunaY + 9}
          x2={W - PAD.right}
          y2={colunaY + 9}
          stroke={COR.regua}
          strokeWidth={1}
        />

        {linhas.map((linha, i) => {
          const topo = linhasTop + i * ROW_H;
          return (
            <g key={linha.rotulo}>
              <text
                x={PAD.left}
                y={topo + 24}
                className='fill-neutral-200'
                fontSize='11'
              >
                {linha.rotulo}
              </text>
              {linha.celulas.map((celula, c) => {
                const cx = centroColuna(c);
                if (celula.estado === 'naoAplicavel') {
                  return (
                    <g key={colunas[c].rotulo}>
                      <Traco cx={cx} cy={topo + 19} />
                      {celula.nota.map((nota, k) => (
                        <text
                          key={nota}
                          x={cx}
                          y={topo + 36 + k * 10}
                          textAnchor='middle'
                          className='fill-neutral-500'
                          fontSize='8'
                        >
                          {nota}
                        </text>
                      ))}
                    </g>
                  );
                }
                return (
                  <g key={colunas[c].rotulo}>
                    <text
                      x={cx}
                      y={topo + 24}
                      textAnchor='middle'
                      className='fill-neutral-100'
                      fontSize='13'
                      fontWeight='700'
                    >
                      {celula.valor}
                    </text>
                    {celula.conta ? (
                      <text
                        x={cx}
                        y={topo + 38}
                        textAnchor='middle'
                        className='fill-neutral-400'
                        fontSize='8'
                      >
                        {celula.conta}
                      </text>
                    ) : null}
                  </g>
                );
              })}
            </g>
          );
        })}

        {/* Legenda: o vocabulário da casa para estado de célula — disco cheio quando há
            valor, traço quando não se aplica. Os dois em fila, cada um numa metade. */}
        <circle cx={PAD.left + 7} cy={yLegenda - 4} r={R_MARCA} fill={COR.recessivo} />
        <text x={PAD.left + 20} y={yLegenda} className='fill-neutral-400' fontSize='10'>
          {legenda.publicada}
        </text>
        <Traco cx={W / 2 + 7} cy={yLegenda - 4} />
        <text x={W / 2 + 20} y={yLegenda} className='fill-neutral-400' fontSize='10'>
          {legenda.naoAplicavel}
        </text>

        {conclusao.map((linha, k) => (
          <text
            key={linha}
            x={PAD.left}
            y={yConclusao + k * 15}
            className='fill-neutral-200'
            fontSize='11'
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
          >
            {source}
          </text>
        ) : null}
      </svg>
    </figure>
  );
}
