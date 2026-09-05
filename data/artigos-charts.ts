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
  /**
   * `agentes-custo-por-tarefa-he` — acurácia × custo por tarefa (US$, log), pares do mesmo
   * benchmark. PROCEDÊNCIA: HAL (hal.cs.princeton.edu, HTML lido em 13/08/2026): Online
   * Mind2Web — SeeAct + GPT-5 Medium 42,33% a US$ 171,07 · Browser-Use + Claude Sonnet 4 40,00%
   * a US$ 1.577,26; ScienceAgentBench — SAB Self-Debug + o4-mini Low 27,45% a US$ 3,95 · +
   * GPT-5 Medium 30,39% a US$ 18,26. TheAgentCompany (leaderboard.json, 13/08/2026):
   * TTE-MatrixAgent + DeepSeek-V3.2 42,86% a US$ 0,40 · OpenHands + Gemini 2.5 Pro 30,29% a
   * US$ 4,23. Ouro = o par em que o barato ganha por mais. Séries são nomes próprios (não
   * traduzidas).
   */
  'agentes-custo-por-tarefa-he': {
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
   * `modelos-preco-por-nota` — nota no SWE-bench Verified × custo por tarefa (US$, log), TUDO
   * medido pelo MESMO avaliador (Vals AI, payload da tabela "Updated 8/19/2026", campos
   * `accuracy` e `cost_per_test`, lido em 26/08/2026). Um avaliador por figura: nunca misturar
   * self-report com nota de fora no mesmo gráfico. Linha só onde há trajetória real dentro de uma família
   * (DeepSeek Flash->Pro; GPT-5.6 Luna->Terra->Sol); o resto é ponto isolado. Ouro = a família em que o modelo mais barato é o melhor.
   * Pontos: DeepSeek V4 Flash 0731 (0,0099; 88,8) -> V4 Pro 0813 (0,103; 96,4) · GPT-5.6 Luna
   * (0,0427; 93,0) -> Terra (0,401; 95,4) -> Sol (1,151; 96,2) · Claude Opus 5 (1,291; 97,0) ->
   * Opus 4.8 (1,923; 88,6) · Fable 5 (2,047; 95,0) · Kimi K3 (0,760; 93,4) · GPT-5.5 (1,362; 82,6).
   */
  'modelos-preco-por-nota': {
    series: [
      {
        label: 'DeepSeek V4',
        color: '#a48f65',
        points: [
          [0.0099, 88.8],
          [0.103, 96.4],
        ],
      },
      {
        label: 'GPT-5.6 (3 níveis)',
        color: '#60a5fa',
        points: [
          [0.0427, 93.0],
          [0.401, 95.4],
          [1.151, 96.2],
        ],
      },
      { label: 'Claude Opus 5', color: '#fbbf24', points: [[1.291, 97.0]] },
      { label: 'Claude Opus 4.8', color: '#64748b', points: [[1.923, 88.6]] },
      { label: 'Claude Fable 5', color: '#d4d4d4', points: [[2.047, 95.0]] },
      { label: 'Kimi K3', color: '#a3a3a3', points: [[0.76, 93.4]] },
      { label: 'GPT-5.5', color: '#737373', points: [[1.362, 82.6]] },
    ],
    xDomain: [0.005, 5],
    yDomain: [70, 100],
    xTicks: [0.01, 0.03, 0.1, 0.3, 1, 3],
    yTicks: [70, 80, 90, 100],
  },
  /**
   * `modelos-preco-por-nota` — nota no SWE-bench Verified × custo por tarefa (US$, log), TUDO
   * medido pelo MESMO avaliador (Vals AI, payload da tabela "Updated 8/19/2026", campos
   * `accuracy` e `cost_per_test`, lido em 26/08/2026). Um avaliador por figura: nunca misturar
   * self-report com nota de fora no mesmo gráfico. Linha só onde há trajetória real dentro de uma família
   * (DeepSeek Flash->Pro; GPT-5.6 Luna->Terra->Sol); o resto é ponto isolado. Ouro = a família em que o modelo mais barato é o melhor.
   * Pontos: DeepSeek V4 Flash 0731 (0,0099; 88,8) -> V4 Pro 0813 (0,103; 96,4) · GPT-5.6 Luna
   * (0,0427; 93,0) -> Terra (0,401; 95,4) -> Sol (1,151; 96,2) · Claude Opus 5 (1,291; 97,0) ->
   * Opus 4.8 (1,923; 88,6) · Fable 5 (2,047; 95,0) · Kimi K3 (0,760; 93,4) · GPT-5.5 (1,362; 82,6).
   */
  'modelos-preco-por-nota-en': {
    series: [
      {
        label: 'DeepSeek V4',
        color: '#a48f65',
        points: [
          [0.0099, 88.8],
          [0.103, 96.4],
        ],
      },
      {
        label: 'GPT-5.6 (3 tiers)',
        color: '#60a5fa',
        points: [
          [0.0427, 93.0],
          [0.401, 95.4],
          [1.151, 96.2],
        ],
      },
      { label: 'Claude Opus 5', color: '#fbbf24', points: [[1.291, 97.0]] },
      { label: 'Claude Opus 4.8', color: '#64748b', points: [[1.923, 88.6]] },
      { label: 'Claude Fable 5', color: '#d4d4d4', points: [[2.047, 95.0]] },
      { label: 'Kimi K3', color: '#a3a3a3', points: [[0.76, 93.4]] },
      { label: 'GPT-5.5', color: '#737373', points: [[1.362, 82.6]] },
    ],
    xDomain: [0.005, 5],
    yDomain: [70, 100],
    xTicks: [0.01, 0.03, 0.1, 0.3, 1, 3],
    yTicks: [70, 80, 90, 100],
  },
  /**
   * `modelos-preco-por-nota` — nota no SWE-bench Verified × custo por tarefa (US$, log), TUDO
   * medido pelo MESMO avaliador (Vals AI, payload da tabela "Updated 8/19/2026", campos
   * `accuracy` e `cost_per_test`, lido em 26/08/2026). Um avaliador por figura: nunca misturar
   * self-report com nota de fora no mesmo gráfico. Linha só onde há trajetória real dentro de uma família
   * (DeepSeek Flash->Pro; GPT-5.6 Luna->Terra->Sol); o resto é ponto isolado. Ouro = a família em que o modelo mais barato é o melhor.
   * Pontos: DeepSeek V4 Flash 0731 (0,0099; 88,8) -> V4 Pro 0813 (0,103; 96,4) · GPT-5.6 Luna
   * (0,0427; 93,0) -> Terra (0,401; 95,4) -> Sol (1,151; 96,2) · Claude Opus 5 (1,291; 97,0) ->
   * Opus 4.8 (1,923; 88,6) · Fable 5 (2,047; 95,0) · Kimi K3 (0,760; 93,4) · GPT-5.5 (1,362; 82,6).
   */
  'modelos-preco-por-nota-es': {
    series: [
      {
        label: 'DeepSeek V4',
        color: '#a48f65',
        points: [
          [0.0099, 88.8],
          [0.103, 96.4],
        ],
      },
      {
        label: 'GPT-5.6 (3 niveles)',
        color: '#60a5fa',
        points: [
          [0.0427, 93.0],
          [0.401, 95.4],
          [1.151, 96.2],
        ],
      },
      { label: 'Claude Opus 5', color: '#fbbf24', points: [[1.291, 97.0]] },
      { label: 'Claude Opus 4.8', color: '#64748b', points: [[1.923, 88.6]] },
      { label: 'Claude Fable 5', color: '#d4d4d4', points: [[2.047, 95.0]] },
      { label: 'Kimi K3', color: '#a3a3a3', points: [[0.76, 93.4]] },
      { label: 'GPT-5.5', color: '#737373', points: [[1.362, 82.6]] },
    ],
    xDomain: [0.005, 5],
    yDomain: [70, 100],
    xTicks: [0.01, 0.03, 0.1, 0.3, 1, 3],
    yTicks: [70, 80, 90, 100],
  },
  /**
   * `modelos-preco-por-nota-it` — nota no SWE-bench Verified × custo por tarefa (US$, log), TUDO
   * medido pelo MESMO avaliador (Vals AI, payload da tabela "Updated 8/19/2026", campos
   * `accuracy` e `cost_per_test`, lido em 26/08/2026). Um avaliador por figura: nunca misturar
   * self-report com nota de fora no mesmo gráfico. Linha só onde há trajetória real dentro de uma família
   * (DeepSeek Flash->Pro; GPT-5.6 Luna->Terra->Sol); o resto é ponto isolado. Ouro = a família em que o modelo mais barato é o melhor.
   * Pontos: DeepSeek V4 Flash 0731 (0,0099; 88,8) -> V4 Pro 0813 (0,103; 96,4) · GPT-5.6 Luna
   * (0,0427; 93,0) -> Terra (0,401; 95,4) -> Sol (1,151; 96,2) · Claude Opus 5 (1,291; 97,0) ->
   * Opus 4.8 (1,923; 88,6) · Fable 5 (2,047; 95,0) · Kimi K3 (0,760; 93,4) · GPT-5.5 (1,362; 82,6).
   */
  'modelos-preco-por-nota-it': {
    series: [
      {
        label: 'DeepSeek V4',
        color: '#a48f65',
        points: [
          [0.0099, 88.8],
          [0.103, 96.4],
        ],
      },
      {
        label: 'GPT-5.6 (3 livelli)',
        color: '#60a5fa',
        points: [
          [0.0427, 93.0],
          [0.401, 95.4],
          [1.151, 96.2],
        ],
      },
      { label: 'Claude Opus 5', color: '#fbbf24', points: [[1.291, 97.0]] },
      { label: 'Claude Opus 4.8', color: '#64748b', points: [[1.923, 88.6]] },
      { label: 'Claude Fable 5', color: '#d4d4d4', points: [[2.047, 95.0]] },
      { label: 'Kimi K3', color: '#a3a3a3', points: [[0.76, 93.4]] },
      { label: 'GPT-5.5', color: '#737373', points: [[1.362, 82.6]] },
    ],
    xDomain: [0.005, 5],
    yDomain: [70, 100],
    xTicks: [0.01, 0.03, 0.1, 0.3, 1, 3],
    yTicks: [70, 80, 90, 100],
  },
  /**
   * `modelos-preco-por-nota` — nota no SWE-bench Verified × custo por tarefa (US$, log), TUDO
   * medido pelo MESMO avaliador (Vals AI, payload da tabela "Updated 8/19/2026", campos
   * `accuracy` e `cost_per_test`, lido em 26/08/2026). Um avaliador por figura: nunca misturar
   * self-report com nota de fora no mesmo gráfico. Linha só onde há trajetória real dentro de uma família
   * (DeepSeek Flash->Pro; GPT-5.6 Luna->Terra->Sol); o resto é ponto isolado. Ouro = a família em que o modelo mais barato é o melhor.
   * Pontos: DeepSeek V4 Flash 0731 (0,0099; 88,8) -> V4 Pro 0813 (0,103; 96,4) · GPT-5.6 Luna
   * (0,0427; 93,0) -> Terra (0,401; 95,4) -> Sol (1,151; 96,2) · Claude Opus 5 (1,291; 97,0) ->
   * Opus 4.8 (1,923; 88,6) · Fable 5 (2,047; 95,0) · Kimi K3 (0,760; 93,4) · GPT-5.5 (1,362; 82,6).
   */
  'modelos-preco-por-nota-he': {
    series: [
      {
        label: 'DeepSeek V4',
        color: '#a48f65',
        points: [
          [0.0099, 88.8],
          [0.103, 96.4],
        ],
      },
      {
        label: 'GPT-5.6 (3 רמות)',
        color: '#60a5fa',
        points: [
          [0.0427, 93.0],
          [0.401, 95.4],
          [1.151, 96.2],
        ],
      },
      { label: 'Claude Opus 5', color: '#fbbf24', points: [[1.291, 97.0]] },
      { label: 'Claude Opus 4.8', color: '#64748b', points: [[1.923, 88.6]] },
      { label: 'Claude Fable 5', color: '#d4d4d4', points: [[2.047, 95.0]] },
      { label: 'Kimi K3', color: '#a3a3a3', points: [[0.76, 93.4]] },
      { label: 'GPT-5.5', color: '#737373', points: [[1.362, 82.6]] },
    ],
    xDomain: [0.005, 5],
    yDomain: [70, 100],
    xTicks: [0.01, 0.03, 0.1, 0.3, 1, 3],
    yTicks: [70, 80, 90, 100],
  },
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
  'glm53flash-aa-pareto': {
    series: [
      {
        label: 'GLM-5.3-Flash',
        color: '#a48f65',
        points: [[0.09, 57]],
      },
      {
        label: 'Claude Fable 5',
        color: '#d4d4d8',
        points: [[3.14, 62]],
      },
      {
        label: 'GPT-5.6 Luna',
        color: '#60a5fa',
        points: [[0.05, 52]],
      },
      {
        label: 'Gemini 3.7 Flash',
        color: '#fbbf24',
        points: [[0.4, 56]],
      },
      {
        label: 'GLM-5.3',
        color: '#64748b',
        points: [[0.68, 60]],
      },
    ],
    xDomain: [0.03, 5],
    yDomain: [50, 65],
    xTicks: [0.03, 0.1, 0.3, 1, 3],
    yTicks: [50, 55, 60, 65],
  },

  /* ── en — rotulos sao nomes de modelo: copia fiel, chave por idioma ─── */
  'glm53flash-aa-pareto-en': {
    series: [
      {
        label: 'GLM-5.3-Flash',
        color: '#a48f65',
        points: [[0.09, 57]],
      },
      {
        label: 'Claude Fable 5',
        color: '#d4d4d8',
        points: [[3.14, 62]],
      },
      {
        label: 'GPT-5.6 Luna',
        color: '#60a5fa',
        points: [[0.05, 52]],
      },
      {
        label: 'Gemini 3.7 Flash',
        color: '#fbbf24',
        points: [[0.4, 56]],
      },
      {
        label: 'GLM-5.3',
        color: '#64748b',
        points: [[0.68, 60]],
      },
    ],
    xDomain: [0.03, 5],
    yDomain: [50, 65],
    xTicks: [0.03, 0.1, 0.3, 1, 3],
    yTicks: [50, 55, 60, 65],
  },


  /* ── es ─────────────────────────────────────────────────────────────── */
  'glm53flash-aa-pareto-es': {
    series: [
      {
        label: 'GLM-5.3-Flash',
        color: '#a48f65',
        points: [[0.09, 57]],
      },
      {
        label: 'Claude Fable 5',
        color: '#d4d4d8',
        points: [[3.14, 62]],
      },
      {
        label: 'GPT-5.6 Luna',
        color: '#60a5fa',
        points: [[0.05, 52]],
      },
      {
        label: 'Gemini 3.7 Flash',
        color: '#fbbf24',
        points: [[0.4, 56]],
      },
      {
        label: 'GLM-5.3',
        color: '#64748b',
        points: [[0.68, 60]],
      },
    ],
    xDomain: [0.03, 5],
    yDomain: [50, 65],
    xTicks: [0.03, 0.1, 0.3, 1, 3],
    yTicks: [50, 55, 60, 65],
  },


  /* ── it ─────────────────────────────────────────────────────────────── */
  'glm53flash-aa-pareto-it': {
    series: [
      {
        label: 'GLM-5.3-Flash',
        color: '#a48f65',
        points: [[0.09, 57]],
      },
      {
        label: 'Claude Fable 5',
        color: '#d4d4d8',
        points: [[3.14, 62]],
      },
      {
        label: 'GPT-5.6 Luna',
        color: '#60a5fa',
        points: [[0.05, 52]],
      },
      {
        label: 'Gemini 3.7 Flash',
        color: '#fbbf24',
        points: [[0.4, 56]],
      },
      {
        label: 'GLM-5.3',
        color: '#64748b',
        points: [[0.68, 60]],
      },
    ],
    xDomain: [0.03, 5],
    yDomain: [50, 65],
    xTicks: [0.03, 0.1, 0.3, 1, 3],
    yTicks: [50, 55, 60, 65],
  },


  /* ── he ─────────────────────────────────────────────────────────────── */
  'glm53flash-aa-pareto-he': {
    series: [
      {
        label: 'GLM-5.3-Flash',
        color: '#a48f65',
        points: [[0.09, 57]],
      },
      {
        label: 'Claude Fable 5',
        color: '#d4d4d8',
        points: [[3.14, 62]],
      },
      {
        label: 'GPT-5.6 Luna',
        color: '#60a5fa',
        points: [[0.05, 52]],
      },
      {
        label: 'Gemini 3.7 Flash',
        color: '#fbbf24',
        points: [[0.4, 56]],
      },
      {
        label: 'GLM-5.3',
        color: '#64748b',
        points: [[0.68, 60]],
      },
    ],
    xDomain: [0.03, 5],
    yDomain: [50, 65],
    xTicks: [0.03, 0.1, 0.3, 1, 3],
    yTicks: [50, 55, 60, 65],
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
  'deepfake-perdas-verificadas-he': {
    categories: [
      { label: 'בלי ערך מיוחס', sublabel: '2,107 · 93.0% מהמאגר', color: '#3f3f46', count: 2107 },
      { label: 'עם הפסד מאומת', sublabel: '‏1.3 מיליארד הדולר — 159 · 7.0%', color: '#a48f65', count: 159 },
    ],
  },

  /**
   * `deepfake-perdas-verificadas` — MEDIÇÃO PRÓPRIA: de onde vem o "US$ 1,3 bilhão".
   * PROCEDÊNCIA: o painel exibe `Direct losses $1.3B` com a legenda literal
   * `159 incidents with verified losses`, sobre um banco de 2.266 incidentes (tabela dinâmica
   * contada pelo autor em 28/08/2026). 2.266 - 159 = 2.107 sem valor atribuído = 93,0%.
   * O cinza do grupo recessivo fica abaixo de 3:1 por decisão editorial ("fora da conta"), com
   * o alívio exigido: legenda rotulada com contagem + os mesmos números no corpo do artigo.
   */
  'deepfake-perdas-verificadas': {
    categories: [
      { label: 'Sem valor atribuído', sublabel: '2.107 · 93,0% do banco', color: '#3f3f46', count: 2107 },
      { label: 'Com perda verificada', sublabel: '159 · 7,0% — os US$ 1,3 bi', color: '#a48f65', count: 159 },
    ],
  },
  'deepfake-perdas-verificadas-en': {
    categories: [
      { label: 'No value attributed', sublabel: '2,107 · 93.0% of the base', color: '#3f3f46', count: 2107 },
      { label: 'With verified loss', sublabel: '159 · 7.0% — the US$ 1.3B', color: '#a48f65', count: 159 },
    ],
  },
  'deepfake-perdas-verificadas-es': {
    categories: [
      { label: 'Sin valor atribuido', sublabel: '2.107 · 93,0% de la base', color: '#3f3f46', count: 2107 },
      { label: 'Con pérdida verificada', sublabel: '159 · 7,0% — los 1.300 M US$', color: '#a48f65', count: 159 },
    ],
  },
  'deepfake-perdas-verificadas-it': {
    categories: [
      { label: 'Senza valore attribuito', sublabel: '2.107 · 93,0% della banca dati', color: '#3f3f46', count: 2107 },
      { label: 'Con perdita verificata', sublabel: '159 · 7,0% — gli 1,3 mld US$', color: '#a48f65', count: 159 },
    ],
  },
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
  'deepfake-procedencia-sete-he': {
    max: 7,
    groups: [
      {
        label: 'מי הפיק את שבעת הנתונים המרכזיים',
        color: '#a48f65',
        items: [
          { name: 'ספק מהתעשייה', value: 7, valueLabel: '7 מתוך 7', emphasis: true },
          { name: 'גוף רשמי', value: 0, valueLabel: 'אפס' },
          { name: 'אקדמיה', value: 0, valueLabel: 'אפס' },
          { name: 'סקר ציבורי', value: 0, valueLabel: 'אפס' },
        ],
      },
    ],
  },

  'deepfake-deteccao-humana-he': {
    max: 70,
    groups: [
      {
        label: 'מה שהם אומרים על עצמם',
        color: '#fbbf24',
        items: [
          { name: 'חושבים שמזהים', value: 47, valueLabel: '47%' },
          { name: 'מצהירים על ביטחון', value: 41, valueLabel: '41%' },
          { name: 'חושבים שמסוגלים', value: 34, valueLabel: '34%' },
        ],
      },
      {
        label: 'מה שהם קולעים כשמודדים',
        color: '#60a5fa',
        items: [
          { name: 'מאומנים לזהות', value: 62.2, valueLabel: '62.2%' },
          { name: 'פנים (Stockner)', value: 56.1, valueLabel: '56.1%' },
          { name: 'כללי (Diel)', value: 55.5, valueLabel: '55.5%' },
          { name: 'מבחן אובייקטיבי (BR)', value: 17, valueLabel: '17%', emphasis: true },
        ],
      },
    ],
  },

  'deepfake-resemble-categorias-he': {
    max: 800,
    groups: [
      {
        label: 'כל 2,266 האירועים במאגר, לפי סוג מתקפה',
        color: '#60a5fa',
        items: [
          { name: 'מותג ומוניטין', value: 757, valueLabel: '33.4%' },
          { name: 'דיסאינפורמציה', value: 447, valueLabel: '19.7%' },
          { name: 'הונאת צרכנים', value: 382, valueLabel: '16.9%' },
          { name: 'תמונות אינטימיות', value: 256, valueLabel: '11.3%' },
          { name: 'התעללות בילדים', value: 239, valueLabel: '10.5%' },
          { name: 'הונאה תאגידית', value: 185, valueLabel: '8.2%', emphasis: true },
        ],
      },
    ],
  },

  /**
   * `agentes-nenhum-uso-funcao-he` — bloco 1: % "Not at all" (nenhum uso de agente) por função,
   * McKinsey 2025 republicado no AI Index 2026, Fig. 4.3.7 (N não declarado no capítulo).
   * Bloco 2: agentes em produção em DUAS populações diferentes — LangChain State of Agent
   * Engineering 2026 (n = 1.340, campo nov-dez/2025) e Stack Overflow Developer Survey 2025
   * (n = 33.662, "usam agentes diariamente"). NUNCA fundir num ranking: a tese do artigo é
   * que são perguntas diferentes a populações diferentes.
   */
  'agentes-nenhum-uso-funcao-he': {
    max: 100,
    groups: [
      {
        label: 'מצהירים על אין שימוש בסוכן (McKinsey, AI Index 2026)',
        color: '#64748b',
        items: [
          { name: 'ייצור', value: 91, valueLabel: '91%', emphasis: true },
          { name: 'שרשרת אספקה', value: 88, valueLabel: '88%' },
          { name: 'כספים תאגידיים', value: 85, valueLabel: '85%' },
          { name: 'משאבי אנוש', value: 82, valueLabel: '82%' },
          { name: 'הנדסת תוכנה', value: 77, valueLabel: '77%' },
          { name: 'IT', value: 69, valueLabel: '69%' },
          { name: 'ניהול ידע', value: 66, valueLabel: '66%' },
        ],
      },
      {
        label: 'מצהירים על סוכן בפרודקשן — שאלה אחרת, אוכלוסייה אחרת',
        color: '#60a5fa',
        items: [
          { name: 'LangChain', value: 57, valueLabel: '57% · n=1,340', emphasis: true },
          { name: 'Stack Overflow', value: 14.1, valueLabel: '14.1% · יומי' },
        ],
      },
    ],
  },

  /**
   * `agentes-metr-percepcao-he` — tempo relativo para concluir a tarefa com IA, sem IA = 100.
   * PROCEDÊNCIA: METR, 10/07/2025 — devs previram −24% de tempo; medido +19% (IC 95%: +2% a
   * +39%); estimaram depois −20%. Conversão 100 × (1 + variação) feita pelo autor.
   */
  'agentes-metr-percepcao-he': {
    max: 130,
    groups: [
      {
        label: 'זמן להשלמת המשימה עם AI (בלי AI = 100)',
        color: '#fbbf24',
        items: [
          { name: 'חזוי מראש', value: 76, valueLabel: '76 · −24%' },
          { name: 'נמדד (שעון)', value: 119, valueLabel: '119 · +19%', emphasis: true },
          { name: 'מוערך אחרי', value: 80, valueLabel: '80 · −20%' },
        ],
      },
    ],
  },

  /**
   * `agentes-mcp-sdk-mensal-he` — downloads mensais de @modelcontextprotocol/sdk no npm.
   * PROCEDÊNCIA: api.npmjs.org/downloads/range, medida pelo autor em 26/08/2026
   * (fontes/serie-npm-encanamento.json + sonda-npm-encanamento.py). jan/2025 = 176.533;
   * jul/2026 = 191.923.439 (×1.087). Download = instalação, não pessoa. Nomes em MM/YYYY
   * (numérico) por consistência — decisão do tradutor, ver dúvidas na entrega.
   */
  'agentes-mcp-sdk-mensal-he': {
    max: 200,
    groups: [
      {
        label: 'הורדות חודשיות של ה-SDK של MCP (מיליונים)',
        color: '#a48f65',
        items: [
          { name: '01/2025', value: 0.18, valueLabel: '0.18 מיליון', emphasis: true },
          { name: '02/2025', value: 0.35, valueLabel: '0.35 מיליון' },
          { name: '03/2025', value: 1.87, valueLabel: '1.9 מיליון' },
          { name: '04/2025', value: 4.21, valueLabel: '4.2 מיליון' },
          { name: '05/2025', value: 20.93, valueLabel: '20.9 מיליון' },
          { name: '06/2025', value: 16.84, valueLabel: '16.8 מיליון' },
          { name: '07/2025', value: 21.61, valueLabel: '21.6 מיליון' },
          { name: '08/2025', value: 24.66, valueLabel: '24.7 מיליון' },
          { name: '09/2025', value: 31.26, valueLabel: '31.3 מיליון' },
          { name: '10/2025', value: 31.81, valueLabel: '31.8 מיליון' },
          { name: '11/2025', value: 35.01, valueLabel: '35.0 מיליון' },
          { name: '12/2025', value: 38.52, valueLabel: '38.5 מיליון' },
          { name: '01/2026', value: 50.25, valueLabel: '50.2 מיליון' },
          { name: '02/2026', value: 71.66, valueLabel: '71.7 מיליון' },
          { name: '03/2026', value: 141.91, valueLabel: '141.9 מיליון' },
          { name: '04/2026', value: 140.09, valueLabel: '140.1 מיליון' },
          { name: '05/2026', value: 153.16, valueLabel: '153.2 מיליון' },
          { name: '06/2026', value: 165.18, valueLabel: '165.2 מיליון' },
          { name: '07/2026', value: 191.92, valueLabel: '191.9 מיליון', emphasis: true },
        ],
      },
    ],
  },

  /**
   * `agentes-brasil-cetic-he` — Cetic.br, TIC Empresas 2025 (CATI, n = 4.174, campo fev/2025 a
   * jan/2026, lançado 15/06/2026). Bloco 1: slide H9 (usaram algum tipo de IA, por porte).
   * Bloco 2: slide H9A (tipo de IA, entre as que usam) — cinco primeiras categorias.
   */
  'agentes-brasil-cetic-he': {
    max: 100,
    groups: [
      {
        label: 'השתמשו בסוג כלשהו של AI ב-2025, לפי גודל',
        color: '#60a5fa',
        items: [
          { name: 'סה״כ', value: 17, valueLabel: '17%', emphasis: true },
          { name: 'קטנות', value: 15, valueLabel: '15%' },
          { name: 'בינוניות', value: 32, valueLabel: '32%' },
          { name: 'גדולות', value: 50, valueLabel: '50%' },
        ],
      },
      {
        label: 'מה שנקרא AI, מבין המשתמשות',
        color: '#a48f65',
        items: [
          { name: 'אוטומציית תהליכים', value: 68, valueLabel: '68%', emphasis: true },
          { name: 'כריית טקסט', value: 38, valueLabel: '38%' },
          { name: 'תמונות', value: 31, valueLabel: '31%' },
          { name: 'יצירת שפה', value: 30, valueLabel: '30%' },
          { name: 'machine learning', value: 25, valueLabel: '25%' },
        ],
      },
    ],
  },
  /**
   * `openai-links-da-pagina` — bloco 1: a página alemã tem 76 afirmações numéricas, 14 links
   * externos e 7 fontes citadas só pelo nome (contagem em `fontes/auditoria-links-gradually.md`,
   * a partir do JSON de hrefs extraído no Chrome real). Bloco 2: os 14 links, um a um, em
   * 26/08/2026. Ouro = o único link que abre, é oficial e NÃO contém o número.
   */
  'openai-links-da-pagina': {
    max: 80,
    groups: [
      {
        label: 'A página alemã sobre a OpenAI (23/08/2026)',
        color: '#64748b',
        items: [
          { name: 'Afirmações numéricas', value: 76, valueLabel: '76' },
          { name: 'Links externos', value: 14, valueLabel: '14', emphasis: true },
          { name: 'Fontes só nomeadas', value: 7, valueLabel: '7' },
        ],
      },
      {
        label: 'Os 14 links, conferidos um a um',
        color: '#60a5fa',
        items: [
          { name: 'Abre e sustenta', value: 4, valueLabel: '4' },
          { name: 'Bloqueado, confirmado', value: 5, valueLabel: '5' },
          { name: 'Bloqueado; sem espelho', value: 3, valueLabel: '3' },
          { name: 'Só a home do site', value: 1, valueLabel: '1' },
          { name: 'Abre e NÃO sustenta', value: 1, valueLabel: '1', emphasis: true },
        ],
      },
    ],
  },

  /**
   * `openai-vinte-numeros` — os 20 números centrais da página, classificados pela régua das
   * quatro naturezas (apêndice do inventário, cada linha com o arquivo de evidência). O "92% da
   * Fortune 500" fica fora da lista por ser caso próprio (é oficial, mas de 08/01/2024 e de
   * outro assunto). Ouro = os órfãos.
   */
  'openai-vinte-numeros': {
    max: 20,
    groups: [
      {
        label: 'Da própria OpenAI, ou de registro público auditado',
        color: '#60a5fa',
        items: [{ name: 'Oficial', value: 8, valueLabel: '8 de 20', emphasis: true }],
      },
      {
        label: 'De fora da empresa',
        color: '#64748b',
        items: [
          { name: 'Reportagem/estimativa', value: 6, valueLabel: '6' },
          { name: 'Meta declarada', value: 3, valueLabel: '3' },
        ],
      },
      {
        label: 'Sem procedência localizável',
        color: '#a48f65',
        items: [{ name: 'Órfão', value: 3, valueLabel: '3', emphasis: true }],
      },
    ],
  },

  /**
   * `openai-receita-por-natureza` — receita em US$ bilhões anualizados, cada barra com a sua
   * natureza. Oficial: CFO Sarah Friar no blog da OpenAI (19-20/01/2026: "$2B ARR in 2023, $6B
   * in 2024, and $20B+ in 2025") e post de 31/03/2026 ("$2B in revenue per month" = 24 bi/ano).
   * Estimativa: Sacra, dashboard vivo lido em 26/08/2026 ("$40B in annualized revenue in July
   * 2026"). Metas: documentos internos via The Information (2026: 30 bi), Altman no podcast BG2
   * (2027: "How about '27?" para 100 bi), documentos internos via Bloomberg (20/02/2026: 2030 =
   * 280 bi). NUNCA somar nem traçar linha entre blocos.
   */
  'openai-receita-por-natureza': {
    max: 280,
    groups: [
      {
        label: 'Oficial: a OpenAI publicou (US$ bilhões anualizados)',
        color: '#60a5fa',
        items: [
          { name: '2023', value: 2, valueLabel: '2' },
          { name: '2024', value: 6, valueLabel: '6' },
          { name: '2025', value: 20, valueLabel: '20+' },
          { name: 'mar/2026 (2 bi/mês)', value: 24, valueLabel: '24', emphasis: true },
        ],
      },
      {
        label: 'Estimativa de fora (Sacra, painel vivo, lido em 26/08/2026)',
        color: '#64748b',
        items: [{ name: 'jul/2026', value: 40, valueLabel: '40' }],
      },
      {
        label: 'Meta: alguém disse que pretende',
        color: '#fbbf24',
        items: [
          { name: 'Meta 2026', value: 30, valueLabel: '30' },
          { name: 'Meta 2027 (podcast)', value: 100, valueLabel: '100' },
          { name: 'Meta 2030', value: 280, valueLabel: '280' },
        ],
      },
    ],
  },

  /**
   * `openai-investidores-equity-compute` — bloco 1: investimento em participação (equity),
   * ACUMULADO por investidor, US$ bi: SoftBank 64,6 (comunicado oficial da SoftBank,
   * 27/02/2026: "cumulative investment [...] USD 64.6 billion, approximately 13%"; inclui as
   * três parcelas de 2026); Amazon 50 (rodada de 2026, finalizada em 31/07/2026 segundo a
   * GeekWire); Nvidia 30 (rodada de 2026); Microsoft 13 (2019 + 2021 + 2023, soma de agregador,
   * categoria B). Bloco 2: compromissos de COMPUTAÇÃO, que não são investimento — Stargate 500
   * (anúncio de 21/01/2025), Amazon AWS +100 em 8 anos (contrato), Nvidia até 100 (carta de
   * intenção de set/2025, "not definitive" pela CFO da Nvidia em dez/2025). Ouro = o número que
   * a página alemã dá como ">71 bi".
   */
  'openai-investidores-equity-compute': {
    max: 500,
    groups: [
      {
        label: 'Investimento em participação, acumulado por investidor (US$ bilhões)',
        color: '#60a5fa',
        items: [
          { name: 'SoftBank (até out/26)', value: 64.6, valueLabel: '64,6', emphasis: true },
          { name: 'Amazon (2026)', value: 50, valueLabel: '50' },
          { name: 'Nvidia (2026)', value: 30, valueLabel: '30' },
          { name: 'Microsoft (2019-23)', value: 13, valueLabel: '13' },
        ],
      },
      {
        label: 'Compromissos de computação — não são investimento',
        color: '#64748b',
        items: [
          { name: 'Stargate (jan/2025)', value: 500, valueLabel: '500' },
          { name: 'Amazon, AWS (+8 anos)', value: 100, valueLabel: '100' },
          { name: 'Nvidia (intenção)', value: 100, valueLabel: 'até 100' },
        ],
      },
    ],
  },

  /**
   * `openai-form990-remuneracao` — Form 990 da "Openai Inc" (EIN 81-0861541), Parte VII, colunas
   * (E) compensação de organizações relacionadas + (F) outra compensação, US$; coluna (D), paga
   * pela própria nonprofit, é 0 em todas as linhas de Altman. FY2023 (ObjectId 202413189349309791):
   * Altman 64.957 + 11.044 = 76.001. FY2024 (ObjectId 202513219349328476): Altman 65.638 + 48.036 =
   * 113.674 — 10º de 12 nomes da Parte VII. Acima dele: Greg Brockman (Dir/Pres, Former) 240.176 +
   * 24.013 = 264.189; Chris Clark 12.933 + 166.484 + 36.604 = 216.021; Lawrence Summers 143.702;
   * Adam D'Angelo, Susan Desmond-Hellmann e Bret Taylor 140.000; Nicole Seligman e Fidji Simo
   * 127.500; Ilya Sutskever (Former) 119.538. Abaixo: Paul Nakasone 99.030, Zico Kolter 53.494.
   * Tabela inteira extraída do full-text da ProPublica (regex sobre as 12 linhas) em 26/08/2026.
   */
  'openai-form990-remuneracao': {
    max: 270000,
    groups: [
      {
        label: 'Sam Altman — o número que circula e o ano seguinte (US$)',
        color: '#a48f65',
        items: [
          { name: 'FY2023 (circula)', value: 76001, valueLabel: '76.001' },
          { name: 'FY2024', value: 113674, valueLabel: '113.674', emphasis: true },
        ],
      },
      {
        label: 'Os mais remunerados no mesmo Form 990 de FY2024 (US$)',
        color: '#64748b',
        items: [
          { name: 'Greg Brockman (ex)', value: 264189, valueLabel: '264.189' },
          { name: 'Chris Clark (tesour.)', value: 216021, valueLabel: '216.021' },
          { name: 'Lawrence Summers', value: 143702, valueLabel: '143.702' },
          { name: 'Bret Taylor (conselho)', value: 140000, valueLabel: '140.000' },
        ],
      },
    ],
  },

  /**
   * `openai-brasil-precos-reais` — ChatGPT no Brasil, compra dentro do app (Apple App Store
   * Brasil, apps.apple.com/br/app/chatgpt/id6448311069, lido ao vivo em 26/08/2026): Go R$ 39,90,
   * Plus R$ 99,90, Pro 5x R$ 524,90, Pro 20x R$ 999,90. O site (chatgpt.com/pricing) devolveu 403
   * a esta máquina; o Go no site é R$ 39,99 (comunicado Nubank + OpenAI, 28/10/2025). Ouro = o
   * plano que só existe em alguns países.
   */
  'openai-brasil-precos-reais': {
    max: 1100,
    groups: [
      {
        label: 'ChatGPT no Brasil — App Store, 26/08/2026 (R$ por mês)',
        color: '#60a5fa',
        items: [
          { name: 'Go', value: 39.9, valueLabel: 'R$ 39,90', emphasis: true },
          { name: 'Plus', value: 99.9, valueLabel: 'R$ 99,90' },
          { name: 'Pro (5x)', value: 524.9, valueLabel: 'R$ 524,90' },
          { name: 'Pro (20x)', value: 999.9, valueLabel: 'R$ 999,90' },
        ],
      },
    ],
  },
  /**
   * `openai-links-da-pagina` — bloco 1: a página alemã tem 76 afirmações numéricas, 14 links
   * externos e 7 fontes citadas só pelo nome (contagem em `fontes/auditoria-links-gradually.md`,
   * a partir do JSON de hrefs extraído no Chrome real). Bloco 2: os 14 links, um a um, em
   * 26/08/2026. Ouro = o único link que abre, é oficial e NÃO contém o número.
   */
  'openai-links-da-pagina-en': {
    max: 80,
    groups: [
      {
        label: 'The German page about OpenAI (08/23/2026)',
        color: '#64748b',
        items: [
          { name: 'Numerical claims', value: 76, valueLabel: '76' },
          { name: 'External links', value: 14, valueLabel: '14', emphasis: true },
          { name: 'Named-only sources', value: 7, valueLabel: '7' },
        ],
      },
      {
        label: 'The 14 links, checked one by one',
        color: '#60a5fa',
        items: [
          { name: 'Opens, supports it', value: 4, valueLabel: '4' },
          { name: 'Blocked, confirmed', value: 5, valueLabel: '5' },
          { name: 'Blocked, no mirror', value: 3, valueLabel: '3' },
          { name: 'Homepage only', value: 1, valueLabel: '1' },
          { name: 'Opens, no support', value: 1, valueLabel: '1', emphasis: true },
        ],
      },
    ],
  },

  /**
   * `openai-vinte-numeros` — os 20 números centrais da página, classificados pela régua das
   * quatro naturezas (apêndice do inventário, cada linha com o arquivo de evidência). O "92% da
   * Fortune 500" fica fora da lista por ser caso próprio (é oficial, mas de 08/01/2024 e de
   * outro assunto). Ouro = os órfãos.
   */
  'openai-vinte-numeros-en': {
    max: 20,
    groups: [
      {
        label: 'From OpenAI itself, or audited public record',
        color: '#60a5fa',
        items: [{ name: 'Official', value: 8, valueLabel: '8 of 20', emphasis: true }],
      },
      {
        label: 'From outside the company',
        color: '#64748b',
        items: [
          { name: 'Reporting/estimate', value: 6, valueLabel: '6' },
          { name: 'Stated target', value: 3, valueLabel: '3' },
        ],
      },
      {
        label: 'With no traceable provenance',
        color: '#a48f65',
        items: [{ name: 'Orphan', value: 3, valueLabel: '3', emphasis: true }],
      },
    ],
  },

  /**
   * `openai-receita-por-natureza` — receita em US$ bilhões anualizados, cada barra com a sua
   * natureza. Oficial: CFO Sarah Friar no blog da OpenAI (19-20/01/2026: "$2B ARR in 2023, $6B
   * in 2024, and $20B+ in 2025") e post de 31/03/2026 ("$2B in revenue per month" = 24 bi/ano).
   * Estimativa: Sacra, dashboard vivo lido em 26/08/2026 ("$40B in annualized revenue in July
   * 2026"). Metas: documentos internos via The Information (2026: 30 bi), Altman no podcast BG2
   * (2027: "How about '27?" para 100 bi), documentos internos via Bloomberg (20/02/2026: 2030 =
   * 280 bi). NUNCA somar nem traçar linha entre blocos.
   */
  'openai-receita-por-natureza-en': {
    max: 280,
    groups: [
      {
        label: 'Official: published by OpenAI (US$ billions, annualized)',
        color: '#60a5fa',
        items: [
          { name: '2023', value: 2, valueLabel: '2' },
          { name: '2024', value: 6, valueLabel: '6' },
          { name: '2025', value: 20, valueLabel: '20+' },
          { name: 'Mar 2026 ($2bn/mo)', value: 24, valueLabel: '24', emphasis: true },
        ],
      },
      {
        label: 'Outside estimate (Sacra, live dashboard, read 08/26/2026)',
        color: '#64748b',
        items: [{ name: 'Jul 2026', value: 40, valueLabel: '40' }],
      },
      {
        label: 'Target: someone said they intend to',
        color: '#fbbf24',
        items: [
          { name: '2026 target', value: 30, valueLabel: '30' },
          { name: '2027 target (podcast)', value: 100, valueLabel: '100' },
          { name: '2030 target', value: 280, valueLabel: '280' },
        ],
      },
    ],
  },

  /**
   * `openai-investidores-equity-compute` — bloco 1: investimento em participação (equity),
   * ACUMULADO por investidor, US$ bi: SoftBank 64,6 (comunicado oficial da SoftBank,
   * 27/02/2026: "cumulative investment [...] USD 64.6 billion, approximately 13%"; inclui as
   * três parcelas de 2026); Amazon 50 (rodada de 2026, finalizada em 31/07/2026 segundo a
   * GeekWire); Nvidia 30 (rodada de 2026); Microsoft 13 (2019 + 2021 + 2023, soma de agregador,
   * categoria B). Bloco 2: compromissos de COMPUTAÇÃO, que não são investimento — Stargate 500
   * (anúncio de 21/01/2025), Amazon AWS +100 em 8 anos (contrato), Nvidia até 100 (carta de
   * intenção de set/2025, "not definitive" pela CFO da Nvidia em dez/2025). Ouro = o número que
   * a página alemã dá como ">71 bi".
   */
  'openai-investidores-equity-compute-en': {
    max: 500,
    groups: [
      {
        label: 'Equity investment, cumulative by investor (US$ billions)',
        color: '#60a5fa',
        items: [
          { name: 'SoftBank (thru Oct 26)', value: 64.6, valueLabel: '64.6', emphasis: true },
          { name: 'Amazon (2026)', value: 50, valueLabel: '50' },
          { name: 'Nvidia (2026)', value: 30, valueLabel: '30' },
          { name: 'Microsoft (2019-23)', value: 13, valueLabel: '13' },
        ],
      },
      {
        label: 'Compute commitments — not investment',
        color: '#64748b',
        items: [
          { name: 'Stargate (Jan 2025)', value: 500, valueLabel: '500' },
          { name: 'Amazon, AWS (+8 yrs)', value: 100, valueLabel: '100' },
          { name: 'Nvidia (intent)', value: 100, valueLabel: 'up to 100' },
        ],
      },
    ],
  },

  /**
   * `openai-form990-remuneracao` — Form 990 da "Openai Inc" (EIN 81-0861541), Parte VII, colunas
   * (E) compensação de organizações relacionadas + (F) outra compensação, US$; coluna (D), paga
   * pela própria nonprofit, é 0 em todas as linhas de Altman. FY2023 (ObjectId 202413189349309791):
   * Altman 64.957 + 11.044 = 76.001. FY2024 (ObjectId 202513219349328476): Altman 65.638 + 48.036 =
   * 113.674 — 10º de 12 nomes da Parte VII. Acima dele: Greg Brockman (Dir/Pres, Former) 240.176 +
   * 24.013 = 264.189; Chris Clark 12.933 + 166.484 + 36.604 = 216.021; Lawrence Summers 143.702;
   * Adam D'Angelo, Susan Desmond-Hellmann e Bret Taylor 140.000; Nicole Seligman e Fidji Simo
   * 127.500; Ilya Sutskever (Former) 119.538. Abaixo: Paul Nakasone 99.030, Zico Kolter 53.494.
   * Tabela inteira extraída do full-text da ProPublica (regex sobre as 12 linhas) em 26/08/2026.
   */
  'openai-form990-remuneracao-en': {
    max: 270000,
    groups: [
      {
        label: 'Sam Altman — the number that circulates and the next year (US$)',
        color: '#a48f65',
        items: [
          { name: 'FY2023 (circulates)', value: 76001, valueLabel: '76,001' },
          { name: 'FY2024', value: 113674, valueLabel: '113,674', emphasis: true },
        ],
      },
      {
        label: 'The highest-paid in the same FY2024 Form 990 (US$)',
        color: '#64748b',
        items: [
          { name: 'Greg Brockman (former)', value: 264189, valueLabel: '264,189' },
          { name: 'Chris Clark (treas.)', value: 216021, valueLabel: '216,021' },
          { name: 'Lawrence Summers', value: 143702, valueLabel: '143,702' },
          { name: 'Bret Taylor (board)', value: 140000, valueLabel: '140,000' },
        ],
      },
    ],
  },

  /**
   * `openai-brasil-precos-reais` — ChatGPT no Brasil, compra dentro do app (Apple App Store
   * Brasil, apps.apple.com/br/app/chatgpt/id6448311069, lido ao vivo em 26/08/2026): Go R$ 39,90,
   * Plus R$ 99,90, Pro 5x R$ 524,90, Pro 20x R$ 999,90. O site (chatgpt.com/pricing) devolveu 403
   * a esta máquina; o Go no site é R$ 39,99 (comunicado Nubank + OpenAI, 28/10/2025). Ouro = o
   * plano que só existe em alguns países.
   */
  'openai-brasil-precos-reais-en': {
    max: 1100,
    groups: [
      {
        label: 'ChatGPT in Brazil — App Store, 08/26/2026 (R$/month)',
        color: '#60a5fa',
        items: [
          { name: 'Go', value: 39.9, valueLabel: 'R$ 39.90', emphasis: true },
          { name: 'Plus', value: 99.9, valueLabel: 'R$ 99.90' },
          { name: 'Pro (5x)', value: 524.9, valueLabel: 'R$ 524.90' },
          { name: 'Pro (20x)', value: 999.9, valueLabel: 'R$ 999.90' },
        ],
      },
    ],
  },
  /**
   * `openai-links-da-pagina-es` — bloco 1: a página alemã tem 76 afirmações numéricas, 14 links
   * externos e 7 fontes citadas só pelo nome (contagem em `fontes/auditoria-links-gradually.md`,
   * a partir do JSON de hrefs extraído no Chrome real). Bloco 2: os 14 links, um a um, em
   * 26/08/2026. Ouro = o único link que abre, é oficial e NÃO contém o número.
   */
  'openai-links-da-pagina-es': {
    max: 80,
    groups: [
      {
        label: 'La página alemana sobre OpenAI (23/08/2026)',
        color: '#64748b',
        items: [
          { name: 'Afirmaciones', value: 76, valueLabel: '76' },
          { name: 'Enlaces externos', value: 14, valueLabel: '14', emphasis: true },
          { name: 'Fuentes sin enlace', value: 7, valueLabel: '7' },
        ],
      },
      {
        label: 'Los 14 enlaces, uno a uno',
        color: '#60a5fa',
        items: [
          { name: 'Abre y confirma', value: 4, valueLabel: '4' },
          { name: 'Bloqueado, confirmado', value: 5, valueLabel: '5' },
          { name: 'Bloqueado, sin espejo', value: 3, valueLabel: '3' },
          { name: 'Solo la portada', value: 1, valueLabel: '1' },
          { name: 'Abre y NO confirma', value: 1, valueLabel: '1', emphasis: true },
        ],
      },
    ],
  },

  /**
   * `openai-vinte-numeros-es` — os 20 números centrais da página, classificados pela régua das
   * quatro naturezas (apêndice do inventário, cada linha com o arquivo de evidência). O "92% da
   * Fortune 500" fica fora da lista por ser caso próprio (é oficial, mas de 08/01/2024 e de
   * outro assunto). Ouro = os órfãos.
   */
  'openai-vinte-numeros-es': {
    max: 20,
    groups: [
      {
        label: 'De la propia OpenAI, o de registro público auditado',
        color: '#60a5fa',
        items: [{ name: 'Oficial', value: 8, valueLabel: '8 de 20', emphasis: true }],
      },
      {
        label: 'De fuera de la empresa',
        color: '#64748b',
        items: [
          { name: 'Reportaje/estimación', value: 6, valueLabel: '6' },
          { name: 'Meta declarada', value: 3, valueLabel: '3' },
        ],
      },
      {
        label: 'Sin procedencia localizable',
        color: '#a48f65',
        items: [{ name: 'Huérfano', value: 3, valueLabel: '3', emphasis: true }],
      },
    ],
  },

  /**
   * `openai-receita-por-natureza-es` — receita em US$ bilhões anualizados, cada barra com a sua
   * natureza. Oficial: CFO Sarah Friar no blog da OpenAI (19-20/01/2026: "$2B ARR in 2023, $6B
   * in 2024, and $20B+ in 2025") e post de 31/03/2026 ("$2B in revenue per month" = 24 bi/ano).
   * Estimativa: Sacra, dashboard vivo lido em 26/08/2026 ("$40B in annualized revenue in July
   * 2026"). Metas: documentos internos via The Information (2026: 30 bi), Altman no podcast BG2
   * (2027: "How about '27?" para 100 bi), documentos internos via Bloomberg (20/02/2026: 2030 =
   * 280 bi). NUNCA somar nem traçar linha entre blocos.
   */
  'openai-receita-por-natureza-es': {
    max: 280,
    groups: [
      {
        label: 'Oficial: lo que publicó OpenAI (US$ miles de millones anualizados)',
        color: '#60a5fa',
        items: [
          { name: '2023', value: 2, valueLabel: '2' },
          { name: '2024', value: 6, valueLabel: '6' },
          { name: '2025', value: 20, valueLabel: '20+' },
          { name: 'mar/26 (2 mil M/mes)', value: 24, valueLabel: '24', emphasis: true },
        ],
      },
      {
        label: 'Estimación externa (Sacra, panel en vivo, leído el 26/08/2026)',
        color: '#64748b',
        items: [{ name: 'jul/2026', value: 40, valueLabel: '40' }],
      },
      {
        label: 'Meta: alguien dijo que pretende',
        color: '#fbbf24',
        items: [
          { name: 'Meta 2026', value: 30, valueLabel: '30' },
          { name: 'Meta 2027 (podcast)', value: 100, valueLabel: '100' },
          { name: 'Meta 2030', value: 280, valueLabel: '280' },
        ],
      },
    ],
  },

  /**
   * `openai-investidores-equity-compute-es` — bloco 1: investimento em participação (equity),
   * ACUMULADO por investidor, US$ bi: SoftBank 64,6 (comunicado oficial da SoftBank,
   * 27/02/2026: "cumulative investment [...] USD 64.6 billion, approximately 13%"; inclui as
   * três parcelas de 2026); Amazon 50 (rodada de 2026, finalizada em 31/07/2026 segundo a
   * GeekWire); Nvidia 30 (rodada de 2026); Microsoft 13 (2019 + 2021 + 2023, soma de agregador,
   * categoria B). Bloco 2: compromissos de COMPUTAÇÃO, que não são investimento — Stargate 500
   * (anúncio de 21/01/2025), Amazon AWS +100 em 8 anos (contrato), Nvidia até 100 (carta de
   * intenção de set/2025, "not definitive" pela CFO da Nvidia em dez/2025). Ouro = o número que
   * a página alemã dá como ">71 bi".
   */
  'openai-investidores-equity-compute-es': {
    max: 500,
    groups: [
      {
        label: 'Inversión en participación, acumulada por inversor (US$ miles de millones)',
        color: '#60a5fa',
        items: [
          { name: 'SoftBank (a oct/26)', value: 64.6, valueLabel: '64,6', emphasis: true },
          { name: 'Amazon (2026)', value: 50, valueLabel: '50' },
          { name: 'Nvidia (2026)', value: 30, valueLabel: '30' },
          { name: 'Microsoft (2019-23)', value: 13, valueLabel: '13' },
        ],
      },
      {
        label: 'Compromisos de computación — no son inversión',
        color: '#64748b',
        items: [
          { name: 'Stargate (ene/2025)', value: 500, valueLabel: '500' },
          { name: 'Amazon, AWS (+8 años)', value: 100, valueLabel: '100' },
          { name: 'Nvidia (intención)', value: 100, valueLabel: 'hasta 100' },
        ],
      },
    ],
  },

  /**
   * `openai-form990-remuneracao-es` — Form 990 da "Openai Inc" (EIN 81-0861541), Parte VII,
   * colunas (E) compensação de organizações relacionadas + (F) outra compensação, US$; coluna
   * (D), paga pela própria nonprofit, é 0 em todas as linhas de Altman. FY2023 (ObjectId
   * 202413189349309791): Altman 64.957 + 11.044 = 76.001. FY2024 (ObjectId 202513219349328476):
   * Altman 65.638 + 48.036 = 113.674 — 10º de 12 nomes da Parte VII. Acima dele: Greg Brockman
   * (Dir/Pres, Former) 240.176 + 24.013 = 264.189; Chris Clark 12.933 + 166.484 + 36.604 =
   * 216.021; Lawrence Summers 143.702; Adam D'Angelo, Susan Desmond-Hellmann e Bret Taylor
   * 140.000; Nicole Seligman e Fidji Simo 127.500; Ilya Sutskever (Former) 119.538. Abaixo: Paul
   * Nakasone 99.030, Zico Kolter 53.494. Tabela inteira extraída do full-text da ProPublica
   * (regex sobre as 12 linhas) em 26/08/2026.
   */
  'openai-form990-remuneracao-es': {
    max: 270000,
    groups: [
      {
        label: 'Sam Altman — el número que circula y el año siguiente (US$)',
        color: '#a48f65',
        items: [
          { name: 'FY2023 (circula)', value: 76001, valueLabel: '76.001' },
          { name: 'FY2024', value: 113674, valueLabel: '113.674', emphasis: true },
        ],
      },
      {
        label: 'Los más remunerados en el mismo Form 990 de FY2024 (US$)',
        color: '#64748b',
        items: [
          { name: 'Greg Brockman (ex)', value: 264189, valueLabel: '264.189' },
          { name: 'Chris Clark (tesor.)', value: 216021, valueLabel: '216.021' },
          { name: 'Lawrence Summers', value: 143702, valueLabel: '143.702' },
          { name: 'Bret Taylor (consejo)', value: 140000, valueLabel: '140.000' },
        ],
      },
    ],
  },

  /**
   * `openai-brasil-precos-reais-es` — ChatGPT no Brasil, compra dentro do app (Apple App Store
   * Brasil, apps.apple.com/br/app/chatgpt/id6448311069, lido ao vivo em 26/08/2026): Go R$ 39,90,
   * Plus R$ 99,90, Pro 5x R$ 524,90, Pro 20x R$ 999,90. O site (chatgpt.com/pricing) devolveu 403
   * a esta máquina; o Go no site é R$ 39,99 (comunicado Nubank + OpenAI, 28/10/2025). Ouro = o
   * plano que só existe em alguns países.
   */
  'openai-brasil-precos-reais-es': {
    max: 1100,
    groups: [
      {
        label: 'ChatGPT en Brasil — App Store, 26/08/2026 (R$ por mes)',
        color: '#60a5fa',
        items: [
          { name: 'Go', value: 39.9, valueLabel: 'R$ 39,90', emphasis: true },
          { name: 'Plus', value: 99.9, valueLabel: 'R$ 99,90' },
          { name: 'Pro (5x)', value: 524.9, valueLabel: 'R$ 524,90' },
          { name: 'Pro (20x)', value: 999.9, valueLabel: 'R$ 999,90' },
        ],
      },
    ],
  },
  /**
   * `openai-links-da-pagina-it` — bloco 1: a página alemã tem 76 afirmações numéricas, 14 links
   * externos e 7 fontes citadas só pelo nome (contagem em `fontes/auditoria-links-gradually.md`,
   * a partir do JSON de hrefs extraído no Chrome real). Bloco 2: os 14 links, um a um, em
   * 26/08/2026. Ouro = o único link que abre, é oficial e NÃO contém o número.
   */
  'openai-links-da-pagina-it': {
    max: 80,
    groups: [
      {
        label: 'La pagina tedesca sull\'OpenAI (23/08/2026)',
        color: '#64748b',
        items: [
          { name: 'Affermazioni numeriche', value: 76, valueLabel: '76' },
          { name: 'Link esterni', value: 14, valueLabel: '14', emphasis: true },
          { name: 'Fonti solo nominate', value: 7, valueLabel: '7' },
        ],
      },
      {
        label: 'I 14 link, verificati uno a uno',
        color: '#60a5fa',
        items: [
          { name: 'Apre e conferma', value: 4, valueLabel: '4' },
          { name: 'Bloccato, confermato', value: 5, valueLabel: '5' },
          { name: 'Bloccato, no specchio', value: 3, valueLabel: '3' },
          { name: 'Solo la home del sito', value: 1, valueLabel: '1' },
          { name: 'Apre e NON conferma', value: 1, valueLabel: '1', emphasis: true },
        ],
      },
    ],
  },

  /**
   * `openai-vinte-numeros-it` — os 20 números centrais da página, classificados pela régua das
   * quatro naturezas (apêndice do inventário, cada linha com o arquivo de evidência). O "92% da
   * Fortune 500" fica fora da lista por ser caso próprio (é oficial, mas de 08/01/2024 e de
   * outro assunto). Ouro = os órfãos.
   */
  'openai-vinte-numeros-it': {
    max: 20,
    groups: [
      {
        label: 'Della stessa OpenAI, o di registro pubblico verificato',
        color: '#60a5fa',
        items: [{ name: 'Ufficiale', value: 8, valueLabel: '8 di 20', emphasis: true }],
      },
      {
        label: 'Dall\'esterno dell\'azienda',
        color: '#64748b',
        items: [
          { name: 'Reportage/stima', value: 6, valueLabel: '6' },
          { name: 'Obiettivo dichiarato', value: 3, valueLabel: '3' },
        ],
      },
      {
        label: 'Senza provenienza individuabile',
        color: '#a48f65',
        items: [{ name: 'Orfano', value: 3, valueLabel: '3', emphasis: true }],
      },
    ],
  },

  /**
   * `openai-receita-por-natureza-it` — receita em US$ bilhões anualizados, cada barra com a sua
   * natureza. Oficial: CFO Sarah Friar no blog da OpenAI (19-20/01/2026: "$2B ARR in 2023, $6B
   * in 2024, and $20B+ in 2025") e post de 31/03/2026 ("$2B in revenue per month" = 24 bi/ano).
   * Estimativa: Sacra, dashboard vivo lido em 26/08/2026 ("$40B in annualized revenue in July
   * 2026"). Metas: documentos internos via The Information (2026: 30 bi), Altman no podcast BG2
   * (2027: "How about '27?" para 100 bi), documentos internos via Bloomberg (20/02/2026: 2030 =
   * 280 bi). NUNCA somar nem traçar linha entre blocos.
   */
  'openai-receita-por-natureza-it': {
    max: 280,
    groups: [
      {
        label: 'Ufficiale: pubblicato da OpenAI (mld annualizzati)',
        color: '#60a5fa',
        items: [
          { name: '2023', value: 2, valueLabel: '2' },
          { name: '2024', value: 6, valueLabel: '6' },
          { name: '2025', value: 20, valueLabel: '20+' },
          { name: 'mar/26 (2 mld/mese)', value: 24, valueLabel: '24', emphasis: true },
        ],
      },
      {
        label: 'Stima esterna (Sacra, pannello vivo, letto 26/08/2026)',
        color: '#64748b',
        items: [{ name: 'lug/2026', value: 40, valueLabel: '40' }],
      },
      {
        label: 'Obiettivo: intenzione dichiarata',
        color: '#fbbf24',
        items: [
          { name: 'Obiettivo 2026', value: 30, valueLabel: '30' },
          { name: 'Meta 2027 (podcast)', value: 100, valueLabel: '100' },
          { name: 'Obiettivo 2030', value: 280, valueLabel: '280' },
        ],
      },
    ],
  },

  /**
   * `openai-investidores-equity-compute-it` — bloco 1: investimento em participação (equity),
   * ACUMULADO por investidor, US$ bi: SoftBank 64,6 (comunicado oficial da SoftBank,
   * 27/02/2026: "cumulative investment [...] USD 64.6 billion, approximately 13%"; inclui as
   * três parcelas de 2026); Amazon 50 (rodada de 2026, finalizada em 31/07/2026 segundo a
   * GeekWire); Nvidia 30 (rodada de 2026); Microsoft 13 (2019 + 2021 + 2023, soma de agregador,
   * categoria B). Bloco 2: compromissos de COMPUTAÇÃO, que não são investimento — Stargate 500
   * (anúncio de 21/01/2025), Amazon AWS +100 em 8 anos (contrato), Nvidia até 100 (carta de
   * intenção de set/2025, "not definitive" pela CFO da Nvidia em dez/2025). Ouro = o número que
   * a página alemã dá como ">71 bi".
   */
  'openai-investidores-equity-compute-it': {
    max: 500,
    groups: [
      {
        label: 'Partecipazione accumulata per investitore (miliardi di dollari)',
        color: '#60a5fa',
        items: [
          { name: 'SoftBank (a ott/26)', value: 64.6, valueLabel: '64,6', emphasis: true },
          { name: 'Amazon (2026)', value: 50, valueLabel: '50' },
          { name: 'Nvidia (2026)', value: 30, valueLabel: '30' },
          { name: 'Microsoft (2019-23)', value: 13, valueLabel: '13' },
        ],
      },
      {
        label: 'Impegni di calcolo — non sono investimento',
        color: '#64748b',
        items: [
          { name: 'Stargate (gen/2025)', value: 500, valueLabel: '500' },
          { name: 'Amazon, AWS (+8 anni)', value: 100, valueLabel: '100' },
          { name: 'Nvidia (intenzione)', value: 100, valueLabel: 'fino a 100' },
        ],
      },
    ],
  },

  /**
   * `openai-form990-remuneracao-it` — Form 990 da "Openai Inc" (EIN 81-0861541), Parte VII,
   * colunas (E) compensação de organizações relacionadas + (F) outra compensação, US$; coluna
   * (D), paga pela própria nonprofit, é 0 em todas as linhas de Altman. FY2023
   * (ObjectId 202413189349309791): Altman 64.957 + 11.044 = 76.001. FY2024
   * (ObjectId 202513219349328476): Altman 65.638 + 48.036 = 113.674 — 10º de 12 nomes da Parte
   * VII. Acima dele: Greg Brockman (Dir/Pres, Former) 240.176 + 24.013 = 264.189; Chris Clark
   * 12.933 + 166.484 + 36.604 = 216.021; Lawrence Summers 143.702; Adam D'Angelo, Susan
   * Desmond-Hellmann e Bret Taylor 140.000; Nicole Seligman e Fidji Simo 127.500; Ilya Sutskever
   * (Former) 119.538. Abaixo: Paul Nakasone 99.030, Zico Kolter 53.494. Tabela inteira extraída
   * do full-text da ProPublica (regex sobre as 12 linhas) em 26/08/2026.
   */
  'openai-form990-remuneracao-it': {
    max: 270000,
    groups: [
      {
        label: 'Sam Altman — il numero che circola e l\'anno successivo (US$)',
        color: '#a48f65',
        items: [
          { name: 'FY2023 (circola)', value: 76001, valueLabel: '76.001' },
          { name: 'FY2024', value: 113674, valueLabel: '113.674', emphasis: true },
        ],
      },
      {
        label: 'I più retribuiti nello stesso Form 990 di FY2024 (US$)',
        color: '#64748b',
        items: [
          { name: 'Greg Brockman (ex)', value: 264189, valueLabel: '264.189' },
          { name: 'Chris Clark (tesor.)', value: 216021, valueLabel: '216.021' },
          { name: 'Lawrence Summers', value: 143702, valueLabel: '143.702' },
          { name: 'Bret Taylor (consiglio)', value: 140000, valueLabel: '140.000' },
        ],
      },
    ],
  },

  /**
   * `openai-brasil-precos-reais-it` — ChatGPT no Brasil, compra dentro do app (Apple App Store
   * Brasil, apps.apple.com/br/app/chatgpt/id6448311069, lido ao vivo em 26/08/2026): Go R$ 39,90,
   * Plus R$ 99,90, Pro 5x R$ 524,90, Pro 20x R$ 999,90. O site (chatgpt.com/pricing) devolveu 403
   * a esta máquina; o Go no site é R$ 39,99 (comunicado Nubank + OpenAI, 28/10/2025). Ouro = o
   * plano que só existe em alguns países.
   */
  'openai-brasil-precos-reais-it': {
    max: 1100,
    groups: [
      {
        label: 'ChatGPT in Brasile — App Store, 26/08/2026 (R$ al mese)',
        color: '#60a5fa',
        items: [
          { name: 'Go', value: 39.9, valueLabel: 'R$ 39,90', emphasis: true },
          { name: 'Plus', value: 99.9, valueLabel: 'R$ 99,90' },
          { name: 'Pro (5x)', value: 524.9, valueLabel: 'R$ 524,90' },
          { name: 'Pro (20x)', value: 999.9, valueLabel: 'R$ 999,90' },
        ],
      },
    ],
  },
  /**
   * `openai-links-da-pagina-he` — bloco 1: a página alemã tem 76 afirmações numéricas, 14 links
   * externos e 7 fontes citadas só pelo nome (contagem em `fontes/auditoria-links-gradually.md`,
   * a partir do JSON de hrefs extraído no Chrome real). Bloco 2: os 14 links, um a um, em
   * 26/08/2026. Ouro = o único link que abre, é oficial e NÃO contém o número.
   */
  'openai-links-da-pagina-he': {
    max: 80,
    groups: [
      {
        label: 'העמוד הגרמני על OpenAI (23/08/2026)',
        color: '#64748b',
        items: [
          { name: 'טענות מספריות', value: 76, valueLabel: '76' },
          { name: 'קישורים חיצוניים', value: 14, valueLabel: '14', emphasis: true },
          { name: 'מקורות בשם בלבד', value: 7, valueLabel: '7' },
        ],
      },
      {
        label: '14 הקישורים, אחד אחד',
        color: '#60a5fa',
        items: [
          { name: 'נפתח ותומך', value: 4, valueLabel: '4' },
          { name: 'חסום, אושר', value: 5, valueLabel: '5' },
          { name: 'חסום; בלי מראה', value: 3, valueLabel: '3' },
          { name: 'רק דף הבית', value: 1, valueLabel: '1' },
          { name: 'נפתח ולא תומך', value: 1, valueLabel: '1', emphasis: true },
        ],
      },
    ],
  },

  /**
   * `openai-vinte-numeros-he` — os 20 números centrais da página, classificados pela régua das
   * quatro naturezas (apêndice do inventário, cada linha com o arquivo de evidência). O "92% da
   * Fortune 500" fica fora da lista por ser caso próprio (é oficial, mas de 08/01/2024 e de
   * outro assunto). Ouro = os órfãos.
   */
  'openai-vinte-numeros-he': {
    max: 20,
    groups: [
      {
        label: 'מ-OpenAI עצמה, או רשומה ציבורית מבוקרת',
        color: '#60a5fa',
        items: [{ name: 'רשמי', value: 8, valueLabel: '8 מ-20', emphasis: true }],
      },
      {
        label: 'מחוץ לחברה',
        color: '#64748b',
        items: [
          { name: 'דיווח/הערכה', value: 6, valueLabel: '6' },
          { name: 'יעד מוצהר', value: 3, valueLabel: '3' },
        ],
      },
      {
        label: 'בלי מקור שניתן לאתר',
        color: '#a48f65',
        items: [{ name: 'יתום', value: 3, valueLabel: '3', emphasis: true }],
      },
    ],
  },

  /**
   * `openai-receita-por-natureza-he` — receita em US$ bilhões anualizados, cada barra com a sua
   * natureza. Oficial: CFO Sarah Friar no blog da OpenAI (19-20/01/2026: "$2B ARR in 2023, $6B
   * in 2024, and $20B+ in 2025") e post de 31/03/2026 ("$2B in revenue per month" = 24 bi/ano).
   * Estimativa: Sacra, dashboard vivo lido em 26/08/2026 ("$40B in annualized revenue in July
   * 2026"). Metas: documentos internos via The Information (2026: 30 bi), Altman no podcast BG2
   * (2027: "How about '27?" para 100 bi), documentos internos via Bloomberg (20/02/2026: 2030 =
   * 280 bi). NUNCA somar nem traçar linha entre blocos.
   */
  'openai-receita-por-natureza-he': {
    max: 280,
    groups: [
      {
        label: 'רשמי: OpenAI פרסמה (מיליארדי דולר שנתיים)',
        color: '#60a5fa',
        items: [
          { name: '2023', value: 2, valueLabel: '2' },
          { name: '2024', value: 6, valueLabel: '6' },
          { name: '2025', value: 20, valueLabel: '20+' },
          { name: '03/2026 (2 בחודש)', value: 24, valueLabel: '24', emphasis: true },
        ],
      },
      {
        label: 'הערכה מבחוץ (Sacra, לוח חי, 26/08/2026)',
        color: '#64748b',
        items: [{ name: '07/2026', value: 40, valueLabel: '40' }],
      },
      {
        label: 'יעד: מישהו אמר שהוא מתכוון',
        color: '#fbbf24',
        items: [
          { name: 'יעד 2026', value: 30, valueLabel: '30' },
          { name: 'יעד 2027 (פודקאסט)', value: 100, valueLabel: '100' },
          { name: 'יעד 2030', value: 280, valueLabel: '280' },
        ],
      },
    ],
  },

  /**
   * `openai-investidores-equity-compute-he` — bloco 1: investimento em participação (equity),
   * ACUMULADO por investidor, US$ bi: SoftBank 64,6 (comunicado oficial da SoftBank,
   * 27/02/2026: "cumulative investment [...] USD 64.6 billion, approximately 13%"; inclui as
   * três parcelas de 2026); Amazon 50 (rodada de 2026, finalizada em 31/07/2026 segundo a
   * GeekWire); Nvidia 30 (rodada de 2026); Microsoft 13 (2019 + 2021 + 2023, soma de agregador,
   * categoria B). Bloco 2: compromissos de COMPUTAÇÃO, que não são investimento — Stargate 500
   * (anúncio de 21/01/2025), Amazon AWS +100 em 8 anos (contrato), Nvidia até 100 (carta de
   * intenção de set/2025, "not definitive" pela CFO da Nvidia em dez/2025). Ouro = o número que
   * a página alemã dá como ">71 bi".
   */
  'openai-investidores-equity-compute-he': {
    max: 500,
    groups: [
      {
        label: 'השקעת אחזקה, מצטבר לפי משקיע (מיליארדי דולר)',
        color: '#60a5fa',
        items: [
          { name: 'SoftBank (עד 10/26)', value: 64.6, valueLabel: '64.6', emphasis: true },
          { name: 'Amazon (2026)', value: 50, valueLabel: '50' },
          { name: 'Nvidia (2026)', value: 30, valueLabel: '30' },
          { name: 'Microsoft (2019-23)', value: 13, valueLabel: '13' },
        ],
      },
      {
        label: 'התחייבויות מחשוב — לא השקעה',
        color: '#64748b',
        items: [
          { name: 'Stargate (01/2025)', value: 500, valueLabel: '500' },
          { name: 'Amazon, AWS (+8 שנים)', value: 100, valueLabel: '100' },
          { name: 'Nvidia (כוונה)', value: 100, valueLabel: 'עד 100' },
        ],
      },
    ],
  },

  /**
   * `openai-form990-remuneracao-he` — Form 990 da "Openai Inc" (EIN 81-0861541), Parte VII,
   * colunas (E) compensação de organizações relacionadas + (F) outra compensação, US$; coluna
   * (D), paga pela própria nonprofit, é 0 em todas as linhas de Altman. FY2023
   * (ObjectId 202413189349309791): Altman 64.957 + 11.044 = 76.001. FY2024
   * (ObjectId 202513219349328476): Altman 65.638 + 48.036 = 113.674 — 10º de 12 nomes da Parte
   * VII. Acima dele: Greg Brockman (Dir/Pres, Former) 240.176 + 24.013 = 264.189; Chris Clark
   * 12.933 + 166.484 + 36.604 = 216.021; Lawrence Summers 143.702; Adam D'Angelo, Susan
   * Desmond-Hellmann e Bret Taylor 140.000; Nicole Seligman e Fidji Simo 127.500; Ilya Sutskever
   * (Former) 119.538. Abaixo: Paul Nakasone 99.030, Zico Kolter 53.494. Tabela inteira extraída
   * do full-text da ProPublica (regex sobre as 12 linhas) em 26/08/2026.
   */
  'openai-form990-remuneracao-he': {
    max: 270000,
    groups: [
      {
        label: 'סם אלטמן — המספר שמסתובב והשנה שאחריה (דולר)',
        color: '#a48f65',
        items: [
          { name: 'FY2023 (מסתובב)', value: 76001, valueLabel: '76,001' },
          { name: 'FY2024', value: 113674, valueLabel: '113,674', emphasis: true },
        ],
      },
      {
        label: 'המתוגמלים ביותר באותו Form 990 של FY2024 (דולר)',
        color: '#64748b',
        items: [
          { name: 'Brockman (לשעבר)', value: 264189, valueLabel: '264,189' },
          { name: 'Chris Clark (גזבר)', value: 216021, valueLabel: '216,021' },
          { name: 'Lawrence Summers', value: 143702, valueLabel: '143,702' },
          { name: 'Bret Taylor (דירקט׳)', value: 140000, valueLabel: '140,000' },
        ],
      },
    ],
  },

  /**
   * `openai-brasil-precos-reais-he` — ChatGPT no Brasil, compra dentro do app (Apple App Store
   * Brasil, apps.apple.com/br/app/chatgpt/id6448311069, lido ao vivo em 26/08/2026): Go R$ 39,90,
   * Plus R$ 99,90, Pro 5x R$ 524,90, Pro 20x R$ 999,90. O site (chatgpt.com/pricing) devolveu 403
   * a esta máquina; o Go no site é R$ 39,99 (comunicado Nubank + OpenAI, 28/10/2025). Ouro = o
   * plano que só existe em alguns países.
   */
  'openai-brasil-precos-reais-he': {
    max: 1100,
    groups: [
      {
        label: 'ChatGPT בברזיל — App Store, 26/08/2026 (R$ בחודש)',
        color: '#60a5fa',
        items: [
          { name: 'Go', value: 39.9, valueLabel: 'R$ 39.90', emphasis: true },
          { name: 'Plus', value: 99.9, valueLabel: 'R$ 99.90' },
          { name: 'Pro (5x)', value: 524.9, valueLabel: 'R$ 524.90' },
          { name: 'Pro (20x)', value: 999.9, valueLabel: 'R$ 999.90' },
        ],
      },
    ],
  },
  /**
   * `modelos-mesmo-fornecedor` — o MESMO fornecedor contado pelas três definições. Bloco 1:
   * repositórios no Hugging Face com etiqueta text-generation por organização (`?author=`,
   * medido em 26/08/2026 ~11:55; Alibaba = org `Qwen`). Bloco 2: modelos notáveis lançados em
   * 2025 por organização (AI Index 2026, Fig. 1.1.6, fonte Epoch AI; DeepMind conta em Google).
   * Bloco 3: catálogo editorial da página alemã, seção 7 (ela mesma dá outros números na seção 2:
   * OpenAI 35, Anthropic 19, Google 18 — a contradição interna vai no texto). NUNCA somar blocos.
   */
  'modelos-mesmo-fornecedor': {
    max: 310,
    groups: [
      {
        label: 'Repositórios no Hugging Face com a etiqueta text-generation (26/08/2026)',
        color: '#64748b',
        items: [
          { name: 'Alibaba (Qwen)', value: 307, valueLabel: '307' },
          { name: 'Google', value: 149, valueLabel: '149' },
          { name: 'DeepSeek', value: 70, valueLabel: '70' },
          { name: 'Meta', value: 51, valueLabel: '51' },
          { name: 'OpenAI', value: 5, valueLabel: '5', emphasis: true },
          { name: 'Anthropic', value: 0, valueLabel: '0' },
        ],
      },
      {
        label: 'Modelos notáveis lançados em 2025 (Epoch AI, no AI Index 2026)',
        color: '#60a5fa',
        items: [
          { name: 'OpenAI', value: 20, valueLabel: '20', emphasis: true },
          { name: 'Google', value: 14, valueLabel: '14' },
          { name: 'Alibaba', value: 11, valueLabel: '11' },
          { name: 'Anthropic', value: 7, valueLabel: '7' },
          { name: 'DeepSeek', value: 4, valueLabel: '4' },
          { name: 'Meta', value: 4, valueLabel: '4' },
        ],
      },
      {
        label: 'Catálogo editorial da página alemã (seção 7, 23/08/2026)',
        color: '#fbbf24',
        items: [
          { name: 'Alibaba', value: 42, valueLabel: '42' },
          { name: 'OpenAI', value: 38, valueLabel: '38', emphasis: true },
          { name: 'Google', value: 27, valueLabel: '27' },
          { name: 'Anthropic', value: 20, valueLabel: '20' },
          { name: 'Meta', value: 15, valueLabel: '15' },
        ],
      },
    ],
  },

  /**
   * `modelos-nota-dois-medidores` — SWE-bench Verified. Bloco 1: a nota que circula = o que o
   * próprio laboratório publica (Fable 5 e Opus 4.8: System Card Fable 5/Mythos 5, Tabela 8.1.A,
   * média de 5 tentativas; DeepSeek-V4-Pro Preview: README do HF, modo Max, último commit
   * 22/06/2026; Kimi K2.6: README do HF). Bloco 2: o MESMO checkpoint medido pela Vals AI com um
   * único harness (mini-swe-agent, só bash; "Updated 8/19/2026"). Bloco 3: a versão atual de cada
   * família na mesma tabela da Vals. Barra do 0813 em ouro = o número que a página alemã não viu.
   */
  'modelos-nota-dois-medidores': {
    max: 100,
    groups: [
      {
        label: 'A nota que circula: publicada pelo próprio laboratório',
        color: '#64748b',
        items: [
          { name: 'Claude Fable 5', value: 95.0, valueLabel: '95,0%' },
          { name: 'Claude Opus 4.8', value: 88.6, valueLabel: '88,6%' },
          { name: 'DeepSeek V4-Pro', value: 80.6, valueLabel: '80,6%', emphasis: true },
          { name: 'Kimi K2.6', value: 80.2, valueLabel: '80,2%' },
        ],
      },
      {
        label: 'O mesmo modelo, medido de fora pela Vals AI (um harness só)',
        color: '#60a5fa',
        items: [
          { name: 'Claude Fable 5', value: 95.0, valueLabel: '95,0%' },
          { name: 'Claude Opus 4.8', value: 88.6, valueLabel: '88,6%' },
          { name: 'DeepSeek V4-Pro', value: 77.4, valueLabel: '77,4%', emphasis: true },
          { name: 'Kimi K2.6', value: 76.2, valueLabel: '76,2%' },
        ],
      },
      {
        label: 'A versão atual de cada família, na mesma tabela da Vals AI',
        color: '#a48f65',
        items: [
          { name: 'Claude Opus 5', value: 97.0, valueLabel: '97,0%' },
          { name: 'DeepSeek 0813', value: 96.4, valueLabel: '96,4%', emphasis: true },
          { name: 'GPT-5.6 Sol', value: 96.2, valueLabel: '96,2%' },
          { name: 'Kimi K3', value: 93.4, valueLabel: '93,4%' },
        ],
      },
    ],
  },

  /**
   * `modelos-parametros-declarados` — bloco 1: parâmetros totais em bilhões, como o próprio
   * model card ou paper declara (Kimi K3 e Kimi K2.6: huggingface.co/moonshotai; Qwen3.8:
   * huggingface.co/Qwen/Qwen3.8-2.4T-A95B-FP8; DeepSeek-V4-Pro e V3.2-Exp: huggingface.co/deepseek-ai;
   * GPT-3: arXiv 2005.14165; Mixtral 8x22B: huggingface.co/mistralai; gpt-oss-120b:
   * huggingface.co/openai; Llama 4 Scout: ai.meta.com/blog, todos lidos em 26/08/2026).
   * Bloco 2: os modelos de ponta fechados — o GPT-4 Technical Report diz "no further details
   * about the architecture (including model size)"; o 1,76 tri é estimativa de terceiros (Hotz /
   * SemiAnalysis, 2023), nunca da OpenAI. Barra zero = "não divulgado" (dado ausente, não valor).
   */
  'modelos-parametros-declarados': {
    max: 3000,
    groups: [
      {
        label: 'Parâmetros totais declarados pelo próprio laboratório (bilhões)',
        color: '#60a5fa',
        items: [
          { name: 'Kimi K3', value: 2800, valueLabel: '2,8 tri', emphasis: true },
          { name: 'Qwen 3.8', value: 2400, valueLabel: '2,4 tri' },
          { name: 'DeepSeek-V4-Pro', value: 1600, valueLabel: '1,6 tri' },
          { name: 'Kimi K2.6', value: 1000, valueLabel: '1 tri' },
          { name: 'DeepSeek V3.2', value: 685, valueLabel: '685 bi' },
          { name: 'GPT-3 (2020)', value: 175, valueLabel: '175 bi' },
          { name: 'Mixtral 8x22B', value: 141, valueLabel: '141 bi' },
          { name: 'gpt-oss-120b', value: 117, valueLabel: '117 bi' },
          { name: 'Llama 4 Scout', value: 109, valueLabel: '109 bi' },
        ],
      },
      {
        label: 'Modelos de ponta fechados: o laboratório não divulga',
        color: '#64748b',
        items: [
          { name: 'GPT-4 (rumor)', value: 1760, valueLabel: '1,76 tri*' },
          { name: 'GPT-5.6 Sol', value: 0, valueLabel: 'não divulga' },
          { name: 'Claude Opus 5', value: 0, valueLabel: 'não divulga' },
          { name: 'Gemini 3.7 Flash', value: 0, valueLabel: 'não divulga' },
          { name: 'Grok 4.6', value: 0, valueLabel: 'não divulga' },
        ],
      },
    ],
  },

  /**
   * `modelos-brasil-suite` — custo de rodar a suíte completa de provas brasileiras (Leis,
   * OAB Bench, MAGIS, ENEM/USP/OAB, conversação) em cada modelo, em reais, como a Maritaca
   * publica em docs.maritaca.ai/pt/introducao (lido em 26/08/2026). É a única comparação de
   * custo de suíte em moeda nacional que a redação achou. Ouro = o modelo brasileiro.
   */
  'modelos-brasil-suite': {
    max: 600,
    groups: [
      {
        label: 'Custo de rodar a suíte de provas brasileiras da Maritaca (R$, por modelo)',
        color: '#a48f65',
        items: [
          { name: 'Sabiá 4 Thinking', value: 206, valueLabel: 'R$ 206', emphasis: true },
          { name: 'Gemini 3.1 Pro', value: 281, valueLabel: 'R$ 281' },
          { name: 'GPT-5.4', value: 449, valueLabel: 'R$ 449' },
          { name: 'Claude Opus 4.8', value: 590, valueLabel: 'R$ 590' },
        ],
      },
    ],
  },
  /**
   * `modelos-mesmo-fornecedor` — o MESMO fornecedor contado pelas três definições. Bloco 1:
   * repositórios no Hugging Face com etiqueta text-generation por organização (`?author=`,
   * medido em 26/08/2026 ~11:55; Alibaba = org `Qwen`). Bloco 2: modelos notáveis lançados em
   * 2025 por organização (AI Index 2026, Fig. 1.1.6, fonte Epoch AI; DeepMind conta em Google).
   * Bloco 3: catálogo editorial da página alemã, seção 7 (ela mesma dá outros números na seção 2:
   * OpenAI 35, Anthropic 19, Google 18 — a contradição interna vai no texto). NUNCA somar blocos.
   */
  'modelos-mesmo-fornecedor-en': {
    max: 310,
    groups: [
      {
        label: 'Repositories on Hugging Face with the text-generation tag (Aug 26, 2026)',
        color: '#64748b',
        items: [
          { name: 'Alibaba (Qwen)', value: 307, valueLabel: '307' },
          { name: 'Google', value: 149, valueLabel: '149' },
          { name: 'DeepSeek', value: 70, valueLabel: '70' },
          { name: 'Meta', value: 51, valueLabel: '51' },
          { name: 'OpenAI', value: 5, valueLabel: '5', emphasis: true },
          { name: 'Anthropic', value: 0, valueLabel: '0' },
        ],
      },
      {
        label: 'Notable models released in 2025 (Epoch AI, in the AI Index 2026)',
        color: '#60a5fa',
        items: [
          { name: 'OpenAI', value: 20, valueLabel: '20', emphasis: true },
          { name: 'Google', value: 14, valueLabel: '14' },
          { name: 'Alibaba', value: 11, valueLabel: '11' },
          { name: 'Anthropic', value: 7, valueLabel: '7' },
          { name: 'DeepSeek', value: 4, valueLabel: '4' },
          { name: 'Meta', value: 4, valueLabel: '4' },
        ],
      },
      {
        label: 'Editorial catalog from the German page (section 7, Aug 23, 2026)',
        color: '#fbbf24',
        items: [
          { name: 'Alibaba', value: 42, valueLabel: '42' },
          { name: 'OpenAI', value: 38, valueLabel: '38', emphasis: true },
          { name: 'Google', value: 27, valueLabel: '27' },
          { name: 'Anthropic', value: 20, valueLabel: '20' },
          { name: 'Meta', value: 15, valueLabel: '15' },
        ],
      },
    ],
  },

  /**
   * `modelos-nota-dois-medidores` — SWE-bench Verified. Bloco 1: a nota que circula = o que o
   * próprio laboratório publica (Fable 5 e Opus 4.8: System Card Fable 5/Mythos 5, Tabela 8.1.A,
   * média de 5 tentativas; DeepSeek-V4-Pro Preview: README do HF, modo Max, último commit
   * 22/06/2026; Kimi K2.6: README do HF). Bloco 2: o MESMO checkpoint medido pela Vals AI com um
   * único harness (mini-swe-agent, só bash; "Updated 8/19/2026"). Bloco 3: a versão atual de cada
   * família na mesma tabela da Vals. Barra do 0813 em ouro = o número que a página alemã não viu.
   */
  'modelos-nota-dois-medidores-en': {
    max: 100,
    groups: [
      {
        label: 'The score that circulates: published by the lab itself',
        color: '#64748b',
        items: [
          { name: 'Claude Fable 5', value: 95.0, valueLabel: '95.0%' },
          { name: 'Claude Opus 4.8', value: 88.6, valueLabel: '88.6%' },
          { name: 'DeepSeek V4-Pro', value: 80.6, valueLabel: '80.6%', emphasis: true },
          { name: 'Kimi K2.6', value: 80.2, valueLabel: '80.2%' },
        ],
      },
      {
        label: 'The same model, measured from outside by Vals AI (one harness)',
        color: '#60a5fa',
        items: [
          { name: 'Claude Fable 5', value: 95.0, valueLabel: '95.0%' },
          { name: 'Claude Opus 4.8', value: 88.6, valueLabel: '88.6%' },
          { name: 'DeepSeek V4-Pro', value: 77.4, valueLabel: '77.4%', emphasis: true },
          { name: 'Kimi K2.6', value: 76.2, valueLabel: '76.2%' },
        ],
      },
      {
        label: 'The current version of each family, same Vals AI table',
        color: '#a48f65',
        items: [
          { name: 'Claude Opus 5', value: 97.0, valueLabel: '97.0%' },
          { name: 'DeepSeek 0813', value: 96.4, valueLabel: '96.4%', emphasis: true },
          { name: 'GPT-5.6 Sol', value: 96.2, valueLabel: '96.2%' },
          { name: 'Kimi K3', value: 93.4, valueLabel: '93.4%' },
        ],
      },
    ],
  },

  /**
   * `modelos-parametros-declarados` — bloco 1: parâmetros totais em bilhões, como o próprio
   * model card ou paper declara (Kimi K3 e Kimi K2.6: huggingface.co/moonshotai; Qwen3.8:
   * huggingface.co/Qwen/Qwen3.8-2.4T-A95B-FP8; DeepSeek-V4-Pro e V3.2-Exp: huggingface.co/deepseek-ai;
   * GPT-3: arXiv 2005.14165; Mixtral 8x22B: huggingface.co/mistralai; gpt-oss-120b:
   * huggingface.co/openai; Llama 4 Scout: ai.meta.com/blog, todos lidos em 26/08/2026).
   * Bloco 2: os modelos de ponta fechados — o GPT-4 Technical Report diz "no further details
   * about the architecture (including model size)"; o 1,76 tri é estimativa de terceiros (Hotz /
   * SemiAnalysis, 2023), nunca da OpenAI. Barra zero = "não divulgado" (dado ausente, não valor).
   */
  'modelos-parametros-declarados-en': {
    max: 3000,
    groups: [
      {
        label: "Total parameters declared by the lab itself (billions)",
        color: '#60a5fa',
        items: [
          { name: 'Kimi K3', value: 2800, valueLabel: '2.8 tn', emphasis: true },
          { name: 'Qwen 3.8', value: 2400, valueLabel: '2.4 tn' },
          { name: 'DeepSeek-V4-Pro', value: 1600, valueLabel: '1.6 tn' },
          { name: 'Kimi K2.6', value: 1000, valueLabel: '1 tn' },
          { name: 'DeepSeek V3.2', value: 685, valueLabel: '685 bn' },
          { name: 'GPT-3 (2020)', value: 175, valueLabel: '175 bn' },
          { name: 'Mixtral 8x22B', value: 141, valueLabel: '141 bn' },
          { name: 'gpt-oss-120b', value: 117, valueLabel: '117 bn' },
          { name: 'Llama 4 Scout', value: 109, valueLabel: '109 bn' },
        ],
      },
      {
        label: 'Closed frontier models: the lab does not disclose',
        color: '#64748b',
        items: [
          { name: 'GPT-4 (rumor)', value: 1760, valueLabel: '1.76 tn*' },
          { name: 'GPT-5.6 Sol', value: 0, valueLabel: 'undisclosed' },
          { name: 'Claude Opus 5', value: 0, valueLabel: 'undisclosed' },
          { name: 'Gemini 3.7 Flash', value: 0, valueLabel: 'undisclosed' },
          { name: 'Grok 4.6', value: 0, valueLabel: 'undisclosed' },
        ],
      },
    ],
  },

  /**
   * `modelos-brasil-suite` — custo de rodar a suíte completa de provas brasileiras (Leis,
   * OAB Bench, MAGIS, ENEM/USP/OAB, conversação) em cada modelo, em reais, como a Maritaca
   * publica em docs.maritaca.ai/pt/introducao (lido em 26/08/2026). É a única comparação de
   * custo de suíte em moeda nacional que a redação achou. Ouro = o modelo brasileiro.
   */
  'modelos-brasil-suite-en': {
    max: 600,
    groups: [
      {
        label: "Cost of running Maritaca's Brazilian exam suite (R$, per model)",
        color: '#a48f65',
        items: [
          { name: 'Sabiá 4 Thinking', value: 206, valueLabel: 'R$ 206', emphasis: true },
          { name: 'Gemini 3.1 Pro', value: 281, valueLabel: 'R$ 281' },
          { name: 'GPT-5.4', value: 449, valueLabel: 'R$ 449' },
          { name: 'Claude Opus 4.8', value: 590, valueLabel: 'R$ 590' },
        ],
      },
    ],
  },
  /**
   * `modelos-mesmo-fornecedor` — o MESMO fornecedor contado pelas três definições. Bloco 1:
   * repositórios no Hugging Face com etiqueta text-generation por organização (`?author=`,
   * medido em 26/08/2026 ~11:55; Alibaba = org `Qwen`). Bloco 2: modelos notáveis lançados em
   * 2025 por organização (AI Index 2026, Fig. 1.1.6, fonte Epoch AI; DeepMind conta em Google).
   * Bloco 3: catálogo editorial da página alemã, seção 7 (ela mesma dá outros números na seção 2:
   * OpenAI 35, Anthropic 19, Google 18 — a contradição interna vai no texto). NUNCA somar blocos.
   */
  'modelos-mesmo-fornecedor-es': {
    max: 310,
    groups: [
      {
        label: 'Repositorios en Hugging Face con la etiqueta text-generation (26/08/2026)',
        color: '#64748b',
        items: [
          { name: 'Alibaba (Qwen)', value: 307, valueLabel: '307' },
          { name: 'Google', value: 149, valueLabel: '149' },
          { name: 'DeepSeek', value: 70, valueLabel: '70' },
          { name: 'Meta', value: 51, valueLabel: '51' },
          { name: 'OpenAI', value: 5, valueLabel: '5', emphasis: true },
          { name: 'Anthropic', value: 0, valueLabel: '0' },
        ],
      },
      {
        label: 'Modelos notables lanzados en 2025 (Epoch AI, en el AI Index 2026)',
        color: '#60a5fa',
        items: [
          { name: 'OpenAI', value: 20, valueLabel: '20', emphasis: true },
          { name: 'Google', value: 14, valueLabel: '14' },
          { name: 'Alibaba', value: 11, valueLabel: '11' },
          { name: 'Anthropic', value: 7, valueLabel: '7' },
          { name: 'DeepSeek', value: 4, valueLabel: '4' },
          { name: 'Meta', value: 4, valueLabel: '4' },
        ],
      },
      {
        label: 'Catálogo editorial de la página alemana (sección 7, 23/08/2026)',
        color: '#fbbf24',
        items: [
          { name: 'Alibaba', value: 42, valueLabel: '42' },
          { name: 'OpenAI', value: 38, valueLabel: '38', emphasis: true },
          { name: 'Google', value: 27, valueLabel: '27' },
          { name: 'Anthropic', value: 20, valueLabel: '20' },
          { name: 'Meta', value: 15, valueLabel: '15' },
        ],
      },
    ],
  },

  /**
   * `modelos-nota-dois-medidores` — SWE-bench Verified. Bloco 1: a nota que circula = o que o
   * próprio laboratório publica (Fable 5 e Opus 4.8: System Card Fable 5/Mythos 5, Tabela 8.1.A,
   * média de 5 tentativas; DeepSeek-V4-Pro Preview: README do HF, modo Max, último commit
   * 22/06/2026; Kimi K2.6: README do HF). Bloco 2: o MESMO checkpoint medido pela Vals AI com um
   * único harness (mini-swe-agent, só bash; "Updated 8/19/2026"). Bloco 3: a versão atual de cada
   * família na mesma tabela da Vals. Barra do 0813 em ouro = o número que a página alemã não viu.
   */
  'modelos-nota-dois-medidores-es': {
    max: 100,
    groups: [
      {
        label: 'La nota que circula: publicada por el propio laboratorio',
        color: '#64748b',
        items: [
          { name: 'Claude Fable 5', value: 95.0, valueLabel: '95,0%' },
          { name: 'Claude Opus 4.8', value: 88.6, valueLabel: '88,6%' },
          { name: 'DeepSeek V4-Pro', value: 80.6, valueLabel: '80,6%', emphasis: true },
          { name: 'Kimi K2.6', value: 80.2, valueLabel: '80,2%' },
        ],
      },
      {
        label: 'El mismo modelo, medido desde fuera por Vals AI (un solo harness)',
        color: '#60a5fa',
        items: [
          { name: 'Claude Fable 5', value: 95.0, valueLabel: '95,0%' },
          { name: 'Claude Opus 4.8', value: 88.6, valueLabel: '88,6%' },
          { name: 'DeepSeek V4-Pro', value: 77.4, valueLabel: '77,4%', emphasis: true },
          { name: 'Kimi K2.6', value: 76.2, valueLabel: '76,2%' },
        ],
      },
      {
        label: 'La versión actual de cada familia, en la misma tabla de Vals AI',
        color: '#a48f65',
        items: [
          { name: 'Claude Opus 5', value: 97.0, valueLabel: '97,0%' },
          { name: 'DeepSeek 0813', value: 96.4, valueLabel: '96,4%', emphasis: true },
          { name: 'GPT-5.6 Sol', value: 96.2, valueLabel: '96,2%' },
          { name: 'Kimi K3', value: 93.4, valueLabel: '93,4%' },
        ],
      },
    ],
  },

  /**
   * `modelos-parametros-declarados` — bloco 1: parâmetros totais em bilhões, como o próprio
   * model card ou paper declara (Kimi K3 e Kimi K2.6: huggingface.co/moonshotai; Qwen3.8:
   * huggingface.co/Qwen/Qwen3.8-2.4T-A95B-FP8; DeepSeek-V4-Pro e V3.2-Exp: huggingface.co/deepseek-ai;
   * GPT-3: arXiv 2005.14165; Mixtral 8x22B: huggingface.co/mistralai; gpt-oss-120b:
   * huggingface.co/openai; Llama 4 Scout: ai.meta.com/blog, todos lidos em 26/08/2026).
   * Bloco 2: os modelos de ponta fechados — o GPT-4 Technical Report diz "no further details
   * about the architecture (including model size)"; o 1,76 tri é estimativa de terceiros (Hotz /
   * SemiAnalysis, 2023), nunca da OpenAI. Barra zero = "não divulgado" (dado ausente, não valor).
   */
  'modelos-parametros-declarados-es': {
    max: 3000,
    groups: [
      {
        label: 'Parámetros totales declarados por el propio laboratorio (miles de millones)',
        color: '#60a5fa',
        items: [
          { name: 'Kimi K3', value: 2800, valueLabel: '2,8 bill.', emphasis: true },
          { name: 'Qwen 3.8', value: 2400, valueLabel: '2,4 bill.' },
          { name: 'DeepSeek-V4-Pro', value: 1600, valueLabel: '1,6 bill.' },
          { name: 'Kimi K2.6', value: 1000, valueLabel: '1 bill.' },
          { name: 'DeepSeek V3.2', value: 685, valueLabel: '685 MM' },
          { name: 'GPT-3 (2020)', value: 175, valueLabel: '175 MM' },
          { name: 'Mixtral 8x22B', value: 141, valueLabel: '141 MM' },
          { name: 'gpt-oss-120b', value: 117, valueLabel: '117 MM' },
          { name: 'Llama 4 Scout', value: 109, valueLabel: '109 MM' },
        ],
      },
      {
        label: 'Modelos de punta cerrados: el laboratorio no divulga',
        color: '#64748b',
        items: [
          { name: 'GPT-4 (rumor)', value: 1760, valueLabel: '1,76 bill.*' },
          { name: 'GPT-5.6 Sol', value: 0, valueLabel: 'no divulga' },
          { name: 'Claude Opus 5', value: 0, valueLabel: 'no divulga' },
          { name: 'Gemini 3.7 Flash', value: 0, valueLabel: 'no divulga' },
          { name: 'Grok 4.6', value: 0, valueLabel: 'no divulga' },
        ],
      },
    ],
  },

  /**
   * `modelos-brasil-suite` — custo de rodar a suíte completa de provas brasileiras (Leis,
   * OAB Bench, MAGIS, ENEM/USP/OAB, conversação) em cada modelo, em reais, como a Maritaca
   * publica em docs.maritaca.ai/pt/introducao (lido em 26/08/2026). É a única comparação de
   * custo de suíte em moeda nacional que a redação achou. Ouro = o modelo brasileiro.
   */
  'modelos-brasil-suite-es': {
    max: 600,
    groups: [
      {
        label: 'Costo de correr la suite de pruebas brasileñas de Maritaca (R$, por modelo)',
        color: '#a48f65',
        items: [
          { name: 'Sabiá 4 Thinking', value: 206, valueLabel: 'R$ 206', emphasis: true },
          { name: 'Gemini 3.1 Pro', value: 281, valueLabel: 'R$ 281' },
          { name: 'GPT-5.4', value: 449, valueLabel: 'R$ 449' },
          { name: 'Claude Opus 4.8', value: 590, valueLabel: 'R$ 590' },
        ],
      },
    ],
  },
  /**
   * `modelos-mesmo-fornecedor-it` — o MESMO fornecedor contado pelas três definições. Bloco 1:
   * repositórios no Hugging Face com etiqueta text-generation por organização (`?author=`,
   * medido em 26/08/2026 ~11:55; Alibaba = org `Qwen`). Bloco 2: modelos notáveis lançados em
   * 2025 por organização (AI Index 2026, Fig. 1.1.6, fonte Epoch AI; DeepMind conta em Google).
   * Bloco 3: catálogo editorial da página alemã, seção 7 (ela mesma dá outros números na seção 2:
   * OpenAI 35, Anthropic 19, Google 18 — a contradição interna vai no texto). NUNCA somar blocos.
   */
  'modelos-mesmo-fornecedor-it': {
    max: 310,
    groups: [
      {
        label: 'Repository su Hugging Face con il tag text-generation (26/08/2026)',
        color: '#64748b',
        items: [
          { name: 'Alibaba (Qwen)', value: 307, valueLabel: '307' },
          { name: 'Google', value: 149, valueLabel: '149' },
          { name: 'DeepSeek', value: 70, valueLabel: '70' },
          { name: 'Meta', value: 51, valueLabel: '51' },
          { name: 'OpenAI', value: 5, valueLabel: '5', emphasis: true },
          { name: 'Anthropic', value: 0, valueLabel: '0' },
        ],
      },
      {
        label: 'Modelli notevoli lanciati nel 2025 (Epoch AI, nell\'AI Index 2026)',
        color: '#60a5fa',
        items: [
          { name: 'OpenAI', value: 20, valueLabel: '20', emphasis: true },
          { name: 'Google', value: 14, valueLabel: '14' },
          { name: 'Alibaba', value: 11, valueLabel: '11' },
          { name: 'Anthropic', value: 7, valueLabel: '7' },
          { name: 'DeepSeek', value: 4, valueLabel: '4' },
          { name: 'Meta', value: 4, valueLabel: '4' },
        ],
      },
      {
        label: 'Catalogo editoriale della pagina tedesca (sezione 7, 23/08/2026)',
        color: '#fbbf24',
        items: [
          { name: 'Alibaba', value: 42, valueLabel: '42' },
          { name: 'OpenAI', value: 38, valueLabel: '38', emphasis: true },
          { name: 'Google', value: 27, valueLabel: '27' },
          { name: 'Anthropic', value: 20, valueLabel: '20' },
          { name: 'Meta', value: 15, valueLabel: '15' },
        ],
      },
    ],
  },

  /**
   * `modelos-nota-dois-medidores-it` — SWE-bench Verified. Bloco 1: a nota que circula = o que o
   * próprio laboratório publica (Fable 5 e Opus 4.8: System Card Fable 5/Mythos 5, Tabela 8.1.A,
   * média de 5 tentativas; DeepSeek-V4-Pro Preview: README do HF, modo Max, último commit
   * 22/06/2026; Kimi K2.6: README do HF). Bloco 2: o MESMO checkpoint medido pela Vals AI com um
   * único harness (mini-swe-agent, só bash; "Updated 8/19/2026"). Bloco 3: a versão atual de cada
   * família na mesma tabela da Vals. Barra do 0813 em ouro = o número que a página alemã não viu.
   */
  'modelos-nota-dois-medidores-it': {
    max: 100,
    groups: [
      {
        label: 'Il voto che circola: pubblicato dal laboratorio stesso',
        color: '#64748b',
        items: [
          { name: 'Claude Fable 5', value: 95.0, valueLabel: '95,0%' },
          { name: 'Claude Opus 4.8', value: 88.6, valueLabel: '88,6%' },
          { name: 'DeepSeek V4-Pro', value: 80.6, valueLabel: '80,6%', emphasis: true },
          { name: 'Kimi K2.6', value: 80.2, valueLabel: '80,2%' },
        ],
      },
      {
        label: 'Lo stesso modello, misurato da fuori dalla Vals AI (un solo harness)',
        color: '#60a5fa',
        items: [
          { name: 'Claude Fable 5', value: 95.0, valueLabel: '95,0%' },
          { name: 'Claude Opus 4.8', value: 88.6, valueLabel: '88,6%' },
          { name: 'DeepSeek V4-Pro', value: 77.4, valueLabel: '77,4%', emphasis: true },
          { name: 'Kimi K2.6', value: 76.2, valueLabel: '76,2%' },
        ],
      },
      {
        label: "La versione attuale di ogni famiglia, nella stessa tabella della Vals AI",
        color: '#a48f65',
        items: [
          { name: 'Claude Opus 5', value: 97.0, valueLabel: '97,0%' },
          { name: 'DeepSeek 0813', value: 96.4, valueLabel: '96,4%', emphasis: true },
          { name: 'GPT-5.6 Sol', value: 96.2, valueLabel: '96,2%' },
          { name: 'Kimi K3', value: 93.4, valueLabel: '93,4%' },
        ],
      },
    ],
  },

  /**
   * `modelos-parametros-declarados-it` — bloco 1: parâmetros totais em bilhões, como o próprio
   * model card ou paper declara (Kimi K3 e Kimi K2.6: huggingface.co/moonshotai; Qwen3.8:
   * huggingface.co/Qwen/Qwen3.8-2.4T-A95B-FP8; DeepSeek-V4-Pro e V3.2-Exp: huggingface.co/deepseek-ai;
   * GPT-3: arXiv 2005.14165; Mixtral 8x22B: huggingface.co/mistralai; gpt-oss-120b:
   * huggingface.co/openai; Llama 4 Scout: ai.meta.com/blog, todos lidos em 26/08/2026).
   * Bloco 2: os modelos de ponta fechados — o GPT-4 Technical Report diz "no further details
   * about the architecture (including model size)"; o 1,76 tri é estimativa de terceiros (Hotz /
   * SemiAnalysis, 2023), nunca da OpenAI. Barra zero = "não divulgado" (dado ausente, não valor).
   * Unidades traduzidas: 'bi' -> 'mld' (miliardi), 'tri' -> 'tril' (trilioni) — ver TRADUCAO-BRIEF.md.
   */
  'modelos-parametros-declarados-it': {
    max: 3000,
    groups: [
      {
        label: 'Parametri totali dichiarati dal laboratorio stesso (miliardi)',
        color: '#60a5fa',
        items: [
          { name: 'Kimi K3', value: 2800, valueLabel: '2,8 tril', emphasis: true },
          { name: 'Qwen 3.8', value: 2400, valueLabel: '2,4 tril' },
          { name: 'DeepSeek-V4-Pro', value: 1600, valueLabel: '1,6 tril' },
          { name: 'Kimi K2.6', value: 1000, valueLabel: '1 tril' },
          { name: 'DeepSeek V3.2', value: 685, valueLabel: '685 mld' },
          { name: 'GPT-3 (2020)', value: 175, valueLabel: '175 mld' },
          { name: 'Mixtral 8x22B', value: 141, valueLabel: '141 mld' },
          { name: 'gpt-oss-120b', value: 117, valueLabel: '117 mld' },
          { name: 'Llama 4 Scout', value: 109, valueLabel: '109 mld' },
        ],
      },
      {
        label: 'Modelli di punta chiusi: il laboratorio non divulga',
        color: '#64748b',
        items: [
          { name: 'GPT-4 (voce)', value: 1760, valueLabel: '1,76 tril*' },
          { name: 'GPT-5.6 Sol', value: 0, valueLabel: 'non divulga' },
          { name: 'Claude Opus 5', value: 0, valueLabel: 'non divulga' },
          { name: 'Gemini 3.7 Flash', value: 0, valueLabel: 'non divulga' },
          { name: 'Grok 4.6', value: 0, valueLabel: 'non divulga' },
        ],
      },
    ],
  },

  /**
   * `modelos-brasil-suite-it` — custo de rodar a suíte completa de provas brasileiras (Leis,
   * OAB Bench, MAGIS, ENEM/USP/OAB, conversação) em cada modelo, em reais, como a Maritaca
   * publica em docs.maritaca.ai/pt/introducao (lido em 26/08/2026). É a única comparação de
   * custo de suíte em moeda nacional que a redação achou. Ouro = o modelo brasileiro.
   */
  'modelos-brasil-suite-it': {
    max: 600,
    groups: [
      {
        label: 'Costo di eseguire la suite di prove brasiliane della Maritaca (R$, per modello)',
        color: '#a48f65',
        items: [
          { name: 'Sabiá 4 Thinking', value: 206, valueLabel: 'R$ 206', emphasis: true },
          { name: 'Gemini 3.1 Pro', value: 281, valueLabel: 'R$ 281' },
          { name: 'GPT-5.4', value: 449, valueLabel: 'R$ 449' },
          { name: 'Claude Opus 4.8', value: 590, valueLabel: 'R$ 590' },
        ],
      },
    ],
  },
  /**
   * `modelos-mesmo-fornecedor` — o MESMO fornecedor contado pelas três definições. Bloco 1:
   * repositórios no Hugging Face com etiqueta text-generation por organização (`?author=`,
   * medido em 26/08/2026 ~11:55; Alibaba = org `Qwen`). Bloco 2: modelos notáveis lançados em
   * 2025 por organização (AI Index 2026, Fig. 1.1.6, fonte Epoch AI; DeepMind conta em Google).
   * Bloco 3: catálogo editorial da página alemã, seção 7 (ela mesma dá outros números na seção 2:
   * OpenAI 35, Anthropic 19, Google 18 — a contradição interna vai no texto). NUNCA somar blocos.
   */
  'modelos-mesmo-fornecedor-he': {
    max: 310,
    groups: [
      {
        label: 'מאגרים ב-Hugging Face עם התג text-generation (26/08/2026)',
        color: '#64748b',
        items: [
          { name: 'Alibaba (Qwen)', value: 307, valueLabel: '307' },
          { name: 'Google', value: 149, valueLabel: '149' },
          { name: 'DeepSeek', value: 70, valueLabel: '70' },
          { name: 'Meta', value: 51, valueLabel: '51' },
          { name: 'OpenAI', value: 5, valueLabel: '5', emphasis: true },
          { name: 'Anthropic', value: 0, valueLabel: '0' },
        ],
      },
      {
        label: 'מודלים בולטים שהושקו ב-2025 (Epoch AI, ב-AI Index 2026)',
        color: '#60a5fa',
        items: [
          { name: 'OpenAI', value: 20, valueLabel: '20', emphasis: true },
          { name: 'Google', value: 14, valueLabel: '14' },
          { name: 'Alibaba', value: 11, valueLabel: '11' },
          { name: 'Anthropic', value: 7, valueLabel: '7' },
          { name: 'DeepSeek', value: 4, valueLabel: '4' },
          { name: 'Meta', value: 4, valueLabel: '4' },
        ],
      },
      {
        label: 'קטלוג עורכי של העמוד הגרמני (סעיף 7, 23/08/2026)',
        color: '#fbbf24',
        items: [
          { name: 'Alibaba', value: 42, valueLabel: '42' },
          { name: 'OpenAI', value: 38, valueLabel: '38', emphasis: true },
          { name: 'Google', value: 27, valueLabel: '27' },
          { name: 'Anthropic', value: 20, valueLabel: '20' },
          { name: 'Meta', value: 15, valueLabel: '15' },
        ],
      },
    ],
  },

  /**
   * `modelos-nota-dois-medidores` — SWE-bench Verified. Bloco 1: a nota que circula = o que o
   * próprio laboratório publica (Fable 5 e Opus 4.8: System Card Fable 5/Mythos 5, Tabela 8.1.A,
   * média de 5 tentativas; DeepSeek-V4-Pro Preview: README do HF, modo Max, último commit
   * 22/06/2026; Kimi K2.6: README do HF). Bloco 2: o MESMO checkpoint medido pela Vals AI com um
   * único harness (mini-swe-agent, só bash; "Updated 8/19/2026"). Bloco 3: a versão atual de cada
   * família na mesma tabela da Vals. Barra do 0813 em ouro = o número que a página alemã não viu.
   */
  'modelos-nota-dois-medidores-he': {
    max: 100,
    groups: [
      {
        label: 'הציון שמסתובב: פורסם על ידי המעבדה עצמה',
        color: '#64748b',
        items: [
          { name: 'Claude Fable 5', value: 95.0, valueLabel: '95.0%' },
          { name: 'Claude Opus 4.8', value: 88.6, valueLabel: '88.6%' },
          { name: 'DeepSeek V4-Pro', value: 80.6, valueLabel: '80.6%', emphasis: true },
          { name: 'Kimi K2.6', value: 80.2, valueLabel: '80.2%' },
        ],
      },
      {
        label: 'אותו מודל, נמדד מבחוץ על ידי Vals AI (harness אחד בלבד)',
        color: '#60a5fa',
        items: [
          { name: 'Claude Fable 5', value: 95.0, valueLabel: '95.0%' },
          { name: 'Claude Opus 4.8', value: 88.6, valueLabel: '88.6%' },
          { name: 'DeepSeek V4-Pro', value: 77.4, valueLabel: '77.4%', emphasis: true },
          { name: 'Kimi K2.6', value: 76.2, valueLabel: '76.2%' },
        ],
      },
      {
        label: 'הגרסה הנוכחית של כל משפחה, באותה טבלה של Vals AI',
        color: '#a48f65',
        items: [
          { name: 'Claude Opus 5', value: 97.0, valueLabel: '97.0%' },
          { name: 'DeepSeek 0813', value: 96.4, valueLabel: '96.4%', emphasis: true },
          { name: 'GPT-5.6 Sol', value: 96.2, valueLabel: '96.2%' },
          { name: 'Kimi K3', value: 93.4, valueLabel: '93.4%' },
        ],
      },
    ],
  },

  /**
   * `modelos-parametros-declarados` — bloco 1: parâmetros totais em bilhões, como o próprio
   * model card ou paper declara (Kimi K3 e Kimi K2.6: huggingface.co/moonshotai; Qwen3.8:
   * huggingface.co/Qwen/Qwen3.8-2.4T-A95B-FP8; DeepSeek-V4-Pro e V3.2-Exp: huggingface.co/deepseek-ai;
   * GPT-3: arXiv 2005.14165; Mixtral 8x22B: huggingface.co/mistralai; gpt-oss-120b:
   * huggingface.co/openai; Llama 4 Scout: ai.meta.com/blog, todos lidos em 26/08/2026).
   * Bloco 2: os modelos de ponta fechados — o GPT-4 Technical Report diz "no further details
   * about the architecture (including model size)"; o 1,76 tri é estimativa de terceiros (Hotz /
   * SemiAnalysis, 2023), nunca da OpenAI. Barra zero = "não divulgado" (dado ausente, não valor).
   * valueLabel em abreviação latina (T/B) por orçamento de largura (64px) — ver checar-rotulos-svg.py.
   */
  'modelos-parametros-declarados-he': {
    max: 3000,
    groups: [
      {
        label: 'סך הפרמטרים שהוצהרו על ידי המעבדה עצמה (במיליארדים)',
        color: '#60a5fa',
        items: [
          { name: 'Kimi K3', value: 2800, valueLabel: '2.8T', emphasis: true },
          { name: 'Qwen 3.8', value: 2400, valueLabel: '2.4T' },
          { name: 'DeepSeek-V4-Pro', value: 1600, valueLabel: '1.6T' },
          { name: 'Kimi K2.6', value: 1000, valueLabel: '1T' },
          { name: 'DeepSeek V3.2', value: 685, valueLabel: '685B' },
          { name: 'GPT-3 (2020)', value: 175, valueLabel: '175B' },
          { name: 'Mixtral 8x22B', value: 141, valueLabel: '141B' },
          { name: 'gpt-oss-120b', value: 117, valueLabel: '117B' },
          { name: 'Llama 4 Scout', value: 109, valueLabel: '109B' },
        ],
      },
      {
        label: 'מודלים מובילים סגורים: המעבדה לא מפרסמת',
        color: '#64748b',
        items: [
          { name: 'GPT-4 (שמועה)', value: 1760, valueLabel: '1.76T*' },
          { name: 'GPT-5.6 Sol', value: 0, valueLabel: 'לא פורסם' },
          { name: 'Claude Opus 5', value: 0, valueLabel: 'לא פורסם' },
          { name: 'Gemini 3.7 Flash', value: 0, valueLabel: 'לא פורסם' },
          { name: 'Grok 4.6', value: 0, valueLabel: 'לא פורסם' },
        ],
      },
    ],
  },

  /**
   * `modelos-brasil-suite` — custo de rodar a suíte completa de provas brasileiras (Leis,
   * OAB Bench, MAGIS, ENEM/USP/OAB, conversação) em cada modelo, em reais, como a Maritaca
   * publica em docs.maritaca.ai/pt/introducao (lido em 26/08/2026). É a única comparação de
   * custo de suíte em moeda nacional que a redação achou. Ouro = o modelo brasileiro.
   */
  'modelos-brasil-suite-he': {
    max: 600,
    groups: [
      {
        label: 'עלות הרצת חבילת המבחנים הברזילאית של Maritaca (R$, למודל)',
        color: '#a48f65',
        items: [
          { name: 'Sabiá 4 Thinking', value: 206, valueLabel: 'R$ 206', emphasis: true },
          { name: 'Gemini 3.1 Pro', value: 281, valueLabel: 'R$ 281' },
          { name: 'GPT-5.4', value: 449, valueLabel: 'R$ 449' },
          { name: 'Claude Opus 4.8', value: 590, valueLabel: 'R$ 590' },
        ],
      },
    ],
  },
  /**
   * `deepfake-procedencia-sete` — a contagem que sustenta o título. PROCEDÊNCIA: as 7 linhas da
   * tabela "Kernzahlen" da página alemã, capturada em 26/08/2026
   * (`fontes/gradually-deepfake-statistiken-capturado-2026-08-26.txt`): Signicat, Entrust
   * Onfido, Entrust, Sumsub, Sumsub, Resemble AI, iProov — 7 fontes, todas fornecedoras.
   */
  'deepfake-procedencia-sete': {
    max: 7,
    groups: [
      {
        label: 'Quem produziu as 7 cifras centrais',
        // Ouro = papel de DESTAQUE da marca (PADRAO-ARTIGO §3): esta é a figura da tese do
        // artigo, e é o único gráfico de barras em que o ouro aparece.
        color: '#a48f65',
        items: [
          { name: 'Fornecedor do setor', value: 7, valueLabel: '7 de 7', emphasis: true },
          { name: 'Órgão oficial', value: 0, valueLabel: 'nenhuma' },
          { name: 'Academia', value: 0, valueLabel: 'nenhuma' },
          { name: 'Pesquisa pública', value: 0, valueLabel: 'nenhuma' },
        ],
      },
    ],
  },
  /**
   * `deepfake-deteccao-humana` — autodeclaração contra desempenho medido. PROCEDÊNCIA: BSI
   * Cybersicherheitsmonitor 2026 (n=3.060, campo 6-12/jan/2026); Cetic.br Painel TIC (n=5.250,
   * ago-set/2025, confiança E teste objetivo); Bitkom (n=1.006, jun/2026); Diel et al. 2024
   * (DOI 10.1016/j.chbr.2024.100538, k=67, n=86.155); Stockner et al. 2026
   * (DOI 10.1016/j.chbah.2026.100332, k=51, n=13.197, geral e subgrupo treinado).
   */
  'deepfake-deteccao-humana': {
    max: 70,
    groups: [
      {
        label: 'O que dizem sobre si',
        color: '#fbbf24',
        items: [
          { name: 'Acham que reconhecem', value: 47, valueLabel: '47%' },
          { name: 'Se dizem confiantes', value: 41, valueLabel: '41%' },
          { name: 'Acham que identificam', value: 34, valueLabel: '34%' },
        ],
      },
      {
        label: 'O que acertam quando medido',
        color: '#60a5fa',
        items: [
          { name: 'Treinados p/ detectar', value: 62.2, valueLabel: '62,2%' },
          { name: 'Rostos (Stockner)', value: 56.1, valueLabel: '56,1%' },
          { name: 'Geral (Diel)', value: 55.5, valueLabel: '55,5%' },
          { name: 'Teste objetivo (BR)', value: 17, valueLabel: '17%', emphasis: true },
        ],
      },
    ],
  },
  /**
   * `deepfake-resemble-categorias` — MEDIÇÃO PRÓPRIA. PROCEDÊNCIA: tabela dinâmica do painel
   * público resemble.ai/learn/deepfake-incident-database, janela "All time", contada pelo autor
   * em 28/08/2026; 2.266 incidentes, com a soma de cada linha conferindo com o total exibido.
   * Método e cru: `fontes/medicao-propria-resemble-dashboard-2026-08-28.md`.
   */
  'deepfake-resemble-categorias': {
    max: 800,
    groups: [
      {
        label: 'Os 2.266 incidentes do banco, por tipo de ataque',
        color: '#60a5fa',
        items: [
          { name: 'Marca e reputação', value: 757, valueLabel: '33,4%' },
          { name: 'Desinformação', value: 447, valueLabel: '19,7%' },
          { name: 'Fraude ao consumidor', value: 382, valueLabel: '16,9%' },
          { name: 'Imagem íntima', value: 256, valueLabel: '11,3%' },
          { name: 'Abuso infantil', value: 239, valueLabel: '10,5%' },
          { name: 'Fraude corporativa', value: 185, valueLabel: '8,2%', emphasis: true },
        ],
      },
    ],
  },
  'deepfake-procedencia-sete-en': {
    max: 7,
    groups: [
      {
        label: 'Who produced the 7 core figures',
        color: '#a48f65',
        items: [
          { name: 'Industry vendor', value: 7, valueLabel: '7 of 7', emphasis: true },
          { name: 'Official body', value: 0, valueLabel: 'none' },
          { name: 'Academia', value: 0, valueLabel: 'none' },
          { name: 'Public survey', value: 0, valueLabel: 'none' },
        ],
      },
    ],
  },
  'deepfake-deteccao-humana-en': {
    max: 70,
    groups: [
      {
        label: 'What they say about themselves',
        color: '#fbbf24',
        items: [
          { name: 'Think they recognise', value: 47, valueLabel: '47%' },
          { name: 'Say they are confident', value: 41, valueLabel: '41%' },
          { name: 'Think they identify', value: 34, valueLabel: '34%' },
        ],
      },
      {
        label: 'What they get right when measured',
        color: '#60a5fa',
        items: [
          { name: 'Trained to detect', value: 62.2, valueLabel: '62.2%' },
          { name: 'Faces (Stockner)', value: 56.1, valueLabel: '56.1%' },
          { name: 'Overall (Diel)', value: 55.5, valueLabel: '55.5%' },
          { name: 'Objective test (BR)', value: 17, valueLabel: '17%', emphasis: true },
        ],
      },
    ],
  },
  'deepfake-resemble-categorias-en': {
    max: 800,
    groups: [
      {
        label: 'The 2,266 incidents, by attack type',
        color: '#60a5fa',
        items: [
          { name: 'Brand & reputation', value: 757, valueLabel: '33.4%' },
          { name: 'Disinformation', value: 447, valueLabel: '19.7%' },
          { name: 'Consumer fraud', value: 382, valueLabel: '16.9%' },
          { name: 'Intimate imagery', value: 256, valueLabel: '11.3%' },
          { name: 'Child abuse', value: 239, valueLabel: '10.5%' },
          { name: 'Corporate fraud', value: 185, valueLabel: '8.2%', emphasis: true },
        ],
      },
    ],
  },
  'deepfake-procedencia-sete-es': {
    max: 7,
    groups: [
      {
        label: 'Quién produjo las 7 cifras centrales',
        color: '#a48f65',
        items: [
          { name: 'Proveedor del sector', value: 7, valueLabel: '7 de 7', emphasis: true },
          { name: 'Organismo oficial', value: 0, valueLabel: 'ninguna' },
          { name: 'Academia', value: 0, valueLabel: 'ninguna' },
          { name: 'Encuesta pública', value: 0, valueLabel: 'ninguna' },
        ],
      },
    ],
  },
  'deepfake-deteccao-humana-es': {
    max: 70,
    groups: [
      {
        label: 'Lo que dicen sobre sí mismos',
        color: '#fbbf24',
        items: [
          { name: 'Creen reconocer', value: 47, valueLabel: '47%' },
          { name: 'Se dicen confiados', value: 41, valueLabel: '41%' },
          { name: 'Creen identificar', value: 34, valueLabel: '34%' },
        ],
      },
      {
        label: 'Lo que aciertan cuando se mide',
        color: '#60a5fa',
        items: [
          { name: 'Entrenados', value: 62.2, valueLabel: '62,2%' },
          { name: 'Rostros (Stockner)', value: 56.1, valueLabel: '56,1%' },
          { name: 'General (Diel)', value: 55.5, valueLabel: '55,5%' },
          { name: 'Prueba objetiva (BR)', value: 17, valueLabel: '17%', emphasis: true },
        ],
      },
    ],
  },
  'deepfake-resemble-categorias-es': {
    max: 800,
    groups: [
      {
        label: 'Los 2.266 incidentes, por tipo de ataque',
        color: '#60a5fa',
        items: [
          { name: 'Marca y reputación', value: 757, valueLabel: '33,4%' },
          { name: 'Desinformación', value: 447, valueLabel: '19,7%' },
          { name: 'Fraude al consumidor', value: 382, valueLabel: '16,9%' },
          { name: 'Imagen íntima', value: 256, valueLabel: '11,3%' },
          { name: 'Abuso infantil', value: 239, valueLabel: '10,5%' },
          { name: 'Fraude corporativo', value: 185, valueLabel: '8,2%', emphasis: true },
        ],
      },
    ],
  },
  'deepfake-procedencia-sete-it': {
    max: 7,
    groups: [
      {
        label: 'Chi ha prodotto le 7 cifre centrali',
        color: '#a48f65',
        items: [
          { name: 'Fornitore del settore', value: 7, valueLabel: '7 su 7', emphasis: true },
          { name: 'Organo ufficiale', value: 0, valueLabel: 'nessuna' },
          { name: 'Accademia', value: 0, valueLabel: 'nessuna' },
          { name: 'Indagine pubblica', value: 0, valueLabel: 'nessuna' },
        ],
      },
    ],
  },
  'deepfake-deteccao-humana-it': {
    max: 70,
    groups: [
      {
        label: 'Ciò che dicono di sé',
        color: '#fbbf24',
        items: [
          { name: 'Credono di riconoscere', value: 47, valueLabel: '47%' },
          { name: 'Si dicono sicuri', value: 41, valueLabel: '41%' },
          { name: 'Credono di identificare', value: 34, valueLabel: '34%' },
        ],
      },
      {
        label: 'Ciò che azzeccano quando si misura',
        color: '#60a5fa',
        items: [
          { name: 'Addestrati', value: 62.2, valueLabel: '62,2%' },
          { name: 'Volti (Stockner)', value: 56.1, valueLabel: '56,1%' },
          { name: 'Generale (Diel)', value: 55.5, valueLabel: '55,5%' },
          { name: 'Test oggettivo (BR)', value: 17, valueLabel: '17%', emphasis: true },
        ],
      },
    ],
  },
  'deepfake-resemble-categorias-it': {
    max: 800,
    groups: [
      {
        label: 'I 2.266 incidenti, per tipo di attacco',
        color: '#60a5fa',
        items: [
          { name: 'Marchio e reputazione', value: 757, valueLabel: '33,4%' },
          { name: 'Disinformazione', value: 447, valueLabel: '19,7%' },
          { name: 'Frode ai consumatori', value: 382, valueLabel: '16,9%' },
          { name: 'Immagini intime', value: 256, valueLabel: '11,3%' },
          { name: 'Abuso su minori', value: 239, valueLabel: '10,5%' },
          { name: 'Frode aziendale', value: 185, valueLabel: '8,2%', emphasis: true },
        ],
      },
    ],
  },


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
   * ranking: a tese do artigo é que os números foram medidos sob regras
   * diferentes (recorde humano da World Athletics; competição oficial dos Jogos;
   * evento-teste fora de competição; edição anterior).
   *
   * PROCEDÊNCIA (verificada 24/08/2026): 9,58 s = World Athletics (Bolt,
   * Berlim, 16/08/2009). 9,39 s = Tiangong Ultra, bateria 9 do grupo grande,
   * 22/08 (Global Times 1368761; placar lido no frame ~18 s do vídeo de
   * @TrungTPhan 2091183427303383137, "大型组100米预赛9组 9.39"). 9,47 s = Honor
   * Lightning, mesma bateria (ZOL 12358920; Ifeng 8vnwlRjYjf5). 9,32 s = Honor
   * Lightning em evento-teste preparatório, reportado pela CCTV (Reuters/Guardian
   * 22/08). 21,50 s = vencedor dos 100 m na 1.ª edição, 2025 (Wikipedia; Global
   * Times "cut from 21.50"). ADICIONADOS NO REFRESH DE 26/08/2026: 8,86 s =
   * Tiangong Ultra na semifinal (复赛) do grupo grande, 25/08 (CCTV via 京报网
   * 11932018; Global Times 1368995). 8,94 s = Honor Lightning na mesma semifinal,
   * tempo divulgado pelo fabricante (IT之家 994/197, citando @荣耀手机). 8,64 s =
   * Tiangong Ultra, FINAL do grupo grande, 26/08, recorde dos Jogos e última prova
   * da edição (Reuters via The Star; Global Times 1369085; Xinhua EN
   * 0b9df35761fe472cbdd27646d8e0d05c). Os cinco vivem no MESMO bloco azul porque
   * são a mesma régua — competição oficial; o que muda entre eles é a rodada, e a
   * rodada vai no valueLabel, não no nome (nome curto = gate de 140px). Paleta lote 7: azul = régua-tese (bateria oficial),
   * ouro = destaque (o número que viralizou), cinzas = blocos recessivos.
   * Labels em pt-BR; traduções ganham `-en/-es/-it/-he` (texto no gráfico).
   */
  'robos-2026-100m-reguas': {
    max: 24,
    groups: [
      {
        label: 'Jogos 2026 — competição oficial (bateria 22/08, semifinal 25/08, final 26/08)',
        color: '#60a5fa',
        items: [
          { name: 'Tiangong Ultra', value: 8.64, valueLabel: '8,64 s — final', emphasis: true },
          { name: 'Tiangong Ultra', value: 8.86, valueLabel: '8,86 s — semifinal' },
          { name: 'Lightning (Honor)', value: 8.94, valueLabel: '8,94 s — semifinal' },
          { name: 'Tiangong Ultra', value: 9.39, valueLabel: '9,39 s — bateria 9' },
          { name: 'Lightning (Honor)', value: 9.47, valueLabel: '9,47 s — bateria 9' },
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
        label: '2026 Games — official competition (heat 22 Aug, semifinal 25 Aug, final 26 Aug)',
        color: '#60a5fa',
        items: [
          { name: 'Tiangong Ultra', value: 8.64, valueLabel: '8.64 s — final', emphasis: true },
          { name: 'Tiangong Ultra', value: 8.86, valueLabel: '8.86 s — semifinal' },
          { name: 'Lightning (Honor)', value: 8.94, valueLabel: '8.94 s — semifinal' },
          { name: 'Tiangong Ultra', value: 9.39, valueLabel: '9.39 s — heat 9' },
          { name: 'Lightning (Honor)', value: 9.47, valueLabel: '9.47 s — heat 9' },
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
        label: 'Juegos 2026 — competición oficial (serie 22/08, semifinal 25/08, final 26/08)',
        color: '#60a5fa',
        items: [
          { name: 'Tiangong Ultra', value: 8.64, valueLabel: '8,64 s — final', emphasis: true },
          { name: 'Tiangong Ultra', value: 8.86, valueLabel: '8,86 s — semifinal' },
          { name: 'Lightning (Honor)', value: 8.94, valueLabel: '8,94 s — semifinal' },
          { name: 'Tiangong Ultra', value: 9.39, valueLabel: '9,39 s — serie 9' },
          { name: 'Lightning (Honor)', value: 9.47, valueLabel: '9,47 s — serie 9' },
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
        label: 'Giochi 2026 — competizione ufficiale (batteria 22/08, semifinale 25/08, finale 26/08)',
        color: '#60a5fa',
        items: [
          { name: 'Tiangong Ultra', value: 8.64, valueLabel: '8,64 s — finale', emphasis: true },
          { name: 'Tiangong Ultra', value: 8.86, valueLabel: '8,86 s — semifinale' },
          { name: 'Lightning (Honor)', value: 8.94, valueLabel: '8,94 s — semifinale' },
          { name: 'Tiangong Ultra', value: 9.39, valueLabel: '9,39 s — batteria 9' },
          { name: 'Lightning (Honor)', value: 9.47, valueLabel: '9,47 s — batteria 9' },
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
        label: 'משחקי 2026 — תחרות רשמית (מקצה 22/08, חצי גמר 25/08, גמר 26/08)',
        color: '#60a5fa',
        items: [
          { name: 'Tiangong Ultra', value: 8.64, valueLabel: '8.64 שניות — גמר', emphasis: true },
          { name: 'Tiangong Ultra', value: 8.86, valueLabel: '8.86 שניות — חצי גמר' },
          { name: 'Lightning (Honor)', value: 8.94, valueLabel: '8.94 שניות — חצי גמר' },
          { name: 'Tiangong Ultra', value: 9.39, valueLabel: '9.39 שניות — מקצה 9' },
          { name: 'Lightning (Honor)', value: 9.47, valueLabel: '9.47 שניות — מקצה 9' },
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
  'ia-trabalho-challenger-2026': {
    max: 40000,
    groups: [
      {
        label: 'Cortes com "IA" como motivo declarado — por mês',
        color: '#60a5fa',
        items: [
          {
            name: 'janeiro',
            value: 7624,
            valueLabel: '7.624 (derivado)',
          },
          {
            name: 'fevereiro',
            value: 4680,
            valueLabel: '4.680',
          },
          {
            name: 'março',
            value: 15341,
            valueLabel: '15.341',
          },
          {
            name: 'abril',
            value: 21490,
            valueLabel: '21.490',
          },
          {
            name: 'maio',
            value: 38579,
            valueLabel: '38.579',
          },
          {
            name: 'junho',
            value: 14029,
            valueLabel: '14.029',
          },
          {
            name: 'julho',
            value: 10970,
            valueLabel: '10.970 — 33% do mês',
          },
          {
            name: 'agosto',
            value: 3462,
            valueLabel: '3.462 — 4º motivo do mês',
            emphasis: true,
          },
        ],
      },
    ],
  },
  'ia-trabalho-cadences-medo': {
    max: 50,
    groups: [
      {
        label: 'Medo pelo próprio emprego',
        color: '#64748b',
        items: [
          {
            name: 'eu, no meu emprego',
            value: 10,
            valueLabel: '10% acham provável',
          },
        ],
      },
      {
        label: 'Medo pelo emprego do colega júnior',
        color: '#a48f65',
        items: [
          {
            name: 'o colega júnior',
            value: 33.4,
            valueLabel: 'mais de 1 em 3 — piso',
            emphasis: true,
          },
        ],
      },
    ],
  },
  'ia-trabalho-exposicao-brasil': {
    max: 30,
    groups: [
      {
        label: 'Brasil — total 37% do emprego (37 mi de postos)',
        color: '#60a5fa',
        items: [
          {
            name: 'automação plena',
            value: 2,
            valueLabel: '2%',
            emphasis: true,
          },
          {
            name: 'aumento',
            value: 13,
            valueLabel: '13%',
          },
          {
            name: 'grande incógnita',
            value: 22,
            valueLabel: '22%',
          },
        ],
      },
      {
        label: 'Média dos países ricos — total 43%',
        color: '#64748b',
        items: [
          {
            name: 'automação plena',
            value: 5,
            valueLabel: '5%',
          },
          {
            name: 'aumento',
            value: 14,
            valueLabel: '14%',
          },
          {
            name: 'grande incógnita',
            value: 24,
            valueLabel: '24%',
          },
        ],
      },
    ],
  },
  'ia-trabalho-challenger-2026-en': {
    max: 40000,
    groups: [
      {
        label: 'Cuts with "AI" as the stated reason — by month',
        color: '#60a5fa',
        items: [
          {
            name: 'January',
            value: 7624,
            valueLabel: '7,624 (derived)',
          },
          {
            name: 'February',
            value: 4680,
            valueLabel: '4,680',
          },
          {
            name: 'March',
            value: 15341,
            valueLabel: '15,341',
          },
          {
            name: 'April',
            value: 21490,
            valueLabel: '21,490',
          },
          {
            name: 'May',
            value: 38579,
            valueLabel: '38,579',
          },
          {
            name: 'June',
            value: 14029,
            valueLabel: '14,029',
          },
          {
            name: 'July',
            value: 10970,
            valueLabel: '10,970 — 33% of the month',
          },
          {
            name: 'August',
            value: 3462,
            valueLabel: '3,462 — the month\'s no. 4 reason',
            emphasis: true,
          },
        ],
      },
    ],
  },
  'ia-trabalho-cadences-medo-en': {
    max: 50,
    groups: [
      {
        label: 'Fear for one\'s own job',
        color: '#64748b',
        items: [
          {
            name: 'me, in my own job',
            value: 10,
            valueLabel: '10% think it likely',
          },
        ],
      },
      {
        label: 'Fear for the junior colleague\'s job',
        color: '#a48f65',
        items: [
          {
            name: 'junior colleague',
            value: 33.4,
            valueLabel: 'more than 1 in 3 — floor',
            emphasis: true,
          },
        ],
      },
    ],
  },
  'ia-trabalho-exposicao-brasil-en': {
    max: 30,
    groups: [
      {
        label: 'Brazil — 37% of employment (37 mi jobs)',
        color: '#60a5fa',
        items: [
          {
            name: 'full automation',
            value: 2,
            valueLabel: '2%',
            emphasis: true,
          },
          {
            name: 'augmentation',
            value: 13,
            valueLabel: '13%',
          },
          {
            name: 'the big unknown',
            value: 22,
            valueLabel: '22%',
          },
        ],
      },
      {
        label: 'Rich-country average — 43% total',
        color: '#64748b',
        items: [
          {
            name: 'full automation',
            value: 5,
            valueLabel: '5%',
          },
          {
            name: 'augmentation',
            value: 14,
            valueLabel: '14%',
          },
          {
            name: 'the big unknown',
            value: 24,
            valueLabel: '24%',
          },
        ],
      },
    ],
  },
  'ia-trabalho-challenger-2026-es': {
    max: 40000,
    groups: [
      {
        label: 'Despidos con "IA" como motivo declarado — por mes',
        color: '#60a5fa',
        items: [
          {
            name: 'enero',
            value: 7624,
            valueLabel: '7.624 (derivado)',
          },
          {
            name: 'febrero',
            value: 4680,
            valueLabel: '4.680',
          },
          {
            name: 'marzo',
            value: 15341,
            valueLabel: '15.341',
          },
          {
            name: 'abril',
            value: 21490,
            valueLabel: '21.490',
          },
          {
            name: 'mayo',
            value: 38579,
            valueLabel: '38.579',
          },
          {
            name: 'junio',
            value: 14029,
            valueLabel: '14.029',
          },
          {
            name: 'julio',
            value: 10970,
            valueLabel: '10.970 — 33% del mes',
          },
          {
            name: 'agosto',
            value: 3462,
            valueLabel: '3.462 — 4.º motivo del mes',
            emphasis: true,
          },
        ],
      },
    ],
  },
  'ia-trabalho-cadences-medo-es': {
    max: 50,
    groups: [
      {
        label: 'Miedo por el propio empleo',
        color: '#64748b',
        items: [
          {
            name: 'yo, en mi empleo',
            value: 10,
            valueLabel: '10% lo ve probable',
          },
        ],
      },
      {
        label: 'Miedo por el empleo del colega júnior',
        color: '#a48f65',
        items: [
          {
            name: 'el colega júnior',
            value: 33.4,
            valueLabel: 'más de 1 de cada 3 — piso',
            emphasis: true,
          },
        ],
      },
    ],
  },
  'ia-trabalho-exposicao-brasil-es': {
    max: 30,
    groups: [
      {
        label: 'Brasil — total 37% del empleo (37 mi de puestos)',
        color: '#60a5fa',
        items: [
          {
            name: 'automatización',
            value: 2,
            valueLabel: '2%',
            emphasis: true,
          },
          {
            name: 'aumento',
            value: 13,
            valueLabel: '13%',
          },
          {
            name: 'gran incógnita',
            value: 22,
            valueLabel: '22%',
          },
        ],
      },
      {
        label: 'Media de los países ricos — total 43%',
        color: '#64748b',
        items: [
          {
            name: 'automatización',
            value: 5,
            valueLabel: '5%',
          },
          {
            name: 'aumento',
            value: 14,
            valueLabel: '14%',
          },
          {
            name: 'gran incógnita',
            value: 24,
            valueLabel: '24%',
          },
        ],
      },
    ],
  },
  'ia-trabalho-challenger-2026-it': {
    max: 40000,
    groups: [
      {
        label: 'Tagli con "IA" come motivo dichiarato — per mese',
        color: '#60a5fa',
        items: [
          {
            name: 'gennaio',
            value: 7624,
            valueLabel: '7.624 (derivato)',
          },
          {
            name: 'febbraio',
            value: 4680,
            valueLabel: '4.680',
          },
          {
            name: 'marzo',
            value: 15341,
            valueLabel: '15.341',
          },
          {
            name: 'aprile',
            value: 21490,
            valueLabel: '21.490',
          },
          {
            name: 'maggio',
            value: 38579,
            valueLabel: '38.579',
          },
          {
            name: 'giugno',
            value: 14029,
            valueLabel: '14.029',
          },
          {
            name: 'luglio',
            value: 10970,
            valueLabel: '10.970 — 33% del mese',
          },
          {
            name: 'agosto',
            value: 3462,
            valueLabel: '3.462 — 4° motivo del mese',
            emphasis: true,
          },
        ],
      },
    ],
  },
  'ia-trabalho-cadences-medo-it': {
    max: 50,
    groups: [
      {
        label: 'Paura per il proprio posto',
        color: '#64748b',
        items: [
          {
            name: 'io, nel mio posto',
            value: 10,
            valueLabel: 'probabile per il 10%',
          },
        ],
      },
      {
        label: 'Paura per il posto del collega junior',
        color: '#a48f65',
        items: [
          {
            name: 'il collega junior',
            value: 33.4,
            valueLabel: 'più di 1 su 3 — minimo',
            emphasis: true,
          },
        ],
      },
    ],
  },
  'ia-trabalho-exposicao-brasil-it': {
    max: 30,
    groups: [
      {
        label: 'Brasile — totale 37% del lavoro (37 mln di posti)',
        color: '#60a5fa',
        items: [
          {
            name: 'automazione piena',
            value: 2,
            valueLabel: '2%',
            emphasis: true,
          },
          {
            name: 'aumento',
            value: 13,
            valueLabel: '13%',
          },
          {
            name: 'grande incognita',
            value: 22,
            valueLabel: '22%',
          },
        ],
      },
      {
        label: 'Media dei paesi ricchi — totale 43%',
        color: '#64748b',
        items: [
          {
            name: 'automazione piena',
            value: 5,
            valueLabel: '5%',
          },
          {
            name: 'aumento',
            value: 14,
            valueLabel: '14%',
          },
          {
            name: 'grande incognita',
            value: 24,
            valueLabel: '24%',
          },
        ],
      },
    ],
  },
  'ia-trabalho-challenger-2026-he': {
    max: 40000,
    groups: [
      {
        label: 'פיטורים עם AI כסיבה מוצהרת — לפי חודש',
        color: '#60a5fa',
        items: [
          {
            name: 'ינואר',
            value: 7624,
            valueLabel: '7,624 (נגזר)',
          },
          {
            name: 'פברואר',
            value: 4680,
            valueLabel: '4,680',
          },
          {
            name: 'מרץ',
            value: 15341,
            valueLabel: '15,341',
          },
          {
            name: 'אפריל',
            value: 21490,
            valueLabel: '21,490',
          },
          {
            name: 'מאי',
            value: 38579,
            valueLabel: '38,579',
          },
          {
            name: 'יוני',
            value: 14029,
            valueLabel: '14,029',
          },
          {
            name: 'יולי',
            value: 10970,
            valueLabel: '10,970 — 33% מהחודש',
          },
          {
            name: 'אוגוסט',
            value: 3462,
            valueLabel: '3,462 — הסיבה הרביעית בחודש',
            emphasis: true,
          },
        ],
      },
    ],
  },
  'ia-trabalho-cadences-medo-he': {
    max: 50,
    groups: [
      {
        label: 'פחד למקום העבודה של עצמי',
        color: '#64748b',
        items: [
          {
            name: 'אני, במשרה שלי',
            value: 10,
            valueLabel: '10% סבורים שסביר',
          },
        ],
      },
      {
        label: 'פחד למשרת העמית הזוטר',
        color: '#a48f65',
        items: [
          {
            name: 'העמית הזוטר',
            value: 33.4,
            valueLabel: 'יותר מאחד מכל 3 — רצפה',
            emphasis: true,
          },
        ],
      },
    ],
  },
  'ia-trabalho-exposicao-brasil-he': {
    max: 30,
    groups: [
      {
        label: 'ברזיל — סך הכול 37% מהתעסוקה (37 מיליון משרות)',
        color: '#60a5fa',
        items: [
          {
            name: 'אוטומציה מלאה',
            value: 2,
            valueLabel: '2%',
            emphasis: true,
          },
          {
            name: 'הגברה',
            value: 13,
            valueLabel: '13%',
          },
          {
            name: 'אי־הידוע הגדול',
            value: 22,
            valueLabel: '22%',
          },
        ],
      },
      {
        label: 'ממוצע המדינות העשירות — סך הכול 43%',
        color: '#64748b',
        items: [
          {
            name: 'אוטומציה מלאה',
            value: 5,
            valueLabel: '5%',
          },
          {
            name: 'הגברה',
            value: 14,
            valueLabel: '14%',
          },
          {
            name: 'אי־הידוע הגדול',
            value: 24,
            valueLabel: '24%',
          },
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
  'deepfake-cinco-reguas-he': {
    orientation: 'chain',
    steps: [
      {
        label: 'פלטפורמת הספק — סופרת מה שעבר דרכה',
        detail: 'מודדת בדיוק את תיק הלקוחות שלה. לא את המדינה ולא את האוכלוסייה.',
      },
      {
        label: 'סקר דעת קהל במימון הספק',
        detail: 'שואל מנהלי הונאה מה הם חושבים שראו. מודד תפיסה, לא אירועים.',
      },
      {
        label: 'גוף רשמי — תלונה שנרשמה',
        detail: 'מודד את מה שדווח, מסונן דרך מילות הטופס. תת־דיווח מובטח.',
      },
      {
        label: 'אקדמיה עם שיפוט עמיתים',
        detail: 'ניסוי עם אנשים אמיתיים ורווח סמך. מודד יכולת, לא שכיחות.',
      },
      {
        label: 'מפקד אוכלוסין עם מבחן אובייקטיבי — שואל ואז בודק',
        detail: 'התכנון היחיד שמראה את המרחק בין מה שחושבים לבין מה שקולעים.',
        alert: true,
      },
    ],
  },

  'deepfake-cinco-reguas-com-dados-he': {
    orientation: 'chain',
    steps: [
      {
        label: 'פלטפורמת הספק: מתקפה כל 5 דקות; 88% קריפטו',
        detail: '‏Entrust ו-Sumsub, נמדד בפלטפורמה שלהן. מתאר את הלקוחות, לא את הפשע.',
      },
      {
        label: 'סקר במימון הספק: 6.5% מניסיונות ההונאה',
        detail: '‏Signicat/Censuswide, 1,206 מנהלים מעריכים את החברות שלהם. אפס מתקפות נספרו.',
      },
      {
        label: 'גוף רשמי: 893 מיליון דולר — 4.28% מההפסדים',
        detail: '‏FBI IC3 2025. התווית היא "מכיל אזכור ל-AI": מתאר טקסט, לא עבירה.',
      },
      {
        label: 'אקדמיה: 55.5% ו-56.1% דיוק אנושי',
        detail: '‏Diel 2024 ו-Stockner 2026. במטא־אנליזה הגדולה הרווח חוצה את 50% — הטלת מטבע.',
      },
      {
        label: 'מבחן אובייקטיבי: 41% בטוחים, 17% הצליחו',
        detail: '‏Cetic.br, n=5,250. והביטחון המוצהר לא הראה שום מתאם עם ההצלחה.',
        alert: true,
      },
    ],
  },

  'deepfake-linha-do-tempo-lei-he': {
    orientation: 'timeline',
    steps: [
      { label: 'מאי 2025', detail: 'ארה"ב: הסרה 48 ש׳' },
      { label: 'פבר׳ 2026', detail: 'בריטניה: יצירה' },
      { label: 'מרץ 2026', detail: '‏TSE: האפלה 72 ש׳' },
      { label: '2 אוג׳ 2026', detail: 'אירופה: תיוג' },
      { label: '6 אוג׳ 2026', detail: 'ברזיל: סינתטי' },
    ],
  },

  /**
   * `agentes-tres-reguas-he` — a régua do artigo: três naturezas de estatística, cada uma com
   * seu modo de falha. PROCEDÊNCIA: classificação do autor; os modos de falha vêm de Gartner
   * (previsão sem amostra), METR 2025 (percepção × cronômetro) e HAL/ICLR 2026 (agente que
   * acha o gabarito).
   */
  'agentes-tres-reguas-he': {
    orientation: 'chain',
    steps: [
      {
        label: 'תחזית — מי שהפיק את המספר לא מדד כלום',
        detail: 'דעת אנליסט עם אופק. בלי מדגם: אין מה לבדוק.',
      },
      {
        label: 'הצהרה — מישהו ענה על שאלה',
        detail: 'סקר תפיסה. מודד את מה שמדווח — וטועה בכיוון האפקט.',
      },
      {
        label: 'מדידה — מישהו תזמן או הריץ מבחן',
        detail: "בנצ'מארק או ניסוי. ניתן לשחזור — והסוכן לומד לעקוף את הפרוקסי.",
      },
    ],
  },
  /**
   * `openai-quatro-naturezas` — a régua do artigo: toda estatística sobre a OpenAI cabe numa
   * de quatro caixas. PROCEDÊNCIA: classificação do autor sobre os 20 números centrais da
   * página alemã (apêndice de `fontes/inventario-afirmacoes-gradually.md`), cada um com o
   * arquivo de evidência.
   */
  'openai-quatro-naturezas': {
    orientation: 'chain',
    steps: [
      {
        label: 'Oficial — a própria empresa assinou, ou é registro público',
        detail: 'Post da OpenAI, comunicado de rodada, Form 990 no IRS. Verificável na fonte, com data.',
      },
      {
        label: 'Reportagem ou estimativa — alguém de fora apurou',
        detail: 'The Information, Bloomberg, WSJ, Sacra. Vale o que vale a apuração; muda quando ela muda.',
      },
      {
        label: 'Meta — alguém disse que pretende',
        detail: 'Documento interno vazado ou frase em podcast. Não aconteceu; é intenção com data.',
      },
      {
        label: 'Órfão — ninguém sabe de onde veio',
        detail: 'Circula com fonte citada, mas a fonte não contém o número. Não entra em texto nenhum.',
        alert: true,
      },
    ],
  },

  /**
   * `openai-rodadas-linha-do-tempo` — as rodadas que mudaram de escala. PROCEDÊNCIA: CNBC
   * (11/12/2025, pledge de US$ 1 bi em 2015, só US$ 130 mi recebidos até 2019); Microsoft
   * US$ 1 bi (jul/2019) e US$ 10 bi (jan/2023), amplamente noticiados (categoria B); TechCrunch
   * (02/10/2024: US$ 6,6 bi a US$ 157 bi); OpenAI (31/03/2026: US$ 122 bi a US$ 852 bi, post
   * oficial lido no Wayback).
   */
  'openai-rodadas-linha-do-tempo': {
    orientation: 'timeline',
    steps: [
      { label: 'dez/2015', detail: '1 bi prometido' },
      { label: 'jul/2019', detail: 'Microsoft: 1 bi' },
      { label: 'jan/2023', detail: 'Microsoft: 10 bi' },
      { label: 'out/2024', detail: '6,6 bi a 157 bi' },
      { label: 'mar/2026', detail: '122 bi a 852 bi', alert: true },
    ],
  },
  /**
   * `openai-quatro-naturezas` — a régua do artigo: toda estatística sobre a OpenAI cabe numa
   * de quatro caixas. PROCEDÊNCIA: classificação do autor sobre os 20 números centrais da
   * página alemã (apêndice de `fontes/inventario-afirmacoes-gradually.md`), cada um com o
   * arquivo de evidência.
   */
  'openai-quatro-naturezas-en': {
    orientation: 'chain',
    steps: [
      {
        label: 'Official — the company signed it, or it is public record',
        detail: 'OpenAI post, funding round, Form 990 with the IRS. Verifiable at the source, dated.',
      },
      {
        label: 'Reporting or estimate — someone outside dug it up',
        detail: 'The Information, Bloomberg, WSJ, Sacra. Only as good as the reporting; changes when it does.',
      },
      {
        label: 'Target — someone said they intend to',
        detail: 'A leaked document or a line on a podcast. Has not happened; it is intent with a date.',
      },
      {
        label: 'Orphan — no one knows where it came from',
        detail: 'Circulates with a cited source that does not contain the number. Never goes in text.',
        alert: true,
      },
    ],
  },

  /**
   * `openai-rodadas-linha-do-tempo` — as rodadas que mudaram de escala. PROCEDÊNCIA: CNBC
   * (11/12/2025, pledge de US$ 1 bi em 2015, só US$ 130 mi recebidos até 2019); Microsoft
   * US$ 1 bi (jul/2019) e US$ 10 bi (jan/2023), amplamente noticiados (categoria B); TechCrunch
   * (02/10/2024: US$ 6,6 bi a US$ 157 bi); OpenAI (31/03/2026: US$ 122 bi a US$ 852 bi, post
   * oficial lido no Wayback).
   */
  'openai-rodadas-linha-do-tempo-en': {
    orientation: 'timeline',
    steps: [
      { label: 'Dec 2015', detail: '$1bn pledged' },
      { label: 'Jul 2019', detail: 'Microsoft: $1bn' },
      { label: 'Jan 2023', detail: 'Microsoft: $10bn' },
      { label: 'Oct 2024', detail: '$6.6bn at $157bn' },
      { label: 'Mar 2026', detail: '$122bn at $852bn', alert: true },
    ],
  },
  /**
   * `openai-quatro-naturezas-es` — a régua do artigo: toda estatística sobre a OpenAI cabe numa
   * de quatro caixas. PROCEDÊNCIA: classificação do autor sobre os 20 números centrais da
   * página alemã (apêndice de `fontes/inventario-afirmacoes-gradually.md`), cada um com o
   * arquivo de evidência.
   */
  'openai-quatro-naturezas-es': {
    orientation: 'chain',
    steps: [
      {
        label: 'Oficial — la propia empresa firmó, o es registro público',
        detail: 'Post de OpenAI, comunicado de ronda, Form 990 en IRS. Verificable en la fuente, con fecha.',
      },
      {
        label: 'Reportaje o estimación — alguien de fuera investigó',
        detail: 'The Information, Bloomberg, WSJ, Sacra. Vale lo que vale la investigación; cambia con ella.',
      },
      {
        label: 'Meta — alguien dijo que pretende',
        detail: 'Documento interno filtrado o frase en un podcast. No ocurrió; es intención con fecha.',
      },
      {
        label: 'Huérfano — nadie sabe de dónde salió',
        detail: 'Circula con fuente citada, pero la fuente no contiene el número. No entra en ningún texto.',
        alert: true,
      },
    ],
  },

  /**
   * `openai-rodadas-linha-do-tempo-es` — as rodadas que mudaram de escala. PROCEDÊNCIA: CNBC
   * (11/12/2025, pledge de US$ 1 bi em 2015, só US$ 130 mi recebidos até 2019); Microsoft
   * US$ 1 bi (jul/2019) e US$ 10 bi (jan/2023), amplamente noticiados (categoria B); TechCrunch
   * (02/10/2024: US$ 6,6 bi a US$ 157 bi); OpenAI (31/03/2026: US$ 122 bi a US$ 852 bi, post
   * oficial lido no Wayback). Detail mantém a abreviação "bi" (não "mil millones") por
   * orçamento de largura do widget de timeline — ver nota no topo do arquivo.
   */
  'openai-rodadas-linha-do-tempo-es': {
    orientation: 'timeline',
    steps: [
      { label: 'dic/2015', detail: '1 bi prometido' },
      { label: 'jul/2019', detail: 'Microsoft: 1 bi' },
      { label: 'ene/2023', detail: 'Microsoft: 10 bi' },
      { label: 'oct/2024', detail: '6,6 bi a 157 bi' },
      { label: 'mar/2026', detail: '122 bi a 852 bi', alert: true },
    ],
  },
  /**
   * `openai-quatro-naturezas-it` — a régua do artigo: toda estatística sobre a OpenAI cabe numa
   * de quatro caixas. PROCEDÊNCIA: classificação do autor sobre os 20 números centrais da
   * página alemã (apêndice de `fontes/inventario-afirmacoes-gradually.md`), cada um com o
   * arquivo de evidência.
   */
  'openai-quatro-naturezas-it': {
    orientation: 'chain',
    steps: [
      {
        label: 'Ufficiale — l\'azienda ha firmato, o è registro pubblico',
        detail: 'Post dell\'OpenAI, comunicato di round, Form 990 all\'IRS. Verificabile alla fonte, con data.',
      },
      {
        label: 'Reportage o stima — qualcuno dall\'esterno ha indagato',
        detail: 'The Information, Bloomberg, WSJ, Sacra. Vale quanto vale l\'indagine; cambia se cambia.',
      },
      {
        label: 'Obiettivo — intenzione dichiarata',
        detail: 'Documento interno diffuso o frase in podcast. Non è accaduto; è intenzione con data.',
      },
      {
        label: 'Orfano — nessuno sa da dove venga',
        detail: 'Circola con fonte citata, ma la fonte non contiene il numero. Non entra in nessun testo.',
        alert: true,
      },
    ],
  },

  /**
   * `openai-rodadas-linha-do-tempo-it` — as rodadas que mudaram de escala. PROCEDÊNCIA: CNBC
   * (11/12/2025, pledge de US$ 1 bi em 2015, só US$ 130 mi recebidos até 2019); Microsoft
   * US$ 1 bi (jul/2019) e US$ 10 bi (jan/2023), amplamente noticiados (categoria B); TechCrunch
   * (02/10/2024: US$ 6,6 bi a US$ 157 bi); OpenAI (31/03/2026: US$ 122 bi a US$ 852 bi, post
   * oficial lido no Wayback).
   */
  'openai-rodadas-linha-do-tempo-it': {
    orientation: 'timeline',
    steps: [
      { label: 'dic/2015', detail: '1 mld promesso' },
      { label: 'lug/2019', detail: 'Microsoft: 1 mld' },
      { label: 'gen/2023', detail: 'Microsoft: 10 mld' },
      { label: 'ott/2024', detail: '6,6 mld a 157 mld' },
      { label: 'mar/2026', detail: '122 mld a 852 mld', alert: true },
    ],
  },
  /**
   * `openai-quatro-naturezas-he` — a régua do artigo: toda estatística sobre a OpenAI cabe numa
   * de quatro caixas. PROCEDÊNCIA: classificação do autor sobre os 20 números centrais da
   * página alemã (apêndice de `fontes/inventario-afirmacoes-gradually.md`), cada um com o
   * arquivo de evidência.
   */
  'openai-quatro-naturezas-he': {
    orientation: 'chain',
    steps: [
      {
        label: 'רשמי — החברה עצמה חתמה, או רשומה ציבורית',
        detail: 'פוסט, הודעת גיוס, Form 990 ברשות המסים. ניתן לאימות במקור, עם תאריך.',
      },
      {
        label: 'דיווח או הערכה — מישהו מבחוץ תחקר',
        detail: 'The Information, Bloomberg, WSJ, Sacra. שווה כמה שהתחקיר שווה; משתנה איתו.',
      },
      {
        label: 'יעד — מישהו אמר שהוא מתכוון',
        detail: 'מסמך פנימי שדלף או משפט בפודקאסט. לא קרה; זו כוונה עם תאריך.',
      },
      {
        label: 'יתום — אף אחד לא יודע מאיפה זה בא',
        detail: 'מסתובב עם מקור מצוטט, אבל המקור לא מכיל את המספר. לא נכנס לטקסט.',
        alert: true,
      },
    ],
  },

  /**
   * `openai-rodadas-linha-do-tempo-he` — as rodadas que mudaram de escala. PROCEDÊNCIA: CNBC
   * (11/12/2025, pledge de US$ 1 bi em 2015, só US$ 130 mi recebidos até 2019); Microsoft
   * US$ 1 bi (jul/2019) e US$ 10 bi (jan/2023), amplamente noticiados (categoria B); TechCrunch
   * (02/10/2024: US$ 6,6 bi a US$ 157 bi); OpenAI (31/03/2026: US$ 122 bi a US$ 852 bi, post
   * oficial lido no Wayback).
   */
  'openai-rodadas-linha-do-tempo-he': {
    orientation: 'timeline',
    steps: [
      { label: '12/2015', detail: '1 מיליארד הובטח' },
      { label: '07/2019', detail: 'Microsoft: 1 מיליארד' },
      { label: '01/2023', detail: 'Microsoft: 10 מיליארד' },
      { label: '10/2024', detail: '6.6 עד 157 מיליארד' },
      { label: '03/2026', detail: '122 עד 852 מיליארד', alert: true },
    ],
  },
  /**
   * `modelos-tres-definicoes` — a régua do artigo: "modelo segundo quem?". Três definições, três
   * contagens corretas e incompatíveis. PROCEDÊNCIA: Hugging Face (numTotalItems da página
   * `?pipeline_tag=text-generation`, medido em 26/08/2026); AI Index 2026 cap. 1 (Epoch AI: 93 da
   * indústria + 2 da academia em 2025; "not a census"); página alemã gradually.ai (274 de 35
   * fornecedores, base proprietária dela).
   */
  'modelos-tres-definicoes': {
    orientation: 'chain',
    steps: [
      {
        label: 'Repositório — tudo que alguém publicou com a etiqueta',
        detail: 'Hugging Face, etiqueta text-generation: 403.420 em 26/08/2026, 04:43. Conta cópia, ajuste e versão.',
      },
      {
        label: 'Notável — o que uma curadoria julgou importante',
        detail: 'Epoch AI para o AI Index de Stanford: 95 em 2025. Manual — o relatório avisa que não é censo.',
      },
      {
        label: 'Catálogo — o que um site decidiu listar',
        detail: 'A página alemã que motivou a pauta: 274 modelos de 35 fornecedores. O critério é do editor.',
      },
    ],
  },

  /**
   * `modelos-swebench-linha-do-tempo` — o benchmark de código mais citado, do nascimento ao
   * abandono pelo próprio criador. PROCEDÊNCIA: OpenAI, "Introducing SWE-bench Verified"
   * (13/08/2024); OpenAI, "Why SWE-bench Verified no longer measures frontier coding capabilities"
   * (23/02/2026, lido no Wayback); HN item 47910388 (26/04/2026, 343 pontos); Vals AI, tabela
   * "Updated 8/19/2026" (97,00% Claude Opus 5); gradually.ai/llm-statistiken (23/08/2026).
   */
  'modelos-swebench-linha-do-tempo': {
    orientation: 'timeline',
    steps: [
      { label: 'ago/2024', detail: 'OpenAI o cria' },
      { label: 'fev/2026', detail: 'OpenAI o abandona', alert: true },
      { label: 'abr/2026', detail: 'HN: 343 pontos' },
      { label: 'ago/2026', detail: 'Vals: 97% no topo' },
      { label: '23/08/2026', detail: 'Ainda é a régua' },
    ],
  },
  /**
   * `modelos-tres-definicoes` — a régua do artigo: "modelo segundo quem?". Três definições, três
   * contagens corretas e incompatíveis. PROCEDÊNCIA: Hugging Face (numTotalItems da página
   * `?pipeline_tag=text-generation`, medido em 26/08/2026); AI Index 2026 cap. 1 (Epoch AI: 93 da
   * indústria + 2 da academia em 2025; "not a census"); página alemã gradually.ai (274 de 35
   * fornecedores, base proprietária dela).
   */
  'modelos-tres-definicoes-en': {
    orientation: 'chain',
    steps: [
      {
        label: 'Repository — anything published with the tag',
        detail: 'Hugging Face, text-generation tag: 403,420 at 04:43 on Aug 26. Counts copies and fine-tunes.',
      },
      {
        label: 'Notable — what a curation judged important',
        detail: "Epoch AI for Stanford's AI Index: 95 in 2025. Manual — the report says it is not a census.",
      },
      {
        label: 'Catalog — what a site decided to list',
        detail: 'The German page behind this piece: 274 models from 35 vendors. Criterion set by the editor.',
      },
    ],
  },

  /**
   * `modelos-swebench-linha-do-tempo` — o benchmark de código mais citado, do nascimento ao
   * abandono pelo próprio criador. PROCEDÊNCIA: OpenAI, "Introducing SWE-bench Verified"
   * (13/08/2024); OpenAI, "Why SWE-bench Verified no longer measures frontier coding capabilities"
   * (23/02/2026, lido no Wayback); HN item 47910388 (26/04/2026, 343 pontos); Vals AI, tabela
   * "Updated 8/19/2026" (97,00% Claude Opus 5); gradually.ai/llm-statistiken (23/08/2026).
   */
  'modelos-swebench-linha-do-tempo-en': {
    orientation: 'timeline',
    steps: [
      { label: 'Aug 2024', detail: 'OpenAI creates it' },
      { label: 'Feb 2026', detail: 'OpenAI abandons it', alert: true },
      { label: 'Apr 2026', detail: 'HN: 343 points' },
      { label: 'Aug 2026', detail: 'Vals: 97% on top' },
      { label: 'Aug 23, 2026', detail: 'Still the ruler' },
    ],
  },
  /**
   * `modelos-tres-definicoes` — a régua do artigo: "modelo segundo quem?". Três definições, três
   * contagens corretas e incompatíveis. PROCEDÊNCIA: Hugging Face (numTotalItems da página
   * `?pipeline_tag=text-generation`, medido em 26/08/2026); AI Index 2026 cap. 1 (Epoch AI: 93 da
   * indústria + 2 da academia em 2025; "not a census"); página alemã gradually.ai (274 de 35
   * fornecedores, base proprietária dela).
   */
  'modelos-tres-definicoes-es': {
    orientation: 'chain',
    steps: [
      {
        label: 'Repositorio — todo lo que alguien publicó con la etiqueta',
        detail: 'Hugging Face, etiqueta text-generation: 403.420 el 26/08/2026, 04:43. Cuenta copia, ajuste y versión.',
      },
      {
        label: 'Notable — lo que una curaduría juzgó importante',
        detail: 'Epoch AI para el AI Index de Stanford: 95 en 2025. Manual — el informe avisa que no es un censo.',
      },
      {
        label: 'Catálogo — lo que un sitio decidió listar',
        detail: 'La página alemana que motivó la pauta: 274 modelos de 35 proveedores. El criterio es del editor.',
      },
    ],
  },

  /**
   * `modelos-swebench-linha-do-tempo` — o benchmark de código mais citado, do nascimento ao
   * abandono pelo próprio criador. PROCEDÊNCIA: OpenAI, "Introducing SWE-bench Verified"
   * (13/08/2024); OpenAI, "Why SWE-bench Verified no longer measures frontier coding capabilities"
   * (23/02/2026, lido no Wayback); HN item 47910388 (26/04/2026, 343 pontos); Vals AI, tabela
   * "Updated 8/19/2026" (97,00% Claude Opus 5); gradually.ai/llm-statistiken (23/08/2026).
   */
  'modelos-swebench-linha-do-tempo-es': {
    orientation: 'timeline',
    steps: [
      { label: 'ago/2024', detail: 'OpenAI la crea' },
      { label: 'feb/2026', detail: 'OpenAI la abandona', alert: true },
      { label: 'abr/2026', detail: 'HN: 343 puntos' },
      { label: 'ago/2026', detail: 'Vals: 97% arriba' },
      { label: '23/08/2026', detail: 'Aún es la regla' },
    ],
  },
  /**
   * `modelos-tres-definicoes-it` — a régua do artigo: "modelo segundo quem?". Três definições,
   * três contagens corretas e incompatíveis. PROCEDÊNCIA: Hugging Face (numTotalItems da página
   * `?pipeline_tag=text-generation`, medido em 26/08/2026); AI Index 2026 cap. 1 (Epoch AI: 93 da
   * indústria + 2 da academia em 2025; "not a census"); página alemã gradually.ai (274 de 35
   * fornecedores, base proprietária dela).
   */
  'modelos-tres-definicoes-it': {
    orientation: 'chain',
    steps: [
      {
        label: 'Repository — tutto quanto pubblicato con il tag',
        detail: 'Hugging Face, tag text-generation: 403.420 il 26/08/2026, ore 04:43. Conta copie e versioni.',
      },
      {
        label: 'Notevole — giudicato importante da una curatela',
        detail: "Epoch AI per l'AI Index di Stanford: 95 nel 2025. Manuale, non censimento, avverte il rapporto.",
      },
      {
        label: 'Catalogo — ciò che un sito ha deciso di elencare',
        detail: "La pagina tedesca che ha ispirato l'articolo: 274 modelli, 35 fornitori. Criterio dell'editore.",
      },
    ],
  },

  /**
   * `modelos-swebench-linha-do-tempo-it` — o benchmark de código mais citado, do nascimento ao
   * abandono pelo próprio criador. PROCEDÊNCIA: OpenAI, "Introducing SWE-bench Verified"
   * (13/08/2024); OpenAI, "Why SWE-bench Verified no longer measures frontier coding capabilities"
   * (23/02/2026, lido no Wayback); HN item 47910388 (26/04/2026, 343 pontos); Vals AI, tabela
   * "Updated 8/19/2026" (97,00% Claude Opus 5); gradually.ai/llm-statistiken (23/08/2026).
   */
  'modelos-swebench-linha-do-tempo-it': {
    orientation: 'timeline',
    steps: [
      { label: 'ago/2024', detail: 'OpenAI lo crea' },
      { label: 'feb/2026', detail: "OpenAI l'abbandona", alert: true },
      { label: 'apr/2026', detail: 'HN: 343 punti' },
      { label: 'ago/2026', detail: 'Vals: 97% in cima' },
      { label: '23/08/2026', detail: 'Ancora il metro' },
    ],
  },
  /**
   * `modelos-tres-definicoes` — a régua do artigo: "modelo segundo quem?". Três definições, três
   * contagens corretas e incompatíveis. PROCEDÊNCIA: Hugging Face (numTotalItems da página
   * `?pipeline_tag=text-generation`, medido em 26/08/2026); AI Index 2026 cap. 1 (Epoch AI: 93 da
   * indústria + 2 da academia em 2025; "not a census"); página alemã gradually.ai (274 de 35
   * fornecedores, base proprietária dela).
   */
  'modelos-tres-definicoes-he': {
    orientation: 'chain',
    steps: [
      {
        label: 'מאגר — כל מה שמישהו פרסם עם התג',
        detail: 'Hugging Face, תג text-generation: 403,420 ב-26/08/2026, 04:43. סופר עותק, כוונון וגרסה.',
      },
      {
        label: 'בולט — מה שאצירה שפטה כחשוב',
        detail: 'Epoch AI עבור ה-AI Index של סטנפורד: 95 ב-2025. ידני — הדוח מזהיר שזה לא מפקד.',
      },
      {
        label: 'קטלוג — מה שאתר החליט לרשום',
        detail: 'העמוד הגרמני שהניע את הכתבה: 274 מודלים מ-35 ספקים. הקריטריון הוא של העורך.',
      },
    ],
  },

  /**
   * `modelos-swebench-linha-do-tempo` — o benchmark de código mais citado, do nascimento ao
   * abandono pelo próprio criador. PROCEDÊNCIA: OpenAI, "Introducing SWE-bench Verified"
   * (13/08/2024); OpenAI, "Why SWE-bench Verified no longer measures frontier coding capabilities"
   * (23/02/2026, lido no Wayback); HN item 47910388 (26/04/2026, 343 pontos); Vals AI, tabela
   * "Updated 8/19/2026" (97,00% Claude Opus 5); gradually.ai/llm-statistiken (23/08/2026).
   */
  'modelos-swebench-linha-do-tempo-he': {
    orientation: 'timeline',
    steps: [
      { label: 'אוג׳ 2024', detail: 'OpenAI יוצרת אותו' },
      { label: 'פבר׳ 2026', detail: 'OpenAI נוטשת אותו', alert: true },
      { label: 'אפר׳ 2026', detail: 'HN: 343 נקודות' },
      { label: 'אוג׳ 2026', detail: 'Vals: 97% בראש' },
      { label: '23/08/2026', detail: 'עדיין הסרגל' },
    ],
  },
  /**
   * `deepfake-cinco-reguas` — a régua do artigo (degrau 1 da escada): as cinco maneiras de
   * "medir" deepfake. PROCEDÊNCIA: classificação do autor sobre a tabela "Kernzahlen" (7
   * linhas) e as 14 afirmações numéricas da página alemã capturada em 26/08/2026, cada uma
   * com o arquivo de evidência em `fontes/`.
   */
  'deepfake-cinco-reguas': {
    orientation: 'chain',
    steps: [
      {
        label: 'Plataforma do fornecedor — conta o que passou por ele',
        detail: 'Mede a carteira de clientes da empresa, com precisão. Não mede o país nem a população.',
      },
      {
        label: 'Pesquisa de opinião paga pelo fornecedor',
        detail: 'Pergunta a gestores de fraude o que acham que viram. Mede percepção, não incidente.',
      },
      {
        label: 'Órgão oficial — queixa registrada',
        detail: 'Mede o que foi denunciado, filtrado pelas palavras do formulário. Sub-registro garantido.',
      },
      {
        label: 'Academia revisada por pares',
        detail: 'Experimento com pessoas reais e intervalo de confiança. Mede capacidade, não prevalência.',
      },
      {
        label: 'Censo com teste objetivo — pergunta e depois testa',
        detail: 'O único desenho que mostra a distância entre o que a pessoa acha e o que ela acerta.',
        alert: true,
      },
    ],
  },
  /**
   * `deepfake-cinco-reguas-com-dados` — a MESMA régua do degrau 1, retomada no degrau 5 com o
   * número que cada caixa produziu (regra do PADRAO-ARTIGO: o degrau 5 repete a geometria do
   * degrau 1 com mais dados). PROCEDÊNCIA: cada cifra está conferida na seção correspondente.
   */
  'deepfake-cinco-reguas-com-dados': {
    orientation: 'chain',
    steps: [
      {
        label: 'Plataforma do fornecedor: 1 ataque a cada 5 min; 88% cripto',
        detail: 'Entrust e Sumsub, medido na própria plataforma. Descreve a clientela, não o crime.',
      },
      {
        label: 'Opinião paga pelo fornecedor: 6,5% das tentativas',
        detail: 'Signicat/Censuswide, 1.206 gestores estimando as próprias empresas. Nenhum ataque contado.',
      },
      {
        label: 'Órgão oficial: US$ 893 mi — 4,28% das perdas',
        detail: 'FBI IC3 2025. A etiqueta é "contém referência a IA": descritor de texto, não crime.',
      },
      {
        label: 'Academia: 55,5% e 56,1% de acerto humano',
        detail: 'Diel 2024 e Stockner 2026. Na maior meta-análise, o intervalo cruza os 50% — uma moeda.',
      },
      {
        label: 'Teste objetivo: 41% se dizem confiantes, 17% foram bem',
        detail: 'Cetic.br, n=5.250. E a confiança declarada não teve correlação nenhuma com o desempenho.',
        alert: true,
      },
    ],
  },
  /**
   * `deepfake-linha-do-tempo-lei` — o que está em vigor de verdade, com a data conferida no ato
   * original. PROCEDÊNCIA: Public Law 119-12 (19/05/2025); SI 2024/1188 + Data (Use and Access)
   * Act 2025, crime de criação em vigor 06/02/2026; Res.-TSE 23.755 de 02/03/2026 (texto
   * integral em `fontes/br-tse-res-23755-2026.md`); Regulamento (UE) 2024/1689 art. 50(4) e 113
   * (02/08/2026); Lei 15.487 de 06/08/2026 (DOU).
   */
  'deepfake-linha-do-tempo-lei': {
    orientation: 'timeline',
    steps: [
      { label: 'mai/2025', detail: 'EUA: remoção 48h' },
      { label: 'fev/2026', detail: 'UK: criar é crime' },
      { label: 'mar/2026', detail: 'TSE: blackout 72h' },
      { label: '2/ago/2026', detail: 'UE: rotulagem' },
      { label: '6/ago/2026', detail: 'ECA: sintético' },
    ],
  },
  'deepfake-cinco-reguas-en': {
    orientation: 'chain',
    steps: [
      {
        label: 'Vendor platform — counts what passed through it',
        detail: 'Measures its own client book, precisely. Not the country, and not the population.',
      },
      {
        label: 'Opinion survey paid for by the vendor',
        detail: 'Asks fraud managers what they think they saw. Measures perception, not incidents.',
      },
      {
        label: 'Official body — filed complaints',
        detail: 'Measures what was reported, filtered by the form wording. Under-reporting guaranteed.',
      },
      {
        label: 'Peer-reviewed academia',
        detail: 'Experiment with real people and a confidence interval. Measures ability, not prevalence.',
      },
      {
        label: 'Census with an objective test — asks, then tests',
        detail: 'The only design that shows the gap between what a person thinks and what they get right.',
        alert: true,
      },
    ],
  },
  'deepfake-cinco-reguas-com-dados-en': {
    orientation: 'chain',
    steps: [
      {
        label: 'Vendor platform: 1 attack every 5 min; 88% crypto',
        detail: 'Entrust and Sumsub, measured in-house. Describes the clientele, not the crime.',
      },
      {
        label: 'Vendor-paid opinion: 6.5% of fraud attempts',
        detail: 'Signicat/Censuswide, 1,206 managers estimating their own firms. No attack counted.',
      },
      {
        label: 'Official body: US$ 893M — 4.28% of losses',
        detail: 'FBI IC3 2025. The tag is "contains a reference to AI": a text descriptor, not a crime.',
      },
      {
        label: 'Academia: 55.5% and 56.1% human accuracy',
        detail: 'Diel 2024 and Stockner 2026. In the larger meta-analysis the interval crosses 50% — a coin flip.',
      },
      {
        label: 'Objective test: 41% feel confident, 17% did well',
        detail: 'Cetic.br, n=5,250. And declared confidence had no correlation at all with performance.',
        alert: true,
      },
    ],
  },
  'deepfake-linha-do-tempo-lei-en': {
    orientation: 'timeline',
    steps: [
      { label: 'May 2025', detail: 'US: 48h takedown' },
      { label: 'Feb 2026', detail: 'UK: creating a crime' },
      { label: 'Mar 2026', detail: 'TSE: 72h blackout' },
      { label: '2 Aug 2026', detail: 'EU: labelling' },
      { label: '6 Aug 2026', detail: 'Brazil: synthetic' },
    ],
  },
  'deepfake-cinco-reguas-es': {
    orientation: 'chain',
    steps: [
      {
        label: 'Plataforma del proveedor — cuenta lo que pasó por él',
        detail: 'Mide su cartera de clientes, con precisión. No mide el país ni la población.',
      },
      {
        label: 'Encuesta de opinión pagada por el proveedor',
        detail: 'Pregunta a gestores de fraude qué creen haber visto. Mide percepción, no incidentes.',
      },
      {
        label: 'Organismo oficial — denuncia registrada',
        detail: 'Mide lo denunciado, filtrado por las palabras del formulario. Subregistro garantizado.',
      },
      {
        label: 'Academia revisada por pares',
        detail: 'Experimento con personas reales e intervalo de confianza. Mide capacidad, no prevalencia.',
      },
      {
        label: 'Censo con prueba objetiva — pregunta y evalúa',
        detail: 'El único diseño que muestra la distancia entre lo que se cree y lo que se acierta.',
        alert: true,
      },
    ],
  },
  'deepfake-cinco-reguas-com-dados-es': {
    orientation: 'chain',
    steps: [
      {
        label: 'Plataforma: 1 ataque cada 5 min; 88% cripto',
        detail: 'Entrust y Sumsub, medido en casa. Describe la clientela, no el delito.',
      },
      {
        label: 'Opinión pagada: 6,5% de los intentos de fraude',
        detail: 'Signicat/Censuswide, 1.206 gestores estimando sus empresas. Ningún ataque contado.',
      },
      {
        label: 'Organismo oficial: 893 M US$ — 4,28% de pérdidas',
        detail: 'FBI IC3 2025. La etiqueta es "contiene una referencia a IA": descriptor, no delito.',
      },
      {
        label: 'Academia: 55,5% y 56,1% de acierto humano',
        detail: 'Diel 2024 y Stockner 2026. En el mayor metaanálisis el intervalo cruza el 50% — una moneda.',
      },
      {
        label: 'Prueba objetiva: 41% confía, 17% salió bien',
        detail: 'Cetic.br, n=5.250. Y la confianza declarada no tuvo correlación alguna con el desempeño.',
        alert: true,
      },
    ],
  },
  'deepfake-linha-do-tempo-lei-es': {
    orientation: 'timeline',
    steps: [
      { label: 'may. 2025', detail: 'EE. UU.: 48 h' },
      { label: 'feb. 2026', detail: 'RU: crear es delito' },
      { label: 'mar. 2026', detail: 'TSE: apagón 72 h' },
      { label: '2 ago. 2026', detail: 'UE: etiquetado' },
      { label: '6 ago. 2026', detail: 'Brasil: sintético' },
    ],
  },
  'deepfake-cinco-reguas-it': {
    orientation: 'chain',
    steps: [
      {
        label: 'Piattaforma del fornitore — conta ciò che vi passa',
        detail: 'Misura con precisione il proprio portafoglio clienti. Non il Paese, non la popolazione.',
      },
      {
        label: "Sondaggio d'opinione pagato dal fornitore",
        detail: 'Chiede ai responsabili cosa credono di aver visto. Misura percezione, non incidenti.',
      },
      {
        label: 'Organo ufficiale — denuncia registrata',
        detail: 'Misura ciò che è denunciato, filtrato dalle parole del modulo. Sottostima garantita.',
      },
      {
        label: 'Accademia con revisione paritaria',
        detail: 'Esperimento con persone reali e intervallo di confidenza. Misura capacità, non prevalenza.',
      },
      {
        label: 'Censimento con test oggettivo — chiede e verifica',
        detail: "L'unico disegno che mostra la distanza tra ciò che si crede e ciò che si azzecca.",
        alert: true,
      },
    ],
  },
  'deepfake-cinco-reguas-com-dados-it': {
    orientation: 'chain',
    steps: [
      {
        label: 'Piattaforma: 1 attacco ogni 5 min; 88% cripto',
        detail: 'Entrust e Sumsub, misurato in casa. Descrive la clientela, non il crimine.',
      },
      {
        label: 'Opinione pagata: 6,5% dei tentativi di frode',
        detail: 'Signicat/Censuswide, 1.206 responsabili che stimano le proprie aziende. Zero attacchi.',
      },
      {
        label: 'Organo ufficiale: 893 mln US$ — 4,28% perdite',
        detail: 'FBI IC3 2025. L\'etichetta è "contiene un riferimento all\'IA": descrittore, non reato.',
      },
      {
        label: 'Accademia: 55,5% e 56,1% di accuratezza umana',
        detail: 'Diel 2024 e Stockner 2026. Nella meta-analisi maggiore l\'intervallo attraversa il 50% — una monetina.',
      },
      {
        label: 'Test oggettivo: 41% si dice sicuro, 17% è andato bene',
        detail: 'Cetic.br, n=5.250. E la fiducia dichiarata non ha avuto alcuna correlazione con la prestazione.',
        alert: true,
      },
    ],
  },
  'deepfake-linha-do-tempo-lei-it': {
    orientation: 'timeline',
    steps: [
      { label: 'mag. 2025', detail: 'USA: rimozione 48h' },
      { label: 'feb. 2026', detail: 'UK: creare è reato' },
      { label: 'mar. 2026', detail: 'TSE: blackout 72h' },
      { label: '2 ago. 2026', detail: 'UE: etichettatura' },
      { label: '6 ago. 2026', detail: 'Brasile: sintetico' },
    ],
  },
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
  'ia-trabalho-stanford-genealogia': {
    orientation: 'timeline',
    steps: [
      {
        label: 'ago/2025',
        detail: '13% - regressão, dados até jul/2025',
      },
      {
        label: 'nov/2025',
        detail: '16% - regressão, dados até set/2025',
      },
      {
        label: 'ago/2026',
        detail: '19% - régua nova, dados até jun/2026',
        alert: true,
      },
    ],
  },
  'ia-trabalho-stanford-genealogia-en': {
    orientation: 'timeline',
    steps: [
      {
        label: 'Aug 2025',
        detail: '13% - regression, data to Jul 2025',
      },
      {
        label: 'Nov 2025',
        detail: '16% - regression, data to Sep 2025',
      },
      {
        label: 'Aug 2026',
        detail: '19% - new ruler, data to Jun 2026',
        alert: true,
      },
    ],
  },
  'ia-trabalho-stanford-genealogia-es': {
    orientation: 'timeline',
    steps: [
      {
        label: 'ago/2025',
        detail: '13% - regresión, datos a jul/2025',
      },
      {
        label: 'nov/2025',
        detail: '16% - regresión, datos a sep/2025',
      },
      {
        label: 'ago/2026',
        detail: '19% - regla nueva, datos a jun/2026',
        alert: true,
      },
    ],
  },
  'ia-trabalho-stanford-genealogia-it': {
    orientation: 'timeline',
    steps: [
      {
        label: 'ago/2025',
        detail: '13% - regressione, dati a lug/2025',
      },
      {
        label: 'nov/2025',
        detail: '16% - regressione, dati a set/2025',
      },
      {
        label: 'ago/2026',
        detail: '19% - metro nuovo, dati a giu/2026',
        alert: true,
      },
    ],
  },
  'ia-trabalho-stanford-genealogia-he': {
    orientation: 'timeline',
    steps: [
      {
        label: 'אוגוסט 2025',
        detail: '13% - רגרסיה, נתונים עד יולי 2025',
      },
      {
        label: 'נובמבר 2025',
        detail: '16% - רגרסיה, נתונים עד ספטמבר 2025',
      },
      {
        label: 'אוגוסט 2026',
        detail: '19% - סרגל חדש, נתונים עד יוני 2026',
        alert: true,
      },
    ],
  },
  /* A cadeia dos 100 trilhões. `alert` marca onde a afirmação deixou de ser
     a que a fonte primária fez. Cada elo tem link e data no corpo do artigo. */
  'glm53flash-cadeia-100t': {
    orientation: 'chain' as const,
    steps: [
      {
        label: '20/08 — a OpenCode anuncia uma semana grátis',
        detail: '"Temos capacidade para 100 T tokens por dia" — o app de terminal, sobre a promoção.',
      },
      {
        label: '22/08 — a imprensa repete: capacidade, autor desconhecido',
        detail: 'Techmeme e Wccftech: "modelo furtivo de um laboratório desconhecido". Ninguém sabia de quem era.',
      },
      {
        label: '26/08 — a SemiAnalysis troca o verbo',
        detail: '"Os 100 T tokens por dia SÃO SERVIDOS em chip chinês." Capacidade virou volume.',
        alert: true,
      },
      {
        label: '26/08 — a Wccftech põe o laboratório no lugar do app',
        detail: 'Manchete: a Zhipu "revela que rodou em GPUs chinesas SERVINDO 100 trilhões por dia".',
        alert: true,
      },
      {
        label: '27/08 — o the-decoder atribui à Z.ai',
        detail: '"A Z.ai serviu 100 trilhões de tokens por dia." O sujeito agora é o laboratório.',
        alert: true,
      },
      {
        label: '29/08 — o vídeo fecha a cadeia',
        detail: '"Ela ESTAVA SERVINDO cem trilhões de tokens por dia" — dito da Z.ai, como fato dado.',
        alert: true,
      },
    ],
  },

  /* Degrau 6 — o preço é campanha, e a campanha tem data de fim. */
  'glm53flash-precos': {
    orientation: 'timeline' as const,
    steps: [
      {
        label: 'Até 26/08',
        detail: 'Ox Alpha, semana grátis',
      },
      {
        label: '26/08',
        detail: 'Tabela: US$ 0,15 / 0,50',
      },
      {
        label: 'Hoje',
        detail: 'Metade: US$ 0,075 e 0,25',
      },
      {
        label: '09/09/2026',
        detail: 'A promoção acaba',
        alert: true,
      },
    ],
  },

  /* ── en ─────────────────────────────────────────────────────────────── */
  'glm53flash-cadeia-100t-en': {
    orientation: 'chain' as const,
    steps: [
      {
        label: 'Aug 20 — OpenCode announces a free week',
        detail: '"We have capacity for 100T tokens per day" — the terminal app, about its promotion.',
      },
      {
        label: 'Aug 22 — the press repeats: capacity, author unknown',
        detail: 'Techmeme and Wccftech: "a stealth model from an unknown AI lab". Nobody knew whose.',
      },
      {
        label: 'Aug 26 — SemiAnalysis swaps the verb',
        detail: '"The 100T tokens per day IS SERVED on Chinese chip." Capacity became volume.',
        alert: true,
      },
      {
        label: 'Aug 26 — Wccftech puts the lab in place of the app',
        detail: 'Headline: Zhipu "reveals it ran on Chinese GPUs SERVING 100 trillion per day".',
        alert: true,
      },
      {
        label: 'Aug 27 — the-decoder attributes it to Z.ai',
        detail: '"Z.ai served 100 trillion tokens a day." The subject is now the lab.',
        alert: true,
      },
      {
        label: 'Aug 29 — the video closes the chain',
        detail: '"It WAS SERVING one hundred trillion tokens a day" — said of Z.ai, as fact.',
        alert: true,
      },
    ],
  },

  'glm53flash-precos-en': {
    orientation: 'timeline' as const,
    steps: [
      {
        label: 'Until Aug 26',
        detail: 'Ox Alpha, free week',
      },
      {
        label: 'Aug 26',
        detail: 'List: US$ 0.15 / 0.50',
      },
      {
        label: 'Today',
        detail: 'Half: US$ 0.075 and 0.25',
      },
      {
        label: 'Sep 9, 2026',
        detail: 'The promotion ends',
        alert: true,
      },
    ],
  },


  /* ── es — escala larga: 100 T = 100 billones ───────────────────────── */
  'glm53flash-cadeia-100t-es': {
    orientation: 'chain' as const,
    steps: [
      {
        label: '20/08 — OpenCode anuncia una semana gratis',
        detail: '"Tenemos capacidad para 100 billones de tokens al día" — la app de terminal.',
      },
      {
        label: '22/08 — la prensa repite: capacidad, autor desconocido',
        detail: 'Techmeme y Wccftech: "modelo sigiloso de un laboratorio desconocido".',
      },
      {
        label: '26/08 — SemiAnalysis cambia el verbo',
        detail: '"Los 100 billones de tokens al día SON SERVIDOS en chip chino." Ya es volumen.',
        alert: true,
      },
      {
        label: '26/08 — Wccftech pone el laboratorio en lugar de la app',
        detail: 'Titular: Zhipu "revela que corrió en GPU chinas SIRVIENDO 100 billones al día".',
        alert: true,
      },
      {
        label: '27/08 — the-decoder se lo atribuye a Z.ai',
        detail: '"Z.ai sirvió 100 billones de tokens al día." El sujeto ya es el laboratorio.',
        alert: true,
      },
      {
        label: '29/08 — el vídeo cierra la cadena',
        detail: '"Estaba sirviendo cien billones de tokens al día" — dicho de Z.ai, como un hecho.',
        alert: true,
      },
    ],
  },

  'glm53flash-precos-es': {
    orientation: 'timeline' as const,
    steps: [
      {
        label: 'Hasta 26/08',
        detail: 'Ox Alpha, semana gratis',
      },
      {
        label: '26/08',
        detail: 'Tarifa: 0,15 / 0,50 USD',
      },
      {
        label: 'Hoy',
        detail: 'La mitad: 0,075 y 0,25',
      },
      {
        label: '09/09/2026',
        detail: 'Acaba la promoción',
        alert: true,
      },
    ],
  },


  /* ── it — escala longa: 100 T = 100.000 miliardi ───────────────────── */
  'glm53flash-cadeia-100t-it': {
    orientation: 'chain' as const,
    steps: [
      {
        label: '20/08 — OpenCode annuncia una settimana gratuita',
        detail: '"Abbiamo capacità per 100.000 miliardi di token al giorno" — l\'app da terminale.',
      },
      {
        label: '22/08 — la stampa ripete: capacità, autore sconosciuto',
        detail: 'Techmeme e Wccftech: "modello furtivo di un laboratorio sconosciuto".',
      },
      {
        label: '26/08 — SemiAnalysis cambia il verbo',
        detail: '"I 100.000 miliardi al giorno SONO SERVITI su chip cinese." Ora è volume.',
        alert: true,
      },
      {
        label: '26/08 — Wccftech mette il laboratorio al posto dell\'app',
        detail: 'Titolo: Zhipu "rivela di aver girato su GPU cinesi SERVENDO 100.000 miliardi".',
        alert: true,
      },
      {
        label: '27/08 — the-decoder lo attribuisce a Z.ai',
        detail: '"Z.ai ha servito 100.000 miliardi di token al giorno." Ora il soggetto è il lab.',
        alert: true,
      },
      {
        label: '29/08 — il video chiude la catena',
        detail: '"Stava servendo centomila miliardi di token al giorno" — detto di Z.ai, come fatto.',
        alert: true,
      },
    ],
  },

  'glm53flash-precos-it': {
    orientation: 'timeline' as const,
    steps: [
      {
        label: 'Fino al 26/08',
        detail: 'Ox Alpha, settimana gratis',
      },
      {
        label: '26/08',
        detail: 'Listino: 0,15 / 0,50 USD',
      },
      {
        label: 'Oggi',
        detail: 'La metà: 0,075 e 0,25',
      },
      {
        label: '09/09/2026',
        detail: 'La promozione finisce',
        alert: true,
      },
    ],
  },


  /* ── he — o `StepFlowDiagram` e do SITE e sua geometria e LTR por coordenada
     absoluta: espelhar exigiria mexer no componente publicado, e espelhamento
     parcial e pior que nenhum (limitacao declarada no `marca-dagua-claude`).
     Datas SO em numero: rotulo que mistura mes em hebraico com algarismo
     latino e reordenado pelo bidi — "2 באוג׳ 2026" saiu "2 2026 באוג׳". */
  'glm53flash-cadeia-100t-he': {
    orientation: 'chain' as const,
    steps: [
      {
        label: '‏20/08 — OpenCode מכריזה על שבוע חינם',
        detail: '"יש לנו קיבולת ל‑100 טריליון טוקנים ביום" — אפליקציית הטרמינל, על המבצע.',
      },
      {
        label: '22/08 — העיתונות חוזרת: קיבולת, מחבר לא ידוע',
        detail: '‏Techmeme ו‑Wccftech: "מודל חשאי ממעבדה לא ידועה". איש לא ידע של מי.',
      },
      {
        label: '‏26/08 — SemiAnalysis מחליפה את הפועל',
        detail: '"‏100 הטריליון ביום משורתים על שבב סיני." קיבולת הפכה לנפח.',
        alert: true,
      },
      {
        label: '‏26/08 — Wccftech שמה את המעבדה במקום האפליקציה',
        detail: 'כותרת: Zhipu "חושפת שרצה על GPU סיניים ומשרתת 100 טריליון ביום".',
        alert: true,
      },
      {
        label: '‏27/08 — the-decoder מייחס ל‑Z.ai',
        detail: '"‏Z.ai שירתה 100 טריליון טוקנים ביום." הנושא עכשיו הוא המעבדה.',
        alert: true,
      },
      {
        label: '29/08 — הסרטון סוגר את השרשרת',
        detail: '"היא שירתה מאה טריליון טוקנים ביום" — נאמר על Z.ai, כעובדה גמורה.',
        alert: true,
      },
    ],
  },

  /* Ordem INVERTIDA de proposito: a geometria da linha do tempo e LTR por coordenada
     absoluta (limitacao declarada no `marca-dagua-claude`), entao quem le da direita para
     a esquerda so encontra a cronologia na ordem certa se o dataset vier ao contrario —
     mesma correcao que as pilulas do `TextVsFileDiagram` receberam em 2026-08-15. O ambar
     segue no marco certo (09/09), que agora nasce a esquerda. */
  'glm53flash-precos-he': {
    orientation: 'timeline' as const,
    steps: [
      {
        label: '09/09/2026',
        detail: 'המבצע נגמר',
        alert: true,
      },
      {
        label: 'היום',
        detail: 'חצי: 0.075 / 0.25',
      },
      {
        label: '26/08',
        detail: 'מחירון: 0.15 / 0.50',
      },
      {
        label: 'עד 26/08',
        detail: '‏Ox Alpha, שבוע חינם',
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


/* ═══════════════════════════════════════════════════════════════════════
   1. `costLadderDatasets` — o componente NOVO deste artigo.
   Colar o `interface` + o `Record` junto dos outros, em `artigos-charts.ts`.
   ═══════════════════════════════════════════════════════════════════════ */

export interface CostLadderRow {
  /** Rótulo da linha. Orçamento medido: 196 px na Fahkwang. */
  label: string;
  /** Segunda linha do rótulo. Orçamento medido: 196 px. */
  sublabel?: string;
  /** Comprimento da barra, na unidade da cena. */
  work: number;
  /** Segundo segmento empilhado, mesma unidade. */
  workExtra?: number;
  /** O número que fecha a linha, já formatado. Orçamento medido: 122 px. */
  bill: string;
  /** Nota curta à direita. Orçamento medido: 98 px. */
  nota?: string;
  /** Linha-tese: recebe o ouro da marca. */
  destaque?: boolean;
  /** Linha "fora da conversa": cinza recessivo. */
  recessiva?: boolean;
}

export interface CostLadderDataset {
  /** Cabeçalho da coluna da barra. Divide 410 px com o `billLabel`. */
  workLabel: string;
  /** Cabeçalho da coluna do número. Divide 410 px com o `workLabel`. */
  billLabel: string;
  /** Cabeçalho da coluna da nota. Orçamento medido: 98 px. */
  notaLabel?: string;
  rows: readonly CostLadderRow[];
  /** Linha vertical de referência, na escala das barras. */
  referencia?: { valor: number; texto: string };
  /** Frase-conclusão desenhada dentro do SVG. Orçamento medido: 740 px. */
  conclusao: string;
}

export const costLadderDatasets: Record<string, CostLadderDataset> = {
  /* Degrau 1 — a analogia. Nenhum dado real: as PROPORÇÕES é que são as reais
     (150 contra 83 na barra = os tokens de saída; 2,87 contra 100 = o custo por
     tarefa, US$ 0,09 contra US$ 3,14). A procedência declara isso dentro do SVG. */
  'glm53flash-corridas': {
    workLabel: 'quanto cada carro rodou até o mesmo endereço',
    billLabel: 'o que o taxímetro marcou',
    rows: [
      {
        label: 'O carro caro',
        sublabel: 'rota curta, tarifa alta',
        work: 83,
        bill: 'R$ 100,00',
      },
      {
        label: 'O carro barato',
        sublabel: 'rota longa, tarifa baixa',
        work: 150,
        bill: 'R$ 2,87',
        destaque: true,
      },
    ],
    conclusao: 'O carro barato rodou 1,8 vez mais e a conta saiu por 2,9% da do outro.',
  },

  /* Degrau 2 — a mesma figura, com os nomes e os números medidos. */
  'glm53flash-com-nomes': {
    workLabel: 'tokens de saída gastos na avaliação',
    billLabel: 'custo por tarefa',
    notaLabel: 'inteligência',
    rows: [
      {
        label: 'Claude Fable 5',
        sublabel: 'esforço máximo, raciocínio adaptativo',
        work: 83,
        bill: 'US$ 3,14',
        nota: '62 pontos',
      },
      {
        label: 'GLM-5.3-Flash',
        sublabel: '320B totais, 18B ativos, licença MIT',
        work: 150,
        bill: 'US$ 0,09',
        nota: '57 pontos',
        destaque: true,
      },
    ],
    conclusao: 'Gastou quase o dobro de tokens e a tarefa saiu por 2,9% do preço da outra.',
  },

  /* Degrau 3 — o limite: por que a gulodice de tokens não derruba a conta.
     A barra passa a medir o PREÇO do milhão de tokens de saída. */
  'glm53flash-gulodice': {
    workLabel: 'preço de tabela do milhão de tokens de saída',
    billLabel: 'a conta inteira da avaliação',
    notaLabel: 'tokens gastos',
    rows: [
      {
        label: 'Claude Fable 5',
        sublabel: 'US$ 50,00 por milhão de tokens',
        work: 50,
        bill: 'US$ 5.455,22',
        nota: '83 M',
      },
      {
        label: 'GLM-5.3-Flash',
        sublabel: 'US$ 0,50 por milhão de tokens',
        work: 0.5,
        bill: 'US$ 138,02',
        nota: '150 M',
        destaque: true,
      },
    ],
    conclusao: 'Cem vezes mais barato por token, quase o dobro de tokens: conta 39 vezes menor.',
  },

  /* Degrau 5 — a retomada da figura do degrau 1, em escala maior: os seis modelos
     que eu consegui verificar na AA. A barra volta a ser "o que se gasta" (custo
     por tarefa) e o número volta a ser o que se leva (pontos). Ordenado por índice. */
  'glm53flash-seis-modelos': {
    workLabel: 'o que cada tarefa custou',
    billLabel: 'pontos no índice',
    notaLabel: 'velocidade',
    rows: [
      {
        label: 'Claude Fable 5',
        sublabel: 'fechado, esforço máximo',
        work: 3.14,
        bill: '62',
        nota: '64,6 tok/s',
      },
      {
        label: 'GLM-5.3',
        sublabel: 'o irmão grande, de 14 de agosto',
        work: 0.68,
        bill: '60',
        nota: '69,6 tok/s',
        recessiva: true,
      },
      {
        label: 'Kimi K3',
        sublabel: 'pesos abertos, esforço máximo',
        work: 0.84,
        bill: '60',
        nota: '37,8 tok/s',
        recessiva: true,
      },
      {
        label: 'GLM-5.3-Flash',
        sublabel: 'pesos abertos, licença MIT',
        work: 0.09,
        bill: '57',
        nota: '42,5 tok/s',
        destaque: true,
      },
      {
        label: 'Gemini 3.7 Flash',
        sublabel: 'fechado, esforço alto',
        work: 0.4,
        bill: '56',
        nota: '279,4 tok/s',
      },
      {
        label: 'GPT-5.6 Luna',
        sublabel: 'fechado, esforço máximo',
        work: 0.05,
        bill: '52',
        nota: '126,4 tok/s',
      },
    ],
    conclusao: 'O Flash não é o mais barato por tarefa, e é o segundo mais lento da lista.',
  },

  /* Degrau 5b — a consequência: o que "pesos abertos" pede de memória.
     Só os PESOS. O cache de contexto do Flash não foi publicado por ninguém —
     e é justamente a parcela que o artigo /artigos/ia-local-por-vram mostrou faltar.
     Faixas (3 e 4 bits) entram pelo PISO da faixa; o texto declara a faixa inteira. */
  'glm53flash-memoria': {
    workLabel: 'memória que só os pesos ocupam',
    billLabel: 'numa máquina de 128 GB',
    rows: [
      {
        label: '1 bit',
        sublabel: 'a menor quantização publicada',
        work: 100,
        bill: 'cabe',
      },
      {
        label: '3 bits',
        sublabel: 'faixa de 128 a 150 GB',
        work: 128,
        bill: 'no limite',
      },
      {
        label: '4 bits (Q4_K_XL)',
        sublabel: 'faixa de 162 a 210 GB',
        work: 162,
        bill: 'não cabe',
      },
      {
        label: 'os pesos publicados',
        sublabel: '62 arquivos, 328,3 GB em FP8',
        work: 328,
        bill: 'não cabe',
        destaque: true,
      },
      {
        label: '16 bits (BF16)',
        sublabel: 'a precisão original de treino',
        work: 650,
        bill: 'não cabe',
        recessiva: true,
      },
    ],
    referencia: { valor: 128, texto: '128 GB: o teto de um laptop de topo' },
    conclusao: 'Só a menor quantização cabe num laptop — e nenhuma conta aqui inclui o cache.',
  },

  /* ── en ────────────────────────────────────────────────────────────────
     Traducao dos ROTULOS; nenhum numero muda. Separador decimal do ingles
     (ponto) e milhar por virgula: US$ 5,455.22. */
  'glm53flash-corridas-en': {
    workLabel: 'how far each car drove to the same address',
    billLabel: 'what the meter read',
    rows: [
      {
        label: 'The expensive car',
        sublabel: 'short route, high fare',
        work: 83,
        bill: 'US$ 100.00',
      },
      {
        label: 'The cheap car',
        sublabel: 'long route, low fare',
        work: 150,
        bill: 'US$ 2.87',
        destaque: true,
      },
    ],
    conclusao: 'The cheap car drove 1.8 times further and its fare was 2.9% of the other.',
  },

  'glm53flash-com-nomes-en': {
    workLabel: 'output tokens spent on the evaluation',
    billLabel: 'cost per task',
    notaLabel: 'intelligence',
    rows: [
      {
        label: 'Claude Fable 5',
        sublabel: 'max effort, adaptive reasoning',
        work: 83,
        bill: 'US$ 3.14',
        nota: '62 points',
      },
      {
        label: 'GLM-5.3-Flash',
        sublabel: '320B total, 18B active, MIT license',
        work: 150,
        bill: 'US$ 0.09',
        nota: '57 points',
        destaque: true,
      },
    ],
    conclusao: 'It spent nearly twice the tokens and the task cost 2.9% of the price.',
  },

  'glm53flash-gulodice-en': {
    workLabel: 'list price per million output tokens',
    billLabel: 'the whole bill for the evaluation',
    notaLabel: 'tokens spent',
    rows: [
      {
        label: 'Claude Fable 5',
        sublabel: 'US$ 50.00 per million tokens',
        work: 50,
        bill: 'US$ 5,455.22',
        nota: '83 M',
      },
      {
        label: 'GLM-5.3-Flash',
        sublabel: 'US$ 0.50 per million tokens',
        work: 0.5,
        bill: 'US$ 138.02',
        nota: '150 M',
        destaque: true,
      },
    ],
    conclusao: 'A hundred times cheaper per token, twice the tokens: a bill 39 times smaller.',
  },

  'glm53flash-seis-modelos-en': {
    workLabel: 'what each task cost',
    billLabel: 'points on the index',
    notaLabel: 'speed',
    rows: [
      {
        label: 'Claude Fable 5',
        sublabel: 'closed, max effort',
        work: 3.14,
        bill: '62',
        nota: '64.6 tok/s',
      },
      {
        label: 'GLM-5.3',
        sublabel: 'the big brother, from August 14',
        work: 0.68,
        bill: '60',
        nota: '69.6 tok/s',
        recessiva: true,
      },
      {
        label: 'Kimi K3',
        sublabel: 'open weights, max effort',
        work: 0.84,
        bill: '60',
        nota: '37.8 tok/s',
        recessiva: true,
      },
      {
        label: 'GLM-5.3-Flash',
        sublabel: 'open weights, MIT license',
        work: 0.09,
        bill: '57',
        nota: '42.5 tok/s',
        destaque: true,
      },
      {
        label: 'Gemini 3.7 Flash',
        sublabel: 'closed, high effort',
        work: 0.4,
        bill: '56',
        nota: '279.4 tok/s',
      },
      {
        label: 'GPT-5.6 Luna',
        sublabel: 'closed, max effort',
        work: 0.05,
        bill: '52',
        nota: '126.4 tok/s',
      },
    ],
    conclusao: 'Flash is not the cheapest per task, and it is the second slowest here.',
  },

  'glm53flash-memoria-en': {
    workLabel: 'memory the weights alone occupy',
    billLabel: 'on a 128 GB machine',
    rows: [
      {
        label: '1 bit',
        sublabel: 'the smallest published quantization',
        work: 100,
        bill: 'fits',
      },
      {
        label: '3 bits',
        sublabel: 'range of 128 to 150 GB',
        work: 128,
        bill: 'at the limit',
      },
      {
        label: '4 bits (Q4_K_XL)',
        sublabel: 'range of 162 to 210 GB',
        work: 162,
        bill: 'does not fit',
      },
      {
        label: 'the published weights',
        sublabel: '62 files, 328.3 GB in FP8',
        work: 328,
        bill: 'does not fit',
        destaque: true,
      },
      {
        label: '16 bits (BF16)',
        sublabel: 'the original training precision',
        work: 650,
        bill: 'does not fit',
        recessiva: true,
      },
    ],
    referencia: { valor: 128, texto: '128 GB: the ceiling of a top-end laptop' },
    conclusao: 'Only the smallest quantization fits a laptop — and none of these include cache.',
  },


  /* ── es ────────────────────────────────────────────────────────────────
     ESCALA LARGA: 10^14 = 100 billones (nao "trilhoes"). Numero com virgula
     decimal e ponto de milhar; moeda depois do numero, como no `summary`. */
  'glm53flash-corridas-es': {
    workLabel: 'cuánto recorrió cada coche hasta la misma dirección',
    billLabel: 'lo que marcó el taxímetro',
    rows: [
      {
        label: 'El coche caro',
        sublabel: 'ruta corta, tarifa alta',
        work: 83,
        bill: '100,00 USD',
      },
      {
        label: 'El coche barato',
        sublabel: 'ruta larga, tarifa baja',
        work: 150,
        bill: '2,87 USD',
        destaque: true,
      },
    ],
    conclusao: 'El coche barato recorrió 1,8 veces más y la cuenta salió por el 2,9 % de la otra.',
  },

  'glm53flash-com-nomes-es': {
    workLabel: 'tokens de salida gastados en la evaluación',
    billLabel: 'coste por tarea',
    notaLabel: 'inteligencia',
    rows: [
      {
        label: 'Claude Fable 5',
        sublabel: 'modo adaptativo, esfuerzo máximo',
        work: 83,
        bill: '3,14 USD',
        nota: '62 puntos',
      },
      {
        label: 'GLM-5.3-Flash',
        sublabel: '320.000 M totales, 18.000 M activos',
        work: 150,
        bill: '0,09 USD',
        nota: '57 puntos',
        destaque: true,
      },
    ],
    conclusao: 'Gastó casi el doble de tokens y la tarea salió por el 2,9 % del precio de la otra.',
  },

  'glm53flash-gulodice-es': {
    workLabel: 'tarifa del millón de tokens de salida',
    billLabel: 'la cuenta entera de la evaluación',
    notaLabel: 'tokens gastados',
    rows: [
      {
        label: 'Claude Fable 5',
        sublabel: '50,00 USD por millón de tokens',
        work: 50,
        bill: '5.455,22 USD',
        nota: '83 M',
      },
      {
        label: 'GLM-5.3-Flash',
        sublabel: '0,50 USD por millón de tokens',
        work: 0.5,
        bill: '138,02 USD',
        nota: '150 M',
        destaque: true,
      },
    ],
    conclusao: 'Cien veces más barato por token, casi el doble de tokens: cuenta 39 veces menor.',
  },

  'glm53flash-seis-modelos-es': {
    workLabel: 'lo que costó cada tarea',
    billLabel: 'puntos en el índice',
    notaLabel: 'velocidad',
    rows: [
      {
        label: 'Claude Fable 5',
        sublabel: 'cerrado, esfuerzo máximo',
        work: 3.14,
        bill: '62',
        nota: '64,6 tok/s',
      },
      {
        label: 'GLM-5.3',
        sublabel: 'el hermano mayor, del 14 de agosto',
        work: 0.68,
        bill: '60',
        nota: '69,6 tok/s',
        recessiva: true,
      },
      {
        label: 'Kimi K3',
        sublabel: 'pesos abiertos, esfuerzo máximo',
        work: 0.84,
        bill: '60',
        nota: '37,8 tok/s',
        recessiva: true,
      },
      {
        label: 'GLM-5.3-Flash',
        sublabel: 'pesos abiertos, licencia MIT',
        work: 0.09,
        bill: '57',
        nota: '42,5 tok/s',
        destaque: true,
      },
      {
        label: 'Gemini 3.7 Flash',
        sublabel: 'cerrado, esfuerzo alto',
        work: 0.4,
        bill: '56',
        nota: '279,4 tok/s',
      },
      {
        label: 'GPT-5.6 Luna',
        sublabel: 'cerrado, esfuerzo máximo',
        work: 0.05,
        bill: '52',
        nota: '126,4 tok/s',
      },
    ],
    conclusao: 'El Flash no es el más barato por tarea, y es el segundo más lento de la lista.',
  },

  'glm53flash-memoria-es': {
    workLabel: 'memoria que solo los pesos ocupan',
    billLabel: 'en una máquina de 128 GB',
    rows: [
      {
        label: '1 bit',
        sublabel: 'la menor cuantización publicada',
        work: 100,
        bill: 'cabe',
      },
      {
        label: '3 bits',
        sublabel: 'franja de 128 a 150 GB',
        work: 128,
        bill: 'en el límite',
      },
      {
        label: '4 bits (Q4_K_XL)',
        sublabel: 'franja de 162 a 210 GB',
        work: 162,
        bill: 'no cabe',
      },
      {
        label: 'los pesos publicados',
        sublabel: '62 archivos, 328,3 GB en FP8',
        work: 328,
        bill: 'no cabe',
        destaque: true,
      },
      {
        label: '16 bits (BF16)',
        sublabel: 'la precisión original de entrenamiento',
        work: 650,
        bill: 'no cabe',
        recessiva: true,
      },
    ],
    referencia: { valor: 128, texto: '128 GB: el techo de un portátil de gama alta' },
    conclusao: 'Solo la menor cuantización cabe en un portátil — y ninguna cuenta incluye la caché.',
  },


  /* ── it ────────────────────────────────────────────────────────────────
     ESCALA LONGA: 10^14 = 100.000 miliardi (nao "trilioni"). Virgula decimal,
     ponto de milhar, moeda depois do numero. */
  'glm53flash-corridas-it': {
    workLabel: 'quanto ha percorso ogni auto fino allo stesso indirizzo',
    billLabel: 'quanto segnava il tassametro',
    rows: [
      {
        label: 'L\'auto cara',
        sublabel: 'percorso corto, tariffa alta',
        work: 83,
        bill: '100,00 USD',
      },
      {
        label: 'L\'auto economica',
        sublabel: 'percorso lungo, tariffa bassa',
        work: 150,
        bill: '2,87 USD',
        destaque: true,
      },
    ],
    conclusao: 'L\'auto economica ha percorso 1,8 volte di più e il conto è il 2,9% dell\'altro.',
  },

  'glm53flash-com-nomes-it': {
    workLabel: 'token in uscita spesi nella valutazione',
    billLabel: 'costo per attività',
    notaLabel: 'intelligenza',
    rows: [
      {
        label: 'Claude Fable 5',
        sublabel: 'sforzo massimo, ragionamento adattivo',
        work: 83,
        bill: '3,14 USD',
        nota: '62 punti',
      },
      {
        label: 'GLM-5.3-Flash',
        sublabel: '320 mld totali, 18 mld attivi, licenza MIT',
        work: 150,
        bill: '0,09 USD',
        nota: '57 punti',
        destaque: true,
      },
    ],
    conclusao: 'Ha speso quasi il doppio dei token e l\'attività è costata il 2,9% del prezzo.',
  },

  'glm53flash-gulodice-it': {
    workLabel: 'prezzo di listino del milione di token in uscita',
    billLabel: 'l\'intero conto della valutazione',
    notaLabel: 'token spesi',
    rows: [
      {
        label: 'Claude Fable 5',
        sublabel: '50,00 USD per milione di token',
        work: 50,
        bill: '5.455,22 USD',
        nota: '83 M',
      },
      {
        label: 'GLM-5.3-Flash',
        sublabel: '0,50 USD per milione di token',
        work: 0.5,
        bill: '138,02 USD',
        nota: '150 M',
        destaque: true,
      },
    ],
    conclusao: 'Cento volte più economico per token, doppio dei token: conto 39 volte più basso.',
  },

  'glm53flash-seis-modelos-it': {
    workLabel: 'quanto è costata ogni attività',
    billLabel: 'punti nell\'indice',
    notaLabel: 'velocità',
    rows: [
      {
        label: 'Claude Fable 5',
        sublabel: 'chiuso, sforzo massimo',
        work: 3.14,
        bill: '62',
        nota: '64,6 tok/s',
      },
      {
        label: 'GLM-5.3',
        sublabel: 'il fratello maggiore, del 14 agosto',
        work: 0.68,
        bill: '60',
        nota: '69,6 tok/s',
        recessiva: true,
      },
      {
        label: 'Kimi K3',
        sublabel: 'pesi aperti, sforzo massimo',
        work: 0.84,
        bill: '60',
        nota: '37,8 tok/s',
        recessiva: true,
      },
      {
        label: 'GLM-5.3-Flash',
        sublabel: 'pesi aperti, licenza MIT',
        work: 0.09,
        bill: '57',
        nota: '42,5 tok/s',
        destaque: true,
      },
      {
        label: 'Gemini 3.7 Flash',
        sublabel: 'chiuso, sforzo alto',
        work: 0.4,
        bill: '56',
        nota: '279,4 tok/s',
      },
      {
        label: 'GPT-5.6 Luna',
        sublabel: 'chiuso, sforzo massimo',
        work: 0.05,
        bill: '52',
        nota: '126,4 tok/s',
      },
    ],
    conclusao: 'Il Flash non è il più economico per attività, ed è il secondo più lento.',
  },

  'glm53flash-memoria-it': {
    workLabel: 'memoria che occupano i soli pesi',
    billLabel: 'su una macchina da 128 GB',
    rows: [
      {
        label: '1 bit',
        sublabel: 'la quantizzazione più piccola pubblicata',
        work: 100,
        bill: 'ci sta',
      },
      {
        label: '3 bit',
        sublabel: 'fascia da 128 a 150 GB',
        work: 128,
        bill: 'al limite',
      },
      {
        label: '4 bit (Q4_K_XL)',
        sublabel: 'fascia da 162 a 210 GB',
        work: 162,
        bill: 'non ci sta',
      },
      {
        label: 'i pesi pubblicati',
        sublabel: '62 file, 328,3 GB in FP8',
        work: 328,
        bill: 'non ci sta',
        destaque: true,
      },
      {
        label: '16 bit (BF16)',
        sublabel: 'la precisione originale di addestramento',
        work: 650,
        bill: 'non ci sta',
        recessiva: true,
      },
    ],
    referencia: { valor: 128, texto: '128 GB: il tetto di un portatile di fascia alta' },
    conclusao: 'Solo la quantizzazione più piccola sta in un portatile — e senza la cache.',
  },


  /* ── he ────────────────────────────────────────────────────────────────
     RTL. O `CostLadder` nasce com `direction:'ltr'` no <svg> e
     `unicode-bidi:'plaintext'` em CADA <text>: cada rotulo pega a direcao do
     seu primeiro caractere forte. Numero com PONTO decimal e moeda depois
     ("0.09 דולר"), como no artigo `glm-5-3` ja publicado em hebraico.
     Escala curta: 10^14 = 100 טריליון. */
  'glm53flash-corridas-he': {
    workLabel: 'כמה נסעה כל מונית לאותה כתובת',
    billLabel: 'מה שהמונה הראה',
    rows: [
      {
        label: 'המונית היקרה',
        sublabel: 'מסלול קצר, תעריף גבוה',
        work: 83,
        bill: '100.00 דולר',
      },
      {
        label: 'המונית הזולה',
        sublabel: 'מסלול ארוך, תעריף נמוך',
        work: 150,
        bill: '2.87 דולר',
        destaque: true,
      },
    ],
    conclusao: 'המונית הזולה נסעה פי 1.8 והחשבון יצא 2.9% מזה של השנייה.',
  },

  'glm53flash-com-nomes-he': {
    workLabel: 'טוקנים ביציאה שהוצאו בהערכה',
    billLabel: 'עלות למשימה',
    notaLabel: 'אינטליגנציה',
    rows: [
      {
        label: 'Claude Fable 5',
        sublabel: 'מאמץ מרבי, חשיבה מסתגלת',
        work: 83,
        bill: '3.14 דולר',
        nota: '62 נקודות',
      },
      {
        label: 'GLM-5.3-Flash',
        sublabel: '320 מיליארד סה״כ, 18 פעילים, MIT',
        work: 150,
        bill: '0.09 דולר',
        nota: '57 נקודות',
        destaque: true,
      },
    ],
    conclusao: 'הוציא כמעט כפול טוקנים והמשימה עלתה 2.9% מהמחיר של השנייה.',
  },

  'glm53flash-gulodice-he': {
    workLabel: 'מחיר מחירון למיליון טוקנים ביציאה',
    billLabel: 'כל חשבון ההערכה',
    notaLabel: 'טוקנים שהוצאו',
    rows: [
      {
        label: 'Claude Fable 5',
        sublabel: '50.00 דולר למיליון טוקנים',
        work: 50,
        bill: '5,455.22 דולר',
        nota: '83 מיליון',
      },
      {
        label: 'GLM-5.3-Flash',
        sublabel: '0.50 דולר למיליון טוקנים',
        work: 0.5,
        bill: '138.02 דולר',
        nota: '150 מיליון',
        destaque: true,
      },
    ],
    conclusao: 'פי מאה זול יותר לטוקן, כמעט כפול טוקנים: חשבון קטן פי 39.',
  },

  'glm53flash-seis-modelos-he': {
    workLabel: 'כמה עלתה כל משימה',
    billLabel: 'נקודות במדד',
    notaLabel: 'מהירות',
    rows: [
      {
        label: 'Claude Fable 5',
        sublabel: 'סגור, מאמץ מרבי',
        work: 3.14,
        bill: '62',
        nota: '64.6 טוקן/ש׳',
      },
      {
        label: 'GLM-5.3',
        sublabel: 'האח הגדול, מ‑14 באוגוסט',
        work: 0.68,
        bill: '60',
        nota: '69.6 טוקן/ש׳',
        recessiva: true,
      },
      {
        label: 'Kimi K3',
        sublabel: 'משקלים פתוחים, מאמץ מרבי',
        work: 0.84,
        bill: '60',
        nota: '37.8 טוקן/ש׳',
        recessiva: true,
      },
      {
        label: 'GLM-5.3-Flash',
        sublabel: 'משקלים פתוחים, רישיון MIT',
        work: 0.09,
        bill: '57',
        nota: '42.5 טוקן/ש׳',
        destaque: true,
      },
      {
        label: 'Gemini 3.7 Flash',
        sublabel: 'סגור, מאמץ גבוה',
        work: 0.4,
        bill: '56',
        nota: '279.4 טוקן/ש׳',
      },
      {
        label: 'GPT-5.6 Luna',
        sublabel: 'סגור, מאמץ מרבי',
        work: 0.05,
        bill: '52',
        nota: '126.4 טוקן/ש׳',
      },
    ],
    conclusao: '‏Flash אינו הזול ביותר למשימה, והוא השני הכי איטי ברשימה.',
  },

  'glm53flash-memoria-he': {
    workLabel: 'זיכרון שרק המשקלים תופסים',
    billLabel: 'במכונה של 128 ג׳יגה',
    rows: [
      {
        label: '1 ביט',
        sublabel: 'הקוונטיזציה הקטנה ביותר שפורסמה',
        work: 100,
        bill: 'נכנס',
      },
      {
        label: '3 ביט',
        sublabel: 'טווח של 128 עד 150 ג׳יגה',
        work: 128,
        bill: 'בגבול',
      },
      {
        label: '4 ביט (Q4_K_XL)',
        sublabel: 'טווח של 162 עד 210 ג׳יגה',
        work: 162,
        bill: 'לא נכנס',
      },
      {
        label: 'המשקלים שפורסמו',
        sublabel: '62 קבצים, 328.3 ג׳יגה ב‑FP8',
        work: 328,
        bill: 'לא נכנס',
        destaque: true,
      },
      {
        label: '16 ביט (BF16)',
        sublabel: 'דיוק האימון המקורי',
        work: 650,
        bill: 'לא נכנס',
        recessiva: true,
      },
    ],
    referencia: { valor: 128, texto: '128 ג׳יגה: התקרה של נייד עילי' },
    conclusao: 'רק הקוונטיזציה הקטנה ביותר נכנסת לנייד — ואף חשבון כאן לא כולל מטמון.',
  },

};