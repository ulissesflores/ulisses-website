/**
 * Registro dos posts da seção `/artigos`.
 *
 * Autoral e manual — deliberadamente FORA de `data/generated/publications.generated.ts`,
 * que é reescrito pelo gerador UPKF a cada build (`npm run upkf:generate`) e sintetiza
 * a prosa num template científico. O corpo de cada post vive em
 * `content/artigos/<slug>/index.<locale>.mdx` e é lido por `lib/content/mdx-loader.ts`.
 *
 * Para publicar um post novo: criar a pasta em `content/artigos/` e adicionar a entrada
 * aqui. A rota, o sitemap e o JSON-LD saem daqui.
 */

import { localeToHreflang, type Locale } from './i18n';

export const artigosCanonicalPath = '/artigos';

export interface Artigo {
  /** Segmento de URL — precisa bater com o diretório em `content/artigos/`. */
  slug: string;
  title: string;
  summary: string;
  /** ISO `YYYY-MM-DD`, no fuso de São Paulo. */
  date: string;
  tags: readonly string[];
  /** Título/resumo traduzidos por locale; ausente cai no original pt-BR (mesma regra do corpo MDX). */
  i18n?: Partial<Record<Locale, Pick<Artigo, 'title' | 'summary'>>>;
}

/** Título e resumo no locale pedido, com fallback pro original pt-BR. */
export function localizeArtigo(artigo: Artigo, locale: Locale): Pick<Artigo, 'title' | 'summary'> {
  return artigo.i18n?.[locale] ?? { title: artigo.title, summary: artigo.summary };
}

export const artigos: readonly Artigo[] = [
  {
    slug: '2026-07-24-claude-opus-5',
    title:
      'Opus 5: a inteligência de fronteira ficou pela metade do preço — e o Reddit foi zoar o gráfico',
    summary:
      'A Anthropic lançou o Claude Opus 5 prometendo inteligência de fronteira por metade do preço. O que mudou de fato na API, o que os gráficos do anúncio mostram quando você abre as imagens — inclusive que o esforço máximo piora o resultado — e por que a zoeira mais votada da comunidade não sobrevive a uma conferida.',
    date: '2026-07-24',
    tags: ['claude', 'anthropic', 'llm', 'api', 'benchmarks'],
    i18n: {
      en: {
        title:
          'Opus 5: frontier intelligence just went half-price — and Reddit showed up to mock the chart',
        summary:
          'Anthropic launched Claude Opus 5 promising frontier intelligence at half the price. What actually changed in the API, what the announcement’s charts show once you open the images — including that maximum effort makes results worse — and why the community’s top-voted joke does not survive a fact-check.',
      },
      es: {
        title:
          'Opus 5: la inteligencia de frontera quedó a mitad de precio — y Reddit fue a burlarse del gráfico',
        summary:
          'Anthropic lanzó Claude Opus 5 prometiendo inteligencia de frontera a mitad de precio. Qué cambió realmente en la API, qué muestran los gráficos del anuncio cuando abres las imágenes — incluido que el esfuerzo máximo empeora el resultado — y por qué la burla más votada de la comunidad no sobrevive a una verificación.',
      },
      it: {
        title:
          'Opus 5: l’intelligenza di frontiera ora costa la metà — e Reddit è corso a sfottere il grafico',
        summary:
          'Anthropic ha lanciato Claude Opus 5 promettendo intelligenza di frontiera a metà prezzo. Cosa è cambiato davvero nell’API, cosa mostrano i grafici dell’annuncio quando si aprono le immagini — incluso il fatto che l’effort massimo peggiora il risultato — e perché lo sfottò più votato della community non sopravvive a una verifica.',
      },
      he: {
        title: 'Opus 5: אינטליגנציית החזית ירדה לחצי המחיר — ו־Reddit הלך ללעוג לגרף',
        summary:
          'Anthropic השיקה את Claude Opus 5 עם הבטחה לאינטליגנציית חזית בחצי המחיר. מה השתנה בפועל ב־API, מה הגרפים של ההכרזה מראים כשפותחים את התמונות — כולל שהמאמץ המקסימלי מרע את התוצאה — ולמה הלעג המדורג ביותר בקהילה לא שורד בדיקה.',
      },
    },
  },
  {
    slug: 'deepseek-v4-flash-0731',
    title:
      'V4-Flash-0731: a DeepSeek publicou a tabela em que ela mesma perde de 9 a 0 — e essa é a melhor peça do lançamento',
    summary:
      'A manchete diz que o modelo barato da DeepSeek bate o flagship da casa. O model card diz mais: o Opus 4.8 vence as nove linhas da tabela — publicado pela própria DeepSeek. Por que anunciar a própria derrota funciona quando você custa 89 vezes menos, o que o salto de 7,3 para 54,4 sem arquitetura nova diz sobre pós-treino, e o que as primeiras 48 horas fora do harness confirmaram e desmentiram.',
    date: '2026-08-01',
    tags: ['deepseek', 'llm', 'api', 'benchmarks', 'open-weights'],
    i18n: {
      en: {
        title:
          'V4-Flash-0731: DeepSeek published the table where it loses 9 to 0 — and that is the best piece of the launch',
        summary:
          'The headline says DeepSeek’s cheap model beats the house flagship. The model card says more: Opus 4.8 wins all nine rows of the table — published by DeepSeek itself. Why announcing your own defeat works when you cost 89 times less, what the jump from 7.3 to 54.4 with no new architecture says about post-training, and what the first 48 hours outside the harness confirmed and debunked.',
      },
      es: {
        title:
          'V4-Flash-0731: DeepSeek publicó la tabla en la que ella misma pierde 9 a 0 — y esa es la mejor pieza del lanzamiento',
        summary:
          'El titular dice que el modelo barato de DeepSeek supera al flagship de la casa. El model card dice más: el Opus 4.8 gana las nueve filas de la tabla — publicado por la propia DeepSeek. Por qué anunciar la propia derrota funciona cuando cuestas 89 veces menos, qué dice el salto de 7,3 a 54,4 sin arquitectura nueva sobre el post-entrenamiento, y qué confirmaron y desmintieron las primeras 48 horas fuera del harness.',
      },
      it: {
        title:
          'V4-Flash-0731: DeepSeek ha pubblicato la tabella in cui è lei stessa a perdere 9 a 0 — ed è il pezzo migliore del lancio',
        summary:
          'Il titolo dice che il modello economico di DeepSeek batte il flagship di casa. La model card dice di più: Opus 4.8 vince tutte e nove le righe della tabella — pubblicata da DeepSeek stessa. Perché annunciare la propria sconfitta funziona quando costi 89 volte meno, cosa dice il salto da 7,3 a 54,4 senza nuova architettura sul post-training, e cosa le prime 48 ore fuori dall’harness hanno confermato e smentito.',
      },
      he: {
        title:
          'V4-Flash-0731: DeepSeek פרסמה את הטבלה שבה היא עצמה מפסידה 9:0 — וזה החלק הטוב ביותר בהשקה',
        summary:
          'הכותרת אומרת שהמודל הזול של DeepSeek מנצח את ספינת הדגל של הבית. ה־model card אומר יותר: Opus 4.8 מנצח בכל תשע שורות הטבלה — בפרסום של DeepSeek עצמה. למה הכרזה על התבוסה של עצמך עובדת כשאתה עולה פי 89 פחות, מה הקפיצה מ־7.3 ל־54.4 בלי ארכיטקטורה חדשה אומרת על post-training, ומה 48 השעות הראשונות מחוץ ל־harness אישרו והפריכו.',
      },
    },
  },
  {
    slug: 'quantas-pessoas-usam-ia',
    title:
      'Quantas pessoas usam IA? Fui conferir os números gigantes — eles contam contas, não pessoas',
    summary:
      'Dois vírgula quatro bilhões de pessoas usam IA generativa, diz a manchete — mas a própria fonte desaconselha ler o número como pessoas. Conferi cada degrau da pirâmide na fonte primária, acrescentei o degrau que nenhuma versão internacional tem (o Brasil) e o resultado muda a leitura: os pagantes do mundo inteiro são ~1% da humanidade, e a bolha dos coding agents, 0,14%. Você não está atrasado — o feed é a bolha falando de si mesma.',
    date: '2026-08-02',
    tags: ['ia', 'adocao', 'estatisticas', 'fact-check', 'brasil'],
    i18n: {
      en: {
        title:
          'How many people use AI? I checked the giant numbers — they count accounts, not people',
        summary:
          '2.42 billion people use generative AI, says the headline — but the source itself warns against reading that number as people. I checked every step of the pyramid against primary sources, added the step no international version has (Brazil), and the result changes the reading: the world’s paying users are ~1% of humanity, and the coding-agents bubble is 0.14%. You are not behind — the feed is the bubble talking to itself.',
      },
      es: {
        title:
          '¿Cuántas personas usan IA? Fui a verificar los números gigantes — cuentan cuentas, no personas',
        summary:
          '2420 millones de personas usan IA generativa, dice el titular — pero la propia fuente desaconseja leer ese número como personas. Verifiqué cada peldaño de la pirámide en la fuente primaria, añadí el peldaño que ninguna versión internacional tiene (Brasil) y el resultado cambia la lectura: los usuarios de pago de todo el mundo son ~1 % de la humanidad, y la burbuja de los coding agents, el 0,14 %. No llegas tarde — el feed es la burbuja hablando de sí misma.',
      },
      it: {
        title:
          'Quante persone usano l’IA? Sono andato a verificare i numeri giganti — contano account, non persone',
        summary:
          '2,42 miliardi di persone usano l’IA generativa, dice il titolo — ma la fonte stessa sconsiglia di leggere quel numero come persone. Ho verificato ogni gradino della piramide sulle fonti primarie, ho aggiunto il gradino che nessuna versione internazionale ha (il Brasile) e il risultato cambia la lettura: i paganti di tutto il mondo sono ~1% dell’umanità, e la bolla dei coding agents lo 0,14%. Non siete in ritardo — il feed è la bolla che parla di sé stessa.',
      },
      he: {
        title:
          'כמה אנשים משתמשים ב־AI? הלכתי לבדוק את המספרים הענקיים — הם סופרים חשבונות, לא אנשים',
        summary:
          '‏2.42 מיליארד אנשים משתמשים ב־AI גנרטיבי, אומרת הכותרת — אבל המקור עצמו מזהיר שלא לקרוא את המספר הזה כאנשים. בדקתי כל שלב בפירמידה מול המקורות הראשוניים, הוספתי את השלב שאין באף גרסה בינלאומית (ברזיל), והתוצאה משנה את התמונה: המשלמים בעולם כולו הם כ־1% מהאנושות, ובועת ה־coding agents — ‎0.14%. אתם לא מאחור — הפיד הוא הבועה שמדברת עם עצמה.',
      },
    },
  },
  {
    slug: 'noisy-tv-agentes',
    title:
      'Noisy-TV em agentes LLM: varri quatro literaturas atrás da armadilha — ninguém a formalizou, e eu a medi no meu próprio agente',
    summary:
      'Em 2018, um agente movido a curiosidade parou hipnotizado diante de uma TV de estática — o noisy-TV problem, que o aprendizado por reforço passou sete anos domando. Varri quatro literaturas atrás da mesma armadilha na instrumentação de curiosidade de agentes LLM: ninguém a formalizou. E ela não é hipotética — no agente experimental que mantenho na minha máquina, o ruído do instrumento (σ=0,177) é maior que o sinal que ele deveria medir.',
    date: '2026-08-02',
    tags: ['agentes', 'llm', 'curiosidade', 'noisy-tv', 'embeddings', 'reinforcement-learning'],
    i18n: {
      en: {
        title:
          'Noisy-TV in LLM agents: I swept four literatures for the trap — nobody has formalized it, and I measured it in my own agent',
        summary:
          "In 2018, a curiosity-driven agent froze, hypnotized, in front of a TV tuned to static — the noisy-TV problem, which reinforcement learning spent seven years taming. I swept four literatures for the same trap in the curiosity instrumentation of LLM agents: nobody has formalized it. And it is not hypothetical — in the experimental agent I keep on my own machine, the instrument's noise (σ=0.177) is larger than the signal it is supposed to measure.",
      },
      es: {
        title:
          'Noisy-TV en agentes LLM: barrí cuatro literaturas buscando la trampa — nadie la formalizó, y yo la medí en mi propio agente',
        summary:
          'En 2018, un agente movido por curiosidad se quedó hipnotizado frente a un televisor de estática — el noisy-TV problem, que el aprendizaje por refuerzo pasó siete años domando. Barrí cuatro literaturas buscando la misma trampa en la instrumentación de curiosidad de los agentes LLM: nadie la formalizó. Y no es hipotética — en el agente experimental que mantengo en mi máquina, el ruido del instrumento (σ=0,177) es mayor que la señal que debería medir.',
      },
      it: {
        title:
          "Noisy-TV negli agenti LLM: ho setacciato quattro letterature a caccia della trappola — nessuno l'ha formalizzata, e io l'ho misurata nel mio stesso agente",
        summary:
          "Nel 2018 un agente mosso dalla curiosità si fermò ipnotizzato davanti a una TV che trasmetteva statica — il noisy-TV problem, che l'apprendimento per rinforzo ha passato sette anni a domare. Ho setacciato quattro letterature a caccia della stessa trappola nella strumentazione della curiosità degli agenti LLM: nessuno l'ha formalizzata. E non è ipotetica — nell'agente sperimentale che mantengo sulla mia macchina, il rumore dello strumento (σ=0,177) è più grande del segnale che dovrebbe misurare.",
      },
      he: {
        title:
          'Noisy-TV בסוכני LLM: סרקתי ארבע ספרויות בחיפוש אחר המלכודת — איש לא פרמל אותה, ואני מדדתי אותה בסוכן של עצמי',
        summary:
          'ב־2018 נעצר סוכן מונע־סקרנות, מהופנט, מול טלוויזיה של רעש סטטי — ה־noisy-TV problem, שלמידת החיזוק בילתה שבע שנים באילופו. סרקתי ארבע ספרויות בחיפוש אחר אותה מלכודת באינסטרומנטציה של סקרנות בסוכני LLM: איש לא פרמל אותה. והיא אינה היפותטית — בסוכן הניסיוני שאני מתחזק במכונה שלי, רעש המכשיר (σ=0.177) גדול מהאות שהוא אמור למדוד.',
      },
    },
  },
];

/** Posts do mais recente para o mais antigo — ordem de exibição do índice. */
export const artigosByDateDesc: readonly Artigo[] = [...artigos].sort((a, b) =>
  b.date.localeCompare(a.date),
);

export function findArtigo(slug: string): Artigo | undefined {
  return artigos.find((artigo) => artigo.slug === slug);
}

/** Data mais recente da seção — usada como `lastModified` do índice no sitemap. */
export const artigosLatestDate: string = artigosByDateDesc[0]?.date ?? '';

/** `YYYY-MM-DD` → instante estável (meio-dia em SP não vira o dia em nenhum fuso do site). */
export function artigoDateToIso(isoDate: string): string {
  return new Date(`${isoDate}T12:00:00-03:00`).toISOString();
}

/** `YYYY-MM-DD` → data por extenso no idioma do leitor. */
export function formatArtigoDate(isoDate: string, locale: Locale): string {
  return new Intl.DateTimeFormat(localeToHreflang[locale], {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    timeZone: 'America/Sao_Paulo',
  }).format(new Date(`${isoDate}T12:00:00-03:00`));
}
