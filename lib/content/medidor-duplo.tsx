/**
 * ══════════════════════════════════════════════════════════════════════
 * MedidorDuplo — o mesmo multiplicador lido em dois medidores diferentes
 * ══════════════════════════════════════════════════════════════════════
 *
 * SVG puro, sem lib de gráficos. Dois painéis lado a lado, cada um com a MESMA geometria:
 * uma barra por plano, o nome à esquerda, o número publicado à direita, e a razão que
 * aquele medidor produz num quadro embaixo. O leitor compara os dois painéis sem precisar
 * de eixo comum — o que se compara é a RAZÃO dentro de cada medidor, não o comprimento
 * de uma barra contra a do outro painel.
 *
 * A figura existe porque a tese do artigo é uma comparação entre janelas, e comparação
 * entre janelas é exatamente o que uma tabela de números não mostra: «20x» e «6,0» são
 * dois resultados do mesmo rótulo, e só ficam obviamente diferentes quando desenhados
 * com a mesma régua, lado a lado.
 *
 * TRÊS CENAS, uma geometria (`PADRAO-ARTIGO.md` §1, degraus 1, 2 e 5):
 *   `analogia` — a catraca sem uma palavra técnica. Nenhum número é medição, e a linha de
 *                procedência diz isso dentro do SVG (§5: dado que não existe não vira
 *                gráfico; o que existe é figura qualitativa que se declara qualitativa).
 *   `nomeada`  — a mesma catraca com os planos e as janelas reais.
 *   `regua`    — retoma a geometria em escala maior (barra e razão maiores) e acrescenta
 *                os quatro testes da régua. É o degrau 5 fechando no degrau 1.
 *
 * A BARRA MEDE MÚLTIPLO DA BASE, com a MESMA unidade nos dois painéis — e é isso que faz
 * a figura dizer o que a frase diz: o plano caro do medidor da semana desenha seis
 * unidades onde o do medidor da visita desenha vinte. Normalizando por painel (o maior
 * virando 1), os dois desenhavam o MESMO comprimento e a imagem contradizia o texto.
 * Defeito pego no PNG, que é o único gate que o vê. Múltiplo é adimensional: por isso um
 * painel medido em mensagens pode ser lido contra outro medido em horas.
 *
 * NÃO HÁ TRILHO ATRÁS DA BARRA, de propósito: um trilho de 100% desenharia uma folga que
 * não existe no dado — o leitor leria "ainda cabe mais", que é afirmação que nenhuma
 * captura sustenta.
 *
 * O plano BASE (o denominador da razão) se distingue por FORMA, não por cor: barra
 * vazada com contorno contra barra cheia. `PADRAO-ARTIGO.md` §3 — distinção que é só cor
 * morre no daltonismo e no print em cinza. O contorno é contínuo, não tracejado: no
 * comprimento de uma unidade o tracejado virava ruído em vez de barra.
 *
 * Texto por props e pelo dataset do locale; a estrutura via `dataset` em
 * `data/rotulo-20x-figuras.ts` (o `compileMDX` só entrega atributo string).
 * Procedência desenhada DENTRO do SVG: a imagem circula sem o texto.
 *
 * Bidi hebraico: basta `font-chart` no `<svg>` raiz — as duas regras de `app/globals.css`
 * presas a `[dir='rtl'] svg.font-chart` viram a base de volta para LTR e põem cada
 * `<text>` em `unicode-bidi: plaintext`. Não repetir isso inline aqui: a correção já vive
 * na plataforma e o gate `checar_bidi_hebraico` confere as duas pontas.
 */

import { medidorDuploDatasets } from '@/data/rotulo-20x-figuras';

interface MedidorDuploProps {
  /** Chave em `medidorDuploDatasets` — um dataset por locale (é tudo texto). */
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
const GAP_PAINEL = 24;
const W_PAINEL = (W - PAD.left - PAD.right - GAP_PAINEL) / 2; // 360
const PAINEL_X = [PAD.left, PAD.left + W_PAINEL + GAP_PAINEL]; // 8 e 392
const PAINEL_PAD = 12;

/** Colunas fixas dentro do painel: nome | barra | valor. */
const NOME_W = 80;
const VALOR_W = 84;
const GAP_COL = 8;
const TRACK_W = W_PAINEL - 2 * PAINEL_PAD - NOME_W - VALOR_W - 2 * GAP_COL; // 156

/**
 * O valor vai em COLUNA FIXA à direita, nunca na ponta da barra. Na ponta, o plano de
 * maior múltiplo teria orçamento zero — o rótulo do maior número seria o primeiro a ser
 * cortado, em silêncio, que é a falha que o §4 existe para impedir.
 */
const VALOR_X = (px: number) => px + W_PAINEL - PAINEL_PAD - VALOR_W;
const TRACK_X = (px: number) => px + PAINEL_PAD + NOME_W + GAP_COL;

/**
 * Uma unidade de barra, em px: o maior múltiplo da FIGURA INTEIRA ocupa a pista toda, e
 * os dois painéis dividem a mesma unidade. Calcular por painel devolveria o defeito que
 * o render pegou — o plano caro dos dois desenhando o mesmo comprimento.
 */
const unidadeDaBarra = (paineis: { planos: { multiplo: number }[] }[]) =>
  TRACK_W / Math.max(...paineis.flatMap((p) => p.planos.map((x) => x.multiplo)));

const BLOCO_RAZAO_H = 44;
const TESTE_ROW_H = 20;
const TESTE_MARCA_X = PAD.left + 7;
const TESTE_PERGUNTA_X = PAD.left + 20;
const TESTE_PERGUNTA_W = 470;
const TESTE_VEREDITO_X = TESTE_PERGUNTA_X + TESTE_PERGUNTA_W; // 498

/** A cena `regua` é o degrau 5: mesma geometria, escala maior. */
const escala = (regua: boolean) => ({
  rowH: regua ? 34 : 26,
  barraH: regua ? 18 : 12,
  razaoPx: regua ? 28 : 22,
});

const COR = {
  destaque: '#a48f65', // ouro da marca — a janela semanal, que é o que se deve ver primeiro
  serie: '#60a5fa', // azul série-tese — a janela de cinco horas
  recessivo: '#64748b',
  regua: '#ffffff1a',
};

const corDoPapel = (papel: 'destaque' | 'serie' | 'recessivo') => COR[papel];

/** Altura de um painel com `n` planos, na escala da cena. */
const alturaPainel = (n: number, regua: boolean) =>
  46 + n * escala(regua).rowH + 10 + BLOCO_RAZAO_H + 12;

export function MedidorDuplo({
  dataset,
  title,
  subtitle,
  description,
  source,
}: MedidorDuploProps) {
  const data = medidorDuploDatasets[dataset];
  if (!data) {
    throw new Error(`MedidorDuplo: dataset desconhecido "${dataset}"`);
  }
  const { modo, paineis, conclusao, testes, legenda } = data;
  const regua = modo === 'regua';
  const { rowH, barraH, razaoPx } = escala(regua);
  const unidade = unidadeDaBarra(paineis);

  const painelTop = subtitle ? 58 : 44;
  const painelH = Math.max(...paineis.map((p) => alturaPainel(p.planos.length, regua)));
  const yLegenda = painelTop + painelH + 26;
  // 30px, e nao 14: no render a legenda (que fala de BARRA) encostava na primeira linha
  // dos testes (que falam de MARCA), e as duas vocabularios liam-se como uma lista so'.
  // Medidor de largura nao ve isso; so' o PNG ve.
  const yTestes = yLegenda + 30;
  const nTestes = regua ? (testes ?? []).length : 0;
  const yConclusao = regua ? yTestes + nTestes * TESTE_ROW_H + 16 : yLegenda + 24;
  const H = yConclusao + conclusao.length * 15 + (source ? 18 : 0) + PAD.bottom;

  /** Um painel: título, unidade, uma barra por plano, e o quadro da razão. */
  const Painel = (p: (typeof paineis)[number], px: number) => {
    const cor = corDoPapel(p.papel);
    const yRazao = painelTop + 46 + p.planos.length * rowH + 10;
    return (
      <g key={p.titulo}>
        <rect
          x={px}
          y={painelTop}
          width={W_PAINEL}
          height={painelH}
          rx={8}
          fill={cor}
          fillOpacity={0.06}
          stroke={cor}
          strokeOpacity={0.3}
        />
        <text
          x={px + PAINEL_PAD}
          y={painelTop + 20}
          fill={cor}
          fontSize='12'
          fontWeight='700'
        >
          {p.titulo}
        </text>
        <text
          x={px + PAINEL_PAD}
          y={painelTop + 34}
          className='fill-neutral-400'
          fontSize='9.5'
        >
          {p.unidade}
        </text>

        {p.planos.map((plano, i) => {
          const topo = painelTop + 46 + i * rowH;
          const centro = topo + barraH / 2;
          return (
            <g key={plano.nome}>
              <text
                x={px + PAINEL_PAD}
                y={centro + 3.5}
                className='fill-neutral-200'
                fontSize='10'
              >
                {plano.nome}
              </text>
              {/* Base = denominador: barra VAZADA. A distinção não pode ser só cor. */}
              <rect
                x={TRACK_X(px)}
                y={topo}
                width={Math.max(unidade * plano.multiplo, 3)}
                height={barraH}
                rx={2}
                fill={plano.base ? 'none' : cor}
                stroke={cor}
                strokeWidth={plano.base ? 1.5 : 0}
              />
              <text
                x={VALOR_X(px)}
                y={centro + 3.5}
                className='fill-neutral-300'
                fontSize='10'
              >
                {plano.valor}
              </text>
            </g>
          );
        })}

        <rect
          x={px + PAINEL_PAD}
          y={yRazao}
          width={W_PAINEL - 2 * PAINEL_PAD}
          height={BLOCO_RAZAO_H}
          rx={6}
          fill={cor}
          fillOpacity={0.1}
        />
        <text
          x={px + PAINEL_PAD + 10}
          y={yRazao + 26}
          fill={cor}
          fontSize={razaoPx}
          fontWeight='700'
        >
          {p.razaoRotulo}
        </text>
        {p.razaoConta ? (
          <text
            x={px + PAINEL_PAD + 10}
            y={yRazao + 39}
            className='fill-neutral-400'
            fontSize='9'
          >
            {p.razaoConta}
          </text>
        ) : null}
      </g>
    );
  };

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

        {paineis.map((p, i) => Painel(p, PAINEL_X[i]))}

        {/* Legenda: as duas formas de barra, com a marca desenhada como a barra real. */}
        <rect
          x={PAD.left}
          y={yLegenda - 8}
          width={14}
          height={9}
          rx={2}
          fill='none'
          stroke={COR.recessivo}
          strokeWidth={1.5}
        />
        <text x={PAD.left + 20} y={yLegenda} className='fill-neutral-400' fontSize='10'>
          {legenda.base}
        </text>
        <rect
          x={W / 2}
          y={yLegenda - 8}
          width={14}
          height={9}
          rx={2}
          fill={COR.recessivo}
        />
        <text x={W / 2 + 20} y={yLegenda} className='fill-neutral-400' fontSize='10'>
          {legenda.comparado}
        </text>

        {/* Os quatro testes da régua. Acende (disco cheio) o teste em que o rótulo NÃO
            passa: é o achado, e por isso ele leva o ouro do papel de destaque. O que
            passa fica como anel vazado — distinção por forma, não só por cor. */}
        {/* Regua entre a legenda das barras e os testes: sao dois vocabularios de marca
            diferentes, e sem a separacao o leitor os junta numa lista so'. */}
        {regua ? (
          <line
            x1={PAD.left}
            y1={yLegenda + 14}
            x2={W - PAD.right}
            y2={yLegenda + 14}
            stroke={COR.regua}
            strokeWidth={1}
          />
        ) : null}

        {regua
          ? (testes ?? []).map((t, i) => {
              const y = yTestes + i * TESTE_ROW_H;
              return (
                <g key={t.pergunta}>
                  <circle
                    cx={TESTE_MARCA_X}
                    cy={y - 4}
                    r={5.5}
                    fill={t.passa ? 'none' : COR.destaque}
                    stroke={t.passa ? COR.recessivo : COR.destaque}
                    strokeWidth={1.5}
                  />
                  <text
                    x={TESTE_PERGUNTA_X}
                    y={y}
                    className='fill-neutral-200'
                    fontSize='10'
                  >
                    {t.pergunta}
                  </text>
                  <text
                    x={TESTE_VEREDITO_X}
                    y={y}
                    fill={t.passa ? COR.recessivo : COR.destaque}
                    fontSize='9.5'
                  >
                    {t.veredito}
                  </text>
                </g>
              );
            })
          : null}

        {regua ? (
          <line
            x1={PAD.left}
            y1={yConclusao - 12}
            x2={W - PAD.right}
            y2={yConclusao - 12}
            stroke={COR.regua}
            strokeWidth={1}
          />
        ) : null}

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
