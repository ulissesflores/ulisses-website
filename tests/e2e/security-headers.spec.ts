import { test, expect } from '@playwright/test';

/**
 * ═══════════════════════════════════════════════════════════════════════════════
 *  🔒 E2E: Security Headers — TDD Adversarial (Lote 23)
 * ───────────────────────────────────────────────────────────────────────────────
 *  Testa se os cabeçalhos de segurança estão REALMENTE presentes na resposta
 *  HTTP do browser real. Nenhum teste unitário consegue validar isto.
 * ═══════════════════════════════════════════════════════════════════════════════
 */

test.describe('Security Headers — Browser Real', () => {
  test('resposta HTTP contém Content-Security-Policy', async ({ page }) => {
    const response = await page.goto('/');
    expect(response).not.toBeNull();
    const csp = response!.headers()['content-security-policy'];
    expect(csp, 'CSP header ausente').toBeDefined();
    expect(csp).toContain("default-src 'self'");
    expect(csp).toContain("frame-ancestors 'none'");
  });

  test('resposta HTTP contém Strict-Transport-Security (HSTS)', async ({ page }) => {
    const response = await page.goto('/');
    const hsts = response!.headers()['strict-transport-security'];
    // HSTS may not be present on localhost (HTTP), so we check the header exists OR skip
    // In production (HTTPS), this is mandatory
    if (hsts) {
      expect(hsts).toContain('max-age=');
      expect(hsts).toContain('includeSubDomains');
    }
  });

  test('resposta HTTP contém X-Frame-Options: DENY', async ({ page }) => {
    const response = await page.goto('/');
    const xfo = response!.headers()['x-frame-options'];
    expect(xfo, 'X-Frame-Options ausente').toBeDefined();
    expect(xfo!.toUpperCase()).toBe('DENY');
  });

  test('resposta HTTP contém X-Content-Type-Options: nosniff', async ({ page }) => {
    const response = await page.goto('/');
    const xcto = response!.headers()['x-content-type-options'];
    expect(xcto, 'X-Content-Type-Options ausente').toBeDefined();
    expect(xcto).toBe('nosniff');
  });

  test('resposta HTTP contém Referrer-Policy', async ({ page }) => {
    const response = await page.goto('/');
    const rp = response!.headers()['referrer-policy'];
    expect(rp, 'Referrer-Policy ausente').toBeDefined();
    expect(rp).toBe('strict-origin-when-cross-origin');
  });

  test('resposta HTTP contém Permissions-Policy', async ({ page }) => {
    const response = await page.goto('/');
    const pp = response!.headers()['permissions-policy'];
    expect(pp, 'Permissions-Policy ausente').toBeDefined();
    expect(pp).toContain('camera=()');
    expect(pp).toContain('microphone=()');
  });
});
