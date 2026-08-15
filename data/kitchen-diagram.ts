/**
 * ══════════════════════════════════════════════════════════════════════
 * Rótulos do `KitchenDiagram` — artigo `memoria-llm-local`
 * ══════════════════════════════════════════════════════════════════════
 *
 * DESTINO NO SITE: `data/kitchen-diagram.ts` (o componente importa de
 * `@/data/kitchen-diagram`).
 *
 * Por que um módulo, e não props no `.mdx`: o `compileMDX` só entrega
 * atributo string, e a figura tem ~14 textos. Referenciar por `dataset`
 * é o que `WaffleChart` e `CountryBarsChart` já fazem — mesma convenção.
 * Por que fora de `data/artigos-charts.ts`: lá moram NÚMEROS medidos com
 * procedência; aqui são rótulos de ilustração, e a tradução cresce este
 * arquivo, não o componente.
 *
 * A FIGURA APARECE DUAS VEZES NO ARTIGO, de propósito — é a metodologia
 * virando imagem:
 *   `mode="plain"`    -> só os nomes do cotidiano (`name`, `note`, `note2`)
 *   `mode="labeled"`  -> a MESMA geometria + as etiquetas técnicas (`tag`)
 * `name`/`note` aparecem nos dois modos: a etiqueta técnica é COLADA por
 * cima do desenho, não troca o desenho.
 *
 * ORÇAMENTO DE LARGURA — MEDIDO, não estimado (o SVG não mede texto e o
 * rótulo que não cabe é cortado em silêncio pelo viewBox). Régua: Fahkwang,
 * a fonte que o site serve nos gráficos via `font-chart`. Máximo de
 * caracteres por vaga:
 *   kitchen.tag  38  ·  pantry.tag  32  ·  counter.tag  60  ·  pot.tag  24
 *   inflow.tag   20  ·  note/note2  32  ·  inflow.name  40
 * (a panela é a vaga mais apertada: fica colada na borda direita.)
 * Conferir SEMPRE antes de fechar uma tradução:
 *   python3 checar-kitchen.py
 *
 * 🔄 TRADUÇÕES: entram no passo 3 do plano (`-en`, `-es`, `-it`, `-he`),
 * depois da conferência CULTURAL das analogias de cozinha — traduzir
 * "despensa/bancada/panela de caldo" ao pé da letra não é conferir.
 */

export interface KitchenPiece {
  /** Nome do cotidiano. Aparece nos DOIS modos. */
  name: string;
  /** Comportamento, em língua comum. Aparece nos DOIS modos. */
  note: string;
  note2?: string;
  /** Etiqueta técnica. SÓ no modo `labeled`. */
  tag: string;
  /** Complemento da etiqueta técnica, uma linha. SÓ no modo `labeled`. */
  tagNote?: string;
}

export interface KitchenDiagramDataset {
  /** O retângulo externo: o espaço total. */
  kitchen: KitchenPiece;
  /** Bloco cheio e constante, à esquerda. */
  pantry: KitchenPiece;
  /** A superfície que vai sendo tomada, ao centro. */
  counter: KitchenPiece;
  /** O círculo pequeno e sempre igual, à direita. */
  pot: KitchenPiece;
  /** O fluxo que entra por cima da bancada. */
  inflow: { name: string; tag: string };
  /** Legenda da seta sob a bancada. */
  growth: string;
}

export const kitchenDatasets: Record<string, KitchenDiagramDataset> = {
  'memoria-llm-local-cozinha': {
    kitchen: {
      name: 'O tamanho da cozinha',
      note: 'tudo que está aqui dentro precisa caber',
      tag: 'Memória disponível (VRAM ou unificada)',
    },
    pantry: {
      name: 'A despensa',
      note: 'já cheia antes de o fogo acender',
      note2: 'não muda de tamanho',
      tag: 'Pesos do modelo',
    },
    counter: {
      name: 'A bancada',
      note: 'o que já foi preparado fica aqui',
      note2: 'toma mais espaço a cada passo',
      tag: 'Cache de atenção',
    },
    pot: {
      name: 'A panela de caldo',
      note: 'resume tudo que entrou',
      note2: 'tamanho sempre igual',
      tag: 'Atenção linear',
      tagNote: 'estado de tamanho fixo',
    },
    inflow: {
      name: 'o que vai entrando, um pedaço por vez',
      tag: 'Tokens',
    },
    growth: 'cresce nesta direção',
  },
  'memoria-llm-local-cozinha-en': {
    kitchen: {
      name: 'The size of the kitchen',
      note: 'everything in here must fit',
      tag: 'Available memory (VRAM or unified)',
    },
    pantry: {
      name: 'The pantry',
      note: 'full before the stove is lit',
      note2: 'never changes size',
      tag: 'Model weights',
    },
    counter: {
      name: 'The counter',
      note: 'already prepped items sit here',
      note2: 'takes more room each step',
      tag: 'Attention cache',
    },
    pot: {
      name: 'The stockpot',
      note: 'sums up all that went in',
      note2: 'always the same size',
      tag: 'Linear attention',
      tagNote: 'constant-size state',
    },
    inflow: {
      name: 'what comes in, one piece at a time',
      tag: 'Tokens',
    },
    growth: 'grows in this direction',
  },
  'memoria-llm-local-cozinha-es': {
    kitchen: {
      name: 'El tamaño de la cocina',
      note: 'todo esto tiene que caber aquí',
      tag: 'Memoria disponible (VRAM o unificada)',
    },
    pantry: {
      name: 'La despensa',
      note: 'ya llena antes del fuego',
      note2: 'no cambia de tamaño',
      tag: 'Pesos del modelo',
    },
    counter: {
      name: 'La encimera',
      note: 'lo ya preparado se queda aquí',
      note2: 'ocupa más espacio a cada paso',
      tag: 'Caché de atención',
    },
    pot: {
      name: 'La olla de caldo',
      note: 'resume todo lo que entró',
      note2: 'tamaño siempre igual',
      tag: 'Atención lineal',
      tagNote: 'estado de tamaño fijo',
    },
    inflow: {
      name: 'lo que va entrando, un trozo cada vez',
      tag: 'Tokens',
    },
    growth: 'crece en esta dirección',
  },
  'memoria-llm-local-cozinha-it': {
    kitchen: {
      name: 'La dimensione della cucina',
      note: 'tutto questo deve starci dentro',
      tag: 'Memoria disponibile (VRAM o unificata)',
    },
    pantry: {
      name: 'La dispensa',
      note: 'già piena prima del fuoco',
      note2: 'non cambia mai dimensione',
      tag: 'Pesi del modello',
    },
    counter: {
      name: 'Il piano di lavoro',
      note: 'quello già pronto resta qui',
      note2: 'occupa più spazio a ogni passo',
      tag: 'Cache di attenzione',
    },
    pot: {
      name: 'La pentola del brodo',
      note: 'riassume quanto è entrato',
      note2: 'sempre la stessa misura',
      tag: 'Attenzione lineare',
      tagNote: 'stato di dimensione fissa',
    },
    inflow: {
      name: 'quello che entra, un pezzo alla volta',
      tag: 'Token',
    },
    growth: 'cresce in questa direzione',
  },
  'memoria-llm-local-cozinha-he': {
    kitchen: {
      name: 'גודל המטבח',
      note: 'כל מה שכאן חייב להיכנס',
      tag: 'זיכרון זמין (VRAM או מאוחד)',
    },
    pantry: {
      name: 'המזווה',
      note: 'מלאה עוד לפני שהאש נדלקת',
      note2: 'לא משנה גודל',
      tag: 'משקלי המודל',
    },
    counter: {
      name: 'משטח העבודה',
      note: 'מה שכבר הוכן נשאר כאן',
      note2: 'תופס יותר מקום בכל שלב',
      tag: 'מטמון הקשב',
    },
    pot: {
      name: 'סיר המרק',
      note: 'מסכם את מה שנכנס',
      note2: 'תמיד באותו גודל',
      tag: 'קשב לינארי',
      tagNote: 'מצב בגודל קבוע',
    },
    inflow: {
      name: 'מה שנכנס, פיסה בכל פעם',
      tag: 'טוקנים',
    },
    growth: 'גדל בכיוון הזה',
  },
};
