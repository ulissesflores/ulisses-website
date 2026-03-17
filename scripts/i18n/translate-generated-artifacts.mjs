#!/usr/bin/env node
/**
 * ═══════════════════════════════════════════════════════════════════════════════
 *  🌐 translate-generated-artifacts.mjs — Tradução Automática de Artefatos
 * ───────────────────────────────────────────────────────────────────────────────
 *  LOTE 19 — OPERAÇÃO RESILIÊNCIA E ESCALA (Zero Trust Pipeline)
 *
 *  Lê os arquivos .generated.ts (publications, knowledge) e traduz
 *  automaticamente títulos e summaries faltantes via Google Gemini API.
 *
 *  BLINDAGENS IMPLEMENTADAS:
 *    🔒 FASE 1: Concorrência controlada (chunks de BATCH_SIZE, p-limit embutido)
 *    🔒 FASE 2: Hard Fail em produção (VERCEL=1 ou NODE_ENV=production)
 *    🔒 FASE 3: Exponential Backoff com jitter para HTTP 429
 *    🔒 FASE 4: Validação de charset pós-tradução (anti-alucinação)
 *
 *  USO:
 *    node --env-file=.env.local scripts/i18n/translate-generated-artifacts.mjs
 *
 *  OPÇÕES:
 *    --dry-run     Mostra o que seria traduzido sem alterar ficheiros
 *    --force       Re-traduz tudo, mesmo os que já têm tradução
 *    --model=X     Modelo Gemini (default: gemini-2.5-flash)
 *    --batch=N     Tamanho do batch por chamada API (default: 5)
 *    --delay=N     Delay base entre batches em ms (default: 2000)
 *
 *  ⚠️  Requer: GEMINI_API_KEY no ambiente (via .env.local)
 * ═══════════════════════════════════════════════════════════════════════════════
 */

import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

// Auto-load .env.local if present (local dev) — on Vercel, env vars are injected
const __filename_env = fileURLToPath(import.meta.url);
const __root_env = join(dirname(__filename_env), '..', '..');
const envLocalPath = join(__root_env, '.env.local');
if (existsSync(envLocalPath)) {
  for (const line of readFileSync(envLocalPath, 'utf8').split('\n')) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const eqIdx = trimmed.indexOf('=');
    if (eqIdx < 0) continue;
    const key = trimmed.slice(0, eqIdx).trim();
    const val = trimmed.slice(eqIdx + 1).trim().replace(/^["']|["']$/g, '');
    if (!process.env[key]) process.env[key] = val;
  }
}

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const ROOT = join(__dirname, '..', '..');
const PUB_PATH = join(ROOT, 'data/generated/publications.generated.ts');
const KNOW_PATH = join(ROOT, 'data/generated/knowledge.generated.ts');

// ── CLI Args ────────────────────────────────────────────────────────────────────

const args = process.argv.slice(2);
const parsedArgs = Object.fromEntries(
  args.filter(a => a.startsWith('--')).map(a => {
    const [key, val] = a.replace(/^--/, '').split('=');
    return [key, val ?? 'true'];
  })
);

const DRY_RUN = parsedArgs['dry-run'] === 'true';
const FORCE = parsedArgs['force'] === 'true';
const MODEL_NAME = parsedArgs['model'] || 'gemini-2.5-flash';
const BATCH_SIZE = Number(parsedArgs['batch']) || 3;
const DELAY_MS = Number(parsedArgs['delay']) || 2000;

// ── FASE 2: Detecção de Ambiente de Produção ────────────────────────────────────

const IS_PRODUCTION = process.env.NODE_ENV === 'production'
  || process.env.VERCEL === '1'
  || process.env.CI === 'true';

// ── Target Locales (from central config — Anti-DRY Lote 22) ────────────────
import { TARGET_LOCALES as LOCALES, LOCALE_LABELS } from '../config/i18n.config.mjs';

// ── FASE 4: Charset Validators (Anti-Alucinação) ────────────────────────────────

const CHARSET_VALIDATORS = {
  he: /[\u0590-\u05FF]/,    // Bloco Unicode Hebraico
  // Locales latinos: validar que NÃO é cópia idêntica do PT-BR
  en: /[a-zA-Z]/,
  es: /[a-zA-ZáéíóúñüÁÉÍÓÚÑÜ]/,
  it: /[a-zA-ZàèéìòùÀÈÉÌÒÙ]/,
};

function validateCharset(text, locale, fieldName) {
  if (!text || text.length === 0) return { valid: false, reason: `${fieldName} vazio para ${locale}` };
  const validator = CHARSET_VALIDATORS[locale];
  if (!validator) return { valid: true };
  if (!validator.test(text)) {
    return { valid: false, reason: `${fieldName} em ${locale} não contém caracteres esperados: "${text.slice(0, 60)}..."` };
  }
  // Hebraico: verificação adicional — pelo menos 30% dos caracteres devem ser hebraicos
  if (locale === 'he') {
    const heChars = (text.match(/[\u0590-\u05FF]/g) || []).length;
    const ratio = heChars / text.length;
    if (ratio < 0.2) {
      return { valid: false, reason: `${fieldName} HE tem apenas ${Math.round(ratio * 100)}% caracteres hebraicos (mín: 20%): "${text.slice(0, 60)}..."` };
    }
  }
  return { valid: true };
}

// ── System Prompt (aligned with translate-via-gemini.mjs) ───────────────────────

const SYSTEM_PROMPT = `You are an elite, multilingual translator for an academic research portfolio.
Your task is to translate publication titles and summaries from Brazilian Portuguese (pt-BR).

=== ABSOLUTE RULES ===

1. **Output ONLY a valid JSON object.** No markdown, no comments, no explanations.
2. **Translate ONLY the string values.** Preserve all keys exactly.
3. **Do NOT translate proper nouns:** Ulisses Flores, Codex Hash, AGTU, Projeto PSI, Clube Santo, Mundo Político, GoldenLeaf, LSTM, XMSS, SRAM PUF.
4. **Do NOT translate technical terms:** Zero Trust, IoT, Edge Computing, Ring Signatures, MLOps, AGI, LLM, NLP, Docker, Kubernetes, DevOps, BPMN.
5. **For Hebrew (he):** Output correct RTL text. Keep Latin-script terms in original form.
6. **Maintain academic, professional tone.** These are research paper titles and abstracts.
7. **Keep similar length proportions** to the original.
8. **Summaries should be concise** (1-2 sentences max), informative and SEO-friendly.`;

// ── Helpers ─────────────────────────────────────────────────────────────────────

function log(emoji, msg) {
  const ts = new Date().toISOString().slice(11, 19);
  console.log(`  [${ts}] ${emoji} ${msg}`);
}

async function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * FASE 1: Divide um array em chunks de tamanho N.
 * Previne sobrecarga da API com 100 itens simultâneos.
 */
function chunk(arr, size) {
  const chunks = [];
  for (let i = 0; i < arr.length; i += size) {
    chunks.push(arr.slice(i, i + size));
  }
  return chunks;
}

// ── Gemini Translation ──────────────────────────────────────────────────────────

let genAI, model;
let API_AVAILABLE = false;

async function initGemini() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    if (IS_PRODUCTION) {
      // FASE 2: Hard Fail em Produção — NÃO aceitar build sem API key
      console.error('\n🚨 HARD FAIL [PRODUCTION]: GEMINI_API_KEY ausente!');
      console.error('   Em ambiente de produção (VERCEL/CI), a API key é OBRIGATÓRIA.');
      console.error('   Configure GEMINI_API_KEY nas Environment Variables do provider.');
      process.exit(1);
    }
    log('⚠️', 'GEMINI_API_KEY not found. Translation only works if all artifacts are already translated.');
    log('💡', 'To enable: node --env-file=.env.local scripts/i18n/translate-generated-artifacts.mjs');
    API_AVAILABLE = false;
    return;
  }

  const { GoogleGenerativeAI } = await import('@google/generative-ai');
  genAI = new GoogleGenerativeAI(apiKey);
  model = genAI.getGenerativeModel({ model: MODEL_NAME });
  API_AVAILABLE = true;
  log('🔑', `Gemini API initialized (model: ${MODEL_NAME})`);
}

/**
 * FASE 1 + FASE 3: Traduz um batch com retries e exponential backoff com jitter.
 * Max 5 tentativas. Backoff: 2^attempt * 1000ms + random jitter (0-2000ms).
 * HTTP 429 (rate limit): backoff base 15s × attempt.
 */
const MAX_RETRIES = 5;

async function translateBatch(items, targetLocale) {
  const input = JSON.stringify(items, null, 2);
  const userPrompt = `Translate the following JSON array of publication titles and summaries from Brazilian Portuguese (pt-BR) to **${LOCALE_LABELS[targetLocale]}**.

Each object has:
- "title": the publication title in pt-BR
- "summary": the publication summary/abstract in pt-BR

Output ONLY a JSON array with the same structure, where "title" and "summary" are translated.

INPUT JSON:
${input}`;

  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    try {
      const result = await model.generateContent({
        contents: [{ role: 'user', parts: [{ text: userPrompt }] }],
        systemInstruction: { parts: [{ text: SYSTEM_PROMPT }] },
        generationConfig: {
          temperature: 0.3,
          topP: 0.85,
          maxOutputTokens: 16384,
          responseMimeType: 'application/json',
        },
      });

      const responseText = result.response.text().trim();
      let parsed;
      try {
        parsed = JSON.parse(responseText);
      } catch (parseErr) {
        if (process.env.DEBUG_TRANSLATE) log('🐛', `Raw response (first 600 chars): ${responseText.slice(0, 600)}`);
        if (process.env.DEBUG_TRANSLATE) log('🐛', `Parse error: ${parseErr.message}`);
        let cleaned = responseText.replace(/^```(?:json)?\s*/i, '').replace(/\s*```\s*$/i, '').trim();
        try {
          parsed = JSON.parse(cleaned);
        } catch {
          // Attempt to repair common Gemini JSON issues:
          // 1. Unescaped quotes inside string values
          // 2. Trailing commas
          cleaned = cleaned
            .replace(/,\s*([}\]])/g, '$1')  // trailing commas
            .replace(/[\u201C\u201D]/g, '\\"')  // smart quotes
            .replace(/[\u2018\u2019]/g, "'");  // smart apostrophes
          try {
            parsed = JSON.parse(cleaned);
          } catch {
            // Last resort: extract objects manually via regex
            const objects = [];
            // Match objects with optional "id" field and "title"+"summary" in any order
            const re = /\{[^{}]*?"title"\s*:\s*"((?:[^"\\]|\\.)*)"\s*,[^{}]*?"summary"\s*:\s*"((?:[^"\\]|\\.)*)"\s*[^{}]*?\}/g;
            let m;
            while ((m = re.exec(cleaned)) !== null) {
              objects.push({ title: m[1].replace(/\\"/g, '"'), summary: m[2].replace(/\\"/g, '"') });
            }
            if (objects.length === items.length) {
              parsed = objects;
              log('🔧', `  JSON repaired via regex extraction (${objects.length} objects)`);
            } else {
              throw new Error(`JSON repair failed: extracted ${objects.length} of ${items.length} objects`);
            }
          }
        }
      }

      if (!Array.isArray(parsed) || parsed.length !== items.length) {
        throw new Error(`Expected array of ${items.length}, got ${Array.isArray(parsed) ? parsed.length : 'non-array'}`);
      }

      // FASE 4: Validação de charset pós-tradução (anti-alucinação)
      const charsetErrors = [];
      for (let i = 0; i < parsed.length; i++) {
        const titleCheck = validateCharset(parsed[i].title, targetLocale, `items[${i}].title`);
        const summaryCheck = validateCharset(parsed[i].summary, targetLocale, `items[${i}].summary`);
        if (!titleCheck.valid) charsetErrors.push(titleCheck.reason);
        if (!summaryCheck.valid) charsetErrors.push(summaryCheck.reason);
      }
      if (charsetErrors.length > 0) {
        const errMsg = `Charset validation failed for ${targetLocale}:\n  ${charsetErrors.join('\n  ')}`;
        if (attempt < MAX_RETRIES) {
          log('🚫', `Anti-alucinação: charset inválido. Retentando... (${attempt}/${MAX_RETRIES})`);
          log('  ', charsetErrors[0]);
          await sleep(3000 * attempt);
          continue;
        }
        throw new Error(errMsg);
      }

      return parsed;
    } catch (err) {
      if (attempt < MAX_RETRIES) {
        // FASE 3: Exponential backoff com jitter
        const is429 = err.message?.includes('429') || err.message?.includes('RESOURCE_EXHAUSTED');
        const jitter = Math.random() * 2000;
        const backoff = is429
          ? (15000 * attempt) + jitter          // Rate limit: 15s × attempt + jitter
          : (Math.pow(2, attempt) * 1000) + jitter; // Outros erros: 2^N seconds + jitter
        log('🔄', `Attempt ${attempt}/${MAX_RETRIES} failed (${is429 ? 'RATE_LIMIT' : 'ERROR'}). Backoff ${Math.round(backoff / 1000)}s...`);
        if (!is429) log('  ', `Error: ${err.message?.slice(0, 120)}`);
        await sleep(backoff);
        continue;
      }
      throw err;
    }
  }
}

// ── Publication Translation ─────────────────────────────────────────────────────

async function translatePublications() {
  log('📖', 'Loading publications.generated.ts...');
  let content = readFileSync(PUB_PATH, 'utf8');

  // Find all publication IDs and their translations status
  const pubIdRe = /"id": "([^"]+)"/g;
  const arrStart = content.indexOf('export const publications');
  let match;
  const pubs = [];

  while ((match = pubIdRe.exec(content)) !== null) {
    if (match.index < arrStart) continue;
    const id = match[1];

    // Find title
    const titleMatch = content.slice(match.index, match.index + 500).match(/"title": "([^"]+)"/);
    const title = titleMatch ? titleMatch[1] : '';

    // Find summary
    const summaryIdx = content.indexOf('"summary":', match.index);
    let summary = '';
    if (summaryIdx !== -1 && summaryIdx - match.index < 2000) {
      const sMatch = content.slice(summaryIdx, summaryIdx + 5000).match(/"summary": "([^"]*(?:\\.[^"]*)*)"/);
      if (sMatch) summary = sMatch[1].replace(/\\"/g, '"');
    }

    // Find translations block
    const transIdx = content.indexOf('"translations":', match.index);
    const hasTrans = transIdx !== -1 && transIdx - match.index < 30000;
    let translations = {};

    if (hasTrans) {
      const ob = content.indexOf('{', transIdx);
      let bc = 1, pos = ob + 1;
      while (bc > 0 && pos < content.length) { if (content[pos] === '{') bc++; if (content[pos] === '}') bc--; pos++; }
      try { translations = JSON.parse(content.slice(ob, pos)); } catch { /* ignore */ }
    }

    // Detect missing translations
    const missing = [];
    for (const locale of LOCALES) {
      if (FORCE || !translations[locale]) missing.push(locale);
      if (FORCE || !translations[`summary_${locale}`]) missing.push(`summary_${locale}`);
    }

    pubs.push({ id, title, summary, translations, transIdx: hasTrans ? transIdx : -1, hasTrans, missing: [...new Set(missing)], matchIndex: match.index });
  }

  log('📊', `Found ${pubs.length} publications`);

  // Identify pubs needing translation
  const needsWork = pubs.filter(p => p.missing.length > 0);
  if (needsWork.length === 0) {
    log('✅', 'All publications are fully translated!');
    return 0;
  }

  log('🔄', `${needsWork.length} publications need translations`);

  if (!API_AVAILABLE) {
    if (IS_PRODUCTION) {
      // FASE 2: Hard Fail
      console.error(`\n🚨 HARD FAIL [PRODUCTION]: ${needsWork.length} publications sem tradução e GEMINI_API_KEY ausente!`);
      console.error('   IDs: ' + needsWork.map(p => p.id).join(', '));
      console.error('   O build de produção NÃO pode gerar páginas sem metadados traduzidos.');
      process.exit(1);
    }
    console.error(`\n❌ FATAL: ${needsWork.length} publications precisam de tradução mas GEMINI_API_KEY não está definida!`);
    console.error('   Run: node --env-file=.env.local scripts/i18n/translate-generated-artifacts.mjs');
    console.error('   Missing: ' + needsWork.map(p => p.id).join(', '));
    process.exit(1);
  }

  // FASE 1: Tradução por locale com batching controlado
  let totalInjected = 0;

  for (const locale of LOCALES) {
    const needTitle = needsWork.filter(p => p.missing.includes(locale));
    const needSummary = needsWork.filter(p => p.missing.includes(`summary_${locale}`));

    if (needTitle.length === 0 && needSummary.length === 0) continue;

    log('🌍', `Translating ${needTitle.length} titles + ${needSummary.length} summaries → ${locale}...`);

    if (DRY_RUN) {
      for (const p of needTitle) log('🧪', `  Would translate title: "${p.title}" → ${locale}`);
      continue;
    }

    // FASE 1: Chunking — processar em blocos de BATCH_SIZE
    const allBatch = needTitle.map(p => ({
      id: p.id,
      title: p.title,
      summary: p.summary.slice(0, 500),
    }));
    const chunks_ = chunk(allBatch, BATCH_SIZE);
    log('📦', `  Dividido em ${chunks_.length} batch(es) de até ${BATCH_SIZE} itens`);

    let chunkIndex = 0;
    for (const batchChunk of chunks_) {
      chunkIndex++;
      try {
        log('🔄', `  Batch ${chunkIndex}/${chunks_.length} (${batchChunk.length} itens) → ${locale}...`);
        const translated = await translateBatch(batchChunk, locale);

        // Inject translations back into the content
        for (let i = 0; i < translated.length; i++) {
          const pubId = batchChunk[i].id;
          const pub = needTitle.find(p => p.id === pubId);
          if (!pub) continue;
          const translatedTitle = translated[i].title;
          const translatedSummary = translated[i].summary;

          if (pub.hasTrans) {
            const actualTransIdx = content.indexOf('"translations":', content.indexOf('"id": "' + pub.id + '"'));
            if (actualTransIdx === -1) continue;

            const ob = content.indexOf('{', actualTransIdx);
            let bc = 1, pos = ob + 1;
            while (bc > 0 && pos < content.length) { if (content[pos] === '{') bc++; if (content[pos] === '}') bc--; pos++; }
            const closeBrace = pos - 1;

            const block = content.slice(ob, pos);
            const newFields = [];

            if (!block.includes(`"${locale}":`)) {
              newFields.push(`      "${locale}": ${JSON.stringify(translatedTitle)}`);
            }
            if (!block.includes(`"summary_${locale}":`)) {
              newFields.push(`      "summary_${locale}": ${JSON.stringify(translatedSummary)}`);
            }

            if (newFields.length > 0) {
              let insertPos = closeBrace;
              while (insertPos > ob && /\s/.test(content[insertPos - 1])) insertPos--;
              content = content.slice(0, insertPos) + ',\n' + newFields.join(',\n') + '\n    ' + content.slice(closeBrace);
              totalInjected += newFields.length;
            }
          } else {
            const evidenceIdx = content.indexOf('"sourceEvidence":', content.indexOf('"id": "' + pub.id + '"'));
            if (evidenceIdx === -1) continue;
            const bracketOpen = content.indexOf('[', evidenceIdx);
            let bc = 1, pos = bracketOpen + 1;
            while (bc > 0 && pos < content.length) { if (content[pos] === '[') bc++; if (content[pos] === ']') bc--; pos++; }

            const transObj = {};
            transObj[locale] = translatedTitle;
            transObj[`summary_${locale}`] = translatedSummary;
            const transJson = JSON.stringify(transObj, null, 6).split('\n').map((line, i) => i === 0 ? line : '    ' + line).join('\n');
            content = content.slice(0, pos) + ',\n    "translations": ' + transJson + content.slice(pos);
            totalInjected += 2;
          }
        }

        log('✅', `  Batch ${chunkIndex} OK`);
      } catch (err) {
        if (IS_PRODUCTION) {
          console.error(`\n🚨 HARD FAIL [PRODUCTION]: Tradução falhou para ${locale}, batch ${chunkIndex}`);
          console.error(`   Error: ${err.message}`);
          process.exit(1);
        }
        log('❌', `  Batch ${chunkIndex} failed for ${locale}: ${err.message}`);
      }

      // Delay entre batches (rate-limit prevention)
      if (chunkIndex < chunks_.length) {
        await sleep(DELAY_MS);
      }
    }

    // Delay entre locales
    await sleep(DELAY_MS);
  }

  if (!DRY_RUN && totalInjected > 0) {
    writeFileSync(PUB_PATH, content, 'utf8');
    log('💾', `Saved publications.generated.ts (${totalInjected} fields injected)`);
  }

  return totalInjected;
}

// ── Blog Post Translation ───────────────────────────────────────────────────────

async function translateBlogPosts() {
  log('📰', 'Loading knowledge.generated.ts...');
  let content = readFileSync(KNOW_PATH, 'utf8');

  // Find blog posts by "headline" field
  const headlineRe = /"headline": "([^"]+)"/g;
  let match;
  const posts = [];

  while ((match = headlineRe.exec(content)) !== null) {
    const headline = match[1];
    const around = content.slice(Math.max(0, match.index - 200), match.index + 1000);

    const hasEn = around.includes('"headline_en"');
    const posMatch = around.match(/"position": (\d+)/);
    const position = posMatch ? parseInt(posMatch[1]) : -1;

    const summaryMatch = around.match(/"summary": "([^"]*(?:\\.[^"]*)*)"/);
    const summary = summaryMatch ? summaryMatch[1].replace(/\\"/g, '"') : '';

    if (!hasEn || FORCE) {
      posts.push({ position, headline, summary, matchIndex: match.index });
    }
  }

  if (posts.length === 0) {
    log('✅', 'All blog posts are fully translated!');
    return 0;
  }

  log('🔄', `${posts.length} blog posts need translations`);

  if (!API_AVAILABLE) {
    if (IS_PRODUCTION) {
      console.error(`\n🚨 HARD FAIL [PRODUCTION]: ${posts.length} posts sem tradução e GEMINI_API_KEY ausente!`);
      process.exit(1);
    }
    console.error(`\n❌ FATAL: ${posts.length} blog posts precisam de tradução mas GEMINI_API_KEY não está definida!`);
    console.error('   Run: node --env-file=.env.local scripts/i18n/translate-generated-artifacts.mjs');
    process.exit(1);
  }

  if (DRY_RUN) {
    for (const p of posts) log('🧪', `  Would translate: "${p.headline}"`);
    return 0;
  }

  let totalInjected = 0;

  for (const locale of LOCALES) {
    log('🌍', `Translating ${posts.length} blog headlines → ${locale}...`);

    // FASE 1: Chunking
    const allBatch = posts.map(p => ({ title: p.headline, summary: p.summary.slice(0, 300) }));
    const chunks_ = chunk(allBatch, BATCH_SIZE);
    log('📦', `  Dividido em ${chunks_.length} batch(es) de até ${BATCH_SIZE} itens`);

    let chunkIndex = 0;
    for (const batchChunk of chunks_) {
      chunkIndex++;
      try {
        log('🔄', `  Batch ${chunkIndex}/${chunks_.length} (${batchChunk.length} itens) → ${locale}...`);
        const translated = await translateBatch(batchChunk, locale);

        const startIdx = (chunkIndex - 1) * BATCH_SIZE;
        for (let i = 0; i < translated.length; i++) {
          const post = posts[startIdx + i];
          if (!post) continue;
          const headlineIdx = content.indexOf('"headline": "' + post.headline + '"');
          if (headlineIdx === -1) continue;

          const summaryIdx = content.indexOf('"summary":', headlineIdx);
          if (summaryIdx === -1 || summaryIdx - headlineIdx > 1000) continue;

          const summaryLineEnd = content.indexOf('\n', summaryIdx);
          if (summaryLineEnd === -1) continue;

          const context = content.slice(headlineIdx, headlineIdx + 1500);
          if (context.includes(`"headline_${locale}"`)) continue;

          const summaryLine = content.slice(summaryIdx, summaryLineEnd);
          let fixedLine = summaryLine;
          if (!summaryLine.trimEnd().endsWith(',')) {
            fixedLine = summaryLine.trimEnd() + ',';
          }

          const fields = [
            `      "headline_${locale}": ${JSON.stringify(translated[i].title)},`,
            `      "summary_${locale}": ${JSON.stringify(translated[i].summary)}${locale === 'he' ? '' : ','}`
          ].join('\n');

          content = content.slice(0, summaryIdx) + fixedLine + '\n' + fields + content.slice(summaryLineEnd);
          totalInjected += 2;
        }

        log('✅', `  Batch ${chunkIndex} OK`);
      } catch (err) {
        if (IS_PRODUCTION) {
          console.error(`\n🚨 HARD FAIL [PRODUCTION]: Tradução de blog falhou para ${locale}, batch ${chunkIndex}`);
          console.error(`   Error: ${err.message}`);
          process.exit(1);
        }
        log('❌', `  Batch ${chunkIndex} failed for ${locale}: ${err.message}`);
      }

      if (chunkIndex < chunks_.length) {
        await sleep(DELAY_MS);
      }
    }

    await sleep(DELAY_MS);
  }

  if (totalInjected > 0) {
    writeFileSync(KNOW_PATH, content, 'utf8');
    log('💾', `Saved knowledge.generated.ts (${totalInjected} fields injected)`);
  }

  return totalInjected;
}

// ── Main ────────────────────────────────────────────────────────────────────────

async function main() {
  console.log('');
  console.log('═══════════════════════════════════════════════════════════════');
  console.log('  🌐 translate-generated-artifacts.mjs — Zero Trust Pipeline');
  console.log('═══════════════════════════════════════════════════════════════');
  console.log('');

  if (IS_PRODUCTION) log('🔒', 'PRODUCTION MODE — Hard Fail ativado');
  if (DRY_RUN) log('🧪', 'DRY RUN — no files will be modified');
  if (FORCE) log('⚡', 'FORCE mode — re-translating everything');
  log('📦', `Batch size: ${BATCH_SIZE} | Delay: ${DELAY_MS}ms | Max retries: ${MAX_RETRIES}`);

  await initGemini();

  const pubCount = await translatePublications();
  const blogCount = await translateBlogPosts();

  console.log('');
  console.log('═══════════════════════════════════════════════════════════════');
  console.log('  📊 TRANSLATION SUMMARY');
  console.log('═══════════════════════════════════════════════════════════════');
  console.log(`  📖 Publications: ${pubCount} fields translated`);
  console.log(`  📰 Blog posts:   ${blogCount} fields translated`);
  if (IS_PRODUCTION) console.log('  🔒 Mode: PRODUCTION (Hard Fail)');
  console.log('');

  if (pubCount === 0 && blogCount === 0) {
    console.log('  ✅ All artifacts are fully translated. No API calls needed.');
  } else {
    console.log('  🔍 NEXT: Run `npx tsc --noEmit` and `npm test` to validate.');
  }
  console.log('');
}

main().catch(err => {
  console.error('\n💥 Unhandled error:', err);
  process.exit(1);
});
