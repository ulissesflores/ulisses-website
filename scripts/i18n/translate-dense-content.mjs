#!/usr/bin/env node
/**
 * ── Tradutor de Conteúdo Denso JSX via Gemini API ──
 * Envia um arquivo .tsx inteiro para a API e gera variantes traduzidas.
 *
 * Usage:
 *   node --env-file=.env.local scripts/i18n/translate-dense-content.mjs \
 *     --file=components/content/PsiWhitepaperBody.tsx \
 *     --locale=en
 *
 * The script:
 * 1. Reads the source .tsx file
 * 2. Sends it to Gemini with strict instructions to translate ONLY text nodes
 * 3. Writes the result as ComponentName.{locale}.tsx
 */
import fs from 'node:fs';
import path from 'node:path';
import { GoogleGenerativeAI } from '@google/generative-ai';

const API_KEY = process.env.GEMINI_API_KEY;
if (!API_KEY) {
  console.error('❌ GEMINI_API_KEY not found. Use --env-file=.env.local');
  process.exit(1);
}

const args = process.argv.slice(2);
const fileArg = args.find(a => a.startsWith('--file='))?.split('=')[1];
const localeArg = args.find(a => a.startsWith('--locale='))?.split('=')[1];

if (!fileArg || !localeArg) {
  console.error('Usage: node translate-dense-content.mjs --file=<path> --locale=<en|es|it|he>');
  process.exit(1);
}

const LOCALE_NAMES = {
  en: 'English',
  es: 'Spanish (Latin American)',
  it: 'Italian',
  he: 'Hebrew',
};

const localeName = LOCALE_NAMES[localeArg];
if (!localeName) {
  console.error(`❌ Unknown locale: ${localeArg}. Supported: ${Object.keys(LOCALE_NAMES).join(', ')}`);
  process.exit(1);
}

const ROOT = process.cwd();
const sourcePath = path.join(ROOT, fileArg);
const sourceContent = fs.readFileSync(sourcePath, 'utf-8');

// Derive output path: PsiWhitepaperBody.tsx → PsiWhitepaperBody.en.tsx
const ext = path.extname(sourcePath);
const baseName = path.basename(sourcePath, ext);
const dirName = path.dirname(sourcePath);
const outputPath = path.join(dirName, `${baseName}.${localeArg}${ext}`);

console.log(`\n🌍 Translating: ${fileArg}`);
console.log(`   Locale: ${localeArg} (${localeName})`);
console.log(`   Output: ${path.relative(ROOT, outputPath)}`);
console.log(`   Lines:  ${sourceContent.split('\n').length}`);

const genAI = new GoogleGenerativeAI(API_KEY);
const model = genAI.getGenerativeModel({
  model: 'gemini-2.5-flash',
  generationConfig: {
    temperature: 0.1,
    maxOutputTokens: 65536,
  },
});

const prompt = `You are an expert technical translator specializing in cryptography, hardware security, and scientific documents.

TASK: Translate the following React/JSX component from Portuguese (pt-BR) to ${localeName}.

STRICT RULES:
1. Translate ONLY the visible text content (text nodes inside JSX tags, string literals, alt text, figcaptions, table cell contents, heading text, paragraph text, list item text).
2. DO NOT modify ANY of the following:
   - React component names (PsiWhitepaperBody, etc.)
   - HTML/JSX tag names (<h2>, <p>, <aside>, <figure>, etc.)
   - CSS class names (className='...')
   - Tailwind utility classes
   - Import statements
   - TypeScript types/interfaces
   - JavaScript expressions ({locale}, {item.n}, etc.)
   - URLs or src paths (/whitepapers/...)
   - HTML entity references (&ldquo; &rdquo; &lsquo; &rsquo; &amp; &apos;)
   - Component props and their values (except translatable string props)
   - id attributes (id='section-1', id='ref-1', etc.)
   - key attributes
   - Variable names and function names
   - Comments (/* ... */ and // ...)
3. Keep all scientific terms, acronyms, and formulas in their standard form:
   - SRAM PUF, XMSS, Cu-W, TMR, FRAM, EMP, NIST SP 800-208, etc.
   - Mathematical formulas: SE = 10 · log₁₀(Pi / Pt), etc.
4. Keep academic reference citations EXACTLY as they are (they are in English already).
5. The component MUST remain a valid, compilable TypeScript/React component.
6. Translate image alt text for accessibility.
7. For Hebrew: the RTL layout is handled by CSS, so just translate the text content normally.

OUTPUT: Return ONLY the complete translated component code. No markdown fences, no explanations.

SOURCE COMPONENT:
${sourceContent}`;

try {
  console.log(`\n⏳ Sending to Gemini (${sourceContent.length} chars)...`);
  const result = await model.generateContent(prompt);
  let translated = result.response.text();

  // Strip markdown fences if present
  translated = translated.replace(/^```(?:tsx|typescript|jsx)?\n?/, '').replace(/\n?```$/, '');

  // Basic sanity check
  if (!translated.includes('PsiWhitepaperBody') && !translated.includes('export function')) {
    console.error('❌ Response does not look like a valid component. Saving raw output for inspection.');
    fs.writeFileSync(outputPath + '.raw.txt', translated, 'utf-8');
    process.exit(1);
  }

  fs.writeFileSync(outputPath, translated, 'utf-8');
  const outputLines = translated.split('\n').length;
  console.log(`\n✅ Saved: ${path.relative(ROOT, outputPath)} (${outputLines} lines)`);
} catch (error) {
  console.error(`\n❌ API Error: ${error.message}`);
  process.exit(1);
}
