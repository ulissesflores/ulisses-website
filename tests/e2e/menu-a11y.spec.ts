import { test, expect, type Page } from '@playwright/test';
import axeCore from 'axe-core';

/**
 * ═══════════════════════════════════════════════════════════════════════════════
 *  ♿ E2E: comportamento de teclado do menu (gate)
 * ───────────────────────────────────────────────────────────────────────────────
 *  axe-core não pega nada disto: as regras estáticas veem o DOM parado, e os
 *  defeitos aqui são de INTERAÇÃO. Medidos na auditoria de 2026-07-30 contra
 *  produção: `Escape` não fechava drawer nem dropdown, e o foco escapava do
 *  drawer na 24ª tabulação para links do header — e na 30ª para o conteúdo
 *  atrás do overlay, visualmente coberto.
 *
 *  O botão de fechar é o próprio hambúrguer, que mora no <header> e não dentro
 *  do overlay; por isso o ciclo de foco legítimo é [hambúrguer + drawer].
 * ═══════════════════════════════════════════════════════════════════════════════
 */

/**
 * Abre um menu de forma idempotente. O clique só tem efeito depois da hidratação
 * do React, e não há sinal estável de "hidratou" no App Router — então re-tenta
 * até o painel aparecer. Idempotente porque o gatilho muda de nome acessível ao
 * abrir: quando o painel está aberto, o locator não casa mais e nada é clicado.
 */
async function open(page: Page, triggerName: string, panel: string) {
  const trigger = page.getByRole('button', { name: triggerName });
  await expect(async () => {
    if (await trigger.isVisible()) await trigger.click();
    await expect(page.locator(panel)).toBeVisible({ timeout: 500 });
  }).toPass({ timeout: 15_000 });
}

test.describe('Drawer mobile — teclado', () => {
  test.beforeEach(async ({ page }, testInfo) => {
    test.skip(testInfo.project.name !== 'mobile', 'o drawer é lg:hidden');
    await page.goto('/', { waitUntil: 'load' });
  });

  test('anuncia-se como modal e liga botão ao painel', async ({ page }) => {
    await open(page, 'Abrir menu', '#mobile-menu');

    const drawer = page.locator('#mobile-menu');
    await expect(drawer).toHaveAttribute('role', 'dialog');
    await expect(drawer).toHaveAttribute('aria-modal', 'true');
    await expect(drawer).toHaveAttribute('aria-label', 'Menu de navegação');
    await expect(page.getByRole('button', { name: 'Fechar menu' })).toHaveAttribute(
      'aria-controls',
      'mobile-menu',
    );
  });

  test('Escape fecha o drawer e devolve o foco ao hambúrguer', async ({ page }) => {
    await open(page, 'Abrir menu', '#mobile-menu');

    await page.keyboard.press('Escape');

    await expect(page.locator('#mobile-menu')).toHaveCount(0);
    await expect(page.getByRole('button', { name: 'Abrir menu' })).toBeFocused();
  });

  test('o foco não escapa do drawer em 30 tabulações', async ({ page }) => {
    await open(page, 'Abrir menu', '#mobile-menu');

    for (let i = 0; i < 30; i += 1) {
      await page.keyboard.press('Tab');
      const inside = await page.evaluate(() => {
        const active = document.activeElement;
        if (!active || active === document.body) return false;
        return (
          document.getElementById('mobile-menu')?.contains(active) === true ||
          active.getAttribute('aria-controls') === 'mobile-menu'
        );
      });
      expect(inside, `foco escapou na ${i + 1}ª tabulação`).toBe(true);
    }
  });

  /*
   * O gate de `a11y.spec.ts` roda o axe no estado FECHADO de cada rota — o
   * drawer aberto, com `role="dialog"`, nunca passou por ele. Sem isto, o
   * markup de modal fica verificado só pelas asserções de atributo acima.
   */
  test('sem violações WCAG com o drawer ABERTO', async ({ page }) => {
    await open(page, 'Abrir menu', '#mobile-menu');
    await page.evaluate(axeCore.source);
    const results = await page.evaluate(
      (tags) =>
        (
          window as unknown as {
            axe: { run: (d: Document, o: unknown) => Promise<{ violations: { id: string; impact: string; nodes: unknown[] }[] }> };
          }
        ).axe.run(document, { runOnly: { type: 'tag', values: tags } }),
      ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa'],
    );
    expect(results.violations.map((v) => `${v.id} (${v.impact}, ${v.nodes.length})`)).toEqual([]);
  });

  test('Shift+Tab a partir do hambúrguer volta para dentro do drawer', async ({ page }) => {
    await open(page, 'Abrir menu', '#mobile-menu');
    await page.getByRole('button', { name: 'Fechar menu' }).focus();

    await page.keyboard.press('Shift+Tab');

    await expect(page.locator('#mobile-menu :focus')).toHaveCount(1);
  });
});

test.describe('Dropdown desktop — teclado', () => {
  test.beforeEach(async ({ page }, testInfo) => {
    test.skip(testInfo.project.name !== 'chromium', 'o mega menu é lg:flex');
    await page.goto('/', { waitUntil: 'load' });
  });

  test('Escape fecha o dropdown e devolve o foco ao gatilho', async ({ page }) => {
    const trigger = page.getByRole('button', { name: 'Serviços', exact: true });
    await expect(async () => {
      await trigger.click();
      await expect(trigger).toHaveAttribute('aria-expanded', 'true', { timeout: 500 });
    }).toPass({ timeout: 15_000 });

    await page.keyboard.press('Escape');

    await expect(trigger).toHaveAttribute('aria-expanded', 'false');
    await expect(trigger).toBeFocused();
  });

  test('Escape fecha o seletor de idioma e devolve o foco ao gatilho', async ({ page }) => {
    const trigger = page.getByRole('button', { name: 'Idioma' });
    await expect(async () => {
      await trigger.click();
      await expect(trigger).toHaveAttribute('aria-expanded', 'true', { timeout: 500 });
    }).toPass({ timeout: 15_000 });

    await page.keyboard.press('Escape');

    await expect(trigger).toHaveAttribute('aria-expanded', 'false');
    await expect(trigger).toBeFocused();
  });
});
