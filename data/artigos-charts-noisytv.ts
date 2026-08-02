/**
 * Séries dos gráficos do artigo `noisy-tv-agentes`.
 *
 * Mesma razão de existir de `data/artigos-charts.ts`: o `compileMDX` do
 * next-mdx-remote entrega ao componente apenas os atributos string do JSX —
 * atributos de expressão chegam `undefined`. O corpo do artigo referencia o
 * dataset pelo `id`; os números ficam aqui, revisáveis e com procedência.
 *
 * PROCEDÊNCIA: calibração da memória do daimon, reconferida contra o
 * código-fonte em 2026-08-02 — σ=0.177 (cosseno, embedder-hash dim=32),
 * 0.108 (espalhamento do decay de 1 dia), 0.100 (1 ponto de importância),
 * 0.050 (cosseno, modelo ONNX dim=384), todos em `recall.py`;
 * `COVERAGE_DIM = 32` em `idle_process.py`; intensidade `4·g·(1-g)` em
 * `curiosity/wissenslucke.py`; temperatura 0.8 em `loop/engine.py`.
 * O repositório do daimon ainda não é público; o artigo declara isso no corpo.
 * A curva 1/sqrt(d) é teoria para vetores aleatórios independentes — o corpo
 * do artigo demonstra com snippet numpy executado em 2026-08-02.
 */

export interface BarraMedida {
  label: string;
  valor: number;
  /** 'ruido' pinta na cor de alerta; 'sinal' na cor neutra. */
  tipo: 'ruido' | 'sinal';
}

export interface SigmaVsSinalDataset {
  barras: readonly BarraMedida[];
  /** Fim do eixo X (mesma unidade adimensional do score de ranking). */
  xMax: number;
}

export interface PisoPorDimensaoDataset {
  /** Domínio do eixo X em dimensões (escala log). */
  dimDomain: readonly [number, number];
  xTicks: readonly number[];
  yMax: number;
  /** Pontos medidos no daimon, por cima da curva teórica 1/sqrt(d). */
  medidos: readonly { dim: number; sigma: number; label: string }[];
  /** Sinais que o instrumento deveria detectar (linhas horizontais). */
  sinais: readonly { valor: number; label: string }[];
}

export interface UInvertidoDataset {
  /** Ponto destacado sobre a curva 4·g·(1-g). */
  destaque: { g: number; label: string };
}

export const noisyTvCharts: {
  'noisytv-sigma-vs-sinal': SigmaVsSinalDataset;
  'noisytv-piso-por-dimensao': PisoPorDimensaoDataset;
  'noisytv-u-invertido': UInvertidoDataset;
} = {
  'noisytv-sigma-vs-sinal': {
    barras: [
      { label: 'Ruído do cosseno, dim=32 (embedder-hash)', valor: 0.177, tipo: 'ruido' },
      { label: 'Sinal: decaimento de 1 dia inteiro de idade', valor: 0.108, tipo: 'sinal' },
      { label: 'Sinal: 1 ponto inteiro de importância', valor: 0.1, tipo: 'sinal' },
      { label: 'Ruído do cosseno, dim=384 (modelo ONNX)', valor: 0.05, tipo: 'ruido' },
    ],
    xMax: 0.2,
  },

  'noisytv-piso-por-dimensao': {
    dimDomain: [8, 512],
    xTicks: [8, 16, 32, 64, 128, 256, 512],
    yMax: 0.4,
    medidos: [
      { dim: 32, sigma: 0.177, label: 'medido: 0,177 (dim=32)' },
      { dim: 384, sigma: 0.05, label: 'medido: 0,050 (dim=384)' },
    ],
    sinais: [
      { valor: 0.108, label: 'sinal: 1 dia de decaimento (0,108)' },
      { valor: 0.1, label: 'sinal: 1 ponto de importância (0,100)' },
    ],
  },

  'noisytv-u-invertido': {
    destaque: {
      g: 0.177,
      label: 'lacuna-fantasma: só ruído (g=0,177) -> intensidade 0,58',
    },
  },
};
