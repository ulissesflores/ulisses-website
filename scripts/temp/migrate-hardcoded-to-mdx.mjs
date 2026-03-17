#!/usr/bin/env node
/**
 * ══════════════════════════════════════════════════════════════════════
 * LOTE 28 — FASE 1: Migração Programática de Conteúdo Hardcoded → MDX
 * ══════════════════════════════════════════════════════════════════════
 *
 * Este script extrai automaticamente todo o conteúdo que está preso em:
 *   - scripts/upkf/generate-artifacts-v2.mjs (SLUG_TOPIC_OVERRIDES, PUBLICATION_I18N)
 *   - data/research/articles/{slug}/article.md (corpos dos artigos)
 *   - data/research/articles/{slug}/metadata.json (metadados)
 *   - data/simulations/ia-2027.ts (simulação interativa)
 *
 * E gera ficheiros .mdx físicos em:
 *   - content/publications/{slug}/index.pt-br.mdx   (research)
 *   - content/essays/{slug}/index.pt-br.mdx         (essays)
 *   - content/whitepapers/{slug}/index.pt-br.mdx    (whitepapers)
 *   - content/simulations/ia-2027/index.pt-br.mdx   (simulação)
 *
 * ANTI-ALUCINAÇÃO: O script lê programaticamente do disco.
 * Nenhum texto é copiado/colado na janela de contexto do LLM.
 *
 * Uso: node scripts/temp/migrate-hardcoded-to-mdx.mjs
 * ══════════════════════════════════════════════════════════════════════
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(__dirname, '../..');

// ── Source paths ──────────────────────────────────────────────────────
const GENERATOR_PATH = path.join(repoRoot, 'scripts', 'upkf', 'generate-artifacts-v2.mjs');
const ARTICLES_DIR = path.join(repoRoot, 'data', 'research', 'articles');
const SIMULATION_PATH = path.join(repoRoot, 'data', 'simulations', 'ia-2027.ts');
const CONTENT_DIR = path.join(repoRoot, 'content');

// ── Category → content directory mapping ─────────────────────────────
const CATEGORY_DIR_MAP = {
  research: 'publications',
  whitepapers: 'whitepapers',
  essays: 'essays',
};

// ── Stats ────────────────────────────────────────────────────────────
const stats = { created: 0, skipped: 0, errors: [], slugs: [] };

function log(emoji, msg) {
  process.stdout.write(`  ${emoji} ${msg}\n`);
}

function ensureDir(dir) {
  fs.mkdirSync(dir, { recursive: true });
}

// ══════════════════════════════════════════════════════════════════════
// STEP 1: Extract SLUG_TOPIC_OVERRIDES and PUBLICATION_I18N from generator
// We parse the MJS source as text to extract the JS objects programmatically
// ══════════════════════════════════════════════════════════════════════

function extractObjectFromSource(source, varName) {
  // Find "const VARNAME = {" and extract until matching closing "}"
  const startPattern = new RegExp(`const ${varName}\\s*=\\s*\\{`);
  const match = source.match(startPattern);
  if (!match) {
    throw new Error(`Cannot find "${varName}" in generator source`);
  }

  const startIdx = match.index + match[0].length - 1; // position of opening {
  let depth = 0;
  let endIdx = startIdx;

  for (let i = startIdx; i < source.length; i++) {
    if (source[i] === '{') depth++;
    else if (source[i] === '}') {
      depth--;
      if (depth === 0) {
        endIdx = i;
        break;
      }
    }
  }

  const objectSource = source.slice(startIdx, endIdx + 1);
  return objectSource;
}

function parseExtractedObject(objectSource) {
  // Use Function constructor to evaluate the JS object literal
  // This is safe because we control the source (our own repo file)
  const fn = new Function(`return (${objectSource});`);
  return fn();
}

// ══════════════════════════════════════════════════════════════════════
// STEP 2: Load article metadata and bodies from external files
// ══════════════════════════════════════════════════════════════════════

function loadArticleMetadata(slug) {
  const metaPath = path.join(ARTICLES_DIR, slug, 'metadata.json');
  if (!fs.existsSync(metaPath)) return null;
  return JSON.parse(fs.readFileSync(metaPath, 'utf8'));
}

function loadArticleBody(slug) {
  const bodyPath = path.join(ARTICLES_DIR, slug, 'article.md');
  if (!fs.existsSync(bodyPath)) return null;
  return fs.readFileSync(bodyPath, 'utf8').trim();
}

function loadArticleTranslation(slug, locale) {
  const transPath = path.join(ARTICLES_DIR, slug, `article.${locale}.md`);
  if (!fs.existsSync(transPath)) return null;
  return fs.readFileSync(transPath, 'utf8').trim();
}

// ══════════════════════════════════════════════════════════════════════
// STEP 3: Generate MDX frontmatter + body
// ══════════════════════════════════════════════════════════════════════

function buildFrontmatter(fields) {
  const lines = ['---'];
  for (const [key, value] of Object.entries(fields)) {
    if (value === undefined || value === null) continue;
    if (Array.isArray(value)) {
      lines.push(`${key}:`);
      for (const item of value) {
        lines.push(`  - "${String(item).replace(/"/g, '\\"')}"`);
      }
    } else if (typeof value === 'object') {
      lines.push(`${key}:`);
      for (const [subKey, subVal] of Object.entries(value)) {
        if (subVal !== undefined && subVal !== null) {
          lines.push(`  ${subKey}: "${String(subVal).replace(/"/g, '\\"')}"`);
        }
      }
    } else {
      const strVal = String(value);
      // Quote strings that contain special YAML chars
      if (strVal.includes(':') || strVal.includes('#') || strVal.includes("'") || strVal.includes('"') || strVal.includes('\n')) {
        lines.push(`${key}: "${strVal.replace(/"/g, '\\"')}"`);
      } else {
        lines.push(`${key}: ${strVal}`);
      }
    }
  }
  lines.push('---');
  return lines.join('\n');
}

function buildMdxContent(frontmatter, body) {
  return `${frontmatter}\n\n${body}\n`;
}

// ══════════════════════════════════════════════════════════════════════
// STEP 4: Discover all publication slugs from articles directory
// ══════════════════════════════════════════════════════════════════════

function discoverSlugs() {
  if (!fs.existsSync(ARTICLES_DIR)) return [];
  return fs.readdirSync(ARTICLES_DIR, { withFileTypes: true })
    .filter(d => d.isDirectory())
    .map(d => d.name)
    .sort();
}

// ══════════════════════════════════════════════════════════════════════
// STEP 5: Main migration logic
// ══════════════════════════════════════════════════════════════════════

function migratePublications(slugTopicOverrides, publicationI18n) {
  const slugs = discoverSlugs();
  log('📂', `Descobertos ${slugs.length} slugs em data/research/articles/`);

  for (const slug of slugs) {
    const metadata = loadArticleMetadata(slug);
    if (!metadata) {
      log('⚠️', `[SKIP] ${slug} — sem metadata.json`);
      stats.skipped++;
      continue;
    }

    const body = loadArticleBody(slug);
    if (!body) {
      log('⚠️', `[SKIP] ${slug} — sem article.md`);
      stats.skipped++;
      continue;
    }

    const category = metadata.category || 'research';
    const contentSubdir = CATEGORY_DIR_MAP[category] || 'publications';
    const topicOverride = slugTopicOverrides[slug] || {};
    const i18n = publicationI18n[slug] || {};

    // Build frontmatter fields
    const frontmatterFields = {
      title: metadata.title,
      slug: metadata.id || slug,
      category: category,
      date: metadata.generatedAt || '2026-01-01',
      language: 'pt-BR',
      canonicalUrl: metadata.canonicalUrl,
    };

    // Add DOI if present
    if (metadata.doi) {
      frontmatterFields.doi = metadata.doi;
    }

    // Add topic profile from SLUG_TOPIC_OVERRIDES
    if (topicOverride.focus) frontmatterFields.focus = topicOverride.focus;
    if (topicOverride.problem) frontmatterFields.problem = topicOverride.problem;
    if (topicOverride.method) frontmatterFields.method = topicOverride.method;
    if (topicOverride.result) frontmatterFields.result = topicOverride.result;
    if (topicOverride.discussion) frontmatterFields.discussion = topicOverride.discussion;
    if (topicOverride.application) frontmatterFields.application = topicOverride.application;

    if (topicOverride.contributions) {
      frontmatterFields.contributions = topicOverride.contributions;
    }
    if (topicOverride.references) {
      frontmatterFields.references = topicOverride.references;
    }

    // Add i18n translations
    if (i18n.it || i18n.he || i18n.summary_en) {
      frontmatterFields.translations = {};
      if (i18n.it) frontmatterFields.translations.it = i18n.it;
      if (i18n.he) frontmatterFields.translations.he = i18n.he;
      if (i18n.summary_en) frontmatterFields.translations.summary_en = i18n.summary_en;
      if (i18n.summary_es) frontmatterFields.translations.summary_es = i18n.summary_es;
      if (i18n.summary_it) frontmatterFields.translations.summary_it = i18n.summary_it;
      if (i18n.summary_he) frontmatterFields.translations.summary_he = i18n.summary_he;
    }

    const frontmatter = buildFrontmatter(frontmatterFields);
    const mdxContent = buildMdxContent(frontmatter, body);

    // Write MDX file
    const outDir = path.join(CONTENT_DIR, contentSubdir, slug);
    ensureDir(outDir);
    const outPath = path.join(outDir, 'index.pt-br.mdx');
    fs.writeFileSync(outPath, mdxContent, 'utf8');

    // Also copy translated article bodies as locale MDX files
    for (const locale of ['en', 'es', 'it', 'he']) {
      const translatedBody = loadArticleTranslation(slug, locale);
      if (translatedBody) {
        const localeFrontmatter = buildFrontmatter({
          ...frontmatterFields,
          language: locale === 'en' ? 'en' : locale === 'es' ? 'es' : locale === 'it' ? 'it' : 'he',
        });
        const localeMdx = buildMdxContent(localeFrontmatter, translatedBody);
        fs.writeFileSync(path.join(outDir, `index.${locale}.mdx`), localeMdx, 'utf8');
      }
    }

    const lineCount = mdxContent.split('\n').length;
    log('✅', `[${contentSubdir}] ${slug} → ${lineCount} linhas`);
    stats.created++;
    stats.slugs.push({ slug, category: contentSubdir, lines: lineCount });
  }
}

function migrateSimulation() {
  if (!fs.existsSync(SIMULATION_PATH)) {
    log('⚠️', '[SKIP] ia-2027.ts não encontrado');
    stats.skipped++;
    return;
  }

  const source = fs.readFileSync(SIMULATION_PATH, 'utf8');
  const lineCount = source.split('\n').length;

  const frontmatter = buildFrontmatter({
    title: 'Simulação IA 2027 — Corrida vs. Desaceleração',
    slug: 'ia-2027',
    category: 'simulation',
    date: '2025-06-01',
    language: 'pt-BR',
    type: 'interactive-simulation',
    description: 'Simulação narrativa interativa sobre cenários de corrida armamentista vs. desaceleração coordenada em IA até 2027.',
    components: ['ChartIA2027', 'TimelineNav', 'BranchingPoint'],
  });

  // For the simulation, we wrap the TS source reference in the MDX
  // The actual rendering will import from the TS data file
  const body = [
    '<!-- Simulação interativa: dados em data/simulations/ia-2027.ts -->',
    '<!-- Renderização via componentes React: ChartIA2027, TimelineNav, BranchingPoint -->',
    '',
    `{/* Fonte: ${lineCount} linhas de dados narrativos estruturados */}`,
    '',
    'import { mainTimeline, raceEnding, slowdownEnding, footnotesData } from "@/data/simulations/ia-2027"',
    '',
    '<SimulationRenderer',
    '  mainTimeline={mainTimeline}',
    '  raceEnding={raceEnding}',
    '  slowdownEnding={slowdownEnding}',
    '  footnotes={footnotesData}',
    '/>',
  ].join('\n');

  const mdxContent = buildMdxContent(frontmatter, body);
  const outDir = path.join(CONTENT_DIR, 'simulations', 'ia-2027');
  ensureDir(outDir);
  fs.writeFileSync(path.join(outDir, 'index.pt-br.mdx'), mdxContent, 'utf8');

  log('✅', `[simulations] ia-2027 → referência ao TS com ${lineCount} linhas`);
  stats.created++;
  stats.slugs.push({ slug: 'ia-2027', category: 'simulations', lines: mdxContent.split('\n').length });
}

// ══════════════════════════════════════════════════════════════════════
// MAIN
// ══════════════════════════════════════════════════════════════════════

function main() {
  console.log('');
  console.log('═══════════════════════════════════════════════════════════════');
  console.log('  LOTE 28 · FASE 1: Migração Hardcoded → MDX Físico');
  console.log('  Anti-Alucinação: Extração Programática do Disco');
  console.log('═══════════════════════════════════════════════════════════════');
  console.log('');

  // 1. Read generator source
  log('📖', 'Lendo generate-artifacts-v2.mjs...');
  const generatorSource = fs.readFileSync(GENERATOR_PATH, 'utf8');

  // 2. Extract SLUG_TOPIC_OVERRIDES
  log('🔍', 'Extraindo SLUG_TOPIC_OVERRIDES...');
  const slugTopicSource = extractObjectFromSource(generatorSource, 'SLUG_TOPIC_OVERRIDES');
  const slugTopicOverrides = parseExtractedObject(slugTopicSource);
  log('📊', `${Object.keys(slugTopicOverrides).length} perfis de tópico extraídos`);

  // 3. Extract PUBLICATION_I18N
  log('🔍', 'Extraindo PUBLICATION_I18N...');
  const pubI18nSource = extractObjectFromSource(generatorSource, 'PUBLICATION_I18N');
  const publicationI18n = parseExtractedObject(pubI18nSource);
  log('📊', `${Object.keys(publicationI18n).length} blocos i18n extraídos`);

  // 4. Migrate publications → MDX
  console.log('');
  log('🚀', 'Migrando publicações para MDX...');
  console.log('');
  migratePublications(slugTopicOverrides, publicationI18n);

  // 5. Migrate simulation → MDX
  console.log('');
  log('🚀', 'Migrando simulação ia-2027...');
  migrateSimulation();

  // 6. Report
  console.log('');
  console.log('═══════════════════════════════════════════════════════════════');
  console.log(`  ✅ MIGRAÇÃO COMPLETA`);
  console.log(`  Ficheiros criados: ${stats.created}`);
  console.log(`  Ficheiros ignorados: ${stats.skipped}`);
  console.log(`  Erros: ${stats.errors.length}`);
  console.log('═══════════════════════════════════════════════════════════════');
  console.log('');

  if (stats.slugs.length > 0) {
    console.log('  Inventário:');
    for (const item of stats.slugs) {
      console.log(`    ${item.category.padEnd(14)} ${item.slug.padEnd(45)} ${item.lines} linhas`);
    }
    console.log('');
  }

  if (stats.errors.length > 0) {
    console.log('  ERROS:');
    for (const err of stats.errors) {
      console.log(`    ❌ ${err}`);
    }
    process.exit(1);
  }

  // Write migration manifest for downstream scripts
  const manifestPath = path.join(CONTENT_DIR, 'migration-manifest.json');
  fs.writeFileSync(manifestPath, JSON.stringify({
    migratedAt: new Date().toISOString(),
    totalFiles: stats.created,
    items: stats.slugs,
  }, null, 2), 'utf8');
  log('📋', `Manifesto salvo em ${manifestPath}`);
}

main();
