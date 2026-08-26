/**
 * Dados do UtilizationCurveChart — módulo `data/utilization-curve.ts` do site.
 * GERADO por gera_charts.py sobre calc_mix.py / calc_util.py — não editar à mão.
 * Eixos log-log: x = utilização (fração do tempo gerando), y = US$/Mtok de saída.
 * `assumido` = mix chat 3:1, só o Spark (a curva que eu tinha desenhado);
 * `medido` = mix medido (piso), 3 máquinas + âncoras + o 1 % esmaecido.
 * Âncoras: utilização da carga do arquétipo na curva do Spark, no MESMO mix da cena.
 * Uma chave por idioma (pt-br sem sufixo; -en -es -it -he) — rótulos por idioma.
 */

export interface CurveSeries { label: string; color: string; dashed: boolean; points: readonly (readonly [number, number])[] }
export interface CurveAnchor { label: string; u: number; cost: number }
export interface CurveScene {
  mix: string;
  /** Separadores do idioma para os ticks — o componente não sabe o locale. */
  sep: { thousands: string; decimal: string; pctSpace: string };
  series: readonly CurveSeries[];
  api: { label: string; cost: number };
  anchors: readonly CurveAnchor[];
  ghost: { label: string; u: number; cost: number };
  xDomain: readonly [number, number]; yDomain: readonly [number, number];
  xTicks: readonly number[]; yTicks: readonly number[];
}

export const utilizationCurveDatasets: Record<string, Record<string, CurveScene>> = {
  'tokens-por-dolar-curva': {
    "assumido": {
      "mix": "3,0:1",
      "sep": {
        "thousands": ".",
        "decimal": ",",
        "pctSpace": " "
      },
      "series": [
        {
          "label": "DGX Spark",
          "color": "#a48f65",
          "dashed": false,
          "points": [
            [
              0.0001,
              6273.412
            ],
            [
              0.0002,
              3136.748
            ],
            [
              0.0005,
              1254.75
            ],
            [
              0.001,
              627.417
            ],
            [
              0.002,
              313.751
            ],
            [
              0.005,
              125.551
            ],
            [
              0.01,
              62.817
            ],
            [
              0.02,
              31.451
            ],
            [
              0.05,
              12.631
            ],
            [
              0.1,
              6.358
            ],
            [
              0.2,
              3.221
            ],
            [
              0.5,
              1.339
            ],
            [
              1.0,
              0.712
            ]
          ]
        }
      ],
      "api": {
        "label": "API do mesmo modelo",
        "cost": 1.05
      },
      "anchors": [],
      "ghost": {
        "label": "o 1 % que eu tinha assumido",
        "u": 0.01,
        "cost": 62.817
      },
      "xDomain": [
        0.0001,
        1
      ],
      "yDomain": [
        0.3,
        10000
      ],
      "xTicks": [
        0.0001,
        0.001,
        0.01,
        0.1,
        1
      ],
      "yTicks": [
        1,
        10,
        100,
        1000,
        10000
      ]
    },
    "medido": {
      "mix": "5,6:1",
      "sep": {
        "thousands": ".",
        "decimal": ",",
        "pctSpace": " "
      },
      "series": [
        {
          "label": "NVIDIA DGX Spark",
          "color": "#a48f65",
          "dashed": false,
          "points": [
            [
              0.0001,
              6728.417
            ],
            [
              0.0002,
              3364.254
            ],
            [
              0.0005,
              1345.756
            ],
            [
              0.001,
              672.923
            ],
            [
              0.002,
              336.507
            ],
            [
              0.005,
              134.657
            ],
            [
              0.01,
              67.374
            ],
            [
              0.02,
              33.732
            ],
            [
              0.05,
              13.547
            ],
            [
              0.1,
              6.819
            ],
            [
              0.2,
              3.454
            ],
            [
              0.5,
              1.436
            ],
            [
              1.0,
              0.763
            ]
          ]
        },
        {
          "label": "RTX PRO 6000 + PC",
          "color": "#fbbf24",
          "dashed": false,
          "points": [
            [
              0.0001,
              7910.95
            ],
            [
              0.0002,
              3955.536
            ],
            [
              0.0005,
              1582.288
            ],
            [
              0.001,
              791.205
            ],
            [
              0.002,
              395.664
            ],
            [
              0.005,
              158.339
            ],
            [
              0.01,
              79.23
            ],
            [
              0.02,
              39.676
            ],
            [
              0.05,
              15.944
            ],
            [
              0.1,
              8.033
            ],
            [
              0.2,
              4.078
            ],
            [
              0.5,
              1.704
            ],
            [
              1.0,
              0.913
            ]
          ]
        },
        {
          "label": "Mac M5 Ultra (projeção)",
          "color": "#64748b",
          "dashed": true,
          "points": [
            [
              0.0001,
              6753.947
            ],
            [
              0.0002,
              3377.05
            ],
            [
              0.0005,
              1350.912
            ],
            [
              0.001,
              675.533
            ],
            [
              0.002,
              337.843
            ],
            [
              0.005,
              135.23
            ],
            [
              0.01,
              67.692
            ],
            [
              0.02,
              33.923
            ],
            [
              0.05,
              13.661
            ],
            [
              0.1,
              6.908
            ],
            [
              0.2,
              3.531
            ],
            [
              0.5,
              1.505
            ],
            [
              1.0,
              0.829
            ]
          ]
        }
      ],
      "api": {
        "label": "API do mesmo modelo",
        "cost": 1.434
      },
      "anchors": [
        {
          "label": "Chat mediano (~1.800 tok/dia)",
          "u": 0.000403172,
          "cost": 1668.939
        },
        {
          "label": "Chat intenso (~18 mil tok/dia)",
          "u": 0.00403172,
          "cost": 166.975
        },
        {
          "label": "Agente medido aqui (1,35 M tok/dia)",
          "u": 0.302446,
          "cost": 2.315
        }
      ],
      "ghost": {
        "label": "o 1 % que eu tinha assumido",
        "u": 0.01,
        "cost": 67.374
      },
      "xDomain": [
        0.0001,
        1
      ],
      "yDomain": [
        0.3,
        10000
      ],
      "xTicks": [
        0.0001,
        0.001,
        0.01,
        0.1,
        1
      ],
      "yTicks": [
        1,
        10,
        100,
        1000,
        10000
      ]
    }
  },
  'tokens-por-dolar-curva-en': {
    "assumido": {
      "mix": "3.0:1",
      "sep": {
        "thousands": ",",
        "decimal": ".",
        "pctSpace": ""
      },
      "series": [
        {
          "label": "DGX Spark",
          "color": "#a48f65",
          "dashed": false,
          "points": [
            [
              0.0001,
              6273.412
            ],
            [
              0.0002,
              3136.748
            ],
            [
              0.0005,
              1254.75
            ],
            [
              0.001,
              627.417
            ],
            [
              0.002,
              313.751
            ],
            [
              0.005,
              125.551
            ],
            [
              0.01,
              62.817
            ],
            [
              0.02,
              31.451
            ],
            [
              0.05,
              12.631
            ],
            [
              0.1,
              6.358
            ],
            [
              0.2,
              3.221
            ],
            [
              0.5,
              1.339
            ],
            [
              1.0,
              0.712
            ]
          ]
        }
      ],
      "api": {
        "label": "API for the same model",
        "cost": 1.05
      },
      "anchors": [],
      "ghost": {
        "label": "the 1% I had assumed",
        "u": 0.01,
        "cost": 62.817
      },
      "xDomain": [
        0.0001,
        1
      ],
      "yDomain": [
        0.3,
        10000
      ],
      "xTicks": [
        0.0001,
        0.001,
        0.01,
        0.1,
        1
      ],
      "yTicks": [
        1,
        10,
        100,
        1000,
        10000
      ]
    },
    "medido": {
      "mix": "5.6:1",
      "sep": {
        "thousands": ",",
        "decimal": ".",
        "pctSpace": ""
      },
      "series": [
        {
          "label": "NVIDIA DGX Spark",
          "color": "#a48f65",
          "dashed": false,
          "points": [
            [
              0.0001,
              6728.417
            ],
            [
              0.0002,
              3364.254
            ],
            [
              0.0005,
              1345.756
            ],
            [
              0.001,
              672.923
            ],
            [
              0.002,
              336.507
            ],
            [
              0.005,
              134.657
            ],
            [
              0.01,
              67.374
            ],
            [
              0.02,
              33.732
            ],
            [
              0.05,
              13.547
            ],
            [
              0.1,
              6.819
            ],
            [
              0.2,
              3.454
            ],
            [
              0.5,
              1.436
            ],
            [
              1.0,
              0.763
            ]
          ]
        },
        {
          "label": "RTX PRO 6000 + PC",
          "color": "#fbbf24",
          "dashed": false,
          "points": [
            [
              0.0001,
              7910.95
            ],
            [
              0.0002,
              3955.536
            ],
            [
              0.0005,
              1582.288
            ],
            [
              0.001,
              791.205
            ],
            [
              0.002,
              395.664
            ],
            [
              0.005,
              158.339
            ],
            [
              0.01,
              79.23
            ],
            [
              0.02,
              39.676
            ],
            [
              0.05,
              15.944
            ],
            [
              0.1,
              8.033
            ],
            [
              0.2,
              4.078
            ],
            [
              0.5,
              1.704
            ],
            [
              1.0,
              0.913
            ]
          ]
        },
        {
          "label": "Mac M5 Ultra (projection)",
          "color": "#64748b",
          "dashed": true,
          "points": [
            [
              0.0001,
              6753.947
            ],
            [
              0.0002,
              3377.05
            ],
            [
              0.0005,
              1350.912
            ],
            [
              0.001,
              675.533
            ],
            [
              0.002,
              337.843
            ],
            [
              0.005,
              135.23
            ],
            [
              0.01,
              67.692
            ],
            [
              0.02,
              33.923
            ],
            [
              0.05,
              13.661
            ],
            [
              0.1,
              6.908
            ],
            [
              0.2,
              3.531
            ],
            [
              0.5,
              1.505
            ],
            [
              1.0,
              0.829
            ]
          ]
        }
      ],
      "api": {
        "label": "API for the same model",
        "cost": 1.434
      },
      "anchors": [
        {
          "label": "Median chat (~1,800 tok/day)",
          "u": 0.000403172,
          "cost": 1668.939
        },
        {
          "label": "Heavy chat (~18K tok/day)",
          "u": 0.00403172,
          "cost": 166.975
        },
        {
          "label": "Agent measured here (1.35M/day)",
          "u": 0.302446,
          "cost": 2.315
        }
      ],
      "ghost": {
        "label": "the 1% I had assumed",
        "u": 0.01,
        "cost": 67.374
      },
      "xDomain": [
        0.0001,
        1
      ],
      "yDomain": [
        0.3,
        10000
      ],
      "xTicks": [
        0.0001,
        0.001,
        0.01,
        0.1,
        1
      ],
      "yTicks": [
        1,
        10,
        100,
        1000,
        10000
      ]
    }
  },
  'tokens-por-dolar-curva-es': {
    "assumido": {
      "mix": "3,0:1",
      "sep": {
        "thousands": ".",
        "decimal": ",",
        "pctSpace": " "
      },
      "series": [
        {
          "label": "DGX Spark",
          "color": "#a48f65",
          "dashed": false,
          "points": [
            [
              0.0001,
              6273.412
            ],
            [
              0.0002,
              3136.748
            ],
            [
              0.0005,
              1254.75
            ],
            [
              0.001,
              627.417
            ],
            [
              0.002,
              313.751
            ],
            [
              0.005,
              125.551
            ],
            [
              0.01,
              62.817
            ],
            [
              0.02,
              31.451
            ],
            [
              0.05,
              12.631
            ],
            [
              0.1,
              6.358
            ],
            [
              0.2,
              3.221
            ],
            [
              0.5,
              1.339
            ],
            [
              1.0,
              0.712
            ]
          ]
        }
      ],
      "api": {
        "label": "API del mismo modelo",
        "cost": 1.05
      },
      "anchors": [],
      "ghost": {
        "label": "el 1 % que yo había supuesto",
        "u": 0.01,
        "cost": 62.817
      },
      "xDomain": [
        0.0001,
        1
      ],
      "yDomain": [
        0.3,
        10000
      ],
      "xTicks": [
        0.0001,
        0.001,
        0.01,
        0.1,
        1
      ],
      "yTicks": [
        1,
        10,
        100,
        1000,
        10000
      ]
    },
    "medido": {
      "mix": "5,6:1",
      "sep": {
        "thousands": ".",
        "decimal": ",",
        "pctSpace": " "
      },
      "series": [
        {
          "label": "NVIDIA DGX Spark",
          "color": "#a48f65",
          "dashed": false,
          "points": [
            [
              0.0001,
              6728.417
            ],
            [
              0.0002,
              3364.254
            ],
            [
              0.0005,
              1345.756
            ],
            [
              0.001,
              672.923
            ],
            [
              0.002,
              336.507
            ],
            [
              0.005,
              134.657
            ],
            [
              0.01,
              67.374
            ],
            [
              0.02,
              33.732
            ],
            [
              0.05,
              13.547
            ],
            [
              0.1,
              6.819
            ],
            [
              0.2,
              3.454
            ],
            [
              0.5,
              1.436
            ],
            [
              1.0,
              0.763
            ]
          ]
        },
        {
          "label": "RTX PRO 6000 + PC",
          "color": "#fbbf24",
          "dashed": false,
          "points": [
            [
              0.0001,
              7910.95
            ],
            [
              0.0002,
              3955.536
            ],
            [
              0.0005,
              1582.288
            ],
            [
              0.001,
              791.205
            ],
            [
              0.002,
              395.664
            ],
            [
              0.005,
              158.339
            ],
            [
              0.01,
              79.23
            ],
            [
              0.02,
              39.676
            ],
            [
              0.05,
              15.944
            ],
            [
              0.1,
              8.033
            ],
            [
              0.2,
              4.078
            ],
            [
              0.5,
              1.704
            ],
            [
              1.0,
              0.913
            ]
          ]
        },
        {
          "label": "Mac M5 Ultra (proyección)",
          "color": "#64748b",
          "dashed": true,
          "points": [
            [
              0.0001,
              6753.947
            ],
            [
              0.0002,
              3377.05
            ],
            [
              0.0005,
              1350.912
            ],
            [
              0.001,
              675.533
            ],
            [
              0.002,
              337.843
            ],
            [
              0.005,
              135.23
            ],
            [
              0.01,
              67.692
            ],
            [
              0.02,
              33.923
            ],
            [
              0.05,
              13.661
            ],
            [
              0.1,
              6.908
            ],
            [
              0.2,
              3.531
            ],
            [
              0.5,
              1.505
            ],
            [
              1.0,
              0.829
            ]
          ]
        }
      ],
      "api": {
        "label": "API del mismo modelo",
        "cost": 1.434
      },
      "anchors": [
        {
          "label": "Chat mediano (~1.800 tok/día)",
          "u": 0.000403172,
          "cost": 1668.939
        },
        {
          "label": "Chat intenso (~18 mil tok/día)",
          "u": 0.00403172,
          "cost": 166.975
        },
        {
          "label": "Agente medido aquí (1,35 M/día)",
          "u": 0.302446,
          "cost": 2.315
        }
      ],
      "ghost": {
        "label": "el 1 % que yo había supuesto",
        "u": 0.01,
        "cost": 67.374
      },
      "xDomain": [
        0.0001,
        1
      ],
      "yDomain": [
        0.3,
        10000
      ],
      "xTicks": [
        0.0001,
        0.001,
        0.01,
        0.1,
        1
      ],
      "yTicks": [
        1,
        10,
        100,
        1000,
        10000
      ]
    }
  },
  'tokens-por-dolar-curva-it': {
    "assumido": {
      "mix": "3,0:1",
      "sep": {
        "thousands": ".",
        "decimal": ",",
        "pctSpace": " "
      },
      "series": [
        {
          "label": "DGX Spark",
          "color": "#a48f65",
          "dashed": false,
          "points": [
            [
              0.0001,
              6273.412
            ],
            [
              0.0002,
              3136.748
            ],
            [
              0.0005,
              1254.75
            ],
            [
              0.001,
              627.417
            ],
            [
              0.002,
              313.751
            ],
            [
              0.005,
              125.551
            ],
            [
              0.01,
              62.817
            ],
            [
              0.02,
              31.451
            ],
            [
              0.05,
              12.631
            ],
            [
              0.1,
              6.358
            ],
            [
              0.2,
              3.221
            ],
            [
              0.5,
              1.339
            ],
            [
              1.0,
              0.712
            ]
          ]
        }
      ],
      "api": {
        "label": "API dello stesso modello",
        "cost": 1.05
      },
      "anchors": [],
      "ghost": {
        "label": "l'1 % che avevo supposto",
        "u": 0.01,
        "cost": 62.817
      },
      "xDomain": [
        0.0001,
        1
      ],
      "yDomain": [
        0.3,
        10000
      ],
      "xTicks": [
        0.0001,
        0.001,
        0.01,
        0.1,
        1
      ],
      "yTicks": [
        1,
        10,
        100,
        1000,
        10000
      ]
    },
    "medido": {
      "mix": "5,6:1",
      "sep": {
        "thousands": ".",
        "decimal": ",",
        "pctSpace": " "
      },
      "series": [
        {
          "label": "NVIDIA DGX Spark",
          "color": "#a48f65",
          "dashed": false,
          "points": [
            [
              0.0001,
              6728.417
            ],
            [
              0.0002,
              3364.254
            ],
            [
              0.0005,
              1345.756
            ],
            [
              0.001,
              672.923
            ],
            [
              0.002,
              336.507
            ],
            [
              0.005,
              134.657
            ],
            [
              0.01,
              67.374
            ],
            [
              0.02,
              33.732
            ],
            [
              0.05,
              13.547
            ],
            [
              0.1,
              6.819
            ],
            [
              0.2,
              3.454
            ],
            [
              0.5,
              1.436
            ],
            [
              1.0,
              0.763
            ]
          ]
        },
        {
          "label": "RTX PRO 6000 + PC",
          "color": "#fbbf24",
          "dashed": false,
          "points": [
            [
              0.0001,
              7910.95
            ],
            [
              0.0002,
              3955.536
            ],
            [
              0.0005,
              1582.288
            ],
            [
              0.001,
              791.205
            ],
            [
              0.002,
              395.664
            ],
            [
              0.005,
              158.339
            ],
            [
              0.01,
              79.23
            ],
            [
              0.02,
              39.676
            ],
            [
              0.05,
              15.944
            ],
            [
              0.1,
              8.033
            ],
            [
              0.2,
              4.078
            ],
            [
              0.5,
              1.704
            ],
            [
              1.0,
              0.913
            ]
          ]
        },
        {
          "label": "Mac M5 Ultra (proiezione)",
          "color": "#64748b",
          "dashed": true,
          "points": [
            [
              0.0001,
              6753.947
            ],
            [
              0.0002,
              3377.05
            ],
            [
              0.0005,
              1350.912
            ],
            [
              0.001,
              675.533
            ],
            [
              0.002,
              337.843
            ],
            [
              0.005,
              135.23
            ],
            [
              0.01,
              67.692
            ],
            [
              0.02,
              33.923
            ],
            [
              0.05,
              13.661
            ],
            [
              0.1,
              6.908
            ],
            [
              0.2,
              3.531
            ],
            [
              0.5,
              1.505
            ],
            [
              1.0,
              0.829
            ]
          ]
        }
      ],
      "api": {
        "label": "API dello stesso modello",
        "cost": 1.434
      },
      "anchors": [
        {
          "label": "Chat mediano (~1.800 tok/giorno)",
          "u": 0.000403172,
          "cost": 1668.939
        },
        {
          "label": "Chat intenso (~18 mila tok/giorno)",
          "u": 0.00403172,
          "cost": 166.975
        },
        {
          "label": "Agente misurato qui (1,35 M/giorno)",
          "u": 0.302446,
          "cost": 2.315
        }
      ],
      "ghost": {
        "label": "l'1 % che avevo supposto",
        "u": 0.01,
        "cost": 67.374
      },
      "xDomain": [
        0.0001,
        1
      ],
      "yDomain": [
        0.3,
        10000
      ],
      "xTicks": [
        0.0001,
        0.001,
        0.01,
        0.1,
        1
      ],
      "yTicks": [
        1,
        10,
        100,
        1000,
        10000
      ]
    }
  },
  'tokens-por-dolar-curva-he': {
    "assumido": {
      "mix": "3.0:1",
      "sep": {
        "thousands": ",",
        "decimal": ".",
        "pctSpace": ""
      },
      "series": [
        {
          "label": "DGX Spark",
          "color": "#a48f65",
          "dashed": false,
          "points": [
            [
              0.0001,
              6273.412
            ],
            [
              0.0002,
              3136.748
            ],
            [
              0.0005,
              1254.75
            ],
            [
              0.001,
              627.417
            ],
            [
              0.002,
              313.751
            ],
            [
              0.005,
              125.551
            ],
            [
              0.01,
              62.817
            ],
            [
              0.02,
              31.451
            ],
            [
              0.05,
              12.631
            ],
            [
              0.1,
              6.358
            ],
            [
              0.2,
              3.221
            ],
            [
              0.5,
              1.339
            ],
            [
              1.0,
              0.712
            ]
          ]
        }
      ],
      "api": {
        "label": "API של אותו מודל",
        "cost": 1.05
      },
      "anchors": [],
      "ghost": {
        "label": "ה-1% שהנחתי",
        "u": 0.01,
        "cost": 62.817
      },
      "xDomain": [
        0.0001,
        1
      ],
      "yDomain": [
        0.3,
        10000
      ],
      "xTicks": [
        0.0001,
        0.001,
        0.01,
        0.1,
        1
      ],
      "yTicks": [
        1,
        10,
        100,
        1000,
        10000
      ]
    },
    "medido": {
      "mix": "5.6:1",
      "sep": {
        "thousands": ",",
        "decimal": ".",
        "pctSpace": ""
      },
      "series": [
        {
          "label": "NVIDIA DGX Spark",
          "color": "#a48f65",
          "dashed": false,
          "points": [
            [
              0.0001,
              6728.417
            ],
            [
              0.0002,
              3364.254
            ],
            [
              0.0005,
              1345.756
            ],
            [
              0.001,
              672.923
            ],
            [
              0.002,
              336.507
            ],
            [
              0.005,
              134.657
            ],
            [
              0.01,
              67.374
            ],
            [
              0.02,
              33.732
            ],
            [
              0.05,
              13.547
            ],
            [
              0.1,
              6.819
            ],
            [
              0.2,
              3.454
            ],
            [
              0.5,
              1.436
            ],
            [
              1.0,
              0.763
            ]
          ]
        },
        {
          "label": "RTX PRO 6000 + PC",
          "color": "#fbbf24",
          "dashed": false,
          "points": [
            [
              0.0001,
              7910.95
            ],
            [
              0.0002,
              3955.536
            ],
            [
              0.0005,
              1582.288
            ],
            [
              0.001,
              791.205
            ],
            [
              0.002,
              395.664
            ],
            [
              0.005,
              158.339
            ],
            [
              0.01,
              79.23
            ],
            [
              0.02,
              39.676
            ],
            [
              0.05,
              15.944
            ],
            [
              0.1,
              8.033
            ],
            [
              0.2,
              4.078
            ],
            [
              0.5,
              1.704
            ],
            [
              1.0,
              0.913
            ]
          ]
        },
        {
          "label": "Mac M5 Ultra (תחזית)",
          "color": "#64748b",
          "dashed": true,
          "points": [
            [
              0.0001,
              6753.947
            ],
            [
              0.0002,
              3377.05
            ],
            [
              0.0005,
              1350.912
            ],
            [
              0.001,
              675.533
            ],
            [
              0.002,
              337.843
            ],
            [
              0.005,
              135.23
            ],
            [
              0.01,
              67.692
            ],
            [
              0.02,
              33.923
            ],
            [
              0.05,
              13.661
            ],
            [
              0.1,
              6.908
            ],
            [
              0.2,
              3.531
            ],
            [
              0.5,
              1.505
            ],
            [
              1.0,
              0.829
            ]
          ]
        }
      ],
      "api": {
        "label": "API של אותו מודל",
        "cost": 1.434
      },
      "anchors": [
        {
          "label": "צ'אט חציוני (~1,800 טוקנים/יום)",
          "u": 0.000403172,
          "cost": 1668.939
        },
        {
          "label": "צ'אט אינטנסיבי (~18,000 טוקנים/יום)",
          "u": 0.00403172,
          "cost": 166.975
        },
        {
          "label": "סוכן שנמדד כאן (1.35 מיליון טוקנים/יום)",
          "u": 0.302446,
          "cost": 2.315
        }
      ],
      "ghost": {
        "label": "ה-1% שהנחתי",
        "u": 0.01,
        "cost": 67.374
      },
      "xDomain": [
        0.0001,
        1
      ],
      "yDomain": [
        0.3,
        10000
      ],
      "xTicks": [
        0.0001,
        0.001,
        0.01,
        0.1,
        1
      ],
      "yTicks": [
        1,
        10,
        100,
        1000,
        10000
      ]
    }
  },
};
