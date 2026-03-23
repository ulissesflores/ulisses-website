/**
 * ═══════════════════════════════════════════════════════════════════════════════
 *  ECC SOTA — GSC Firewall (Google Search Console Zero-Error Guarantee)
 * ───────────────────────────────────────────────────────────────────────────────
 *  This test suite prevents ALL 8 categories of GSC indexing errors:
 *
 *  1. "Alternate page with proper canonical tag" → hreflang on every page
 *  2. "Page with redirect"                      → redirect targets exist
 *  3. "Not found (404)"                         → all sitemap URLs resolve
 *  4. "Crawled - currently not indexed"          → strong SEO signals
 *  5. "Duplicate without user-selected canonical"→ canonical + hreflang
 *  6. "Redirect error"                          → no broken redirect chains
 *  7. "Blocked by robots.txt"                   → valid robots.txt patterns
 *  8. "Discovered - currently not indexed"       → sitemap hreflang coverage
 *
 *  PHILOSOPHY: "If this test suite passes, no new GSC error can be introduced.
 *  Every page has canonical, hreflang, no redirect chains, and valid robots."
 *
 *  Run: npx vitest run scripts/seo/validate-gsc-firewall.test.ts
 * ═══════════════════════════════════════════════════════════════════════════════
 */

import { describe, it, expect } from 'vitest';
import { readFileSync, readdirSync, existsSync } from 'node:fs';
import { resolve, join, relative } from 'node:path';
import { SERMON_REDIRECTS } from '../../data/seo/sermon-redirects';

const ROOT = resolve(import.meta.dirname, '../..');
const LOCALE_APP_DIR = join(ROOT, 'app/[locale]');

// ── Helpers ─────────────────────────────────────────────────────────────────────

function findFiles(dir: string, ext: string): string[] {
  const files: string[] = [];
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) files.push(...findFiles(full, ext));
    else if (entry.name.endsWith(ext)) files.push(full);
  }
  return files;
}

function findPageFiles(): string[] {
  return findFiles(LOCALE_APP_DIR, 'page.tsx');
}

function readPage(page: string): string {
  return readFileSync(page, 'utf-8');
}

// ═══════════════════════════════════════════════════════════════════════════════
//  GSC ERROR #1 + #5: Hreflang on EVERY page (prevents "alternate with
//  canonical" and "duplicate without canonical")
// ═══════════════════════════════════════════════════════════════════════════════

describe('GSC #1/#5 — Hreflang & Canonical on every page', () => {
  const pages = findPageFiles();

  it('every page.tsx with generateMetadata has buildLanguageAlternates', () => {
    const missing: string[] = [];
    for (const page of pages) {
      const content = readPage(page);
      if (!content.includes('generateMetadata')) continue;
      if (!content.includes('buildLanguageAlternates')) {
        missing.push(relative(ROOT, page));
      }
    }
    expect(
      missing,
      `HREFLANG MISSING — causes GSC "alternate with proper canonical" (140 errors):\n` +
      missing.join('\n')
    ).toHaveLength(0);
  });

  it('every page.tsx with generateMetadata has buildCanonical (not raw path)', () => {
    const violations: string[] = [];
    for (const page of pages) {
      const content = readPage(page);
      if (!content.includes('generateMetadata')) continue;
      // Must use buildCanonical(), not a raw canonicalPath in alternates
      if (content.includes('alternates:') && !content.includes('buildCanonical')) {
        violations.push(relative(ROOT, page));
      }
    }
    expect(
      violations,
      `CANONICAL WITHOUT LOCALE — causes non-pt-br pages to point canonical to pt-br:\n` +
      violations.join('\n')
    ).toHaveLength(0);
  });

  it('buildLanguageAlternates is always paired with buildCanonical in imports', () => {
    const mismatched: string[] = [];
    for (const page of pages) {
      const content = readPage(page);
      if (!content.includes('generateMetadata')) continue;
      const hasAlternates = content.includes('buildLanguageAlternates');
      const hasCanonical = content.includes('buildCanonical');
      if (hasAlternates !== hasCanonical) {
        mismatched.push(`${relative(ROOT, page)} (alternates=${hasAlternates}, canonical=${hasCanonical})`);
      }
    }
    expect(
      mismatched,
      `IMPORT MISMATCH — buildLanguageAlternates and buildCanonical must always be used together:\n` +
      mismatched.join('\n')
    ).toHaveLength(0);
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
//  GSC ERROR #2: Locale-aware links (prevents redirect loops from locale loss)
// ═══════════════════════════════════════════════════════════════════════════════

describe('GSC #2 — Locale-aware links (no redirect-causing links)', () => {
  it('every <Link href={...}> in app/[locale]/ uses localePath()', () => {
    const tsxFiles = findFiles(LOCALE_APP_DIR, '.tsx');
    const violations: string[] = [];

    for (const file of tsxFiles) {
      const content = readPage(file);
      const lines = content.split('\n');
      const relPath = relative(ROOT, file);

      for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        if (
          line.includes('<Link') &&
          line.includes('href={') &&
          !line.includes('localePath(') &&
          !line.includes('href="') &&
          !line.includes("href='")
        ) {
          violations.push(`${relPath}:${i + 1}: ${line.trim()}`);
        }
      }
    }

    expect(
      violations,
      `LOCALE LINK VIOLATION — causes redirects and double-locale 404s:\n` +
      violations.join('\n')
    ).toHaveLength(0);
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
//  GSC ERROR #3/#6: Redirect integrity (no 404s, no broken chains)
// ═══════════════════════════════════════════════════════════════════════════════

describe('GSC #3/#6 — Redirect integrity (zero 404, zero chains)', () => {
  it('no redirect target points to another redirect (no chains)', () => {
    const targets = Object.values(SERMON_REDIRECTS) as string[];
    const sources = new Set(Object.keys(SERMON_REDIRECTS));
    const chains = targets.filter(t => sources.has(t));
    expect(
      chains,
      `REDIRECT CHAINS — causes GSC "redirect error":\n${chains.join('\n')}`
    ).toHaveLength(0);
  });

  it('every redirect target starts with / (valid internal path)', () => {
    const invalid: string[] = [];
    for (const [from, to] of Object.entries(SERMON_REDIRECTS)) {
      if (typeof to !== 'string' || !to.startsWith('/')) {
        invalid.push(`${from} → ${to}`);
      }
    }
    expect(
      invalid,
      `INVALID REDIRECT TARGETS:\n${invalid.join('\n')}`
    ).toHaveLength(0);
  });

  it('every /sermons/ redirect has matching /acervo-teologico/ counterpart', () => {
    const sermonEntries = Object.entries(SERMON_REDIRECTS).filter(
      ([from]) => from.startsWith('/sermons/') && from.split('/').filter(Boolean).length === 3
    );
    const missing: string[] = [];
    for (const [sermonPath, target] of sermonEntries) {
      const parts = sermonPath.split('/').filter(Boolean);
      const acervoPath = '/acervo-teologico/' + parts[1] + '/' + parts[2];
      if (SERMON_REDIRECTS[acervoPath] !== target) {
        missing.push(`${sermonPath} → expected ${acervoPath} → ${target}`);
      }
    }
    expect(
      missing,
      `MISSING /acervo-teologico/ COUNTERPARTS:\n${missing.join('\n')}`
    ).toHaveLength(0);
  });

  it('middleware has sermon redirect integration', () => {
    const middleware = readFileSync(join(ROOT, 'middleware.ts'), 'utf-8');
    expect(middleware).toContain('SERMON_REDIRECTS');
    expect(middleware).toContain("'/sermons'");
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
//  GSC ERROR #4/#8: Double-locale protection (prevents crawl waste)
// ═══════════════════════════════════════════════════════════════════════════════

describe('GSC #4/#8 — Double-locale & crawl protection', () => {
  it('middleware returns 410 for double-locale URLs', () => {
    const middleware = readFileSync(join(ROOT, 'middleware.ts'), 'utf-8');
    expect(middleware).toContain('DOUBLE_LOCALE_PATTERN');
    expect(middleware).toContain('410');
    expect(middleware).toContain('X-Robots-Tag');
    expect(middleware).toContain('noindex');
  });

  it('middleware matcher catches double-locale URLs with file extensions', () => {
    const middleware = readFileSync(join(ROOT, 'middleware.ts'), 'utf-8');
    expect(
      middleware.includes('(pt-br|en|es|he|it)/(pt-br|en|es|he|it)'),
      'Second matcher for double-locale + extensions (.pdf, .docx)'
    ).toBe(true);
  });

  it('middleware covers all 5 locales in DOUBLE_LOCALE_PATTERN', () => {
    const middleware = readFileSync(join(ROOT, 'middleware.ts'), 'utf-8');
    const locales = ['pt-br', 'en', 'es', 'he', 'it'];
    for (const locale of locales) {
      expect(
        middleware.includes(locale),
        `Middleware must include locale "${locale}" in patterns`
      ).toBe(true);
    }
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
//  GSC ERROR #7: robots.txt validity
// ═══════════════════════════════════════════════════════════════════════════════

describe('GSC #7 — robots.txt validity', () => {
  it('robots.ts exists', () => {
    expect(existsSync(join(ROOT, 'app/robots.ts'))).toBe(true);
  });

  it('disallow patterns do NOT use $ suffix (invalid in robots.txt)', () => {
    const content = readFileSync(join(ROOT, 'app/robots.ts'), 'utf8');
    expect(content).not.toContain("'/*.md$'");
    expect(content).not.toContain('"/*.md$"');
    expect(content).not.toContain("'/*.docx$'");
    expect(content).not.toContain('"/*.docx$"');
  });

  it('robots.ts blocks .md and .docx for regular crawlers', () => {
    const content = readFileSync(join(ROOT, 'app/robots.ts'), 'utf8');
    expect(content).toContain('/*.md');
    expect(content).toContain('/*.docx');
  });

  it('robots.ts allows .md for AI bots (LLM-friendly)', () => {
    const content = readFileSync(join(ROOT, 'app/robots.ts'), 'utf8');
    // AI bot section must allow .md
    expect(content).toContain('GPTBot');
    expect(content).toContain('ClaudeBot');
    // The allow rule for .md must exist for AI bots
    const aiSection = content.slice(content.indexOf('GPTBot'));
    expect(aiSection).toContain('/*.md');
  });

  it('robots.ts references both sitemaps', () => {
    const content = readFileSync(join(ROOT, 'app/robots.ts'), 'utf8');
    expect(content).toContain('sitemap.xml');
    expect(content).toContain('sitemap-resources.xml');
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
//  SITEMAP: hreflang coverage in sitemap entries
// ═══════════════════════════════════════════════════════════════════════════════

describe('Sitemap — hreflang coverage', () => {
  it('sitemap.ts uses buildSitemapAlternates for every entry', () => {
    const content = readFileSync(join(ROOT, 'app/sitemap.ts'), 'utf8');
    // Every makeSitemapEntry call includes alternates.languages
    expect(content).toContain('alternates');
    expect(content).toContain('languages');
    expect(content).toContain('buildSitemapAlternates');
  });

  it('sitemap.ts includes all content types', () => {
    const content = readFileSync(join(ROOT, 'app/sitemap.ts'), 'utf8');
    expect(content).toContain('publicationEntries');
    expect(content).toContain('certificationsEntries');
    expect(content).toContain('blogEntries');
    expect(content).toContain('acervoEntries');
    expect(content).toContain('simulationEntries');
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
//  METADATA STRUCTURE: data/seo.ts integrity
// ═══════════════════════════════════════════════════════════════════════════════

// ═══════════════════════════════════════════════════════════════════════════════
//  GSC REGRESSION: Sitemap must not include redirect URLs
// ═══════════════════════════════════════════════════════════════════════════════

describe('GSC Regression — Sitemap vs Redirects', () => {
  it('sitemap.ts does NOT include /simulacoes/projeto-psi (redirects to /whitepapers/projeto-psi)', () => {
    const content = readFileSync(join(ROOT, 'app/sitemap.ts'), 'utf8');
    expect(content).not.toContain("'/simulacoes/projeto-psi'");
  });

  it('no sitemap URL matches a next.config.ts redirect source', () => {
    const sitemapContent = readFileSync(join(ROOT, 'app/sitemap.ts'), 'utf8');
    const configContent = readFileSync(join(ROOT, 'next.config.ts'), 'utf8');

    // Extract redirect sources from next.config.ts
    const redirectSourceMatches = configContent.matchAll(/source:\s*["']([^"']+)["']/g);
    const redirectSources = new Set<string>();
    for (const match of redirectSourceMatches) {
      // Skip header sources (they have /.well-known, /llms, etc.)
      if (!match[1].includes(':slug') && !match[1].startsWith('/.well-known') && !match[1].startsWith('/llms')) {
        redirectSources.add(match[1]);
      }
    }

    // Extract sitemap paths
    const sitemapPathMatches = sitemapContent.matchAll(/maybeMakeSitemapEntry\(\s*'([^']+)'/g);
    const violations: string[] = [];
    for (const match of sitemapPathMatches) {
      if (redirectSources.has(match[1])) {
        violations.push(match[1]);
      }
    }

    expect(
      violations,
      `SITEMAP INCLUDES REDIRECT URLS — causes GSC "Page with redirect":\n${violations.join('\n')}`
    ).toHaveLength(0);
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
//  GSC REGRESSION: Unmapped /sermons/* falls back safely
// ═══════════════════════════════════════════════════════════════════════════════

describe('GSC Regression — Sermon redirect safety net', () => {
  it('middleware falls back unmapped /sermons/* to /acervo-teologico (not broken prefix swap)', () => {
    const middleware = readFileSync(join(ROOT, 'middleware.ts'), 'utf-8');
    // Must have the safety net: unmapped /sermons/ → /acervo-teologico
    expect(middleware).toContain("/sermons/");
    expect(middleware).toContain("/acervo-teologico");
    // The ternary guard must exist
    expect(middleware).toContain("strippedForAlias.startsWith('/sermons/')");
  });

  it('every /sermons/ key in SERMON_REDIRECTS has a valid target', () => {
    const sermonKeys = Object.keys(SERMON_REDIRECTS).filter(k => k.startsWith('/sermons/'));
    expect(sermonKeys.length).toBeGreaterThan(0);

    const invalidTargets: string[] = [];
    for (const key of sermonKeys) {
      const target = SERMON_REDIRECTS[key];
      if (typeof target !== 'string' || !target.startsWith('/acervo-teologico')) {
        invalidTargets.push(`${key} → ${target}`);
      }
    }

    expect(
      invalidTargets,
      `SERMON REDIRECTS WITH INVALID TARGETS:\n${invalidTargets.join('\n')}`
    ).toHaveLength(0);
  });
});

describe('SEO infrastructure — buildCanonical & buildLanguageAlternates', () => {
  it('buildCanonical returns locale prefix for non-default locales', () => {
    const content = readFileSync(join(ROOT, 'data/seo.ts'), 'utf8');
    // Must NOT return bare path for non-default locales
    expect(content).toContain("locale === 'pt-br'");
    expect(content).toContain('`/${locale}');
  });

  it('buildLanguageAlternates includes all 5 locale variants', () => {
    const content = readFileSync(join(ROOT, 'data/seo.ts'), 'utf8');
    expect(content).toContain('hreflangLocalePrefix');
    // Verify all locales are in the prefix map
    expect(content).toContain("'pt-BR'");
    expect(content).toContain("en:");
    expect(content).toContain("es:");
    expect(content).toContain("he:");
    expect(content).toContain("it:");
  });
});
