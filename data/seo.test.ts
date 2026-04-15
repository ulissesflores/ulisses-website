import { describe, it, expect } from 'vitest';
import { buildLanguageAlternates, buildCanonical } from './seo';

describe('buildLanguageAlternates', () => {
  it('returns alternates for all 5 locales + x-default', () => {
    const result = buildLanguageAlternates('/research');
    expect(Object.keys(result)).toHaveLength(6);
    expect(result).toHaveProperty('pt-BR');
    expect(result).toHaveProperty('en');
    expect(result).toHaveProperty('es');
    expect(result).toHaveProperty('it');
    expect(result).toHaveProperty('he');
    expect(result).toHaveProperty('x-default');
  });

  it('pt-BR uses bare canonical URL (no /pt-br/ prefix) — matches buildCanonical default locale behavior', () => {
    const result = buildLanguageAlternates('/research');
    expect(result['pt-BR']).toBe('https://ulissesflores.com/research');
    expect(result['pt-BR']).not.toMatch(/\/pt-br\//);
  });

  it('x-default points to bare canonical, identical to pt-BR', () => {
    const result = buildLanguageAlternates('/whitepapers/projeto-psi');
    expect(result['x-default']).toBe('https://ulissesflores.com/whitepapers/projeto-psi');
    expect(result['x-default']).toBe(result['pt-BR']);
  });

  it('foreign locales keep /{locale}/ prefix for self-referencing canonical', () => {
    const result = buildLanguageAlternates('/research');
    expect(result['en']).toMatch(/\/en\/research$/);
    expect(result['es']).toMatch(/\/es\/research$/);
    expect(result['it']).toMatch(/\/it\/research$/);
    expect(result['he']).toMatch(/\/he\/research$/);
  });

  it('root path: pt-BR and x-default emit origin + "/" (no locale segment)', () => {
    const result = buildLanguageAlternates('/');
    expect(result['pt-BR']).toBe('https://ulissesflores.com/');
    expect(result['x-default']).toBe('https://ulissesflores.com/');
    expect(result['en']).toMatch(/\/en$/);
    expect(result['es']).toMatch(/\/es$/);
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

