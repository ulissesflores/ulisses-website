import { test, expect } from '@playwright/test';
import axeCore from 'axe-core';

/**
 * ═══════════════════════════════════════════════════════════════════════════════
 *  ♿ E2E: Acessibilidade WCAG 2.2 A/AA — axe-core (gate)
 * ───────────────────────────────────────────────────────────────────────────────
 *  Roda axe-core no browser real (injetado via CDP, contorna a CSP) contra um
 *  conjunto de rotas representativas, incluindo hebraico RTL. Falha em qualquer
 *  violação WCAG A/AA. Complementa as checagens estáticas do sota:check, que NÃO
 *  cobrem contraste/landmark/aria renderizados.
 *
 *  Também exige exatamente 1 landmark <main> por rota (best-practice, não coberto
 *  pelas tags WCAG).
 * ═══════════════════════════════════════════════════════════════════════════════
 */

const WCAG_TAGS = ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa'];

// Rotas confirmadas com 0 violações (baseline Grupo A). Inclui RTL (he).
const ROUTES = [
  '/',
  '/consultoria',
  '/palestras',
  '/whitepapers',
  '/whitepapers/projeto-psi',
  '/he/whitepapers/projeto-psi',
  '/research/2025-lstm-asset-prediction',
];

test.describe('Acessibilidade WCAG 2.2 A/AA — axe-core', () => {
  for (const route of ROUTES) {
    test(`sem violações WCAG A/AA em ${route}`, async ({ page }) => {
      await page.goto(route, { waitUntil: 'load' });
      await page.waitForTimeout(500);
      await page.evaluate(axeCore.source);
      const results = await page.evaluate(
        (tags) => (window as unknown as { axe: { run: (d: Document, o: unknown) => Promise<{ violations: { id: string; impact: string; nodes: unknown[] }[] }> } }).axe.run(document, {
          runOnly: { type: 'tag', values: tags },
        }),
        WCAG_TAGS,
      );
      const summary = results.violations.map((v) => `${v.id} (${v.impact}, ${v.nodes.length})`);
      expect(summary, `Violações WCAG em ${route}`).toEqual([]);

      // Exatamente 1 landmark <main> (best-practice fora das tags WCAG)
      const mains = await page.evaluate(() => document.querySelectorAll('main, [role="main"]').length);
      expect(mains, `landmarks <main> em ${route}`).toBe(1);
    });
  }
});
