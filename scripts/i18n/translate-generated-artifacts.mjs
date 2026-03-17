#!/usr/bin/env node
/**
 * ═══════════════════════════════════════════════════════════════════════════════
 *  🌐 translate-generated-artifacts.mjs — Tradução Automática de Artefatos
 * ───────────────────────────────────────────────────────────────────────────────
 *  Lê os arquivos .generated.ts (publications, knowledge) e traduz
 *  automaticamente títulos e summaries faltantes via Google Gemini API.
 *
 *  USO:
 *    node --env-file=.env.local scripts/i18n/translate-generated-artifacts.mjs
 *
 *  OPÇÕES:
 *    --dry-run     Mostra o que seria traduzido sem alterar ficheiros
 *    --force       Re-traduz tudo, mesmo os que já têm tradução
 *    --model=X     Modelo Gemini (default: gemini-2.5-flash)
 *
 *  ⚠️  Requer: GEMINI_API_KEY no ambiente (via .env.local)
 *  Integra-se como etapa pós-geração: npm run upkf:generate && npm run i18n:artifacts
 * ═══════════════════════════════════════════════════════════════════════════════
 */

import { readFileSync, writeFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

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
const DELAY_MS = Number(parsedArgs['delay']) || 2000;

// ── Target Locales ──────────────────────────────────────────────────────────────

const LOCALES = ['en', 'es', 'it', 'he'];
const LOCALE_LABELS = { en: 'English', es: 'Spanish', it: 'Italian', he: 'Hebrew' };

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

// ── Gemini Translation ──────────────────────────────────────────────────────────

let genAI, model;

async function initGemini() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.error('❌ GEMINI_API_KEY not found. Use: node --env-file=.env.local scripts/i18n/translate-generated-artifacts.mjs');
    process.exit(1);
  }

  const { GoogleGenerativeAI } = await import('@google/generative-ai');
  genAI = new GoogleGenerativeAI(apiKey);
  model = genAI.getGenerativeModel({ model: MODEL_NAME });
  log('🔑', `Gemini API initialized (model: ${MODEL_NAME})`);
}

async function translateBatch(items, targetLocale) {
  const input = JSON.stringify(items, null, 2);
  const userPrompt = `Translate the following JSON array of publication titles and summaries from Brazilian Portuguese (pt-BR) to **${LOCALE_LABELS[targetLocale]}**.

Each object has:
- "title": the publication title in pt-BR
- "summary": the publication summary/abstract in pt-BR

Output ONLY a JSON array with the same structure, where "title" and "summary" are translated.

INPUT JSON:
${input}`;

  for (let attempt = 1; attempt <= 3; attempt++) {
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
      } catch {
        const cleaned = responseText.replace(/^```(?:json)?\s*/i, '').replace(/\s*```\s*$/i, '').trim();
        parsed = JSON.parse(cleaned);
      }

      if (!Array.isArray(parsed) || parsed.length !== items.length) {
        throw new Error(`Expected array of ${items.length}, got ${Array.isArray(parsed) ? parsed.length : 'non-array'}`);
      }

      return parsed;
    } catch (err) {
      if (attempt < 3) {
        const delay = err.message?.includes('429') ? 15000 * attempt : 5000 * attempt;
        log('🔄', `Attempt ${attempt}/3 failed. Retrying in ${delay / 1000}s...`);
        await sleep(delay);
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
    const titleIdx = content.lastIndexOf('"title":', match.index + 100);
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

  // Batch translate per locale
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

    // Prepare batch
    const batch = needTitle.map(p => ({
      id: p.id,
      title: p.title,
      summary: p.summary.slice(0, 500), // Limit summary length for API
    }));

    try {
      const translated = await translateBatch(batch, locale);

      // Inject translations back into the content
      for (let i = 0; i < translated.length; i++) {
        const pub = needTitle[i];
        const translatedTitle = translated[i].title;
        const translatedSummary = translated[i].summary;

        if (pub.hasTrans) {
          // Find the translations block and inject
          const transIdx = content.indexOf('"translations":', pub.matchIndex + (content.length - readFileSync(PUB_PATH, 'utf8').length));
          // Recalculate since content may have grown
          const actualTransIdx = content.indexOf('"translations":', content.indexOf('"id": "' + pub.id + '"'));
          if (actualTransIdx === -1) continue;

          const ob = content.indexOf('{', actualTransIdx);
          let bc = 1, pos = ob + 1;
          while (bc > 0 && pos < content.length) { if (content[pos] === '{') bc++; if (content[pos] === '}') bc--; pos++; }
          const closeBrace = pos - 1;

          // Check what's already inside
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
          // No translations block — create one
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

      log('✅', `Injected ${translated.length} translations for ${locale}`);

    } catch (err) {
      log('❌', `Failed for ${locale}: ${err.message}`);
    }

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

    // Check if this post already has headline_en
    const hasEn = around.includes('"headline_en"');
    const posMatch = around.match(/"position": (\d+)/);
    const position = posMatch ? parseInt(posMatch[1]) : -1;

    // Find summary
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

  if (DRY_RUN) {
    for (const p of posts) log('🧪', `  Would translate: "${p.headline}"`);
    return 0;
  }

  let totalInjected = 0;

  for (const locale of LOCALES) {
    log('🌍', `Translating ${posts.length} blog headlines → ${locale}...`);

    const batch = posts.map(p => ({ title: p.headline, summary: p.summary.slice(0, 300) }));

    try {
      const translated = await translateBatch(batch, locale);

      // Inject into content (re-read to account for mutations)
      for (let i = 0; i < translated.length; i++) {
        const post = posts[i];
        const headlineIdx = content.indexOf('"headline": "' + post.headline + '"');
        if (headlineIdx === -1) continue;

        const summaryIdx = content.indexOf('"summary":', headlineIdx);
        if (summaryIdx === -1 || summaryIdx - headlineIdx > 1000) continue;

        const summaryLineEnd = content.indexOf('\n', summaryIdx);
        if (summaryLineEnd === -1) continue;

        // Check if already has this locale
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

      log('✅', `Injected ${translated.length} blog translations for ${locale}`);
    } catch (err) {
      log('❌', `Failed for ${locale}: ${err.message}`);
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
  console.log('  🌐 translate-generated-artifacts.mjs — Post-Generation i18n');
  console.log('═══════════════════════════════════════════════════════════════');
  console.log('');

  if (DRY_RUN) log('🧪', 'DRY RUN — no files will be modified');
  if (FORCE) log('⚡', 'FORCE mode — re-translating everything');

  await initGemini();

  const pubCount = await translatePublications();
  const blogCount = await translateBlogPosts();

  console.log('');
  console.log('═══════════════════════════════════════════════════════════════');
  console.log('  📊 TRANSLATION SUMMARY');
  console.log('═══════════════════════════════════════════════════════════════');
  console.log(`  📖 Publications: ${pubCount} fields translated`);
  console.log(`  📰 Blog posts:   ${blogCount} fields translated`);
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
