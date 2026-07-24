import fs from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';

const require = createRequire(import.meta.url);

const matter = require('gray-matter');

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// NOTE: this file lives in scripts/upkf/lib/ (one level deeper than the former
// scripts/upkf/generate-artifacts-v2.mjs), so repoRoot needs one more '..' than
// the original computation to still resolve to the repo root.
export const repoRoot = path.resolve(__dirname, '../../..');

export const PUBLIC_UPKF_PATH = path.join(repoRoot, 'public', 'upkf-source.md');

export const LOCAL_UPKF_PATH = path.join(repoRoot, 'data', 'upkf', 'ulisses-flores-sovereign-upkf_v3.3.md');

export const DOCS_UPKF_PATH = path.join(repoRoot, 'docs', 'ulisses-flores-sovereign-upkf_v3.3.md');

export const DEFAULT_ARTICLE_SOURCE_DIRS = [
  path.join(repoRoot, 'data', 'sources'),
  path.join(repoRoot, 'docs', 'sources'),
];

export const GENERATED_DIR = path.join(repoRoot, 'data', 'generated');

export const DOCS_DIR = path.join(repoRoot, 'docs');

export const PUBLIC_DIR = path.join(repoRoot, 'public');

export const ARTICLE_REFERENCES_PATH = path.join(repoRoot, 'data', 'upkf', 'article-references.json');

export const SERMONS_MIGRATION_PATH = path.join(repoRoot, 'data', 'seo', 'sermons-full-migration.json');

export const SERMONS_MIGRATION_TS_PATH = path.join(repoRoot, 'data', 'sermons-migration.ts');

export const ARTICLE_LONGFORM_DIR = path.join(repoRoot, 'data', 'research', 'articles');

export const CERTIFICATIONS_SOTA_PATH = path.join(repoRoot, 'data', 'seo', 'certifications.sota.json');

export const IA_2027_SOURCE_PATH = path.join(repoRoot, 'data', 'simulations', 'ia-2027.ts');

export const REQUIRED_GEO_MARKDOWN_PATHS = ['identidade.md', 'acervo-teologico.md'];

export const SOTA_JOB_TITLES = [
  'CTO',
  'Consultor Estratégico em IA',
  'Palestrante Profissional',
  'Arquiteto de Sistemas',
];

export const SOTA_KNOWS_ABOUT = [
  'Artificial Intelligence Governance',
  'Autonomous Agents Architecture',
  'Austrian Economics',
  'Web3 Sovereign Identity',
  'Complex Systems Resiliency',
];

export const SOTA_GEOGRAPHIC_SERVICES = [
  'Itupeva',
  'Jundiaí',
  'Campinas',
  'São Paulo',
  'Brazil',
  'Italy',
  'United States',
  'El Salvador',
  'Israel',
];

export const CATEGORY_METADATA = {
  research: {
    title: 'Research',
    heading: 'Research: IA, Economia e Sistemas Complexos',
    description:
      'Colecao de artigos cientificos com foco em resiliencia ciberfinanceira, modelagem quantitativa e inteligencia artificial aplicada a sistemas complexos.',
    schemaType: 'CollectionPage',
    headings: {
      en: 'Research: AI, Economics and Complex Systems',
      es: 'Investigación: IA, Economía y Sistemas Complejos',
      it: 'Ricerca: IA, Economia e Sistemi Complessi',
      he: 'מחקר: בינה מלאכותית, כלכלה ומערכות מורכבות',
    },
    descriptions: {
      en: 'Collection of scientific articles focused on cyber-financial resilience, quantitative modeling and artificial intelligence applied to complex systems.',
      es: 'Colección de artículos científicos enfocados en resiliencia ciberfinanciera, modelado cuantitativo e inteligencia artificial aplicada a sistemas complejos.',
      it: 'Collezione di articoli scientifici focalizzati sulla resilienza ciberfinanziaria, modellazione quantitativa e intelligenza artificiale applicata a sistemi complessi.',
      he: 'אוסף מאמרים מדעיים עם דגש על חוסן סייבר-פיננסי, מידול כמותי ובינה מלאכותית יישומית למערכות מורכבות.',
    },
  },
  whitepapers: {
    title: 'Whitepapers',
    heading: 'Whitepapers: Engenharia Aplicada e Arquitetura',
    description:
      'Whitepapers tecnicos sobre arquitetura de sistemas, hardware IoT, seguranca, privacidade e soberania de dados em ambientes de missao critica.',
    schemaType: 'CollectionPage',
    headings: {
      en: 'Whitepapers: Applied Engineering and Architecture',
      es: 'Whitepapers: Ingeniería Aplicada y Arquitectura',
      it: 'Whitepapers: Ingegneria Applicata e Architettura',
      he: 'מסמכים טכניים: הנדסה יישומית וארכיטקטורה',
    },
    descriptions: {
      en: 'Technical whitepapers on systems architecture, IoT hardware, security, privacy and data sovereignty in mission-critical environments.',
      es: 'Whitepapers técnicos sobre arquitectura de sistemas, hardware IoT, seguridad, privacidad y soberanía de datos en ambientes de misión crítica.',
      it: 'Whitepapers tecnici su architettura dei sistemi, hardware IoT, sicurezza, privacy e sovranità dei dati in ambienti mission-critical.',
      he: 'מסמכים טכניים על ארכיטקטורת מערכות, חומרת IoT, אבטחה, פרטיות וריבונות מידע בסביבות קריטיות.',
    },
  },
  essays: {
    title: 'Essays',
    heading: 'Essays: Teologia, Humanidades e Critica Historica',
    description:
      'Ensaios academicos com abordagem historico-critica em teologia, filosofia e fundamentos da ordem social e economica.',
    schemaType: 'CollectionPage',
    headings: {
      en: 'Essays: Theology, Humanities and Historical Criticism',
      es: 'Ensayos: Teología, Humanidades y Crítica Histórica',
      it: 'Saggi: Teologia, Umanistica e Critica Storica',
      he: 'מאמרים: תאולוגיה, מדעי הרוח וביקורת היסטורית',
    },
    descriptions: {
      en: 'Academic essays with a historical-critical approach in theology, philosophy and foundations of social and economic order.',
      es: 'Ensayos académicos con enfoque histórico-crítico en teología, filosofía y fundamentos del orden social y económico.',
      it: 'Saggi accademici con approccio storico-critico in teologia, filosofia e fondamenti dell\'ordine sociale ed economico.',
      he: 'מאמרים אקדמיים עם גישה היסטורית-ביקורתית בתאולוגיה, פילוסופיה ויסודות הסדר החברתי והכלכלי.',
    },
  },
};

export const CATEGORY_TAGS = {
  research: ['IA', 'Economia', 'Sistemas Complexos'],
  whitepapers: ['Engenharia', 'IoT', 'Seguranca'],
  essays: ['Teologia', 'Humanidades', 'Historia'],
};

export const STOPWORDS = new Set([
  'a',
  'ao',
  'aos',
  'as',
  'e',
  'de',
  'do',
  'da',
  'dos',
  'das',
  'em',
  'na',
  'no',
  'nas',
  'nos',
  'por',
  'para',
  'com',
  'sem',
  'sob',
  'sobre',
  'que',
  'um',
  'uma',
  'uns',
  'umas',
  'o',
  'os',
  'the',
  'and',
  'or',
  'in',
  'on',
  'of',
  'to',
  'for',
  'by',
  'via',
  'from',
  'is',
  'are',
  'be',
  'an',
  'at',
  'it',
  'this',
  'that',
  'as',
]);

export const NOISY_SOURCE_PATTERNS = [
  /upkf/i,
  /scientificproductions/i,
  /ulisses-flores-dados/i,
  /aboutme/i,
  /analise de json-ld/i,
  /manual de guia/i,
  /diretrizes do projeto/i,
  /dna do projeto/i,
  /prompt para artigo/i,
];

const CONTENT_DIR = path.join(repoRoot, 'content');

const CONTENT_SUBDIRS = ['publications', 'essays', 'whitepapers', 'simulations'];

function loadContentOverrides() {
  const overrides = {};
  const i18n = {};

  for (const subdir of CONTENT_SUBDIRS) {
    const dir = path.join(CONTENT_DIR, subdir);
    if (!fs.existsSync(dir)) continue;

    for (const slug of fs.readdirSync(dir, { withFileTypes: true }).filter(d => d.isDirectory()).map(d => d.name)) {
      const mdxPath = path.join(dir, slug, 'index.pt-br.mdx');
      if (!fs.existsSync(mdxPath)) continue;

      const { data } = matter(fs.readFileSync(mdxPath, 'utf8'));

      // Build topic override from frontmatter
      const topicFields = {};
      for (const key of ['focus', 'problem', 'method', 'result', 'discussion', 'application']) {
        if (data[key]) topicFields[key] = data[key];
      }
      if (data.contributions) topicFields.contributions = data.contributions;
      if (data.references) topicFields.references = data.references;

      if (Object.keys(topicFields).length > 0) {
        overrides[data.slug || slug] = topicFields;
      }

      // Build i18n from frontmatter translations
      if (data.translations) {
        const t = data.translations;
        i18n[data.slug || slug] = {
          ...(t.it ? { it: t.it } : {}),
          ...(t.he ? { he: t.he } : {}),
          ...(t.summary_en ? { summary_en: t.summary_en } : {}),
          ...(t.summary_es ? { summary_es: t.summary_es } : {}),
          ...(t.summary_it ? { summary_it: t.summary_it } : {}),
          ...(t.summary_he ? { summary_he: t.summary_he } : {}),
        };
      }
    }
  }

  return { overrides, i18n };
}

export const { overrides: SLUG_TOPIC_OVERRIDES, i18n: PUBLICATION_I18N } = loadContentOverrides();

export const BLOG_HEADLINE_I18N = {
  1: { en: 'Lula government campaign to rebuild trust in Pix: details and impacts', es: 'Campaña del gobierno Lula para reconstruir confianza en Pix: detalles e impactos', it: 'Campagna del governo Lula per ricostruire la fiducia nel Pix: dettagli e impatti', he: 'קמפיין ממשלת לולה לשיקום האמון ב-Pix: פרטים והשפעות' },
  2: { en: 'Social media conflict: content moderation vs. freedom of expression', es: 'Conflicto en redes sociales: moderación de contenido vs. libertad de expresión', it: 'Conflitto sui social media: moderazione dei contenuti vs. libertà di espressione', he: 'עימות ברשתות חברתיות: ניהול תוכן מול חופש ביטוי' },
  3: { en: "Lula's disapproval grows in Northeast Brazil: shifts in political loyalty", es: 'La desaprobación de Lula crece en el Nordeste: cambios en la lealtad política', it: 'La disapprovazione di Lula cresce nel Nordest: cambiamenti nella fedeltà politica', he: 'אי-שביעות הרצון מלולה גוברת בצפון-מזרח' },
  4: { en: "Lula's fiscal package: expectations and challenges for the Brazilian economy", es: 'Paquete fiscal de Lula: expectativas y desafíos para la economía brasileña', it: 'Pacchetto fiscale di Lula: aspettative e sfide per l\'economia brasiliana', he: 'חבילת המיסוי של לולה: ציפיות ואתגרים לכלכלה הברזילאית' },
  5: { en: 'Preservation of traditional values in the age of diversity', es: 'Preservación de valores tradicionales en la era de la diversidad', it: 'Preservazione dei valori tradizionali nell\'era della diversità', he: 'שימור ערכים מסורתיים בעידן הגיוון' },
  6: { en: 'Analysis of Trump pardon consequences and parallels with Brazil', es: 'Análisis de las consecuencias de los indultos de Trump y paralelos con Brasil', it: 'Analisi delle conseguenze dei perdoni di Trump e paralleli con il Brasile', he: 'ניתוח השלכות החנינות של טראמפ ומקבילות עם ברזיל' },
  7: { en: 'Discrepancies in Brazil: critical analysis of current economics and politics', es: 'Discrepancias en Brasil: análisis crítico de la economía y política actuales', it: 'Discrepanze in Brasile: analisi critica dell\'economia e della politica attuali', he: 'פערים בברזיל: ניתוח ביקורתי של הכלכלה והפוליטיקה הנוכחיות' },
  8: { en: 'Popular dissatisfaction grows: how a viral Instagram video exposes government spending', es: 'La insatisfacción popular crece: cómo un video viral en Instagram expone gastos gubernamentales', it: 'L\'insoddisfazione popolare cresce: come un video virale su Instagram espone le spese governative', he: 'חוסר שביעות רצון ציבורית גובר' },
  9: { en: 'Electoral reform in Brazil: need for greater transparency', es: 'Reforma electoral en Brasil: necesidad de mayor transparencia', it: 'Riforma elettorale in Brasile: necessità di maggiore trasparenza', he: 'רפורמה בבחירות בברזיל: הצורך בשקיפות רבה יותר' },
  10: { en: 'Pix monitoring: Lula government strategy against tax evasion', es: 'Fiscalización del Pix: estrategia del gobierno Lula contra la evasión fiscal', it: 'Monitoraggio del Pix: strategia del governo Lula contro l\'evasione fiscale', he: 'פיקוח על מערכת Pix: אסטרטגיית ממשלת לולה נגד העלמת מסים' },
  11: { en: 'Geopolitical impact on markets: US-China tensions and the economic future', es: 'Impacto de la geopolítica en los mercados: tensiones EE.UU.–China y el futuro económico', it: 'Impatto della geopolitica sui mercati: tensioni USA-Cina e il futuro economico', he: 'השפעת הגיאופוליטיקה על השווקים: מתחים ארה"ב-סין' },
  12: { en: 'Fighting inflation under Lula: strategies and impacts on public spending', es: 'Combate a la inflación en el gobierno Lula: estrategias e impactos en el gasto público', it: 'Lotta all\'inflazione nel governo Lula: strategie e impatti sulla spesa pubblica', he: 'מלחמה באינפלציה בממשלת לולה: אסטרטגיות והשפעות' },
  13: { en: 'Lula government confronts rising food prices: strategies and domestic impacts', es: 'Gobierno Lula confronta el alza de precios de alimentos: estrategias e impactos', it: 'Il governo Lula affronta l\'aumento dei prezzi alimentari: strategie e impatti', he: 'ממשלת לולה מתמודדת עם עליית מחירי המזון' },
  14: { en: 'Lewandowski challenges US on handcuffed deportations: impact on Brazil-US relations', es: 'Lewandowski desafía a EE.UU. sobre deportaciones esposadas', it: 'Lewandowski sfida gli USA sulle deportazioni ammanettate', he: 'לוונדובסקי מאתגר את ארה"ב בנושא גירושים באזיקים' },
  15: { en: 'Controversy in Porto Alegre: Jesus performance at Carnival reignites debate', es: 'Polémica en Porto Alegre: performance de Jesús en el Carnaval reaviva debate', it: 'Polemica a Porto Alegre: performance di Gesù al Carnevale riaccende il dibattito', he: 'מחלוקת בפורטו אלגרי: הופעת ישוע בקרנבל מחדשת ויכוח' },
  16: { en: 'Brazil-US relations: impact of Trump and Eduardo Bolsonaro on global politics', es: 'Relación Brasil-EE.UU.: impacto de Trump y Eduardo Bolsonaro en la política global', it: 'Relazioni Brasile-USA: impatto di Trump ed Eduardo Bolsonaro sulla politica globale', he: 'יחסי ברזיל-ארה"ב: השפעת טראמפ ואדוארדו בולסונארו' },
  17: { en: 'Tancredo Neves and the impact on the 40th anniversary of a democratic transition', es: 'Tancredo Neves y el impacto en el 40º aniversario de una transición democrática', it: 'Tancredo Neves e l\'impatto nel 40° anniversario di una transizione democratica', he: 'טנקרדו נבס וההשפעה ביום השנה ה-40 למעבר הדמוקרטי' },
  18: { en: 'Lula government surveillance and freedom of expression: impact on modern Brazil', es: 'Vigilancia del gobierno Lula y libertad de expresión: impacto en el Brasil moderno', it: 'Sorveglianza del governo Lula e libertà di espressione: impatto sul Brasile moderno', he: 'מעקב ממשלת לולה וחופש ביטוי: השפעה על ברזיל המודרנית' },
  19: { en: 'Current analysis: impact of historical events on contemporary politics', es: 'Análisis actual: impacto de los eventos históricos en la política contemporánea', it: 'Analisi attuale: impatto degli eventi storici sulla politica contemporanea', he: 'ניתוח עכשווי: השפעת אירועים היסטוריים על הפוליטיקה בת-זמננו' },
};
