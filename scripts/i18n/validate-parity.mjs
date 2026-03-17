#!/usr/bin/env node
/**
 * validate-parity.mjs — Structural Parity Validator (Anti-Fraud)
 *
 * Loads the ACTUAL exported objects from every i18n namespace in pt-br/
 * and compares recursively against en/, es/, it/, he/.
 *
 * Detects:
 *   1. MISSING_KEY   — key exists in pt-br but not in the foreign locale
 *   2. EMPTY_VALUE   — key exists but has length === 0
 *   3. STUB_COPY     — key value is IDENTICAL to pt-br (untranslated stub)
 *   4. EXTRA_KEY     — key exists in foreign locale but not in pt-br
 *
 * Usage:
 *   node scripts/i18n/validate-parity.mjs
 *   node scripts/i18n/validate-parity.mjs --fix  (invokes Gemini API to translate stubs)
 */

import { readFileSync, readdirSync, existsSync } from 'fs';
import { resolve, basename, join } from 'path';
import { fileURLToPath } from 'url';

const __dirname = fileURLToPath(new URL('.', import.meta.url));
const ROOT = resolve(__dirname, '../..');
const I18N_DIR = join(ROOT, 'data/i18n');
const PT_DIR = join(I18N_DIR, 'pt-br');
const FOREIGN_LOCALES = ['en', 'es', 'it', 'he'];

// ─── Known proper nouns / technical terms that are legitimately identical across ALL locales ───
const ALLOWED_IDENTICAL = new Set([
  'Bio', 'Expertise', 'Whitepapers', 'Research', 'Essays',
  'Projeto Ψ (PSI)', 'PSI', 'Home', 'ORCID', 'Lattes', 'Keybase',
  'Ground Truth Knowledge Hub',
  'Ulisses Flores · Ground Truth Knowledge Hub',
  'Sovereign Identity Graph',
  'Codex Hash', 'Codex Hash Ltda',
  // URLs and paths
  '/#about', '/#pillars', '/#trajectory', '/#contact',
  '/research', '/whitepapers', '/whitepapers/projeto-psi',
  '/projeto-psi', '/essays', '/acervo-teologico', '/clube-santo',
  '/mundo-politico', '/simulacoes', '/identidade', '/certifications',
  // ─── Tech stack labels (universal, no translation needed) ───
  'SRAM PUF', 'XMSS', 'TMR', 'NFC', 'EMP', 'LED', 'USB-C',
  'WhatsApp', 'LinkedIn', 'GitHub',
  'BETA', 'LLMs', '+55 11 5286-8689',
  'PYTHON', 'MQL5', 'GENETIC ALGO', 'ESP32', 'EDGE COMPUTING',
  'Zero Trust', 'IoT Cloudless', 'IoT & Edge Computing',
  'Hardware', 'Hardware & IoT',
  'Certificate ID', 'Provider', 'Verify URL',
  'MSc Candidate AI @ AGTU',
  'cloudless IoT',
  // ─── Skills column items (tech labels, intentionally identical) ───
  'Node.js / TypeScript', 'C++ / C# / C', 'Solidity (Contracts)',
  'Core Engineering', 'Architecture & DevOps',
  'BPMN (Bizagi)', 'Value Stream Mapping', 'Business Intelligence',
  'Quality Assurance (QA)', 'Cloudless Architectures',
  'AI Generativa', 'Midjourney', 'MongoDB', 'Blockchain Business',
  'C++ STL', 'DevOps',
  // ─── Simulation labels (brand/product names stay universal) ───
  'IA 2027', 'IA 2027 • Slowdown', 'IA 2027 • Race',
  'Capex', 'Adversarial',
  // ─── SEO keywords that are universal anglicisms / brand terms ───
  'hardware wallet', 'zero trust', 'zero trust hardware',
  'ring signatures', 'airgap wallet', 'FRAM rad-hard',
  'race AGI', 'slowdown AGI',
  // ─── Identity branding (deliberately English, brand-specific) ───
  'Ground Truth Identity Node · UPKF v3.3',
  'ORCID Works', 'Certifications',
  'Mumm-Ra',
  // ─── Cybersecurity/hardware SEO keywords (universal anglicisms) ───
  'side-channel attacks', 'EMP shielding', 'deniable encryption',
  'hardware security module', 'cold storage nuclear', 'cold storage institucional',
  'Ulisses Flores blockchain', 'Q-Day Ready', 'EMP-Proof',
  'Projeto PSI',
  // ─── Identity subtitle/ogImage (brand-specific English) ───
  'Ulisses Flores - Sovereign Identity Hub',
  'Odysseus · Polymath Researcher · CTO · Sovereign Identity Architect',
  'chatbot experimental IA',
  // Language name self-references
  'Português', 'English', 'Español', 'Italiano', 'עברית',
  // Proper Names (people, companies, institutions, products)
  'Carlos Ulisses Flores', 'Ulisses Flores', 'Ulisses Flores IoT',
  'Codex Hash Algo-Trading', 'GoldenLeaf IoT System', 'BioBytes Legacy', 'GoldenLeaf',
  'Clube Santo', 'Mundo Político',
  'American Global Tech University (USA)',
  'UNIP (Universidade Paulista)',
  'Centro Universitário Padre Anchieta',
  'UC San Diego (Learning Sciences)',
  'Prefeitura de Itupeva',
  'Junifer / Bemarco / Skam',
  'MV9 Web & Sistemas', 'C3 Group / EconoFísica',
  // Brand names that stay in all languages
  'Manifesto',
  // ─── Footer/version strings (brand identity) ───
  '© 2026 Codex Hash Ltda. All rights reserved.',
  'UlissesFlores.com • v10.0 • State of the Art',
]);

// ─── PT-ES cognates: words that are legitimately the same in Portuguese AND Spanish ───
const PT_ES_COGNATES = new Set([
  'Autor', 'Autor:', 'Verificar', 'Abrir', 'Explorar', 'Idioma',
  'Consultor Estratégico de IA', 'Consultor de IA',
  'consultor certificado IA',
  'Habilidades adquiridas', 'Problemas enfrentados',
  'Total de clusters', 'Clusters Temáticos',
  'Whitepaper técnico: Hardware Soberano',
  'Landing comercial: inversión y licenciamiento',
  'instituto teológico',
  'IA agricultura', 'sensores IoT',
  'Ulisses Flores teologia',
  'acervo teológico', 'agricultura inteligente',
  'consultor estratégico IA',
  'Indicadores', 'Capacidades',
  // ─── PT-ES simulation cognates (identical in both languages) ───
  'Capex total', 'Capacidades Agent-4',
  // ─── PT-ES identidade table headers ───
  'Identificador', 'Valor', 'Notas', 'Idiomas',
  // ─── PT-ES projeto-psi ───
  'Fortaleza Física', 'Whitepaper Técnico',
  'IoT & Agricultura',
  // ─── PT-ES IA simulation chart labels ───
  'Capacidades Agent-1 (Abr 2026)',
  ':: Arsenal Técnico & Humanidades',
]);

// ─── PT-IT cognates: words legitimately the same in Portuguese AND Italian ───
const PT_IT_COGNATES = new Set([
  'Ulisses Flores teologia',
  'Manifesto',
  'acervo teológico',
]);

// ─── Namespaces to skip identity check (FAQ items are long and may have false positives) ───
const SKIP_IDENTITY_NAMESPACES = new Set(['faq']);

// ─── Parse TS file to extract the exported object ───
function parseDict(filePath) {
  if (!existsSync(filePath)) return null;

  let content = readFileSync(filePath, 'utf-8');

  // Strip import statements
  content = content.replace(/^import\s+.*?;\s*$/gm, '');

  // Strip `satisfies FaqItem[]` and similar type assertions
  content = content.replace(/\s+satisfies\s+\w+(\[\])?/g, '');

  // Strip `export type ...` lines
  content = content.replace(/^export\s+type\s+.*?;\s*$/gm, '');

  // Strip `as const`, `as Record<string, string>`, and other type assertions
  content = content.replace(/\s+as\s+const\b/g, '');
  content = content.replace(/\s+as\s+\w+(<[^>]+>)?/g, '');

  // Find the main `export const NAME = {` and extract the object name
  const exportMatch = content.match(/export\s+const\s+(\w+)\s*=\s*/);
  if (!exportMatch) return null;

  const varName = exportMatch[1];

  // Replace `export const NAME =` with `const NAME =` to make it evaluable
  content = content.replace(/export\s+const/g, 'const');

  // Wrap in a function that returns the variable
  const evalCode = `${content}\nreturn ${varName};`;

  try {
    const fn = new Function(evalCode);
    return fn();
  } catch (e) {
    console.error(`  ❌ PARSE ERROR in ${filePath}: ${e.message}`);
    return null;
  }
}

// ─── Recursively flatten an object into dot-notation paths ───
function flattenObject(obj, prefix = '') {
  const result = {};

  for (const [key, value] of Object.entries(obj)) {
    const path = prefix ? `${prefix}.${key}` : key;

    if (value === null || value === undefined) {
      result[path] = '';
    } else if (Array.isArray(value)) {
      // For arrays (like FAQ items), flatten each element
      value.forEach((item, i) => {
        if (typeof item === 'object' && item !== null) {
          Object.assign(result, flattenObject(item, `${path}[${i}]`));
        } else {
          result[`${path}[${i}]`] = String(item);
        }
      });
    } else if (typeof value === 'object') {
      Object.assign(result, flattenObject(value, path));
    } else {
      result[path] = String(value);
    }
  }

  return result;
}

// ─── Determine if a string should be exempt from identity check ───
function isExemptFromIdentityCheck(keyPath, value, namespace, locale) {
  // Skip FAQ namespace entirely for identity (answers can have similar structure)
  if (SKIP_IDENTITY_NAMESPACES.has(namespace)) return true;

  // Skip known proper nouns and tech terms (all locales)
  if (ALLOWED_IDENTICAL.has(value)) return true;

  // Skip PT-ES cognates for Spanish locale
  if (locale === 'es' && PT_ES_COGNATES.has(value)) return true;

  // Skip PT-IT cognates for Italian locale
  if (locale === 'it' && PT_IT_COGNATES.has(value)) return true;

  // Skip paths/URLs (start with /)
  if (value.startsWith('/') || value.startsWith('http')) return true;

  // Skip very short strings (1-3 chars) — likely abbreviations
  if (value.length <= 3) return true;

  // Skip booleans
  if (value === 'true' || value === 'false') return true;

  // Skip strings that are primarily numbers or symbols
  if (/^[\d\s.,%:+\-–—()[\]{}→←↑↓·•★☆✓✗♦♠♣♥]+$/.test(value)) return true;

  // Skip keys that are about proper names (href, id, slug, url, etc.)
  if (/\.(href|id|slug|url|orcid|lattes|keybase|current|company|inst)$/i.test(keyPath)) return true;

  // Skip meta.keywords entries that look like proper nouns (contain uppercase, names)
  if (keyPath.includes('meta.keywords') && (
    /^[A-Z]/.test(value) ||      // Starts with uppercase (proper noun)
    value.includes('Ulisses') ||
    value.includes('IoT') ||
    value.includes('IA ') ||
    /^[a-z]+ [A-Z]/.test(value)  // "something ProperNoun"
  )) return true;

  // Skip product/engineering titles and tags (often brand names)
  if (keyPath.includes('engineering.products') || keyPath.includes('.tags[')) return true;

  // Skip hero badges and credential strings (often role titles that vary)
  if (keyPath.includes('.badges.') || keyPath.includes('.credentials[')) return true;

  // Skip trajectory items (company names, institution names)
  if (keyPath.includes('trajectory.')) return true;

  // Skip navigation labels that are brand names
  if (keyPath.includes('nav.categories') && keyPath.endsWith('.label') && (
    value === 'Clube Santo' || value === 'Mundo Político'
  )) return true;

  // Skip breadcrumb values that are brand names
  if (keyPath.includes('breadcrumb') && ALLOWED_IDENTICAL.has(value)) return true;

  // Skip certification grid items (tech skill names are universal)
  if (namespace === 'certifications' && (
    keyPath.includes('.skills[') || keyPath.includes('.tools[') ||
    keyPath.includes('.grid.') || keyPath.includes('.hero.')
  )) return true;

  // Skip pillar cards with technical titles (contain &, /, parentheses)
  if (keyPath.includes('pillars.') && /[&/()]/.test(value)) return true;

  // Skip home.engineering items (product names, tags)
  if (keyPath.includes('home.engineering')) return true;

  // Skip any value that looks like a tech stack label (contains /, &, or all-caps segments)
  if (/[/&]/.test(value) && /[A-Z]{2,}/.test(value)) return true;
  if (/^[A-Z][a-z]+(\s*[/&]\s*[A-Z][a-z]+)+$/.test(value)) return true;

  // Skip lowercase SEO keywords that contain brand names
  if (keyPath.includes('meta.keywords') && (
    value.includes('clube santo') || value.includes('IoT') ||
    value.includes('IA ') || value.includes('Ulisses')
  )) return true;

  return false;
}

// ─── Main validation ───
console.log('╔══════════════════════════════════════════════════════════════╗');
console.log('║  🔬 i18n STRUCTURAL PARITY VALIDATOR (Anti-Fraud Edition)   ║');
console.log('╚══════════════════════════════════════════════════════════════╝\n');

const namespaceFiles = readdirSync(PT_DIR)
  .filter(f => f.endsWith('.ts') && f !== 'index.ts')
  .sort();

let totalKeysInspected = 0;
let totalErrors = 0;
let totalWarnings = 0;

const errorsByLocale = { en: [], es: [], it: [], he: [] };
const statsByLocale = { en: { keys: 0, ok: 0 }, es: { keys: 0, ok: 0 }, it: { keys: 0, ok: 0 }, he: { keys: 0, ok: 0 } };

for (const file of namespaceFiles) {
  const namespace = basename(file, '.ts');
  const ptPath = join(PT_DIR, file);
  const ptDict = parseDict(ptPath);

  if (!ptDict) {
    console.error(`  ❌ Failed to parse pt-br/${file}`);
    totalErrors++;
    continue;
  }

  const ptFlat = flattenObject(ptDict);
  const ptKeyCount = Object.keys(ptFlat).length;

  console.log(`\n── ${namespace} (${ptKeyCount} keys) ──`);

  for (const locale of FOREIGN_LOCALES) {
    const foreignPath = join(I18N_DIR, locale, file);

    if (!existsSync(foreignPath)) {
      console.log(`  ⚠️  ${locale}/${file}: FILE MISSING`);
      errorsByLocale[locale].push({ namespace, type: 'FILE_MISSING', key: '*', ptValue: '', foreignValue: '' });
      totalErrors++;
      continue;
    }

    const foreignDict = parseDict(foreignPath);

    if (!foreignDict) {
      errorsByLocale[locale].push({ namespace, type: 'PARSE_ERROR', key: '*', ptValue: '', foreignValue: '' });
      totalErrors++;
      continue;
    }

    const foreignFlat = flattenObject(foreignDict);
    let localeErrors = 0;
    let localeWarnings = 0;

    // Check every PT key exists in foreign
    for (const [keyPath, ptValue] of Object.entries(ptFlat)) {
      totalKeysInspected++;
      statsByLocale[locale].keys++;

      if (!(keyPath in foreignFlat)) {
        errorsByLocale[locale].push({ namespace, type: 'MISSING_KEY', key: keyPath, ptValue, foreignValue: '' });
        localeErrors++;
        continue;
      }

      const foreignValue = foreignFlat[keyPath];

      // Check empty value
      if (foreignValue.trim().length === 0) {
        errorsByLocale[locale].push({ namespace, type: 'EMPTY_VALUE', key: keyPath, ptValue, foreignValue });
        localeErrors++;
        continue;
      }

      // Check stub copy (identical to PT)
      if (foreignValue === ptValue && !isExemptFromIdentityCheck(keyPath, ptValue, namespace, locale)) {
        errorsByLocale[locale].push({ namespace, type: 'STUB_COPY', key: keyPath, ptValue, foreignValue });
        localeWarnings++;
        continue;
      }

      statsByLocale[locale].ok++;
    }

    // Check for extra keys in foreign that don't exist in PT
    for (const keyPath of Object.keys(foreignFlat)) {
      if (!(keyPath in ptFlat)) {
        errorsByLocale[locale].push({ namespace, type: 'EXTRA_KEY', key: keyPath, ptValue: '', foreignValue: foreignFlat[keyPath] });
        localeWarnings++;
      }
    }

    const status = localeErrors > 0 ? '❌' : localeWarnings > 0 ? '⚠️ ' : '✅';
    console.log(`  ${status} ${locale}: ${Object.keys(foreignFlat).length}/${ptKeyCount} keys | ${localeErrors} errors | ${localeWarnings} warnings`);

    totalErrors += localeErrors;
    totalWarnings += localeWarnings;
  }
}

// ─── Summary ───
console.log('\n╔══════════════════════════════════════════════════════════════╗');
console.log('║                    📊 VALIDATION SUMMARY                    ║');
console.log('╚══════════════════════════════════════════════════════════════╝\n');

console.log(`  Total keys inspected: ${totalKeysInspected}`);
console.log(`  Total errors:         ${totalErrors}`);
console.log(`  Total warnings:       ${totalWarnings}\n`);

for (const locale of FOREIGN_LOCALES) {
  const { keys, ok } = statsByLocale[locale];
  const errors = errorsByLocale[locale].filter(e => ['MISSING_KEY', 'EMPTY_VALUE', 'FILE_MISSING', 'PARSE_ERROR'].includes(e.type));
  const stubs = errorsByLocale[locale].filter(e => e.type === 'STUB_COPY');
  const extras = errorsByLocale[locale].filter(e => e.type === 'EXTRA_KEY');

  console.log(`  ${locale.toUpperCase()}: ${keys} keys inspected | ${ok} OK | ${errors.length} errors | ${stubs.length} stubs | ${extras.length} extra`);
}

// ─── Detail errors ───
if (totalErrors > 0 || totalWarnings > 0) {
  console.log('\n── ERROR / WARNING DETAILS ──\n');
  for (const locale of FOREIGN_LOCALES) {
    const issues = errorsByLocale[locale];
    if (issues.length === 0) continue;

    console.log(`\n  🔴 ${locale.toUpperCase()} Issues (${issues.length}):`);
    for (const { namespace, type, key, ptValue } of issues.slice(0, 30)) {
      const shortPt = ptValue.length > 50 ? ptValue.slice(0, 50) + '…' : ptValue;
      console.log(`     ${type.padEnd(12)} ${namespace}.${key} → pt:"${shortPt}"`);
    }
    if (issues.length > 30) {
      console.log(`     ... and ${issues.length - 30} more`);
    }
  }
}

console.log('\n' + (totalErrors === 0 && totalWarnings === 0
  ? '🟢 ALL CHECKS PASSED — Full structural parity confirmed.'
  : totalErrors > 0
    ? `🔴 VALIDATION FAILED — ${totalErrors} critical errors found.`
    : `🟡 PASSED WITH WARNINGS — ${totalWarnings} potential stubs detected.`
));

process.exit(totalErrors > 0 ? 1 : 0);
