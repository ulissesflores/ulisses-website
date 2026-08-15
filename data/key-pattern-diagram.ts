/**
 * ══════════════════════════════════════════════════════════════════════
 * Cenas do `KeyPatternDiagram` — artigo `marca-dagua-claude`
 * ══════════════════════════════════════════════════════════════════════
 *
 * DESTINO NO SITE: `data/key-pattern-diagram.ts`.
 *
 * A figura aparece DUAS VEZES: `mode="dia"` na analogia das ruas, logo no
 * começo (é o degrau mais simples do artigo), e `mode="mes"` na seção da
 * detecção, depois que o leitor já sabe o que é a chave. Mesma geometria,
 * mesma leitura, trinta vezes mais escolhas — que é exatamente o argumento.
 *
 * `pattern` é uma string de '1' (a escolha bateu com a chave) e '0' (não
 * bateu). String fixa, escrita à mão: nada de sorteio, para o render ser
 * idêntico no servidor e no cliente.
 *
 * `meter` é a posição do marcador entre "poderia ser acaso" e "só quem tem a
 * chave". É QUALITATIVO e a procedência declara isso dentro do SVG: a curva
 * real de confiança por comprimento está no paper do SynthID-Text, atrás de
 * paywall, e desenhar uma curva inventada seria fabricar dado num gráfico.
 * 0,5 na cena de um dia é a única posição defensável — com uma escolha
 * binária, acertar por acaso é metade — e a do mês fica alta sem fingir
 * precisão.
 *
 * ORÇAMENTO DE LARGURA — MEDIDO em Fahkwang (`font-chart`). Por vaga:
 *   badge 60 caracteres  ·  caption 96  ·  meterAxis 60
 *   meterLow / meterHigh 40 (as duas nas pontas do medidor, sem se tocar)
 *   cellLabel / cellNote 90 (célula larga: só a cena "dia" desenha rótulo)
 * Conferir antes de fechar qualquer tradução:
 *   python3 checar-figuras-marca-dagua.py
 */

export interface KeyPatternScene {
  badge: string;
  /** '1' = a escolha bate com a chave; '0' = não bate. Fixo, nunca sorteado. */
  pattern: string;
  /** Rótulo dentro da célula — desenhado só quando há até 3 células. */
  cellLabel: string;
  cellNote: string;
  /** Posição do marcador, de 0 a 1. Qualitativa, declarada na procedência. */
  meter: number;
  caption: string;
}

export interface KeyPatternDataset {
  meterAxis: string;
  meterLow: string;
  meterHigh: string;
  dia: KeyPatternScene;
  mes: KeyPatternScene;
}

export const keyPatternDatasets: Record<string, KeyPatternDataset> = {
  'marca-dagua-padrao': {
    meterAxis: 'o quanto esta leitura combina com a regra combinada',
    meterLow: 'poderia ser acaso',
    meterHigh: 'só quem tem a chave',
    dia: {
      badge: 'UM DIA',
      pattern: '1',
      cellLabel: 'hoje você foi pela rua da esquerda',
      cellNote: 'a da direita levava para casa do mesmo jeito',
      meter: 0.5,
      caption:
        'Metade das pessoas iria pela esquerda sem combinar nada. Um dia não distingue ninguém.',
    },
    mes: {
      badge: 'UM MÊS — em ouro, as escolhas que batem com a regra',
      pattern: '110111011111011101111101111011',
      cellLabel: '',
      cellNote: '',
      meter: 0.93,
      caption:
        'A mesma leitura, trinta vezes: agora há padrão. E o que sai é uma probabilidade, não um veredito.',
    },
  },

  // ── Traduções. Uma key por idioma: o componente faz `throw` em dataset
  // desconhecido, então um `index.<lang>.mdx` sem a sua key derruba a página.
  'marca-dagua-padrao-en': {
    meterAxis: 'how well this reading matches the agreed rule',
    meterLow: 'could be chance',
    meterHigh: 'only someone with the key',
    dia: {
      badge: 'ONE DAY',
      pattern: '1',
      cellLabel: 'today you took the street on the left',
      cellNote: 'the one on the right took you home just the same',
      meter: 0.5,
      caption: 'Half of all people would go left having agreed nothing. One day tells nobody apart.',
    },
    mes: {
      badge: 'ONE MONTH — in gold, the choices that match the rule',
      pattern: '110111011111011101111101111011',
      cellLabel: '',
      cellNote: '',
      meter: 0.93,
      caption: 'The same reading, thirty times: now there is a pattern — a probability, not a verdict.',
    },
  },
  // O hebraico é medido na Noto Sans Hebrew, não na Fahkwang (que não tem
  // glifo hebraico): as larguras não se comparam com as das outras línguas.
  'marca-dagua-padrao-he': {
    meterAxis: 'עד כמה הקריאה הזו תואמת את הכלל המוסכם',
    meterLow: 'יכול להיות מקרה',
    meterHigh: 'רק מי שיש לו את המפתח',
    dia: {
      badge: 'יום אחד',
      pattern: '1',
      cellLabel: 'היום פניתם לרחוב השמאלי',
      cellNote: 'הימני היה מביא אתכם הביתה בדיוק כך',
      meter: 0.5,
      caption: 'מחצית מהאנשים היו פונים שמאלה בלי לסכם דבר. יום אחד אינו מבדיל בין אף אחד.',
    },
    mes: {
      badge: 'חודש שלם — בזהב, הבחירות שתואמות את הכלל',
      pattern: '110111011111011101111101111011',
      cellLabel: '',
      cellNote: '',
      meter: 0.93,
      caption: 'אותה קריאה, שלושים פעם: עכשיו יש דפוס — הסתברות, לא פסק דין.',
    },
  },
  'marca-dagua-padrao-es': {
    meterAxis: 'hasta qué punto esta lectura encaja con la regla acordada',
    meterLow: 'podría ser azar',
    meterHigh: 'solo quien tiene la clave',
    dia: {
      badge: 'UN DÍA',
      pattern: '1',
      cellLabel: 'hoy fuiste por la calle de la izquierda',
      cellNote: 'la de la derecha te llevaba a casa igual',
      meter: 0.5,
      caption: 'La mitad de la gente iría por la izquierda sin acordar nada. Un día no distingue a nadie.',
    },
    mes: {
      badge: 'UN MES — en oro, las elecciones que encajan con la regla',
      pattern: '110111011111011101111101111011',
      cellLabel: '',
      cellNote: '',
      meter: 0.93,
      caption: 'La misma lectura, treinta veces: ahora hay patrón — una probabilidad, no un veredicto.',
    },
  },
  'marca-dagua-padrao-it': {
    meterAxis: 'quanto questa lettura combacia con la regola concordata',
    meterLow: 'potrebbe essere caso',
    meterHigh: 'solo chi ha la chiave',
    dia: {
      badge: 'UN GIORNO',
      pattern: '1',
      cellLabel: 'oggi hai preso la strada di sinistra',
      cellNote: 'quella di destra ti portava a casa uguale',
      meter: 0.5,
      caption: 'Metà delle persone andrebbe a sinistra senza concordare nulla. Un giorno non distingue nessuno.',
    },
    mes: {
      badge: 'UN MESE — in oro, le scelte che seguono la regola',
      pattern: '110111011111011101111101111011',
      cellLabel: '',
      cellNote: '',
      meter: 0.93,
      caption: "La stessa lettura, trenta volte: ora c'è uno schema — una probabilità, non un verdetto.",
    },
  },
};
