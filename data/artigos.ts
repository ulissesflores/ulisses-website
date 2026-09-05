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
  /**
   * Capa do artigo, servida de `public/artigos/<slug>/` (`content/` não é servido —
   * ver o cabeçalho de `lib/content/article-figure.tsx`).
   *
   * UMA POR LOCALE, porque a arte traz o título, os rótulos e o atalho DESENHADOS
   * dentro dela: servir a capa portuguesa a quem lê em inglês é pior que não servir
   * capa nenhuma. Locale ausente do mapa não ganha capa no corpo e cai no card
   * tipográfico de `app/[locale]/artigos/[slug]/opengraph-image.tsx`, que é
   * localizado — some a imagem, nunca o idioma.
   *
   * Que os arquivos existam é gate: `data/artigos-hero.test.ts`.
   */
  hero?: {
    /** Dimensões reais dos arquivos de `src` — iguais nos cinco. */
    width: number;
    height: number;
    /** `src` é a capa do corpo; `og` é o recorte 1200x630, leve — `og:image` pesado o WhatsApp descarta calado. */
    locales: Partial<Record<Locale, { src: string; og: string }>>;
  };
  /** Título/resumo traduzidos por locale; ausente cai no original pt-BR (mesma regra do corpo MDX). */
  i18n?: Partial<Record<Locale, Pick<Artigo, 'title' | 'summary'>>>;
}

/** Título e resumo no locale pedido, com fallback pro original pt-BR. */
export function localizeArtigo(artigo: Artigo, locale: Locale): Pick<Artigo, 'title' | 'summary'> {
  return artigo.i18n?.[locale] ?? { title: artigo.title, summary: artigo.summary };
}

export const artigos: readonly Artigo[] = [
  {
    slug: 'estatisticas-openai',
    title: 'Só 8 dos 20 números mais citados sobre a OpenAI são da OpenAI — o resto é vazamento, meta ou ninguém sabe de onde veio',
    summary: 'Classifiquei os 20 números mais citados sobre a OpenAI: 8 são oficiais, 6 são reportagem, 3 são meta e 3 ninguém sabe de onde vieram. O 92% tem 31 meses. Fui à fonte de cada número que circula em compilados sobre a empresa: os da própria OpenAI conferem — e são os menos interessantes; o que dá manchete é o que ela nunca assinou. O "92% da Fortune 500" saiu da resposta da OpenAI ao processo do New York Times, em janeiro de 2024, e circula sem data; 24 bi de receita é oficial, 40 bi é estimativa, 280 bi é meta — juntar os três com o mesmo verbo está errado mesmo com cada número certo; a SoftBank investiu 64,6 bi, não "mais de 71", e os 500 bi do Stargate são compromisso de computação, não investimento. O "salário de US$ 76.001" de Altman é a soma de duas colunas do Form 990, o ano seguinte dá 113.674, e ele é o décimo de doze nomes em remuneração. No Brasil, o "50 milhões de usuários" aparece idêntico em agosto de 2025 e agosto de 2026 — as mensagens por dia subiram 54%.',
    date: '2026-08-26',
    tags: ['ia', 'openai', 'estatisticas', 'metodologia'],
    hero: {
      width: 2400,
      height: 1260,
      locales: {
        'pt-br': { src: '/artigos/estatisticas-openai/hero.png', og: '/artigos/estatisticas-openai/hero-og.png' },
        'en': { src: '/artigos/estatisticas-openai/hero-en.png', og: '/artigos/estatisticas-openai/hero-en-og.png' },
        'es': { src: '/artigos/estatisticas-openai/hero-es.png', og: '/artigos/estatisticas-openai/hero-es-og.png' },
        'it': { src: '/artigos/estatisticas-openai/hero-it.png', og: '/artigos/estatisticas-openai/hero-it-og.png' },
        'he': { src: '/artigos/estatisticas-openai/hero-he.png', og: '/artigos/estatisticas-openai/hero-he-og.png' },
      },
    },
    i18n: {
      en: {
        title: 'Only 8 of the 20 most-cited OpenAI numbers are from OpenAI — the rest is leaked, a target, or untraceable',
        summary: 'I classified the 20 most-cited numbers about OpenAI: 8 are official, 6 are reporting, 3 are targets, and 3 no one knows where they came from. The 92% is 31 months old. I went to the source of every number circulating in roundups about the company: the ones from OpenAI itself check out — and they are the least interesting; what makes headlines is what it never signed off on. The "92% of the Fortune 500" came from OpenAI\'s response to the New York Times lawsuit, in January 2024, and circulates with no date; US$ 24bn in revenue is official, US$ 40bn is an estimate, US$ 280bn is a target — lumping the three together with the same verb is wrong even with every number right; SoftBank invested US$ 64.6bn, not "more than 71," and Stargate\'s US$ 500bn is a compute commitment, not investment. Altman\'s "US$ 76,001 salary" is the sum of two Form 990 columns, the following year comes to US$ 113,674, and he is tenth of twelve names in compensation. In Brazil, the "50 million users" figure appears identical in August 2025 and August 2026 — messages per day rose 54%.',
      },
      es: {
        title: 'Solo 8 de 20 números más citados sobre OpenAI son de OpenAI — el resto es filtración, meta o nadie sabe de dónde vino',
        summary: 'Clasifiqué los 20 números más citados sobre OpenAI: 8 son oficiales, 6 son reportaje, 3 son meta y de 3 nadie sabe de dónde salieron. El 92 % tiene 31 meses. Fui a la fuente de cada número que circula en los compilados sobre la empresa: los de la propia OpenAI concuerdan — y son los menos interesantes; lo que da titulares es lo que ella nunca firmó. El "92 % de la Fortune 500" salió de la respuesta de OpenAI a la demanda del New York Times, en enero de 2024, y circula sin fecha; 24 mil millones de ingresos es oficial, 40 mil millones es estimación, 280 mil millones es meta — juntar los tres con el mismo verbo está mal aunque cada número sea correcto; SoftBank invirtió 64,6 mil millones, no "más de 71", y los 500 mil millones de Stargate son un compromiso de computación, no una inversión. El "salario de US$ 76.001" de Altman es la suma de dos columnas del Form 990, el año siguiente da 113.674, y él es el décimo de doce nombres en remuneración. En Brasil, "50 millones de usuarios" aparece idéntico en agosto de 2025 y agosto de 2026 — los mensajes por día subieron 54 %.',
      },
      it: {
        title: 'Solo 8 dei 20 numeri più citati su OpenAI sono di OpenAI — il resto è fuga, obiettivo o nessuno sa da dove venga',
        summary: 'Ho classificato i 20 numeri più citati sull\'OpenAI: 8 sono ufficiali, 6 sono reportage, 3 sono obiettivi e 3 nessuno sa da dove siano venuti. Il 92% ha 31 mesi. Sono andato alla fonte di ogni numero che circola nelle raccolte sull\'azienda: quelli della stessa OpenAI sono corretti — e sono i meno interessanti; quello che fa notizia è ciò che lei non ha mai firmato. Il "92% della Fortune 500" viene dalla risposta dell\'OpenAI alla causa del New York Times, del gennaio 2024, e circola senza data; 24 mld di ricavi è ufficiale, 40 mld è una stima, 280 mld è un obiettivo — unire i tre con lo stesso verbo è sbagliato anche con ogni numero corretto; SoftBank ha investito 64,6 mld, non "oltre 71", e i 500 mld di Stargate sono un impegno di calcolo, non un investimento. Lo "stipendio di 76.001 dollari" di Altman è la somma di due colonne del Form 990, l\'anno successivo dà 113.674, ed è il decimo di dodici nomi in retribuzione. In Brasile, "50 milioni di utenti" appare identico in agosto 2025 e agosto 2026 — i messaggi al giorno sono saliti del 54%.',
      },
      he: {
        title: 'רק 8 מ-20 המספרים המצוטטים ביותר על OpenAI הם שלה — השאר דליפה, יעד או מקור אלמוני',
        summary: 'מיינתי את 20 המספרים המצוטטים ביותר על OpenAI: 8 רשמיים, 6 דיווח, 3 יעד ו-3 שאף אחד לא יודע מאיפה הגיעו. ל-92% יש 31 חודשים. פניתי למקור של כל מספר שמסתובב במקבצים על החברה: אלה של OpenAI עצמה מתאמתים — והם הכי פחות מעניינים; מה שעושה כותרת הוא מה שהיא מעולם לא חתמה עליו. ה-"92% מ-Fortune 500" יצא מתשובת OpenAI לתביעת ה-New York Times, בינואר 2024, ומסתובב בלי תאריך; 24 מיליארד הכנסה הם רשמי, 40 מיליארד הערכה, 280 מיליארד יעד — לחבר את השלושה עם אותו פועל שגוי גם כשכל מספר נכון. SoftBank השקיעה 64.6 מיליארד, לא "יותר מ-71", וה-500 מיליארד של Stargate הם התחייבות מחשוב, לא השקעה. ה-"משכורת של 76,001 דולר" של אלטמן היא סכום של שתי עמודות ב-Form 990, השנה שאחריה נותנת 113,674, והוא העשירי מתוך שנים עשר שמות בתגמול. בברזיל, "50 מיליון משתמשים" מופיע זהה באוגוסט 2025 ואוגוסט 2026 — ההודעות ביום עלו ב-54%.',
      },
    },
  },
  {
    slug: 'estatisticas-llms',
    title: 'Quantos modelos de linguagem existem? 274, 95 ou 403.420 — e a nota de código que circula vem de um teste que o próprio criador abandonou',
    summary: '274, 95 ou 403.420 modelos de linguagem: as três contagens estão certas. E o benchmark de código que circula foi abandonado pelo próprio criador em fevereiro. Fui conferir as estatísticas de LLM que circulam em compilados: "quantos modelos existem" não tem resposta porque sobra definição — 403.420 repositórios no Hugging Face (medição própria, um comando de uma linha), 95 notáveis no AI Index de Stanford, 274 num catálogo editorial. A nota que o laboratório dá a si mesmo aguentou a conferência (zero a quatro pontos de diferença onde o mesmo modelo foi medido de fora); o que não aguenta é a régua: a OpenAI declarou o SWE-bench Verified contaminado e parou de publicá-lo em 23/02/2026, e em agosto ele ainda é o teste de "quem programa melhor". Comparações entre versões erram o sinal (o DeepSeek de agosto está 8 pontos à frente do Opus 4.8, não atrás); "o mais caro" custa US$ 30 nos compilados e US$ 150 no catálogo real; os maiores modelos com tamanho conhecido são todos abertos. No Brasil, a Maritaca precifica em reais e publica o único comparativo de custo de suíte em moeda nacional: R$ 206 no Sabiá 4 Thinking contra R$ 590 no Opus 4.8.',
    date: '2026-08-26',
    tags: ['ia', 'llm', 'estatisticas', 'benchmarks', 'metodologia'],
    hero: {
      width: 2400,
      height: 1260,
      locales: {
        'pt-br': { src: '/artigos/estatisticas-llms/hero.png', og: '/artigos/estatisticas-llms/hero-og.png' },
        'en': { src: '/artigos/estatisticas-llms/hero-en.png', og: '/artigos/estatisticas-llms/hero-en-og.png' },
        'es': { src: '/artigos/estatisticas-llms/hero-es.png', og: '/artigos/estatisticas-llms/hero-es-og.png' },
        'it': { src: '/artigos/estatisticas-llms/hero-it.png', og: '/artigos/estatisticas-llms/hero-it-og.png' },
        'he': { src: '/artigos/estatisticas-llms/hero-he.png', og: '/artigos/estatisticas-llms/hero-he-og.png' },
      },
    },
    i18n: {
      en: {
        title: 'How many language models exist? 274, 95, or 403,420 — and the coding score everyone cites comes from a test its own creator abandoned',
        summary: '274, 95, or 403,420 language models: all three counts are correct. And the coding benchmark everyone cites was abandoned by its own creator in February. I went to check the LLM statistics that circulate in roundups: "how many models exist" has no answer, because there is too much definition — 403,420 repositories on Hugging Face (my own measurement, a one-line command), 95 notable models in Stanford\'s AI Index, 274 in an editorial catalog. The score a lab gives itself held up under checking (zero to four points of difference where the same model was measured from outside); what does not hold up is the ruler: OpenAI declared SWE-bench Verified contaminated and stopped publishing it on February 23, 2026, and in August it is still the test for "who codes best." Version-to-version comparisons get the sign wrong (August\'s DeepSeek is 8 points ahead of Opus 4.8, not behind); "the most expensive" costs US$ 30 in the roundups and US$ 150 in the real catalog; the largest models with a known size are all open. In Brazil, Maritaca prices in reais and publishes the only suite-cost comparison in national currency: R$ 206 on Sabiá 4 Thinking against R$ 590 on Opus 4.8.',
      },
      es: {
        title: '¿Cuántos modelos de lenguaje hay? 274, 95 o 403.420 — y la nota de código que circula viene de una prueba que su propio creador abandonó',
        summary: '274, 95 o 403.420 modelos de lenguaje: los tres conteos son correctos. Y el benchmark de código que circula fue abandonado por su propio creador en febrero. Fui a verificar las estadísticas de LLM que circulan en compilados: "cuántos modelos existen" no tiene respuesta porque sobra definición — 403.420 repositorios en Hugging Face (medición propia, un comando de una línea), 95 notables en el AI Index de Stanford, 274 en un catálogo editorial. La nota que el laboratorio se da a sí mismo resistió la comprobación (cero a cuatro puntos de diferencia donde el mismo modelo fue medido desde fuera); lo que no resiste es la regla: OpenAI declaró el SWE-bench Verified contaminado y dejó de publicarlo el 23/02/2026, y en agosto todavía es la prueba de "quién programa mejor". Las comparaciones entre versiones se equivocan de signo (el DeepSeek de agosto está 8 puntos por delante del Opus 4.8, no por detrás); "el más caro" cuesta US$ 30 en los compilados y US$ 150 en el catálogo real; los modelos más grandes con tamaño conocido son todos abiertos. En Brasil, Maritaca fija precios en reales y publica el único comparativo de costo de suite en moneda nacional: R$ 206 en el Sabiá 4 Thinking contra R$ 590 en el Opus 4.8.',
      },
      it: {
        title: 'Quanti modelli linguistici esistono? 274, 95 o 403.420 — e il voto di codice che circola viene da un test abbandonato dal suo creatore',
        summary: '274, 95 o 403.420 modelli linguistici: i tre conteggi sono tutti corretti. E il benchmark di codice che circola è stato abbandonato dal suo stesso creatore a febbraio. Sono andato a verificare le statistiche di LLM che circolano nelle raccolte: "quanti modelli esistono" non ha risposta, perché di definizioni ce n\'è in eccesso — 403.420 repository su Hugging Face (misurazione propria, un comando di una riga), 95 notevoli nell\'AI Index di Stanford, 274 in un catalogo editoriale. Il voto che il laboratorio dà a se stesso ha retto alla verifica (zero-quattro punti di differenza dove lo stesso modello è stato misurato da fuori); ciò che non regge è il metro: la OpenAI ha dichiarato lo SWE-bench Verified contaminato e ha smesso di pubblicarlo il 23/02/2026, e ad agosto è ancora il test di "chi programma meglio". I confronti tra versioni sbagliano il segno (il DeepSeek di agosto è 8 punti avanti a Opus 4.8, non indietro); "il più caro" costa US$ 30 nelle raccolte e US$ 150 nel catalogo reale; i modelli più grandi con dimensione nota sono tutti aperti. In Brasile, la Maritaca fa i prezzi in reais e pubblica l\'unico confronto di costo di suite in moneta nazionale: R$ 206 sul Sabiá 4 Thinking contro R$ 590 sull\'Opus 4.8.',
      },
      he: {
        title: 'כמה מודלי שפה קיימים? 274, 95 או 403,420 — והציון בתכנות שמסתובב מגיע ממבחן שהיוצר שלו עצמו נטש',
        summary: '274, 95 או 403,420 מודלי שפה: שלוש הספירות נכונות. וה-benchmark של קוד שמסתובב ננטש על ידי היוצר שלו עצמו בפברואר. הלכתי לבדוק את הסטטיסטיקות של LLM שמסתובבות באוספים: ל"כמה מודלים קיימים" אין תשובה כי יש עודף הגדרות — 403,420 מאגרים ב-Hugging Face (מדידה עצמית, פקודה אחת בשורה), 95 בולטים ב-AI Index של סטנפורד, 274 בקטלוג עורכי. הציון שהמעבדה נותנת לעצמה עמד באימות (הפרש של אפס עד ארבע נקודות במקום שבו אותו מודל נמדד מבחוץ); מה שלא עומד הוא הסרגל: OpenAI הכריזה ש-SWE-bench Verified מזוהם והפסיקה לפרסם אותו ב-23 בפברואר 2026, ובאוגוסט הוא עדיין המבחן של "מי מתכנת טוב יותר". השוואות בין גרסאות טועות בכיוון (ה-DeepSeek של אוגוסט נמצא 8 נקודות לפני Opus 4.8, לא אחרי); "היקר ביותר" עולה US$ 30 באוספים ו-US$ 150 בקטלוג האמיתי; המודלים הגדולים ביותר עם גודל ידוע כולם פתוחים. בברזיל, Maritaca מתמחרת בריאלים ומפרסמת את ההשוואה היחידה של עלות חבילה במטבע לאומי: R$ 206 ב-Sabiá 4 Thinking מול R$ 590 ב-Opus 4.8.',
      },
    },
  },
  {
    slug: 'glm-5-3-flash',
    title:
      'GLM 5.3 Flash: 5 pontos abaixo do Fable por 3% do custo por tarefa — e a manchete dos 100 trilhões trocou de verbo no caminho',
    summary:
      'Os quatro números conferem: 57 contra 62 no índice, US$ 0,09 contra US$ 3,14 por tarefa. A manchete dos 100 trilhões, não: a frase é de outra empresa.',
    date: '2026-09-04',
    tags: ['glm', 'z.ai', 'llm', 'benchmarks', 'open-weights', 'fact-check'],
    hero: {
      width: 2400,
      height: 1260,
      locales: {
        'pt-br': { src: '/artigos/glm-5-3-flash/hero.jpg', og: '/artigos/glm-5-3-flash/hero-og.jpg' },
        'en': { src: '/artigos/glm-5-3-flash/hero-en.jpg', og: '/artigos/glm-5-3-flash/hero-en-og.jpg' },
        'es': { src: '/artigos/glm-5-3-flash/hero-es.jpg', og: '/artigos/glm-5-3-flash/hero-es-og.jpg' },
        'it': { src: '/artigos/glm-5-3-flash/hero-it.jpg', og: '/artigos/glm-5-3-flash/hero-it-og.jpg' },
        'he': { src: '/artigos/glm-5-3-flash/hero-he.jpg', og: '/artigos/glm-5-3-flash/hero-he-og.jpg' },
      },
    },
    i18n: {
      en: {
        title:
          'GLM 5.3 Flash: five points below Fable at 3% of the cost per task — and the 100-trillion headline changed verbs along the way',
        summary:
          'Four numbers check out: 57 against 62 on the index, US$ 0.09 against US$ 3.14 per task. The 100-trillion headline does not: the sentence belongs to another company.',
      },
      es: {
        title:
          'GLM 5.3 Flash: cinco puntos por debajo de Fable por el 3 % del coste por tarea — y el titular de los 100 billones cambió de verbo por el camino',
        summary:
          'Los cuatro números cuadran: 57 frente a 62 en el índice, 0,09 USD frente a 3,14 USD por tarea. El titular de los 100 billones, no: la frase es de otra empresa.',
      },
      it: {
        title:
          'GLM 5.3 Flash: cinque punti sotto Fable al 3% del costo per attività — e il titolo dei 100.000 miliardi ha cambiato verbo per strada',
        summary:
          'I quattro numeri tornano: 57 contro 62 nell’indice, 0,09 USD contro 3,14 USD per attività. Il titolo dei 100.000 miliardi no: la frase è di un’altra azienda.',
      },
      he: {
        title:
          'GLM 5.3 Flash: ‏חמש נקודות מתחת ל‑Fable בשלושה אחוזים מהעלות למשימה — והכותרת על 100 טריליון החליפה פועל בדרך',
        summary:
          'ארבעת המספרים מאומתים: 57 מול 62 במדד, ‏0.09 דולר מול 3.14 דולר למשימה. הכותרת על 100 טריליון — לא: המשפט שייך לחברה אחרת.',
      },
    },
  },
  /**
   * Primeiro do array porque é o mais recente e não divide data com ninguém;
   * a ordenação real é o `sort` estável de `artigosByDateDesc`.
   */
  {
    slug: 'ia-mercado-de-trabalho',
    title: 'A IA já é o motivo nº 1 de demissão nos EUA — no Brasil, ninguém faz a conta',
    summary: 'Os EUA têm uma série mensal de cortes atribuídos à IA (Challenger). O Brasil tem exposição de 37–41% do emprego, uso recorde de ChatGPT e Claude — e nenhuma estatística do que já aconteceu. Fui atrás das primárias.',
    date: '2026-09-02',
    tags: ['ia', 'brasil', 'fact-check', 'estatisticas'],
    hero: {
      width: 2400,
      height: 1260,
      locales: {
        'pt-br': { src: '/artigos/ia-mercado-de-trabalho/hero.png', og: '/artigos/ia-mercado-de-trabalho/hero-og.jpg' },
        'en': { src: '/artigos/ia-mercado-de-trabalho/hero-en.png', og: '/artigos/ia-mercado-de-trabalho/hero-en-og.jpg' },
        'es': { src: '/artigos/ia-mercado-de-trabalho/hero-es.png', og: '/artigos/ia-mercado-de-trabalho/hero-es-og.jpg' },
        'it': { src: '/artigos/ia-mercado-de-trabalho/hero-it.png', og: '/artigos/ia-mercado-de-trabalho/hero-it-og.jpg' },
        'he': { src: '/artigos/ia-mercado-de-trabalho/hero-he.png', og: '/artigos/ia-mercado-de-trabalho/hero-he-og.jpg' },
      },
    },
    i18n: {
      en: {
        title: 'AI is now the No. 1 reason for layoffs in the US — in Brazil, nobody\'s counting',
        summary: 'The US has a monthly series of job cuts attributed to AI (Challenger). Brazil has 37–41% of jobs exposed, record ChatGPT and Claude use — and no statistic on what has already happened. I went to the primary sources.',
      },
      es: {
        title: 'La IA ya es el motivo nº 1 de despido en EE. UU. — en Brasil, nadie lleva la cuenta',
        summary: 'EE. UU. tiene una serie mensual de despidos atribuidos a la IA (Challenger). Brasil tiene 37–41% del empleo expuesto, uso récord de ChatGPT y Claude — y ninguna estadística de lo que ya pasó. Fui a las fuentes primarias.',
      },
      it: {
        title: 'L\'IA è già il motivo n. 1 di licenziamento negli USA — in Brasile nessuno tiene il conto',
        summary: 'Gli USA hanno una serie mensile di licenziamenti attribuiti all\'IA (Challenger). Il Brasile ha il 37–41% dell\'occupazione esposta, un uso record di ChatGPT e Claude — e nessuna statistica su ciò che è già accaduto. Sono andato alle fonti primarie.',
      },
      he: {
        title: 'הבינה המלאכותית היא כבר הסיבה מספר 1 לפיטורים בארה״ב — בברזיל איש אינו סופר',
        summary: 'בארה״ב יש סדרה חודשית של פיטורים שיוחסו ל-AI (Challenger). בברזיל 37–41% מהתעסוקה חשופים, שימוש שיא ב-ChatGPT וב-Claude — ואין אף נתון על מה שכבר קרה. הלכתי למקורות הראשוניים.',
      },
    },
  },
  {
    slug: 'estatisticas-deepfakes',
    title:
      'As 7 estatísticas centrais de deepfake vêm de quem vende o detector — o único número oficial de dano conta "menções a IA" e a ciência dá 55%, uma moeda',
    summary:
      'A página de estatísticas de deepfake mais completa que encontrei avisa que os números vêm de quem vende detector — e mesmo assim tira as sete cifras centrais dela exatamente daí. Conferi uma a uma: Signicat, Entrust duas vezes, Sumsub duas vezes, Resemble AI e iProov. Sete de sete fornecedores, nenhum órgão oficial, nenhuma academia, nenhuma pesquisa pública. Quatro linhas do placar estão erradas, e os erros sobre lei vão todos na mesma direção: fazem a regulação parecer mais adiantada do que é. Fui atrás do que existe de verdade: o único número oficial de dano é US$ 893 milhões — 4,28% das perdas do ano, sob uma etiqueta que o FBI define como "contém uma referência a inteligência artificial"; a única medição independente da capacidade humana é acadêmica e dá 55,5%, com intervalo de confiança que cruza os 50%, ou seja, uma moeda; e o melhor dado público do mundo é brasileiro, do Cetic.br, porque testa em vez de perguntar (41% se dizem confiantes, 17% foram bem no teste, sem correlação entre as duas coisas). Contei o painel da Resemble AI eu mesmo: dos 2.266 incidentes, o famoso "US$ 1,3 bilhão" descreve 159.',
    date: '2026-08-28',
    tags: ['deepfake', 'estatisticas', 'desinformacao', 'metodologia', 'fraude', 'brasil'],
    hero: {
      width: 2400,
      height: 1260,
      locales: {
        'pt-br': { src: '/artigos/estatisticas-deepfakes/hero.png', og: '/artigos/estatisticas-deepfakes/hero-og.png' },
        'en': { src: '/artigos/estatisticas-deepfakes/hero-en.png', og: '/artigos/estatisticas-deepfakes/hero-en-og.png' },
        'es': { src: '/artigos/estatisticas-deepfakes/hero-es.png', og: '/artigos/estatisticas-deepfakes/hero-es-og.png' },
        'it': { src: '/artigos/estatisticas-deepfakes/hero-it.png', og: '/artigos/estatisticas-deepfakes/hero-it-og.png' },
        'he': { src: '/artigos/estatisticas-deepfakes/hero-he.png', og: '/artigos/estatisticas-deepfakes/hero-he-og.png' },
      },
    },
    i18n: {
      en: {
        title:
          'Deepfake\'s 7 core statistics all come from the people selling the detector — the only official damage figure counts "mentions of AI", and the science says 55%, a coin flip',
        summary:
          'The most complete page of deepfake statistics I could find warns that the numbers come from the people who sell detectors — and then draws its seven core figures from exactly there. I checked them one by one: Signicat, Entrust twice, Sumsub twice, Resemble AI and iProov. Seven out of seven vendors, no official body, no academia, no public survey. Four rows of the scoreboard are wrong, and the legal errors all point the same way: they make regulation look further along than it is. So I went looking for what actually exists: the only official damage figure is US$ 893 million — 4.28% of the year\'s losses, under a label the FBI defines as "contains a reference to artificial intelligence"; the only independent measurement of human detection ability is academic and lands at 55.5%, with a confidence interval that crosses 50%, which is a coin flip; and the best public data in the world on this is Brazilian, from Cetic.br, because it tests instead of asking (41% say they are confident, 17% did well on the test, and the two are uncorrelated). I counted the Resemble AI dashboard myself: of the 2,266 incidents, the famous "US$ 1.3 billion" describes 159.',
      },
      es: {
        title:
          'Las 7 estadísticas centrales de deepfake vienen de quien vende el detector — la única cifra oficial de daño cuenta "menciones a IA" y la ciencia da 55%, una moneda',
        summary:
          'La página de estadísticas de deepfake más completa que encontré avisa que los números vienen de quien vende detectores — y aun así saca de ahí sus siete cifras centrales. Las comprobé una a una: Signicat, Entrust dos veces, Sumsub dos veces, Resemble AI e iProov. Siete de siete proveedores, ningún organismo oficial, ninguna academia, ninguna encuesta pública. Cuatro filas del marcador son falsas, y los errores sobre leyes van todos en la misma dirección: hacen que la regulación parezca más avanzada de lo que es. Fui a buscar lo que existe de verdad: la única cifra oficial de daño es de US$ 893 millones — el 4,28% de las pérdidas del año, bajo una etiqueta que el FBI define como "contiene una referencia a inteligencia artificial"; la única medición independiente de la capacidad humana es académica y da 55,5%, con un intervalo de confianza que cruza el 50%, es decir, una moneda; y el mejor dato público del mundo es brasileño, del Cetic.br, porque prueba en vez de preguntar (41% se dicen confiados, 17% salió bien en la prueba, sin correlación entre ambas cosas). Conté el panel de Resemble AI yo mismo: de los 2.266 incidentes, el famoso "US$ 1.300 millones" describe 159.',
      },
      it: {
        title:
          'Le 7 statistiche centrali sui deepfake vengono da chi vende il rilevatore — l\'unica cifra ufficiale di danno conta le "menzioni all\'IA" e la scienza dà 55%, una monetina',
        summary:
          'La pagina di statistiche sui deepfake più completa che ho trovato avverte che i numeri vengono da chi vende rilevatori — e nonostante questo prende da lì le sue sette cifre centrali. Le ho controllate una a una: Signicat, Entrust due volte, Sumsub due volte, Resemble AI e iProov. Sette su sette fornitori, nessun organo ufficiale, nessuna accademia, nessuna indagine pubblica. Quattro righe del tabellone sono sbagliate, e gli errori sulle leggi vanno tutti nella stessa direzione: fanno sembrare la regolamentazione più avanti di quanto sia. Sono andato a cercare quello che esiste davvero: l\'unica cifra ufficiale di danno è 893 milioni di dollari — il 4,28% delle perdite dell\'anno, sotto un\'etichetta che l\'FBI definisce come "contiene un riferimento all\'intelligenza artificiale"; l\'unica misurazione indipendente della capacità umana è accademica e dà 55,5%, con un intervallo di confidenza che attraversa il 50%, cioè una monetina; e il miglior dato pubblico al mondo è brasiliano, del Cetic.br, perché mette alla prova invece di chiedere (il 41% si dice sicuro, il 17% è andato bene al test, e le due cose non sono correlate). Ho contato io stesso il pannello di Resemble AI: dei 2.266 incidenti, il famoso "1,3 miliardi di dollari" ne descrive 159.',
      },
      he: {
        title:
          'שבע הסטטיסטיקות המרכזיות על דיפ פייק מגיעות ממי שמוכר את הגלאי — המספר הרשמי היחיד לנזק מונה "אזכורים ל-AI", והמדע נותן 55%, הטלת מטבע',
        summary:
          'הדף המקיף ביותר על סטטיסטיקות דיפ פייק שמצאתי מזהיר שהמספרים מגיעים ממי שמוכר גלאים — ובכל זאת לוקח משם בדיוק את שבעת הנתונים המרכזיים שלו. בדקתי אותם אחד אחד: Signicat, Entrust פעמיים, Sumsub פעמיים, Resemble AI ו-iProov. שבעה מתוך שבעה ספקים, אף לא גוף רשמי אחד, אף לא אקדמיה, אף לא סקר ציבורי. ארבע שורות בטבלה שגויות, והטעויות בענייני חוק הולכות כולן לאותו כיוון: הן גורמות לרגולציה להיראות מתקדמת יותר משהיא. הלכתי לחפש מה קיים באמת: המספר הרשמי היחיד לנזק הוא 893 מיליון דולר — 4.28% מההפסדים של השנה, תחת תווית שה-FBI מגדיר כ"המידע שדווח מכיל אזכור לבינה מלאכותית"; המדידה העצמאית היחידה של היכולת האנושית היא אקדמית ונותנת 55.5%, עם רווח סמך שחוצה את 50%, כלומר הטלת מטבע; והנתון הציבורי הטוב בעולם הוא ברזילאי, של Cetic.br, כי הוא בודק במקום לשאול (41% אומרים שהם בטוחים, 17% הצליחו במבחן, ואין מתאם בין השניים). ספרתי בעצמי את לוח המחוונים של Resemble AI: מתוך 2,266 האירועים, ה-1.3 מיליארד דולר המפורסמים מתארים 159.',
      },
    },
  },
  {
    slug: 'carta-ciberdefesa-openai',
    title: 'A carta de ciberdefesa assinada por 155 empresas não contém um único compromisso',
    summary:
      'Em 27 de agosto de 2026, uma carta aberta convocada e hospedada pela OpenAI pediu uma resposta coletiva a ataques cibernéticos movidos a IA, e a imprensa cobriu o número: mais de cem empresas. Fui atrás da pergunta chata — o que exatamente alguém se comprometeu a fazer. Separei os quatro blocos de pedidos de uma captura pinada da página e procurei dentro deles os cinco sinais que distinguem um compromisso de uma declaração de intenção: cifra, prazo, verbo que obriga, responsável nomeado e alvo verificável. São dezoito frases no imperativo e, em vinte células, nenhuma ocorrência. O âmbar que aparece na figura é uma concessão que abri à mão contra o meu próprio argumento, e explico por quê. Para provar que a régua mede, corri o mesmo teste numa página da própria OpenAI, de fevereiro, que acende três das cinco colunas: a empresa escreve cifra quando quer. Mostro ainda que a lista de quem assina mudou quatro vezes em quarenta e sete horas — 116, 127, 128, 155 — enquanto o texto dos quatro blocos não mudou um byte, que uma empresa saiu sem explicação, e que a página tem duas listas cujas contagens colidem no mesmo número. E separo, com cuidado, o que é medida do que é análise minha.',
    date: '2026-08-28',
    tags: ['ia', 'ciberseguranca', 'openai', 'politica-de-tecnologia', 'verificacao'],
    hero: {
      width: 2400,
      height: 1260,
      locales: {
          'pt-br': { src: '/artigos/carta-ciberdefesa-openai/hero.jpg', og: '/artigos/carta-ciberdefesa-openai/hero-og.jpg' },
          'en': { src: '/artigos/carta-ciberdefesa-openai/hero.jpg', og: '/artigos/carta-ciberdefesa-openai/hero-og.jpg' },
          'es': { src: '/artigos/carta-ciberdefesa-openai/hero.jpg', og: '/artigos/carta-ciberdefesa-openai/hero-og.jpg' },
          'it': { src: '/artigos/carta-ciberdefesa-openai/hero.jpg', og: '/artigos/carta-ciberdefesa-openai/hero-og.jpg' },
          'he': { src: '/artigos/carta-ciberdefesa-openai/hero.jpg', og: '/artigos/carta-ciberdefesa-openai/hero-og.jpg' },
      },
    },
    i18n: {
      en: {
        title: 'The cyber defense letter signed by 155 companies contains not one commitment',
        summary:
          'On 27 August 2026 an open letter convened and hosted by OpenAI called for a collective response to AI-enabled cyber attacks, and the press covered the number: more than a hundred companies. I went after the boring question — what exactly did anyone commit to doing. I pulled the four blocks of asks out of a pinned capture of the page and searched inside them for the five signals that separate a commitment from a statement of intent: an amount, a deadline, a binding verb, a named party, a verifiable target. Eighteen imperative sentences and, across twenty cells, not one hit. The amber you see in the figure is a concession I made by hand against my own argument, and I explain why. To prove the ruler measures, I ran the same test on a page by OpenAI itself, from February, which lights three of the five columns: the company writes an amount when it wants to. I also show that the list of signatories changed four times in forty-seven hours — 116, 127, 128, 155 — while the text of the four blocks did not change a single byte, that one company was removed without explanation, and that the page carries two lists whose counts collide on the same number. And I separate, carefully, what is measured from what is my own analysis.',
      },
      es: {
        title: 'La carta de ciberdefensa firmada por 155 empresas no contiene ni un solo compromiso',
        summary:
          'El 27 de agosto de 2026, una carta abierta convocada y alojada por OpenAI pidió una respuesta colectiva a los ciberataques impulsados por IA, y la prensa cubrió la cifra: más de cien empresas. Fui tras la pregunta aburrida — qué se comprometió exactamente alguien a hacer. Separé los cuatro bloques de peticiones de una captura fijada de la página y busqué dentro de ellos las cinco señales que distinguen un compromiso de una declaración de intenciones: cifra, plazo, verbo que obliga, responsable nombrado y meta verificable. Son dieciocho frases en imperativo y, en veinte celdas, ninguna ocurrencia. El ámbar que aparece en la figura es una concesión que hice a mano contra mi propio argumento, y explico por qué. Para probar que la regla mide, corrí la misma prueba en una página de la propia OpenAI, de febrero, que enciende tres de las cinco columnas: la empresa escribe cifras cuando quiere. Muestro además que la lista de firmantes cambió cuatro veces en cuarenta y siete horas — 116, 127, 128, 155 — mientras que el texto de los cuatro bloques no cambió ni un byte, que una empresa salió sin explicación, y que la página tiene dos listas cuyos recuentos coinciden en el mismo número. Y separo, con cuidado, lo que es medida de lo que es análisis mío.',
      },
      it: {
        title: 'La lettera sulla cyberdifesa firmata da 155 aziende non contiene un solo impegno',
        summary:
          "Il 27 agosto 2026 una lettera aperta promossa e ospitata da OpenAI ha chiesto una risposta collettiva agli attacchi informatici alimentati dall'IA, e la stampa ha coperto il numero: più di cento aziende. Sono andato dietro alla domanda noiosa — che cosa esattamente qualcuno si è impegnato a fare. Ho separato i quattro blocchi di richieste da una cattura fissata della pagina e ho cercato al loro interno i cinque segnali che distinguono un impegno da una dichiarazione di intenti: cifra, scadenza, verbo che obbliga, responsabile nominato e obiettivo verificabile. Sono diciotto frasi all'imperativo e, su venti celle, nessuna occorrenza. L'ambra che si vede nella figura è una concessione che ho fatto a mano contro il mio stesso argomento, e spiego perché. Per dimostrare che il righello misura, ho eseguito lo stesso test su una pagina della stessa OpenAI, di febbraio, che accende tre delle cinque colonne: l'azienda scrive una cifra quando vuole. Mostro inoltre che l'elenco dei firmatari è cambiato quattro volte in quarantasette ore — 116, 127, 128, 155 — mentre il testo dei quattro blocchi non è cambiato di un byte, che un'azienda è stata rimossa senza spiegazioni, e che la pagina porta due elenchi i cui conteggi si scontrano sullo stesso numero. E separo, con cura, ciò che è misura da ciò che è analisi mia.",
      },
      he: {
        title: 'מכתב ההגנה בסייבר שעליו חתומות 155 חברות אינו מכיל אפילו התחייבות אחת',
        summary:
          'ב-27 באוגוסט 2026 מכתב פתוח ביוזמת OpenAI ובאירוחה קרא לתגובה קולקטיבית להתקפות סייבר המונעות בבינה מלאכותית, והעיתונות סיקרה את המספר: יותר ממאה חברות. הלכתי אחרי השאלה המשעממת — למה בדיוק מישהו התחייב. הפרדתי את ארבעת בלוקי הדרישות מלכידה מקובעת של העמוד וחיפשתי בתוכם את חמשת הסימנים שמבדילים התחייבות מהצהרת כוונות: סכום, מועד, פועל מחייב, אחראי נקוב ויעד בר-אימות. אלה שמונה עשר משפטי ציווי, ובעשרים תאים — אף מופע אחד. הענבר שנראה בתרשים הוא ויתור שעשיתי ביד נגד הטיעון של עצמי, ואני מסביר מדוע. כדי להוכיח שהסרגל מודד, הרצתי את אותה בדיקה על עמוד של OpenAI עצמה, מפברואר, שמדליק שלוש מתוך חמש העמודות: החברה כותבת סכום כשהיא רוצה. אני מראה גם שרשימת החותמים השתנתה ארבע פעמים בארבעים ושבע שעות — 116, 127, 128, 155 — בעוד שהטקסט של ארבעת הבלוקים לא השתנה אפילו בבית אחד, שחברה אחת הוסרה בלי הסבר, ושבעמוד יש שתי רשימות שהספירות שלהן מתנגשות באותו מספר. ואני מפריד, בזהירות, בין מה שנמדד לבין מה שהוא ניתוח שלי.',
      },
    },
  },
  {
    slug: 'ia-local-por-vram',
    title:
      'O card que diz qual IA roda na sua placa acerta quase tudo — e erra na única conta que decide',
    summary:
      'Um card em espanhol resolve numa tabela o que roda em cada faixa de memória de vídeo, de 4 GB a 256 GB. Refiz a conta: dos dezessete vereditos de hardware, dezesseis estão certos, e todos os modelos citados existem de verdade — a única peça inexistente é a RTX 5080 Super, adiada por tempo indeterminado porque o módulo de GDDR7 de 3 GB custa três vezes o de 2 GB. O erro que importa é outro, e é de método: o card orça só o arquivo de pesos e ignora o cache de contexto, que cresce enquanto você conversa. Com as duas parcelas medidas — pesos do GGUF publicado, cache calculado do config.json de cada modelo — um dos dez degraus não fecha nem numa sessão de trabalho de 32 mil tokens, e é justamente o mais popular, o de 8 GB; seis dos dez não fecham no contexto máximo do próprio modelo que o card recomenda. Separo ainda quatro armadilhas de nomenclatura, entre elas um "Q8" que tem 4,3 bits por peso e um formato que não é do mesmo ecossistema dos outros, e três ressalvas que valem para a tabela inteira, incluindo por que duas placas de 32 GB não são uma placa de 64 GB.',
    date: '2026-08-27',
    tags: ['ia', 'llm', 'hardware', 'quantizacao', 'vram', 'didatico'],
    hero: {
      width: 2400,
      height: 1260,
      locales: {
          'pt-br': { src: '/artigos/ia-local-por-vram/hero.jpg', og: '/artigos/ia-local-por-vram/hero-og.jpg' },
          'en': { src: '/artigos/ia-local-por-vram/hero.jpg', og: '/artigos/ia-local-por-vram/hero-og.jpg' },
          'es': { src: '/artigos/ia-local-por-vram/hero.jpg', og: '/artigos/ia-local-por-vram/hero-og.jpg' },
          'it': { src: '/artigos/ia-local-por-vram/hero.jpg', og: '/artigos/ia-local-por-vram/hero-og.jpg' },
          'he': { src: '/artigos/ia-local-por-vram/hero.jpg', og: '/artigos/ia-local-por-vram/hero-og.jpg' },
      },
    },
    i18n: {
      en: {
        title:
          'The chart that tells you which AI runs on your graphics card gets almost everything right — and gets wrong the one calculation that decides',
        summary:
          'A chart in Spanish settles in a single table what runs in each tier of video memory, from 4 GB to 256 GB. I redid the math: of the seventeen hardware verdicts, sixteen are right, and every model it cites really exists — the one piece that does not is the RTX 5080 Super, postponed indefinitely because the 3 GB GDDR7 module costs three times the 2 GB one. The error that matters is a different one, and it is methodological: the chart budgets only the weight file and ignores the context cache, which grows while you talk. With both parts measured — weights from the published GGUF, cache calculated from each model\'s config.json — one of the ten rungs does not add up even in a 32,000-token working session, and it is precisely the most popular one, the 8 GB rung; six of the ten do not add up at the maximum context of the very model the chart recommends. I also separate out four naming traps, among them a "Q8" that has 4.3 bits per weight and a format that is not from the same ecosystem as the others, and three caveats that apply to the whole table, including why two 32 GB cards are not one 64 GB card.',
      },
      es: {
        title:
          'La infografía que dice qué IA funciona en tu tarjeta acierta casi todo — y falla en la única cuenta que decide',
        summary:
          'Una infografía resuelve en una tabla qué se ejecuta en cada franja de memoria de vídeo, de 4 GB a 256 GB. Rehice la cuenta: de los diecisiete veredictos de hardware, dieciséis son correctos, y todos los modelos citados existen de verdad — la única pieza inexistente es la RTX 5080 Super, aplazada por tiempo indefinido porque el módulo de GDDR7 de 3 GB cuesta tres veces el de 2 GB. El error que importa es otro, y es de método: la infografía solo presupuesta el archivo de pesos e ignora el caché de contexto, que crece mientras conversas. Con las dos partidas medidas — pesos del GGUF publicado, caché calculado del config.json de cada modelo — uno de los diez escalones no cierra ni en una sesión de trabajo de 32 mil tokens, y es justamente el más popular, el de 8 GB; seis de los diez no cierran en el contexto máximo del propio modelo que la infografía recomienda. Separo además cuatro trampas de nomenclatura, entre ellas un "Q8" que tiene 4,3 bits por peso y un formato que no es del mismo ecosistema que los otros, y tres salvedades que valen para la tabla entera, incluyendo por qué dos tarjetas de 32 GB no son una tarjeta de 64 GB.',
      },
      it: {
        title:
          'La card che dice quale IA gira sulla tua GPU azzecca quasi tutto — e sbaglia l\'unico conto che decide',
        summary:
          'Una card in spagnolo risolve in una tabella cosa gira in ogni fascia di memoria video, da 4 GB a 256 GB. Ho rifatto il conto: dei diciassette verdetti sull\'hardware, sedici sono giusti, e tutti i modelli citati esistono davvero — l\'unico pezzo inesistente è la RTX 5080 Super, rinviata a tempo indeterminato perché il modulo di GDDR7 da 3 GB costa il triplo di quello da 2 GB. L\'errore che conta è un altro, ed è di metodo: la card preventiva solo il file dei pesi e ignora la cache di contesto, che cresce mentre parli. Con le due voci misurate — pesi del GGUF pubblicato, cache calcolata dal config.json di ogni modello — uno dei dieci gradini non chiude nemmeno in una sessione di lavoro da 32 mila token, ed è proprio il più popolare, quello da 8 GB; sei dei dieci non chiudono nel contesto massimo del modello stesso che la card consiglia. Distinguo inoltre quattro trappole di nomenclatura, tra cui un "Q8" che ha 4,3 bit per peso e un formato che non appartiene allo stesso ecosistema degli altri, e tre avvertenze che valgono per tutta la tabella, incluso il perché due schede da 32 GB non sono una scheda da 64 GB.',
      },
      he: {
        title:
          'הכרטיס שאומר איזו בינה מלאכותית רצה על כרטיס המסך שלך צודק כמעט בהכול — וטועה בחישוב היחיד שמכריע',
        summary:
          'כרטיס בספרדית פותר בטבלה אחת מה רץ בכל רמה של זיכרון וידאו, מ-4 GB עד 256 GB. עשיתי את החישוב מחדש: מתוך שבעה עשר פסקי הדין על החומרה, שישה עשר נכונים, וכל המודלים המצוטטים קיימים באמת — הפריט היחיד שלא קיים הוא ה-RTX 5080 Super, שנדחתה לזמן בלתי מוגבל כי מודול GDDR7 של 3 GB עולה פי שלושה ממודול של 2 GB. הטעות שחשובה היא אחרת, והיא מתודית: הכרטיס מתמחר רק את קובץ המשקלים ומתעלם מה-cache של ההקשר, שגדל תוך כדי השיחה. עם שני המרכיבים מדודים — משקלים מתוך ה-GGUF שפורסם, cache שחושב מה-config.json של כל מודל — אחד מעשרת השלבים לא סוגר אפילו בסשן עבודה של 32 אלף טוקנים, וזה דווקא הפופולרי ביותר, זה של 8 GB; שישה מתוך העשרה לא סוגרים בהקשר המרבי של המודל שהכרטיס עצמו ממליץ עליו. אני מפריד עוד ארבע מלכודות של שמות, ביניהן "Q8" שיש בו 4.3 סיביות לכל משקל ופורמט שאינו מאותו אקוסיסטם של האחרים, ושלוש הסתייגויות שתקפות לכל הטבלה, כולל למה שני כרטיסים של 32 GB אינם כרטיס אחד של 64 GB.',
      },
    },
  },
{
  slug: 'recusa-que-parou-o-estudo-das-recusas',
  title:
    'Eu estava medindo recusas invisíveis. A recusa apareceu — e não era invisível',
  summary:
    'Um estudo meu sobre recusas de IA que passam despercebidas dentro de sistemas de agentes foi interrompido por uma recusa: o classificador de salvaguardas bloqueou a geração do corpus, porque um conjunto de prompts SOBRE recusas lê, para um classificador, como material ofensivo. Havia dois caminhos — reescrever o pedido até passar, o que quase sempre funciona, ou parar. Reformular um pedido porque ele foi sinalizado é evasão de salvaguarda, um andar abaixo do jailbreak e da mesma família; um pesquisador que contorna o classificador para estudar o classificador contaminou o próprio objeto. Congelei o braço do estudo com data no arquivo de estado do projeto e me candidatei ao Cyber Verification Program da Anthropic, o canal formal para trabalho de uso duplo com propósito defensivo. A aprovação saiu dentro do prazo de dois dias úteis. O que ela é: uso duplo deixa de ser bloqueado por padrão, dentro do caso de uso submetido e sob monitoramento contínuo. O que ela não é: parceria, certificação ou endosso — uso proibido continua bloqueado com programa ou sem. E fica a lição que o incidente entrega de graça, que é a tese do estudo: uma recusa só é gerenciável quando é legível. A que me bloqueou tinha texto, categoria e porta de saída; as que eu estou medindo chegam ao orquestrador como resultado vazio e são tratadas como sucesso.',
  date: '2026-08-26',
  tags: ['ia', 'agentes', 'ciberseguranca', 'anthropic', 'pesquisa', 'salvaguardas'],
  hero: {
    width: 2400,
    height: 1260,
    locales: {
        'pt-br': { src: '/artigos/recusa-que-parou-o-estudo-das-recusas/hero.jpg', og: '/artigos/recusa-que-parou-o-estudo-das-recusas/hero-og.jpg' },
        'en': { src: '/artigos/recusa-que-parou-o-estudo-das-recusas/hero.jpg', og: '/artigos/recusa-que-parou-o-estudo-das-recusas/hero-og.jpg' },
        'es': { src: '/artigos/recusa-que-parou-o-estudo-das-recusas/hero.jpg', og: '/artigos/recusa-que-parou-o-estudo-das-recusas/hero-og.jpg' },
        'it': { src: '/artigos/recusa-que-parou-o-estudo-das-recusas/hero.jpg', og: '/artigos/recusa-que-parou-o-estudo-das-recusas/hero-og.jpg' },
        'he': { src: '/artigos/recusa-que-parou-o-estudo-das-recusas/hero.jpg', og: '/artigos/recusa-que-parou-o-estudo-das-recusas/hero-og.jpg' },
    },
  },
},
{
  slug: 'ninguem-provou-meta-le-whatsapp',
  title:
    'Não, ninguém provou que a Meta lê o seu WhatsApp. O que eu encontrei é pior',
  summary:
    'Um advogado perdeu dez anos de conversas numa manhã e um vídeo concluiu que a Meta leu o que ele escreveu. Fui checar essa acusação nos manuais técnicos do WhatsApp de 2016 a 2026, no código do cliente, em capturas arquivadas da central de ajuda do Instagram, na decisão da Comissão Europeia de 2017 e nos autos de processos no Brasil, nos Estados Unidos e na Índia. O vídeo erra por duas razões, e a segunda enterra o argumento: banir em massa e barulhentamente é a assinatura de um classificador automático, não de quem lê — quem tem uma capacidade secreta valiosa protege a capacidade, não o caso individual. Mas o que sobra no lugar é pior. A empresa passou a definir sozinha o que conta como conversa protegida e a listar exceções que ela mesma reconhece; nenhuma observação disponível ao público distingue uma empresa que não pode ler de uma que pode e não diz; e as três escolhas que produzem essa impossibilidade — aplicativo fechado, sem build reproduzível, sem auditoria externa — são dela, e reversíveis por ela. Em 8 de maio de 2026 a Meta desligou a criptografia de ponta a ponta das mensagens do Instagram: a garantia que nos venderam como matemática sempre foi uma promessa corporativa, e promessas corporativas se revogam.',
  date: '2026-08-26',
  tags: ['criptografia', 'whatsapp', 'instagram', 'meta', 'privacidade', 'verificacao'],
  hero: {
    width: 2400,
    height: 1260,
    locales: {
        'pt-br': { src: '/artigos/ninguem-provou-meta-le-whatsapp/hero.jpg', og: '/artigos/ninguem-provou-meta-le-whatsapp/hero-og.jpg' },
        'en': { src: '/artigos/ninguem-provou-meta-le-whatsapp/hero.jpg', og: '/artigos/ninguem-provou-meta-le-whatsapp/hero-og.jpg' },
        'es': { src: '/artigos/ninguem-provou-meta-le-whatsapp/hero.jpg', og: '/artigos/ninguem-provou-meta-le-whatsapp/hero-og.jpg' },
        'it': { src: '/artigos/ninguem-provou-meta-le-whatsapp/hero.jpg', og: '/artigos/ninguem-provou-meta-le-whatsapp/hero-og.jpg' },
        'he': { src: '/artigos/ninguem-provou-meta-le-whatsapp/hero.jpg', og: '/artigos/ninguem-provou-meta-le-whatsapp/hero-og.jpg' },
    },
  },
  i18n: {
    en: {
      title: 'No, nobody proved that Meta reads your WhatsApp. What I found is worse',
      summary: 'A lawyer lost ten years of conversations in a single morning and a video concluded that Meta had read what he wrote. I went to check that accusation against WhatsApp technical whitepapers from 2016 to 2026, the client code, archived captures of the Instagram help centre, the 2017 European Commission decision and the dockets of lawsuits in Brazil, the United States and India. The video is wrong for two reasons, and the second buries the argument: banning en masse and noisily is the signature of an automated classifier, not of someone reading — whoever holds a valuable secret capability protects the capability, not the individual case. But what is left in its place is worse. The company has come to define on its own what counts as a protected conversation and to list exceptions it acknowledges itself; no observation available to the public distinguishes a company that cannot read from one that can and does not say so; and the three choices that produce that impossibility — a closed app, no reproducible build, no external audit — are its own, and reversible by it. On 8 May 2026 Meta switched off end-to-end encryption for Instagram messages: the guarantee we were sold as mathematics was always a corporate promise, and corporate promises are revoked.'
    },
    es: {
      title: 'No, nadie probó que Meta lee tu WhatsApp. Lo que encontré es peor',
      summary: 'Un abogado perdió diez años de conversaciones en una mañana y un video concluyó que Meta leyó lo que él escribió. Fui a verificar esa acusación en los informes técnicos de WhatsApp de 2016 a 2026, en el código del cliente, en capturas archivadas del centro de ayuda de Instagram, en la decisión de la Comisión Europea de 2017 y en los autos de procesos en Brasil, Estados Unidos e India. El video se equivoca por dos razones, y la segunda entierra el argumento: banear en masa y ruidosamente es la firma de un clasificador automático, no de quien lee — quien tiene una capacidad secreta valiosa protege la capacidad, no el caso individual. Pero lo que queda en su lugar es peor. La empresa pasó a definir sola qué cuenta como conversación protegida y a listar excepciones que ella misma reconoce; ninguna observación disponible al público distingue una empresa que no puede leer de una que puede y no lo dice; y las tres elecciones que producen esa imposibilidad — aplicación cerrada, sin build reproducible, sin auditoría externa — son de ella, y reversibles por ella. El 8 de mayo de 2026 Meta apagó el cifrado de extremo a extremo de los mensajes de Instagram: la garantía que nos vendieron como matemática siempre fue una promesa corporativa, y las promesas corporativas se revocan.'
    },
    it: {
      title: 'No, nessuno ha provato che Meta legge il tuo WhatsApp. Quello che ho trovato è peggio',
      summary: 'Un avvocato ha perso dieci anni di conversazioni in una mattina e un video ha concluso che Meta aveva letto quello che lui aveva scritto. Sono andato a verificare quell\'accusa nei documenti tecnici di WhatsApp dal 2016 al 2026, nel codice del client, in catture archiviate del centro assistenza di Instagram, nella decisione della Commissione europea del 2017 e negli atti di cause in Brasile, negli Stati Uniti e in India. Il video sbaglia per due ragioni, e la seconda seppellisce l\'argomento: bandire in massa e rumorosamente è la firma di un classificatore automatico, non di chi legge — chi ha una capacità segreta preziosa protegge la capacità, non il caso individuale. Ma quello che resta al suo posto è peggio. L\'azienda è passata a definire da sola che cosa conta come conversazione protetta e a elencare eccezioni che essa stessa riconosce; nessuna osservazione disponibile al pubblico distingue un\'azienda che non può leggere da una che può e non lo dice; e le tre scelte che producono quell\'impossibilità — applicazione chiusa, nessun build riproducibile, nessuna verifica esterna — sono sue, e reversibili da lei. L\'8 maggio 2026 Meta ha spento la crittografia end-to-end dei messaggi di Instagram: la garanzia che ci hanno venduto come matematica è sempre stata una promessa aziendale, e le promesse aziendali si revocano.'
    },
    he: {
      title: 'לא, אף אחד לא הוכיח ש-Meta קוראת לכם את ה-WhatsApp. מה שמצאתי גרוע יותר',
      summary: 'עורך דין איבד עשר שנים של שיחות בבוקר אחד וסרטון הסיק ש-Meta קראה את מה שהוא כתב. הלכתי לבדוק את ההאשמה הזאת במסמכים הטכניים של WhatsApp מ-2016 עד 2026, בקוד הלקוח, בצילומי ארכיון של מרכז העזרה של Instagram, בהחלטת הנציבות האירופית מ-2017 ובתיקי תביעות בברזיל, בארצות הברית ובהודו. הסרטון טועה משתי סיבות, והשנייה קוברת את הטיעון: לחסום בהמוניהם וברעש היא החתימה של מסווג אוטומטי, לא של מי שקורא — מי שיש לו יכולת סודית יקרת ערך מגן על היכולת, לא על המקרה הבודד. אבל מה שנשאר במקום גרוע יותר. החברה עברה להגדיר לבדה מה נחשב שיחה מוגנת ולמנות חריגים שהיא עצמה מכירה בהם; שום תצפית הזמינה לציבור אינה מבחינה בין חברה שאינה יכולה לקרוא לבין חברה שיכולה ואינה אומרת; ושלוש הבחירות שמייצרות את חוסר האפשרות הזה — אפליקציה סגורה, בלי בנייה משוחזרת, בלי ביקורת חיצונית — הן שלה, והפיכות על ידה. ב-8 במאי 2026 כיבתה Meta את ההצפנה מקצה לקצה בהודעות Instagram: הערובה שמכרו לנו כמתמטיקה תמיד הייתה הבטחה תאגידית, והבטחות תאגידיות מבוטלות.'
    },
  },
},
{
  slug: 'teoria-das-restricoes',
  title:
    'Teoria das Restrições: a restrição é um lugar, não um esforço',
  summary:
    'Nathan Barry resumiu a Teoria das Restrições numa frase — esforço fora do gargalo piora o gargalo — apoiado na série de Tiago Forte que circula como "a explicação" do assunto. Fui conferir a série, o livro e a frase, e escrevi um simulador de fila para medir em vez de discutir por analogia. A série tem 11 posts, não 3, e os que dizem o que fazer depois de achar o gargalo estão atrás de um paywall; os cinco passos de Goldratt não estão em A Meta, e sim num livro de 1990 que quase ninguém abre; e a frase-moral acerta o sinal e erra o grau: dobrar a capacidade de quem não é a restrição não tirou um item a mais (-0,3%, ruído) e fez a espera crescer 33% mais rápido — piora a espera, não a saída. Elevar a restrição em 25% rendeu 24,9%. A corda de Goldratt custa 5% de vazão e compra uma travessia 8.900 vezes menor. Subo a escada em quatro degraus — a padaria, os nomes, a Lei de Little e os cinco passos lidos na fonte, a ponte com agentes de IA, onde o gargalo anda de lugar — e fecho conferindo Ford, Spanx e Kit. Dez figuras próprias, feitas em código; a mesma padaria reaparece com os dados de cada experimento.',
  date: '2026-08-25',
  tags: ['teoria-das-restricoes', 'goldratt', 'gestao', 'filas', 'lei-de-little', 'agentes-de-ia', 'didatico'],
  hero: {
    width: 2400,
    height: 1260,
    locales: {
      'pt-br': { src: '/artigos/teoria-das-restricoes/hero.png', og: '/artigos/teoria-das-restricoes/hero-og.png' },
      'en': { src: '/artigos/teoria-das-restricoes/hero-en.png', og: '/artigos/teoria-das-restricoes/hero-en-og.png' },
      'es': { src: '/artigos/teoria-das-restricoes/hero-es.png', og: '/artigos/teoria-das-restricoes/hero-es-og.png' },
      'it': { src: '/artigos/teoria-das-restricoes/hero-it.png', og: '/artigos/teoria-das-restricoes/hero-it-og.png' },
      'he': { src: '/artigos/teoria-das-restricoes/hero-he.png', og: '/artigos/teoria-das-restricoes/hero-he-og.png' },
    },
  },
  i18n: {
    en: {
      title:
        'Theory of Constraints: the constraint is a place, not an effort',
      summary:
        'Nathan Barry summed up the Theory of Constraints in one sentence — effort outside the bottleneck makes the bottleneck worse — resting on the Tiago Forte series that circulates as the explanation of the subject. I went to check the series, the book and the sentence, and wrote a queue simulator to measure instead of arguing by analogy. The series has 11 posts, not 3, and the ones that say what to do after you find the bottleneck sit behind a paywall; Goldratt\'s five steps are not in The Goal but in a 1990 book almost nobody opens; and the moral sentence gets the sign right and the degree wrong: doubling the capacity of whoever is not the constraint did not take out one more item (-0.3%, noise) and made the waiting grow 33% faster — it worsens the waiting, not the output. Elevating the constraint by 25% returned 24.9%. Goldratt\'s rope costs 5% of throughput and buys a lead time 8,900 times smaller. I climb the ladder in four steps — the bakery, the names, Little\'s Law and the five steps read at the source, the bridge to AI agents, where the bottleneck moves around — and close by checking Ford, Spanx and Kit. Ten figures of my own, made in code; the same bakery comes back with the data from each experiment.',
    },
    es: {
      title:
        'Teoría de las Restricciones: la restricción es un lugar, no un esfuerzo',
      summary:
        'Nathan Barry resumió la Teoría de las Restricciones en una frase — el esfuerzo fuera del cuello de botella empeora el cuello de botella — apoyado en la serie de Tiago Forte que circula como "la explicación" del asunto. Fui a comprobar la serie, el libro y la frase, y escribí un simulador de colas para medir en vez de discutir por analogía. La serie tiene 11 posts, no 3, y los que dicen qué hacer después de encontrar el cuello de botella están detrás de un paywall; los cinco pasos de Goldratt no están en La Meta, sino en un libro de 1990 que casi nadie abre; y la frase-moraleja acierta el signo y erra el grado: doblar la capacidad de quien no es la restricción no sacó un ítem más (-0,3%, ruido) e hizo que la espera creciera 33% más rápido — empeora la espera, no la salida. Elevar la restricción en 25% rindió 24,9%. La cuerda de Goldratt cuesta 5% de caudal y compra una travesía 8.900 veces menor. Subo la escalera en cuatro peldaños — la panadería, los nombres, la Ley de Little y los cinco pasos leídos en la fuente, el puente con agentes de IA, dónde el cuello de botella cambia de lugar — y cierro comprobando Ford, Spanx y Kit. Diez figuras propias, hechas en código; la misma panadería reaparece con los datos de cada experimento.',
    },
    it: {
      title:
        'Teoria dei Vincoli: il vincolo è un luogo, non uno sforzo',
      summary:
        'Nathan Barry ha riassunto la Teoria dei Vincoli in una frase — lo sforzo fuori dal collo di bottiglia peggiora il collo di bottiglia — appoggiandosi alla serie di Tiago Forte che circola come la spiegazione dell\'argomento. Sono andato a controllare la serie, il libro e la frase, e ho scritto un simulatore di coda per misurare invece di discutere per analogia. La serie ha 11 post, non 3, e quelli che dicono che cosa fare dopo aver trovato il collo di bottiglia stanno dietro un paywall; i cinque passi di Goldratt non sono in L\'obiettivo, ma in un libro del 1990 che quasi nessuno apre; e la frase-morale azzecca il segno e sbaglia il grado: raddoppiare la capacità di chi non è il vincolo non ha tolto un pezzo in più (-0,3%, rumore) e ha fatto crescere l\'attesa il 33% più in fretta — peggiora l\'attesa, non l\'uscita. Elevare il vincolo del 25% ha reso il 24,9%. La corda di Goldratt costa il 5% di portata e compra un attraversamento 8.900 volte minore. Salgo la scala in quattro gradini — la panetteria, i nomi, la Legge di Little e i cinque passi letti alla fonte, il ponte con gli agenti di IA, dove il collo di bottiglia cambia posto — e chiudo controllando Ford, Spanx e Kit. Dieci figure mie, fatte in codice; la stessa panetteria ritorna con i dati di ogni esperimento.',
    },
    he: {
      title:
        'תורת האילוצים: האילוץ הוא מקום, לא מאמץ',
      summary:
        'Nathan Barry סיכם את תורת האילוצים במשפט אחד — מאמץ שמושקע מחוץ לצוואר הבקבוק מחמיר את צוואר הבקבוק — בהסתמך על סדרת הפוסטים של Tiago Forte שמסתובבת כ"ההסבר" לנושא. הלכתי לבדוק את הסדרה, את הספר ואת המשפט, וכתבתי סימולטור תורים כדי למדוד במקום להתווכח באנלוגיה. בסדרה יש 11 פוסטים, לא 3, ואלה שאומרים מה לעשות אחרי שמוצאים את צוואר הבקבוק נמצאים מאחורי paywall; חמשת הצעדים של Goldratt אינם ב-The Goal אלא בספר משנת 1990 שכמעט אף אחד לא פותח; והמשפט־המוסר קולע בסימן ומחטיא בדרגה: הכפלת הקיבולת של מי שאינו האילוץ לא הוציאה ולו פריט אחד נוסף (-0.3%, רעש) והאיצה את גידול ההמתנה ב-33% — היא מחמירה את ההמתנה, לא את התפוקה. העלאת האילוץ ב-25% הניבה 24.9%. החבל של Goldratt עולה 5% מהתפוקה וקונה זמן מעבר קצר ב-8,900 פעמים. אני עולה בסולם בארבעה שלבים — המאפייה, השמות, חוק Little וחמשת הצעדים כפי שהם במקור, הגשר אל סוכני AI, והמקום שאליו נודד צוואר הבקבוק — ומסיים בבדיקת Ford, Spanx ו-Kit. עשרה איורים משלי, עשויים בקוד; אותה מאפייה חוזרת עם הנתונים של כל ניסוי.',
    },
  },
},
{
  slug: 'tokens-por-dolar',
  title:
    'O gráfico viral coroa o Mac, a tabela coroa o Spark: medi 43 mil chamadas e o vencedor não é máquina nenhuma',
  summary:
    'Duas imagens virais comparam Mac Studio M5 Ultra 256 GB, RTX 5090, RTX PRO 6000 e DGX Spark em "valor por dólar" para rodar IA em casa. Fui conferir: a métrica multiplica estoque por vazão, o preço do Spark morreu em fevereiro e a PRO 6000 entrou sem hospedeiro. Depois refiz a conta que interessa — tokens por dólar contra a API do mesmo modelo — e a primeira versão dela assumia que uma pessoa usa a máquina 1 % do tempo. Medi 43.593 chamadas reais de agente de código nesta máquina: o 1 % não descreve ninguém (chat fica perto de 0,03 %; agente, entre 10 % e 30 %), 96 % da entrada é releitura de contexto, e trocar a regra de cobrança dessa releitura move a conta 16 vezes, enquanto trocar de máquina move 3,6. No único regime em que a máquina mais barata ganha (1,5x), o dia de pico dela não cabe no dia e a chamada média, de 151,9 mil tokens, não cabe no contexto do modelo. Compre por soberania, não por economia.',
  date: '2026-08-25',
  tags: ['ia', 'llm', 'hardware', 'custo', 'inferencia-local'],
  hero: {
    width: 2400,
    height: 1260,
    locales: {
      'pt-br': { src: '/artigos/tokens-por-dolar/hero.jpg', og: '/artigos/tokens-por-dolar/hero-og.jpg' },
    },
  },
  i18n: {
    en: {
      title: 'The viral chart crowns the Mac, the table crowns the Spark: I measured 43 thousand calls and the winner is no machine at all',
      summary: 'Two viral images compare the Mac Studio M5 Ultra 256 GB, RTX 5090, RTX PRO 6000 and DGX Spark on "value per dollar" for running AI at home. I went to check: the metric multiplies stock by flow, the Spark\'s price died in February and the PRO 6000 came in without a host PC. Then I redid the math that matters — tokens per dollar against the API for the same model — and its first version assumed a person uses the machine 1% of the time. I measured 43,593 real coding-agent calls on this machine: the 1% describes nobody (chat sits near 0.03%; an agent, between 10% and 30%), 96% of the input is context re-reading, and changing the billing rule for that re-reading moves the bill 16 times, while changing machine moves it 3.6. In the one regime where the cheapest machine wins (1.5x), its peak day does not fit in the day and the mean call, at 151.9 thousand tokens, does not fit in the model\'s context. Buy for sovereignty, not for savings.'
    },
    es: {
      title: 'El gráfico viral corona al Mac, la tabla corona al Spark: medí 43 mil llamadas y el ganador no es ninguna máquina',
      summary: 'Dos imágenes virales comparan Mac Studio M5 Ultra 256 GB, RTX 5090, RTX PRO 6000 y DGX Spark en "valor por dólar" para ejecutar IA en casa. Fui a comprobarlo: la métrica multiplica stock por caudal, el precio del Spark murió en febrero y la PRO 6000 entró sin PC anfitrión. Después rehíce la cuenta que importa — tokens por dólar contra la API del mismo modelo — y su primera versión asumía que una persona usa la máquina el 1 % del tiempo. Medí 43.593 llamadas reales de agente de código en esta máquina: el 1 % no describe a nadie (el chat queda cerca del 0,03 %; el agente, entre el 10 % y el 30 %), el 96 % de la entrada es relectura de contexto, y cambiar la regla de cobro de esa relectura mueve la cuenta 16 veces, mientras que cambiar de máquina la mueve 3,6. En el único régimen en que la máquina más barata gana (1,5x), su día pico no cabe en el día y la llamada media, de 151,9 mil tokens, no cabe en el contexto del modelo. Compra por soberanía, no por ahorro.'
    },
    it: {
      title: 'Il grafico virale incorona il Mac, la tabella incorona lo Spark: ho misurato 43 mila chiamate e il vincitore non è nessuna macchina',
      summary: 'Due immagini virali confrontano Mac Studio M5 Ultra 256 GB, RTX 5090, RTX PRO 6000 e DGX Spark in "valore per dollaro" per far girare l\'IA in casa. Sono andato a verificare: la metrica moltiplica stock per portata, il prezzo dello Spark è morto a febbraio e la PRO 6000 è entrata senza PC host. Poi ho rifatto il conto che conta — token per dollaro contro l\'API dello stesso modello — e la sua prima versione assumeva che una persona usi la macchina 1 % del tempo. Ho misurato 43.593 chiamate reali di agente di codice su questa macchina: l\'1 % non descrive nessuno (la chat sta vicino allo 0,03 %; l\'agente, tra 10 % e 30 %), il 96 % dell\'ingresso è rilettura di contesto, e cambiare la regola di addebito di quella rilettura muove il conto di 16 volte, mentre cambiare macchina lo muove di 3,6. Nell\'unico regime in cui la macchina più economica vince (1,5x), il suo giorno di picco non ci sta nel giorno e la chiamata media, di 151,9 mila token, non ci sta nel contesto del modello. Compra per sovranità, non per risparmio.'
    },
    he: {
      title: 'הגרף הוויראלי מכתיר את ה-Mac, הטבלה מכתירה את ה-Spark: מדדתי 43 אלף קריאות והמנצח הוא לא שום מכונה',
      summary: 'שתי תמונות ויראליות משוות בין Mac Studio M5 Ultra 256 GB, RTX 5090, RTX PRO 6000 ו-DGX Spark ב"ערך לדולר" להרצת AI בבית. הלכתי לבדוק: המדד מכפיל מלאי בספיקה, המחיר של ה-Spark מת בפברואר וה-PRO 6000 נכנס בלי מחשב מארח. אחר כך חישבתי מחדש את החשבון שחשוב — טוקנים לדולר מול ה-API של אותו מודל — והגרסה הראשונה שלו הניחה שאדם משתמש במכונה 1% מהזמן. מדדתי 43,593 קריאות אמיתיות של סוכן קוד במכונה הזאת: ה-1% לא מתאר אף אחד (צ\'אט נמצא ליד 0.03%; סוכן, בין 10% ל-30%), 96% מהקלט הוא קריאה חוזרת של הקשר, ושינוי כלל החיוב של הקריאה החוזרת מזיז את החשבון פי 16, בעוד שהחלפת מכונה מזיזה אותו פי 3.6. במשטר היחיד שבו המכונה הזולה ביותר מנצחת (1.5x), יום השיא שלה לא נכנס ביום, והקריאה הממוצעת, של 151.9 אלף טוקנים, לא נכנסת בהקשר של המודל. קנו בשביל ריבונות, לא בשביל חיסכון.'
    },
  },
},
  /*
   * Segundo do array: data propria (2026-08-26), atras so do `ia-local-por-vram`.
   */
  {
    slug: 'estatisticas-agentes-de-ia',
    title:
      '"95% dos pilotos de IA falham" saiu de 52 entrevistas — e a régua de três perguntas que evita o próximo',
    summary:
      'O "95% dos pilotos de IA falham" saiu de 52 entrevistas e não mediu agentes. Fui às primárias: toda estatística de agente é previsão, declaração ou medição — e cada uma falha de um jeito. A Gartner publica previsão e enquete de webinar na mesma página; o AI Index diz 70% no resumo e 79% no gráfico; a METR mediu devs 19% mais lentos enquanto eles se achavam 20% mais rápidos, e em 2026 não conseguiu repetir porque ninguém aceita trabalhar sem IA; a métrica de consistência sumiu dos placares; um recorde foi retirado por vazamento de gabarito. Medi o encanamento (SDK do MCP: 1.087 vezes em 18 meses) e o Brasil (17% das empresas usam IA; 68% disso é automação de fluxo). Nenhum número é falso — todos mudam de peso quando a etiqueta vai junto.',
    date: '2026-08-26',
    tags: ['ia', 'agentes', 'estatisticas', 'benchmarks', 'metodologia'],
    hero: {
      width: 2400,
      height: 1260,
      locales: {
          'pt-br': { src: '/artigos/estatisticas-agentes-de-ia/hero.jpg', og: '/artigos/estatisticas-agentes-de-ia/hero-og.jpg' },
      // A arte pt-BR tem o texto desenhado dentro; os outros idiomas recebem a capa muda.
      'en': { src: '/artigos/estatisticas-agentes-de-ia/hero-mudo.jpg', og: '/artigos/estatisticas-agentes-de-ia/hero-mudo-og.jpg' },
      'es': { src: '/artigos/estatisticas-agentes-de-ia/hero-mudo.jpg', og: '/artigos/estatisticas-agentes-de-ia/hero-mudo-og.jpg' },
      'it': { src: '/artigos/estatisticas-agentes-de-ia/hero-mudo.jpg', og: '/artigos/estatisticas-agentes-de-ia/hero-mudo-og.jpg' },
      'he': { src: '/artigos/estatisticas-agentes-de-ia/hero-mudo.jpg', og: '/artigos/estatisticas-agentes-de-ia/hero-mudo-og.jpg' },
      },
    },
    i18n: {
      en: {
        title: '"95% of AI pilots fail" came from 52 interviews — and the three-question test that catches the next one',
        summary: 'The "95% of AI pilots fail" figure came from 52 interviews and never measured agents. I went to the primary sources: every agent statistic is a forecast, a self-report or a measurement — and each fails in its own way. Gartner publishes a forecast and a webinar poll on the same page; the AI Index says 70% in its summary and 79% in its own chart; METR clocked developers 19% slower while they believed they were 20% faster, and in 2026 could not repeat the trial because nobody agrees to work without AI; the consistency metric vanished from leaderboards; a record was withdrawn for answer leakage. I measured the plumbing (MCP SDK: 1,087x in 18 months) and Brazil (17% of companies use AI; 68% of that is workflow automation). None of the numbers is false — all of them change weight once the label travels with them.'
      },
      es: {
        title: '"El 95 % de los pilotos de IA fracasa" salió de 52 entrevistas — y la regla de tres preguntas que evita el próximo',
        summary: 'El "95% de los pilotos de IA fracasa" salió de 52 entrevistas y no midió agentes. Fui a las fuentes primarias: toda estadística de agentes es previsión, declaración o medición — y cada una falla a su manera. Gartner publica una previsión y una encuesta de webinar en la misma página; el AI Index dice 70% en el resumen y 79% en su propio gráfico; METR cronometró a desarrolladores un 19% más lentos mientras ellos se creían un 20% más rápidos, y en 2026 no pudo repetir el ensayo porque nadie acepta trabajar sin IA; la métrica de consistencia desapareció de los rankings; un récord fue retirado por filtración de respuestas. Medí la tubería (SDK de MCP: 1.087 veces en 18 meses) y Brasil (17% de las empresas usan IA; el 68% de eso es automatización de flujos). Ningún número es falso — todos cambian de peso cuando la etiqueta va con ellos.'
      },
      it: {
        title: '"Il 95% dei progetti pilota di IA fallisce" viene da 52 interviste — e le tre domande che evitano il prossimo',
        summary: 'Il "95% dei progetti pilota di IA fallisce" viene da 52 interviste e non ha misurato agenti. Sono andato alle fonti primarie: ogni statistica sugli agenti è previsione, dichiarazione o misurazione — e ciascuna fallisce a modo suo. Gartner pubblica una previsione e un sondaggio da webinar sulla stessa pagina; l\'AI Index dice 70% nel riassunto e 79% nel proprio grafico; METR ha cronometrato sviluppatori il 19% più lenti mentre loro si credevano il 20% più veloci, e nel 2026 non ha potuto ripetere l\'esperimento perché nessuno accetta di lavorare senza IA; la metrica di consistenza è sparita dalle classifiche; un record è stato ritirato per fuga di risposte. Ho misurato le tubature (SDK di MCP: 1.087 volte in 18 mesi) e il Brasile (il 17% delle aziende usa l\'IA; il 68% di questo è automazione di flussi). Nessun numero è falso — tutti cambiano peso quando l\'etichetta viaggia con loro.'
      },
      he: {
        title: '"95% מהפיילוטים של AI נכשלים" יצא מ-52 ראיונות — והכלל של שלוש השאלות שמונע את הבא',
        summary: '"95% מהפיילוטים של AI נכשלים" יצא מ-52 ראיונות ולא מדד סוכנים. הלכתי למקורות הראשוניים: כל סטטיסטיקה על סוכנים היא תחזית, הצהרה או מדידה — וכל אחת נכשלת בדרך משלה. Gartner מפרסמת תחזית וסקר וובינר באותו עמוד; ה-AI Index אומר 70% בתקציר ו-79% בגרף; METR מדדה מפתחים 19% איטיים יותר בזמן שהם חשבו שהם 20% מהירים יותר, וב-2026 לא הצליחה לחזור על כך כי אף אחד לא מוכן לעבוד בלי AI; מדד העקביות נעלם מהלוחות; שיא הוסר בעקבות דליפת פתרונות. מדדתי את הצנרת (SDK של MCP: פי 1,087 תוך 18 חודשים) ואת ברזיל (17% מהחברות משתמשות ב-AI; 68% מזה הוא אוטומציית תהליכים). אף מספר לא שקרי — כולם משנים משקל כשהתווית מגיעה איתם.'
      },
    },
  },
  {
    slug: 'benchmark-harness-modelo',
    title:
      'A nota de segurança é do par, não do modelo — e o próprio laboratório já tinha corrigido',
    summary:
      'Um benchmark de segurança de código mediu a Claude Fable 5 em 59,8% de acertos funcionais e 19,0% de acertos seguros, e o número virou manchete sobre um modelo que decepcionou. Seis dias depois, o mesmo laboratório, o mesmo autor e o mesmo benchmark publicaram a mesma Fable 5 em 72,6% e 29,0% — melhor marca de segurança da tabela naquele momento. Não trocaram o modelo; trocaram a ferramenta que o operava. Fui atrás dos dois textos e achei um terceiro, do mesmo autor e do mesmo dia, que ninguém cita: a auditoria antifraude do próprio benchmark, que derrubou 9 pontos percentuais de segurança de uma combinação sem que nada mudasse no modelo. Mostro a conclusão estreita que os dados sustentam — a nota é do par harness+modelo e da versão da régua no dia em que rodou —, o limite dela (nos oito pares do leaderboard a mediana da diferença é 1,65 ponto, e o caso da Fable 5 é seis vezes isso), o contraditório do Hacker News, que acusa o benchmark de estar torto CONTRA o modelo, e o achado mecânico: contei os links entre as quatro páginas e o grafo é de mão única — quem chega pelo texto que circulou não tem caminho até a correção. Seis figuras próprias, feitas em código, e todos os cálculos por script sobre as 27 linhas do leaderboard.',
    date: '2026-08-25',
    tags: ['ia', 'benchmark', 'seguranca', 'agentes', 'claude', 'metodologia'],
    hero: {
      width: 2400,
      height: 1260,
      locales: {
          'pt-br': { src: '/artigos/benchmark-harness-modelo/hero.jpg', og: '/artigos/benchmark-harness-modelo/hero-og.jpg' },
          'en': { src: '/artigos/benchmark-harness-modelo/hero.jpg', og: '/artigos/benchmark-harness-modelo/hero-og.jpg' },
          'es': { src: '/artigos/benchmark-harness-modelo/hero.jpg', og: '/artigos/benchmark-harness-modelo/hero-og.jpg' },
          'it': { src: '/artigos/benchmark-harness-modelo/hero.jpg', og: '/artigos/benchmark-harness-modelo/hero-og.jpg' },
          'he': { src: '/artigos/benchmark-harness-modelo/hero.jpg', og: '/artigos/benchmark-harness-modelo/hero-og.jpg' },
      },
    },
    i18n: {
      en: {
        title:
          'The security score belongs to the pair, not the model — and the lab itself had already corrected it',
        summary:
          'A code security benchmark measured Claude Fable 5 at 59.8% functional correctness and 19.0% security correctness, and the number became a headline about a model that disappointed. Six days later, the same lab, the same author and the same benchmark published the same Fable 5 at 72.6% and 29.0% — the best security score on the table at that moment. They did not change the model; they changed the tool driving it. I went after both texts and found a third, by the same author on the same day, that nobody cites: the benchmark\'s own anti-cheating audit, which knocked 9 percentage points of security off one combination without anything changing in the model. I show the narrow conclusion the data supports — the score belongs to the harness-and-model pair and to the version of the ruler on the day it ran — its limit (across the eight pairs on the leaderboard the median difference is 1.65 points, and the Fable 5 case is six times that), the Hacker News counterpoint, which accuses the benchmark of being crooked AGAINST the model, and the mechanical finding: I counted the links between the four pages and the graph is one-way — whoever arrives via the text that circulated has no path to the correction. Six original figures, made in code, and every calculation scripted over the 27 leaderboard rows.',
      },
      es: {
        title:
          'La nota de seguridad es del par, no del modelo — y el propio laboratorio ya la había corregido',
        summary:
          'Un benchmark de seguridad de código midió a Claude Fable 5 en 59,8% de aciertos funcionales y 19,0% de aciertos seguros, y el número se volvió titular sobre un modelo que decepcionó. Seis días después, el mismo laboratorio, el mismo autor y el mismo benchmark publicaron la misma Fable 5 en 72,6% y 29,0% — la mejor marca de seguridad de la tabla en ese momento. No cambiaron el modelo; cambiaron la herramienta que lo operaba. Fui a buscar los dos textos y encontré un tercero, del mismo autor y del mismo día, que nadie cita: la auditoría antifraude del propio benchmark, que tumbó 9 puntos porcentuales de seguridad de una combinación sin que nada cambiara en el modelo. Muestro la conclusión estrecha que los datos sostienen — la nota es del par herramienta y modelo, y de la versión de la regla el día en que se ejecutó —, su límite (en los ocho pares del leaderboard la mediana de la diferencia es 1,65 puntos, y el caso de la Fable 5 es seis veces eso), el contradictorio de Hacker News, que acusa al benchmark de estar torcido CONTRA el modelo, y el hallazgo mecánico: conté los enlaces entre las cuatro páginas y el grafo es de sentido único — quien llega por el texto que circuló no tiene camino hasta la corrección. Seis figuras propias, hechas en código, y todos los cálculos por script sobre las 27 filas del leaderboard.',
      },
      it: {
        title:
          'Il punteggio di sicurezza è della coppia, non del modello — e il laboratorio stesso lo aveva già corretto',
        summary:
          'Un benchmark di sicurezza del codice ha misurato Claude Fable 5 al 59,8% di correttezza funzionale e al 19,0% di correttezza di sicurezza, e il numero è diventato il titolo su un modello che ha deluso. Sei giorni dopo, lo stesso laboratorio, lo stesso autore e lo stesso benchmark hanno pubblicato la stessa Fable 5 al 72,6% e al 29,0% — il miglior punteggio di sicurezza della tabella in quel momento. Non hanno cambiato il modello; hanno cambiato lo strumento che lo guidava. Sono andato a cercare i due testi e ne ho trovato un terzo, dello stesso autore e dello stesso giorno, che nessuno cita: la verifica antifrode del benchmark stesso, che ha tolto 9 punti percentuali di sicurezza a una combinazione senza che nel modello cambiasse nulla. Mostro la conclusione stretta che i dati reggono — il punteggio è della coppia strumento e modello, e della versione del metro nel giorno in cui è stata eseguita —, il suo limite (nelle otto coppie della leaderboard la mediana della differenza è 1,65 punti, e il caso della Fable 5 è sei volte tanto), il contraddittorio di Hacker News, che accusa il benchmark di essere storto CONTRO il modello, e la scoperta meccanica: ho contato i link fra le quattro pagine e il grafo è a senso unico — chi arriva dal testo che è circolato non ha alcun percorso verso la correzione. Sei figure originali, fatte in codice, e tutti i calcoli via script sulle 27 righe della leaderboard.',
      },
      he: {
        title: 'ציון האבטחה שייך לצמד, לא למודל — והמעבדה עצמה כבר תיקנה אותו',
        summary:
          'מבחן השוואתי לאבטחת קוד מדד את Claude Fable 5 ב-59.8% הצלחה תפקודית וב-19.0% הצלחה אבטחתית, והמספר הפך לכותרת על מודל שאכזב. שישה ימים לאחר מכן, אותה מעבדה, אותו מחבר ואותו מבחן פרסמו את אותה Fable 5 ב-72.6% וב-29.0% — התוצאה האבטחתית הטובה ביותר בטבלה באותו רגע. הם לא החליפו את המודל; הם החליפו את הכלי שהפעיל אותו. חיפשתי את שני הטקסטים ומצאתי שלישי, של אותו מחבר ומאותו יום, שאיש אינו מצטט: ביקורת האנטי-רמייה של המבחן עצמו, שהורידה 9 נקודות אחוז של אבטחה משילוב אחד בלי ששום דבר במודל השתנה. אני מראה את המסקנה הצרה שהנתונים תומכים בה — הציון שייך לצמד הכלי והמודל, ולגרסת הסרגל ביום שבו הורץ —, את הגבול שלה (בשמונת הצמדים בטבלה החציון של ההפרש הוא 1.65 נקודות, והמקרה של Fable 5 גדול פי שישה מכך), את הצד שכנגד מ-Hacker News, שמאשים את המבחן בכך שהוא עקום נגד המודל, ואת הממצא המכני: ספרתי את הקישורים בין ארבעת העמודים והגרף חד-כיווני — מי שמגיע מהטקסט שהופץ אין לו דרך להגיע לתיקון. שישה איורים מקוריים, עשויים בקוד, וכל החישובים בסקריפט על 27 שורות הטבלה.',
      },
    },
  },
  /*
   * Primeiro do array de propósito: divide a data com `memoria-llm-local` e o
   * `sort` de `artigosByDateDesc` é estável — no empate, quem vem antes aqui
   * aparece antes no índice.
   */
  {
    slug: 'marca-dagua-claude',
    title:
      "A marca d'água do Claude não é um carimbo escondido no texto — é o jeito de sortear as palavras",
    summary:
      "A expressão \"marca d'água\" faz quase todo mundo imaginar a coisa errada: um carimbo escondido, um caractere invisível, algo acrescentado ao texto. Não é nada disso — nada é inserido, e o que muda é a origem do sorteio quando o modelo escolhe entre duas palavras que serviriam igualmente bem. Explico o mecanismo do zero, primeiro sem uma palavra técnica (o caminho de casa e um número secreto combinado com um amigo), depois com os nomes que aparecem na documentação. É do mecanismo que caem, de graça, todos os limites: por que texto curto quase não marca, por que código quase não marca, por que a revisão de um texto seu quase não marca, e por que a marca nunca vai dizer quem escreveu. Separo também o que a imprensa vai juntar nos próximos dias: marca d'água no texto e credencial C2PA no arquivo são mecanismos diferentes. Sete figuras próprias, feitas em código. E a ressalva que muda o uso: a API que permitiria a qualquer um conferir um texto ainda não existe — o artigo trata isso como promessa, não como fato.",
    date: '2026-08-14',
    tags: ['ia', 'claude', 'anthropic', 'marca-dagua', 'regulacao', 'didatico'],
    hero: {
      width: 2400,
      height: 1260,
      locales: {
        'pt-br': { src: '/artigos/marca-dagua-claude/hero.png', og: '/artigos/marca-dagua-claude/hero-og.jpg' },
      },
    },
    i18n: {
      en: {
        title:
          "Claude's text watermark is not a hidden stamp — it is the way the words get picked",
        summary:
          'The phrase "watermark" makes almost everyone picture the wrong thing: a hidden stamp, an invisible character, something added to the text. It is none of that — nothing is inserted, and what changes is the source of the randomness when the model picks between two words that would serve equally well. I explain the mechanism from scratch, first without a single technical word (the way home and a secret number agreed with a friend), then with the names that appear in the documentation. Every limit falls out of the mechanism for free: why short text barely marks, why code barely marks, why proofreading your own text barely marks, and why the mark will never say who wrote it. I also separate what the press will merge over the coming days: a watermark in text and a C2PA credential in a file are different mechanisms. Seven original figures, made in code. And the caveat that changes how you can use this: the API that would let anyone check a text does not exist yet — the article treats that as a promise, not a fact.',
      },
      es: {
        title:
          'La marca de agua de Claude no es un sello escondido en el texto — es la forma de sortear las palabras',
        summary:
          'La expresión "marca de agua" hace que casi todo el mundo imagine lo equivocado: un sello escondido, un carácter invisible, algo añadido al texto. No es nada de eso: no se inserta nada, y lo que cambia es el origen del sorteo cuando el modelo elige entre dos palabras que servirían igual de bien. Explico el mecanismo desde cero, primero sin una sola palabra técnica (el camino a casa y un número secreto acordado con un amigo), después con los nombres que aparecen en la documentación. Del mecanismo salen gratis todos los límites: por qué el texto corto casi no marca, por qué el código casi no marca, por qué corregir un texto tuyo casi no marca, y por qué la marca nunca dirá quién escribió. También separo lo que la prensa va a juntar estos días: marca de agua en el texto y credencial C2PA en el archivo son mecanismos distintos. Siete figuras propias, hechas en código. Y la salvedad que cambia el uso: la API que permitiría a cualquiera comprobar un texto todavía no existe — el artículo lo trata como promesa, no como hecho.',
      },
      it: {
        title:
          'La filigrana di Claude non è un timbro nascosto nel testo — è il modo in cui vengono scelte le parole',
        summary:
          'La parola "filigrana" fa immaginare a quasi tutti la cosa sbagliata: un timbro nascosto, un carattere invisibile, qualcosa aggiunto al testo. Non è niente di tutto questo: non viene inserito nulla, e ciò che cambia è l\'origine del sorteggio quando il modello sceglie fra due parole che andrebbero ugualmente bene. Spiego il meccanismo da zero, prima senza una sola parola tecnica (la strada di casa e un numero segreto concordato con un amico), poi con i nomi che compaiono nella documentazione. Dal meccanismo discendono gratis tutti i limiti: perché il testo breve quasi non viene marcato, perché il codice quasi non viene marcato, perché la revisione di un tuo testo quasi non lascia filigrana, e perché la filigrana non dirà mai chi ha scritto. Separo anche ciò che la stampa unirà nei prossimi giorni: filigrana nel testo e credenziale C2PA nel file sono meccanismi diversi. Sette figure originali, fatte in codice. E la precisazione che cambia l\'uso: l\'API che permetterebbe a chiunque di verificare un testo non esiste ancora — l\'articolo la tratta come promessa, non come fatto.',
      },
      he: {
        title: 'סימן המים של קלוד אינו חותמת נסתרת בטקסט — הוא הדרך שבה נבחרות המילים',
        summary:
          'הצירוף "סימן מים" גורם כמעט לכל אחד לדמיין את הדבר השגוי: חותמת נסתרת, תו בלתי נראה, משהו שנוסף לטקסט. זה לא כך — שום דבר לא מוכנס, ומה שמשתנה הוא מקור האקראיות כשהדגם בוחר בין שתי מילים שמשרתות אותו באותה מידה. אני מסביר את המנגנון מאפס, קודם בלי מילה טכנית אחת (הדרך הביתה ומספר סודי שסוכם עם חבר), ואחר כך עם השמות שמופיעים בתיעוד. מהמנגנון נובעות בחינם כל המגבלות: למה טקסט קצר כמעט אינו מסומן, למה קוד כמעט אינו מסומן, למה הגהה של טקסט שלכם כמעט אינה מסומנת, ולמה הסימן לעולם לא יגיד מי כתב. אני גם מפריד בין מה שהעיתונות תערבב בימים הקרובים: סימן מים בטקסט ותעודת C2PA בקובץ הם מנגנונים שונים. שבעה איורים מקוריים, עשויים בקוד. וההסתייגות שמשנה את השימוש: ה-API שיאפשר לכל אחד לבדוק טקסט עדיין אינו קיים — המאמר מתייחס לזה כהבטחה, לא כעובדה.',
      },
    },
  },
  {
    slug: 'memoria-llm-local',
    title: 'Como saber se um modelo de IA roda no seu computador — e por quê',
    summary:
      'A pergunta de quem quer rodar um modelo de linguagem na própria máquina é sempre a mesma: isso cabe aqui? A resposta tem duas parcelas, e só uma delas cresce enquanto você conversa. Explico as duas do zero, três vezes seguidas: primeiro sem nenhuma palavra técnica, depois com os nomes que aparecem na documentação, depois com a fórmula e os números reais do Qwen3.8-27B, lançado neste mês — 27.781.427.952 parâmetros, 64 camadas das quais apenas 16 guardam cache que cresce, 15,82 GiB de pesos em Q4_K_M e 16,14 GiB de cache no contexto máximo de 262.144 tokens. Pelo caminho, três armadilhas que os números redondos escondem: K é 1.024 e não mil, GB não é GiB, e o nome do modelo é arredondado. Todo número deste artigo sai de um programa publicado junto: qualquer leitor refaz a conta na máquina dele.',
    date: '2026-08-14',
    tags: ['ia', 'llm', 'hardware', 'quantizacao', 'didatico'],
    hero: {
      width: 2400,
      height: 1260,
      locales: {
        'pt-br': { src: '/artigos/memoria-llm-local/hero.jpg', og: '/artigos/memoria-llm-local/hero-og.jpg' },
      },
    },
    i18n: {
      en: {
        title: 'How to know if an AI model runs on your computer — and why',
        summary:
          'The question from anyone who wants to run a language model on their own computer is always the same: does this fit here? The answer has two parts, and only one of them grows while you talk. I explain both from scratch, three times in a row: first without any technical word, then with the names that appear in the documentation, then with the formula and the real numbers from Qwen3.8-27B, released this month — 27,781,427,952 parameters, 64 layers of which only 16 hold cache that grows, 15.82 GiB of weights in Q4_K_M and 16.14 GiB of cache at maximum context of 262,144 tokens. Along the way, three traps that round numbers hide: K is 1,024 and not a thousand, GB is not GiB, and the model name is rounded. Every number in this article comes from a program published alongside it: any reader can redo the math on their own machine.',
      },
      es: {
        title: 'Cómo saber si un modelo de IA funciona en tu ordenador — y por qué',
        summary:
          'La pregunta de quien quiere ejecutar un modelo de lenguaje en su propio ordenador es siempre la misma: ¿esto cabe aquí? La respuesta tiene dos partidas, y solo una de ellas crece mientras conversas. Explico las dos desde cero, tres veces seguidas: primero sin ninguna palabra técnica, luego con los nombres que aparecen en la documentación, luego con la fórmula y los números reales del Qwen3.8-27B, lanzado este mes — 27.781.427.952 parámetros, 64 capas de las cuales solo 16 guardan caché que crece, 15,82 GiB de pesos en Q4_K_M y 16,14 GiB de caché en el contexto máximo de 262.144 tokens. Por el camino, tres trampas que los números redondos esconden: K es 1.024 y no mil, GB no es GiB, y el nombre del modelo es redondeado. Todo número de este artículo sale de un programa publicado junto: cualquier lector rehace la cuenta en su propia máquina.',
      },
      it: {
        title: 'Come sapere se un modello di IA gira sul tuo computer — e perché',
        summary:
          'La domanda di chi vuole far girare un modello linguistico sul proprio computer è sempre la stessa: questo ci sta qui? La risposta ha due voci, e solo una di esse cresce mentre parli. Spiego entrambe da zero, tre volte di fila: prima senza nessuna parola tecnica, poi con i nomi che compaiono nella documentazione, poi con la formula e i numeri reali del Qwen3.8-27B, uscito questo mese — 27.781.427.952 parametri, 64 strati di cui solo 16 mantengono cache che cresce, 15,82 GiB di pesi in Q4_K_M e 16,14 GiB di cache nel contesto massimo di 262.144 token. Lungo il percorso, tre trappole che i numeri tondi nascondono: K è 1.024 e non mille, GB non è GiB, e il nome del modello è arrotondato. Ogni numero di questo articolo proviene da un programma pubblicato insieme: qualsiasi lettore può rifare il conto sulla propria macchina.',
      },
      he: {
        title: 'איך לדעת אם מודל בינה מלאכותית רץ על המחשב שלך — ולמה',
        summary:
          'השאלה של מי שרוצה להריץ מודל שפה על המחשב שלו היא תמיד אותה שאלה: זה נכנס כאן? התשובה מורכבת משני מרכיבים, ורק אחד מהם גדל בזמן שאתה משוחח. אני מסביר את שניהם מאפס, שלוש פעמים ברצף: קודם כל בלי מילה טכנית אחת, אחר כך עם השמות שמופיעים בתיעוד, ואחר כך עם הנוסחה והמספרים האמיתיים של Qwen3.8-27B, שיצא החודש הזה — 27,781,427,952 פרמטרים, 64 שכבות שמהן רק 16 שומרות cache שגדל, 15.82 GiB של משקלים ב-Q4_K_M ו-16.14 GiB של cache בהקשר מקסימלי של 262,144 tokens. בדרך, שלוש מלכודות שמספרים עגולים מסתירים: K הוא 1,024 ולא אלף, GB אינו GiB, והשם של המודל מעוגל. כל מספר במאמר זה מגיע מתוכנית שפורסמה ביחד איתו: כל קורא יכול לחזור על החישוב על המחשב שלו.',
      },
    },
  },
  {
    slug: 'relatorio-de-risco-anthropic',
    title:
      'A Anthropic elevou o risco dos próprios modelos: o que dizem as 186 páginas do relatório de agosto',
    summary:
      'Pela primeira vez a Anthropic piorou a nota que dá a si mesma — e reclassificou o passado junto. Li as 186 páginas do relatório de risco de agosto de 2026: o que importa não é a nota, são as cinco falhas de processo que a empresa descreve, incluindo uma contaminação de treinamento que atingiu praticamente todos os modelos Claude com corte de conhecimento posterior a dezembro de 2024 e foi descoberta depois da data de corte do próprio relatório.',
    date: '2026-08-14',
    tags: ['anthropic', 'seguranca-de-ia', 'claude', 'governanca'],
    hero: {
      width: 2400,
      height: 1260,
      locales: {
        'pt-br': { src: '/artigos/relatorio-de-risco-anthropic/hero.jpg', og: '/artigos/relatorio-de-risco-anthropic/hero-og.jpg' },
      },
    },
    i18n: {
      en: {
        title: 'Anthropic Raised the Risk Score on Its Own Models: What the 186-Page August Report Says',
        summary:
          'For the first time Anthropic lowered its own grade — and reclassified the past along with it. I read all 186 pages of the August 2026 risk report: what matters is not the score but the five process failures the company describes, including a training-data contamination that hit nearly every Claude model with a knowledge cutoff after December 2024 and was discovered after the report\'s own coverage date.',
      },
      es: {
        title: 'Anthropic elevó el riesgo de sus propios modelos: lo que dicen las 186 páginas del informe de agosto',
        summary:
          'Por primera vez Anthropic empeoró la nota que se da a sí misma — y reclasificó el pasado con ella. Leí las 186 páginas del informe de riesgo de agosto de 2026: lo que importa no es la nota, sino las cinco fallas de proceso que la empresa describe, incluida una contaminación de entrenamiento que alcanzó a casi todos los modelos Claude con corte de conocimiento posterior a diciembre de 2024.',
      },
      it: {
        title: 'Anthropic ha alzato il rischio dei propri modelli: cosa dicono le 186 pagine del rapporto di agosto',
        summary:
          'Per la prima volta Anthropic ha peggiorato il voto che dà a se stessa — e ha riclassificato anche il passato. Ho letto le 186 pagine del rapporto di rischio di agosto 2026: ciò che conta non è il voto, ma i cinque fallimenti di processo che l\'azienda descrive, inclusa una contaminazione dei dati di addestramento che ha colpito quasi tutti i modelli Claude con knowledge cutoff successivo a dicembre 2024.',
      },
      he: {
        title: 'Anthropic העלתה את הסיכון של המודלים שלה: מה אומרים 186 עמודי דוח אוגוסט',
        summary:
          'בפעם הראשונה Anthropic הורידה את הציון שהיא נותנת לעצמה — וסיווגה מחדש גם את העבר. קראתי את כל 186 העמודים של דוח הסיכונים מאוגוסט 2026: מה שחשוב הוא לא הציון אלא חמשת כשלי התהליך שהחברה מתארת, ובהם זיהום נתוני אימון שפגע כמעט בכל מודלי Claude עם knowledge cutoff שאחרי דצמבר 2024.',
      },
    },
  },
  {
    slug: 'glm-5-3',
    title:
      'GLM-5.3: a Z.ai adiou os pesos citando capacidade cyber e publicou 2.436 vulnerabilidades como prova — 2.239 delas nunca saíram da descoberta',
    summary:
      'A Z.ai atrasou os pesos abertos do GLM-5.3 alegando que a capacidade ofensiva do modelo cresceu mais rápido que o esperado, e ofereceu como prova um ledger público de 2.436 vulnerabilidades em software real. Baixei e contei o ledger inteiro: 92% dos achados nunca foram reportados a ninguém, exatamente um consta como enviado ao mantenedor, não há prazo de embargo declarado e nenhum registro atribui a descoberta a um modelo — 21% deles usaram o Claude Code como harness.',
    date: '2026-08-14',
    tags: ['glm', 'z.ai', 'llm', 'benchmarks', 'open-weights', 'seguranca'],
    hero: {
      width: 2400,
      height: 1260,
      locales: {
          'pt-br': { src: '/artigos/glm-5-3/hero.jpg', og: '/artigos/glm-5-3/hero-og.jpg' },
          'en': { src: '/artigos/glm-5-3/hero.jpg', og: '/artigos/glm-5-3/hero-og.jpg' },
          'es': { src: '/artigos/glm-5-3/hero.jpg', og: '/artigos/glm-5-3/hero-og.jpg' },
          'it': { src: '/artigos/glm-5-3/hero.jpg', og: '/artigos/glm-5-3/hero-og.jpg' },
          'he': { src: '/artigos/glm-5-3/hero.jpg', og: '/artigos/glm-5-3/hero-og.jpg' },
      },
    },
    i18n: {
      en: {
        title:
          'GLM-5.3: Z.ai delayed the weights citing cyber capability and published 2,436 vulnerabilities as proof — 2,239 of them never left discovery',
        summary:
          'Z.ai delayed GLM-5.3’s open weights claiming the model’s offensive capability grew faster than expected, and offered as proof a public ledger of 2,436 vulnerabilities in real software. I downloaded and counted the whole ledger: 92% of the findings were never reported to anyone, exactly one is marked as sent to a maintainer, no embargo deadline is declared anywhere, and not a single record credits a model — 21% of them used Claude Code as the harness.',
      },
      es: {
        title:
          'GLM-5.3: Z.ai retrasó los pesos citando capacidad cyber y publicó 2436 vulnerabilidades como prueba — 2239 de ellas nunca salieron del descubrimiento',
        summary:
          'Z.ai retrasó los pesos abiertos del GLM-5.3 alegando que la capacidad ofensiva del modelo creció más rápido de lo esperado, y ofreció como prueba un ledger público de 2436 vulnerabilidades en software real. Descargué y conté el ledger entero: el 92 % de los hallazgos nunca fue reportado a nadie, exactamente uno consta como enviado al mantenedor, no hay plazo de embargo declarado y ningún registro atribuye el descubrimiento a un modelo — el 21 % usó Claude Code como harness.',
      },
      it: {
        title:
          'GLM-5.3: Z.ai ha rinviato i pesi citando la capacità cyber e ha pubblicato 2.436 vulnerabilità come prova — 2.239 non sono mai uscite dalla scoperta',
        summary:
          'Z.ai ha rinviato i pesi aperti di GLM-5.3 sostenendo che la capacità offensiva del modello è cresciuta più in fretta del previsto, e ha offerto come prova un ledger pubblico di 2.436 vulnerabilità in software reale. Ho scaricato e contato l’intero ledger: il 92% delle scoperte non è mai stato segnalato a nessuno, esattamente una risulta inviata al manutentore, non è dichiarata alcuna scadenza di embargo e nessun record attribuisce la scoperta a un modello — il 21% ha usato Claude Code come harness.',
      },
      he: {
        title:
          'GLM-5.3: ‏Z.ai דחתה את המשקלים בטענה ליכולת סייבר ופרסמה 2,436 פרצות כהוכחה — 2,239 מהן מעולם לא יצאו משלב הגילוי',
        summary:
          'חברת Z.ai דחתה את שחרור המשקלים הפתוחים של GLM-5.3 בטענה שהיכולת ההתקפית של המודל גדלה מהר מהצפוי, והציעה כהוכחה ledger ציבורי של 2,436 פרצות בתוכנה אמיתית. הורדתי וספרתי את ה־ledger כולו: 92% מהממצאים מעולם לא דווחו לאיש, בדיוק אחד מסומן כנשלח למתחזק, לא מוצהר שום מועד embargo, ואף רשומה אינה מייחסת את הגילוי למודל — ב־21% מהם שימש Claude Code כ־harness.',
      },
    },
  },
  {
    slug: '2026-07-24-claude-opus-5',
    title:
      'Opus 5: a inteligência de fronteira ficou pela metade do preço — e o Reddit foi zoar o gráfico',
    summary:
      'A Anthropic lançou o Claude Opus 5 prometendo inteligência de fronteira por metade do preço. O que mudou de fato na API, o que os gráficos do anúncio mostram quando você abre as imagens — inclusive que o esforço máximo piora o resultado — e por que a zoeira mais votada da comunidade não sobrevive a uma conferida.',
    date: '2026-07-24',
    tags: ['claude', 'anthropic', 'llm', 'api', 'benchmarks'],
    hero: {
      width: 2400,
      height: 1260,
      locales: {
          'pt-br': { src: '/artigos/2026-07-24-claude-opus-5/hero.jpg', og: '/artigos/2026-07-24-claude-opus-5/hero-og.jpg' },
          'en': { src: '/artigos/2026-07-24-claude-opus-5/hero.jpg', og: '/artigos/2026-07-24-claude-opus-5/hero-og.jpg' },
          'es': { src: '/artigos/2026-07-24-claude-opus-5/hero.jpg', og: '/artigos/2026-07-24-claude-opus-5/hero-og.jpg' },
          'it': { src: '/artigos/2026-07-24-claude-opus-5/hero.jpg', og: '/artigos/2026-07-24-claude-opus-5/hero-og.jpg' },
          'he': { src: '/artigos/2026-07-24-claude-opus-5/hero.jpg', og: '/artigos/2026-07-24-claude-opus-5/hero-og.jpg' },
      },
    },
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
    hero: {
      width: 2400,
      height: 1260,
      locales: {
          'pt-br': { src: '/artigos/deepseek-v4-flash-0731/hero.jpg', og: '/artigos/deepseek-v4-flash-0731/hero-og.jpg' },
          'en': { src: '/artigos/deepseek-v4-flash-0731/hero.jpg', og: '/artigos/deepseek-v4-flash-0731/hero-og.jpg' },
          'es': { src: '/artigos/deepseek-v4-flash-0731/hero.jpg', og: '/artigos/deepseek-v4-flash-0731/hero-og.jpg' },
          'it': { src: '/artigos/deepseek-v4-flash-0731/hero.jpg', og: '/artigos/deepseek-v4-flash-0731/hero-og.jpg' },
          'he': { src: '/artigos/deepseek-v4-flash-0731/hero.jpg', og: '/artigos/deepseek-v4-flash-0731/hero-og.jpg' },
      },
    },
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
    hero: {
      width: 2400,
      height: 1260,
      locales: {
        'pt-br': { src: '/artigos/quantas-pessoas-usam-ia/hero.jpg', og: '/artigos/quantas-pessoas-usam-ia/hero-og.jpg' },
      },
    },
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
    hero: {
      width: 2400,
      height: 1260,
      locales: {
          'pt-br': { src: '/artigos/noisy-tv-agentes/hero.jpg', og: '/artigos/noisy-tv-agentes/hero-og.jpg' },
          'en': { src: '/artigos/noisy-tv-agentes/hero.jpg', og: '/artigos/noisy-tv-agentes/hero-og.jpg' },
          'es': { src: '/artigos/noisy-tv-agentes/hero.jpg', og: '/artigos/noisy-tv-agentes/hero-og.jpg' },
          'it': { src: '/artigos/noisy-tv-agentes/hero.jpg', og: '/artigos/noisy-tv-agentes/hero-og.jpg' },
          'he': { src: '/artigos/noisy-tv-agentes/hero.jpg', og: '/artigos/noisy-tv-agentes/hero-og.jpg' },
      },
    },
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
  {
    slug: 'estatisticas-de-ia',
    title: 'Estatísticas de IA em 2026: o placar, conferido número por número',
    summary:
      'Os data centers "vão consumir mais de 1.000 TWh em 2026 — o equivalente ao Japão", repetem os compilados de estatísticas de IA. Fui conferir: a própria IEA aposentou o número; a série atual mede 485 TWh. Conferi uma a uma as estatísticas que mais circulam, na fonte primária, e o placar tem confere, meia-verdade, fóssil e zumbi — com um padrão: o denominador omitido ("53% da população" era EUA, 18-64 anos). E o degrau Brasil que nenhuma versão internacional tem: 84% dos universitários já usaram genAI, enquanto o país está fora do top-15 de investimento privado.',
    date: '2026-08-02',
    tags: ['ia', 'estatisticas', 'fact-check', 'energia', 'brasil'],
    hero: {
      width: 2400,
      height: 1260,
      locales: {
        'pt-br': { src: '/artigos/estatisticas-de-ia/hero.jpg', og: '/artigos/estatisticas-de-ia/hero-og.jpg' },
      },
    },
    i18n: {
      en: {
        title: 'AI statistics in 2026: the scoreboard, checked number by number',
        summary:
          'Data centers "will consume more than 1,000 TWh in 2026 — the equivalent of Japan," the AI statistics roundups repeat. I went and checked: the IEA itself has retired the number; the current series measures 485 TWh. I checked the most-circulated AI statistics one by one, at the primary source, and the scoreboard has checks-out, half-truth, fossil, and zombie — with one pattern: the omitted denominator ("53% of the population" was the US, ages 18-64). Plus the Brazil step no international version has: 84% of university students have already used genAI, while the country sits outside the top 15 for private investment.',
      },
      es: {
        title: 'Estadísticas de IA en 2026: el marcador, verificado número por número',
        summary:
          'Los data centers "consumirán más de 1000 TWh en 2026 — el equivalente a Japón", repiten las recopilaciones de estadísticas de IA. Fui a verificar: la propia IEA retiró el número; la serie actual mide 485 TWh. Verifiqué una a una, en la fuente primaria, las estadísticas que más circulan, y el marcador tiene cuadra, media verdad, fósil y zombi — con un patrón: el denominador omitido ("el 53 % de la población" era EE. UU., 18-64 años). Y el escalón Brasil que ninguna versión internacional tiene: el 84 % de los universitarios ya usó genAI, mientras el país queda fuera del top-15 de inversión privada.',
      },
      it: {
        title: "Statistiche sull'IA nel 2026: il tabellone, verificato numero per numero",
        summary:
          "I data center \"consumeranno più di 1.000 TWh nel 2026 — l'equivalente del Giappone\", ripetono le raccolte di statistiche sull'IA. Sono andato a verificare: la stessa IEA ha mandato in pensione il numero; la serie attuale misura 485 TWh. Ho verificato una per una le statistiche che più circolano, alla fonte primaria, e il tabellone ha \"confermato\", \"mezza verità\", \"fossile\" e \"zombie\" — con uno schema ricorrente: il denominatore omesso (il \"53% della popolazione\" era USA, 18-64 anni). E il gradino Brasile che nessuna versione internazionale ha: l'84% degli universitari ha già usato la genAI, mentre il paese è fuori dalla top-15 dell'investimento privato.",
      },
      he: {
        title: 'סטטיסטיקות AI ב־2026: לוח התוצאות, מאומת מספר אחרי מספר',
        summary:
          'ה־data centers "יצרכו יותר מ־1,000 TWh ב־2026 — שווה־ערך ליפן", חוזרים ומספרים מקבצי הסטטיסטיקות של AI. הלכתי לבדוק: ה־IEA עצמה גנזה את המספר; הסדרה הנוכחית מודדת 485 TWh. בדקתי אחת־אחת את הסטטיסטיקות שהכי מסתובבות, במקור הראשוני, ובלוח התוצאות יש מאומת, חצי־אמת, מאובן וזומבי — עם דפוס אחד: המכנה שהושמט ("53% מהאוכלוסייה" היה ארה״ב, גילאי 18–64). ומדרגת ברזיל שאין באף גרסה בינלאומית: 84% מהסטודנטים כבר השתמשו ב־genAI, בעוד המדינה נמצאת מחוץ ל־top-15 של ההשקעה הפרטית.',
      },
    },
  },
  {
    slug: 'estatisticas-chatgpt',
    title:
      'ChatGPT: os 900 milhões saíram de um anúncio de captação — e a régua está em outro documento',
    summary:
      'Os dois números que sustentam qualquer página de "estatísticas do ChatGPT" — 900 milhões de usuários ativos semanais e 50 milhões de assinantes — vêm da mesma frase de um comunicado de captação de US$ 110 bilhões. Fui ler o post: a definição de "usuário ativo semanal" não está lá. Ela existe, mas mora em outro documento, publicado quatro meses depois, com escopo mais estreito. E o denominador tem paternidade rastreável: o COO mediu 400 mi contra a população total, o paper da OpenAI com o NBER mediu 700 mi contra a adulta, e a página que me deu a pauta voltou para a total — "10% virou 11%" parece progressão e é troca de régua. Na mesma régua, seriam 11,3% e 14,5%. Mais o degrau Brasil: o português é a 2ª língua não-inglesa do ChatGPT, e dois veículos descreveram o mesmo briefing da OpenAI com métricas diferentes na primeira linha.',
    date: '2026-08-03',
    tags: ['ia', 'chatgpt', 'openai', 'estatisticas', 'fact-check', 'brasil'],
    hero: {
      width: 2400,
      height: 1260,
      locales: {
        'pt-br': { src: '/artigos/estatisticas-chatgpt/hero.jpg', og: '/artigos/estatisticas-chatgpt/hero-og.jpg' },
      },
    },
    i18n: {
      en: {
        title:
          'ChatGPT: the 900 million came from a funding announcement — and the ruler is in another document',
        summary:
          'The two numbers holding up any "ChatGPT statistics" page — 900 million weekly active users and 50 million subscribers — come from the same sentence of a US$ 110 billion funding announcement. I went and read the post: the definition of "weekly active user" is not there. It exists, but it lives in another document, published four months later, with a narrower scope. And the denominator has a traceable paternity: the COO measured 400m against total population, OpenAI\'s paper with the NBER measured 700m against the adult population, and the page that gave me this story went back to total — "10% became 11%" looks like progress and is a switched ruler. On the same ruler it would be 11.3% and 14.5%. Plus the Brazil step: Portuguese is ChatGPT\'s second non-English language, and two outlets described the same OpenAI briefing with different metrics in the opening line.',
      },
      es: {
        title:
          'ChatGPT: los 900 millones salieron de un anuncio de financiación — y la regla está en otro documento',
        summary:
          'Los dos números que sostienen cualquier página de "estadísticas de ChatGPT" — 900 millones de usuarios activos semanales y 50 millones de suscriptores — vienen de la misma frase de un comunicado de financiación de 110 000 millones de dólares. Fui a leer el post: la definición de "usuario activo semanal" no está ahí. Existe, pero vive en otro documento, publicado cuatro meses después, con un alcance más estrecho. Y el denominador tiene paternidad rastreable: el COO midió 400 millones contra la población total, el paper de OpenAI con el NBER midió 700 millones contra la adulta, y la página que me dio el tema volvió a la total — "el 10 % pasó a 11 %" parece progresión y es cambio de regla. En la misma regla serían 11,3 % y 14,5 %. Y el escalón Brasil: el portugués es el segundo idioma no inglés de ChatGPT, y dos medios describieron el mismo briefing de OpenAI con métricas distintas en la primera línea.',
      },
      it: {
        title:
          "ChatGPT: i 900 milioni sono usciti da un annuncio di raccolta — e il metro sta in un altro documento",
        summary:
          "I due numeri che reggono qualsiasi pagina di \"statistiche su ChatGPT\" — 900 milioni di utenti attivi settimanali e 50 milioni di abbonati — vengono dalla stessa frase di un comunicato di raccolta da 110 miliardi di dollari. Sono andato a leggere il post: la definizione di \"utente attivo settimanale\" non c'è. Esiste, ma vive in un altro documento, pubblicato quattro mesi dopo, con un perimetro più stretto. E il denominatore ha una paternità ricostruibile: il COO ha misurato 400 milioni contro la popolazione totale, il paper di OpenAI con il NBER ha misurato 700 milioni contro quella adulta, e la pagina che mi ha dato lo spunto è tornata alla totale — \"il 10% è diventato 11%\" sembra progressione ed è un metro cambiato. Sullo stesso metro sarebbero 11,3% e 14,5%. Più il gradino Brasile: il portoghese è la seconda lingua non inglese di ChatGPT, e due testate hanno descritto lo stesso briefing di OpenAI con metriche diverse nella prima riga.",
      },
      he: {
        title:
          'ChatGPT: ה־900 מיליון יצאו מהודעת גיוס — והסרגל נמצא במסמך אחר',
        summary:
          'שני המספרים שמחזיקים כל עמוד של "סטטיסטיקות ChatGPT" — 900 מיליון משתמשים פעילים שבועיים ו־50 מיליון מנויים — מגיעים מאותו משפט בהודעת גיוס של 110 מיליארד דולר. הלכתי לקרוא את הפוסט: ההגדרה של "משתמש פעיל שבועי" לא שם. היא קיימת, אבל גרה במסמך אחר, שפורסם ארבעה חודשים אחר כך, עם היקף צר יותר. ולמכנה יש אבהות בת־מעקב: ה־COO מדד 400 מיליון מול האוכלוסייה הכוללת, המאמר של OpenAI עם ה־NBER מדד 700 מיליון מול הבוגרת, והעמוד שנתן לי את הנושא חזר לכוללת — "10% הפכו ל־11%" נראה כמו התקדמות והוא החלפת סרגל. באותו סרגל זה היה 11.3% ו־14.5%. ובנוסף מדרגת ברזיל: פורטוגזית היא השפה השנייה שאינה אנגלית של ChatGPT, ושני כלי תקשורת תיארו את אותו תדריך של OpenAI עם מדדים שונים בשורה הראשונה.',
      },
    },
  },
  {
    slug: 'estatisticas-claude',
    title:
      'O Brasil é o 5º país que mais usa o Claude — e isso quer dizer menos do que parece',
    summary:
      'O Brasil é o quinto país que mais usa o Claude — e o dado, ao contrário de quase tudo que circula, vem de fonte primária: o microdado que a própria Anthropic publica sob CC-BY. Baixei o dataset e medi. A mesma medição diz o que a manchete não carrega: em intensidade per capita somos o 61º de 121 — estamos no topo porque somos grandes, não porque somos intensos. Volume não é intensidade, e a versão em dinheiro dessa confusão (run rate não é receita) sustenta quase toda página de "estatísticas do Claude" de 2026. Conferi a mais completa delas fonte a fonte: o run rate de US$ 47 bi é um mês forte anualizado; o CFO, sob juramento, declarou mais de US$ 5 bi desde a fundação na mesma janela do "~19 bi" público — não é flagrante, é velocímetro contra odômetro. E o único dado que qualquer um reproduz de graça leva uma linha na página; o vazamento leva a manchete.',
    date: '2026-08-10',
    tags: ['ia', 'claude', 'anthropic', 'estatisticas', 'fact-check', 'brasil'],
    hero: {
      width: 2400,
      height: 1260,
      locales: {
        'pt-br': { src: '/artigos/estatisticas-claude/hero.jpg', og: '/artigos/estatisticas-claude/hero-og.jpg' },
      },
    },
    i18n: {
      en: {
        title:
          'Brazil ranks 5th in the world in Claude usage — and that means less than it seems',
        summary:
          'Brazil is the fifth country in the world in Claude usage — and unlike almost everything in circulation, the number comes from a primary source: the microdata Anthropic itself publishes under CC-BY. I downloaded the dataset and measured. The same measurement says what the headline does not carry: in per-capita intensity we are 61st of 121 — we sit at the top because we are big, not because we are intense. Volume is not intensity, and the money version of that confusion (run rate is not revenue) props up nearly every "Claude statistics" page of 2026. I checked the most complete of them source by source: the US$ 47 billion run rate is a strong month annualised; the CFO, under oath, declared more than US$ 5 billion since founding in the same window as the public "~19 billion" — not a smoking gun, a speedometer versus an odometer. And the only number anyone can reproduce for free gets one line on the page; the leak gets the headline.',
      },
      es: {
        title:
          'Brasil es el 5.º país que más usa Claude — y eso quiere decir menos de lo que parece',
        summary:
          'Brasil es el quinto país que más usa Claude — y el dato, al contrario de casi todo lo que circula, viene de fuente primaria: el microdato que la propia Anthropic publica bajo CC-BY. Descargué el dataset y medí. La misma medición dice lo que el titular no carga: en intensidad per cápita somos el 61.º de 121 — estamos en la cima porque somos grandes, no porque seamos intensos. Volumen no es intensidad, y la versión en dinero de esa confusión (run rate no son ingresos) sostiene casi todas las páginas de "estadísticas de Claude" de 2026. Verifiqué la más completa de ellas fuente por fuente: el run rate de 47 000 millones de dólares es un mes fuerte anualizado; el CFO, bajo juramento, declaró más de 5 000 millones desde la fundación en la misma ventana de los "~19 000 millones" públicos — no es un flagrante, es velocímetro contra odómetro. Y el único dato que cualquiera puede reproducir gratis recibe una línea en la página; la filtración recibe el titular.',
      },
      it: {
        title:
          'Il Brasile è il 5° paese che più usa Claude — e vuol dire meno di quanto sembri',
        summary:
          "Il Brasile è il quinto paese che più usa Claude — e il dato, al contrario di quasi tutto ciò che circola, viene da una fonte primaria: il microdato che la stessa Anthropic pubblica con licenza CC-BY. Ho scaricato il dataset e ho misurato. La stessa misurazione dice ciò che il titolo non porta: in intensità pro capite siamo il 61° su 121 — siamo in cima perché siamo grandi, non perché siamo intensi. Il volume non è intensità, e la versione in denaro di quella confusione (il run rate non è fatturato) regge quasi ogni pagina di \"statistiche su Claude\" del 2026. Ho verificato la più completa di esse fonte per fonte: il run rate da 47 miliardi di dollari è un mese forte annualizzato; il CFO, sotto giuramento, ha dichiarato più di 5 miliardi dalla fondazione nella stessa finestra dei \"~19 miliardi\" pubblici — non è una pistola fumante, è tachimetro contro contachilometri. E l'unico dato che chiunque può riprodurre gratis riceve una riga nella pagina; l'indiscrezione riceve il titolo.",
      },
      he: {
        title:
          'ברזיל היא המדינה החמישית בשימוש ב־Claude — וזה אומר פחות ממה שנדמה',
        summary:
          'ברזיל היא המדינה החמישית שהכי משתמשת ב־Claude — והנתון, בניגוד כמעט לכל מה שמסתובב, מגיע ממקור ראשוני: המיקרו־נתון ש־Anthropic עצמה מפרסמת ברישיון CC-BY. הורדתי את מאגר הנתונים ומדדתי. אותה מדידה אומרת מה שהכותרת לא נושאת: בעוצמת שימוש לנפש אנחנו במקום ה־61 מתוך 121 — אנחנו בצמרת כי אנחנו גדולים, לא כי אנחנו אינטנסיביים. נפח אינו עוצמה, והגרסה הכספית של אותו בלבול (run rate אינו הכנסה) מחזיקה כמעט כל עמוד של "סטטיסטיקות Claude" ב־2026. בדקתי את השלם שבהם מקור אחר מקור: ה־run rate של 47 מיליארד דולר הוא חודש חזק במונחים שנתיים; ה־CFO, תחת שבועה, הצהיר על יותר מ־5 מיליארד דולר מאז הייסוד באותו חלון שבו ה־run rate הפומבי היה כ־19 מיליארד — זו לא שערורייה, זה מד־מהירות מול מד־מרחק. והנתון היחיד שכל אחד יכול לשחזר בחינם מקבל שורה אחת בעמוד; ההדלפה מקבלת את הכותרת.',
      },
    },
  },
  {
    slug: 'estatisticas-claude-code',
    title:
      'Claude Code: a estatística que circula é 4.000 vezes menor que a que qualquer um pode medir',
    summary:
      'A página de estatísticas mais completa sobre o Claude Code credita seus downloads a um pacote npm que nunca existiu: 404 no registry, zero capturas no Wayback Machine. O pacote real tem API pública, sem chave e sem paywall — 429 milhões de downloads acumulados, 44,4 milhões só no mês em que a página publicou "111.000+". Medi cada número que dava para medir e o placar fechou em quatro certos, quatro errados e dois sem fonte que permita julgar: a survey de "15.000 desenvolvedores" tinha 906 respondentes; as "22.000 stars" eram 71.847 em 1º de março; o "open source" tem um LICENSE.md de catorze palavras, três das quais são "all rights reserved". Do outro lado, o claim mais inacreditável da lista — 4% de todos os commits públicos do GitHub — confere como estimativa, e a própria Anthropic o ecoou no anúncio da Série G. O detalhe que organiza o placar: os erros apontam todos na mesma direção, para baixo. O produto medível por API pública é maior que o produto descrito pela página que existia para promovê-lo. E o dado primário que ninguém usa rende o recorte brasileiro: 26,0% do uso do Claude.ai no Brasil vem de ocupações de computação e matemática — acima do global (23,8%) e dos Estados Unidos (21,1%).',
    date: '2026-08-11',
    tags: ['ia', 'claude-code', 'anthropic', 'estatisticas', 'fact-check', 'brasil'],
    hero: {
      width: 2400,
      height: 1260,
      locales: {
        'pt-br': { src: '/artigos/estatisticas-claude-code/hero.jpg', og: '/artigos/estatisticas-claude-code/hero-og.jpg' },
      },
    },
    i18n: {
      en: {
        title:
          'Claude Code: the statistic in circulation is 4,000 times smaller than the one anyone can measure',
        summary:
          'The most complete statistics page about Claude Code credits its download numbers to an npm package that never existed: 404 in the registry, zero captures in the Wayback Machine. The real package has a public API, no key and no paywall — 429 million cumulative downloads, 44.4 million in the very month the page published "111,000+". I measured every number that could be measured, and the scorecard closed at four right, four wrong and two with no source that allows a verdict: the survey of "15,000 developers" had 906 respondents; the "22,000 stars" were 71,847 on 1 March; the "open source" has a LICENSE.md of fourteen words, three of which are "all rights reserved". On the other side, the least believable claim on the list — 4% of all public GitHub commits — checks out as an estimate, and Anthropic itself echoed it in the Series G announcement. The detail that organises the scorecard: the errors all point the same way, downwards. The product measurable by public API is larger than the product described by the page that existed to promote it. And the primary data nobody uses yields the Brazilian angle: 26.0% of Claude.ai usage in Brazil comes from computer and mathematical occupations — above the global average (23.8%) and the United States (21.1%).',
      },
      es: {
        title:
          'Claude Code: la estadística que circula es 4000 veces menor que la que cualquiera puede medir',
        summary:
          'La página de estadísticas más completa sobre Claude Code atribuye sus cifras de descargas a un paquete de npm que nunca existió: 404 en el registro, cero capturas en Wayback Machine. El paquete real tiene una API pública, sin clave y sin muro de pago — 429 millones de descargas acumuladas, 44,4 millones solo en el mes en que la página publicó "111 000+". Medí cada número que se podía medir y el marcador cerró en cuatro correctos, cuatro equivocados y dos sin fuente que permita juzgar: la encuesta de "15 000 desarrolladores" tenía 906 respuestas; las "22 000 estrellas" eran 71 847 el 1 de marzo; el "open source" tiene un LICENSE.md de catorce palabras, tres de las cuales son "all rights reserved". Del otro lado, la afirmación más increíble de la lista — el 4 % de todos los commits públicos de GitHub — se confirma como estimación, y la propia Anthropic la repitió en el anuncio de la Serie G. El detalle que ordena el marcador: los errores apuntan todos en la misma dirección, hacia abajo. El producto medible por API pública es mayor que el producto descrito por la página que existía para promoverlo. Y el dato primario que nadie usa da el recorte brasileño: el 26,0 % del uso de Claude.ai en Brasil viene de ocupaciones de computación y matemáticas — por encima de la media global (23,8 %) y de Estados Unidos (21,1 %).',
      },
      it: {
        title:
          'Claude Code: la statistica che circola è 4.000 volte più piccola di quella che chiunque può misurare',
        summary:
          "La pagina di statistiche più completa su Claude Code attribuisce i suoi numeri di download a un pacchetto npm che non è mai esistito: 404 nel registry, zero catture nella Wayback Machine. Il pacchetto vero ha un'API pubblica, senza chiave e senza paywall — 429 milioni di download cumulativi, 44,4 milioni nel solo mese in cui la pagina ha pubblicato \"111.000+\". Ho misurato ogni numero misurabile e il tabellino si è chiuso su quattro giusti, quattro sbagliati e due senza fonte che permetta un verdetto: il sondaggio da \"15.000 sviluppatori\" aveva 906 rispondenti; le \"22.000 stelle\" erano 71.847 il 1° marzo; l'\"open source\" ha un LICENSE.md di quattordici parole, tre delle quali sono \"all rights reserved\". Dall'altro lato, l'affermazione più incredibile dell'elenco — il 4% di tutti i commit pubblici di GitHub — regge come stima, e Anthropic stessa l'ha ripresa nell'annuncio della Serie G. Il dettaglio che ordina il tabellino: gli errori puntano tutti nella stessa direzione, verso il basso. Il prodotto misurabile con un'API pubblica è più grande del prodotto descritto dalla pagina che esisteva per promuoverlo. E il dato primario che nessuno usa dà il taglio brasiliano: il 26,0% dell'uso di Claude.ai in Brasile viene da occupazioni informatiche e matematiche — sopra la media globale (23,8%) e gli Stati Uniti (21,1%).",
      },
      he: {
        title:
          'Claude Code: הסטטיסטיקה שמסתובבת קטנה פי 4,000 מזו שכל אחד יכול למדוד',
        summary:
          'עמוד הסטטיסטיקות המקיף ביותר על Claude Code מייחס את מספרי ההורדות שלו לחבילת npm שמעולם לא הייתה קיימת: 404 ב־registry, אפס צילומים ב־Wayback Machine. לחבילה האמיתית יש API ציבורי, בלי מפתח ובלי תשלום — 429 מיליון הורדות מצטברות, 44.4 מיליון רק בחודש שבו העמוד פרסם "111,000+". מדדתי כל מספר שאפשר היה למדוד, והתוצאה נסגרה על ארבעה נכונים, ארבעה שגויים ושניים בלי מקור שמאפשר הכרעה: הסקר של "15,000 מפתחים" כלל 906 משיבים; "22,000 הכוכבים" היו 71,847 ב־1 במרץ; ה"קוד הפתוח" הוא LICENSE.md בן ארבע־עשרה מילים, שלוש מהן "all rights reserved". מנגד, הטענה הכי לא־ייאמן ברשימה — 4% מכל הקומיטים הציבוריים ב־GitHub — מחזיקה כהערכה, ו־Anthropic עצמה חזרה עליה בהודעת סבב G. הפרט שמסדר את התוצאה: כל השגיאות מצביעות לאותו כיוון, כלפי מטה. המוצר שאפשר למדוד ב־API ציבורי גדול מהמוצר שמתאר אותו עמוד שנועד לקדם אותו. והנתון הראשוני שאיש לא משתמש בו נותן את הזווית הברזילאית: 26.0% מהשימוש ב־Claude.ai בברזיל מגיע מעיסוקי מחשוב ומתמטיקה — מעל הממוצע העולמי (23.8%) ומעל ארצות הברית (21.1%).',
      },
    },
  },
  {
    slug: 'jogos-robos-humanoides-2026',
    title:
      'A era dos humanos acabou? Robôs mais rápidos que o Bolt, mais altos que o Sotomayor, 97% fabricados na China — o que os vídeos de Pequim provam, e os dois que são falsos',
    summary:
      'Em 2009, Usain Bolt correu 100 m em 9,58 s e ninguém chegou perto em 17 anos. No sábado, 22 de agosto, em Pequim, um robô fez a distância em 9,39 s numa bateria oficial — e há um ano o vencedor da mesma prova fazia 21,50 s. Li os 14 posts mais compartilhados da semana dos World Humanoid Robot Games 2026, baixei os 11 vídeos, extraí frame por frame, li a imprensa chinesa, os fact-checkers e o regulamento. A resposta tem duas metades. A primeira é sim: o que aconteceu em Pequim é real, é maior do que 2025 por uma ordem de grandeza — 2.056 robôs, 666 equipes, 16 países, cinco dias — e é mais impressionante do que as legendas contam. A segunda é o que as legendas escondem: o 9,32 s que o Elon Musk repostou não é o número do placar (aos 18 s do vídeo lê-se 9,39, bateria 9, e o robô que venceu não é o da Honor); os dois clipes mais assustadores da timeline são falsos; e a pergunta certa para cada vídeo não é "que tempo fez" — é "quem estava no controle". Primeiro os robôs, depois a régua. Atualizado em 26/08: a final fechou os Jogos em 8,64 s.',
    date: '2026-08-24',
    tags: ['robotica', 'humanoides', 'china', 'ia', 'fact-check', 'video'],
    hero: {
      width: 2400,
      height: 1260,
      locales: {
          'pt-br': { src: '/artigos/jogos-robos-humanoides-2026/hero.jpg', og: '/artigos/jogos-robos-humanoides-2026/hero-og.jpg' },
          'en': { src: '/artigos/jogos-robos-humanoides-2026/hero.jpg', og: '/artigos/jogos-robos-humanoides-2026/hero-og.jpg' },
          'es': { src: '/artigos/jogos-robos-humanoides-2026/hero.jpg', og: '/artigos/jogos-robos-humanoides-2026/hero-og.jpg' },
          'it': { src: '/artigos/jogos-robos-humanoides-2026/hero.jpg', og: '/artigos/jogos-robos-humanoides-2026/hero-og.jpg' },
          'he': { src: '/artigos/jogos-robos-humanoides-2026/hero.jpg', og: '/artigos/jogos-robos-humanoides-2026/hero-og.jpg' },
      },
    },
    i18n: {
      en: {
        title:
          'Is the human era over? Robots faster than Bolt, higher than Sotomayor, 97% made in China — what the Beijing videos prove, and the two that are fake',
        summary:
          'In 2009, Usain Bolt ran 100 m in 9.58 s and nobody came close for 17 years. On Saturday, 22 August, in Beijing, a robot covered the distance in 9.39 s in an official heat — and a year ago the winner of the same event ran 21.50 s. I read the 14 most shared posts of the week of the World Humanoid Robot Games 2026, downloaded the 11 videos, pulled them apart frame by frame, read the Chinese press, the fact-checkers and the rulebook. The answer has two halves. The first is yes: what happened in Beijing is real, it is bigger than 2025 by an order of magnitude — 2,056 robots, 666 teams, 16 countries, five days — and it is more impressive than the captions say. The second is what the captions hide: the 9.32 s Elon Musk reposted is not the number on the scoreboard (18 s into the video it reads 9.39, heat 9, and the robot that won is not the Honor one); the two most frightening clips on the timeline are fake; and the right question for each video is not "what time did it run" — it is "who was in control". The robots first, then the ruler. Updated on 26 Aug: the final closed the games at 8.64 s.',
      },
      es: {
        title:
          '¿Se acabó la era de los humanos? Robots más rápidos que Bolt, más altos que Sotomayor, 97 % fabricados en China — lo que prueban los videos de Pekín, y los dos que son falsos',
        summary:
          'En 2009, Usain Bolt corrió 100 m en 9,58 s y nadie se le acercó en 17 años. El sábado 22 de agosto, en Pekín, un robot hizo la distancia en 9,39 s en una serie oficial — y hace un año el ganador de la misma prueba hacía 21,50 s. Leí los 14 posts más compartidos de la semana de los World Humanoid Robot Games 2026, descargué los 11 videos, extraje frame por frame, leí la prensa china, a los fact-checkers y el reglamento. La respuesta tiene dos mitades. La primera es sí: lo que pasó en Pekín es real, es mayor que 2025 por un orden de magnitud — 2.056 robots, 666 equipos, 16 países, cinco días — y es más impresionante de lo que cuentan las leyendas. La segunda es lo que las leyendas esconden: los 9,32 s que reposteó Elon Musk no son el número del marcador (a los 18 s del video se lee 9,39, serie 9, y el robot que ganó no es el de Honor); los dos clips más aterradores de la timeline son falsos; y la pregunta correcta para cada video no es "qué tiempo hizo" — es "quién estaba al mando". Primero los robots, después la vara. Actualizado el 26/08: la final cerró los Juegos en 8,64 s.',
      },
      it: {
        title:
          'L\'era degli umani è finita? Robot più veloci di Bolt, più in alto di Sotomayor, 97% fabbricati in Cina — cosa provano i video di Pechino, e i due che sono falsi',
        summary:
          'Nel 2009 Usain Bolt ha corso i 100 m in 9,58 s e nessuno gli si è avvicinato in 17 anni. Sabato 22 agosto, a Pechino, un robot ha coperto la distanza in 9,39 s in una batteria ufficiale — e un anno fa il vincitore della stessa gara aveva fatto 21,50 s. Ho letto i 14 post più condivisi della settimana dei World Humanoid Robot Games 2026, ho scaricato gli 11 video, ho estratto fotogramma per fotogramma, ho letto la stampa cinese, i fact-checker e il regolamento. La risposta ha due metà. La prima è sì: quello che è successo a Pechino è reale, è più grande del 2025 di un ordine di grandezza — 2.056 robot, 666 squadre, 16 paesi, cinque giorni — ed è più impressionante di quanto raccontino le didascalie. La seconda è quello che le didascalie nascondono: i 9,32 s ripostati da Elon Musk non sono il numero del tabellone (al secondo 18 del video si legge 9,39, batteria 9, e il robot che ha vinto non è quello della Honor); i due clip più spaventosi della timeline sono falsi; e la domanda giusta per ogni video non è "che tempo ha fatto" — è "chi aveva il controllo". Prima i robot, poi il metro di misura. Aggiornato il 26/08: la finale ha chiuso i Giochi in 8,64 s.',
      },
      he: {
        title:
          'עידן האדם נגמר? רובוטים מהירים יותר מיוסיין בולט, גבוהים יותר מסוטומאיור, 97% מיוצרים בסין — מה שהסרטונים מבייג\'ינג מוכיחים, והשניים המזויפים',
        summary:
          'בשנת 2009 רץ יוסיין בולט 100 מטר ב-9.58 שניות, ואיש לא התקרב לזה במשך 17 שנה. בשבת, 22 באוגוסט, בבייג\'ינג, רובוט עשה את המרחק ב-9.39 שניות במקצה רשמי — ולפני שנה המנצח באותה תחרות עשה 21.50 שניות. קראתי את 14 הפוסטים המשותפים ביותר של שבוע ה-World Humanoid Robot Games 2026, הורדתי את 11 הסרטונים, חילצתי פריים אחר פריים, קראתי את העיתונות הסינית, את ה-fact-checkers ואת התקנון. לתשובה יש שני חצאים. הראשון הוא כן: מה שקרה בבייג\'ינג אמיתי, גדול מ-2025 בסדר גודל שלם — 2,056 רובוטים, 666 קבוצות, 16 מדינות, חמישה ימים — ומרשים יותר ממה שהכיתובים מספרים. השני הוא מה שהכיתובים מסתירים: 9.32 השניות שאילון מאסק שיתף מחדש אינן המספר שעל לוח התוצאות (בשנייה 18 של הסרטון קוראים 9.39, מקצה 9, והרובוט שניצח אינו זה של Honor); שני הקליפים המפחידים ביותר בציר הזמן מזויפים; והשאלה הנכונה לכל סרטון אינה "איזה זמן הוא עשה" — אלא "מי היה בשליטה". קודם הרובוטים, אחר כך הסרגל. עודכן ב-26 באוגוסט: הגמר סגר את המשחקים ב-8.64 שניות.',
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
