/**
 * ═══════════════════════════════════════════════════════════════════════════════
 *  🛡️ validate-locale-links.test.ts — Prevents locale-unaware links
 * ───────────────────────────────────────────────────────────────────────────────
 *  Every <Link href={...}> inside app/[locale]/ MUST use localePath().
 *  Bare canonicalPath links cause:
 *    - Users losing their locale context (navigating in EN → sees PT content)
 *    - Google crawling double-locale URLs (/en/es/...) → 404 spam
 *
 *  This test scans ALL .tsx files under app/[locale]/ and flags any
 *  <Link href={...}> that doesn't wrap the path with localePath().
 * ═══════════════════════════════════════════════════════════════════════════════
 */

import { describe, it, expect } from 'vitest';
import { readFileSync, readdirSync } from 'node:fs';
import { resolve, join, relative } from 'node:path';
import { SERMON_REDIRECTS } from '../../data/seo/sermon-redirects';

const ROOT = resolve(import.meta.dirname, '../..');
const LOCALE_APP_DIR = join(ROOT, 'app/[locale]');

/** Recursively find all .tsx files */
function findTsxFiles(dir: string): string[] {
  const files: string[] = [];
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const fullPath = join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...findTsxFiles(fullPath));
    } else if (entry.name.endsWith('.tsx')) {
      files.push(fullPath);
    }
  }
  return files;
}

describe('Locale-aware links — SEO/i18n regression guard', () => {
  it('every <Link href={...}> in app/[locale]/ uses localePath()', () => {
    const tsxFiles = findTsxFiles(LOCALE_APP_DIR);
    const violations: string[] = [];

    for (const file of tsxFiles) {
      const content = readFileSync(file, 'utf-8');
      const lines = content.split('\n');
      const relPath = relative(ROOT, file);

      for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        // Match <Link href={...}> where the href is a dynamic expression (not a string literal)
        // Skip lines that already use localePath
        if (
          line.includes('<Link') &&
          line.includes('href={') &&
          !line.includes('localePath(') &&
          !line.includes('href="') && // static string hrefs are fine (external URLs)
          !line.includes("href='")
        ) {
          violations.push(`${relPath}:${i + 1}: ${line.trim()}`);
        }
      }
    }

    expect(
      violations,
      `LOCALE LINK VIOLATION: The following <Link> components use dynamic href without localePath().\n` +
      `This causes users to lose locale context and generates double-locale 404s in Google.\n` +
      `Fix: wrap the path with localePath(path, locale)\n\n` +
      violations.join('\n')
    ).toHaveLength(0);
  });

  it('middleware handles /sermons/ → /acervo-teologico redirect', () => {
    const middleware = readFileSync(join(ROOT, 'middleware.ts'), 'utf-8');
    expect(
      middleware.includes("'/sermons'"),
      'middleware.ts must have /sermons → /acervo-teologico alias for legacy URL redirect'
    ).toBe(true);
  });

  it('all GSC 404 sermon URLs have exact redirect entries', () => {
    // Every /sermons/ URL from Google Search Console 404 report must have a redirect
    const gsc404Sermons = [
      '/sermons/jejum-da-vitoria-2023-21-devotionals/20-dia-20-preparando-o-altar',
      '/sermons/cultos-online-27-services/1-presenca-e-avivamento',
      '/sermons/cultos-online-27-services/4-a-importancia-da-intimidade-18-08-2022',
      '/sermons/cultos-online-27-services/6-restaurando-o-altar-25-08-2022',
      '/sermons/cultos-online-27-services/8-atravessando-tempestades-com-fe-04-09-2022',
      '/sermons/cultos-online-27-services/14-a-cruz-e-o-seu-significado-hoje-23-10-2022',
      '/sermons/cultos-online-27-services/16-identidade-quem-somos-em-cristo-13-11-2022',
      '/sermons/cultos-online-27-services/20-preparando-o-coracao-para-o-novo-ano-11-12-2022',
      '/sermons/cultos-online-27-services/21-fortalecendo-as-bases-da-fe-15-01-2023',
      '/sermons/cultos-online-27-services/23-aprendendo-a-ouvir-a-voz-de-deus-29-01-2023',
      '/sermons/cultos-online-27-services/24-comunhao-e-crescimento-espiritual-05-02-2023',
      '/sermons/cultos-online-27-services/26-viver-em-santidade-no-seculo-xxi-19-02-2023',
      '/sermons/jejum-da-vitoria-2023-21-devotionals/2-dia-2-vencendo-as-batalhas-da-mente',
      '/sermons/jejum-da-vitoria-2023-21-devotionals/6-dia-6-restituicao-divina',
      '/sermons/jejum-da-vitoria-2023-21-devotionals/7-dia-7-a-plenitude-do-espirito',
      '/sermons/jejum-da-vitoria-2023-21-devotionals/8-dia-8-tempo-de-renovo',
      '/sermons/jejum-da-vitoria-2023-21-devotionals/9-dia-9-frutos-de-uma-vida-com-deus',
      '/sermons/jejum-da-vitoria-2023-21-devotionals/10-dia-10-autoridade-espiritual',
      '/sermons/jejum-da-vitoria-2023-21-devotionals/15-dia-15-protecao-e-escudo',
      '/sermons/jejum-da-vitoria-2023-21-devotionals/19-dia-19-o-fogo-que-nao-se-apaga',
      '/sermons/jejum-da-vitoria-2023-21-devotionals/21-dia-21-o-selo-da-vitoria',
      '/sermons/outros-5-specials/1-janeiro-profetico-consagrando-o-novo-ano-dia-1-01-01-2023',
      '/sermons/outros-5-specials/4-o-grande-rompimento-celebracao-dos-testemunhos-dia-40',
      '/sermons/jejum-da-vitoria-2023-21-devotionals/17-dia-17-celebracao-antecipada',
      '/sermons/cultos-3-services',
    ];
    const missing = gsc404Sermons.filter(p => !SERMON_REDIRECTS[p]);
    expect(
      missing,
      `MISSING REDIRECTS: These GSC 404 URLs have no redirect:\n${missing.join('\n')}`
    ).toHaveLength(0);
  });

  it('old /acervo-teologico/ paths with legacy clusters also redirect', () => {
    // When /sermons/X/Y redirects to /acervo-teologico/A/B,
    // /acervo-teologico/X/Y must ALSO redirect to /acervo-teologico/A/B
    const testPath = '/acervo-teologico/jejum-da-vitoria-2023-21-devotionals/20-dia-20-preparando-o-altar';
    expect(
      SERMON_REDIRECTS[testPath],
      `${testPath} must redirect to the canonical sermon path`
    ).toBe('/acervo-teologico/avivamento-e-consagracao/preparando-o-altar');
  });

  it('middleware returns 410 for double-locale URLs', () => {
    const middleware = readFileSync(join(ROOT, 'middleware.ts'), 'utf-8');
    expect(
      middleware.includes('DOUBLE_LOCALE_PATTERN'),
      'middleware.ts must detect and reject double-locale URLs'
    ).toBe(true);
    expect(
      middleware.includes('410'),
      'middleware.ts must return 410 Gone for double-locale URLs'
    ).toBe(true);
  });
});
