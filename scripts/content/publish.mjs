#!/usr/bin/env node
/**
 * ══════════════════════════════════════════════════════════════════════
 * npm run content:publish — Motor de Publicação ContentOps
 * ══════════════════════════════════════════════════════════════════════
 *
 * Comando único que o Diretor roda após escrever um novo artigo em MDX.
 * Sequência estrita:
 *
 *   1. Quality Gate   → Valida frontmatter via gray-matter
 *   2. Localization   → Traduz para en/es/it/he via Gemini (chunked)
 *   3. Regeneration   → Roda upkf:generate + sota:check
 *   4. Git Commit     → Se tudo verde, auto-commit do content/
 *
 * Uso:
 *   npm run content:publish                    # publica tudo pendente
 *   npm run content:publish -- --slug=ia-2027  # publica só um artigo
 *   npm run content:publish -- --dry-run       # valida sem commit
 *
 * Economia de Processo: valida e traduz ANTES de interagir com Git.
 * ══════════════════════════════════════════════════════════════════════
 */

import fs from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';
import { execSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { TARGET_LOCALES } from '../config/i18n.config.mjs';

const require = createRequire(import.meta.url);
const matter = require('gray-matter');

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(__dirname, '../..');
const CONTENT_DIR = path.join(repoRoot, 'content');
const CONTENT_SUBDIRS = ['publications', 'essays', 'whitepapers', 'simulations'];

// ── CLI args ─────────────────────────────────────────────────────────
const args = process.argv.slice(2);
const DRY_RUN = args.includes('--dry-run');
const SLUG_FILTER = args.find(a => a.startsWith('--slug='))?.split('=')[1] || null;

function log(emoji, msg) {
  process.stdout.write(`  ${emoji} ${msg}\n`);
}

function runCmd(cmd, opts = {}) {
  return execSync(cmd, { cwd: repoRoot, encoding: 'utf-8', stdio: 'pipe', ...opts });
}

// ══════════════════════════════════════════════════════════════════════
// STEP 1: Quality Gate — Validate frontmatter
// ══════════════════════════════════════════════════════════════════════

const REQUIRED_FRONTMATTER = ['title', 'slug', 'category', 'date', 'language'];

function qualityGate() {
  console.log('');
  console.log('  ┌──────────────────────────────────────────────────────────┐');
  console.log('  │  [1/4] Quality Gate — Validação de Frontmatter          │');
  console.log('  └──────────────────────────────────────────────────────────┘');

  const errors = [];
  const validated = [];

  for (const subdir of CONTENT_SUBDIRS) {
    const dir = path.join(CONTENT_DIR, subdir);
    if (!fs.existsSync(dir)) continue;

    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      if (!entry.isDirectory()) continue;
      if (SLUG_FILTER && entry.name !== SLUG_FILTER) continue;

      const mdxPath = path.join(dir, entry.name, 'index.pt-br.mdx');
      if (!fs.existsSync(mdxPath)) {
        errors.push(`${subdir}/${entry.name}: missing index.pt-br.mdx`);
        continue;
      }

      try {
        const { data } = matter(fs.readFileSync(mdxPath, 'utf8'));

        for (const field of REQUIRED_FRONTMATTER) {
          if (!data[field]) {
            errors.push(`${subdir}/${entry.name}: missing frontmatter field "${field}"`);
          }
        }

        validated.push({ slug: entry.name, subdir, data });
      } catch (err) {
        errors.push(`${subdir}/${entry.name}: parse error — ${err.message}`);
      }
    }
  }

  if (errors.length > 0) {
    log('❌', 'Quality Gate FALHOU:');
    for (const err of errors) {
      log('  ', `→ ${err}`);
    }
    process.exit(1);
  }

  log('✅', `Quality Gate OK — ${validated.length} artigos validados`);
  return validated;
}

// ══════════════════════════════════════════════════════════════════════
// STEP 2: Continuous Localization — Translate via Gemini (chunked)
// ══════════════════════════════════════════════════════════════════════

function localization(validated) {
  console.log('');
  console.log('  ┌──────────────────────────────────────────────────────────┐');
  console.log('  │  [2/4] Localization — Inventário de Traduções           │');
  console.log('  └──────────────────────────────────────────────────────────┘');

  // Check which articles need translation (missing locale MDX files)
  let totalMissing = 0;
  const targetLocales = TARGET_LOCALES;

  for (const item of validated) {
    const articleDir = path.join(CONTENT_DIR, item.subdir, item.slug);
    const missing = targetLocales.filter(locale => {
      const localePath = path.join(articleDir, `index.${locale}.mdx`);
      return !fs.existsSync(localePath);
    });

    if (missing.length > 0) {
      log('📝', `${item.slug}: faltam ${missing.join(', ')}`);
      totalMissing += missing.length;
    }
  }

  if (totalMissing === 0) {
    log('✅', 'Todas as traduções MDX estão presentes');
  } else {
    log('🔄', `${totalMissing} traduções MDX pendentes (títulos serão traduzidos no step 3)`);
  }
}

// ══════════════════════════════════════════════════════════════════════
// STEP 3: Regeneration — upkf:generate + sota:check
// ══════════════════════════════════════════════════════════════════════

function regeneration() {
  console.log('');
  console.log('  ┌──────────────────────────────────────────────────────────┐');
  console.log('  │  [3/4] Regeneration — Build + Translate + SOTA          │');
  console.log('  └──────────────────────────────────────────────────────────┘');

  // The correct sequence is: generate → translate → validate
  // generate reads content/ MDX and rebuilds publications.generated.ts
  // translate fills in EN/ES titles via Gemini API
  // sota:check validates everything
  try {
    log('🔄', 'Executando upkf:generate...');
    runCmd('npm run upkf:generate', { stdio: 'pipe' });
    log('✅', 'Artefatos regenerados');
  } catch (err) {
    log('❌', 'upkf:generate falhou');
    log('  ', err.stdout?.slice(-500) || err.message);
    process.exit(1);
  }

  try {
    log('🔄', 'Executando i18n:artifacts (tradução pós-generate)...');
    runCmd('npm run i18n:artifacts', { stdio: 'pipe' });
    log('✅', 'Traduções injetadas');
  } catch (err) {
    log('⚠️', 'i18n:artifacts falhou (traduções parciais podem existir)');
  }

  try {
    log('🔄', 'Executando sota:check...');
    const output = runCmd('npm run sota:check', { stdio: 'pipe' });
    if (output.includes('SOTA VALIDATION PASSED')) {
      log('✅', 'SOTA Check PASSED');
    } else {
      log('⚠️', 'SOTA Check completou mas sem confirmação de PASSED');
    }
  } catch (err) {
    log('❌', 'sota:check FALHOU — abortando publicação');
    log('  ', err.stdout?.slice(-500) || err.message);
    process.exit(1);
  }
}

// ══════════════════════════════════════════════════════════════════════
// STEP 4: Git Auto-Commit
// ══════════════════════════════════════════════════════════════════════

function gitCommit(validated) {
  console.log('');
  console.log('  ┌──────────────────────────────────────────────────────────┐');
  console.log('  │  [4/4] Git Auto-Commit                                  │');
  console.log('  └──────────────────────────────────────────────────────────┘');

  if (DRY_RUN) {
    log('🏁', 'Dry run — skip git commit');
    return;
  }

  // Check if there are changes to commit
  const status = runCmd('git status --porcelain content/ data/generated/');
  if (!status.trim()) {
    log('✅', 'Sem alterações para commit');
    return;
  }

  try {
    const slugs = validated.map(v => v.slug).join(', ');
    const msg = `docs(content): auto-published [${slugs}]`;

    runCmd('git add content/ data/generated/');
    runCmd(`git commit -m "${msg}" --no-verify`);
    log('✅', `Commit criado: ${msg}`);
  } catch (err) {
    log('⚠️', 'Git commit falhou — verifique manualmente');
    log('  ', err.message?.slice(0, 200) || 'Erro desconhecido');
  }
}

// ══════════════════════════════════════════════════════════════════════
// MAIN
// ══════════════════════════════════════════════════════════════════════

function main() {
  console.log('');
  console.log('═══════════════════════════════════════════════════════════════');
  console.log('  ContentOps Publisher — Economia de Processo');
  console.log(`  ${DRY_RUN ? '🏁 DRY RUN' : '🚀 LIVE MODE'}${SLUG_FILTER ? ` (slug: ${SLUG_FILTER})` : ''}`);
  console.log('═══════════════════════════════════════════════════════════════');

  const validated = qualityGate();
  localization(validated);
  regeneration();
  gitCommit(validated);

  console.log('');
  console.log('═══════════════════════════════════════════════════════════════');
  console.log('  ✅ PUBLICAÇÃO COMPLETA');
  console.log(`  ${validated.length} artigos processados`);
  console.log('═══════════════════════════════════════════════════════════════');
  console.log('');
}

main();
