/**
 * ═══════════════════════════════════════════════════════════════════════════════
 *  🛡️ anti-dry.test.ts — Prevents locale arrays from being hardcoded
 * ───────────────────────────────────────────────────────────────────────────────
 *  Lote 22: Se um grep encontrar arrays de locales hardcoded fora do config/,
 *  este teste FALHA. Isso garante que a centralização do i18n é respeitada.
 * ═══════════════════════════════════════════════════════════════════════════════
 */

import { describe, it, expect } from 'vitest';
import { execSync } from 'node:child_process';
import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const ROOT = resolve(import.meta.dirname, '../..');

describe('Anti-DRY — Locale arrays centralizado (Lote 22)', () => {
  it('nenhum script fora de config/ hardcoda arrays de locales', () => {
    // Grep for common locale array patterns in scripts (excluding config/, upkf/ data generators, and test files)
    const result = execSync(
      `grep -rn "'en', 'es', 'it', 'he'" scripts/ --include="*.mjs" --include="*.ts" | grep -v "config/" | grep -v "upkf/" | grep -v ".test." | grep -v "node_modules" || echo "__CLEAN__"`,
      { cwd: ROOT, encoding: 'utf-8' }
    );
    expect(
      result.trim(),
      `FALHA DRY: Locale arrays hardcoded encontrados fora de config/:\n${result}`
    ).toBe('__CLEAN__');
  });

  it('scripts/config/i18n.config.mjs existe', () => {
    expect(existsSync(resolve(ROOT, 'scripts/config/i18n.config.mjs'))).toBe(true);
  });

  it('scripts/config/cognates.json existe e é válido', () => {
    const path = resolve(ROOT, 'scripts/config/cognates.json');
    expect(existsSync(path)).toBe(true);
    const data = JSON.parse(readFileSync(path, 'utf-8'));
    expect(data.globalAllowlist).toBeDefined();
    expect(Array.isArray(data.globalAllowlist)).toBe(true);
    expect(data.globalAllowlist.length).toBeGreaterThan(0);
    expect(data.ptEsCognates).toBeDefined();
    expect(data.ptItCognates).toBeDefined();
    expect(data.skipIdentityNamespaces).toBeDefined();
  });

  it('nenhum "use client" component importa .generated.ts (bundle safety)', () => {
    // Find all 'use client' components, then check none import generated files
    const result = execSync(
      `grep -rl "'use client'" app/ components/ --include="*.tsx" 2>/dev/null || echo ""`,
      { cwd: ROOT, encoding: 'utf-8' }
    );
    const clientFiles = result.trim().split('\n').filter(Boolean);
    
    for (const file of clientFiles) {
      const content = readFileSync(resolve(ROOT, file), 'utf-8');
      expect(
        content.includes('.generated'),
        `BUNDLE SAFETY: '${file}' é 'use client' mas importa .generated.ts — risco de hidratação!`
      ).toBe(false);
    }
  });
});
