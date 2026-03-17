import { describe, it, expect } from 'vitest';
import { common as ptBr } from './i18n/pt-br/common';
import { common as en } from './i18n/en/common';
import { common as es } from './i18n/es/common';
import { common as itLocale } from './i18n/it/common';
import { common as he } from './i18n/he/common';
import { publications } from './publications';
import { knowledgeData } from './knowledge';

// ─── FASE 1: Menu Integrity Test ────────────────────────────────────────────────
// Garante que hrefs de navegação NUNCA sejam embaralhados por tradução IA.

describe('Menu Integrity — nav.categories href parity', () => {
  const locales = { en, es, it: itLocale, he };
  const ptBrCategories = ptBr.nav.categories;

  it('todos os locales têm o mesmo número de categorias de nav', () => {
    for (const [name, locale] of Object.entries(locales)) {
      expect(locale.nav.categories.length, `${name} categories count`).toBe(ptBrCategories.length);
    }
  });

  it('todos os locales têm o mesmo número de items por categoria', () => {
    for (const [name, locale] of Object.entries(locales)) {
      for (let c = 0; c < ptBrCategories.length; c++) {
        expect(
          locale.nav.categories[c].items.length,
          `${name} category[${c}] items count`,
        ).toBe(ptBrCategories[c].items.length);
      }
    }
  });

  it('todos os locales têm valores href IDÊNTICOS em cada posição', () => {
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

  it('nenhum nav href contém âncora (#) sem barra inicial', () => {
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

// ─── FASE 2: Traduções Nativas de Publicações (Gerador) ─────────────────────────
// Valida que o gerador injetou todas as traduções diretamente nos objetos Publication.

describe('Traduções nativas de publicações — completude', () => {
  const requiredLocales = ['en', 'es', 'it', 'he'] as const;

  it('toda publicação tem translations definido', () => {
    for (const pub of publications) {
      expect(
        pub.translations,
        `Publicação "${pub.id}" não tem translations`,
      ).toBeDefined();
    }
  });

  for (const locale of requiredLocales) {
    it(`toda publicação tem título traduzido para ${locale}`, () => {
      for (const pub of publications) {
        const title = pub.translations?.[locale];
        expect(
          typeof title === 'string' && title.length > 0,
          `Publicação "${pub.id}" sem título ${locale}`,
        ).toBe(true);
      }
    });
  }

  for (const locale of requiredLocales) {
    it(`toda publicação tem summary_${locale}`, () => {
      for (const pub of publications) {
        const key = `summary_${locale}` as keyof NonNullable<typeof pub.translations>;
        const summary = pub.translations?.[key];
        expect(
          typeof summary === 'string' && summary.length > 0,
          `Publicação "${pub.id}" sem summary_${locale}`,
        ).toBe(true);
      }
    });
  }
});

// ─── FASE 3: Traduções Nativas do Blog (Gerador) ────────────────────────────────
// Valida que o gerador injetou headlines traduzidas diretamente nos objetos blog.

describe('Traduções nativas do blog — completude', () => {
  const posts = knowledgeData.blog.posts;
  const requiredLocales = ['en', 'es', 'it', 'he'] as const;

  for (const locale of requiredLocales) {
    it(`todo post tem headline_${locale} não-vazio`, () => {
      for (const post of posts) {
        const headline = (post as Record<string, unknown>)[`headline_${locale}`];
        expect(
          typeof headline === 'string' && headline.length > 0,
          `Post "${post.slug}" sem headline_${locale}`,
        ).toBe(true);
      }
    });
  }

  for (const locale of requiredLocales) {
    it(`todo post tem summary_${locale} não-vazio`, () => {
      for (const post of posts) {
        const summary = (post as Record<string, unknown>)[`summary_${locale}`];
        expect(
          typeof summary === 'string' && summary.length > 0,
          `Post "${post.slug}" sem summary_${locale}`,
        ).toBe(true);
      }
    });
  }
});
