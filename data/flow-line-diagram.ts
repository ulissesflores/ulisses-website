/**
 * ══════════════════════════════════════════════════════════════════════
 * Dados do `FlowLineDiagram` — artigo `teoria-das-restricoes`
 * ══════════════════════════════════════════════════════════════════════
 *
 * GERADO por `gerar-dados.py` — NÃO editar à mão. DESTINO NO SITE: `data/flow-line-diagram.ts`.
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
 *   postos[].nome 12 (caixa de 112 px, 12 px bold) · capacidade 20 · filaAntes 42 (49 se a
 *   restrição é o último posto) · ociosoDepois 42 · medidor.entra 39 · medidor.sai 39 ·
 *   conclusao 94 · title (prop) 76 · source (prop) 136 — medido em 2026-08-26, pt-br
 * Nada de aleatório: ordem das barras, pilha da fila e deslocamento das
 * chamadas são listas fixas — o render é idêntico no servidor e no cliente.
 */

export interface FlowLinePosto {
  /** Nome em língua comum. */
  nome: string;
  /** Capacidade escrita ("10 por minuto"). Ausente = figura qualitativa. */
  capacidade?: string;
  /** O posto cuja capacidade mudou neste experimento (azul, série-tese). */
  mudou?: boolean;
}

export interface FlowLineDataset {
  /** Exatamente cinco — a geometria é constante de módulo no componente. */
  postos: readonly FlowLinePosto[];
  /** Índice (0-4) do posto em destaque (ouro). */
  restricao: number;
  /** Quadrados na pilha antes da restrição (0-12), proporcional ao dado medido. */
  fila: number;
  /** Rótulo da pilha antes da restrição. */
  filaAntes: string;
  /** Sob a corda: os postos ANTES da restrição também esperam; vazio = não desenhar. */
  ociosoAntes?: string;
  /** Rótulo dos postos depois da restrição; vazio = não desenhar. */
  ociosoDepois: string;
  /** O medidor embaixo: o que entra e o que sai. */
  medidor: { entra: string; sai: string };
  /** A frase-conclusão desenhada dentro do SVG. */
  conclusao: string;
}

export const flowLineDatasets: Record<string, FlowLineDataset> = {
  'restricao-linha-dobra-posto-1': {
    postos: [
      {
        nome: 'Pedido',
        capacidade: '20 por minuto',
        mudou: true,
      },
      {
        nome: 'Massa',
        capacidade: '10 por minuto',
      },
      {
        nome: 'Forno',
        capacidade: '4 por minuto',
      },
      {
        nome: 'Embalagem',
        capacidade: '10 por minuto',
      },
      {
        nome: 'Caixa',
        capacidade: '10 por minuto',
      },
    ],
    restricao: 2,
    fila: 8,
    filaAntes: 'fila cresce 33% mais rápido',
    ociosoDepois: 'esperando pão',
    medidor: {
      entra: 'entram 20 por minuto',
      sai: 'saem 4 por minuto',
    },
    conclusao: 'O anotador duas vezes mais rápido só encheu a fila mais depressa.',
  },
  'restricao-linha-eleva-forno': {
    postos: [
      {
        nome: 'Pedido',
        capacidade: '10 por minuto',
      },
      {
        nome: 'Massa',
        capacidade: '10 por minuto',
      },
      {
        nome: 'Forno',
        capacidade: '5 por minuto',
      },
      {
        nome: 'Embalagem',
        capacidade: '10 por minuto',
      },
      {
        nome: 'Caixa',
        capacidade: '10 por minuto',
      },
    ],
    restricao: 2,
    fila: 4,
    filaAntes: 'fila cresce 33% mais devagar',
    ociosoDepois: 'esperando pão',
    medidor: {
      entra: 'entram 10 por minuto',
      sai: 'saem 5 por minuto',
    },
    conclusao: 'Um forno 25% maior entregou 24,9% mais pão — o esforço caiu no lugar certo.',
  },
  'restricao-linha-corda': {
    postos: [
      {
        nome: 'Pedido',
        capacidade: '10 por minuto',
      },
      {
        nome: 'Massa',
        capacidade: '10 por minuto',
      },
      {
        nome: 'Forno',
        capacidade: '4 por minuto',
      },
      {
        nome: 'Embalagem',
        capacidade: '10 por minuto',
      },
      {
        nome: 'Caixa',
        capacidade: '10 por minuto',
      },
    ],
    restricao: 2,
    fila: 2,
    filaAntes: 'no máximo seis em curso',
    ociosoDepois: 'esperando pão',
    medidor: {
      entra: 'entra um pedido só quando sai um pão',
      sai: 'saem 3,8 por minuto',
    },
    conclusao: 'Aceitar pedido só quando sai pão: 5% menos pães, quase nenhuma espera.',
    ociosoAntes: 'esperam de propósito',
  },
  'restricao-linha-padaria': {
    postos: [
      {
        nome: 'Pedido',
        capacidade: '10 por minuto',
      },
      {
        nome: 'Massa',
        capacidade: '10 por minuto',
      },
      {
        nome: 'Forno',
        capacidade: '4 por minuto',
      },
      {
        nome: 'Embalagem',
        capacidade: '10 por minuto',
      },
      {
        nome: 'Caixa',
        capacidade: '10 por minuto',
      },
    ],
    restricao: 2,
    fila: 6,
    filaAntes: 'fila de massa',
    ociosoDepois: 'esperando pão',
    medidor: {
      entra: 'entram 7 por minuto',
      sai: 'saem 4 por minuto',
    },
    conclusao: 'Os três que faltam não sumiram: estão na fila do forno.',
  },
  'restricao-linha-agentes': {
    postos: [
      {
        nome: 'Inferência',
      },
      {
        nome: 'Ferramentas',
      },
      {
        nome: 'Banco de dados',
      },
      {
        nome: 'Sandbox',
      },
      {
        nome: 'Revisão humana',
      },
    ],
    restricao: 4,
    fila: 6,
    filaAntes: 'fila de rascunhos',
    ociosoDepois: '',
    medidor: {
      entra: 'entra no ritmo do modelo',
      sai: 'sai no ritmo da revisão',
    },
    conclusao: 'A posição do destaque é uma medição, não uma convicção.',
  },
  'restricao-linha-dobra-posto-1-it': {
    postos: [
      {
        nome: 'Ordine',
        capacidade: '20 al minuto',
        mudou: true,
      },
      {
        nome: 'Impasto',
        capacidade: '10 al minuto',
      },
      {
        nome: 'Forno',
        capacidade: '4 al minuto',
      },
      {
        nome: 'Confezione',
        capacidade: '10 al minuto',
      },
      {
        nome: 'Cassa',
        capacidade: '10 al minuto',
      },
    ],
    restricao: 2,
    fila: 8,
    filaAntes: 'la coda cresce 33% più in fretta',
    ociosoDepois: 'in attesa del pane',
    medidor: {
      entra: 'entrano 20 al minuto',
      sai: 'escono 4 al minuto',
    },
    conclusao: 'L\'addetto agli ordini due volte più veloce ha solo riempito la coda più in fretta.',
  },
  'restricao-linha-eleva-forno-it': {
    postos: [
      {
        nome: 'Ordine',
        capacidade: '10 al minuto',
      },
      {
        nome: 'Impasto',
        capacidade: '10 al minuto',
      },
      {
        nome: 'Forno',
        capacidade: '5 al minuto',
      },
      {
        nome: 'Confezione',
        capacidade: '10 al minuto',
      },
      {
        nome: 'Cassa',
        capacidade: '10 al minuto',
      },
    ],
    restricao: 2,
    fila: 4,
    filaAntes: 'la coda cresce 33% più lentamente',
    ociosoDepois: 'in attesa del pane',
    medidor: {
      entra: 'entrano 10 al minuto',
      sai: 'escono 5 al minuto',
    },
    conclusao: 'Un forno 25% più grande ha dato 24,9% di pane in più — lo sforzo è caduto nel posto giusto.',
  },
  'restricao-linha-corda-it': {
    postos: [
      {
        nome: 'Ordine',
        capacidade: '10 al minuto',
      },
      {
        nome: 'Impasto',
        capacidade: '10 al minuto',
      },
      {
        nome: 'Forno',
        capacidade: '4 al minuto',
      },
      {
        nome: 'Confezione',
        capacidade: '10 al minuto',
      },
      {
        nome: 'Cassa',
        capacidade: '10 al minuto',
      },
    ],
    restricao: 2,
    fila: 2,
    filaAntes: 'al massimo sei in corso',
    ociosoDepois: 'in attesa del pane',
    medidor: {
      entra: 'entra un ordine solo quando esce un pane',
      sai: 'escono 3,8 al minuto',
    },
    conclusao: 'Accettare un ordine solo quando esce il pane: 5% di pane in meno, quasi nessuna attesa.',
    ociosoAntes: 'aspettano apposta',
  },
  'restricao-linha-padaria-it': {
    postos: [
      {
        nome: 'Ordine',
        capacidade: '10 al minuto',
      },
      {
        nome: 'Impasto',
        capacidade: '10 al minuto',
      },
      {
        nome: 'Forno',
        capacidade: '4 al minuto',
      },
      {
        nome: 'Confezione',
        capacidade: '10 al minuto',
      },
      {
        nome: 'Cassa',
        capacidade: '10 al minuto',
      },
    ],
    restricao: 2,
    fila: 6,
    filaAntes: 'coda di impasto',
    ociosoDepois: 'in attesa del pane',
    medidor: {
      entra: 'entrano 7 al minuto',
      sai: 'escono 4 al minuto',
    },
    conclusao: 'I tre che mancano non sono spariti: sono in coda al forno.',
  },
  'restricao-linha-agentes-it': {
    postos: [
      {
        nome: 'Inferenza',
      },
      {
        nome: 'Strumenti',
      },
      {
        nome: 'Database',
      },
      {
        nome: 'Sandbox',
      },
      {
        nome: 'Revisione',
      },
    ],
    restricao: 4,
    fila: 6,
    filaAntes: 'coda di bozze',
    ociosoDepois: '',
    medidor: {
      entra: 'entra al ritmo del modello',
      sai: 'esce al ritmo della revisione',
    },
    conclusao: 'La posizione del punto in evidenza è una misura, non una convinzione.',
  },
  'restricao-linha-dobra-posto-1-en': {
    postos: [
      {
        nome: 'Order',
        capacidade: '20 per minute',
        mudou: true,
      },
      {
        nome: 'Dough',
        capacidade: '10 per minute',
      },
      {
        nome: 'Oven',
        capacidade: '4 per minute',
      },
      {
        nome: 'Packing',
        capacidade: '10 per minute',
      },
      {
        nome: 'Checkout',
        capacidade: '10 per minute',
      },
    ],
    restricao: 2,
    fila: 8,
    filaAntes: 'queue grows 33% faster',
    ociosoDepois: 'waiting for bread',
    medidor: {
      entra: '20 in per minute',
      sai: '4 out per minute',
    },
    conclusao: 'The order taker twice as fast only filled the queue faster.',
  },
  'restricao-linha-eleva-forno-en': {
    postos: [
      {
        nome: 'Order',
        capacidade: '10 per minute',
      },
      {
        nome: 'Dough',
        capacidade: '10 per minute',
      },
      {
        nome: 'Oven',
        capacidade: '5 per minute',
      },
      {
        nome: 'Packing',
        capacidade: '10 per minute',
      },
      {
        nome: 'Checkout',
        capacidade: '10 per minute',
      },
    ],
    restricao: 2,
    fila: 4,
    filaAntes: 'queue grows 33% slower',
    ociosoDepois: 'waiting for bread',
    medidor: {
      entra: '10 in per minute',
      sai: '5 out per minute',
    },
    conclusao: 'An oven 25% bigger delivered 24.9% more bread — effort in the right place.',
  },
  'restricao-linha-corda-en': {
    postos: [
      {
        nome: 'Order',
        capacidade: '10 per minute',
      },
      {
        nome: 'Dough',
        capacidade: '10 per minute',
      },
      {
        nome: 'Oven',
        capacidade: '4 per minute',
      },
      {
        nome: 'Packing',
        capacidade: '10 per minute',
      },
      {
        nome: 'Checkout',
        capacidade: '10 per minute',
      },
    ],
    restricao: 2,
    fila: 2,
    filaAntes: 'at most six in process',
    ociosoDepois: 'waiting for bread',
    medidor: {
      entra: 'an order enters only when a loaf leaves',
      sai: '3.8 out per minute',
    },
    conclusao: 'Take an order only when bread leaves: 5% less bread, almost no waiting.',
    ociosoAntes: 'wait on purpose',
  },
  'restricao-linha-padaria-en': {
    postos: [
      {
        nome: 'Order',
        capacidade: '10 per minute',
      },
      {
        nome: 'Dough',
        capacidade: '10 per minute',
      },
      {
        nome: 'Oven',
        capacidade: '4 per minute',
      },
      {
        nome: 'Packing',
        capacidade: '10 per minute',
      },
      {
        nome: 'Checkout',
        capacidade: '10 per minute',
      },
    ],
    restricao: 2,
    fila: 6,
    filaAntes: 'dough queue',
    ociosoDepois: 'waiting for bread',
    medidor: {
      entra: '7 in per minute',
      sai: '4 out per minute',
    },
    conclusao: 'The three loaves missing are in the oven queue.',
  },
  'restricao-linha-agentes-en': {
    postos: [
      {
        nome: 'Inference',
      },
      {
        nome: 'Tools',
      },
      {
        nome: 'Database',
      },
      {
        nome: 'Sandbox',
      },
      {
        nome: 'Human review',
      },
    ],
    restricao: 4,
    fila: 6,
    filaAntes: 'queue of drafts',
    ociosoDepois: '',
    medidor: {
      entra: 'enters at the model pace',
      sai: 'leaves at the review pace',
    },
    conclusao: 'The position of the highlight is a measurement, not a conviction.',
  },
  'restricao-linha-dobra-posto-1-es': {
    postos: [
      {
        nome: 'Pedido',
        capacidade: '20 por minuto',
        mudou: true,
      },
      {
        nome: 'Masa',
        capacidade: '10 por minuto',
      },
      {
        nome: 'Horno',
        capacidade: '4 por minuto',
      },
      {
        nome: 'Empaque',
        capacidade: '10 por minuto',
      },
      {
        nome: 'Caja',
        capacidade: '10 por minuto',
      },
    ],
    restricao: 2,
    fila: 8,
    filaAntes: 'la cola crece 33% más rápido',
    ociosoDepois: 'esperando pan',
    medidor: {
      entra: 'entran 20 por minuto',
      sai: 'salen 4 por minuto',
    },
    conclusao: 'El tomador de pedidos dos veces más rápido solo llenó la cola más rápido.',
  },
  'restricao-linha-eleva-forno-es': {
    postos: [
      {
        nome: 'Pedido',
        capacidade: '10 por minuto',
      },
      {
        nome: 'Masa',
        capacidade: '10 por minuto',
      },
      {
        nome: 'Horno',
        capacidade: '5 por minuto',
      },
      {
        nome: 'Empaque',
        capacidade: '10 por minuto',
      },
      {
        nome: 'Caja',
        capacidade: '10 por minuto',
      },
    ],
    restricao: 2,
    fila: 4,
    filaAntes: 'la cola crece 33% más despacio',
    ociosoDepois: 'esperando pan',
    medidor: {
      entra: 'entran 10 por minuto',
      sai: 'salen 5 por minuto',
    },
    conclusao: 'Un horno 25% mayor entregó 24,9% más pan — el esfuerzo cayó en el lugar correcto.',
  },
  'restricao-linha-corda-es': {
    postos: [
      {
        nome: 'Pedido',
        capacidade: '10 por minuto',
      },
      {
        nome: 'Masa',
        capacidade: '10 por minuto',
      },
      {
        nome: 'Horno',
        capacidade: '4 por minuto',
      },
      {
        nome: 'Empaque',
        capacidade: '10 por minuto',
      },
      {
        nome: 'Caja',
        capacidade: '10 por minuto',
      },
    ],
    restricao: 2,
    fila: 2,
    filaAntes: 'como máximo seis en curso',
    ociosoDepois: 'esperando pan',
    medidor: {
      entra: 'entra un pedido solo cuando sale pan',
      sai: 'salen 3,8 por minuto',
    },
    conclusao: 'Aceptar pedidos solo cuando sale pan: 5% menos panes, casi ninguna espera.',
    ociosoAntes: 'esperan a propósito',
  },
  'restricao-linha-padaria-es': {
    postos: [
      {
        nome: 'Pedido',
        capacidade: '10 por minuto',
      },
      {
        nome: 'Masa',
        capacidade: '10 por minuto',
      },
      {
        nome: 'Horno',
        capacidade: '4 por minuto',
      },
      {
        nome: 'Empaque',
        capacidade: '10 por minuto',
      },
      {
        nome: 'Caja',
        capacidade: '10 por minuto',
      },
    ],
    restricao: 2,
    fila: 6,
    filaAntes: 'cola frente al horno',
    ociosoDepois: 'esperando pan',
    medidor: {
      entra: 'entran 7 por minuto',
      sai: 'salen 4 por minuto',
    },
    conclusao: 'Los tres que faltan no desaparecieron: están en la cola del horno.',
  },
  'restricao-linha-agentes-es': {
    postos: [
      {
        nome: 'Inferencia',
      },
      {
        nome: 'Herramientas',
      },
      {
        nome: 'Base de datos',
      },
      {
        nome: 'Sandbox',
      },
      {
        nome: 'Revisión',
      },
    ],
    restricao: 4,
    fila: 6,
    filaAntes: 'cola de borradores',
    ociosoDepois: '',
    medidor: {
      entra: 'entra al ritmo del modelo',
      sai: 'sale al ritmo de la revisión',
    },
    conclusao: 'La posición de lo destacado es una medición, no una convicción.',
  },
  'restricao-linha-dobra-posto-1-he': {
    postos: [
      {
        nome: 'הזמנה',
        capacidade: '20 לדקה',
        mudou: true,
      },
      {
        nome: 'בצק',
        capacidade: '10 לדקה',
      },
      {
        nome: 'תנור',
        capacidade: '4 לדקה',
      },
      {
        nome: 'אריזה',
        capacidade: '10 לדקה',
      },
      {
        nome: 'קופה',
        capacidade: '10 לדקה',
      },
    ],
    restricao: 2,
    fila: 8,
    filaAntes: 'התור גדל ב-33% מהר יותר',
    ociosoDepois: 'ממתינים ללחם',
    medidor: {
      entra: 'נכנסות 20 לדקה',
      sai: 'יוצאים 4 לדקה',
    },
    conclusao: 'רושם ההזמנות המהיר פי שניים רק מילא את התור מהר יותר.',
  },
  'restricao-linha-eleva-forno-he': {
    postos: [
      {
        nome: 'הזמנה',
        capacidade: '10 לדקה',
      },
      {
        nome: 'בצק',
        capacidade: '10 לדקה',
      },
      {
        nome: 'תנור',
        capacidade: '5 לדקה',
      },
      {
        nome: 'אריזה',
        capacidade: '10 לדקה',
      },
      {
        nome: 'קופה',
        capacidade: '10 לדקה',
      },
    ],
    restricao: 2,
    fila: 4,
    filaAntes: 'התור גדל ב-33% לאט יותר',
    ociosoDepois: 'ממתינים ללחם',
    medidor: {
      entra: 'נכנסות 10 לדקה',
      sai: 'יוצאים 5 לדקה',
    },
    conclusao: 'תנור גדול ב-25% סיפק 24.9% יותר לחם — המאמץ נחת במקום הנכון.',
  },
  'restricao-linha-corda-he': {
    postos: [
      {
        nome: 'הזמנה',
        capacidade: '10 לדקה',
      },
      {
        nome: 'בצק',
        capacidade: '10 לדקה',
      },
      {
        nome: 'תנור',
        capacidade: '4 לדקה',
      },
      {
        nome: 'אריזה',
        capacidade: '10 לדקה',
      },
      {
        nome: 'קופה',
        capacidade: '10 לדקה',
      },
    ],
    restricao: 2,
    fila: 2,
    filaAntes: 'עד שישה בתהליך',
    ociosoDepois: 'ממתינים ללחם',
    medidor: {
      entra: 'הזמנה נכנסת רק כשיוצא לחם',
      sai: 'יוצאים 3.8 לדקה',
    },
    conclusao: 'מקבלים הזמנה רק כשיוצא לחם: 5% פחות לחם, כמעט בלי המתנה.',
    ociosoAntes: 'ממתינים בכוונה',
  },
  'restricao-linha-padaria-he': {
    postos: [
      {
        nome: 'הזמנה',
        capacidade: '10 לדקה',
      },
      {
        nome: 'בצק',
        capacidade: '10 לדקה',
      },
      {
        nome: 'תנור',
        capacidade: '4 לדקה',
      },
      {
        nome: 'אריזה',
        capacidade: '10 לדקה',
      },
      {
        nome: 'קופה',
        capacidade: '10 לדקה',
      },
    ],
    restricao: 2,
    fila: 6,
    filaAntes: 'תור של בצק',
    ociosoDepois: 'ממתינים ללחם',
    medidor: {
      entra: 'נכנסות 7 לדקה',
      sai: 'יוצאים 4 לדקה',
    },
    conclusao: 'השלושה החסרים לא נעלמו: הם בתור של התנור.',
  },
  'restricao-linha-agentes-he': {
    postos: [
      {
        nome: 'הסקה',
      },
      {
        nome: 'כלים',
      },
      {
        nome: 'בסיס נתונים',
      },
      {
        nome: 'Sandbox',
      },
      {
        nome: 'בקרה אנושית',
      },
    ],
    restricao: 4,
    fila: 6,
    filaAntes: 'תור של טיוטות',
    ociosoDepois: '',
    medidor: {
      entra: 'נכנס בקצב המודל',
      sai: 'יוצא בקצב הבקרה',
    },
    conclusao: 'מיקום ההדגשה הוא מדידה, לא אמונה.',
  },
};
