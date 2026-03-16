import { describe, it, expect, beforeAll } from 'vitest';
import { readFileSync, existsSync } from 'fs';
import { resolve } from 'path';

/**
 * Anti-False-Positive tests for PSI mirrored components.
 * Verifies that each locale variant contains REAL translations,
 * not Portuguese copies. Uses word-frequency sampling.
 */

const ROOT = resolve(__dirname, '../..');
const CONTENT_DIR = resolve(ROOT, 'components/content');

// ── Portuguese-exclusive words that should NEVER appear in foreign variants ──
// Strictly words that exist ONLY in PT (not in ES, IT, EN, or HE)
const PT_EXCLUSIVE_WORDS = [
  'através',      // PT "through" (ES: a través, IT: attraverso, EN: through)
  'também',       // PT "also" (ES: también, IT: anche, EN: also)
  'ônus',         // PT "burden" (ES: carga, IT: onere, EN: burden)
  'transferiu',   // PT "transferred" (ES: transfirió, IT: trasferì)
  'segurança',    // PT "security" (ES: seguridad, IT: sicurezza)
  'proteção',     // PT "protection" (ES: protección, IT: protezione)
  'confiança',    // PT "trust" (ES: confianza, IT: fiducia)
  'dependia',     // PT "depended" (ES: dependía, IT: dipendeva)
  'econômica',    // PT-specific accent (ES: económica, IT: economica)
];

// Subset for ES locale (PT-exclusive even compared to Spanish)
const PT_ONLY_NO_COGNATES = [
  'através',
  'também',
  'ônus',
  'transferiu',
  'segurança',
  'proteção',
  'dependia',
  'econômica',
];

const LOCALES_TO_TEST = ['en', 'es', 'it', 'he'];

describe('PsiWhitepaperBody mirrored components — anti-false-positive', () => {
  it('all 5 locale variants exist', () => {
    expect(existsSync(resolve(CONTENT_DIR, 'PsiWhitepaperBody.tsx'))).toBe(true);
    for (const locale of LOCALES_TO_TEST) {
      expect(
        existsSync(resolve(CONTENT_DIR, `PsiWhitepaperBody.${locale}.tsx`)),
        `PsiWhitepaperBody.${locale}.tsx must exist`,
      ).toBe(true);
    }
  });

  it('PsiWhitepaperBodyLocalized loader exists', () => {
    expect(existsSync(resolve(CONTENT_DIR, 'PsiWhitepaperBodyLocalized.tsx'))).toBe(true);
  });

  for (const locale of LOCALES_TO_TEST) {
    describe(`PsiWhitepaperBody.${locale}.tsx`, () => {
      let content: string;

      beforeAll(() => {
        content = readFileSync(
          resolve(CONTENT_DIR, `PsiWhitepaperBody.${locale}.tsx`),
          'utf-8',
        );
      });

      it('has substantial content (not an empty stub)', () => {
        expect(content.length).toBeGreaterThan(10000);
      });

      it('exports PsiWhitepaperBody function', () => {
        expect(
          content.includes('export function PsiWhitepaperBody') ||
          content.includes('export default function PsiWhitepaperBody'),
        ).toBe(true);
      });

      it('contains section headings (h2 tags)', () => {
        const h2Count = (content.match(/<h2[^>]*>/g) || []).length;
        expect(h2Count).toBeGreaterThanOrEqual(5);
      });

      it('does NOT contain Portuguese-exclusive words', () => {
        const words = locale === 'es' ? PT_ONLY_NO_COGNATES : PT_EXCLUSIVE_WORDS;
        const found: string[] = [];

        for (const word of words) {
          // Case-insensitive check, but only inside JSX text (not className/ids/comments)
          const regex = new RegExp(`>([^<]*\\b${word}\\b[^<]*)<`, 'gi');
          if (regex.test(content)) {
            found.push(word);
          }
        }

        expect(
          found,
          `${locale}.tsx contains PT-exclusive words: ${found.join(', ')}`,
        ).toEqual([]);
      });

      it('has h2 headings in the correct language (not Portuguese)', () => {
        const h2s = content.match(/<h2[^>]*>(.*?)<\/h2>/g) || [];
        // Only check for headings that are uniquely Portuguese
        // (not cognates shared with ES/IT like "Heurísticas")
        const ptOnlyHeadings = [
          'Introdução:',
          'Arquitetura Física (O Receptáculo)',
          'O Núcleo Criptográfico',
          'O Colapso da Confiança',
        ];

        for (const h2 of h2s) {
          for (const ptH of ptOnlyHeadings) {
            expect(h2, `h2 should not contain PT: "${ptH}"`).not.toContain(ptH);
          }
        }
      });
    });
  }
});

describe('PSI pages use localized component (no inline PT)', () => {
  const pages = [
    'app/[locale]/whitepapers/projeto-psi/page.tsx',
    'app/[locale]/simulacoes/projeto-psi/page.tsx',
  ];

  for (const pagePath of pages) {
    it(`${pagePath} uses PsiWhitepaperBodyLocalized`, () => {
      const full = resolve(ROOT, pagePath);
      if (!existsSync(full)) return; // Skip if page doesn't exist
      const content = readFileSync(full, 'utf-8');
      expect(content).toContain('PsiWhitepaperBodyLocalized');
    });

    it(`${pagePath} has no hardcoded Portuguese prose`, () => {
      const full = resolve(ROOT, pagePath);
      if (!existsSync(full)) return;
      const content = readFileSync(full, 'utf-8');
      const ptSentences = [
        'A transição da economia global',
        'criptografia assimétrica transferiu',
        'Introdução: O Colapso da Confiança',
      ];
      for (const sentence of ptSentences) {
        expect(content).not.toContain(sentence);
      }
    });
  }
});
