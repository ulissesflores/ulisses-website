import { describe, it, expect } from 'vitest';
import { localePath } from './locale-path';

describe('localePath', () => {
  // ── Default locale (pt-br) ──

  it('returns bare path for default locale', () => {
    expect(localePath('/simulacoes', 'pt-br')).toBe('/simulacoes');
  });

  it('returns root / for default locale', () => {
    expect(localePath('/', 'pt-br')).toBe('/');
  });

  it('passes through hash anchors for default locale', () => {
    expect(localePath('/#contact', 'pt-br')).toBe('/#contact');
  });

  it('preserves deep paths for default locale', () => {
    expect(localePath('/whitepapers/projeto-psi', 'pt-br')).toBe('/whitepapers/projeto-psi');
  });

  // ── Non-default locales ──

  it('prefixes path with locale for en', () => {
    expect(localePath('/simulacoes', 'en')).toBe('/en/simulacoes');
  });

  it('prefixes path with locale for es', () => {
    expect(localePath('/identidade', 'es')).toBe('/es/identidade');
  });

  it('prefixes path with locale for it', () => {
    expect(localePath('/certificacoes', 'it')).toBe('/it/certificacoes');
  });

  it('prefixes path with locale for he', () => {
    expect(localePath('/acervo-teologico', 'he')).toBe('/he/acervo-teologico');
  });

  // ── Root path for non-default ──

  it('handles root / for non-default locale', () => {
    expect(localePath('/', 'en')).toBe('/en/');
  });

  // ── Hash anchors for non-default ──

  it('prefixes hash anchors for non-default locale', () => {
    expect(localePath('/#contact', 'he')).toBe('/he/#contact');
  });

  it('prefixes deep hash anchors for non-default locale', () => {
    expect(localePath('/#pillars', 'es')).toBe('/es/#pillars');
  });

  // ── External/relative URLs ──

  it('returns external URLs unchanged', () => {
    expect(localePath('https://example.com', 'en')).toBe('https://example.com');
  });

  it('returns relative URLs unchanged', () => {
    expect(localePath('about', 'en')).toBe('about');
  });

  // ── Deep nested paths ──

  it('prefixes deep nested paths for non-default locale', () => {
    expect(localePath('/simulacoes/ia-2027/corrida-estrategica', 'en'))
      .toBe('/en/simulacoes/ia-2027/corrida-estrategica');
  });
});
