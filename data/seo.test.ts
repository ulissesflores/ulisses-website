import { describe, it, expect } from 'vitest';
import { buildLanguageAlternates } from './seo';

describe('buildLanguageAlternates', () => {
  it('returns alternates for all 5 locales', () => {
    const result = buildLanguageAlternates('/research');
    expect(Object.keys(result)).toHaveLength(5);
    expect(result).toHaveProperty('pt-BR');
    expect(result).toHaveProperty('en');
    expect(result).toHaveProperty('es');
    expect(result).toHaveProperty('it');
    expect(result).toHaveProperty('he');
  });

  it('generates correct URLs for a regular path', () => {
    const result = buildLanguageAlternates('/research');
    expect(result['pt-BR']).toMatch(/\/pt-br\/research$/);
    expect(result['en']).toMatch(/\/en\/research$/);
    expect(result['es']).toMatch(/\/es\/research$/);
  });

  it('generates correct URLs for root path', () => {
    const result = buildLanguageAlternates('/');
    expect(result['pt-BR']).toMatch(/\/pt-br$/);
    expect(result['en']).toMatch(/\/en$/);
  });

  it('all URLs start with the primary website', () => {
    const result = buildLanguageAlternates('/identidade');
    for (const url of Object.values(result)) {
      expect(url).toMatch(/^https:\/\//);
    }
  });
});
