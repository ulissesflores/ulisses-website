#!/usr/bin/env node
/**
 * translate-md-via-gemini.mjs
 * Translates research article Markdown files and their metadata.json
 * using the Google Gemini API.
 *
 * Usage:
 *   node --env-file=.env.local scripts/i18n/translate-md-via-gemini.mjs [options]
 *
 * Options:
 *   --locale=en         Translate to a single locale (default: all)
 *   --article=2025-lstm Translate a single article matching this substring
 *   --delay=1000        Delay between API calls in ms (default: 1000)
 *   --dry-run           Show what would be translated without calling API
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { GoogleGenerativeAI } from '@google/generative-ai';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT = path.resolve(__dirname, '../..');
const ARTICLES_DIR = path.join(ROOT, 'data/research/articles');

// ── CLI Args ─────────────────────────────────────────────────────────────────
const args = process.argv.slice(2);
const getArg = (name) => {
  const a = args.find((a) => a.startsWith(`--${name}=`));
  return a ? a.split('=').slice(1).join('=') : null;
};
const DELAY_MS = parseInt(getArg('delay') || '1000', 10);
const TARGET_LOCALE = getArg('locale');
const TARGET_ARTICLE = getArg('article');
const DRY_RUN = args.includes('--dry-run');
const MODEL = getArg('model') || 'gemini-2.5-flash';

const LOCALES = [
  { code: 'en', name: 'English' },
  { code: 'es', name: 'Spanish (Castilian)' },
  { code: 'it', name: 'Italian' },
  { code: 'he', name: 'Hebrew' },
].filter((l) => !TARGET_LOCALE || l.code === TARGET_LOCALE);

// ── API Init ─────────────────────────────────────────────────────────────────
const API_KEY = process.env.GEMINI_API_KEY;
if (!API_KEY && !DRY_RUN) {
  console.error('❌ GEMINI_API_KEY not found. Set it in .env.local');
  process.exit(1);
}
const genAI = API_KEY ? new GoogleGenerativeAI(API_KEY) : null;
const model = genAI?.getGenerativeModel({ model: MODEL });

// ── Prompts ──────────────────────────────────────────────────────────────────
const MD_SYSTEM_PROMPT = `You are a professional academic translator. Translate the following Markdown text to {LANGUAGE}.

STRICT RULES:
1. DO NOT alter any Markdown formatting, links, headers, code blocks, or LaTeX/math notations.
2. Preserve the EXACT structure: headings hierarchy, bullet points, numbered lists, tables.
3. DO NOT translate proper nouns, author names, institution names, DOI URLs, or bibliographic references.
4. DO NOT translate technical acronyms (LSTM, SRAM, PUF, XMSS, TMR, IoT, AGI).
5. Keep Harvard-style references EXACTLY as they are (author, year, URL, access date).
6. Translate abstract, body text, conclusions, recommendations, and section titles.
7. Keep the "Phase Score Summary" section EXACTLY as-is (do not translate scores or metadata).
8. Output ONLY the translated Markdown. No wrapping, no explanations, no code fences.`;

const JSON_SYSTEM_PROMPT = `You are a professional academic translator. Translate the JSON metadata below to {LANGUAGE}.

STRICT RULES:
1. Translate ONLY the values of these keys: "title", "abstract", "keywords" (array items), "description".
2. DO NOT translate: "slug", "author", "orcid", "doi", "category", "subcategory", "status", "pdf", "date", "references", URLs, proper nouns.
3. Keep the JSON structure EXACTLY intact.
4. Output ONLY valid JSON. No wrapping, no code fences, no explanations.`;

// ── Helpers ──────────────────────────────────────────────────────────────────
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const timestamp = () => new Date().toLocaleTimeString('pt-BR', { hour12: false });

async function translateText(text, language, systemPrompt, retries = 3) {
  const prompt = systemPrompt.replace(/{LANGUAGE}/g, language);
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      const result = await model.generateContent({
        contents: [{ role: 'user', parts: [{ text }] }],
        systemInstruction: { parts: [{ text: prompt }] },
        generationConfig: { temperature: 0.2, maxOutputTokens: 32768 },
      });
      let output = result.response.text();
      // Strip code fences if AI adds them
      output = output.replace(/^```(?:markdown|json|md)?\n?/i, '').replace(/\n?```$/i, '');
      return output;
    } catch (err) {
      const status = err?.status || err?.code || 'unknown';
      console.error(`  [${timestamp()}] ⚠️ Attempt ${attempt}/${retries} failed (${status}): ${err.message?.slice(0, 80)}`);
      if (attempt < retries) {
        const backoff = DELAY_MS * Math.pow(2, attempt);
        console.log(`  [${timestamp()}] 🔄 Retrying in ${backoff}ms...`);
        await sleep(backoff);
      }
    }
  }
  return null;
}

// ── Main ─────────────────────────────────────────────────────────────────────
async function main() {
  console.log(`
═══════════════════════════════════════════════════════════════
  📝 translate-md-via-gemini.mjs — Markdown Article Translator
═══════════════════════════════════════════════════════════════
`);
  console.log(`  [${timestamp()}] 🔑 Model: ${MODEL}`);
  console.log(`  [${timestamp()}] ⏱️ Delay: ${DELAY_MS}ms`);

  // Discover articles
  const entries = fs.readdirSync(ARTICLES_DIR, { withFileTypes: true })
    .filter((d) => d.isDirectory())
    .filter((d) => !TARGET_ARTICLE || d.name.includes(TARGET_ARTICLE))
    .map((d) => d.name);

  console.log(`  [${timestamp()}] 📂 Found ${entries.length} article(s)\n`);

  let success = 0;
  let failed = 0;
  let skipped = 0;

  for (const article of entries) {
    const articleDir = path.join(ARTICLES_DIR, article);
    const mdPath = path.join(articleDir, 'article.md');
    const metaPath = path.join(articleDir, 'metadata.json');

    if (!fs.existsSync(mdPath)) {
      console.log(`  ⏭️ ${article}: no article.md, skipping`);
      skipped++;
      continue;
    }

    console.log(`────────────────────────────────────────────────────────────`);
    console.log(`  📄 ${article}`);
    console.log(`────────────────────────────────────────────────────────────`);

    const mdSource = fs.readFileSync(mdPath, 'utf-8');
    const hasMeta = fs.existsSync(metaPath);
    const metaSource = hasMeta ? fs.readFileSync(metaPath, 'utf-8') : null;

    for (const locale of LOCALES) {
      const mdOutPath = path.join(articleDir, `article.${locale.code}.md`);
      const metaOutPath = path.join(articleDir, `metadata.${locale.code}.json`);

      // Skip if already translated
      if (fs.existsSync(mdOutPath)) {
        const stat = fs.statSync(mdOutPath);
        const srcStat = fs.statSync(mdPath);
        if (stat.mtimeMs > srcStat.mtimeMs) {
          console.log(`  [${timestamp()}] ⏭️ ${locale.code}: up-to-date, skipping`);
          skipped++;
          continue;
        }
      }

      if (DRY_RUN) {
        console.log(`  [${timestamp()}] 🏷️ [DRY-RUN] Would translate → ${locale.code}`);
        continue;
      }

      // Translate MD
      console.log(`  [${timestamp()}] 🔄 Translating article.md → ${locale.code}...`);
      const translatedMd = await translateText(mdSource, locale.name, MD_SYSTEM_PROMPT);
      if (translatedMd) {
        fs.writeFileSync(mdOutPath, translatedMd, 'utf-8');
        console.log(`  [${timestamp()}] 💾 Written: ${path.relative(ROOT, mdOutPath)} (${translatedMd.length} chars)`);
      } else {
        console.error(`  [${timestamp()}] ❌ Failed to translate article.md → ${locale.code}`);
        failed++;
        continue;
      }

      await sleep(DELAY_MS);

      // Translate metadata.json
      if (metaSource) {
        console.log(`  [${timestamp()}] 🔄 Translating metadata.json → ${locale.code}...`);
        const translatedMeta = await translateText(metaSource, locale.name, JSON_SYSTEM_PROMPT);
        if (translatedMeta) {
          // Validate JSON
          try {
            JSON.parse(translatedMeta);
            fs.writeFileSync(metaOutPath, translatedMeta, 'utf-8');
            console.log(`  [${timestamp()}] 💾 Written: ${path.relative(ROOT, metaOutPath)}`);
          } catch {
            console.error(`  [${timestamp()}] ⚠️ Invalid JSON for metadata.${locale.code}.json, writing raw`);
            fs.writeFileSync(metaOutPath, translatedMeta, 'utf-8');
          }
        } else {
          console.error(`  [${timestamp()}] ❌ Failed to translate metadata.json → ${locale.code}`);
        }
      }

      success++;
      await sleep(DELAY_MS);
    }
  }

  console.log(`
═══════════════════════════════════════════════════════════════
  📊 TRANSLATION SUMMARY
═══════════════════════════════════════════════════════════════
  ✅ Success:  ${success}
  ❌ Failed:   ${failed}
  ⏭️  Skipped:  ${skipped}
  📂 Articles: ${entries.length}
  🌍 Locales:  ${LOCALES.map((l) => l.code).join(', ')}
`);
}

main().catch((err) => {
  console.error('Fatal error:', err);
  process.exit(1);
});
