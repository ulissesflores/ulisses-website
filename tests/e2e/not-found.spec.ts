import { test, expect } from '@playwright/test';

/**
 * ═══════════════════════════════════════════════════════════════════════════════
 *  🚫 E2E: 404 Not Found — TDD Adversarial (Lote 23)
 * ───────────────────────────────────────────────────────────────────────────────
 *  Verifica que rotas inexistentes retornam 404 com conteúdo localizado.
 *  Prova que o not-found.tsx está realmente a funcionar no Next.js runtime.
 * ═══════════════════════════════════════════════════════════════════════════════
 */

test.describe('404 Not Found — Browser Real', () => {
  test('rota inexistente retorna status 404', async ({ page }) => {
    const response = await page.goto('/pt-br/rota-que-nao-existe-12345');
    expect(response).not.toBeNull();
    expect(response!.status(), 'Rota inexistente não retornou 404').toBe(404);
  });

  test('página 404 exibe o texto correcto', async ({ page }) => {
    await page.goto('/pt-br/rota-que-nao-existe-12345');
    // O not-found.tsx mostra "404" e links de navegação
    const body = await page.textContent('body');
    expect(body).toContain('404');
  });

  test('página 404 renderiza conteúdo de fallback', async ({ page }) => {
    await page.goto('/pt-br/rota-que-nao-existe-12345');
    // A página 404 deve renderizar conteúdo visível (não uma página em branco)
    const bodyText = await page.textContent('body');
    expect(bodyText!.length, 'Página 404 deve ter conteúdo visível').toBeGreaterThan(10);
  });
});
