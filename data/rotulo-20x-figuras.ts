/**
 * ══════════════════════════════════════════════════════════════════════
 * Dados das cinco figuras de `rotulo-20x-anthropic`
 * ══════════════════════════════════════════════════════════════════════
 *
 * Arquivo novo de propósito — nada aqui entra em `data/artigos-charts.ts`, que é
 * compartilhado. `compileMDX` só entrega prop STRING ao componente, então a estrutura vem
 * daqui por `dataset="<chave>"` e nunca de expressão dentro do `.mdx`.
 *
 * FORMA DO ARQUIVO, e ela não é estilo: um `export const <família>Datasets: Record<>` por
 * família, com os datasets INLINE. O medidor de rótulos do acervo
 * (`scripts/charts/checar-rotulos-svg.py`) avalia este TS como JS depois de tirar `import`,
 * `interface` e `type` por expressão regular — anotação em `const` interno ou em parâmetro
 * de função sobrevive ao filtro e chega ao `node`. Hoje ela passaria, porque o node desta
 * máquina (v26) tira tipo sozinho; num node sem isso o gate B3 morreria em
 * "não consegui avaliar". A forma abaixo é a que os catorze módulos irmãos de `data/` usam
 * e a única que o contrato do medidor promete. *(Medido em 2026-09-05: a versão anterior,
 * com `const figN: Tipo` e helpers `cel`/`raz` tipados, era digerida só pelo node local.)*
 *
 * ── PROCEDÊNCIA DE CADA NÚMERO ───────────────────────────────────────────────────────
 * Toda cifra das figuras 2, 3, 4 e 5 é célula ou razão do snapshot A (captura de
 * 2025-09-17 do artigo de ajuda `11145838`), tabelada em
 * `dossies/max-plan-anthropic-20x/RELATORIO-F2.md` §1 (células A01 a A12) e §4 (as dez
 * razões). Nenhum valor foi estimado, nenhum ponto médio de faixa entrou em conta, e
 * numerador e denominador de toda razão saem da MESMA coluna da MESMA captura.
 *
 * A figura 1 é a única sem medição, e por isso é a única cuja procedência diz isso
 * dentro do SVG: é a analogia do degrau 1, cena inventada. `PADRAO-ARTIGO.md` §5 —
 * dado que não existe não vira gráfico; o que existe é figura qualitativa que declara
 * ser qualitativa.
 *
 * ── ORÇAMENTO POR VAGA (px na Fahkwang real, e por isso não é estimativa) ─────────────
 * MEDIDO por `dossies/max-plan-anthropic-20x/assets/checar-figuras-rotulo20x.py --orcamento`,
 * que importa a geometria do medidor do acervo — um desenho, dois vereditos. Os TTF de
 * `scripts/charts/fonts/` e os de `redacao/fontes-medidor/` são o MESMO arquivo (sha256
 * conferido em 2026-09-05), então as duas medições não podem divergir por fonte.
 *
 *   vaga                     parede   maior uso hoje   texto mais largo
 *   MedidorDuplo
 *     painel.titulo .......... 360 px      150 px  42%   'Sessão de cinco horas'
 *     painel.unidade ......... 360 px      207 px  57%   'a janela em que ele não descreve...'
 *     painel.planos.nome ......  92 px       65 px  71%   'plano básico'
 *     painel.planos.valor .....  92 px       71 px  77%   'vinte medidas'
 *     painel.razaoRotulo ..... 336 px       69 px  21%   '20,0'
 *     painel.razaoConta ...... 336 px       94 px  28%   '240 ÷ 40 e 480 ÷ 80'
 *     testes.pergunta ........ 470 px      186 px  40%   'A promessa vale nos dois extremos?'
 *     testes.veredito ........ 262 px      168 px  64%   'não: na semanal, 1,714 para 5 e 20'
 *   MatrizJanelas
 *     grupos.rotulo .......... 312 px      137 px  44%   'Sessão de cinco horas'
 *     colunas.rotulo ......... 156 px      121 px  77%   'prompts de Claude Code'
 *     linhas.rotulo .......... 128 px       99 px  77%   'Max 20x ÷ Max 5x'
 *     linhas.celulas.valor ... 156 px       80 px  52%   '1,6 e 1,143'
 *     linhas.celulas.conta ... 156 px       95 px  61%   '240 ÷ 140 e 480 ÷ 280'
 *     linhas.celulas.nota .... 156 px       93 px  60%   'o plano não tinha Opus'
 *   Comuns às duas (props do .mdx e conclusão)
 *     title .................. 760 px      493 px  65%   'A grade que a página publicava em...'
 *     subtitle ............... 760 px      413 px  54%   'Três planos, quatro unidades,...'
 *     source ................. 760 px      692 px  91%   'Fonte: painéis e os dois últimos vereditos...'
 *     conclusao .............. 760 px      638 px  84%   'A régua é do artigo; dois testes são cond...'
 *     legenda.* .............. 380 px      204 px  54%   'não se aplica — não havia o que publicar'
 *
 * MEDIÇÃO DE 2026-09-07, DEPOIS DOS CONSERTOS DA RODADA 4 (T18) — recontada vaga a vaga, não
 * herdada. A vaga mais apertada é o `source`, com 91% da parede, e nenhuma passa disso. As
 * duas que subiram são as que a T18 tocou: o `source` da fig 5, que passou a nomear os dois
 * corpora, e a `conclusao` da fig 5, que passou a dizer que um dos quatro testes é o quarto
 * falsificador do critério. As outras onze vagas não mudaram desde 2026-09-06.
 *
 * 🔥 POR QUE ESTA TABELA É RECONTADA E NÃO HERDADA: entre 2026-09-05 e 2026-09-06 os textos
 * desenhados mudaram, a tabela ficou parada, e a frase que a fechava ("a vaga mais apertada
 * usa 77%") passou a MENTIR — o `source` da fig 5 estava a 97% (734,6 px de 760) e ninguém
 * tinha recontado. Com `PAD.left` e `PAD.right` de 8 px, a parede efetiva é 744: sobravam
 * 9 px. O gate `charts:labels` não pega isso, porque para estas duas famílias ele mede FOLGA,
 * não orçamento — quem mede orçamento aqui é só o `--orcamento` do dossiê. Regra que fica:
 * conserto que muda texto DESENHADO roda `--orcamento` e regrava esta tabela na mesma passagem.
 * Quem traduzir roda `--orcamento` de novo: o locale que estourar reprova ANTES de virar
 * rótulo cortado.
 *
 * `conclusao` e `nota` são LISTAS de linha, não string única: em linha única a conclusão
 * da figura 3 media 969 px contra uma parede de 744, e a nota da célula que não se aplica
 * media 161 px contra uma célula de 156. Quebrar no dataset é o padrão da casa
 * (`ObligationMatrix`) e é o que sobrevive à tradução, que alonga.
 *
 * ── PAPEL DA COR (PADRAO-ARTIGO.md §3, papéis relidos ao vivo em 2026-09-05 no cabeçalho
 *    de `data/artigos-charts.ts`) ────────────────────────────────────────────────────
 * O ouro `#a48f65` é o papel de DESTAQUE e vai no que o leitor deve ver primeiro: **a
 * janela semanal**, que é onde o rótulo deixa de descrever a escada. O azul `#60a5fa` é a
 * série-tese e fica na janela de cinco horas. Nenhuma figura usa ouro para "mais uma
 * série", e o âmbar não aparece — ouro e âmbar dividem a matiz 84° e se confundem lado a
 * lado. Verde e vermelho ficam reservados a bom/ruim e também não aparecem: o veredito de
 * cada teste da régua se distingue por FORMA (disco cheio contra anel vazado), não por cor.
 */

/** Papel de cor, nomeado por FUNÇÃO e nunca por matiz. */
export type Papel = 'destaque' | 'serie' | 'recessivo';

// ── MedidorDuplo ─────────────────────────────────────────────────────────────────────

export interface MedidorPlano {
  /** Nome do plano, como o leitor o vê na página. */
  nome: string;
  /**
   * O que está publicado naquela janela, na grafia da fonte ("240-480 h") — com uma única
   * abreviação, declarada no corpo do artigo: nas SEIS células da janela de sessão a página
   * escreve `approximately` antes do número (45, 10-40, 225, 50-200, 900, 200-800) e aqui
   * o til faz o papel dela, porque a palavra por extenso estoura a vaga de 92 px. As cinco
   * células da janela semanal não trazem `approximately` na fonte e entram sem til.
   * Medido em `evidencia/corpus-11145838/20250917042709.txt`: sete ocorrências da palavra,
   * seis antes de um número de célula (todas da janela de sessão) e uma numa frase sobre
   * velocidade de modelo, que não é célula.
   */
  valor: string;
  /**
   * Quantas vezes este plano vale a BASE do painel — e é uma razão medida, não uma
   * escolha de desenho: cada valor aqui é uma das dez razões do `RELATORIO-F2.md` §4,
   * dentro do snapshot A. A base vale 1.
   *
   * Por que múltiplo e não proporção do maior: o múltiplo é ADIMENSIONAL, então a
   * barra de um painel pode ser lida contra a do outro mesmo que um meça mensagens e
   * o outro meça horas. Normalizado por painel (o maior virando 1), o plano caro dos
   * dois painéis desenhava o MESMO comprimento — e a figura dizia o contrário da
   * frase que ela ilustra. Pego no render, que é o único gate que vê isso.
   */
  multiplo: number;
  /** Marca este plano como a base contra a qual a razão do painel é lida. */
  base?: boolean;
}

export interface MedidorPainel {
  /** A janela: "por visita", "sessão de 5 horas". */
  titulo: string;
  /** A unidade medida naquele painel, em uma linha curta. */
  unidade: string;
  papel: Papel;
  planos: MedidorPlano[];
  /** A razão que o painel exibe, já como o leitor a lê: "20x", "6x". */
  razaoRotulo: string;
  /** A conta, quando ela existe. Vazia na cena da analogia, que não mede nada. */
  razaoConta: string;
}

export interface MedidorTeste {
  pergunta: string;
  veredito: string;
  /** `false` ACENDE a marca: é o teste em que o rótulo não passa, e é o achado. */
  passa: boolean;
}

export interface MedidorDuploDados {
  /** Cena: `analogia` (fig 1), `nomeada` (fig 2), `regua` (fig 5). */
  modo: 'analogia' | 'nomeada' | 'regua';
  paineis: [MedidorPainel, MedidorPainel];
  /** Frase-conclusão desenhada abaixo dos dois painéis, uma linha por item. */
  conclusao: string[];
  /** Os quatro testes da régua — só a cena `regua` os desenha. */
  testes?: MedidorTeste[];
  legenda: { base: string; comparado: string };
}

// ── MatrizJanelas ────────────────────────────────────────────────────────────────────

/**
 * Dois estados, e a distância entre eles é o que a figura tem de mais frágil a perder:
 * `publicada` traz número; `naoAplicavel` diz que não havia o que publicar. O estado
 * "existia e saiu da página" NÃO existe aqui de propósito — dentro do snapshot A nenhuma
 * célula tinha saído ainda, e uma chave de legenda sem marca correspondente no desenho é
 * uma promessa que a imagem não cumpre.
 */
export type EstadoCelula = 'publicada' | 'naoAplicavel';

export interface MatrizCelula {
  estado: EstadoCelula;
  /** O número publicado, na grafia da fonte — com a mesma abreviação de `~45` acima. Vazio quando não há. */
  valor: string;
  /** A conta, na cena das razões. Vazia na cena das células. */
  conta: string;
  /** O porquê, quando o estado não é `publicada`. Uma linha por item. */
  nota: string[];
}

export interface MatrizJanelasDados {
  /**
   * As duas janelas, cada uma cobrindo as colunas que lhe pertencem. NÃO há campo de
   * cena aqui: a diferença entre a grade das células e a das razões é toda de DADO
   * (o rótulo da linha, o valor, a conta), e um campo que o componente nunca lê seria
   * indireção sem segundo uso.
   */
  grupos: { rotulo: string; colunas: number; papel: Papel }[];
  /** Uma por coluna, na ordem em que os grupos as cobrem. */
  colunas: { rotulo: string }[];
  /** Uma por linha: plano (cena `celulas`) ou razão (cena `razoes`). */
  linhas: { rotulo: string; celulas: MatrizCelula[] }[];
  conclusao: string[];
  legenda: { publicada: string; naoAplicavel: string };
}

/**
 * FIGURA 1 — degrau 1, a analogia. Nenhum número aqui é medição.
 * FIGURA 2 — degrau 2, a mesma catraca com os nomes reais. Células A01, A05, A09
 *            (sessão, mensagens) e A03, A07, A11 (semanal, horas de Sonnet). Esta numeração
 *            é INTERNA (`RELATORIO-F2.md` §1) e saiu dos `source` do `.mdx` em 2026-09-06:
 *            o leitor nunca teve a chave, e citar identificador que não resolve em nada
 *            publicado é a falha que o próprio artigo cobra de quem cita norma sem custódia.
 *            Não repor nos `source`.
 * FIGURA 5 — degrau 5, retoma a geometria da figura 1 com os quatro testes da régua.
 *            Os dois ÚLTIMOS testes são os critérios T2 e T3 da §7.2 do RELATORIO-F2.md,
 *            fixados antes do veredito. Dos dois PRIMEIROS, o da janela nomeada consta do mesmo
 *            critério — como o QUARTO FALSIFICADOR, não como condição —, e o do denominador
 *            publicado não consta de forma nenhuma. Logo TRÊS dos quatro são anteriores ao
 *            veredito, e o `subtitle` que contava dois foi corrigido na rodada 5.
 */
export const medidorDuploDatasets: Record<string, MedidorDuploDados> = {
  'rotulo20x-fig1-pt-br': {
    modo: 'analogia',
    paineis: [
      {
        titulo: 'O medidor da visita',
        unidade: 'quanto se usa de cada vez',
        papel: 'serie',
        planos: [
          { nome: 'plano básico', valor: 'uma medida', multiplo: 1, base: true },
          { nome: 'plano caro', valor: 'vinte medidas', multiplo: 20 },
        ],
        razaoRotulo: '20x',
        razaoConta: '',
      },
      {
        titulo: 'O medidor da semana',
        unidade: 'quanto se usa no total da semana',
        papel: 'destaque',
        planos: [
          { nome: 'plano básico', valor: 'uma medida', multiplo: 1, base: true },
          { nome: 'plano caro', valor: 'seis medidas', multiplo: 6 },
        ],
        razaoRotulo: '6x',
        razaoConta: '',
      },
    ],
    conclusao: [
      'A placa na parede diz «vinte vezes». Ela é verdadeira num medidor e falsa no outro —',
      'e não diz em qual dos dois está falando.',
    ],
    legenda: { base: 'o plano de comparação', comparado: 'o plano anunciado' },
  },

  'rotulo20x-fig2-pt-br': {
    modo: 'nomeada',
    paineis: [
      {
        titulo: 'Sessão de cinco horas',
        unidade: 'mensagens a cada cinco horas',
        papel: 'serie',
        planos: [
          { nome: 'Pro', valor: '~45', multiplo: 1, base: true },
          { nome: 'Max 5x', valor: '~225', multiplo: 5 },
          { nome: 'Max 20x', valor: '~900', multiplo: 20 },
        ],
        razaoRotulo: '20,0',
        razaoConta: '900 ÷ 45',
      },
      {
        titulo: 'Teto semanal',
        unidade: 'horas de Sonnet 4 por semana',
        papel: 'destaque',
        planos: [
          { nome: 'Pro', valor: '40-80 h', multiplo: 1, base: true },
          { nome: 'Max 5x', valor: '140-280 h', multiplo: 3.5 },
          { nome: 'Max 20x', valor: '240-480 h', multiplo: 6 },
        ],
        razaoRotulo: '6,0',
        razaoConta: '240 ÷ 40 e 480 ÷ 80',
      },
    ],
    conclusao: [
      'O mesmo rótulo, o mesmo par de planos na conta, a mesma captura de 17/09/2025 — e duas contas',
      'diferentes, porque o medidor é outro.',
    ],
    legenda: { base: 'o denominador da razão', comparado: 'o plano que o rótulo nomeia' },
  },

  'rotulo20x-fig5-pt-br': {
    modo: 'regua',
    paineis: [
      {
        titulo: 'Sessão de cinco horas',
        unidade: 'a janela em que o rótulo é exato',
        papel: 'serie',
        planos: [
          { nome: 'Pro', valor: '~45', multiplo: 1, base: true },
          { nome: 'Max 20x', valor: '~900', multiplo: 20 },
        ],
        razaoRotulo: '20,0',
        razaoConta: '900 ÷ 45',
      },
      {
        titulo: 'Teto semanal',
        unidade: 'a janela em que ele não descreve a escada',
        papel: 'destaque',
        planos: [
          { nome: 'Pro', valor: '40-80 h', multiplo: 1, base: true },
          { nome: 'Max 20x', valor: '240-480 h', multiplo: 6 },
        ],
        razaoRotulo: '6,0',
        razaoConta: '240 ÷ 40 e 480 ÷ 80',
      },
    ],
    testes: [
      {
        pergunta: 'O multiplicador nomeia a janela?',
        veredito: 'não, na forma que abre a página',
        passa: false,
      },
      {
        pergunta: 'O denominador está publicado?',
        veredito: 'sim, estava — até 26/01/2026',
        passa: true,
      },
      {
        pergunta: 'A promessa vale nos dois extremos?',
        veredito: 'não: na semanal dá 6,0 nos dois',
        passa: false,
      },
      {
        pergunta: 'Distingue os degraus que anuncia?',
        veredito: 'não: na semanal, 1,714 para 5 e 20',
        passa: false,
      },
    ],
    conclusao: [
      'A régua é do artigo; dois testes são condições do critério fixado antes do veredito e um é o quarto falsificador dele.',
      'Dois dos quatro acendem só na janela semanal. O primeiro acende em qualquer uma,',
      'porque a forma não qualificada do rótulo não nomeia janela.',
    ],
    legenda: {
      base: 'barra vazada: o denominador da razão',
      comparado: 'barra cheia: o plano que o rótulo nomeia',
    },
  },
};

/**
 * FIGURA 3 — degrau 4, a matriz do snapshot A: onze células publicadas e uma que não se
 *            aplica. Células A01 a A12 do RELATORIO-F2.md §1.
 * FIGURA 4 — degrau 3, a mesma geometria com as razões por coluna. As dez razões do §4,
 *            cada uma dentro do snapshot A. As duas células vazias da coluna de Opus são
 *            consequência direta de a célula A04 não se aplicar ao Pro: sem denominador
 *            publicado não há razão a calcular, e isso é diferente de razão ausente.
 */
export const matrizJanelasDatasets: Record<string, MatrizJanelasDados> = {
  'rotulo20x-fig3-pt-br': {
    grupos: [
      { rotulo: 'Sessão de cinco horas', colunas: 2, papel: 'serie' },
      { rotulo: 'Teto semanal', colunas: 2, papel: 'destaque' },
    ],
    colunas: [
      { rotulo: 'mensagens' },
      { rotulo: 'prompts de Claude Code' },
      { rotulo: 'horas de Sonnet 4' },
      { rotulo: 'horas de Opus 4' },
    ],
    linhas: [
      {
        rotulo: 'Pro',
        celulas: [
          { estado: 'publicada', valor: '~45', conta: '', nota: [] },
          { estado: 'publicada', valor: '~10-40', conta: '', nota: [] },
          { estado: 'publicada', valor: '40-80', conta: '', nota: [] },
          {
            estado: 'naoAplicavel',
            valor: '',
            conta: '',
            nota: ['o plano não tinha Opus', 'no Claude Code'],
          },
        ],
      },
      {
        rotulo: 'Max 5x',
        celulas: [
          { estado: 'publicada', valor: '~225', conta: '', nota: [] },
          { estado: 'publicada', valor: '~50-200', conta: '', nota: [] },
          { estado: 'publicada', valor: '140-280', conta: '', nota: [] },
          { estado: 'publicada', valor: '15-35', conta: '', nota: [] },
        ],
      },
      {
        rotulo: 'Max 20x',
        celulas: [
          { estado: 'publicada', valor: '~900', conta: '', nota: [] },
          { estado: 'publicada', valor: '~200-800', conta: '', nota: [] },
          { estado: 'publicada', valor: '240-480', conta: '', nota: [] },
          { estado: 'publicada', valor: '24-40', conta: '', nota: [] },
        ],
      },
    ],
    conclusao: [
      'Onze células publicadas numa página só, em 17/09/2025. A célula que falta não está',
      'ausente: ela não se aplica, e a diferença é o que essa tabela tem de mais frágil a perder.',
    ],
    legenda: {
      publicada: 'número publicado na captura',
      naoAplicavel: 'não se aplica — não havia o que publicar',
    },
  },

  'rotulo20x-fig4-pt-br': {
    grupos: [
      { rotulo: 'Sessão de cinco horas', colunas: 2, papel: 'serie' },
      { rotulo: 'Teto semanal', colunas: 2, papel: 'destaque' },
    ],
    colunas: [
      { rotulo: 'mensagens' },
      { rotulo: 'prompts de Claude Code' },
      { rotulo: 'horas de Sonnet 4' },
      { rotulo: 'horas de Opus 4' },
    ],
    linhas: [
      {
        rotulo: 'Max 20x ÷ Pro',
        celulas: [
          { estado: 'publicada', valor: '20,0', conta: '900 ÷ 45', nota: [] },
          { estado: 'publicada', valor: '20,0', conta: '200 ÷ 10 e 800 ÷ 40', nota: [] },
          { estado: 'publicada', valor: '6,0', conta: '240 ÷ 40 e 480 ÷ 80', nota: [] },
          {
            estado: 'naoAplicavel',
            valor: '',
            conta: '',
            nota: ['o Pro não tinha hora', 'de Opus a dividir'],
          },
        ],
      },
      {
        rotulo: 'Max 5x ÷ Pro',
        celulas: [
          { estado: 'publicada', valor: '5,0', conta: '225 ÷ 45', nota: [] },
          { estado: 'publicada', valor: '5,0', conta: '50 ÷ 10 e 200 ÷ 40', nota: [] },
          { estado: 'publicada', valor: '3,5', conta: '140 ÷ 40 e 280 ÷ 80', nota: [] },
          {
            estado: 'naoAplicavel',
            valor: '',
            conta: '',
            nota: ['o Pro não tinha hora', 'de Opus a dividir'],
          },
        ],
      },
      {
        rotulo: 'Max 20x ÷ Max 5x',
        celulas: [
          { estado: 'publicada', valor: '4,0', conta: '900 ÷ 225', nota: [] },
          { estado: 'publicada', valor: '4,0', conta: '200 ÷ 50 e 800 ÷ 200', nota: [] },
          { estado: 'publicada', valor: '1,714', conta: '240 ÷ 140 e 480 ÷ 280', nota: [] },
          { estado: 'publicada', valor: '1,6 e 1,143', conta: '24 ÷ 15 e 40 ÷ 35', nota: [] },
        ],
      },
    ],
    conclusao: [
      'Na janela de ouro, o rótulo que diz 20 dá 6,0 nas horas de Sonnet, e a escada que',
      'anuncia 5 e 20 aparece como 1,714. Nas duas colunas da esquerda ele é exato.',
    ],
    legenda: {
      publicada: 'razão dentro da mesma captura',
      naoAplicavel: 'não havia denominador a dividir',
    },
  },
};
