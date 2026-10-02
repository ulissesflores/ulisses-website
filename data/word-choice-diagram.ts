/**
 * ══════════════════════════════════════════════════════════════════════
 * Cenas do `WordChoiceDiagram` — artigo `marca-dagua-claude`
 * ══════════════════════════════════════════════════════════════════════
 *
 * DESTINO NO SITE: `data/word-choice-diagram.ts` (o componente importa de
 * `@/data/word-choice-diagram`).
 *
 * A figura aparece DUAS VEZES no artigo, com a mesma geometria e duas
 * cenas: `mode="livre"` (duas palavras servem igualmente bem, e a chave
 * desempata — é aí que a marca d'água mora) e `mode="travado"` (só existe
 * uma continuação certa, então não há empate e a marca não tem onde
 * prender). É o argumento central do texto virando imagem.
 *
 * `tone` decide a cor, não o texto:
 *   escolhida   -> azul cheio    (a que saiu, decidida pela chave)
 *   alternativa -> azul vazado   (serviria igual)
 *   unica       -> âmbar cheio   (a única resposta certa)
 *   ausente     -> cinza tracejado (não existe segunda opção)
 *
 * ORÇAMENTO DE LARGURA — MEDIDO em Fahkwang, a fonte que o site serve nos
 * gráficos (`font-chart`); rótulo que não cabe é cortado em silêncio pelo
 * viewBox. Máximo por vaga:
 *   written: até 6 palavras, somando <= 40 caracteres
 *   candidates.word 22  ·  candidates.note 26  ·  slotLabel 20
 *   keyLabel 22  ·  keyNote 30  ·  caption 96
 * Conferir antes de fechar qualquer tradução:
 *   python3 checar-word-choice.py
 */

export interface WordChoiceCandidate {
  word: string;
  /** Uma linha curta explicando o papel desta candidata. */
  note: string;
  tone: 'escolhida' | 'alternativa' | 'unica' | 'ausente';
}

export interface WordChoiceScene {
  /** Palavras já escritas, na ordem em que aparecem na tira. */
  written: string[];
  /** Rótulo do espaço vazio, onde entra a próxima palavra. */
  slotLabel: string;
  candidates: WordChoiceCandidate[];
  keyLabel: string;
  keyNote: string;
  /** Uma frase fechando o quadro, embaixo da figura. */
  caption: string;
}

export interface WordChoiceDataset {
  livre: WordChoiceScene;
  travado: WordChoiceScene;
}

export const wordChoiceDatasets: Record<string, WordChoiceDataset> = {
  /**
   * `ia-eleicao-fechadura` — a analogia (degrau 1, `mode="livre"`) e a consequência
   * (degrau 6, `mode="travado"`): a mesma geometria, duas cenas. Na primeira, a palavra
   * do eleitor decide se a porta abre; na segunda, a palavra de quem quer auditar.
   * PROCEDÊNCIA: as duas palavras da cena 1 são as do teste do JOTA (18–19/08/2026); os
   * "7 de 7" e "6 de 7" da cena 2 saem de fontes/termos-de-uso-automacao.md (08/09/2026),
   * reconferidos em fontes/termos-de-uso-reverificacao-2026-10-02.md. "não vedam" (não
   * "permitem", até 02/10): os seis termos só deixam de proibir o manual, não o autorizam.
   */
  'ia-eleicao-fechadura': {
    livre: {
      written: ['dê', 'uma'],
      slotLabel: 'a palavra',
      candidates: [
        { word: 'nota', note: 'passou pela porta', tone: 'escolhida' },
        { word: 'ranking', note: 'barrada na porta', tone: 'ausente' },
      ],
      keyLabel: 'a fechadura',
      keyNote: 'lê a palavra, não quem bate',
      caption: 'A mesma porta, o mesmo pedido, a mesma pessoa. O que muda a resposta é a palavra.',
    },
    travado: {
      written: ['quem', 'pode', 'conferir'],
      slotLabel: 'de fora',
      candidates: [
        { word: 'um robô no navegador', note: '7 de 7 termos vedam', tone: 'ausente' },
        { word: 'uma pessoa, à mão', note: '6 de 7 não vedam', tone: 'unica' },
      ],
      keyLabel: 'os termos de uso',
      keyNote: 'o 7º veda até à mão',
      caption: 'Quem pode checar se a regra é cumprida, se o contrato proíbe olhar? Só à mão, e não em todos.',
    },
  },
  'marca-dagua-escolha': {
    livre: {
      written: ['O', 'ônibus', 'atrasou', 'e', 'cheguei'],
      slotLabel: 'próxima palavra',
      candidates: [
        { word: 'atrasado', note: 'saiu esta', tone: 'escolhida' },
        { word: 'tarde', note: 'serviria igual', tone: 'alternativa' },
      ],
      keyLabel: 'a chave secreta',
      keyNote: '+ as palavras já escritas',
      caption:
        'As duas servem igualmente bem, e o leitor não veria diferença. Quem desempata é a chave — é aí que a marca fica.',
    },
    travado: {
      written: ['…', 'Newton', 'se', 'chama', 'Principia'],
      slotLabel: 'próxima palavra',
      candidates: [
        { word: 'Mathematica', note: 'única resposta certa', tone: 'unica' },
        { word: 'não há segunda opção', note: 'qualquer outra estaria errada', tone: 'ausente' },
      ],
      keyLabel: 'a chave secreta',
      keyNote: 'sem empate, não tem em que agir',
      caption:
        'Sem escolha livre não há o que marcar. É o que acontece em fato, em código e na revisão de um texto seu.',
    },
  },

  // ── Traduções. A cena `livre` exige duas palavras GENUINAMENTE
  // intercambiáveis NAQUELA língua — o par "atrasado"/"tarde" do pt-br não
  // mapeia 1:1. Em inglês entra o próprio exemplo do comunicado da Anthropic
  // ("The weather today was cold and…" -> overcast / grey).
  'marca-dagua-escolha-en': {
    livre: {
      written: ['The', 'weather', 'today', 'was', 'cold', 'and'],
      slotLabel: 'next word',
      candidates: [
        { word: 'overcast', note: 'this one came out', tone: 'escolhida' },
        { word: 'grey', note: 'would do just as well', tone: 'alternativa' },
      ],
      keyLabel: 'the secret key',
      keyNote: '+ the words already written',
      caption: 'Both fit equally well. The key breaks the tie, and that is where the watermark lives.',
    },
    travado: {
      written: ['…', 'work', 'was', 'called', 'Principia'],
      slotLabel: 'next word',
      candidates: [
        { word: 'Mathematica', note: 'the only right answer', tone: 'unica' },
        { word: 'no second option', note: 'anything else is wrong', tone: 'ausente' },
      ],
      keyLabel: 'the secret key',
      keyNote: 'no tie, nothing to act on',
      caption: 'No free choice, nothing to mark: facts, code, and proofreading of your own writing.',
    },
  },
  // Hebraico: a tira de palavras é desenhada da ESQUERDA para a direita pela
  // geometria do componente, que é a mesma para todas as línguas. O leitor
  // hebraico lê cada caixa corretamente, mas a ordem das caixas segue a leitura
  // latina — limitação declarada no `ENTREGA.md`, não defeito de dado.
  'marca-dagua-escolha-he': {
    livre: {
      // Sem o "קר ו" do exemplo original: em hebraico a conjunção gruda na
      // palavra seguinte, e uma caixa com um "ו־" solto não se lê.
      written: ['מזג', 'האוויר', 'היום', 'היה'],
      slotLabel: 'המילה הבאה',
      candidates: [
        { word: 'מעונן', note: 'זו שיצאה', tone: 'escolhida' },
        { word: 'אפור', note: 'הייתה משרתת באותה מידה', tone: 'alternativa' },
      ],
      keyLabel: 'המפתח הסודי',
      keyNote: '+ המילים שכבר נכתבו',
      caption: 'שתיהן מתאימות באותה מידה. המפתח מכריע את התיקו, וכאן שוכן סימן המים.',
    },
    travado: {
      written: ['…', 'של', 'ניוטון', 'נקרא', 'Principia'],
      slotLabel: 'המילה הבאה',
      candidates: [
        { word: 'Mathematica', note: 'התשובה הנכונה היחידה', tone: 'unica' },
        { word: 'אין אפשרות שנייה', note: 'כל אחרת תהיה שגויה', tone: 'ausente' },
      ],
      keyLabel: 'המפתח הסודי',
      keyNote: 'בלי תיקו, אין על מה לפעול',
      caption: 'בלי בחירה חופשית אין מה לסמן: עובדה, קוד, והגהה של טקסט שלכם.',
    },
  },
  'marca-dagua-escolha-es': {
    livre: {
      written: ['El', 'tiempo', 'hoy', 'estaba', 'frío', 'y'],
      slotLabel: 'próxima palabra',
      candidates: [
        { word: 'nublado', note: 'salió esta', tone: 'escolhida' },
        { word: 'gris', note: 'serviría igual', tone: 'alternativa' },
      ],
      keyLabel: 'la clave secreta',
      keyNote: '+ las palabras ya escritas',
      caption: 'Las dos sirven igual. La clave deshace el empate, y ahí es donde queda la marca.',
    },
    travado: {
      written: ['…', 'de', 'Newton', 'se', 'llama', 'Principia'],
      slotLabel: 'próxima palabra',
      candidates: [
        { word: 'Mathematica', note: 'única respuesta correcta', tone: 'unica' },
        { word: 'no hay segunda opción', note: 'cualquier otra estaría mal', tone: 'ausente' },
      ],
      keyLabel: 'la clave secreta',
      keyNote: 'sin empate, nada que decidir',
      caption: 'Sin elección libre no hay qué marcar: hecho, código y corrección de un texto tuyo.',
    },
  },
  'marca-dagua-escolha-it': {
    livre: {
      written: ['Il', 'tempo', 'oggi', 'era', 'freddo', 'e'],
      slotLabel: 'prossima parola',
      candidates: [
        { word: 'nuvoloso', note: 'è uscita questa', tone: 'escolhida' },
        { word: 'grigio', note: 'andrebbe ugualmente bene', tone: 'alternativa' },
      ],
      keyLabel: 'la chiave segreta',
      keyNote: '+ le parole già scritte',
      caption: 'Vanno bene entrambe. La chiave scioglie il pareggio, ed è lì che sta la filigrana.',
    },
    travado: {
      written: ['…', 'di', 'Newton', 'si', 'chiama', 'Principia'],
      slotLabel: 'prossima parola',
      candidates: [
        { word: 'Mathematica', note: 'unica risposta giusta', tone: 'unica' },
        { word: 'nessuna alternativa', note: 'ogni altra sarebbe errata', tone: 'ausente' },
      ],
      keyLabel: 'la chiave segreta',
      keyNote: 'senza pareggio, niente da fare',
      caption: "Senza scelta libera non c'è nulla da marcare: fatto, codice e revisione di un tuo testo.",
    },
  },
};
