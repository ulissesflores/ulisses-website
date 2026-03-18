import { describe, it, expect } from 'vitest';
import * as fs from 'node:fs';
import * as path from 'node:path';

/**
 * ═══════════════════════════════════════════════════════════════════════════════
 *  i18n Locale Leak Prevention Tests
 * ───────────────────────────────────────────────────────────────────────────────
 *  Guards against:
 *  1. Hardcoded Portuguese UI strings in page/component files
 *  2. Internal links that skip localePath()
 *  3. Missing publication translation references
 *  4. Incomplete dictionary namespaces across locales
 * ═══════════════════════════════════════════════════════════════════════════════
 */

const ROOT = path.resolve(import.meta.dirname, '..');
const APP_LOCALE_DIR = path.join(ROOT, 'app', '[locale]');
const COMPONENTS_DIR = path.join(ROOT, 'components');

/** Recursively collect files matching a glob-like extension under a directory. */
function collectFiles(dir: string, ext: string): string[] {
  const results: string[] = [];
  if (!fs.existsSync(dir)) return results;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      results.push(...collectFiles(fullPath, ext));
    } else if (entry.name.endsWith(ext)) {
      results.push(fullPath);
    }
  }
  return results;
}

/**
 * Strip lines that are comments, className strings, or import statements
 * so we only scan actual UI-rendered content.
 */
function stripNonUILines(source: string): string {
  return source
    .split('\n')
    .filter((line) => {
      const trimmed = line.trim();
      // Skip single-line comments
      if (trimmed.startsWith('//')) return false;
      // Skip multi-line comment bodies
      if (trimmed.startsWith('*') || trimmed.startsWith('/*') || trimmed.startsWith('*/')) return false;
      // Skip import statements
      if (trimmed.startsWith('import ')) return false;
      // Skip lines that are purely className definitions
      if (/^\s*className\s*=/.test(trimmed)) return false;
      return true;
    })
    .join('\n');
}

// ─── SECTION 1: No hardcoded Portuguese UI strings ───────────────────────────

const FORBIDDEN_PT_STRINGS = [
  'Voltar',
  'Baixar',
  'Verificar',
  'Publicado em',
  'Fonte',
  'Como citar',
  'Algo deu errado',
  'Tentar novamente',
  'Perguntas Frequentes',
  'Identificador',
  'Ocupações',
  'Credenciais',
  'Repositórios',
];

describe('No hardcoded Portuguese UI strings in page files', () => {
  const tsxFiles = collectFiles(APP_LOCALE_DIR, '.tsx');

  it('should have found .tsx files to scan', () => {
    expect(tsxFiles.length).toBeGreaterThan(0);
  });

  for (const filePath of tsxFiles) {
    const relativePath = path.relative(ROOT, filePath);

    it(`${relativePath} has no hardcoded Portuguese strings`, () => {
      const raw = fs.readFileSync(filePath, 'utf8');
      const content = stripNonUILines(raw);

      const violations: string[] = [];
      for (const forbidden of FORBIDDEN_PT_STRINGS) {
        // Match the string as a standalone word/phrase in JSX text or string literals,
        // but exclude occurrences inside object property keys, variable names, etc.
        // We look for the string wrapped in quotes or as JSX text content.
        const patterns = [
          // Inside single/double-quoted string literals: 'Voltar' or "Voltar"
          new RegExp(`['"]${escapeRegex(forbidden)}['"]`, 'g'),
          // As JSX text content (between > and <): >Voltar<
          new RegExp(`>\\s*${escapeRegex(forbidden)}\\s*<`, 'g'),
          // Template literal containing the string: `...Voltar...`
          new RegExp(`\`[^\`]*${escapeRegex(forbidden)}[^\`]*\``, 'g'),
        ];

        for (const pattern of patterns) {
          const matches = content.match(pattern);
          if (matches) {
            violations.push(`Found "${forbidden}" (${matches.length}x)`);
          }
        }
      }

      expect(violations, `Hardcoded Portuguese in ${relativePath}:\n${violations.join('\n')}`).toEqual([]);
    });
  }
});

// ─── SECTION 2: Internal Link hrefs use localePath() ─────────────────────────

describe('Internal Link hrefs use localePath()', () => {
  const pageFiles = [
    ...collectFiles(APP_LOCALE_DIR, '.tsx'),
    ...collectFiles(COMPONENTS_DIR, '.tsx'),
  ];

  it('should have found files to scan', () => {
    expect(pageFiles.length).toBeGreaterThan(0);
  });

  for (const filePath of pageFiles) {
    const relativePath = path.relative(ROOT, filePath);

    it(`${relativePath} uses localePath() for internal links`, () => {
      const content = fs.readFileSync(filePath, 'utf8');
      const violations: string[] = [];

      // Split into lines for better error reporting
      const lines = content.split('\n');
      for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        const trimmed = line.trim();

        // Skip comments and imports
        if (trimmed.startsWith('//') || trimmed.startsWith('*') || trimmed.startsWith('import ')) continue;

        // Pattern 1: href={`/${something}`} — template literal starting with /
        // but NOT href={`/${locale}/`} or href={`/${locale}`} which is a locale-aware pattern
        // and NOT href={`#...`} which is an anchor
        const templateMatch = line.match(/href=\{`\/((?!#)[^`]+)`\}/g);
        if (templateMatch) {
          for (const match of templateMatch) {
            // Allow patterns that reference localePath or are locale-conditional
            // e.g., href={`/${locale}/`} in error.tsx is fine
            if (match.includes('${locale}')) continue;
            // Allow anchor-only template literals like `#section-${id}`
            if (match.match(/href=\{`\/#/)) continue;
            violations.push(`Line ${i + 1}: ${match.trim()}`);
          }
        }

        // Pattern 2: href='/something' (string literal internal path, not just '/' or '/#...')
        // Matches href='/certifications' etc. but not href='/' or href='/#contact'
        const stringMatch = line.match(/href='\/[a-zA-Z][^']*'/g);
        if (stringMatch) {
          for (const match of stringMatch) {
            // Skip external URLs (http/https)
            if (match.includes('http')) continue;
            violations.push(`Line ${i + 1}: ${match.trim()}`);
          }
        }

        // Pattern 3: href="/something" (double-quoted string literal)
        const dblStringMatch = line.match(/href="\/[a-zA-Z][^"]*"/g);
        if (dblStringMatch) {
          for (const match of dblStringMatch) {
            if (match.includes('http')) continue;
            violations.push(`Line ${i + 1}: ${match.trim()}`);
          }
        }
      }

      expect(
        violations,
        `Internal links without localePath() in ${relativePath}:\n${violations.join('\n')}`,
      ).toEqual([]);
    });
  }
});

// ─── SECTION 3: Publication titles/summaries use translations ────────────────

describe('Publication rendering uses translations for locale switching', () => {
  const pageFiles = collectFiles(APP_LOCALE_DIR, '.tsx');

  // Find files that reference publication.title or publication.summary
  const pubRenderFiles = pageFiles.filter((f) => {
    const content = fs.readFileSync(f, 'utf8');
    return (
      (content.includes('publication.title') || content.includes('publication.summary')) &&
      // Only check actual rendering files, not generateStaticParams-only files
      content.includes('publication.category')
    );
  });

  it('should have found publication rendering files', () => {
    expect(pubRenderFiles.length).toBeGreaterThan(0);
  });

  for (const filePath of pubRenderFiles) {
    const relativePath = path.relative(ROOT, filePath);

    it(`${relativePath} references publication.translations for locale switching`, () => {
      const content = fs.readFileSync(filePath, 'utf8');
      // The file must reference translations somewhere to support locale switching
      const hasTranslations =
        content.includes('publication.translations') || content.includes('translations');
      expect(
        hasTranslations,
        `${relativePath} renders publication.title/summary but never references .translations`,
      ).toBe(true);
    });
  }
});

// ─── SECTION 4: Dictionary completeness for critical namespaces ──────────────

import { common as ptBrCommon } from './i18n/pt-br/common';
import { common as enCommon } from './i18n/en/common';
import { common as esCommon } from './i18n/es/common';
import { common as itCommon } from './i18n/it/common';
import { common as heCommon } from './i18n/he/common';

const LOCALE_COMMONS = [
  { locale: 'pt-br', common: ptBrCommon },
  { locale: 'en', common: enCommon },
  { locale: 'es', common: esCommon },
  { locale: 'it', common: itCommon },
  { locale: 'he', common: heCommon },
] as const;

describe('Dictionary completeness — articleDetail, mundoPoliticoDetail, error', () => {
  const REQUIRED_NAMESPACES = ['articleDetail', 'mundoPoliticoDetail', 'error'] as const;

  for (const { locale, common } of LOCALE_COMMONS) {
    it(`${locale}/common has all required namespace keys`, () => {
      for (const ns of REQUIRED_NAMESPACES) {
        expect(common, `${locale}/common missing "${ns}"`).toHaveProperty(ns);
        const section = (common as Record<string, unknown>)[ns];
        expect(typeof section, `${locale}/common.${ns} should be an object`).toBe('object');
        expect(section, `${locale}/common.${ns} should not be null`).not.toBeNull();
      }
    });
  }

  // Verify all locales have the same keys within each namespace
  it('all locales have identical keys in articleDetail', () => {
    const ptBrKeys = Object.keys(ptBrCommon.articleDetail).sort();
    for (const { locale, common } of LOCALE_COMMONS.filter((l) => l.locale !== 'pt-br')) {
      const localeKeys = Object.keys(common.articleDetail).sort();
      expect(localeKeys, `${locale} articleDetail keys mismatch`).toEqual(ptBrKeys);
    }
  });

  it('all locales have identical keys in mundoPoliticoDetail', () => {
    const ptBrKeys = Object.keys(ptBrCommon.mundoPoliticoDetail).sort();
    for (const { locale, common } of LOCALE_COMMONS.filter((l) => l.locale !== 'pt-br')) {
      const localeKeys = Object.keys(common.mundoPoliticoDetail).sort();
      expect(localeKeys, `${locale} mundoPoliticoDetail keys mismatch`).toEqual(ptBrKeys);
    }
  });

  it('all locales have identical keys in error', () => {
    const ptBrKeys = Object.keys(ptBrCommon.error).sort();
    for (const { locale, common } of LOCALE_COMMONS.filter((l) => l.locale !== 'pt-br')) {
      const localeKeys = Object.keys(common.error).sort();
      expect(localeKeys, `${locale} error keys mismatch`).toEqual(ptBrKeys);
    }
  });

  // Verify no empty strings
  for (const { locale, common } of LOCALE_COMMONS) {
    it(`${locale} has no empty strings in articleDetail`, () => {
      for (const [key, value] of Object.entries(common.articleDetail)) {
        expect(
          typeof value === 'string' && value.length > 0,
          `${locale}.articleDetail.${key} is empty`,
        ).toBe(true);
      }
    });

    it(`${locale} has no empty strings in mundoPoliticoDetail`, () => {
      for (const [key, value] of Object.entries(common.mundoPoliticoDetail)) {
        expect(
          typeof value === 'string' && value.length > 0,
          `${locale}.mundoPoliticoDetail.${key} is empty`,
        ).toBe(true);
      }
    });

    it(`${locale} has no empty strings in error`, () => {
      for (const [key, value] of Object.entries(common.error)) {
        expect(
          typeof value === 'string' && value.length > 0,
          `${locale}.error.${key} is empty`,
        ).toBe(true);
      }
    });
  }
});

// ─── Helpers ─────────────────────────────────────────────────────────────────

function escapeRegex(str: string): string {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}
