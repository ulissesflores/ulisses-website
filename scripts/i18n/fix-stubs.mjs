#!/usr/bin/env node
/**
 * Batch-fix genuine PT stubs in i18n dicts.
 * Uses exact string replacement to translate known untranslated strings.
 */
import { readFileSync, writeFileSync, readdirSync, existsSync } from 'fs';
import { resolve, join } from 'path';
import { fileURLToPath } from 'url';
import { TARGET_LOCALES } from '../config/i18n.config.mjs';

const __dirname = fileURLToPath(new URL('.', import.meta.url));
const ROOT = resolve(__dirname, '../..');
const I18N_DIR = join(ROOT, 'data/i18n');

// Translations for genuine PT stubs (not proper nouns/tech terms)
const TRANSLATIONS = {
  // ── Breadcrumbs / Nav labels ──
  'Acervo Teológico': { en: 'Theological Archive', es: 'Archivo Teológico', it: 'Archivio Teologico', he: 'ארכיון תיאולוגי' },
  'Clusters Temáticos': { en: 'Thematic Clusters', es: 'Clusters Temáticos', it: 'Cluster Tematici', he: 'אשכולות נושאיים' },
  'Total de clusters': { en: 'Total clusters', es: 'Total de clusters', it: 'Totale cluster', he: 'סך אשכולות' },
  'Autor': { en: 'Author', es: 'Autor', it: 'Autore', he: 'מחבר' },

  // ── Certifications ──
  'Habilidades adquiridas': { en: 'Skills acquired', es: 'Habilidades adquiridas', it: 'Competenze acquisite', he: 'מיומנויות שנרכשו' },
  'Problemas enfrentados': { en: 'Challenges addressed', es: 'Problemas enfrentados', it: 'Problemi affrontati', he: 'אתגרים שנפתרו' },
  'Consultor Estratégico de IA': { en: 'Strategic AI Consultant', es: 'Consultor Estratégico de IA', it: 'Consulente Strategico IA', he: 'יועץ אסטרטגי לבינה מלאכותית' },
  'Consultor de IA': { en: 'AI Consultant', es: 'Consultor de IA', it: 'Consulente IA', he: 'יועץ בינה מלאכותית' },
  'consultor certificado IA': { en: 'certified AI consultant', es: 'consultor certificado IA', it: 'consulente IA certificato', he: 'יועץ בינה מלאכותית מוסמך' },

  // ── Common actions ──
  'Explorar': { en: 'Explore', es: 'Explorar', it: 'Esplora', he: 'חקור' },
  'Abrir': { en: 'Open', es: 'Abrir', it: 'Apri', he: 'פתח' },
  'Verificar': { en: 'Verify', es: 'Verificar', it: 'Verifica', he: 'אמת' },
  'Idioma': { en: 'Language', es: 'Idioma', it: 'Lingua', he: 'שפה' },

  // ── Common nav descriptions ──
  'Whitepaper técnico: Hardware Soberano': { en: 'Technical Whitepaper: Sovereign Hardware', es: 'Whitepaper técnico: Hardware Soberano', it: 'Whitepaper tecnico: Hardware Sovrano', he: 'מסמך טכני: חומרה ריבונית' },
  'Landing comercial: investimento e licenciamento': { en: 'Commercial landing: investment and licensing', es: 'Landing comercial: inversión y licenciamiento', it: 'Landing commerciale: investimento e licenza', he: 'דף נחיתה מסחרי: השקעה ורישוי' },
  'Sermões por cluster temático': { en: 'Sermons by thematic cluster', es: 'Sermones por cluster temático', it: 'Sermoni per cluster tematico', he: 'דרשות לפי אשכול נושאי' },
  'Avivamento para a era digital': { en: 'Revival for the digital age', es: 'Avivamiento para la era digital', it: 'Risveglio per l\\\'era digitale', he: 'התעוררות לעידן הדיגיטלי' },
  'Artigos e análises políticas': { en: 'Political articles and analyses', es: 'Artículos y análisis políticos', it: 'Articoli e analisi politiche', he: 'מאמרים וניתוחים פוליטיים' },
  'Laboratório de cenários prospectivos': { en: 'Prospective scenario laboratory', es: 'Laboratorio de escenarios prospectivos', it: 'Laboratorio di scenari prospettici', he: 'מעבדת תרחישים עתידיים' },
  'Hub canônico de identidade soberana': { en: 'Canonical sovereign identity hub', es: 'Hub canónico de identidad soberana', it: 'Hub canonico di identità sovrana', he: 'מרכז זהות ריבונית קנוני' },
  'Credenciais e verificações': { en: 'Credentials and verifications', es: 'Credenciales y verificaciones', it: 'Credenziali e verifiche', he: 'אישורים ואימותים' },

  // ── Keywords (SEO) ──
  'acervo teológico': { en: 'theological archive', es: 'archivo teológico', it: 'archivio teologico', he: 'ארכיון תיאולוגי' },
  'clube santo': { en: 'holy club', es: 'club santo', it: 'club santo', he: 'מועדון קדוש' },
  'instituto teológico': { en: 'theological institute', es: 'instituto teológico', it: 'istituto teologico', he: 'מכון תיאולוגי' },
  'Ulisses Flores teologia': { en: 'Ulisses Flores theology', es: 'Ulisses Flores teología', it: 'Ulisses Flores teologia', he: 'Ulisses Flores תיאולוגיה' },
  'IA agricultura': { en: 'AI agriculture', es: 'IA agricultura', it: 'IA agricoltura', he: 'בינה מלאכותית חקלאות' },
  'sensores IoT': { en: 'IoT sensors', es: 'sensores IoT', it: 'sensori IoT', he: 'חיישני IoT' },

  // ── Home hero / about ──
  'Falar com Ulisses Flores →': { en: 'Talk to Ulisses Flores →', es: 'Hablar con Ulisses Flores →', it: 'Parla con Ulisses Flores →', he: 'דברו עם Ulisses Flores →' },
  'Explorar Arquivo →': { en: 'Explore Archive →', es: 'Explorar Archivo →', it: 'Esplora Archivio →', he: 'חקור ארכיון →' },
  'Explorar Simulação →': { en: 'Explore Simulation →', es: 'Explorar Simulación →', it: 'Esplora Simulazione →', he: 'חקור סימולציה →' },
};

let totalFixed = 0;

for (const locale of TARGET_LOCALES) {
  let localeFixed = 0;
  const localeDir = join(I18N_DIR, locale);

  if (!existsSync(localeDir)) continue;

  for (const file of readdirSync(localeDir).filter(f => f.endsWith('.ts'))) {
    const filePath = join(localeDir, file);
    let content = readFileSync(filePath, 'utf-8');
    let modified = false;

    for (const [ptValue, translations] of Object.entries(TRANSLATIONS)) {
      const targetTrans = translations[locale];
      if (!targetTrans || targetTrans === ptValue) continue;

      // Only replace exact single-quoted string matches
      if (content.includes(`'${ptValue}'`)) {
        content = content.replaceAll(`'${ptValue}'`, `'${targetTrans}'`);
        modified = true;
        localeFixed++;
      }
    }

    if (modified) {
      writeFileSync(filePath, content, 'utf-8');
    }
  }

  console.log(`${locale.toUpperCase()}: ${localeFixed} strings fixed`);
  totalFixed += localeFixed;
}

console.log(`\nTotal: ${totalFixed} strings fixed across all locales`);
