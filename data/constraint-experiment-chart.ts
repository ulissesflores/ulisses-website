/**
 * ══════════════════════════════════════════════════════════════════════
 * Dados do `ConstraintExperimentChart` — artigo `teoria-das-restricoes`
 * ══════════════════════════════════════════════════════════════════════
 *
 * GERADO por `gerar-dados.py` — NÃO editar à mão. DESTINO NO SITE: `data/constraint-experiment-chart.ts`.
 *
 * PROCEDÊNCIA: `simulacao/resultados.json` (fila.py, semente 20260825,
 * 400.000 itens por corrida, linha base [10.0, 10.0, 4.0, 10.0, 10.0], restrição no
 * posto 3 com capacidade 4). O script recalcula os
 * deltas e razões que a prosa cita e falha se divergirem do `index.<lang>.mdx`.
 * Um Record com TODOS os idiomas: `<id>` é o pt-br, `<id>-en`, `-es`, `-it`,
 * `-he` as traduções — o componente faz `throw` em id desconhecido, então o
 * `index.<lang>.mdx` só entra no site junto com este módulo inteiro.
 *
 * Por que um módulo, e não props no `.mdx`: o `compileMDX` só entrega atributo
 * string; o corpo do artigo referencia por `dataset` (convenção do acervo).
 *
 * ORÇAMENTO DE LARGURA por vaga, em caracteres — MEDIDO na Fahkwang real por
 * `checar-figuras.py` (o SVG não mede texto; rótulo que não cabe é cortado em
 * silêncio):
 *   linhas: yTick 4 · xTick 10 nos extremos · referencia.rotulo 81 · chamadas >= 53 (a de
 *   ancora end no ponto 4,0) · xLabel 104 · yLabel 55 (mede contra a ALTURA do plot, 322 px) ·
 *   conclusao 95 · title 78 · subtitle 116 · source 142.  barras: barras[].nome 22 (coluna de
 *   142 px) · rotulo >= 15 (o mais apertado: bloco da espera, 'Dobra o posto 1') · cabecalho 77 ·
 *   escala.rotulo 108 · escalaLog.tick 30 nos extremos · conclusao 95 — medido em 2026-08-26
 * Nada de aleatório: ordem das barras, pilha da fila e deslocamento das
 * chamadas são listas fixas — o render é idêntico no servidor e no cliente.
 */

export interface CeTick {
  v: number;
  /** Rótulo pré-formatado no idioma do artigo (vírgula decimal em pt-br). */
  label: string;
}

export interface CeChamada {
  x: number;
  y: number;
  texto: string;
  /** Deslocamento fixo do texto em relação ao ponto (px do viewBox). */
  dx: number;
  dy: number;
  ancora: 'start' | 'middle' | 'end';
}

export interface CeLinhasDataset {
  modo: 'teto' | 'residuo';
  pontos: readonly (readonly [number, number])[];
  xDominio: readonly [number, number];
  yDominio: readonly [number, number];
  xTicks: readonly CeTick[];
  yTicks: readonly CeTick[];
  /** A linha da restrição, em ouro tracejado, com rótulo. */
  referencia: { eixo: 'x' | 'y'; valor: number; rotulo: string };
  chamadas: readonly CeChamada[];
  conclusao: string;
}

export interface CeBarra {
  nome: string;
  /** Valor MEDIDO — nunca normalizado à mão. */
  valor: number;
  rotulo: string;
  papel: 'recessivo' | 'tese' | 'destaque';
}

export interface CeBloco {
  cabecalho: string;
  barras: readonly CeBarra[];
  /** Escala linear própria do bloco (declarada no SVG). Ausente = usa `escalaLog`. */
  escala?: { max: number; rotulo: string };
}

export interface CeBarrasDataset {
  modo: 'lugar-errado' | 'corda';
  blocos: readonly CeBloco[];
  /** Régua log comum a todos os blocos, desenhada com ticks. */
  escalaLog?: { dominio: readonly [number, number]; ticks: readonly CeTick[]; rotulo: string };
  conclusao: string;
}

export type CeDataset = CeLinhasDataset | CeBarrasDataset;

export const constraintExperimentDatasets: Record<string, CeDataset> = {
  'restricao-exp1-teto': {
    modo: 'teto',
    pontos: [
      [0.5, 0.5006],
      [1, 1.0011],
      [1.5, 1.5017],
      [2, 2.0022],
      [2.5, 2.5028],
      [3, 3.0033],
      [3.5, 3.5037],
      [4, 4.0044],
      [4.5, 4.0016],
      [5, 4.0101],
      [5.5, 4.0067],
      [6, 4.0051],
      [6.5, 4.0051],
      [7, 4.0048],
    ],
    xDominio: [0, 7.5],
    yDominio: [0, 5],
    xTicks: [
      {
        v: 0,
        label: '0',
      },
      {
        v: 1,
        label: '1',
      },
      {
        v: 2,
        label: '2',
      },
      {
        v: 3,
        label: '3',
      },
      {
        v: 4,
        label: '4',
      },
      {
        v: 5,
        label: '5',
      },
      {
        v: 6,
        label: '6',
      },
      {
        v: 7,
        label: '7',
      },
    ],
    yTicks: [
      {
        v: 0,
        label: '0',
      },
      {
        v: 1,
        label: '1',
      },
      {
        v: 2,
        label: '2',
      },
      {
        v: 3,
        label: '3',
      },
      {
        v: 4,
        label: '4',
      },
      {
        v: 5,
        label: '5',
      },
    ],
    referencia: {
      eixo: 'y',
      valor: 4,
      rotulo: 'capacidade da restrição: 4',
    },
    chamadas: [
      {
        x: 3.5,
        y: 3.503742856395919,
        texto: '13 na fila',
        dx: -8,
        dy: -10,
        ancora: 'end',
      },
      {
        x: 4,
        y: 4.0044306780838745,
        texto: '735 na fila',
        dx: 10,
        dy: 18,
        ancora: 'start',
      },
      {
        x: 7,
        y: 4.0048041544155435,
        texto: '121.646 na fila',
        dx: -8,
        dy: -12,
        ancora: 'end',
      },
    ],
    conclusao: 'Dobrar a demanda de 3,5 para 7 não tirou um item a mais — só fila.',
  },
  'restricao-exp2-lugar-errado': {
    modo: 'lugar-errado',
    blocos: [
      {
        cabecalho: 'Vazão (itens por unidade de tempo)',
        escala: {
          max: 6.5,
          rotulo: 'escala deste bloco: 0 a 6,5',
        },
        barras: [
          {
            nome: 'Linha base',
            valor: 4.018,
            rotulo: '4,02',
            papel: 'recessivo',
          },
          {
            nome: 'Dobra o posto 1',
            valor: 4.005,
            rotulo: '4,01 (−0,3%)',
            papel: 'tese',
          },
          {
            nome: 'Eleva a restrição',
            valor: 5.018,
            rotulo: '5,02 (+24,9%)',
            papel: 'destaque',
          },
        ],
      },
      {
        cabecalho: 'Crescimento da espera (por item)',
        escala: {
          max: 0.25,
          rotulo: 'escala deste bloco: 0 a 0,25',
        },
        barras: [
          {
            nome: 'Linha base',
            valor: 0.1503,
            rotulo: '0,150',
            papel: 'recessivo',
          },
          {
            nome: 'Dobra o posto 1',
            valor: 0.2004,
            rotulo: '0,200 (+33%)',
            papel: 'tese',
          },
          {
            nome: 'Eleva a restrição',
            valor: 0.1002,
            rotulo: '0,100 (−33%)',
            papel: 'destaque',
          },
        ],
      },
    ],
    conclusao: 'Dobrar o posto 1 não entregou um item a mais — e a espera cresce 33% mais rápido.',
  },
  'restricao-exp2-corda': {
    modo: 'corda',
    blocos: [
      {
        cabecalho: 'Vazão',
        barras: [
          {
            nome: 'Empurrar',
            valor: 4.017926214658558,
            rotulo: '4,02',
            papel: 'recessivo',
          },
          {
            nome: 'Corda (seis em curso)',
            valor: 3.812631803937712,
            rotulo: '3,81 (−5%)',
            papel: 'destaque',
          },
        ],
      },
      {
        cabecalho: 'Tempo de travessia',
        barras: [
          {
            nome: 'Empurrar',
            valor: 13502.476303324382,
            rotulo: '13.502',
            papel: 'recessivo',
          },
          {
            nome: 'Corda (seis em curso)',
            valor: 1.5190087942868502,
            rotulo: '1,52 (8.900× menor)',
            papel: 'destaque',
          },
        ],
      },
      {
        cabecalho: 'Trabalho em curso',
        barras: [
          {
            nome: 'Empurrar',
            valor: 134786.51499940376,
            rotulo: '134.787',
            papel: 'recessivo',
          },
          {
            nome: 'Corda (seis em curso)',
            valor: 5.791370945185113,
            rotulo: '5,8 (23 mil× menor)',
            papel: 'destaque',
          },
        ],
      },
    ],
    escalaLog: {
      dominio: [1, 1000000],
      ticks: [
        {
          v: 1,
          label: '1',
        },
        {
          v: 10,
          label: '10',
        },
        {
          v: 100,
          label: '100',
        },
        {
          v: 1000,
          label: '1.000',
        },
        {
          v: 10000,
          label: '10.000',
        },
        {
          v: 100000,
          label: '100.000',
        },
      ],
      rotulo: 'escala logarítmica, comum aos três blocos',
    },
    conclusao: 'Custa 5% de vazão; compra uma travessia 8.900× menor.',
  },
  'restricao-exp3-little': {
    modo: 'residuo',
    pontos: [
      [0.55, 0],
      [0.6, 0],
      [0.65, 0],
      [0.7, 0],
      [0.75, 2e-05],
      [0.8, 5e-05],
      [0.85, 6e-05],
      [0.9, 4e-05],
      [0.95, 6e-05],
      [1, 9e-05],
      [1.05, 0.04724],
      [1.1, 0.09167],
    ],
    xDominio: [0.5, 1.15],
    yDominio: [0, 0.1],
    xTicks: [
      {
        v: 0.5,
        label: '0,5',
      },
      {
        v: 0.6,
        label: '0,6',
      },
      {
        v: 0.7,
        label: '0,7',
      },
      {
        v: 0.8,
        label: '0,8',
      },
      {
        v: 0.9,
        label: '0,9',
      },
      {
        v: 1,
        label: '1,0',
      },
      {
        v: 1.1,
        label: '1,1',
      },
    ],
    yTicks: [
      {
        v: 0,
        label: '0,00',
      },
      {
        v: 0.05,
        label: '0,05',
      },
      {
        v: 0.1,
        label: '0,10',
      },
    ],
    referencia: {
      eixo: 'x',
      valor: 1,
      rotulo: 'restrição a 100%',
    },
    chamadas: [
      {
        x: 1,
        y: 9.355112340985094e-05,
        texto: 'resíduo 0,0001 — mas a travessia já subiu 35×',
        dx: -8,
        dy: -14,
        ancora: 'end',
      },
      {
        x: 1.05,
        y: 0.04723550376840314,
        texto: '0,047',
        dx: -8,
        dy: -2,
        ancora: 'end',
      },
      {
        x: 1.1,
        y: 0.09166857622660037,
        texto: '0,092',
        dx: -8,
        dy: 4,
        ancora: 'end',
      },
    ],
    conclusao: 'O resíduo acusa sobrecarga, não o ponto crítico.',
  },
  'restricao-exp1-teto-it': {
    modo: 'teto',
    pontos: [
      [0.5, 0.5006],
      [1, 1.0011],
      [1.5, 1.5017],
      [2, 2.0022],
      [2.5, 2.5028],
      [3, 3.0033],
      [3.5, 3.5037],
      [4, 4.0044],
      [4.5, 4.0016],
      [5, 4.0101],
      [5.5, 4.0067],
      [6, 4.0051],
      [6.5, 4.0051],
      [7, 4.0048],
    ],
    xDominio: [0, 7.5],
    yDominio: [0, 5],
    xTicks: [
      {
        v: 0,
        label: '0',
      },
      {
        v: 1,
        label: '1',
      },
      {
        v: 2,
        label: '2',
      },
      {
        v: 3,
        label: '3',
      },
      {
        v: 4,
        label: '4',
      },
      {
        v: 5,
        label: '5',
      },
      {
        v: 6,
        label: '6',
      },
      {
        v: 7,
        label: '7',
      },
    ],
    yTicks: [
      {
        v: 0,
        label: '0',
      },
      {
        v: 1,
        label: '1',
      },
      {
        v: 2,
        label: '2',
      },
      {
        v: 3,
        label: '3',
      },
      {
        v: 4,
        label: '4',
      },
      {
        v: 5,
        label: '5',
      },
    ],
    referencia: {
      eixo: 'y',
      valor: 4,
      rotulo: 'capacità del vincolo: 4',
    },
    chamadas: [
      {
        x: 3.5,
        y: 3.503742856395919,
        texto: '13 in coda',
        dx: -8,
        dy: -10,
        ancora: 'end',
      },
      {
        x: 4,
        y: 4.0044306780838745,
        texto: '735 in coda',
        dx: 10,
        dy: 18,
        ancora: 'start',
      },
      {
        x: 7,
        y: 4.0048041544155435,
        texto: '121.646 in coda',
        dx: -8,
        dy: -12,
        ancora: 'end',
      },
    ],
    conclusao: 'Raddoppiare la domanda da 3,5 a 7 non ha dato un pezzo in più — solo coda.',
  },
  'restricao-exp2-lugar-errado-it': {
    modo: 'lugar-errado',
    blocos: [
      {
        cabecalho: 'Portata (pezzi per unità di tempo)',
        escala: {
          max: 6.5,
          rotulo: 'scala di questo blocco: da 0 a 6,5',
        },
        barras: [
          {
            nome: 'Linea base',
            valor: 4.018,
            rotulo: '4,02',
            papel: 'recessivo',
          },
          {
            nome: 'Raddoppia il posto 1',
            valor: 4.005,
            rotulo: '4,01 (−0,3%)',
            papel: 'tese',
          },
          {
            nome: 'Eleva il vincolo',
            valor: 5.018,
            rotulo: '5,02 (+24,9%)',
            papel: 'destaque',
          },
        ],
      },
      {
        cabecalho: 'Crescita dell\'attesa (per pezzo)',
        escala: {
          max: 0.25,
          rotulo: 'scala di questo blocco: da 0 a 0,25',
        },
        barras: [
          {
            nome: 'Linea base',
            valor: 0.1503,
            rotulo: '0,150',
            papel: 'recessivo',
          },
          {
            nome: 'Raddoppia il posto 1',
            valor: 0.2004,
            rotulo: '0,200 (+33%)',
            papel: 'tese',
          },
          {
            nome: 'Eleva il vincolo',
            valor: 0.1002,
            rotulo: '0,100 (−33%)',
            papel: 'destaque',
          },
        ],
      },
    ],
    conclusao: 'Raddoppiare il posto 1 non ha dato un pezzo in più — e l\'attesa cresce 33% più in fretta.',
  },
  'restricao-exp2-corda-it': {
    modo: 'corda',
    blocos: [
      {
        cabecalho: 'Portata',
        barras: [
          {
            nome: 'Spingere',
            valor: 4.017926214658558,
            rotulo: '4,02',
            papel: 'recessivo',
          },
          {
            nome: 'Corda (sei in corso)',
            valor: 3.812631803937712,
            rotulo: '3,81 (−5%)',
            papel: 'destaque',
          },
        ],
      },
      {
        cabecalho: 'Tempo di attraversamento',
        barras: [
          {
            nome: 'Spingere',
            valor: 13502.476303324382,
            rotulo: '13.502',
            papel: 'recessivo',
          },
          {
            nome: 'Corda (sei in corso)',
            valor: 1.5190087942868502,
            rotulo: '1,52 (8.900× minore)',
            papel: 'destaque',
          },
        ],
      },
      {
        cabecalho: 'Lavoro in corso',
        barras: [
          {
            nome: 'Spingere',
            valor: 134786.51499940376,
            rotulo: '134.787',
            papel: 'recessivo',
          },
          {
            nome: 'Corda (sei in corso)',
            valor: 5.791370945185113,
            rotulo: '5,8 (23 mila× minore)',
            papel: 'destaque',
          },
        ],
      },
    ],
    escalaLog: {
      dominio: [1, 1000000],
      ticks: [
        {
          v: 1,
          label: '1',
        },
        {
          v: 10,
          label: '10',
        },
        {
          v: 100,
          label: '100',
        },
        {
          v: 1000,
          label: '1.000',
        },
        {
          v: 10000,
          label: '10.000',
        },
        {
          v: 100000,
          label: '100.000',
        },
      ],
      rotulo: 'scala logaritmica, comune ai tre blocchi',
    },
    conclusao: 'Costa 5% di portata; compra un attraversamento 8.900× minore.',
  },
  'restricao-exp3-little-it': {
    modo: 'residuo',
    pontos: [
      [0.55, 0],
      [0.6, 0],
      [0.65, 0],
      [0.7, 0],
      [0.75, 2e-05],
      [0.8, 5e-05],
      [0.85, 6e-05],
      [0.9, 4e-05],
      [0.95, 6e-05],
      [1, 9e-05],
      [1.05, 0.04724],
      [1.1, 0.09167],
    ],
    xDominio: [0.5, 1.15],
    yDominio: [0, 0.1],
    xTicks: [
      {
        v: 0.5,
        label: '0,5',
      },
      {
        v: 0.6,
        label: '0,6',
      },
      {
        v: 0.7,
        label: '0,7',
      },
      {
        v: 0.8,
        label: '0,8',
      },
      {
        v: 0.9,
        label: '0,9',
      },
      {
        v: 1,
        label: '1,0',
      },
      {
        v: 1.1,
        label: '1,1',
      },
    ],
    yTicks: [
      {
        v: 0,
        label: '0,00',
      },
      {
        v: 0.05,
        label: '0,05',
      },
      {
        v: 0.1,
        label: '0,10',
      },
    ],
    referencia: {
      eixo: 'x',
      valor: 1,
      rotulo: 'vincolo al 100%',
    },
    chamadas: [
      {
        x: 1,
        y: 9.355112340985094e-05,
        texto: 'residuo 0,0001 — ma l\'attraversamento è già salito 35×',
        dx: -8,
        dy: -14,
        ancora: 'end',
      },
      {
        x: 1.05,
        y: 0.04723550376840314,
        texto: '0,047',
        dx: -8,
        dy: -2,
        ancora: 'end',
      },
      {
        x: 1.1,
        y: 0.09166857622660037,
        texto: '0,092',
        dx: -8,
        dy: 4,
        ancora: 'end',
      },
    ],
    conclusao: 'Il residuo segnala il sovraccarico, non il punto critico.',
  },
  'restricao-exp1-teto-en': {
    modo: 'teto',
    pontos: [
      [0.5, 0.5006],
      [1, 1.0011],
      [1.5, 1.5017],
      [2, 2.0022],
      [2.5, 2.5028],
      [3, 3.0033],
      [3.5, 3.5037],
      [4, 4.0044],
      [4.5, 4.0016],
      [5, 4.0101],
      [5.5, 4.0067],
      [6, 4.0051],
      [6.5, 4.0051],
      [7, 4.0048],
    ],
    xDominio: [0, 7.5],
    yDominio: [0, 5],
    xTicks: [
      {
        v: 0,
        label: '0',
      },
      {
        v: 1,
        label: '1',
      },
      {
        v: 2,
        label: '2',
      },
      {
        v: 3,
        label: '3',
      },
      {
        v: 4,
        label: '4',
      },
      {
        v: 5,
        label: '5',
      },
      {
        v: 6,
        label: '6',
      },
      {
        v: 7,
        label: '7',
      },
    ],
    yTicks: [
      {
        v: 0,
        label: '0',
      },
      {
        v: 1,
        label: '1',
      },
      {
        v: 2,
        label: '2',
      },
      {
        v: 3,
        label: '3',
      },
      {
        v: 4,
        label: '4',
      },
      {
        v: 5,
        label: '5',
      },
    ],
    referencia: {
      eixo: 'y',
      valor: 4,
      rotulo: 'capacity of the constraint: 4',
    },
    chamadas: [
      {
        x: 3.5,
        y: 3.503742856395919,
        texto: '13 in the queue',
        dx: -8,
        dy: -10,
        ancora: 'end',
      },
      {
        x: 4,
        y: 4.0044306780838745,
        texto: '735 in the queue',
        dx: 10,
        dy: 18,
        ancora: 'start',
      },
      {
        x: 7,
        y: 4.0048041544155435,
        texto: '121,646 in the queue',
        dx: -8,
        dy: -12,
        ancora: 'end',
      },
    ],
    conclusao: 'Doubling demand from 3.5 to 7 did not get one more item out — only a queue.',
  },
  'restricao-exp2-lugar-errado-en': {
    modo: 'lugar-errado',
    blocos: [
      {
        cabecalho: 'Throughput (items per unit of time)',
        escala: {
          max: 6.5,
          rotulo: 'scale of this block: 0 to 6.5',
        },
        barras: [
          {
            nome: 'Baseline',
            valor: 4.018,
            rotulo: '4.02',
            papel: 'recessivo',
          },
          {
            nome: 'Double station 1',
            valor: 4.005,
            rotulo: '4.01 (−0.3%)',
            papel: 'tese',
          },
          {
            nome: 'Elevate constraint',
            valor: 5.018,
            rotulo: '5.02 (+24.9%)',
            papel: 'destaque',
          },
        ],
      },
      {
        cabecalho: 'Growth of waiting (per item)',
        escala: {
          max: 0.25,
          rotulo: 'scale of this block: 0 to 0.25',
        },
        barras: [
          {
            nome: 'Baseline',
            valor: 0.1503,
            rotulo: '0.150',
            papel: 'recessivo',
          },
          {
            nome: 'Double station 1',
            valor: 0.2004,
            rotulo: '0.200 (+33%)',
            papel: 'tese',
          },
          {
            nome: 'Elevate constraint',
            valor: 0.1002,
            rotulo: '0.100 (−33%)',
            papel: 'destaque',
          },
        ],
      },
    ],
    conclusao: 'Doubling station 1 did not deliver a single extra item — and waiting grows 33% faster.',
  },
  'restricao-exp2-corda-en': {
    modo: 'corda',
    blocos: [
      {
        cabecalho: 'Throughput',
        barras: [
          {
            nome: 'Push',
            valor: 4.017926214658558,
            rotulo: '4.02',
            papel: 'recessivo',
          },
          {
            nome: 'Rope (six in process)',
            valor: 3.812631803937712,
            rotulo: '3.81 (−5%)',
            papel: 'destaque',
          },
        ],
      },
      {
        cabecalho: 'Lead time',
        barras: [
          {
            nome: 'Push',
            valor: 13502.476303324382,
            rotulo: '13,502',
            papel: 'recessivo',
          },
          {
            nome: 'Rope (six in process)',
            valor: 1.5190087942868502,
            rotulo: '1.52 (8,900× smaller)',
            papel: 'destaque',
          },
        ],
      },
      {
        cabecalho: 'Work in process',
        barras: [
          {
            nome: 'Push',
            valor: 134786.51499940376,
            rotulo: '134,787',
            papel: 'recessivo',
          },
          {
            nome: 'Rope (six in process)',
            valor: 5.791370945185113,
            rotulo: '5.8 (23,000× smaller)',
            papel: 'destaque',
          },
        ],
      },
    ],
    escalaLog: {
      dominio: [1, 1000000],
      ticks: [
        {
          v: 1,
          label: '1',
        },
        {
          v: 10,
          label: '10',
        },
        {
          v: 100,
          label: '100',
        },
        {
          v: 1000,
          label: '1,000',
        },
        {
          v: 10000,
          label: '10,000',
        },
        {
          v: 100000,
          label: '100,000',
        },
      ],
      rotulo: 'logarithmic scale, shared by the three blocks',
    },
    conclusao: 'Costs 5% of throughput; buys a lead time 8,900× smaller.',
  },
  'restricao-exp3-little-en': {
    modo: 'residuo',
    pontos: [
      [0.55, 0],
      [0.6, 0],
      [0.65, 0],
      [0.7, 0],
      [0.75, 2e-05],
      [0.8, 5e-05],
      [0.85, 6e-05],
      [0.9, 4e-05],
      [0.95, 6e-05],
      [1, 9e-05],
      [1.05, 0.04724],
      [1.1, 0.09167],
    ],
    xDominio: [0.5, 1.15],
    yDominio: [0, 0.1],
    xTicks: [
      {
        v: 0.5,
        label: '0.5',
      },
      {
        v: 0.6,
        label: '0.6',
      },
      {
        v: 0.7,
        label: '0.7',
      },
      {
        v: 0.8,
        label: '0.8',
      },
      {
        v: 0.9,
        label: '0.9',
      },
      {
        v: 1,
        label: '1.0',
      },
      {
        v: 1.1,
        label: '1.1',
      },
    ],
    yTicks: [
      {
        v: 0,
        label: '0.00',
      },
      {
        v: 0.05,
        label: '0.05',
      },
      {
        v: 0.1,
        label: '0.10',
      },
    ],
    referencia: {
      eixo: 'x',
      valor: 1,
      rotulo: 'constraint at 100%',
    },
    chamadas: [
      {
        x: 1,
        y: 9.355112340985094e-05,
        texto: 'residual 0.0001 — but lead time already rose 35×',
        dx: -8,
        dy: -14,
        ancora: 'end',
      },
      {
        x: 1.05,
        y: 0.04723550376840314,
        texto: '0.047',
        dx: -8,
        dy: -2,
        ancora: 'end',
      },
      {
        x: 1.1,
        y: 0.09166857622660037,
        texto: '0.092',
        dx: -8,
        dy: 4,
        ancora: 'end',
      },
    ],
    conclusao: 'The residual flags overload, not the critical point.',
  },
  'restricao-exp1-teto-es': {
    modo: 'teto',
    pontos: [
      [0.5, 0.5006],
      [1, 1.0011],
      [1.5, 1.5017],
      [2, 2.0022],
      [2.5, 2.5028],
      [3, 3.0033],
      [3.5, 3.5037],
      [4, 4.0044],
      [4.5, 4.0016],
      [5, 4.0101],
      [5.5, 4.0067],
      [6, 4.0051],
      [6.5, 4.0051],
      [7, 4.0048],
    ],
    xDominio: [0, 7.5],
    yDominio: [0, 5],
    xTicks: [
      {
        v: 0,
        label: '0',
      },
      {
        v: 1,
        label: '1',
      },
      {
        v: 2,
        label: '2',
      },
      {
        v: 3,
        label: '3',
      },
      {
        v: 4,
        label: '4',
      },
      {
        v: 5,
        label: '5',
      },
      {
        v: 6,
        label: '6',
      },
      {
        v: 7,
        label: '7',
      },
    ],
    yTicks: [
      {
        v: 0,
        label: '0',
      },
      {
        v: 1,
        label: '1',
      },
      {
        v: 2,
        label: '2',
      },
      {
        v: 3,
        label: '3',
      },
      {
        v: 4,
        label: '4',
      },
      {
        v: 5,
        label: '5',
      },
    ],
    referencia: {
      eixo: 'y',
      valor: 4,
      rotulo: 'capacidad de la restricción: 4',
    },
    chamadas: [
      {
        x: 3.5,
        y: 3.503742856395919,
        texto: '13 en la cola',
        dx: -8,
        dy: -10,
        ancora: 'end',
      },
      {
        x: 4,
        y: 4.0044306780838745,
        texto: '735 en la cola',
        dx: 10,
        dy: 18,
        ancora: 'start',
      },
      {
        x: 7,
        y: 4.0048041544155435,
        texto: '121.646 en la cola',
        dx: -8,
        dy: -12,
        ancora: 'end',
      },
    ],
    conclusao: 'Doblar la demanda de 3,5 a 7 no sacó un ítem más — solo cola.',
  },
  'restricao-exp2-lugar-errado-es': {
    modo: 'lugar-errado',
    blocos: [
      {
        cabecalho: 'Caudal (ítems por unidad de tiempo)',
        escala: {
          max: 6.5,
          rotulo: 'escala de este bloque: 0 a 6,5',
        },
        barras: [
          {
            nome: 'Línea base',
            valor: 4.018,
            rotulo: '4,02',
            papel: 'recessivo',
          },
          {
            nome: 'Dobla el puesto 1',
            valor: 4.005,
            rotulo: '4,01 (−0,3%)',
            papel: 'tese',
          },
          {
            nome: 'Eleva la restricción',
            valor: 5.018,
            rotulo: '5,02 (+24,9%)',
            papel: 'destaque',
          },
        ],
      },
      {
        cabecalho: 'Crecimiento de la espera (por ítem)',
        escala: {
          max: 0.25,
          rotulo: 'escala de este bloque: 0 a 0,25',
        },
        barras: [
          {
            nome: 'Línea base',
            valor: 0.1503,
            rotulo: '0,150',
            papel: 'recessivo',
          },
          {
            nome: 'Dobla el puesto 1',
            valor: 0.2004,
            rotulo: '0,200 (+33%)',
            papel: 'tese',
          },
          {
            nome: 'Eleva la restricción',
            valor: 0.1002,
            rotulo: '0,100 (−33%)',
            papel: 'destaque',
          },
        ],
      },
    ],
    conclusao: 'Doblar el puesto 1 no entregó un ítem más — y la espera crece 33% más rápido.',
  },
  'restricao-exp2-corda-es': {
    modo: 'corda',
    blocos: [
      {
        cabecalho: 'Caudal',
        barras: [
          {
            nome: 'Empujar',
            valor: 4.017926214658558,
            rotulo: '4,02',
            papel: 'recessivo',
          },
          {
            nome: 'Cuerda (seis en curso)',
            valor: 3.812631803937712,
            rotulo: '3,81 (−5%)',
            papel: 'destaque',
          },
        ],
      },
      {
        cabecalho: 'Tiempo de travesía',
        barras: [
          {
            nome: 'Empujar',
            valor: 13502.476303324382,
            rotulo: '13.502',
            papel: 'recessivo',
          },
          {
            nome: 'Cuerda (seis en curso)',
            valor: 1.5190087942868502,
            rotulo: '1,52 (8.900× menor)',
            papel: 'destaque',
          },
        ],
      },
      {
        cabecalho: 'Trabajo en proceso',
        barras: [
          {
            nome: 'Empujar',
            valor: 134786.51499940376,
            rotulo: '134.787',
            papel: 'recessivo',
          },
          {
            nome: 'Cuerda (seis en curso)',
            valor: 5.791370945185113,
            rotulo: '5,8 (23 mil× menor)',
            papel: 'destaque',
          },
        ],
      },
    ],
    escalaLog: {
      dominio: [1, 1000000],
      ticks: [
        {
          v: 1,
          label: '1',
        },
        {
          v: 10,
          label: '10',
        },
        {
          v: 100,
          label: '100',
        },
        {
          v: 1000,
          label: '1.000',
        },
        {
          v: 10000,
          label: '10.000',
        },
        {
          v: 100000,
          label: '100.000',
        },
      ],
      rotulo: 'escala logarítmica, común a los tres bloques',
    },
    conclusao: 'Cuesta 5% de caudal; compra una travesía 8.900× menor.',
  },
  'restricao-exp3-little-es': {
    modo: 'residuo',
    pontos: [
      [0.55, 0],
      [0.6, 0],
      [0.65, 0],
      [0.7, 0],
      [0.75, 2e-05],
      [0.8, 5e-05],
      [0.85, 6e-05],
      [0.9, 4e-05],
      [0.95, 6e-05],
      [1, 9e-05],
      [1.05, 0.04724],
      [1.1, 0.09167],
    ],
    xDominio: [0.5, 1.15],
    yDominio: [0, 0.1],
    xTicks: [
      {
        v: 0.5,
        label: '0,5',
      },
      {
        v: 0.6,
        label: '0,6',
      },
      {
        v: 0.7,
        label: '0,7',
      },
      {
        v: 0.8,
        label: '0,8',
      },
      {
        v: 0.9,
        label: '0,9',
      },
      {
        v: 1,
        label: '1,0',
      },
      {
        v: 1.1,
        label: '1,1',
      },
    ],
    yTicks: [
      {
        v: 0,
        label: '0,00',
      },
      {
        v: 0.05,
        label: '0,05',
      },
      {
        v: 0.1,
        label: '0,10',
      },
    ],
    referencia: {
      eixo: 'x',
      valor: 1,
      rotulo: 'restricción al 100%',
    },
    chamadas: [
      {
        x: 1,
        y: 9.355112340985094e-05,
        texto: 'residuo 0,0001 — pero la travesía ya subió 35×',
        dx: -8,
        dy: -14,
        ancora: 'end',
      },
      {
        x: 1.05,
        y: 0.04723550376840314,
        texto: '0,047',
        dx: -8,
        dy: -2,
        ancora: 'end',
      },
      {
        x: 1.1,
        y: 0.09166857622660037,
        texto: '0,092',
        dx: -8,
        dy: 4,
        ancora: 'end',
      },
    ],
    conclusao: 'El residuo acusa sobrecarga, no el punto crítico.',
  },
  'restricao-exp1-teto-he': {
    modo: 'teto',
    pontos: [
      [0.5, 0.5006],
      [1, 1.0011],
      [1.5, 1.5017],
      [2, 2.0022],
      [2.5, 2.5028],
      [3, 3.0033],
      [3.5, 3.5037],
      [4, 4.0044],
      [4.5, 4.0016],
      [5, 4.0101],
      [5.5, 4.0067],
      [6, 4.0051],
      [6.5, 4.0051],
      [7, 4.0048],
    ],
    xDominio: [0, 7.5],
    yDominio: [0, 5],
    xTicks: [
      {
        v: 0,
        label: '0',
      },
      {
        v: 1,
        label: '1',
      },
      {
        v: 2,
        label: '2',
      },
      {
        v: 3,
        label: '3',
      },
      {
        v: 4,
        label: '4',
      },
      {
        v: 5,
        label: '5',
      },
      {
        v: 6,
        label: '6',
      },
      {
        v: 7,
        label: '7',
      },
    ],
    yTicks: [
      {
        v: 0,
        label: '0',
      },
      {
        v: 1,
        label: '1',
      },
      {
        v: 2,
        label: '2',
      },
      {
        v: 3,
        label: '3',
      },
      {
        v: 4,
        label: '4',
      },
      {
        v: 5,
        label: '5',
      },
    ],
    referencia: {
      eixo: 'y',
      valor: 4,
      rotulo: 'קיבולת האילוץ: 4',
    },
    chamadas: [
      {
        x: 3.5,
        y: 3.503742856395919,
        texto: '13 בתור',
        dx: -8,
        dy: -10,
        ancora: 'end',
      },
      {
        x: 4,
        y: 4.0044306780838745,
        texto: '735 בתור',
        dx: 10,
        dy: 18,
        ancora: 'start',
      },
      {
        x: 7,
        y: 4.0048041544155435,
        texto: '121,646 בתור',
        dx: -8,
        dy: -12,
        ancora: 'end',
      },
    ],
    conclusao: 'הכפלת הביקוש מ-3.5 ל-7 לא הוציאה פריט אחד יותר — רק תור.',
  },
  'restricao-exp2-lugar-errado-he': {
    modo: 'lugar-errado',
    blocos: [
      {
        cabecalho: 'תפוקה (פריטים ליחידת זמן)',
        escala: {
          max: 6.5,
          rotulo: 'קנה המידה של הבלוק: 0 עד 6.5',
        },
        barras: [
          {
            nome: 'קו בסיס',
            valor: 4.018,
            rotulo: '4.02',
            papel: 'recessivo',
          },
          {
            nome: 'הכפלת עמדה 1',
            valor: 4.005,
            rotulo: '4.01 (−0.3%)',
            papel: 'tese',
          },
          {
            nome: 'העלאת האילוץ',
            valor: 5.018,
            rotulo: '5.02 (+24.9%)',
            papel: 'destaque',
          },
        ],
      },
      {
        cabecalho: 'גידול ההמתנה (לפריט)',
        escala: {
          max: 0.25,
          rotulo: 'קנה המידה של הבלוק: 0 עד 0.25',
        },
        barras: [
          {
            nome: 'קו בסיס',
            valor: 0.1503,
            rotulo: '0.150',
            papel: 'recessivo',
          },
          {
            nome: 'הכפלת עמדה 1',
            valor: 0.2004,
            rotulo: '0.200 (+33%)',
            papel: 'tese',
          },
          {
            nome: 'העלאת האילוץ',
            valor: 0.1002,
            rotulo: '0.100 (−33%)',
            papel: 'destaque',
          },
        ],
      },
    ],
    conclusao: 'הכפלת עמדה 1 לא הוציאה פריט אחד יותר — וההמתנה גדלה ב-33% מהר יותר.',
  },
  'restricao-exp2-corda-he': {
    modo: 'corda',
    blocos: [
      {
        cabecalho: 'תפוקה',
        barras: [
          {
            nome: 'דחיפה',
            valor: 4.017926214658558,
            rotulo: '4.02',
            papel: 'recessivo',
          },
          {
            nome: 'חבל (שישה בתהליך)',
            valor: 3.812631803937712,
            rotulo: '3.81 (−5%)',
            papel: 'destaque',
          },
        ],
      },
      {
        cabecalho: 'זמן מעבר',
        barras: [
          {
            nome: 'דחיפה',
            valor: 13502.476303324382,
            rotulo: '13,502',
            papel: 'recessivo',
          },
          {
            nome: 'חבל (שישה בתהליך)',
            valor: 1.5190087942868502,
            rotulo: '1.52 (8,900× פחות)',
            papel: 'destaque',
          },
        ],
      },
      {
        cabecalho: 'מלאי בתהליך',
        barras: [
          {
            nome: 'דחיפה',
            valor: 134786.51499940376,
            rotulo: '134,787',
            papel: 'recessivo',
          },
          {
            nome: 'חבל (שישה בתהליך)',
            valor: 5.791370945185113,
            rotulo: '5.8 (23,000× פחות)',
            papel: 'destaque',
          },
        ],
      },
    ],
    escalaLog: {
      dominio: [1, 1000000],
      ticks: [
        {
          v: 1,
          label: '1',
        },
        {
          v: 10,
          label: '10',
        },
        {
          v: 100,
          label: '100',
        },
        {
          v: 1000,
          label: '1,000',
        },
        {
          v: 10000,
          label: '10,000',
        },
        {
          v: 100000,
          label: '100,000',
        },
      ],
      rotulo: 'סקאלה לוגריתמית, משותפת לשלושת הבלוקים',
    },
    conclusao: 'עולה 5% מהתפוקה; קונה זמן מעבר קצר ב-8,900×.',
  },
  'restricao-exp3-little-he': {
    modo: 'residuo',
    pontos: [
      [0.55, 0],
      [0.6, 0],
      [0.65, 0],
      [0.7, 0],
      [0.75, 2e-05],
      [0.8, 5e-05],
      [0.85, 6e-05],
      [0.9, 4e-05],
      [0.95, 6e-05],
      [1, 9e-05],
      [1.05, 0.04724],
      [1.1, 0.09167],
    ],
    xDominio: [0.5, 1.15],
    yDominio: [0, 0.1],
    xTicks: [
      {
        v: 0.5,
        label: '0.5',
      },
      {
        v: 0.6,
        label: '0.6',
      },
      {
        v: 0.7,
        label: '0.7',
      },
      {
        v: 0.8,
        label: '0.8',
      },
      {
        v: 0.9,
        label: '0.9',
      },
      {
        v: 1,
        label: '1.0',
      },
      {
        v: 1.1,
        label: '1.1',
      },
    ],
    yTicks: [
      {
        v: 0,
        label: '0.00',
      },
      {
        v: 0.05,
        label: '0.05',
      },
      {
        v: 0.1,
        label: '0.10',
      },
    ],
    referencia: {
      eixo: 'x',
      valor: 1,
      rotulo: 'אילוץ ב-100%',
    },
    chamadas: [
      {
        x: 1,
        y: 9.355112340985094e-05,
        texto: 'שארית 0.0001 — אבל זמן המעבר כבר עלה פי 35',
        dx: -8,
        dy: -14,
        ancora: 'end',
      },
      {
        x: 1.05,
        y: 0.04723550376840314,
        texto: '0.047',
        dx: -8,
        dy: -2,
        ancora: 'end',
      },
      {
        x: 1.1,
        y: 0.09166857622660037,
        texto: '0.092',
        dx: -8,
        dy: 4,
        ancora: 'end',
      },
    ],
    conclusao: 'השארית מסמנת עומס יתר, לא את הנקודה הקריטית.',
  },
};
