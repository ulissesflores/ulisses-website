import { describe, it, expect } from 'vitest';
import { buildLanguageAlternates, buildCanonical } from './seo';

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

describe('buildCanonical (self-referencing canonical URLs)', () => {
  it('pt-br returns bare path (no locale prefix)', () => {
    expect(buildCanonical('pt-br', '/simulacoes')).toBe('/simulacoes');
    expect(buildCanonical('pt-br', '/research')).toBe('/research');
    expect(buildCanonical('pt-br', '/')).toBe('/');
  });

  it('foreign locales prepend /{locale} prefix', () => {
    expect(buildCanonical('en', '/simulacoes')).toBe('/en/simulacoes');
    expect(buildCanonical('es', '/research')).toBe('/es/research');
    expect(buildCanonical('it', '/certifications')).toBe('/it/certifications');
    expect(buildCanonical('he', '/identidade')).toBe('/he/identidade');
  });

  it('root path returns /{locale} for foreign locales', () => {
    expect(buildCanonical('en', '/')).toBe('/en');
    expect(buildCanonical('es', '/')).toBe('/es');
    expect(buildCanonical('he', '/')).toBe('/he');
  });

  it('handles nested paths correctly', () => {
    expect(buildCanonical('en', '/whitepapers/projeto-psi')).toBe('/en/whitepapers/projeto-psi');
    expect(buildCanonical('es', '/simulacoes/ia-2027/corrida-estrategica')).toBe('/es/simulacoes/ia-2027/corrida-estrategica');
    expect(buildCanonical('pt-br', '/whitepapers/projeto-psi')).toBe('/whitepapers/projeto-psi');
  });

  it('normalizes paths without leading slash', () => {
    expect(buildCanonical('en', 'research')).toBe('/en/research');
    expect(buildCanonical('pt-br', 'research')).toBe('/research');
  });
});

