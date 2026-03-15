#!/usr/bin/env node
/**
 * ═══════════════════════════════════════════════════════════════════════════════
 *  🔄 sync-i18n.mjs — Sincronização Diferencial Contínua
 * ───────────────────────────────────────────────────────────────────────────────
 *  Script de pre-commit que detecta alterações no dicionário pt-BR e
 *  sincroniza automaticamente as traduções para EN, ES, IT e HE via
 *  Google Gemini API.
 *
 *  COMPORTAMENTO:
 *    - Roda `git diff --cached --name-only` para detectar arquivos staged
 *    - Se NENHUM arquivo em `data/i18n/pt-br/` foi alterado → exit 0 (instant)
 *    - Se houver alterações → identifica os namespaces alterados,
 *      carrega o conteúdo atualizado, envia para Gemini e atualiza os targets.
 *
 *  USO MANUAL:
 *    node scripts/i18n/sync-i18n.mjs [--force] [--namespace=common]
 *
 *  OPÇÕES:
 *    --force              Forçar sincronização mesmo sem alterações staged
 *    --namespace=home     Sincronizar apenas um namespace específico
 *    --dry-run            Simular sem escrever arquivos
 *    --delay=1000         Delay entre requisições em ms (default: 1000)
 *
 *  ⚠️  Requer: GEMINI_API_KEY no ambiente (via .env.local)
 * ═══════════════════════════════════════════════════════════════════════════════
 */

import { GoogleGenerativeAI } from '@google/generative-ai';
import { execSync } from 'node:child_process';
import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'node:fs';
import { join, dirname, basename } from 'node:path';
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

const FORCE = parsedArgs['force'] === 'true';
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
  { file: 'ia2027',          exportName: 'ia2027',         hasFaqImport: false },
  { file: 'goldenleaf',      exportName: 'goldenleaf',     hasFaqImport: false },
  { file: 'mumm-ra',         exportName: 'mummRa',         hasFaqImport: false },
  { file: 'acervo-teologico',exportName: 'acervoTeologico', hasFaqImport: false },
  { file: 'category',        exportName: 'category',       hasFaqImport: false },
];

// ── System Prompt (identical to translate-via-gemini.mjs) ───────────────────────

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
10. **For Hebrew (he):** Output correct Right-to-Left text. Hebrew characters should be used for translated content. Keep Latin-script proper nouns and technical terms in their original form.
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

  const exportMatch = raw.match(/export\s+const\s+\w+\s*=\s*(\{[\s\S]*\})\s*as\s+const;?\s*$/m);
  if (!exportMatch) {
    throw new Error(`Could not parse export from ${filePath}`);
  }

  let cleanJs = exportMatch[1]
    .replace(/\]\s+satisfies\s+FaqItem\[\]/g, ']')
    .replace(/\}\s+as\s+Record<[^>]+>,/g, '},')
    .replace(/\}\s+as\s+Record<[^>]+>/g, '}');

  try {
    const fn = new Function(`return (${cleanJs});`);
    return fn();
  } catch (evalErr) {
    throw new Error(`Failed to evaluate object from ${filePath}: ${evalErr.message}`);
  }
}

function toTsObjectLiteral(obj, indent = 2) {
  return JSON.stringify(obj, null, indent)
    .replace(/"(\w+)":/g, '$1:')
    .replace(/: "((?:[^"\\]|\\.)*)"/g, (_, val) => {
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

  if (hasFaqImport && typeof data === 'object') {
    let content = lines.join('\n');
    for (const key of Object.keys(data)) {
      if (Array.isArray(data[key])) {
        const regex = new RegExp(`(${key}:\\s*\\[(?:[^\\[\\]]|\\[(?:[^\\[\\]]|\\[[^\\[\\]]*\\])*\\])*\\])`, 'g');
        content = content.replace(regex, `$1 satisfies FaqItem[]`);
      }
    }
    return content;
  }

  return lines.join('\n');
}

async function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// ── Git Diff Detection ──────────────────────────────────────────────────────────

function getChangedPtBrNamespaces() {
  try {
    const diff = execSync('git diff --cached --name-only', { encoding: 'utf8' });
    const lines = diff.trim().split('\n').filter(Boolean);

    // Filter for files in data/i18n/pt-br/
    const ptBrFiles = lines.filter((f) => f.startsWith('data/i18n/pt-br/'));

    // Extract namespace names (filename without extension), skip index.ts
    const namespaces = ptBrFiles
      .map((f) => basename(f, '.ts'))
      .filter((n) => n !== 'index');

    return namespaces;
  } catch {
    // If git diff fails (e.g., not in a git repo), return empty
    return [];
  }
}

// ── Translation Engine ──────────────────────────────────────────────────────────

async function translateNamespace(model, sourceData, targetLang, namespaceName) {
  const inputJson = JSON.stringify(sourceData, null, 2);

  const userPrompt = `Translate the following JSON object from Brazilian Portuguese (pt-BR) to **${targetLang}**.

Remember: output ONLY the raw JSON object. No markdown, no explanations, no code blocks.

INPUT JSON:
${inputJson}`;

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

      let parsed;
      try {
        parsed = JSON.parse(responseText);
      } catch {
        const cleaned = responseText
          .replace(/^```(?:json)?\s*/i, '')
          .replace(/\s*```\s*$/i, '')
          .trim();
        parsed = JSON.parse(cleaned);
      }

      // Validate key count
      const sourceKeys = JSON.stringify(sourceData).match(/"[^"]+"\s*:/g)?.length ?? 0;
      const parsedKeys = JSON.stringify(parsed).match(/"[^"]+"\s*:/g)?.length ?? 0;
      if (Math.abs(sourceKeys - parsedKeys) > sourceKeys * 0.1) {
        throw new Error(`Key count mismatch: source=${sourceKeys}, translated=${parsedKeys}`);
      }

      return parsed;
    } catch (err) {
      lastError = err;
      const isRateLimit = err.message?.includes('429') || err.message?.includes('RESOURCE_EXHAUSTED');
      const backoffMs = isRateLimit ? 15000 * attempt : 3000 * attempt;
      log('⚠️', `  Attempt ${attempt}/${MAX_RETRIES} failed: ${err.message}. Retrying in ${backoffMs}ms…`);
      await sleep(backoffMs);
    }
  }

  throw new Error(`Failed after ${MAX_RETRIES} attempts for [${namespaceName}]: ${lastError?.message}`);
}

// ── Main ────────────────────────────────────────────────────────────────────────

async function main() {
  console.log('');
  console.log('  ═══════════════════════════════════════════════════════════════');
  console.log('   🔄 sync-i18n — Sincronização Diferencial Contínua');
  console.log('  ═══════════════════════════════════════════════════════════════');
  console.log('');

  // ── Step 1: Detect changed namespaces ────────────────────────────────────────

  let namespacesToSync;

  if (FILTER_NAMESPACE) {
    namespacesToSync = [FILTER_NAMESPACE];
    log('🎯', `Namespace filter: ${FILTER_NAMESPACE}`);
  } else if (FORCE) {
    namespacesToSync = NAMESPACE_REGISTRY.map((ns) => ns.file);
    log('🔥', `Force mode: syncing ALL ${namespacesToSync.length} namespaces`);
  } else {
    namespacesToSync = getChangedPtBrNamespaces();

    if (namespacesToSync.length === 0) {
      log('✅', 'No pt-BR dictionary changes detected in staged files. Skipping sync.');
      process.exit(0);
    }

    log('📝', `Detected ${namespacesToSync.length} changed namespace(s): ${namespacesToSync.join(', ')}`);
  }

  // ── Step 2: Validate API key ─────────────────────────────────────────────────

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    log('⚠️', 'GEMINI_API_KEY not set. Skipping translation sync (stubs will remain).');
    process.exit(0);
  }

  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({ model: MODEL_NAME });

  log('🤖', `Model: ${MODEL_NAME} | Delay: ${DELAY_MS}ms | Retries: ${MAX_RETRIES}`);

  // ── Step 3: Load and translate ───────────────────────────────────────────────

  let totalTranslations = 0;
  let totalErrors = 0;

  for (const nsFile of namespacesToSync) {
    const nsEntry = NAMESPACE_REGISTRY.find((ns) => ns.file === nsFile);
    if (!nsEntry) {
      log('⚠️', `Unknown namespace "${nsFile}" — skipping`);
      continue;
    }

    let sourceData;
    try {
      sourceData = loadSourceNamespace(nsEntry.file);
    } catch (err) {
      log('❌', `Failed to load pt-br/${nsEntry.file}.ts: ${err.message}`);
      totalErrors++;
      continue;
    }

    log('📦', `Namespace: ${nsEntry.file} (${Object.keys(sourceData).length} top-level keys)`);

    for (const locale of TARGET_LOCALES) {
      const targetDir = join(I18N_DIR, locale.code);
      const targetFile = join(targetDir, `${nsEntry.file}.ts`);

      log('🌐', `  → ${locale.code} (${locale.label})…`);

      if (DRY_RUN) {
        log('🏜️', `  [DRY-RUN] Would write to ${targetFile}`);
        totalTranslations++;
        continue;
      }

      try {
        const translated = await translateNamespace(model, sourceData, locale.label, nsEntry.file);

        if (!existsSync(targetDir)) {
          mkdirSync(targetDir, { recursive: true });
        }

        const tsContent = generateTsFile(nsEntry.file, nsEntry.exportName, translated, nsEntry.hasFaqImport);
        writeFileSync(targetFile, tsContent, 'utf8');

        log('✅', `  Written: ${locale.code}/${nsEntry.file}.ts`);
        totalTranslations++;

        // Stage the translated file for the commit
        try {
          execSync(`git add "${targetFile}"`, { encoding: 'utf8' });
        } catch {
          // Silently ignore git add failures (might not be in git context)
        }

        await sleep(DELAY_MS);
      } catch (err) {
        log('❌', `  FAILED: ${locale.code}/${nsEntry.file}.ts — ${err.message}`);
        totalErrors++;
      }
    }

    // Inter-namespace delay
    if (namespacesToSync.indexOf(nsFile) < namespacesToSync.length - 1) {
      await sleep(DELAY_MS * 2);
    }
  }

  // ── Summary ──────────────────────────────────────────────────────────────────

  console.log('');
  console.log('  ─────────────────────────────────────────────────────────────');
  log('📊', `Sync complete: ${totalTranslations} translations, ${totalErrors} errors`);
  console.log('  ─────────────────────────────────────────────────────────────');
  console.log('');

  if (totalErrors > 0) {
    log('⚠️', `${totalErrors} translation(s) failed. Commit will proceed with existing stubs.`);
  }

  // Always exit 0 — we don't want translation API failures to block commits
  process.exit(0);
}

main().catch((err) => {
  console.error('  ❌ sync-i18n fatal error:', err.message);
  // Don't block the commit even on fatal errors
  process.exit(0);
});
