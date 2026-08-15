/**
 * ══════════════════════════════════════════════════════════════════════
 * Cena do `TextVsFileDiagram` — artigo `marca-dagua-claude`
 * ══════════════════════════════════════════════════════════════════════
 *
 * DESTINO NO SITE: `data/text-vs-file-diagram.ts`.
 *
 * Os dois lados saem direto do comunicado da Anthropic: no texto não se
 * acrescenta nada (o padrão está na escolha das palavras); no arquivo de
 * imagem vai uma credencial C2PA assinada nos metadados, sem alterar o
 * conteúdo. A frase das pílulas é ilustrativa — serve para mostrar que a
 * marca fica ESPALHADA pelas escolhas, não num ponto.
 *
 * ORÇAMENTO DE LARGURA — MEDIDO em Fahkwang (`font-chart`). Por vaga:
 *   badge 34 caracteres  ·  subtitle 40  ·  notes 46  ·  wordsNote 44
 *   tagLabel 18 (etiqueta estreita)  ·  words.text 10 (pílula de largura igual)
 * Quatro pílulas é o teto: com cinco, a vaga cai para ~8 caracteres e
 * qualquer tradução estoura. Conferir antes de fechar tradução:
 *   python3 checar-figuras-marca-dagua.py
 */

export interface TextVsFileWord {
  text: string;
  /** `true` = palavra que a chave decidiu (destacada em azul). */
  marked: boolean;
}

export interface TextVsFileDataset {
  left: {
    badge: string;
    subtitle: string;
    words: TextVsFileWord[];
    wordsNote: string;
    /** Exatamente duas: a geometria reserva duas linhas. */
    notes: string[];
  };
  right: {
    badge: string;
    subtitle: string;
    tagLabel: string;
    notes: string[];
  };
}

export const textVsFileDatasets: Record<string, TextVsFileDataset> = {
  'marca-dagua-texto-vs-arquivo': {
    left: {
      badge: "No texto: marca d'água",
      subtitle: 'o que o Claude escreve',
      words: [
        { text: 'o', marked: false },
        { text: 'café', marked: false },
        { text: 'esfriou', marked: true },
        { text: 'rápido', marked: true },
      ],
      wordsNote: 'destacadas, as palavras que a chave decidiu',
      notes: ['Nada é acrescentado ao texto.', 'O padrão está na escolha das palavras.'],
    },
    right: {
      badge: 'No arquivo: credencial',
      subtitle: '.png · .jpg · .svg',
      tagLabel: 'credencial C2PA',
      notes: [
        'Nada no conteúdo do arquivo muda.',
        'A nota assinada fica nos metadados, ao lado.',
      ],
    },
  },

  // ── Traduções. As pílulas têm largura IGUAL entre si: a vaga é de ~10
  // caracteres e a frase tem de caber em quatro palavras curtas naquela língua.
  'marca-dagua-texto-vs-arquivo-en': {
    left: {
      badge: 'In text: watermark',
      subtitle: 'what Claude writes',
      words: [
        { text: 'the', marked: false },
        { text: 'coffee', marked: false },
        { text: 'went', marked: true },
        { text: 'cold', marked: true },
      ],
      wordsNote: 'highlighted, the words the key decided',
      notes: ['Nothing is added to the text.', 'The pattern is in the choice of words.'],
    },
    right: {
      badge: 'In the file: credential',
      subtitle: '.png · .jpg · .svg',
      tagLabel: 'C2PA credential',
      notes: [
        'Nothing in the file content changes.',
        'The signed note sits in the metadata.',
      ],
    },
  },
  'marca-dagua-texto-vs-arquivo-he': {
    left: {
      badge: 'בטקסט: סימן מים',
      subtitle: 'מה שקלוד כותב',
      // Ordem INVERTIDA de propósito: as pílulas são desenhadas da esquerda
      // para a direita, e o leitor hebraico varre da direita para a esquerda.
      // Assim ele lê "הקפה התקרר מהר מאוד" na ordem certa. (O "ה" sozinho da
      // primeira versão não se lê: o artigo definido gruda na palavra.)
      words: [
        { text: 'מאוד', marked: false },
        { text: 'מהר', marked: true },
        { text: 'התקרר', marked: true },
        { text: 'הקפה', marked: false },
      ],
      wordsNote: 'מודגשות, המילים שהמפתח הכריע',
      notes: ['שום דבר לא נוסף לטקסט.', 'הדפוס נמצא בבחירת המילים.'],
    },
    right: {
      badge: 'בקובץ: תעודה',
      subtitle: '.png · .jpg · .svg',
      tagLabel: 'תעודת C2PA',
      notes: [
        'שום דבר בתוכן הקובץ לא משתנה.',
        'ההערה החתומה יושבת במטא-נתונים.',
      ],
    },
  },
  'marca-dagua-texto-vs-arquivo-es': {
    left: {
      badge: 'En el texto: marca de agua',
      subtitle: 'lo que Claude escribe',
      words: [
        { text: 'el', marked: false },
        { text: 'café', marked: false },
        { text: 'se', marked: true },
        { text: 'enfrió', marked: true },
      ],
      wordsNote: 'destacadas, las palabras que eligió la clave',
      notes: ['No se añade nada al texto.', 'El patrón está en la elección de palabras.'],
    },
    right: {
      badge: 'En el archivo: credencial',
      subtitle: '.png · .jpg · .svg',
      tagLabel: 'credencial C2PA',
      notes: [
        'Nada del contenido del archivo cambia.',
        'La nota firmada queda en los metadatos.',
      ],
    },
  },
  'marca-dagua-texto-vs-arquivo-it': {
    left: {
      badge: 'Nel testo: filigrana',
      subtitle: 'ciò che Claude scrive',
      words: [
        { text: 'il', marked: false },
        { text: 'caffè', marked: false },
        { text: 'si', marked: true },
        { text: 'raffreddò', marked: true },
      ],
      wordsNote: 'evidenziate, le parole decise dalla chiave',
      notes: ['Al testo non viene aggiunto nulla.', 'Lo schema sta nella scelta delle parole.'],
    },
    right: {
      badge: 'Nel file: credenziale',
      subtitle: '.png · .jpg · .svg',
      tagLabel: 'credenziale C2PA',
      notes: [
        'Nulla del contenuto del file cambia.',
        'La nota firmata sta nei metadati.',
      ],
    },
  },
};
