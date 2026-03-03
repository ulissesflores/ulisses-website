import { describe, it, expect } from 'vitest';
import { isLocale, normalizeLocale, normalizePath, localizePath } from './i18n';

describe('isLocale', () => {
  it('returns true for supported locales', () => {
    expect(isLocale('pt-br')).toBe(true);
    expect(isLocale('en')).toBe(true);
    expect(isLocale('es')).toBe(true);
    expect(isLocale('it')).toBe(true);
    expect(isLocale('he')).toBe(true);
  });

  it('returns false for unsupported locales', () => {
    expect(isLocale('fr')).toBe(false);
    expect(isLocale('de')).toBe(false);
  });

  it('returns false for empty string', () => {
    expect(isLocale('')).toBe(false);
  });

  it('is case-sensitive', () => {
    expect(isLocale('PT-BR')).toBe(false);
    expect(isLocale('En')).toBe(false);
  });
});

describe('normalizeLocale', () => {
  it('returns the locale if valid', () => {
    expect(normalizeLocale('en')).toBe('en');
    expect(normalizeLocale('pt-br')).toBe('pt-br');
  });

  it('trims and lowercases', () => {
    expect(normalizeLocale(' PT-BR ')).toBe('pt-br');
    expect(normalizeLocale('EN')).toBe('en');
  });

  it('returns default locale for null/undefined', () => {
    expect(normalizeLocale(null)).toBe('pt-br');
    expect(normalizeLocale(undefined)).toBe('pt-br');
  });

  it('returns default locale for empty string', () => {
    expect(normalizeLocale('')).toBe('pt-br');
  });

  it('returns default locale for unsupported values', () => {
    expect(normalizeLocale('fr')).toBe('pt-br');
  });
});

describe('normalizePath', () => {
  it('returns / for empty string', () => {
    expect(normalizePath('')).toBe('/');
  });

  it('returns / for /', () => {
    expect(normalizePath('/')).toBe('/');
  });

  it('adds leading slash if missing', () => {
    expect(normalizePath('foo')).toBe('/foo');
  });

  it('keeps existing leading slash', () => {
    expect(normalizePath('/foo')).toBe('/foo');
  });
});

describe('localizePath', () => {
  it('returns path as-is for default locale (pt-br)', () => {
    expect(localizePath('/identidade', 'pt-br')).toBe('/identidade');
  });

  it('prefixes path with locale for non-default', () => {
    expect(localizePath('/identidade', 'en')).toBe('/en/identidade');
  });

  it('handles root path for non-default locale', () => {
    expect(localizePath('/', 'en')).toBe('/en');
  });

  it('handles root path for default locale', () => {
    expect(localizePath('/', 'pt-br')).toBe('/');
  });

  it('normalizes paths without leading slash', () => {
    expect(localizePath('research', 'es')).toBe('/es/research');
  });
});
