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
  slug: 'ninguem-provou-meta-le-whatsapp',
  title:
    'Não, ninguém provou que a Meta lê o seu WhatsApp. O que eu encontrei é pior',
  summary:
    'Um advogado perdeu dez anos de conversas numa manhã e um vídeo concluiu que a Meta leu o que ele escreveu. Fui checar essa acusação nos manuais técnicos do WhatsApp de 2016 a 2026, no código do cliente, em capturas arquivadas da central de ajuda do Instagram, na decisão da Comissão Europeia de 2017 e nos autos de processos no Brasil, nos Estados Unidos e na Índia. O vídeo erra por duas razões, e a segunda enterra o argumento: banir em massa e barulhentamente é a assinatura de um classificador automático, não de quem lê — quem tem uma capacidade secreta valiosa protege a capacidade, não o caso individual. Mas o que sobra no lugar é pior. A empresa passou a definir sozinha o que conta como conversa protegida e a listar exceções que ela mesma reconhece; nenhuma observação disponível ao público distingue uma empresa que não pode ler de uma que pode e não diz; e as três escolhas que produzem essa impossibilidade — aplicativo fechado, sem build reproduzível, sem auditoria externa — são dela, e reversíveis por ela. Em 8 de maio de 2026 a Meta desligou a criptografia de ponta a ponta das mensagens do Instagram: a garantia que nos venderam como matemática sempre foi uma promessa corporativa, e promessas corporativas se revogam.',
  date: '2026-08-26',
  tags: ['criptografia', 'whatsapp', 'instagram', 'meta', 'privacidade', 'verificacao'],
},
{
  slug: 'tokens-por-dolar',
  title:
    'O gráfico viral coroa o Mac, a tabela coroa o Spark: medi 43 mil chamadas e o vencedor não é máquina nenhuma',
  summary:
    'Duas imagens virais comparam Mac Studio M5 Ultra 256 GB, RTX 5090, RTX PRO 6000 e DGX Spark em "valor por dólar" para rodar IA em casa. Fui conferir: a métrica multiplica estoque por vazão, o preço do Spark morreu em fevereiro e a PRO 6000 entrou sem hospedeiro. Depois refiz a conta que interessa — tokens por dólar contra a API do mesmo modelo — e a primeira versão dela assumia que uma pessoa usa a máquina 1 % do tempo. Medi 43.593 chamadas reais de agente de código nesta máquina: o 1 % não descreve ninguém (chat fica perto de 0,03 %; agente, entre 10 % e 30 %), 96 % da entrada é releitura de contexto, e trocar a regra de cobrança dessa releitura move a conta 16 vezes, enquanto trocar de máquina move 3,6. No único regime em que a máquina mais barata ganha (1,5x), o dia de pico dela não cabe no dia e a chamada média, de 151,9 mil tokens, não cabe no contexto do modelo. Compre por soberania, não por economia.',
  date: '2026-08-25',
  tags: ['ia', 'llm', 'hardware', 'custo', 'inferencia-local'],
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
  {
    slug: 'estatisticas-de-ia',
    title: 'Estatísticas de IA em 2026: o placar, conferido número por número',
    summary:
      'Os data centers "vão consumir mais de 1.000 TWh em 2026 — o equivalente ao Japão", repetem os compilados de estatísticas de IA. Fui conferir: a própria IEA aposentou o número; a série atual mede 485 TWh. Conferi uma a uma as estatísticas que mais circulam, na fonte primária, e o placar tem confere, meia-verdade, fóssil e zumbi — com um padrão: o denominador omitido ("53% da população" era EUA, 18-64 anos). E o degrau Brasil que nenhuma versão internacional tem: 84% dos universitários já usaram genAI, enquanto o país está fora do top-15 de investimento privado.',
    date: '2026-08-02',
    tags: ['ia', 'estatisticas', 'fact-check', 'energia', 'brasil'],
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
      'Em 2009, Usain Bolt correu 100 m em 9,58 s e ninguém chegou perto em 17 anos. No sábado, 22 de agosto, em Pequim, um robô fez a distância em 9,39 s numa bateria oficial — e há um ano o vencedor da mesma prova fazia 21,50 s. Li os 14 posts mais compartilhados da semana dos World Humanoid Robot Games 2026, baixei os 11 vídeos, extraí frame por frame, li a imprensa chinesa, os fact-checkers e o regulamento. A resposta tem duas metades. A primeira é sim: o que aconteceu em Pequim é real, é maior do que 2025 por uma ordem de grandeza — 2.056 robôs, 666 equipes, 16 países, cinco dias — e é mais impressionante do que as legendas contam. A segunda é o que as legendas escondem: o 9,32 s que o Elon Musk repostou não é o número do placar (aos 18 s do vídeo lê-se 9,39, bateria 9, e o robô que venceu não é o da Honor); os dois clipes mais assustadores da timeline são falsos; e a pergunta certa para cada vídeo não é "que tempo fez" — é "quem estava no controle". Primeiro os robôs, depois a régua.',
    date: '2026-08-24',
    tags: ['robotica', 'humanoides', 'china', 'ia', 'fact-check', 'video'],
    i18n: {
      en: {
        title:
          'Is the human era over? Robots faster than Bolt, higher than Sotomayor, 97% made in China — what the Beijing videos prove, and the two that are fake',
        summary:
          'In 2009, Usain Bolt ran 100 m in 9.58 s and nobody came close for 17 years. On Saturday, 22 August, in Beijing, a robot covered the distance in 9.39 s in an official heat — and a year ago the winner of the same event ran 21.50 s. I read the 14 most shared posts of the week of the World Humanoid Robot Games 2026, downloaded the 11 videos, pulled them apart frame by frame, read the Chinese press, the fact-checkers and the rulebook. The answer has two halves. The first is yes: what happened in Beijing is real, it is bigger than 2025 by an order of magnitude — 2,056 robots, 666 teams, 16 countries, five days — and it is more impressive than the captions say. The second is what the captions hide: the 9.32 s Elon Musk reposted is not the number on the scoreboard (18 s into the video it reads 9.39, heat 9, and the robot that won is not the Honor one); the two most frightening clips on the timeline are fake; and the right question for each video is not "what time did it run" — it is "who was in control". The robots first, then the ruler.',
      },
      es: {
        title:
          '¿Se acabó la era de los humanos? Robots más rápidos que Bolt, más altos que Sotomayor, 97 % fabricados en China — lo que prueban los videos de Pekín, y los dos que son falsos',
        summary:
          'En 2009, Usain Bolt corrió 100 m en 9,58 s y nadie se le acercó en 17 años. El sábado 22 de agosto, en Pekín, un robot hizo la distancia en 9,39 s en una serie oficial — y hace un año el ganador de la misma prueba hacía 21,50 s. Leí los 14 posts más compartidos de la semana de los World Humanoid Robot Games 2026, descargué los 11 videos, extraje frame por frame, leí la prensa china, a los fact-checkers y el reglamento. La respuesta tiene dos mitades. La primera es sí: lo que pasó en Pekín es real, es mayor que 2025 por un orden de magnitud — 2.056 robots, 666 equipos, 16 países, cinco días — y es más impresionante de lo que cuentan las leyendas. La segunda es lo que las leyendas esconden: los 9,32 s que reposteó Elon Musk no son el número del marcador (a los 18 s del video se lee 9,39, serie 9, y el robot que ganó no es el de Honor); los dos clips más aterradores de la timeline son falsos; y la pregunta correcta para cada video no es "qué tiempo hizo" — es "quién estaba al mando". Primero los robots, después la vara.',
      },
      it: {
        title:
          'L\'era degli umani è finita? Robot più veloci di Bolt, più in alto di Sotomayor, 97% fabbricati in Cina — cosa provano i video di Pechino, e i due che sono falsi',
        summary:
          'Nel 2009 Usain Bolt ha corso i 100 m in 9,58 s e nessuno gli si è avvicinato in 17 anni. Sabato 22 agosto, a Pechino, un robot ha coperto la distanza in 9,39 s in una batteria ufficiale — e un anno fa il vincitore della stessa gara aveva fatto 21,50 s. Ho letto i 14 post più condivisi della settimana dei World Humanoid Robot Games 2026, ho scaricato gli 11 video, ho estratto fotogramma per fotogramma, ho letto la stampa cinese, i fact-checker e il regolamento. La risposta ha due metà. La prima è sì: quello che è successo a Pechino è reale, è più grande del 2025 di un ordine di grandezza — 2.056 robot, 666 squadre, 16 paesi, cinque giorni — ed è più impressionante di quanto raccontino le didascalie. La seconda è quello che le didascalie nascondono: i 9,32 s ripostati da Elon Musk non sono il numero del tabellone (al secondo 18 del video si legge 9,39, batteria 9, e il robot che ha vinto non è quello della Honor); i due clip più spaventosi della timeline sono falsi; e la domanda giusta per ogni video non è "che tempo ha fatto" — è "chi aveva il controllo". Prima i robot, poi il metro di misura.',
      },
      he: {
        title:
          'עידן האדם נגמר? רובוטים מהירים יותר מיוסיין בולט, גבוהים יותר מסוטומאיור, 97% מיוצרים בסין — מה שהסרטונים מבייג\'ינג מוכיחים, והשניים המזויפים',
        summary:
          'בשנת 2009 רץ יוסיין בולט 100 מטר ב-9.58 שניות, ואיש לא התקרב לזה במשך 17 שנה. בשבת, 22 באוגוסט, בבייג\'ינג, רובוט עשה את המרחק ב-9.39 שניות במקצה רשמי — ולפני שנה המנצח באותה תחרות עשה 21.50 שניות. קראתי את 14 הפוסטים המשותפים ביותר של שבוע ה-World Humanoid Robot Games 2026, הורדתי את 11 הסרטונים, חילצתי פריים אחר פריים, קראתי את העיתונות הסינית, את ה-fact-checkers ואת התקנון. לתשובה יש שני חצאים. הראשון הוא כן: מה שקרה בבייג\'ינג אמיתי, גדול מ-2025 בסדר גודל שלם — 2,056 רובוטים, 666 קבוצות, 16 מדינות, חמישה ימים — ומרשים יותר ממה שהכיתובים מספרים. השני הוא מה שהכיתובים מסתירים: 9.32 השניות שאילון מאסק שיתף מחדש אינן המספר שעל לוח התוצאות (בשנייה 18 של הסרטון קוראים 9.39, מקצה 9, והרובוט שניצח אינו זה של Honor); שני הקליפים המפחידים ביותר בציר הזמן מזויפים; והשאלה הנכונה לכל סרטון אינה "איזה זמן הוא עשה" — אלא "מי היה בשליטה". קודם הרובוטים, אחר כך הסרגל.',
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
