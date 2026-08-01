/**
 * Séries dos gráficos usados no corpo dos posts de `/artigos`.
 *
 * Ficam aqui, e não dentro do .mdx, por uma limitação real do pipeline: o
 * `compileMDX` do next-mdx-remote entrega ao componente apenas os atributos
 * string do JSX — atributos de expressão (`series={[...]}`) chegam como
 * `undefined`. O corpo do artigo referencia a série pelo `id`; os números
 * ficam num arquivo revisável, com a procedência de cada um documentada.
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
 */
export const chartDatasets: Record<string, ChartDataset> = {
  'opus5-frontier-bench': {
    series: [
      {
        label: 'Opus 5',
        color: '#34d399',
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
        color: '#a1a1aa',
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
        color: '#34d399',
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
};
