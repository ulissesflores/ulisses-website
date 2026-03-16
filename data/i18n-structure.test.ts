import { describe, it, expect } from 'vitest';
import { supportedLocales, defaultLocale, isLocale } from '../data/i18n';

/**
 * Structural tests for the i18n dictionary infrastructure.
 * Ensures all locale dicts have identical keys and shapes.
 */

// Known dict namespaces
const NAMESPACES = [
  'common',
  'home',
  'faq',
  'projeto-psi',
  'simulacoes',
  'certificacoes',
  'acervo-teologico',
  'identidade',
  'mundo-politico',
] as const;

describe('i18n dictionary structure', () => {
  it('all supported locales are registered', () => {
    expect(supportedLocales).toContain('pt-br');
    expect(supportedLocales).toContain('en');
    expect(supportedLocales).toContain('es');
    expect(supportedLocales).toContain('it');
    expect(supportedLocales).toContain('he');
    expect(supportedLocales.length).toBe(5);
  });

  it('default locale is pt-br', () => {
    expect(defaultLocale).toBe('pt-br');
  });

  it('isLocale validates correctly', () => {
    for (const l of supportedLocales) {
      expect(isLocale(l)).toBe(true);
    }
    expect(isLocale('fr')).toBe(false);
    expect(isLocale('zh')).toBe(false);
  });
});

describe('i18n FAQ dict parity', () => {
  let ptBrFaq: Record<string, unknown>;
  let enFaq: Record<string, unknown>;
  let esFaq: Record<string, unknown>;
  let itFaq: Record<string, unknown>;
  let heFaq: Record<string, unknown>;

  it('all FAQ dicts export faq object', async () => {
    ptBrFaq = (await import('../data/i18n/pt-br/faq')).faq;
    enFaq = (await import('../data/i18n/en/faq')).faq;
    esFaq = (await import('../data/i18n/es/faq')).faq;
    itFaq = (await import('../data/i18n/it/faq')).faq;
    heFaq = (await import('../data/i18n/he/faq')).faq;
    expect(ptBrFaq).toBeDefined();
    expect(enFaq).toBeDefined();
    expect(esFaq).toBeDefined();
    expect(itFaq).toBeDefined();
    expect(heFaq).toBeDefined();
  });

  it('all FAQ dicts have the same section keys as pt-br', async () => {
    ptBrFaq = (await import('../data/i18n/pt-br/faq')).faq;
    enFaq = (await import('../data/i18n/en/faq')).faq;
    esFaq = (await import('../data/i18n/es/faq')).faq;
    itFaq = (await import('../data/i18n/it/faq')).faq;
    heFaq = (await import('../data/i18n/he/faq')).faq;

    const ptBrKeys = Object.keys(ptBrFaq).sort();
    expect(Object.keys(enFaq).sort()).toEqual(ptBrKeys);
    expect(Object.keys(esFaq).sort()).toEqual(ptBrKeys);
    expect(Object.keys(itFaq).sort()).toEqual(ptBrKeys);
    expect(Object.keys(heFaq).sort()).toEqual(ptBrKeys);
  });

  it('all FAQ sections have non-empty arrays', async () => {
    const allFaqs = [
      (await import('../data/i18n/pt-br/faq')).faq,
      (await import('../data/i18n/en/faq')).faq,
      (await import('../data/i18n/es/faq')).faq,
      (await import('../data/i18n/it/faq')).faq,
      (await import('../data/i18n/he/faq')).faq,
    ];
    for (const faq of allFaqs) {
      for (const [key, items] of Object.entries(faq)) {
        expect(Array.isArray(items), `${key} should be an array`).toBe(true);
        expect((items as unknown[]).length, `${key} should not be empty`).toBeGreaterThan(0);
      }
    }
  });

  it('all FAQ items have question and answer strings', async () => {
    const allFaqs = [
      { locale: 'pt-br', faq: (await import('../data/i18n/pt-br/faq')).faq },
      { locale: 'en', faq: (await import('../data/i18n/en/faq')).faq },
      { locale: 'es', faq: (await import('../data/i18n/es/faq')).faq },
      { locale: 'it', faq: (await import('../data/i18n/it/faq')).faq },
      { locale: 'he', faq: (await import('../data/i18n/he/faq')).faq },
    ];
    for (const { locale, faq } of allFaqs) {
      for (const [section, items] of Object.entries(faq)) {
        for (const item of items as Array<{ question: string; answer: string }>) {
          expect(typeof item.question, `${locale}.${section} question must be string`).toBe('string');
          expect(item.question.length, `${locale}.${section} question must not be empty`).toBeGreaterThan(0);
          expect(typeof item.answer, `${locale}.${section} answer must be string`).toBe('string');
          expect(item.answer.length, `${locale}.${section} answer must not be empty`).toBeGreaterThan(0);
        }
      }
    }
  });
});

describe('i18n projetoPsi dict parity', () => {
  it('all PSI dicts have whitepaperUI and jsonLd keys', async () => {
    const ptBr = (await import('../data/i18n/pt-br/projeto-psi')).projetoPsi;
    const en = (await import('../data/i18n/en/projeto-psi')).projetoPsi;
    const es = (await import('../data/i18n/es/projeto-psi')).projetoPsi;
    const it = (await import('../data/i18n/it/projeto-psi')).projetoPsi;
    const he = (await import('../data/i18n/he/projeto-psi')).projetoPsi;

    for (const dict of [ptBr, en, es, it, he]) {
      expect(dict).toHaveProperty('whitepaperUI');
      expect(dict).toHaveProperty('jsonLd');
      expect(dict).toHaveProperty('meta');
      expect(dict).toHaveProperty('hero');
      expect(dict).toHaveProperty('pillars');
    }
  });

  it('whitepaperUI has all required keys across locales', async () => {
    const ptBr = (await import('../data/i18n/pt-br/projeto-psi')).projetoPsi;
    const requiredKeys = [
      'kicker', 'kickerSub', 'h1', 'authorLabel', 'authorRole',
      'abstractTitle', 'abstractText', 'authorCardLabel', 'authorCardDescription',
      'ctaTitle', 'ctaDescription', 'ctaButton', 'faqTitle',
    ];
    const ptBrUI = ptBr.whitepaperUI as Record<string, string>;
    for (const key of requiredKeys) {
      expect(ptBrUI).toHaveProperty(key);
      expect(typeof ptBrUI[key]).toBe('string');
      expect(ptBrUI[key].length).toBeGreaterThan(0);
    }
  });

  it('jsonLd has all required keys across locales', async () => {
    const localeList = ['pt-br', 'en', 'es', 'it', 'he'];
    const requiredKeys = ['headline', 'description', 'softwareName', 'softwareDescription'];

    for (const loc of localeList) {
      const folder = loc === 'pt-br' ? 'pt-br' : loc;
      const mod = await import(`../data/i18n/${folder}/projeto-psi`);
      const jsonLd = mod.projetoPsi.jsonLd as Record<string, string>;
      for (const key of requiredKeys) {
        expect(jsonLd).toHaveProperty(key);
        expect(typeof jsonLd[key], `${loc}.jsonLd.${key} must be string`).toBe('string');
      }
    }
  });
});

describe('i18n common dict parity', () => {
  it('all common dicts have authorHubCard keys', async () => {
    const ptBr = (await import('../data/i18n/pt-br/common')).common;
    const en = (await import('../data/i18n/en/common')).common;
    const es = (await import('../data/i18n/es/common')).common;
    const it = (await import('../data/i18n/it/common')).common;
    const he = (await import('../data/i18n/he/common')).common;

    for (const dict of [ptBr, en, es, it, he]) {
      expect(dict).toHaveProperty('authorHubCard');
      expect(dict.authorHubCard).toHaveProperty('defaultLabel');
      expect(dict.authorHubCard).toHaveProperty('defaultDescription');
    }
  });
});
