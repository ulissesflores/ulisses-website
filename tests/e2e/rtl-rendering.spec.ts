import { test, expect } from '@playwright/test';

/**
 * ═══════════════════════════════════════════════════════════════════════════════
 *  🌍 E2E: RTL Rendering — TDD Adversarial (Lote 23)
 * ───────────────────────────────────────────────────────────────────────────────
 *  Verifica que o atributo dir="rtl" é renderizado no DOM real para Hebrew.
 *  Um teste unitário que lê getDirection('he') NÃO prova que o browser renderiza.
 * ═══════════════════════════════════════════════════════════════════════════════
 */

test.describe('RTL Rendering — Browser Real', () => {
  test('página em Hebrew tem dir="rtl" no <html>', async ({ page }) => {
    await page.goto('/he');
    const htmlDir = await page.locator('html').getAttribute('dir');
    expect(htmlDir, '<html> não tem dir="rtl" para /he').toBe('rtl');
  });

  test('página em Hebrew tem lang="he" no <html>', async ({ page }) => {
    await page.goto('/he');
    const htmlLang = await page.locator('html').getAttribute('lang');
    expect(htmlLang, '<html> não tem lang="he"').toBe('he');
  });

  test('página em PT-BR tem dir="ltr" no <html>', async ({ page }) => {
    await page.goto('/pt-br');
    const htmlDir = await page.locator('html').getAttribute('dir');
    expect(htmlDir, '<html> não tem dir="ltr" para /pt-br').toBe('ltr');
  });

  test('página em EN tem lang="en" no <html>', async ({ page }) => {
    await page.goto('/en');
    const htmlLang = await page.locator('html').getAttribute('lang');
    expect(htmlLang, '<html> não tem lang="en"').toBe('en');
  });
});
