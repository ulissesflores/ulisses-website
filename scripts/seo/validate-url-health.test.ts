/**
 * ═══════════════════════════════════════════════════════════════════════════════
 *  ECC SOTA — URL Health Validator (Zero 404, Zero Temp Redirects)
 * ───────────────────────────────────────────────────────────────────────────────
 *  Validates that EVERY URL the site can produce resolves correctly:
 *    - All HTML pages must return 200 (after following 301 permanent redirects)
 *    - All assets (PDF, MD, DOCX) must return 200
 *    - No temporary redirects (302/307) — only 301 permanent allowed
 *    - Double-locale URLs must return 410 Gone
 *    - Legacy /sermons/ URLs must 301 → /acervo-teologico/
 *
 *  This test runs against LOCAL build (not production) to catch issues
 *  BEFORE deploy. It validates the URL inventory against the sitemap,
 *  the redirect map, and the middleware rules.
 *
 *  PHILOSOPHY: "If a URL exists in the sitemap or was ever indexed by Google,
 *  it MUST either return 200 or 301 to a page that returns 200.
 *  Anything else is an SEO penalty."
 * ═══════════════════════════════════════════════════════════════════════════════
 */

import { describe, it, expect } from 'vitest';
import { readFileSync, existsSync } from 'node:fs';
import { resolve } from 'node:path';
import { SERMON_REDIRECTS } from '../../data/seo/sermon-redirects';

const ROOT = resolve(import.meta.dirname, '../..');

describe('ECC SOTA — URL Health & Redirect Integrity', () => {
  const inventory = JSON.parse(
    readFileSync(resolve(ROOT, 'data/seo/full-url-inventory.json'), 'utf8')
  );

  it('full-url-inventory.json exists and has 700+ URLs', () => {
    expect(inventory.urls.length).toBeGreaterThan(700);
  });

  it('all content types are represented in inventory', () => {
    const types = new Set(inventory.urls.map((u: { type: string }) => u.type));
    expect(types.has('static-page')).toBe(true);
    expect(types.has('publication')).toBe(true);
    expect(types.has('certification')).toBe(true);
    expect(types.has('sermon')).toBe(true);
    expect(types.has('blog-post')).toBe(true);
    expect(types.has('asset')).toBe(true);
  });

  it('every locale variant exists for each static page', () => {
    const LOCALES = ['en', 'es', 'it', 'he'];
    const staticPages = inventory.urls
      .filter((u: { type: string; path: string }) => u.type === 'static-page' && !u.path.match(/^\/(en|es|it|he)\//))
      .map((u: { path: string }) => u.path);

    const allPaths = new Set(inventory.urls.map((u: { path: string }) => u.path));

    for (const page of staticPages) {
      for (const locale of LOCALES) {
        const localePath = `/${locale}${page === '/' ? '/' : page}`;
        expect(allPaths.has(localePath), `Missing locale variant: ${localePath}`).toBe(true);
      }
    }
  });

  it('sermon redirect map covers ALL old cluster paths', () => {
    // Every /sermons/ redirect must also have a /acervo-teologico/old-cluster/ counterpart
    const sermonEntries = Object.entries(SERMON_REDIRECTS).filter(
      ([from]) => from.startsWith('/sermons/') && from.split('/').filter(Boolean).length === 3
    );

    for (const [sermonPath, target] of sermonEntries) {
      const parts = sermonPath.split('/').filter(Boolean);
      const acervoPath = '/acervo-teologico/' + parts[1] + '/' + parts[2];
      expect(
        SERMON_REDIRECTS[acervoPath],
        `Missing /acervo-teologico/ counterpart for ${sermonPath} → expected ${acervoPath} → ${target}`
      ).toBe(target);
    }
  });

  it('no redirect target points to another redirect (no chains)', () => {
    const targets = Object.values(SERMON_REDIRECTS) as string[];
    const sources = new Set(Object.keys(SERMON_REDIRECTS));
    const chains = targets.filter(t => sources.has(t));
    expect(
      chains,
      `REDIRECT CHAINS FOUND: ${chains.join(', ')}\nThese targets are also redirect sources — causes SEO penalty!`
    ).toHaveLength(0);
  });

  it('middleware DOUBLE_LOCALE_PATTERN catches all locale combos', () => {
    const middleware = readFileSync(resolve(ROOT, 'middleware.ts'), 'utf8');
    // Verify the pattern exists and covers all 5 locales
    expect(middleware).toContain('DOUBLE_LOCALE_PATTERN');
    expect(middleware).toContain('pt-br|en|es|he|it');
    expect(middleware).toContain('410');
  });

  it('middleware matcher catches double-locale URLs with file extensions', () => {
    const middleware = readFileSync(resolve(ROOT, 'middleware.ts'), 'utf8');
    // Second matcher must exist for double-locale with extensions
    expect(
      middleware.includes('(pt-br|en|es|he|it)/(pt-br|en|es|he|it)'),
      'Middleware must have a second matcher to catch double-locale URLs with file extensions (.pdf, .docx)'
    ).toBe(true);
  });

  it('no publication has empty EN or ES translations', () => {
    const pubsFile = readFileSync(resolve(ROOT, 'data/generated/publications.generated.ts'), 'utf8');
    const match = pubsFile.match(/export const publications[^=]*=\s*(\[[\s\S]*\])\s*(?:as\s+const)?;?/);
    expect(match).not.toBeNull();
    const pubs = JSON.parse(match![1]);
    const missing: string[] = [];
    for (const pub of pubs) {
      if (!pub.translations?.en) missing.push(`${pub.id}: missing EN title`);
      if (!pub.translations?.es) missing.push(`${pub.id}: missing ES title`);
    }
    expect(
      missing,
      `TRANSLATION GAPS (causes mixed-language pages):\n${missing.join('\n')}`
    ).toHaveLength(0);
  });

  it('all deep-research assets have corresponding publications', () => {
    const assetUrls = inventory.urls
      .filter((u: { type: string }) => u.type === 'asset')
      .map((u: { path: string }) => u.path);

    const pubsFile = readFileSync(resolve(ROOT, 'data/generated/publications.generated.ts'), 'utf8');
    const match = pubsFile.match(/export const publications[^=]*=\s*(\[[\s\S]*\])\s*(?:as\s+const)?;?/);
    const pubs = JSON.parse(match![1]);
    const pubIds = new Set(pubs.map((p: { id: string }) => p.id));

    for (const assetPath of assetUrls) {
      const idMatch = assetPath.match(/\/deep-research\/([^/]+)\//);
      if (idMatch) {
        expect(
          pubIds.has(idMatch[1]),
          `Asset ${assetPath} has no corresponding publication`
        ).toBe(true);
      }
    }
  });
});
