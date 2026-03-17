#!/usr/bin/env node
/**
 * ═══════════════════════════════════════════════════════════════════════════════
 *  🛡️  sota-validate.mjs — Master Validation Pipeline (LOTE 20)
 * ───────────────────────────────────────────────────────────────────────────────
 *  A "Lei do Código": um único script que é o juiz absoluto de qualidade.
 *
 *  Executa em sequência estrita, abortando (exit 1) no primeiro erro:
 *    1. tsc --noEmit            (Tipagem)
 *    2. i18n:parity             (Paridade de Dicionários — 4420 chaves, 0/0)
 *    3. npm test                (261+ testes: unitários, integração, charset HE, anti-cópia)
 *    4. seo:validate            (Canonical URLs, hreflang, meta tags)
 *    5. seo:rich-results        (JSON-LD, DID, Rich Results)
 *
 *  USO:
 *    npm run sota:check         (chamado por husky pre-commit e pre-push)
 *    node scripts/sota-validate.mjs --skip-build   (pular build, apenas validações)
 *
 *  FILOSOFIA:
 *    "Nós não vamos mais pedir para você ter cuidado.
 *     Nossa única ordem futura será: implemente X e garanta que sota:check passa.
 *     O código passa a ser o único juiz da sua competência."
 *
 *                                      — Diretoria de Engenharia, Lote 20
 * ═══════════════════════════════════════════════════════════════════════════════
 */

import { execSync } from 'node:child_process';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');

// ── CLI ─────────────────────────────────────────────────────────────────────────

const args = process.argv.slice(2);
const SKIP_BUILD = args.includes('--skip-build');
const VERBOSE = args.includes('--verbose');

// ── Helpers ─────────────────────────────────────────────────────────────────────

const RESET = '\x1b[0m';
const BOLD = '\x1b[1m';
const GREEN = '\x1b[32m';
const RED = '\x1b[31m';
const CYAN = '\x1b[36m';
const DIM = '\x1b[2m';

function header(step, total, title) {
  console.log('');
  console.log(`${BOLD}${CYAN}  ┌──────────────────────────────────────────────────────────┐${RESET}`);
  console.log(`${BOLD}${CYAN}  │  [${step}/${total}] ${title.padEnd(49)}│${RESET}`);
  console.log(`${BOLD}${CYAN}  └──────────────────────────────────────────────────────────┘${RESET}`);
}

function success(msg) {
  console.log(`  ${GREEN}✅ ${msg}${RESET}`);
}

function fail(msg) {
  console.log(`  ${RED}❌ ${msg}${RESET}`);
}

function run(label, command) {
  try {
    const output = execSync(command, {
      cwd: ROOT,
      encoding: 'utf-8',
      timeout: 300_000, // 5 minutos max por etapa
      stdio: VERBOSE ? 'inherit' : ['pipe', 'pipe', 'pipe'],
    });

    // Capturar métricas do output quando disponível
    if (!VERBOSE && output) {
      // Extrair linha final relevante
      const lines = output.trim().split('\n');
      const last = lines[lines.length - 1];
      if (last && last.length < 120) {
        console.log(`  ${DIM}${last}${RESET}`);
      }
    }
    return output;
  } catch (err) {
    const errOutput = err.stdout || err.stderr || err.message || 'Unknown error';
    fail(`${label} FALHOU`);
    console.log('');
    // Mostrar últimas 15 linhas do erro
    const errorLines = errOutput.trim().split('\n').slice(-15);
    for (const line of errorLines) {
      console.log(`  ${RED}│${RESET} ${line}`);
    }
    console.log('');
    process.exit(1);
  }
}

// ── Pipeline ────────────────────────────────────────────────────────────────────

const totalSteps = SKIP_BUILD ? 6 : 8;
const startTime = Date.now();

console.log('');
console.log(`${BOLD}═══════════════════════════════════════════════════════════════${RESET}`);
console.log(`${BOLD}  🛡️  SOTA MASTER VALIDATION PIPELINE${RESET}`);
console.log(`${BOLD}  A Lei do Código — O juiz absoluto de qualidade${RESET}`);
console.log(`${BOLD}═══════════════════════════════════════════════════════════════${RESET}`);

// ── STEP 1: TypeScript ──────────────────────────────────────────────────────────

header(1, totalSteps, 'TypeScript — Tipagem Estrita');
run('tsc --noEmit', 'npx tsc --noEmit');
success('Zero erros de tipagem');

// ── STEP 2: Markdown Lint (SPOF Prevention) ─────────────────────────────────────

header(2, totalSteps, 'Markdown Lint — Qualidade da Fonte PT-BR');
run('lint:md', 'npm run lint:md');
success('Markdown limpo — sem erros estruturais');

// ── STEP 3: i18n Parity ─────────────────────────────────────────────────────────

header(3, totalSteps, 'i18n Parity — 4420 chaves × 4 locales');
const parityOutput = run('i18n:parity', 'node scripts/i18n/validate-parity.mjs');
// Verificar que o output confirma ALL CHECKS PASSED
if (parityOutput && !parityOutput.includes('ALL CHECKS PASSED')) {
  fail('Validador de paridade NÃO reportou ALL CHECKS PASSED');
  process.exit(1);
}
success('ALL CHECKS PASSED — 0 errors, 0 warnings');

// ── STEP 4: Test Suite ──────────────────────────────────────────────────────────

header(4, totalSteps, 'Test Suite — Testes Completos');
const testOutput = run('npm test', 'npx vitest run');
// Extrair contagem de testes (strip ANSI escape codes)
if (testOutput) {
  const clean = testOutput.replace(/\x1b\[[0-9;]*m/g, '');
  const testsMatch = clean.match(/Tests\s+(\d+)\s+passed/);
  const filesMatch = clean.match(/Test Files\s+(\d+)\s+passed/);
  if (testsMatch && filesMatch) {
    success(`${testsMatch[1]} testes passaram (${filesMatch[1]} ficheiros)`);
  } else if (testsMatch) {
    success(`${testsMatch[1]} testes passaram`);
  } else {
    success('Test suite completo');
  }
}

// ── STEP 5: SEO Validate ────────────────────────────────────────────────────────

header(5, totalSteps, 'SEO — Canonical URLs, Hreflang, Meta Tags');
run('seo:validate', 'node scripts/seo/validate-pre-deploy.mjs');
success('Validação SEO completa');

// ── STEP 6: Rich Results ────────────────────────────────────────────────────────

header(6, totalSteps, 'SEO — JSON-LD, DID, Rich Results');
run('seo:rich-results', 'node scripts/seo/validate-rich-results.mjs');
success('Rich Results e JSON-LD validados');

// ── STEP 7: E2E Playwright (Optional — sota:full only) ──────────────────────

if (!SKIP_BUILD) {
  header(7, totalSteps, 'E2E — Playwright Adversarial Tests');
  run('test:e2e', 'npx playwright test');
  success('E2E Playwright — todos os testes passaram');
}

// ── STEP 8: Build (Optional) ────────────────────────────────────────────────────

if (!SKIP_BUILD) {
  header(8, totalSteps, 'Build — SSG Completo (next build)');
  run('build', 'npm run build');
  success('Build SSG completo sem erros');
}

// ── Result ──────────────────────────────────────────────────────────────────────

const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);

console.log('');
console.log(`${BOLD}${GREEN}═══════════════════════════════════════════════════════════════${RESET}`);
console.log(`${BOLD}${GREEN}  🏆 SOTA VALIDATION PASSED — Score 1000/1000${RESET}`);
console.log(`${BOLD}${GREEN}═══════════════════════════════════════════════════════════════${RESET}`);
console.log(`${GREEN}  ✅ TypeScript:     0 erros${RESET}`);
console.log(`${GREEN}  ✅ Markdown Lint:  limpo${RESET}`);
console.log(`${GREEN}  ✅ i18n Parity:    ALL CHECKS PASSED${RESET}`);
console.log(`${GREEN}  ✅ Test Suite:     todos passaram${RESET}`);
console.log(`${GREEN}  ✅ SEO:            validado${RESET}`);
console.log(`${GREEN}  ✅ Rich Results:   validado${RESET}`);
if (!SKIP_BUILD) {
  console.log(`${GREEN}  ✅ E2E:            Playwright green${RESET}`);
  console.log(`${GREEN}  ✅ Build:          SSG completo${RESET}`);
}
console.log(`${DIM}  ⏱️  Tempo total: ${elapsed}s${RESET}`);
console.log('');

