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

/*
 * Rotas confirmadas com 0 violações. Inclui RTL (he).
 *
 * A lista era de junho e cobria só o Grupo A — nenhuma rota de `/artigos`,
 * `/identidade`, `/simulacoes` ou `/c`. Consequência real: o commit `b58184b`
 * introduziu `scrollable-region-focusable` (serious) na tabela do artigo e o gate
 * passou verde em 1000/1000 com o defeito vivo em produção por um dia
 * (auditoria 2026-07-30). Conteúdo novo nasce dentro do gate a partir daqui.
 */
const ROUTES = [
  '/',
  '/c',
  '/consultoria',
  '/palestras',
  '/artigos',
  '/artigos/2026-07-24-claude-opus-5',
  '/identidade',
  '/simulacoes',
  '/simulacoes/ia-2027',
  '/whitepapers',
  '/whitepapers/projeto-psi',
  '/he/whitepapers/projeto-psi',
  '/he/c',
  '/research/2025-lstm-asset-prediction',
  '/he/research/2025-lstm-asset-prediction', // cobre o ArticleToc (D04) em RTL no gate
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
