/**
 * ══════════════════════════════════════════════════════════════════════
 * Cenas do `WatermarkReachDiagram` — artigo `marca-dagua-claude`
 * ══════════════════════════════════════════════════════════════════════
 *
 * DESTINO NO SITE: `data/watermark-reach-diagram.ts`.
 *
 * A matriz separa as duas condições que o texto trata e que a cobertura
 * costuma juntar: ESCOLHA LIVRE (a marca chega a ser posta?) no eixo
 * horizontal e QUANTIDADE DE TEXTO (dá para detectar?) no vertical. Só o
 * quadrante de cima à direita reúne as duas.
 *
 * Todos os casos saem do que o comunicado da Anthropic afirma — revisão de
 * texto humano, código, trecho factual, tradução, texto curto. Nada aqui é
 * número: são posições qualitativas, e o `source` declara isso dentro do
 * SVG porque a imagem circula sozinha.
 *
 * ORÇAMENTO DE LARGURA — MEDIDO em Fahkwang (`font-chart`), a fonte que o
 * site serve nos gráficos. Rótulo que não cabe é cortado em silêncio pelo
 * viewBox. Por vaga:
 *   cells.headline 30 caracteres  ·  cells.items 38  ·  yHigh/yLow 16
 *   xLow/xHigh 30  ·  xAxis 44  ·  yAxis 40 (contra a ALTURA: é rotacionado)
 * Conferir antes de fechar qualquer tradução:
 *   python3 checar-figuras-marca-dagua.py
 */

export interface WatermarkReachCell {
  headline: string;
  items: string[];
  tone: 'funciona' | 'parcial' | 'nada';
}

export interface WatermarkReachDataset {
  /** Rótulo do eixo vertical (rotacionado -90°). */
  yAxis: string;
  yHigh: string;
  yLow: string;
  /** Rótulo do eixo horizontal. */
  xAxis: string;
  xLow: string;
  xHigh: string;
  /** Ordem = posição: [cima-esquerda, cima-direita, baixo-esquerda, baixo-direita]. */
  cells: WatermarkReachCell[];
}

export const watermarkReachDatasets: Record<string, WatermarkReachDataset> = {
  'marca-dagua-alcance': {
    yAxis: 'quanto texto existe para medir',
    yHigh: 'texto longo',
    yLow: 'texto curto',
    xAxis: 'quanta escolha de palavra o modelo teve',
    xLow: 'pouca ou nenhuma',
    xHigh: 'escolha livre',
    cells: [
      {
        headline: 'Marca fraca demais',
        items: ['um texto seu que ele só revisou', 'código, onde o termo certo é um só'],
        tone: 'parcial',
      },
      {
        headline: 'Aqui a detecção funciona',
        items: ['um artigo inteiro escrito por ele', 'uma tradução feita por ele'],
        tone: 'funciona',
      },
      {
        headline: 'Não há o que medir',
        items: ['uma resposta factual de uma linha', 'duas linhas de código'],
        tone: 'nada',
      },
      {
        headline: 'Marcado, mas curto demais',
        items: ['um parágrafo solto', 'uma legenda, um título, um post'],
        tone: 'parcial',
      },
    ],
  },

  // ── Traduções. Mesma ordem de células: [cima-esq, cima-dir, baixo-esq, baixo-dir].
  'marca-dagua-alcance-en': {
    yAxis: 'how much text there is to measure',
    yHigh: 'long text',
    yLow: 'short text',
    xAxis: 'how much word choice the model had',
    xLow: 'little or none',
    xHigh: 'free choice',
    cells: [
      {
        headline: 'Mark too faint',
        items: ['a text of yours it only proofread', 'code, where one term is the right one'],
        tone: 'parcial',
      },
      {
        headline: 'Here detection works',
        items: ['a whole article written by it', 'a translation it produced'],
        tone: 'funciona',
      },
      {
        headline: 'Nothing to measure',
        items: ['a one-line factual answer', 'two lines of code'],
        tone: 'nada',
      },
      {
        headline: 'Marked, but too short',
        items: ['a stray paragraph', 'a caption, a title, a post'],
        tone: 'parcial',
      },
    ],
  },
  'marca-dagua-alcance-he': {
    yAxis: 'כמה טקסט יש למדוד',
    yHigh: 'טקסט ארוך',
    yLow: 'טקסט קצר',
    xAxis: 'כמה בחירת מילים הייתה לדגם',
    xLow: 'מעט או בכלל לא',
    xHigh: 'בחירה חופשית',
    cells: [
      {
        headline: 'הסימן חלש מדי',
        items: ['טקסט שלכם שהוא רק הגיה', 'קוד, שבו יש מונח נכון אחד'],
        tone: 'parcial',
      },
      {
        headline: 'כאן הזיהוי עובד',
        items: ['מאמר שלם שהוא כתב', 'תרגום שהוא הפיק'],
        tone: 'funciona',
      },
      {
        headline: 'אין מה למדוד',
        items: ['תשובה עובדתית בשורה אחת', 'שתי שורות קוד'],
        tone: 'nada',
      },
      {
        headline: 'מסומן, אבל קצר מדי',
        items: ['פסקה מבודדת', 'כיתוב, כותרת, פוסט'],
        tone: 'parcial',
      },
    ],
  },
  'marca-dagua-alcance-es': {
    yAxis: 'cuánto texto hay para medir',
    yHigh: 'texto largo',
    yLow: 'texto corto',
    xAxis: 'cuánta elección de palabra tuvo el modelo',
    xLow: 'poca o ninguna',
    xHigh: 'elección libre',
    cells: [
      {
        headline: 'Marca demasiado débil',
        items: ['un texto tuyo que solo corrigió', 'código, donde el término es uno'],
        tone: 'parcial',
      },
      {
        headline: 'Aquí la detección funciona',
        items: ['un artículo entero escrito por él', 'una traducción hecha por él'],
        tone: 'funciona',
      },
      {
        headline: 'No hay qué medir',
        items: ['una respuesta factual de una línea', 'dos líneas de código'],
        tone: 'nada',
      },
      {
        headline: 'Marcado, pero muy corto',
        items: ['un párrafo suelto', 'un pie, un título, un post'],
        tone: 'parcial',
      },
    ],
  },
  'marca-dagua-alcance-it': {
    yAxis: "quanto testo c'è da misurare",
    yHigh: 'testo lungo',
    yLow: 'testo breve',
    xAxis: 'quanta scelta di parole ha avuto il modello',
    xLow: 'poca o nessuna',
    xHigh: 'scelta libera',
    cells: [
      {
        headline: 'Filigrana troppo debole',
        items: ['un tuo testo che ha solo rivisto', 'codice, dove il termine è uno'],
        tone: 'parcial',
      },
      {
        headline: 'Qui il rilevamento funziona',
        items: ['un articolo intero scritto da lui', 'una traduzione fatta da lui'],
        tone: 'funciona',
      },
      {
        headline: "Non c'è nulla da misurare",
        items: ['una risposta fattuale di una riga', 'due righe di codice'],
        tone: 'nada',
      },
      {
        headline: 'Marcato, ma troppo breve',
        items: ['un paragrafo isolato', 'una didascalia, un titolo, un post'],
        tone: 'parcial',
      },
    ],
  },
};
