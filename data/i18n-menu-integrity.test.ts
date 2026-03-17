import { describe, it, expect } from 'vitest';
import { common as ptBr } from './i18n/pt-br/common';
import { common as en } from './i18n/en/common';
import { common as es } from './i18n/es/common';
import { common as itLocale } from './i18n/it/common';
import { common as he } from './i18n/he/common';
import { publications, publicationTranslations, blogHeadlineTranslations } from './publications';
import { knowledgeData } from './knowledge';

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

// ─── FASE 2: Publication Translations Completeness (Overlay) ─────────────────────
// Guarantees that every publication has translations in the overlay file.

describe('Publication Translations — overlay completeness', () => {
  const requiredLocales = ['en', 'es', 'it', 'he'] as const;

  it('every publication has an entry in publicationTranslations', () => {
    for (const pub of publications) {
      expect(
        publicationTranslations[pub.id],
        `Publication "${pub.id}" is missing from publicationTranslations overlay`,
      ).toBeDefined();
    }
  });

  for (const locale of requiredLocales) {
    it(`every publication has a non-empty title for ${locale}`, () => {
      for (const pub of publications) {
        const title = publicationTranslations[pub.id]?.[locale];
        expect(
          typeof title === 'string' && title.length > 0,
          `Publication "${pub.id}" is missing title for ${locale}`,
        ).toBe(true);
      }
    });
  }

  for (const locale of requiredLocales) {
    it(`every publication has a non-empty summary_${locale}`, () => {
      for (const pub of publications) {
        const key = `summary_${locale}` as keyof typeof publicationTranslations[string];
        const summary = publicationTranslations[pub.id]?.[key];
        expect(
          typeof summary === 'string' && summary.length > 0,
          `Publication "${pub.id}" is missing summary_${locale}`,
        ).toBe(true);
      }
    });
  }
});

// ─── FASE 3: Blog Headline Translations (Overlay) ────────────────────────────────
// Guarantees that every blog post has localized headlines in the overlay file.

describe('Blog Headline Translations — overlay completeness', () => {
  const posts = knowledgeData.blog.posts;
  const requiredLocales = ['en', 'es', 'it', 'he'] as const;

  it('every blog post has an entry in blogHeadlineTranslations', () => {
    for (const post of posts) {
      expect(
        blogHeadlineTranslations[post.slug],
        `Blog "${post.slug}" is missing from blogHeadlineTranslations overlay`,
      ).toBeDefined();
    }
  });

  for (const locale of requiredLocales) {
    it(`every blog post has a non-empty headline for ${locale}`, () => {
      for (const post of posts) {
        const headline = blogHeadlineTranslations[post.slug]?.[locale];
        expect(
          typeof headline === 'string' && headline.length > 0,
          `Blog "${post.slug}" is missing headline for ${locale}`,
        ).toBe(true);
      }
    });
  }
});
