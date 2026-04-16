import { defineConfig, devices } from '@playwright/test';

/**
 * ═══════════════════════════════════════════════════════════════════════════════
 *  🎭 Playwright Config — TDD Adversarial E2E (Lote 23)
 * ───────────────────────────────────────────────────────────────────────────────
 *  Testes de Caixa Preta contra o browser real. Sem atalhos unitários.
 *
 *  Porta 3100 (default) ao invés de 3000 para não colidir com túneis SSH
 *  comuns que encaminham 3000 (ex.: `ssh -L 3000:127.0.0.1:3000 skynet`).
 *  Override via env: PLAYWRIGHT_PORT=4000 npm run e2e
 * ═══════════════════════════════════════════════════════════════════════════════
 */
const PORT = Number(process.env.PLAYWRIGHT_PORT ?? 3100);
const BASE_URL = `http://localhost:${PORT}`;

export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: 1,
  reporter: 'list',
  timeout: 30_000,

  use: {
    baseURL: BASE_URL,
    trace: 'on-first-retry',
  },

  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],

  webServer: {
    command: `npm run dev -- --port ${PORT}`,
    url: BASE_URL,
    reuseExistingServer: !process.env.CI,
    timeout: 60_000,
  },
});
