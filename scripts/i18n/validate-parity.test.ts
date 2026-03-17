/**
 * ═══════════════════════════════════════════════════════════════════════════════
 *  🔬 Teste Automatizado do Validador de Paridade i18n
 * ───────────────────────────────────────────────────────────────────────────────
 *  Roda o validate-parity.mjs e garante 0 errors + 0 warnings.
 *  Integrado ao `npm test` para prevenir regressões.
 * ═══════════════════════════════════════════════════════════════════════════════
 */

import { describe, it, expect, beforeAll } from 'vitest';
import { execSync } from 'node:child_process';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..', '..');
const VALIDATOR_PATH = join(ROOT, 'scripts/i18n/validate-parity.mjs');

describe('Validador de paridade i18n — SOTA gate', () => {
  let output = '';

  beforeAll(() => {
    try {
      output = execSync(`node ${VALIDATOR_PATH}`, {
        cwd: ROOT,
        encoding: 'utf-8',
        timeout: 30000,
        stdio: ['pipe', 'pipe', 'pipe'],
      });
    } catch (e: unknown) {
      // The validator exits 1 on critical errors, capture stdout anyway
      const err = e as { stdout?: string; stderr?: string };
      output = (err.stdout ?? '') + (err.stderr ?? '');
    }
  });

  it('o validador executa e produz output', () => {
    expect(output.length, 'Validador não produziu output').toBeGreaterThan(100);
  });

  it('o validador executa sem erros de parse', () => {
    expect(output).not.toContain('PARSE ERROR');
    expect(output).not.toContain('FILE MISSING');
  });

  it('total de erros críticos é ZERO', () => {
    const errorsMatch = output.match(/Total errors:\s+(\d+)/);
    expect(errorsMatch, 'Não encontrou "Total errors:" no output').not.toBeNull();
    const totalErrors = parseInt(errorsMatch![1], 10);
    expect(totalErrors, 'Erros críticos de paridade i18n detectados').toBe(0);
  });

  it('total de warnings (STUB_COPY) é ZERO — Score 1000/1000', () => {
    const warningsMatch = output.match(/Total warnings:\s+(\d+)/);
    expect(warningsMatch, 'Não encontrou "Total warnings:" no output').not.toBeNull();
    const totalWarnings = parseInt(warningsMatch![1], 10);
    expect(totalWarnings, 'STUB_COPY ou EXTRA_KEY detectados — traduções incompletas').toBe(0);
  });

  it('todos os 4 locales estrangeiros são inspecionados', () => {
    for (const locale of ['EN', 'ES', 'IT', 'HE']) {
      expect(output, `Locale ${locale} ausente do output do validador`).toContain(`${locale}:`);
    }
  });

  it('mais de 4000 chaves são inspecionadas', () => {
    const keysMatch = output.match(/Total keys inspected:\s+(\d+)/);
    expect(keysMatch).not.toBeNull();
    const totalKeys = parseInt(keysMatch![1], 10);
    expect(totalKeys, 'Número de chaves inspecionadas abaixo do mínimo').toBeGreaterThan(4000);
  });

  it('output final contém ALL CHECKS PASSED', () => {
    expect(output).toContain('ALL CHECKS PASSED');
  });
});
