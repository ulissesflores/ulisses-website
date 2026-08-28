/**
 * Séries dos gráficos usados no corpo dos posts de `/artigos`.
 *
 * Ficam aqui, e não dentro do .mdx, por uma limitação real do pipeline: o
 * `compileMDX` do next-mdx-remote entrega ao componente apenas os atributos
 * string do JSX — atributos de expressão (`series={[...]}`) chegam como
 * `undefined`. O corpo do artigo referencia a série pelo `id`; os números
 * ficam num arquivo revisável, com a procedência de cada um documentada.
 *
 * ── PALETA DATAVIZ DA MARCA (F4 lote 7, 2026-08-13; escuro único, decisão #1) ──
 * Instância derivada pela skill dataviz sobre a superfície real dos charts
 * (#14191f = bg-neutral-900/60 sobre o marinho #101d2a). Papéis:
 *   ouro (marca)  #a48f65  série-destaque; substituiu a série verde antiga
 *                 (hex proibidos pelos greps do DOD #4 — não citar aqui)
 *   azul          #60a5fa  série-tese / bloco 1
 *   âmbar         #fbbf24  série/bloco secundário
 *   cinzas        #64748b · #3f3f46  grupos recessivos ("fora da conversa")
 *   cinza-claro   #d4d4d8  linha recessiva quando cruza o ouro (frontier-bench)
 * Validação (validate_palette.js da skill dataviz, CVD MOF2009 sev 1.0, OKLab×100):
 *   trio azul·ouro·âmbar — CVD pior par 18,8 (protan) · visão normal 20,5 PASS
 *   waffle 5-cat — CVD 18,2 (deutan) · visão normal 18,7 PASS
 *   frontier-bench all-pairs (linhas se cruzam) — CVD 17,2 · normal 17,3 PASS
 * WAIVER deliberado: o ouro tem chroma OKLCH 0,063 < piso 0,10 da skill (o tom
 * mudo É o caráter da marca); identidade nunca é só-cor aqui — toda superfície
 * tem legenda rotulada + rótulos diretos e os números repetem em tabela no
 * corpo do artigo. Ouros mais cromáticos REPROVAM o piso de visão normal
 * contra o âmbar (mesma matiz 84°) — medido, não estimado.
 * Verde/vermelho ficam reservados a semântica (bom/ruim), nunca "série 4".
 */

export interface ChartSeries {
  label: string;
  /** Cor da linha — hex, para casar com a paleta do post. */
  color: string;
  /** Pares [custo em USD, pontuação em %]. O eixo X é logarítmico. */
  points: readonly (readonly [number, number])[];
}

export interface ChartDataset {
  series: readonly ChartSeries[];
  xDomain: readonly [number, number];
  yDomain: readonly [number, number];
  xTicks: readonly number[];
  yTicks: readonly number[];
}

/**
 * `opus5-frontier-bench` — Frontier-Bench v0.1, um ponto por nível de esforço
 * (`low` → `max`), eixo X em custo por tentativa.
 *
 * PROCEDÊNCIA: valores LIDOS VISUALMENTE do gráfico "Agentic coding by effort
 * level" publicado em https://www.anthropic.com/news/claude-opus-5 (a figura é
 * uma imagem, sem tabela anexa). São aproximações de leitura em escala
 * logarítmica — a forma das curvas é o dado, não a terceira casa decimal.
 * O texto do post declara isso ao leitor.
 * PALETA (lote 7): a série GPT-5.6 usa #d4d4d8 (não mais #a1a1aa) — a linha
 * ouro cruza todas; all-pairs com o cinza antigo media ΔE 9,2 (reprova o piso
 * 15), com #d4d4d8 mede 17,3 PASS.
 */
export const chartDatasets: Record<string, ChartDataset> = {
  'opus5-frontier-bench': {
    series: [
      {
        label: 'Opus 5',
        color: '#a48f65',
        points: [
          [5.6, 25.7],
          [8.5, 35.0],
          [10.5, 39.5],
          [14.5, 44.3],
          [16.5, 43.3],
        ],
      },
      {
        label: 'Fable 5',
        color: '#fbbf24',
        points: [
          [10.3, 18.0],
          [11.8, 25.0],
          [13.5, 29.0],
          [19.5, 31.5],
          [27.0, 33.7],
        ],
      },
      {
        label: 'Opus 4.8',
        color: '#60a5fa',
        points: [
          [4.7, 6.8],
          [7.2, 9.7],
          [8.2, 12.9],
          [11.5, 15.5],
          [17.0, 18.8],
        ],
      },
      {
        label: 'GPT-5.6 Sol',
        color: '#d4d4d8',
        points: [
          [1.05, 2.2],
          [2.6, 14.2],
          [3.7, 22.7],
          [5.6, 29.0],
          [11.5, 37.5],
        ],
      },
    ],
    xDomain: [1, 30],
    yDomain: [0, 50],
    xTicks: [1, 2, 3, 5, 10, 20, 30],
    yTicks: [0, 10, 20, 30, 40, 50],
  },

  /**
   * `v4flash-aa-pareto` — Artificial Analysis Intelligence Index x preço de
   * saída (US$/1M tokens), um ponto por modelo; o V4-Flash aparece duas vezes
   * no mesmo X (US$ 0,28) para desenhar o salto abril -> julho como segmento
   * vertical.
   *
   * PROCEDÊNCIA: índice AA de 31/07/2026 (0731 = 50; V4-Pro = 44; Opus 5 = 61,
   * via officechai.com/ai/deepseek-v4-flash-0731-scores-50-on-artificial-analysis-intelligence-index);
   * o ponto do preview de abril (≈40) é DERIVADO do "ganho de 10 pontos com
   * preço idêntico" noticiado, não de medição direta — o post declara isso ao
   * leitor. Preços: tabelas oficiais DeepSeek
   * (api-docs.deepseek.com/quick_start/pricing, conferida em 01/08/2026) e
   * Anthropic (US$ 25 output, reconferida em 01/08/2026).
   */
  'v4flash-aa-pareto': {
    series: [
      {
        label: 'V4-Flash abr→jul',
        color: '#a48f65',
        points: [
          [0.28, 40],
          [0.28, 50],
        ],
      },
      {
        label: 'V4-Pro',
        color: '#60a5fa',
        points: [[0.87, 44]],
      },
      {
        label: 'Opus 5',
        color: '#fbbf24',
        points: [[25, 61]],
      },
    ],
    xDomain: [0.1, 40],
    yDomain: [35, 65],
    xTicks: [0.1, 0.3, 1, 3, 10, 30],
    yTicks: [35, 40, 45, 50, 55, 60, 65],
  },

  /* ── estatisticas-agentes-de-ia (pt-br, en, es, it) ── */
  /**
   * `agentes-custo-por-tarefa` — acurácia × custo por tarefa (US$, log), pares do mesmo
   * benchmark. PROCEDÊNCIA: HAL (hal.cs.princeton.edu, HTML lido em 13/08/2026): Online
   * Mind2Web — SeeAct + GPT-5 Medium 42,33% a US$ 171,07 · Browser-Use + Claude Sonnet 4 40,00%
   * a US$ 1.577,26; ScienceAgentBench — SAB Self-Debug + o4-mini Low 27,45% a US$ 3,95 · +
   * GPT-5 Medium 30,39% a US$ 18,26. TheAgentCompany (leaderboard.json, 13/08/2026):
   * TTE-MatrixAgent + DeepSeek-V3.2 42,86% a US$ 0,40 · OpenHands + Gemini 2.5 Pro 30,29% a
   * US$ 4,23. Ouro = o par em que o barato ganha por mais.
   */
  'agentes-custo-por-tarefa': {
    series: [
      {
        label: 'TheAgentCompany',
        color: '#a48f65',
        points: [
          [0.4, 42.86],
          [4.23, 30.29],
        ],
      },
      {
        label: 'HAL · Mind2Web',
        color: '#60a5fa',
        points: [
          [171.07, 42.33],
          [1577.26, 40.0],
        ],
      },
      {
        label: 'HAL · Science',
        color: '#fbbf24',
        points: [
          [3.95, 27.45],
          [18.26, 30.39],
        ],
      },
    ],
    xDomain: [0.3, 3000],
    yDomain: [0, 50],
    xTicks: [0.3, 1, 3, 10, 30, 100, 300, 1000, 3000],
    yTicks: [0, 10, 20, 30, 40, 50],
  },
  /**
   * `agentes-custo-por-tarefa-en` — acurácia × custo por tarefa (US$, log), pares do mesmo
   * benchmark. PROCEDÊNCIA: HAL (hal.cs.princeton.edu, HTML lido em 13/08/2026): Online
   * Mind2Web — SeeAct + GPT-5 Medium 42,33% a US$ 171,07 · Browser-Use + Claude Sonnet 4 40,00%
   * a US$ 1.577,26; ScienceAgentBench — SAB Self-Debug + o4-mini Low 27,45% a US$ 3,95 · +
   * GPT-5 Medium 30,39% a US$ 18,26. TheAgentCompany (leaderboard.json, 13/08/2026):
   * TTE-MatrixAgent + DeepSeek-V3.2 42,86% a US$ 0,40 · OpenHands + Gemini 2.5 Pro 30,29% a
   * US$ 4,23. Ouro = o par em que o barato ganha por mais.
   */
  'agentes-custo-por-tarefa-en': {
    series: [
      {
        label: 'TheAgentCompany',
        color: '#a48f65',
        points: [
          [0.4, 42.86],
          [4.23, 30.29],
        ],
      },
      {
        label: 'HAL · Mind2Web',
        color: '#60a5fa',
        points: [
          [171.07, 42.33],
          [1577.26, 40.0],
        ],
      },
      {
        label: 'HAL · Science',
        color: '#fbbf24',
        points: [
          [3.95, 27.45],
          [18.26, 30.39],
        ],
      },
    ],
    xDomain: [0.3, 3000],
    yDomain: [0, 50],
    xTicks: [0.3, 1, 3, 10, 30, 100, 300, 1000, 3000],
    yTicks: [0, 10, 20, 30, 40, 50],
  },
  /**
   * `agentes-custo-por-tarefa-es` — acurácia × custo por tarefa (US$, log), pares do mesmo
   * benchmark. PROCEDÊNCIA: HAL (hal.cs.princeton.edu, HTML lido em 13/08/2026): Online
   * Mind2Web — SeeAct + GPT-5 Medium 42,33% a US$ 171,07 · Browser-Use + Claude Sonnet 4 40,00%
   * a US$ 1.577,26; ScienceAgentBench — SAB Self-Debug + o4-mini Low 27,45% a US$ 3,95 · +
   * GPT-5 Medium 30,39% a US$ 18,26. TheAgentCompany (leaderboard.json, 13/08/2026):
   * TTE-MatrixAgent + DeepSeek-V3.2 42,86% a US$ 0,40 · OpenHands + Gemini 2.5 Pro 30,29% a
   * US$ 4,23. Ouro = o par em que o barato ganha por mais. Labels de série são nomes próprios
   * de benchmark — não traduzidos.
   */
  'agentes-custo-por-tarefa-es': {
    series: [
      {
        label: 'TheAgentCompany',
        color: '#a48f65',
        points: [
          [0.4, 42.86],
          [4.23, 30.29],
        ],
      },
      {
        label: 'HAL · Mind2Web',
        color: '#60a5fa',
        points: [
          [171.07, 42.33],
          [1577.26, 40.0],
        ],
      },
      {
        label: 'HAL · Science',
        color: '#fbbf24',
        points: [
          [3.95, 27.45],
          [18.26, 30.39],
        ],
      },
    ],
    xDomain: [0.3, 3000],
    yDomain: [0, 50],
    xTicks: [0.3, 1, 3, 10, 30, 100, 300, 1000, 3000],
    yTicks: [0, 10, 20, 30, 40, 50],
  },
  /**
   * `agentes-custo-por-tarefa-it` — acurácia × custo por tarefa (US$, log), pares do mesmo
   * benchmark. PROCEDÊNCIA: HAL (hal.cs.princeton.edu, HTML lido em 13/08/2026): Online
   * Mind2Web — SeeAct + GPT-5 Medium 42,33% a US$ 171,07 · Browser-Use + Claude Sonnet 4 40,00%
   * a US$ 1.577,26; ScienceAgentBench — SAB Self-Debug + o4-mini Low 27,45% a US$ 3,95 · +
   * GPT-5 Medium 30,39% a US$ 18,26. TheAgentCompany (leaderboard.json, 13/08/2026):
   * TTE-MatrixAgent + DeepSeek-V3.2 42,86% a US$ 0,40 · OpenHands + Gemini 2.5 Pro 30,29% a
   * US$ 4,23. Ouro = o par em que o barato ganha por mais. Series labels (nomes de benchmark)
   * não são traduzidos — nomes próprios.
   */
  'agentes-custo-por-tarefa-it': {
    series: [
      {
        label: 'TheAgentCompany',
        color: '#a48f65',
        points: [
          [0.4, 42.86],
          [4.23, 30.29],
        ],
      },
      {
        label: 'HAL · Mind2Web',
        color: '#60a5fa',
        points: [
          [171.07, 42.33],
          [1577.26, 40.0],
        ],
      },
      {
        label: 'HAL · Science',
        color: '#fbbf24',
        points: [
          [3.95, 27.45],
          [18.26, 30.39],
        ],
      },
    ],
    xDomain: [0.3, 3000],
    yDomain: [0, 50],
    xTicks: [0.3, 1, 3, 10, 30, 100, 300, 1000, 3000],
    yTicks: [0, 10, 20, 30, 40, 50],
  },
};

/* ── Waffle ──────────────────────────────────────────────────────────── */

export interface WaffleCategory {
  /** Linha 1 da legenda. */
  label: string;
  /** Linha 2 da legenda (valor humano por extenso). */
  sublabel: string;
  color: string;
  /** Pontos na grade (1 ponto ≈ população total / soma dos counts). */
  count: number;
}

export interface WaffleDataset {
  categories: readonly WaffleCategory[];
}

/**
 * `quantas-pessoas-usam-ia-waffle` — 2.500 pontos, 1 ponto ≈ 3,3 mi pessoas.
 *
 * PROCEDÊNCIA (verificada 02/08/2026): população 8,3 bi (UN WPP 2024);
 * offline 2,2 bi (ITU nov/2025) → 663 pontos; usam genAI 2,42 bi TETO
 * (DataReportal abr/2026, não-dedupado — a própria fonte desaconselha ler
 * como pessoas); pagantes 70-100 mi e coding agents 10-15 mi são
 * estimativas PRÓPRIAS declaradas em faixa no artigo (pontos usam os
 * médios 80 mi e 12,5 mi). Grupos EXCLUSIVOS (cada pessoa só na categoria
 * mais avançada): nunca-usou-online = 5,9 bi − 2,2 bi offline → 1.108;
 * usam sem pagar = 2,42 bi − 80 mi → 705; pagam sem agents = 80 − 12,5 mi
 * → 20; agents → 4. Soma fechada: 663+1108+705+20+4 = 2.500.
 */
/**
 * `glm53-ledger-status` — 2.436 pontos, 1 ponto = 1 vulnerabilidade.
 *
 * PROCEDÊNCIA (contagem própria, 14/08/2026): payload público do ledger em
 * https://cvd.z.ai/ledger/ (a página embute os 2.436 registros). Contados pelo
 * campo `status`: discovered 2.239 · reported 84 · sent_to_maintainer 1 ·
 * acknowledged 29 · patched 30 · revealed 53. Soma = 2.436, igual ao total
 * anunciado no painel do site. A severidade do mesmo payload reproduz o painel
 * (critical 107 + high 990 = 1.097), o que valida o parse.
 *
 * Categorias EXCLUSIVAS: `status` é o estágio ATUAL de cada achado, então cada
 * vulnerabilidade aparece uma vez só, no estágio mais avançado que alcançou.
 * Ordem = pipeline declarado pelo próprio site (Discovered -> Reported -> Sent
 * to maintainer -> Acknowledged -> Patched -> Publicly disclosed).
 */
export const waffleDatasets: Record<string, WaffleDataset> = {
  'glm53-ledger-status': {
    categories: [
      { label: 'Descoberta', sublabel: '2.239 · 92% — nunca reportada', color: '#3f3f46', count: 2239 },
      { label: 'Reportada', sublabel: '84 · 3,4%', color: '#64748b', count: 84 },
      { label: 'Enviada ao mantenedor', sublabel: '1 · 0,04%', color: '#a48f65', count: 1 },
      { label: 'Reconhecida', sublabel: '29 · 1,2%', color: '#60a5fa', count: 29 },
      { label: 'Corrigida', sublabel: '30 · 1,2%', color: '#34d399', count: 30 },
      { label: 'Divulgada publicamente', sublabel: '53 · 2,2% — 37 na véspera', color: '#fbbf24', count: 53 },
    ],
  },
  'glm53-ledger-status-en': {
    categories: [
      { label: 'Discovered', sublabel: '2,239 · 92% — never reported', color: '#3f3f46', count: 2239 },
      { label: 'Reported', sublabel: '84 · 3.4%', color: '#64748b', count: 84 },
      { label: 'Sent to maintainer', sublabel: '1 · 0.04%', color: '#a48f65', count: 1 },
      { label: 'Acknowledged', sublabel: '29 · 1.2%', color: '#60a5fa', count: 29 },
      { label: 'Patched', sublabel: '30 · 1.2%', color: '#34d399', count: 30 },
      { label: 'Publicly disclosed', sublabel: '53 · 2.2% — 37 on launch eve', color: '#fbbf24', count: 53 },
    ],
  },
  'glm53-ledger-status-es': {
    categories: [
      { label: 'Descubierta', sublabel: '2239 · 92 % — nunca reportada', color: '#3f3f46', count: 2239 },
      { label: 'Reportada', sublabel: '84 · 3,4 %', color: '#64748b', count: 84 },
      { label: 'Enviada al mantenedor', sublabel: '1 · 0,04 %', color: '#a48f65', count: 1 },
      { label: 'Reconocida', sublabel: '29 · 1,2 %', color: '#60a5fa', count: 29 },
      { label: 'Corregida', sublabel: '30 · 1,2 %', color: '#34d399', count: 30 },
      { label: 'Divulgada públicamente', sublabel: '53 · 2,2 % — 37 en la víspera', color: '#fbbf24', count: 53 },
    ],
  },
  'glm53-ledger-status-it': {
    categories: [
      { label: 'Scoperta', sublabel: '2.239 · 92% — mai segnalata', color: '#3f3f46', count: 2239 },
      { label: 'Segnalata', sublabel: '84 · 3,4%', color: '#64748b', count: 84 },
      { label: 'Inviata al manutentore', sublabel: '1 · 0,04%', color: '#a48f65', count: 1 },
      { label: 'Riconosciuta', sublabel: '29 · 1,2%', color: '#60a5fa', count: 29 },
      { label: 'Corretta', sublabel: '30 · 1,2%', color: '#34d399', count: 30 },
      { label: 'Divulgata pubblicamente', sublabel: '53 · 2,2% — 37 alla vigilia', color: '#fbbf24', count: 53 },
    ],
  },
  'glm53-ledger-status-he': {
    categories: [
      { label: 'התגלתה', sublabel: '2,239 · 92% — מעולם לא דווחה', color: '#3f3f46', count: 2239 },
      { label: 'דווחה', sublabel: '84 · 3.4%', color: '#64748b', count: 84 },
      { label: 'נשלחה למתחזק', sublabel: '1 · 0.04%', color: '#a48f65', count: 1 },
      { label: 'אושרה', sublabel: '29 · 1.2%', color: '#60a5fa', count: 29 },
      { label: 'תוקנה', sublabel: '30 · 1.2%', color: '#34d399', count: 30 },
      { label: 'פורסמה בפומבי', sublabel: '53 · 2.2% — 37 בערב ההשקה', color: '#fbbf24', count: 53 },
    ],
  },
  'quantas-pessoas-usam-ia-waffle': {
    categories: [
      { label: 'Offline', sublabel: '2,2 bi · 27%', color: '#3f3f46', count: 663 },
      { label: 'Online, nunca usou genAI', sublabel: '~3,7 bi · 44%', color: '#64748b', count: 1108 },
      { label: 'Usa genAI sem pagar', sublabel: '~2,3 bi · 28%', color: '#60a5fa', count: 705 },
      { label: 'Paga por IA', sublabel: '70-100 mi · ~1%', color: '#a48f65', count: 20 },
      { label: 'Usa coding agents', sublabel: '10-15 mi · ~0,14%', color: '#fbbf24', count: 4 },
    ],
  },
  'quantas-pessoas-usam-ia-waffle-en': {
    categories: [
      { label: 'Offline', sublabel: '2.2bn · 27%', color: '#3f3f46', count: 663 },
      { label: 'Online, never used genAI', sublabel: '~3.7bn · 44%', color: '#64748b', count: 1108 },
      { label: 'Uses genAI without paying', sublabel: '~2.3bn · 28%', color: '#60a5fa', count: 705 },
      { label: 'Pays for AI', sublabel: '70-100m · ~1%', color: '#a48f65', count: 20 },
      { label: 'Uses coding agents', sublabel: '10-15m · ~0.14%', color: '#fbbf24', count: 4 },
    ],
  },
  'quantas-pessoas-usam-ia-waffle-es': {
    categories: [
      { label: 'Offline', sublabel: '2200 millones · 27 %', color: '#3f3f46', count: 663 },
      { label: 'Online, nunca usó genAI', sublabel: '~3700 millones · 44 %', color: '#64748b', count: 1108 },
      { label: 'Usa genAI sin pagar', sublabel: '~2300 millones · 28 %', color: '#60a5fa', count: 705 },
      { label: 'Paga por IA', sublabel: '70-100 millones · ~1 %', color: '#a48f65', count: 20 },
      { label: 'Usa coding agents', sublabel: '10-15 millones · ~0,14 %', color: '#fbbf24', count: 4 },
    ],
  },
  'quantas-pessoas-usam-ia-waffle-it': {
    categories: [
      { label: 'Offline', sublabel: '2,2 mld · 27%', color: '#3f3f46', count: 663 },
      { label: 'Online, mai usata la genAI', sublabel: '~3,7 mld · 44%', color: '#64748b', count: 1108 },
      { label: 'Usa la genAI senza pagare', sublabel: '~2,3 mld · 28%', color: '#60a5fa', count: 705 },
      { label: 'Paga per l\'IA', sublabel: '70-100 mln · ~1%', color: '#a48f65', count: 20 },
      { label: 'Usa coding agents', sublabel: '10-15 mln · ~0,14%', color: '#fbbf24', count: 4 },
    ],
  },
  'quantas-pessoas-usam-ia-waffle-he': {
    categories: [
      { label: 'אופליין', sublabel: '2.2 מיליארד · 27%', color: '#3f3f46', count: 663 },
      { label: 'אונליין, לא השתמשו ב־GenAI', sublabel: '~3.7 מיליארד · 44%', color: '#64748b', count: 1108 },
      { label: 'משתמשים ב־GenAI בלי לשלם', sublabel: '~2.3 מיליארד · 28%', color: '#60a5fa', count: 705 },
      { label: 'משלמים על AI', sublabel: '70–100 מיליון · ~1%', color: '#a48f65', count: 20 },
      { label: 'משתמשים ב־coding agents', sublabel: '10–15 מיליון · ~0.14%', color: '#fbbf24', count: 4 },
    ],
  },

  /* * `estatisticas-chatgpt-denominador-waffle` — a régua trocada, em pontos.
   *
   * POR QUE ESTE GRÁFICO EXISTE, se o de barras já mostra os mesmos percentuais:
   * a barra mostra o RESULTADO da conta (11% vs 14,5%); o waffle mostra a
   * OPERAÇÃO — o mesmo bloco azul de usuários medido contra o quadro inteiro ou
   * contra o quadro menos o rodapé cinza-claro. É a única forma do artigo em que
   * o leitor VÊ o denominador sendo trocado, em vez de ler o resultado.
   *
   * A ARITMÉTICA FECHA NOS PRÓPRIOS PONTOS (é o teste do gráfico):
   * - 274 ÷ 2.500 = 10,96% -> "roughly 11% of the world's population"
   * - 274 ÷ (2.500 − 610) = 274 ÷ 1.890 = 14,50% -> a régua adulta do paper
   * Quem contar os pontos refaz as duas contas sem sair da figura.
   *
   * PROCEDÊNCIA (conferida em 03/08/2026):
   * - Banco Mundial, agregado mundial 2025: SP.POP.TOTL = 8.215.424.893 e
   *   SP.POP.0014.TO = 2.005.307.782 -> 15+ = 6.210.117.111.
   * - 900 mi = OpenAI, "Scaling AI for everyone" (27/02/2026).
   * - Escala: 2.500 pontos para 8,215 bi -> 1 ponto = 3.286.170 pessoas.
   *   900.000.000 ÷ 3.286.170 = 273,9 -> 274 · 2.005.307.782 ÷ 3.286.170 = 610,2
   *   -> 610 · resto = 1.616. Soma = 2.500, e a grade fecha em 50 linhas cheias.
   *
   * ORDEM DOS GRUPOS É SEMÂNTICA, não estética: os menores de 15 vêm por ÚLTIMO
   * para ocupar as ~12 linhas do rodapé — a régua adulta é literalmente "o quadro
   * menos o rodapé". Inverter a ordem quebra a leitura do gráfico.
   *
   * PALETA: as três cores são reuso exato do waffle de `quantas-pessoas-usam-ia`
   * (validação CVD de 02/08/2026 já feita sobre elas). O cinza mais escuro é o
   * grupo recessivo — aqui, o que a régua adulta remove.
   */
  'estatisticas-chatgpt-denominador-waffle': {
    categories: [
      {
        label: 'Os 900 milhões',
        sublabel: '274 pontos · 11,0%',
        color: '#60a5fa',
        count: 274,
      },
      {
        label: 'Resto da população 15+',
        sublabel: '1.616 pontos',
        color: '#64748b',
        count: 1616,
      },
      {
        label: 'Menores de 15 anos',
        sublabel: '610 pontos · fora da régua',
        color: '#3f3f46',
        count: 610,
      },
    ],
  },
  'estatisticas-chatgpt-denominador-waffle-en': {
    categories: [
      { label: 'The 900 million', sublabel: '274 dots · 11.0%', color: '#60a5fa', count: 274 },
      { label: 'Rest of 15+ population', sublabel: '1,616 dots', color: '#64748b', count: 1616 },
      { label: 'Under 15', sublabel: '610 dots · outside the ruler', color: '#3f3f46', count: 610 },
    ],
  },
  'estatisticas-chatgpt-denominador-waffle-es': {
    categories: [
      { label: 'Los 900 millones', sublabel: '274 puntos · 11,0 %', color: '#60a5fa', count: 274 },
      { label: 'Resto población 15+', sublabel: '1616 puntos', color: '#64748b', count: 1616 },
      { label: 'Menores de 15 años', sublabel: '610 puntos · fuera de regla', color: '#3f3f46', count: 610 },
    ],
  },
  'estatisticas-chatgpt-denominador-waffle-it': {
    categories: [
      { label: 'I 900 milioni', sublabel: '274 punti · 11,0%', color: '#60a5fa', count: 274 },
      { label: 'Resto popolazione 15+', sublabel: '1.616 punti', color: '#64748b', count: 1616 },
      { label: 'Minori di 15 anni', sublabel: '610 punti · fuori dal metro', color: '#3f3f46', count: 610 },
    ],
  },
  'estatisticas-chatgpt-denominador-waffle-he': {
    categories: [
      { label: 'ה־900 מיליון', sublabel: '274 נקודות · 11.0%', color: '#60a5fa', count: 274 },
      { label: 'שאר האוכלוסייה 15+', sublabel: '1,616 נקודות', color: '#64748b', count: 1616 },
      { label: 'מתחת לגיל 15', sublabel: '610 נקודות · מחוץ לסרגל', color: '#3f3f46', count: 610 },
    ],
  },

  /* ── 3. `estatisticas-claude-brasil-waffle` — para que o Brasil usa ──────────
   *
   * UNIDADE: pontos. 1.000 pontos, 1 ponto = 0,1% do uso brasileiro do Claude.
   *
   * PROCEDÊNCIA (medida em 10/08/2026, `extrair-brasil-aei.py`, janela
   * 2026-05-01 a 2026-06-01): use_case_work_pct = 57,35 -> 574 pontos;
   * use_case_personal_pct = 31,12 -> 311; use_case_coursework_pct = 11,52 ->
   * 115. Soma fechada: 574 + 311 + 115 = 1.000 (57,35 + 31,12 + 11,52 = 99,99;
   * o 0,01 restante é arredondamento do próprio dataset).
   *
   * A ORDEM É SEMÂNTICA: trabalho primeiro porque a tese da seção é "o Brasil
   * usa o Claude para trabalhar" (Brasil e Bálcãs = maior proporção de uso
   * profissional do mundo, relatório de geografia da Anthropic).
   *
   * PALETA: instância da marca (header deste arquivo, lote 7 2026-08-13) — azul =
   * o grupo-tese (trabalho), ouro = uso pessoal, âmbar = estudo; trio validado
   * CVD 18,8 · visão normal 20,5.
   */
  'estatisticas-claude-brasil-waffle': {
    categories: [
      { label: 'Trabalho', sublabel: '57,4% · 574 pontos', color: '#60a5fa', count: 574 },
      { label: 'Uso pessoal', sublabel: '31,1% · 311 pontos', color: '#a48f65', count: 311 },
      { label: 'Estudo', sublabel: '11,5% · 115 pontos', color: '#fbbf24', count: 115 },
    ],
  },
  'estatisticas-claude-brasil-waffle-en': {
    categories: [
      { label: 'Work', sublabel: '57.4% · 574 dots', color: '#60a5fa', count: 574 },
      { label: 'Personal use', sublabel: '31.1% · 311 dots', color: '#a48f65', count: 311 },
      { label: 'Study', sublabel: '11.5% · 115 dots', color: '#fbbf24', count: 115 },
    ],
  },
  'estatisticas-claude-brasil-waffle-es': {
    categories: [
      { label: 'Trabajo', sublabel: '57,4 % · 574 puntos', color: '#60a5fa', count: 574 },
      { label: 'Uso personal', sublabel: '31,1 % · 311 puntos', color: '#a48f65', count: 311 },
      { label: 'Estudio', sublabel: '11,5 % · 115 puntos', color: '#fbbf24', count: 115 },
    ],
  },
  'estatisticas-claude-brasil-waffle-it': {
    categories: [
      { label: 'Lavoro', sublabel: '57,4% · 574 punti', color: '#60a5fa', count: 574 },
      { label: 'Uso personale', sublabel: '31,1% · 311 punti', color: '#a48f65', count: 311 },
      { label: 'Studio', sublabel: '11,5% · 115 punti', color: '#fbbf24', count: 115 },
    ],
  },
  'estatisticas-claude-brasil-waffle-he': {
    categories: [
      { label: 'עבודה', sublabel: '57.4% · 574 נקודות', color: '#60a5fa', count: 574 },
      { label: 'שימוש אישי', sublabel: '31.1% · 311 נקודות', color: '#a48f65', count: 311 },
      { label: 'לימודים', sublabel: '11.5% · 115 נקודות', color: '#fbbf24', count: 115 },
    ],
  },
  /* ── 3. `estatisticas-claude-code-runrate-waffle` — a fatia, na mesma data ────
   *
   * UNIDADE: pontos. 1.000 pontos, 1 ponto = 0,1% do run rate anualizado da
   * Anthropic. A grade fecha em 20 linhas cheias de 50.
   *
   * POR QUE ESTE GRÁFICO EXISTE: a página conferida publica "~13%" dividindo o
   * Claude Code de FEVEREIRO pela empresa de MARÇO. O waffle mostra a divisão com
   * numerador e denominador da MESMA data e da MESMA página oficial — é a figura
   * que torna visível o erro de régua, não o resultado dele.
   *
   * A ARITMÉTICA FECHA NOS PRÓPRIOS PONTOS: 179 ÷ 1.000 = 17,9% ≈ os 2,5 ÷ 14 =
   * 17,86% do comunicado. 179 + 821 = 1.000.
   *
   * PROCEDÊNCIA (uma fonte só, conferida em 11/08/2026): anúncio oficial da
   * Série G, Anthropic, 12/02/2026 — "more than $2.5 billion" de run rate do
   * Claude Code e US$ 14 bilhões de run rate da empresa, mesma página, mesma
   * data. Depois de fevereiro a Anthropic para de abrir a fatia do produto: a
   * Série H (28/05/2026) publica só o total da empresa (US$ 47 bi). Por isso o
   * gráfico é datado no subtítulo — ele NÃO é a fatia de hoje.
   *
   * PALETA: reuso exato das cores já validadas (CVD) nos waffles anteriores;
   * azul = o grupo-tese (Claude Code), cinza-ardósia = o grupo recessivo.
   */
  'estatisticas-claude-code-runrate-waffle': {
    categories: [
      { label: 'Claude Code', sublabel: '179 pontos · US$ 2,5 bi', color: '#60a5fa', count: 179 },
      { label: 'Resto do run rate', sublabel: '821 pontos · US$ 11,5 bi', color: '#64748b', count: 821 },
    ],
  },
  'estatisticas-claude-code-runrate-waffle-en': {
    categories: [
      { label: 'Claude Code', sublabel: '179 dots · US$2.5bn', color: '#60a5fa', count: 179 },
      { label: 'Rest of run rate', sublabel: '821 dots · US$11.5bn', color: '#64748b', count: 821 },
    ],
  },
  'estatisticas-claude-code-runrate-waffle-es': {
    categories: [
      { label: 'Claude Code', sublabel: '179 puntos · 2500 mill.', color: '#60a5fa', count: 179 },
      { label: 'Resto del run rate', sublabel: '821 puntos · 11 500 mill.', color: '#64748b', count: 821 },
    ],
  },
  'estatisticas-claude-code-runrate-waffle-it': {
    categories: [
      { label: 'Claude Code', sublabel: '179 punti · 2,5 mld $', color: '#60a5fa', count: 179 },
      { label: 'Resto del run rate', sublabel: '821 punti · 11,5 mld $', color: '#64748b', count: 821 },
    ],
  },
  'estatisticas-claude-code-runrate-waffle-he': {
    categories: [
      { label: 'Claude Code', sublabel: '179 נקודות · 2.5 מיליארד $', color: '#60a5fa', count: 179 },
      { label: 'שאר ה־run rate', sublabel: '821 נקודות · 11.5 מיליארד $', color: '#64748b', count: 821 },
    ],
  },
  /*
   * 64 pontos, 1 ponto = 1 camada. Categorias EXCLUSIVAS (cada camada é de um tipo
   * só). Contagem lida do campo `layer_types` do config oficial do Qwen3.8-27B:
   * `linear_attention` 48 · `full_attention` 16, no padrão declarado no model card
   * `16 x (3 x (Gated DeltaNet -> FFN) -> 1 x (Gated Attention -> FFN))`.
   * Medido pelo autor em 14/08/2026 — reprodutível com
   * `python3 medidor.py --repo Qwen/Qwen3.8-27B` (dossiê `memoria-llm-local`).
   */
  'memoria-llm-local-camadas': {
    categories: [
      { label: 'Atenção linear', sublabel: '48 camadas — estado fixo', color: '#64748b', count: 48 },
      { label: 'Atenção cheia', sublabel: '16 camadas — cache cresce', color: '#a48f65', count: 16 },
    ],
  },
  'memoria-llm-local-camadas-en': {
    categories: [
      { label: 'Linear attention', sublabel: '48 layers — fixed state', color: '#64748b', count: 48 },
      { label: 'Full attention', sublabel: '16 layers — cache grows', color: '#a48f65', count: 16 },
    ],
  },
  'memoria-llm-local-camadas-es': {
    categories: [
      { label: 'Atención lineal', sublabel: '48 capas — estado fijo', color: '#64748b', count: 48 },
      { label: 'Atención completa', sublabel: '16 capas — la caché crece', color: '#a48f65', count: 16 },
    ],
  },
  'memoria-llm-local-camadas-it': {
    categories: [
      { label: 'Attenzione lineare', sublabel: '48 livelli — stato fisso', color: '#64748b', count: 48 },
      { label: 'Attenzione completa', sublabel: '16 livelli — la cache cresce', color: '#a48f65', count: 16 },
    ],
  },
  'memoria-llm-local-camadas-he': {
    categories: [
      { label: 'קשב לינארי', sublabel: '48 שכבות — מצב קבוע', color: '#64748b', count: 48 },
      { label: 'קשב מלא', sublabel: '16 שכבות — המטמון גדל', color: '#a48f65', count: 16 },
    ],
  },
};

/* ── Barras por país ─────────────────────────────────────────────────── */

export interface CountryBarItem {
  name: string;
  /** Valor da barra (mesma unidade do `max` do dataset). */
  value: number;
  /** Rótulo do valor no fim da barra (carrega a ressalva quando houver). */
  valueLabel: string;
  /** Destaque tipográfico (negrito/opacidade cheia). */
  emphasis?: boolean;
}

export interface CountryBarGroup {
  /** Cabeçalho do bloco — nomeia a RÉGUA de medição. */
  label: string;
  /** Cor única do bloco: a cor codifica o método, não o país. */
  color: string;
  items: readonly CountryBarItem[];
}

export interface CountryBarsDataset {
  /** Teto do eixo (%, escala comum aos blocos). */
  max: number;
  groups: readonly CountryBarGroup[];
}

/**
 * `quantas-pessoas-usam-ia-paises` — dois blocos por método; NUNCA fundir
 * num ranking único (réguas diferentes — a tese do artigo).
 *
 * PROCEDÊNCIA (verificada 02/08/2026): bloco Eurostat = comunicado
 * ddn-20251216-3 + dataset isoc_ai_iaiu (uso nos últimos 3 meses, 16-74
 * anos, 2025; DE/NO/CH inferidos do dataset bruto, batem ±0,1pp).
 * EUA 49% = Pew fev/2026 (adultos, chatbots, "now use"). Brasil ≈23% =
 * derivação própria: 32% dos usuários de internet 10+ ≈ 50 mi (Cetic.br
 * TIC Domicílios 2025, 1ª medição) sobre 213,4 mi (IBGE 2025).
 */
export const countryBarsDatasets: Record<string, CountryBarsDataset> = {


  /**
   * `risco-anthropic-cot-leak` — % de episódios de treino em que o
   * raciocínio interno vazou para o cálculo de recompensa, por modelo.
   * PROCEDÊNCIA: Risk Report August 2026, §5.2.3, p. 165.
   */
  'risco-anthropic-cot-leak': {
    max: 6,
    groups: [
      {
        label: 'Episódios com raciocínio exposto à nota do treino',
        color: '#60a5fa',
        items: [
          { name: 'Mythos Preview', value: 5.1, valueLabel: '5,1%', emphasis: true },
          { name: 'Fable 5 / Mythos 5', value: 2.7, valueLabel: '2,7%' },
          { name: 'Opus 4.7', value: 1.4, valueLabel: '1,4%' },
          { name: 'Opus 4.8', value: 0.27, valueLabel: '0,27%' },
          { name: 'Opus 4.6', value: 0.2, valueLabel: '0,2%' },
        ],
      },
    ],
  },
  /**
   * `risco-anthropic-erros-sessoes` — falhas observadas em 886 sessões
   * reais de trabalho interno da Anthropic.
   * PROCEDÊNCIA: Risk Report August 2026, §3.4.1, p. 97-98.
   */
  'risco-anthropic-erros-sessoes': {
    max: 7,
    groups: [
      {
        label: 'Falhas em 886 sessões internas reais',
        color: '#fbbf24',
        items: [
          { name: 'Chute virou fato', value: 6.4, valueLabel: '6,4%', emphasis: true },
          { name: 'Contornou bloqueio', value: 1.0, valueLabel: '1,0%' },
          { name: 'Ignorou instrução', value: 0.5, valueLabel: '0,5%' },
          { name: 'Inventou detalhe', value: 0.3, valueLabel: '0,3%' },
        ],
      },
    ],
  },
  /**
   * `risco-anthropic-cot-leak-en` — % of training episodes in which
   * internal reasoning leaked into the reward calculation, by model.
   * SOURCE: Risk Report August 2026, §5.2.3, p. 165.
   */
  'risco-anthropic-cot-leak-en': {
    max: 6,
    groups: [
      {
        label: 'Training episodes with reasoning exposed to reward',
        color: '#60a5fa',
        items: [
          { name: 'Mythos Preview', value: 5.1, valueLabel: '5.1%', emphasis: true },
          { name: 'Fable 5 / Mythos 5', value: 2.7, valueLabel: '2.7%' },
          { name: 'Opus 4.7', value: 1.4, valueLabel: '1.4%' },
          { name: 'Opus 4.8', value: 0.27, valueLabel: '0.27%' },
          { name: 'Opus 4.6', value: 0.2, valueLabel: '0.2%' },
        ],
      },
    ],
  },
  /**
   * `risco-anthropic-erros-sessoes-en` — failures observed across 886
   * real internal Anthropic work sessions.
   * SOURCE: Risk Report August 2026, §3.4.1, p. 97-98.
   */
  'risco-anthropic-erros-sessoes-en': {
    max: 7,
    groups: [
      {
        label: 'Failures in 886 real internal sessions',
        color: '#fbbf24',
        items: [
          { name: 'Guessed as fact', value: 6.4, valueLabel: '6.4%', emphasis: true },
          { name: 'Bypassed a block', value: 1.0, valueLabel: '1.0%' },
          { name: 'Ignored instruction', value: 0.5, valueLabel: '0.5%' },
          { name: 'Invented detail', value: 0.3, valueLabel: '0.3%' },
        ],
      },
    ],
  },
  /**
   * `risco-anthropic-cot-leak-es` — % de episodios de entrenamiento en que
   * el razonamiento interno se filtró al cálculo de la recompensa, por
   * modelo.
   * PROCEDENCIA: Risk Report August 2026, §5.2.3, p. 165.
   */
  'risco-anthropic-cot-leak-es': {
    max: 6,
    groups: [
      {
        label: 'Episodios con razonamiento expuesto a la nota del entrenamiento',
        color: '#60a5fa',
        items: [
          { name: 'Mythos Preview', value: 5.1, valueLabel: '5,1%', emphasis: true },
          { name: 'Fable 5 / Mythos 5', value: 2.7, valueLabel: '2,7%' },
          { name: 'Opus 4.7', value: 1.4, valueLabel: '1,4%' },
          { name: 'Opus 4.8', value: 0.27, valueLabel: '0,27%' },
          { name: 'Opus 4.6', value: 0.2, valueLabel: '0,2%' },
        ],
      },
    ],
  },
  /**
   * `risco-anthropic-erros-sessoes-es` — fallas observadas en 886 sesiones
   * reales de trabajo interno de Anthropic.
   * PROCEDENCIA: Risk Report August 2026, §3.4.1, p. 97-98.
   */
  'risco-anthropic-erros-sessoes-es': {
    max: 7,
    groups: [
      {
        label: 'Fallas en 886 sesiones internas reales',
        color: '#fbbf24',
        items: [
          { name: 'Dio por hecho', value: 6.4, valueLabel: '6,4%', emphasis: true },
          { name: 'Evadió bloqueo', value: 1.0, valueLabel: '1,0%' },
          { name: 'Ignoró instrucción', value: 0.5, valueLabel: '0,5%' },
          { name: 'Inventó detalle', value: 0.3, valueLabel: '0,3%' },
        ],
      },
    ],
  },
  /**
   * `risco-anthropic-cot-leak-it` — % di episodi di training in cui il
   * ragionamento interno è filtrato nel calcolo della ricompensa, per modello.
   * PROVENIÊNCIA: Risk Report August 2026, §5.2.3, p. 165.
   */
  'risco-anthropic-cot-leak-it': {
    max: 6,
    groups: [
      {
        label: 'Episodi con ragionamento esposto al punteggio di addestramento',
        color: '#60a5fa',
        items: [
          { name: 'Mythos Preview', value: 5.1, valueLabel: '5,1%', emphasis: true },
          { name: 'Fable 5 / Mythos 5', value: 2.7, valueLabel: '2,7%' },
          { name: 'Opus 4.7', value: 1.4, valueLabel: '1,4%' },
          { name: 'Opus 4.8', value: 0.27, valueLabel: '0,27%' },
          { name: 'Opus 4.6', value: 0.2, valueLabel: '0,2%' },
        ],
      },
    ],
  },
  /**
   * `risco-anthropic-erros-sessoes-it` — errori osservati in 886 sessioni
   * reali di lavoro interno Anthropic.
   * PROVENIÊNCIA: Risk Report August 2026, §3.4.1, p. 97-98.
   */
  'risco-anthropic-erros-sessoes-it': {
    max: 7,
    groups: [
      {
        label: 'Errori in 886 sessioni interne reali',
        color: '#fbbf24',
        items: [
          { name: 'Ipotesi come fatto', value: 6.4, valueLabel: '6,4%', emphasis: true },
          { name: 'Aggirato blocco', value: 1.0, valueLabel: '1,0%' },
          { name: 'Ordine ignorato', value: 0.5, valueLabel: '0,5%' },
          { name: 'Dettaglio inventato', value: 0.3, valueLabel: '0,3%' },
        ],
      },
    ],
  },
  
  
  
  
  
  
  /**
   * `risco-anthropic-cot-leak-he` — % מפרקי האימון שבהם ההרהור הפנימי
   * דלף לחישוב התגמול, לפי מודל.
   * מקור: Risk Report August 2026, §5.2.3, p. 165.
   */
  'risco-anthropic-cot-leak-he': {
    max: 6,
    groups: [
      {
        label: 'פרקים עם הרהור פנימי שנחשף לציון האימון',
        color: '#60a5fa',
        items: [
          { name: 'Mythos Preview', value: 5.1, valueLabel: '5.1%', emphasis: true },
          { name: 'Fable 5 / Mythos 5', value: 2.7, valueLabel: '2.7%' },
          { name: 'Opus 4.7', value: 1.4, valueLabel: '1.4%' },
          { name: 'Opus 4.8', value: 0.27, valueLabel: '0.27%' },
          { name: 'Opus 4.6', value: 0.2, valueLabel: '0.2%' },
        ],
      },
    ],
  },
  /**
   * `risco-anthropic-erros-sessoes-he` — כשלים שנצפו ב־886 סשנים
   * אמיתיים של עבודה פנימית ב־Anthropic.
   * מקור: Risk Report August 2026, §3.4.1, p. 97-98.
   */
  'risco-anthropic-erros-sessoes-he': {
    max: 7,
    groups: [
      {
        label: 'כשלים ב־886 סשנים פנימיים אמיתיים',
        color: '#fbbf24',
        items: [
          { name: 'ניחוש כעובדה', value: 6.4, valueLabel: '6.4%', emphasis: true },
          { name: 'עקף חסימה', value: 1.0, valueLabel: '1.0%' },
          { name: 'התעלם מהוראה', value: 0.5, valueLabel: '0.5%' },
          { name: 'המציא פרט', value: 0.3, valueLabel: '0.3%' },
        ],
      },
    ],
  },

  'quantas-pessoas-usam-ia-paises': {
    max: 60,
    groups: [
      {
        label: 'Eurostat — últimos 3 meses, 16-74 anos (2025)',
        color: '#60a5fa',
        items: [
          { name: 'Noruega', value: 56.3, valueLabel: '56,3%' },
          { name: 'Dinamarca', value: 48.4, valueLabel: '48,4%' },
          { name: 'Suíça', value: 47.0, valueLabel: '47,0%' },
          { name: 'Estônia', value: 46.6, valueLabel: '46,6%' },
          { name: 'Países Baixos', value: 44.7, valueLabel: '44,7%' },
          { name: 'Média UE-27', value: 32.7, valueLabel: '32,7%', emphasis: true },
          { name: 'Alemanha', value: 32.2, valueLabel: '32,2%' },
          { name: 'Itália', value: 19.9, valueLabel: '19,9%' },
          { name: 'Romênia', value: 17.8, valueLabel: '17,8%' },
        ],
      },
      {
        label: 'Outras réguas — comparação indicativa, não ranking',
        color: '#fbbf24',
        items: [
          { name: 'EUA (Pew)', value: 49, valueLabel: '49% (adultos · chatbots)' },
          {
            name: 'Brasil (Cetic.br)',
            value: 23,
            valueLabel: '~23% da população · 32% dos usuários de internet',
            emphasis: true,
          },
        ],
      },
    ],
  },
  'quantas-pessoas-usam-ia-paises-en': {
    max: 60,
    groups: [
      {
        label: 'Eurostat — last 3 months, ages 16-74 (2025)',
        color: '#60a5fa',
        items: [
          { name: 'Norway', value: 56.3, valueLabel: '56.3%' },
          { name: 'Denmark', value: 48.4, valueLabel: '48.4%' },
          { name: 'Switzerland', value: 47.0, valueLabel: '47.0%' },
          { name: 'Estonia', value: 46.6, valueLabel: '46.6%' },
          { name: 'Netherlands', value: 44.7, valueLabel: '44.7%' },
          { name: 'EU-27 average', value: 32.7, valueLabel: '32.7%', emphasis: true },
          { name: 'Germany', value: 32.2, valueLabel: '32.2%' },
          { name: 'Italy', value: 19.9, valueLabel: '19.9%' },
          { name: 'Romania', value: 17.8, valueLabel: '17.8%' },
        ],
      },
      {
        label: 'Other rulers — indicative comparison, not a ranking',
        color: '#fbbf24',
        items: [
          { name: 'US (Pew)', value: 49, valueLabel: '49% (adults · chatbots)' },
          { name: 'Brazil (Cetic.br)', value: 23, valueLabel: '~23% of population · 32% of internet users', emphasis: true },
        ],
      },
    ],
  },
  'quantas-pessoas-usam-ia-paises-es': {
    max: 60,
    groups: [
      {
        label: 'Eurostat — últimos 3 meses, 16-74 años (2025)',
        color: '#60a5fa',
        items: [
          { name: 'Noruega', value: 56.3, valueLabel: '56,3 %' },
          { name: 'Dinamarca', value: 48.4, valueLabel: '48,4 %' },
          { name: 'Suiza', value: 47.0, valueLabel: '47,0 %' },
          { name: 'Estonia', value: 46.6, valueLabel: '46,6 %' },
          { name: 'Países Bajos', value: 44.7, valueLabel: '44,7 %' },
          { name: 'Media UE-27', value: 32.7, valueLabel: '32,7 %', emphasis: true },
          { name: 'Alemania', value: 32.2, valueLabel: '32,2 %' },
          { name: 'Italia', value: 19.9, valueLabel: '19,9 %' },
          { name: 'Rumanía', value: 17.8, valueLabel: '17,8 %' },
        ],
      },
      {
        label: 'Otras varas de medir — comparación indicativa, no un ranking',
        color: '#fbbf24',
        items: [
          { name: 'EE. UU. (Pew)', value: 49, valueLabel: '49 % (adultos · chatbots)' },
          { name: 'Brasil (Cetic.br)', value: 23, valueLabel: '~23 % de la población · 32 % de los usuarios de internet', emphasis: true },
        ],
      },
    ],
  },
  'quantas-pessoas-usam-ia-paises-it': {
    max: 60,
    groups: [
      {
        label: 'Eurostat — ultimi 3 mesi, 16-74 anni (2025)',
        color: '#60a5fa',
        items: [
          { name: 'Norvegia', value: 56.3, valueLabel: '56,3%' },
          { name: 'Danimarca', value: 48.4, valueLabel: '48,4%' },
          { name: 'Svizzera', value: 47.0, valueLabel: '47,0%' },
          { name: 'Estonia', value: 46.6, valueLabel: '46,6%' },
          { name: 'Paesi Bassi', value: 44.7, valueLabel: '44,7%' },
          { name: 'Media UE-27', value: 32.7, valueLabel: '32,7%', emphasis: true },
          { name: 'Germania', value: 32.2, valueLabel: '32,2%' },
          { name: 'Italia', value: 19.9, valueLabel: '19,9%' },
          { name: 'Romania', value: 17.8, valueLabel: '17,8%' },
        ],
      },
      {
        label: 'Altri metri — confronto indicativo, non classifica',
        color: '#fbbf24',
        items: [
          { name: 'USA (Pew)', value: 49, valueLabel: '49% (adulti · chatbot)' },
          { name: 'Brasile (Cetic.br)', value: 23, valueLabel: '~23% della popolazione · 32% degli utenti internet', emphasis: true },
        ],
      },
    ],
  },
  'quantas-pessoas-usam-ia-paises-he': {
    max: 60,
    groups: [
      {
        label: 'Eurostat — שלושת החודשים האחרונים, גילאי 16–74 (2025)',
        color: '#60a5fa',
        items: [
          { name: 'נורווגיה', value: 56.3, valueLabel: '56.3%' },
          { name: 'דנמרק', value: 48.4, valueLabel: '48.4%' },
          { name: 'שווייץ', value: 47.0, valueLabel: '47.0%' },
          { name: 'אסטוניה', value: 46.6, valueLabel: '46.6%' },
          { name: 'הולנד', value: 44.7, valueLabel: '44.7%' },
          { name: 'ממוצע EU-27', value: 32.7, valueLabel: '32.7%', emphasis: true },
          { name: 'גרמניה', value: 32.2, valueLabel: '32.2%' },
          { name: 'איטליה', value: 19.9, valueLabel: '19.9%' },
          { name: 'רומניה', value: 17.8, valueLabel: '17.8%' },
        ],
      },
      {
        label: 'סרגלים אחרים — השוואה אינדיקטיבית, לא דירוג',
        color: '#fbbf24',
        items: [
          { name: 'ארה״ב (Pew)', value: 49, valueLabel: '49% (מבוגרים · צ\'אטבוטים)' },
          { name: 'ברזיל (Cetic.br)', value: 23, valueLabel: '~23% מהאוכלוסייה · 32% ממשתמשי האינטרנט', emphasis: true },
        ],
      },
    ],
  },

  /* `estatisticas-de-ia-twh` — "o mesmo 2026, quatro números". A estrutura
   * de blocos-por-régua carrega a tese: bloco 1 = faixa IEA jan/2024
   * (INCLUI cripto; aposentada pela própria IEA), bloco 2 = séries atuais
   * SEM cripto. `max` em TWh (não %); o componente é agnóstico de unidade
   * (valueLabel carrega tudo).
   * PROCEDÊNCIA (verificada 02/08/2026, PDFs oficiais + Wayback):
   * 1.050/800 = IEA Electricity 2024 p. 35 ("620-1 050 TWh in 2026, with
   * our base case for demand at just over 800 TWh"; escopo inclui
   * criptomoedas, ~160 TWh no caso-base 2026); 565/175 = Gartner PR
   * 10/06/2026 (total mundial; servidores IA-otimizados 175 TWh = 31%);
   * 485 = IEA Key Questions on Energy and AI, 16/04/2026 ("485 TWh in 2025
   * to 950 TWh in 2030", sem cripto dedicada).
   */
  'estatisticas-de-ia-twh': {
    max: 1100,
    groups: [
      {
        label: 'IEA jan/2024 — faixa 620-1.050 TWh, INCLUI cripto (aposentada)',
        color: '#fbbf24',
        items: [
          {
            name: 'Manchete (teto)',
            value: 1050,
            valueLabel: '1.050 TWh',
            emphasis: true,
          },
          {
            name: 'Caso-base',
            value: 800,
            valueLabel: '~800 TWh ("just over 800")',
          },
        ],
      },
      {
        label: 'Séries atuais, SEM cripto dedicada — Gartner 10/jun/2026 · IEA 16/abr/2026',
        color: '#60a5fa',
        items: [
          {
            name: 'Gartner (para 2026)',
            value: 565,
            valueLabel: '565 TWh · IA-otimizados: 175 (31%)',
            emphasis: true,
          },
          {
            name: 'IEA (2025 medido)',
            value: 485,
            valueLabel: '485 TWh -> ~950 em 2030',
          },
        ],
      },
    ],
  },
  'estatisticas-de-ia-twh-en': {
    max: 1100,
    groups: [
      {
        label: 'IEA Jan 2024 — 620-1,050 TWh range, INCLUDES crypto (retired)',
        color: '#fbbf24',
        items: [
          {
            name: 'Headline (ceiling)',
            value: 1050,
            valueLabel: '1,050 TWh',
            emphasis: true,
          },
          {
            name: 'Base case',
            value: 800,
            valueLabel: '~800 TWh ("just over 800")',
          },
        ],
      },
      {
        label: 'Current series, NO dedicated crypto — Gartner Jun 10, 2026 · IEA Apr 16, 2026',
        color: '#60a5fa',
        items: [
          {
            name: 'Gartner (for 2026)',
            value: 565,
            valueLabel: '565 TWh · AI-optimized: 175 (31%)',
            emphasis: true,
          },
          {
            name: 'IEA (2025 measured)',
            value: 485,
            valueLabel: '485 TWh -> ~950 in 2030',
          },
        ],
      },
    ],
  },
  'estatisticas-de-ia-twh-es': {
    max: 1100,
    groups: [
      {
        label: 'IEA ene/2024 — rango 620-1050 TWh, INCLUYE cripto (retirado)',
        color: '#fbbf24',
        items: [
          {
            name: 'Titular (techo)',
            value: 1050,
            valueLabel: '1050 TWh',
            emphasis: true,
          },
          {
            name: 'Caso base',
            value: 800,
            valueLabel: '~800 TWh ("just over 800")',
          },
        ],
      },
      {
        label: 'Series actuales, SIN cripto dedicada — Gartner 10/jun/2026 · IEA 16/abr/2026',
        color: '#60a5fa',
        items: [
          {
            name: 'Gartner (para 2026)',
            value: 565,
            valueLabel: '565 TWh · optimizados para IA: 175 (31 %)',
            emphasis: true,
          },
          {
            name: 'IEA (2025 medido)',
            value: 485,
            valueLabel: '485 TWh -> ~950 en 2030',
          },
        ],
      },
    ],
  },
  'estatisticas-de-ia-twh-it': {
    max: 1100,
    groups: [
      {
        label: 'IEA gen/2024 — forchetta 620-1.050 TWh, INCLUDE le cripto (ritirata)',
        color: '#fbbf24',
        items: [
          {
            name: 'Titolo (tetto)',
            value: 1050,
            valueLabel: '1.050 TWh',
            emphasis: true,
          },
          {
            name: 'Caso base',
            value: 800,
            valueLabel: '~800 TWh ("just over 800")',
          },
        ],
      },
      {
        label: 'Serie attuali, SENZA cripto dedicata — Gartner 10/giu/2026 · IEA 16/apr/2026',
        color: '#60a5fa',
        items: [
          {
            name: 'Gartner (per il 2026)',
            value: 565,
            valueLabel: "565 TWh · ottimizzati per l'IA: 175 (31%)",
            emphasis: true,
          },
          {
            name: 'IEA (2025 misurato)',
            value: 485,
            valueLabel: '485 TWh -> ~950 nel 2030',
          },
        ],
      },
    ],
  },
  'estatisticas-de-ia-twh-he': {
    max: 1100,
    groups: [
      {
        label: 'IEA ינואר 2024 — טווח 620–1,050 TWh, כולל קריפטו (גנוז)',
        color: '#fbbf24',
        items: [
          {
            name: 'הכותרת (תקרה)',
            value: 1050,
            valueLabel: '1,050 TWh',
            emphasis: true,
          },
          {
            name: 'תרחיש הבסיס',
            value: 800,
            valueLabel: '~800 TWh ("just over 800")',
          },
        ],
      },
      {
        label: 'סדרות נוכחיות, בלי קריפטו ייעודי — Gartner 10/6/2026 · IEA 16/4/2026',
        color: '#60a5fa',
        items: [
          {
            name: 'Gartner (ל־2026)',
            value: 565,
            valueLabel: '565 TWh · ממוטבים ל־AI: 175 (31%)',
            emphasis: true,
          },
          {
            name: 'IEA (2025 נמדד)',
            value: 485,
            valueLabel: '485 TWh, בדרך לכ־950 ב־2030',
          },
        ],
      },
    ],
  },

  /* `estatisticas-de-ia-brasil` — gente adiante do capital. Bloco 1 =
   * régua única Chegg (universitários que já usaram genAI, survey 2025 em
   * 15 países; AI Index 2026 Fig. 7.2.16, p. 303: Indonésia 95, Brasil 84
   * (+32 pp vs 2023), EUA 67, Reino Unido 67). Bloco 2 = população total,
   * réguas próprias: mundo 29,2% = DataReportal abr/2026 (TETO
   * não-dedupado — contas, não pessoas); Brasil ~23% = derivação do
   * artigo quantas-pessoas-usam-ia (32% dos usuários de internet 10+,
   * Cetic.br TIC Domicílios 2025, sobre 213,4 mi do IBGE).
   */
  'estatisticas-de-ia-brasil': {
    max: 100,
    groups: [
      {
        label: 'Chegg 2025 — universitários que já usaram genAI (15 países)',
        color: '#60a5fa',
        items: [
          {
            name: 'Indonésia',
            value: 95,
            valueLabel: '95%',
          },
          {
            name: 'Brasil',
            value: 84,
            valueLabel: '84% (+32 pp vs 2023)',
            emphasis: true,
          },
          {
            name: 'Estados Unidos',
            value: 67,
            valueLabel: '67%',
          },
          {
            name: 'Reino Unido',
            value: 67,
            valueLabel: '67%',
          },
        ],
      },
      {
        label: 'População total — réguas próprias, comparação indicativa',
        color: '#fbbf24',
        items: [
          {
            name: 'Mundo (DataReportal)',
            value: 29.2,
            valueLabel: '29,2% · teto: contas, não pessoas (abr/2026)',
          },
          {
            name: 'Brasil (Cetic.br)',
            value: 23,
            valueLabel: '~23% da população · 32% dos usuários de internet (2025)',
            emphasis: true,
          },
        ],
      },
    ],
  },
  'estatisticas-de-ia-brasil-en': {
    max: 100,
    groups: [
      {
        label: 'Chegg 2025 — university students who have used genAI (15 countries)',
        color: '#60a5fa',
        items: [
          {
            name: 'Indonesia',
            value: 95,
            valueLabel: '95%',
          },
          {
            name: 'Brazil',
            value: 84,
            valueLabel: '84% (+32 pp vs 2023)',
            emphasis: true,
          },
          {
            name: 'United States',
            value: 67,
            valueLabel: '67%',
          },
          {
            name: 'United Kingdom',
            value: 67,
            valueLabel: '67%',
          },
        ],
      },
      {
        label: 'Total population — separate rulers, indicative comparison',
        color: '#fbbf24',
        items: [
          {
            name: 'World (DataReportal)',
            value: 29.2,
            valueLabel: '29.2% · ceiling: accounts, not people (Apr 2026)',
          },
          {
            name: 'Brazil (Cetic.br)',
            value: 23,
            valueLabel: '~23% of population · 32% of internet users (2025)',
            emphasis: true,
          },
        ],
      },
    ],
  },
  'estatisticas-de-ia-brasil-es': {
    max: 100,
    groups: [
      {
        label: 'Chegg 2025 — universitarios que ya usaron genAI (15 países)',
        color: '#60a5fa',
        items: [
          {
            name: 'Indonesia',
            value: 95,
            valueLabel: '95 %',
          },
          {
            name: 'Brasil',
            value: 84,
            valueLabel: '84% (+32 pp vs 2023)',
            emphasis: true,
          },
          {
            name: 'Estados Unidos',
            value: 67,
            valueLabel: '67 %',
          },
          {
            name: 'Reino Unido',
            value: 67,
            valueLabel: '67 %',
          },
        ],
      },
      {
        label: 'Población total — varas propias, comparación indicativa',
        color: '#fbbf24',
        items: [
          {
            name: 'Mundo (DataReportal)',
            value: 29.2,
            valueLabel: '29,2 % · techo: cuentas, no personas (abr/2026)',
          },
          {
            name: 'Brasil (Cetic.br)',
            value: 23,
            valueLabel: '~23 % de la población · 32 % de los usuarios de internet (2025)',
            emphasis: true,
          },
        ],
      },
    ],
  },
  'estatisticas-de-ia-brasil-it': {
    max: 100,
    groups: [
      {
        label: 'Chegg 2025 — universitari che hanno già usato la genAI (15 paesi)',
        color: '#60a5fa',
        items: [
          {
            name: 'Indonesia',
            value: 95,
            valueLabel: '95%',
          },
          {
            name: 'Brasile',
            value: 84,
            valueLabel: '84% (+32 pp vs 2023)',
            emphasis: true,
          },
          {
            name: 'Stati Uniti',
            value: 67,
            valueLabel: '67%',
          },
          {
            name: 'Regno Unito',
            value: 67,
            valueLabel: '67%',
          },
        ],
      },
      {
        label: 'Popolazione totale — metri propri, confronto indicativo',
        color: '#fbbf24',
        items: [
          {
            name: 'Mondo (DataReportal)',
            value: 29.2,
            valueLabel: '29,2% · tetto: account, non persone (apr/2026)',
          },
          {
            name: 'Brasile (Cetic.br)',
            value: 23,
            valueLabel: '~23% della popolazione · 32% degli utenti internet (2025)',
            emphasis: true,
          },
        ],
      },
    ],
  },
  'estatisticas-de-ia-brasil-he': {
    max: 100,
    groups: [
      {
        label: 'Chegg 2025 — סטודנטים שכבר השתמשו ב־genAI (15 מדינות)',
        color: '#60a5fa',
        items: [
          {
            name: 'אינדונזיה',
            value: 95,
            valueLabel: '95%',
          },
          {
            name: 'ברזיל',
            value: 84,
            valueLabel: '84% (+32 נק׳ מול 2023)',
            emphasis: true,
          },
          {
            name: 'ארצות הברית',
            value: 67,
            valueLabel: '67%',
          },
          {
            name: 'בריטניה',
            value: 67,
            valueLabel: '67%',
          },
        ],
      },
      {
        label: 'כלל האוכלוסייה — סרגלים משלה, השוואה אינדיקטיבית',
        color: '#fbbf24',
        items: [
          {
            name: 'העולם (DataReportal)',
            value: 29.2,
            valueLabel: '29.2% · תקרה: חשבונות, לא אנשים (אפריל 2026)',
          },
          {
            name: 'ברזיל (Cetic.br)',
            value: 23,
            valueLabel: '~23% מהאוכלוסייה · 32% ממשתמשי האינטרנט (2025)',
            emphasis: true,
          },
        ],
      },
    ],
  },

  /* ── 1. `estatisticas-chatgpt-wau` — a escada dos 900 milhões ────────────────
   *
   * UNIDADE: milhões de usuários ativos semanais. Teto **1.100**, não 1.050: o
   * `valueLabel` é desenhado DEPOIS do fim da barra, então quanto mais alta a
   * barra, menor a caixa que sobra. A 1.050 o rótulo do marco de 1 bi tinha 80px
   * — apertado em pt-br e sem folga nenhuma para as traduções. A 1.100 sobram
   * 102px na mesma barra, e a proporção continua honesta (a maior ocupa 91% do
   * eixo). Ver `checar-rotulos-site.py` na raiz do dossiê.
   *
   * PROCEDÊNCIA (conferida em 03/08/2026):
   * - 100 / 350 / 700 = NBER WP 34255, impressa p.10: "ChatGPT had more than 100
   *   million logged-in WAU after one year, and almost 350 million after two
   *   years. By the end of July 2025, ChatGPT had more than 700 million total
   *   WAU". ATENÇÃO: o paper TROCA de universo nessas duas frases (logados ->
   *   total). O rótulo de cada barra carrega isso, e o texto do artigo explica —
   *   não unificar os rótulos "para ficar consistente": a inconsistência é o dado.
   * - 900 = OpenAI, "Scaling AI for everyone" (27/02/2026), literal "more than
   *   900M weekly active users". A página NÃO define usuário ativo (auditoria de
   *   DOM: 0 notas de rodapé, 1 ocorrência de "active").
   * - 920 / 905 = The Information via Ed Zitron (22/05/2026), literal: "weekly
   *   active users hit 920m in February, the average for the quarter sat at
   *   905m". Dado interno não auditável, reportado por terceiro.
   * - 1000 = The Information via PYMNTS (29/07/2026): o marco de 1 bilhão chega
   *   "seven months later than [OpenAI] had initially projected".
   */
  'estatisticas-chatgpt-wau': {
    max: 1100,
    groups: [
      {
        label: 'Publicado pela OpenAI — dado próprio, sem definição de "ativo" na página',
        color: '#60a5fa',
        items: [
          {
            name: 'nov/2023 — 1º ano',
            value: 100,
            valueLabel: 'mais de 100 mi · WAU logados',
          },
          {
            name: 'nov/2024 — 2º ano',
            value: 350,
            valueLabel: 'quase 350 mi · WAU logados',
          },
          {
            name: 'fev/2025 — o COO',
            value: 400,
            valueLabel: '400 mi · "5% of the world" (régua: população TOTAL)',
          },
          {
            name: 'jul/2025 — o paper',
            value: 700,
            valueLabel: 'mais de 700 mi · WAU TOTAL',
          },
          {
            name: 'fev/2026 — a captação',
            value: 900,
            valueLabel: 'mais de 900 mi',
            emphasis: true,
          },
        ],
      },
      {
        label: 'Reportado pela imprensa de dados internos — pico de fev; média do trimestre, 905 mi',
        color: '#fbbf24',
        items: [
          {
            name: 'fev/2026 — o pico',
            value: 920,
            valueLabel: '920 mi de pico',
          },
          {
            name: 'jul/2026 — o marco',
            value: 1000,
            valueLabel: 'cerca de 1 bi',
            emphasis: true,
          },
        ],
      },
    ],
  },
  'estatisticas-chatgpt-wau-en': {
    max: 1100,
    groups: [
      {
        label: 'Published by OpenAI — its own data, no definition of "active" on the page',
        color: '#60a5fa',
        items: [
          { name: 'Nov 2023 — year 1', value: 100, valueLabel: 'more than 100m · logged-in WAU' },
          { name: 'Nov 2024 — year 2', value: 350, valueLabel: 'almost 350m · logged-in WAU' },
          { name: 'Feb 2025 — the COO', value: 400, valueLabel: '400m · "5% of the world" (ruler: TOTAL population)' },
          { name: 'Jul 2025 — the paper', value: 700, valueLabel: 'more than 700m · TOTAL WAU' },
          { name: 'Feb 2026 — the raise', value: 900, valueLabel: 'more than 900m', emphasis: true },
        ],
      },
      {
        label: 'Reported by the press from internal data — Feb peak; quarterly average, 905m',
        color: '#fbbf24',
        items: [
          { name: 'Feb 2026 — the peak', value: 920, valueLabel: '920m peak' },
          { name: 'Jul 2026 — milestone', value: 1000, valueLabel: 'about 1bn', emphasis: true },
        ],
      },
    ],
  },
  'estatisticas-chatgpt-wau-es': {
    max: 1100,
    groups: [
      {
        label: 'Publicado por OpenAI — dato propio, sin definición de "activo" en la página',
        color: '#60a5fa',
        items: [
          { name: 'nov 2023 — 1.er año', value: 100, valueLabel: 'más de 100 mill. · WAU con sesión' },
          { name: 'nov 2024 — 2.º año', value: 350, valueLabel: 'casi 350 mill. · WAU con sesión' },
          { name: 'feb 2025 — el COO', value: 400, valueLabel: '400 mill. · "5% of the world" (regla: población TOTAL)' },
          { name: 'jul 2025 — el paper', value: 700, valueLabel: 'más de 700 mill. · WAU TOTAL' },
          { name: 'feb 2026 — la ronda', value: 900, valueLabel: 'más de 900 mill.', emphasis: true },
        ],
      },
      {
        label: 'Reportado por la prensa desde datos internos — pico de feb; media del trimestre, 905 mill.',
        color: '#fbbf24',
        items: [
          { name: 'feb 2026 — el pico', value: 920, valueLabel: '920 mill. de pico' },
          { name: 'jul 2026 — el hito', value: 1000, valueLabel: 'unos 1000 mill.', emphasis: true },
        ],
      },
    ],
  },
  'estatisticas-chatgpt-wau-it': {
    max: 1100,
    groups: [
      {
        label: 'Pubblicato da OpenAI — dato proprio, senza definizione di "attivo" nella pagina',
        color: '#60a5fa',
        items: [
          { name: 'nov 2023 — 1° anno', value: 100, valueLabel: 'più di 100 mln · WAU autenticati' },
          { name: 'nov 2024 — 2° anno', value: 350, valueLabel: 'quasi 350 mln · WAU autenticati' },
          { name: 'feb 2025 — il COO', value: 400, valueLabel: '400 mln · "5% of the world" (metro: popolazione TOTALE)' },
          { name: 'lug 2025 — il paper', value: 700, valueLabel: 'più di 700 mln · WAU TOTALI' },
          { name: 'feb 2026 — la raccolta', value: 900, valueLabel: 'più di 900 mln', emphasis: true },
        ],
      },
      {
        label: 'Riportato dalla stampa da dati interni — picco di feb; media del trimestre, 905 mln',
        color: '#fbbf24',
        items: [
          { name: 'feb 2026 — il picco', value: 920, valueLabel: '920 mln di picco' },
          { name: 'lug 2026 — traguardo', value: 1000, valueLabel: 'circa 1 mld', emphasis: true },
        ],
      },
    ],
  },
  'estatisticas-chatgpt-wau-he': {
    max: 1100,
    groups: [
      {
        label: 'פורסם בידי OpenAI — נתון עצמי, בלי הגדרה של "פעיל" בעמוד',
        color: '#60a5fa',
        items: [
          { name: 'נוב׳ 2023 — שנה 1', value: 100, valueLabel: 'יותר מ־100 מיליון · WAU מחוברים' },
          { name: 'נוב׳ 2024 — שנה 2', value: 350, valueLabel: 'כמעט 350 מיליון · WAU מחוברים' },
          { name: 'פבר׳ 2025 — ה־COO', value: 400, valueLabel: '400 מיליון · "5% of the world" (סרגל: אוכלוסייה כוללת)' },
          { name: 'יולי 2025 — המאמר', value: 700, valueLabel: 'יותר מ־700 מיליון · WAU כולל' },
          { name: 'פבר׳ 2026 — הגיוס', value: 900, valueLabel: 'יותר מ־900 מיליון', emphasis: true },
        ],
      },
      {
        label: 'דווח בעיתונות מנתונים פנימיים — שיא פברואר; ממוצע הרבעון, 905 מיליון',
        color: '#fbbf24',
        items: [
          { name: 'פבר׳ 2026 — השיא', value: 920, valueLabel: 'שיא של 920 מיליון' },
          { name: 'יולי 2026 — אבן הדרך', value: 1000, valueLabel: 'כ־1 מיליארד', emphasis: true },
        ],
      },
    ],
  },

  /* ── 2. `estatisticas-chatgpt-denominador` — o coração do artigo ─────────────
   *
   * UNIDADE: ponto percentual. Teto 16 para dar folga acima da barra mais alta.
   *
   * PROCEDÊNCIA (conferida em 03/08/2026):
   * - 10 = NBER WP 34255, literal "representing around 10% of the global adult
   *   population" (abstract, introdução e §4). O paper NUNCA define "adult" e
   *   NUNCA dá fonte para o denominador — busca no texto integral das 64 pp.:
   *   "world population" = 0, "population estimate" = 0; a nota 1 ("Reuters
   *   (2025), Roth (2025)") sustenta só o NUMERADOR.
   * - 11.3 = 700.000.000 / 6.210.117.111. Denominador = Banco Mundial 2025,
   *   agregado mundial, SP.POP.TOTL (8.215.424.893) menos SP.POP.0014.TO
   *   (2.005.307.782). Corte 15+, declarado no texto do artigo.
   * - 11.0 = 900.000.000 / 8.215.424.893 = 10,96%. É o número da página que
   *   inspirou a pauta ("roughly 11% of the world's population", snapshot de
   *   14/05/2026) — e ele FECHA, contra a população total.
   * - 14.5 = 900.000.000 / 6.210.117.111 = 14,49%. Mesma régua do paper.
   *
   * NÃO "corrigir" o 10 para 11,3 — a barra do publicado existe justamente para
   * mostrar que o paper arredondou PARA BAIXO. Ele é a peça conservadora da
   * cadeia; o artigo diz isso com todas as letras.
   */
  'estatisticas-chatgpt-denominador': {
    max: 16,
    groups: [
      {
        label: 'Paper NBER/OpenAI (set/2025) — 700 mi contra a população ADULTA',
        color: '#60a5fa',
        items: [
          {
            name: 'O paper publicou',
            value: 10,
            valueLabel: '"around 10%" · arredondado',
          },
          {
            name: 'A conta refeita (15+)',
            value: 11.3,
            valueLabel: '11,3% da população adulta',
          },
        ],
      },
      {
        label: 'Página de estatísticas (mai/2026) — 900 mi, e a régua trocou',
        color: '#fbbf24',
        items: [
          {
            name: 'A página publicou',
            value: 11,
            valueLabel: '"11% do mundo" · régua TOTAL',
          },
          {
            name: 'Na régua adulta (15+)',
            value: 14.5,
            valueLabel: '14,5%',
            emphasis: true,
          },
        ],
      },
    ],
  },
  'estatisticas-chatgpt-denominador-en': {
    max: 16,
    groups: [
      {
        label: 'NBER/OpenAI paper (Sep 2025) — 700m against the ADULT population',
        color: '#60a5fa',
        items: [
          { name: 'Published in the paper', value: 10, valueLabel: '"around 10%" · rounded down' },
          { name: 'Recomputed (15+)', value: 11.3, valueLabel: '11.3% of the adult population' },
        ],
      },
      {
        label: 'Statistics page (May 2026) — 900m, and the ruler moved',
        color: '#fbbf24',
        items: [
          { name: 'Published on the page', value: 11, valueLabel: '"11% of the world" · TOTAL ruler' },
          { name: 'Adult ruler (15+)', value: 14.5, valueLabel: '14.5%', emphasis: true },
        ],
      },
    ],
  },
  'estatisticas-chatgpt-denominador-es': {
    max: 16,
    groups: [
      {
        label: 'Paper NBER/OpenAI (sep 2025) — 700 mill. contra la población ADULTA',
        color: '#60a5fa',
        items: [
          { name: 'Publicado en el paper', value: 10, valueLabel: '"around 10%" · redondeado' },
          { name: 'Cuenta rehecha (15+)', value: 11.3, valueLabel: '11,3 % de la población adulta' },
        ],
      },
      {
        label: 'Página de estadísticas (mayo 2026) — 900 mill., y la regla cambió',
        color: '#fbbf24',
        items: [
          { name: 'Publicado en la página', value: 11, valueLabel: '"11 % del mundo" · regla TOTAL' },
          { name: 'Regla adulta (15+)', value: 14.5, valueLabel: '14,5 %', emphasis: true },
        ],
      },
    ],
  },
  'estatisticas-chatgpt-denominador-it': {
    max: 16,
    groups: [
      {
        label: 'Paper NBER/OpenAI (set 2025) — 700 mln contro la popolazione ADULTA',
        color: '#60a5fa',
        items: [
          { name: 'Il paper pubblica', value: 10, valueLabel: '"around 10%" · arrotondato' },
          { name: 'Conto rifatto (15+)', value: 11.3, valueLabel: '11,3% della popolazione adulta' },
        ],
      },
      {
        label: 'Pagina di statistiche (mag 2026) — 900 mln, e il metro è cambiato',
        color: '#fbbf24',
        items: [
          { name: 'La pagina pubblica', value: 11, valueLabel: '"11% del mondo" · metro TOTALE' },
          { name: 'Metro adulto (15+)', value: 14.5, valueLabel: '14,5%', emphasis: true },
        ],
      },
    ],
  },
  'estatisticas-chatgpt-denominador-he': {
    max: 16,
    groups: [
      {
        label: 'מאמר NBER/OpenAI (ספטמבר 2025) — 700 מיליון מול האוכלוסייה הבוגרת',
        color: '#60a5fa',
        items: [
          { name: 'מה שהמאמר פרסם', value: 10, valueLabel: '"around 10%" · מעוגל כלפי מטה' },
          { name: 'החשבון מחדש (15+)', value: 11.3, valueLabel: '11.3% מהאוכלוסייה הבוגרת' },
        ],
      },
      {
        label: 'עמוד הסטטיסטיקות (מאי 2026) — 900 מיליון, והסרגל התחלף',
        color: '#fbbf24',
        items: [
          { name: 'מה שהעמוד פרסם', value: 11, valueLabel: '"11% מהעולם" · סרגל כולל' },
          { name: 'בסרגל הבוגר (15+)', value: 14.5, valueLabel: '14.5%', emphasis: true },
        ],
      },
    ],
  },

  /* ── 3. `estatisticas-chatgpt-metricas` — quase a mesma altura ───────────────
   *
   * UNIDADE: milhões de usuários. Teto 1.050, o mesmo do gráfico 1.
   *
   * A tese do gráfico é a proximidade das três barras: três blocos, três réguas,
   * e nenhuma mede a mesma coisa. Por isso cada bloco tem UM item e um `label`
   * longo — o rótulo do bloco é o dado. NÃO fundir os três num bloco só.
   *
   * PROCEDÊNCIA (conferida em 03/08/2026):
   * - 900 = OpenAI (27/02/2026). Escopo "across web and mobile platforms" vem da
   *   CNBC de 12/06/2026, que datou a declaração em fevereiro.
   * - 1000 = Sensor Tower, MAU do APLICATIVO em maio/2026, via Reuters
   *   (02/06/2026) e CNBC (12/06/2026). Estimativa de painel de terceiro; a
   *   OpenAI não comentou (registrado na própria CNBC).
   * - 950 = Gemini, MAU, PYMNTS (29/07/2026). ATENÇÃO ao rótulo: a frase do
   *   Gemini está num parágrafo que ATRIBUI as outras frases ao The Information,
   *   mas ela mesma NÃO tem fonte — o único link ancorado ali vai para
   *   `gemini.google.com`, que não publica o número. Verificado no HTML cru em
   *   03/08/2026. NÃO creditar ao The Information: seria, no gráfico, o mesmo
   *   erro de atribuição que o artigo denuncia no texto.
   */
  'estatisticas-chatgpt-metricas': {
    max: 1050,
    groups: [
      {
        label: 'OpenAI — ativos SEMANAIS, auto-reportado, web + mobile (fev/2026)',
        color: '#60a5fa',
        items: [
          {
            name: 'ChatGPT — WAU',
            value: 900,
            valueLabel: 'mais de 900 mi',
            emphasis: true,
          },
        ],
      },
      {
        label: 'Sensor Tower — ativos MENSAIS do APLICATIVO (sem web), painel de terceiro (mai/2026)',
        color: '#fbbf24',
        items: [
          {
            name: 'ChatGPT (app)',
            value: 1000,
            valueLabel: '1 bi',
            emphasis: true,
          },
        ],
      },
      {
        label: 'PYMNTS — ativos MENSAIS do CONCORRENTE, sem fonte declarada (jul/2026)',
        color: '#a1a1aa',
        items: [
          {
            name: 'Gemini — MAU',
            value: 950,
            valueLabel: '950 mi',
          },
        ],
      },
    ],
  },
  'estatisticas-chatgpt-metricas-en': {
    max: 1050,
    groups: [
      {
        label: 'OpenAI — WEEKLY actives, self-reported, web + mobile (Feb 2026)',
        color: '#60a5fa',
        items: [{ name: 'ChatGPT — WAU', value: 900, valueLabel: 'more than 900m', emphasis: true }],
      },
      {
        label: 'Sensor Tower — MONTHLY actives of the APP (no web), third-party panel (May 2026)',
        color: '#fbbf24',
        items: [{ name: 'ChatGPT (app)', value: 1000, valueLabel: '1bn', emphasis: true }],
      },
      {
        label: 'PYMNTS — MONTHLY actives of the COMPETITOR, no declared source (Jul 2026)',
        color: '#a1a1aa',
        items: [{ name: 'Gemini — MAU', value: 950, valueLabel: '950m' }],
      },
    ],
  },
  'estatisticas-chatgpt-metricas-es': {
    max: 1050,
    groups: [
      {
        label: 'OpenAI — activos SEMANALES, autorreportado, web + móvil (feb 2026)',
        color: '#60a5fa',
        items: [{ name: 'ChatGPT — WAU', value: 900, valueLabel: 'más de 900 mill.', emphasis: true }],
      },
      {
        label: 'Sensor Tower — activos MENSUALES de la APP (sin web), panel de un tercero (mayo 2026)',
        color: '#fbbf24',
        items: [{ name: 'ChatGPT (app)', value: 1000, valueLabel: '1000 mill.', emphasis: true }],
      },
      {
        label: 'PYMNTS — activos MENSUALES del COMPETIDOR, sin fuente declarada (jul 2026)',
        color: '#a1a1aa',
        items: [{ name: 'Gemini — MAU', value: 950, valueLabel: '950 mill.' }],
      },
    ],
  },
  'estatisticas-chatgpt-metricas-it': {
    max: 1050,
    groups: [
      {
        label: 'OpenAI — attivi SETTIMANALI, autodichiarato, web + mobile (feb 2026)',
        color: '#60a5fa',
        items: [{ name: 'ChatGPT — WAU', value: 900, valueLabel: 'più di 900 mln', emphasis: true }],
      },
      {
        label: "Sensor Tower — attivi MENSILI dell'APP (senza web), panel di terza parte (mag 2026)",
        color: '#fbbf24',
        items: [{ name: 'ChatGPT (app)', value: 1000, valueLabel: '1 mld', emphasis: true }],
      },
      {
        label: 'PYMNTS — attivi MENSILI del CONCORRENTE, senza fonte dichiarata (lug 2026)',
        color: '#a1a1aa',
        items: [{ name: 'Gemini — MAU', value: 950, valueLabel: '950 mln' }],
      },
    ],
  },
  'estatisticas-chatgpt-metricas-he': {
    max: 1050,
    groups: [
      {
        label: 'OpenAI — פעילים שבועיים, מדווח עצמית, וובּ ומובייל (פברואר 2026)',
        color: '#60a5fa',
        items: [{ name: 'ChatGPT — WAU', value: 900, valueLabel: 'יותר מ־900 מיליון', emphasis: true }],
      },
      {
        label: 'Sensor Tower — פעילים חודשיים של האפליקציה (בלי וובּ), פאנל של צד שלישי (מאי 2026)',
        color: '#fbbf24',
        items: [{ name: 'ChatGPT (אפליקציה)', value: 1000, valueLabel: 'מיליארד', emphasis: true }],
      },
      {
        label: 'PYMNTS — פעילים חודשיים של המתחרה, בלי מקור מוצהר (יולי 2026)',
        color: '#a1a1aa',
        items: [{ name: 'Gemini — MAU', value: 950, valueLabel: '950 מיליון' }],
      },
    ],
  },

  /* ── 1. `estatisticas-claude-top10-aui` — volume não é intensidade ───────────
   *
   * UNIDADE: AUI (Anthropic AI Usage Index) = participação do país no uso do
   * Claude ÷ participação na população mundial 15-64. AUI = 1 -> usa na exata
   * proporção do próprio tamanho. Teto **8**, não 7: o `valueLabel` é desenhado
   * DEPOIS do fim da barra, e a 7 o rótulo da Austrália (6,40, a maior barra)
   * ficava com ~99px — sem folga para as traduções. A 8, sobram ~157px e a
   * maior barra ainda ocupa 80% do eixo.
   *
   * ORDEM = VOLUME, BARRA = AUI — a tensão entre as duas réguas É o gráfico
   * (Índia: 2ª em volume, barra quase nula; Austrália: 9ª em volume, a maior
   * barra). NÃO reordenar pela barra: viraria um ranking de AUI e a tese some.
   * UM grupo só: uma fonte, um método, uma cor.
   *
   * PROCEDÊNCIA (medida em 10/08/2026, `extrair-brasil-aei.py` + variação
   * top-10 registrada no STATE.md): dataset aberto Anthropic Economic Index,
   * release 26/06/2026 (CC-BY), janela 2026-05-01 a 2026-06-01, 121 países,
   * soma dos usage_pct publicados = 87,49%. Volume% / AUI / rank AUI:
   * USA 20,16/3,87 (12º) · IND 7,12/0,30 (104º) · FRA 3,95/3,97 (10º) ·
   * GBR 3,47/3,35 (16º) · BRA 3,33/0,96 (61º) · JPN 3,28/1,91 (32º) ·
   * KOR 3,24/3,78 (14º) · DEU 2,98/2,40 (26º) · AUS 2,65/6,40 (1º) ·
   * CAN 2,63/4,13 (6º).
   */
  'estatisticas-claude-top10-aui': {
    max: 8,
    groups: [
      {
        label: 'Anthropic Economic Index — ordem: volume de uso; barra: AUI (mai/2026)',
        color: '#60a5fa',
        items: [
          { name: 'EUA · 20,2%', value: 3.87, valueLabel: 'AUI 3,87' },
          { name: 'Índia · 7,1%', value: 0.3, valueLabel: 'AUI 0,30 · 104º de 121' },
          { name: 'França · 4,0%', value: 3.97, valueLabel: 'AUI 3,97' },
          { name: 'Reino Unido · 3,5%', value: 3.35, valueLabel: 'AUI 3,35' },
          { name: 'Brasil · 3,3%', value: 0.96, valueLabel: 'AUI 0,96 · 61º de 121', emphasis: true },
          { name: 'Japão · 3,3%', value: 1.91, valueLabel: 'AUI 1,91' },
          { name: 'Coreia do Sul · 3,2%', value: 3.78, valueLabel: 'AUI 3,78' },
          { name: 'Alemanha · 3,0%', value: 2.4, valueLabel: 'AUI 2,40' },
          { name: 'Austrália · 2,7%', value: 6.4, valueLabel: 'AUI 6,40 · 1º de 121' },
          { name: 'Canadá · 2,6%', value: 4.13, valueLabel: 'AUI 4,13' },
        ],
      },
    ],
  },
  'estatisticas-claude-top10-aui-en': {
    max: 8,
    groups: [
      {
        label: 'Anthropic Economic Index — order: usage volume; bar: AUI (May 2026)',
        color: '#60a5fa',
        items: [
          { name: 'US · 20.2%', value: 3.87, valueLabel: 'AUI 3.87' },
          { name: 'India · 7.1%', value: 0.3, valueLabel: 'AUI 0.30 · 104th of 121' },
          { name: 'France · 4.0%', value: 3.97, valueLabel: 'AUI 3.97' },
          { name: 'UK · 3.5%', value: 3.35, valueLabel: 'AUI 3.35' },
          { name: 'Brazil · 3.3%', value: 0.96, valueLabel: 'AUI 0.96 · 61st of 121', emphasis: true },
          { name: 'Japan · 3.3%', value: 1.91, valueLabel: 'AUI 1.91' },
          { name: 'South Korea · 3.2%', value: 3.78, valueLabel: 'AUI 3.78' },
          { name: 'Germany · 3.0%', value: 2.4, valueLabel: 'AUI 2.40' },
          { name: 'Australia · 2.7%', value: 6.4, valueLabel: 'AUI 6.40 · 1st of 121' },
          { name: 'Canada · 2.6%', value: 4.13, valueLabel: 'AUI 4.13' },
        ],
      },
    ],
  },
  'estatisticas-claude-top10-aui-es': {
    max: 8,
    groups: [
      {
        label: 'Anthropic Economic Index — orden: volumen de uso; barra: AUI (mayo 2026)',
        color: '#60a5fa',
        items: [
          { name: 'EE. UU. · 20,2 %', value: 3.87, valueLabel: 'AUI 3,87' },
          { name: 'India · 7,1 %', value: 0.3, valueLabel: 'AUI 0,30 · 104.º de 121' },
          { name: 'Francia · 4,0 %', value: 3.97, valueLabel: 'AUI 3,97' },
          { name: 'Reino Unido · 3,5 %', value: 3.35, valueLabel: 'AUI 3,35' },
          { name: 'Brasil · 3,3 %', value: 0.96, valueLabel: 'AUI 0,96 · 61.º de 121', emphasis: true },
          { name: 'Japón · 3,3 %', value: 1.91, valueLabel: 'AUI 1,91' },
          { name: 'Corea del Sur · 3,2 %', value: 3.78, valueLabel: 'AUI 3,78' },
          { name: 'Alemania · 3,0 %', value: 2.4, valueLabel: 'AUI 2,40' },
          { name: 'Australia · 2,7 %', value: 6.4, valueLabel: 'AUI 6,40 · 1.º de 121' },
          { name: 'Canadá · 2,6 %', value: 4.13, valueLabel: 'AUI 4,13' },
        ],
      },
    ],
  },
  'estatisticas-claude-top10-aui-it': {
    max: 8,
    groups: [
      {
        label: "Anthropic Economic Index — ordine: volume d'uso; barra: AUI (mag 2026)",
        color: '#60a5fa',
        items: [
          { name: 'USA · 20,2%', value: 3.87, valueLabel: 'AUI 3,87' },
          { name: 'India · 7,1%', value: 0.3, valueLabel: 'AUI 0,30 · 104º su 121' },
          { name: 'Francia · 4,0%', value: 3.97, valueLabel: 'AUI 3,97' },
          { name: 'Regno Unito · 3,5%', value: 3.35, valueLabel: 'AUI 3,35' },
          { name: 'Brasile · 3,3%', value: 0.96, valueLabel: 'AUI 0,96 · 61º su 121', emphasis: true },
          { name: 'Giappone · 3,3%', value: 1.91, valueLabel: 'AUI 1,91' },
          { name: 'Corea del Sud · 3,2%', value: 3.78, valueLabel: 'AUI 3,78' },
          { name: 'Germania · 3,0%', value: 2.4, valueLabel: 'AUI 2,40' },
          { name: 'Australia · 2,7%', value: 6.4, valueLabel: 'AUI 6,40 · 1º su 121' },
          { name: 'Canada · 2,6%', value: 4.13, valueLabel: 'AUI 4,13' },
        ],
      },
    ],
  },
  'estatisticas-claude-top10-aui-he': {
    max: 8,
    groups: [
      {
        label: 'Anthropic Economic Index — סדר: נפח שימוש; עמודה: AUI (מאי 2026)',
        color: '#60a5fa',
        items: [
          { name: 'ארה״ב · 20.2%', value: 3.87, valueLabel: 'AUI 3.87' },
          { name: 'הודו · 7.1%', value: 0.3, valueLabel: 'AUI 0.30 · מקום 104 מתוך 121' },
          { name: 'צרפת · 4.0%', value: 3.97, valueLabel: 'AUI 3.97' },
          { name: 'בריטניה · 3.5%', value: 3.35, valueLabel: 'AUI 3.35' },
          { name: 'ברזיל · 3.3%', value: 0.96, valueLabel: 'AUI 0.96 · מקום 61 מתוך 121', emphasis: true },
          { name: 'יפן · 3.3%', value: 1.91, valueLabel: 'AUI 1.91' },
          { name: 'דרום קוריאה · 3.2%', value: 3.78, valueLabel: 'AUI 3.78' },
          { name: 'גרמניה · 3.0%', value: 2.4, valueLabel: 'AUI 2.40' },
          { name: 'אוסטרליה · 2.7%', value: 6.4, valueLabel: 'AUI 6.40 · 1 מתוך 121' },
          { name: 'קנדה · 2.6%', value: 4.13, valueLabel: 'AUI 4.13' },
        ],
      },
    ],
  },

  /* ── 2. `estatisticas-claude-run-rate` — quem disse cada número ──────────────
   *
   * UNIDADE: bilhões de US$. Teto **52** (a barra dos 47 ocupa 90% do eixo,
   * mesma folga do gráfico `estatisticas-chatgpt-wau`, 1000/1100).
   *
   * TRÊS GRUPOS = TRÊS NATUREZAS DE DECLARAÇÃO, não três fontes quaisquer:
   * comunicado assinado pela empresa / vazamento a imprensa / declaração sob
   * pena de perjúrio. A cronologia vive na ordem das barras DENTRO de cada
   * grupo. NÃO fundir os grupos num ranking: o grupo 3 mede OUTRA GRANDEZA
   * (receita acumulada desde a fundação, o odômetro) — é por isso que a barra
   * mais curta do gráfico é a única jurada. Velocímetro vs odômetro é a tese
   * da seção.
   *
   * PROCEDÊNCIA (verificada 2026-08-03 a 10, laudos em fontes/):
   * - 14 = anthropic.com/news/anthropic-raises-30-billion-series-g-funding-…
   *   (12/fev/2026), literal "annualized revenue run-rate surpassed $14B".
   * - 30 = anúncio de 6/abr/2026, via cronologia de Simon Willison
   *   (simonwillison.net/2026/May/29/anthropic/) — NÃO está na página da
   *   Série H; atribuição corrigida na conferência (item 1 do laudo).
   * - 47 = anthropic.com/news/series-h (mai/2026).
   * - 9 e 19 = Bloomberg 3/mar/2026 (lida via Wayback 20260520171717), literal
   *   "recently surpassed $19 billion… up from $9 billion at the end of 2025".
   * - 5 = declaração de Krishna Rao (CFO), executada em 9/mar/2026 (Zitron
   *   circulou 6/mar — errado), caso 3:26-cv-01996 N.D. Cal., Document 6-5,
   *   literal "exceeding $5 billion to date"; lida na íntegra
   *   (fontes/cfo-declaration-rao.pdf).
   */
  'estatisticas-claude-run-rate': {
    max: 52,
    groups: [
      {
        label: 'A empresa disse — run rate anualizado, em comunicado assinado',
        color: '#60a5fa',
        items: [
          { name: '12/fev — Série G', value: 14, valueLabel: 'US$ 14 bi' },
          { name: '6/abr — anúncio', value: 30, valueLabel: 'US$ 30 bi' },
          { name: '28/mai — Série H', value: 47, valueLabel: 'US$ 47 bi', emphasis: true },
        ],
      },
      {
        label: "Terceiros disseram — Bloomberg, 'pessoas a par do assunto' (3/mar)",
        color: '#fbbf24',
        items: [
          { name: 'fim de 2025', value: 9, valueLabel: 'US$ 9 bi' },
          { name: '3/mar/2026', value: 19, valueLabel: "~US$ 19 bi · 'nears $20 billion'" },
        ],
      },
      {
        label: 'Sob juramento — receita ACUMULADA desde a fundação (o CFO ao tribunal, 9/mar)',
        color: '#a48f65',
        items: [
          {
            name: '9/mar — o CFO',
            value: 5,
            valueLabel: '>US$ 5 bi · acumulado desde a fundação',
            emphasis: true,
          },
        ],
      },
    ],
  },
  'estatisticas-claude-run-rate-en': {
    max: 52,
    groups: [
      {
        label: 'The company said it — annualized run rate, in signed announcements',
        color: '#60a5fa',
        items: [
          { name: 'Feb 12 — Series G', value: 14, valueLabel: '$14bn' },
          { name: 'Apr 6 — update', value: 30, valueLabel: '$30bn' },
          { name: 'May 28 — Series H', value: 47, valueLabel: '$47bn', emphasis: true },
        ],
      },
      {
        label: "Third parties said it — Bloomberg, 'people familiar with the matter' (Mar 3)",
        color: '#fbbf24',
        items: [
          { name: 'end of 2025', value: 9, valueLabel: '$9bn' },
          { name: 'Mar 3, 2026', value: 19, valueLabel: "~$19bn · 'nears $20 billion'" },
        ],
      },
      {
        label: 'Under oath — CUMULATIVE revenue since founding (the CFO in court, Mar 9)',
        color: '#a48f65',
        items: [
          {
            name: 'Mar 9 — the CFO',
            value: 5,
            valueLabel: '>$5bn · cumulative since founding',
            emphasis: true,
          },
        ],
      },
    ],
  },
  'estatisticas-claude-run-rate-es': {
    max: 52,
    groups: [
      {
        label: 'La empresa lo dijo — run rate anualizado, en comunicado firmado',
        color: '#60a5fa',
        items: [
          { name: '12/feb — Serie G', value: 14, valueLabel: 'US$ 14 000 mill.' },
          { name: '6/abr — anuncio', value: 30, valueLabel: 'US$ 30 000 mill.' },
          { name: '28/may — Serie H', value: 47, valueLabel: 'US$ 47 000 mill.', emphasis: true },
        ],
      },
      {
        label: "Terceros lo dijeron — Bloomberg, 'personas al tanto del asunto' (3/mar)",
        color: '#fbbf24',
        items: [
          { name: 'fines de 2025', value: 9, valueLabel: 'US$ 9 000 mill.' },
          { name: '3/mar/2026', value: 19, valueLabel: "~US$ 19 000 mill. · 'nears $20 billion'" },
        ],
      },
      {
        label: 'Bajo juramento — ingresos ACUMULADOS desde la fundación (el CFO, 9/mar)',
        color: '#a48f65',
        items: [
          {
            name: '9/mar — el CFO',
            value: 5,
            valueLabel: '>US$ 5 000 mill. · acumulado desde la fundación',
            emphasis: true,
          },
        ],
      },
    ],
  },
  'estatisticas-claude-run-rate-it': {
    max: 52,
    groups: [
      {
        label: "L'azienda l'ha detto — run rate annualizzato, in comunicato firmato",
        color: '#60a5fa',
        items: [
          { name: '12/feb — Serie G', value: 14, valueLabel: 'US$ 14 mld' },
          { name: '6/apr — annuncio', value: 30, valueLabel: 'US$ 30 mld' },
          { name: '28/mag — Serie H', value: 47, valueLabel: 'US$ 47 mld', emphasis: true },
        ],
      },
      {
        label: "Terzi l'hanno detto — Bloomberg, 'persone al corrente della questione' (3/mar)",
        color: '#fbbf24',
        items: [
          { name: 'fine 2025', value: 9, valueLabel: 'US$ 9 mld' },
          { name: '3/mar/2026', value: 19, valueLabel: "~US$ 19 mld · 'nears $20 billion'" },
        ],
      },
      {
        label: 'Sotto giuramento — ricavi CUMULATI dalla fondazione (il CFO in tribunale, 9/mar)',
        color: '#a48f65',
        items: [
          {
            name: '9/mar — il CFO',
            value: 5,
            valueLabel: '>US$ 5 mld · cumulati dalla fondazione',
            emphasis: true,
          },
        ],
      },
    ],
  },
  'estatisticas-claude-run-rate-he': {
    max: 52,
    groups: [
      {
        label: 'החברה אמרה — run rate שנתי, בהודעה חתומה',
        color: '#60a5fa',
        items: [
          { name: '12 בפבר׳ — סבב G', value: 14, valueLabel: '14 מיליארד דולר' },
          { name: '6 באפר׳ — הכרזה', value: 30, valueLabel: '30 מיליארד דולר' },
          { name: '28 במאי — סבב H', value: 47, valueLabel: '47 מיליארד דולר', emphasis: true },
        ],
      },
      {
        label: 'צדדים שלישיים אמרו — Bloomberg, "מקורבים לעניין" (3 במרץ)',
        color: '#fbbf24',
        items: [
          { name: 'סוף 2025', value: 9, valueLabel: '9 מיליארד דולר' },
          { name: '3 במרץ 2026', value: 19, valueLabel: 'כ־19 מיליארד דולר' },
        ],
      },
      {
        label: 'בשבועה — הכנסות מצטברות מאז הייסוד (סמנכ״ל הכספים בבית המשפט, 9 במרץ)',
        color: '#a48f65',
        items: [
          {
            name: '9 במרץ — ה־CFO',
            value: 5,
            valueLabel: 'יותר מ־5 מיליארד דולר · מצטבר מאז הייסוד',
            emphasis: true,
          },
        ],
      },
    ],
  },
  /* ── 1. `estatisticas-claude-code-npm-mensal` — o número que dava para medir ──
   *
   * UNIDADE: MILHÕES de downloads no mês. 18 meses fechados, fev/2025 a jul/2026.
   *
   * TETO **60**, não 50: o `valueLabel` é desenhado DEPOIS do fim da barra, e o
   * rótulo de março/2026 carrega a comparação com a página conferida ("a página
   * dizia 111 mil") — a 50 ele sairia do viewBox. A 60, a maior barra (abr/2026)
   * ainda ocupa 82% do eixo e sobram ~145px para o rótulo mais longo.
   *
   * ORDEM = TEMPO, não grandeza: é uma série mensal, o crescimento é o gráfico.
   * UM grupo só: uma fonte, um método, uma cor.
   *
   * ÊNFASE em mar/2026 porque é o mês que a página alemã declara medir ("Stand
   * März 2026") e para o qual publica "111.000+" — a barra e o rótulo põem os
   * dois números lado a lado. Trocar a ênfase de mês desmancha a comparação.
   *
   * PROCEDÊNCIA (medida em 11/08/2026 por `medir-npm-mensal.py`, API pública
   * api.npmjs.org, janela 2025-02-22 a 2026-08-09, downloads diários somados por
   * mês): 147.648 · 650.866 · 862.556 · 1.521.790 · 4.338.148 · 17.045.271 ·
   * 21.541.238 · 22.734.286 · 23.989.032 · 21.571.991 · 21.551.967 · 27.575.444 ·
   * 30.510.428 · 44.445.736 · 49.361.496 · 34.562.178 · 44.038.610 · 46.178.680.
   * Acumulado até 31/03/2026 = 238.486.401; total da janela = 429.320.208.
   * O pacote citado pela página (`@anthropics/claude-code`, com "s") devolve
   * HTTP 404 no mesmo endpoint — o script confirma isso a cada execução.
   */
  'estatisticas-claude-code-npm-mensal': {
    max: 60,
    groups: [
      {
        label: 'Medido na API pública do npm em 11/08/2026',
        color: '#60a5fa',
        items: [
          { name: 'fev/25', value: 0.15, valueLabel: '148 mil' },
          { name: 'mar/25', value: 0.65, valueLabel: '651 mil' },
          { name: 'abr/25', value: 0.86, valueLabel: '863 mil' },
          { name: 'mai/25', value: 1.5, valueLabel: '1,5 M' },
          { name: 'jun/25', value: 4.3, valueLabel: '4,3 M' },
          { name: 'jul/25', value: 17.0, valueLabel: '17,0 M' },
          { name: 'ago/25', value: 21.5, valueLabel: '21,5 M' },
          { name: 'set/25', value: 22.7, valueLabel: '22,7 M' },
          { name: 'out/25', value: 24.0, valueLabel: '24,0 M' },
          { name: 'nov/25', value: 21.6, valueLabel: '21,6 M' },
          { name: 'dez/25', value: 21.6, valueLabel: '21,6 M' },
          { name: 'jan/26', value: 27.6, valueLabel: '27,6 M' },
          { name: 'fev/26', value: 30.5, valueLabel: '30,5 M' },
          { name: 'mar/26', value: 44.4, valueLabel: '44,4 M · a página: 111 mil', emphasis: true },
          { name: 'abr/26', value: 49.4, valueLabel: '49,4 M' },
          { name: 'mai/26', value: 34.6, valueLabel: '34,6 M' },
          { name: 'jun/26', value: 44.0, valueLabel: '44,0 M' },
          { name: 'jul/26', value: 46.2, valueLabel: '46,2 M' },
        ],
      },
    ],
  },
  'estatisticas-claude-code-npm-mensal-en': {
    max: 60,
    groups: [
      {
        label: 'Measured on the public npm API on 11/08/2026',
        color: '#60a5fa',
        items: [
          { name: 'Feb/25', value: 0.15, valueLabel: '148k' },
          { name: 'Mar/25', value: 0.65, valueLabel: '651k' },
          { name: 'Apr/25', value: 0.86, valueLabel: '863k' },
          { name: 'May/25', value: 1.5, valueLabel: '1.5M' },
          { name: 'Jun/25', value: 4.3, valueLabel: '4.3M' },
          { name: 'Jul/25', value: 17.0, valueLabel: '17.0M' },
          { name: 'Aug/25', value: 21.5, valueLabel: '21.5M' },
          { name: 'Sep/25', value: 22.7, valueLabel: '22.7M' },
          { name: 'Oct/25', value: 24.0, valueLabel: '24.0M' },
          { name: 'Nov/25', value: 21.6, valueLabel: '21.6M' },
          { name: 'Dec/25', value: 21.6, valueLabel: '21.6M' },
          { name: 'Jan/26', value: 27.6, valueLabel: '27.6M' },
          { name: 'Feb/26', value: 30.5, valueLabel: '30.5M' },
          { name: 'Mar/26', value: 44.4, valueLabel: '44.4M · the page: 111k', emphasis: true },
          { name: 'Apr/26', value: 49.4, valueLabel: '49.4M' },
          { name: 'May/26', value: 34.6, valueLabel: '34.6M' },
          { name: 'Jun/26', value: 44.0, valueLabel: '44.0M' },
          { name: 'Jul/26', value: 46.2, valueLabel: '46.2M' },
        ],
      },
    ],
  },
  'estatisticas-claude-code-npm-mensal-es': {
    max: 60,
    groups: [
      {
        label: 'Medido en la API pública de npm el 11/08/2026',
        color: '#60a5fa',
        items: [
          { name: 'feb/25', value: 0.15, valueLabel: '148 mil' },
          { name: 'mar/25', value: 0.65, valueLabel: '651 mil' },
          { name: 'abr/25', value: 0.86, valueLabel: '863 mil' },
          { name: 'may/25', value: 1.5, valueLabel: '1,5 M' },
          { name: 'jun/25', value: 4.3, valueLabel: '4,3 M' },
          { name: 'jul/25', value: 17.0, valueLabel: '17,0 M' },
          { name: 'ago/25', value: 21.5, valueLabel: '21,5 M' },
          { name: 'sep/25', value: 22.7, valueLabel: '22,7 M' },
          { name: 'oct/25', value: 24.0, valueLabel: '24,0 M' },
          { name: 'nov/25', value: 21.6, valueLabel: '21,6 M' },
          { name: 'dic/25', value: 21.6, valueLabel: '21,6 M' },
          { name: 'ene/26', value: 27.6, valueLabel: '27,6 M' },
          { name: 'feb/26', value: 30.5, valueLabel: '30,5 M' },
          { name: 'mar/26', value: 44.4, valueLabel: '44,4 M · la página: 111 mil', emphasis: true },
          { name: 'abr/26', value: 49.4, valueLabel: '49,4 M' },
          { name: 'may/26', value: 34.6, valueLabel: '34,6 M' },
          { name: 'jun/26', value: 44.0, valueLabel: '44,0 M' },
          { name: 'jul/26', value: 46.2, valueLabel: '46,2 M' },
        ],
      },
    ],
  },
  'estatisticas-claude-code-npm-mensal-it': {
    max: 60,
    groups: [
      {
        label: 'Misurato sull\'API pubblica di npm l\'11/08/2026',
        color: '#60a5fa',
        items: [
          { name: 'feb/25', value: 0.15, valueLabel: '148 mila' },
          { name: 'mar/25', value: 0.65, valueLabel: '651 mila' },
          { name: 'apr/25', value: 0.86, valueLabel: '863 mila' },
          { name: 'mag/25', value: 1.5, valueLabel: '1,5 mln' },
          { name: 'giu/25', value: 4.3, valueLabel: '4,3 mln' },
          { name: 'lug/25', value: 17.0, valueLabel: '17,0 mln' },
          { name: 'ago/25', value: 21.5, valueLabel: '21,5 mln' },
          { name: 'set/25', value: 22.7, valueLabel: '22,7 mln' },
          { name: 'ott/25', value: 24.0, valueLabel: '24,0 mln' },
          { name: 'nov/25', value: 21.6, valueLabel: '21,6 mln' },
          { name: 'dic/25', value: 21.6, valueLabel: '21,6 mln' },
          { name: 'gen/26', value: 27.6, valueLabel: '27,6 mln' },
          { name: 'feb/26', value: 30.5, valueLabel: '30,5 mln' },
          { name: 'mar/26', value: 44.4, valueLabel: '44,4 mln · pagina: 111 mila', emphasis: true },
          { name: 'apr/26', value: 49.4, valueLabel: '49,4 mln' },
          { name: 'mag/26', value: 34.6, valueLabel: '34,6 mln' },
          { name: 'giu/26', value: 44.0, valueLabel: '44,0 mln' },
          { name: 'lug/26', value: 46.2, valueLabel: '46,2 mln' },
        ],
      },
    ],
  },
  'estatisticas-claude-code-npm-mensal-he': {
    max: 60,
    groups: [
      {
        label: 'נמדד ב־API הציבורי של npm ב־11/08/2026',
        color: '#60a5fa',
        items: [
          { name: 'פבר׳ 25', value: 0.15, valueLabel: '148 אלף' },
          { name: 'מרץ 25', value: 0.65, valueLabel: '651 אלף' },
          { name: 'אפר׳ 25', value: 0.86, valueLabel: '863 אלף' },
          { name: 'מאי 25', value: 1.5, valueLabel: '1.5M' },
          { name: 'יונ׳ 25', value: 4.3, valueLabel: '4.3M' },
          { name: 'יול׳ 25', value: 17.0, valueLabel: '17.0M' },
          { name: 'אוג׳ 25', value: 21.5, valueLabel: '21.5M' },
          { name: 'ספט׳ 25', value: 22.7, valueLabel: '22.7M' },
          { name: 'אוק׳ 25', value: 24.0, valueLabel: '24.0M' },
          { name: 'נוב׳ 25', value: 21.6, valueLabel: '21.6M' },
          { name: 'דצמ׳ 25', value: 21.6, valueLabel: '21.6M' },
          { name: 'ינו׳ 26', value: 27.6, valueLabel: '27.6M' },
          { name: 'פבר׳ 26', value: 30.5, valueLabel: '30.5M' },
          { name: 'מרץ 26', value: 44.4, valueLabel: '44.4M · העמוד: 111 אלף', emphasis: true },
          { name: 'אפר׳ 26', value: 49.4, valueLabel: '49.4M' },
          { name: 'מאי 26', value: 34.6, valueLabel: '34.6M' },
          { name: 'יונ׳ 26', value: 44.0, valueLabel: '44.0M' },
          { name: 'יול׳ 26', value: 46.2, valueLabel: '46.2M' },
        ],
      },
    ],
  },

  /* ── 2. `estatisticas-claude-code-ocupacoes` — onde o Brasil entra ────────────
   *
   * UNIDADE: % do uso do Claude.ai vindo de ocupações "Computer and Mathematical"
   * (SOC nível 1) — a mesma régua nas três linhas, por isso UM grupo e UMA cor.
   *
   * TETO **30**: a maior barra (Brasil, 26,0) ocupa 87% do eixo e sobram ~123px
   * para o `valueLabel`. Teto 26 encostaria o rótulo do Brasil na borda.
   *
   * ORDEM = GRANDEZA e a ênfase é o Brasil: a tese da seção é que o uso
   * brasileiro do Claude é proporcionalmente MAIS programação que o global e que
   * o americano. Três barras, uma comparação, nada mais.
   *
   * O QUE ESTE GRÁFICO NÃO É: não é geografia de Claude Code. O Anthropic
   * Economic Index não publica país para o Claude Code (a fatia de 1P API o
   * exclui); a quebra por país existe só para o Claude.ai. O título, o subtítulo
   * e o corpo do artigo dizem "Claude.ai" — trocar por "Claude Code" em qualquer
   * idioma é erro factual, não estilo.
   *
   * PROCEDÊNCIA (medida em 12/08/2026 por `extrair-ocupacoes-aei.py`): dataset
   * aberto Anthropic Economic Index, release 26/06/2026 (CC-BY), janela
   * 2026-05-01 a 2026-06-01, category_name=soc_occupation, hierarchy_level=1,
   * metric_id=pct, node_name="Computer and Mathematical" -> BRA 26,0000 ·
   * GLOBAL 23,8000 · USA 21,1300. Janela anterior (abr/2026), para contexto:
   * BRA 25,62 · GLOBAL 23,95 · USA 21,93 — a ordem se mantém.
   */
  'estatisticas-claude-code-ocupacoes': {
    max: 30,
    groups: [
      {
        label: 'Anthropic Economic Index — SOC nível 1, janela mai/2026',
        color: '#60a5fa',
        items: [
          { name: 'Brasil', value: 26.0, valueLabel: '26,0%', emphasis: true },
          { name: 'Média global', value: 23.8, valueLabel: '23,8%' },
          { name: 'Estados Unidos', value: 21.13, valueLabel: '21,1%' },
        ],
      },
    ],
  },
  'estatisticas-claude-code-ocupacoes-en': {
    max: 30,
    groups: [
      {
        label: 'Anthropic Economic Index — SOC level 1, May 2026 window',
        color: '#60a5fa',
        items: [
          { name: 'Brazil', value: 26.0, valueLabel: '26.0%', emphasis: true },
          { name: 'Global average', value: 23.8, valueLabel: '23.8%' },
          { name: 'United States', value: 21.13, valueLabel: '21.1%' },
        ],
      },
    ],
  },
  'estatisticas-claude-code-ocupacoes-es': {
    max: 30,
    groups: [
      {
        label: 'Anthropic Economic Index — SOC nivel 1, ventana may/2026',
        color: '#60a5fa',
        items: [
          { name: 'Brasil', value: 26.0, valueLabel: '26,0 %', emphasis: true },
          { name: 'Media global', value: 23.8, valueLabel: '23,8 %' },
          { name: 'Estados Unidos', value: 21.13, valueLabel: '21,1 %' },
        ],
      },
    ],
  },
  'estatisticas-claude-code-ocupacoes-it': {
    max: 30,
    groups: [
      {
        label: 'Anthropic Economic Index — SOC livello 1, finestra mag/2026',
        color: '#60a5fa',
        items: [
          { name: 'Brasile', value: 26.0, valueLabel: '26,0%', emphasis: true },
          { name: 'Media globale', value: 23.8, valueLabel: '23,8%' },
          { name: 'Stati Uniti', value: 21.13, valueLabel: '21,1%' },
        ],
      },
    ],
  },
  'estatisticas-claude-code-ocupacoes-he': {
    max: 30,
    groups: [
      {
        label: 'Anthropic Economic Index — SOC רמה 1, חלון מאי 2026',
        color: '#60a5fa',
        items: [
          { name: 'ברזיל', value: 26.0, valueLabel: '26.0%', emphasis: true },
          { name: 'ממוצע עולמי', value: 23.8, valueLabel: '23.8%' },
          { name: 'ארה״ב', value: 21.13, valueLabel: '21.1%' },
        ],
      },
    ],
  },
  /*
   * As DUAS PARCELAS da memória do Qwen3.8-27B nos mesmos cinco contextos. A cor
   * codifica a PARCELA, não o contexto: cinza = pesos em Q4_K_M (15,82 GiB,
   * constante — é uma reta de propósito), azul = cache de atenção em 16 bits (a
   * escada, de 0,20 a 16,14 GiB). Os dois blocos dividem o mesmo eixo (max 32 =
   * pico da soma) porque a tese do artigo é a comparação entre as duas FORMAS.
   * Só as 16 camadas `full_attention` acumulam (2 x 4 kv_heads x 256 head_dim x
   * 2 bytes = 4 KiB por token por camada); as 48 `linear_attention` somam 0,14
   * GiB fixos, já embutidos nos valores. Unidade única do dataset: GiB (binário),
   * como toda memória citada no corpo do artigo. Medido pelo autor em 14/08/2026
   * a partir dos `config.json` oficiais no Hugging Face — reprodutível com
   * `python3 medidor.py --repo Qwen/Qwen3.8-27B` (dossiê `memoria-llm-local`).
   */
  'memoria-llm-local-anatomia': {
    max: 32,
    groups: [
      {
        label: 'Pesos do modelo — não mudam nunca',
        color: '#64748b',
        items: [
          { name: '1K de contexto', value: 15.82, valueLabel: '15,82 GiB' },
          { name: '8K de contexto', value: 15.82, valueLabel: '15,82 GiB' },
          { name: '32K de contexto', value: 15.82, valueLabel: '15,82 GiB' },
          { name: '128K de contexto', value: 15.82, valueLabel: '15,82 GiB' },
          { name: '256K de contexto', value: 15.82, valueLabel: '15,82 GiB' },
        ],
      },
      {
        label: 'Cache da conversa — cresce a cada token',
        color: '#60a5fa',
        items: [
          { name: '1K de contexto', value: 0.2, valueLabel: '0,20 GiB' },
          { name: '8K de contexto', value: 0.64, valueLabel: '0,64 GiB' },
          { name: '32K de contexto', value: 2.14, valueLabel: '2,14 GiB' },
          { name: '128K de contexto', value: 8.14, valueLabel: '8,14 GiB' },
          { name: '256K de contexto', value: 16.14, valueLabel: '16,14 GiB', emphasis: true },
        ],
      },
    ],
  },
  'memoria-llm-local-anatomia-en': {
    max: 32,
    groups: [
      {
        label: 'Model weights — never change',
        color: '#64748b',
        items: [
          { name: '1K context', value: 15.82, valueLabel: '15.82 GiB' },
          { name: '8K context', value: 15.82, valueLabel: '15.82 GiB' },
          { name: '32K context', value: 15.82, valueLabel: '15.82 GiB' },
          { name: '128K context', value: 15.82, valueLabel: '15.82 GiB' },
          { name: '256K context', value: 15.82, valueLabel: '15.82 GiB' },
        ],
      },
      {
        label: 'Conversation cache — grows with every token',
        color: '#60a5fa',
        items: [
          { name: '1K context', value: 0.2, valueLabel: '0.20 GiB' },
          { name: '8K context', value: 0.64, valueLabel: '0.64 GiB' },
          { name: '32K context', value: 2.14, valueLabel: '2.14 GiB' },
          { name: '128K context', value: 8.14, valueLabel: '8.14 GiB' },
          { name: '256K context', value: 16.14, valueLabel: '16.14 GiB', emphasis: true },
        ],
      },
    ],
  },
  'memoria-llm-local-anatomia-es': {
    max: 32,
    groups: [
      {
        label: 'Pesos del modelo — nunca cambian',
        color: '#64748b',
        items: [
          { name: '1K de contexto', value: 15.82, valueLabel: '15,82 GiB' },
          { name: '8K de contexto', value: 15.82, valueLabel: '15,82 GiB' },
          { name: '32K de contexto', value: 15.82, valueLabel: '15,82 GiB' },
          { name: '128K de contexto', value: 15.82, valueLabel: '15,82 GiB' },
          { name: '256K de contexto', value: 15.82, valueLabel: '15,82 GiB' },
        ],
      },
      {
        label: 'Caché de la conversación — crece con cada token',
        color: '#60a5fa',
        items: [
          { name: '1K de contexto', value: 0.2, valueLabel: '0,20 GiB' },
          { name: '8K de contexto', value: 0.64, valueLabel: '0,64 GiB' },
          { name: '32K de contexto', value: 2.14, valueLabel: '2,14 GiB' },
          { name: '128K de contexto', value: 8.14, valueLabel: '8,14 GiB' },
          { name: '256K de contexto', value: 16.14, valueLabel: '16,14 GiB', emphasis: true },
        ],
      },
    ],
  },
  'memoria-llm-local-anatomia-it': {
    max: 32,
    groups: [
      {
        label: 'Pesi del modello — non cambiano mai',
        color: '#64748b',
        items: [
          { name: '1K di contesto', value: 15.82, valueLabel: '15,82 GiB' },
          { name: '8K di contesto', value: 15.82, valueLabel: '15,82 GiB' },
          { name: '32K di contesto', value: 15.82, valueLabel: '15,82 GiB' },
          { name: '128K di contesto', value: 15.82, valueLabel: '15,82 GiB' },
          { name: '256K di contesto', value: 15.82, valueLabel: '15,82 GiB' },
        ],
      },
      {
        label: 'Cache della conversazione — cresce a ogni token',
        color: '#60a5fa',
        items: [
          { name: '1K di contesto', value: 0.2, valueLabel: '0,20 GiB' },
          { name: '8K di contesto', value: 0.64, valueLabel: '0,64 GiB' },
          { name: '32K di contesto', value: 2.14, valueLabel: '2,14 GiB' },
          { name: '128K di contesto', value: 8.14, valueLabel: '8,14 GiB' },
          { name: '256K di contesto', value: 16.14, valueLabel: '16,14 GiB', emphasis: true },
        ],
      },
    ],
  },
  'memoria-llm-local-anatomia-he': {
    max: 32,
    groups: [
      {
        label: 'משקלי המודל — אינם משתנים',
        color: '#64748b',
        items: [
          { name: 'הקשר של 1K', value: 15.82, valueLabel: '15.82 GiB' },
          { name: 'הקשר של 8K', value: 15.82, valueLabel: '15.82 GiB' },
          { name: 'הקשר של 32K', value: 15.82, valueLabel: '15.82 GiB' },
          { name: 'הקשר של 128K', value: 15.82, valueLabel: '15.82 GiB' },
          { name: 'הקשר של 256K', value: 15.82, valueLabel: '15.82 GiB' },
        ],
      },
      {
        label: 'מטמון השיחה — גדל עם כל אסימון',
        color: '#60a5fa',
        items: [
          { name: 'הקשר של 1K', value: 0.2, valueLabel: '0.20 GiB' },
          { name: 'הקשר של 8K', value: 0.64, valueLabel: '0.64 GiB' },
          { name: 'הקשר של 32K', value: 2.14, valueLabel: '2.14 GiB' },
          { name: 'הקשר של 128K', value: 8.14, valueLabel: '8.14 GiB' },
          { name: 'הקשר של 256K', value: 16.14, valueLabel: '16.14 GiB', emphasis: true },
        ],
      },
    ],
  },

  /**
   * `robos-2026-100m-reguas` — tempos dos 100 m que circularam na semana dos
   * World Humanoid Robot Games 2026, em BLOCOS POR RÉGUA. Nunca fundir num
   * ranking: a tese do artigo é que os quatro números foram medidos sob regras
   * diferentes (recorde humano da World Athletics; bateria oficial dos Jogos;
   * evento-teste fora de competição; edição anterior).
   *
   * PROCEDÊNCIA (verificada 24/08/2026): 9,58 s = World Athletics (Bolt,
   * Berlim, 16/08/2009). 9,39 s = Tiangong Ultra, bateria 9 do grupo grande,
   * 22/08 (Global Times 1368761; placar lido no frame ~18 s do vídeo de
   * @TrungTPhan 2091183427303383137, "大型组100米预赛9组 9.39"). 9,47 s = Honor
   * Lightning, mesma bateria (ZOL 12358920; Ifeng 8vnwlRjYjf5). 9,32 s = Honor
   * Lightning em evento-teste preparatório, reportado pela CCTV (Reuters/Guardian
   * 22/08). 21,50 s = vencedor dos 100 m na 1.ª edição, 2025 (Wikipedia; Global
   * Times "cut from 21.50"). Paleta lote 7: azul = régua-tese (bateria oficial),
   * ouro = destaque (o número que viralizou), cinzas = blocos recessivos.
   * Labels em pt-BR; traduções ganham `-en/-es/-it/-he` (texto no gráfico).
   */
  'robos-2026-100m-reguas': {
    max: 24,
    groups: [
      {
        label: 'Jogos 2026 — bateria oficial (22/08, grupo grande, bateria 9)',
        color: '#60a5fa',
        items: [
          { name: 'Tiangong Ultra', value: 9.39, valueLabel: '9,39 s', emphasis: true },
          { name: 'Lightning (Honor)', value: 9.47, valueLabel: '9,47 s' },
        ],
      },
      {
        label: 'Evento-teste, fora de competição (CCTV)',
        color: '#a48f65',
        items: [
          { name: 'Lightning (Honor)', value: 9.32, valueLabel: '9,32 s — o número que viralizou', emphasis: true },
        ],
      },
      {
        label: 'Recorde humano — World Athletics (bloco, reação, vento, antidoping)',
        color: '#64748b',
        items: [{ name: 'Usain Bolt, 2009', value: 9.58, valueLabel: '9,58 s' }],
      },
      {
        label: 'Jogos 2025 — vencedor dos 100 m',
        color: '#3f3f46',
        items: [{ name: '1.ª edição', value: 21.5, valueLabel: '21,50 s' }],
      },
    ],
  },
  /**
   * `robos-2026-100m-reguas-en` — the 100 m times that circulated during the
   * week of the World Humanoid Robot Games 2026, IN BLOCKS BY RULER. Never
   * merge them into a single ranking: the article's thesis is that the four
   * numbers were measured under different rules (World Athletics human record;
   * official heat at the Games; test event outside competition; previous
   * edition).
   *
   * PROVENANCE (verified 24 Aug 2026): 9.58 s = World Athletics (Bolt,
   * Berlin, 16 Aug 2009). 9.39 s = Tiangong Ultra, heat 9 of the large group,
   * 22 Aug (Global Times 1368761; scoreboard read on the ~18 s frame of the
   * @TrungTPhan video 2091183427303383137, "大型组100米预赛9组 9.39"). 9.47 s =
   * Honor Lightning, same heat (ZOL 12358920; Ifeng 8vnwlRjYjf5). 9.32 s =
   * Honor Lightning at a preparatory test event, reported by CCTV
   * (Reuters/Guardian 22 Aug). 21.50 s = winner of the 100 m at the 1st
   * edition, 2025 (Wikipedia; Global Times "cut from 21.50"). Batch 7 palette:
   * blue = thesis ruler (official heat), gold = highlight (the number that went
   * viral), greys = recessive blocks. Labels in EN; this is the `-en`
   * translation of `robos-2026-100m-reguas` (only the in-chart text changes).
   */
  'robos-2026-100m-reguas-en': {
    max: 24,
    groups: [
      {
        label: '2026 Games — official heat (22 Aug, large group, heat 9)',
        color: '#60a5fa',
        items: [
          { name: 'Tiangong Ultra', value: 9.39, valueLabel: '9.39 s', emphasis: true },
          { name: 'Lightning (Honor)', value: 9.47, valueLabel: '9.47 s' },
        ],
      },
      {
        label: 'Test event, outside competition (CCTV)',
        color: '#a48f65',
        items: [
          { name: 'Lightning (Honor)', value: 9.32, valueLabel: '9.32 s — the number that went viral', emphasis: true },
        ],
      },
      {
        label: 'Human record — World Athletics (blocks, reaction time, wind, anti-doping)',
        color: '#64748b',
        items: [{ name: 'Usain Bolt, 2009', value: 9.58, valueLabel: '9.58 s' }],
      },
      {
        label: '2025 Games — 100 m winner',
        color: '#3f3f46',
        items: [{ name: '1st edition', value: 21.5, valueLabel: '21.50 s' }],
      },
    ],
  },
  /**
   * `robos-2026-100m-reguas-es` — tiempos de los 100 m que circularon en la
   * semana de los World Humanoid Robot Games 2026, en BLOQUES POR VARA. Nunca
   * fundir en un ranking: la tesis del artículo es que los cuatro números se
   * midieron bajo reglas distintas (récord humano de World Athletics; serie
   * oficial de los Juegos; evento-test fuera de competición; edición anterior).
   *
   * PROCEDENCIA (verificada el 24/08/2026): 9,58 s = World Athletics (Bolt,
   * Berlín, 16/08/2009). 9,39 s = Tiangong Ultra, serie 9 del grupo grande,
   * 22/08 (Global Times 1368761; marcador leído en el frame ~18 s del video de
   * @TrungTPhan 2091183427303383137, "大型组100米预赛9组 9.39"). 9,47 s = Honor
   * Lightning, misma serie (ZOL 12358920; Ifeng 8vnwlRjYjf5). 9,32 s = Honor
   * Lightning en evento-test preparatorio, reportado por la CCTV (Reuters/Guardian
   * 22/08). 21,50 s = ganador de los 100 m en la 1.ª edición, 2025 (Wikipedia;
   * Global Times "cut from 21.50"). Paleta lote 7: azul = vara-tesis (serie
   * oficial), oro = destacado (el número que se hizo viral), grises = bloques
   * recesivos. Etiquetas en español; el original en pt-BR es la clave
   * `robos-2026-100m-reguas`.
   */
  'robos-2026-100m-reguas-es': {
    max: 24,
    groups: [
      {
        label: 'Juegos 2026 — serie oficial (22/08, grupo grande, serie 9)',
        color: '#60a5fa',
        items: [
          { name: 'Tiangong Ultra', value: 9.39, valueLabel: '9,39 s', emphasis: true },
          { name: 'Lightning (Honor)', value: 9.47, valueLabel: '9,47 s' },
        ],
      },
      {
        label: 'Evento-test, fuera de competición (CCTV)',
        color: '#a48f65',
        items: [
          { name: 'Lightning (Honor)', value: 9.32, valueLabel: '9,32 s — el número que se hizo viral', emphasis: true },
        ],
      },
      {
        label: 'Récord humano — World Athletics (taco de salida, reacción, viento, antidopaje)',
        color: '#64748b',
        items: [{ name: 'Usain Bolt, 2009', value: 9.58, valueLabel: '9,58 s' }],
      },
      {
        label: 'Juegos 2025 — ganador de los 100 m',
        color: '#3f3f46',
        items: [{ name: '1.ª edición', value: 21.5, valueLabel: '21,50 s' }],
      },
    ],
  },
  /**
   * `robos-2026-100m-reguas-it` — tradução IT dos labels de
   * `robos-2026-100m-reguas`. Números, cores e estrutura IDÊNTICOS ao dataset
   * pt-BR; só o texto renderizado no gráfico muda. Procedência e ressalvas:
   * ver o comentário do dataset original em `artigos-charts-addition.ts`.
   */
  'robos-2026-100m-reguas-it': {
    max: 24,
    groups: [
      {
        label: 'Giochi 2026 — batteria ufficiale (22/08, gruppo grande, batteria 9)',
        color: '#60a5fa',
        items: [
          { name: 'Tiangong Ultra', value: 9.39, valueLabel: '9,39 s', emphasis: true },
          { name: 'Lightning (Honor)', value: 9.47, valueLabel: '9,47 s' },
        ],
      },
      {
        label: 'Evento-test, fuori competizione (CCTV)',
        color: '#a48f65',
        items: [
          { name: 'Lightning (Honor)', value: 9.32, valueLabel: '9,32 s — il numero diventato virale', emphasis: true },
        ],
      },
      {
        label: 'Record umano — World Athletics (blocchi, reazione, vento, antidoping)',
        color: '#64748b',
        items: [{ name: 'Usain Bolt, 2009', value: 9.58, valueLabel: '9,58 s' }],
      },
      {
        label: 'Giochi 2025 — vincitore dei 100 m',
        color: '#3f3f46',
        items: [{ name: '1ª edizione', value: 21.5, valueLabel: '21,50 s' }],
      },
    ],
  },
  /**
   * `robos-2026-100m-reguas-he` — tradução HE dos labels de
   * `robos-2026-100m-reguas`. Números, cores e estrutura IDÊNTICOS ao dataset
   * pt-BR; só o texto renderizado no gráfico muda. Procedência e ressalvas:
   * ver o comentário do dataset original acima.
   */
  'robos-2026-100m-reguas-he': {
    max: 24,
    groups: [
      {
        label: 'משחקי 2026 — מקצה רשמי (22/08, הקבוצה הגדולה, מקצה 9)',
        color: '#60a5fa',
        items: [
          { name: 'Tiangong Ultra', value: 9.39, valueLabel: '9.39 שניות', emphasis: true },
          { name: 'Lightning (Honor)', value: 9.47, valueLabel: '9.47 שניות' },
        ],
      },
      {
        label: 'אירוע-מבחן, מחוץ לתחרות (CCTV)',
        color: '#a48f65',
        items: [
          { name: 'Lightning (Honor)', value: 9.32, valueLabel: '9.32 שניות — המספר שהפך לוויראלי', emphasis: true },
        ],
      },
      {
        label: 'שיא אנושי — World Athletics (בלוק זינוק, זמן תגובה, רוח, אנטי-דופינג)',
        color: '#64748b',
        items: [{ name: 'יוסיין בולט, 2009', value: 9.58, valueLabel: '9.58 שניות' }],
      },
      {
        label: 'משחקי 2025 — המנצח ב-100 מטר',
        color: '#3f3f46',
        items: [{ name: 'מהדורה ראשונה', value: 21.5, valueLabel: '21.50 שניות' }],
      },
    ],
  },
  /**
   * `tokens-por-dolar-podio` — pódio da tabela viral separado em 3 réguas; cada régua normalizada ao melhor (=100), valor real no rótulo. PROCEDÊNCIA: entradas.json (specs/preços 25/08/2026) + calc_mix.MAQUINAS (t/s medidos llama.cpp #15396/#16578); gerado por gera_charts.py.
   */
  'tokens-por-dolar-podio': {
    max: 120,
    groups: [
      {
        label: "Capacidade por dólar",
        color: '#60a5fa',
        items: [
          { name: "NVIDIA DGX Spark", value: 100, valueLabel: "27,2 GB/k$", emphasis: true },
          { name: "Mac M5 Ultra 256GB", value: 98.9, valueLabel: "27,0 GB/k$" },
          { name: "RTX PRO 6000 + PC", value: 20.1, valueLabel: "5,5 GB/k$" },
          { name: "RTX 5090 + PC", value: 19.9, valueLabel: "5,4 GB/k$" },
        ],
      },
      {
        label: "Banda por dólar",
        color: '#fbbf24',
        items: [
          { name: "RTX 5090 + PC", value: 100, valueLabel: "304 GB/s/k$", emphasis: true },
          { name: "Mac M5 Ultra 256GB", value: 41.6, valueLabel: "126 GB/s/k$" },
          { name: "RTX PRO 6000 + PC", value: 33.7, valueLabel: "102 GB/s/k$" },
          { name: "NVIDIA DGX Spark", value: 19.1, valueLabel: "58 GB/s/k$" },
        ],
      },
      {
        label: "Tokens/s MEDIDOS por dólar (gpt-oss-120b)",
        color: '#a48f65',
        items: [
          { name: "NVIDIA DGX Spark", value: 100, valueLabel: "12,9 t/s/k$", emphasis: true },
          { name: "RTX PRO 6000 + PC", value: 86.9, valueLabel: "11,2 t/s/k$" },
          { name: "Mac M5 Ultra 256GB", value: 0, valueLabel: "sem benchmark — projeção fora da régua" },
          { name: "RTX 5090 + PC", value: 0, valueLabel: "não roda (32 GB < 62,8 GB)" },
        ],
      },
    ],
  },
  /**
   * `tokens-por-dolar-portao` — portão de capacidade: memória de cada máquina contra os 62,8 GB do gpt-oss-120b MXFP4 (margem de runtime de 85 % do calc.py). PROCEDÊNCIA: entradas.json; gerado por gera_charts.py.
   */
  'tokens-por-dolar-portao': {
    max: 300,
    groups: [
      {
        label: "O que o modelo exige",
        color: '#a48f65',
        items: [
          { name: "gpt-oss-120b", value: 62.8, valueLabel: "62,8 GB em MXFP4", emphasis: true },
        ],
      },
      {
        label: "O que cada máquina tem",
        color: '#60a5fa',
        items: [
          { name: "RTX 5090 + PC", value: 32, valueLabel: "32 GB — não cabe", emphasis: true },
          { name: "RTX PRO 6000 + PC", value: 96, valueLabel: "96 GB" },
          { name: "NVIDIA DGX Spark", value: 128, valueLabel: "128 GB" },
          { name: "Mac M5 Ultra 256GB", value: 256, valueLabel: "256 GB" },
        ],
      },
    ],
  },
  /**
   * `tokens-por-dolar-releitura` — fração de releitura (cache read) na entrada de carga de agente de código, 4 medições. PROCEDÊNCIA: fontes/G §3 (arXiv 2608.00101; Bun; doc Anthropic) + calc_util §6 (esta máquina); gerado por gera_charts.py.
   */
  'tokens-por-dolar-releitura': {
    max: 110,
    groups: [
      {
        label: "Fração da entrada que é releitura",
        color: '#60a5fa',
        items: [
          { name: "Copilot (produção)", value: 95.4, valueLabel: "95,4 %" },
          { name: "Bun (64 agentes)", value: 92.4, valueLabel: "92,4 %" },
          { name: "Anthropic (1 sessão)", value: 99.4, valueLabel: "99,4 %" },
          { name: "Esta máquina", value: 96.3, valueLabel: "96,3 %", emphasis: true },
        ],
      },
    ],
  },
  /**
   * `tokens-por-dolar-garfo` — mesma carga de 33 dias a 3 anos: trocar a regra de cache move a API 16,0x; trocar de máquina (regime B) move o hardware 3,6x. PROCEDÊNCIA: calc_util.py §6; gerado por gera_charts.py.
   */
  'tokens-por-dolar-garfo': {
    max: 41000,
    groups: [
      {
        label: "Trocar a REGRA de cache (mesma API) — 16,0x",
        color: '#fbbf24',
        items: [
          { name: "Grátis (A, controle)", value: 2120, valueLabel: "US$ 2.120" },
          { name: "Com desconto (B)", value: 5293, valueLabel: "US$ 5.293" },
          { name: "A preço cheio (D)", value: 33847, valueLabel: "US$ 33.847", emphasis: true },
        ],
      },
      {
        label: "Trocar de MÁQUINA (regime B) — 3,6x",
        color: '#60a5fa',
        items: [
          { name: "NVIDIA DGX Spark", value: 3423, valueLabel: "US$ 3.423", emphasis: true },
          { name: "Mac M5 Ultra *", value: 6877, valueLabel: "US$ 6.877" },
          { name: "RTX PRO 6000 + PC", value: 12431, valueLabel: "US$ 12.431" },
        ],
      },
    ],
  },
  /**
   * `tokens-por-dolar-contexto` — tokens de entrada por chamada (teto: tudo que o modelo viu) contra o contexto máximo do gpt-oss-120b. PROCEDÊNCIA: dados/uso-chamadas.csv via calc_util §1-bis; config.json de openai/gpt-oss-120b; gerado por gera_charts.py.
   */
  'tokens-por-dolar-contexto': {
    max: 650000,
    groups: [
      {
        label: "O que o modelo aceita",
        color: '#a48f65',
        items: [
          { name: "Teto do modelo", value: 131072, valueLabel: "131.072 tokens (gpt-oss-120b)", emphasis: true },
        ],
      },
      {
        label: "O que a carga pede, por chamada (43.593 chamadas)",
        color: '#60a5fa',
        items: [
          { name: "Mediana (p50)", value: 125285, valueLabel: "125,3 mil" },
          { name: "Média", value: 151907, valueLabel: "151,9 mil", emphasis: true },
          { name: "p90", value: 299463, valueLabel: "299,5 mil" },
          { name: "p99", value: 526699, valueLabel: "526,7 mil" },
        ],
      },
    ],
  },
  /**
   * `tokens-por-dolar-podio-en` — pódio da tabela viral separado em 3 réguas; cada régua normalizada ao melhor (=100), valor real no rótulo. PROCEDÊNCIA: entradas.json (specs/preços 25/08/2026) + calc_mix.MAQUINAS (t/s medidos llama.cpp #15396/#16578); gerado por gera_charts.py.
   */
  'tokens-por-dolar-podio-en': {
    max: 120,
    groups: [
      {
        label: "Capacity per dollar",
        color: '#60a5fa',
        items: [
          { name: "NVIDIA DGX Spark", value: 100, valueLabel: "27.2 GB/k$", emphasis: true },
          { name: "Mac M5 Ultra 256GB", value: 98.9, valueLabel: "27.0 GB/k$" },
          { name: "RTX PRO 6000 + PC", value: 20.1, valueLabel: "5.5 GB/k$" },
          { name: "RTX 5090 + PC", value: 19.9, valueLabel: "5.4 GB/k$" },
        ],
      },
      {
        label: "Bandwidth per dollar",
        color: '#fbbf24',
        items: [
          { name: "RTX 5090 + PC", value: 100, valueLabel: "304 GB/s/k$", emphasis: true },
          { name: "Mac M5 Ultra 256GB", value: 41.6, valueLabel: "126 GB/s/k$" },
          { name: "RTX PRO 6000 + PC", value: 33.7, valueLabel: "102 GB/s/k$" },
          { name: "NVIDIA DGX Spark", value: 19.1, valueLabel: "58 GB/s/k$" },
        ],
      },
      {
        label: "MEASURED tokens/s per dollar (gpt-oss-120b)",
        color: '#a48f65',
        items: [
          { name: "NVIDIA DGX Spark", value: 100, valueLabel: "12.9 t/s/k$", emphasis: true },
          { name: "RTX PRO 6000 + PC", value: 86.9, valueLabel: "11.2 t/s/k$" },
          { name: "Mac M5 Ultra 256GB", value: 0, valueLabel: "no benchmark — projection, off this scale" },
          { name: "RTX 5090 + PC", value: 0, valueLabel: "won't run (32 GB < 62.8 GB)" },
        ],
      },
    ],
  },
  /**
   * `tokens-por-dolar-portao-en` — portão de capacidade: memória de cada máquina contra os 62,8 GB do gpt-oss-120b MXFP4 (margem de runtime de 85 % do calc.py). PROCEDÊNCIA: entradas.json; gerado por gera_charts.py.
   */
  'tokens-por-dolar-portao-en': {
    max: 300,
    groups: [
      {
        label: "What the model needs",
        color: '#a48f65',
        items: [
          { name: "gpt-oss-120b", value: 62.8, valueLabel: "62.8 GB in MXFP4", emphasis: true },
        ],
      },
      {
        label: "What each machine has",
        color: '#60a5fa',
        items: [
          { name: "RTX 5090 + PC", value: 32, valueLabel: "32 GB — doesn't fit", emphasis: true },
          { name: "RTX PRO 6000 + PC", value: 96, valueLabel: "96 GB" },
          { name: "NVIDIA DGX Spark", value: 128, valueLabel: "128 GB" },
          { name: "Mac M5 Ultra 256GB", value: 256, valueLabel: "256 GB" },
        ],
      },
    ],
  },
  /**
   * `tokens-por-dolar-releitura-en` — fração de releitura (cache read) na entrada de carga de agente de código, 4 medições. PROCEDÊNCIA: fontes/G §3 (arXiv 2608.00101; Bun; doc Anthropic) + calc_util §6 (esta máquina); gerado por gera_charts.py.
   */
  'tokens-por-dolar-releitura-en': {
    max: 110,
    groups: [
      {
        label: "Share of input that is re-reading",
        color: '#60a5fa',
        items: [
          { name: "Copilot (production)", value: 95.4, valueLabel: "95.4%" },
          { name: "Bun (64 agents)", value: 92.4, valueLabel: "92.4%" },
          { name: "Anthropic (1 session)", value: 99.4, valueLabel: "99.4%" },
          { name: "This machine", value: 96.3, valueLabel: "96.3%", emphasis: true },
        ],
      },
    ],
  },
  /**
   * `tokens-por-dolar-garfo-en` — mesma carga de 33 dias a 3 anos: trocar a regra de cache move a API 16,0x; trocar de máquina (regime B) move o hardware 3,6x. PROCEDÊNCIA: calc_util.py §6; gerado por gera_charts.py.
   */
  'tokens-por-dolar-garfo-en': {
    max: 41000,
    groups: [
      {
        label: "Change the cache RULE (same API) — 16.0x",
        color: '#fbbf24',
        items: [
          { name: "Free (A, control)", value: 2120, valueLabel: "US$ 2,120" },
          { name: "Discounted (B)", value: 5293, valueLabel: "US$ 5,293" },
          { name: "Full price (D)", value: 33847, valueLabel: "US$ 33,847", emphasis: true },
        ],
      },
      {
        label: "Change the MACHINE (regime B) — 3.6x",
        color: '#60a5fa',
        items: [
          { name: "NVIDIA DGX Spark", value: 3423, valueLabel: "US$ 3,423", emphasis: true },
          { name: "Mac M5 Ultra *", value: 6877, valueLabel: "US$ 6,877" },
          { name: "RTX PRO 6000 + PC", value: 12431, valueLabel: "US$ 12,431" },
        ],
      },
    ],
  },
  /**
   * `tokens-por-dolar-contexto-en` — tokens de entrada por chamada (teto: tudo que o modelo viu) contra o contexto máximo do gpt-oss-120b. PROCEDÊNCIA: dados/uso-chamadas.csv via calc_util §1-bis; config.json de openai/gpt-oss-120b; gerado por gera_charts.py.
   */
  'tokens-por-dolar-contexto-en': {
    max: 650000,
    groups: [
      {
        label: "What the model accepts",
        color: '#a48f65',
        items: [
          { name: "Model ceiling", value: 131072, valueLabel: "131,072 tokens (gpt-oss-120b)", emphasis: true },
        ],
      },
      {
        label: "What the load asks, per call (43,593 calls)",
        color: '#60a5fa',
        items: [
          { name: "Median (p50)", value: 125285, valueLabel: "125.3K" },
          { name: "Mean", value: 151907, valueLabel: "151.9K", emphasis: true },
          { name: "p90", value: 299463, valueLabel: "299.5K" },
          { name: "p99", value: 526699, valueLabel: "526.7K" },
        ],
      },
    ],
  },
  /**
   * `tokens-por-dolar-podio-es` — pódio da tabela viral separado em 3 réguas; cada régua normalizada ao melhor (=100), valor real no rótulo. PROCEDÊNCIA: entradas.json (specs/preços 25/08/2026) + calc_mix.MAQUINAS (t/s medidos llama.cpp #15396/#16578); gerado por gera_charts.py.
   */
  'tokens-por-dolar-podio-es': {
    max: 120,
    groups: [
      {
        label: "Capacidad por dólar",
        color: '#60a5fa',
        items: [
          { name: "NVIDIA DGX Spark", value: 100, valueLabel: "27,2 GB/k$", emphasis: true },
          { name: "Mac M5 Ultra 256GB", value: 98.9, valueLabel: "27,0 GB/k$" },
          { name: "RTX PRO 6000 + PC", value: 20.1, valueLabel: "5,5 GB/k$" },
          { name: "RTX 5090 + PC", value: 19.9, valueLabel: "5,4 GB/k$" },
        ],
      },
      {
        label: "Ancho de banda por dólar",
        color: '#fbbf24',
        items: [
          { name: "RTX 5090 + PC", value: 100, valueLabel: "304 GB/s/k$", emphasis: true },
          { name: "Mac M5 Ultra 256GB", value: 41.6, valueLabel: "126 GB/s/k$" },
          { name: "RTX PRO 6000 + PC", value: 33.7, valueLabel: "102 GB/s/k$" },
          { name: "NVIDIA DGX Spark", value: 19.1, valueLabel: "58 GB/s/k$" },
        ],
      },
      {
        label: "Tokens/s MEDIDOS por dólar (gpt-oss-120b)",
        color: '#a48f65',
        items: [
          { name: "NVIDIA DGX Spark", value: 100, valueLabel: "12,9 t/s/k$", emphasis: true },
          { name: "RTX PRO 6000 + PC", value: 86.9, valueLabel: "11,2 t/s/k$" },
          { name: "Mac M5 Ultra 256GB", value: 0, valueLabel: "sin benchmark — proyección fuera de la regla" },
          { name: "RTX 5090 + PC", value: 0, valueLabel: "no corre (32 GB < 62,8 GB)" },
        ],
      },
    ],
  },
  /**
   * `tokens-por-dolar-portao-es` — portão de capacidade: memória de cada máquina contra os 62,8 GB do gpt-oss-120b MXFP4 (margem de runtime de 85 % do calc.py). PROCEDÊNCIA: entradas.json; gerado por gera_charts.py.
   */
  'tokens-por-dolar-portao-es': {
    max: 300,
    groups: [
      {
        label: "Lo que exige el modelo",
        color: '#a48f65',
        items: [
          { name: "gpt-oss-120b", value: 62.8, valueLabel: "62,8 GB en MXFP4", emphasis: true },
        ],
      },
      {
        label: "Lo que tiene cada máquina",
        color: '#60a5fa',
        items: [
          { name: "RTX 5090 + PC", value: 32, valueLabel: "32 GB — no cabe", emphasis: true },
          { name: "RTX PRO 6000 + PC", value: 96, valueLabel: "96 GB" },
          { name: "NVIDIA DGX Spark", value: 128, valueLabel: "128 GB" },
          { name: "Mac M5 Ultra 256GB", value: 256, valueLabel: "256 GB" },
        ],
      },
    ],
  },
  /**
   * `tokens-por-dolar-releitura-es` — fração de releitura (cache read) na entrada de carga de agente de código, 4 medições. PROCEDÊNCIA: fontes/G §3 (arXiv 2608.00101; Bun; doc Anthropic) + calc_util §6 (esta máquina); gerado por gera_charts.py.
   */
  'tokens-por-dolar-releitura-es': {
    max: 110,
    groups: [
      {
        label: "Fracción de la entrada que es relectura",
        color: '#60a5fa',
        items: [
          { name: "Copilot (producción)", value: 95.4, valueLabel: "95,4 %" },
          { name: "Bun (64 agentes)", value: 92.4, valueLabel: "92,4 %" },
          { name: "Anthropic (1 sesión)", value: 99.4, valueLabel: "99,4 %" },
          { name: "Esta máquina", value: 96.3, valueLabel: "96,3 %", emphasis: true },
        ],
      },
    ],
  },
  /**
   * `tokens-por-dolar-garfo-es` — mesma carga de 33 dias a 3 anos: trocar a regra de cache move a API 16,0x; trocar de máquina (regime B) move o hardware 3,6x. PROCEDÊNCIA: calc_util.py §6; gerado por gera_charts.py.
   */
  'tokens-por-dolar-garfo-es': {
    max: 41000,
    groups: [
      {
        label: "Cambiar la REGLA de caché (misma API) — 16,0x",
        color: '#fbbf24',
        items: [
          { name: "Gratis (A, control)", value: 2120, valueLabel: "US$ 2.120" },
          { name: "Con descuento (B)", value: 5293, valueLabel: "US$ 5.293" },
          { name: "Precio completo (D)", value: 33847, valueLabel: "US$ 33.847", emphasis: true },
        ],
      },
      {
        label: "Cambiar de MÁQUINA (régimen B) — 3,6x",
        color: '#60a5fa',
        items: [
          { name: "NVIDIA DGX Spark", value: 3423, valueLabel: "US$ 3.423", emphasis: true },
          { name: "Mac M5 Ultra *", value: 6877, valueLabel: "US$ 6.877" },
          { name: "RTX PRO 6000 + PC", value: 12431, valueLabel: "US$ 12.431" },
        ],
      },
    ],
  },
  /**
   * `tokens-por-dolar-contexto-es` — tokens de entrada por chamada (teto: tudo que o modelo viu) contra o contexto máximo do gpt-oss-120b. PROCEDÊNCIA: dados/uso-chamadas.csv via calc_util §1-bis; config.json de openai/gpt-oss-120b; gerado por gera_charts.py.
   */
  'tokens-por-dolar-contexto-es': {
    max: 650000,
    groups: [
      {
        label: "Lo que acepta el modelo",
        color: '#a48f65',
        items: [
          { name: "Techo del modelo", value: 131072, valueLabel: "131.072 tokens (gpt-oss-120b)", emphasis: true },
        ],
      },
      {
        label: "Lo que pide la carga, por llamada (43.593 llamadas)",
        color: '#60a5fa',
        items: [
          { name: "Mediana (p50)", value: 125285, valueLabel: "125,3 mil" },
          { name: "Media", value: 151907, valueLabel: "151,9 mil", emphasis: true },
          { name: "p90", value: 299463, valueLabel: "299,5 mil" },
          { name: "p99", value: 526699, valueLabel: "526,7 mil" },
        ],
      },
    ],
  },
  /**
   * `tokens-por-dolar-podio-it` — pódio da tabela viral separado em 3 réguas; cada régua normalizada ao melhor (=100), valor real no rótulo. PROCEDÊNCIA: entradas.json (specs/preços 25/08/2026) + calc_mix.MAQUINAS (t/s medidos llama.cpp #15396/#16578); gerado por gera_charts.py.
   */
  'tokens-por-dolar-podio-it': {
    max: 120,
    groups: [
      {
        label: "Capacità per dollaro",
        color: '#60a5fa',
        items: [
          { name: "NVIDIA DGX Spark", value: 100, valueLabel: "27,2 GB/k$", emphasis: true },
          { name: "Mac M5 Ultra 256GB", value: 98.9, valueLabel: "27,0 GB/k$" },
          { name: "RTX PRO 6000 + PC", value: 20.1, valueLabel: "5,5 GB/k$" },
          { name: "RTX 5090 + PC", value: 19.9, valueLabel: "5,4 GB/k$" },
        ],
      },
      {
        label: "Banda per dollaro",
        color: '#fbbf24',
        items: [
          { name: "RTX 5090 + PC", value: 100, valueLabel: "304 GB/s/k$", emphasis: true },
          { name: "Mac M5 Ultra 256GB", value: 41.6, valueLabel: "126 GB/s/k$" },
          { name: "RTX PRO 6000 + PC", value: 33.7, valueLabel: "102 GB/s/k$" },
          { name: "NVIDIA DGX Spark", value: 19.1, valueLabel: "58 GB/s/k$" },
        ],
      },
      {
        label: "Token/s MISURATI per dollaro (gpt-oss-120b)",
        color: '#a48f65',
        items: [
          { name: "NVIDIA DGX Spark", value: 100, valueLabel: "12,9 t/s/k$", emphasis: true },
          { name: "RTX PRO 6000 + PC", value: 86.9, valueLabel: "11,2 t/s/k$" },
          { name: "Mac M5 Ultra 256GB", value: 0, valueLabel: "senza benchmark — proiezione fuori scala" },
          { name: "RTX 5090 + PC", value: 0, valueLabel: "non gira (32 GB < 62,8 GB)" },
        ],
      },
    ],
  },
  /**
   * `tokens-por-dolar-portao-it` — portão de capacidade: memória de cada máquina contra os 62,8 GB do gpt-oss-120b MXFP4 (margem de runtime de 85 % do calc.py). PROCEDÊNCIA: entradas.json; gerado por gera_charts.py.
   */
  'tokens-por-dolar-portao-it': {
    max: 300,
    groups: [
      {
        label: "Ciò che il modello richiede",
        color: '#a48f65',
        items: [
          { name: "gpt-oss-120b", value: 62.8, valueLabel: "62,8 GB in MXFP4", emphasis: true },
        ],
      },
      {
        label: "Ciò che ha ogni macchina",
        color: '#60a5fa',
        items: [
          { name: "RTX 5090 + PC", value: 32, valueLabel: "32 GB — non ci sta", emphasis: true },
          { name: "RTX PRO 6000 + PC", value: 96, valueLabel: "96 GB" },
          { name: "NVIDIA DGX Spark", value: 128, valueLabel: "128 GB" },
          { name: "Mac M5 Ultra 256GB", value: 256, valueLabel: "256 GB" },
        ],
      },
    ],
  },
  /**
   * `tokens-por-dolar-releitura-it` — fração de releitura (cache read) na entrada de carga de agente de código, 4 medições. PROCEDÊNCIA: fontes/G §3 (arXiv 2608.00101; Bun; doc Anthropic) + calc_util §6 (esta máquina); gerado por gera_charts.py.
   */
  'tokens-por-dolar-releitura-it': {
    max: 110,
    groups: [
      {
        label: "Quota dell'ingresso che è rilettura",
        color: '#60a5fa',
        items: [
          { name: "Copilot (produzione)", value: 95.4, valueLabel: "95,4 %" },
          { name: "Bun (64 agenti)", value: 92.4, valueLabel: "92,4 %" },
          { name: "Anthropic (1 sess.)", value: 99.4, valueLabel: "99,4 %" },
          { name: "Questa macchina", value: 96.3, valueLabel: "96,3 %", emphasis: true },
        ],
      },
    ],
  },
  /**
   * `tokens-por-dolar-garfo-it` — mesma carga de 33 dias a 3 anos: trocar a regra de cache move a API 16,0x; trocar de máquina (regime B) move o hardware 3,6x. PROCEDÊNCIA: calc_util.py §6; gerado por gera_charts.py.
   */
  'tokens-por-dolar-garfo-it': {
    max: 41000,
    groups: [
      {
        label: "Cambiare la REGOLA di cache (stessa API) — 16,0x",
        color: '#fbbf24',
        items: [
          { name: "Gratis (A, controllo)", value: 2120, valueLabel: "US$ 2.120" },
          { name: "Con sconto (B)", value: 5293, valueLabel: "US$ 5.293" },
          { name: "A prezzo pieno (D)", value: 33847, valueLabel: "US$ 33.847", emphasis: true },
        ],
      },
      {
        label: "Cambiare MACCHINA (regime B) — 3,6x",
        color: '#60a5fa',
        items: [
          { name: "NVIDIA DGX Spark", value: 3423, valueLabel: "US$ 3.423", emphasis: true },
          { name: "Mac M5 Ultra *", value: 6877, valueLabel: "US$ 6.877" },
          { name: "RTX PRO 6000 + PC", value: 12431, valueLabel: "US$ 12.431" },
        ],
      },
    ],
  },
  /**
   * `tokens-por-dolar-contexto-it` — tokens de entrada por chamada (teto: tudo que o modelo viu) contra o contexto máximo do gpt-oss-120b. PROCEDÊNCIA: dados/uso-chamadas.csv via calc_util §1-bis; config.json de openai/gpt-oss-120b; gerado por gera_charts.py.
   */
  'tokens-por-dolar-contexto-it': {
    max: 650000,
    groups: [
      {
        label: "Ciò che il modello accetta",
        color: '#a48f65',
        items: [
          { name: "Tetto del modello", value: 131072, valueLabel: "131.072 tokens (gpt-oss-120b)", emphasis: true },
        ],
      },
      {
        label: "Ciò che il carico chiede, per chiamata (43.593 chiamate)",
        color: '#60a5fa',
        items: [
          { name: "Mediana (p50)", value: 125285, valueLabel: "125,3 mila" },
          { name: "Media", value: 151907, valueLabel: "151,9 mila", emphasis: true },
          { name: "p90", value: 299463, valueLabel: "299,5 mila" },
          { name: "p99", value: 526699, valueLabel: "526,7 mila" },
        ],
      },
    ],
  },
  /**
   * `tokens-por-dolar-podio-he` — pódio da tabela viral separado em 3 réguas; cada régua normalizada ao melhor (=100), valor real no rótulo. PROCEDÊNCIA: entradas.json (specs/preços 25/08/2026) + calc_mix.MAQUINAS (t/s medidos llama.cpp #15396/#16578); gerado por gera_charts.py.
   */
  'tokens-por-dolar-podio-he': {
    max: 120,
    groups: [
      {
        label: "קיבולת לדולר",
        color: '#60a5fa',
        items: [
          { name: "NVIDIA DGX Spark", value: 100, valueLabel: "27.2 GB/k$", emphasis: true },
          { name: "Mac M5 Ultra 256GB", value: 98.9, valueLabel: "27.0 GB/k$" },
          { name: "RTX PRO 6000 + PC", value: 20.1, valueLabel: "5.5 GB/k$" },
          { name: "RTX 5090 + PC", value: 19.9, valueLabel: "5.4 GB/k$" },
        ],
      },
      {
        label: "רוחב פס לדולר",
        color: '#fbbf24',
        items: [
          { name: "RTX 5090 + PC", value: 100, valueLabel: "304 GB/s/k$", emphasis: true },
          { name: "Mac M5 Ultra 256GB", value: 41.6, valueLabel: "126 GB/s/k$" },
          { name: "RTX PRO 6000 + PC", value: 33.7, valueLabel: "102 GB/s/k$" },
          { name: "NVIDIA DGX Spark", value: 19.1, valueLabel: "58 GB/s/k$" },
        ],
      },
      {
        label: "טוקנים/שנייה שנמדדו לדולר (gpt-oss-120b)",
        color: '#a48f65',
        items: [
          { name: "NVIDIA DGX Spark", value: 100, valueLabel: "12.9 t/s/k$", emphasis: true },
          { name: "RTX PRO 6000 + PC", value: 86.9, valueLabel: "11.2 t/s/k$" },
          { name: "Mac M5 Ultra 256GB", value: 0, valueLabel: "אין מדידה — תחזית מחוץ לסולם" },
          { name: "RTX 5090 + PC", value: 0, valueLabel: "לא רץ (32 GB < 62.8 GB)" },
        ],
      },
    ],
  },
  /**
   * `tokens-por-dolar-portao-he` — portão de capacidade: memória de cada máquina contra os 62,8 GB do gpt-oss-120b MXFP4 (margem de runtime de 85 % do calc.py). PROCEDÊNCIA: entradas.json; gerado por gera_charts.py.
   */
  'tokens-por-dolar-portao-he': {
    max: 300,
    groups: [
      {
        label: "מה שהמודל דורש",
        color: '#a48f65',
        items: [
          { name: "gpt-oss-120b", value: 62.8, valueLabel: "62.8 GB (MXFP4)", emphasis: true },
        ],
      },
      {
        label: "מה שיש לכל מכונה",
        color: '#60a5fa',
        items: [
          { name: "RTX 5090 + PC", value: 32, valueLabel: "32 GB — לא נכנס", emphasis: true },
          { name: "RTX PRO 6000 + PC", value: 96, valueLabel: "96 GB" },
          { name: "NVIDIA DGX Spark", value: 128, valueLabel: "128 GB" },
          { name: "Mac M5 Ultra 256GB", value: 256, valueLabel: "256 GB" },
        ],
      },
    ],
  },
  /**
   * `tokens-por-dolar-releitura-he` — fração de releitura (cache read) na entrada de carga de agente de código, 4 medições. PROCEDÊNCIA: fontes/G §3 (arXiv 2608.00101; Bun; doc Anthropic) + calc_util §6 (esta máquina); gerado por gera_charts.py.
   */
  'tokens-por-dolar-releitura-he': {
    max: 110,
    groups: [
      {
        label: "חלק הקלט שהוא קריאה חוזרת",
        color: '#60a5fa',
        items: [
          { name: "Copilot (ייצור)", value: 95.4, valueLabel: "95.4%" },
          { name: "Bun (64 סוכנים)", value: 92.4, valueLabel: "92.4%" },
          { name: "Anthropic (סשן 1)", value: 99.4, valueLabel: "99.4%" },
          { name: "המכונה הזאת", value: 96.3, valueLabel: "96.3%", emphasis: true },
        ],
      },
    ],
  },
  /**
   * `tokens-por-dolar-garfo-he` — mesma carga de 33 dias a 3 anos: trocar a regra de cache move a API 16,0x; trocar de máquina (regime B) move o hardware 3,6x. PROCEDÊNCIA: calc_util.py §6; gerado por gera_charts.py.
   */
  'tokens-por-dolar-garfo-he': {
    max: 41000,
    groups: [
      {
        label: "להחליף את כלל המטמון (אותו API) — 16.0x",
        color: '#fbbf24',
        items: [
          { name: "חינם (ביקורת, A)", value: 2120, valueLabel: "US$ 2,120" },
          { name: "עם הנחה (B)", value: 5293, valueLabel: "US$ 5,293" },
          { name: "במחיר מלא (D)", value: 33847, valueLabel: "US$ 33,847", emphasis: true },
        ],
      },
      {
        label: "להחליף מכונה (משטר B) — 3.6x",
        color: '#60a5fa',
        items: [
          { name: "NVIDIA DGX Spark", value: 3423, valueLabel: "US$ 3,423", emphasis: true },
          { name: "Mac M5 Ultra *", value: 6877, valueLabel: "US$ 6,877" },
          { name: "RTX PRO 6000 + PC", value: 12431, valueLabel: "US$ 12,431" },
        ],
      },
    ],
  },
  /**
   * `tokens-por-dolar-contexto-he` — tokens de entrada por chamada (teto: tudo que o modelo viu) contra o contexto máximo do gpt-oss-120b. PROCEDÊNCIA: dados/uso-chamadas.csv via calc_util §1-bis; config.json de openai/gpt-oss-120b; gerado por gera_charts.py.
   */
  'tokens-por-dolar-contexto-he': {
    max: 650000,
    groups: [
      {
        label: "מה שהמודל מקבל",
        color: '#a48f65',
        items: [
          { name: "תקרת המודל", value: 131072, valueLabel: "131,072 tokens (gpt-oss-120b)", emphasis: true },
        ],
      },
      {
        label: "מה שהעומס מבקש, לקריאה (43,593 קריאות)",
        color: '#60a5fa',
        items: [
          { name: "חציון (p50)", value: 125285, valueLabel: "125.3 אלף" },
          { name: "ממוצע", value: 151907, valueLabel: "151.9 אלף", emphasis: true },
          { name: "p90", value: 299463, valueLabel: "299.5 אלף" },
          { name: "p99", value: 526699, valueLabel: "526.7 אלף" },
        ],
      },
    ],
  },

  /* ── estatisticas-agentes-de-ia (pt-br, en, es, it) ── */
  /**
   * `agentes-nenhum-uso-funcao` — bloco 1: % "Not at all" (nenhum uso de agente) por função,
   * McKinsey 2025 republicado no AI Index 2026, Fig. 4.3.7 (N não declarado no capítulo).
   * Bloco 2: agentes em produção em DUAS populações diferentes — LangChain State of Agent
   * Engineering 2026 (n = 1.340, campo nov-dez/2025) e Stack Overflow Developer Survey 2025
   * (n = 33.662, "usam agentes diariamente"). NUNCA fundir num ranking: a tese do artigo é
   * que são perguntas diferentes a populações diferentes.
   */
  'agentes-nenhum-uso-funcao': {
    max: 100,
    groups: [
      {
        label: 'Declaram NENHUM uso de agente na função (McKinsey 2025, via AI Index)',
        color: '#64748b',
        items: [
          { name: 'Manufatura', value: 91, valueLabel: '91%', emphasis: true },
          { name: 'Suprimentos', value: 88, valueLabel: '88%' },
          { name: 'Finanças corp.', value: 85, valueLabel: '85%' },
          { name: 'RH', value: 82, valueLabel: '82%' },
          { name: 'Eng. de software', value: 77, valueLabel: '77%' },
          { name: 'TI', value: 69, valueLabel: '69%' },
          { name: 'Conhecimento', value: 66, valueLabel: '66%' },
        ],
      },
      {
        label: 'Declaram agente em produção — outra pergunta, outra população',
        color: '#60a5fa',
        items: [
          { name: 'LangChain', value: 57, valueLabel: '57% · n = 1.340', emphasis: true },
          { name: 'Stack Overflow', value: 14.1, valueLabel: '14,1% · diário' },
        ],
      },
    ],
  },

  /**
   * `agentes-metr-percepcao` — tempo relativo para concluir a tarefa com IA, sem IA = 100.
   * PROCEDÊNCIA: METR, 10/07/2025 — devs previram −24% de tempo; medido +19% (IC 95%: +2% a
   * +39%); estimaram depois −20%. Conversão 100 × (1 + variação) feita pelo autor.
   */
  'agentes-metr-percepcao': {
    max: 130,
    groups: [
      {
        label: 'Tempo para concluir a tarefa com IA (sem IA = 100)',
        color: '#fbbf24',
        items: [
          { name: 'Previsto antes', value: 76, valueLabel: '76 · −24%' },
          { name: 'Medido (cronômetro)', value: 119, valueLabel: '119 · +19%', emphasis: true },
          { name: 'Estimado depois', value: 80, valueLabel: '80 · −20%' },
        ],
      },
    ],
  },

  /**
   * `agentes-mcp-sdk-mensal` — downloads mensais de @modelcontextprotocol/sdk no npm.
   * PROCEDÊNCIA: api.npmjs.org/downloads/range, medida pelo autor em 26/08/2026
   * (fontes/serie-npm-encanamento.json + sonda-npm-encanamento.py). jan/2025 = 176.533;
   * jul/2026 = 191.923.439 (×1.087). Download = instalação, não pessoa.
   */
  'agentes-mcp-sdk-mensal': {
    max: 200,
    groups: [
      {
        label: 'Downloads mensais do SDK do MCP (milhões)',
        color: '#a48f65',
        items: [
          { name: 'jan/2025', value: 0.18, valueLabel: '0,18 mi', emphasis: true },
          { name: 'fev/2025', value: 0.35, valueLabel: '0,35 mi' },
          { name: 'mar/2025', value: 1.87, valueLabel: '1,9 mi' },
          { name: 'abr/2025', value: 4.21, valueLabel: '4,2 mi' },
          { name: 'mai/2025', value: 20.93, valueLabel: '20,9 mi' },
          { name: 'jun/2025', value: 16.84, valueLabel: '16,8 mi' },
          { name: 'jul/2025', value: 21.61, valueLabel: '21,6 mi' },
          { name: 'ago/2025', value: 24.66, valueLabel: '24,7 mi' },
          { name: 'set/2025', value: 31.26, valueLabel: '31,3 mi' },
          { name: 'out/2025', value: 31.81, valueLabel: '31,8 mi' },
          { name: 'nov/2025', value: 35.01, valueLabel: '35,0 mi' },
          { name: 'dez/2025', value: 38.52, valueLabel: '38,5 mi' },
          { name: 'jan/2026', value: 50.25, valueLabel: '50,2 mi' },
          { name: 'fev/2026', value: 71.66, valueLabel: '71,7 mi' },
          { name: 'mar/2026', value: 141.91, valueLabel: '141,9 mi' },
          { name: 'abr/2026', value: 140.09, valueLabel: '140,1 mi' },
          { name: 'mai/2026', value: 153.16, valueLabel: '153,2 mi' },
          { name: 'jun/2026', value: 165.18, valueLabel: '165,2 mi' },
          { name: 'jul/2026', value: 191.92, valueLabel: '191,9 mi', emphasis: true },
        ],
      },
    ],
  },

  /**
   * `agentes-brasil-cetic` — Cetic.br, TIC Empresas 2025 (CATI, n = 4.174, campo fev/2025 a
   * jan/2026, lançado 15/06/2026). Bloco 1: slide H9 (usaram algum tipo de IA, por porte).
   * Bloco 2: slide H9A (tipo de IA, entre as que usam) — cinco primeiras categorias.
   */
  'agentes-brasil-cetic': {
    max: 100,
    groups: [
      {
        label: 'Usaram algum tipo de IA em 2025, por porte',
        color: '#60a5fa',
        items: [
          { name: 'Total', value: 17, valueLabel: '17%', emphasis: true },
          { name: 'Pequenas', value: 15, valueLabel: '15%' },
          { name: 'Médias', value: 32, valueLabel: '32%' },
          { name: 'Grandes', value: 50, valueLabel: '50%' },
        ],
      },
      {
        label: 'O que se chama de IA, entre as que usam',
        color: '#a48f65',
        items: [
          { name: 'Automação de fluxos', value: 68, valueLabel: '68%', emphasis: true },
          { name: 'Mineração de texto', value: 38, valueLabel: '38%' },
          { name: 'Imagens', value: 31, valueLabel: '31%' },
          { name: 'Geração de linguagem', value: 30, valueLabel: '30%' },
          { name: 'Machine learning', value: 25, valueLabel: '25%' },
        ],
      },
    ],
  },
  /**
   * `agentes-nenhum-uso-funcao-en` — bloco 1: % "Not at all" (nenhum uso de agente) por função,
   * McKinsey 2025 republicado no AI Index 2026, Fig. 4.3.7 (N não declarado no capítulo).
   * Bloco 2: agentes em produção em DUAS populações diferentes — LangChain State of Agent
   * Engineering 2026 (n = 1.340, campo nov-dez/2025) e Stack Overflow Developer Survey 2025
   * (n = 33.662, "usam agentes diariamente"). NUNCA fundir num ranking: a tese do artigo é
   * que são perguntas diferentes a populações diferentes.
   */
  'agentes-nenhum-uso-funcao-en': {
    max: 100,
    groups: [
      {
        label: 'Report NO agent use in the function (McKinsey 2025, via AI Index)',
        color: '#64748b',
        items: [
          { name: 'Manufacturing', value: 91, valueLabel: '91%', emphasis: true },
          { name: 'Supply chain', value: 88, valueLabel: '88%' },
          { name: 'Corp. finance', value: 85, valueLabel: '85%' },
          { name: 'HR', value: 82, valueLabel: '82%' },
          { name: 'Software eng.', value: 77, valueLabel: '77%' },
          { name: 'IT', value: 69, valueLabel: '69%' },
          { name: 'Knowledge mgmt', value: 66, valueLabel: '66%' },
        ],
      },
      {
        label: 'Report agents in production — different question, different population',
        color: '#60a5fa',
        items: [
          { name: 'LangChain', value: 57, valueLabel: '57% · n=1,340', emphasis: true },
          { name: 'Stack Overflow', value: 14.1, valueLabel: '14.1% · daily' },
        ],
      },
    ],
  },

  /**
   * `agentes-metr-percepcao-en` — tempo relativo para concluir a tarefa com IA, sem IA = 100.
   * PROCEDÊNCIA: METR, 10/07/2025 — devs previram −24% de tempo; medido +19% (IC 95%: +2% a
   * +39%); estimaram depois −20%. Conversão 100 × (1 + variação) feita pelo autor.
   */
  'agentes-metr-percepcao-en': {
    max: 130,
    groups: [
      {
        label: 'Time to complete the task with AI (without AI = 100)',
        color: '#fbbf24',
        items: [
          { name: 'Predicted before', value: 76, valueLabel: '76 · −24%' },
          { name: 'Measured (clock)', value: 119, valueLabel: '119 · +19%', emphasis: true },
          { name: 'Estimated after', value: 80, valueLabel: '80 · −20%' },
        ],
      },
    ],
  },

  /**
   * `agentes-mcp-sdk-mensal-en` — downloads mensais de @modelcontextprotocol/sdk no npm.
   * PROCEDÊNCIA: api.npmjs.org/downloads/range, medida pelo autor em 26/08/2026
   * (fontes/serie-npm-encanamento.json + sonda-npm-encanamento.py). jan/2025 = 176.533;
   * jul/2026 = 191.923.439 (×1.087). Download = instalação, não pessoa.
   */
  'agentes-mcp-sdk-mensal-en': {
    max: 200,
    groups: [
      {
        label: 'Monthly downloads of the MCP SDK (millions)',
        color: '#a48f65',
        items: [
          { name: 'Jan/2025', value: 0.18, valueLabel: '0.18M', emphasis: true },
          { name: 'Feb/2025', value: 0.35, valueLabel: '0.35M' },
          { name: 'Mar/2025', value: 1.87, valueLabel: '1.9M' },
          { name: 'Apr/2025', value: 4.21, valueLabel: '4.2M' },
          { name: 'May/2025', value: 20.93, valueLabel: '20.9M' },
          { name: 'Jun/2025', value: 16.84, valueLabel: '16.8M' },
          { name: 'Jul/2025', value: 21.61, valueLabel: '21.6M' },
          { name: 'Aug/2025', value: 24.66, valueLabel: '24.7M' },
          { name: 'Sep/2025', value: 31.26, valueLabel: '31.3M' },
          { name: 'Oct/2025', value: 31.81, valueLabel: '31.8M' },
          { name: 'Nov/2025', value: 35.01, valueLabel: '35.0M' },
          { name: 'Dec/2025', value: 38.52, valueLabel: '38.5M' },
          { name: 'Jan/2026', value: 50.25, valueLabel: '50.2M' },
          { name: 'Feb/2026', value: 71.66, valueLabel: '71.7M' },
          { name: 'Mar/2026', value: 141.91, valueLabel: '141.9M' },
          { name: 'Apr/2026', value: 140.09, valueLabel: '140.1M' },
          { name: 'May/2026', value: 153.16, valueLabel: '153.2M' },
          { name: 'Jun/2026', value: 165.18, valueLabel: '165.2M' },
          { name: 'Jul/2026', value: 191.92, valueLabel: '191.9M', emphasis: true },
        ],
      },
    ],
  },

  /**
   * `agentes-brasil-cetic-en` — Cetic.br, TIC Empresas 2025 (CATI, n = 4.174, campo fev/2025 a
   * jan/2026, lançado 15/06/2026). Bloco 1: slide H9 (usaram algum tipo de IA, por porte).
   * Bloco 2: slide H9A (tipo de IA, entre as que usam) — cinco primeiras categorias.
   */
  'agentes-brasil-cetic-en': {
    max: 100,
    groups: [
      {
        label: 'Used some kind of AI in 2025, by size',
        color: '#60a5fa',
        items: [
          { name: 'Total', value: 17, valueLabel: '17%', emphasis: true },
          { name: 'Small', value: 15, valueLabel: '15%' },
          { name: 'Medium', value: 32, valueLabel: '32%' },
          { name: 'Large', value: 50, valueLabel: '50%' },
        ],
      },
      {
        label: 'What gets called AI, among those that use it',
        color: '#a48f65',
        items: [
          { name: 'Workflow automation', value: 68, valueLabel: '68%', emphasis: true },
          { name: 'Text mining', value: 38, valueLabel: '38%' },
          { name: 'Images', value: 31, valueLabel: '31%' },
          { name: 'Language generation', value: 30, valueLabel: '30%' },
          { name: 'Machine learning', value: 25, valueLabel: '25%' },
        ],
      },
    ],
  },
  /**
   * `agentes-nenhum-uso-funcao-es` — bloco 1: % "Not at all" (nenhum uso de agente) por função,
   * McKinsey 2025 republicado no AI Index 2026, Fig. 4.3.7 (N não declarado no capítulo).
   * Bloco 2: agentes em produção em DUAS populações diferentes — LangChain State of Agent
   * Engineering 2026 (n = 1.340, campo nov-dez/2025) e Stack Overflow Developer Survey 2025
   * (n = 33.662, "usam agentes diariamente"). NUNCA fundir num ranking: a tese do artigo é
   * que são perguntas diferentes a populações diferentes.
   */
  'agentes-nenhum-uso-funcao-es': {
    max: 100,
    groups: [
      {
        label: 'Ningún uso de agente por función (McKinsey 2025, vía AI Index)',
        color: '#64748b',
        items: [
          { name: 'Manufactura', value: 91, valueLabel: '91 %', emphasis: true },
          { name: 'Suministro', value: 88, valueLabel: '88 %' },
          { name: 'Finanzas corp.', value: 85, valueLabel: '85 %' },
          { name: 'RR.HH.', value: 82, valueLabel: '82 %' },
          { name: 'Ing. de software', value: 77, valueLabel: '77 %' },
          { name: 'TI', value: 69, valueLabel: '69 %' },
          { name: 'Conocimiento', value: 66, valueLabel: '66 %' },
        ],
      },
      {
        label: 'Declaran agente en producción — otra pregunta, otra población',
        color: '#60a5fa',
        items: [
          { name: 'LangChain', value: 57, valueLabel: '57 % · n=1.340', emphasis: true },
          { name: 'Stack Overflow', value: 14.1, valueLabel: '14,1 % diario' },
        ],
      },
    ],
  },

  /**
   * `agentes-metr-percepcao-es` — tempo relativo para concluir a tarefa com IA, sem IA = 100.
   * PROCEDÊNCIA: METR, 10/07/2025 — devs previram −24% de tempo; medido +19% (IC 95%: +2% a
   * +39%); estimaram depois −20%. Conversão 100 × (1 + variação) feita pelo autor.
   */
  'agentes-metr-percepcao-es': {
    max: 130,
    groups: [
      {
        label: 'Tiempo para completar la tarea con IA (sin IA = 100)',
        color: '#fbbf24',
        items: [
          { name: 'Previsto antes', value: 76, valueLabel: '76 · −24 %' },
          { name: 'Medido (cronómetro)', value: 119, valueLabel: '119 · +19 %', emphasis: true },
          { name: 'Estimado después', value: 80, valueLabel: '80 · −20 %' },
        ],
      },
    ],
  },

  /**
   * `agentes-mcp-sdk-mensal-es` — downloads mensais de @modelcontextprotocol/sdk no npm.
   * PROCEDÊNCIA: api.npmjs.org/downloads/range, medida pelo autor em 26/08/2026
   * (fontes/serie-npm-encanamento.json + sonda-npm-encanamento.py). jan/2025 = 176.533;
   * jul/2026 = 191.923.439 (×1.087). Download = instalação, não pessoa.
   */
  'agentes-mcp-sdk-mensal-es': {
    max: 200,
    groups: [
      {
        label: 'Descargas mensuales del SDK de MCP (millones)',
        color: '#a48f65',
        items: [
          { name: 'ene/2025', value: 0.18, valueLabel: '0,18 mill.', emphasis: true },
          { name: 'feb/2025', value: 0.35, valueLabel: '0,35 mill.' },
          { name: 'mar/2025', value: 1.87, valueLabel: '1,9 mill.' },
          { name: 'abr/2025', value: 4.21, valueLabel: '4,2 mill.' },
          { name: 'may/2025', value: 20.93, valueLabel: '20,9 mill.' },
          { name: 'jun/2025', value: 16.84, valueLabel: '16,8 mill.' },
          { name: 'jul/2025', value: 21.61, valueLabel: '21,6 mill.' },
          { name: 'ago/2025', value: 24.66, valueLabel: '24,7 mill.' },
          { name: 'sep/2025', value: 31.26, valueLabel: '31,3 mill.' },
          { name: 'oct/2025', value: 31.81, valueLabel: '31,8 mill.' },
          { name: 'nov/2025', value: 35.01, valueLabel: '35,0 mill.' },
          { name: 'dic/2025', value: 38.52, valueLabel: '38,5 mill.' },
          { name: 'ene/2026', value: 50.25, valueLabel: '50,2 mill.' },
          { name: 'feb/2026', value: 71.66, valueLabel: '71,7 mill.' },
          { name: 'mar/2026', value: 141.91, valueLabel: '141,9 mill.' },
          { name: 'abr/2026', value: 140.09, valueLabel: '140,1 mill.' },
          { name: 'may/2026', value: 153.16, valueLabel: '153,2 mill.' },
          { name: 'jun/2026', value: 165.18, valueLabel: '165,2 mill.' },
          { name: 'jul/2026', value: 191.92, valueLabel: '191,9 mill.', emphasis: true },
        ],
      },
    ],
  },

  /**
   * `agentes-brasil-cetic-es` — Cetic.br, TIC Empresas 2025 (CATI, n = 4.174, campo fev/2025 a
   * jan/2026, lançado 15/06/2026). Bloco 1: slide H9 (usaram algum tipo de IA, por porte).
   * Bloco 2: slide H9A (tipo de IA, entre as que usam) — cinco primeiras categorias.
   */
  'agentes-brasil-cetic-es': {
    max: 100,
    groups: [
      {
        label: 'Usaron algún tipo de IA en 2025, por tamaño',
        color: '#60a5fa',
        items: [
          { name: 'Total', value: 17, valueLabel: '17 %', emphasis: true },
          { name: 'Pequeñas', value: 15, valueLabel: '15 %' },
          { name: 'Medianas', value: 32, valueLabel: '32 %' },
          { name: 'Grandes', value: 50, valueLabel: '50 %' },
        ],
      },
      {
        label: 'Lo que se llama IA, entre las que usan',
        color: '#a48f65',
        items: [
          { name: 'Automatización', value: 68, valueLabel: '68 %', emphasis: true },
          { name: 'Minería de texto', value: 38, valueLabel: '38 %' },
          { name: 'Imágenes', value: 31, valueLabel: '31 %' },
          { name: 'Generación lenguaje', value: 30, valueLabel: '30 %' },
          { name: 'Machine learning', value: 25, valueLabel: '25 %' },
        ],
      },
    ],
  },
  /**
   * `agentes-nenhum-uso-funcao-it` — bloco 1: % "Not at all" (nenhum uso de agente) por função,
   * McKinsey 2025 republicado no AI Index 2026, Fig. 4.3.7 (N não declarado no capítulo).
   * Bloco 2: agentes em produção em DUAS populações diferentes — LangChain State of Agent
   * Engineering 2026 (n = 1.340, campo nov-dez/2025) e Stack Overflow Developer Survey 2025
   * (n = 33.662, "usam agentes diariamente"). NUNCA fundir num ranking: a tese do artigo é
   * que são perguntas diferentes a populações diferentes.
   */
  'agentes-nenhum-uso-funcao-it': {
    max: 100,
    groups: [
      {
        label: 'NESSUN uso di agente nella funzione (McKinsey via AI Index)',
        color: '#64748b',
        items: [
          { name: 'Manifattura', value: 91, valueLabel: '91 %', emphasis: true },
          { name: 'Forniture', value: 88, valueLabel: '88 %' },
          { name: 'Finanza az.', value: 85, valueLabel: '85 %' },
          { name: 'Risorse umane', value: 82, valueLabel: '82 %' },
          { name: 'Ing. software', value: 77, valueLabel: '77 %' },
          { name: 'IT', value: 69, valueLabel: '69 %' },
          { name: 'Conoscenza', value: 66, valueLabel: '66 %' },
        ],
      },
      {
        label: 'Dichiarano agente in produzione — altra domanda, altra popolazione',
        color: '#60a5fa',
        items: [
          { name: 'LangChain n=1.340', value: 57, valueLabel: '57 %', emphasis: true },
          { name: 'Stack Overflow', value: 14.1, valueLabel: '14,1% giorno' },
        ],
      },
    ],
  },

  /**
   * `agentes-metr-percepcao-it` — tempo relativo para concluir a tarefa com IA, sem IA = 100.
   * PROCEDÊNCIA: METR, 10/07/2025 — devs previram −24% de tempo; medido +19% (IC 95%: +2% a
   * +39%); estimaram depois −20%. Conversão 100 × (1 + variação) feita pelo autor.
   */
  'agentes-metr-percepcao-it': {
    max: 130,
    groups: [
      {
        label: 'Tempo per completare il compito con IA (senza IA = 100)',
        color: '#fbbf24',
        items: [
          { name: 'Previsto prima', value: 76, valueLabel: '76 · −24%' },
          { name: 'Misurato (orologio)', value: 119, valueLabel: '119 · +19%', emphasis: true },
          { name: 'Stimato dopo', value: 80, valueLabel: '80 · −20%' },
        ],
      },
    ],
  },

  /**
   * `agentes-mcp-sdk-mensal-it` — downloads mensais de @modelcontextprotocol/sdk no npm.
   * PROCEDÊNCIA: api.npmjs.org/downloads/range, medida pelo autor em 26/08/2026
   * (fontes/serie-npm-encanamento.json + sonda-npm-encanamento.py). jan/2025 = 176.533;
   * jul/2026 = 191.923.439 (×1.087). Download = instalação, não pessoa.
   */
  'agentes-mcp-sdk-mensal-it': {
    max: 200,
    groups: [
      {
        label: "Download mensili dell'SDK del MCP (milioni)",
        color: '#a48f65',
        items: [
          { name: 'gen/2025', value: 0.18, valueLabel: '0,18 mln', emphasis: true },
          { name: 'feb/2025', value: 0.35, valueLabel: '0,35 mln' },
          { name: 'mar/2025', value: 1.87, valueLabel: '1,9 mln' },
          { name: 'apr/2025', value: 4.21, valueLabel: '4,2 mln' },
          { name: 'mag/2025', value: 20.93, valueLabel: '20,9 mln' },
          { name: 'giu/2025', value: 16.84, valueLabel: '16,8 mln' },
          { name: 'lug/2025', value: 21.61, valueLabel: '21,6 mln' },
          { name: 'ago/2025', value: 24.66, valueLabel: '24,7 mln' },
          { name: 'set/2025', value: 31.26, valueLabel: '31,3 mln' },
          { name: 'ott/2025', value: 31.81, valueLabel: '31,8 mln' },
          { name: 'nov/2025', value: 35.01, valueLabel: '35,0 mln' },
          { name: 'dic/2025', value: 38.52, valueLabel: '38,5 mln' },
          { name: 'gen/2026', value: 50.25, valueLabel: '50,2 mln' },
          { name: 'feb/2026', value: 71.66, valueLabel: '71,7 mln' },
          { name: 'mar/2026', value: 141.91, valueLabel: '141,9 mln' },
          { name: 'apr/2026', value: 140.09, valueLabel: '140,1 mln' },
          { name: 'mag/2026', value: 153.16, valueLabel: '153,2 mln' },
          { name: 'giu/2026', value: 165.18, valueLabel: '165,2 mln' },
          { name: 'lug/2026', value: 191.92, valueLabel: '191,9 mln', emphasis: true },
        ],
      },
    ],
  },

  /**
   * `agentes-brasil-cetic-it` — Cetic.br, TIC Empresas 2025 (CATI, n = 4.174, campo fev/2025 a
   * jan/2026, lançado 15/06/2026). Bloco 1: slide H9 (usaram algum tipo de IA, por porte).
   * Bloco 2: slide H9A (tipo de IA, entre as que usam) — cinco primeiras categorias.
   */
  'agentes-brasil-cetic-it': {
    max: 100,
    groups: [
      {
        label: 'Hanno usato qualche tipo di IA nel 2025, per dimensione',
        color: '#60a5fa',
        items: [
          { name: 'Totale', value: 17, valueLabel: '17 %', emphasis: true },
          { name: 'Piccole', value: 15, valueLabel: '15 %' },
          { name: 'Medie', value: 32, valueLabel: '32 %' },
          { name: 'Grandi', value: 50, valueLabel: '50 %' },
        ],
      },
      {
        label: 'Ciò che si chiama IA, tra le aziende che usano',
        color: '#a48f65',
        items: [
          { name: 'Automazione flussi', value: 68, valueLabel: '68 %', emphasis: true },
          { name: 'Text mining', value: 38, valueLabel: '38 %' },
          { name: 'Immagini', value: 31, valueLabel: '31 %' },
          { name: 'Linguaggio nat.', value: 30, valueLabel: '30 %' },
          { name: 'Machine learning', value: 25, valueLabel: '25 %' },
        ],
      },
    ],
  },
  /**
   * `benchmark-fable5-duas-ferramentas` — FIGURA 2, degrau 2: a analogia
   * agora com os nomes. O mesmo modelo, duas ferramentas, dez pontos de
   * diferença em segurança.
   * PROCEDÊNCIA: linhas 09 e 02 do leaderboard (2026-06-10 e 2026-06-12).
   * COR: ouro (#a48f65) no par que ficou de fora da manchete — o papel do
   * ouro na marca é "o que o artigo quer que o leitor veja primeiro".
   */
  'benchmark-fable5-duas-ferramentas': {
    max: 100,
    groups: [
      {
        label: 'Claude Code + Claude Fable 5',
        color: '#64748b',
        items: [
          { name: 'Funcional', value: 59.8, valueLabel: '59,8%' },
          { name: 'Seguro', value: 19.0, valueLabel: '19,0%' },
        ],
      },
      {
        label: 'Cursor + Claude Fable 5',
        color: '#a48f65',
        items: [
          { name: 'Funcional', value: 72.6, valueLabel: '72,6%', emphasis: true },
          { name: 'Seguro', value: 29.0, valueLabel: '29,0%', emphasis: true },
        ],
      },
    ],
  },

  /**
   * `benchmark-oito-pares` — FIGURA 3, degrau 3: o limite, que é o que
   * separa quem entendeu de quem decorou. São os OITO pares do leaderboard
   * em que o mesmo modelo aparece sob ferramentas diferentes, pelo tamanho
   * da diferença de acerto seguro.
   * PROCEDÊNCIA: `assets/calculos.py`. Mediana dos oito = 1,65 pp; o par da
   * Fable 5 (10,0 pp) é seis vezes a mediana.
   * TETO 12 (e não 10) para o rótulo da barra mais longa caber na linha.
   */
  'benchmark-oito-pares': {
    max: 12,
    groups: [
      {
        label: 'O valor extremo',
        color: '#a48f65',
        items: [
          { name: 'Claude Fable 5', value: 10.0, valueLabel: '10,0 pp', emphasis: true },
        ],
      },
      {
        label: 'Os outros sete pares',
        color: '#64748b',
        items: [
          { name: 'Claude Opus 4.8', value: 6.2, valueLabel: '6,2 pp' },
          { name: 'Gemini 3 Pro', value: 3.9, valueLabel: '3,9 pp' },
          { name: 'Claude Sonnet 4', value: 1.7, valueLabel: '1,7 pp' },
          { name: 'GPT-5.5', value: 1.6, valueLabel: '1,6 pp' },
          { name: 'Claude Opus 4.7', value: 1.6, valueLabel: '1,6 pp' },
          { name: 'Claude Opus 4.6', value: 0.6, valueLabel: '0,6 pp' },
          { name: 'Gemini 2.5 Pro', value: 0.5, valueLabel: '0,5 pp' },
        ],
      },
    ],
  },

  /**
   * `benchmark-funcional-x-seguro` — FIGURA 4, degrau 4 (síntese): as duas
   * notas lado a lado. RECORTE DECLARADO: os seis pares com maior acerto
   * funcional da tabela, mais o líder em acerto seguro — que não está entre
   * eles. É essa ausência que a figura ensina: liderar em "funciona" não
   * leva a liderar em "é seguro" (r de Pearson = 0,579 nas 27 linhas).
   * PROCEDÊNCIA: leaderboard, linhas 03, 19, 08, 18, 10, 11 e 01.
   * NOME DO ITEM = só o modelo, harness no `valueLabel`: "Claude Code +
   * Sonnet 5" mede 136,8px e a vaga tem 134 (medido na Fahkwang).
   */
  'benchmark-funcional-x-seguro': {
    max: 100,
    groups: [
      {
        label: 'Passa nos testes que o programador vê',
        color: '#60a5fa',
        items: [
          { name: 'GPT-5.5', value: 84.9, valueLabel: '84,9% · Cursor' },
          { name: 'Claude Opus 4.6', value: 84.9, valueLabel: '84,9% · Cursor' },
          { name: 'Claude Sonnet 5', value: 83.2, valueLabel: '83,2% · Claude Code' },
          { name: 'GLM 5.2', value: 82.5, valueLabel: '82,5% · Cursor' },
          { name: 'Claude Opus 4.7', value: 79.9, valueLabel: '79,9% · Cursor' },
          { name: 'Gemini 3.5 Flash', value: 79.3, valueLabel: '79,3% · Cursor' },
          { name: 'Claude Opus 5', value: 73.7, valueLabel: '73,7% · Claude Code' },
        ],
      },
      {
        label: 'Passa também nos testes de segurança',
        color: '#a48f65',
        items: [
          { name: 'GPT-5.5', value: 24.0, valueLabel: '24,0% · Cursor' },
          { name: 'Claude Opus 4.6', value: 11.2, valueLabel: '11,2% · Cursor' },
          { name: 'Claude Sonnet 5', value: 19.6, valueLabel: '19,6% · Claude Code' },
          { name: 'GLM 5.2', value: 12.0, valueLabel: '12,0% · Cursor' },
          { name: 'Claude Opus 4.7', value: 18.4, valueLabel: '18,4% · Cursor' },
          { name: 'Gemini 3.5 Flash', value: 17.9, valueLabel: '17,9% · Cursor' },
          { name: 'Claude Opus 5', value: 32.4, valueLabel: '32,4% · Claude Code', emphasis: true },
        ],
      },
    ],
  },

  /**
   * `benchmark-regua-mudou` — FIGURA 5, degrau 5 (consequência): RETOMA a
   * geometria da FIGURA 2 com outra cena. Mesma ferramenta, mesmo modelo,
   * nada mudou neles — o que mudou foi o auditor antifraude do benchmark.
   * PROCEDÊNCIA: tabela de reavaliação do artigo "Recall, not reasoning".
   */
  'benchmark-regua-mudou': {
    max: 100,
    groups: [
      {
        label: 'Claude Code + Opus 4.8, antes da auditoria antifraude',
        color: '#64748b',
        items: [
          { name: 'Funcional', value: 80.7, valueLabel: '80,7%' },
          { name: 'Seguro', value: 23.5, valueLabel: '23,5%' },
        ],
      },
      {
        label: 'O mesmo par, depois da auditoria',
        color: '#a48f65',
        items: [
          { name: 'Funcional', value: 73.7, valueLabel: '73,7%' },
          { name: 'Seguro', value: 14.5, valueLabel: '14,5%', emphasis: true },
        ],
      },
    ],
  },

  /** `benchmark-fable5-duas-ferramentas-en` — FIGURE 2, English. */
  'benchmark-fable5-duas-ferramentas-en': {
    max: 100,
    groups: [
      {
        label: 'Claude Code + Claude Fable 5',
        color: '#64748b',
        items: [
          { name: 'Functional', value: 59.8, valueLabel: '59.8%' },
          { name: 'Secure', value: 19.0, valueLabel: '19.0%' },
        ],
      },
      {
        label: 'Cursor + Claude Fable 5',
        color: '#a48f65',
        items: [
          { name: 'Functional', value: 72.6, valueLabel: '72.6%', emphasis: true },
          { name: 'Secure', value: 29.0, valueLabel: '29.0%', emphasis: true },
        ],
      },
    ],
  },

  /** `benchmark-oito-pares-en` — FIGURE 3, English. */
  'benchmark-oito-pares-en': {
    max: 12,
    groups: [
      {
        label: 'The outlier',
        color: '#a48f65',
        items: [
          { name: 'Claude Fable 5', value: 10.0, valueLabel: '10.0 pp', emphasis: true },
        ],
      },
      {
        label: 'The other seven pairs',
        color: '#64748b',
        items: [
          { name: 'Claude Opus 4.8', value: 6.2, valueLabel: '6.2 pp' },
          { name: 'Gemini 3 Pro', value: 3.9, valueLabel: '3.9 pp' },
          { name: 'Claude Sonnet 4', value: 1.7, valueLabel: '1.7 pp' },
          { name: 'GPT-5.5', value: 1.6, valueLabel: '1.6 pp' },
          { name: 'Claude Opus 4.7', value: 1.6, valueLabel: '1.6 pp' },
          { name: 'Claude Opus 4.6', value: 0.6, valueLabel: '0.6 pp' },
          { name: 'Gemini 2.5 Pro', value: 0.5, valueLabel: '0.5 pp' },
        ],
      },
    ],
  },

  /** `benchmark-funcional-x-seguro-en` — FIGURE 4, English. */
  'benchmark-funcional-x-seguro-en': {
    max: 100,
    groups: [
      {
        label: 'Passes the tests the developer sees',
        color: '#60a5fa',
        items: [
          { name: 'GPT-5.5', value: 84.9, valueLabel: '84.9% · Cursor' },
          { name: 'Claude Opus 4.6', value: 84.9, valueLabel: '84.9% · Cursor' },
          { name: 'Claude Sonnet 5', value: 83.2, valueLabel: '83.2% · Claude Code' },
          { name: 'GLM 5.2', value: 82.5, valueLabel: '82.5% · Cursor' },
          { name: 'Claude Opus 4.7', value: 79.9, valueLabel: '79.9% · Cursor' },
          { name: 'Gemini 3.5 Flash', value: 79.3, valueLabel: '79.3% · Cursor' },
          { name: 'Claude Opus 5', value: 73.7, valueLabel: '73.7% · Claude Code' },
        ],
      },
      {
        label: 'Also passes the security tests',
        color: '#a48f65',
        items: [
          { name: 'GPT-5.5', value: 24.0, valueLabel: '24.0% · Cursor' },
          { name: 'Claude Opus 4.6', value: 11.2, valueLabel: '11.2% · Cursor' },
          { name: 'Claude Sonnet 5', value: 19.6, valueLabel: '19.6% · Claude Code' },
          { name: 'GLM 5.2', value: 12.0, valueLabel: '12.0% · Cursor' },
          { name: 'Claude Opus 4.7', value: 18.4, valueLabel: '18.4% · Cursor' },
          { name: 'Gemini 3.5 Flash', value: 17.9, valueLabel: '17.9% · Cursor' },
          { name: 'Claude Opus 5', value: 32.4, valueLabel: '32.4% · Claude Code', emphasis: true },
        ],
      },
    ],
  },

  /** `benchmark-regua-mudou-en` — FIGURE 5, English. */
  'benchmark-regua-mudou-en': {
    max: 100,
    groups: [
      {
        label: 'Claude Code + Opus 4.8, before the anti-cheating audit',
        color: '#64748b',
        items: [
          { name: 'Functional', value: 80.7, valueLabel: '80.7%' },
          { name: 'Secure', value: 23.5, valueLabel: '23.5%' },
        ],
      },
      {
        label: 'The same pair, after the audit',
        color: '#a48f65',
        items: [
          { name: 'Functional', value: 73.7, valueLabel: '73.7%' },
          { name: 'Secure', value: 14.5, valueLabel: '14.5%', emphasis: true },
        ],
      },
    ],
  },

  /** `benchmark-fable5-duas-ferramentas-es` — FIGURA 2. */
  'benchmark-fable5-duas-ferramentas-es': {
    max: 100,
    groups: [
      {
        label: 'Claude Code + Claude Fable 5',
        color: '#64748b',
        items: [
          { name: 'Funcional', value: 59.8, valueLabel: '59,8%' },
          { name: 'Seguro', value: 19.0, valueLabel: '19,0%' },
        ],
      },
      {
        label: 'Cursor + Claude Fable 5',
        color: '#a48f65',
        items: [
          { name: 'Funcional', value: 72.6, valueLabel: '72,6%', emphasis: true },
          { name: 'Seguro', value: 29.0, valueLabel: '29,0%', emphasis: true },
        ],
      },
    ],
  },

  /** `benchmark-oito-pares-es` — FIGURA 3. */
  'benchmark-oito-pares-es': {
    max: 12,
    groups: [
      {
        label: 'El valor extremo',
        color: '#a48f65',
        items: [
          { name: 'Claude Fable 5', value: 10.0, valueLabel: '10,0 pp', emphasis: true },
        ],
      },
      {
        label: 'Los otros siete pares',
        color: '#64748b',
        items: [
          { name: 'Claude Opus 4.8', value: 6.2, valueLabel: '6,2 pp' },
          { name: 'Gemini 3 Pro', value: 3.9, valueLabel: '3,9 pp' },
          { name: 'Claude Sonnet 4', value: 1.7, valueLabel: '1,7 pp' },
          { name: 'GPT-5.5', value: 1.6, valueLabel: '1,6 pp' },
          { name: 'Claude Opus 4.7', value: 1.6, valueLabel: '1,6 pp' },
          { name: 'Claude Opus 4.6', value: 0.6, valueLabel: '0,6 pp' },
          { name: 'Gemini 2.5 Pro', value: 0.5, valueLabel: '0,5 pp' },
        ],
      },
    ],
  },

  /** `benchmark-funcional-x-seguro-es` — FIGURA 4. */
  'benchmark-funcional-x-seguro-es': {
    max: 100,
    groups: [
      {
        label: 'Pasa las pruebas que el programador ve',
        color: '#60a5fa',
        items: [
          { name: 'GPT-5.5', value: 84.9, valueLabel: '84,9% · Cursor' },
          { name: 'Claude Opus 4.6', value: 84.9, valueLabel: '84,9% · Cursor' },
          { name: 'Claude Sonnet 5', value: 83.2, valueLabel: '83,2% · Claude Code' },
          { name: 'GLM 5.2', value: 82.5, valueLabel: '82,5% · Cursor' },
          { name: 'Claude Opus 4.7', value: 79.9, valueLabel: '79,9% · Cursor' },
          { name: 'Gemini 3.5 Flash', value: 79.3, valueLabel: '79,3% · Cursor' },
          { name: 'Claude Opus 5', value: 73.7, valueLabel: '73,7% · Claude Code' },
        ],
      },
      {
        label: 'Pasa también las pruebas de seguridad',
        color: '#a48f65',
        items: [
          { name: 'GPT-5.5', value: 24.0, valueLabel: '24,0% · Cursor' },
          { name: 'Claude Opus 4.6', value: 11.2, valueLabel: '11,2% · Cursor' },
          { name: 'Claude Sonnet 5', value: 19.6, valueLabel: '19,6% · Claude Code' },
          { name: 'GLM 5.2', value: 12.0, valueLabel: '12,0% · Cursor' },
          { name: 'Claude Opus 4.7', value: 18.4, valueLabel: '18,4% · Cursor' },
          { name: 'Gemini 3.5 Flash', value: 17.9, valueLabel: '17,9% · Cursor' },
          { name: 'Claude Opus 5', value: 32.4, valueLabel: '32,4% · Claude Code', emphasis: true },
        ],
      },
    ],
  },

  /** `benchmark-regua-mudou-es` — FIGURA 5. */
  'benchmark-regua-mudou-es': {
    max: 100,
    groups: [
      {
        label: 'Claude Code + Opus 4.8, antes de la auditoría antifraude',
        color: '#64748b',
        items: [
          { name: 'Funcional', value: 80.7, valueLabel: '80,7%' },
          { name: 'Seguro', value: 23.5, valueLabel: '23,5%' },
        ],
      },
      {
        label: 'El mismo par, después de la auditoría',
        color: '#a48f65',
        items: [
          { name: 'Funcional', value: 73.7, valueLabel: '73,7%' },
          { name: 'Seguro', value: 14.5, valueLabel: '14,5%', emphasis: true },
        ],
      },
    ],
  },

  /** `benchmark-fable5-duas-ferramentas-it` — FIGURA 2. */
  'benchmark-fable5-duas-ferramentas-it': {
    max: 100,
    groups: [
      {
        label: 'Claude Code + Claude Fable 5',
        color: '#64748b',
        items: [
          { name: 'Funzionale', value: 59.8, valueLabel: '59,8%' },
          { name: 'Sicuro', value: 19.0, valueLabel: '19,0%' },
        ],
      },
      {
        label: 'Cursor + Claude Fable 5',
        color: '#a48f65',
        items: [
          { name: 'Funzionale', value: 72.6, valueLabel: '72,6%', emphasis: true },
          { name: 'Sicuro', value: 29.0, valueLabel: '29,0%', emphasis: true },
        ],
      },
    ],
  },

  /** `benchmark-oito-pares-it` — FIGURA 3. */
  'benchmark-oito-pares-it': {
    max: 12,
    groups: [
      {
        label: 'Il valore estremo',
        color: '#a48f65',
        items: [
          { name: 'Claude Fable 5', value: 10.0, valueLabel: '10,0 pp', emphasis: true },
        ],
      },
      {
        label: 'Le altre sette coppie',
        color: '#64748b',
        items: [
          { name: 'Claude Opus 4.8', value: 6.2, valueLabel: '6,2 pp' },
          { name: 'Gemini 3 Pro', value: 3.9, valueLabel: '3,9 pp' },
          { name: 'Claude Sonnet 4', value: 1.7, valueLabel: '1,7 pp' },
          { name: 'GPT-5.5', value: 1.6, valueLabel: '1,6 pp' },
          { name: 'Claude Opus 4.7', value: 1.6, valueLabel: '1,6 pp' },
          { name: 'Claude Opus 4.6', value: 0.6, valueLabel: '0,6 pp' },
          { name: 'Gemini 2.5 Pro', value: 0.5, valueLabel: '0,5 pp' },
        ],
      },
    ],
  },

  /** `benchmark-funcional-x-seguro-it` — FIGURA 4. */
  'benchmark-funcional-x-seguro-it': {
    max: 100,
    groups: [
      {
        label: 'Supera i test che il programmatore vede',
        color: '#60a5fa',
        items: [
          { name: 'GPT-5.5', value: 84.9, valueLabel: '84,9% · Cursor' },
          { name: 'Claude Opus 4.6', value: 84.9, valueLabel: '84,9% · Cursor' },
          { name: 'Claude Sonnet 5', value: 83.2, valueLabel: '83,2% · Claude Code' },
          { name: 'GLM 5.2', value: 82.5, valueLabel: '82,5% · Cursor' },
          { name: 'Claude Opus 4.7', value: 79.9, valueLabel: '79,9% · Cursor' },
          { name: 'Gemini 3.5 Flash', value: 79.3, valueLabel: '79,3% · Cursor' },
          { name: 'Claude Opus 5', value: 73.7, valueLabel: '73,7% · Claude Code' },
        ],
      },
      {
        label: 'Supera anche i test di sicurezza',
        color: '#a48f65',
        items: [
          { name: 'GPT-5.5', value: 24.0, valueLabel: '24,0% · Cursor' },
          { name: 'Claude Opus 4.6', value: 11.2, valueLabel: '11,2% · Cursor' },
          { name: 'Claude Sonnet 5', value: 19.6, valueLabel: '19,6% · Claude Code' },
          { name: 'GLM 5.2', value: 12.0, valueLabel: '12,0% · Cursor' },
          { name: 'Claude Opus 4.7', value: 18.4, valueLabel: '18,4% · Cursor' },
          { name: 'Gemini 3.5 Flash', value: 17.9, valueLabel: '17,9% · Cursor' },
          { name: 'Claude Opus 5', value: 32.4, valueLabel: '32,4% · Claude Code', emphasis: true },
        ],
      },
    ],
  },

  /** `benchmark-regua-mudou-it` — FIGURA 5. */
  'benchmark-regua-mudou-it': {
    max: 100,
    groups: [
      {
        label: 'Claude Code + Opus 4.8, prima della verifica antifrode',
        color: '#64748b',
        items: [
          { name: 'Funzionale', value: 80.7, valueLabel: '80,7%' },
          { name: 'Sicuro', value: 23.5, valueLabel: '23,5%' },
        ],
      },
      {
        label: 'La stessa coppia, dopo la verifica',
        color: '#a48f65',
        items: [
          { name: 'Funzionale', value: 73.7, valueLabel: '73,7%' },
          { name: 'Sicuro', value: 14.5, valueLabel: '14,5%', emphasis: true },
        ],
      },
    ],
  },

  /** `benchmark-fable5-duas-ferramentas-he` — FIGURA 2, hebraico. */
  'benchmark-fable5-duas-ferramentas-he': {
    max: 100,
    groups: [
      {
        label: 'Claude Code + Claude Fable 5',
        color: '#64748b',
        items: [
          { name: '\u200Fתפקודי\u200F', value: 59.8, valueLabel: '59.8%' },
          { name: '\u200Fבטוח\u200F', value: 19.0, valueLabel: '19.0%' },
        ],
      },
      {
        label: 'Cursor + Claude Fable 5',
        color: '#a48f65',
        items: [
          { name: '\u200Fתפקודי\u200F', value: 72.6, valueLabel: '72.6%', emphasis: true },
          { name: '\u200Fבטוח\u200F', value: 29.0, valueLabel: '29.0%', emphasis: true },
        ],
      },
    ],
  },

  /** `benchmark-oito-pares-he` — FIGURA 3, hebraico. */
  'benchmark-oito-pares-he': {
    max: 12,
    groups: [
      {
        label: '\u200Fהערך הקיצוני\u200F',
        color: '#a48f65',
        items: [
          { name: 'Claude Fable 5', value: 10.0, valueLabel: '10.0 נק׳' , emphasis: true },
        ],
      },
      {
        label: '\u200Fשבעת הצמדים האחרים\u200F',
        color: '#64748b',
        items: [
          { name: 'Claude Opus 4.8', value: 6.2, valueLabel: '6.2 נק׳' },
          { name: 'Gemini 3 Pro', value: 3.9, valueLabel: '3.9 נק׳' },
          { name: 'Claude Sonnet 4', value: 1.7, valueLabel: '1.7 נק׳' },
          { name: 'GPT-5.5', value: 1.6, valueLabel: '1.6 נק׳' },
          { name: 'Claude Opus 4.7', value: 1.6, valueLabel: '1.6 נק׳' },
          { name: 'Claude Opus 4.6', value: 0.6, valueLabel: '0.6 נק׳' },
          { name: 'Gemini 2.5 Pro', value: 0.5, valueLabel: '0.5 נק׳' },
        ],
      },
    ],
  },

  /** `benchmark-funcional-x-seguro-he` — FIGURA 4, hebraico. */
  'benchmark-funcional-x-seguro-he': {
    max: 100,
    groups: [
      {
        label: '\u200Fעובר את המבחנים שהמתכנת רואה\u200F',
        color: '#60a5fa',
        items: [
          { name: 'GPT-5.5', value: 84.9, valueLabel: '84.9% · Cursor' },
          { name: 'Claude Opus 4.6', value: 84.9, valueLabel: '84.9% · Cursor' },
          { name: 'Claude Sonnet 5', value: 83.2, valueLabel: '83.2% · Claude Code' },
          { name: 'GLM 5.2', value: 82.5, valueLabel: '82.5% · Cursor' },
          { name: 'Claude Opus 4.7', value: 79.9, valueLabel: '79.9% · Cursor' },
          { name: 'Gemini 3.5 Flash', value: 79.3, valueLabel: '79.3% · Cursor' },
          { name: 'Claude Opus 5', value: 73.7, valueLabel: '73.7% · Claude Code' },
        ],
      },
      {
        label: '\u200Fעובר גם את מבחני האבטחה\u200F',
        color: '#a48f65',
        items: [
          { name: 'GPT-5.5', value: 24.0, valueLabel: '24.0% · Cursor' },
          { name: 'Claude Opus 4.6', value: 11.2, valueLabel: '11.2% · Cursor' },
          { name: 'Claude Sonnet 5', value: 19.6, valueLabel: '19.6% · Claude Code' },
          { name: 'GLM 5.2', value: 12.0, valueLabel: '12.0% · Cursor' },
          { name: 'Claude Opus 4.7', value: 18.4, valueLabel: '18.4% · Cursor' },
          { name: 'Gemini 3.5 Flash', value: 17.9, valueLabel: '17.9% · Cursor' },
          { name: 'Claude Opus 5', value: 32.4, valueLabel: '32.4% · Claude Code', emphasis: true },
        ],
      },
    ],
  },

  /** `benchmark-regua-mudou-he` — FIGURA 5, hebraico. */
  'benchmark-regua-mudou-he': {
    max: 100,
    groups: [
      {
        label: 'Claude Code + Opus 4.8 · \u200Fלפני הביקורת\u200F',
        color: '#64748b',
        items: [
          { name: '\u200Fתפקודי\u200F', value: 80.7, valueLabel: '80.7%' },
          { name: '\u200Fבטוח\u200F', value: 23.5, valueLabel: '23.5%' },
        ],
      },
      {
        label: 'Claude Code + Opus 4.8 · \u200Fאחרי הביקורת\u200F',
        color: '#a48f65',
        items: [
          { name: '\u200Fתפקודי\u200F', value: 73.7, valueLabel: '73.7%' },
          { name: '\u200Fבטוח\u200F', value: 14.5, valueLabel: '14.5%', emphasis: true },
        ],
      },
    ],
  },
};

/* ── Funil ───────────────────────────────────────────────────────────── */

export interface FunnelStep {
  label: string;
  sublabel: string;
  color: string;
  /** Valor REAL (milhões) — a largura é proporção linear honesta. */
  value: number;
}

export interface FunnelDataset {
  steps: readonly FunnelStep[];
}

/**
 * `quantas-pessoas-usam-ia-funil` — 3 degraus, só mundo (não há dado BR
 * populacional de pagantes nem de coding agents — decisão do pitch v2).
 *
 * PROCEDÊNCIA (verificada 02/08/2026): 2.420 mi = DataReportal abr/2026
 * (TETO, não-dedupado). 80 mi = ponto médio da faixa 70-100 mi (estimativa
 * própria; componentes públicos: OpenAI 50+9 mi, GitHub Copilot 4,7 mi,
 * M365 Copilot 15 mi seats). 12,5 mi = ponto médio da faixa 10-15 mi
 * (estimativa própria; componentes: Codex 5 mi+ WAU, Copilot 4,7 mi pagos,
 * resto sem número público auditável). As larguras usam o ponto médio; o
 * rótulo carrega a faixa.
 */
export const funnelDatasets: Record<string, FunnelDataset> = {
  'quantas-pessoas-usam-ia-funil': {
    steps: [
      {
        label: 'Usam IA generativa',
        sublabel: '2,42 bi (teto) · 29% da humanidade',
        color: '#60a5fa',
        value: 2420,
      },
      {
        label: 'Pagam por IA',
        sublabel: '70-100 mi · ~1%',
        color: '#a48f65',
        value: 80,
      },
      {
        label: 'Usam coding agents',
        sublabel: '10-15 mi · ~0,14%',
        color: '#fbbf24',
        value: 12.5,
      },
    ],
  },
  'quantas-pessoas-usam-ia-funil-en': {
    steps: [
      {
        label: 'Use generative AI',
        sublabel: '2.42bn (ceiling) · 29% of humanity',
        color: '#60a5fa',
        value: 2420,
      },
      {
        label: 'Pay for AI',
        sublabel: '70-100m · ~1%',
        color: '#a48f65',
        value: 80,
      },
      {
        label: 'Use coding agents',
        sublabel: '10-15m · ~0.14%',
        color: '#fbbf24',
        value: 12.5,
      },
    ],
  },
  'quantas-pessoas-usam-ia-funil-es': {
    steps: [
      {
        label: 'Usan IA generativa',
        sublabel: '2420 millones (techo) · 29 % de la humanidad',
        color: '#60a5fa',
        value: 2420,
      },
      {
        label: 'Pagan por IA',
        sublabel: '70-100 millones · ~1 %',
        color: '#a48f65',
        value: 80,
      },
      {
        label: 'Usan coding agents',
        sublabel: '10-15 millones · ~0,14 %',
        color: '#fbbf24',
        value: 12.5,
      },
    ],
  },
  'quantas-pessoas-usam-ia-funil-it': {
    steps: [
      {
        label: 'Usano l\'IA generativa',
        sublabel: '2,42 mld (tetto) · 29% dell\'umanità',
        color: '#60a5fa',
        value: 2420,
      },
      {
        label: 'Pagano per l\'IA',
        sublabel: '70-100 mln · ~1%',
        color: '#a48f65',
        value: 80,
      },
      {
        label: 'Usano coding agents',
        sublabel: '10-15 mln · ~0,14%',
        color: '#fbbf24',
        value: 12.5,
      },
    ],
  },
  'quantas-pessoas-usam-ia-funil-he': {
    steps: [
      {
        label: 'משתמשים בבינה מלאכותית גנרטיבית',
        sublabel: '2.42 מיליארד (תקרה) · 29% מהאנושות',
        color: '#60a5fa',
        value: 2420,
      },
      {
        label: 'משלמים על AI',
        sublabel: '70–100 מיליון · ~1%',
        color: '#a48f65',
        value: 80,
      },
      {
        label: 'משתמשים ב־coding agents',
        sublabel: '10–15 מיליון · ~0.14%',
        color: '#fbbf24',
        value: 12.5,
      },
    ],
  },

  /* `estatisticas-de-ia-funil` — McKinsey "The state of AI in 2025"
   * (05/11/2025, N=1.993, 105 países). Três perguntas do MESMO survey, não
   * subconjuntos exatos — o texto explica. `value` aqui é PONTO PERCENTUAL
   * de respondentes (não milhões como no funil acima); a largura continua
   * proporção linear honesta. Redações exatas: 88% = "88 percent report
   * regular AI use in at least one business function"; 10 = "In any given
   * business function, no more than 10 percent of respondents say their
   * organizations are scaling AI agents" (TETO por função; 23% escalam em
   * algum lugar da empresa); 6 = "our definition of AI high performers,
   * representing about 6 percent of respondents" (EBIT ≥5% atribuído à IA
   * + valor "significativo").
   */
  'estatisticas-de-ia-funil': {
    steps: [
      {
        label: 'Usam IA em ≥1 função de negócio',
        sublabel: '88% dos respondentes · uso regular, autorreportado',
        color: '#60a5fa',
        value: 88,
      },
      {
        label: 'Escalam agentes de IA numa função',
        sublabel: '≤10% em qualquer função (teto) · 23% em algum lugar da empresa',
        color: '#a48f65',
        value: 10,
      },
      {
        label: 'High performers: EBIT ≥5% atribuído à IA',
        sublabel: '~6% · definição composta, autorreportada',
        color: '#fbbf24',
        value: 6,
      },
    ],
  },
  'estatisticas-de-ia-funil-en': {
    steps: [
      {
        label: 'Use AI in ≥1 business function',
        sublabel: '88% of respondents · regular use, self-reported',
        color: '#60a5fa',
        value: 88,
      },
      {
        label: 'Scaling AI agents in a given function',
        sublabel: '≤10% in any given function (ceiling) · 23% somewhere in the company',
        color: '#a48f65',
        value: 10,
      },
      {
        label: 'High performers: EBIT ≥5% attributed to AI',
        sublabel: '~6% · composite, self-reported definition',
        color: '#fbbf24',
        value: 6,
      },
    ],
  },
  'estatisticas-de-ia-funil-es': {
    steps: [
      {
        label: 'Usan IA en ≥1 función de negocio',
        sublabel: '88 % de los encuestados · uso regular, autodeclarado',
        color: '#60a5fa',
        value: 88,
      },
      {
        label: 'Escalan agentes de IA en una función',
        sublabel: '≤10 % en cualquier función (techo) · 23 % en algún lugar de la empresa',
        color: '#a48f65',
        value: 10,
      },
      {
        label: 'High performers: EBIT ≥5 % atribuido a la IA',
        sublabel: '~6 % · definición compuesta, autodeclarada',
        color: '#fbbf24',
        value: 6,
      },
    ],
  },
  'estatisticas-de-ia-funil-it': {
    steps: [
      {
        label: "Usano l'IA in ≥1 funzione aziendale",
        sublabel: '88% degli intervistati · uso regolare, autodichiarato',
        color: '#60a5fa',
        value: 88,
      },
      {
        label: 'Scalano agenti di IA in una funzione',
        sublabel: "≤10% in qualsiasi funzione (tetto) · 23% in qualche punto dell'azienda",
        color: '#a48f65',
        value: 10,
      },
      {
        label: "High performers: EBIT ≥5% attribuito all'IA",
        sublabel: '~6% · definizione composita, autodichiarata',
        color: '#fbbf24',
        value: 6,
      },
    ],
  },
  'estatisticas-de-ia-funil-he': {
    steps: [
      {
        label: 'משתמשים ב־AI בפונקציה עסקית אחת לפחות',
        sublabel: '88% מהמשיבים · שימוש סדיר, בדיווח עצמי',
        color: '#60a5fa',
        value: 88,
      },
      {
        label: 'מרחיבים agents של AI בפונקציה אחת',
        sublabel: 'עד 10% בכל פונקציה נתונה (תקרה) · 23% במקום כלשהו בחברה',
        color: '#a48f65',
        value: 10,
      },
      {
        label: 'High performers: EBIT ≥5% שמיוחס ל־AI',
        sublabel: '~6% · הגדרה מורכבת, בדיווח עצמי',
        color: '#fbbf24',
        value: 6,
      },
    ],
  },
};

export interface StepFlowStep {
  /** Rótulo curto. Cadeia: <= 60 caracteres. Linha do tempo: <= 16. */
  label: string;
  /** Frase de apoio, uma linha. Cadeia: <= 92 caracteres. */
  detail?: string;
  /** Marca a etapa onde a cadeia falhou (cor de alerta). */
  alert?: boolean;
}

export interface StepFlowDataset {
  orientation: 'chain' | 'timeline';
  steps: readonly StepFlowStep[];
}

export const stepFlowDatasets: Record<string, StepFlowDataset> = {
  'risco-anthropic-contaminacao': {
    orientation: 'chain',
    steps: [
      {
        label: 'Estudo de 2024 publica as transcrições',
        detail: 'Dezenas de milhares de conversas em que o Opus 3 finge estar alinhado, no GitHub.',
      },
      {
        label: 'O material vira dado de treino',
        detail: 'Modelos seguintes aprendem lendo exemplos de um modelo fingindo.',
      },
      {
        label: 'A Anthropic detecta e reage',
        detail: 'Marca de identificação nos arquivos, lista de bloqueio e filtro automático.',
      },
      {
        label: 'O filtro fica mal configurado',
        detail: 'Passa "várias gerações de modelos, sem ninguém perceber", diz o relatório.',
        alert: true,
      },
      {
        label: 'Descoberta em 2026, fora do prazo',
        detail: 'Depois da data de corte e antes da publicação; impacto ainda sob investigação.',
        alert: true,
      },
    ],
  },
  'risco-anthropic-classificadores': {
    orientation: 'timeline',
    steps: [
      {
        label: 'Maio 2025',
        detail: 'Detector desligado',
      },
      {
        label: '~11 meses',
        detail: '50 mil pessoas · 133 mi',
        alert: true,
      },
      {
        label: 'Abril 2026',
        detail: 'Descoberta e correção',
      },
      {
        label: 'Agosto 2026',
        detail: 'Nota de risco sobe',
      },
    ],
  },
  'risco-anthropic-contaminacao-en': {
    orientation: 'chain',
    steps: [
      {
        label: '2024 study publishes the transcripts',
        detail: 'Tens of thousands of transcripts of Opus 3 faking alignment, on GitHub.',
      },
      {
        label: 'The material becomes training data',
        detail: 'Later models train on examples of a model pretending to be aligned.',
      },
      {
        label: 'Anthropic detects it and responds',
        detail: 'File watermarking, a blocklist, and an automatic filter.',
      },
      {
        label: 'The filter gets misconfigured',
        detail: 'Passes "several model generations without anyone noticing," per the report.',
        alert: true,
      },
      {
        label: 'Found in 2026, past the deadline',
        detail: 'After the cutoff date, before publication; impact still under review.',
        alert: true,
      },
    ],
  },
  'risco-anthropic-classificadores-en': {
    orientation: 'timeline',
    steps: [
      {
        label: 'May 2025',
        detail: 'Detector off',
      },
      {
        label: '~11 months',
        detail: '50K people · 133M',
        alert: true,
      },
      {
        label: 'April 2026',
        detail: 'Found and fixed',
      },
      {
        label: 'August 2026',
        detail: 'Risk score rises',
      },
    ],
  },
  'risco-anthropic-contaminacao-es': {
    orientation: 'chain',
    steps: [
      {
        label: 'El estudio de 2024 publica las transcripciones',
        detail: 'Decenas de miles de conversaciones donde Opus 3 finge estar alineado, en GitHub.',
      },
      {
        label: 'El material se vuelve dato de entrenamiento',
        detail: 'Los modelos siguientes aprenden leyendo ejemplos de un modelo fingiendo.',
      },
      {
        label: 'Anthropic detecta y reacciona',
        detail: 'Marca de identificación en los archivos, lista de bloqueo y filtro automático.',
      },
      {
        label: 'El filtro queda mal configurado',
        detail: 'Pasa "varias generaciones de modelos, sin que nadie lo note", dice el informe.',
        alert: true,
      },
      {
        label: 'Descubrimiento en 2026, fuera de plazo',
        detail: 'Tras la fecha de corte y antes de publicar; impacto aún bajo investigación.',
        alert: true,
      },
    ],
  },
  'risco-anthropic-classificadores-es': {
    orientation: 'timeline',
    steps: [
      {
        label: 'Mayo 2025',
        detail: 'Detector desactivado',
      },
      {
        label: '~11 meses',
        detail: '50 mil personas · 133 mi',
        alert: true,
      },
      {
        label: 'Abril 2026',
        detail: 'Hallazgo y corrección',
      },
      {
        label: 'Agosto 2026',
        detail: 'Sube la nota de riesgo',
      },
    ],
  },
  /**
   * PROVENIÊNCIA: Anthropic, "Risk Report: August 2026".
   * `...contaminacao-it` = §5.2.6, p. 167-168.
   * `...classificadores-it` = §4.5.8.2.2, p. 147-149.
   */
  'risco-anthropic-contaminacao-it': {
    orientation: 'chain',
    steps: [
      {
        label: 'Lo studio del 2024 pubblica le trascrizioni',
        detail: 'Decine di migliaia di trascrizioni con Opus 3 che finge allineamento su GitHub.',
      },
      {
        label: 'Il materiale diventa dato di addestramento',
        detail: 'I modelli successivi imparano leggendo esempi di un modello che finge.',
      },
      {
        label: 'Anthropic rileva e reagisce',
        detail: 'Marcatura nei file, lista nera e filtro automatico.',
      },
      {
        label: 'Il filtro è mal configurato',
        detail: 'Resta rotto per generazioni di modelli, inosservato.',
        alert: true,
      },
      {
        label: 'Scoperta nel 2026, fuori termine',
        detail: 'Dopo la chiusura e prima della pubblicazione; impatto ancora in esame.',
        alert: true,
      },
    ],
  },
  'risco-anthropic-classificadores-it': {
    orientation: 'timeline',
    steps: [
      {
        label: 'Maggio 2025',
        detail: 'Rilevatore spento',
      },
      {
        label: '~11 mesi',
        detail: '50mila persone · 133 mln',
        alert: true,
      },
      {
        label: 'Aprile 2026',
        detail: 'Scoperta e correzione',
      },
      {
        label: 'Agosto 2026',
        detail: 'Il rischio sale',
      },
    ],
  },




  

  'risco-anthropic-contaminacao-he': {
    orientation: 'chain',
    steps: [
      {
        label: 'מחקר 2024 מפרסם את התמלולים',
        detail: 'עשרות אלפי שיחות שבהן Opus 3 מעמיד פנים שהוא מיושר, ב־GitHub.',
      },
      {
        label: 'החומר הופך לנתוני אימון',
        detail: 'מודלים הבאים לומדים מדוגמאות של מודל שמעמיד פנים.',
      },
      {
        label: 'Anthropic מזהה ומגיבה',
        detail: 'סימון בקבצים, רשימה חסומה ומסנן אוטומטי.',
      },
      {
        label: 'המסנן מוגדר לא נכון',
        detail: 'חולף על כמה דורות של מודלים "בלי שאף אחד שם לב", לפי הדוח.',
        alert: true,
      },
      {
        label: 'גילוי ב־2026, מחוץ ללוח הזמנים',
        detail: 'אחרי תאריך החיתוך ולפני הפרסום; ההשפעה עדיין נבדקת.',
        alert: true,
      },
    ],
  },
  'risco-anthropic-classificadores-he': {
    orientation: 'timeline',
    steps: [
      {
        label: 'מאי 2025',
        detail: 'גלאי כבוי',
      },
      {
        label: 'כ־11 חודשים',
        detail: '50 אלף · 133 מיליון',
        alert: true,
      },
      {
        label: 'אפריל 2026',
        detail: 'גילוי ותיקון',
      },
      {
        label: 'אוגוסט 2026',
        detail: 'ציון הסיכון עולה',
      },
    ],
  },

  /**
   * `marca-dagua-claude` — a linha do tempo da marca d'água no texto.
   *
   * Cinco passos é o teto medido: a timeline reparte 672px entre os intervalos
   * e centra o rótulo do meio; com seis, os intervalos caem para 134px e
   * "Aaronson propõe" invade "SynthID na Nature" (-12,6px de vão). O Código de
   * Conduta de Transparência de julho/2026 saiu da FIGURA por isso e segue no
   * texto, fundido no marco de 2/ago/2026, que é o que tem força legal.
   *
   * Datas em fonte primária: Aaronson 28/nov/2022 (scottaaronson.blog),
   * SynthID-Text na Nature 23/out/2024 (Crossref), artigo 50(2) exigível em
   * 2/ago/2026 (Comissão Europeia), anúncio 14/ago/2026 (Anthropic). O último
   * passo é `alert` porque é o que NÃO tem data: a API de detecção foi
   * anunciada como "em breve" e não existe publicamente.
   */
  'marca-dagua-linha-do-tempo': {
    orientation: 'timeline',
    steps: [
      { label: 'nov/2022', detail: 'Aaronson propõe' },
      { label: 'out/2024', detail: 'SynthID na Nature' },
      { label: '2/ago/2026', detail: 'a regra vale na UE' },
      { label: '14/ago/2026', detail: 'Claude anuncia' },
      { label: 'sem data', detail: 'API de detecção', alert: true },
    ],
  },
  'marca-dagua-linha-do-tempo-en': {
    orientation: 'timeline',
    steps: [
      { label: 'Nov 2022', detail: 'Aaronson proposes' },
      { label: 'Oct 2024', detail: 'SynthID in Nature' },
      { label: '2 Aug 2026', detail: 'the EU rule applies' },
      { label: '14 Aug 2026', detail: 'Claude announces' },
      { label: 'no date', detail: 'detection API', alert: true },
    ],
  },
  'marca-dagua-linha-do-tempo-he': {
    orientation: 'timeline',
    steps: [
      // Datas SÓ em número: rótulo que mistura mês em hebraico com algarismos
      // latinos é reordenado pelo algoritmo bidi dentro de um `<text>` de base
      // LTR, e "2 באוג׳ 2026" saiu no render como "2 2026 באוג׳" — o dia
      // desgarrado do mês. Defeito que o medidor de largura não vê.
      { label: '11/2022', detail: 'אהרונסון מציע' },
      { label: '10/2024', detail: 'SynthID ב-Nature' },
      { label: '2/8/2026', detail: 'הכלל תקף באיחוד' },
      { label: '14/8/2026', detail: 'קלוד מכריז' },
      { label: 'ללא תאריך', detail: 'API לזיהוי', alert: true },
    ],
  },
  'marca-dagua-linha-do-tempo-es': {
    orientation: 'timeline',
    steps: [
      { label: 'nov/2022', detail: 'Aaronson propone' },
      { label: 'oct/2024', detail: 'SynthID en Nature' },
      { label: '2/ago/2026', detail: 'la regla rige en la UE' },
      { label: '14/ago/2026', detail: 'Claude anuncia' },
      { label: 'sin fecha', detail: 'API de detección', alert: true },
    ],
  },
  'marca-dagua-linha-do-tempo-it': {
    orientation: 'timeline',
    steps: [
      { label: 'nov 2022', detail: 'Aaronson propone' },
      { label: 'ott 2024', detail: 'SynthID su Nature' },
      { label: '2 ago 2026', detail: "la regola vale nell'UE" },
      { label: '14 ago 2026', detail: 'Claude annuncia' },
      { label: 'senza data', detail: 'API di rilevamento', alert: true },
    ],
  },
  'restricao-cinco-passos': {
    orientation: 'chain',
    steps: [
      {
        label: 'Identifique as restrições do sistema',
        detail: 'Onde a fila se forma: o forno, o posto 3, a revisão humana.',
      },
      {
        label: 'Decida como explorar as restrições',
        detail: 'Explorar (exploit), não otimizar: tirar o máximo do que já existe antes de gastar.',
      },
      {
        label: 'Subordine todo o resto à decisão acima',
        detail: 'É a corda: o posto rápido espera pelo forno. Custa 5% de vazão, compra a travessia.',
        alert: true,
      },
      {
        label: 'Eleve as restrições do sistema',
        detail: 'Só agora comprar capacidade: +25% aqui rendeu +24,9% de saída.',
        alert: true,
      },
      {
        label: 'Se uma restrição foi quebrada, volte ao passo um',
        detail: 'Mas não deixe a inércia virar a restrição do sistema.',
        alert: true,
      },
    ],
  },
  'restricao-cinco-passos-it': {
    orientation: 'chain',
    steps: [
      {
        label: 'Identificare i vincoli del sistema',
        detail: 'Dove si forma la coda: il forno, il posto 3, la revisione umana.',
      },
      {
        label: 'Decidere come sfruttare i vincoli',
        detail: 'Sfruttare (exploit), non ottimizzare: spremere ciò che esiste prima di spendere.',
      },
      {
        label: 'Subordinare tutto il resto alla decisione di cui sopra',
        detail: 'È la corda: il posto veloce aspetta il forno. Costa il 5%, compra l\'attraversamento.',
        alert: true,
      },
      {
        label: 'Elevare i vincoli del sistema',
        detail: 'Solo ora comprare capacità: +25% qui ha reso +24,9% di uscita.',
        alert: true,
      },
      {
        label: 'Se un vincolo è stato rotto, tornare al passo uno',
        detail: 'Ma non lasciate che l\'inerzia diventi il vincolo del sistema.',
        alert: true,
      },
    ],
  },
  'restricao-cinco-passos-en': {
    orientation: 'chain',
    steps: [
      {
        label: 'Identify the system\'s constraints',
        detail: 'Where the queue forms: the oven, station 3, the human review.',
      },
      {
        label: 'Decide how to exploit the constraints',
        detail: 'Exploit, not optimize: get the most from what exists before spending.',
      },
      {
        label: 'Subordinate everything else to the above decision',
        detail: 'It is the rope: the fast station waits for the oven. Costs 5%, buys the lead time.',
        alert: true,
      },
      {
        label: 'Elevate the system\'s constraints',
        detail: 'Only now buy capacity: +25% here returned +24.9% of output.',
        alert: true,
      },
      {
        label: 'If a constraint has been broken, go back to step one',
        detail: 'But do not allow inertia to become the system\'s constraint.',
        alert: true,
      },
    ],
  },
  'restricao-cinco-passos-he': {
    orientation: 'chain',
    steps: [
      {
        label: 'זהו את האילוצים של המערכת',
        detail: 'היכן שנוצר התור: התנור, עמדה 3, הבקרה האנושית.',
      },
      {
        label: 'החליטו כיצד לנצל את האילוצים',
        detail: 'לנצל (exploit), לא לייעל: להוציא את המרב מהקיים לפני שמוציאים כסף.',
      },
      {
        label: 'הכפיפו את כל השאר להחלטה שלמעלה',
        detail: 'זהו החבל: העמדה המהירה ממתינה לתנור. עולה 5% מהתפוקה, קונה את זמן המעבר.',
        alert: true,
      },
      {
        label: 'הרימו את האילוצים של המערכת',
        detail: 'רק עכשיו לקנות קיבולת: +25% כאן הניבו +24.9% בתפוקה.',
        alert: true,
      },
      {
        label: 'אם אילוץ נשבר, חזרו לצעד הראשון',
        detail: 'אבל אל תיתנו לאינרציה להפוך לאילוץ של המערכת.',
        alert: true,
      },
    ],
  },
  'restricao-cinco-passos-es': {
    orientation: 'chain',
    steps: [
      {
        label: 'Identifique las restricciones del sistema',
        detail: 'Donde se forma la cola: el horno, el puesto 3, la revisión humana.',
      },
      {
        label: 'Decida cómo explotar las restricciones',
        detail: 'Explotar (exploit), no optimizar: sacar el máximo de lo que ya existe antes de gastar.',
      },
      {
        label: 'Subordine todo lo demás a la decisión anterior',
        detail: 'Es la cuerda: el puesto rápido espera al horno. Cuesta 5% de caudal, compra la travesía.',
        alert: true,
      },
      {
        label: 'Eleve las restricciones del sistema',
        detail: 'Solo ahora comprar capacidad: +25% aquí rindió +24,9% de salida.',
        alert: true,
      },
      {
        label: 'Si una restricción fue rota, vuelva al paso uno',
        detail: 'Pero no deje que la inercia se vuelva la restricción del sistema.',
        alert: true,
      },
    ],
  },

  /* ── estatisticas-agentes-de-ia (pt-br, en, es, it) ── */
  /**
   * `agentes-tres-reguas` — a régua do artigo: três naturezas de estatística, cada uma com
   * seu modo de falha. PROCEDÊNCIA: classificação do autor; os modos de falha vêm de Gartner
   * (previsão sem amostra), METR 2025 (percepção × cronômetro) e HAL/ICLR 2026 (agente que
   * acha o gabarito).
   */
  'agentes-tres-reguas': {
    orientation: 'chain',
    steps: [
      {
        label: 'Previsão — quem produziu o número não mediu nada',
        detail: 'Opinião de analista com horizonte. Não tem amostra: não há o que conferir.',
      },
      {
        label: 'Declaração — alguém respondeu a uma pergunta',
        detail: 'Survey de percepção. Mede o que se relata — e o relato erra o sinal do efeito.',
      },
      {
        label: 'Medição — alguém cronometrou ou rodou o teste',
        detail: 'Benchmark ou ensaio. Reprodutível — e o agente aprende a burlar o proxy.',
      },
    ],
  },
  /**
   * `agentes-tres-reguas-en` — a régua do artigo: três naturezas de estatística, cada uma com
   * seu modo de falha. PROCEDÊNCIA: classificação do autor; os modos de falha vêm de Gartner
   * (previsão sem amostra), METR 2025 (percepção × cronômetro) e HAL/ICLR 2026 (agente que
   * acha o gabarito).
   */
  'agentes-tres-reguas-en': {
    orientation: 'chain',
    steps: [
      {
        label: 'Forecast — whoever produced the number measured nothing',
        detail: 'Analyst opinion with a horizon. No sample: nothing to check.',
      },
      {
        label: 'Self-report — someone answered a question',
        detail: 'Perception survey. Measures what is reported — and gets the sign wrong.',
      },
      {
        label: 'Measurement — someone timed it or ran the test',
        detail: 'Benchmark or trial. Reproducible — and the agent learns to game the proxy.',
      },
    ],
  },
  /**
   * `agentes-tres-reguas-es` — a régua do artigo: três naturezas de estatística, cada uma com
   * seu modo de falha. PROCEDÊNCIA: classificação do autor; os modos de falha vêm de Gartner
   * (previsão sem amostra), METR 2025 (percepção × cronômetro) e HAL/ICLR 2026 (agente que
   * acha o gabarito).
   */
  'agentes-tres-reguas-es': {
    orientation: 'chain',
    steps: [
      {
        label: 'Predicción — quien produjo el número no midió nada',
        detail: 'Opinión de analista con horizonte. No tiene muestra: no hay nada que comprobar.',
      },
      {
        label: 'Declaración — alguien respondió a una pregunta',
        detail: 'Encuesta de percepción. Mide lo declarado — y el relato yerra el signo del efecto.',
      },
      {
        label: 'Medición — alguien cronometró o corrió la prueba',
        detail: 'Benchmark o ensayo. Reproducible — y el agente aprende a burlar el proxy.',
      },
    ],
  },
  /**
   * `agentes-tres-reguas-it` — a régua do artigo: três naturezas de estatística, cada uma com
   * seu modo de falha. PROCEDÊNCIA: classificação do autor; os modos de falha vêm de Gartner
   * (previsão sem amostra), METR 2025 (percepção × cronômetro) e HAL/ICLR 2026 (agente que
   * acha o gabarito).
   */
  'agentes-tres-reguas-it': {
    orientation: 'chain',
    steps: [
      {
        label: 'Previsione — chi ha prodotto il numero non ha misurato nulla',
        detail: "Opinione di analista con orizzonte. Non ha campione: non c'è nulla da verificare.",
      },
      {
        label: 'Dichiarazione — qualcuno ha risposto a una domanda',
        detail: "Sondaggio di percezione. Misura il riferito — e il resoconto sbaglia il segno dell'effetto.",
      },
      {
        label: 'Misurazione — qualcuno ha cronometrato o eseguito il test',
        detail: "Benchmark o esperimento. Riproducibile — e l'agente impara a raggirare il proxy.",
      },
    ],
  },
  /**
   * `benchmark-cadeia-do-numero` — FIGURA 1, degrau 1 da escada didática:
   * a analogia, sem uma palavra técnica. A nota de uma prova também não é
   * uma propriedade só de quem fez a prova.
   */
  'benchmark-cadeia-do-numero': {
    orientation: 'chain',
    steps: [
      {
        label: 'Alguém resolve a questão',
        detail: 'É esse nome que vai aparecer sozinho no boletim, no fim da cadeia.',
      },
      {
        label: 'A escola decide como é a prova',
        detail: 'Quanto tempo, que material pode consultar, quando a prova acaba.',
      },
      {
        label: 'O professor corrige com um gabarito',
        detail: 'A mesma resposta muda de nota quando o gabarito fica mais rigoroso.',
      },
      {
        label: 'A nota vira notícia',
        detail: 'No caminho some tudo que não é o nome de quem fez a prova.',
        alert: true,
      },
    ],
  },

  /**
   * `benchmark-linha-do-tempo` — FIGURA 6, degrau 6: os três textos do mesmo
   * autor sobre o mesmo benchmark, e o que cada um alcançou. As posições são
   * a ORDEM de publicação, não uma escala de tempo (dois saíram no mesmo dia)
   * — o subtítulo da figura declara isso ao leitor.
   */
  'benchmark-linha-do-tempo': {
    orientation: 'timeline',
    steps: [
      {
        label: '10 de junho · o achado',
        detail: '410 pontos, 250 comentários',
      },
      {
        label: '10 de junho · a auditoria',
        detail: 'nunca submetida ao Hacker News',
      },
      {
        label: '17 de junho · a correção',
        detail: '3 pontos, 0 comentário',
        alert: true,
      },
    ],
  },

  /** `benchmark-cadeia-do-numero-en` — FIGURE 1, English. */
  'benchmark-cadeia-do-numero-en': {
    orientation: 'chain',
    steps: [
      {
        label: 'Someone answers the question',
        detail: 'Theirs is the only name that reaches the report card at the end of the chain.',
      },
      {
        label: 'The school decides how the exam works',
        detail: 'How long, what may be consulted, when the exam is over.',
      },
      {
        label: 'A teacher marks it against an answer key',
        detail: 'The same answer changes grade when the answer key gets stricter.',
      },
      {
        label: 'The grade becomes news',
        detail: 'Along the way everything that is not the student name drops out.',
        alert: true,
      },
    ],
  },

  /** `benchmark-linha-do-tempo-en` — FIGURE 6, English. */
  'benchmark-linha-do-tempo-en': {
    orientation: 'timeline',
    steps: [
      {
        label: '10 June · the finding',
        detail: '410 points, 250 comments',
      },
      {
        label: '10 June · the audit',
        detail: 'never submitted to Hacker News',
      },
      {
        label: '17 June · the correction',
        detail: '3 points, 0 comments',
        alert: true,
      },
    ],
  },

  /** `benchmark-cadeia-do-numero-es` — FIGURA 1, español. */
  'benchmark-cadeia-do-numero-es': {
    orientation: 'chain',
    steps: [
      {
        label: 'Alguien resuelve la pregunta',
        detail: 'Es ese nombre el que aparecerá solo en el boletín, al final de la cadena.',
      },
      {
        label: 'La escuela decide cómo es el examen',
        detail: 'Cuánto tiempo, qué material se puede consultar, cuándo termina el examen.',
      },
      {
        label: 'El profesor corrige con una plantilla',
        detail: 'La misma respuesta cambia de nota cuando la plantilla se vuelve más estricta.',
      },
      {
        label: 'La nota se vuelve noticia',
        detail: 'Por el camino desaparece todo lo que no es el nombre de quien hizo el examen.',
        alert: true,
      },
    ],
  },

  /** `benchmark-linha-do-tempo-es` — FIGURA 6, español. */
  'benchmark-linha-do-tempo-es': {
    orientation: 'timeline',
    steps: [
      {
        label: '10 de junio · el hallazgo',
        detail: '410 puntos, 250 comentarios',
      },
      {
        label: '10 de junio · la auditoría',
        detail: 'nunca enviada a Hacker News',
      },
      {
        label: '17 de junio · la corrección',
        detail: '3 puntos, 0 comentarios',
        alert: true,
      },
    ],
  },

  /** `benchmark-cadeia-do-numero-it` — FIGURA 1, italiano. */
  'benchmark-cadeia-do-numero-it': {
    orientation: 'chain',
    steps: [
      {
        label: 'Qualcuno risolve la domanda',
        detail: 'È quel nome a comparire da solo sulla pagella, alla fine della catena.',
      },
      {
        label: 'La scuola decide come è il compito',
        detail: 'Quanto tempo, che materiale si può consultare, quando il compito finisce.',
      },
      {
        label: "L'insegnante corregge con una griglia",
        detail: 'La stessa risposta cambia voto quando la griglia diventa più severa.',
      },
      {
        label: 'Il voto diventa notizia',
        detail: 'Lungo la strada sparisce tutto ciò che non è il nome di chi ha fatto il compito.',
        alert: true,
      },
    ],
  },

  /** `benchmark-linha-do-tempo-it` — FIGURA 6, italiano. */
  'benchmark-linha-do-tempo-it': {
    orientation: 'timeline',
    steps: [
      {
        label: '10 giugno · la scoperta',
        detail: '410 punti, 250 commenti',
      },
      {
        label: '10 giugno · la verifica',
        detail: 'mai inviata a Hacker News',
      },
      {
        label: '17 giugno · la correzione',
        detail: '3 punti, 0 commenti',
        alert: true,
      },
    ],
  },

  /**
   * `benchmark-cadeia-do-numero-he` — FIGURA 1, hebraico.
   * A geometria dos dois componentes é LTR: o texto é ancorado à ESQUERDA e o
   * `dir="rtl"` do artigo não alcança o SVG. Limitação declarada — os rótulos
   * foram conferidos no PNG, um a um, e não só no medidor de largura.
   */
  'benchmark-cadeia-do-numero-he': {
    orientation: 'chain',
    steps: [
      {
        label: '\u200Fמישהו פותר את השאלה\u200F',
        detail: '\u200Fזה השם שיופיע לבדו בתעודה, בסוף השרשרת.\u200F',
      },
      {
        label: '\u200Fבית הספר מחליט כיצד נראה המבחן\u200F',
        detail: '\u200Fכמה זמן, באיזה חומר מותר להיעזר, מתי המבחן נגמר.\u200F',
      },
      {
        label: '\u200Fהמורה בודק לפי מחוון\u200F',
        detail: '\u200Fאותה תשובה מקבלת ציון אחר כשהמחוון נעשה מחמיר יותר.\u200F',
      },
      {
        label: '\u200Fהציון הופך לחדשות\u200F',
        detail: '\u200Fבדרך נעלם כל מה שאינו שמו של מי שנבחן.\u200F',
        alert: true,
      },
    ],
  },

  /** `benchmark-linha-do-tempo-he` — FIGURA 6, hebraico. */
  'benchmark-linha-do-tempo-he': {
    orientation: 'timeline',
    /**
     * ORDEM INVERTIDA DE PROPÓSITO. O componente é LTR e desenha `steps[0]` à
     * esquerda; o leitor de hebraico começa pela DIREITA. Mantida a ordem
     * cronológica do original, a linha do tempo seria lida de trás para a
     * frente — foi exatamente esse o defeito pego no render do artigo
     * `marca-dagua-claude`. Aqui o achado fica à direita (onde a leitura
     * começa) e a correção à esquerda (onde ela termina).
     * O `\u200F` (RLM) em cada ponta prende a pontuação e os números latinos
     * dentro do trecho em hebraico; sem ele o ponto e o hífen migram para a
     * borda errada.
     */
    steps: [
      {
        label: '\u200Fהתיקון · 17 ביוני\u200F',
        detail: '\u200F3 נקודות · 0 תגובות\u200F',
        alert: true,
      },
      {
        label: '\u200Fהביקורת · 10 ביוני\u200F',
        detail: '\u200Fלא הוגשה מעולם ל-Hacker News\u200F',
      },
      {
        label: '\u200Fהממצא · 10 ביוני\u200F',
        detail: '\u200F410 נקודות · 250 תגובות\u200F',
      },
    ],
  },
};


/**
 * A escada da VRAM do artigo `ia-local-por-vram`.
 *
 * NAO EDITAR A MAO. Gerado por
 * `python3 gerar-dataset.py --ts` no dossie
 * /Users/ulissesflores/Developer/redacao/dossies/ia-local-por-vram/.
 *
 * PESOS = tamanho real do arquivo GGUF no Hugging Face Hub (GB decimais do Hub),
 * convertido para GiB. CACHE = `python3 medidor.py --repo <repo>` do dossie
 * `memoria-llm-local`, batch 1, 2 bytes por elemento. CAPACIDADE = memoria do
 * hardware verificada em 2026-08-27. Repo de cada peso, na ordem dos degraus:
 *      4 GB - google/gemma-4-E2B-it-qat-q4_0-gguf
 *      8 GB - google/gemma-4-12B-it-qat-q4_0-gguf
 *     16 GB - lmstudio-community/gemma-4-12B-it-GGUF
 *     24 GB - unsloth/Qwen3.8-27B-GGUF (UD-Q4_K_M)
 *     32 GB - unsloth/Qwen3.8-27B-GGUF (UD-Q6_K)
 *     48 GB - unsloth/Qwen3.8-27B-GGUF (Q8_0)
 *     64 GB - unsloth/Qwen3.8-27B-GGUF (BF16)
 *     96 GB - unsloth/Qwen3.8-Flash-Next-GGUF (UD-Q2_K_XL)
 *    128 GB - unsloth/Qwen3.8-Flash-Next-GGUF (UD-Q4_K_XL)
 *    256 GB - unsloth/DeepSeek-V4-Flash-0731-GGUF (UD-Q8_K_XL)
 *
 * Um dataset por locale: os rotulos sao texto.
 */
export interface VramLadderDegrau {
  /** Memoria do degrau, em GiB — e a trilha da linha. */
  capacidade: number;
  /** Pecas que tem essa memoria. Nome proprio: nao traduz. */
  hardware: string;
  modelo: string;
  quant: string;
  /** Parcela fixa: o arquivo de pesos, em GiB. */
  pesos: number;
  /** Parcela que cresce, no contexto de referencia de 32K, em GiB. */
  cacheRef: number;
  /** A mesma parcela no contexto maximo do modelo, em GiB. */
  cacheMax: number;
  /** Maior contexto medido em que pesos + cache ainda cabem. */
  cabeAte: string;
}

export interface VramLadderDataset {
  degraus: VramLadderDegrau[];
  legenda: { pesos: string; cache: string; estouro: string };
}

export const vramLadderDatasets: Record<string, VramLadderDataset> = {
  'ia-local-por-vram-escada': {
    degraus: [
      {
        capacidade: 4,
        hardware: 'GPU integrada',
        modelo: 'Gemma 4 E2B',
        quant: 'QAT q4_0',
        pesos: 3.12,
        cacheRef: 0.45,
        cacheMax: 1.76,
        cabeAte: 'até 32K',
      },
      {
        capacidade: 8,
        hardware: 'RTX 5060 / 4060',
        modelo: 'Gemma 4 12B',
        quant: 'QAT q4_0',
        pesos: 6.5,
        cacheRef: 2.16,
        cacheMax: 16.16,
        cabeAte: 'até 8K',
      },
      {
        capacidade: 16,
        hardware: 'RTX 5060 Ti / 4080',
        modelo: 'Gemma 4 12B',
        quant: 'Q8_0',
        pesos: 11.8,
        cacheRef: 2.16,
        cacheMax: 16.16,
        cabeAte: 'até 32K',
      },
      {
        capacidade: 24,
        hardware: 'RTX 3090 / 4090',
        modelo: 'Qwen3.8-27B',
        quant: 'UD-Q4_K_M',
        pesos: 15.33,
        cacheRef: 2.14,
        cacheMax: 16.14,
        cabeAte: 'até 128K',
      },
      {
        capacidade: 32,
        hardware: 'RTX 5090 / M6',
        modelo: 'Qwen3.8-27B',
        quant: 'UD-Q6_K',
        pesos: 20.47,
        cacheRef: 2.14,
        cacheMax: 16.14,
        cabeAte: 'até 128K',
      },
      {
        capacidade: 48,
        hardware: 'M5 Pro (48 GB)',
        modelo: 'Qwen3.8-27B',
        quant: 'Q8_0',
        pesos: 27.05,
        cacheRef: 2.14,
        cacheMax: 16.14,
        cabeAte: 'até 256K',
      },
      {
        capacidade: 64,
        hardware: '2x RTX 5090 / M5 Pro',
        modelo: 'Qwen3.8-27B',
        quant: 'BF16',
        pesos: 50.91,
        cacheRef: 2.14,
        cacheMax: 16.14,
        cabeAte: 'até 128K',
      },
      {
        capacidade: 96,
        hardware: 'RTX PRO 6000 / M5 Ultra',
        modelo: 'Qwen3.8-Flash-Next',
        quant: 'UD-Q2_K_XL',
        pesos: 73.45,
        cacheRef: 0.86,
        cacheMax: 6.11,
        cabeAte: 'até 256K',
      },
      {
        capacidade: 128,
        hardware: 'DGX Spark / M5 Max',
        modelo: 'Qwen3.8-Flash-Next',
        quant: 'UD-Q4_K_XL',
        pesos: 103.68,
        cacheRef: 0.86,
        cacheMax: 6.11,
        cabeAte: 'até 256K',
      },
      {
        capacidade: 256,
        hardware: 'M5 Ultra / 2x DGX Spark',
        modelo: 'DeepSeek V4 Flash 0731',
        quant: 'UD-Q8_K_XL',
        pesos: 150.75,
        cacheRef: 2.69,
        cacheMax: 21.5,
        cabeAte: 'até 256K',
      },
    ],
    legenda: {
      pesos: 'pesos do modelo',
      cache: 'cache a 32K de contexto',
      estouro: 'o que falta no contexto máximo do modelo',
    },
  },
  'ia-local-por-vram-escada-en': {
    degraus: [
      {
        capacidade: 4,
        hardware: 'Integrated GPU',
        modelo: 'Gemma 4 E2B',
        quant: 'QAT q4_0',
        pesos: 3.12,
        cacheRef: 0.45,
        cacheMax: 1.76,
        cabeAte: 'up to 32K',
      },
      {
        capacidade: 8,
        hardware: 'RTX 5060 / 4060',
        modelo: 'Gemma 4 12B',
        quant: 'QAT q4_0',
        pesos: 6.5,
        cacheRef: 2.16,
        cacheMax: 16.16,
        cabeAte: 'up to 8K',
      },
      {
        capacidade: 16,
        hardware: 'RTX 5060 Ti / 4080',
        modelo: 'Gemma 4 12B',
        quant: 'Q8_0',
        pesos: 11.8,
        cacheRef: 2.16,
        cacheMax: 16.16,
        cabeAte: 'up to 32K',
      },
      {
        capacidade: 24,
        hardware: 'RTX 3090 / 4090',
        modelo: 'Qwen3.8-27B',
        quant: 'UD-Q4_K_M',
        pesos: 15.33,
        cacheRef: 2.14,
        cacheMax: 16.14,
        cabeAte: 'up to 128K',
      },
      {
        capacidade: 32,
        hardware: 'RTX 5090 / M6',
        modelo: 'Qwen3.8-27B',
        quant: 'UD-Q6_K',
        pesos: 20.47,
        cacheRef: 2.14,
        cacheMax: 16.14,
        cabeAte: 'up to 128K',
      },
      {
        capacidade: 48,
        hardware: 'M5 Pro (48 GB)',
        modelo: 'Qwen3.8-27B',
        quant: 'Q8_0',
        pesos: 27.05,
        cacheRef: 2.14,
        cacheMax: 16.14,
        cabeAte: 'up to 256K',
      },
      {
        capacidade: 64,
        hardware: '2x RTX 5090 / M5 Pro',
        modelo: 'Qwen3.8-27B',
        quant: 'BF16',
        pesos: 50.91,
        cacheRef: 2.14,
        cacheMax: 16.14,
        cabeAte: 'up to 128K',
      },
      {
        capacidade: 96,
        hardware: 'RTX PRO 6000 / M5 Ultra',
        modelo: 'Qwen3.8-Flash-Next',
        quant: 'UD-Q2_K_XL',
        pesos: 73.45,
        cacheRef: 0.86,
        cacheMax: 6.11,
        cabeAte: 'up to 256K',
      },
      {
        capacidade: 128,
        hardware: 'DGX Spark / M5 Max',
        modelo: 'Qwen3.8-Flash-Next',
        quant: 'UD-Q4_K_XL',
        pesos: 103.68,
        cacheRef: 0.86,
        cacheMax: 6.11,
        cabeAte: 'up to 256K',
      },
      {
        capacidade: 256,
        hardware: 'M5 Ultra / 2x DGX Spark',
        modelo: 'DeepSeek V4 Flash 0731',
        quant: 'UD-Q8_K_XL',
        pesos: 150.75,
        cacheRef: 2.69,
        cacheMax: 21.5,
        cabeAte: 'up to 256K',
      },
    ],
    legenda: {
      pesos: 'model weights',
      cache: 'cache at 32K context',
      estouro: 'what no longer fits at the model\'s maximum context',
    },
  },
  'ia-local-por-vram-escada-es': {
    degraus: [
      {
        capacidade: 4,
        hardware: 'GPU integrada',
        modelo: 'Gemma 4 E2B',
        quant: 'QAT q4_0',
        pesos: 3.12,
        cacheRef: 0.45,
        cacheMax: 1.76,
        cabeAte: 'hasta 32K',
      },
      {
        capacidade: 8,
        hardware: 'RTX 5060 / 4060',
        modelo: 'Gemma 4 12B',
        quant: 'QAT q4_0',
        pesos: 6.5,
        cacheRef: 2.16,
        cacheMax: 16.16,
        cabeAte: 'hasta 8K',
      },
      {
        capacidade: 16,
        hardware: 'RTX 5060 Ti / 4080',
        modelo: 'Gemma 4 12B',
        quant: 'Q8_0',
        pesos: 11.8,
        cacheRef: 2.16,
        cacheMax: 16.16,
        cabeAte: 'hasta 32K',
      },
      {
        capacidade: 24,
        hardware: 'RTX 3090 / 4090',
        modelo: 'Qwen3.8-27B',
        quant: 'UD-Q4_K_M',
        pesos: 15.33,
        cacheRef: 2.14,
        cacheMax: 16.14,
        cabeAte: 'hasta 128K',
      },
      {
        capacidade: 32,
        hardware: 'RTX 5090 / M6',
        modelo: 'Qwen3.8-27B',
        quant: 'UD-Q6_K',
        pesos: 20.47,
        cacheRef: 2.14,
        cacheMax: 16.14,
        cabeAte: 'hasta 128K',
      },
      {
        capacidade: 48,
        hardware: 'M5 Pro (48 GB)',
        modelo: 'Qwen3.8-27B',
        quant: 'Q8_0',
        pesos: 27.05,
        cacheRef: 2.14,
        cacheMax: 16.14,
        cabeAte: 'hasta 256K',
      },
      {
        capacidade: 64,
        hardware: '2x RTX 5090 / M5 Pro',
        modelo: 'Qwen3.8-27B',
        quant: 'BF16',
        pesos: 50.91,
        cacheRef: 2.14,
        cacheMax: 16.14,
        cabeAte: 'hasta 128K',
      },
      {
        capacidade: 96,
        hardware: 'RTX PRO 6000 / M5 Ultra',
        modelo: 'Qwen3.8-Flash-Next',
        quant: 'UD-Q2_K_XL',
        pesos: 73.45,
        cacheRef: 0.86,
        cacheMax: 6.11,
        cabeAte: 'hasta 256K',
      },
      {
        capacidade: 128,
        hardware: 'DGX Spark / M5 Max',
        modelo: 'Qwen3.8-Flash-Next',
        quant: 'UD-Q4_K_XL',
        pesos: 103.68,
        cacheRef: 0.86,
        cacheMax: 6.11,
        cabeAte: 'hasta 256K',
      },
      {
        capacidade: 256,
        hardware: 'M5 Ultra / 2x DGX Spark',
        modelo: 'DeepSeek V4 Flash 0731',
        quant: 'UD-Q8_K_XL',
        pesos: 150.75,
        cacheRef: 2.69,
        cacheMax: 21.5,
        cabeAte: 'hasta 256K',
      },
    ],
    legenda: {
      pesos: 'pesos del modelo',
      cache: 'caché a 32K de contexto',
      estouro: 'lo que ya no cabe en el contexto máximo del modelo',
    },
  },
  'ia-local-por-vram-escada-it': {
    degraus: [
      {
        capacidade: 4,
        hardware: 'GPU integrata',
        modelo: 'Gemma 4 E2B',
        quant: 'QAT q4_0',
        pesos: 3.12,
        cacheRef: 0.45,
        cacheMax: 1.76,
        cabeAte: 'fino a 32K',
      },
      {
        capacidade: 8,
        hardware: 'RTX 5060 / 4060',
        modelo: 'Gemma 4 12B',
        quant: 'QAT q4_0',
        pesos: 6.5,
        cacheRef: 2.16,
        cacheMax: 16.16,
        cabeAte: 'fino a 8K',
      },
      {
        capacidade: 16,
        hardware: 'RTX 5060 Ti / 4080',
        modelo: 'Gemma 4 12B',
        quant: 'Q8_0',
        pesos: 11.8,
        cacheRef: 2.16,
        cacheMax: 16.16,
        cabeAte: 'fino a 32K',
      },
      {
        capacidade: 24,
        hardware: 'RTX 3090 / 4090',
        modelo: 'Qwen3.8-27B',
        quant: 'UD-Q4_K_M',
        pesos: 15.33,
        cacheRef: 2.14,
        cacheMax: 16.14,
        cabeAte: 'fino a 128K',
      },
      {
        capacidade: 32,
        hardware: 'RTX 5090 / M6',
        modelo: 'Qwen3.8-27B',
        quant: 'UD-Q6_K',
        pesos: 20.47,
        cacheRef: 2.14,
        cacheMax: 16.14,
        cabeAte: 'fino a 128K',
      },
      {
        capacidade: 48,
        hardware: 'M5 Pro (48 GB)',
        modelo: 'Qwen3.8-27B',
        quant: 'Q8_0',
        pesos: 27.05,
        cacheRef: 2.14,
        cacheMax: 16.14,
        cabeAte: 'fino a 256K',
      },
      {
        capacidade: 64,
        hardware: '2x RTX 5090 / M5 Pro',
        modelo: 'Qwen3.8-27B',
        quant: 'BF16',
        pesos: 50.91,
        cacheRef: 2.14,
        cacheMax: 16.14,
        cabeAte: 'fino a 128K',
      },
      {
        capacidade: 96,
        hardware: 'RTX PRO 6000 / M5 Ultra',
        modelo: 'Qwen3.8-Flash-Next',
        quant: 'UD-Q2_K_XL',
        pesos: 73.45,
        cacheRef: 0.86,
        cacheMax: 6.11,
        cabeAte: 'fino a 256K',
      },
      {
        capacidade: 128,
        hardware: 'DGX Spark / M5 Max',
        modelo: 'Qwen3.8-Flash-Next',
        quant: 'UD-Q4_K_XL',
        pesos: 103.68,
        cacheRef: 0.86,
        cacheMax: 6.11,
        cabeAte: 'fino a 256K',
      },
      {
        capacidade: 256,
        hardware: 'M5 Ultra / 2x DGX Spark',
        modelo: 'DeepSeek V4 Flash 0731',
        quant: 'UD-Q8_K_XL',
        pesos: 150.75,
        cacheRef: 2.69,
        cacheMax: 21.5,
        cabeAte: 'fino a 256K',
      },
    ],
    legenda: {
      pesos: 'pesi del modello',
      cache: 'cache a 32K di contesto',
      estouro: 'ciò che non entra più al contesto massimo del modello',
    },
  },
  'ia-local-por-vram-escada-he': {
    degraus: [
      {
        capacidade: 4,
        hardware: 'GPU משולבת',
        modelo: 'Gemma 4 E2B',
        quant: 'QAT q4_0',
        pesos: 3.12,
        cacheRef: 0.45,
        cacheMax: 1.76,
        cabeAte: 'עד 32K',
      },
      {
        capacidade: 8,
        hardware: 'RTX 5060 / 4060',
        modelo: 'Gemma 4 12B',
        quant: 'QAT q4_0',
        pesos: 6.5,
        cacheRef: 2.16,
        cacheMax: 16.16,
        cabeAte: 'עד 8K',
      },
      {
        capacidade: 16,
        hardware: 'RTX 5060 Ti / 4080',
        modelo: 'Gemma 4 12B',
        quant: 'Q8_0',
        pesos: 11.8,
        cacheRef: 2.16,
        cacheMax: 16.16,
        cabeAte: 'עד 32K',
      },
      {
        capacidade: 24,
        hardware: 'RTX 3090 / 4090',
        modelo: 'Qwen3.8-27B',
        quant: 'UD-Q4_K_M',
        pesos: 15.33,
        cacheRef: 2.14,
        cacheMax: 16.14,
        cabeAte: 'עד 128K',
      },
      {
        capacidade: 32,
        hardware: 'RTX 5090 / M6',
        modelo: 'Qwen3.8-27B',
        quant: 'UD-Q6_K',
        pesos: 20.47,
        cacheRef: 2.14,
        cacheMax: 16.14,
        cabeAte: 'עד 128K',
      },
      {
        capacidade: 48,
        hardware: 'M5 Pro (48 GB)',
        modelo: 'Qwen3.8-27B',
        quant: 'Q8_0',
        pesos: 27.05,
        cacheRef: 2.14,
        cacheMax: 16.14,
        cabeAte: 'עד 256K',
      },
      {
        capacidade: 64,
        hardware: '2x RTX 5090 / M5 Pro',
        modelo: 'Qwen3.8-27B',
        quant: 'BF16',
        pesos: 50.91,
        cacheRef: 2.14,
        cacheMax: 16.14,
        cabeAte: 'עד 128K',
      },
      {
        capacidade: 96,
        hardware: 'RTX PRO 6000 / M5 Ultra',
        modelo: 'Qwen3.8-Flash-Next',
        quant: 'UD-Q2_K_XL',
        pesos: 73.45,
        cacheRef: 0.86,
        cacheMax: 6.11,
        cabeAte: 'עד 256K',
      },
      {
        capacidade: 128,
        hardware: 'DGX Spark / M5 Max',
        modelo: 'Qwen3.8-Flash-Next',
        quant: 'UD-Q4_K_XL',
        pesos: 103.68,
        cacheRef: 0.86,
        cacheMax: 6.11,
        cabeAte: 'עד 256K',
      },
      {
        capacidade: 256,
        hardware: 'M5 Ultra / 2x DGX Spark',
        modelo: 'DeepSeek V4 Flash 0731',
        quant: 'UD-Q8_K_XL',
        pesos: 150.75,
        cacheRef: 2.69,
        cacheMax: 21.5,
        cabeAte: 'עד 256K',
      },
    ],
    legenda: {
      pesos: 'משקלי המודל',
      cache: 'cache ב-32K הקשר',
      estouro: 'מה שכבר לא נכנס בהקשר המרבי',
    },
  },
};
