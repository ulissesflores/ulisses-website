#!/usr/bin/env node
/**
 * translate-sermons-via-gemini.mjs
 * Translates the sermons migration JSON and supplemental sermons data
 * using the Google Gemini API.
 *
 * Generates: data/seo/sermons-full-migration.{locale}.json
 *            data/sermons-supplemental.{locale}.json
 *
 * Usage:
 *   node --env-file=.env.local scripts/i18n/translate-sermons-via-gemini.mjs [options]
 *
 * Options:
 *   --locale=en    Translate to a single locale (default: all)
 *   --delay=1000   Delay between API calls in ms (default: 1000)
 *   --dry-run      Show what would be translated without calling API
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { GoogleGenerativeAI } from '@google/generative-ai';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT = path.resolve(__dirname, '../..');

// ── CLI Args ─────────────────────────────────────────────────────────────────
const args = process.argv.slice(2);
const getArg = (name) => {
  const a = args.find((a) => a.startsWith(`--${name}=`));
  return a ? a.split('=').slice(1).join('=') : null;
};
const DELAY_MS = parseInt(getArg('delay') || '1000', 10);
const TARGET_LOCALE = getArg('locale');
const DRY_RUN = args.includes('--dry-run');
const MODEL = getArg('model') || 'gemini-2.5-flash';

// ── Target Locales (from central config — Anti-DRY Lote 22) ────────────────
import { TARGET_LOCALES_RICH } from '../config/i18n.config.mjs';
const LOCALES = TARGET_LOCALES_RICH
  .map(l => ({ code: l.code, name: l.label }))
  .filter(l => !TARGET_LOCALE || l.code === TARGET_LOCALE);

// ── API Init ─────────────────────────────────────────────────────────────────
const API_KEY = process.env.GEMINI_API_KEY;
if (!API_KEY && !DRY_RUN) {
  console.error('❌ GEMINI_API_KEY not found. Set it in .env.local');
  process.exit(1);
}
const genAI = API_KEY ? new GoogleGenerativeAI(API_KEY) : null;
const model = genAI?.getGenerativeModel({ model: MODEL });

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const timestamp = () => new Date().toLocaleTimeString('pt-BR', { hour12: false });

// ── System Prompt ────────────────────────────────────────────────────────────
const SYSTEM_PROMPT = `You are a professional academic and theological translator. Translate the following JSON to {LANGUAGE}.

STRICT RULES:
1. Translate ONLY the values of these keys: "seo_title", "meta_description", "llm_context", "seo_title" (inside "sermoes" array).
2. DO NOT translate: "id", "slug", "original_url", "new_slug", "global_schema", "section_schema", "item_schema", "author".
3. Keep all slugs, URLs, and structural keys EXACTLY as they are.
4. Preserve the JSON structure EXACTLY.
5. For theological terms: maintain faithful, scholarly translation preserving the original theological intent.
6. For Hebrew: use modern Hebrew with appropriate theological terminology.
7. Output ONLY valid JSON. No code fences, no explanations.`;

// ── Translate Function ───────────────────────────────────────────────────────
async function translateJson(jsonText, language, retries = 3) {
  const prompt = SYSTEM_PROMPT.replace(/{LANGUAGE}/g, language);
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      const result = await model.generateContent({
        contents: [{ role: 'user', parts: [{ text: jsonText }] }],
        systemInstruction: { parts: [{ text: prompt }] },
        generationConfig: { temperature: 0.2, maxOutputTokens: 65536 },
      });
      let output = result.response.text();
      output = output.replace(/^```(?:json)?\n?/i, '').replace(/\n?```$/i, '');
      // Validate JSON
      JSON.parse(output);
      return output;
    } catch (err) {
      const status = err?.status || err?.code || 'unknown';
      console.error(`  [${timestamp()}] ⚠️ Attempt ${attempt}/${retries} failed (${status}): ${err.message?.slice(0, 100)}`);
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
  ⛪ translate-sermons-via-gemini.mjs — Sermon Translator
═══════════════════════════════════════════════════════════════
`);
  console.log(`  [${timestamp()}] 🔑 Model: ${MODEL}`);
  console.log(`  [${timestamp()}] ⏱️ Delay: ${DELAY_MS}ms`);

  // ── Part 1: Main migration JSON ─────────────────────────────────────────
  const mainJsonPath = path.join(ROOT, 'data/seo/sermons-full-migration.json');
  const mainJson = fs.readFileSync(mainJsonPath, 'utf-8');
  const parsed = JSON.parse(mainJson);
  const totalSermons = parsed.clusters.reduce((sum, c) => sum + c.sermoes.length, 0);

  console.log(`  [${timestamp()}] 📂 Source: sermons-full-migration.json`);
  console.log(`  [${timestamp()}] 📊 ${parsed.clusters.length} clusters, ${totalSermons} sermões`);

  // ── Part 2: Supplemental sermons (from sermons-migration.ts) ────────────
  // Extract the supplemental sermons data for translation
  const supplementalData = [
    {
      clusterId: 'fundamentos-da-fe',
      seoTitle: 'O Despertar da Fe: Fundamentos para uma Conviccao Inabalavel',
      llmContext: 'Exposicao biblica sobre a origem da fe autentica, articulando promessa, escuta da Palavra e obediencia pratica. A mensagem mostra como conviccao espiritual e formada antes de qualquer evidencia visivel, sustentando decisoes eticas em cenarios de pressao.',
    },
    {
      clusterId: 'batalha-espiritual-e-resiliencia',
      seoTitle: 'Quebrando as Muralhas pela Oracao: Estrategia Espiritual de Cerco e Ruptura',
      llmContext: 'Leitura teologica da oracao como ato de guerra espiritual e nao apenas devocao privada. O sermo interpreta muralhas como estruturas de oposicao persistente e apresenta disciplina de intercessao, perseveranca e unidade como vetor de rompimento.',
    },
    {
      clusterId: 'mensagens-profeticas',
      seoTitle: 'Alinhamento Profetico: Discernimento, Direcao e Obediencia no Tempo de Deus',
      llmContext: 'Mensagem sobre calibragem espiritual entre promessa e cumprimento, com enfase em discernimento biblico para evitar ativismo sem direcao. O foco e alinhar intencao, linguagem e pratica ministerial ao que Deus ja revelou nas Escrituras.',
    },
    {
      clusterId: 'mensagens-profeticas',
      seoTitle: 'Celebracao Antecipada: Fe Profetica Antes da Materializacao',
      llmContext: 'A mensagem desenvolve a logica da adoracao antecipada como declaracao de confianca na fidelidade divina. Trata da tensao entre processo e promessa, mostrando como gratidao antecipada reorganiza mente, emocao e postura comunitaria.',
    },
    {
      clusterId: 'mensagens-profeticas',
      seoTitle: 'O Selo da Vitoria: Consumacao de Ciclos e Confirmacao de Promessas',
      llmContext: 'Estudo sobre fechamento profetico de ciclos espirituais, conectando perseveranca, obediencia e testemunho publico. O sermo apresenta a vitoria como resultado de processo de santificacao continua, nao como evento isolado de euforia religiosa.',
    },
    {
      clusterId: 'eclesiologia-e-vida-pratica',
      seoTitle: 'Cultivando um Coracao Grato: Liturgia de Gratidao e Maturidade Crista',
      llmContext: 'Reflexao pastoral sobre gratidao como disciplina eclesial que combate murmuracao, cinismo e isolamento. A mensagem mostra como memoria das obras de Deus fortalece comunhao, gera estabilidade emocional e amplia resiliencia da igreja local.',
    },
    {
      clusterId: 'batalha-espiritual-e-resiliencia',
      seoTitle: 'A Esperanca que Nao Decepciona: Perseveranca em Meio a Crises',
      llmContext: 'Exegese de Romanos sobre esperanca escatologica e perseveranca pratica sob sofrimento. A mensagem articula dor, paciencia e formacao de carater, demonstrando como a esperanca cristocentrica impede colapso interior diante de incerteza prolongada.',
    },
  ];

  console.log(`  [${timestamp()}] 📊 ${supplementalData.length} supplemental sermons\n`);

  let success = 0;
  let failed = 0;

  for (const locale of LOCALES) {
    console.log(`────────────────────────────────────────────────────────────`);
    console.log(`  🌍 ${locale.name} (${locale.code})`);
    console.log(`────────────────────────────────────────────────────────────`);

    if (DRY_RUN) {
      console.log(`  [${timestamp()}] 🏷️ [DRY-RUN] Would translate main JSON + supplemental`);
      continue;
    }

    // Translate main migration JSON
    const mainOutPath = path.join(ROOT, `data/seo/sermons-full-migration.${locale.code}.json`);
    console.log(`  [${timestamp()}] 🔄 Translating sermons-full-migration.json → ${locale.code}...`);
    const translatedMain = await translateJson(mainJson, locale.name);
    if (translatedMain) {
      fs.writeFileSync(mainOutPath, translatedMain, 'utf-8');
      const translatedParsed = JSON.parse(translatedMain);
      const count = translatedParsed.clusters.reduce((s, c) => s + c.sermoes.length, 0);
      console.log(`  [${timestamp()}] 💾 Written: data/seo/sermons-full-migration.${locale.code}.json (${count} sermões)`);
      success++;
    } else {
      console.error(`  [${timestamp()}] ❌ Failed: sermons-full-migration.json → ${locale.code}`);
      failed++;
    }

    await sleep(DELAY_MS);

    // Translate supplemental data
    const suppOutPath = path.join(ROOT, `data/seo/sermons-supplemental.${locale.code}.json`);
    console.log(`  [${timestamp()}] 🔄 Translating supplemental sermons → ${locale.code}...`);
    const translatedSupp = await translateJson(JSON.stringify(supplementalData, null, 2), locale.name);
    if (translatedSupp) {
      fs.writeFileSync(suppOutPath, translatedSupp, 'utf-8');
      console.log(`  [${timestamp()}] 💾 Written: data/seo/sermons-supplemental.${locale.code}.json`);
      success++;
    } else {
      console.error(`  [${timestamp()}] ❌ Failed: supplemental sermons → ${locale.code}`);
      failed++;
    }

    await sleep(DELAY_MS * 2); // Extra delay between locales
    console.log('');
  }

  console.log(`
═══════════════════════════════════════════════════════════════
  📊 TRANSLATION SUMMARY
═══════════════════════════════════════════════════════════════
  ✅ Success:  ${success}
  ❌ Failed:   ${failed}
  ⛪ Total Sermons: ${totalSermons + supplementalData.length} (${totalSermons} main + ${supplementalData.length} supplemental)
  🌍 Locales:  ${LOCALES.map((l) => l.code).join(', ')}
`);
}

main().catch((err) => {
  console.error('Fatal error:', err);
  process.exit(1);
});
