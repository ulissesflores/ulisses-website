import { describe, it, expect } from 'vitest';
import { common as ptBr } from './i18n/pt-br/common';
import { common as en } from './i18n/en/common';
import { common as es } from './i18n/es/common';
import { common as itLocale } from './i18n/it/common';
import { common as he } from './i18n/he/common';
import { publications } from './publications';

// ─── FASE 1: Menu Integrity Test ────────────────────────────────────────────────
// Guarantees that nav hrefs are NEVER scrambled by AI translation.
// If Gemini hallucinate a href during translation, this test breaks the build.

describe('Menu Integrity — nav.categories href parity', () => {
  const locales = { en, es, it: itLocale, he };
  const ptBrCategories = ptBr.nav.categories;

  it('all locales have the same number of nav categories', () => {
    for (const [name, locale] of Object.entries(locales)) {
      expect(locale.nav.categories.length, `${name} categories count`).toBe(ptBrCategories.length);
    }
  });

  it('all locales have the same number of items per category', () => {
    for (const [name, locale] of Object.entries(locales)) {
      for (let c = 0; c < ptBrCategories.length; c++) {
        expect(
          locale.nav.categories[c].items.length,
          `${name} category[${c}] items count`,
        ).toBe(ptBrCategories[c].items.length);
      }
    }
  });

  it('all locales have IDENTICAL href values at every position', () => {
    for (const [name, locale] of Object.entries(locales)) {
      for (let c = 0; c < ptBrCategories.length; c++) {
        for (let i = 0; i < ptBrCategories[c].items.length; i++) {
          const expected = ptBrCategories[c].items[i].href;
          const actual = locale.nav.categories[c].items[i].href;
          expect(actual, `${name} categories[${c}].items[${i}].href`).toBe(expected);
        }
      }
    }
  });

  it('no nav href contains a bare anchor (#) without leading slash', () => {
    for (const [name, locale] of Object.entries(locales)) {
      for (const cat of locale.nav.categories) {
        for (const item of cat.items) {
          expect(
            item.href.startsWith('/') || item.href.startsWith('#'),
            `${name}: "${item.label}" has invalid href "${item.href}"`,
          ).toBe(true);
        }
      }
    }
  });
});

// ─── FASE 2: Publication Translations Completeness ──────────────────────────────
// Guarantees that every publication has translations for ALL supported locales.
// Tolerância zero para fallbacks: se it/he estiver faltando, o build quebra.

describe('Publication Translations — zero fallback tolerance', () => {
  const requiredLocales = ['en', 'es', 'it', 'he'] as const;

  it('every publication has a translations object', () => {
    for (const pub of publications) {
      expect(
        pub.translations,
        `Publication "${pub.id}" is missing translations object`,
      ).toBeDefined();
    }
  });

  for (const locale of requiredLocales) {
    it(`every publication has a non-empty translations.${locale}`, () => {
      for (const pub of publications) {
        const title = pub.translations?.[locale as keyof NonNullable<typeof pub.translations>];
        expect(
          typeof title === 'string' && title.length > 0,
          `Publication "${pub.id}" is missing translations.${locale}`,
        ).toBe(true);
      }
    });
  }
});
