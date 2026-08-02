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
export const waffleDatasets: Record<string, WaffleDataset> = {
  'quantas-pessoas-usam-ia-waffle': {
    categories: [
      { label: 'Offline', sublabel: '2,2 bi · 27%', color: '#3f3f46', count: 663 },
      { label: 'Online, nunca usou genAI', sublabel: '~3,7 bi · 44%', color: '#64748b', count: 1108 },
      { label: 'Usa genAI sem pagar', sublabel: '~2,3 bi · 28%', color: '#60a5fa', count: 705 },
      { label: 'Paga por IA', sublabel: '70-100 mi · ~1%', color: '#34d399', count: 20 },
      { label: 'Usa coding agents', sublabel: '10-15 mi · ~0,14%', color: '#fbbf24', count: 4 },
    ],
  },
  'quantas-pessoas-usam-ia-waffle-en': {
    categories: [
      { label: 'Offline', sublabel: '2.2bn · 27%', color: '#3f3f46', count: 663 },
      { label: 'Online, never used genAI', sublabel: '~3.7bn · 44%', color: '#64748b', count: 1108 },
      { label: 'Uses genAI without paying', sublabel: '~2.3bn · 28%', color: '#60a5fa', count: 705 },
      { label: 'Pays for AI', sublabel: '70-100m · ~1%', color: '#34d399', count: 20 },
      { label: 'Uses coding agents', sublabel: '10-15m · ~0.14%', color: '#fbbf24', count: 4 },
    ],
  },
  'quantas-pessoas-usam-ia-waffle-es': {
    categories: [
      { label: 'Offline', sublabel: '2200 millones · 27 %', color: '#3f3f46', count: 663 },
      { label: 'Online, nunca usó genAI', sublabel: '~3700 millones · 44 %', color: '#64748b', count: 1108 },
      { label: 'Usa genAI sin pagar', sublabel: '~2300 millones · 28 %', color: '#60a5fa', count: 705 },
      { label: 'Paga por IA', sublabel: '70-100 millones · ~1 %', color: '#34d399', count: 20 },
      { label: 'Usa coding agents', sublabel: '10-15 millones · ~0,14 %', color: '#fbbf24', count: 4 },
    ],
  },
  'quantas-pessoas-usam-ia-waffle-it': {
    categories: [
      { label: 'Offline', sublabel: '2,2 mld · 27%', color: '#3f3f46', count: 663 },
      { label: 'Online, mai usata la genAI', sublabel: '~3,7 mld · 44%', color: '#64748b', count: 1108 },
      { label: 'Usa la genAI senza pagare', sublabel: '~2,3 mld · 28%', color: '#60a5fa', count: 705 },
      { label: 'Paga per l\'IA', sublabel: '70-100 mln · ~1%', color: '#34d399', count: 20 },
      { label: 'Usa coding agents', sublabel: '10-15 mln · ~0,14%', color: '#fbbf24', count: 4 },
    ],
  },
  'quantas-pessoas-usam-ia-waffle-he': {
    categories: [
      { label: 'אופליין', sublabel: '2.2 מיליארד · 27%', color: '#3f3f46', count: 663 },
      { label: 'אונליין, מעולם לא השתמשו ב־GenAI', sublabel: '~3.7 מיליארד · 44%', color: '#64748b', count: 1108 },
      { label: 'משתמשים ב־GenAI בלי לשלם', sublabel: '~2.3 מיליארד · 28%', color: '#60a5fa', count: 705 },
      { label: 'משלמים על AI', sublabel: '70–100 מיליון · ~1%', color: '#34d399', count: 20 },
      { label: 'משתמשים ב־coding agents', sublabel: '10–15 מיליון · ~0.14%', color: '#fbbf24', count: 4 },
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
        color: '#34d399',
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
        color: '#34d399',
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
        color: '#34d399',
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
        color: '#34d399',
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
        color: '#34d399',
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
};
