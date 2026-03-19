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
import { execSync } from 'node:child_process';
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { resolve, join, relative } from 'node:path';

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
