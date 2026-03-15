#!/usr/bin/env node
/**
 * ═══════════════════════════════════════════════════════════════════════════════
 *  🌐 translate-via-gemini.mjs — Lote 4: A Máquina de Tradução
 * ───────────────────────────────────────────────────────────────────────────────
 *  Motor de tradução automatizada via Google Gemini API.
 *
 *  Lê o dicionário "gabarito" pt-BR, envia namespace por namespace
 *  para a API Gemini com rate-limiting explícito, e gera arquivos .ts
 *  tipados para cada locale alvo.
 *
 *  USO:
 *    GEMINI_API_KEY=<sua-chave> node scripts/i18n/translate-via-gemini.mjs
 *
 *  OPÇÕES:
 *    --locale=en          Traduzir apenas um locale específico
 *    --namespace=home     Traduzir apenas um namespace específico
 *    --dry-run            Simular sem escrever arquivos
 *    --delay=5000         Delay entre requisições em ms (default: 4000)
 *
 *  ⚠️  Requer: GEMINI_API_KEY no ambiente
 *  ⚠️  Rate Limit: 15 RPM (free tier). O script serializa requisições.
 * ═══════════════════════════════════════════════════════════════════════════════
 */

import { GoogleGenerativeAI } from '@google/generative-ai';
import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

// ── Paths ───────────────────────────────────────────────────────────────────────

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const ROOT = join(__dirname, '..', '..');
const I18N_DIR = join(ROOT, 'data', 'i18n');
const PT_BR_DIR = join(I18N_DIR, 'pt-br');

// ── CLI Args ────────────────────────────────────────────────────────────────────

const args = process.argv.slice(2);
const parsedArgs = Object.fromEntries(
  args
    .filter((a) => a.startsWith('--'))
    .map((a) => {
      const [key, val] = a.replace(/^--/, '').split('=');
      return [key, val ?? 'true'];
    }),
);

const FILTER_LOCALE = parsedArgs['locale'] || null;
const FILTER_NAMESPACE = parsedArgs['namespace'] || null;
const DRY_RUN = parsedArgs['dry-run'] === 'true';
const DELAY_MS = Number(parsedArgs['delay']) || 1000;
const MODEL_NAME = parsedArgs['model'] || 'gemini-2.5-flash';
const MAX_RETRIES = Number(parsedArgs['retries']) || 3;

// ── Target Locales ──────────────────────────────────────────────────────────────

const TARGET_LOCALES = [
  { code: 'en', label: 'English', dir: 'ltr' },
  { code: 'es', label: 'Spanish (Castilian)', dir: 'ltr' },
  { code: 'it', label: 'Italian', dir: 'ltr' },
  { code: 'he', label: 'Hebrew', dir: 'rtl' },
];

// ── Namespace Registry ──────────────────────────────────────────────────────────
// Maps filename → export name, matching the pt-br/index.ts barrel exports

const NAMESPACE_REGISTRY = [
  { file: 'common',          exportName: 'common',         hasFaqImport: false },
  { file: 'home',            exportName: 'home',           hasFaqImport: false },
  { file: 'clube-santo',     exportName: 'clubeSanto',     hasFaqImport: false },
  { file: 'mundo-politico',  exportName: 'mundoPolitico',  hasFaqImport: false },
  { file: 'projeto-psi',     exportName: 'projetoPsi',     hasFaqImport: false },
  { file: 'simulacoes',      exportName: 'simulacoes',     hasFaqImport: false },
  { file: 'identidade',      exportName: 'identidade',     hasFaqImport: false },
  { file: 'certifications',  exportName: 'certifications', hasFaqImport: false },
  { file: 'faq',             exportName: 'faq',            hasFaqImport: true  },
];

// ── System Prompt ───────────────────────────────────────────────────────────────

const SYSTEM_PROMPT = `You are an elite, multilingual translator for a software project.
Your task is to translate a JSON object from Brazilian Portuguese (pt-BR) to a target language.

=== ABSOLUTE RULES ===

1. **Output ONLY a valid JSON object.** No markdown code blocks (\`\`\`json), no comments, no explanations. Just the raw JSON string.
2. **Preserve EVERY key exactly.** The output JSON MUST have the EXACT same key structure and nesting as the input. Do not add, remove, rename, or reorder any keys.
3. **Translate ONLY the string values.** Do not modify numbers, booleans, nulls, or arrays of non-string items.
4. **Do NOT translate the following proper nouns:** Ulisses Flores, Carlos Ulisses Flores, Codex Hash, AGTU, Projeto PSI, Clube Santo, Mundo Político, GoldenLeaf, Mumm-Ra, ThunderCats, UPKF, ORCID, Lattes, Keybase, Gitcoin Passport, DID, FIAP, Alura, Coursera, edX.
5. **Do NOT translate technical terms:** JSON-LD, Zero Trust, SRAM PUF, XMSS, EMP, TMR, NFC, BPMN, CI/CD, API, SDK, REST, GraphQL, Docker, Kubernetes, DevOps, Scrum, Kanban, MLOps, AGI, LLM, NLP, IoT, Edge Computing.
6. **Do NOT translate URLs, email addresses, file paths, or schema identifiers.**
7. **Do NOT translate emoji characters.** Keep them exactly as they appear.
8. **Do NOT translate the string "→" (arrow symbol).**
9. **Adapt idioms and cultural references naturally** for the target language. Do not do literal word-by-word translation.
10. **For Hebrew (he):** Output correct Right-to-Left text. Hebrew characters should be used for translated content. Keep Latin-script proper nouns and technical terms in their original form. The overall string value should read naturally in Hebrew.
11. **Maintain the same tone and register** as the original text (professional, academic, authoritative).
12. **Preserve HTML entities** if any exist in the source strings (e.g., &amp;).
13. **Keep the same string length proportions.** Do not make translations dramatically shorter or longer than the original.`;

// ── Helpers ─────────────────────────────────────────────────────────────────────

function log(emoji, msg) {
  const ts = new Date().toISOString().slice(11, 19);
  console.log(`  [${ts}] ${emoji} ${msg}`);
}

function loadSourceNamespace(file) {
  const filePath = join(PT_BR_DIR, `${file}.ts`);
  const raw = readFileSync(filePath, 'utf8');

  // Extract the object between the first { and the last } before 'as const;'
  // We need to handle the special case of faq.ts which has import at top
  const exportMatch = raw.match(/export\s+const\s+\w+\s*=\s*(\{[\s\S]*\})\s*as\s+const;?\s*$/m);
  if (!exportMatch) {
    throw new Error(`Could not parse export from ${filePath}`);
  }

  let objectStr = exportMatch[1];

  // Remove TypeScript-specific syntax that isn't valid JSON:
  // - 'satisfies FaqItem[]' annotations
  objectStr = objectStr.replace(/\]\s+satisfies\s+FaqItem\[\]/g, ']');

  // Convert the TS object literal to valid JSON:
  // 1. Remove trailing commas before } or ]
  objectStr = objectStr.replace(/,(\s*[}\]])/g, '$1');

  // 2. Quote unquoted keys (word characters followed by colon)
  objectStr = objectStr.replace(/(?<=[{,]\s*)(\w+)\s*:/g, '"$1":');

  // 3. Replace single quotes with double quotes for string values
  // This is tricky — we need TS → JSON string conversion.
  // Strategy: use eval-like approach with a safe transform.
  // Actually, let's use a different approach: dynamically evaluate the TS module.

  // Since this is an .mjs script and the source is .ts, let's read raw and
  // use a more robust extraction: parse the values using Function constructor
  // with the raw JS object literal (minus TS annotations + as const).

  // Clean the object literal to pure JS:
  let cleanJs = exportMatch[1]
    .replace(/\]\s+satisfies\s+FaqItem\[\]/g, ']')       // remove satisfies
    .replace(/\}\s+as\s+Record<[^>]+>,/g, '},')          // remove inline `as Record<...>,`
    .replace(/\}\s+as\s+Record<[^>]+>/g, '}');            // remove inline `as Record<...>` (no trailing comma)

  // Use Function constructor to safely evaluate the object literal
  try {
    const fn = new Function(`return (${cleanJs});`);
    return fn();
  } catch (evalErr) {
    throw new Error(`Failed to evaluate object from ${filePath}: ${evalErr.message}`);
  }
}

/**
 * Serialize a JS object to a pretty-printed JSON-like string
 * but with single quotes (TS style) and unquoted keys.
 */
function toTsObjectLiteral(obj, indent = 2) {
  return JSON.stringify(obj, null, indent)
    // Unquote simple keys (valid JS identifiers)
    .replace(/"(\w+)":/g, '$1:')
    // Replace double-quoted values with single-quoted values
    // (but handle escaped quotes and apostrophes carefully)
    .replace(/: "((?:[^"\\]|\\.)*)"/g, (_, val) => {
      // Unescape double-quote escapes, re-escape single quotes
      const unescaped = val.replace(/\\"/g, '"');
      const singleEscaped = unescaped.replace(/(?<!\\)'/g, "\\'");
      return `: '${singleEscaped}'`;
    });
}

function generateTsFile(namespace, exportName, data, hasFaqImport) {
  const objStr = toTsObjectLiteral(data);

  const lines = [];

  if (hasFaqImport) {
    lines.push("import type { FaqItem } from '@/components/faq-section';");
    lines.push('');
  }

  lines.push(`export const ${exportName} = ${objStr} as const;`);
  lines.push('');

  // For the faq namespace, we need to add 'satisfies FaqItem[]' to each top-level array
  if (hasFaqImport && typeof data === 'object') {
    let content = lines.join('\n');
    // Add satisfies after each closing bracket of top-level arrays
    // Pattern: find array values at the top level of the faq object
    for (const key of Object.keys(data)) {
      if (Array.isArray(data[key])) {
        // Replace the closing bracket of this array with the satisfies annotation
        // Look for the pattern:  key: [...\n  ]
        const regex = new RegExp(`(${key}:\\s*\\[(?:[^\\[\\]]|\\[(?:[^\\[\\]]|\\[[^\\[\\]]*\\])*\\])*\\])`, 'g');
        content = content.replace(regex, `$1 satisfies FaqItem[]`);
      }
    }
    return content;
  }

  return lines.join('\n');
}

function generateIndexTs(locale) {
  const importLines = NAMESPACE_REGISTRY.map(
    (ns) => `import { ${ns.exportName} } from './${ns.file}';`,
  );

  const body = `${importLines.join('\n')}

const dict = {
  common,
  home,
  clubeSanto,
  mundoPolitico,
  projetoPsi,
  simulacoes,
  identidade,
  certifications,
  faq,
};

export default dict;
`;

  return body;
}

async function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// ── Translation Engine ──────────────────────────────────────────────────────────

async function translateNamespace(model, sourceData, targetLang, namespaceName) {
  const inputJson = JSON.stringify(sourceData, null, 2);

  const userPrompt = `Translate the following JSON object from Brazilian Portuguese (pt-BR) to **${targetLang}**.

Remember: output ONLY the raw JSON object. No markdown, no explanations, no code blocks.

INPUT JSON:
${inputJson}`;

  // Retry loop with exponential backoff
  let lastError;
  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    try {
      const result = await model.generateContent({
        contents: [{ role: 'user', parts: [{ text: userPrompt }] }],
        systemInstruction: { parts: [{ text: SYSTEM_PROMPT }] },
        generationConfig: {
          temperature: 0.3,
          topP: 0.85,
          maxOutputTokens: 65536,
          responseMimeType: 'application/json',
        },
      });

      const responseText = result.response.text().trim();

      // Attempt to parse the response as JSON
      let parsed;
      try {
        parsed = JSON.parse(responseText);
      } catch (parseErr) {
        // Sometimes the model wraps in ```json ... ```, strip it
        const cleaned = responseText
          .replace(/^```(?:json)?\s*/i, '')
          .replace(/\s*```\s*$/i, '')
          .trim();

        try {
          parsed = JSON.parse(cleaned);
        } catch (secondErr) {
          throw new Error(
            `JSON parse failed for namespace "${namespaceName}": ${secondErr.message}\n` +
            `--- RAW RESPONSE (first 500 chars) ---\n${responseText.slice(0, 500)}`,
          );
        }
      }

      // Validate key structure (top-level keys must match)
      const sourceKeys = Object.keys(sourceData).sort();
      const parsedKeys = Object.keys(parsed).sort();

      if (JSON.stringify(sourceKeys) !== JSON.stringify(parsedKeys)) {
        const missing = sourceKeys.filter((k) => !parsedKeys.includes(k));
        const extra = parsedKeys.filter((k) => !sourceKeys.includes(k));
        log('⚠️', `Key mismatch in "${namespaceName}": missing=[${missing}] extra=[${extra}]`);
      }

      return parsed;
    } catch (err) {
      lastError = err;
      const msg = err.message || '';

      // Check if it's a 429 rate limit error
      if (msg.includes('429') || msg.includes('Too Many Requests') || msg.includes('quota')) {
        // Extract retryDelay from the error message if available
        const retryMatch = msg.match(/retry in ([\d.]+)s/i);
        const suggestedDelay = retryMatch ? Math.ceil(parseFloat(retryMatch[1])) * 1000 : 0;
        const backoffMs = Math.max(suggestedDelay, 15000 * attempt);

        if (attempt < MAX_RETRIES) {
          log('🔄', `Rate limited (attempt ${attempt}/${MAX_RETRIES}). Waiting ${Math.round(backoffMs / 1000)}s...`);
          await sleep(backoffMs);
          continue;
        }
      }

      // Non-retryable error or max retries exhausted
      if (attempt < MAX_RETRIES) {
        log('⚠️', `Attempt ${attempt}/${MAX_RETRIES} failed: ${msg.slice(0, 100)}. Retrying...`);
        await sleep(5000 * attempt);
        continue;
      }
    }
  }

  throw lastError;
}

// ── Main ────────────────────────────────────────────────────────────────────────

async function main() {
  console.log('');
  console.log('═══════════════════════════════════════════════════════════════');
  console.log('  🌐 translate-via-gemini.mjs — Lote 4: A Máquina de Tradução');
  console.log('═══════════════════════════════════════════════════════════════');
  console.log('');

  // ── Validate API key ──
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.error('❌ GEMINI_API_KEY not found in environment variables.');
    console.error('   Usage: GEMINI_API_KEY=<key> node scripts/i18n/translate-via-gemini.mjs');
    process.exit(1);
  }

  // ── Initialize Gemini ──
  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({ model: MODEL_NAME });

  log('🔑', `Gemini API initialized (model: ${MODEL_NAME})`);
  log('⏱️', `Delay between requests: ${DELAY_MS}ms`);
  if (DRY_RUN) log('🧪', 'DRY RUN — no files will be written');
  if (FILTER_LOCALE) log('🎯', `Filtering locale: ${FILTER_LOCALE}`);
  if (FILTER_NAMESPACE) log('🎯', `Filtering namespace: ${FILTER_NAMESPACE}`);

  // ── Load source (pt-BR) namespaces ──
  console.log('\n📦 Loading pt-BR source namespaces...');
  const sourceNamespaces = new Map();

  for (const ns of NAMESPACE_REGISTRY) {
    if (FILTER_NAMESPACE && ns.file !== FILTER_NAMESPACE) continue;

    try {
      const data = loadSourceNamespace(ns.file);
      sourceNamespaces.set(ns.file, data);
      const keyCount = typeof data === 'object' ? Object.keys(data).length : 0;
      log('✅', `Loaded "${ns.file}" (${keyCount} top-level keys)`);
    } catch (err) {
      log('❌', `Failed to load "${ns.file}": ${err.message}`);
      process.exit(1);
    }
  }

  // ── Translation Loop ──
  const results = { success: 0, failed: 0, skipped: 0, errors: [] };

  const locales = FILTER_LOCALE
    ? TARGET_LOCALES.filter((l) => l.code === FILTER_LOCALE)
    : TARGET_LOCALES;

  if (locales.length === 0) {
    console.error(`❌ Unknown locale: ${FILTER_LOCALE}`);
    process.exit(1);
  }

  for (const locale of locales) {
    console.log(`\n${'─'.repeat(60)}`);
    console.log(`  🌍 Translating to: ${locale.label} (${locale.code}) [dir: ${locale.dir}]`);
    console.log(`${'─'.repeat(60)}`);

    const localeDir = join(I18N_DIR, locale.code);
    if (!existsSync(localeDir)) {
      mkdirSync(localeDir, { recursive: true });
      log('📁', `Created directory: data/i18n/${locale.code}/`);
    }

    const namespaces = FILTER_NAMESPACE
      ? NAMESPACE_REGISTRY.filter((ns) => ns.file === FILTER_NAMESPACE)
      : NAMESPACE_REGISTRY;

    for (let i = 0; i < namespaces.length; i++) {
      const ns = namespaces[i];
      const sourceData = sourceNamespaces.get(ns.file);
      if (!sourceData) {
        log('⏭️', `Skipping "${ns.file}" — not loaded`);
        results.skipped++;
        continue;
      }

      log('🔄', `[${i + 1}/${namespaces.length}] Translating "${ns.file}" → ${locale.code}...`);

      try {
        const translated = await translateNamespace(model, sourceData, locale.label, ns.file);

        // ── Generate .ts file ──
        const tsContent = generateTsFile(ns.file, ns.exportName, translated, ns.hasFaqImport);
        const outPath = join(localeDir, `${ns.file}.ts`);

        if (DRY_RUN) {
          log('🧪', `Would write: data/i18n/${locale.code}/${ns.file}.ts (${tsContent.length} chars)`);
        } else {
          writeFileSync(outPath, tsContent, 'utf8');
          log('💾', `Written: data/i18n/${locale.code}/${ns.file}.ts (${tsContent.length} chars)`);
        }

        results.success++;
      } catch (err) {
        log('❌', `FAILED "${ns.file}" → ${locale.code}: ${err.message}`);
        results.errors.push({ locale: locale.code, namespace: ns.file, error: err.message });
        results.failed++;
        // Continue with next namespace — don't crash the whole run
      }

      // ── Rate limiting delay ──
      if (i < namespaces.length - 1) {
        log('⏳', `Rate-limit: waiting ${DELAY_MS}ms...`);
        await sleep(DELAY_MS);
      }
    }

    // ── Generate index.ts for this locale ──
    const indexContent = generateIndexTs(locale.code);
    const indexPath = join(localeDir, 'index.ts');

    if (DRY_RUN) {
      log('🧪', `Would write: data/i18n/${locale.code}/index.ts`);
    } else {
      writeFileSync(indexPath, indexContent, 'utf8');
      log('📋', `Written: data/i18n/${locale.code}/index.ts`);
    }

    // ── Delay between locales ──
    const nextLocale = locales[locales.indexOf(locale) + 1];
    if (nextLocale) {
      log('🌐', `Finished ${locale.code}. Cooling down before ${nextLocale.code}...`);
      await sleep(DELAY_MS * 2);
    }
  }

  // ── Summary ──
  console.log('\n═══════════════════════════════════════════════════════════════');
  console.log('  📊 TRANSLATION SUMMARY');
  console.log('═══════════════════════════════════════════════════════════════');
  console.log(`  ✅ Success:  ${results.success}`);
  console.log(`  ❌ Failed:   ${results.failed}`);
  console.log(`  ⏭️  Skipped:  ${results.skipped}`);

  if (results.errors.length > 0) {
    console.log('\n  ⚠️  Errors:');
    for (const err of results.errors) {
      console.log(`    • [${err.locale}/${err.namespace}]: ${err.error.slice(0, 120)}`);
    }
  }

  console.log('');

  if (results.failed > 0) {
    console.log('  💡 TIP: Re-run with --locale=<code> --namespace=<name> to retry failed items.');
  }

  if (!DRY_RUN && results.success > 0) {
    console.log('  🔍 NEXT STEP: Run `npx tsc --noEmit` to validate generated types.');
  }

  console.log('');

  process.exit(results.failed > 0 ? 1 : 0);
}

main().catch((err) => {
  console.error('\n💥 Unhandled error:', err);
  process.exit(1);
});
